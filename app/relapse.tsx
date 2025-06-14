import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, ScrollView, SafeAreaView, KeyboardAvoidingView, Platform } from 'react-native';
import { X, AlertCircle, Save, Clock, Calendar, ArrowLeft } from 'lucide-react-native';
import { router, Stack } from 'expo-router';
import { useUserStore } from '@/store/user-store';
import { typography, spacing } from '@/constants/theme';
import { useTheme } from '@/context/ThemeContext';

const commonTriggers = [
  'Boredom',
  'Stress',
  'Loneliness',
  'Social media',
  'Late night',
  'Tiredness',
  'Anxiety',
  'Sadness',
];

export default function RelapseScreen() {
  const [selectedTrigger, setSelectedTrigger] = useState('');
  const [customTrigger, setCustomTrigger] = useState('');
  const [notes, setNotes] = useState('');
  const [showHistory, setShowHistory] = useState(false);
  
  const { resetStreak, addReflection, stats } = useUserStore();
  const { theme } = useTheme();
  
  const handleSubmit = () => {
    const trigger = selectedTrigger === 'Other' ? customTrigger : selectedTrigger;
    
    if (trigger) {
      resetStreak(trigger, notes);
      
      // Add reflection
      addReflection({
        id: Date.now().toString(),
        date: new Date().toISOString().split('T')[0],
        mood: 'struggling',
        triggers: [trigger],
        notes: notes,
      });
      
      // Reset form
      setSelectedTrigger('');
      setCustomTrigger('');
      setNotes('');
      
      // Navigate back
      router.back();
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      year: 'numeric'
    });
  };

  const goBack = () => {
    router.back();
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      <Stack.Screen 
        options={{ 
          headerShown: true,
          title: showHistory ? 'Relapse History' : 'Record Relapse',
          headerStyle: { backgroundColor: theme.background },
          headerTintColor: theme.text,
          headerTitleStyle: { color: theme.text },
          headerLeft: () => (
            <TouchableOpacity onPress={goBack} style={styles.headerButton}>
              <ArrowLeft size={24} color={theme.text} />
            </TouchableOpacity>
          ),
          headerRight: () => (
            <View style={styles.headerRightContainer}>
              {!showHistory && Array.isArray(stats?.relapseHistory) && stats?.relapseHistory.length > 0 && (
                <TouchableOpacity 
                  onPress={() => setShowHistory(true)} 
                  style={[styles.historyButton, { backgroundColor: theme.card, borderColor: theme.border }]}
                >
                  <Clock size={18} color={theme.primary} />
                  <Text style={[styles.historyButtonText, { color: theme.primary }]}>History</Text>
                </TouchableOpacity>
              )}
              {showHistory && (
                <TouchableOpacity 
                  onPress={() => setShowHistory(false)} 
                  style={[styles.backButton, { backgroundColor: theme.card, borderColor: theme.border }]}
                >
                  <Text style={[styles.backButtonText, { color: theme.primary }]}>Back</Text>
                </TouchableOpacity>
              )}
            </View>
          )
        }} 
      />
      
      <KeyboardAvoidingView 
        style={styles.contentContainer}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView 
          style={styles.scrollView} 
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {showHistory ? (
            <View style={styles.historyContainer}>
              {(!Array.isArray(stats?.relapseHistory) || stats?.relapseHistory.length === 0) ? (
                <View style={styles.emptyHistoryContainer}>
                  <Text style={[styles.emptyHistoryText, { color: theme.text }]}>No relapse history yet</Text>
                  <Text style={[styles.emptyHistorySubtext, { color: theme.textSecondary }]}>Stay strong on your journey!</Text>
                </View>
              ) : (
                (stats?.relapseHistory || []).map((entry) => (
                  <View key={entry.id} style={[styles.historyEntry, { backgroundColor: theme.card, borderLeftColor: theme.danger }]}>
                    <View style={styles.historyHeader}>
                      <View style={styles.historyDateContainer}>
                        <Calendar size={16} color={theme.textSecondary} />
                        <Text style={[styles.historyDate, { color: theme.textSecondary }]}>{formatDate(entry.date)}</Text>
                      </View>
                      <View style={styles.historyTimeContainer}>
                        <Clock size={16} color={theme.textSecondary} />
                        <Text style={[styles.historyTime, { color: theme.textSecondary }]}>{entry.time}</Text>
                      </View>
                    </View>
                    <Text style={[styles.historyTrigger, { color: theme.text }]}>{entry.trigger}</Text>
                    {entry.notes && (
                      <Text style={[styles.historyNotes, { color: theme.textSecondary }]}>{entry.notes}</Text>
                    )}
                  </View>
                ))
              )}
            </View>
          ) : (
            <>
              <View style={[styles.warningContainer, { backgroundColor: theme.danger + '15' }]}>
                <AlertCircle size={20} color={theme.danger} />
                <Text style={[styles.warningText, { color: theme.danger }]}>
                  Remember, this is part of the journey. Learn from this moment and keep moving forward.
                </Text>
              </View>
              
              <Text style={[styles.sectionTitle, { color: theme.text }]}>What triggered this?</Text>
              <ScrollView style={styles.triggerContainer} horizontal showsHorizontalScrollIndicator={false}>
                {commonTriggers.map((trigger) => (
                  <TouchableOpacity
                    key={trigger}
                    style={[
                      styles.triggerButton,
                      { backgroundColor: theme.card, borderColor: theme.border },
                      selectedTrigger === trigger && { backgroundColor: theme.primary, borderColor: theme.primary }
                    ]}
                    onPress={() => setSelectedTrigger(trigger)}
                  >
                    <Text style={[
                      styles.triggerText,
                      { color: theme.text },
                      selectedTrigger === trigger && { color: 'white' }
                    ]}>
                      {trigger}
                    </Text>
                  </TouchableOpacity>
                ))}
                <TouchableOpacity
                  style={[
                    styles.triggerButton,
                    { backgroundColor: theme.card, borderColor: theme.border },
                    selectedTrigger === 'Other' && { backgroundColor: theme.primary, borderColor: theme.primary }
                  ]}
                  onPress={() => setSelectedTrigger('Other')}
                >
                  <Text style={[
                    styles.triggerText,
                    { color: theme.text },
                    selectedTrigger === 'Other' && { color: 'white' }
                  ]}>
                    Other
                  </Text>
                </TouchableOpacity>
              </ScrollView>
              
              {selectedTrigger === 'Other' && (
                <TextInput
                  style={[styles.input, { backgroundColor: theme.card, borderColor: theme.border, color: theme.text }]}
                  placeholder="Enter trigger"
                  value={customTrigger}
                  onChangeText={setCustomTrigger}
                  placeholderTextColor={theme.textSecondary}
                />
              )}
              
              <Text style={[styles.sectionTitle, { color: theme.text }]}>Notes (optional)</Text>
              <TextInput
                style={[styles.input, styles.textArea, { backgroundColor: theme.card, borderColor: theme.border, color: theme.text }]}
                placeholder="What happened? How can you prevent this next time?"
                value={notes}
                onChangeText={setNotes}
                multiline
                numberOfLines={4}
                placeholderTextColor={theme.textSecondary}
              />
              
              <TouchableOpacity 
                style={[styles.submitButton, { backgroundColor: theme.danger }]}
                onPress={handleSubmit}
                disabled={!selectedTrigger || (selectedTrigger === 'Other' && !customTrigger)}
              >
                <Save size={20} color="white" />
                <Text style={styles.submitButtonText}>Save and Reset Streak</Text>
              </TouchableOpacity>
            </>
          )}
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  headerButton: {
    padding: spacing.xs,
  },
  headerRightContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  historyButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: 20,
    gap: spacing.xs,
    borderWidth: 1,
  },
  historyButtonText: {
    fontSize: typography.fontSizes.sm,
    fontWeight: "600",
  },
  backButton: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: 20,
    borderWidth: 1,
  },
  backButtonText: {
    fontSize: typography.fontSizes.sm,
    fontWeight: "600",
  },
  contentContainer: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: spacing.lg,
    paddingBottom: spacing.xl * 2,
  },
  historyContainer: {
    flex: 1,
  },
  emptyHistoryContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.xl * 2,
  },
  emptyHistoryText: {
    fontSize: typography.fontSizes.lg,
    fontWeight: "600",
    marginBottom: spacing.xs,
  },
  emptyHistorySubtext: {
    fontSize: typography.fontSizes.md,
  },
  historyEntry: {
    borderRadius: 16,
    padding: spacing.md,
    marginBottom: spacing.md,
    borderLeftWidth: 4,
  },
  historyHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  historyDateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  historyTimeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  historyDate: {
    fontSize: typography.fontSizes.sm,
    fontWeight: "500",
  },
  historyTime: {
    fontSize: typography.fontSizes.sm,
    fontWeight: "500",
  },
  historyTrigger: {
    fontSize: typography.fontSizes.lg,
    fontWeight: "600",
    marginBottom: spacing.xs,
  },
  historyNotes: {
    fontSize: typography.fontSizes.md,
    lineHeight: typography.lineHeights.md,
  },
  warningContainer: {
    borderRadius: 16,
    padding: spacing.md,
    marginBottom: spacing.lg,
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  warningText: {
    fontSize: typography.fontSizes.md,
    marginLeft: spacing.md,
    flex: 1,
    lineHeight: typography.lineHeights.md,
  },
  sectionTitle: {
    fontSize: typography.fontSizes.lg,
    fontWeight: "600",
    marginBottom: spacing.md,
    marginTop: spacing.md,
  },
  triggerContainer: {
    flexDirection: 'row',
    marginBottom: spacing.lg,
  },
  triggerButton: {
    borderRadius: 20,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    marginRight: spacing.sm,
    borderWidth: 1,
  },
  triggerText: {
    fontSize: typography.fontSizes.md,
    fontWeight: "500",
  },
  input: {
    borderRadius: 16,
    padding: spacing.md,
    fontSize: typography.fontSizes.md,
    borderWidth: 1,
    marginBottom: spacing.lg,
  },
  textArea: {
    height: 120,
    textAlignVertical: 'top',
  },
  submitButton: {
    borderRadius: 16,
    paddingVertical: spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: spacing.lg,
  },
  submitButtonText: {
    color: 'white',
    fontSize: typography.fontSizes.md,
    fontWeight: "700",
    marginLeft: spacing.sm,
  },
});