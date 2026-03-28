import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, SafeAreaView } from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { BookOpen, ChevronRight } from 'lucide-react-native';
import { useTheme } from '@/context/ThemeContext';
import { educationalContent } from '@/constants/quotes';

export default function EducationScreen() {
  const { theme } = useTheme();
  const router = useRouter();
  
  const handleContentPress = (id: number) => {
    router.push(`/education/${id}`);
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      <Stack.Screen 
        options={{
          title: 'Educational Resources',
          headerStyle: {
            backgroundColor: theme.card,
          },
          headerTitleStyle: {
            color: theme.text,
          },
        }} 
      />
      
      <View style={[styles.header, { backgroundColor: theme.card, borderBottomColor: theme.border }]}>
        <BookOpen size={24} color={theme.primary} />
        <Text style={[styles.headerTitle, { color: theme.text }]}>Knowledge is Power</Text>
        <Text style={[styles.headerSubtitle, { color: theme.textSecondary }]}>
          Learn about addiction, recovery, and Islamic perspectives on purity.
        </Text>
      </View>
      
      <FlatList
        data={educationalContent}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity 
            style={[styles.contentCard, { backgroundColor: theme.card, shadowColor: theme.text }]}
            onPress={() => handleContentPress(item.id)}
          >
            <View style={styles.contentInfo}>
              <Text style={[styles.contentTitle, { color: theme.text }]}>{item.title}</Text>
              <Text style={[styles.contentSummary, { color: theme.textSecondary }]}>{item.summary}</Text>
            </View>
            <ChevronRight size={20} color={theme.primary} />
          </TouchableOpacity>
        )}
        contentContainerStyle={styles.contentList}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    padding: 20,
    alignItems: 'center',
    borderBottomWidth: 1,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginTop: 12,
    marginBottom: 8,
  },
  headerSubtitle: {
    fontSize: 14,
    textAlign: 'center',
    paddingHorizontal: 20,
    lineHeight: 20,
  },
  contentList: {
    padding: 16,
  },
  contentCard: {
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    flexDirection: 'row',
    alignItems: 'center',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  contentInfo: {
    flex: 1,
  },
  contentTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  contentSummary: {
    fontSize: 14,
    lineHeight: 20,
  },
});