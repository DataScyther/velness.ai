import React from 'react';
import { View, Text, Pressable, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { useRouter } from 'expo-router';
import { ArrowLeft, Shield, Key, Download, FileText, Mail } from 'lucide-react-native';

export default function SecurityScreen() {
  const router = useRouter();

  return (
    <SafeAreaView className="flex-1 bg-app-dark" edges={['top']}>
      <StatusBar style="light" />
      <View className="px-5 pt-4 pb-6 flex-row items-center border-b border-velness-glass-border">
        <Pressable onPress={() => router.back()} className="w-10 h-10 items-center justify-center active:opacity-70">
          <ArrowLeft size={22} color="white" />
        </Pressable>
        <Text className="text-white text-card-title font-semibold ml-4">Privacy & Security</Text>
      </View>

      <ScrollView className="flex-1 px-5" contentContainerStyle={{ paddingBottom: 40 }}>
        <Text className="text-white/50 text-label font-medium uppercase tracking-wider mt-6 mb-3">
          Security
        </Text>
        <View className="bg-velness-glass-dark/20 rounded-glass border border-velness-glass-border overflow-hidden">
          <SecurityRow icon={Key} label="Change Password" description="Update your account password" isFirst />
          <SecurityRow icon={Mail} label="Email Verification" description="Manage your verified email" isLast />
        </View>

        <Text className="text-white/50 text-label font-medium uppercase tracking-wider mt-8 mb-3">
          Data
        </Text>
        <View className="bg-velness-glass-dark/20 rounded-glass border border-velness-glass-border overflow-hidden">
          <SecurityRow icon={Download} label="Export My Data" description="Download a copy of your data" isFirst />
          <SecurityRow icon={FileText} label="Privacy Policy" description="How we handle your data" />
          <SecurityRow icon={Shield} label="Terms of Service" description="Platform terms and conditions" isLast />
        </View>

        <View className="mt-8 bg-velness-glass-dark/20 rounded-glass p-4 border border-velness-glass-border">
          <Text className="text-white/50 text-body-sm text-center leading-relaxed">
            Your data is encrypted in transit and at rest. We use industry-standard security practices to protect your information. For account deletion or data requests, contact our support team.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

function SecurityRow({
  icon: Icon,
  label,
  description,
  isFirst,
  isLast,
}: {
  icon: any;
  label: string;
  description: string;
  isFirst?: boolean;
  isLast?: boolean;
}) {
  return (
    <Pressable
      className={`flex-row items-center px-4 py-4 ${!isLast ? 'border-b border-velness-glass-border/50' : ''} active:opacity-70`}
    >
      <Icon size={18} color="rgba(255,255,255,0.4)" />
      <View className="flex-1 ml-3">
        <Text className="text-white/80 text-body font-medium">{label}</Text>
        <Text className="text-white/40 text-body-sm mt-0.5">{description}</Text>
      </View>
      <Text className="text-white/30 text-lg ml-2">›</Text>
    </Pressable>
  );
}
