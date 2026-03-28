import React, { useState, useRef, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity, 
  Animated, 
  Dimensions,
  Platform,
  Image
} from 'react-native';
import { Trophy, Award, Star, Crown, Shield, Medal, Gift, ChevronRight, ChevronLeft, Sparkles, CalendarClock } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Colors from '@/constants/colors';
import { useUserStore } from '@/store/user-store';
import { achievements } from '@/constants/quotes';
import { typography, spacing, globalStyles } from '@/constants/theme';

const { width } = Dimensions.get('window');

interface TrophyItem {
  id: string;
  name: string;
  description: string;
  icon: JSX.Element;
  color: string;
  requirement: number;
  type: 'streak' | 'challenges' | 'emergency' | 'prayer' | 'reflection';
  imageUrl?: string;
}

export default function RewardsHub() {
  const { stats } = useUserStore();
  const [activeTab, setActiveTab] = useState('trophies');
  const [selectedTrophy, setSelectedTrophy] = useState<TrophyItem | null>(null);
  const scrollX = useRef(new Animated.Value(0)).current;
  const scrollViewRef = useRef<ScrollView>(null);
  
  // Animation values
  const trophyRotate = useRef(new Animated.Value(0)).current;
  const trophyScale = useRef(new Animated.Value(1)).current;
  const levelProgress = useRef(new Animated.Value(0)).current;
  const shineAnim = useRef(new Animated.Value(-100)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;
  
  // Get unlocked achievements
  const unlockedAchievements = achievements.filter(achievement => 
    stats.achievements.includes(achievement.id)
  );
  
  // Calculate user level based on points
  const calculateLevel = () => {
    const points = stats.totalPoints;
    if (points >= 10000) return { level: 10, title: "Enlightened Master", color: Colors.level10 };
    if (points >= 7500) return { level: 9, title: "Spiritual Sage", color: Colors.level9 };
    if (points >= 5000) return { level: 8, title: "Guardian of Purity", color: Colors.level8 };
    if (points >= 3000) return { level: 7, title: "Steadfast Warrior", color: Colors.level7 };
    if (points >= 2000) return { level: 6, title: "Devoted Seeker", color: Colors.level6 };
    if (points >= 1000) return { level: 5, title: "Disciplined Soul", color: Colors.level5 };
    if (points >= 500) return { level: 4, title: "Focused Mind", color: Colors.level4 };
    if (points >= 250) return { level: 3, title: "Determined Spirit", color: Colors.level3 };
    if (points >= 100) return { level: 2, title: "Hopeful Heart", color: Colors.level2 };
    return { level: 1, title: "New Journeyer", color: Colors.level1 };
  };
  
  const userLevel = calculateLevel();
  
  // Calculate progress to next level
  const getProgressToNextLevel = () => {
    const points = stats.totalPoints;
    const levelThresholds = [0, 100, 250, 500, 1000, 2000, 3000, 5000, 7500, 10000];
    const currentLevel = userLevel.level;
    
    if (currentLevel >= 10) return 1; // Max level
    
    const currentThreshold = levelThresholds[currentLevel - 1];
    const nextThreshold = levelThresholds[currentLevel];
    const pointsNeeded = nextThreshold - currentThreshold;
    const pointsGained = points - currentThreshold;
    
    return pointsGained / pointsNeeded;
  };
  
  // Trophy showcase items - enhanced with Islamic themes
  const trophies: TrophyItem[] = [
    { 
      id: 'week1', 
      name: 'Emerald Miswak', 
      description: 'Complete your first week free from addiction. The miswak symbolizes purity and cleansing.',
      icon: <Medal size={40} color="#50C878" />, 
      color: '#50C878',
      requirement: 7,
      type: 'streak',
      imageUrl: 'https://images.unsplash.com/photo-1584559582128-b8be739912e1?q=80&w=200&auto=format&fit=crop'
    },
    { 
      id: 'month1', 
      name: 'Silver Prayer Beads', 
      description: 'Stay strong for 30 days. These tasbih beads represent your commitment to remembrance of Allah.',
      icon: <Trophy size={40} color="#C0C0C0" />, 
      color: '#C0C0C0',
      requirement: 30,
      type: 'streak',
      imageUrl: 'https://images.unsplash.com/photo-1584559582128-b8be739912e1?q=80&w=200&auto=format&fit=crop'
    },
    { 
      id: 'quarter', 
      name: 'Bronze Minaret', 
      description: 'Maintain your commitment for 90 days. The minaret symbolizes guidance and the call to righteousness.',
      icon: <Trophy size={40} color="#CD7F32" />, 
      color: '#CD7F32',
      requirement: 90,
      type: 'streak',
      imageUrl: 'https://images.unsplash.com/photo-1584559582128-b8be739912e1?q=80&w=200&auto=format&fit=crop'
    },
    { 
      id: 'halfYear', 
      name: 'Sapphire Compass', 
      description: 'Six months of continuous improvement. This compass represents finding your true direction.',
      icon: <Award size={40} color="#0F52BA" />, 
      color: '#0F52BA',
      requirement: 180,
      type: 'streak',
      imageUrl: 'https://images.unsplash.com/photo-1584559582128-b8be739912e1?q=80&w=200&auto=format&fit=crop'
    },
    { 
      id: 'fullYear', 
      name: 'Golden Kaaba', 
      description: 'A full year of purity and self-control. The Kaaba represents the center of your spiritual journey.',
      icon: <Crown size={40} color="#FFD700" />, 
      color: '#FFD700',
      requirement: 365,
      type: 'streak',
      imageUrl: 'https://images.unsplash.com/photo-1584559582128-b8be739912e1?q=80&w=200&auto=format&fit=crop'
    },
    { 
      id: 'challenge10', 
      name: 'Ruby Lantern', 
      description: 'Complete 10 daily challenges. This lantern symbolizes the light of knowledge guiding your path.',
      icon: <Shield size={40} color="#E0115F" />, 
      color: '#E0115F',
      requirement: 10,
      type: 'challenges',
      imageUrl: 'https://images.unsplash.com/photo-1584559582128-b8be739912e1?q=80&w=200&auto=format&fit=crop'
    },
    { 
      id: 'challenge50', 
      name: 'Diamond Quill', 
      description: 'Complete 50 daily challenges. The quill represents writing your own destiny through consistent action.',
      icon: <Star size={40} color="#B9F2FF" />, 
      color: '#B9F2FF',
      requirement: 50,
      type: 'challenges',
      imageUrl: 'https://images.unsplash.com/photo-1584559582128-b8be739912e1?q=80&w=200&auto=format&fit=crop'
    },
    { 
      id: 'emergency5', 
      name: 'Amethyst Shield', 
      description: 'Successfully use the emergency tool 5 times. This shield represents your strengthening defense against temptation.',
      icon: <Shield size={40} color="#9966CC" />, 
      color: '#9966CC',
      requirement: 5,
      type: 'emergency',
      imageUrl: 'https://images.unsplash.com/photo-1584559582128-b8be739912e1?q=80&w=200&auto=format&fit=crop'
    },
    { 
      id: 'prayer30', 
      name: 'Turquoise Prayer Mat', 
      description: 'Track 30 days of consistent prayers. The prayer mat symbolizes your dedication to spiritual practice.',
      icon: <Star size={40} color="#30D5C8" />, 
      color: '#30D5C8',
      requirement: 30,
      type: 'prayer',
      imageUrl: 'https://images.unsplash.com/photo-1584559582128-b8be739912e1?q=80&w=200&auto=format&fit=crop'
    },
    { 
      id: 'reflection20', 
      name: 'Jade Manuscript', 
      description: 'Complete 20 daily reflections. This manuscript represents your journey of self-discovery and insight.',
      icon: <Medal size={40} color="#00A86B" />, 
      color: '#00A86B',
      requirement: 20,
      type: 'reflection',
      imageUrl: 'https://images.unsplash.com/photo-1584559582128-b8be739912e1?q=80&w=200&auto=format&fit=crop'
    },
  ];
  
  // Start animations
  useEffect(() => {
    // Trophy rotation animation
    Animated.loop(
      Animated.sequence([
        Animated.timing(trophyRotate, {
          toValue: 1,
          duration: 3000,
          useNativeDriver: true,
        }),
        Animated.timing(trophyRotate, {
          toValue: 0,
          duration: 3000,
          useNativeDriver: true,
        }),
      ])
    ).start();
    
    // Trophy scale animation
    Animated.loop(
      Animated.sequence([
        Animated.timing(trophyScale, {
          toValue: 1.05,
          duration: 1500,
          useNativeDriver: true,
        }),
        Animated.timing(trophyScale, {
          toValue: 0.95,
          duration: 1500,
          useNativeDriver: true,
        }),
      ])
    ).start();
    
    // Level progress animation
    Animated.timing(levelProgress, {
      toValue: getProgressToNextLevel(),
      duration: 1500,
      useNativeDriver: false,
    }).start();
    
    // Shine animation for trophies
    Animated.loop(
      Animated.timing(shineAnim, {
        toValue: 100,
        duration: 2000,
        useNativeDriver: true,
      })
    ).start();
    
    // Pulse animation
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.1,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, [stats.totalPoints]);
  
  const trophyRotation = trophyRotate.interpolate({
    inputRange: [0, 1],
    outputRange: ['-5deg', '5deg'],
  });
  
  const renderTrophyItem = (item: TrophyItem, index: number) => {
    const isUnlocked = unlockedAchievements.some(a => a.id === item.id);
    
    return (
      <TouchableOpacity 
        key={item.id}
        style={[
          styles.trophyItem,
          isUnlocked ? styles.unlockedTrophy : styles.lockedTrophy,
        ]}
        onPress={() => setSelectedTrophy(item)}
        activeOpacity={0.8}
      >
        <Animated.View
          style={[
            styles.trophyIconContainer,
            { backgroundColor: isUnlocked ? item.color + '20' : '#f5f5f5' },
            isUnlocked && {
              transform: [
                { rotate: trophyRotation },
                { scale: trophyScale }
              ]
            }
          ]}
        >
          {isUnlocked ? (
            <>
              {Platform.OS !== 'web' && (
                <Animated.View 
                  style={[
                    styles.shine,
                    {
                      transform: [{ translateX: shineAnim }]
                    }
                  ]}
                />
              )}
              <View style={[styles.trophyIcon, { borderColor: item.color }]}>
                {React.cloneElement(item.icon, { color: item.color })}
              </View>
            </>
          ) : (
            <View style={styles.lockedIconContainer}>
              <Gift size={30} color="#9CA3AF" />
            </View>
          )}
        </Animated.View>
        <Text style={[
          styles.trophyName,
          isUnlocked ? [styles.unlockedTrophyName, { color: item.color }] : styles.lockedTrophyName
        ]}>
          {item.name}
        </Text>
        {!isUnlocked && (
          <View style={styles.lockedBadge}>
            <Text style={styles.lockedText}>Locked</Text>
          </View>
        )}
      </TouchableOpacity>
    );
  };
  
  const renderTrophyDetails = () => {
    if (!selectedTrophy) return null;
    
    const isUnlocked = unlockedAchievements.some(a => a.id === selectedTrophy.id);
    
    return (
      <View style={styles.trophyDetailsOverlay}>
        <TouchableOpacity 
          style={styles.detailsBackdrop}
          onPress={() => setSelectedTrophy(null)}
          activeOpacity={1}
        />
        <Animated.View 
          style={[
            styles.trophyDetailsCard,
            { transform: [{ scale: pulseAnim }] }
          ]}
        >
          <LinearGradient
            colors={isUnlocked ? 
              [selectedTrophy.color + '30', selectedTrophy.color + '10'] : 
              ['#f5f5f5', '#e5e5e5']
            }
            style={styles.trophyDetailsGradient}
          >
            <TouchableOpacity 
              style={styles.closeButton}
              onPress={() => setSelectedTrophy(null)}
            >
              <ChevronLeft size={24} color={Colors.text} />
            </TouchableOpacity>
            
            <View style={styles.trophyDetailsContent}>
              <Animated.View
                style={[
                  styles.detailsTrophyContainer,
                  isUnlocked && {
                    transform: [
                      { rotate: trophyRotation },
                      { scale: trophyScale }
                    ]
                  }
                ]}
              >
                {isUnlocked ? (
                  <>
                    {Platform.OS !== 'web' && (
                      <Animated.View 
                        style={[
                          styles.detailsShine,
                          {
                            transform: [{ translateX: shineAnim }]
                          }
                        ]}
                      />
                    )}
                    <View style={[styles.detailsTrophyIcon, { borderColor: selectedTrophy.color }]}>
                      {React.cloneElement(selectedTrophy.icon, { size: 60, color: selectedTrophy.color })}
                    </View>
                  </>
                ) : (
                  <View style={styles.detailsLockedIcon}>
                    <Gift size={60} color="#9CA3AF" />
                  </View>
                )}
              </Animated.View>
              
              <Text style={[
                styles.detailsTrophyName,
                isUnlocked ? { color: selectedTrophy.color } : styles.detailsLockedName
              ]}>
                {selectedTrophy.name}
              </Text>
              
              <Text style={styles.detailsTrophyDescription}>
                {selectedTrophy.description}
              </Text>
              
              {!isUnlocked && (
                <View style={styles.requirementContainer}>
                  <Text style={styles.requirementTitle}>How to unlock:</Text>
                  <View style={styles.requirementContent}>
                    {selectedTrophy.type === 'streak' && (
                      <Text style={styles.requirementText}>
                        Maintain a streak of {selectedTrophy.requirement} days
                      </Text>
                    )}
                    {selectedTrophy.type === 'challenges' && (
                      <Text style={styles.requirementText}>
                        Complete {selectedTrophy.requirement} daily challenges
                      </Text>
                    )}
                    {selectedTrophy.type === 'emergency' && (
                      <Text style={styles.requirementText}>
                        Successfully use the emergency tool {selectedTrophy.requirement} times
                      </Text>
                    )}
                    {selectedTrophy.type === 'prayer' && (
                      <Text style={styles.requirementText}>
                        Track {selectedTrophy.requirement} days of consistent prayers
                      </Text>
                    )}
                    {selectedTrophy.type === 'reflection' && (
                      <Text style={styles.requirementText}>
                        Complete {selectedTrophy.requirement} daily reflections
                      </Text>
                    )}
                  </View>
                </View>
              )}
              
              {isUnlocked && (
                <View style={styles.achievementDate}>
                  <Text style={styles.achievementDateText}>
                    Unlocked on: {new Date().toLocaleDateString()}
                  </Text>
                </View>
              )}
            </View>
          </LinearGradient>
        </Animated.View>
      </View>
    );
  };
  
  const renderLevelCard = () => {
    const progress = getProgressToNextLevel() * 100;
    const nextLevel = userLevel.level < 10 ? userLevel.level + 1 : 'MAX';
    const pointsForNextLevel = [0, 100, 250, 500, 1000, 2000, 3000, 5000, 7500, 10000];
    const pointsNeeded = userLevel.level < 10 ? 
      pointsForNextLevel[userLevel.level] - stats.totalPoints : 0;
    
    return (
      <View style={styles.levelCard}>
        <LinearGradient
          colors={[userLevel.color, userLevel.color + '80']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.levelGradient}
        >
          <View style={styles.levelHeader}>
            <View style={styles.levelBadge}>
              <Text style={styles.levelNumber}>{userLevel.level}</Text>
            </View>
            <View style={styles.levelInfo}>
              <Text style={styles.levelTitle}>{userLevel.title}</Text>
              <Text style={styles.levelPoints}>{stats.totalPoints} points</Text>
            </View>
          </View>
          
          {userLevel.level < 10 && (
            <View style={styles.levelProgressContainer}>
              <View style={styles.levelProgressLabels}>
                <Text style={styles.currentLevelLabel}>Level {userLevel.level}</Text>
                <Text style={styles.nextLevelLabel}>Level {nextLevel}</Text>
              </View>
              <View style={styles.progressBarContainer}>
                <Animated.View 
                  style={[
                    styles.progressBar,
                    { width: levelProgress.interpolate({
                        inputRange: [0, 1],
                        outputRange: ['0%', '100%']
                      })
                    }
                  ]}
                />
              </View>
              <Text style={styles.pointsNeeded}>
                {pointsNeeded} points needed for next level
              </Text>
            </View>
          )}
          
          {userLevel.level >= 10 && (
            <View style={styles.maxLevelContainer}>
              <Crown size={40} color="#FFD700" />
              <Text style={styles.maxLevelText}>Maximum Level Achieved!</Text>
              <Text style={styles.maxLevelSubtext}>
                Continue earning points for your personal record
              </Text>
            </View>
          )}
        </LinearGradient>
      </View>
    );
  };
  
  const renderPerks = () => {
    // Define perks based on user level
    const perks = [
      { level: 1, name: "Daily Quotes", description: "Access to daily Islamic quotes" },
      { level: 2, name: "Basic Challenges", description: "Access to daily challenges" },
      { level: 3, name: "Emergency Tool", description: "Enhanced emergency support tool" },
      { level: 4, name: "Streak Insights", description: "Detailed analytics of your progress" },
      { level: 5, name: "Custom Themes", description: "Ability to customize app appearance" },
      { level: 6, name: "Advanced Challenges", description: "Access to more difficult challenges" },
      { level: 7, name: "Meditation Guides", description: "Islamic meditation and dhikr guides" },
      { level: 8, name: "Exclusive Content", description: "Special educational resources" },
      { level: 9, name: "Personal Journal", description: "Enhanced reflection capabilities" },
      { level: 10, name: "Mentor Status", description: "Ability to provide anonymous advice" },
    ];
    
    const unlockedPerks = perks.filter(perk => perk.level <= userLevel.level);
    const lockedPerks = perks.filter(perk => perk.level > userLevel.level);
    
    return (
      <View style={styles.perksContainer}>
        <Text style={styles.perksTitle}>Unlocked Perks</Text>
        
        {unlockedPerks.map((perk, index) => (
          <View key={index} style={styles.perkItem}>
            <View style={[styles.perkBadge, { backgroundColor: userLevel.color }]}>
              <Text style={styles.perkLevel}>{perk.level}</Text>
            </View>
            <View style={styles.perkInfo}>
              <Text style={styles.perkName}>{perk.name}</Text>
              <Text style={styles.perkDescription}>{perk.description}</Text>
            </View>
            <Shield size={20} color={userLevel.color} />
          </View>
        ))}
        
        {lockedPerks.length > 0 && (
          <>
            <Text style={styles.perksTitle}>Coming Soon</Text>
            {lockedPerks.slice(0, 3).map((perk, index) => (
              <View key={index} style={[styles.perkItem, styles.lockedPerkItem]}>
                <View style={styles.perkBadge}>
                  <Text style={styles.perkLevel}>{perk.level}</Text>
                </View>
                <View style={styles.perkInfo}>
                  <Text style={styles.lockedPerkName}>{perk.name}</Text>
                  <Text style={styles.lockedPerkDescription}>{perk.description}</Text>
                </View>
                <Shield size={20} color={Colors.disabled} />
              </View>
            ))}
          </>
        )}
      </View>
    );
  };
  
  const renderTrophyCategories = () => {
    const categories = [
      { id: 'streak', name: 'Streak', icon: <CalendarClock size={16} color={Colors.primary} /> },
      { id: 'challenges', name: 'Challenges', icon: <Award size={16} color={Colors.primary} /> },
      { id: 'prayer', name: 'Prayer', icon: <Star size={16} color={Colors.primary} /> },
      { id: 'all', name: 'All', icon: <Trophy size={16} color={Colors.primary} /> },
    ];
    
    return (
      <View style={styles.categoryContainer}>
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoryScroll}
        >
          {categories.map(category => (
            <TouchableOpacity 
              key={category.id}
              style={styles.categoryButton}
            >
              <View style={styles.categoryIcon}>
                {category.icon}
              </View>
              <Text style={styles.categoryText}>{category.name}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
    );
  };
  
  return (
    <View style={styles.container}>
      <View style={styles.tabsContainer}>
        <TouchableOpacity 
          style={[styles.tab, activeTab === 'trophies' && styles.activeTab]}
          onPress={() => setActiveTab('trophies')}
        >
          <Trophy size={18} color={activeTab === 'trophies' ? Colors.primary : Colors.textSecondary} />
          <Text style={[
            styles.tabText,
            activeTab === 'trophies' && styles.activeTabText
          ]}>
            Trophies
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.tab, activeTab === 'level' && styles.activeTab]}
          onPress={() => setActiveTab('level')}
        >
          <Star size={18} color={activeTab === 'level' ? Colors.primary : Colors.textSecondary} />
          <Text style={[
            styles.tabText,
            activeTab === 'level' && styles.activeTabText
          ]}>
            Level
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.tab, activeTab === 'perks' && styles.activeTab]}
          onPress={() => setActiveTab('perks')}
        >
          <Gift size={18} color={activeTab === 'perks' ? Colors.primary : Colors.textSecondary} />
          <Text style={[
            styles.tabText,
            activeTab === 'perks' && styles.activeTabText
          ]}>
            Perks
          </Text>
        </TouchableOpacity>
      </View>
      
      <View style={styles.contentContainer}>
        {activeTab === 'trophies' && (
          <View style={styles.trophiesContainer}>
            <View style={styles.trophyHeaderRow}>
              <Text style={styles.sectionTitle}>
                Trophy Room ({unlockedAchievements.length}/{trophies.length})
              </Text>
              <Sparkles size={20} color={Colors.primary} />
            </View>
            
            {renderTrophyCategories()}
            
            <View style={styles.trophyGrid}>
              {trophies.map((trophy, index) => renderTrophyItem(trophy, index))}
            </View>
          </View>
        )}
        
        {activeTab === 'level' && (
          <View style={styles.levelContainer}>
            <Text style={styles.sectionTitle}>Your Level</Text>
            {renderLevelCard()}
            
            <View style={styles.levelBenefits}>
              <Text style={styles.benefitsTitle}>Level Benefits</Text>
              <View style={styles.benefitItem}>
                <View style={styles.benefitIcon}>
                  <Trophy size={20} color={Colors.primary} />
                </View>
                <Text style={styles.benefitText}>
                  Unlock new achievements and trophies
                </Text>
              </View>
              <View style={styles.benefitItem}>
                <View style={styles.benefitIcon}>
                  <Shield size={20} color={Colors.primary} />
                </View>
                <Text style={styles.benefitText}>
                  Access to more advanced features and tools
                </Text>
              </View>
              <View style={styles.benefitItem}>
                <View style={styles.benefitIcon}>
                  <Star size={20} color={Colors.primary} />
                </View>
                <Text style={styles.benefitText}>
                  Gain spiritual insights and personal growth
                </Text>
              </View>
            </View>
          </View>
        )}
        
        {activeTab === 'perks' && renderPerks()}
      </View>
      
      {selectedTrophy && renderTrophyDetails()}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.card,
    borderRadius: 24,
    overflow: 'hidden',
    marginHorizontal: spacing.lg,
    marginVertical: spacing.md,
    shadowColor: Colors.text,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  tabsContainer: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  tab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.md,
    gap: spacing.xs,
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: Colors.primary,
  },
  tabText: {
    fontSize: typography.fontSizes.md,
    color: Colors.textSecondary,
    fontWeight: "500",
  },
  activeTabText: {
    color: Colors.primary,
    fontWeight: "600",
  },
  contentContainer: {
    padding: spacing.lg,
  },
  trophyHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.md,
  },
  sectionTitle: {
    fontSize: typography.fontSizes.lg,
    fontWeight: "600",
    color: Colors.text,
  },
  trophiesContainer: {
    
  },
  categoryContainer: {
    marginBottom: spacing.md,
  },
  categoryScroll: {
    paddingVertical: spacing.sm,
  },
  categoryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.highlight,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: 20,
    marginRight: spacing.sm,
  },
  categoryIcon: {
    marginRight: spacing.xs,
  },
  categoryText: {
    fontSize: typography.fontSizes.sm,
    color: Colors.primary,
    fontWeight: "500",
  },
  trophyGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  trophyItem: {
    width: '30%',
    alignItems: 'center',
    marginBottom: spacing.lg,
    padding: spacing.sm,
    borderRadius: 16,
  },
  unlockedTrophy: {
    backgroundColor: Colors.highlight,
  },
  lockedTrophy: {
    backgroundColor: Colors.background,
    opacity: 0.7,
  },
  trophyIconContainer: {
    width: 70,
    height: 70,
    borderRadius: 35,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.sm,
    shadowColor: Colors.text,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    overflow: 'hidden',
  },
  shine: {
    position: 'absolute',
    width: 30,
    height: 100,
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
    transform: [{ rotate: '45deg' }],
  },
  trophyIcon: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'white',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
  },
  lockedIconContainer: {
    opacity: 0.5,
  },
  trophyName: {
    fontSize: typography.fontSizes.sm,
    textAlign: 'center',
    marginTop: spacing.xs,
    fontWeight: "500",
  },
  unlockedTrophyName: {
    fontWeight: "700",
  },
  lockedTrophyName: {
    color: Colors.textSecondary,
  },
  lockedBadge: {
    backgroundColor: Colors.disabled,
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
    borderRadius: 10,
    marginTop: spacing.xs,
  },
  lockedText: {
    color: 'white',
    fontSize: typography.fontSizes.xs,
    fontWeight: "500",
  },
  trophyDetailsOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  },
  detailsBackdrop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  trophyDetailsCard: {
    width: '80%',
    maxWidth: 300,
    borderRadius: 24,
    overflow: 'hidden',
    shadowColor: Colors.text,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  trophyDetailsGradient: {
    padding: spacing.lg,
    alignItems: 'center',
  },
  closeButton: {
    position: 'absolute',
    top: spacing.sm,
    left: spacing.sm,
    zIndex: 1,
  },
  trophyDetailsContent: {
    alignItems: 'center',
    paddingTop: spacing.lg,
  },
  detailsTrophyContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: 'white',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.md,
    shadowColor: Colors.text,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    overflow: 'hidden',
  },
  detailsShine: {
    position: 'absolute',
    width: 40,
    height: 160,
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
    transform: [{ rotate: '45deg' }],
  },
  detailsTrophyIcon: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: 'white',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
  },
  detailsLockedIcon: {
    opacity: 0.5,
  },
  detailsTrophyName: {
    fontSize: typography.fontSizes.xl,
    fontWeight: "700",
    marginBottom: spacing.sm,
    textAlign: 'center',
  },
  detailsLockedName: {
    color: Colors.textSecondary,
  },
  detailsTrophyDescription: {
    fontSize: typography.fontSizes.md,
    color: Colors.text,
    textAlign: 'center',
    marginBottom: spacing.md,
    lineHeight: typography.lineHeights.md,
  },
  requirementContainer: {
    width: '100%',
    backgroundColor: 'rgba(0, 0, 0, 0.05)',
    borderRadius: 16,
    padding: spacing.md,
    marginTop: spacing.sm,
  },
  requirementTitle: {
    fontSize: typography.fontSizes.md,
    fontWeight: "600",
    color: Colors.text,
    marginBottom: spacing.xs,
  },
  requirementContent: {
    
  },
  requirementText: {
    fontSize: typography.fontSizes.sm,
    color: Colors.textSecondary,
    lineHeight: typography.lineHeights.sm,
  },
  achievementDate: {
    marginTop: spacing.md,
    paddingTop: spacing.sm,
    borderTopWidth: 1,
    borderTopColor: 'rgba(0, 0, 0, 0.1)',
    width: '100%',
    alignItems: 'center',
  },
  achievementDateText: {
    fontSize: typography.fontSizes.sm,
    color: Colors.textSecondary,
    fontStyle: 'italic',
  },
  levelContainer: {
    
  },
  levelCard: {
    borderRadius: 24,
    overflow: 'hidden',
    marginBottom: spacing.lg,
    ...globalStyles.shadowLarge,
  },
  levelGradient: {
    padding: spacing.lg,
    borderRadius: 24,
  },
  levelHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  levelBadge: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.5)',
  },
  levelNumber: {
    fontSize: typography.fontSizes['2xl'],
    fontWeight: "700",
    color: 'white',
  },
  levelInfo: {
    flex: 1,
  },
  levelTitle: {
    fontSize: typography.fontSizes.xl,
    fontWeight: "700",
    color: 'white',
    marginBottom: spacing.xs,
  },
  levelPoints: {
    fontSize: typography.fontSizes.md,
    color: 'rgba(255, 255, 255, 0.8)',
    fontWeight: "500",
  },
  levelProgressContainer: {
    marginTop: spacing.sm,
  },
  levelProgressLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing.xs,
  },
  currentLevelLabel: {
    fontSize: typography.fontSizes.sm,
    color: 'rgba(255, 255, 255, 0.8)',
    fontWeight: "500",
  },
  nextLevelLabel: {
    fontSize: typography.fontSizes.sm,
    color: 'rgba(255, 255, 255, 0.8)',
    fontWeight: "500",
  },
  progressBarContainer: {
    height: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    backgroundColor: 'white',
    borderRadius: 4,
  },
  pointsNeeded: {
    fontSize: typography.fontSizes.sm,
    color: 'rgba(255, 255, 255, 0.8)',
    marginTop: spacing.xs,
    textAlign: 'center',
    fontWeight: "500",
  },
  maxLevelContainer: {
    alignItems: 'center',
    marginTop: spacing.md,
  },
  maxLevelText: {
    fontSize: typography.fontSizes.lg,
    fontWeight: "700",
    color: 'white',
    marginTop: spacing.sm,
  },
  maxLevelSubtext: {
    fontSize: typography.fontSizes.sm,
    color: 'rgba(255, 255, 255, 0.8)',
    textAlign: 'center',
    marginTop: spacing.xs,
  },
  levelBenefits: {
    backgroundColor: Colors.highlight,
    borderRadius: 24,
    padding: spacing.lg,
  },
  benefitsTitle: {
    fontSize: typography.fontSizes.lg,
    fontWeight: "600",
    color: Colors.text,
    marginBottom: spacing.md,
  },
  benefitItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  benefitIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: Colors.highlight,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
    borderWidth: 1,
    borderColor: Colors.primary,
  },
  benefitText: {
    fontSize: typography.fontSizes.md,
    color: Colors.text,
    flex: 1,
    lineHeight: typography.lineHeights.md,
  },
  perksContainer: {
    
  },
  perksTitle: {
    fontSize: typography.fontSizes.lg,
    fontWeight: "600",
    color: Colors.text,
    marginBottom: spacing.md,
    marginTop: spacing.sm,
  },
  perkItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.highlight,
    borderRadius: 16,
    padding: spacing.md,
    marginBottom: spacing.sm,
  },
  lockedPerkItem: {
    backgroundColor: Colors.background,
    opacity: 0.7,
  },
  perkBadge: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: Colors.disabled,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
  },
  perkLevel: {
    color: 'white',
    fontWeight: "700",
    fontSize: typography.fontSizes.sm,
  },
  perkInfo: {
    flex: 1,
  },
  perkName: {
    fontSize: typography.fontSizes.md,
    fontWeight: "600",
    color: Colors.text,
    marginBottom: 2,
  },
  perkDescription: {
    fontSize: typography.fontSizes.sm,
    color: Colors.textSecondary,
    lineHeight: typography.lineHeights.sm,
  },
  lockedPerkName: {
    fontSize: typography.fontSizes.md,
    color: Colors.textSecondary,
    marginBottom: 2,
    fontWeight: "500",
  },
  lockedPerkDescription: {
    fontSize: typography.fontSizes.sm,
    color: Colors.textSecondary,
    opacity: 0.7,
  },
});