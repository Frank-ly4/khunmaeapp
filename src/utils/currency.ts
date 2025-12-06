// Currency formatting utilities

export const formatCurrency = (amount: number, currency: string = 'THB'): string => {
  return `${currency === 'THB' ? '฿' : currency}${amount.toFixed(2)}`;
};

export const parseCurrency = (value: string): number => {
  const cleaned = value.replace(/[^\d.]/g, '');
  return parseFloat(cleaned) || 0;
};

