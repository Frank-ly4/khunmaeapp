import React, { useState, useEffect } from 'react';
import { Box, Text, VStack, Button, Input, FormControl, Image, Spinner } from 'native-base';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRoute, useNavigation } from '@react-navigation/native';
import * as ImagePicker from 'expo-image-picker';
import { useItem, useCreateItem, useUpdateItem } from '../hooks/useItems';
import { parseCurrency } from '../utils/currency';

export default function ItemFormScreen() {
  const route = useRoute();
  const navigation = useNavigation();
  const itemId = (route.params as any)?.itemId;
  const isEditMode = !!itemId;

  const { item, loading: loadingItem } = useItem(itemId || null);
  const { createItem, loading: creating } = useCreateItem();
  const { updateItem, loading: updating } = useUpdateItem();

  const [name, setName] = useState('');
  const [category, setCategory] = useState('');
  const [defaultSalePrice, setDefaultSalePrice] = useState('');
  const [unit, setUnit] = useState('');
  const [photoUri, setPhotoUri] = useState<string | undefined>(undefined);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (item) {
      setName(item.name);
      setCategory(item.category || '');
      setDefaultSalePrice(item.defaultSalePrice.toString());
      setUnit(item.unit);
      setPhotoUri(item.photoUri);
    }
  }, [item]);

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};
    if (!name.trim()) {
      newErrors.name = 'Item name is required';
    }
    if (!defaultSalePrice.trim()) {
      newErrors.defaultSalePrice = 'Default sale price is required';
    } else {
      const price = parseCurrency(defaultSalePrice);
      if (isNaN(price) || price <= 0) {
        newErrors.defaultSalePrice = 'Price must be a positive number';
      }
    }
    if (!unit.trim()) {
      newErrors.unit = 'Unit is required';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handlePickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      alert('Sorry, we need camera roll permissions!');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.8,
    });

    if (!result.canceled && result.assets[0]) {
      setPhotoUri(result.assets[0].uri);
    }
  };

  const handleSave = async () => {
    if (!validate()) {
      return;
    }

    try {
      const price = parseCurrency(defaultSalePrice);
      const itemData = {
        name: name.trim(),
        category: category.trim() || undefined,
        defaultSalePrice: price,
        unit: unit.trim(),
        photoUri,
      };

      if (isEditMode && item) {
        await updateItem(item.id, itemData);
      } else {
        await createItem(itemData);
      }
      navigation.goBack();
    } catch (err) {
      // Error handled by hook
    }
  };

  if (loadingItem) {
    return (
      <SafeAreaView style={{ flex: 1 }}>
        <Box flex={1} justifyContent="center" alignItems="center">
          <Spinner size="lg" color="primary.500" />
        </Box>
      </SafeAreaView>
    );
  }

  const loading = creating || updating;

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <Box flex={1} bg="gray.50" p={4}>
        <VStack space={4}>
          <Text fontSize="2xl" fontWeight="bold" color="gray.800">
            {isEditMode ? 'Edit Item' : 'Add Item'}
          </Text>

          <FormControl isInvalid={!!errors.name}>
            <FormControl.Label>Item Name *</FormControl.Label>
            <Input
              placeholder="e.g., Pad Thai"
              value={name}
              onChangeText={setName}
            />
            <FormControl.ErrorMessage>{errors.name}</FormControl.ErrorMessage>
          </FormControl>

          <FormControl>
            <FormControl.Label>Category</FormControl.Label>
            <Input
              placeholder="e.g., Main Dish"
              value={category}
              onChangeText={setCategory}
            />
          </FormControl>

          <FormControl isInvalid={!!errors.defaultSalePrice}>
            <FormControl.Label>Default Sale Price (THB) *</FormControl.Label>
            <Input
              placeholder="0.00"
              keyboardType="numeric"
              value={defaultSalePrice}
              onChangeText={setDefaultSalePrice}
            />
            <FormControl.ErrorMessage>{errors.defaultSalePrice}</FormControl.ErrorMessage>
          </FormControl>

          <FormControl isInvalid={!!errors.unit}>
            <FormControl.Label>Unit *</FormControl.Label>
            <Input
              placeholder="e.g., bowl, cup, piece"
              value={unit}
              onChangeText={setUnit}
            />
            <FormControl.ErrorMessage>{errors.unit}</FormControl.ErrorMessage>
          </FormControl>

          {photoUri && (
            <Box>
              <Image
                source={{ uri: photoUri }}
                alt="Item photo"
                size="xl"
                rounded="md"
                resizeMode="cover"
              />
            </Box>
          )}

          <Button
            colorScheme="primary"
            size="lg"
            onPress={handlePickImage}
            variant={photoUri ? 'outline' : 'solid'}
          >
            {photoUri ? 'Change Photo' : 'Add Photo'}
          </Button>

          {photoUri && (
            <Button
              colorScheme="danger"
              size="sm"
              variant="ghost"
              onPress={() => setPhotoUri(undefined)}
            >
              Remove Photo
            </Button>
          )}

          <Button
            colorScheme="success"
            size="lg"
            mt={2}
            onPress={handleSave}
            isLoading={loading}
            isDisabled={loading}
          >
            {isEditMode ? 'Update Item' : 'Save Item'}
          </Button>
        </VStack>
      </Box>
    </SafeAreaView>
  );
}
