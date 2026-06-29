function formatCurrency(value) {
  const num = typeof value === "string" ? parseFloat(value) : value;
  return `${new Intl.NumberFormat("vi-VN").format(num || 0)} đ`;
}
function formatNumber(value) {
  if (value === null || value === void 0) return "0";
  const num = typeof value === "string" ? parseFloat(value) : value;
  return new Intl.NumberFormat("vi-VN").format(num || 0);
}
function formatCurrencyShort(value) {
  if (value === null || value === void 0) return "0";
  const num = typeof value === "string" ? parseFloat(value) : value;
  const n = num || 0;
  if (Math.abs(n) >= 1e9) return `${parseFloat((n / 1e9).toFixed(1))} tỷ`;
  if (Math.abs(n) >= 1e6) return `${Math.round(n / 1e6)} tr`;
  return new Intl.NumberFormat("vi-VN").format(Math.round(n));
}
function formatPercent(value) {
  if (value == null) return "0%";
  const num = typeof value === "string" ? parseFloat(value) : value;
  return `${parseFloat(num.toFixed(2))}%`;
}

export { formatNumber as a, formatPercent as b, formatCurrencyShort as c, formatCurrency as f };
//# sourceMappingURL=currency-DEb2TrW3.mjs.map
