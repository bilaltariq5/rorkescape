import React, { useState, useRef, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  Modal, 
  ScrollView, 
  Animated, 
  Dimensions,
  Vibration,
  Platform
} from 'react-native';
import { AlertTriangle, X, Phone, MessageSquare, Shield, Clock, Wind } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Colors from '@/constants/colors';
import { emergencyReminders } from '@/constants/quotes';
import { useUserStore } from '@/store/user-store';
import { Linking } from 'react-native';
import { typography, spacing, globalStyles } from '@/constants/theme';

const { width, height } = Dimensions.get('window');
const BREATHING_DURATION = 8000; // 8 seconds per breath cycle

interface EmergencyButtonProps {
  modalVisible: boolean;
  onClose: () => void;
}

export default function EmergencyButton({ modalVisible, onClose }: EmergencyButtonProps) {
  const [activeTab, setActiveTab] = useState('reminders');
  const [breathingPhase, setBreathingPhase] = useState('inhale');
  const { settings, useEmergencyTool } = useUserStore();
  
  // Animation values
  const breatheAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(height)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const tabAnim = useRef(new Animated.Value(0)).current;
  
  // Start breathing animation when modal is visible
  useEffect(() => {
    if (modalVisible) {
      // Slide in animation
      Animated.spring(slideAnim, {
        toValue: 0,
        tension: 30,
        friction: 8,
        useNativeDriver: true,
      }).start();
      
      // Fade in animation
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }).start();
      
      // Vibrate on open (if not web)
      if (Platform.OS !== 'web') {
        Vibration.vibrate([0, 100, 100, 100]);
      }

      // Track emergency tool usage
      useEmergencyTool(true);
    } else {
      // Reset animations when modal closes
      slideAnim.setValue(height);
      fadeAnim.setValue(0);
      
      // Stop breathing animation
      breatheAnim.stopAnimation();
    }
  }, [modalVisible]);
  
  // Breathing animation effect
  useEffect(() => {
    if (activeTab === 'breathing' && modalVisible) {
      const startBreathingCycle = () => {
        // Reset animation
        breatheAnim.setValue(0);
        
        const breathingLoop = Animated.loop(
          Animated.sequence([
            // Inhale phase
            Animated.timing(breatheAnim, {
              toValue: 1,
              duration: 4000, // 4 seconds inhale
              useNativeDriver: false,
            }),
            // Hold phase
            Animated.timing(breatheAnim, {
              toValue: 1,
              duration: 2000, // 2 seconds hold
              useNativeDriver: false,
            }),
            // Exhale phase
            Animated.timing(breatheAnim, {
              toValue: 0,
              duration: 4000, // 4 seconds exhale
              useNativeDriver: false,
            }),
          ])
        );
        
        breathingLoop.start();
        
        // Update breathing phase text
        const phaseInterval = setInterval(() => {
          breatheAnim.addListener(({ value }) => {
            if (value < 0.1) {
              setBreathingPhase('inhale');
            } else if (value > 0.9) {
              setBreathingPhase('hold');
            } else if (value > 0.5) {
              setBreathingPhase('exhale');
            }
          });
        }, 100);
        
        return () => {
          clearInterval(phaseInterval);
          breathingLoop.stop();
        };
      };
      
      const cleanup = startBreathingCycle();
      return cleanup;
    }
  }, [activeTab, modalVisible]);

  // Tab transition animation
  useEffect(() => {
    Animated.timing(tabAnim, {
      toValue: activeTab === 'reminders' ? 0 : activeTab === 'breathing' ? 1 : 2,
      duration: 300,
      useNativeDriver: false,
    }).start();
  }, [activeTab]);

  const closeModal = () => {
    // Slide out animation
    Animated.timing(slideAnim, {
      toValue: height,
      duration: 300,
      useNativeDriver: true,
    }).start(() => {
      onClose();
    });
    
    // Fade out animation
    Animated.timing(fadeAnim, {
      toValue: 0,
      duration: 200,
      useNativeDriver: true,
    }).start();
  };

  const callEmergencyContact = () => {
    if (settings.emergencyContactNumber) {
      Linking.openURL(`tel:${settings.emergencyContactNumber}`);
    }
  };

  const textEmergencyContact = () => {
    if (settings.emergencyContactNumber) {
      Linking.openURL(`sms:${settings.emergencyContactNumber}`);
    }
  };
  
  const getBreathingText = () => {
    switch (breathingPhase) {
      case 'inhale':
        return 'Breathe In...';
      case 'hold':
        return 'Hold...';
      case 'exhale':
        return 'Breathe Out...';
      default:
        return 'Breathe In...';
    }
  };
  
  const renderRemindersTab = () => {
    return (
      <ScrollView style={styles.tabContent}>
        <Text style={styles.reminderTitle}>Remember:</Text>
        {emergencyReminders.map((reminder, index) => (
          <Animated.View 
            key={index} 
            style={[
              styles.reminderItem,
              { 
                opacity: fadeAnim,
                transform: [
                  { 
                    translateY: fadeAnim.interpolate({
                      inputRange: [0, 1],
                      outputRange: [50, 0]
                    })
                  }
                ]
              }
            ]}
          >
            <LinearGradient
              colors={[Colors.primary + '20', Colors.primary + '05']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.reminderGradient}
            >
              <Text style={styles.reminderNumber}>{index + 1}</Text>
              <Text style={styles.reminderText}>{reminder}</Text>
            </LinearGradient>
          </Animated.View>
        ))}
      </ScrollView>
    );
  };
  
  const renderBreathingTab = () => {
    const circleSize = breatheAnim.interpolate({
      inputRange: [0, 1],
      outputRange: [100, 200]
    });
    
    return (
      <ScrollView style={styles.tabContent} contentContainerStyle={styles.breathingScrollContent}>
        <View style={styles.breathingContainer}>
          <Text style={styles.breathingTitle}>
            Take a moment to breathe deeply
          </Text>
          <Text style={styles.breathingSubtitle}>
            Focus on your breath and remember Allah
          </Text>
          
          <View style={styles.breathingCircleContainer}>
            <Animated.View
              style={[
                styles.breathingCircleOuter,
                {
                  width: circleSize,
                  height: circleSize,
                  borderRadius: circleSize.interpolate({
                    inputRange: [100, 200],
                    outputRange: [50, 100]
                  })
                }
              ]}
            />
            
            <View style={styles.breathingCircleInner}>
              <Wind size={30} color={Colors.primary} />
            </View>
            
            <Text style={styles.breathingText}>
              {getBreathingText()}
            </Text>
            
            <View style={styles.breathingTimer}>
              <Clock size={16} color={Colors.textSecondary} />
              <Text style={styles.breathingTimerText}>
                Continue for at least 2 minutes
              </Text>
            </View>
          </View>
          
          <View style={styles.breathingInstructions}>
            <Text style={styles.instructionTitle}>While breathing:</Text>
            <Text style={styles.instructionText}>
              1. Recite "Astaghfirullah" (I seek forgiveness from Allah)
            </Text>
            <Text style={styles.instructionText}>
              2. Remember that this urge is temporary
            </Text>
            <Text style={styles.instructionText}>
              3. Visualize yourself succeeding in your goal
            </Text>
          </View>
        </View>
      </ScrollView>
    );
  };
  
  const renderContactTab = () => {
    return (
      <ScrollView style={styles.tabContent} contentContainerStyle={styles.contactScrollContent}>
        <View style={styles.contactTabContainer}>
          {settings.emergencyContactName ? (
            <View style={styles.contactSection}>
              <Shield size={40} color={Colors.primary} style={styles.contactIcon} />
              <Text style={styles.contactTitle}>Your Emergency Contact</Text>
              <Text style={styles.contactName}>{settings.emergencyContactName}</Text>
              
              <View style={styles.contactButtons}>
                <TouchableOpacity 
                  style={styles.contactButton} 
                  onPress={callEmergencyContact}
                >
                  <LinearGradient
                    colors={[Colors.primary, Colors.primary + 'E6']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={styles.contactButtonGradient}
                  >
                    <Phone size={20} color="white" />
                    <Text style={styles.contactButtonText}>Call Now</Text>
                  </LinearGradient>
                </TouchableOpacity>
                
                <TouchableOpacity 
                  style={styles.contactButton} 
                  onPress={textEmergencyContact}
                >
                  <LinearGradient
                    colors={[Colors.secondary, Colors.secondary + 'E6']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={styles.contactButtonGradient}
                  >
                    <MessageSquare size={20} color="white" />
                    <Text style={styles.contactButtonText}>Message</Text>
                  </LinearGradient>
                </TouchableOpacity>
              </View>
              
              <Text style={styles.contactAdvice}>
                Reaching out for help is a sign of strength, not weakness.
              </Text>
            </View>
          ) : (
            <View style={styles.noContactContainer}>
              <Shield size={60} color={Colors.disabled} />
              <Text style={styles.noContactTitle}>No Emergency Contact Set</Text>
              <Text style={styles.noContactText}>
                Add an emergency contact in the settings to enable this feature.
              </Text>
            </View>
          )}
          
          <View style={styles.alternativeActions}>
            <Text style={styles.alternativeTitle}>Alternative Actions:</Text>
            
            <TouchableOpacity style={styles.alternativeButton}>
              <View style={styles.alternativeIcon}>
                <AlertTriangle size={20} color={Colors.danger} />
              </View>
              <View style={styles.alternativeInfo}>
                <Text style={styles.alternativeLabel}>Leave this environment</Text>
                <Text style={styles.alternativeDescription}>
                  Go for a walk or change your location immediately
                </Text>
              </View>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.alternativeButton}>
              <View style={styles.alternativeIcon}>
                <Clock size={20} color={Colors.primary} />
              </View>
              <View style={styles.alternativeInfo}>
                <Text style={styles.alternativeLabel}>Wait 5 minutes</Text>
                <Text style={styles.alternativeDescription}>
                  Urges typically pass if you can delay acting on them
                </Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    );
  };

  return (
    <Modal
      animationType="none"
      transparent={false}
      visible={modalVisible}
      onRequestClose={closeModal}
    >
      <View style={styles.modalOverlay}>
        <Animated.View 
          style={[
            styles.modalContainer,
            { 
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }]
            }
          ]}
        >
          <LinearGradient
            colors={['#FFFFFF', '#F9FAFB']}
            style={styles.modalGradient}
          >
            <View style={styles.modalHeader}>
              <View style={styles.headerContent}>
                <AlertTriangle size={24} color={Colors.danger} />
                <Text style={styles.modalTitle}>Emergency Support</Text>
              </View>
              <TouchableOpacity onPress={closeModal} style={styles.closeButton}>
                <X size={24} color={Colors.text} />
              </TouchableOpacity>
            </View>
            
            <Text style={styles.modalSubtitle}>
              You are stronger than this moment. Take a deep breath.
            </Text>
            
            <View style={styles.tabsContainer}>
              <TouchableOpacity 
                style={[styles.tab, activeTab === 'reminders' && styles.activeTab]}
                onPress={() => setActiveTab('reminders')}
              >
                <Text style={[styles.tabText, activeTab === 'reminders' && styles.activeTabText]}>
                  Reminders
                </Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={[styles.tab, activeTab === 'breathing' && styles.activeTab]}
                onPress={() => setActiveTab('breathing')}
              >
                <Text style={[styles.tabText, activeTab === 'breathing' && styles.activeTabText]}>
                  Breathing
                </Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={[styles.tab, activeTab === 'contact' && styles.activeTab]}
                onPress={() => setActiveTab('contact')}
              >
                <Text style={[styles.tabText, activeTab === 'contact' && styles.activeTabText]}>
                  Contact
                </Text>
              </TouchableOpacity>
            </View>
            
            <View style={styles.tabContentContainer}>
              {activeTab === 'reminders' && renderRemindersTab()}
              {activeTab === 'breathing' && renderBreathingTab()}
              {activeTab === 'contact' && renderContactTab()}
            </View>
          </LinearGradient>
        </Animated.View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'flex-end',
  },
  modalContainer: {
    backgroundColor: Colors.card,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: '85%',
    overflow: 'hidden',
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: -4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    elevation: 8,
  },
  modalGradient: {
    width: '100%',
    height: '100%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.lg,
    paddingBottom: spacing.md,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: typography.fontSizes['2xl'],
    fontWeight: "700",
    color: Colors.text,
    marginLeft: spacing.sm,
  },
  closeButton: {
    padding: spacing.xs,
    backgroundColor: Colors.background,
    borderRadius: 20,
  },
  modalSubtitle: {
    fontSize: typography.fontSizes.md,
    color: Colors.textSecondary,
    marginBottom: spacing.lg,
    lineHeight: typography.lineHeights.md,
    paddingHorizontal: spacing.lg,
    textAlign: 'center',
  },
  tabsContainer: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
    paddingHorizontal: spacing.lg,
    backgroundColor: Colors.background,
  },
  tab: {
    paddingVertical: spacing.md,
    marginRight: spacing.lg,
  },
  activeTab: {
    borderBottomWidth: 3,
    borderBottomColor: Colors.primary,
  },
  tabText: {
    fontSize: typography.fontSizes.md,
    color: Colors.textSecondary,
  },
  activeTabText: {
    color: Colors.primary,
    fontWeight: "700",
  },
  tabContentContainer: {
    flex: 1,
  },
  tabContent: {
    flex: 1,
    padding: spacing.lg,
  },
  breathingScrollContent: {
    flexGrow: 1,
    paddingBottom: spacing.xl,
  },
  contactScrollContent: {
    flexGrow: 1,
    paddingBottom: spacing.xl,
  },
  reminderTitle: {
    fontSize: typography.fontSizes.xl,
    fontWeight: "600",
    color: Colors.text,
    marginBottom: spacing.md,
  },
  reminderItem: {
    marginBottom: spacing.md,
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: Colors.text,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  reminderGradient: {
    flexDirection: 'row',
    padding: spacing.md,
    alignItems: 'flex-start',
  },
  reminderNumber: {
    backgroundColor: Colors.primary,
    color: 'white',
    width: 28,
    height: 28,
    borderRadius: 14,
    textAlign: 'center',
    lineHeight: 28,
    marginRight: spacing.md,
    fontWeight: "700",
    fontSize: typography.fontSizes.sm,
  },
  reminderText: {
    fontSize: typography.fontSizes.md,
    color: Colors.text,
    flex: 1,
    lineHeight: typography.lineHeights.md,
  },
  breathingContainer: {
    alignItems: 'center',
  },
  breathingTitle: {
    fontSize: typography.fontSizes.xl,
    fontWeight: "600",
    color: Colors.text,
    marginBottom: spacing.sm,
    textAlign: 'center',
  },
  breathingSubtitle: {
    fontSize: typography.fontSizes.md,
    color: Colors.textSecondary,
    marginBottom: spacing.xl,
    textAlign: 'center',
  },
  breathingCircleContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: spacing.xl,
    height: 240,
  },
  breathingCircleOuter: {
    position: 'absolute',
    backgroundColor: Colors.primary + '10',
    borderWidth: 2,
    borderColor: Colors.primary + '30',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 5,
  },
  breathingCircleInner: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: 'white',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: Colors.text,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
  },
  breathingText: {
    position: 'absolute',
    bottom: -40,
    fontSize: typography.fontSizes.xl,
    fontWeight: "600",
    color: Colors.primary,
  },
  breathingTimer: {
    position: 'absolute',
    top: -30,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.highlight,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: 20,
  },
  breathingTimerText: {
    fontSize: typography.fontSizes.sm,
    color: Colors.textSecondary,
    marginLeft: spacing.xs,
  },
  breathingInstructions: {
    backgroundColor: Colors.highlight,
    padding: spacing.md,
    borderRadius: 16,
    width: '100%',
    marginTop: spacing.lg,
    shadowColor: Colors.text,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  instructionTitle: {
    fontSize: typography.fontSizes.md,
    fontWeight: "600",
    color: Colors.text,
    marginBottom: spacing.sm,
  },
  instructionText: {
    fontSize: typography.fontSizes.md,
    color: Colors.text,
    marginBottom: spacing.sm,
    lineHeight: typography.lineHeights.md,
  },
  contactTabContainer: {
    flex: 1,
  },
  contactSection: {
    backgroundColor: Colors.highlight,
    borderRadius: 16,
    padding: spacing.lg,
    alignItems: 'center',
    marginBottom: spacing.lg,
    shadowColor: Colors.text,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  contactIcon: {
    marginBottom: spacing.md,
  },
  contactTitle: {
    fontSize: typography.fontSizes.md,
    color: Colors.textSecondary,
    marginBottom: spacing.xs,
  },
  contactName: {
    fontSize: typography.fontSizes['2xl'],
    fontWeight: "700",
    color: Colors.text,
    marginBottom: spacing.md,
  },
  contactButtons: {
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-between',
    marginBottom: spacing.md,
  },
  contactButton: {
    flex: 1,
    marginHorizontal: spacing.xs,
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: Colors.text,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  contactButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.md,
  },
  contactButtonText: {
    color: 'white',
    fontWeight: "600",
    marginLeft: spacing.sm,
    fontSize: typography.fontSizes.md,
  },
  contactAdvice: {
    fontSize: typography.fontSizes.sm,
    color: Colors.textSecondary,
    fontStyle: 'italic',
    textAlign: 'center',
    marginTop: spacing.sm,
  },
  noContactContainer: {
    backgroundColor: Colors.highlight,
    borderRadius: 16,
    padding: spacing.lg,
    alignItems: 'center',
    marginBottom: spacing.lg,
    shadowColor: Colors.text,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  noContactTitle: {
    fontSize: typography.fontSizes.lg,
    fontWeight: "600",
    color: Colors.text,
    marginTop: spacing.md,
    marginBottom: spacing.sm,
  },
  noContactText: {
    fontSize: typography.fontSizes.md,
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: typography.lineHeights.md,
  },
  alternativeActions: {
    marginTop: spacing.sm,
  },
  alternativeTitle: {
    fontSize: typography.fontSizes.lg,
    fontWeight: "600",
    color: Colors.text,
    marginBottom: spacing.md,
  },
  alternativeButton: {
    flexDirection: 'row',
    backgroundColor: Colors.card,
    borderRadius: 16,
    padding: spacing.md,
    marginBottom: spacing.md,
    borderWidth: 1,
    borderColor: Colors.border,
    shadowColor: Colors.text,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  alternativeIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.highlight,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
  },
  alternativeInfo: {
    flex: 1,
  },
  alternativeLabel: {
    fontSize: typography.fontSizes.md,
    fontWeight: "600",
    color: Colors.text,
    marginBottom: spacing.xs,
  },
  alternativeDescription: {
    fontSize: typography.fontSizes.sm,
    color: Colors.textSecondary,
    lineHeight: typography.lineHeights.sm,
  },
});