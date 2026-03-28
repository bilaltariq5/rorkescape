import React, { useState, useEffect, useRef } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity, 
  SafeAreaView, 
  Animated,
  Platform,
  Dimensions
} from 'react-native';
import { AlertTriangle, Coins, Shield } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { 
  StreakCounter,
  DailyQuote,
  DailyChallenge,
  PrayerTracker,
  RewardsHub,
  RewardNotification
} from '@/components';
import { useUserStore } from '@/store/user-store';
import { globalStyles, spacing, typography } from '@/constants/theme';
import { useTheme } from '@/context/ThemeContext';
import { baseColors } from '@/constants/colors';
import EmergencyButton from '@/components/EmergencyButton';

const { width, height } = Dimensions.get('window');

export default function HomeScreen() {
  const [emergencyModalVisible, setEmergencyModalVisible] = useState(false);
  const { checkDailyLogin, stats, userName } = useUserStore();
  const { theme, isDark } = useTheme();
  
  // Animation values
  const scrollY = useRef(new Animated.Value(0)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const headerAnim = useRef(new Animated.Value(0)).current;
  const sidebarPulseAnim = useRef(new Animated.Value(1)).current;
  
  useEffect(() => {
    // Check if user has logged in today and update streak if needed
    checkDailyLogin();
    
    // Fade in animation
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.timing(headerAnim, {
        toValue: 1,
        duration: 1200,
        useNativeDriver: true,
      }),
    ]).start();

    // Start sidebar pulse animation
    Animated.loop(
      Animated.sequence([
        Animated.timing(sidebarPulseAnim, {
          toValue: 1.05,
          duration: 2000,
          useNativeDriver: true,
        }),
        Animated.timing(sidebarPulseAnim, {
          toValue: 1,
          duration: 2000,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);
  
  // Dynamic header effects based on scroll
  const headerOpacity = scrollY.interpolate({
    inputRange: [0, 100],
    outputRange: [1, 0.95],
    extrapolate: 'clamp',
  });
  
  const headerScale = scrollY.interpolate({
    inputRange: [-100, 0, 100],
    outputRange: [1.05, 1, 0.98],
    extrapolate: 'clamp',
  });

  const navigateToChat = () => {
    router.push('/chat');
  };

  const navigateToRelapse = () => {
    router.push('/relapse');
  };

  const handleEmergencyPress = () => {
    setEmergencyModalVisible(true);
  };

  // Theme-aware header colors
  const headerGradientColors = isDark 
    ? ['#000000', '#000000', '#000000']
    : ['#FFFFFF', '#FFFFFF', '#FFFFFF'];
  
  const headerTextColor = isDark ? 'white' : theme.text;
  const headerButtonBg = isDark ? 'rgba(255, 255, 255, 0.2)' : 'rgba(0, 0, 0, 0.1)';
  const headerButtonBorder = isDark ? 'rgba(255, 255, 255, 0.3)' : 'rgba(0, 0, 0, 0.2)';

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      <Animated.ScrollView 
        style={styles.scrollView} 
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
        scrollEventThrottle={16}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: false }
        )}
      >
        <Animated.View 
          style={[
            styles.headerSection,
            { 
              opacity: headerOpacity,
              transform: [{ scale: headerScale }]
            }
          ]}
        >
          <LinearGradient
            colors={headerGradientColors}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.headerGradient}
          >
            <View style={styles.headerOverlay} />
            
            <Animated.View 
              style={[
                styles.headerContent,
                { 
                  opacity: headerAnim,
                  transform: [
                    { 
                      translateY: headerAnim.interpolate({
                        inputRange: [0, 1],
                        outputRange: [30, 0]
                      })
                    }
                  ] 
                }
              ]}
            >
              <View style={styles.topRow}>
                <View style={styles.greetingSection}>
                  <Text style={[styles.greetingText, { color: headerTextColor }]}>
                    Assala'mu Alaykum
                  </Text>
                  <Text style={[styles.nameText, { color: headerTextColor }]}>{userName}</Text>
                </View>
                
                <View style={styles.headerActions}>
                  <TouchableOpacity 
                    style={[
                      styles.chatButton,
                      { 
                        backgroundColor: headerButtonBg,
                        borderColor: headerButtonBorder
                      }
                    ]}
                    onPress={navigateToChat}
                  >
                    <Shield size={24} color={headerTextColor} />
                  </TouchableOpacity>
                  
                  <View style={[
                    styles.pointsDisplay,
                    { 
                      backgroundColor: headerButtonBg,
                      borderColor: headerButtonBorder
                    }
                  ]}>
                    <Coins size={20} color={headerTextColor} />
                    <Text style={[styles.pointsValue, { color: headerTextColor }]}>{stats.totalPoints}</Text>
                  </View>
                </View>
              </View>
            </Animated.View>
          </LinearGradient>
        </Animated.View>
        
        <Animated.View 
          style={[
            styles.streakContainer,
            { 
              opacity: fadeAnim,
              transform: [
                { 
                  translateY: fadeAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [20, 0]
                  })
                }
              ] 
            }
          ]}
        >
          <StreakCounter />
        </Animated.View>
        
        <Animated.View 
          style={[
            styles.sectionContainer,
            { 
              opacity: fadeAnim,
              transform: [
                { 
                  translateY: fadeAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [40, 0]
                  })
                }
              ] 
            }
          ]}
        >
          <PrayerTracker />
        </Animated.View>
        
        <Animated.View 
          style={[
            styles.relapseButtonContainer,
            { 
              opacity: fadeAnim,
              transform: [
                { 
                  translateY: fadeAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [60, 0]
                  })
                }
              ] 
            }
          ]}
        >
          <TouchableOpacity 
            style={[styles.relapseButton, { borderColor: theme.danger }]}
            onPress={navigateToRelapse}
          >
            <AlertTriangle size={18} color={theme.danger} />
            <Text style={[styles.relapseText, { color: theme.danger }]}>Record a Relapse</Text>
          </TouchableOpacity>
        </Animated.View>
        
        <Animated.View 
          style={[
            styles.sectionContainer,
            { 
              opacity: fadeAnim,
              transform: [
                { 
                  translateY: fadeAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [80, 0]
                  })
                }
              ] 
            }
          ]}
        >
          <DailyChallenge />
        </Animated.View>
        
        <Animated.View 
          style={[
            styles.sectionContainer,
            { 
              opacity: fadeAnim,
              transform: [
                { 
                  translateY: fadeAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [100, 0]
                  })
                }
              ] 
            }
          ]}
        >
          <DailyQuote />
        </Animated.View>
        
        <Animated.View 
          style={[
            styles.sectionContainer,
            { 
              opacity: fadeAnim,
              transform: [
                { 
                  translateY: fadeAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [120, 0]
                  })
                }
              ] 
            }
          ]}
        >
          <RewardsHub />
        </Animated.View>
      </Animated.ScrollView>

      {/* Sidebar Emergency Button */}
      <Animated.View 
        style={[
          styles.sidebarEmergencyButton,
          { 
            transform: [{ scale: sidebarPulseAnim }],
            opacity: fadeAnim
          }
        ]}
      >
        <TouchableOpacity 
          style={styles.sidebarButton}
          onPress={handleEmergencyPress}
          activeOpacity={0.8}
        >
          <LinearGradient
            colors={['#FF3B30', '#FF6B6B']}
            start={{ x: 0, y: 0 }}
            end={{ x: 0, y: 1 }}
            style={styles.sidebarGradient}
          >
            <AlertTriangle size={16} color="white" />
            <Text style={styles.sidebarText}>HELP</Text>
          </LinearGradient>
        </TouchableOpacity>
      </Animated.View>

      <EmergencyButton 
        modalVisible={emergencyModalVisible}
        onClose={() => setEmergencyModalVisible(false)}
      />
      
      <RewardNotification />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    paddingBottom: 32,
  },
  headerSection: {
    marginBottom: -spacing.xl,
    zIndex: 10,
  },
  headerGradient: {
    paddingTop: spacing.xl,
    paddingBottom: spacing.xxl,
    position: 'relative',
    overflow: 'hidden',
  },
  headerOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.05)',
  },
  headerContent: {
    paddingHorizontal: spacing.lg,
    position: 'relative',
    zIndex: 2,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  greetingSection: {
    flex: 1,
  },
  greetingText: {
    fontSize: typography.fontSizes.lg,
    fontWeight: "600",
    opacity: 0.9,
    letterSpacing: 0.5,
  },
  nameText: {
    fontSize: typography.fontSizes.xxl,
    fontWeight: "800",
    marginTop: spacing.xs,
    letterSpacing: 0.5,
    textShadowColor: 'rgba(0, 0, 0, 0.1)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  chatButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  pointsDisplay: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: 20,
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  pointsValue: {
    fontSize: typography.fontSizes.lg,
    fontWeight: "700",
    marginLeft: spacing.xs,
    textShadowColor: 'rgba(0, 0, 0, 0.1)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 1,
  },
  streakContainer: {
    marginTop: spacing.lg,
  },
  sectionContainer: {
    marginBottom: spacing.md,
  },
  relapseButtonContainer: {
    paddingHorizontal: spacing.lg,
    marginTop: spacing.lg,
    marginBottom: spacing.xl,
  },
  relapseButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderWidth: 1,
    borderRadius: 16,
    backgroundColor: 'transparent',
  },
  relapseText: {
    fontWeight: "600",
    marginLeft: spacing.sm,
  },
  sidebarEmergencyButton: {
    position: 'absolute',
    right: 0,
    top: '50%',
    marginTop: -35, // Half of the button height to center it
    zIndex: 1000,
    shadowColor: '#FF3B30',
    shadowOffset: { width: -2, height: 0 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  sidebarButton: {
    borderTopLeftRadius: 16,
    borderBottomLeftRadius: 16,
    overflow: 'hidden',
  },
  sidebarGradient: {
    paddingVertical: 12,
    paddingHorizontal: 12,
    paddingLeft: 16,
    alignItems: 'center',
    justifyContent: 'center',
    width: 60,
    height: 70,
  },
  sidebarText: {
    color: 'white',
    fontSize: 10,
    fontWeight: "800",
    marginTop: 4,
    letterSpacing: 0.5,
    textAlign: 'center',
  },
});