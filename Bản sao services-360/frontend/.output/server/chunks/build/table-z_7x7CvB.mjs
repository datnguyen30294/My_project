const STICKY_TH_BG = "bg-[#fafafa]";
const STICKY_TD_BG = "bg-white";
const STICKY_SHADOW = "shadow-[-6px_0_6px_-6px_rgba(0,0,0,0.08)]";
function stickyRight(column, options = {}) {
  const {
    right = "right-0",
    width = "w-[120px] min-w-[120px]",
    shadow = true
  } = options;
  const base = ["sticky", right, width, shadow ? STICKY_SHADOW : ""].filter(Boolean).join(" ");
  const existingTh = column.meta?.class?.th;
  const existingTd = column.meta?.class?.td;
  return {
    ...column,
    meta: {
      ...column.meta,
      class: {
        ...column.meta?.class,
        th: [base, "z-20", STICKY_TH_BG, existingTh].filter(Boolean).join(" "),
        td: [base, "z-10", STICKY_TD_BG, existingTd].filter(Boolean).join(" ")
      }
    }
  };
}

export { stickyRight as s };
//# sourceMappingURL=table-z_7x7CvB.mjs.map
