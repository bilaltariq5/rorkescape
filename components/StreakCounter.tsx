import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated, Dimensions, Platform } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useUserStore } from '@/store/user-store';
import { typography, spacing } from '@/constants/theme';
import { useTheme } from '@/context/ThemeContext';
import { baseColors } from '@/constants/colors';

const { width } = Dimensions.get('window');

export default function StreakCounter() {
  const { stats } = useUserStore();
  const { theme } = useTheme();
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const scaleAnim = useRef(new Animated.Value(0.9)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;
  
  useEffect(() => {
    // Entry animation - using native driver consistently
    Animated.parallel([
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 8,
        tension: 40,
        useNativeDriver: true,
      }),
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
    ]).start();
    
    // Create a pulsing animation for the streak counter - using native driver consistently
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.05,
          duration: 2000,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 2000,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);
  
  // Get user level based on streak
  const getUserLevel = () => {
    const streak = stats.currentStreak;
    if (streak >= 365) return 'Guardian';
    if (streak >= 180) return 'Warrior';
    if (streak >= 90) return 'Defender';
    if (streak >= 30) return 'Seeker';
    if (streak >= 7) return 'Initiate';
    return 'Beginner';
  };
  
  // Get level color
  const getLevelColor = () => {
    const streak = stats.currentStreak;
    if (streak >= 365) return baseColors.accent[700];
    if (streak >= 180) return baseColors.primary[700];
    if (streak >= 90) return baseColors.success[500];
    if (streak >= 30) return baseColors.secondary[500];
    if (streak >= 7) return baseColors.primary[500];
    return baseColors.gray[500];
  };

  return (
    <View style={styles.container}>
      <Animated.View 
        style={[
          styles.animatedContainer,
          { 
            transform: [{ scale: scaleAnim }],
            opacity: fadeAnim,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 12 },
            shadowOpacity: 0.25,
            shadowRadius: 20,
            elevation: 15,
          }
        ]}
      >
        <LinearGradient
          colors={[baseColors.primary[600], baseColors.accent[600]]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.gradientContainer}
        >
          <View style={styles.backgroundPattern} />
          
          <View style={styles.content}>
            <Animated.View
              style={[
                styles.counterContainer,
                { transform: [{ scale: pulseAnim }] }
              ]}
            >
              <Text style={styles.counter}>{stats.currentStreak}</Text>
              <Text style={styles.daysClean}>days clean</Text>
            </Animated.View>
            
            <View style={styles.levelContainer}>
              <LinearGradient
                colors={[getLevelColor(), getLevelColor() + '80']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.levelBadge}
              >
                <Text style={styles.levelText}>{getUserLevel()}</Text>
              </LinearGradient>
            </View>
            
            <Text style={styles.record}>
              Personal Best: {stats.longestStreak} days
            </Text>
          </View>
        </LinearGradient>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginHorizontal: spacing.lg,
    marginVertical: spacing.xl,
    borderRadius: 32,
    overflow: 'hidden',
  },
  animatedContainer: {
    borderRadius: 32,
    overflow: 'hidden',
  },
  gradientContainer: {
    borderRadius: 32,
    overflow: 'hidden',
    position: 'relative',
    minHeight: 280,
  },
  backgroundPattern: {
    position: 'absolute',
    top: -100,
    left: -100,
    right: -100,
    bottom: -100,
    borderRadius: 200,
    borderWidth: 40,
    borderColor: 'rgba(255, 255, 255, 0.08)',
  },
  content: {
    padding: spacing.xl,
    alignItems: 'center',
    position: 'relative',
    zIndex: 2,
    justifyContent: 'center',
    flex: 1,
  },
  counterContainer: {
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  counter: {
    color: 'white',
    fontSize: 160,
    fontWeight: "900",
    textShadowColor: 'rgba(0, 0, 0, 0.4)',
    textShadowOffset: { width: 0, height: 4 },
    textShadowRadius: 8,
    letterSpacing: -4,
    lineHeight: 160,
  },
  daysClean: {
    color: 'white',
    fontSize: typography.fontSizes.xxl,
    opacity: 0.95,
    fontWeight: "700",
    letterSpacing: 2,
    marginTop: spacing.sm,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  levelContainer: {
    marginBottom: spacing.lg,
  },
  levelBadge: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.3)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  levelText: {
    color: 'white',
    fontWeight: "700",
    fontSize: typography.fontSizes.sm,
    letterSpacing: 1,
    textAlign: 'center',
  },
  record: {
    color: 'white',
    fontSize: typography.fontSizes.md,
    opacity: 0.85,
    fontWeight: "500",
    textAlign: 'center',
    letterSpacing: 0.5,
  },
});