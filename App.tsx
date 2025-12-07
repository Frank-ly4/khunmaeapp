import React, { useEffect, useState } from 'react';
import { LogBox } from 'react-native';
import { NativeBaseProvider, Box, Spinner, Text } from 'native-base';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { theme } from './src/theme';
import AppNavigator from './src/navigation/AppNavigator';
import { initDatabase } from './src/db';
import { LanguageProvider, useLanguage } from './src/contexts/LanguageContext';
import LanguageSelectionScreen from './src/screens/LanguageSelectionScreen';

// Suppress specific warnings
LogBox.ignoreLogs([
  'In React 18, SSRProvider is not necessary and is a noop. You can remove it from your app.',
]);

export default function App() {
  const [dbInitialized, setDbInitialized] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const initialize = async () => {
      try {
        await initDatabase();
        setDbInitialized(true);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to initialize database'));
      }
    };
    initialize();
  }, []);

  if (error) {
    return (
      <SafeAreaProvider>
        <NativeBaseProvider theme={theme}>
          <Box flex={1} justifyContent="center" alignItems="center" p={4}>
            <Text color="danger.500" fontSize="lg">
              Error: {error.message}
            </Text>
          </Box>
        </NativeBaseProvider>
      </SafeAreaProvider>
    );
  }

  if (!dbInitialized) {
    return (
      <SafeAreaProvider>
        <NativeBaseProvider theme={theme}>
          <Box flex={1} justifyContent="center" alignItems="center">
            <Spinner size="lg" color="primary.500" />
          </Box>
        </NativeBaseProvider>
      </SafeAreaProvider>
    );
  }

  return (
    <SafeAreaProvider>
      <NativeBaseProvider theme={theme}>
        <LanguageProvider>
          <RootContent />
        </LanguageProvider>
      </NativeBaseProvider>
    </SafeAreaProvider>
  );
}

function RootContent() {
  const { loading, needsSelection } = useLanguage();

  if (loading) {
    return (
      <Box flex={1} justifyContent="center" alignItems="center">
        <Spinner size="lg" color="primary.500" />
      </Box>
    );
  }

  if (needsSelection) {
    return <LanguageSelectionScreen />;
  }

  return <AppNavigator />;
}
