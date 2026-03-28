import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  Dimensions,
  Animated,
  TextInput,
  ScrollView,
} from 'react-native';
import { router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { 
  ArrowRight, 
  Heart, 
  Shield, 
  Target, 
  User, 
  Clock,
  CheckCircle,
  Sparkles
} from 'lucide-react-native';
import { useUserStore } from '@/store/user-store';
import { useTheme } from '@/context/ThemeContext';
import { spacing, typography } from '@/constants/theme';

const { width, height } = Dimensions.get('window');

const onboardingSteps = [
  {
    id: 1,
    title: 'Welcome to Your Journey',
    subtitle: 'A path to spiritual strength and self-control',
    icon: Heart,
    description: 'This app will help you build healthy habits, track your progress, and find support when you need it most.',
  },
  {
    id: 2,
    title: 'Your Personal Information',
    subtitle: 'Help us personalize your experience',
    icon: User,
    description: 'Tell us a bit about yourself so we can provide the best support.',
  },
  {
    id: 3,
    title: 'Understanding Your Journey',
    subtitle: 'Every journey is unique',
    icon: Target,
    description: 'Help us understand your specific situation to provide tailored guidance.',
  },
  {
    id: 4,
    title: 'Emergency Support',
    subtitle: 'We are here when you need us most',
    icon: Shield,
    description: 'Set up emergency contacts and learn about our crisis support features.',
  },
  {
    id: 5,
    title: 'Ready to Begin',
    subtitle: 'Your transformation starts now',
    icon: Sparkles,
    description: 'You have everything you need to succeed. Remember, Allah is with those who persevere.',
  },
];

const addictionTypes = [
  'Pornography',
  'Social Media',
  'Gaming',
  'Substance Use',
  'Other',
];

const struggleDurations = [
  'Less than 6 months',
  '6 months - 1 year',
  '1-3 years',
  '3-5 years',
  'More than 5 years',
];

export default function OnboardingScreen() {
  const [currentStep, setCurrentStep] = useState(1);
  const [userName, setUserName] = useState('');
  const [selectedAddiction, setSelectedAddiction] = useState('');
  const [selectedDuration, setSelectedDuration] = useState('');
  const [emergencyContact, setEmergencyContact] = useState('');
  const [emergencyPhone, setEmergencyPhone] = useState('');
  
  const { setOnboarded, setUserName: saveUserName, updateUserInfo, updateSettings } = useUserStore();
  const { theme } = useTheme();
  
  // Animation values
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;
  const progressAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.8)).current;

  useEffect(() => {
    // Animate in current step
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
    ]).start();

    // Update progress bar
    Animated.timing(progressAnim, {
      toValue: (currentStep - 1) / (onboardingSteps.length - 1),
      duration: 500,
      useNativeDriver: false,
    }).start();
  }, [currentStep]);

  const nextStep = () => {
    if (currentStep < onboardingSteps.length) {
      // Animate out
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(slideAnim, {
          toValue: -50,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start(() => {
        setCurrentStep(currentStep + 1);
        // Reset animations for next step
        fadeAnim.setValue(0);
        slideAnim.setValue(50);
        scaleAnim.setValue(0.8);
      });
    } else {
      completeOnboarding();
    }
  };

  const completeOnboarding = () => {
    // Save all user data
    saveUserName(userName || 'User');
    updateUserInfo({
      addictionType: selectedAddiction,
      struggleDuration: selectedDuration,
    });
    updateSettings({
      emergencyContactName: emergencyContact,
      emergencyContactNumber: emergencyPhone,
    });
    setOnboarded(true);
    
    // Navigate to main app
    router.replace('/(tabs)');
  };

  const canProceed = () => {
    switch (currentStep) {
      case 1:
        return true;
      case 2:
        return userName.trim().length > 0;
      case 3:
        return selectedAddiction && selectedDuration;
      case 4:
        return true; // Emergency contact is optional
      case 5:
        return true;
      default:
        return false;
    }
  };

  const renderStepContent = () => {
    const step = onboardingSteps[currentStep - 1];
    const IconComponent = step.icon;

    switch (currentStep) {
      case 1:
        return (
          <Animated.View 
            style={[
              styles.stepContent,
              {
                opacity: fadeAnim,
                transform: [
                  { translateY: slideAnim },
                  { scale: scaleAnim }
                ]
              }
            ]}
          >
            <View style={[styles.iconContainer, { backgroundColor: theme.primary + '20' }]}>
              <IconComponent size={48} color={theme.primary} />
            </View>
            <Text style={[styles.stepTitle, { color: theme.text }]}>{step.title}</Text>
            <Text style={[styles.stepSubtitle, { color: theme.textSecondary }]}>{step.subtitle}</Text>
            <Text style={[styles.stepDescription, { color: theme.text }]}>{step.description}</Text>
            
            <View style={styles.featuresContainer}>
              <View style={styles.featureItem}>
                <CheckCircle size={20} color={theme.primary} />
                <Text style={[styles.featureText, { color: theme.text }]}>Daily challenges and rewards</Text>
              </View>
              <View style={styles.featureItem}>
                <CheckCircle size={20} color={theme.primary} />
                <Text style={[styles.featureText, { color: theme.text }]}>Prayer tracking and reminders</Text>
              </View>
              <View style={styles.featureItem}>
                <CheckCircle size={20} color={theme.primary} />
                <Text style={[styles.featureText, { color: theme.text }]}>AI-powered support chat</Text>
              </View>
              <View style={styles.featureItem}>
                <CheckCircle size={20} color={theme.primary} />
                <Text style={[styles.featureText, { color: theme.text }]}>Emergency crisis support</Text>
              </View>
            </View>
          </Animated.View>
        );

      case 2:
        return (
          <Animated.View 
            style={[
              styles.stepContent,
              {
                opacity: fadeAnim,
                transform: [{ translateY: slideAnim }]
              }
            ]}
          >
            <View style={[styles.iconContainer, { backgroundColor: theme.secondary + '20' }]}>
              <IconComponent size={48} color={theme.secondary} />
            </View>
            <Text style={[styles.stepTitle, { color: theme.text }]}>{step.title}</Text>
            <Text style={[styles.stepSubtitle, { color: theme.textSecondary }]}>{step.subtitle}</Text>
            
            <View style={styles.inputContainer}>
              <Text style={[styles.inputLabel, { color: theme.text }]}>What should we call you?</Text>
              <TextInput
                style={[
                  styles.textInput,
                  { 
                    backgroundColor: theme.card,
                    borderColor: theme.border,
                    color: theme.text
                  }
                ]}
                value={userName}
                onChangeText={setUserName}
                placeholder="Enter your name"
                placeholderTextColor={theme.textSecondary}
                autoFocus
              />
              <Text style={[styles.inputHint, { color: theme.textSecondary }]}>
                This will be used to personalize your experience
              </Text>
            </View>
          </Animated.View>
        );

      case 3:
        return (
          <Animated.View 
            style={[
              styles.stepContent,
              {
                opacity: fadeAnim,
                transform: [{ translateY: slideAnim }]
              }
            ]}
          >
            <View style={[styles.iconContainer, { backgroundColor: theme.primary + '20' }]}>
              <IconComponent size={48} color={theme.primary} />
            </View>
            <Text style={[styles.stepTitle, { color: theme.text }]}>{step.title}</Text>
            <Text style={[styles.stepSubtitle, { color: theme.textSecondary }]}>{step.subtitle}</Text>
            
            <ScrollView style={styles.scrollContent} showsVerticalScrollIndicator={false}>
              <View style={styles.selectionContainer}>
                <Text style={[styles.selectionTitle, { color: theme.text }]}>
                  What type of addiction are you working to overcome?
                </Text>
                {addictionTypes.map((type) => (
                  <TouchableOpacity
                    key={type}
                    style={[
                      styles.selectionItem,
                      {
                        backgroundColor: selectedAddiction === type ? theme.primary + '20' : theme.card,
                        borderColor: selectedAddiction === type ? theme.primary : theme.border,
                      }
                    ]}
                    onPress={() => setSelectedAddiction(type)}
                  >
                    <Text style={[
                      styles.selectionText,
                      { color: selectedAddiction === type ? theme.primary : theme.text }
                    ]}>
                      {type}
                    </Text>
                    {selectedAddiction === type && (
                      <CheckCircle size={20} color={theme.primary} />
                    )}
                  </TouchableOpacity>
                ))}
              </View>

              <View style={styles.selectionContainer}>
                <Text style={[styles.selectionTitle, { color: theme.text }]}>
                  How long have you been struggling with this?
                </Text>
                {struggleDurations.map((duration) => (
                  <TouchableOpacity
                    key={duration}
                    style={[
                      styles.selectionItem,
                      {
                        backgroundColor: selectedDuration === duration ? theme.primary + '20' : theme.card,
                        borderColor: selectedDuration === duration ? theme.primary : theme.border,
                      }
                    ]}
                    onPress={() => setSelectedDuration(duration)}
                  >
                    <Text style={[
                      styles.selectionText,
                      { color: selectedDuration === duration ? theme.primary : theme.text }
                    ]}>
                      {duration}
                    </Text>
                    {selectedDuration === duration && (
                      <CheckCircle size={20} color={theme.primary} />
                    )}
                  </TouchableOpacity>
                ))}
              </View>
            </ScrollView>
          </Animated.View>
        );

      case 4:
        return (
          <Animated.View 
            style={[
              styles.stepContent,
              {
                opacity: fadeAnim,
                transform: [{ translateY: slideAnim }]
              }
            ]}
          >
            <View style={[styles.iconContainer, { backgroundColor: theme.danger + '20' }]}>
              <IconComponent size={48} color={theme.danger} />
            </View>
            <Text style={[styles.stepTitle, { color: theme.text }]}>{step.title}</Text>
            <Text style={[styles.stepSubtitle, { color: theme.textSecondary }]}>{step.subtitle}</Text>
            
            <View style={styles.inputContainer}>
              <Text style={[styles.inputLabel, { color: theme.text }]}>
                Emergency Contact Name (Optional)
              </Text>
              <TextInput
                style={[
                  styles.textInput,
                  { 
                    backgroundColor: theme.card,
                    borderColor: theme.border,
                    color: theme.text
                  }
                ]}
                value={emergencyContact}
                onChangeText={setEmergencyContact}
                placeholder="Trusted friend or family member"
                placeholderTextColor={theme.textSecondary}
              />
              
              <Text style={[styles.inputLabel, { color: theme.text, marginTop: spacing.lg }]}>
                Phone Number (Optional)
              </Text>
              <TextInput
                style={[
                  styles.textInput,
                  { 
                    backgroundColor: theme.card,
                    borderColor: theme.border,
                    color: theme.text
                  }
                ]}
                value={emergencyPhone}
                onChangeText={setEmergencyPhone}
                placeholder="+1 (555) 123-4567"
                placeholderTextColor={theme.textSecondary}
                keyboardType="phone-pad"
              />
              
              <Text style={[styles.inputHint, { color: theme.textSecondary }]}>
                This person can be contacted during crisis moments for immediate support
              </Text>
            </View>
          </Animated.View>
        );

      case 5:
        return (
          <Animated.View 
            style={[
              styles.stepContent,
              {
                opacity: fadeAnim,
                transform: [
                  { translateY: slideAnim },
                  { scale: scaleAnim }
                ]
              }
            ]}
          >
            <View style={[styles.iconContainer, { backgroundColor: theme.primary + '20' }]}>
              <IconComponent size={48} color={theme.primary} />
            </View>
            <Text style={[styles.stepTitle, { color: theme.text }]}>{step.title}</Text>
            <Text style={[styles.stepSubtitle, { color: theme.textSecondary }]}>{step.subtitle}</Text>
            <Text style={[styles.stepDescription, { color: theme.text }]}>{step.description}</Text>
            
            <View style={[styles.readyCard, { backgroundColor: theme.card, borderColor: theme.border }]}>
              <Text style={[styles.readyTitle, { color: theme.primary }]}>
                "And whoever relies upon Allah - then He is sufficient for him. Indeed, Allah will accomplish His purpose."
              </Text>
              <Text style={[styles.readySource, { color: theme.textSecondary }]}>
                - Quran 65:3
              </Text>
            </View>
          </Animated.View>
        );

      default:
        return null;
    }
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      <LinearGradient
        colors={[theme.background, theme.card + '50']}
        style={styles.gradient}
      >
        {/* Progress Bar */}
        <View style={styles.progressContainer}>
          <View style={[styles.progressTrack, { backgroundColor: theme.border }]}>
            <Animated.View
              style={[
                styles.progressFill,
                {
                  backgroundColor: theme.primary,
                  width: progressAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: ['0%', '100%']
                  })
                }
              ]}
            />
          </View>
          <Text style={[styles.progressText, { color: theme.textSecondary }]}>
            {currentStep} of {onboardingSteps.length}
          </Text>
        </View>

        {/* Step Content */}
        <View style={styles.contentContainer}>
          {renderStepContent()}
        </View>

        {/* Navigation */}
        <View style={styles.navigationContainer}>
          <TouchableOpacity
            style={[
              styles.nextButton,
              {
                backgroundColor: canProceed() ? theme.primary : theme.disabled,
                opacity: canProceed() ? 1 : 0.5
              }
            ]}
            onPress={nextStep}
            disabled={!canProceed()}
          >
            <Text style={styles.nextButtonText}>
              {currentStep === onboardingSteps.length ? 'Begin Journey' : 'Continue'}
            </Text>
            <ArrowRight size={20} color="white" />
          </TouchableOpacity>
        </View>
      </LinearGradient>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gradient: {
    flex: 1,
  },
  progressContainer: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.lg,
    paddingBottom: spacing.md,
  },
  progressTrack: {
    height: 4,
    borderRadius: 2,
    marginBottom: spacing.sm,
  },
  progressFill: {
    height: '100%',
    borderRadius: 2,
  },
  progressText: {
    fontSize: typography.fontSizes.sm,
    textAlign: 'center',
    fontWeight: '600',
  },
  contentContainer: {
    flex: 1,
    paddingHorizontal: spacing.lg,
  },
  stepContent: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconContainer: {
    width: 96,
    height: 96,
    borderRadius: 48,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.xl,
  },
  stepTitle: {
    fontSize: typography.fontSizes['3xl'],
    fontWeight: '800',
    textAlign: 'center',
    marginBottom: spacing.sm,
  },
  stepSubtitle: {
    fontSize: typography.fontSizes.lg,
    textAlign: 'center',
    marginBottom: spacing.lg,
    fontWeight: '500',
  },
  stepDescription: {
    fontSize: typography.fontSizes.md,
    textAlign: 'center',
    lineHeight: typography.lineHeights.md,
    marginBottom: spacing.xl,
  },
  featuresContainer: {
    width: '100%',
    maxWidth: 300,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  featureText: {
    fontSize: typography.fontSizes.md,
    marginLeft: spacing.sm,
    flex: 1,
  },
  inputContainer: {
    width: '100%',
    maxWidth: 300,
  },
  inputLabel: {
    fontSize: typography.fontSizes.md,
    fontWeight: '600',
    marginBottom: spacing.sm,
  },
  textInput: {
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    fontSize: typography.fontSizes.md,
    marginBottom: spacing.sm,
  },
  inputHint: {
    fontSize: typography.fontSizes.sm,
    textAlign: 'center',
    lineHeight: typography.lineHeights.sm,
  },
  scrollContent: {
    width: '100%',
    maxHeight: height * 0.5,
  },
  selectionContainer: {
    marginBottom: spacing.xl,
  },
  selectionTitle: {
    fontSize: typography.fontSizes.lg,
    fontWeight: '600',
    marginBottom: spacing.md,
    textAlign: 'center',
  },
  selectionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    borderWidth: 1,
    borderRadius: 12,
    marginBottom: spacing.sm,
  },
  selectionText: {
    fontSize: typography.fontSizes.md,
    flex: 1,
  },
  readyCard: {
    width: '100%',
    maxWidth: 320,
    padding: spacing.lg,
    borderRadius: 16,
    borderWidth: 1,
    marginTop: spacing.lg,
  },
  readyTitle: {
    fontSize: typography.fontSizes.lg,
    fontWeight: '600',
    textAlign: 'center',
    lineHeight: typography.lineHeights.lg,
    marginBottom: spacing.sm,
    fontStyle: 'italic',
  },
  readySource: {
    fontSize: typography.fontSizes.md,
    textAlign: 'center',
    fontWeight: '500',
  },
  navigationContainer: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.xl,
  },
  nextButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.lg,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 6,
  },
  nextButtonText: {
    color: 'white',
    fontSize: typography.fontSizes.lg,
    fontWeight: '700',
    marginRight: spacing.sm,
  },
});