import { _ as __nuxt_component_4$1 } from './SectionCard-CH-mG9Mf.mjs';
import { _ as _sfc_main$3 } from './Alert-tTsPKADX.mjs';
import { v as vueExports, s as serverRenderer_cjs_prodExports, l as _sfc_main$c } from './server.mjs';
import { _ as _sfc_main$4 } from './Skeleton-CKN2C2Mt.mjs';
import { _ as __nuxt_component_6$1 } from './DualAxisChart-BTWuRjT1.mjs';
import { _ as _sfc_main$5 } from './Empty-wM3WsVlF.mjs';
import { l as useTenantBusinessSummary, m as useTenantResidentRatings } from './useTenants-BTW8z9Mm.mjs';
import { u as useProjectBusinessSummary, a as useProjectResidentRatings } from './usePlatformProjects-D8VBGqRs.mjs';
import { f as formatCurrency, a as formatNumber } from './currency-DEb2TrW3.mjs';
import { _ as _sfc_main$7 } from './Badge-W93D3Jpz.mjs';
import { _ as _sfc_main$8 } from './Select-CZE7Ef6n.mjs';
import { _ as _sfc_main$6 } from './Table-17SH0cIR.mjs';
import { _ as __nuxt_component_10 } from './TablePagination-CZYWB-qm.mjs';
import { f as formatDateTime } from './date-R5YK0ast.mjs';

const _sfc_main$2 = /* @__PURE__ */ vueExports.defineComponent({
  __name: "TenantBusinessChart",
  __ssrInlineRender: true,
  props: {
    months: {}
  },
  setup(__props) {
    const props = __props;
    const points = vueExports.computed(
      () => props.months.map((m) => ({
        label: m.label,
        bar: m.tenant_revenue,
        line: m.order_count,
        dash: m.platform_fee
      }))
    );
    return (_ctx, _push, _parent, _attrs) => {
      const _component_SharedDualAxisChart = __nuxt_component_6$1;
      _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_SharedDualAxisChart, vueExports.mergeProps({
        points: vueExports.unref(points),
        "bar-label": "Doanh thu",
        "line-label": "Số đơn",
        "dash-label": "Phí platform",
        "line-unit": " đơn"
      }, _attrs), null, _parent));
    };
  }
});
const _sfc_setup$2 = _sfc_main$2.setup;
_sfc_main$2.setup = (props, ctx) => {
  const ssrContext = vueExports.useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/tenant/TenantBusinessChart.vue");
  return _sfc_setup$2 ? _sfc_setup$2(props, ctx) : void 0;
};
const __nuxt_component_4 = Object.assign(_sfc_main$2, { __name: "TenantBusinessChart" });
const _sfc_main$1 = /* @__PURE__ */ vueExports.defineComponent({
  __name: "TenantBusinessSummaryCard",
  __ssrInlineRender: true,
  props: {
    tenantId: {},
    projectId: {}
  },
  setup(__props) {
    const props = __props;
    const isProjectScope = props.projectId != null;
    const { data, status, error, refresh } = isProjectScope ? useProjectBusinessSummary(() => props.tenantId, () => props.projectId) : useTenantBusinessSummary(() => props.tenantId);
    const scopeWord = isProjectScope ? "dự án" : "công ty vận hành";
    const cardTitle = isProjectScope ? "Biểu đồ kinh doanh dự án (6 tháng)" : "Tổng quan kinh doanh (6 tháng)";
    const introText = `Doanh thu, số đơn hàng và phí nền tảng thực thu từ các đơn hàng đã hoàn thành của ${scopeWord} trong 6 tháng gần nhất.`;
    const emptyDescription = `Biểu đồ sẽ hiển thị khi ${scopeWord} có đơn hàng hoàn thành trong kỳ.`;
    const summary = vueExports.computed(() => data.value?.data?.summary ?? {
      tenant_revenue: 0,
      order_count: 0,
      platform_revenue: 0
    });
    const months = vueExports.computed(() => data.value?.data?.months ?? []);
    const hasActivity = vueExports.computed(() => summary.value.order_count > 0);
    const isLoading = vueExports.computed(() => status.value === "pending" && !data.value);
    const tiles = vueExports.computed(() => [
      { label: isProjectScope ? "Doanh thu dự án" : "Doanh thu", value: formatCurrency(summary.value.tenant_revenue), accent: "text-slate-900" },
      { label: "Số đơn hàng", value: formatNumber(summary.value.order_count), accent: "text-slate-900" },
      { label: "Phí platform thu về", value: formatCurrency(summary.value.platform_revenue), accent: "text-emerald-600" }
    ]);
    const legend = [
      { label: "Doanh thu", class: "inline-block size-2.5 rounded-sm bg-emerald-400" },
      { label: "Số đơn hàng", class: "inline-block h-0.5 w-4 rounded-full bg-amber-500" },
      { label: "Phí platform", class: "inline-block h-0.5 w-4 rounded-full bg-emerald-600" }
    ];
    return (_ctx, _push, _parent, _attrs) => {
      const _component_SharedSectionCard = __nuxt_component_4$1;
      const _component_UAlert = _sfc_main$3;
      const _component_UButton = _sfc_main$c;
      const _component_USkeleton = _sfc_main$4;
      const _component_TenantBusinessChart = __nuxt_component_4;
      const _component_UEmpty = _sfc_main$5;
      _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_SharedSectionCard, vueExports.mergeProps({
        title: vueExports.unref(cardTitle),
        icon: "i-lucide-chart-column"
      }, _attrs), {
        "header-actions": vueExports.withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="flex flex-wrap gap-3 text-xs text-slate-500"${_scopeId}><!--[-->`);
            serverRenderer_cjs_prodExports.ssrRenderList(legend, (item) => {
              _push2(`<span class="flex items-center gap-1.5"${_scopeId}><span class="${serverRenderer_cjs_prodExports.ssrRenderClass(item.class)}"${_scopeId}></span> ${serverRenderer_cjs_prodExports.ssrInterpolate(item.label)}</span>`);
            });
            _push2(`<!--]--></div>`);
          } else {
            return [
              vueExports.createVNode("div", { class: "flex flex-wrap gap-3 text-xs text-slate-500" }, [
                (vueExports.openBlock(), vueExports.createBlock(vueExports.Fragment, null, vueExports.renderList(legend, (item) => {
                  return vueExports.createVNode("span", {
                    key: item.label,
                    class: "flex items-center gap-1.5"
                  }, [
                    vueExports.createVNode("span", {
                      class: item.class
                    }, null, 2),
                    vueExports.createTextVNode(" " + vueExports.toDisplayString(item.label), 1)
                  ]);
                }), 64))
              ])
            ];
          }
        }),
        default: vueExports.withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<p class="text-sm text-slate-500 mb-4"${_scopeId}>${serverRenderer_cjs_prodExports.ssrInterpolate(introText)}</p>`);
            if (vueExports.unref(error)) {
              _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UAlert, {
                icon: "i-lucide-alert-circle",
                color: "error",
                variant: "subtle",
                title: "Không tải được dữ liệu kinh doanh",
                description: "Đã xảy ra lỗi khi tải số liệu. Vui lòng thử lại."
              }, {
                actions: vueExports.withCtx((_2, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    _push3(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UButton, {
                      label: "Thử lại",
                      color: "error",
                      variant: "soft",
                      size: "xs",
                      icon: "i-lucide-refresh-cw",
                      onClick: ($event) => vueExports.unref(refresh)()
                    }, null, _parent3, _scopeId2));
                  } else {
                    return [
                      vueExports.createVNode(_component_UButton, {
                        label: "Thử lại",
                        color: "error",
                        variant: "soft",
                        size: "xs",
                        icon: "i-lucide-refresh-cw",
                        onClick: ($event) => vueExports.unref(refresh)()
                      }, null, 8, ["onClick"])
                    ];
                  }
                }),
                _: 1
              }, _parent2, _scopeId));
            } else {
              _push2(`<!--[-->`);
              if (vueExports.unref(isLoading)) {
                _push2(`<div${_scopeId}><div class="grid grid-cols-2 gap-4 mb-6 sm:grid-cols-3"${_scopeId}><!--[-->`);
                serverRenderer_cjs_prodExports.ssrRenderList(3, (i) => {
                  _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_USkeleton, {
                    key: i,
                    class: "h-20 w-full rounded-lg"
                  }, null, _parent2, _scopeId));
                });
                _push2(`<!--]--></div>`);
                _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_USkeleton, { class: "h-[280px] w-full rounded-lg" }, null, _parent2, _scopeId));
                _push2(`</div>`);
              } else {
                _push2(`<!--[--><div class="grid grid-cols-2 gap-4 mb-6 sm:grid-cols-3"${_scopeId}><!--[-->`);
                serverRenderer_cjs_prodExports.ssrRenderList(vueExports.unref(tiles), (tile) => {
                  _push2(`<div class="rounded-lg border border-slate-200 bg-slate-50/50 px-4 py-3"${_scopeId}><p class="text-sm text-slate-500"${_scopeId}>${serverRenderer_cjs_prodExports.ssrInterpolate(tile.label)}</p><p class="${serverRenderer_cjs_prodExports.ssrRenderClass([tile.accent, "mt-1 text-xl font-semibold tabular-nums"])}"${_scopeId}>${serverRenderer_cjs_prodExports.ssrInterpolate(tile.value)}</p></div>`);
                });
                _push2(`<!--]--></div>`);
                if (vueExports.unref(hasActivity)) {
                  _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_TenantBusinessChart, { months: vueExports.unref(months) }, null, _parent2, _scopeId));
                } else {
                  _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UEmpty, {
                    icon: "i-lucide-chart-column",
                    title: "Chưa có dữ liệu kinh doanh",
                    description: emptyDescription
                  }, null, _parent2, _scopeId));
                }
                _push2(`<!--]-->`);
              }
              _push2(`<!--]-->`);
            }
          } else {
            return [
              vueExports.createVNode("p", { class: "text-sm text-slate-500 mb-4" }, vueExports.toDisplayString(introText)),
              vueExports.unref(error) ? (vueExports.openBlock(), vueExports.createBlock(_component_UAlert, {
                key: 0,
                icon: "i-lucide-alert-circle",
                color: "error",
                variant: "subtle",
                title: "Không tải được dữ liệu kinh doanh",
                description: "Đã xảy ra lỗi khi tải số liệu. Vui lòng thử lại."
              }, {
                actions: vueExports.withCtx(() => [
                  vueExports.createVNode(_component_UButton, {
                    label: "Thử lại",
                    color: "error",
                    variant: "soft",
                    size: "xs",
                    icon: "i-lucide-refresh-cw",
                    onClick: ($event) => vueExports.unref(refresh)()
                  }, null, 8, ["onClick"])
                ]),
                _: 1
              })) : (vueExports.openBlock(), vueExports.createBlock(vueExports.Fragment, { key: 1 }, [
                vueExports.unref(isLoading) ? (vueExports.openBlock(), vueExports.createBlock("div", { key: 0 }, [
                  vueExports.createVNode("div", { class: "grid grid-cols-2 gap-4 mb-6 sm:grid-cols-3" }, [
                    (vueExports.openBlock(), vueExports.createBlock(vueExports.Fragment, null, vueExports.renderList(3, (i) => {
                      return vueExports.createVNode(_component_USkeleton, {
                        key: i,
                        class: "h-20 w-full rounded-lg"
                      });
                    }), 64))
                  ]),
                  vueExports.createVNode(_component_USkeleton, { class: "h-[280px] w-full rounded-lg" })
                ])) : (vueExports.openBlock(), vueExports.createBlock(vueExports.Fragment, { key: 1 }, [
                  vueExports.createVNode("div", { class: "grid grid-cols-2 gap-4 mb-6 sm:grid-cols-3" }, [
                    (vueExports.openBlock(true), vueExports.createBlock(vueExports.Fragment, null, vueExports.renderList(vueExports.unref(tiles), (tile) => {
                      return vueExports.openBlock(), vueExports.createBlock("div", {
                        key: tile.label,
                        class: "rounded-lg border border-slate-200 bg-slate-50/50 px-4 py-3"
                      }, [
                        vueExports.createVNode("p", { class: "text-sm text-slate-500" }, vueExports.toDisplayString(tile.label), 1),
                        vueExports.createVNode("p", {
                          class: ["mt-1 text-xl font-semibold tabular-nums", tile.accent]
                        }, vueExports.toDisplayString(tile.value), 3)
                      ]);
                    }), 128))
                  ]),
                  vueExports.unref(hasActivity) ? (vueExports.openBlock(), vueExports.createBlock(_component_TenantBusinessChart, {
                    key: 0,
                    months: vueExports.unref(months)
                  }, null, 8, ["months"])) : (vueExports.openBlock(), vueExports.createBlock(_component_UEmpty, {
                    key: 1,
                    icon: "i-lucide-chart-column",
                    title: "Chưa có dữ liệu kinh doanh",
                    description: emptyDescription
                  }))
                ], 64))
              ], 64))
            ];
          }
        }),
        _: 1
      }, _parent));
    };
  }
});
const _sfc_setup$1 = _sfc_main$1.setup;
_sfc_main$1.setup = (props, ctx) => {
  const ssrContext = vueExports.useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/tenant/TenantBusinessSummaryCard.vue");
  return _sfc_setup$1 ? _sfc_setup$1(props, ctx) : void 0;
};
const __nuxt_component_5 = Object.assign(_sfc_main$1, { __name: "TenantBusinessSummaryCard" });
const _sfc_main = /* @__PURE__ */ vueExports.defineComponent({
  __name: "TenantResidentRatingsCard",
  __ssrInlineRender: true,
  props: {
    tenantId: {},
    projectId: {}
  },
  setup(__props) {
    const props = __props;
    const isProjectScope = props.projectId != null;
    const page = vueExports.ref(1);
    const ratingFilter = vueExports.ref(0);
    const RATING_FILTER_OPTIONS = [
      { label: "Tất cả số sao", value: 0 },
      { label: "5 ★", value: 5 },
      { label: "4 ★", value: 4 },
      { label: "3 ★", value: 3 },
      { label: "2 ★", value: 2 },
      { label: "1 ★", value: 1 }
    ];
    vueExports.watch(ratingFilter, () => {
      page.value = 1;
    });
    const ratingParams = vueExports.computed(() => ({
      rating: ratingFilter.value || void 0,
      page: page.value
    }));
    const { data, status, error, refresh } = isProjectScope ? useProjectResidentRatings(() => props.tenantId, () => props.projectId, ratingParams) : useTenantResidentRatings(() => props.tenantId, ratingParams);
    const introText = isProjectScope ? "Tổng hợp đánh giá của cư dân trên các ticket đã xử lý của dự án." : "Tổng hợp đánh giá của cư dân trên các ticket đã xử lý của tenant.";
    const ratings = vueExports.computed(() => data.value?.data ?? []);
    const summary = vueExports.computed(() => data.value?.summary ?? null);
    const summaryLabel = vueExports.computed(() => {
      if (!summary.value || summary.value.count === 0) return null;
      return `TB ${summary.value.average}/5 · ${summary.value.count} lượt`;
    });
    const columns = [
      { id: "ticket", header: "Ticket" },
      { id: "project", header: "Dự án" },
      { accessorKey: "resident_name", header: "Cư dân" },
      { id: "rating", header: "Điểm" },
      { id: "comment", header: "Nhận xét" },
      { id: "rated_at", header: "Thời điểm" }
    ];
    return (_ctx, _push, _parent, _attrs) => {
      const _component_SharedSectionCard = __nuxt_component_4$1;
      const _component_UBadge = _sfc_main$7;
      const _component_USelect = _sfc_main$8;
      const _component_UAlert = _sfc_main$3;
      const _component_UButton = _sfc_main$c;
      const _component_UTable = _sfc_main$6;
      const _component_UEmpty = _sfc_main$5;
      const _component_SharedCrudTablePagination = __nuxt_component_10;
      _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_SharedSectionCard, vueExports.mergeProps({
        title: "Đánh giá của cư dân",
        icon: "i-lucide-star"
      }, _attrs), {
        "header-actions": vueExports.withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            if (vueExports.unref(summaryLabel)) {
              _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UBadge, {
                color: "warning",
                variant: "subtle",
                icon: "i-lucide-star",
                label: vueExports.unref(summaryLabel)
              }, null, _parent2, _scopeId));
            } else {
              _push2(`<!---->`);
            }
            _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_USelect, {
              modelValue: vueExports.unref(ratingFilter),
              "onUpdate:modelValue": ($event) => vueExports.isRef(ratingFilter) ? ratingFilter.value = $event : null,
              items: RATING_FILTER_OPTIONS,
              size: "sm",
              class: "w-36"
            }, null, _parent2, _scopeId));
          } else {
            return [
              vueExports.unref(summaryLabel) ? (vueExports.openBlock(), vueExports.createBlock(_component_UBadge, {
                key: 0,
                color: "warning",
                variant: "subtle",
                icon: "i-lucide-star",
                label: vueExports.unref(summaryLabel)
              }, null, 8, ["label"])) : vueExports.createCommentVNode("", true),
              vueExports.createVNode(_component_USelect, {
                modelValue: vueExports.unref(ratingFilter),
                "onUpdate:modelValue": ($event) => vueExports.isRef(ratingFilter) ? ratingFilter.value = $event : null,
                items: RATING_FILTER_OPTIONS,
                size: "sm",
                class: "w-36"
              }, null, 8, ["modelValue", "onUpdate:modelValue"])
            ];
          }
        }),
        default: vueExports.withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<p class="text-sm text-slate-500 mb-4"${_scopeId}>${serverRenderer_cjs_prodExports.ssrInterpolate(vueExports.unref(introText))}</p>`);
            if (vueExports.unref(error)) {
              _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UAlert, {
                icon: "i-lucide-alert-circle",
                color: "error",
                variant: "subtle",
                description: "Không thể tải danh sách đánh giá. Vui lòng thử lại.",
                class: "mb-4"
              }, {
                actions: vueExports.withCtx((_2, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    _push3(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UButton, {
                      label: "Thử lại",
                      color: "error",
                      variant: "soft",
                      size: "xs",
                      icon: "i-lucide-refresh-cw",
                      onClick: ($event) => vueExports.unref(refresh)()
                    }, null, _parent3, _scopeId2));
                  } else {
                    return [
                      vueExports.createVNode(_component_UButton, {
                        label: "Thử lại",
                        color: "error",
                        variant: "soft",
                        size: "xs",
                        icon: "i-lucide-refresh-cw",
                        onClick: ($event) => vueExports.unref(refresh)()
                      }, null, 8, ["onClick"])
                    ];
                  }
                }),
                _: 1
              }, _parent2, _scopeId));
            } else {
              _push2(`<!---->`);
            }
            _push2(`<div class="border border-slate-200 rounded-xl overflow-hidden"${_scopeId}>`);
            _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UTable, {
              data: vueExports.unref(ratings),
              columns,
              loading: vueExports.unref(status) === "pending"
            }, {
              "ticket-cell": vueExports.withCtx(({ row }, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(`<div class="min-w-0"${_scopeId2}>`);
                  if (row.original.ticket_code) {
                    _push3(`<p class="text-sm font-medium text-slate-900 font-mono"${_scopeId2}>${serverRenderer_cjs_prodExports.ssrInterpolate(row.original.ticket_code)}</p>`);
                  } else {
                    _push3(`<!---->`);
                  }
                  _push3(`<p class="text-xs text-slate-500 truncate max-w-48"${_scopeId2}>${serverRenderer_cjs_prodExports.ssrInterpolate(row.original.subject)}</p></div>`);
                } else {
                  return [
                    vueExports.createVNode("div", { class: "min-w-0" }, [
                      row.original.ticket_code ? (vueExports.openBlock(), vueExports.createBlock("p", {
                        key: 0,
                        class: "text-sm font-medium text-slate-900 font-mono"
                      }, vueExports.toDisplayString(row.original.ticket_code), 1)) : vueExports.createCommentVNode("", true),
                      vueExports.createVNode("p", { class: "text-xs text-slate-500 truncate max-w-48" }, vueExports.toDisplayString(row.original.subject), 1)
                    ])
                  ];
                }
              }),
              "project-cell": vueExports.withCtx(({ row }, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  if (row.original.project_name) {
                    _push3(`<span class="text-sm text-slate-700"${_scopeId2}>${serverRenderer_cjs_prodExports.ssrInterpolate(row.original.project_name)}</span>`);
                  } else {
                    _push3(`<span class="text-xs text-gray-400"${_scopeId2}>—</span>`);
                  }
                } else {
                  return [
                    row.original.project_name ? (vueExports.openBlock(), vueExports.createBlock("span", {
                      key: 0,
                      class: "text-sm text-slate-700"
                    }, vueExports.toDisplayString(row.original.project_name), 1)) : (vueExports.openBlock(), vueExports.createBlock("span", {
                      key: 1,
                      class: "text-xs text-gray-400"
                    }, "—"))
                  ];
                }
              }),
              "rating-cell": vueExports.withCtx(({ row }, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(`<div class="flex items-center gap-0.5 text-base leading-none"${_scopeId2}><!--[-->`);
                  serverRenderer_cjs_prodExports.ssrRenderList(5, (star) => {
                    _push3(`<span class="${serverRenderer_cjs_prodExports.ssrRenderClass(star <= row.original.rating ? "text-amber-400" : "text-slate-300")}"${_scopeId2}>★</span>`);
                  });
                  _push3(`<!--]--></div>`);
                } else {
                  return [
                    vueExports.createVNode("div", { class: "flex items-center gap-0.5 text-base leading-none" }, [
                      (vueExports.openBlock(), vueExports.createBlock(vueExports.Fragment, null, vueExports.renderList(5, (star) => {
                        return vueExports.createVNode("span", {
                          key: star,
                          class: star <= row.original.rating ? "text-amber-400" : "text-slate-300"
                        }, "★", 2);
                      }), 64))
                    ])
                  ];
                }
              }),
              "comment-cell": vueExports.withCtx(({ row }, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  if (row.original.comment) {
                    _push3(`<span class="text-sm text-slate-700 line-clamp-2 max-w-64"${_scopeId2}>${serverRenderer_cjs_prodExports.ssrInterpolate(row.original.comment)}</span>`);
                  } else {
                    _push3(`<span class="text-xs text-gray-400"${_scopeId2}>—</span>`);
                  }
                } else {
                  return [
                    row.original.comment ? (vueExports.openBlock(), vueExports.createBlock("span", {
                      key: 0,
                      class: "text-sm text-slate-700 line-clamp-2 max-w-64"
                    }, vueExports.toDisplayString(row.original.comment), 1)) : (vueExports.openBlock(), vueExports.createBlock("span", {
                      key: 1,
                      class: "text-xs text-gray-400"
                    }, "—"))
                  ];
                }
              }),
              "rated_at-cell": vueExports.withCtx(({ row }, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(`<span class="text-sm text-slate-500 whitespace-nowrap"${_scopeId2}>${serverRenderer_cjs_prodExports.ssrInterpolate(("formatDateTime" in _ctx ? _ctx.formatDateTime : vueExports.unref(formatDateTime))(row.original.rated_at))}</span>`);
                } else {
                  return [
                    vueExports.createVNode("span", { class: "text-sm text-slate-500 whitespace-nowrap" }, vueExports.toDisplayString(("formatDateTime" in _ctx ? _ctx.formatDateTime : vueExports.unref(formatDateTime))(row.original.rated_at)), 1)
                  ];
                }
              }),
              empty: vueExports.withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UEmpty, {
                    title: "Chưa có đánh giá nào từ cư dân",
                    description: "Đánh giá xuất hiện sau khi cư dân chấm điểm ticket đã xử lý.",
                    icon: "i-lucide-star"
                  }, null, _parent3, _scopeId2));
                } else {
                  return [
                    vueExports.createVNode(_component_UEmpty, {
                      title: "Chưa có đánh giá nào từ cư dân",
                      description: "Đánh giá xuất hiện sau khi cư dân chấm điểm ticket đã xử lý.",
                      icon: "i-lucide-star"
                    })
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_SharedCrudTablePagination, {
              page: vueExports.unref(page),
              "onUpdate:page": ($event) => vueExports.isRef(page) ? page.value = $event : null,
              meta: vueExports.unref(data)?.meta
            }, null, _parent2, _scopeId));
            _push2(`</div>`);
          } else {
            return [
              vueExports.createVNode("p", { class: "text-sm text-slate-500 mb-4" }, vueExports.toDisplayString(vueExports.unref(introText)), 1),
              vueExports.unref(error) ? (vueExports.openBlock(), vueExports.createBlock(_component_UAlert, {
                key: 0,
                icon: "i-lucide-alert-circle",
                color: "error",
                variant: "subtle",
                description: "Không thể tải danh sách đánh giá. Vui lòng thử lại.",
                class: "mb-4"
              }, {
                actions: vueExports.withCtx(() => [
                  vueExports.createVNode(_component_UButton, {
                    label: "Thử lại",
                    color: "error",
                    variant: "soft",
                    size: "xs",
                    icon: "i-lucide-refresh-cw",
                    onClick: ($event) => vueExports.unref(refresh)()
                  }, null, 8, ["onClick"])
                ]),
                _: 1
              })) : vueExports.createCommentVNode("", true),
              vueExports.createVNode("div", { class: "border border-slate-200 rounded-xl overflow-hidden" }, [
                vueExports.createVNode(_component_UTable, {
                  data: vueExports.unref(ratings),
                  columns,
                  loading: vueExports.unref(status) === "pending"
                }, {
                  "ticket-cell": vueExports.withCtx(({ row }) => [
                    vueExports.createVNode("div", { class: "min-w-0" }, [
                      row.original.ticket_code ? (vueExports.openBlock(), vueExports.createBlock("p", {
                        key: 0,
                        class: "text-sm font-medium text-slate-900 font-mono"
                      }, vueExports.toDisplayString(row.original.ticket_code), 1)) : vueExports.createCommentVNode("", true),
                      vueExports.createVNode("p", { class: "text-xs text-slate-500 truncate max-w-48" }, vueExports.toDisplayString(row.original.subject), 1)
                    ])
                  ]),
                  "project-cell": vueExports.withCtx(({ row }) => [
                    row.original.project_name ? (vueExports.openBlock(), vueExports.createBlock("span", {
                      key: 0,
                      class: "text-sm text-slate-700"
                    }, vueExports.toDisplayString(row.original.project_name), 1)) : (vueExports.openBlock(), vueExports.createBlock("span", {
                      key: 1,
                      class: "text-xs text-gray-400"
                    }, "—"))
                  ]),
                  "rating-cell": vueExports.withCtx(({ row }) => [
                    vueExports.createVNode("div", { class: "flex items-center gap-0.5 text-base leading-none" }, [
                      (vueExports.openBlock(), vueExports.createBlock(vueExports.Fragment, null, vueExports.renderList(5, (star) => {
                        return vueExports.createVNode("span", {
                          key: star,
                          class: star <= row.original.rating ? "text-amber-400" : "text-slate-300"
                        }, "★", 2);
                      }), 64))
                    ])
                  ]),
                  "comment-cell": vueExports.withCtx(({ row }) => [
                    row.original.comment ? (vueExports.openBlock(), vueExports.createBlock("span", {
                      key: 0,
                      class: "text-sm text-slate-700 line-clamp-2 max-w-64"
                    }, vueExports.toDisplayString(row.original.comment), 1)) : (vueExports.openBlock(), vueExports.createBlock("span", {
                      key: 1,
                      class: "text-xs text-gray-400"
                    }, "—"))
                  ]),
                  "rated_at-cell": vueExports.withCtx(({ row }) => [
                    vueExports.createVNode("span", { class: "text-sm text-slate-500 whitespace-nowrap" }, vueExports.toDisplayString(("formatDateTime" in _ctx ? _ctx.formatDateTime : vueExports.unref(formatDateTime))(row.original.rated_at)), 1)
                  ]),
                  empty: vueExports.withCtx(() => [
                    vueExports.createVNode(_component_UEmpty, {
                      title: "Chưa có đánh giá nào từ cư dân",
                      description: "Đánh giá xuất hiện sau khi cư dân chấm điểm ticket đã xử lý.",
                      icon: "i-lucide-star"
                    })
                  ]),
                  _: 1
                }, 8, ["data", "loading"]),
                vueExports.createVNode(_component_SharedCrudTablePagination, {
                  page: vueExports.unref(page),
                  "onUpdate:page": ($event) => vueExports.isRef(page) ? page.value = $event : null,
                  meta: vueExports.unref(data)?.meta
                }, null, 8, ["page", "onUpdate:page", "meta"])
              ])
            ];
          }
        }),
        _: 1
      }, _parent));
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = vueExports.useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/tenant/TenantResidentRatingsCard.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const __nuxt_component_6 = Object.assign(_sfc_main, { __name: "TenantResidentRatingsCard" });

export { __nuxt_component_5 as _, __nuxt_component_6 as a };
//# sourceMappingURL=TenantResidentRatingsCard-BH222I8E.mjs.map
