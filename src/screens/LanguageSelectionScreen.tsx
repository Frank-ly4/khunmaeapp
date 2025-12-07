import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Box, Button, Text, VStack } from 'native-base';
import { useLanguage } from '../contexts/LanguageContext';
import { translate } from '../i18n';

export default function LanguageSelectionScreen() {
  const { language, setLanguage } = useLanguage();

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <Box flex={1} bg="gray.50" p={6} justifyContent="center" alignItems="center">
        <VStack space={6} width="100%" maxW="sm">
          <Text fontSize="2xl" fontWeight="bold" textAlign="center" color="gray.800">
            {translate('language.title', language)}
          </Text>
          <Text fontSize="md" textAlign="center" color="gray.600">
            {translate('language.subtitle', language)}
          </Text>

          <VStack space={4} mt={4}>
            <Button
              size="lg"
              colorScheme="primary"
              onPress={() => setLanguage('en')}
            >
              {translate('language.english', 'en')}
            </Button>
            <Button
              size="lg"
              variant="outline"
              colorScheme="primary"
              onPress={() => setLanguage('th')}
            >
              {translate('language.thai', 'th')}
            </Button>
          </VStack>
        </VStack>
      </Box>
    </SafeAreaView>
  );
}


