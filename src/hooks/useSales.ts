import { useState, useEffect, useCallback } from 'react';
import { Sale } from '../models';
import * as salesDB from '../db/sales';
import { SaleWithItemName } from '../db/sales';

export const useSales = () => {
  const [sales, setSales] = useState<SaleWithItemName[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchSales = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await salesDB.getAllSales();
      setSales(data);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch sales'));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSales();
  }, [fetchSales]);

  return { sales, loading, error, refetch: fetchSales };
};

export const useCreateSale = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const createSale = useCallback(
    async (sale: Omit<Sale, 'id' | 'totalRevenue'>) => {
      try {
        setLoading(true);
        setError(null);
        const newSale = await salesDB.createSale(sale);
        return newSale;
      } catch (err) {
        const error = err instanceof Error ? err : new Error('Failed to create sale');
        setError(error);
        throw error;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  return { createSale, loading, error };
};

