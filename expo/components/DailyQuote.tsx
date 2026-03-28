import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { BookOpen, RefreshCw } from 'lucide-react-native';
import { islamicQuotes } from '@/constants/quotes';
import { typography, spacing, globalStyles } from '@/constants/theme';
import { useTheme } from '@/context/ThemeContext';

export default function DailyQuote() {
  const [quote, setQuote] = useState(islamicQuotes[0]);
  const { theme } = useTheme();

  const getRandomQuote = () => {
    const randomIndex = Math.floor(Math.random() * islamicQuotes.length);
    setQuote(islamicQuotes[randomIndex]);
  };

  useEffect(() => {
    getRandomQuote();
  }, []);

  return (
    <View style={[
      styles.container, 
      { 
        backgroundColor: theme.card,
        shadowColor: theme.text,
      }
    ]}>
      <View style={styles.header}>
        <View style={styles.titleContainer}>
          <BookOpen size={20} color={theme.primary} />
          <Text style={[styles.title, { color: theme.primary }]}>Daily Reminder</Text>
        </View>
        <TouchableOpacity 
          onPress={getRandomQuote} 
          style={[styles.refreshButton, { backgroundColor: theme.highlight }]}
        >
          <RefreshCw size={18} color={theme.textSecondary} />
        </TouchableOpacity>
      </View>
      <Text style={[styles.quoteText, { color: theme.text }]}>{quote.text}</Text>
      <Text style={[styles.source, { color: theme.textSecondary }]}>— {quote.source}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 24,
    padding: spacing.lg,
    marginHorizontal: spacing.lg,
    marginVertical: spacing.md,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  title: {
    fontSize: typography.fontSizes.lg,
    fontWeight: "600",
    marginLeft: spacing.sm,
  },
  refreshButton: {
    padding: spacing.xs,
    borderRadius: 20,
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
  },
  quoteText: {
    fontSize: typography.fontSizes.md,
    lineHeight: typography.lineHeights.lg,
    fontStyle: 'italic',
    marginBottom: spacing.md,
  },
  source: {
    fontSize: typography.fontSizes.sm,
    textAlign: 'right',
    fontWeight: "500",
  },
});