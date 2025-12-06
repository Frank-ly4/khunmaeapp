import { Sale } from '../models';
import * as purchaseBatchesDB from '../db/purchaseBatches';
import * as salesDB from '../db/sales';
import * as overheadExpensesDB from '../db/overheadExpenses';

export interface PeriodSummary {
  totalRevenue: number;
  totalCOGS: number;
  grossProfit: number;
  totalOverhead: number;
  netProfit: number;
  netMarginPercent: number | null; // null if no revenue
}

// Cache for average cost per unit calculations
const avgCostCache = new Map<string, { value: number; timestamp: number }>();
const CACHE_TTL = 60000; // 1 minute cache

/**
 * Calculate average cost per unit for an item using simple moving average
 */
export const calculateAverageCostPerUnit = async (itemId: string): Promise<number> => {
  // Check cache first
  const cached = avgCostCache.get(itemId);
  if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
    return cached.value;
  }

  const purchases = await purchaseBatchesDB.getPurchaseBatchesByItemId(itemId);
  
  if (purchases.length === 0) {
    avgCostCache.set(itemId, { value: 0, timestamp: Date.now() });
    return 0;
  }

  const totalCost = purchases.reduce((sum, p) => sum + p.totalCost, 0);
  const totalQuantity = purchases.reduce((sum, p) => sum + p.quantityPurchased, 0);

  if (totalQuantity === 0) {
    avgCostCache.set(itemId, { value: 0, timestamp: Date.now() });
    return 0;
  }

  const avgCost = totalCost / totalQuantity;
  avgCostCache.set(itemId, { value: avgCost, timestamp: Date.now() });
  return avgCost;
};

/**
 * Calculate Cost of Goods Sold for a sale
 */
export const calculateCOGSForSale = async (sale: Sale): Promise<number> => {
  const avgCostPerUnit = await calculateAverageCostPerUnit(sale.itemId);
  return sale.quantitySold * avgCostPerUnit;
};

/**
 * Calculate gross profit for a sale
 */
export const calculateGrossProfitForSale = async (sale: Sale): Promise<number> => {
  const cogs = await calculateCOGSForSale(sale);
  return sale.totalRevenue - cogs;
};

/**
 * Calculate period summary (revenue, COGS, gross profit, overhead, net profit, net margin)
 */
export const calculatePeriodSummary = async (
  startDate: string,
  endDate: string
): Promise<PeriodSummary> => {
  // Get all sales in date range
  const sales = await salesDB.getSalesByDateRange(startDate, endDate);
  
  // Get all overhead expenses in date range
  const overheads = await overheadExpensesDB.getOverheadExpensesByDateRange(startDate, endDate);

  // Calculate totals
  let totalRevenue = 0;
  let totalCOGS = 0;

  // Calculate COGS for each sale
  for (const sale of sales) {
    totalRevenue += sale.totalRevenue;
    const cogs = await calculateCOGSForSale(sale);
    totalCOGS += cogs;
  }

  const grossProfit = totalRevenue - totalCOGS;
  const totalOverhead = overheads.reduce((sum, o) => sum + o.amount, 0);
  const netProfit = grossProfit - totalOverhead;
  
  // Calculate net margin percentage
  const netMarginPercent = totalRevenue > 0 ? (netProfit / totalRevenue) * 100 : null;

  return {
    totalRevenue,
    totalCOGS,
    grossProfit,
    totalOverhead,
    netProfit,
    netMarginPercent,
  };
};

/**
 * Calculate period summary for a specific item
 */
export const calculatePeriodSummaryForItem = async (
  itemId: string,
  startDate: string,
  endDate: string
): Promise<PeriodSummary> => {
  // Get all sales for this item in date range
  const allSales = await salesDB.getSalesByDateRange(startDate, endDate);
  const sales = allSales.filter((s) => s.itemId === itemId);
  
  // Get all overhead expenses in date range
  const overheads = await overheadExpensesDB.getOverheadExpensesByDateRange(startDate, endDate);

  // Calculate totals
  let totalRevenue = 0;
  let totalCOGS = 0;

  // Calculate COGS for each sale
  for (const sale of sales) {
    totalRevenue += sale.totalRevenue;
    const cogs = await calculateCOGSForSale(sale);
    totalCOGS += cogs;
  }

  const grossProfit = totalRevenue - totalCOGS;
  const totalOverhead = overheads.reduce((sum, o) => sum + o.amount, 0);
  const netProfit = grossProfit - totalOverhead;
  
  // Calculate net margin percentage
  const netMarginPercent = totalRevenue > 0 ? (netProfit / totalRevenue) * 100 : null;

  return {
    totalRevenue,
    totalCOGS,
    grossProfit,
    totalOverhead,
    netProfit,
    netMarginPercent,
  };
};

/**
 * Clear the average cost cache (useful after purchases are added/updated)
 */
export const clearAvgCostCache = (itemId?: string): void => {
  if (itemId) {
    avgCostCache.delete(itemId);
  } else {
    avgCostCache.clear();
  }
};
