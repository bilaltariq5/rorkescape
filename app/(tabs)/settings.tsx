import React, { useState } from 'react';
import { View, Text, StyleSheet, Switch, TextInput, TouchableOpacity, ScrollView, SafeAreaView, Alert } from 'react-native';
import { Stack } from 'expo-router';
import { Bell, Moon, User, Phone, Shield, Info, LogOut, Sun } from 'lucide-react-native';
import { useUserStore } from '@/store/user-store';
import { useTheme } from '@/context/ThemeContext';

export default function SettingsScreen() {
  const { settings, updateSettings, resetStreak } = useUserStore();
  const { theme, isDark, toggleTheme, setTheme } = useTheme();
  
  const [contactName, setContactName] = useState(settings.emergencyContactName);
  const [contactNumber, setContactNumber] = useState(settings.emergencyContactNumber);
  const [username, setUsername] = useState(settings.anonymousUsername);
  
  const handleSaveContact = () => {
    updateSettings({
      emergencyContactName: contactName,
      emergencyContactNumber: contactNumber,
    });
    
    Alert.alert(
      "Contact Saved",
      "Your emergency contact has been updated.",
      [{ text: "OK" }]
    );
  };
  
  const handleSaveUsername = () => {
    updateSettings({
      anonymousUsername: username,
    });
    
    Alert.alert(
      "Username Saved",
      "Your anonymous username has been updated.",
      [{ text: "OK" }]
    );
  };
  
  const handleResetProgress = () => {
    Alert.alert(
      "Reset Progress",
      "Are you sure you want to reset your streak? This action cannot be undone.",
      [
        {
          text: "Cancel",
          style: "cancel"
        },
        { 
          text: "Reset", 
          style: "destructive",
          onPress: () => resetStreak("Manual reset")
        }
      ]
    );
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      <Stack.Screen 
        options={{
          title: 'Settings',
          headerStyle: {
            backgroundColor: theme.card,
          },
          headerTitleStyle: {
            color: theme.text,
          },
        }} 
      />
      
      <ScrollView style={styles.scrollView}>
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>Appearance</Text>
          
          <View style={[styles.settingItem, { borderBottomColor: theme.border }]}>
            <View style={styles.settingInfo}>
              {isDark ? (
                <Moon size={20} color={theme.text} />
              ) : (
                <Sun size={20} color={theme.text} />
              )}
              <Text style={[styles.settingLabel, { color: theme.text }]}>Dark Mode</Text>
            </View>
            <Switch
              value={isDark}
              onValueChange={toggleTheme}
              trackColor={{ false: theme.disabled, true: theme.primary }}
              thumbColor="white"
            />
          </View>
          
          <View style={styles.themeSelector}>
            <TouchableOpacity 
              style={[
                styles.themeOption, 
                settings.themeMode === 'light' && styles.selectedThemeOption,
                settings.themeMode === 'light' && { borderColor: theme.primary },
                { backgroundColor: lightModePreview.background }
              ]}
              onPress={() => setTheme('light')}
            >
              <View style={[styles.themePreview, { backgroundColor: lightModePreview.card }]}>
                <View style={[styles.previewHeader, { backgroundColor: lightModePreview.primary }]} />
                <View style={styles.previewContent}>
                  <View style={[styles.previewLine, { backgroundColor: lightModePreview.border }]} />
                  <View style={[styles.previewLine, { backgroundColor: lightModePreview.border, width: '60%' }]} />
                </View>
              </View>
              <Text style={[styles.themeLabel, { color: theme.text }]}>Light</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[
                styles.themeOption, 
                settings.themeMode === 'dark' && styles.selectedThemeOption,
                settings.themeMode === 'dark' && { borderColor: theme.primary },
                { backgroundColor: darkModePreview.background }
              ]}
              onPress={() => setTheme('dark')}
            >
              <View style={[styles.themePreview, { backgroundColor: darkModePreview.card }]}>
                <View style={[styles.previewHeader, { backgroundColor: darkModePreview.primary }]} />
                <View style={styles.previewContent}>
                  <View style={[styles.previewLine, { backgroundColor: darkModePreview.border }]} />
                  <View style={[styles.previewLine, { backgroundColor: darkModePreview.border, width: '60%' }]} />
                </View>
              </View>
              <Text style={[styles.themeLabel, { color: theme.text }]}>Dark</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[
                styles.themeOption, 
                settings.themeMode === 'system' && styles.selectedThemeOption,
                settings.themeMode === 'system' && { borderColor: theme.primary },
                { 
                  backgroundColor: 'transparent',
                  borderWidth: 1,
                  borderColor: theme.border
                }
              ]}
              onPress={() => setTheme('system')}
            >
              <View style={[styles.themePreview, { backgroundColor: theme.card }]}>
                <View style={[styles.previewHeader, { backgroundColor: theme.primary }]} />
                <View style={styles.previewContent}>
                  <View style={[styles.previewLine, { backgroundColor: theme.border }]} />
                  <View style={[styles.previewLine, { backgroundColor: theme.border, width: '60%' }]} />
                </View>
              </View>
              <Text style={[styles.themeLabel, { color: theme.text }]}>System</Text>
            </TouchableOpacity>
          </View>
        </View>
        
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>Notifications</Text>
          <View style={[styles.settingItem, { borderBottomColor: theme.border }]}>
            <View style={styles.settingInfo}>
              <Bell size={20} color={theme.text} />
              <Text style={[styles.settingLabel, { color: theme.text }]}>Enable Notifications</Text>
            </View>
            <Switch
              value={settings.notifications}
              onValueChange={(value) => updateSettings({ notifications: value })}
              trackColor={{ false: theme.disabled, true: theme.primary }}
              thumbColor="white"
            />
          </View>
          
          <View style={[styles.settingItem, { borderBottomColor: theme.border }]}>
            <View style={styles.settingInfo}>
              <Moon size={20} color={theme.text} />
              <Text style={[styles.settingLabel, { color: theme.text }]}>Prayer Reminders</Text>
            </View>
            <Switch
              value={settings.prayerReminders}
              onValueChange={(value) => updateSettings({ prayerReminders: value })}
              trackColor={{ false: theme.disabled, true: theme.primary }}
              thumbColor="white"
            />
          </View>
          
          <View style={[styles.settingItem, { borderBottomColor: theme.border }]}>
            <View style={styles.settingInfo}>
              <Shield size={20} color={theme.text} />
              <Text style={[styles.settingLabel, { color: theme.text }]}>Challenge Reminders</Text>
            </View>
            <Switch
              value={settings.dailyChallengeReminders}
              onValueChange={(value) => updateSettings({ dailyChallengeReminders: value })}
              trackColor={{ false: theme.disabled, true: theme.primary }}
              thumbColor="white"
            />
          </View>
        </View>
        
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>Emergency Contact</Text>
          <View style={styles.inputContainer}>
            <Text style={[styles.inputLabel, { color: theme.textSecondary }]}>Contact Name</Text>
            <TextInput
              style={[
                styles.input, 
                { 
                  backgroundColor: theme.cardAlt,
                  borderColor: theme.border,
                  color: theme.text
                }
              ]}
              value={contactName}
              onChangeText={setContactName}
              placeholder="Enter name"
              placeholderTextColor={theme.textSecondary}
            />
          </View>
          
          <View style={styles.inputContainer}>
            <Text style={[styles.inputLabel, { color: theme.textSecondary }]}>Contact Number</Text>
            <TextInput
              style={[
                styles.input, 
                { 
                  backgroundColor: theme.cardAlt,
                  borderColor: theme.border,
                  color: theme.text
                }
              ]}
              value={contactNumber}
              onChangeText={setContactNumber}
              placeholder="Enter phone number"
              placeholderTextColor={theme.textSecondary}
              keyboardType="phone-pad"
            />
          </View>
          
          <TouchableOpacity 
            style={[styles.saveButton, { backgroundColor: theme.primary }]}
            onPress={handleSaveContact}
          >
            <Phone size={18} color="white" />
            <Text style={styles.saveButtonText}>Save Contact</Text>
          </TouchableOpacity>
          
          <Text style={[styles.helpText, { color: theme.textSecondary }]}>
            This person will be available to contact during moments of temptation.
          </Text>
        </View>
        
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>Profile</Text>
          <View style={styles.inputContainer}>
            <Text style={[styles.inputLabel, { color: theme.textSecondary }]}>Anonymous Username</Text>
            <TextInput
              style={[
                styles.input, 
                { 
                  backgroundColor: theme.cardAlt,
                  borderColor: theme.border,
                  color: theme.text
                }
              ]}
              value={username}
              onChangeText={setUsername}
              placeholder="Enter username"
              placeholderTextColor={theme.textSecondary}
            />
          </View>
          
          <TouchableOpacity 
            style={[styles.saveButton, { backgroundColor: theme.primary }]}
            onPress={handleSaveUsername}
          >
            <User size={18} color="white" />
            <Text style={styles.saveButtonText}>Save Username</Text>
          </TouchableOpacity>
        </View>
        
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>Data Management</Text>
          <TouchableOpacity 
            style={[styles.dangerButton, { backgroundColor: theme.danger }]}
            onPress={handleResetProgress}
          >
            <LogOut size={18} color="white" />
            <Text style={styles.dangerButtonText}>Reset Streak</Text>
          </TouchableOpacity>
        </View>
        
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>About</Text>
          <View style={[styles.aboutCard, { backgroundColor: theme.card }]}>
            <Info size={24} color={theme.primary} />
            <Text style={[styles.appName, { color: theme.text }]}>Esc</Text>
            <Text style={[styles.appVersion, { color: theme.textSecondary }]}>Version 1.0.0</Text>
            <Text style={[styles.appDescription, { color: theme.textSecondary }]}>
              An Islamic app designed to help Muslims overcome addiction through spiritual growth, accountability, and practical tools.
            </Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

// Preview colors for theme options
const lightModePreview = {
  background: '#F9FAFB',
  card: '#FFFFFF',
  primary: '#0A7AFF',
  border: '#E5E7EB',
};

const darkModePreview = {
  background: '#111827',
  card: '#1F2937',
  primary: '#5CA9FF',
  border: '#374151',
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  section: {
    marginVertical: 24,
    paddingHorizontal: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "600",
    marginBottom: 16,
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: 1,
  },
  settingInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  settingLabel: {
    fontSize: 16,
    marginLeft: 12,
  },
  themeSelector: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  themeOption: {
    width: '30%',
    borderRadius: 12,
    overflow: 'hidden',
    alignItems: 'center',
    padding: 8,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  selectedThemeOption: {
    borderWidth: 2,
  },
  themePreview: {
    width: '100%',
    height: 80,
    borderRadius: 8,
    overflow: 'hidden',
    marginBottom: 8,
  },
  previewHeader: {
    height: 20,
    width: '100%',
  },
  previewContent: {
    padding: 8,
    alignItems: 'center',
  },
  previewLine: {
    height: 6,
    width: '80%',
    borderRadius: 3,
    marginVertical: 4,
  },
  themeLabel: {
    fontSize: 14,
    fontWeight: "500",
    marginTop: 4,
  },
  inputContainer: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 14,
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
  },
  saveButton: {
    borderRadius: 12,
    paddingVertical: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  saveButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: "600",
    marginLeft: 8,
  },
  helpText: {
    fontSize: 14,
    fontStyle: 'italic',
  },
  dangerButton: {
    borderRadius: 12,
    paddingVertical: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  dangerButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: "600",
    marginLeft: 8,
  },
  aboutCard: {
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  appName: {
    fontSize: 24,
    fontWeight: "bold",
    marginTop: 12,
    marginBottom: 4,
  },
  appVersion: {
    fontSize: 14,
    marginBottom: 16,
  },
  appDescription: {
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 20,
  },
});