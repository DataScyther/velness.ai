import React, { useCallback } from 'react';
import { View, Text, Pressable, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { useRouter } from 'expo-router';
import { ArrowLeft, Moon, Sun, Monitor, Volume2, Languages, Trash2 } from 'lucide-react-native';
import { useAppStore, type ThemeMode } from '@/core/store/useAppStore';

const themeOptions: { label: string; value: ThemeMode; icon: typeof Moon }[] = [
  { label: 'Dark', value: 'dark', icon: Moon },
  { label: 'Light', value: 'light', icon: Sun },
  { label: 'Auto', value: 'auto', icon: Monitor },
];

const toneOptions = [
  { label: 'Warm', value: 'warm' as const },
  { label: 'Motivational', value: 'motivational' as const },
  { label: 'Soothing', value: 'soothing' as const },
  { label: 'Auto', value: 'auto' as const },
];

export default function SettingsScreen() {
  const router = useRouter();
  const theme = useAppStore((state) => state.ui.theme);
  const setTheme = useAppStore((state) => state.setTheme);

  const handleDeleteAccount = useCallback(() => {
    router.back();
  }, [router]);

  return (
    <SafeAreaView className="flex-1 bg-app-dark" edges={['top']}>
      <StatusBar style="light" />
      <View className="px-5 pt-4 pb-6 flex-row items-center border-b border-velness-glass-border">
        <Pressable onPress={() => router.back()} className="w-10 h-10 items-center justify-center active:opacity-70">
          <ArrowLeft size={22} color="white" />
        </Pressable>
        <Text className="text-white text-card-title font-semibold ml-4">Settings</Text>
      </View>

      <ScrollView className="flex-1 px-5" contentContainerStyle={{ paddingBottom: 40 }}>
        <Text className="text-white/50 text-label font-medium uppercase tracking-wider mt-6 mb-3">
          Appearance
        </Text>
        <View className="bg-velness-glass-dark/20 rounded-glass border border-velness-glass-border overflow-hidden">
          {themeOptions.map((opt, i) => {
            const Icon = opt.icon;
            const selected = theme === opt.value;
            return (
              <Pressable
                key={opt.value}
                onPress={() => setTheme(opt.value)}
                className={`flex-row items-center px-4 py-4 ${i < themeOptions.length - 1 ? 'border-b border-velness-glass-border/50' : ''} ${selected ? 'bg-velness-purple-600/20' : ''} active:opacity-70`}
              >
                <Icon size={18} color={selected ? '#8B5CF6' : 'rgba(255,255,255,0.4)'} />
                <Text className={`flex-1 ml-3 text-body ${selected ? 'text-velness-purple-400 font-medium' : 'text-white/70'}`}>
                  {opt.label}
                </Text>
                {selected && <View className="w-2.5 h-2.5 rounded-full bg-velness-purple-500" />}
              </Pressable>
            );
          })}
        </View>

        <Text className="text-white/50 text-label font-medium uppercase tracking-wider mt-8 mb-3">
          Communication Tone
        </Text>
        <View className="bg-velness-glass-dark/20 rounded-glass border border-velness-glass-border overflow-hidden">
          {toneOptions.map((opt, i) => {
            const selected = false;
            return (
              <View
                key={opt.value}
                className={`flex-row items-center px-4 py-4 ${i < toneOptions.length - 1 ? 'border-b border-velness-glass-border/50' : ''} ${selected ? 'bg-velness-purple-600/20' : ''}`}
              >
                <Volume2 size={18} color={selected ? '#8B5CF6' : 'rgba(255,255,255,0.4)'} />
                <Text className={`flex-1 ml-3 text-body ${selected ? 'text-velness-purple-400 font-medium' : 'text-white/70'}`}>
                  {opt.label}
                </Text>
                {selected && <View className="w-2.5 h-2.5 rounded-full bg-velness-purple-500" />}
              </View>
            );
          })}
        </View>
        <Text className="text-white/30 text-body-sm mt-2 ml-1">
          Tone preference will be available after an AI chat session.
        </Text>

        <Text className="text-white/50 text-label font-medium uppercase tracking-wider mt-8 mb-3">
          Language
        </Text>
        <View className="bg-velness-glass-dark/20 rounded-glass border border-velness-glass-border px-4 py-4 flex-row items-center">
          <Languages size={18} color="rgba(255,255,255,0.4)" />
          <Text className="flex-1 ml-3 text-white/70 text-body">English</Text>
          <Text className="text-white/30 text-label">Only language</Text>
        </View>

        <Text className="text-white/50 text-label font-medium uppercase tracking-wider mt-8 mb-3">
          Account
        </Text>
        <Pressable
          onPress={handleDeleteAccount}
          className="bg-velness-glass-dark/20 rounded-glass border border-velness-glass-border px-4 py-4 flex-row items-center active:opacity-70"
        >
          <Trash2 size={18} color="#F87171" />
          <Text className="flex-1 ml-3 text-red-400 text-body">Delete Account</Text>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}
