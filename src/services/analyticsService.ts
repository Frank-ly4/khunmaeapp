import { Sale } from '../models';
import * as salesDB from '../db/sales';
import * as overheadExpensesDB from '../db/overheadExpenses';
import { getHourBucket, getDayOfWeek, getStartOfDay, getEndOfDay } from '../utils/dateHelpers';
import {
  calculateCOGSForSale,
  calculatePeriodSummary,
  PeriodSummary,
} from './profitCalculator';

export interface TimeOfDayStat {
  hourBucket: string; // e.g., "08:00-09:00"
  totalRevenue: number;
  totalCOGS: number;
  grossProfit: number;
  netProfit: number;
  saleCount: number;
  avgNetMarginPercent: number | null;
}

export interface DayOfWeekStat {
  dayName: string; // e.g., "Monday"
  totalRevenue: number;
  totalCOGS: number;
  grossProfit: number;
  netProfit: number;
  saleCount: number;
  avgNetMarginPercent: number | null;
}

export interface BestWorstTimes {
  bestHour: string;
  bestNetProfit: number;
  worstHour: string;
  worstNetProfit: number;
}

export interface BestWorstDays {
  bestDay: string;
  bestNetProfit: number;
  worstDay: string;
  worstNetProfit: number;
}

export interface DailyProfitData {
  date: string;
  netProfit: number;
}

/**
 * Get time-of-day statistics grouped by hour buckets
 */
export const getTimeOfDayStats = async (
  startDate: string,
  endDate: string
): Promise<TimeOfDayStat[]> => {
  const sales = await salesDB.getSalesByDateRange(startDate, endDate);
  const overheads = await overheadExpensesDB.getOverheadExpensesByDateRange(startDate, endDate);
  const totalOverhead = overheads.reduce((sum, o) => sum + o.amount, 0);
  
  // Group sales by hour bucket
  const hourMap = new Map<string, {
    sales: Sale[];
    revenue: number;
    cogs: number;
  }>();

  // Process each sale
  for (const sale of sales) {
    const hourBucket = getHourBucket(sale.saleDateTime);
    
    if (!hourMap.has(hourBucket)) {
      hourMap.set(hourBucket, {
        sales: [],
        revenue: 0,
        cogs: 0,
      });
    }
    
    const bucket = hourMap.get(hourBucket)!;
    bucket.sales.push(sale);
    bucket.revenue += sale.totalRevenue;
    const cogs = await calculateCOGSForSale(sale);
    bucket.cogs += cogs;
  }

  // Calculate overhead per sale (distributed evenly)
  const overheadPerSale = sales.length > 0 ? totalOverhead / sales.length : 0;

  // Convert to array and calculate stats
  const stats: TimeOfDayStat[] = [];
  
  for (const [hourBucket, data] of hourMap.entries()) {
    const grossProfit = data.revenue - data.cogs;
    const netProfit = grossProfit - (overheadPerSale * data.sales.length);
    const avgNetMarginPercent = data.revenue > 0 ? (netProfit / data.revenue) * 100 : null;

    stats.push({
      hourBucket,
      totalRevenue: data.revenue,
      totalCOGS: data.cogs,
      grossProfit,
      netProfit,
      saleCount: data.sales.length,
      avgNetMarginPercent,
    });
  }

  // Sort by hour
  return stats.sort((a, b) => {
    const hourA = parseInt(a.hourBucket.split(':')[0]);
    const hourB = parseInt(b.hourBucket.split(':')[0]);
    return hourA - hourB;
  });
};

/**
 * Get day-of-week statistics
 */
export const getDayOfWeekStats = async (
  startDate: string,
  endDate: string
): Promise<DayOfWeekStat[]> => {
  const sales = await salesDB.getSalesByDateRange(startDate, endDate);
  const overheads = await overheadExpensesDB.getOverheadExpensesByDateRange(startDate, endDate);
  const totalOverhead = overheads.reduce((sum, o) => sum + o.amount, 0);
  
  // Group sales by day of week
  const dayMap = new Map<string, {
    sales: Sale[];
    revenue: number;
    cogs: number;
  }>();

  // Process each sale
  for (const sale of sales) {
    const dayName = getDayOfWeek(sale.saleDateTime);
    
    if (!dayMap.has(dayName)) {
      dayMap.set(dayName, {
        sales: [],
        revenue: 0,
        cogs: 0,
      });
    }
    
    const bucket = dayMap.get(dayName)!;
    bucket.sales.push(sale);
    bucket.revenue += sale.totalRevenue;
    const cogs = await calculateCOGSForSale(sale);
    bucket.cogs += cogs;
  }

  // Calculate overhead per sale (distributed evenly)
  const overheadPerSale = sales.length > 0 ? totalOverhead / sales.length : 0;

  // Convert to array and calculate stats
  const stats: DayOfWeekStat[] = [];
  
  const dayOrder = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  
  for (const dayName of dayOrder) {
    const data = dayMap.get(dayName);
    
    if (data) {
      const grossProfit = data.revenue - data.cogs;
      const netProfit = grossProfit - (overheadPerSale * data.sales.length);
      const avgNetMarginPercent = data.revenue > 0 ? (netProfit / data.revenue) * 100 : null;

      stats.push({
        dayName,
        totalRevenue: data.revenue,
        totalCOGS: data.cogs,
        grossProfit,
        netProfit,
        saleCount: data.sales.length,
        avgNetMarginPercent,
      });
    } else {
      // Include days with no sales
      stats.push({
        dayName,
        totalRevenue: 0,
        totalCOGS: 0,
        grossProfit: 0,
        netProfit: 0,
        saleCount: 0,
        avgNetMarginPercent: null,
      });
    }
  }

  return stats;
};

/**
 * Get best and worst times of day
 */
export const getBestWorstTimes = async (
  startDate: string,
  endDate: string
): Promise<BestWorstTimes> => {
  const stats = await getTimeOfDayStats(startDate, endDate);
  
  if (stats.length === 0) {
    return {
      bestHour: '',
      bestNetProfit: 0,
      worstHour: '',
      worstNetProfit: 0,
    };
  }

  let best = stats[0];
  let worst = stats[0];

  for (const stat of stats) {
    if (stat.netProfit > best.netProfit) {
      best = stat;
    }
    if (stat.netProfit < worst.netProfit) {
      worst = stat;
    }
  }

  return {
    bestHour: best.hourBucket,
    bestNetProfit: best.netProfit,
    worstHour: worst.hourBucket,
    worstNetProfit: worst.netProfit,
  };
};

/**
 * Get best and worst days of week
 */
export const getBestWorstDays = async (
  startDate: string,
  endDate: string
): Promise<BestWorstDays> => {
  const stats = await getDayOfWeekStats(startDate, endDate);
  
  // Filter out days with no sales
  const daysWithSales = stats.filter((s) => s.saleCount > 0);
  
  if (daysWithSales.length === 0) {
    return {
      bestDay: '',
      bestNetProfit: 0,
      worstDay: '',
      worstNetProfit: 0,
    };
  }

  let best = daysWithSales[0];
  let worst = daysWithSales[0];

  for (const stat of daysWithSales) {
    if (stat.netProfit > best.netProfit) {
      best = stat;
    }
    if (stat.netProfit < worst.netProfit) {
      worst = stat;
    }
  }

  return {
    bestDay: best.dayName,
    bestNetProfit: best.netProfit,
    worstDay: worst.dayName,
    worstNetProfit: worst.netProfit,
  };
};

/**
 * Get daily profit trend for chart
 */
export const getDailyProfitTrend = async (days: number): Promise<DailyProfitData[]> => {
  const data: DailyProfitData[] = [];
  const today = new Date();

  for (let i = days - 1; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    
    const start = getStartOfDay(date);
    const end = getEndOfDay(date);
    
    const summary = await calculatePeriodSummary(start, end);
    
    data.push({
      date: formatDateForChart(date),
      netProfit: summary.netProfit,
    });
  }

  return data;
};

/**
 * Format date for chart display (short format)
 */
const formatDateForChart = (date: Date): string => {
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const day = date.getDate().toString().padStart(2, '0');
  return `${month}/${day}`;
};
