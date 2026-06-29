const TIMEZONE = "Asia/Ho_Chi_Minh";
const LOCALE = "vi-VN";
const VN_OFFSET_MS = 7 * 60 * 60 * 1e3;
const WEEKDAY_LABELS_VI = ["CN", "T2", "T3", "T4", "T5", "T6", "T7"];
function formatMonthTitle(yearMonth) {
  const [y, m] = yearMonth.split("-").map(Number);
  return `Tháng ${m}/${y}`;
}
function currentYearMonth() {
  const now = /* @__PURE__ */ new Date();
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, "0");
  return `${y}-${m}`;
}
function formatDateTime(dateStr) {
  if (!dateStr) return "—";
  return new Date(dateStr).toLocaleString(LOCALE, {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    timeZone: TIMEZONE
  });
}
function formatDate(dateStr) {
  if (!dateStr) return "—";
  return new Date(dateStr).toLocaleDateString(LOCALE, {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    timeZone: TIMEZONE
  });
}
function formatTime(dateStr) {
  if (!dateStr) return "";
  return new Date(dateStr).toLocaleTimeString(LOCALE, {
    hour: "2-digit",
    minute: "2-digit",
    timeZone: TIMEZONE
  });
}
function timeAgo(dateStr) {
  if (!dateStr) return "";
  const diff = Date.now() - new Date(dateStr).getTime();
  const minutes = Math.floor(diff / 6e4);
  if (minutes < 60) return `${minutes} phút trước`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} giờ trước`;
  const days = Math.floor(hours / 24);
  return `${days} ngày trước`;
}
function formatDuration(ms) {
  if (ms < 6e4) return "< 1 phút";
  const minutes = Math.floor(ms / 6e4);
  if (minutes < 60) return `${minutes} phút`;
  const hours = Math.floor(minutes / 60);
  const restMin = minutes % 60;
  if (hours < 48) return restMin ? `${hours} giờ ${restMin} phút` : `${hours} giờ`;
  const days = Math.floor(hours / 24);
  return `${days} ngày`;
}
function formatShortDateTime(dateStr) {
  if (!dateStr) return "—";
  return new Date(dateStr).toLocaleString("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    timeZone: TIMEZONE
  });
}
function formatDurationMinutes(minutes) {
  const m = typeof minutes === "number" ? minutes : parseInt(minutes, 10);
  if (isNaN(m) || m <= 0) return "";
  if (m < 60) return `${m} phút`;
  const h = Math.floor(m / 60);
  const remain = m % 60;
  if (remain === 0) return `${h} giờ`;
  return `${h} giờ ${remain} phút`;
}
function localToUtc(dateStr) {
  if (!dateStr) return null;
  const local = /* @__PURE__ */ new Date(dateStr.replace(" ", "T") + "+07:00");
  const y = local.getUTCFullYear();
  const mo = String(local.getUTCMonth() + 1).padStart(2, "0");
  const d = String(local.getUTCDate()).padStart(2, "0");
  const h = String(local.getUTCHours()).padStart(2, "0");
  const mi = String(local.getUTCMinutes()).padStart(2, "0");
  const s = String(local.getUTCSeconds()).padStart(2, "0");
  return `${y}-${mo}-${d} ${h}:${mi}:${s}`;
}
function utcToLocal(isoStr) {
  if (!isoStr) return null;
  const utc = new Date(isoStr);
  const local = new Date(utc.getTime() + VN_OFFSET_MS);
  const y = local.getUTCFullYear();
  const mo = String(local.getUTCMonth() + 1).padStart(2, "0");
  const d = String(local.getUTCDate()).padStart(2, "0");
  const h = String(local.getUTCHours()).padStart(2, "0");
  const mi = String(local.getUTCMinutes()).padStart(2, "0");
  const s = String(local.getUTCSeconds()).padStart(2, "0");
  return `${y}-${mo}-${d} ${h}:${mi}:${s}`;
}

export { WEEKDAY_LABELS_VI as W, formatDate as a, formatMonthTitle as b, currentYearMonth as c, formatShortDateTime as d, formatDurationMinutes as e, formatDateTime as f, formatDuration as g, formatTime as h, localToUtc as l, timeAgo as t, utcToLocal as u };
//# sourceMappingURL=date-R5YK0ast.mjs.map
