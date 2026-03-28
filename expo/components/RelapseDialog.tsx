import React, { useState } from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity, TextInput, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { X, AlertCircle, Save, Clock, Calendar } from 'lucide-react-native';
import Colors from '@/constants/colors';
import { useUserStore } from '@/store/user-store';
import { typography, spacing, globalStyles } from '@/constants/theme';

interface RelapseDialogProps {
  visible: boolean;
  onClose: () => void;
}

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

export default function RelapseDialog({ visible, onClose }: RelapseDialogProps) {
  const [selectedTrigger, setSelectedTrigger] = useState('');
  const [customTrigger, setCustomTrigger] = useState('');
  const [notes, setNotes] = useState('');
  const [showHistory, setShowHistory] = useState(false);
  
  const { resetStreak, addReflection, stats } = useUserStore();
  
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
      
      // Close dialog
      onClose();
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

  return (
    <Modal
      animationType="slide"
      transparent={false}
      visible={visible}
      onRequestClose={onClose}
    >
      <KeyboardAvoidingView 
        style={styles.modalContainer}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>
              {showHistory ? 'Relapse History' : 'Record Relapse'}
            </Text>
            <View style={styles.headerButtons}>
              {!showHistory && Array.isArray(stats?.relapseHistory) && stats?.relapseHistory.length > 0 && (
                <TouchableOpacity 
                  onPress={() => setShowHistory(true)} 
                  style={styles.historyButton}
                >
                  <Clock size={20} color={Colors.primary} />
                  <Text style={styles.historyButtonText}>History</Text>
                </TouchableOpacity>
              )}
              {showHistory && (
                <TouchableOpacity 
                  onPress={() => setShowHistory(false)} 
                  style={styles.backButton}
                >
                  <Text style={styles.backButtonText}>Back</Text>
                </TouchableOpacity>
              )}
              <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                <X size={24} color={Colors.text} />
              </TouchableOpacity>
            </View>
          </View>
          
          {showHistory ? (
            <ScrollView style={styles.historyContainer} showsVerticalScrollIndicator={false}>
              {(!Array.isArray(stats?.relapseHistory) || stats?.relapseHistory.length === 0) ? (
                <View style={styles.emptyHistoryContainer}>
                  <Text style={styles.emptyHistoryText}>No relapse history yet</Text>
                  <Text style={styles.emptyHistorySubtext}>Stay strong on your journey!</Text>
                </View>
              ) : (
                (stats?.relapseHistory || []).map((entry) => (
                  <View key={entry.id} style={styles.historyEntry}>
                    <View style={styles.historyHeader}>
                      <View style={styles.historyDateContainer}>
                        <Calendar size={16} color={Colors.textSecondary} />
                        <Text style={styles.historyDate}>{formatDate(entry.date)}</Text>
                      </View>
                      <View style={styles.historyTimeContainer}>
                        <Clock size={16} color={Colors.textSecondary} />
                        <Text style={styles.historyTime}>{entry.time}</Text>
                      </View>
                    </View>
                    <Text style={styles.historyTrigger}>{entry.trigger}</Text>
                    {entry.notes && (
                      <Text style={styles.historyNotes}>{entry.notes}</Text>
                    )}
                  </View>
                ))
              )}
            </ScrollView>
          ) : (
            <ScrollView 
              style={styles.contentContainer} 
              showsVerticalScrollIndicator={false}
              keyboardShouldPersistTaps="handled"
            >
              <View style={styles.warningContainer}>
                <AlertCircle size={20} color={Colors.danger} />
                <Text style={styles.warningText}>
                  Remember, this is part of the journey. Learn from this moment and keep moving forward.
                </Text>
              </View>
              
              <Text style={styles.sectionTitle}>What triggered this?</Text>
              <ScrollView style={styles.triggerContainer} horizontal showsHorizontalScrollIndicator={false}>
                {commonTriggers.map((trigger) => (
                  <TouchableOpacity
                    key={trigger}
                    style={[
                      styles.triggerButton,
                      selectedTrigger === trigger && styles.selectedTrigger
                    ]}
                    onPress={() => setSelectedTrigger(trigger)}
                  >
                    <Text style={[
                      styles.triggerText,
                      selectedTrigger === trigger && styles.selectedTriggerText
                    ]}>
                      {trigger}
                    </Text>
                  </TouchableOpacity>
                ))}
                <TouchableOpacity
                  style={[
                    styles.triggerButton,
                    selectedTrigger === 'Other' && styles.selectedTrigger
                  ]}
                  onPress={() => setSelectedTrigger('Other')}
                >
                  <Text style={[
                    styles.triggerText,
                    selectedTrigger === 'Other' && styles.selectedTriggerText
                  ]}>
                    Other
                  </Text>
                </TouchableOpacity>
              </ScrollView>
              
              {selectedTrigger === 'Other' && (
                <TextInput
                  style={styles.input}
                  placeholder="Enter trigger"
                  value={customTrigger}
                  onChangeText={setCustomTrigger}
                  placeholderTextColor={Colors.textSecondary}
                />
              )}
              
              <Text style={styles.sectionTitle}>Notes (optional)</Text>
              <TextInput
                style={[styles.input, styles.textArea]}
                placeholder="What happened? How can you prevent this next time?"
                value={notes}
                onChangeText={setNotes}
                multiline
                numberOfLines={4}
                placeholderTextColor={Colors.textSecondary}
              />
              
              <TouchableOpacity 
                style={styles.submitButton}
                onPress={handleSubmit}
                disabled={!selectedTrigger || (selectedTrigger === 'Other' && !customTrigger)}
              >
                <Save size={20} color="white" />
                <Text style={styles.submitButtonText}>Save and Reset Streak</Text>
              </TouchableOpacity>
            </ScrollView>
          )}
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  modalContent: {
    flex: 1,
    padding: spacing.lg,
    paddingTop: spacing.xl,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  modalTitle: {
    fontSize: typography.fontSizes['2xl'],
    fontWeight: "700",
    color: Colors.text,
    flex: 1,
  },
  headerButtons: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  historyButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.background,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: 20,
    gap: spacing.xs,
  },
  historyButtonText: {
    fontSize: typography.fontSizes.sm,
    color: Colors.primary,
    fontWeight: "600",
  },
  backButton: {
    backgroundColor: Colors.background,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: 20,
  },
  backButtonText: {
    fontSize: typography.fontSizes.sm,
    color: Colors.primary,
    fontWeight: "600",
  },
  closeButton: {
    padding: spacing.xs,
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
    color: Colors.text,
    marginBottom: spacing.xs,
  },
  emptyHistorySubtext: {
    fontSize: typography.fontSizes.md,
    color: Colors.textSecondary,
  },
  historyEntry: {
    backgroundColor: Colors.background,
    borderRadius: 16,
    padding: spacing.md,
    marginBottom: spacing.md,
    borderLeftWidth: 4,
    borderLeftColor: Colors.danger,
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
    color: Colors.textSecondary,
    fontWeight: "500",
  },
  historyTime: {
    fontSize: typography.fontSizes.sm,
    color: Colors.textSecondary,
    fontWeight: "500",
  },
  historyTrigger: {
    fontSize: typography.fontSizes.lg,
    fontWeight: "600",
    color: Colors.text,
    marginBottom: spacing.xs,
  },
  historyNotes: {
    fontSize: typography.fontSizes.md,
    color: Colors.textSecondary,
    lineHeight: typography.lineHeights.md,
  },
  contentContainer: {
    flex: 1,
  },
  warningContainer: {
    backgroundColor: '#FEF2F2',
    borderRadius: 16,
    padding: spacing.md,
    marginBottom: spacing.lg,
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  warningText: {
    fontSize: typography.fontSizes.md,
    color: Colors.danger,
    marginLeft: spacing.md,
    flex: 1,
    lineHeight: typography.lineHeights.md,
  },
  sectionTitle: {
    fontSize: typography.fontSizes.lg,
    fontWeight: "600",
    color: Colors.text,
    marginBottom: spacing.md,
  },
  triggerContainer: {
    flexDirection: 'row',
    marginBottom: spacing.md,
  },
  triggerButton: {
    backgroundColor: Colors.background,
    borderRadius: 20,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    marginRight: spacing.sm,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  selectedTrigger: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  triggerText: {
    fontSize: typography.fontSizes.md,
    color: Colors.text,
    fontWeight: "500",
  },
  selectedTriggerText: {
    color: 'white',
    fontWeight: "600",
  },
  input: {
    backgroundColor: Colors.background,
    borderRadius: 16,
    padding: spacing.md,
    fontSize: typography.fontSizes.md,
    color: Colors.text,
    borderWidth: 1,
    borderColor: Colors.border,
    marginBottom: spacing.md,
  },
  textArea: {
    height: 120,
    textAlignVertical: 'top',
  },
  submitButton: {
    backgroundColor: Colors.danger,
    borderRadius: 16,
    paddingVertical: spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.lg,
  },
  submitButtonText: {
    color: 'white',
    fontSize: typography.fontSizes.md,
    fontWeight: "700",
    marginLeft: spacing.sm,
  },
});