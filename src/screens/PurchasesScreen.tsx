import React from 'react';
import { Box, Text, VStack, Button, FlatList, HStack, Spinner } from 'native-base';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { usePurchases } from '../hooks/usePurchases';
import { formatCurrency } from '../utils/currency';
import { formatDate } from '../utils/dateHelpers';
import { useLanguage } from '../contexts/LanguageContext';
import { translate } from '../i18n';

export default function PurchasesScreen() {
  const navigation = useNavigation();
  const { purchases, loading, error, refetch } = usePurchases();
  const { language } = useLanguage();

  if (loading && purchases.length === 0) {
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
              {translate('purchases.title', language)}
            </Text>
            <HStack space={2}>
              <Button
                colorScheme="secondary"
                size="sm"
                variant="outline"
                onPress={() => navigation.navigate('OverheadsList' as never)}
              >
                {translate('overheads.title', language)}
              </Button>
              <Button
                colorScheme="primary"
                size="sm"
                onPress={() => navigation.navigate('PurchaseForm' as never)}
              >
                {translate('purchases.add', language)}
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

        {purchases.length === 0 ? (
          <Box flex={1} justifyContent="center" alignItems="center" px={4}>
            <Text fontSize="lg" color="gray.500" textAlign="center">
              No purchases recorded yet.{'\n'}Log your stock purchases to track costs.
            </Text>
          </Box>
        ) : (
          <FlatList
            data={purchases}
            keyExtractor={(item) => item.id}
            onRefresh={refetch}
            refreshing={loading}
            renderItem={({ item }) => (
              <Box bg="white" p={4} mx={4} mb={2} rounded="md" shadow={1}>
                <HStack justifyContent="space-between" alignItems="flex-start">
                  <VStack flex={1}>
                    <Text fontSize="md" fontWeight="600">
                      {item.itemName || 'Unknown Item'}
                    </Text>
                    <Text fontSize="sm" color="gray.600">
                      Qty: {item.quantityPurchased}
                    </Text>
                  </VStack>
                  <Text fontSize="md" fontWeight="bold" color="danger.500">
                    {formatCurrency(item.totalCost)}
                  </Text>
                </HStack>
                <Text fontSize="xs" color="gray.500" mt={2}>
                  {formatDate(item.purchaseDate)}
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
