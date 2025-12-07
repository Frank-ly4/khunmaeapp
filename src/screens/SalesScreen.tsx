import React from 'react';
import { Box, Text, VStack, Button, FlatList, Badge, HStack, Spinner } from 'native-base';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { useSales } from '../hooks/useSales';
import { formatCurrency } from '../utils/currency';
import { formatDateTime } from '../utils/dateHelpers';
import { useLanguage } from '../contexts/LanguageContext';
import { translate } from '../i18n';

export default function SalesScreen() {
  const navigation = useNavigation();
  const { sales, loading, error, refetch } = useSales();
  const { language } = useLanguage();

  if (loading && sales.length === 0) {
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
              {translate('sales.title', language)}
            </Text>
            <Button
              colorScheme="primary"
              size="sm"
              onPress={() => navigation.navigate('SaleForm' as never)}
            >
              {translate('sales.add', language)}
            </Button>
          </HStack>
        </Box>

        {error && (
          <Box px={4} mb={2}>
            <Text color="danger.500" fontSize="sm">
              {error.message}
            </Text>
          </Box>
        )}

        {sales.length === 0 ? (
          <Box flex={1} justifyContent="center" alignItems="center" px={4}>
            <Text fontSize="lg" color="gray.500" textAlign="center">
              {/* Simplified message for now */}
              No sales recorded yet.{'\n'}Start logging transactions to track your revenue.
            </Text>
          </Box>
        ) : (
          <FlatList
            data={sales}
            keyExtractor={(item) => item.id}
            onRefresh={refetch}
            refreshing={loading}
            renderItem={({ item }) => (
              <Box bg="white" p={4} mx={4} mb={2} rounded="md" shadow={1}>
                <HStack justifyContent="space-between" alignItems="flex-start" mb={2}>
                  <VStack flex={1}>
                    <Text fontSize="md" fontWeight="600">
                      {item.itemName || 'Unknown Item'}
                    </Text>
                    <Text fontSize="sm" color="gray.600">
                      {item.quantitySold} × {formatCurrency(item.salePricePerUnit)}
                    </Text>
                  </VStack>
                  <Text fontSize="md" fontWeight="bold" color="success.500">
                    {formatCurrency(item.totalRevenue)}
                  </Text>
                </HStack>
                <HStack justifyContent="space-between" alignItems="center">
                  <Badge
                    colorScheme={
                      item.paymentMethod === 'CASH'
                        ? 'warning'
                        : item.paymentMethod === 'PROMPTPAY'
                        ? 'success'
                        : 'gray'
                    }
                  >
                    {item.paymentMethod}
                  </Badge>
                  <Text fontSize="xs" color="gray.500">
                    {formatDateTime(item.saleDateTime)}
                  </Text>
                </HStack>
              </Box>
            )}
            contentContainerStyle={{ paddingVertical: 8 }}
          />
        )}
      </Box>
    </SafeAreaView>
  );
}
