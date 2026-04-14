export function formatCurrency(amount: number, currency = 'USD'): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}

export function formatSignedAmount(amount: number): string {
  const abs = Math.abs(amount);
  const formatted = formatCurrency(abs);
  return amount >= 0 ? `+${formatted}` : `-${formatted}`;
}
