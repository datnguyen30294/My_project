import { _ as __nuxt_component_0 } from './PageHeader-BJhealxW.mjs';
import { _ as __nuxt_component_2 } from './PageError-kZWsA9dh.mjs';
import { _ as __nuxt_component_4 } from './SectionCard-CH-mG9Mf.mjs';
import { _ as _sfc_main$1 } from './FormField-DFdmv6Lu.mjs';
import { v as vueExports, u as useSeoMeta, s as serverRenderer_cjs_prodExports, w as __nuxt_component_5, l as _sfc_main$c, k as _sfc_main$h, _ as __nuxt_component_0$4, o as useApiFetch } from './server.mjs';
import { _ as __nuxt_component_3 } from './ProjectSelect-BTBiFCd5.mjs';
import { _ as _sfc_main$2 } from './Alert-tTsPKADX.mjs';
import { _ as _sfc_main$3 } from './Skeleton-CKN2C2Mt.mjs';
import { _ as __nuxt_component_10 } from './StackedColumnChart-Co01WETk.mjs';
import { _ as _sfc_main$4 } from './Table-17SH0cIR.mjs';
import { _ as _sfc_main$5 } from './Badge-W93D3Jpz.mjs';
import { f as formatCurrency, a as formatNumber } from './currency-DEb2TrW3.mjs';
import { Z as Zl } from './vue-datepicker-6F5-CyxW.mjs';
import { r as recipientTypeBadgeColor } from './useClosingPeriods-HdCSZwWv.mjs';
import { u as useReportDateRange } from './useReportDateRange-TMS_xfWx.mjs';
import { u as useUrlFilters } from './useUrlFilters-D9dcjQcy.mjs';
import './apiError-DBrxF9au.mjs';
import './Label-BBgw4vHh.mjs';
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
import './index-QmZAbLx-.mjs';
import './Input-JXN8po_F.mjs';
import './useEntitySelect-DG9pQ_n0.mjs';
import './constants-G9YmtWtp.mjs';
import './useProjects-D4K3VYdb.mjs';

function useCommissionReportSummary(params) {
  return useApiFetch("/pmc/reports/commission/summary", {
    query: params,
    watch: params ? [params] : void 0
  });
}
function useCommissionReportByStaff(params) {
  return useApiFetch("/pmc/reports/commission/by-staff", {
    query: params,
    watch: params ? [params] : void 0
  });
}
const _sfc_main = /* @__PURE__ */ vueExports.defineComponent({
  __name: "commission",
  __ssrInlineRender: true,
  setup(__props) {
    useSeoMeta({ title: "Báo cáo Phân bổ hoa hồng" });
    const {
      dateRange,
      dateFromRef,
      dateToRef,
      formatDateRange,
      syncRangeFromRefs,
      clearRange
    } = useReportDateRange();
    const selectedProjectId = vueExports.ref(void 0);
    useUrlFilters({
      date_from: { ref: dateFromRef, type: "string" },
      date_to: { ref: dateToRef, type: "string" },
      project_id: { ref: selectedProjectId, type: "number" }
    });
    syncRangeFromRefs();
    const hasFilters = vueExports.computed(
      () => selectedProjectId.value != null || !!dateFromRef.value || !!dateToRef.value
    );
    function clearFilters() {
      selectedProjectId.value = void 0;
      clearRange();
    }
    const filterParams = vueExports.computed(() => ({
      date_from: dateFromRef.value || void 0,
      date_to: dateToRef.value || void 0,
      project_id: selectedProjectId.value || void 0
    }));
    const {
      data: summaryData,
      status: summaryStatus,
      error: summaryError
    } = useCommissionReportSummary(filterParams);
    const summary = vueExports.computed(() => summaryData.value?.data ?? null);
    const {
      data: byStaffData,
      status: byStaffStatus
    } = useCommissionReportByStaff(filterParams);
    const allStaffRows = vueExports.computed(() => byStaffData.value?.data ?? []);
    const isLoading = (status) => status === "pending";
    const COMMISSION_SERIES = [
      { key: "operating_company", label: "HH VH", color: "#2563eb" },
      { key: "board_of_directors", label: "BQT", color: "#d97706" },
      { key: "management", label: "BQL", color: "#16a34a" },
      { key: "platform", label: "Platform", color: "#7c3aed" }
    ];
    function toNum(value) {
      if (value == null) return 0;
      return parseFloat(value) || 0;
    }
    function aggregateBy(rows, keyFn) {
      const map = /* @__PURE__ */ new Map();
      for (const r of rows) {
        const k = keyFn(r);
        if (!k) continue;
        let cat = map.get(k);
        if (!cat) {
          cat = {
            label: k,
            values: {
              operating_company: 0,
              board_of_directors: 0,
              management: 0,
              platform: 0
            }
          };
          map.set(k, cat);
        }
        cat.values.operating_company += toNum(r.operating_company);
        cat.values.board_of_directors += toNum(r.board_of_directors);
        cat.values.management += toNum(r.management);
        cat.values.platform += toNum(r.platform);
      }
      return [...map.values()];
    }
    const chartByProject = vueExports.computed(
      () => aggregateBy(allStaffRows.value, (r) => r.project_name)
    );
    const chartByDepartment = vueExports.computed(
      () => aggregateBy(allStaffRows.value, (r) => r.department_name)
    );
    const chartByStaff = vueExports.computed(
      () => aggregateBy(allStaffRows.value, (r) => r.staff_name)
    );
    const PARTY_LABELS = {
      platform: "Platform",
      operating_company: "Công ty vận hành",
      board_of_directors: "Ban quản trị",
      staff: "Nhân viên"
    };
    const byRecipient = vueExports.computed(() => {
      const rows = [];
      if (summary.value) {
        const t = summary.value.party_totals;
        for (const [type, label] of Object.entries(PARTY_LABELS)) {
          if (type === "staff") continue;
          rows.push({ name: label, type, typeLabel: label, amount: toNum(t[type]) });
        }
      }
      const staffMap = /* @__PURE__ */ new Map();
      for (const r of allStaffRows.value) {
        const key = r.account_id ?? r.staff_name;
        const existing = staffMap.get(key);
        if (existing) {
          existing.amount += toNum(r.management);
        } else {
          staffMap.set(key, {
            name: r.staff_name,
            type: "staff",
            typeLabel: PARTY_LABELS.staff,
            amount: toNum(r.management)
          });
        }
      }
      rows.push(...staffMap.values());
      rows.sort((a, b) => b.amount - a.amount);
      return rows;
    });
    const recipientColumns = [
      { accessorKey: "name", header: "Người / Bên nhận" },
      { accessorKey: "typeLabel", header: "Loại" },
      { accessorKey: "amount", header: "Tổng hoa hồng" }
    ];
    return (_ctx, _push, _parent, _attrs) => {
      const _component_SharedCrudPageHeader = __nuxt_component_0;
      const _component_SharedCrudPageError = __nuxt_component_2;
      const _component_SharedSectionCard = __nuxt_component_4;
      const _component_UFormField = _sfc_main$1;
      const _component_ClientOnly = __nuxt_component_5;
      const _component_SharedProjectSelect = __nuxt_component_3;
      const _component_UButton = _sfc_main$c;
      const _component_UIcon = _sfc_main$h;
      const _component_UAlert = _sfc_main$2;
      const _component_USkeleton = _sfc_main$3;
      const _component_NuxtLink = __nuxt_component_0$4;
      const _component_SharedReportStackedColumnChart = __nuxt_component_10;
      const _component_UTable = _sfc_main$4;
      const _component_UBadge = _sfc_main$5;
      _push(`<div${serverRenderer_cjs_prodExports.ssrRenderAttrs(_attrs)}>`);
      _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_SharedCrudPageHeader, {
        title: "Báo cáo Phân bổ hoa hồng",
        description: "Tổng hợp hoa hồng phân bổ cho 4 bên (VH, BQT, BQL, Platform) và chi tiết theo nhân viên"
      }, null, _parent));
      if (vueExports.unref(summaryError)) {
        _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_SharedCrudPageError, { error: vueExports.unref(summaryError) }, null, _parent));
      } else {
        _push(`<!--[-->`);
        _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_SharedSectionCard, {
          title: "Bộ lọc",
          compact: "",
          class: "mb-6"
        }, {
          default: vueExports.withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`<div class="flex flex-wrap gap-4 items-end"${_scopeId}>`);
              _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UFormField, { label: "Khoảng thời gian" }, {
                default: vueExports.withCtx((_2, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    _push3(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_ClientOnly, null, {}, _parent3, _scopeId2));
                  } else {
                    return [
                      vueExports.createVNode(_component_ClientOnly, null, {
                        default: vueExports.withCtx(() => [
                          vueExports.createVNode(vueExports.unref(Zl), {
                            modelValue: vueExports.unref(dateRange),
                            "onUpdate:modelValue": ($event) => vueExports.isRef(dateRange) ? dateRange.value = $event : null,
                            range: "",
                            "partial-range": false,
                            "time-config": { enableTimePicker: false },
                            "model-type": "yyyy-MM-dd",
                            format: vueExports.unref(formatDateRange),
                            "auto-apply": "",
                            "max-date": /* @__PURE__ */ new Date(),
                            "input-class-name": "dp-custom-input",
                            teleport: true,
                            class: "w-64"
                          }, null, 8, ["modelValue", "onUpdate:modelValue", "format", "max-date"])
                        ]),
                        _: 1
                      })
                    ];
                  }
                }),
                _: 1
              }, _parent2, _scopeId));
              _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UFormField, { label: "Dự án" }, {
                default: vueExports.withCtx((_2, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    _push3(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_SharedProjectSelect, {
                      modelValue: vueExports.unref(selectedProjectId),
                      "onUpdate:modelValue": ($event) => vueExports.isRef(selectedProjectId) ? selectedProjectId.value = $event : null,
                      placeholder: "Tất cả dự án",
                      class: "w-48"
                    }, null, _parent3, _scopeId2));
                  } else {
                    return [
                      vueExports.createVNode(_component_SharedProjectSelect, {
                        modelValue: vueExports.unref(selectedProjectId),
                        "onUpdate:modelValue": ($event) => vueExports.isRef(selectedProjectId) ? selectedProjectId.value = $event : null,
                        placeholder: "Tất cả dự án",
                        class: "w-48"
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
              _push2(`</div>`);
              if (vueExports.unref(summary)) {
                _push2(`<p class="text-xs text-slate-500 mt-3"${_scopeId}>`);
                _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UIcon, {
                  name: "i-lucide-calendar",
                  class: "size-3.5 align-[-2px]"
                }, null, _parent2, _scopeId));
                _push2(` ${serverRenderer_cjs_prodExports.ssrInterpolate(vueExports.unref(summary).period_label)}</p>`);
              } else {
                _push2(`<!---->`);
              }
            } else {
              return [
                vueExports.createVNode("div", { class: "flex flex-wrap gap-4 items-end" }, [
                  vueExports.createVNode(_component_UFormField, { label: "Khoảng thời gian" }, {
                    default: vueExports.withCtx(() => [
                      vueExports.createVNode(_component_ClientOnly, null, {
                        default: vueExports.withCtx(() => [
                          vueExports.createVNode(vueExports.unref(Zl), {
                            modelValue: vueExports.unref(dateRange),
                            "onUpdate:modelValue": ($event) => vueExports.isRef(dateRange) ? dateRange.value = $event : null,
                            range: "",
                            "partial-range": false,
                            "time-config": { enableTimePicker: false },
                            "model-type": "yyyy-MM-dd",
                            format: vueExports.unref(formatDateRange),
                            "auto-apply": "",
                            "max-date": /* @__PURE__ */ new Date(),
                            "input-class-name": "dp-custom-input",
                            teleport: true,
                            class: "w-64"
                          }, null, 8, ["modelValue", "onUpdate:modelValue", "format", "max-date"])
                        ]),
                        _: 1
                      })
                    ]),
                    _: 1
                  }),
                  vueExports.createVNode(_component_UFormField, { label: "Dự án" }, {
                    default: vueExports.withCtx(() => [
                      vueExports.createVNode(_component_SharedProjectSelect, {
                        modelValue: vueExports.unref(selectedProjectId),
                        "onUpdate:modelValue": ($event) => vueExports.isRef(selectedProjectId) ? selectedProjectId.value = $event : null,
                        placeholder: "Tất cả dự án",
                        class: "w-48"
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
                vueExports.unref(summary) ? (vueExports.openBlock(), vueExports.createBlock("p", {
                  key: 0,
                  class: "text-xs text-slate-500 mt-3"
                }, [
                  vueExports.createVNode(_component_UIcon, {
                    name: "i-lucide-calendar",
                    class: "size-3.5 align-[-2px]"
                  }),
                  vueExports.createTextVNode(" " + vueExports.toDisplayString(vueExports.unref(summary).period_label), 1)
                ])) : vueExports.createCommentVNode("", true)
              ];
            }
          }),
          _: 1
        }, _parent));
        _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UAlert, {
          color: "info",
          variant: "subtle",
          icon: "i-lucide-info",
          title: "Đồng bộ với cấu hình chia hoa hồng",
          description: "Bốn thẻ dưới là tổng phần hoa hồng phân bổ cho mỗi bên từ các đơn hàng trong kỳ chốt. Phân biệt rõ 'Hoa hồng phân bổ cho Công ty VH' với 'Lợi nhuận gộp công ty VH' ở khối thẻ thông tin bên dưới.",
          class: "mb-6"
        }, null, _parent));
        _push(`<div class="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">`);
        _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_SharedSectionCard, {
          title: "Hoa hồng phân bổ — Công ty vận hành",
          compact: ""
        }, {
          default: vueExports.withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              if (isLoading(vueExports.unref(summaryStatus))) {
                _push2(`<!--[-->`);
                _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_USkeleton, { class: "h-8 w-32 mb-2" }, null, _parent2, _scopeId));
                _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_USkeleton, { class: "h-4 w-48" }, null, _parent2, _scopeId));
                _push2(`<!--]-->`);
              } else if (vueExports.unref(summary)) {
                _push2(`<!--[--><p class="text-2xl font-bold tabular-nums"${_scopeId}>${serverRenderer_cjs_prodExports.ssrInterpolate(("formatCurrency" in _ctx ? _ctx.formatCurrency : vueExports.unref(formatCurrency))(vueExports.unref(summary).party_totals.operating_company))}</p><p class="text-xs text-slate-500 mt-2 leading-snug"${_scopeId}> Phần chia cho bên VH theo cấu hình đơn; khác với <strong${_scopeId}>LN gộp</strong> toàn công ty (xem khối bên dưới). </p><!--]-->`);
              } else {
                _push2(`<!---->`);
              }
            } else {
              return [
                isLoading(vueExports.unref(summaryStatus)) ? (vueExports.openBlock(), vueExports.createBlock(vueExports.Fragment, { key: 0 }, [
                  vueExports.createVNode(_component_USkeleton, { class: "h-8 w-32 mb-2" }),
                  vueExports.createVNode(_component_USkeleton, { class: "h-4 w-48" })
                ], 64)) : vueExports.unref(summary) ? (vueExports.openBlock(), vueExports.createBlock(vueExports.Fragment, { key: 1 }, [
                  vueExports.createVNode("p", { class: "text-2xl font-bold tabular-nums" }, vueExports.toDisplayString(("formatCurrency" in _ctx ? _ctx.formatCurrency : vueExports.unref(formatCurrency))(vueExports.unref(summary).party_totals.operating_company)), 1),
                  vueExports.createVNode("p", { class: "text-xs text-slate-500 mt-2 leading-snug" }, [
                    vueExports.createTextVNode(" Phần chia cho bên VH theo cấu hình đơn; khác với "),
                    vueExports.createVNode("strong", null, "LN gộp"),
                    vueExports.createTextVNode(" toàn công ty (xem khối bên dưới). ")
                  ])
                ], 64)) : vueExports.createCommentVNode("", true)
              ];
            }
          }),
          _: 1
        }, _parent));
        _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_SharedSectionCard, {
          title: "Ban quản trị",
          compact: ""
        }, {
          default: vueExports.withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              if (isLoading(vueExports.unref(summaryStatus))) {
                _push2(`<!--[-->`);
                _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_USkeleton, { class: "h-8 w-32 mb-2" }, null, _parent2, _scopeId));
                _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_USkeleton, { class: "h-4 w-48" }, null, _parent2, _scopeId));
                _push2(`<!--]-->`);
              } else if (vueExports.unref(summary)) {
                _push2(`<!--[--><p class="text-2xl font-bold tabular-nums"${_scopeId}>${serverRenderer_cjs_prodExports.ssrInterpolate(("formatCurrency" in _ctx ? _ctx.formatCurrency : vueExports.unref(formatCurrency))(vueExports.unref(summary).party_totals.board_of_directors))}</p><p class="text-xs text-slate-500 mt-2 leading-snug"${_scopeId}> Phần hoa hồng / phân bổ BQT theo cấu hình dự án. </p><!--]-->`);
              } else {
                _push2(`<!---->`);
              }
            } else {
              return [
                isLoading(vueExports.unref(summaryStatus)) ? (vueExports.openBlock(), vueExports.createBlock(vueExports.Fragment, { key: 0 }, [
                  vueExports.createVNode(_component_USkeleton, { class: "h-8 w-32 mb-2" }),
                  vueExports.createVNode(_component_USkeleton, { class: "h-4 w-48" })
                ], 64)) : vueExports.unref(summary) ? (vueExports.openBlock(), vueExports.createBlock(vueExports.Fragment, { key: 1 }, [
                  vueExports.createVNode("p", { class: "text-2xl font-bold tabular-nums" }, vueExports.toDisplayString(("formatCurrency" in _ctx ? _ctx.formatCurrency : vueExports.unref(formatCurrency))(vueExports.unref(summary).party_totals.board_of_directors)), 1),
                  vueExports.createVNode("p", { class: "text-xs text-slate-500 mt-2 leading-snug" }, " Phần hoa hồng / phân bổ BQT theo cấu hình dự án. ")
                ], 64)) : vueExports.createCommentVNode("", true)
              ];
            }
          }),
          _: 1
        }, _parent));
        _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_SharedSectionCard, {
          title: "Ban quản lý (BQL)",
          compact: ""
        }, {
          default: vueExports.withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              if (isLoading(vueExports.unref(summaryStatus))) {
                _push2(`<!--[-->`);
                _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_USkeleton, { class: "h-8 w-32 mb-2" }, null, _parent2, _scopeId));
                _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_USkeleton, { class: "h-4 w-48" }, null, _parent2, _scopeId));
                _push2(`<!--]-->`);
              } else if (vueExports.unref(summary)) {
                _push2(`<!--[--><p class="text-2xl font-bold tabular-nums"${_scopeId}>${serverRenderer_cjs_prodExports.ssrInterpolate(("formatCurrency" in _ctx ? _ctx.formatCurrency : vueExports.unref(formatCurrency))(vueExports.unref(summary).party_totals.management))}</p><p class="text-xs text-slate-500 mt-2 leading-snug"${_scopeId}> Phần hoa hồng / phân bổ BQL (cấp trên, có thể xuống phòng ban / cá nhân). </p><!--]-->`);
              } else {
                _push2(`<!---->`);
              }
            } else {
              return [
                isLoading(vueExports.unref(summaryStatus)) ? (vueExports.openBlock(), vueExports.createBlock(vueExports.Fragment, { key: 0 }, [
                  vueExports.createVNode(_component_USkeleton, { class: "h-8 w-32 mb-2" }),
                  vueExports.createVNode(_component_USkeleton, { class: "h-4 w-48" })
                ], 64)) : vueExports.unref(summary) ? (vueExports.openBlock(), vueExports.createBlock(vueExports.Fragment, { key: 1 }, [
                  vueExports.createVNode("p", { class: "text-2xl font-bold tabular-nums" }, vueExports.toDisplayString(("formatCurrency" in _ctx ? _ctx.formatCurrency : vueExports.unref(formatCurrency))(vueExports.unref(summary).party_totals.management)), 1),
                  vueExports.createVNode("p", { class: "text-xs text-slate-500 mt-2 leading-snug" }, " Phần hoa hồng / phân bổ BQL (cấp trên, có thể xuống phòng ban / cá nhân). ")
                ], 64)) : vueExports.createCommentVNode("", true)
              ];
            }
          }),
          _: 1
        }, _parent));
        _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_SharedSectionCard, {
          title: "Hoa hồng — Nền tảng (Platform)",
          compact: ""
        }, {
          default: vueExports.withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              if (isLoading(vueExports.unref(summaryStatus))) {
                _push2(`<!--[-->`);
                _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_USkeleton, { class: "h-8 w-32 mb-2" }, null, _parent2, _scopeId));
                _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_USkeleton, { class: "h-4 w-48" }, null, _parent2, _scopeId));
                _push2(`<!--]-->`);
              } else if (vueExports.unref(summary)) {
                _push2(`<!--[--><p class="text-2xl font-bold tabular-nums"${_scopeId}>${serverRenderer_cjs_prodExports.ssrInterpolate(("formatCurrency" in _ctx ? _ctx.formatCurrency : vueExports.unref(formatCurrency))(vueExports.unref(summary).party_totals.platform))}</p><p class="text-xs text-slate-500 mt-2 leading-snug"${_scopeId}> Tổng kỳ. Quy tắc cố định hệ thống: <strong${_scopeId}>${serverRenderer_cjs_prodExports.ssrInterpolate(vueExports.unref(summary).platform_rules.percent)}%</strong> + <strong${_scopeId}>${serverRenderer_cjs_prodExports.ssrInterpolate(("formatNumber" in _ctx ? _ctx.formatNumber : vueExports.unref(formatNumber))(vueExports.unref(summary).platform_rules.fixed_per_order))} đ/đơn</strong>. </p><!--]-->`);
              } else {
                _push2(`<!---->`);
              }
            } else {
              return [
                isLoading(vueExports.unref(summaryStatus)) ? (vueExports.openBlock(), vueExports.createBlock(vueExports.Fragment, { key: 0 }, [
                  vueExports.createVNode(_component_USkeleton, { class: "h-8 w-32 mb-2" }),
                  vueExports.createVNode(_component_USkeleton, { class: "h-4 w-48" })
                ], 64)) : vueExports.unref(summary) ? (vueExports.openBlock(), vueExports.createBlock(vueExports.Fragment, { key: 1 }, [
                  vueExports.createVNode("p", { class: "text-2xl font-bold tabular-nums" }, vueExports.toDisplayString(("formatCurrency" in _ctx ? _ctx.formatCurrency : vueExports.unref(formatCurrency))(vueExports.unref(summary).party_totals.platform)), 1),
                  vueExports.createVNode("p", { class: "text-xs text-slate-500 mt-2 leading-snug" }, [
                    vueExports.createTextVNode(" Tổng kỳ. Quy tắc cố định hệ thống: "),
                    vueExports.createVNode("strong", null, vueExports.toDisplayString(vueExports.unref(summary).platform_rules.percent) + "%", 1),
                    vueExports.createTextVNode(" + "),
                    vueExports.createVNode("strong", null, vueExports.toDisplayString(("formatNumber" in _ctx ? _ctx.formatNumber : vueExports.unref(formatNumber))(vueExports.unref(summary).platform_rules.fixed_per_order)) + " đ/đơn", 1),
                    vueExports.createTextVNode(". ")
                  ])
                ], 64)) : vueExports.createCommentVNode("", true)
              ];
            }
          }),
          _: 1
        }, _parent));
        _push(`</div><div class="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">`);
        _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_SharedSectionCard, {
          title: "Lợi nhuận công ty vận hành (góc kinh doanh)",
          compact: ""
        }, {
          default: vueExports.withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              if (isLoading(vueExports.unref(summaryStatus))) {
                _push2(`<!--[-->`);
                _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_USkeleton, { class: "h-4 w-full mb-3" }, null, _parent2, _scopeId));
                _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_USkeleton, { class: "h-4 w-40 mb-2" }, null, _parent2, _scopeId));
                _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_USkeleton, { class: "h-10 w-56" }, null, _parent2, _scopeId));
                _push2(`<!--]-->`);
              } else if (vueExports.unref(summary)) {
                _push2(`<!--[--><p class="text-sm text-slate-600 mb-3"${_scopeId}><strong${_scopeId}>Lợi nhuận gộp ước tính</strong> = Doanh thu − Hoa hồng chia cho BQT/BQL/Platform − Chi phí vật tư. </p><p class="text-xs text-slate-500 mb-1"${_scopeId}>${serverRenderer_cjs_prodExports.ssrInterpolate(vueExports.unref(summary).period_label)}</p><p class="text-2xl font-bold text-emerald-600 tabular-nums"${_scopeId}>${serverRenderer_cjs_prodExports.ssrInterpolate(("formatCurrency" in _ctx ? _ctx.formatCurrency : vueExports.unref(formatCurrency))(vueExports.unref(summary).estimated_gross_profit))}</p><p class="text-xs text-slate-500 mt-3"${_scopeId}> Chi phí vật tư lấy từ giá nhập trên từng dòng đơn (đã khoá khi đơn vào kỳ chốt). `);
                _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_NuxtLink, {
                  to: "/reports",
                  class: "text-primary-600 font-medium hover:underline"
                }, {
                  default: vueExports.withCtx((_2, _push3, _parent3, _scopeId2) => {
                    if (_push3) {
                      _push3(` Xem chi tiết doanh thu &amp; lợi nhuận → `);
                    } else {
                      return [
                        vueExports.createTextVNode(" Xem chi tiết doanh thu & lợi nhuận → ")
                      ];
                    }
                  }),
                  _: 1
                }, _parent2, _scopeId));
                _push2(`</p><!--]-->`);
              } else {
                _push2(`<!---->`);
              }
            } else {
              return [
                isLoading(vueExports.unref(summaryStatus)) ? (vueExports.openBlock(), vueExports.createBlock(vueExports.Fragment, { key: 0 }, [
                  vueExports.createVNode(_component_USkeleton, { class: "h-4 w-full mb-3" }),
                  vueExports.createVNode(_component_USkeleton, { class: "h-4 w-40 mb-2" }),
                  vueExports.createVNode(_component_USkeleton, { class: "h-10 w-56" })
                ], 64)) : vueExports.unref(summary) ? (vueExports.openBlock(), vueExports.createBlock(vueExports.Fragment, { key: 1 }, [
                  vueExports.createVNode("p", { class: "text-sm text-slate-600 mb-3" }, [
                    vueExports.createVNode("strong", null, "Lợi nhuận gộp ước tính"),
                    vueExports.createTextVNode(" = Doanh thu − Hoa hồng chia cho BQT/BQL/Platform − Chi phí vật tư. ")
                  ]),
                  vueExports.createVNode("p", { class: "text-xs text-slate-500 mb-1" }, vueExports.toDisplayString(vueExports.unref(summary).period_label), 1),
                  vueExports.createVNode("p", { class: "text-2xl font-bold text-emerald-600 tabular-nums" }, vueExports.toDisplayString(("formatCurrency" in _ctx ? _ctx.formatCurrency : vueExports.unref(formatCurrency))(vueExports.unref(summary).estimated_gross_profit)), 1),
                  vueExports.createVNode("p", { class: "text-xs text-slate-500 mt-3" }, [
                    vueExports.createTextVNode(" Chi phí vật tư lấy từ giá nhập trên từng dòng đơn (đã khoá khi đơn vào kỳ chốt). "),
                    vueExports.createVNode(_component_NuxtLink, {
                      to: "/reports",
                      class: "text-primary-600 font-medium hover:underline"
                    }, {
                      default: vueExports.withCtx(() => [
                        vueExports.createTextVNode(" Xem chi tiết doanh thu & lợi nhuận → ")
                      ]),
                      _: 1
                    })
                  ])
                ], 64)) : vueExports.createCommentVNode("", true)
              ];
            }
          }),
          _: 1
        }, _parent));
        _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_SharedSectionCard, {
          title: "Hoa hồng nền tảng (Platform)",
          compact: ""
        }, {
          default: vueExports.withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              if (isLoading(vueExports.unref(summaryStatus))) {
                _push2(`<!--[-->`);
                _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_USkeleton, { class: "h-4 w-full mb-3" }, null, _parent2, _scopeId));
                _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_USkeleton, { class: "h-20 w-full" }, null, _parent2, _scopeId));
                _push2(`<!--]-->`);
              } else if (vueExports.unref(summary)) {
                _push2(`<!--[--><p class="text-sm text-slate-600 mb-3"${_scopeId}> Nền tảng luôn có phần hoa hồng <strong${_scopeId}>theo quy tắc cố định</strong> trong code (không cấu hình theo từng dự án như VH / BQT / BQL). </p><ul class="text-sm space-y-2 list-disc pl-5 text-slate-600"${_scopeId}><li${_scopeId}><strong class="text-slate-900"${_scopeId}>${serverRenderer_cjs_prodExports.ssrInterpolate(vueExports.unref(summary).platform_rules.percent)}%</strong> trên cơ sở chia hoa hồng. </li><li${_scopeId}> Cộng thêm <strong class="text-slate-900"${_scopeId}>${serverRenderer_cjs_prodExports.ssrInterpolate(("formatNumber" in _ctx ? _ctx.formatNumber : vueExports.unref(formatNumber))(vueExports.unref(summary).platform_rules.fixed_per_order))} đ</strong> mỗi đơn hàng. </li><li${_scopeId}> Tổng kỳ trên thẻ: <strong class="text-slate-900 tabular-nums"${_scopeId}>${serverRenderer_cjs_prodExports.ssrInterpolate(("formatCurrency" in _ctx ? _ctx.formatCurrency : vueExports.unref(formatCurrency))(vueExports.unref(summary).party_totals.platform))}</strong>. </li></ul><!--]-->`);
              } else {
                _push2(`<!---->`);
              }
            } else {
              return [
                isLoading(vueExports.unref(summaryStatus)) ? (vueExports.openBlock(), vueExports.createBlock(vueExports.Fragment, { key: 0 }, [
                  vueExports.createVNode(_component_USkeleton, { class: "h-4 w-full mb-3" }),
                  vueExports.createVNode(_component_USkeleton, { class: "h-20 w-full" })
                ], 64)) : vueExports.unref(summary) ? (vueExports.openBlock(), vueExports.createBlock(vueExports.Fragment, { key: 1 }, [
                  vueExports.createVNode("p", { class: "text-sm text-slate-600 mb-3" }, [
                    vueExports.createTextVNode(" Nền tảng luôn có phần hoa hồng "),
                    vueExports.createVNode("strong", null, "theo quy tắc cố định"),
                    vueExports.createTextVNode(" trong code (không cấu hình theo từng dự án như VH / BQT / BQL). ")
                  ]),
                  vueExports.createVNode("ul", { class: "text-sm space-y-2 list-disc pl-5 text-slate-600" }, [
                    vueExports.createVNode("li", null, [
                      vueExports.createVNode("strong", { class: "text-slate-900" }, vueExports.toDisplayString(vueExports.unref(summary).platform_rules.percent) + "%", 1),
                      vueExports.createTextVNode(" trên cơ sở chia hoa hồng. ")
                    ]),
                    vueExports.createVNode("li", null, [
                      vueExports.createTextVNode(" Cộng thêm "),
                      vueExports.createVNode("strong", { class: "text-slate-900" }, vueExports.toDisplayString(("formatNumber" in _ctx ? _ctx.formatNumber : vueExports.unref(formatNumber))(vueExports.unref(summary).platform_rules.fixed_per_order)) + " đ", 1),
                      vueExports.createTextVNode(" mỗi đơn hàng. ")
                    ]),
                    vueExports.createVNode("li", null, [
                      vueExports.createTextVNode(" Tổng kỳ trên thẻ: "),
                      vueExports.createVNode("strong", { class: "text-slate-900 tabular-nums" }, vueExports.toDisplayString(("formatCurrency" in _ctx ? _ctx.formatCurrency : vueExports.unref(formatCurrency))(vueExports.unref(summary).party_totals.platform)), 1),
                      vueExports.createTextVNode(". ")
                    ])
                  ])
                ], 64)) : vueExports.createCommentVNode("", true)
              ];
            }
          }),
          _: 1
        }, _parent));
        _push(`</div><div class="grid grid-cols-1 xl:grid-cols-2 gap-4 mb-6">`);
        _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_SharedSectionCard, {
          title: "Hoa hồng theo dự án",
          compact: ""
        }, {
          default: vueExports.withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              if (isLoading(vueExports.unref(byStaffStatus))) {
                _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_USkeleton, { class: "h-[320px] w-full" }, null, _parent2, _scopeId));
              } else {
                _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_SharedReportStackedColumnChart, {
                  categories: vueExports.unref(chartByProject),
                  series: COMMISSION_SERIES,
                  "max-bars": 12,
                  "value-suffix": " đ",
                  "empty-text": "Chưa có dữ liệu hoa hồng trong kỳ đã chọn"
                }, null, _parent2, _scopeId));
              }
            } else {
              return [
                isLoading(vueExports.unref(byStaffStatus)) ? (vueExports.openBlock(), vueExports.createBlock(_component_USkeleton, {
                  key: 0,
                  class: "h-[320px] w-full"
                })) : (vueExports.openBlock(), vueExports.createBlock(_component_SharedReportStackedColumnChart, {
                  key: 1,
                  categories: vueExports.unref(chartByProject),
                  series: COMMISSION_SERIES,
                  "max-bars": 12,
                  "value-suffix": " đ",
                  "empty-text": "Chưa có dữ liệu hoa hồng trong kỳ đã chọn"
                }, null, 8, ["categories"]))
              ];
            }
          }),
          _: 1
        }, _parent));
        _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_SharedSectionCard, {
          title: "Hoa hồng theo bộ phận",
          compact: ""
        }, {
          default: vueExports.withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              if (isLoading(vueExports.unref(byStaffStatus))) {
                _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_USkeleton, { class: "h-[320px] w-full" }, null, _parent2, _scopeId));
              } else {
                _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_SharedReportStackedColumnChart, {
                  categories: vueExports.unref(chartByDepartment),
                  series: COMMISSION_SERIES,
                  "max-bars": 12,
                  "value-suffix": " đ",
                  "empty-text": "Chưa có dữ liệu hoa hồng trong kỳ đã chọn"
                }, null, _parent2, _scopeId));
              }
            } else {
              return [
                isLoading(vueExports.unref(byStaffStatus)) ? (vueExports.openBlock(), vueExports.createBlock(_component_USkeleton, {
                  key: 0,
                  class: "h-[320px] w-full"
                })) : (vueExports.openBlock(), vueExports.createBlock(_component_SharedReportStackedColumnChart, {
                  key: 1,
                  categories: vueExports.unref(chartByDepartment),
                  series: COMMISSION_SERIES,
                  "max-bars": 12,
                  "value-suffix": " đ",
                  "empty-text": "Chưa có dữ liệu hoa hồng trong kỳ đã chọn"
                }, null, 8, ["categories"]))
              ];
            }
          }),
          _: 1
        }, _parent));
        _push(`</div>`);
        _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_SharedSectionCard, {
          title: "Hoa hồng theo cá nhân (Top 15)",
          compact: "",
          class: "mb-6"
        }, {
          default: vueExports.withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              if (isLoading(vueExports.unref(byStaffStatus))) {
                _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_USkeleton, { class: "h-[320px] w-full" }, null, _parent2, _scopeId));
              } else {
                _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_SharedReportStackedColumnChart, {
                  categories: vueExports.unref(chartByStaff),
                  series: COMMISSION_SERIES,
                  "max-bars": 15,
                  "value-suffix": " đ",
                  "empty-text": "Chưa có dữ liệu hoa hồng trong kỳ đã chọn"
                }, null, _parent2, _scopeId));
              }
            } else {
              return [
                isLoading(vueExports.unref(byStaffStatus)) ? (vueExports.openBlock(), vueExports.createBlock(_component_USkeleton, {
                  key: 0,
                  class: "h-[320px] w-full"
                })) : (vueExports.openBlock(), vueExports.createBlock(_component_SharedReportStackedColumnChart, {
                  key: 1,
                  categories: vueExports.unref(chartByStaff),
                  series: COMMISSION_SERIES,
                  "max-bars": 15,
                  "value-suffix": " đ",
                  "empty-text": "Chưa có dữ liệu hoa hồng trong kỳ đã chọn"
                }, null, 8, ["categories"]))
              ];
            }
          }),
          _: 1
        }, _parent));
        _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_SharedSectionCard, {
          title: "Hoa hồng theo người / bên nhận",
          compact: "",
          class: "mb-6"
        }, {
          "header-actions": vueExports.withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_NuxtLink, {
                to: "/pmc/finance/commission-summary",
                class: "text-sm font-medium text-primary-600 hover:text-primary-700"
              }, {
                default: vueExports.withCtx((_2, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    _push3(` Tổng hợp hoa hồng (kế toán) → `);
                  } else {
                    return [
                      vueExports.createTextVNode(" Tổng hợp hoa hồng (kế toán) → ")
                    ];
                  }
                }),
                _: 1
              }, _parent2, _scopeId));
            } else {
              return [
                vueExports.createVNode(_component_NuxtLink, {
                  to: "/pmc/finance/commission-summary",
                  class: "text-sm font-medium text-primary-600 hover:text-primary-700"
                }, {
                  default: vueExports.withCtx(() => [
                    vueExports.createTextVNode(" Tổng hợp hoa hồng (kế toán) → ")
                  ]),
                  _: 1
                })
              ];
            }
          }),
          default: vueExports.withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              if (isLoading(vueExports.unref(byStaffStatus)) || isLoading(vueExports.unref(summaryStatus))) {
                _push2(`<!--[-->`);
                _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_USkeleton, { class: "h-8 w-full mb-2" }, null, _parent2, _scopeId));
                _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_USkeleton, { class: "h-8 w-full mb-2" }, null, _parent2, _scopeId));
                _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_USkeleton, { class: "h-8 w-full" }, null, _parent2, _scopeId));
                _push2(`<!--]-->`);
              } else if (vueExports.unref(byRecipient).length === 0) {
                _push2(`<div class="py-8 text-center text-sm text-slate-500"${_scopeId}> Chưa có dữ liệu hoa hồng trong kỳ đã chọn </div>`);
              } else {
                _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UTable, {
                  data: vueExports.unref(byRecipient),
                  columns: recipientColumns,
                  "empty-state": { icon: "i-lucide-inbox", label: "Không có dữ liệu" }
                }, {
                  "typeLabel-cell": vueExports.withCtx(({ row }, _push3, _parent3, _scopeId2) => {
                    if (_push3) {
                      _push3(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UBadge, {
                        color: vueExports.unref(recipientTypeBadgeColor)(row.original.type),
                        variant: "subtle",
                        label: row.original.typeLabel
                      }, null, _parent3, _scopeId2));
                    } else {
                      return [
                        vueExports.createVNode(_component_UBadge, {
                          color: vueExports.unref(recipientTypeBadgeColor)(row.original.type),
                          variant: "subtle",
                          label: row.original.typeLabel
                        }, null, 8, ["color", "label"])
                      ];
                    }
                  }),
                  "amount-cell": vueExports.withCtx(({ row }, _push3, _parent3, _scopeId2) => {
                    if (_push3) {
                      _push3(`<span class="tabular-nums font-medium"${_scopeId2}>${serverRenderer_cjs_prodExports.ssrInterpolate(("formatCurrency" in _ctx ? _ctx.formatCurrency : vueExports.unref(formatCurrency))(String(row.original.amount)))}</span>`);
                    } else {
                      return [
                        vueExports.createVNode("span", { class: "tabular-nums font-medium" }, vueExports.toDisplayString(("formatCurrency" in _ctx ? _ctx.formatCurrency : vueExports.unref(formatCurrency))(String(row.original.amount))), 1)
                      ];
                    }
                  }),
                  _: 1
                }, _parent2, _scopeId));
              }
            } else {
              return [
                isLoading(vueExports.unref(byStaffStatus)) || isLoading(vueExports.unref(summaryStatus)) ? (vueExports.openBlock(), vueExports.createBlock(vueExports.Fragment, { key: 0 }, [
                  vueExports.createVNode(_component_USkeleton, { class: "h-8 w-full mb-2" }),
                  vueExports.createVNode(_component_USkeleton, { class: "h-8 w-full mb-2" }),
                  vueExports.createVNode(_component_USkeleton, { class: "h-8 w-full" })
                ], 64)) : vueExports.unref(byRecipient).length === 0 ? (vueExports.openBlock(), vueExports.createBlock("div", {
                  key: 1,
                  class: "py-8 text-center text-sm text-slate-500"
                }, " Chưa có dữ liệu hoa hồng trong kỳ đã chọn ")) : (vueExports.openBlock(), vueExports.createBlock(_component_UTable, {
                  key: 2,
                  data: vueExports.unref(byRecipient),
                  columns: recipientColumns,
                  "empty-state": { icon: "i-lucide-inbox", label: "Không có dữ liệu" }
                }, {
                  "typeLabel-cell": vueExports.withCtx(({ row }) => [
                    vueExports.createVNode(_component_UBadge, {
                      color: vueExports.unref(recipientTypeBadgeColor)(row.original.type),
                      variant: "subtle",
                      label: row.original.typeLabel
                    }, null, 8, ["color", "label"])
                  ]),
                  "amount-cell": vueExports.withCtx(({ row }) => [
                    vueExports.createVNode("span", { class: "tabular-nums font-medium" }, vueExports.toDisplayString(("formatCurrency" in _ctx ? _ctx.formatCurrency : vueExports.unref(formatCurrency))(String(row.original.amount))), 1)
                  ]),
                  _: 1
                }, 8, ["data"]))
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/reports/commission.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=commission-eI--R6Xq.mjs.map
