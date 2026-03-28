import React from 'react';
import { View, Text, StyleSheet, ScrollView, SafeAreaView } from 'react-native';
import { Stack, useLocalSearchParams } from 'expo-router';
import { BookOpen } from 'lucide-react-native';
import { useTheme } from '@/context/ThemeContext';
import { educationalContent } from '@/constants/quotes';

export default function EducationDetailScreen() {
  const { theme } = useTheme();
  const { id } = useLocalSearchParams();
  const contentId = parseInt(id as string);
  
  const content = educationalContent.find(item => item.id === contentId);
  
  if (!content) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
        <Stack.Screen 
          options={{
            title: 'Content Not Found',
            headerStyle: {
              backgroundColor: theme.card,
            },
            headerTitleStyle: {
              color: theme.text,
            },
          }} 
        />
        <View style={styles.errorContainer}>
          <Text style={[styles.errorText, { color: theme.textSecondary }]}>The requested content could not be found.</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      <Stack.Screen 
        options={{
          title: content.title,
          headerStyle: {
            backgroundColor: theme.card,
          },
          headerTitleStyle: {
            color: theme.text,
          },
        }} 
      />
      
      <ScrollView style={styles.scrollView}>
        <View style={[styles.header, { backgroundColor: theme.card, borderBottomColor: theme.border }]}>
          <BookOpen size={24} color={theme.primary} />
          <Text style={[styles.title, { color: theme.text }]}>{content.title}</Text>
          <Text style={[styles.summary, { color: theme.textSecondary }]}>{content.summary}</Text>
        </View>
        
        <View style={styles.contentContainer}>
          <Text style={[styles.contentText, { color: theme.text }]}>{content.content}</Text>
          
          {/* This would be expanded with more detailed content in a real app */}
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: theme.text }]}>Key Points</Text>
            <View style={styles.bulletPoint}>
              <View style={[styles.bullet, { backgroundColor: theme.primary }]} />
              <Text style={[styles.bulletText, { color: theme.text }]}>
                Understanding the nature of addiction helps in overcoming it.
              </Text>
            </View>
            <View style={styles.bulletPoint}>
              <View style={[styles.bullet, { backgroundColor: theme.primary }]} />
              <Text style={[styles.bulletText, { color: theme.text }]}>
                Islam provides a comprehensive framework for self-improvement and overcoming challenges.
              </Text>
            </View>
            <View style={styles.bulletPoint}>
              <View style={[styles.bullet, { backgroundColor: theme.primary }]} />
              <Text style={[styles.bulletText, { color: theme.text }]}>
                Regular prayer, dhikr, and Quran recitation strengthen your spiritual connection.
              </Text>
            </View>
            <View style={styles.bulletPoint}>
              <View style={[styles.bullet, { backgroundColor: theme.primary }]} />
              <Text style={[styles.bulletText, { color: theme.text }]}>
                Building healthy habits and routines is essential for long-term recovery.
              </Text>
            </View>
          </View>
          
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: theme.text }]}>Practical Steps</Text>
            <View style={styles.step}>
              <View style={[styles.stepNumber, { backgroundColor: theme.primary }]}>
                <Text style={styles.stepNumberText}>1</Text>
              </View>
              <View style={styles.stepContent}>
                <Text style={[styles.stepTitle, { color: theme.text }]}>Identify Triggers</Text>
                <Text style={[styles.stepDescription, { color: theme.textSecondary }]}>
                  Recognize situations, emotions, or environments that lead to temptation.
                </Text>
              </View>
            </View>
            
            <View style={styles.step}>
              <View style={[styles.stepNumber, { backgroundColor: theme.primary }]}>
                <Text style={styles.stepNumberText}>2</Text>
              </View>
              <View style={styles.stepContent}>
                <Text style={[styles.stepTitle, { color: theme.text }]}>Create Barriers</Text>
                <Text style={[styles.stepDescription, { color: theme.textSecondary }]}>
                  Install content filters, keep devices in public spaces, and avoid isolation.
                </Text>
              </View>
            </View>
            
            <View style={styles.step}>
              <View style={[styles.stepNumber, { backgroundColor: theme.primary }]}>
                <Text style={styles.stepNumberText}>3</Text>
              </View>
              <View style={styles.stepContent}>
                <Text style={[styles.stepTitle, { color: theme.text }]}>Strengthen Faith</Text>
                <Text style={[styles.stepDescription, { color: theme.textSecondary }]}>
                  Increase worship, seek knowledge, and maintain regular prayer.
                </Text>
              </View>
            </View>
            
            <View style={styles.step}>
              <View style={[styles.stepNumber, { backgroundColor: theme.primary }]}>
                <Text style={styles.stepNumberText}>4</Text>
              </View>
              <View style={styles.stepContent}>
                <Text style={[styles.stepTitle, { color: theme.text }]}>Seek Support</Text>
                <Text style={[styles.stepDescription, { color: theme.textSecondary }]}>
                  Confide in a trusted friend, mentor, or counselor who can provide accountability.
                </Text>
              </View>
            </View>
          </View>
          
          <View style={[styles.quoteContainer, { backgroundColor: theme.highlight, borderLeftColor: theme.primary }]}>
            <Text style={[styles.quote, { color: theme.text }]}>
              "Indeed, Allah will not change the condition of a people until they change what is in themselves."
            </Text>
            <Text style={[styles.quoteSource, { color: theme.primary }]}>Quran 13:11</Text>
          </View>
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
  errorContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  errorText: {
    fontSize: 16,
    textAlign: 'center',
  },
  header: {
    padding: 24,
    alignItems: 'center',
    borderBottomWidth: 1,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginTop: 12,
    marginBottom: 8,
    textAlign: 'center',
  },
  summary: {
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 24,
  },
  contentContainer: {
    padding: 16,
  },
  contentText: {
    fontSize: 16,
    lineHeight: 24,
    marginBottom: 24,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
  },
  bulletPoint: {
    flexDirection: 'row',
    marginBottom: 12,
    alignItems: 'flex-start',
  },
  bullet: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginTop: 8,
    marginRight: 12,
  },
  bulletText: {
    flex: 1,
    fontSize: 16,
    lineHeight: 24,
  },
  step: {
    flexDirection: 'row',
    marginBottom: 16,
    alignItems: 'flex-start',
  },
  stepNumber: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  stepNumberText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 14,
  },
  stepContent: {
    flex: 1,
  },
  stepTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  stepDescription: {
    fontSize: 14,
    lineHeight: 20,
  },
  quoteContainer: {
    borderRadius: 16,
    padding: 20,
    marginVertical: 16,
    borderLeftWidth: 4,
  },
  quote: {
    fontSize: 16,
    fontStyle: 'italic',
    lineHeight: 24,
    marginBottom: 8,
  },
  quoteSource: {
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'right',
  },
});