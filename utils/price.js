export function calcDays(startDate, endDate) {
  const ms = endDate - startDate;
  const days = Math.ceil(ms / (1000 * 60 * 60 * 24));
  return days <= 0 ? 0 : days;
}

// Reuse logic from Chapter 2: total = days * pricePerDay
export function calcTotalPrice({ startDate, endDate, pricePerDay }) {
  const days = calcDays(startDate, endDate);
  return days * (pricePerDay || 0);
}
