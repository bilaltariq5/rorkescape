import React from 'react';
import { View, Text, StyleSheet, ScrollView, SafeAreaView } from 'react-native';
import { Stack } from 'expo-router';
import { Award, Calendar, BarChart2, AlertTriangle, CheckCircle } from 'lucide-react-native';
import { useTheme } from '@/context/ThemeContext';
import { useUserStore } from '@/store/user-store';
import { ProgressChart } from '@/components';
import { achievements } from '@/constants/quotes';

export default function ProgressScreen() {
  const { theme } = useTheme();
  const { stats } = useUserStore();
  
  // Calculate success rate for emergency tool
  const emergencySuccessRate = stats.emergencyToolUses.length > 0
    ? Math.round((stats.emergencyToolUses.filter(use => use.successful).length / stats.emergencyToolUses.length) * 100)
    : 0;
  
  // Get unlocked achievements
  const unlockedAchievements = achievements.filter(achievement => 
    stats.achievements.includes(achievement.id)
  );
  
  // Get next achievements to unlock
  const nextAchievements = achievements.filter(achievement => 
    !stats.achievements.includes(achievement.id)
  ).slice(0, 3);
  
  // Format date
  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'Not started';
    
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      <Stack.Screen 
        options={{
          title: 'Your Progress',
          headerStyle: {
            backgroundColor: theme.card,
          },
          headerTitleStyle: {
            color: theme.text,
          },
        }} 
      />
      
      <ScrollView style={styles.scrollView}>
        <View style={styles.statsContainer}>
          <View style={[styles.statCard, { backgroundColor: theme.card, shadowColor: theme.text }]}>
            <View style={[styles.statIconContainer, { backgroundColor: theme.highlight }]}>
              <Calendar size={20} color={theme.primary} />
            </View>
            <Text style={[styles.statValue, { color: theme.text }]}>{stats.currentStreak}</Text>
            <Text style={[styles.statLabel, { color: theme.textSecondary }]}>Current Streak</Text>
          </View>
          
          <View style={[styles.statCard, { backgroundColor: theme.card, shadowColor: theme.text }]}>
            <View style={[styles.statIconContainer, { backgroundColor: theme.highlight }]}>
              <Award size={20} color={theme.primary} />
            </View>
            <Text style={[styles.statValue, { color: theme.text }]}>{stats.longestStreak}</Text>
            <Text style={[styles.statLabel, { color: theme.textSecondary }]}>Longest Streak</Text>
          </View>
          
          <View style={[styles.statCard, { backgroundColor: theme.card, shadowColor: theme.text }]}>
            <View style={[styles.statIconContainer, { backgroundColor: theme.highlight }]}>
              <CheckCircle size={20} color={theme.primary} />
            </View>
            <Text style={[styles.statValue, { color: theme.text }]}>{stats.totalChallengesCompleted}</Text>
            <Text style={[styles.statLabel, { color: theme.textSecondary }]}>Challenges</Text>
          </View>
          
          <View style={[styles.statCard, { backgroundColor: theme.card, shadowColor: theme.text }]}>
            <View style={[styles.statIconContainer, { backgroundColor: theme.highlight }]}>
              <AlertTriangle size={20} color={theme.primary} />
            </View>
            <Text style={[styles.statValue, { color: theme.text }]}>{emergencySuccessRate}%</Text>
            <Text style={[styles.statLabel, { color: theme.textSecondary }]}>Success Rate</Text>
          </View>
        </View>
        
        <ProgressChart />
        
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>Streak Details</Text>
          <View style={[styles.detailCard, { backgroundColor: theme.card, shadowColor: theme.text }]}>
            <View style={[styles.detailRow, { borderBottomColor: theme.border }]}>
              <Text style={[styles.detailLabel, { color: theme.textSecondary }]}>Started On</Text>
              <Text style={[styles.detailValue, { color: theme.text }]}>{formatDate(stats.streakStart)}</Text>
            </View>
            <View style={[styles.detailRow, { borderBottomColor: theme.border }]}>
              <Text style={[styles.detailLabel, { color: theme.textSecondary }]}>Current Streak</Text>
              <Text style={[styles.detailValue, { color: theme.text }]}>{stats.currentStreak} days</Text>
            </View>
            <View style={[styles.detailRow, { borderBottomColor: theme.border }]}>
              <Text style={[styles.detailLabel, { color: theme.textSecondary }]}>Longest Streak</Text>
              <Text style={[styles.detailValue, { color: theme.text }]}>{stats.longestStreak} days</Text>
            </View>
            <View style={[styles.detailRow, { borderBottomColor: theme.border }]}>
              <Text style={[styles.detailLabel, { color: theme.textSecondary }]}>Total Points</Text>
              <Text style={[styles.detailValue, { color: theme.text }]}>{stats.totalPoints} points</Text>
            </View>
          </View>
        </View>
        
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>Achievements ({unlockedAchievements.length}/{achievements.length})</Text>
          
          {unlockedAchievements.length > 0 ? (
            unlockedAchievements.map((achievement) => (
              <View key={achievement.id} style={[styles.achievementCard, { backgroundColor: theme.card, shadowColor: theme.text }]}>
                <View style={[styles.achievementIcon, { backgroundColor: theme.highlight }]}>
                  <Award size={24} color={theme.primary} />
                </View>
                <View style={styles.achievementInfo}>
                  <Text style={[styles.achievementTitle, { color: theme.text }]}>{achievement.title}</Text>
                  <Text style={[styles.achievementDescription, { color: theme.textSecondary }]}>{achievement.description}</Text>
                </View>
              </View>
            ))
          ) : (
            <View style={[styles.emptyState, { backgroundColor: theme.card }]}>
              <Text style={[styles.emptyStateText, { color: theme.textSecondary }]}>
                No achievements unlocked yet. Keep going!
              </Text>
            </View>
          )}
          
          {nextAchievements.length > 0 && (
            <>
              <Text style={[styles.subsectionTitle, { color: theme.textSecondary }]}>Next Goals</Text>
              {nextAchievements.map((achievement) => (
                <View key={achievement.id} style={[styles.achievementCard, styles.lockedAchievement, { backgroundColor: theme.card, shadowColor: theme.text }]}>
                  <View style={[styles.achievementIcon, styles.lockedIcon, { backgroundColor: theme.border }]}>
                    <Award size={24} color={theme.disabled} />
                  </View>
                  <View style={styles.achievementInfo}>
                    <Text style={[styles.lockedTitle, { color: theme.textSecondary }]}>{achievement.title}</Text>
                    <Text style={[styles.achievementDescription, { color: theme.textSecondary }]}>{achievement.description}</Text>
                  </View>
                </View>
              ))}
            </>
          )}
        </View>
      </ScrollView>
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
  statsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 8,
    justifyContent: 'space-between',
  },
  statCard: {
    borderRadius: 16,
    padding: 16,
    marginHorizontal: 8,
    marginVertical: 8,
    width: '45%',
    alignItems: 'center',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  statIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
  },
  section: {
    marginTop: 16,
    marginBottom: 24,
    paddingHorizontal: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
  },
  subsectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginTop: 16,
    marginBottom: 12,
  },
  detailCard: {
    borderRadius: 16,
    padding: 16,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: 1,
  },
  detailLabel: {
    fontSize: 14,
  },
  detailValue: {
    fontSize: 14,
    fontWeight: '600',
  },
  achievementCard: {
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  lockedAchievement: {
    opacity: 0.7,
  },
  achievementIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  lockedIcon: {
    // No additional styles needed as backgroundColor is set dynamically
  },
  achievementInfo: {
    flex: 1,
  },
  achievementTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  lockedTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  achievementDescription: {
    fontSize: 14,
    lineHeight: 20,
  },
  emptyState: {
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyStateText: {
    fontSize: 14,
    textAlign: 'center',
  },
});