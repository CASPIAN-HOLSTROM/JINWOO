import { Tabs } from 'expo-router';
import { Swords, User, Trophy, ScrollText } from 'lucide-react-native';
import { COLORS } from '@/constants/theme';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: COLORS.background.card,
          borderTopColor: COLORS.system.blue,
          borderTopWidth: 1,
        },
        tabBarActiveTintColor: COLORS.system.glow,
        tabBarInactiveTintColor: COLORS.text.dim,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Dashboard',
          tabBarIcon: ({ color, size }) => (
            <Swords color={color} size={size} />
          ),
        }}
      />
      <Tabs.Screen
        name="quests"
        options={{
          title: 'Quests',
          tabBarIcon: ({ color, size }) => (
            <ScrollText color={color} size={size} />
          ),
        }}
      />
      <Tabs.Screen
        name="titles"
        options={{
          title: 'Titles',
          tabBarIcon: ({ color, size }) => (
            <Trophy color={color} size={size} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ color, size }) => (
            <User color={color} size={size} />
          ),
        }}
      />
    </Tabs>
  );
}
