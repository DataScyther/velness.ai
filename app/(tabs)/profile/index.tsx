import React, { useCallback, useState } from 'react';
import { View, Text, Pressable, ScrollView, Alert, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { useRouter } from 'expo-router';
import { User, Settings, Bell, Shield, CreditCard, LogOut } from 'lucide-react-native';
import { useAppStore } from '@/core/store/useAppStore';

const menuItems = [
  { icon: Bell, title: 'Notifications', route: 'notifications', color: '#8B5CF6' },
  { icon: Shield, title: 'Privacy & Security', route: 'security', color: '#06B6D4' },
  { icon: CreditCard, title: 'Subscription', route: 'subscription', color: '#A78BFA' },
  { icon: Settings, title: 'Settings', route: 'settings', color: '#22D3EE' },
];

export default function ProfileScreen() {
  const router = useRouter();
  const user = useAppStore((state) => state.session.user);
  const logout = useAppStore((state) => state.logout);
  const [signingOut, setSigningOut] = useState(false);

  const handleSignOut = useCallback(() => {
    Alert.alert('Sign Out', 'Are you sure you want to sign out?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Sign Out',
        style: 'destructive',
        onPress: async () => {
          setSigningOut(true);
          try {
            await logout();
            router.replace('/');
          } catch {
            setSigningOut(false);
          }
        },
      },
    ]);
  }, [logout, router]);

  return (
    <SafeAreaView className="flex-1 bg-app-dark" edges={['top']}>
      <StatusBar style="light" />
      <ScrollView
        className="flex-1 px-5"
        contentContainerStyle={{ paddingBottom: 24 }}
        showsVerticalScrollIndicator={false}
      >
        <View className="pt-4 pb-8 items-center">
          <View className="w-20 h-20 rounded-full bg-velness-purple-600/30 items-center justify-center mb-4 border border-velness-glass-border">
            <User size={36} color="#8B5CF6" />
          </View>
          <Text className="text-white text-card-title font-semibold">
            {user?.name || 'Your Profile'}
          </Text>
          <Text className="text-white/40 text-body-sm mt-1">
            {user?.email || 'Manage your account'}
          </Text>
        </View>

        {menuItems.map((item, index) => {
          const IconComponent = item.icon;
          return (
            <Pressable
              key={index}
              onPress={() => router.push(`/(tabs)/profile/${item.route}` as any)}
              className="bg-velness-glass-dark/20 rounded-glass p-4 mb-3 border border-velness-glass-border flex-row items-center active:opacity-70"
            >
              <View
                className="w-10 h-10 rounded-full items-center justify-center"
                style={{ backgroundColor: `${item.color}20` }}
              >
                <IconComponent size={20} color={item.color} />
              </View>
              <Text className="text-white text-body flex-1 ml-4">
                {item.title}
              </Text>
              <Text className="text-white/30 text-lg">›</Text>
            </Pressable>
          );
        })}

        <Pressable
          onPress={handleSignOut}
          disabled={signingOut}
          className="mt-6 bg-velness-glass-dark/20 rounded-glass p-4 border border-velness-glass-border flex-row items-center justify-center active:opacity-70"
        >
          {signingOut ? (
            <ActivityIndicator color="#F87171" size="small" />
          ) : (
            <>
              <LogOut size={18} color="#F87171" />
              <Text className="text-red-400 text-body font-medium ml-3">
                Sign Out
              </Text>
            </>
          )}
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}
