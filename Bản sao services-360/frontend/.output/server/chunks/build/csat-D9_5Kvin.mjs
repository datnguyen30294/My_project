import { _ as __nuxt_component_0 } from './PageHeader-BJhealxW.mjs';
import { _ as __nuxt_component_2 } from './PageError-kZWsA9dh.mjs';
import { _ as __nuxt_component_4 } from './SectionCard-CH-mG9Mf.mjs';
import { _ as _sfc_main$1 } from './Skeleton-CKN2C2Mt.mjs';
import { _ as _sfc_main$2 } from './FormField-DFdmv6Lu.mjs';
import { _ as __nuxt_component_3 } from './ProjectSelect-BTBiFCd5.mjs';
import { v as vueExports, u as useSeoMeta, s as serverRenderer_cjs_prodExports, l as _sfc_main$c, o as useApiFetch } from './server.mjs';
import { _ as __nuxt_component_2$1 } from './TableWrapper-VwUckvcF.mjs';
import { _ as _sfc_main$3 } from './Table-17SH0cIR.mjs';
import { u as useUrlFilters } from './useUrlFilters-D9dcjQcy.mjs';
import './apiError-DBrxF9au.mjs';
import './Label-BBgw4vHh.mjs';
import './SelectMenu-DKHEMZj7.mjs';
import './FocusScope-BZehoQSg.mjs';
import './PopperArrow-C9hHWuSZ.mjs';
import './useDirection-CXYby7CP.mjs';
import './useFormControl-_Lqv8ipK.mjs';
import './useKbd-JjFOu4f7.mjs';
import './utils-BgcT7rQQ.mjs';
import './VisuallyHiddenInput-q6Pz-w0i.mjs';
import './handleAndDispatchCustomEvent-Bk_AVSSo.mjs';
import './index-CSThDD3J.mjs';
import '../nitro/nitro.mjs';
import 'node:http';
import 'node:https';
import 'node:events';
import 'node:buffer';
import 'node:fs';
import 'node:path';
import 'node:crypto';
import 'node:url';
import '@iconify/utils';
import 'consola';
import './index-QmZAbLx-.mjs';
import './Input-JXN8po_F.mjs';
import './useEntitySelect-DG9pQ_n0.mjs';
import './constants-G9YmtWtp.mjs';
import './useProjects-D4K3VYdb.mjs';
import 'tailwindcss/colors';
import 'node:stream';
import 'perfect-debounce';
import '../routes/renderer.mjs';
import 'vue-bundle-renderer/runtime';
import 'vue/server-renderer';
import 'unhead/server';
import 'devalue';
import 'unhead/plugins';
import 'unhead/utils';
import 'vue';

function useCsatSummary(params) {
  return useApiFetch("/pmc/reports/csat/summary", {
    query: params,
    watch: params ? [params] : void 0
  });
}
function useCsatTrend(params) {
  return useApiFetch("/pmc/reports/csat/trend", {
    query: params,
    watch: params ? [params] : void 0
  });
}
function useCsatByProject(params) {
  return useApiFetch("/pmc/reports/csat/by-project", {
    query: params,
    watch: params ? [params] : void 0
  });
}
const _sfc_main = /* @__PURE__ */ vueExports.defineComponent({
  __name: "csat",
  __ssrInlineRender: true,
  setup(__props) {
    useSeoMeta({ title: "Báo cáo Hài lòng khách hàng" });
    const selectedProjectId = vueExports.ref(void 0);
    useUrlFilters({
      project_id: { ref: selectedProjectId, type: "number" }
    });
    const hasFilters = vueExports.computed(() => selectedProjectId.value != null);
    const filterParams = vueExports.computed(() => ({
      project_id: selectedProjectId.value || void 0
    }));
    const {
      data: summaryData,
      status: summaryStatus,
      error: summaryError
    } = useCsatSummary(filterParams);
    const summary = vueExports.computed(() => summaryData.value?.data ?? null);
    const {
      data: trendData,
      status: trendStatus,
      error: trendError,
      refresh: refreshTrend
    } = useCsatTrend(filterParams);
    const trend = vueExports.computed(() => trendData.value?.data ?? []);
    const {
      data: byProjectData,
      status: byProjectStatus,
      error: byProjectError,
      refresh: refreshByProject
    } = useCsatByProject(filterParams);
    const byProjectRows = vueExports.computed(() => byProjectData.value?.data ?? []);
    function clearFilters() {
      selectedProjectId.value = void 0;
    }
    const isLoading = (status) => status === "pending";
    function formatScore(value) {
      if (value === null || value === void 0) return "—";
      return value.toFixed(2);
    }
    function formatPercent(value) {
      if (value === null || value === void 0) return "—";
      return `${value}%`;
    }
    function formatNps(value) {
      if (value === null || value === void 0) return "—";
      const rounded = Number.isInteger(value) ? value : Math.round(value * 10) / 10;
      const sign = rounded > 0 ? "+" : rounded < 0 ? "" : "+";
      return `${sign}${rounded}`;
    }
    function scoreBarWidth(score, maxScore2) {
      if (score === null || score === void 0 || maxScore2 <= 0) return 0;
      return Math.max(0, Math.min(100, score / maxScore2 * 100));
    }
    const projectColumns = [
      {
        accessorKey: "project_name",
        header: "Dự án",
        cell: ({ row }) => row.original.project_name ?? "—"
      },
      {
        accessorKey: "responses",
        header: "Số phản hồi",
        cell: ({ row }) => row.original.responses.toLocaleString("vi-VN")
      },
      {
        accessorKey: "avg_score",
        header: "Điểm TB",
        cell: ({ row }) => formatScore(row.original.avg_score)
      },
      {
        accessorKey: "warranty_rate",
        header: "Tỷ lệ bảo hành",
        cell: ({ row }) => `${formatPercent(row.original.warranty_rate)} (${row.original.warranty_count}/${row.original.completed_count})`
      }
    ];
    const maxScore = vueExports.computed(() => summary.value?.max_score ?? 5);
    return (_ctx, _push, _parent, _attrs) => {
      const _component_SharedCrudPageHeader = __nuxt_component_0;
      const _component_SharedCrudPageError = __nuxt_component_2;
      const _component_SharedSectionCard = __nuxt_component_4;
      const _component_USkeleton = _sfc_main$1;
      const _component_UFormField = _sfc_main$2;
      const _component_SharedProjectSelect = __nuxt_component_3;
      const _component_UButton = _sfc_main$c;
      const _component_SharedCrudTableWrapper = __nuxt_component_2$1;
      const _component_UTable = _sfc_main$3;
      _push(`<div${serverRenderer_cjs_prodExports.ssrRenderAttrs(_attrs)}>`);
      _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_SharedCrudPageHeader, {
        title: "Báo cáo Hài lòng khách hàng",
        description: "Mức độ hài lòng của cư dân sau khi ticket hoàn thành"
      }, null, _parent));
      if (vueExports.unref(summaryError)) {
        _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_SharedCrudPageError, { error: vueExports.unref(summaryError) }, null, _parent));
      } else {
        _push(`<!--[--><div class="grid grid-cols-2 lg:grid-cols-5 gap-4 mb-6">`);
        _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_SharedSectionCard, {
          title: "Điểm TB",
          compact: ""
        }, {
          default: vueExports.withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              if (isLoading(vueExports.unref(summaryStatus))) {
                _push2(`<!--[-->`);
                _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_USkeleton, { class: "h-8 w-24 mb-1" }, null, _parent2, _scopeId));
                _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_USkeleton, { class: "h-4 w-28" }, null, _parent2, _scopeId));
                _push2(`<!--]-->`);
              } else if (vueExports.unref(summary)) {
                _push2(`<!--[--><p class="text-2xl font-bold text-emerald-600 tabular-nums"${_scopeId}>${serverRenderer_cjs_prodExports.ssrInterpolate(formatScore(vueExports.unref(summary).avg_score))} <span class="text-base font-semibold text-slate-400"${_scopeId}>/ ${serverRenderer_cjs_prodExports.ssrInterpolate(vueExports.unref(summary).max_score)}</span></p><span class="text-xs text-slate-500"${_scopeId}>${serverRenderer_cjs_prodExports.ssrInterpolate(vueExports.unref(summary).rated_count)} phản hồi</span><!--]-->`);
              } else {
                _push2(`<!---->`);
              }
            } else {
              return [
                isLoading(vueExports.unref(summaryStatus)) ? (vueExports.openBlock(), vueExports.createBlock(vueExports.Fragment, { key: 0 }, [
                  vueExports.createVNode(_component_USkeleton, { class: "h-8 w-24 mb-1" }),
                  vueExports.createVNode(_component_USkeleton, { class: "h-4 w-28" })
                ], 64)) : vueExports.unref(summary) ? (vueExports.openBlock(), vueExports.createBlock(vueExports.Fragment, { key: 1 }, [
                  vueExports.createVNode("p", { class: "text-2xl font-bold text-emerald-600 tabular-nums" }, [
                    vueExports.createTextVNode(vueExports.toDisplayString(formatScore(vueExports.unref(summary).avg_score)) + " ", 1),
                    vueExports.createVNode("span", { class: "text-base font-semibold text-slate-400" }, "/ " + vueExports.toDisplayString(vueExports.unref(summary).max_score), 1)
                  ]),
                  vueExports.createVNode("span", { class: "text-xs text-slate-500" }, vueExports.toDisplayString(vueExports.unref(summary).rated_count) + " phản hồi", 1)
                ], 64)) : vueExports.createCommentVNode("", true)
              ];
            }
          }),
          _: 1
        }, _parent));
        _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_SharedSectionCard, {
          title: "Tỷ lệ phản hồi",
          compact: ""
        }, {
          default: vueExports.withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              if (isLoading(vueExports.unref(summaryStatus))) {
                _push2(`<!--[-->`);
                _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_USkeleton, { class: "h-8 w-20 mb-1" }, null, _parent2, _scopeId));
                _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_USkeleton, { class: "h-4 w-28" }, null, _parent2, _scopeId));
                _push2(`<!--]-->`);
              } else if (vueExports.unref(summary)) {
                _push2(`<!--[--><p class="text-2xl font-bold tabular-nums"${_scopeId}>${serverRenderer_cjs_prodExports.ssrInterpolate(formatPercent(vueExports.unref(summary).response_rate))}</p><span class="text-xs text-slate-500"${_scopeId}>${serverRenderer_cjs_prodExports.ssrInterpolate(vueExports.unref(summary).rated_count)} / ${serverRenderer_cjs_prodExports.ssrInterpolate(vueExports.unref(summary).completed_count)} ticket </span><!--]-->`);
              } else {
                _push2(`<!---->`);
              }
            } else {
              return [
                isLoading(vueExports.unref(summaryStatus)) ? (vueExports.openBlock(), vueExports.createBlock(vueExports.Fragment, { key: 0 }, [
                  vueExports.createVNode(_component_USkeleton, { class: "h-8 w-20 mb-1" }),
                  vueExports.createVNode(_component_USkeleton, { class: "h-4 w-28" })
                ], 64)) : vueExports.unref(summary) ? (vueExports.openBlock(), vueExports.createBlock(vueExports.Fragment, { key: 1 }, [
                  vueExports.createVNode("p", { class: "text-2xl font-bold tabular-nums" }, vueExports.toDisplayString(formatPercent(vueExports.unref(summary).response_rate)), 1),
                  vueExports.createVNode("span", { class: "text-xs text-slate-500" }, vueExports.toDisplayString(vueExports.unref(summary).rated_count) + " / " + vueExports.toDisplayString(vueExports.unref(summary).completed_count) + " ticket ", 1)
                ], 64)) : vueExports.createCommentVNode("", true)
              ];
            }
          }),
          _: 1
        }, _parent));
        _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_SharedSectionCard, {
          title: "Chỉ số gợi ý (NPS-style)",
          compact: ""
        }, {
          default: vueExports.withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              if (isLoading(vueExports.unref(summaryStatus))) {
                _push2(`<!--[-->`);
                _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_USkeleton, { class: "h-8 w-16 mb-1" }, null, _parent2, _scopeId));
                _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_USkeleton, { class: "h-4 w-32" }, null, _parent2, _scopeId));
                _push2(`<!--]-->`);
              } else if (vueExports.unref(summary)) {
                _push2(`<!--[--><p class="text-2xl font-bold text-primary tabular-nums"${_scopeId}>${serverRenderer_cjs_prodExports.ssrInterpolate(formatNps(vueExports.unref(summary).nps_style))}</p><span class="text-xs text-slate-500"${_scopeId}>Suy diễn từ thang 1-5</span><!--]-->`);
              } else {
                _push2(`<!---->`);
              }
            } else {
              return [
                isLoading(vueExports.unref(summaryStatus)) ? (vueExports.openBlock(), vueExports.createBlock(vueExports.Fragment, { key: 0 }, [
                  vueExports.createVNode(_component_USkeleton, { class: "h-8 w-16 mb-1" }),
                  vueExports.createVNode(_component_USkeleton, { class: "h-4 w-32" })
                ], 64)) : vueExports.unref(summary) ? (vueExports.openBlock(), vueExports.createBlock(vueExports.Fragment, { key: 1 }, [
                  vueExports.createVNode("p", { class: "text-2xl font-bold text-primary tabular-nums" }, vueExports.toDisplayString(formatNps(vueExports.unref(summary).nps_style)), 1),
                  vueExports.createVNode("span", { class: "text-xs text-slate-500" }, "Suy diễn từ thang 1-5")
                ], 64)) : vueExports.createCommentVNode("", true)
              ];
            }
          }),
          _: 1
        }, _parent));
        _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_SharedSectionCard, {
          title: "Tỷ lệ bảo hành",
          compact: ""
        }, {
          default: vueExports.withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              if (isLoading(vueExports.unref(summaryStatus))) {
                _push2(`<!--[-->`);
                _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_USkeleton, { class: "h-8 w-20 mb-1" }, null, _parent2, _scopeId));
                _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_USkeleton, { class: "h-4 w-28" }, null, _parent2, _scopeId));
                _push2(`<!--]-->`);
              } else if (vueExports.unref(summary)) {
                _push2(`<!--[--><p class="text-2xl font-bold text-amber-600 tabular-nums"${_scopeId}>${serverRenderer_cjs_prodExports.ssrInterpolate(formatPercent(vueExports.unref(summary).warranty_rate))}</p><span class="text-xs text-slate-500"${_scopeId}>${serverRenderer_cjs_prodExports.ssrInterpolate(vueExports.unref(summary).warranty_count)} / ${serverRenderer_cjs_prodExports.ssrInterpolate(vueExports.unref(summary).completed_count)} ticket </span><!--]-->`);
              } else {
                _push2(`<!---->`);
              }
            } else {
              return [
                isLoading(vueExports.unref(summaryStatus)) ? (vueExports.openBlock(), vueExports.createBlock(vueExports.Fragment, { key: 0 }, [
                  vueExports.createVNode(_component_USkeleton, { class: "h-8 w-20 mb-1" }),
                  vueExports.createVNode(_component_USkeleton, { class: "h-4 w-28" })
                ], 64)) : vueExports.unref(summary) ? (vueExports.openBlock(), vueExports.createBlock(vueExports.Fragment, { key: 1 }, [
                  vueExports.createVNode("p", { class: "text-2xl font-bold text-amber-600 tabular-nums" }, vueExports.toDisplayString(formatPercent(vueExports.unref(summary).warranty_rate)), 1),
                  vueExports.createVNode("span", { class: "text-xs text-slate-500" }, vueExports.toDisplayString(vueExports.unref(summary).warranty_count) + " / " + vueExports.toDisplayString(vueExports.unref(summary).completed_count) + " ticket ", 1)
                ], 64)) : vueExports.createCommentVNode("", true)
              ];
            }
          }),
          _: 1
        }, _parent));
        _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_SharedSectionCard, {
          title: "Kỳ",
          compact: ""
        }, {
          default: vueExports.withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              if (isLoading(vueExports.unref(summaryStatus))) {
                _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_USkeleton, { class: "h-6 w-32 mb-1" }, null, _parent2, _scopeId));
              } else if (vueExports.unref(summary)) {
                _push2(`<!--[--><p class="text-base font-semibold text-slate-900"${_scopeId}>${serverRenderer_cjs_prodExports.ssrInterpolate(vueExports.unref(summary).period_label)}</p><span class="text-xs text-slate-500"${_scopeId}>${serverRenderer_cjs_prodExports.ssrInterpolate(vueExports.unref(summary).completed_count)} ticket hoàn thành </span><!--]-->`);
              } else {
                _push2(`<!---->`);
              }
            } else {
              return [
                isLoading(vueExports.unref(summaryStatus)) ? (vueExports.openBlock(), vueExports.createBlock(_component_USkeleton, {
                  key: 0,
                  class: "h-6 w-32 mb-1"
                })) : vueExports.unref(summary) ? (vueExports.openBlock(), vueExports.createBlock(vueExports.Fragment, { key: 1 }, [
                  vueExports.createVNode("p", { class: "text-base font-semibold text-slate-900" }, vueExports.toDisplayString(vueExports.unref(summary).period_label), 1),
                  vueExports.createVNode("span", { class: "text-xs text-slate-500" }, vueExports.toDisplayString(vueExports.unref(summary).completed_count) + " ticket hoàn thành ", 1)
                ], 64)) : vueExports.createCommentVNode("", true)
              ];
            }
          }),
          _: 1
        }, _parent));
        _push(`</div>`);
        _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_SharedSectionCard, {
          title: "Lọc báo cáo",
          compact: "",
          class: "mb-6"
        }, {
          default: vueExports.withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`<div class="flex flex-wrap items-end gap-3"${_scopeId}>`);
              _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UFormField, {
                label: "Dự án",
                class: "max-w-xs"
              }, {
                default: vueExports.withCtx((_2, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    _push3(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_SharedProjectSelect, {
                      modelValue: vueExports.unref(selectedProjectId),
                      "onUpdate:modelValue": ($event) => vueExports.isRef(selectedProjectId) ? selectedProjectId.value = $event : null,
                      placeholder: "Tất cả dự án"
                    }, null, _parent3, _scopeId2));
                  } else {
                    return [
                      vueExports.createVNode(_component_SharedProjectSelect, {
                        modelValue: vueExports.unref(selectedProjectId),
                        "onUpdate:modelValue": ($event) => vueExports.isRef(selectedProjectId) ? selectedProjectId.value = $event : null,
                        placeholder: "Tất cả dự án"
                      }, null, 8, ["modelValue", "onUpdate:modelValue"])
                    ];
                  }
                }),
                _: 1
              }, _parent2, _scopeId));
              if (vueExports.unref(hasFilters)) {
                _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UButton, {
                  icon: "i-lucide-x",
                  label: "Xóa bộ lọc",
                  color: "neutral",
                  variant: "ghost",
                  size: "sm",
                  onClick: clearFilters
                }, null, _parent2, _scopeId));
              } else {
                _push2(`<!---->`);
              }
              _push2(`</div><p class="text-xs text-slate-500 mt-2"${_scopeId}> Áp dụng cho xu hướng theo tháng và bảng theo dự án bên dưới. </p>`);
            } else {
              return [
                vueExports.createVNode("div", { class: "flex flex-wrap items-end gap-3" }, [
                  vueExports.createVNode(_component_UFormField, {
                    label: "Dự án",
                    class: "max-w-xs"
                  }, {
                    default: vueExports.withCtx(() => [
                      vueExports.createVNode(_component_SharedProjectSelect, {
                        modelValue: vueExports.unref(selectedProjectId),
                        "onUpdate:modelValue": ($event) => vueExports.isRef(selectedProjectId) ? selectedProjectId.value = $event : null,
                        placeholder: "Tất cả dự án"
                      }, null, 8, ["modelValue", "onUpdate:modelValue"])
                    ]),
                    _: 1
                  }),
                  vueExports.unref(hasFilters) ? (vueExports.openBlock(), vueExports.createBlock(_component_UButton, {
                    key: 0,
                    icon: "i-lucide-x",
                    label: "Xóa bộ lọc",
                    color: "neutral",
                    variant: "ghost",
                    size: "sm",
                    onClick: clearFilters
                  })) : vueExports.createCommentVNode("", true)
                ]),
                vueExports.createVNode("p", { class: "text-xs text-slate-500 mt-2" }, " Áp dụng cho xu hướng theo tháng và bảng theo dự án bên dưới. ")
              ];
            }
          }),
          _: 1
        }, _parent));
        _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_SharedSectionCard, {
          title: "Xu hướng điểm TB",
          compact: "",
          class: "mb-6"
        }, {
          default: vueExports.withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_SharedCrudTableWrapper, {
                status: vueExports.unref(trendStatus),
                error: vueExports.unref(trendError),
                data: vueExports.unref(trendData),
                refresh: vueExports.unref(refreshTrend)
              }, {
                default: vueExports.withCtx((_2, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    if (vueExports.unref(trend).length > 0) {
                      _push3(`<div class="space-y-3"${_scopeId2}><!--[-->`);
                      serverRenderer_cjs_prodExports.ssrRenderList(vueExports.unref(trend), (row) => {
                        _push3(`<div class="flex items-center gap-3 text-sm"${_scopeId2}><span class="w-10 shrink-0 font-medium text-slate-600"${_scopeId2}>${serverRenderer_cjs_prodExports.ssrInterpolate(row.month)}</span><div class="flex-1 h-2.5 rounded-full bg-slate-100 overflow-hidden"${_scopeId2}><div class="h-full rounded-full bg-emerald-500 transition-all" style="${serverRenderer_cjs_prodExports.ssrRenderStyle({ width: `${scoreBarWidth(row.avg_score, vueExports.unref(maxScore))}%` })}"${_scopeId2}></div></div><span class="w-14 text-right font-semibold tabular-nums text-slate-900"${_scopeId2}>${serverRenderer_cjs_prodExports.ssrInterpolate(formatScore(row.avg_score))}</span></div>`);
                      });
                      _push3(`<!--]--></div>`);
                    } else {
                      _push3(`<p class="text-sm text-slate-500 py-8 text-center"${_scopeId2}> Chưa có dữ liệu xu hướng </p>`);
                    }
                  } else {
                    return [
                      vueExports.unref(trend).length > 0 ? (vueExports.openBlock(), vueExports.createBlock("div", {
                        key: 0,
                        class: "space-y-3"
                      }, [
                        (vueExports.openBlock(true), vueExports.createBlock(vueExports.Fragment, null, vueExports.renderList(vueExports.unref(trend), (row) => {
                          return vueExports.openBlock(), vueExports.createBlock("div", {
                            key: row.month,
                            class: "flex items-center gap-3 text-sm"
                          }, [
                            vueExports.createVNode("span", { class: "w-10 shrink-0 font-medium text-slate-600" }, vueExports.toDisplayString(row.month), 1),
                            vueExports.createVNode("div", { class: "flex-1 h-2.5 rounded-full bg-slate-100 overflow-hidden" }, [
                              vueExports.createVNode("div", {
                                class: "h-full rounded-full bg-emerald-500 transition-all",
                                style: { width: `${scoreBarWidth(row.avg_score, vueExports.unref(maxScore))}%` }
                              }, null, 4)
                            ]),
                            vueExports.createVNode("span", { class: "w-14 text-right font-semibold tabular-nums text-slate-900" }, vueExports.toDisplayString(formatScore(row.avg_score)), 1)
                          ]);
                        }), 128))
                      ])) : (vueExports.openBlock(), vueExports.createBlock("p", {
                        key: 1,
                        class: "text-sm text-slate-500 py-8 text-center"
                      }, " Chưa có dữ liệu xu hướng "))
                    ];
                  }
                }),
                _: 1
              }, _parent2, _scopeId));
            } else {
              return [
                vueExports.createVNode(_component_SharedCrudTableWrapper, {
                  status: vueExports.unref(trendStatus),
                  error: vueExports.unref(trendError),
                  data: vueExports.unref(trendData),
                  refresh: vueExports.unref(refreshTrend)
                }, {
                  default: vueExports.withCtx(() => [
                    vueExports.unref(trend).length > 0 ? (vueExports.openBlock(), vueExports.createBlock("div", {
                      key: 0,
                      class: "space-y-3"
                    }, [
                      (vueExports.openBlock(true), vueExports.createBlock(vueExports.Fragment, null, vueExports.renderList(vueExports.unref(trend), (row) => {
                        return vueExports.openBlock(), vueExports.createBlock("div", {
                          key: row.month,
                          class: "flex items-center gap-3 text-sm"
                        }, [
                          vueExports.createVNode("span", { class: "w-10 shrink-0 font-medium text-slate-600" }, vueExports.toDisplayString(row.month), 1),
                          vueExports.createVNode("div", { class: "flex-1 h-2.5 rounded-full bg-slate-100 overflow-hidden" }, [
                            vueExports.createVNode("div", {
                              class: "h-full rounded-full bg-emerald-500 transition-all",
                              style: { width: `${scoreBarWidth(row.avg_score, vueExports.unref(maxScore))}%` }
                            }, null, 4)
                          ]),
                          vueExports.createVNode("span", { class: "w-14 text-right font-semibold tabular-nums text-slate-900" }, vueExports.toDisplayString(formatScore(row.avg_score)), 1)
                        ]);
                      }), 128))
                    ])) : (vueExports.openBlock(), vueExports.createBlock("p", {
                      key: 1,
                      class: "text-sm text-slate-500 py-8 text-center"
                    }, " Chưa có dữ liệu xu hướng "))
                  ]),
                  _: 1
                }, 8, ["status", "error", "data", "refresh"])
              ];
            }
          }),
          _: 1
        }, _parent));
        _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_SharedSectionCard, {
          title: "Theo dự án",
          compact: ""
        }, {
          default: vueExports.withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_SharedCrudTableWrapper, {
                status: vueExports.unref(byProjectStatus),
                error: vueExports.unref(byProjectError),
                data: vueExports.unref(byProjectData),
                refresh: vueExports.unref(refreshByProject)
              }, {
                default: vueExports.withCtx((_2, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    _push3(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UTable, {
                      data: vueExports.unref(byProjectRows),
                      columns: projectColumns,
                      "empty-state": {
                        icon: "i-lucide-inbox",
                        label: "Không có dữ liệu"
                      }
                    }, null, _parent3, _scopeId2));
                  } else {
                    return [
                      vueExports.createVNode(_component_UTable, {
                        data: vueExports.unref(byProjectRows),
                        columns: projectColumns,
                        "empty-state": {
                          icon: "i-lucide-inbox",
                          label: "Không có dữ liệu"
                        }
                      }, null, 8, ["data"])
                    ];
                  }
                }),
                _: 1
              }, _parent2, _scopeId));
            } else {
              return [
                vueExports.createVNode(_component_SharedCrudTableWrapper, {
                  status: vueExports.unref(byProjectStatus),
                  error: vueExports.unref(byProjectError),
                  data: vueExports.unref(byProjectData),
                  refresh: vueExports.unref(refreshByProject)
                }, {
                  default: vueExports.withCtx(() => [
                    vueExports.createVNode(_component_UTable, {
                      data: vueExports.unref(byProjectRows),
                      columns: projectColumns,
                      "empty-state": {
                        icon: "i-lucide-inbox",
                        label: "Không có dữ liệu"
                      }
                    }, null, 8, ["data"])
                  ]),
                  _: 1
                }, 8, ["status", "error", "data", "refresh"])
              ];
            }
          }),
          _: 1
        }, _parent));
        _push(`<!--]-->`);
      }
      _push(`</div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = vueExports.useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/reports/csat.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=csat-D9_5Kvin.mjs.map
