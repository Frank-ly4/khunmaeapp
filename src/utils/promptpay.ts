// Simple PromptPay helper for v1.
// NOTE: This is a human-readable helper string, not a full EMV QR implementation.
// For production QR codes, integrate a dedicated PromptPay QR library.

export const buildPromptPayHelperString = (promptpayId: string, amount?: number): string => {
  const trimmed = promptpayId.trim();
  if (!trimmed) return '';

  if (amount !== undefined && !isNaN(amount)) {
    return `PromptPay ID: ${trimmed} | Amount: ${amount.toFixed(2)} THB`;
  }

  return `PromptPay ID: ${trimmed}`;
};


