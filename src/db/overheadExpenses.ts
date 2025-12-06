import { getDatabase } from './index';
import { OverheadExpense } from '../models';
import { generateUUID } from '../utils/uuid';

export const createOverheadExpense = async (
  expense: Omit<OverheadExpense, 'id'>
): Promise<OverheadExpense> => {
  const db = getDatabase();
  const id = generateUUID();
  
  const newExpense: OverheadExpense = {
    id,
    ...expense,
  };

  return new Promise((resolve, reject) => {
    db.runAsync(
      `INSERT INTO overhead_expenses (id, category, amount, expenseDate, note)
       VALUES (?, ?, ?, ?, ?)`,
      [
        newExpense.id,
        newExpense.category,
        newExpense.amount,
        newExpense.expenseDate,
        newExpense.note || null,
      ]
    )
      .then(() => resolve(newExpense))
      .catch((error) => reject(error));
  });
};

export const getAllOverheadExpenses = async (): Promise<OverheadExpense[]> => {
  const db = getDatabase();
  
  return new Promise((resolve, reject) => {
    db.getAllAsync<OverheadExpense>(
      'SELECT * FROM overhead_expenses ORDER BY expenseDate DESC'
    )
      .then((expenses) => resolve(expenses))
      .catch((error) => reject(error));
  });
};

export const getOverheadExpensesByDateRange = async (
  startDate: string,
  endDate: string
): Promise<OverheadExpense[]> => {
  const db = getDatabase();
  
  return new Promise((resolve, reject) => {
    db.getAllAsync<OverheadExpense>(
      `SELECT * FROM overhead_expenses 
       WHERE expenseDate >= ? AND expenseDate <= ?
       ORDER BY expenseDate DESC`,
      [startDate, endDate]
    )
      .then((expenses) => resolve(expenses))
      .catch((error) => reject(error));
  });
};

export const getOverheadExpenseById = async (
  id: string
): Promise<OverheadExpense | null> => {
  const db = getDatabase();
  
  return new Promise((resolve, reject) => {
    db.getFirstAsync<OverheadExpense>(
      'SELECT * FROM overhead_expenses WHERE id = ?',
      [id]
    )
      .then((expense) => resolve(expense || null))
      .catch((error) => reject(error));
  });
};

export const deleteOverheadExpense = async (id: string): Promise<void> => {
  const db = getDatabase();
  
  return new Promise((resolve, reject) => {
    db.runAsync('DELETE FROM overhead_expenses WHERE id = ?', [id])
      .then(() => resolve())
      .catch((error) => reject(error));
  });
};

