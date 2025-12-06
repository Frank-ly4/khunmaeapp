import React, { useState } from 'react';
import { Box, Text, VStack, Button, Input, FormControl, Select, Spinner } from 'native-base';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { useItems } from '../hooks/useItems';
import { useCreatePurchase } from '../hooks/usePurchases';
import { parseCurrency } from '../utils/currency';
import { formatDateForInput, parseDateFromInput } from '../utils/dateHelpers';

export default function PurchaseFormScreen() {
  const navigation = useNavigation();
  const { items, loading: loadingItems } = useItems();
  const { createPurchase, loading: creating } = useCreatePurchase();

  const [itemId, setItemId] = useState('');
  const [quantityPurchased, setQuantityPurchased] = useState('');
  const [totalCost, setTotalCost] = useState('');
  const [purchaseDate, setPurchaseDate] = useState(formatDateForInput(new Date()));
  const [note, setNote] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};
    if (!itemId) {
      newErrors.itemId = 'Please select an item';
    }
    if (!quantityPurchased.trim()) {
      newErrors.quantityPurchased = 'Quantity is required';
    } else {
      const qty = parseFloat(quantityPurchased);
      if (isNaN(qty) || qty <= 0) {
        newErrors.quantityPurchased = 'Quantity must be a positive number';
      }
    }
    if (!totalCost.trim()) {
      newErrors.totalCost = 'Total cost is required';
    } else {
      const cost = parseCurrency(totalCost);
      if (isNaN(cost) || cost <= 0) {
        newErrors.totalCost = 'Cost must be a positive number';
      }
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (!validate()) {
      return;
    }

    try {
      await createPurchase({
        itemId,
        quantityPurchased: parseFloat(quantityPurchased),
        totalCost: parseCurrency(totalCost),
        purchaseDate: parseDateFromInput(purchaseDate).toISOString(),
        note: note.trim() || undefined,
      });
      navigation.goBack();
    } catch (err) {
      // Error handled by hook
    }
  };

  if (loadingItems) {
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
            Add Purchase
          </Text>

          <FormControl isInvalid={!!errors.itemId}>
            <FormControl.Label>Item *</FormControl.Label>
            <Select
              selectedValue={itemId}
              minWidth="200"
              accessibilityLabel="Select Item"
              placeholder="Choose an item"
              onValueChange={setItemId}
            >
              {items.map((item) => (
                <Select.Item key={item.id} label={item.name} value={item.id} />
              ))}
            </Select>
            <FormControl.ErrorMessage>{errors.itemId}</FormControl.ErrorMessage>
          </FormControl>

          <FormControl isInvalid={!!errors.quantityPurchased}>
            <FormControl.Label>Quantity Purchased *</FormControl.Label>
            <Input
              placeholder="0"
              keyboardType="numeric"
              value={quantityPurchased}
              onChangeText={setQuantityPurchased}
            />
            <FormControl.ErrorMessage>{errors.quantityPurchased}</FormControl.ErrorMessage>
          </FormControl>

          <FormControl isInvalid={!!errors.totalCost}>
            <FormControl.Label>Total Cost (THB) *</FormControl.Label>
            <Input
              placeholder="0.00"
              keyboardType="numeric"
              value={totalCost}
              onChangeText={setTotalCost}
            />
            <FormControl.ErrorMessage>{errors.totalCost}</FormControl.ErrorMessage>
          </FormControl>

          <FormControl>
            <FormControl.Label>Purchase Date *</FormControl.Label>
            <Input
              type="date"
              value={purchaseDate}
              onChangeText={setPurchaseDate}
            />
            <FormControl.HelperText>
              Format: YYYY-MM-DD
            </FormControl.HelperText>
          </FormControl>

          <FormControl>
            <FormControl.Label>Note (Optional)</FormControl.Label>
            <Input
              placeholder="Add a note..."
              value={note}
              onChangeText={setNote}
            />
          </FormControl>

          <Button
            colorScheme="success"
            size="lg"
            mt={2}
            onPress={handleSave}
            isLoading={creating}
            isDisabled={creating}
          >
            Save Purchase
          </Button>
        </VStack>
      </Box>
    </SafeAreaView>
  );
}

