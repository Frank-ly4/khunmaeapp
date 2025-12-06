// TypeScript interfaces and types for data models
// Will be implemented in Milestone 2

export interface Item {
  id: string;
  name: string;
  category?: string;
  defaultSalePrice: number;
  unit: string;
  photoUri?: string;
  createdAt: string;
  updatedAt: string;
}

export interface PurchaseBatch {
  id: string;
  itemId: string;
  quantityPurchased: number;
  totalCost: number;
  purchaseDate: string;
  note?: string;
}

export type PaymentMethod = 'CASH' | 'PROMPTPAY' | 'OTHER';

export interface Sale {
  id: string;
  itemId: string;
  quantitySold: number;
  salePricePerUnit: number;
  totalRevenue: number;
  saleDateTime: string;
  paymentMethod: PaymentMethod;
  note?: string;
}

export interface OverheadExpense {
  id: string;
  category: string;
  amount: number;
  expenseDate: string;
  note?: string;
}

export interface Settings {
  id: string;
  stallName: string;
  ownerName: string;
  currency: string;
  promptpayId?: string;
}

