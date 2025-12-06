import React, { useState, useEffect } from 'react';
import { Box, Text, VStack, FormControl, Input, Button, Divider, Spinner } from 'native-base';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useSettings } from '../hooks/useSettings';

export default function SettingsScreen() {
  const { settings, loading, error, updateSettings } = useSettings();
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
            Settings
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
                Settings saved successfully!
              </Text>
            </Box>
          )}

          <Divider />

          <Box bg="white" p={4} rounded="md" shadow={1}>
            <Text fontSize="lg" fontWeight="600" mb={4}>
              Stall Information
            </Text>
            <VStack space={4}>
              <FormControl>
                <FormControl.Label>Stall Name</FormControl.Label>
                <Input
                  placeholder="Enter stall name"
                  value={stallName}
                  onChangeText={setStallName}
                />
              </FormControl>

              <FormControl>
                <FormControl.Label>Owner Name</FormControl.Label>
                <Input
                  placeholder="Enter owner name"
                  value={ownerName}
                  onChangeText={setOwnerName}
                />
              </FormControl>

              <FormControl>
                <FormControl.Label>Currency</FormControl.Label>
                <Input value={currency} isReadOnly />
              </FormControl>
            </VStack>
          </Box>

          <Box bg="white" p={4} rounded="md" shadow={1}>
            <Text fontSize="lg" fontWeight="600" mb={4}>
              PromptPay (Optional)
            </Text>
            <VStack space={4}>
              <FormControl>
                <FormControl.Label>PromptPay ID</FormControl.Label>
                <Input
                  placeholder="Phone number or ID"
                  keyboardType="numeric"
                  value={promptpayId}
                  onChangeText={setPromptpayId}
                />
              </FormControl>
              <Text fontSize="sm" color="gray.600">
                Generate QR codes for payments (coming in Milestone 4)
              </Text>
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
            Save Settings
          </Button>
        </VStack>
      </Box>
    </SafeAreaView>
  );
}
