import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated, Dimensions, Platform } from 'react-native';
import { Trophy, CheckCircle, Clock, Award } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { challenges } from '@/constants/quotes';
import { useUserStore } from '@/store/user-store';
import { typography, spacing, globalStyles } from '@/constants/theme';
import { useTheme } from '@/context/ThemeContext';

const { width } = Dimensions.get('window');

export default function DailyChallenge() {
  const { stats, completeChallenge } = useUserStore();
  const { theme } = useTheme();
  const [dailyChallenge, setDailyChallenge] = useState(challenges[0]);
  const [isCompleted, setIsCompleted] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  
  // Animation values
  const scaleAnim = useRef(new Animated.Value(0.95)).current;
  const rotateAnim = useRef(new Animated.Value(0)).current;
  const progressAnim = useRef(new Animated.Value(0)).current;
  
  // Confetti animation
  const confettiCount = 30;
  const confettiColors = [theme.primary, theme.secondary, theme.accent, '#FFD700', '#FF4D4D'];
  const confettiAnimations = Array(confettiCount).fill(0).map(() => ({
    position: useRef(new Animated.ValueXY({ x: 0, y: 0 })).current,
    opacity: useRef(new Animated.Value(0)).current,
    scale: useRef(new Animated.Value(0)).current,
    rotation: useRef(new Animated.Value(0)).current,
  }));
  
  useEffect(() => {
    // Get a random challenge for the day
    const today = new Date().toISOString().split('T')[0];
    const seed = today.split('-').reduce((acc, val) => acc + parseInt(val), 0);
    const randomIndex = seed % challenges.length;
    setDailyChallenge(challenges[randomIndex]);
    
    // Check if challenge is already completed today
    const completedToday = stats.completedChallenges.some(
      challenge => challenge.id === challenges[randomIndex].id && challenge.date === today
    );
    setIsCompleted(completedToday);
    
    // Entry animation
    Animated.spring(scaleAnim, {
      toValue: 1,
      friction: 8,
      tension: 40,
      useNativeDriver: true,
    }).start();
    
    // Subtle rotation animation
    Animated.loop(
      Animated.sequence([
        Animated.timing(rotateAnim, {
          toValue: 1,
          duration: 6000,
          useNativeDriver: true,
        }),
        Animated.timing(rotateAnim, {
          toValue: 0,
          duration: 6000,
          useNativeDriver: true,
        }),
      ])
    ).start();
    
    // Progress animation
    Animated.timing(progressAnim, {
      toValue: completedToday ? 1 : 0,
      duration: 1000,
      useNativeDriver: false,
    }).start();
  }, [stats.completedChallenges]);
  
  const handleCompleteChallenge = () => {
    if (!isCompleted) {
      completeChallenge(dailyChallenge.id);
      setIsCompleted(true);
      
      // Animate progress
      Animated.timing(progressAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: false,
      }).start();
      
      // Show confetti
      setShowConfetti(true);
      triggerConfettiAnimation();
      
      // Hide confetti after 3 seconds
      setTimeout(() => {
        setShowConfetti(false);
      }, 3000);
    }
  };
  
  const triggerConfettiAnimation = () => {
    confettiAnimations.forEach((anim, index) => {
      // Reset values
      anim.position.setValue({ x: 0, y: 0 });
      anim.opacity.setValue(0);
      anim.scale.setValue(0);
      anim.rotation.setValue(0);
      
      // Random angle for confetti spread
      const angle = Math.random() * Math.PI * 2;
      const distance = 100 + Math.random() * 150;
      const duration = 1000 + Math.random() * 1500;
      
      // Stagger the animations
      setTimeout(() => {
        Animated.parallel([
          Animated.timing(anim.position, {
            toValue: { 
              x: Math.cos(angle) * distance, 
              y: Math.sin(angle) * distance - 100 // Upward bias
            },
            duration: duration,
            useNativeDriver: true,
          }),
          Animated.sequence([
            Animated.timing(anim.opacity, {
              toValue: 1,
              duration: 100,
              useNativeDriver: true,
            }),
            Animated.timing(anim.opacity, {
              toValue: 0,
              duration: duration - 100,
              useNativeDriver: true,
            }),
          ]),
          Animated.timing(anim.scale, {
            toValue: 0.5 + Math.random() * 0.5,
            duration: duration,
            useNativeDriver: true,
          }),
          Animated.timing(anim.rotation, {
            toValue: Math.random() * 10,
            duration: duration,
            useNativeDriver: true,
          }),
        ]).start();
      }, index * 20);
    });
  };
  
  const rotate = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['-1deg', '1deg'],
  });
  
  // Calculate time remaining in the day
  const getTimeRemaining = () => {
    const now = new Date();
    const endOfDay = new Date();
    endOfDay.setHours(23, 59, 59, 999);
    
    const diffMs = endOfDay.getTime() - now.getTime();
    const diffHrs = Math.floor(diffMs / (1000 * 60 * 60));
    const diffMins = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
    
    return `${diffHrs}h ${diffMins}m remaining`;
  };

  return (
    <Animated.View 
      style={[
        styles.container,
        { 
          transform: [
            { scale: scaleAnim },
            { rotate: rotate }
          ],
          shadowColor: theme.text,
        }
      ]}
    >
      <LinearGradient
        colors={[theme.card, theme.cardAlt]}
        style={styles.gradientContainer}
      >
        <View style={styles.header}>
          <View style={styles.titleContainer}>
            <Trophy size={20} color={theme.secondary} />
            <Text style={[styles.title, { color: theme.secondary }]}>Daily Challenge</Text>
          </View>
          <View style={[styles.pointsContainer, { backgroundColor: theme.highlight }]}>
            <Text style={[styles.points, { color: theme.secondary }]}>{dailyChallenge.points} pts</Text>
          </View>
        </View>
        
        <View style={styles.timeContainer}>
          <Clock size={16} color={theme.textSecondary} />
          <Text style={[styles.timeText, { color: theme.textSecondary }]}>{getTimeRemaining()}</Text>
        </View>
        
        <Text style={[styles.challengeTitle, { color: theme.text }]}>{dailyChallenge.title}</Text>
        <Text style={[styles.description, { color: theme.textSecondary }]}>{dailyChallenge.description}</Text>
        
        <View style={styles.progressContainer}>
          <View style={[styles.progressBackground, { backgroundColor: theme.border }]}>
            <Animated.View 
              style={[
                styles.progressFill,
                { 
                  backgroundColor: theme.secondary,
                  width: progressAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: ['0%', '100%']
                  })
                }
              ]}
            />
          </View>
        </View>
        
        <TouchableOpacity 
          style={[
            styles.completeButton, 
            isCompleted && styles.completedButton
          ]}
          onPress={handleCompleteChallenge}
          disabled={isCompleted}
          activeOpacity={0.8}
        >
          <LinearGradient
            colors={isCompleted ? 
              [theme.success, theme.success + 'E6'] : 
              [theme.secondary, theme.secondary + 'E6']
            }
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.buttonGradient}
          >
            {isCompleted ? (
              <View style={styles.completedContent}>
                <CheckCircle size={20} color="white" />
                <Text style={styles.buttonText}>Completed</Text>
              </View>
            ) : (
              <Text style={styles.buttonText}>Mark as Complete</Text>
            )}
          </LinearGradient>
        </TouchableOpacity>
        
        {/* Confetti effect */}
        {Platform.OS !== 'web' && showConfetti && confettiAnimations.map((anim, index) => {
          const rotation = anim.rotation.interpolate({
            inputRange: [0, 10],
            outputRange: ['0deg', '360deg'],
          });
          
          return (
            <Animated.View
              key={index}
              style={[
                styles.confetti,
                {
                  backgroundColor: confettiColors[index % confettiColors.length],
                  opacity: anim.opacity,
                  transform: [
                    { translateX: anim.position.x },
                    { translateY: anim.position.y },
                    { scale: anim.scale },
                    { rotate: rotation },
                  ],
                },
              ]}
            />
          );
        })}
      </LinearGradient>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 24,
    marginHorizontal: spacing.lg,
    marginVertical: spacing.md,
    overflow: 'hidden',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 4,
  },
  gradientContainer: {
    borderRadius: 24,
    padding: spacing.lg,
    overflow: 'hidden',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  title: {
    fontSize: typography.fontSizes.lg,
    fontWeight: "600",
    marginLeft: spacing.sm,
  },
  pointsContainer: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: 16,
  },
  points: {
    fontSize: typography.fontSizes.sm,
    fontWeight: "700",
  },
  timeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  timeText: {
    fontSize: typography.fontSizes.sm,
    marginLeft: spacing.xs,
    fontWeight: "500",
  },
  challengeTitle: {
    fontSize: typography.fontSizes.xl,
    fontWeight: "700",
    marginBottom: spacing.sm,
  },
  description: {
    fontSize: typography.fontSizes.md,
    marginBottom: spacing.lg,
    lineHeight: typography.lineHeights.md,
  },
  progressContainer: {
    marginBottom: spacing.md,
  },
  progressBackground: {
    height: 8,
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 4,
  },
  completeButton: {
    borderRadius: 16,
    overflow: 'hidden',
    marginTop: spacing.sm,
  },
  completedButton: {
    
  },
  buttonGradient: {
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  completedContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: typography.fontSizes.md,
    fontWeight: "700",
    marginLeft: spacing.sm,
  },
  confetti: {
    position: 'absolute',
    width: 10,
    height: 10,
    top: '50%',
    left: '50%',
    zIndex: 10,
  },
});