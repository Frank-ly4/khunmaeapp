import React, { useState } from 'react';
import { Box, Text, VStack, Button, Input, FormControl, Select, Spinner } from 'native-base';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { useCreateOverhead } from '../hooks/useOverheads';
import { parseCurrency } from '../utils/currency';
import { formatDateForInput, parseDateFromInput } from '../utils/dateHelpers';

const CATEGORY_SUGGESTIONS = [
  'Rent',
  'Stall Fee',
  'Electricity',
  'Water',
  'Labor',
  'Transportation',
  'Equipment',
  'Other',
];

export default function OverheadFormScreen() {
  const navigation = useNavigation();
  const { createOverhead, loading: creating } = useCreateOverhead();

  const [category, setCategory] = useState('');
  const [customCategory, setCustomCategory] = useState('');
  const [amount, setAmount] = useState('');
  const [expenseDate, setExpenseDate] = useState(formatDateForInput(new Date()));
  const [note, setNote] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  const finalCategory = category === 'Other' ? customCategory : category;

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};
    if (!category) {
      newErrors.category = 'Please select a category';
    } else if (category === 'Other' && !customCategory.trim()) {
      newErrors.category = 'Please enter a category name';
    }
    if (!amount.trim()) {
      newErrors.amount = 'Amount is required';
    } else {
      const amt = parseCurrency(amount);
      if (isNaN(amt) || amt <= 0) {
        newErrors.amount = 'Amount must be a positive number';
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
      await createOverhead({
        category: finalCategory,
        amount: parseCurrency(amount),
        expenseDate: parseDateFromInput(expenseDate).toISOString(),
        note: note.trim() || undefined,
      });
      navigation.goBack();
    } catch (err) {
      // Error handled by hook
    }
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <Box flex={1} bg="gray.50" p={4}>
        <VStack space={4}>
          <Text fontSize="2xl" fontWeight="bold" color="gray.800">
            Add Overhead Expense
          </Text>

          <FormControl isInvalid={!!errors.category}>
            <FormControl.Label>Category *</FormControl.Label>
            <Select
              selectedValue={category}
              minWidth="200"
              accessibilityLabel="Select Category"
              placeholder="Choose a category"
              onValueChange={setCategory}
            >
              {CATEGORY_SUGGESTIONS.map((cat) => (
                <Select.Item key={cat} label={cat} value={cat} />
              ))}
            </Select>
            {category === 'Other' && (
              <Input
                mt={2}
                placeholder="Enter category name"
                value={customCategory}
                onChangeText={setCustomCategory}
              />
            )}
            <FormControl.ErrorMessage>{errors.category}</FormControl.ErrorMessage>
          </FormControl>

          <FormControl isInvalid={!!errors.amount}>
            <FormControl.Label>Amount (THB) *</FormControl.Label>
            <Input
              placeholder="0.00"
              keyboardType="numeric"
              value={amount}
              onChangeText={setAmount}
            />
            <FormControl.ErrorMessage>{errors.amount}</FormControl.ErrorMessage>
          </FormControl>

          <FormControl>
            <FormControl.Label>Expense Date *</FormControl.Label>
            <Input
              type="date"
              value={expenseDate}
              onChangeText={setExpenseDate}
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
            Save Expense
          </Button>
        </VStack>
      </Box>
    </SafeAreaView>
  );
}

