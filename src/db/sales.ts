import { getDatabase } from './index';
import { Sale } from '../models';
import { generateUUID } from '../utils/uuid';

export interface SaleWithItemName extends Sale {
  itemName: string;
}

export const createSale = async (
  sale: Omit<Sale, 'id' | 'totalRevenue'>
): Promise<Sale> => {
  const db = getDatabase();
  const id = generateUUID();
  const totalRevenue = sale.quantitySold * sale.salePricePerUnit;
  
  const newSale: Sale = {
    id,
    ...sale,
    totalRevenue,
  };

  return new Promise((resolve, reject) => {
    db.runAsync(
      `INSERT INTO sales (id, itemId, quantitySold, salePricePerUnit, totalRevenue, saleDateTime, paymentMethod, note)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        newSale.id,
        newSale.itemId,
        newSale.quantitySold,
        newSale.salePricePerUnit,
        newSale.totalRevenue,
        newSale.saleDateTime,
        newSale.paymentMethod,
        newSale.note || null,
      ]
    )
      .then(() => resolve(newSale))
      .catch((error) => reject(error));
  });
};

export const getAllSales = async (): Promise<SaleWithItemName[]> => {
  const db = getDatabase();
  
  return new Promise((resolve, reject) => {
    db.getAllAsync<SaleWithItemName>(
      `SELECT s.*, i.name as itemName
       FROM sales s
       LEFT JOIN items i ON s.itemId = i.id
       ORDER BY s.saleDateTime DESC`
    )
      .then((sales) => resolve(sales))
      .catch((error) => reject(error));
  });
};

export const getSalesByItemId = async (itemId: string): Promise<Sale[]> => {
  const db = getDatabase();
  
  return new Promise((resolve, reject) => {
    db.getAllAsync<Sale>(
      'SELECT * FROM sales WHERE itemId = ? ORDER BY saleDateTime DESC',
      [itemId]
    )
      .then((sales) => resolve(sales))
      .catch((error) => reject(error));
  });
};

export const getSalesByDateRange = async (
  startDate: string,
  endDate: string
): Promise<Sale[]> => {
  const db = getDatabase();
  
  return new Promise((resolve, reject) => {
    db.getAllAsync<Sale>(
      `SELECT * FROM sales 
       WHERE saleDateTime >= ? AND saleDateTime <= ?
       ORDER BY saleDateTime DESC`,
      [startDate, endDate]
    )
      .then((sales) => resolve(sales))
      .catch((error) => reject(error));
  });
};

export const getSaleById = async (id: string): Promise<Sale | null> => {
  const db = getDatabase();
  
  return new Promise((resolve, reject) => {
    db.getFirstAsync<Sale>('SELECT * FROM sales WHERE id = ?', [id])
      .then((sale) => resolve(sale || null))
      .catch((error) => reject(error));
  });
};

export const deleteSale = async (id: string): Promise<void> => {
  const db = getDatabase();
  
  return new Promise((resolve, reject) => {
    db.runAsync('DELETE FROM sales WHERE id = ?', [id])
      .then(() => resolve())
      .catch((error) => reject(error));
  });
};

