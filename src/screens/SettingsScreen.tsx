import React, { useState, useEffect } from 'react';
import { Box, Text, VStack, FormControl, Input, Button, Divider, Spinner, Select, CheckIcon } from 'native-base';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useSettings } from '../hooks/useSettings';
import { useLanguage } from '../contexts/LanguageContext';
import { translate } from '../i18n';
import { buildPromptPayHelperString } from '../utils/promptpay';

export default function SettingsScreen() {
  const { settings, loading, error, updateSettings } = useSettings();
  const { language, setLanguage } = useLanguage();
  const [stallName, setStallName] = useState('');
  const [ownerName, setOwnerName] = useState('');
  const [currency, setCurrency] = useState('THB');
  const [promptpayId, setPromptpayId] = useState('');
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  useEffect(() => {
    if (settings) {
      setStallName(settings.stallName);
      setOwnerName(settings.ownerName);
      setCurrency(settings.currency);
      setPromptpayId(settings.promptpayId || '');
    }
  }, [settings]);

  const handleSave = async () => {
    try {
      setSaving(true);
      setSaveSuccess(false);
      await updateSettings({
        stallName: stallName.trim(),
        ownerName: ownerName.trim(),
        currency: currency.trim() || 'THB',
        promptpayId: promptpayId.trim() || undefined,
      });
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (err) {
      // Error handled by hook
    } finally {
      setSaving(false);
    }
  };

  if (loading && !settings) {
    return (
      <SafeAreaView style={{ flex: 1 }}>
        <Box flex={1} justifyContent="center" alignItems="center">
          <Spinner size="lg" color="primary.500" />
        </Box>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <Box flex={1} bg="gray.50" p={4}>
        <VStack space={4}>
          <Text fontSize="2xl" fontWeight="bold" color="gray.800">
            {translate('settings.title', language)}
          </Text>

          {error && (
            <Box bg="danger.100" p={3} rounded="md">
              <Text color="danger.600" fontSize="sm">
                {error.message}
              </Text>
            </Box>
          )}

          {saveSuccess && (
            <Box bg="success.100" p={3} rounded="md">
              <Text color="success.600" fontSize="sm">
                {translate('settings.saveSuccess', language)}
              </Text>
            </Box>
          )}

          <Divider />

          <Box bg="white" p={4} rounded="md" shadow={1}>
            <Text fontSize="lg" fontWeight="600" mb={4}>
              {translate('settings.section.stallInfo', language)}
            </Text>
            <VStack space={4}>
              <FormControl>
                <FormControl.Label>
                  {translate('settings.label.stallName', language)}
                </FormControl.Label>
                <Input
                  placeholder={translate('settings.placeholder.stallName', language)}
                  value={stallName}
                  onChangeText={setStallName}
                />
              </FormControl>

              <FormControl>
                <FormControl.Label>
                  {translate('settings.label.ownerName', language)}
                </FormControl.Label>
                <Input
                  placeholder={translate('settings.placeholder.ownerName', language)}
                  value={ownerName}
                  onChangeText={setOwnerName}
                />
              </FormControl>

              <FormControl>
                <FormControl.Label>
                  {translate('settings.label.currency', language)}
                </FormControl.Label>
                <Input value={currency} isReadOnly />
              </FormControl>
            </VStack>
          </Box>

          <Box bg="white" p={4} rounded="md" shadow={1}>
            <Text fontSize="lg" fontWeight="600" mb={4}>
              {translate('settings.section.promptpay', language)}
            </Text>
            <VStack space={4}>
              <FormControl>
                <FormControl.Label>
                  {translate('settings.label.promptpayId', language)}
                </FormControl.Label>
                <Input
                  placeholder={translate('settings.placeholder.promptpayId', language)}
                  keyboardType="numeric"
                  value={promptpayId}
                  onChangeText={setPromptpayId}
                />
              </FormControl>
              <Text fontSize="sm" color="gray.600">
                {translate('settings.promptpay.helper', language)}
              </Text>
              {promptpayId.trim().length > 0 && (
                <Text fontSize="xs" color="gray.500" mt={1}>
                  {buildPromptPayHelperString(promptpayId)}
                </Text>
              )}
            </VStack>
          </Box>

          <Box bg="white" p={4} rounded="md" shadow={1}>
            <Text fontSize="lg" fontWeight="600" mb={4}>
              {translate('settings.section.language', language)}
            </Text>
            <VStack space={4}>
              <FormControl>
                <FormControl.Label>
                  {translate('settings.label.language', language)}
                </FormControl.Label>
                <Select
                  selectedValue={language}
                  minWidth="200"
                  accessibilityLabel={translate('settings.label.language', language)}
                  placeholder={translate('settings.label.language', language)}
                  _selectedItem={{
                    bg: 'primary.100',
                    endIcon: <CheckIcon size={4} />,
                  }}
                  onValueChange={(value) => setLanguage(value as 'en' | 'th')}
                >
                  <Select.Item label={translate('language.english', 'en')} value="en" />
                  <Select.Item label={translate('language.thai', 'th')} value="th" />
                </Select>
              </FormControl>
            </VStack>
          </Box>

          <Button
            colorScheme="primary"
            size="lg"
            mt={4}
            onPress={handleSave}
            isLoading={saving}
            isDisabled={saving}
          >
            {translate('settings.save', language)}
          </Button>
        </VStack>
      </Box>
    </SafeAreaView>
  );
}
