import { useState, useEffect, useCallback } from 'react';
import { OverheadExpense } from '../models';
import * as overheadsDB from '../db/overheadExpenses';

export const useOverheads = () => {
  const [overheads, setOverheads] = useState<OverheadExpense[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchOverheads = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await overheadsDB.getAllOverheadExpenses();
      setOverheads(data);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch overhead expenses'));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchOverheads();
  }, [fetchOverheads]);

  return { overheads, loading, error, refetch: fetchOverheads };
};

export const useCreateOverhead = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const createOverhead = useCallback(
    async (expense: Omit<OverheadExpense, 'id'>) => {
      try {
        setLoading(true);
        setError(null);
        const newExpense = await overheadsDB.createOverheadExpense(expense);
        return newExpense;
      } catch (err) {
        const error = err instanceof Error ? err : new Error('Failed to create overhead expense');
        setError(error);
        throw error;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  return { createOverhead, loading, error };
};

