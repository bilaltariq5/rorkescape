import React, { useState, useEffect, useRef } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  Animated, 
  TouchableOpacity,
  Dimensions,
  Platform
} from 'react-native';
import { Trophy, X, Star, Crown } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useUserStore } from '@/store/user-store';
import { typography, spacing } from '@/constants/theme';
import { useTheme } from '@/context/ThemeContext';

const { width, height } = Dimensions.get('window');

interface RewardNotificationProps {
  visible?: boolean;
  onClose?: () => void;
}

export default function RewardNotification({ visible, onClose }: RewardNotificationProps) {
  const { stats, rewardNotification, clearRewardNotification } = useUserStore();
  const { theme } = useTheme();
  const [isVisible, setIsVisible] = useState(false);
  
  // Animation values
  const slideAnim = useRef(new Animated.Value(-height)).current;
  const scaleAnim = useRef(new Animated.Value(0.8)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;
  const rotateAnim = useRef(new Animated.Value(0)).current;
  
  // Confetti animations
  const confettiCount = 20;
  const confettiAnimations = Array(confettiCount).fill(0).map(() => ({
    position: useRef(new Animated.ValueXY({ x: 0, y: 0 })).current,
    opacity: useRef(new Animated.Value(0)).current,
    scale: useRef(new Animated.Value(0)).current,
    rotation: useRef(new Animated.Value(0)).current,
  }));
  
  useEffect(() => {
    if (rewardNotification) {
      setIsVisible(true);
      showNotification();
    }
  }, [rewardNotification]);
  
  const showNotification = () => {
    // Reset animations
    slideAnim.setValue(-height);
    scaleAnim.setValue(0.8);
    opacityAnim.setValue(0);
    rotateAnim.setValue(0);
    
    // Show notification
    Animated.parallel([
      Animated.spring(slideAnim, {
        toValue: 0,
        friction: 8,
        tension: 40,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 8,
        tension: 40,
        useNativeDriver: true,
      }),
      Animated.timing(opacityAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start();
    
    // Trophy rotation
    Animated.loop(
      Animated.timing(rotateAnim, {
        toValue: 1,
        duration: 2000,
        useNativeDriver: true,
      })
    ).start();
    
    // Trigger confetti
    if (Platform.OS !== 'web') {
      triggerConfetti();
    }
    
    // Auto hide after 4 seconds
    setTimeout(() => {
      hideNotification();
    }, 4000);
  };
  
  const hideNotification = () => {
    Animated.parallel([
      Animated.timing(slideAnim, {
        toValue: -height,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(opacityAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start(() => {
      setIsVisible(false);
      clearRewardNotification();
      onClose?.();
    });
  };
  
  const triggerConfetti = () => {
    confettiAnimations.forEach((anim, index) => {
      // Reset values
      anim.position.setValue({ x: 0, y: 0 });
      anim.opacity.setValue(0);
      anim.scale.setValue(0);
      anim.rotation.setValue(0);
      
      // Random properties
      const angle = Math.random() * Math.PI * 2;
      const distance = 100 + Math.random() * 200;
      const duration = 1500 + Math.random() * 1000;
      
      // Stagger animations
      setTimeout(() => {
        Animated.parallel([
          Animated.timing(anim.position, {
            toValue: { 
              x: Math.cos(angle) * distance, 
              y: Math.sin(angle) * distance + 200
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
            toValue: 0.5 + Math.random() * 0.8,
            duration: duration,
            useNativeDriver: true,
          }),
          Animated.timing(anim.rotation, {
            toValue: Math.random() * 10,
            duration: duration,
            useNativeDriver: true,
          }),
        ]).start();
      }, index * 30);
    });
  };
  
  const rotation = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });
  
  if (!isVisible || !rewardNotification) {
    return null;
  }
  
  const { level, title, points } = rewardNotification;
  
  return (
    <View style={styles.overlay}>
      <Animated.View 
        style={[
          styles.container,
          {
            transform: [
              { translateY: slideAnim },
              { scale: scaleAnim }
            ],
            opacity: opacityAnim,
          }
        ]}
      >
        <LinearGradient
          colors={[theme.primary, theme.secondary]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.gradient}
        >
          <TouchableOpacity 
            style={styles.closeButton}
            onPress={hideNotification}
          >
            <X size={20} color="white" />
          </TouchableOpacity>
          
          <View style={styles.content}>
            <Animated.View 
              style={[
                styles.iconContainer,
                { transform: [{ rotate: rotation }] }
              ]}
            >
              {level >= 10 ? (
                <Crown size={50} color="#FFD700" />
              ) : level >= 5 ? (
                <Trophy size={50} color="#FFD700" />
              ) : (
                <Star size={50} color="#FFD700" />
              )}
            </Animated.View>
            
            <Text style={styles.congratsText}>Congratulations!</Text>
            <Text style={styles.levelText}>Level {level} Unlocked</Text>
            <Text style={styles.titleText}>{title}</Text>
            <Text style={styles.pointsText}>{points} Points Earned</Text>
            
            <View style={styles.messageContainer}>
              <Text style={styles.messageText}>
                You have reached a new level in your spiritual journey. Keep up the excellent work!
              </Text>
            </View>
          </View>
          
          {/* Confetti particles */}
          {Platform.OS !== 'web' && confettiAnimations.map((anim, index) => {
            const particleRotation = anim.rotation.interpolate({
              inputRange: [0, 10],
              outputRange: ['0deg', '360deg'],
            });
            
            const colors = [theme.primary, theme.secondary, '#FFD700', '#FF6B6B', '#4ECDC4'];
            
            return (
              <Animated.View
                key={index}
                style={[
                  styles.confetti,
                  {
                    backgroundColor: colors[index % colors.length],
                    opacity: anim.opacity,
                    transform: [
                      { translateX: anim.position.x },
                      { translateY: anim.position.y },
                      { scale: anim.scale },
                      { rotate: particleRotation },
                    ],
                  },
                ]}
              />
            );
          })}
        </LinearGradient>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
    pointerEvents: 'box-none',
  },
  container: {
    width: width * 0.9,
    maxWidth: 350,
    borderRadius: 24,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 10,
  },
  gradient: {
    padding: spacing.xl,
    alignItems: 'center',
    position: 'relative',
  },
  closeButton: {
    position: 'absolute',
    top: spacing.md,
    right: spacing.md,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 10,
  },
  content: {
    alignItems: 'center',
    paddingTop: spacing.md,
  },
  iconContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.lg,
    borderWidth: 3,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  congratsText: {
    fontSize: typography.fontSizes['2xl'],
    fontWeight: "700",
    color: 'white',
    marginBottom: spacing.xs,
    textAlign: 'center',
  },
  levelText: {
    fontSize: typography.fontSizes.xl,
    fontWeight: "600",
    color: 'white',
    marginBottom: spacing.sm,
    textAlign: 'center',
  },
  titleText: {
    fontSize: typography.fontSizes.lg,
    fontWeight: "500",
    color: 'rgba(255, 255, 255, 0.9)',
    marginBottom: spacing.sm,
    textAlign: 'center',
  },
  pointsText: {
    fontSize: typography.fontSizes.md,
    fontWeight: "600",
    color: '#FFD700',
    marginBottom: spacing.lg,
    textAlign: 'center',
  },
  messageContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 16,
    padding: spacing.md,
    marginTop: spacing.sm,
  },
  messageText: {
    fontSize: typography.fontSizes.sm,
    color: 'rgba(255, 255, 255, 0.9)',
    textAlign: 'center',
    lineHeight: typography.lineHeights.sm,
  },
  confetti: {
    position: 'absolute',
    width: 8,
    height: 8,
    borderRadius: 4,
    top: '50%',
    left: '50%',
  },
});