import { useState, useEffect, useCallback } from 'react';
import { Item } from '../models';
import * as itemsDB from '../db/items';

export const useItems = () => {
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchItems = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await itemsDB.getAllItems();
      setItems(data);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch items'));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchItems();
  }, [fetchItems]);

  return { items, loading, error, refetch: fetchItems };
};

export const useItem = (id: string | null) => {
  const [item, setItem] = useState<Item | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!id) {
      setItem(null);
      setLoading(false);
      return;
    }

    const fetchItem = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await itemsDB.getItemById(id);
        setItem(data);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to fetch item'));
      } finally {
        setLoading(false);
      }
    };

    fetchItem();
  }, [id]);

  return { item, loading, error };
};

export const useCreateItem = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const createItem = useCallback(
    async (item: Omit<Item, 'id' | 'createdAt' | 'updatedAt'>) => {
      try {
        setLoading(true);
        setError(null);
        const newItem = await itemsDB.createItem(item);
        return newItem;
      } catch (err) {
        const error = err instanceof Error ? err : new Error('Failed to create item');
        setError(error);
        throw error;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  return { createItem, loading, error };
};

export const useUpdateItem = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const updateItem = useCallback(
    async (id: string, updates: Partial<Omit<Item, 'id' | 'createdAt'>>) => {
      try {
        setLoading(true);
        setError(null);
        const updatedItem = await itemsDB.updateItem(id, updates);
        return updatedItem;
      } catch (err) {
        const error = err instanceof Error ? err : new Error('Failed to update item');
        setError(error);
        throw error;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  return { updateItem, loading, error };
};

export const useDeleteItem = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const deleteItem = useCallback(async (id: string) => {
    try {
      setLoading(true);
      setError(null);
      await itemsDB.deleteItem(id);
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to delete item');
      setError(error);
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  return { deleteItem, loading, error };
};

