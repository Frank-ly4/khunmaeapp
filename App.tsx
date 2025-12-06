import React, { useEffect, useState } from 'react';
import { NativeBaseProvider, Box, Spinner, Text } from 'native-base';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { theme } from './src/theme';
import AppNavigator from './src/navigation/AppNavigator';
import { initDatabase } from './src/db';

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
        <AppNavigator />
      </NativeBaseProvider>
    </SafeAreaProvider>
  );
}

