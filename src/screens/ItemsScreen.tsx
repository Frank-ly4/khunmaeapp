import React from 'react';
import { Box, Text, VStack, HStack, Button, FlatList, Spinner, AlertDialog } from 'native-base';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useItems, useDeleteItem } from '../hooks/useItems';
import { useNavigation } from '@react-navigation/native';
import { formatCurrency } from '../utils/currency';
import { useLanguage } from '../contexts/LanguageContext';
import { translate } from '../i18n';

export default function ItemsScreen() {
  const navigation = useNavigation();
  const { items, loading, error, refetch } = useItems();
  const { deleteItem } = useDeleteItem();
  const [deleteDialogOpen, setDeleteDialogOpen] = React.useState(false);
  const [itemToDelete, setItemToDelete] = React.useState<string | null>(null);
  const { language } = useLanguage();

  const handleDelete = async () => {
    if (itemToDelete) {
      try {
        await deleteItem(itemToDelete);
        setDeleteDialogOpen(false);
        setItemToDelete(null);
        refetch();
      } catch (err) {
        // Error handled by hook
      }
    }
  };

  const openDeleteDialog = (itemId: string) => {
    setItemToDelete(itemId);
    setDeleteDialogOpen(true);
  };

  if (loading && items.length === 0) {
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
              {translate('items.title', language)}
            </Text>
            <Button
              colorScheme="primary"
              size="sm"
              onPress={() => navigation.navigate('ItemForm' as never)}
            >
              {translate('items.add', language)}
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

        {items.length === 0 ? (
          <Box flex={1} justifyContent="center" alignItems="center" px={4}>
            <Text fontSize="lg" color="gray.500" textAlign="center">
              {translate('items.empty', language)}
            </Text>
          </Box>
        ) : (
          <FlatList
            data={items}
            keyExtractor={(item) => item.id}
            onRefresh={refetch}
            refreshing={loading}
            renderItem={({ item }) => (
              <Box bg="white" p={4} mx={4} mb={2} rounded="md" shadow={1}>
                <HStack justifyContent="space-between" alignItems="flex-start">
                  <VStack flex={1}>
                    <Text fontSize="md" fontWeight="600">
                      {item.name}
                    </Text>
                    {item.category && (
                      <Text fontSize="sm" color="gray.600">
                        {item.category}
                      </Text>
                    )}
                    <Text fontSize="sm" color="gray.600">
                      Default: {formatCurrency(item.defaultSalePrice)} / {item.unit}
                    </Text>
                  </VStack>
                  <VStack space={2}>
                    <Button
                      size="xs"
                      variant="ghost"
                      colorScheme="primary"
                      onPress={() =>
                        navigation.navigate('ItemForm' as never, { itemId: item.id } as never)
                      }
                    >
                      {translate('common.edit', language)}
                    </Button>
                    <Button
                      size="xs"
                      variant="ghost"
                      colorScheme="danger"
                      onPress={() => openDeleteDialog(item.id)}
                    >
                      {translate('common.delete', language)}
                    </Button>
                  </VStack>
                </HStack>
              </Box>
            )}
            contentContainerStyle={{ paddingVertical: 8 }}
          />
        )}

        <AlertDialog isOpen={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
          <AlertDialog.Content>
            <AlertDialog.CloseButton />
            <AlertDialog.Header>Delete Item</AlertDialog.Header>
            <AlertDialog.Body>
              Are you sure you want to delete this item? This action cannot be undone.
            </AlertDialog.Body>
            <AlertDialog.Footer>
              <Button.Group space={2}>
                <Button variant="ghost" colorScheme="blueGray" onPress={() => setDeleteDialogOpen(false)}>
                  Cancel
                </Button>
                <Button colorScheme="danger" onPress={handleDelete}>
                  Delete
                </Button>
              </Button.Group>
            </AlertDialog.Footer>
          </AlertDialog.Content>
        </AlertDialog>
      </Box>
    </SafeAreaView>
  );
}
