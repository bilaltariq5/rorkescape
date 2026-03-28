import React, { useState, useRef, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  ScrollView,
  Animated,
  Dimensions
} from 'react-native';
import { Check, Clock, Sun, Sunset, Moon } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useUserStore } from '@/store/user-store';
import { useTheme } from '@/context/ThemeContext';
import { spacing, typography } from '@/constants/theme';

const { width } = Dimensions.get('window');

const prayers = [
  { key: 'fajr', name: 'Fajr', icon: Sun, time: 'Dawn' },
  { key: 'dhuhr', name: 'Dhuhr', icon: Sun, time: 'Midday' },
  { key: 'asr', name: 'Asr', icon: Sun, time: 'Afternoon' },
  { key: 'maghrib', name: 'Maghrib', icon: Sunset, time: 'Sunset' },
  { key: 'isha', name: 'Isha', icon: Moon, time: 'Night' }
];

export default function PrayerTracker() {
  const { stats, recordPrayer } = useUserStore();
  const { theme } = useTheme();
  const [selectedPrayers, setSelectedPrayers] = useState<{[key: string]: boolean}>({});
  const scrollViewRef = useRef<ScrollView>(null);
  
  // Animation values
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;
  
  useEffect(() => {
    // Fade in animation
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
    ]).start();
    
    // Load today's prayer records
    const today = new Date().toISOString().split('T')[0];
    const todayRecord = stats.prayerRecords.find(record => record.date === today);
    
    if (todayRecord) {
      setSelectedPrayers({
        fajr: todayRecord.fajr,
        dhuhr: todayRecord.dhuhr,
        asr: todayRecord.asr,
        maghrib: todayRecord.maghrib,
        isha: todayRecord.isha,
      });
    }
  }, [stats.prayerRecords]);
  
  const togglePrayer = (prayerKey: string) => {
    const newState = !selectedPrayers[prayerKey];
    
    setSelectedPrayers(prev => ({
      ...prev,
      [prayerKey]: newState
    }));
    
    // Record in store
    recordPrayer({ [prayerKey]: newState });
    
    // Auto-scroll to show all prayers when one is selected
    if (newState && scrollViewRef.current) {
      // Calculate position to scroll to show all prayers
      const prayerIndex = prayers.findIndex(p => p.key === prayerKey);
      const scrollPosition = Math.max(0, (prayerIndex - 1) * 100); // Adjust based on item width
      
      scrollViewRef.current.scrollTo({
        x: scrollPosition,
        animated: true
      });
    }
  };
  
  const completedCount = Object.values(selectedPrayers).filter(Boolean).length;
  const completionPercentage = (completedCount / prayers.length) * 100;
  
  return (
    <Animated.View 
      style={[
        styles.container,
        { 
          backgroundColor: theme.card,
          opacity: fadeAnim,
          transform: [{ translateY: slideAnim }]
        }
      ]}
    >
      <LinearGradient
        colors={[theme.card, theme.background + '80']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.gradient}
      >
        <View style={styles.header}>
          <View style={styles.titleSection}>
            <Clock size={24} color={theme.primary} />
            <Text style={[styles.title, { color: theme.text }]}>Prayer Tracker</Text>
          </View>
          
          <View style={styles.progressSection}>
            <Text style={[styles.progressText, { color: theme.textSecondary }]}>
              {completedCount}/{prayers.length}
            </Text>
            <View style={[styles.progressBar, { backgroundColor: theme.border }]}>
              <Animated.View 
                style={[
                  styles.progressFill,
                  { 
                    backgroundColor: theme.primary,
                    width: `${completionPercentage}%`
                  }
                ]}
              />
            </View>
          </View>
        </View>
        
        <ScrollView 
          ref={scrollViewRef}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.prayersContainer}
          style={styles.scrollView}
        >
          {prayers.map((prayer, index) => {
            const isCompleted = selectedPrayers[prayer.key];
            const IconComponent = prayer.icon;
            
            return (
              <Animated.View
                key={prayer.key}
                style={[
                  styles.prayerItemContainer,
                  {
                    opacity: fadeAnim,
                    transform: [
                      {
                        translateY: fadeAnim.interpolate({
                          inputRange: [0, 1],
                          outputRange: [30, 0]
                        })
                      }
                    ]
                  }
                ]}
              >
                <TouchableOpacity
                  style={[
                    styles.prayerItem,
                    { 
                      backgroundColor: isCompleted ? theme.primary + '20' : theme.background,
                      borderColor: isCompleted ? theme.primary : theme.border
                    }
                  ]}
                  onPress={() => togglePrayer(prayer.key)}
                  activeOpacity={0.7}
                >
                  <View style={styles.prayerIconContainer}>
                    {isCompleted ? (
                      <View style={[styles.checkIcon, { backgroundColor: theme.primary }]}>
                        <Check size={16} color="white" />
                      </View>
                    ) : (
                      <IconComponent size={20} color={theme.textSecondary} />
                    )}
                  </View>
                  
                  <Text style={[
                    styles.prayerName,
                    { 
                      color: isCompleted ? theme.primary : theme.text,
                      fontWeight: isCompleted ? "700" : "600"
                    }
                  ]}>
                    {prayer.name}
                  </Text>
                  
                  <Text style={[
                    styles.prayerTime,
                    { color: theme.textSecondary }
                  ]}>
                    {prayer.time}
                  </Text>
                </TouchableOpacity>
              </Animated.View>
            );
          })}
        </ScrollView>
        
        {completedCount === prayers.length && (
          <Animated.View 
            style={[
              styles.completionMessage,
              { backgroundColor: theme.primary + '10' }
            ]}
          >
            <Text style={[styles.completionText, { color: theme.primary }]}>
              🎉 All prayers completed today! May Allah accept your worship.
            </Text>
          </Animated.View>
        )}
      </LinearGradient>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginHorizontal: spacing.lg,
    borderRadius: 20,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 6,
  },
  gradient: {
    padding: spacing.lg,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  titleSection: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  title: {
    fontSize: typography.fontSizes.xl,
    fontWeight: "700",
    marginLeft: spacing.sm,
  },
  progressSection: {
    alignItems: 'flex-end',
    minWidth: 80,
  },
  progressText: {
    fontSize: typography.fontSizes.sm,
    fontWeight: "600",
    marginBottom: spacing.xs,
  },
  progressBar: {
    width: 60,
    height: 4,
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 2,
  },
  scrollView: {
    marginHorizontal: -spacing.sm,
  },
  prayersContainer: {
    paddingHorizontal: spacing.sm,
    gap: spacing.md,
  },
  prayerItemContainer: {
    marginRight: spacing.md,
  },
  prayerItem: {
    width: 90,
    height: 110,
    borderRadius: 16,
    borderWidth: 2,
    padding: spacing.md,
    alignItems: 'center',
    justifyContent: 'space-between',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  prayerIconContainer: {
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkIcon: {
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  prayerName: {
    fontSize: typography.fontSizes.sm,
    textAlign: 'center',
    marginTop: spacing.xs,
  },
  prayerTime: {
    fontSize: typography.fontSizes.xs,
    textAlign: 'center',
    marginTop: spacing.xs,
  },
  completionMessage: {
    marginTop: spacing.lg,
    padding: spacing.md,
    borderRadius: 12,
    alignItems: 'center',
  },
  completionText: {
    fontSize: typography.fontSizes.md,
    fontWeight: "600",
    textAlign: 'center',
    lineHeight: typography.lineHeights.md,
  },
});