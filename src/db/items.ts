import { getDatabase } from './index';
import { Item } from '../models';
import { generateUUID } from '../utils/uuid';

export const createItem = async (
  item: Omit<Item, 'id' | 'createdAt' | 'updatedAt'>
): Promise<Item> => {
  const db = getDatabase();
  const id = generateUUID();
  const now = new Date().toISOString();
  
  const newItem: Item = {
    id,
    ...item,
    createdAt: now,
    updatedAt: now,
  };

  return new Promise((resolve, reject) => {
    db.runAsync(
      `INSERT INTO items (id, name, category, defaultSalePrice, unit, photoUri, createdAt, updatedAt)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        newItem.id,
        newItem.name,
        newItem.category || null,
        newItem.defaultSalePrice,
        newItem.unit,
        newItem.photoUri || null,
        newItem.createdAt,
        newItem.updatedAt,
      ]
    )
      .then(() => resolve(newItem))
      .catch((error) => reject(error));
  });
};

export const getAllItems = async (): Promise<Item[]> => {
  const db = getDatabase();
  
  return new Promise((resolve, reject) => {
    db.getAllAsync<Item>('SELECT * FROM items ORDER BY name ASC')
      .then((items) => resolve(items))
      .catch((error) => reject(error));
  });
};

export const getItemById = async (id: string): Promise<Item | null> => {
  const db = getDatabase();
  
  return new Promise((resolve, reject) => {
    db.getFirstAsync<Item>('SELECT * FROM items WHERE id = ?', [id])
      .then((item) => resolve(item || null))
      .catch((error) => reject(error));
  });
};

export const updateItem = async (
  id: string,
  updates: Partial<Omit<Item, 'id' | 'createdAt'>>
): Promise<Item> => {
  const db = getDatabase();
  const updatedAt = new Date().toISOString();
  
  const fields: string[] = [];
  const values: any[] = [];
  
  if (updates.name !== undefined) {
    fields.push('name = ?');
    values.push(updates.name);
  }
  if (updates.category !== undefined) {
    fields.push('category = ?');
    values.push(updates.category || null);
  }
  if (updates.defaultSalePrice !== undefined) {
    fields.push('defaultSalePrice = ?');
    values.push(updates.defaultSalePrice);
  }
  if (updates.unit !== undefined) {
    fields.push('unit = ?');
    values.push(updates.unit);
  }
  if (updates.photoUri !== undefined) {
    fields.push('photoUri = ?');
    values.push(updates.photoUri || null);
  }
  
  fields.push('updatedAt = ?');
  values.push(updatedAt);
  values.push(id);
  
  return new Promise((resolve, reject) => {
    db.runAsync(
      `UPDATE items SET ${fields.join(', ')} WHERE id = ?`,
      values
    )
      .then(() => getItemById(id))
      .then((item) => {
        if (!item) {
          reject(new Error('Item not found after update'));
        } else {
          resolve(item);
        }
      })
      .catch((error) => reject(error));
  });
};

export const deleteItem = async (id: string): Promise<void> => {
  const db = getDatabase();
  
  return new Promise((resolve, reject) => {
    db.runAsync('DELETE FROM items WHERE id = ?', [id])
      .then(() => resolve())
      .catch((error) => reject(error));
  });
};

