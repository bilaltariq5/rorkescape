import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, SafeAreaView } from 'react-native';
import { Stack } from 'expo-router';
import { Award, CheckCircle, Filter } from 'lucide-react-native';
import { useTheme } from '@/context/ThemeContext';
import { challenges } from '@/constants/quotes';
import { useUserStore } from '@/store/user-store';

export default function ChallengesScreen() {
  const { theme } = useTheme();
  const { stats, completeChallenge } = useUserStore();
  const [filter, setFilter] = useState('all');
  
  const today = new Date().toISOString().split('T')[0];
  
  const filteredChallenges = filter === 'all' 
    ? challenges 
    : challenges.filter(challenge => challenge.category === filter);
  
  const isChallengeCompleted = (id: number) => {
    return stats.completedChallenges.some(
      challenge => challenge.id === id && challenge.date === today
    );
  };
  
  const handleCompleteChallenge = (id: number) => {
    if (!isChallengeCompleted(id)) {
      completeChallenge(id);
    }
  };
  
  const categories = [
    { id: 'all', name: 'All' },
    { id: 'prayer', name: 'Prayer' },
    { id: 'quran', name: 'Quran' },
    { id: 'physical', name: 'Physical' },
    { id: 'digital', name: 'Digital' },
    { id: 'social', name: 'Social' },
  ];

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      <Stack.Screen 
        options={{
          title: 'Daily Challenges',
          headerStyle: {
            backgroundColor: theme.card,
          },
          headerTitleStyle: {
            color: theme.text,
          },
          headerRight: () => (
            <View style={[styles.pointsContainer, { backgroundColor: theme.highlight }]}>
              <Award size={16} color={theme.primary} />
              <Text style={[styles.pointsText, { color: theme.primary }]}>{stats.totalPoints} pts</Text>
            </View>
          ),
        }} 
      />
      
      <View style={[styles.filterContainer, { borderBottomColor: theme.border }]}>
        <View style={styles.filterHeader}>
          <Filter size={16} color={theme.textSecondary} />
          <Text style={[styles.filterTitle, { color: theme.textSecondary }]}>Filter by category:</Text>
        </View>
        <FlatList
          data={categories}
          horizontal
          showsHorizontalScrollIndicator={false}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={[
                styles.filterButton,
                filter === item.id && styles.filterButtonActive,
                { 
                  backgroundColor: filter === item.id ? theme.primary : theme.background,
                  borderColor: filter === item.id ? theme.primary : theme.border,
                }
              ]}
              onPress={() => setFilter(item.id)}
            >
              <Text style={[
                styles.filterButtonText,
                filter === item.id && styles.filterButtonTextActive,
                { color: filter === item.id ? 'white' : theme.text }
              ]}>
                {item.name}
              </Text>
            </TouchableOpacity>
          )}
          contentContainerStyle={styles.filterList}
        />
      </View>
      
      <FlatList
        data={filteredChallenges}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => {
          const completed = isChallengeCompleted(item.id);
          
          return (
            <View style={[
              styles.challengeCard, 
              completed && styles.completedCard,
              { 
                backgroundColor: theme.card,
                shadowColor: theme.text,
                borderLeftColor: completed ? theme.success : 'transparent'
              }
            ]}>
              <View style={styles.challengeHeader}>
                <Text style={[styles.challengeTitle, { color: theme.text }]}>{item.title}</Text>
                <View style={[styles.challengePoints, { backgroundColor: theme.highlight }]}>
                  <Text style={[styles.pointsValue, { color: theme.primary }]}>{item.points} pts</Text>
                </View>
              </View>
              
              <Text style={[styles.challengeDescription, { color: theme.textSecondary }]}>{item.description}</Text>
              
              <TouchableOpacity
                style={[
                  styles.completeButton,
                  completed && styles.completedButton,
                  { backgroundColor: completed ? theme.success : theme.primary }
                ]}
                onPress={() => handleCompleteChallenge(item.id)}
                disabled={completed}
              >
                {completed ? (
                  <View style={styles.completedContent}>
                    <CheckCircle size={18} color="white" />
                    <Text style={styles.buttonText}>Completed</Text>
                  </View>
                ) : (
                  <Text style={styles.buttonText}>Complete Challenge</Text>
                )}
              </TouchableOpacity>
            </View>
          );
        }}
        contentContainerStyle={styles.challengesList}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  pointsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    marginRight: 16,
  },
  pointsText: {
    fontWeight: '600',
    marginLeft: 6,
  },
  filterContainer: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  filterHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  filterTitle: {
    fontSize: 14,
    marginLeft: 6,
  },
  filterList: {
    paddingVertical: 4,
  },
  filterButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    marginRight: 8,
    borderWidth: 1,
  },
  filterButtonActive: {
    borderColor: 'transparent',
  },
  filterButtonText: {
    fontSize: 14,
  },
  filterButtonTextActive: {
    fontWeight: '500',
  },
  challengesList: {
    padding: 16,
  },
  challengeCard: {
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  completedCard: {
    borderLeftWidth: 4,
  },
  challengeHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  challengeTitle: {
    fontSize: 18,
    fontWeight: '600',
    flex: 1,
  },
  challengePoints: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  pointsValue: {
    fontSize: 12,
    fontWeight: '600',
  },
  challengeDescription: {
    fontSize: 14,
    marginBottom: 16,
    lineHeight: 20,
  },
  completeButton: {
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  completedButton: {
    // No additional styles needed as backgroundColor is set dynamically
  },
  completedContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
});