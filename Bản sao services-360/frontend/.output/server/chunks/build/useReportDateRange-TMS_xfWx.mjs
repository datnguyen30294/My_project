import { v as vueExports } from './server.mjs';

function useReportDateRange(options = {}) {
  const { withDefault = true } = options;
  function toDateParam(date) {
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
  }
  function defaultFrom() {
    const d = /* @__PURE__ */ new Date();
    d.setDate(d.getDate() - 30);
    return toDateParam(d);
  }
  function defaultTo() {
    return toDateParam(/* @__PURE__ */ new Date());
  }
  function formatDateRange(dates) {
    if (!dates || dates.length < 2) return "";
    const [from, to] = dates;
    if (!from || !to) return "";
    const fmt = (d) => `${String(d.getDate()).padStart(2, "0")}/${String(d.getMonth() + 1).padStart(2, "0")}/${d.getFullYear()}`;
    return `${fmt(from)} - ${fmt(to)}`;
  }
  const dateFromRef = vueExports.ref(withDefault ? defaultFrom() : "");
  const dateToRef = vueExports.ref(withDefault ? defaultTo() : "");
  const dateRange = vueExports.ref(
    withDefault ? [defaultFrom(), defaultTo()] : null
  );
  function syncRangeFromRefs() {
    if (dateFromRef.value && dateToRef.value) {
      dateRange.value = [dateFromRef.value, dateToRef.value];
    }
  }
  vueExports.watch(dateRange, (val) => {
    if (val && val[0] && val[1]) {
      dateFromRef.value = val[0];
      dateToRef.value = val[1];
    } else {
      dateFromRef.value = "";
      dateToRef.value = "";
    }
  });
  function resetToDefault() {
    dateRange.value = withDefault ? [defaultFrom(), defaultTo()] : null;
  }
  function clearRange() {
    dateRange.value = null;
  }
  return {
    dateFromRef,
    dateToRef,
    dateRange,
    toDateParam,
    defaultFrom,
    defaultTo,
    formatDateRange,
    syncRangeFromRefs,
    resetToDefault,
    clearRange
  };
}

export { useReportDateRange as u };
//# sourceMappingURL=useReportDateRange-TMS_xfWx.mjs.map
