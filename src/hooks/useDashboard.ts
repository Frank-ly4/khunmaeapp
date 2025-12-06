import { useState, useEffect, useCallback } from 'react';
import {
  calculatePeriodSummary,
  PeriodSummary,
} from '../services/profitCalculator';
import {
  getTimeOfDayStats,
  getDayOfWeekStats,
  getBestWorstTimes,
  getBestWorstDays,
  getDailyProfitTrend,
  TimeOfDayStat,
  DayOfWeekStat,
  BestWorstTimes,
  BestWorstDays,
  DailyProfitData,
} from '../services/analyticsService';
import {
  getTodayRange,
  getThisWeekRange,
  getThisMonthRange,
} from '../utils/dateHelpers';

export const usePeriodSummary = (period: 'today' | 'week' | 'month') => {
  const [summary, setSummary] = useState<PeriodSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchSummary = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      let range: { start: string; end: string };
      switch (period) {
        case 'today':
          range = getTodayRange();
          break;
        case 'week':
          range = getThisWeekRange();
          break;
        case 'month':
          range = getThisMonthRange();
          break;
      }

      const data = await calculatePeriodSummary(range.start, range.end);
      setSummary(data);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch period summary'));
    } finally {
      setLoading(false);
    }
  }, [period]);

  useEffect(() => {
    fetchSummary();
  }, [fetchSummary]);

  return { summary, loading, error, refetch: fetchSummary };
};

export const useTimeOfDayStats = (period: 'week' | 'month') => {
  const [stats, setStats] = useState<TimeOfDayStat[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchStats = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const range = period === 'week' ? getThisWeekRange() : getThisMonthRange();
      const data = await getTimeOfDayStats(range.start, range.end);
      setStats(data);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch time of day stats'));
    } finally {
      setLoading(false);
    }
  }, [period]);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  return { stats, loading, error, refetch: fetchStats };
};

export const useDayOfWeekStats = (period: 'week' | 'month') => {
  const [stats, setStats] = useState<DayOfWeekStat[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchStats = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const range = period === 'week' ? getThisWeekRange() : getThisMonthRange();
      const data = await getDayOfWeekStats(range.start, range.end);
      setStats(data);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch day of week stats'));
    } finally {
      setLoading(false);
    }
  }, [period]);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  return { stats, loading, error, refetch: fetchStats };
};

export const useBestWorstInsights = (period: 'week' | 'month') => {
  const [bestWorstTimes, setBestWorstTimes] = useState<BestWorstTimes | null>(null);
  const [bestWorstDays, setBestWorstDays] = useState<BestWorstDays | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchInsights = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const range = period === 'week' ? getThisWeekRange() : getThisMonthRange();
      const [times, days] = await Promise.all([
        getBestWorstTimes(range.start, range.end),
        getBestWorstDays(range.start, range.end),
      ]);
      
      setBestWorstTimes(times);
      setBestWorstDays(days);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch insights'));
    } finally {
      setLoading(false);
    }
  }, [period]);

  useEffect(() => {
    fetchInsights();
  }, [fetchInsights]);

  return { bestWorstTimes, bestWorstDays, loading, error, refetch: fetchInsights };
};

export const useDailyProfitTrend = (days: number) => {
  const [data, setData] = useState<DailyProfitData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchTrend = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const trendData = await getDailyProfitTrend(days);
      setData(trendData);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch profit trend'));
    } finally {
      setLoading(false);
    }
  }, [days]);

  useEffect(() => {
    fetchTrend();
  }, [fetchTrend]);

  return { data, loading, error, refetch: fetchTrend };
};

