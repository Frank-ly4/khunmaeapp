import React, { useState } from 'react';
import { Box, Text, VStack, Button, Input, FormControl, Select, Spinner } from 'native-base';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { useItems } from '../hooks/useItems';
import { useCreateSale } from '../hooks/useSales';
import { PaymentMethod } from '../models';
import { parseCurrency } from '../utils/currency';
import { formatCurrency } from '../utils/currency';

export default function SaleFormScreen() {
  const navigation = useNavigation();
  const { items, loading: loadingItems } = useItems();
  const { createSale, loading: creating } = useCreateSale();

  const [itemId, setItemId] = useState('');
  const [quantity, setQuantity] = useState('');
  const [salePricePerUnit, setSalePricePerUnit] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('CASH');
  const [note, setNote] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  const selectedItem = items.find((item) => item.id === itemId);

  React.useEffect(() => {
    if (selectedItem && !salePricePerUnit) {
      setSalePricePerUnit(selectedItem.defaultSalePrice.toString());
    }
  }, [itemId, selectedItem]);

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};
    if (!itemId) {
      newErrors.itemId = 'Please select an item';
    }
    if (!quantity.trim()) {
      newErrors.quantity = 'Quantity is required';
    } else {
      const qty = parseFloat(quantity);
      if (isNaN(qty) || qty <= 0) {
        newErrors.quantity = 'Quantity must be a positive number';
      }
    }
    if (!salePricePerUnit.trim()) {
      newErrors.salePricePerUnit = 'Sale price is required';
    } else {
      const price = parseCurrency(salePricePerUnit);
      if (isNaN(price) || price <= 0) {
        newErrors.salePricePerUnit = 'Price must be a positive number';
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
      await createSale({
        itemId,
        quantitySold: parseFloat(quantity),
        salePricePerUnit: parseCurrency(salePricePerUnit),
        saleDateTime: new Date().toISOString(),
        paymentMethod,
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
            Add Sale
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

          <FormControl isInvalid={!!errors.quantity}>
            <FormControl.Label>Quantity *</FormControl.Label>
            <Input
              placeholder="0"
              keyboardType="numeric"
              value={quantity}
              onChangeText={setQuantity}
            />
            <FormControl.ErrorMessage>{errors.quantity}</FormControl.ErrorMessage>
          </FormControl>

          <FormControl isInvalid={!!errors.salePricePerUnit}>
            <FormControl.Label>Sale Price Per Unit (THB) *</FormControl.Label>
            <Input
              placeholder="0.00"
              keyboardType="numeric"
              value={salePricePerUnit}
              onChangeText={setSalePricePerUnit}
            />
            {selectedItem && (
              <FormControl.HelperText>
                Default: {formatCurrency(selectedItem.defaultSalePrice)}
              </FormControl.HelperText>
            )}
            <FormControl.ErrorMessage>{errors.salePricePerUnit}</FormControl.ErrorMessage>
          </FormControl>

          <FormControl>
            <FormControl.Label>Payment Method *</FormControl.Label>
            <Select
              selectedValue={paymentMethod}
              minWidth="200"
              accessibilityLabel="Select Payment Method"
              onValueChange={(value) => setPaymentMethod(value as PaymentMethod)}
            >
              <Select.Item label="Cash" value="CASH" />
              <Select.Item label="PromptPay" value="PROMPTPAY" />
              <Select.Item label="Other" value="OTHER" />
            </Select>
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
            Save Sale
          </Button>
        </VStack>
      </Box>
    </SafeAreaView>
  );
}

