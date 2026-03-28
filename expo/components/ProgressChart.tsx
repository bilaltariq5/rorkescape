import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { BarChart2 } from 'lucide-react-native';
import Colors from '@/constants/colors';
import { useUserStore } from '@/store/user-store';

const { width } = Dimensions.get('window');
const chartWidth = width - 64;

export default function ProgressChart() {
  const { stats } = useUserStore();
  
  // Get the last 7 days of data
  const getLast7Days = () => {
    const dates = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      dates.push(date.toISOString().split('T')[0]);
    }
    return dates;
  };
  
  const last7Days = getLast7Days();
  
  // Count completed challenges per day
  const challengesPerDay = last7Days.map(date => {
    return stats.completedChallenges.filter(challenge => challenge.date === date).length;
  });
  
  // Get max value for scaling
  const maxChallenges = Math.max(...challengesPerDay, 1);
  
  // Get day labels (Mon, Tue, etc.)
  const dayLabels = last7Days.map(dateStr => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { weekday: 'short' }).substring(0, 1);
  });

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.titleContainer}>
          <BarChart2 size={18} color={Colors.primary} />
          <Text style={styles.title}>Weekly Progress</Text>
        </View>
      </View>
      
      <View style={styles.chartContainer}>
        <View style={styles.chart}>
          {challengesPerDay.map((count, index) => {
            const barHeight = (count / maxChallenges) * 100;
            return (
              <View key={index} style={styles.barContainer}>
                <View style={styles.barLabelContainer}>
                  <Text style={styles.barValue}>{count}</Text>
                </View>
                <View 
                  style={[
                    styles.bar, 
                    { 
                      height: `${Math.max(barHeight, 5)}%`,
                      backgroundColor: count > 0 ? Colors.primary : Colors.disabled
                    }
                  ]} 
                />
                <Text style={styles.barLabel}>{dayLabels[index]}</Text>
              </View>
            );
          })}
        </View>
      </View>
      
      <View style={styles.statsContainer}>
        <View style={styles.statItem}>
          <Text style={styles.statValue}>{stats.totalChallengesCompleted}</Text>
          <Text style={styles.statLabel}>Challenges</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statValue}>{stats.totalPoints}</Text>
          <Text style={styles.statLabel}>Points</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statValue}>{stats.achievements.length}</Text>
          <Text style={styles.statLabel}>Achievements</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.card,
    borderRadius: 16,
    padding: 16,
    marginHorizontal: 16,
    marginVertical: 8,
    shadowColor: Colors.text,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.primary,
    marginLeft: 8,
  },
  chartContainer: {
    height: 150,
    marginBottom: 16,
  },
  chart: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    height: '100%',
  },
  barContainer: {
    flex: 1,
    alignItems: 'center',
    height: '100%',
    justifyContent: 'flex-end',
  },
  barLabelContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  barValue: {
    fontSize: 12,
    color: Colors.textSecondary,
    fontWeight: '600',
  },
  bar: {
    width: 8,
    borderRadius: 4,
    backgroundColor: Colors.primary,
    marginBottom: 8,
  },
  barLabel: {
    fontSize: 12,
    color: Colors.textSecondary,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    paddingTop: 16,
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  statValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.text,
  },
  statLabel: {
    fontSize: 12,
    color: Colors.textSecondary,
    marginTop: 4,
  },
});