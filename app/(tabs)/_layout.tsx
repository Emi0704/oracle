import { Tabs } from 'expo-router';
import { useCycle } from '../../context/CycleContext';
import { TabIcon } from '../../components/TabIcon';

export default function TabLayout() {
  const { colors } = useCycle();

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: colors.backgroundDark,
          borderTopColor: colors.silver + '40',
          borderTopWidth: 1,
          height: 70,
          paddingBottom: 10,
          paddingTop: 8,
        },
        tabBarActiveTintColor: colors.silver,
        tabBarInactiveTintColor: colors.lavender + '80',
        tabBarLabelStyle: {
          fontFamily: 'Cinzel',
          fontSize: 10,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Oracle',
          tabBarIcon: ({ color, size }) => (
            <TabIcon name="crystal-ball" color={color as string} size={size} />
          ),
        }}
      />
      <Tabs.Screen
        name="insights"
        options={{
          title: 'Visions',
          tabBarIcon: ({ color, size }) => (
            <TabIcon name="eye" color={color as string} size={size} />
          ),
        }}
      />
      <Tabs.Screen
        name="info"
        options={{
          title: 'Codex',
          tabBarIcon: ({ color, size }) => (
            <TabIcon name="book" color={color as string} size={size} />
          ),
        }}
      />
      <Tabs.Screen
        name="compare"
        options={{
          title: 'Mirror',
          tabBarIcon: ({ color, size }) => (
            <TabIcon name="mirror" color={color as string} size={size} />
          ),
        }}
      />
    </Tabs>
  );
}
