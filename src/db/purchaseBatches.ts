import { getDatabase } from './index';
import { PurchaseBatch } from '../models';
import { generateUUID } from '../utils/uuid';

export interface PurchaseBatchWithItemName extends PurchaseBatch {
  itemName: string;
}

export const createPurchaseBatch = async (
  purchase: Omit<PurchaseBatch, 'id'>
): Promise<PurchaseBatch> => {
  const db = getDatabase();
  const id = generateUUID();
  
  const newPurchase: PurchaseBatch = {
    id,
    ...purchase,
  };

  return new Promise((resolve, reject) => {
    db.runAsync(
      `INSERT INTO purchase_batches (id, itemId, quantityPurchased, totalCost, purchaseDate, note)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [
        newPurchase.id,
        newPurchase.itemId,
        newPurchase.quantityPurchased,
        newPurchase.totalCost,
        newPurchase.purchaseDate,
        newPurchase.note || null,
      ]
    )
      .then(() => resolve(newPurchase))
      .catch((error) => reject(error));
  });
};

export const getAllPurchaseBatches = async (): Promise<PurchaseBatchWithItemName[]> => {
  const db = getDatabase();
  
  return new Promise((resolve, reject) => {
    db.getAllAsync<PurchaseBatchWithItemName>(
      `SELECT pb.*, i.name as itemName
       FROM purchase_batches pb
       LEFT JOIN items i ON pb.itemId = i.id
       ORDER BY pb.purchaseDate DESC`
    )
      .then((purchases) => resolve(purchases))
      .catch((error) => reject(error));
  });
};

export const getPurchaseBatchesByItemId = async (
  itemId: string
): Promise<PurchaseBatch[]> => {
  const db = getDatabase();
  
  return new Promise((resolve, reject) => {
    db.getAllAsync<PurchaseBatch>(
      'SELECT * FROM purchase_batches WHERE itemId = ? ORDER BY purchaseDate DESC',
      [itemId]
    )
      .then((purchases) => resolve(purchases))
      .catch((error) => reject(error));
  });
};

export const getPurchaseBatchById = async (
  id: string
): Promise<PurchaseBatch | null> => {
  const db = getDatabase();
  
  return new Promise((resolve, reject) => {
    db.getFirstAsync<PurchaseBatch>(
      'SELECT * FROM purchase_batches WHERE id = ?',
      [id]
    )
      .then((purchase) => resolve(purchase || null))
      .catch((error) => reject(error));
  });
};

export const deletePurchaseBatch = async (id: string): Promise<void> => {
  const db = getDatabase();
  
  return new Promise((resolve, reject) => {
    db.runAsync('DELETE FROM purchase_batches WHERE id = ?', [id])
      .then(() => resolve())
      .catch((error) => reject(error));
  });
};

