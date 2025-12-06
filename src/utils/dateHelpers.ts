// Date and time utility functions

const MONTHS = [
  'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
  'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
];

const DAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

export const formatDate = (date: Date | string): string => {
  const d = typeof date === 'string' ? new Date(date) : date;
  const day = d.getDate();
  const month = MONTHS[d.getMonth()];
  const year = d.getFullYear();
  return `${month} ${day}, ${year}`;
};

export const formatDateTime = (date: Date | string): string => {
  const d = typeof date === 'string' ? new Date(date) : date;
  const day = d.getDate();
  const month = MONTHS[d.getMonth()];
  const year = d.getFullYear();
  const hours = d.getHours().toString().padStart(2, '0');
  const minutes = d.getMinutes().toString().padStart(2, '0');
  return `${month} ${day}, ${year} ${hours}:${minutes}`;
};

export const getHourBucket = (date: Date | string): string => {
  const d = typeof date === 'string' ? new Date(date) : date;
  const hour = d.getHours();
  const nextHour = (hour + 1) % 24;
  return `${hour.toString().padStart(2, '0')}:00-${nextHour.toString().padStart(2, '0')}:00`;
};

export const getDayOfWeek = (date: Date | string): string => {
  const d = typeof date === 'string' ? new Date(date) : date;
  return DAYS[d.getDay()];
};

export const getStartOfDay = (date: Date | string): string => {
  const d = typeof date === 'string' ? new Date(date) : date;
  const start = new Date(d);
  start.setHours(0, 0, 0, 0);
  return start.toISOString();
};

export const getEndOfDay = (date: Date | string): string => {
  const d = typeof date === 'string' ? new Date(date) : date;
  const end = new Date(d);
  end.setHours(23, 59, 59, 999);
  return end.toISOString();
};

export const getStartOfWeek = (date: Date | string): string => {
  const d = typeof date === 'string' ? new Date(date) : date;
  const start = new Date(d);
  const day = start.getDay();
  const diff = start.getDate() - day;
  start.setDate(diff);
  start.setHours(0, 0, 0, 0);
  return start.toISOString();
};

export const getEndOfWeek = (date: Date | string): string => {
  const d = typeof date === 'string' ? new Date(date) : date;
  const end = new Date(d);
  const day = end.getDay();
  const diff = end.getDate() + (6 - day);
  end.setDate(diff);
  end.setHours(23, 59, 59, 999);
  return end.toISOString();
};

export const getStartOfMonth = (date: Date | string): string => {
  const d = typeof date === 'string' ? new Date(date) : date;
  const start = new Date(d.getFullYear(), d.getMonth(), 1);
  start.setHours(0, 0, 0, 0);
  return start.toISOString();
};

export const getEndOfMonth = (date: Date | string): string => {
  const d = typeof date === 'string' ? new Date(date) : date;
  const end = new Date(d.getFullYear(), d.getMonth() + 1, 0);
  end.setHours(23, 59, 59, 999);
  return end.toISOString();
};

export const formatDateForInput = (date: Date | string): string => {
  const d = typeof date === 'string' ? new Date(date) : date;
  const year = d.getFullYear();
  const month = (d.getMonth() + 1).toString().padStart(2, '0');
  const day = d.getDate().toString().padStart(2, '0');
  return `${year}-${month}-${day}`;
};

export const parseDateFromInput = (dateString: string): Date => {
  return new Date(dateString + 'T00:00:00');
};

// Date range helpers for analytics
export const getTodayRange = (): { start: string; end: string } => {
  const today = new Date();
  return {
    start: getStartOfDay(today),
    end: getEndOfDay(today),
  };
};

export const getThisWeekRange = (): { start: string; end: string } => {
  const today = new Date();
  return {
    start: getStartOfWeek(today),
    end: getEndOfWeek(today),
  };
};

export const getThisMonthRange = (): { start: string; end: string } => {
  const today = new Date();
  return {
    start: getStartOfMonth(today),
    end: getEndOfMonth(today),
  };
};

export const getLastNDaysRange = (days: number): { start: string; end: string } => {
  const end = new Date();
  const start = new Date();
  start.setDate(start.getDate() - (days - 1));
  return {
    start: getStartOfDay(start),
    end: getEndOfDay(end),
  };
};
