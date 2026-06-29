import { u as useClosingPeriodList } from './useClosingPeriods-HdCSZwWv.mjs';
import { S as SELECT_ALL_PER_PAGE } from './constants-G9YmtWtp.mjs';
import { v as vueExports } from './server.mjs';

function useClosingPeriodOptions() {
  const { data } = useClosingPeriodList(() => ({
    per_page: SELECT_ALL_PER_PAGE,
    sort_by: "period_end",
    sort_direction: "desc"
  }));
  const closingPeriodOptions = vueExports.computed(() => {
    const items = data.value?.data ?? [];
    return items.map((p) => ({
      label: `${p.name}${p.project ? ` — ${p.project.name}` : ""}${p.status.value === "open" ? " (đang mở)" : ""}`,
      value: p.id
    }));
  });
  return { closingPeriodOptions };
}

export { useClosingPeriodOptions as u };
//# sourceMappingURL=useClosingPeriodOptions-DRcuaph0.mjs.map
