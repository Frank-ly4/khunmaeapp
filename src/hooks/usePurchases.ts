import { useState, useEffect, useCallback } from 'react';
import * as purchasesDB from '../db/purchaseBatches';
import { PurchaseBatchWithItemName } from '../db/purchaseBatches';

export const usePurchases = () => {
  const [purchases, setPurchases] = useState<PurchaseBatchWithItemName[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchPurchases = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await purchasesDB.getAllPurchaseBatches();
      setPurchases(data);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch purchases'));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPurchases();
  }, [fetchPurchases]);

  return { purchases, loading, error, refetch: fetchPurchases };
};

export const useCreatePurchase = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const createPurchase = useCallback(
    async (purchase: Omit<purchasesDB.PurchaseBatch, 'id'>) => {
      try {
        setLoading(true);
        setError(null);
        const newPurchase = await purchasesDB.createPurchaseBatch(purchase);
        return newPurchase;
      } catch (err) {
        const error = err instanceof Error ? err : new Error('Failed to create purchase');
        setError(error);
        throw error;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  return { createPurchase, loading, error };
};

