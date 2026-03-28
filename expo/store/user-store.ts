import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { UserStats, AppSettings, DailyReflection, PrayerRecord, CompletedChallenge, EmergencyToolUse, RelapseTrigger, RewardNotification, RelapseEntry } from '@/types';

interface UserInfo {
  addictionType?: string;
  struggleDuration?: string;
}

interface UserState {
  stats: UserStats;
  settings: AppSettings;
  isOnboarded: boolean;
  lastActive: string | null;
  userName: string;
  userInfo: UserInfo;
  rewardNotification: RewardNotification | null;
  
  // Actions
  incrementStreak: () => void;
  resetStreak: (reason?: string, notes?: string) => void;
  completeChallenge: (challengeId: number) => void;
  recordPrayer: (prayer: Partial<PrayerRecord>) => void;
  addReflection: (reflection: DailyReflection) => void;
  useEmergencyTool: (successful: boolean) => void;
  addTrigger: (triggerName: string) => void;
  updateSettings: (settings: Partial<AppSettings>) => void;
  unlockAchievement: (achievementId: string) => void;
  setOnboarded: (value: boolean) => void;
  checkDailyLogin: () => void;
  setUserName: (name: string) => void;
  updateUserInfo: (info: Partial<UserInfo>) => void;
  clearRewardNotification: () => void;
  checkLevelUp: (oldPoints: number, newPoints: number) => void;
}

const initialStats: UserStats = {
  streakStart: null,
  currentStreak: 0,
  longestStreak: 0,
  totalChallengesCompleted: 0,
  totalPoints: 0,
  emergencyToolUses: [],
  completedChallenges: [],
  achievements: [],
  prayerRecords: [],
  dailyReflections: [],
  relapseTriggers: [],
  relapseHistory: []
};

const initialSettings: AppSettings = {
  notifications: true,
  prayerReminders: true,
  dailyChallengeReminders: true,
  emergencyContactName: '',
  emergencyContactNumber: '',
  themeMode: 'system',
  anonymousUsername: 'Anonymous'
};

// Level thresholds and titles
const levelThresholds = [
  { points: 0, level: 1, title: "New Journeyer" },
  { points: 100, level: 2, title: "Hopeful Heart" },
  { points: 250, level: 3, title: "Determined Spirit" },
  { points: 500, level: 4, title: "Focused Mind" },
  { points: 1000, level: 5, title: "Disciplined Soul" },
  { points: 2000, level: 6, title: "Devoted Seeker" },
  { points: 3000, level: 7, title: "Steadfast Warrior" },
  { points: 5000, level: 8, title: "Guardian of Purity" },
  { points: 7500, level: 9, title: "Spiritual Sage" },
  { points: 10000, level: 10, title: "Enlightened Master" },
];

const getCurrentLevel = (points: number) => {
  for (let i = levelThresholds.length - 1; i >= 0; i--) {
    if (points >= levelThresholds[i].points) {
      return levelThresholds[i];
    }
  }
  return levelThresholds[0];
};

export const useUserStore = create<UserState>()(
  persist(
    (set, get) => ({
      stats: initialStats,
      settings: initialSettings,
      isOnboarded: false,
      lastActive: null,
      userName: 'User',
      userInfo: {},
      rewardNotification: null,
      
      incrementStreak: () => {
        const { stats } = get();
        const today = new Date().toISOString().split('T')[0];
        
        set((state) => ({
          stats: {
            ...state.stats,
            streakStart: state.stats.streakStart || today,
            currentStreak: state.stats.currentStreak + 1,
            longestStreak: Math.max(state.stats.longestStreak, state.stats.currentStreak + 1)
          }
        }));
      },
      
      resetStreak: (reason, notes = '') => {
        const today = new Date().toISOString().split('T')[0];
        const now = new Date();
        const time = now.toLocaleTimeString('en-US', { 
          hour: '2-digit', 
          minute: '2-digit',
          hour12: true 
        });
        
        set((state) => {
          // Ensure relapseHistory is always an array
          const currentRelapseHistory = Array.isArray(state.stats.relapseHistory) 
            ? state.stats.relapseHistory 
            : [];
          
          // Ensure relapseTriggers is always an array
          const currentRelapseTriggers = Array.isArray(state.stats.relapseTriggers)
            ? state.stats.relapseTriggers
            : [];
          
          const updatedTriggers = reason 
            ? currentRelapseTriggers.map(trigger => 
                trigger.name === reason 
                  ? { ...trigger, count: trigger.count + 1 }
                  : trigger
              )
            : currentRelapseTriggers;
          
          // Add new trigger if it doesn't exist
          if (reason && !currentRelapseTriggers.some(t => t.name === reason)) {
            updatedTriggers.push({ id: Date.now().toString(), name: reason, count: 1 });
          }
          
          // Add to relapse history
          const newRelapseEntry: RelapseEntry = {
            id: Date.now().toString(),
            date: today,
            time: time,
            trigger: reason || 'No reason specified',
            notes: notes
          };
          
          return {
            stats: {
              ...state.stats,
              streakStart: today,
              currentStreak: 0,
              relapseTriggers: updatedTriggers,
              relapseHistory: [newRelapseEntry, ...currentRelapseHistory]
            }
          };
        });
      },
      
      completeChallenge: (challengeId) => {
        const today = new Date().toISOString().split('T')[0];
        const oldPoints = get().stats.totalPoints;
        const pointsToAdd = 50; // Points can be dynamic based on challenge
        const newPoints = oldPoints + pointsToAdd;
        
        set((state) => ({
          stats: {
            ...state.stats,
            totalChallengesCompleted: state.stats.totalChallengesCompleted + 1,
            totalPoints: newPoints,
            completedChallenges: [
              ...state.stats.completedChallenges,
              { id: challengeId, date: today }
            ]
          }
        }));
        
        // Check for level up
        get().checkLevelUp(oldPoints, newPoints);
      },
      
      recordPrayer: (prayer) => {
        const today = new Date().toISOString().split('T')[0];
        const existingRecord = get().stats.prayerRecords.find(r => r.date === today);
        
        set((state) => ({
          stats: {
            ...state.stats,
            prayerRecords: existingRecord
              ? state.stats.prayerRecords.map(record => 
                  record.date === today 
                    ? { ...record, ...prayer }
                    : record
                )
              : [...state.stats.prayerRecords, { date: today, fajr: false, dhuhr: false, asr: false, maghrib: false, isha: false, ...prayer }]
          }
        }));
      },
      
      addReflection: (reflection) => {
        set((state) => ({
          stats: {
            ...state.stats,
            dailyReflections: [
              ...state.stats.dailyReflections,
              reflection
            ]
          }
        }));
      },
      
      useEmergencyTool: (successful) => {
        const today = new Date().toISOString().split('T')[0];
        
        set((state) => ({
          stats: {
            ...state.stats,
            emergencyToolUses: [
              ...state.stats.emergencyToolUses,
              { date: today, successful }
            ]
          }
        }));
      },
      
      addTrigger: (triggerName) => {
        const existingTrigger = get().stats.relapseTriggers.find(t => t.name === triggerName);
        
        set((state) => ({
          stats: {
            ...state.stats,
            relapseTriggers: existingTrigger
              ? state.stats.relapseTriggers.map(trigger => 
                  trigger.name === triggerName 
                    ? { ...trigger, count: trigger.count + 1 }
                    : trigger
                )
              : [
                  ...state.stats.relapseTriggers,
                  { id: Date.now().toString(), name: triggerName, count: 1 }
                ]
          }
        }));
      },
      
      updateSettings: (newSettings) => {
        set((state) => ({
          settings: {
            ...state.settings,
            ...newSettings
          }
        }));
      },
      
      unlockAchievement: (achievementId) => {
        const hasAchievement = get().stats.achievements.includes(achievementId);
        
        if (!hasAchievement) {
          const oldPoints = get().stats.totalPoints;
          const newPoints = oldPoints + 100; // Points for achievement
          
          set((state) => ({
            stats: {
              ...state.stats,
              achievements: [...state.stats.achievements, achievementId],
              totalPoints: newPoints
            }
          }));
          
          // Check for level up
          get().checkLevelUp(oldPoints, newPoints);
        }
      },
      
      setOnboarded: (value) => {
        set({ isOnboarded: value });
      },
      
      checkDailyLogin: () => {
        const today = new Date().toISOString().split('T')[0];
        const lastActive = get().lastActive;
        
        // If first time or different day
        if (!lastActive || lastActive !== today) {
          // Increment streak if logging in on consecutive day
          if (lastActive) {
            const lastDate = new Date(lastActive);
            const currentDate = new Date(today);
            
            // Check if last active was yesterday
            const timeDiff = currentDate.getTime() - lastDate.getTime();
            const dayDiff = Math.floor(timeDiff / (1000 * 3600 * 24));
            
            if (dayDiff === 1) {
              get().incrementStreak();
            } else if (dayDiff > 1) {
              // Reset streak if more than a day has passed
              get().resetStreak();
            }
          }
        }
        
        set({ lastActive: today });
      },
      
      setUserName: (name) => {
        set({ userName: name });
      },
      
      updateUserInfo: (info) => {
        set((state) => ({
          userInfo: {
            ...state.userInfo,
            ...info
          }
        }));
      },
      
      clearRewardNotification: () => {
        set({ rewardNotification: null });
      },
      
      checkLevelUp: (oldPoints, newPoints) => {
        const oldLevel = getCurrentLevel(oldPoints);
        const newLevel = getCurrentLevel(newPoints);
        
        if (newLevel.level > oldLevel.level) {
          // Level up! Show notification
          set({
            rewardNotification: {
              level: newLevel.level,
              title: newLevel.title,
              points: newPoints - oldPoints,
            }
          });
        }
      },
    }),
    {
      name: 'esc-user-storage',
      storage: createJSONStorage(() => AsyncStorage)
    }
  )
);