function formatPhone(phone) {
  if (!phone) return "—";
  const digits = phone.replace(/\D/g, "");
  if (digits.length < 9) return phone;
  if (digits.length === 10) {
    return `${digits.slice(0, 4)} ${digits.slice(4, 7)} ${digits.slice(7)}`;
  }
  if (digits.length === 11) {
    return `${digits.slice(0, 4)} ${digits.slice(4, 7)} ${digits.slice(7)}`;
  }
  return phone;
}
function stripPhone(phone) {
  if (!phone) return "";
  return phone.replace(/\D/g, "");
}

export { formatPhone as f, stripPhone as s };
//# sourceMappingURL=phone-DErPjpTB.mjs.map
