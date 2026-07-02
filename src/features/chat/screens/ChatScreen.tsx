import React from 'react';
import { View, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { ChatHeader } from '../components/ChatHeader';
import { ChatContainer } from '../components/ChatContainer';

export function ChatScreen() {
  const [messages, setMessages] = React.useState<any[]>([]);

  const handleQuickStarterPress = (text: string) => {
    console.log('Quick starter pressed:', text);
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <StatusBar style="light" />
      <ChatHeader />
      <View style={styles.content}>
        <ChatContainer
          messages={messages}
          onQuickStarterPress={handleQuickStarterPress}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0B0B12',
  },
  content: {
    flex: 1,
  },
});

export default ChatScreen;
