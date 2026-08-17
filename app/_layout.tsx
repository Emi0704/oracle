import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useFonts } from 'expo-font';
import { CycleProvider, useCycle } from '../context/CycleContext';
import { View, ActivityIndicator } from 'react-native';
import { DarkColors } from '../constants/theme';

function AppContent() {
  const { data } = useCycle();
  return (
    <>
      <StatusBar style={data.settings.themeMode === 'light' ? 'dark' : 'light'} />
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(tabs)" />
      </Stack>
    </>
  );
}

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    'Cinzel': require('../assets/fonts/Cinzel-Regular.ttf'),
    'Cinzel-Bold': require('../assets/fonts/Cinzel-Bold.ttf'),
  });

  if (!fontsLoaded) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: DarkColors.background }}>
        <ActivityIndicator size="large" color={DarkColors.silver} />
      </View>
    );
  }

  return (
    <CycleProvider>
      <AppContent />
    </CycleProvider>
  );
}
