export interface Quote {
  text: string;
  source: string;
}

export interface Challenge {
  id: number;
  title: string;
  description: string;
  points: number;
  category: string;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  requirement: number;
  type: 'streak' | 'challenges' | 'emergency' | 'prayer' | 'reflection';
}

export interface EducationalContent {
  id: number;
  title: string;
  summary: string;
  content: string;
}

export interface RelapseTrigger {
  id: string;
  name: string;
  count: number;
}

export interface RelapseEntry {
  id: string;
  date: string;
  time: string;
  trigger: string;
  notes: string;
}

export interface DailyReflection {
  id: string;
  date: string;
  mood: 'great' | 'good' | 'neutral' | 'difficult' | 'struggling';
  triggers: string[];
  notes: string;
}

export interface PrayerRecord {
  date: string;
  fajr: boolean;
  dhuhr: boolean;
  asr: boolean;
  maghrib: boolean;
  isha: boolean;
}

export interface CompletedChallenge {
  id: number;
  date: string;
}

export interface EmergencyToolUse {
  date: string;
  successful: boolean;
}

export interface RewardNotification {
  level: number;
  title: string;
  points: number;
}

export interface UserStats {
  streakStart: string | null;
  currentStreak: number;
  longestStreak: number;
  totalChallengesCompleted: number;
  totalPoints: number;
  emergencyToolUses: EmergencyToolUse[];
  completedChallenges: CompletedChallenge[];
  achievements: string[];
  prayerRecords: PrayerRecord[];
  dailyReflections: DailyReflection[];
  relapseTriggers: RelapseTrigger[];
  relapseHistory: RelapseEntry[];
}

export interface AppSettings {
  notifications: boolean;
  prayerReminders: boolean;
  dailyChallengeReminders: boolean;
  emergencyContactName: string;
  emergencyContactNumber: string;
  themeMode: 'light' | 'dark' | 'system';
  anonymousUsername: string;
}