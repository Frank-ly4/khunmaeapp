import React from 'react';
import { Box, Text, VStack, Button, FlatList, HStack, Spinner } from 'native-base';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { useOverheads } from '../hooks/useOverheads';
import { formatCurrency } from '../utils/currency';
import { formatDate } from '../utils/dateHelpers';

export default function OverheadsScreen() {
  const navigation = useNavigation();
  const { overheads, loading, error, refetch } = useOverheads();

  if (loading && overheads.length === 0) {
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
      <Box flex={1} bg="gray.50">
        <Box p={4}>
          <HStack justifyContent="space-between" alignItems="center" mb={4}>
            <Text fontSize="2xl" fontWeight="bold" color="gray.800">
              Overhead Expenses
            </Text>
            <HStack space={2}>
              <Button
                colorScheme="secondary"
                size="sm"
                variant="outline"
                onPress={() => navigation.navigate('PurchasesList' as never)}
              >
                Purchases
              </Button>
              <Button
                colorScheme="primary"
                size="sm"
                onPress={() => navigation.navigate('OverheadForm' as never)}
              >
                Add Expense
            </Button>
            </HStack>
          </HStack>
        </Box>

        {error && (
          <Box px={4} mb={2}>
            <Text color="danger.500" fontSize="sm">
              {error.message}
            </Text>
          </Box>
        )}

        {overheads.length === 0 ? (
          <Box flex={1} justifyContent="center" alignItems="center" px={4}>
            <Text fontSize="lg" color="gray.500" textAlign="center">
              No overhead expenses recorded yet.{'\n'}Track rent, stall fees, and other costs.
            </Text>
          </Box>
        ) : (
          <FlatList
            data={overheads}
            keyExtractor={(item) => item.id}
            onRefresh={refetch}
            refreshing={loading}
            renderItem={({ item }) => (
              <Box bg="white" p={4} mx={4} mb={2} rounded="md" shadow={1}>
                <HStack justifyContent="space-between" alignItems="flex-start">
                  <VStack flex={1}>
                    <Text fontSize="md" fontWeight="600">
                      {item.category}
                    </Text>
                    {item.note && (
                      <Text fontSize="sm" color="gray.600">
                        {item.note}
                      </Text>
                    )}
                  </VStack>
                  <Text fontSize="md" fontWeight="bold" color="danger.500">
                    {formatCurrency(item.amount)}
                  </Text>
                </HStack>
                <Text fontSize="xs" color="gray.500" mt={2}>
                  {formatDate(item.expenseDate)}
                </Text>
              </Box>
            )}
            contentContainerStyle={{ paddingVertical: 8 }}
          />
        )}
      </Box>
    </SafeAreaView>
  );
}
