import React, { useState } from 'react';
import { View, Text, Pressable, ScrollView, Switch } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { useRouter } from 'expo-router';
import { ArrowLeft, Bell, BellOff, MessageCircle, Heart, Trophy } from 'lucide-react-native';

export default function NotificationsScreen() {
  const router = useRouter();
  const [pushEnabled, setPushEnabled] = useState(false);
  const [dailyReminder, setDailyReminder] = useState(false);
  const [messageAlerts, setMessageAlerts] = useState(true);
  const [milestoneAlerts, setMilestoneAlerts] = useState(true);

  return (
    <SafeAreaView className="flex-1 bg-app-dark" edges={['top']}>
      <StatusBar style="light" />
      <View className="px-5 pt-4 pb-6 flex-row items-center border-b border-velness-glass-border">
        <Pressable onPress={() => router.back()} className="w-10 h-10 items-center justify-center active:opacity-70">
          <ArrowLeft size={22} color="white" />
        </Pressable>
        <Text className="text-white text-card-title font-semibold ml-4">Notifications</Text>
      </View>

      <ScrollView className="flex-1 px-5" contentContainerStyle={{ paddingBottom: 40 }}>
        <Text className="text-white/50 text-label font-medium uppercase tracking-wider mt-6 mb-3">
          Push Notifications
        </Text>
        <View className="bg-velness-glass-dark/20 rounded-glass border border-velness-glass-border overflow-hidden">
          <NotificationRow
            icon={pushEnabled ? Bell : BellOff}
            label="Enable Push Notifications"
            description="Receive alerts and updates"
            value={pushEnabled}
            onValueChange={setPushEnabled}
            isFirst
          />
          <NotificationRow
            icon={Heart}
            label="Daily Reminder"
            description="Gentle nudge to check in each day"
            value={dailyReminder}
            onValueChange={setDailyReminder}
          />
          <NotificationRow
            icon={MessageCircle}
            label="Message Alerts"
            description="New group chat messages"
            value={messageAlerts}
            onValueChange={setMessageAlerts}
          />
          <NotificationRow
            icon={Trophy}
            label="Milestone Alerts"
            description="Streaks, achievements, and progress"
            value={milestoneAlerts}
            onValueChange={setMilestoneAlerts}
            isLast
          />
        </View>

        <Text className="text-white/30 text-body-sm mt-4 ml-1 leading-relaxed">
          Push notification support requires configuring Expo Notifications and storing push tokens in your profile. Enable this feature to receive real-time alerts.
        </Text>

        {!pushEnabled && (
          <View className="mt-6 bg-velness-glass-dark/20 rounded-glass p-4 border border-velness-glass-border">
            <Text className="text-white/50 text-body-sm text-center">
              Notifications are currently disabled. Toggle "Enable Push Notifications" above to configure your preferences.
            </Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

function NotificationRow({
  icon: Icon,
  label,
  description,
  value,
  onValueChange,
  isFirst,
  isLast,
}: {
  icon: any;
  label: string;
  description: string;
  value: boolean;
  onValueChange: (v: boolean) => void;
  isFirst?: boolean;
  isLast?: boolean;
}) {
  return (
    <View
      className={`flex-row items-center px-4 py-4 ${!isLast ? 'border-b border-velness-glass-border/50' : ''}`}
    >
      <Icon size={18} color="rgba(255,255,255,0.4)" />
      <View className="flex-1 ml-3">
        <Text className="text-white/80 text-body font-medium">{label}</Text>
        <Text className="text-white/40 text-body-sm mt-0.5">{description}</Text>
      </View>
      <Switch
        value={value}
        onValueChange={onValueChange}
        trackColor={{ false: 'rgba(255,255,255,0.1)', true: '#8B5CF680' }}
        thumbColor={value ? '#8B5CF6' : 'rgba(255,255,255,0.4)'}
      />
    </View>
  );
}
