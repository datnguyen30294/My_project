import { _ as __nuxt_component_4 } from './SectionCard-CH-mG9Mf.mjs';
import { _ as _sfc_main$1 } from './Input-JXN8po_F.mjs';
import { _ as _sfc_main$2 } from './Select-CZE7Ef6n.mjs';
import { _ as __nuxt_component_3 } from './ProjectSelect-BTBiFCd5.mjs';
import { v as vueExports, u as useSeoMeta, j as useToast, s as serverRenderer_cjs_prodExports, l as _sfc_main$c, k as _sfc_main$h, _ as __nuxt_component_0$4, o as useApiFetch, $ as $api } from './server.mjs';
import { _ as _sfc_main$3 } from './Table-17SH0cIR.mjs';
import { _ as _sfc_main$5 } from './Checkbox-Cp_FPUkd.mjs';
import { _ as _sfc_main$4 } from './Badge-W93D3Jpz.mjs';
import { _ as _sfc_main$6 } from './Modal-BimZZbNl.mjs';
import { _ as _sfc_main$7 } from './FormField-DFdmv6Lu.mjs';
import { _ as _sfc_main$8 } from './Textarea-DTCNHwKm.mjs';
import { _ as __nuxt_component_13 } from './BankQrModal-v8n4Z6aB.mjs';
import { f as formatCurrency } from './currency-DEb2TrW3.mjs';
import { u as useTableSearch } from './useTableSearch-BhG9s2Ie.mjs';
import { s as stickyRight } from './table-z_7x7CvB.mjs';
import { g as getApiErrorMessage } from './apiError-DBrxF9au.mjs';
import './index-QmZAbLx-.mjs';
import './useDirection-CXYby7CP.mjs';
import './useFormControl-_Lqv8ipK.mjs';
import './PopperArrow-C9hHWuSZ.mjs';
import './FocusScope-BZehoQSg.mjs';
import './useFocusGuards-CJykkUFH.mjs';
import './utils-DY0Zag2O.mjs';
import './handleAndDispatchCustomEvent-Bk_AVSSo.mjs';
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
import './SelectMenu-DKHEMZj7.mjs';
import './useKbd-JjFOu4f7.mjs';
import './utils-BgcT7rQQ.mjs';
import './VisuallyHiddenInput-q6Pz-w0i.mjs';
import './index-CSThDD3J.mjs';
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
import './RovingFocusItem-DwKRAYZk.mjs';
import './RovingFocusGroup-Vsbo7D6E.mjs';
import './Label-BBgw4vHh.mjs';
import './DialogTrigger-C3iwCYMu.mjs';
import './DialogClose-DGkUxau7.mjs';
import './QrCode-B1G5K_8N.mjs';
import './vietqr-D50vgfgj.mjs';

const ADVANCE_PAYMENT_LIST_KEY = "advance-payments-list";
const ADVANCE_PAYMENT_STATS_KEY = "advance-payments-stats";
const ADVANCE_PAYMENT_HISTORY_KEY = "advance-payments-history";
function useAdvancePaymentList(filters) {
  return useApiFetch(
    "/pmc/advance-payments",
    {
      key: ADVANCE_PAYMENT_LIST_KEY,
      query: filters,
      watch: [filters]
    }
  );
}
function useAdvancePaymentStats() {
  return useApiFetch(
    "/pmc/advance-payments/stats",
    { key: ADVANCE_PAYMENT_STATS_KEY }
  );
}
function useAdvancePaymentHistory() {
  return useApiFetch(
    "/pmc/advance-payments/history",
    { key: ADVANCE_PAYMENT_HISTORY_KEY }
  );
}
function apiCreateAdvancePayment(data) {
  return $api(
    "/pmc/advance-payments",
    { method: "POST", body: data }
  );
}
function apiCreateBatchAdvancePayment(data) {
  return $api(
    "/pmc/advance-payments/batch",
    { method: "POST", body: data }
  );
}
const _sfc_main = /* @__PURE__ */ vueExports.defineComponent({
  __name: "index",
  __ssrInlineRender: true,
  setup(__props) {
    useSeoMeta({ title: "Tiền ứng vật tư - Thần Nông" });
    const toast = useToast();
    const searchInput = vueExports.ref("");
    const debouncedSearch = vueExports.ref("");
    const { searchInput: boundSearch, onSearch } = useTableSearch((val) => {
      debouncedSearch.value = val ?? "";
    });
    boundSearch.value = searchInput.value;
    const statusFilter = vueExports.ref("all");
    const projectFilter = vueExports.ref(null);
    const listFilters = vueExports.computed(() => ({
      status: statusFilter.value,
      project_id: projectFilter.value ?? void 0,
      search: debouncedSearch.value || void 0
    }));
    const { data: listData, status: listStatus, refresh: refreshList } = useAdvancePaymentList(listFilters);
    const { data: statsData, refresh: refreshStats } = useAdvancePaymentStats();
    const { data: historyData, refresh: refreshHistory } = useAdvancePaymentHistory();
    const rows = vueExports.computed(() => listData.value?.data ?? []);
    const stats = vueExports.computed(() => statsData.value?.data ?? {
      total_advanced: "0.00",
      total_pending: "0.00",
      total_paid: "0.00",
      account_count: 0
    });
    const history = vueExports.computed(() => historyData.value?.data ?? []);
    function refreshAll() {
      refreshList();
      refreshStats();
      refreshHistory();
    }
    const columns = [
      { id: "select", header: "" },
      { id: "payer", header: "Nhân sự" },
      { id: "order_line", header: "Dòng đơn hàng" },
      { id: "amount", header: "Tiền ứng" },
      { id: "status", header: "Trạng thái" },
      stickyRight({ id: "actions", header: "" })
    ];
    const historyColumns = [
      { id: "payer", header: "Nhân sự" },
      { id: "order", header: "Đơn hàng" },
      { id: "line", header: "Hạng mục" },
      { id: "amount", header: "Số tiền" },
      { accessorKey: "note", header: "Ghi chú" },
      { id: "paid_at", header: "Ngày hoàn" }
    ];
    const selectedIds = vueExports.ref(/* @__PURE__ */ new Set());
    const pendingRows = vueExports.computed(() => rows.value.filter((r) => !r.is_paid));
    const isAllSelected = vueExports.computed(
      () => pendingRows.value.length > 0 && pendingRows.value.every((r) => selectedIds.value.has(r.order_line_id))
    );
    const isSomeSelected = vueExports.computed(
      () => pendingRows.value.some((r) => selectedIds.value.has(r.order_line_id))
    );
    function toggleSelectAll(v) {
      const next = new Set(selectedIds.value);
      if (v === true) {
        pendingRows.value.forEach((r) => next.add(r.order_line_id));
      } else {
        pendingRows.value.forEach((r) => next.delete(r.order_line_id));
      }
      selectedIds.value = next;
    }
    function toggleRow(lineId, v) {
      const next = new Set(selectedIds.value);
      if (v === true) next.add(lineId);
      else next.delete(lineId);
      selectedIds.value = next;
    }
    const payModalOpen = vueExports.ref(false);
    const payTarget = vueExports.ref(null);
    const payNote = vueExports.ref("");
    const payPaidAt = vueExports.ref(todayStr());
    const isPaying = vueExports.ref(false);
    function todayStr() {
      return (/* @__PURE__ */ new Date()).toISOString().slice(0, 10);
    }
    function openPayModal(row) {
      payTarget.value = row;
      payNote.value = `Hoàn tiền ứng ${row.line_name} đơn ${row.order_code}`;
      payPaidAt.value = todayStr();
      payModalOpen.value = true;
    }
    async function submitSinglePay() {
      if (!payTarget.value) return;
      isPaying.value = true;
      try {
        await apiCreateAdvancePayment({
          order_line_id: payTarget.value.order_line_id,
          note: payNote.value || null,
          paid_at: payPaidAt.value
        });
        toast.add({ title: "Đã ghi nhận hoàn tiền ứng", color: "success" });
        selectedIds.value.delete(payTarget.value.order_line_id);
        payModalOpen.value = false;
        refreshAll();
      } catch (err) {
        toast.add({ title: getApiErrorMessage(err, "Ghi nhận thất bại"), color: "error" });
      } finally {
        isPaying.value = false;
      }
    }
    const batchModalOpen = vueExports.ref(false);
    const batchNote = vueExports.ref("");
    const batchPaidAt = vueExports.ref(todayStr());
    const batchTargets = vueExports.computed(
      () => rows.value.filter((r) => selectedIds.value.has(r.order_line_id) && !r.is_paid)
    );
    const batchTotal = vueExports.computed(
      () => batchTargets.value.reduce((s, r) => s + parseFloat(r.advance_amount), 0)
    );
    function openBatchModal() {
      batchNote.value = `Hoàn tiền ứng vật tư — ${(/* @__PURE__ */ new Date()).toLocaleDateString("vi-VN")}`;
      batchPaidAt.value = todayStr();
      batchModalOpen.value = true;
    }
    async function submitBatchPay() {
      if (batchTargets.value.length === 0) return;
      isPaying.value = true;
      try {
        await apiCreateBatchAdvancePayment({
          order_line_ids: batchTargets.value.map((r) => r.order_line_id),
          note: batchNote.value || null,
          paid_at: batchPaidAt.value
        });
        toast.add({ title: `Đã hoàn ${batchTargets.value.length} mục tiền ứng`, color: "success" });
        selectedIds.value = /* @__PURE__ */ new Set();
        batchModalOpen.value = false;
        refreshAll();
      } catch (err) {
        toast.add({ title: getApiErrorMessage(err, "Ghi nhận thất bại"), color: "error" });
      } finally {
        isPaying.value = false;
      }
    }
    const qrModalOpen = vueExports.ref(false);
    const qrBank = vueExports.ref(null);
    const qrAmount = vueExports.ref(0);
    const qrDescription = vueExports.ref("");
    const qrRecipientName = vueExports.ref("");
    function openQrModal(row) {
      if (!row.advance_payer?.bank_info) {
        toast.add({
          title: "Nhân sự chưa có thông tin ngân hàng",
          description: "Cập nhật trong Tài khoản > Thông tin ngân hàng.",
          color: "warning"
        });
        return;
      }
      qrBank.value = row.advance_payer.bank_info;
      qrAmount.value = parseFloat(row.advance_amount);
      qrDescription.value = `HOAN UNG ${row.advance_payer.employee_code ?? ""} ${row.order_code}`.trim();
      qrRecipientName.value = row.advance_payer.name;
      qrModalOpen.value = true;
    }
    return (_ctx, _push, _parent, _attrs) => {
      const _component_SharedSectionCard = __nuxt_component_4;
      const _component_UInput = _sfc_main$1;
      const _component_USelect = _sfc_main$2;
      const _component_SharedProjectSelect = __nuxt_component_3;
      const _component_UButton = _sfc_main$c;
      const _component_UIcon = _sfc_main$h;
      const _component_UTable = _sfc_main$3;
      const _component_UCheckbox = _sfc_main$5;
      const _component_NuxtLink = __nuxt_component_0$4;
      const _component_UBadge = _sfc_main$4;
      const _component_UModal = _sfc_main$6;
      const _component_UFormField = _sfc_main$7;
      const _component_UTextarea = _sfc_main$8;
      const _component_SharedBankQrModal = __nuxt_component_13;
      _push(`<div${serverRenderer_cjs_prodExports.ssrRenderAttrs(vueExports.mergeProps({ class: "pb-12" }, _attrs))}><div class="mb-6"><h1 class="text-2xl font-black text-slate-900 tracking-tight"> Tiền ứng vật tư </h1><p class="text-sm text-slate-500 mt-1"> Theo dõi và hoàn tiền ứng mua vật tư theo dòng đơn hàng cho nhân sự. </p></div><div class="flex flex-col gap-6"><div class="grid grid-cols-2 lg:grid-cols-4 gap-3"><div class="bg-white border border-slate-200 rounded-xl px-5 py-4 text-center"><p class="text-xs text-slate-500 mb-1"> Tổng đã ứng </p><p class="text-lg font-bold tabular-nums text-slate-900">${serverRenderer_cjs_prodExports.ssrInterpolate(("formatCurrency" in _ctx ? _ctx.formatCurrency : vueExports.unref(formatCurrency))(vueExports.unref(stats).total_advanced))}</p></div><div class="bg-white border border-slate-200 rounded-xl px-5 py-4 text-center"><p class="text-xs text-slate-500 mb-1"> Chưa hoàn </p><p class="text-lg font-bold tabular-nums text-amber-600">${serverRenderer_cjs_prodExports.ssrInterpolate(("formatCurrency" in _ctx ? _ctx.formatCurrency : vueExports.unref(formatCurrency))(vueExports.unref(stats).total_pending))}</p></div><div class="bg-white border border-slate-200 rounded-xl px-5 py-4 text-center"><p class="text-xs text-slate-500 mb-1"> Đã hoàn </p><p class="text-lg font-bold tabular-nums text-emerald-600">${serverRenderer_cjs_prodExports.ssrInterpolate(("formatCurrency" in _ctx ? _ctx.formatCurrency : vueExports.unref(formatCurrency))(vueExports.unref(stats).total_paid))}</p></div><div class="bg-white border border-slate-200 rounded-xl px-5 py-4 text-center"><p class="text-xs text-slate-500 mb-1"> Số nhân sự ứng </p><p class="text-lg font-bold tabular-nums text-slate-900">${serverRenderer_cjs_prodExports.ssrInterpolate(vueExports.unref(stats).account_count)}</p></div></div>`);
      _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_SharedSectionCard, {
        title: "Bộ lọc",
        compact: ""
      }, {
        default: vueExports.withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="flex flex-wrap items-center gap-3"${_scopeId}>`);
            _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UInput, {
              modelValue: vueExports.unref(boundSearch),
              "onUpdate:modelValue": ($event) => vueExports.isRef(boundSearch) ? boundSearch.value = $event : null,
              placeholder: "Tìm nhân sự, đơn hàng, hạng mục...",
              icon: "i-lucide-search",
              class: "min-w-64",
              onInput: vueExports.unref(onSearch)
            }, null, _parent2, _scopeId));
            _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_USelect, {
              modelValue: vueExports.unref(statusFilter),
              "onUpdate:modelValue": ($event) => vueExports.isRef(statusFilter) ? statusFilter.value = $event : null,
              items: [
                { label: "Tất cả", value: "all" },
                { label: "Chưa hoàn", value: "pending" },
                { label: "Đã hoàn", value: "paid" }
              ],
              class: "min-w-40"
            }, null, _parent2, _scopeId));
            _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_SharedProjectSelect, {
              modelValue: vueExports.unref(projectFilter),
              "onUpdate:modelValue": ($event) => vueExports.isRef(projectFilter) ? projectFilter.value = $event : null,
              placeholder: "Tất cả dự án"
            }, null, _parent2, _scopeId));
            _push2(`<div class="grow"${_scopeId}></div>`);
            if (vueExports.unref(selectedIds).size > 0) {
              _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UButton, {
                icon: "i-lucide-check-circle",
                label: `Hoàn ${vueExports.unref(selectedIds).size} mục đã chọn`,
                color: "success",
                onClick: openBatchModal
              }, null, _parent2, _scopeId));
            } else {
              _push2(`<!---->`);
            }
            _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UButton, {
              icon: "i-lucide-refresh-cw",
              variant: "ghost",
              color: "neutral",
              onClick: refreshAll
            }, null, _parent2, _scopeId));
            _push2(`</div>`);
          } else {
            return [
              vueExports.createVNode("div", { class: "flex flex-wrap items-center gap-3" }, [
                vueExports.createVNode(_component_UInput, {
                  modelValue: vueExports.unref(boundSearch),
                  "onUpdate:modelValue": ($event) => vueExports.isRef(boundSearch) ? boundSearch.value = $event : null,
                  placeholder: "Tìm nhân sự, đơn hàng, hạng mục...",
                  icon: "i-lucide-search",
                  class: "min-w-64",
                  onInput: vueExports.unref(onSearch)
                }, null, 8, ["modelValue", "onUpdate:modelValue", "onInput"]),
                vueExports.createVNode(_component_USelect, {
                  modelValue: vueExports.unref(statusFilter),
                  "onUpdate:modelValue": ($event) => vueExports.isRef(statusFilter) ? statusFilter.value = $event : null,
                  items: [
                    { label: "Tất cả", value: "all" },
                    { label: "Chưa hoàn", value: "pending" },
                    { label: "Đã hoàn", value: "paid" }
                  ],
                  class: "min-w-40"
                }, null, 8, ["modelValue", "onUpdate:modelValue"]),
                vueExports.createVNode(_component_SharedProjectSelect, {
                  modelValue: vueExports.unref(projectFilter),
                  "onUpdate:modelValue": ($event) => vueExports.isRef(projectFilter) ? projectFilter.value = $event : null,
                  placeholder: "Tất cả dự án"
                }, null, 8, ["modelValue", "onUpdate:modelValue"]),
                vueExports.createVNode("div", { class: "grow" }),
                vueExports.unref(selectedIds).size > 0 ? (vueExports.openBlock(), vueExports.createBlock(_component_UButton, {
                  key: 0,
                  icon: "i-lucide-check-circle",
                  label: `Hoàn ${vueExports.unref(selectedIds).size} mục đã chọn`,
                  color: "success",
                  onClick: openBatchModal
                }, null, 8, ["label"])) : vueExports.createCommentVNode("", true),
                vueExports.createVNode(_component_UButton, {
                  icon: "i-lucide-refresh-cw",
                  variant: "ghost",
                  color: "neutral",
                  onClick: refreshAll
                })
              ])
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_SharedSectionCard, {
        title: `Danh sách tiền ứng (${vueExports.unref(rows).length})`
      }, {
        default: vueExports.withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            if (vueExports.unref(listStatus) === "pending") {
              _push2(`<div class="py-12 flex justify-center"${_scopeId}>`);
              _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UIcon, {
                name: "i-lucide-loader-2",
                class: "size-6 animate-spin text-slate-400"
              }, null, _parent2, _scopeId));
              _push2(`</div>`);
            } else if (vueExports.unref(rows).length === 0) {
              _push2(`<div class="py-12 text-center"${_scopeId}>`);
              _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UIcon, {
                name: "i-lucide-package-open",
                class: "size-10 text-slate-300 mx-auto mb-2"
              }, null, _parent2, _scopeId));
              _push2(`<p class="text-sm text-slate-500"${_scopeId}> Không có dòng nào khớp với bộ lọc. </p></div>`);
            } else {
              _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UTable, {
                data: vueExports.unref(rows),
                columns
              }, {
                "select-header": vueExports.withCtx((_2, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    _push3(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UCheckbox, {
                      "model-value": vueExports.unref(isAllSelected),
                      indeterminate: vueExports.unref(isSomeSelected) && !vueExports.unref(isAllSelected),
                      "aria-label": "Chọn tất cả",
                      "onUpdate:modelValue": toggleSelectAll
                    }, null, _parent3, _scopeId2));
                  } else {
                    return [
                      vueExports.createVNode(_component_UCheckbox, {
                        "model-value": vueExports.unref(isAllSelected),
                        indeterminate: vueExports.unref(isSomeSelected) && !vueExports.unref(isAllSelected),
                        "aria-label": "Chọn tất cả",
                        "onUpdate:modelValue": toggleSelectAll
                      }, null, 8, ["model-value", "indeterminate"])
                    ];
                  }
                }),
                "select-cell": vueExports.withCtx(({ row }, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    _push3(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UCheckbox, {
                      "model-value": vueExports.unref(selectedIds).has(row.original.order_line_id),
                      disabled: row.original.is_paid,
                      "onUpdate:modelValue": (v) => toggleRow(row.original.order_line_id, v)
                    }, null, _parent3, _scopeId2));
                  } else {
                    return [
                      vueExports.createVNode(_component_UCheckbox, {
                        "model-value": vueExports.unref(selectedIds).has(row.original.order_line_id),
                        disabled: row.original.is_paid,
                        "onUpdate:modelValue": (v) => toggleRow(row.original.order_line_id, v)
                      }, null, 8, ["model-value", "disabled", "onUpdate:modelValue"])
                    ];
                  }
                }),
                "payer-cell": vueExports.withCtx(({ row }, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    _push3(`<div class="min-w-0"${_scopeId2}><p class="text-sm font-medium text-slate-900 truncate"${_scopeId2}>${serverRenderer_cjs_prodExports.ssrInterpolate(row.original.advance_payer?.name ?? "—")}</p><p class="text-xs text-slate-500"${_scopeId2}>${serverRenderer_cjs_prodExports.ssrInterpolate(row.original.advance_payer?.employee_code ?? "")}</p></div>`);
                  } else {
                    return [
                      vueExports.createVNode("div", { class: "min-w-0" }, [
                        vueExports.createVNode("p", { class: "text-sm font-medium text-slate-900 truncate" }, vueExports.toDisplayString(row.original.advance_payer?.name ?? "—"), 1),
                        vueExports.createVNode("p", { class: "text-xs text-slate-500" }, vueExports.toDisplayString(row.original.advance_payer?.employee_code ?? ""), 1)
                      ])
                    ];
                  }
                }),
                "order_line-cell": vueExports.withCtx(({ row }, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    _push3(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_NuxtLink, {
                      to: `/pmc/orders/${row.original.order_id}`,
                      class: "text-sm text-primary-600 hover:underline font-mono"
                    }, {
                      default: vueExports.withCtx((_2, _push4, _parent4, _scopeId3) => {
                        if (_push4) {
                          _push4(`${serverRenderer_cjs_prodExports.ssrInterpolate(row.original.order_code)}`);
                        } else {
                          return [
                            vueExports.createTextVNode(vueExports.toDisplayString(row.original.order_code), 1)
                          ];
                        }
                      }),
                      _: 2
                    }, _parent3, _scopeId2));
                    _push3(`<p class="text-xs text-slate-500 truncate max-w-sm"${_scopeId2}>${serverRenderer_cjs_prodExports.ssrInterpolate(row.original.line_name)}</p>`);
                  } else {
                    return [
                      vueExports.createVNode(_component_NuxtLink, {
                        to: `/pmc/orders/${row.original.order_id}`,
                        class: "text-sm text-primary-600 hover:underline font-mono"
                      }, {
                        default: vueExports.withCtx(() => [
                          vueExports.createTextVNode(vueExports.toDisplayString(row.original.order_code), 1)
                        ]),
                        _: 2
                      }, 1032, ["to"]),
                      vueExports.createVNode("p", { class: "text-xs text-slate-500 truncate max-w-sm" }, vueExports.toDisplayString(row.original.line_name), 1)
                    ];
                  }
                }),
                "amount-cell": vueExports.withCtx(({ row }, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    _push3(`<div class="text-right"${_scopeId2}><p class="text-sm font-semibold tabular-nums text-slate-900"${_scopeId2}>${serverRenderer_cjs_prodExports.ssrInterpolate(("formatCurrency" in _ctx ? _ctx.formatCurrency : vueExports.unref(formatCurrency))(row.original.advance_amount))}</p><p class="text-xs text-slate-400"${_scopeId2}>${serverRenderer_cjs_prodExports.ssrInterpolate(row.original.quantity)} ${serverRenderer_cjs_prodExports.ssrInterpolate(row.original.unit)}</p></div>`);
                  } else {
                    return [
                      vueExports.createVNode("div", { class: "text-right" }, [
                        vueExports.createVNode("p", { class: "text-sm font-semibold tabular-nums text-slate-900" }, vueExports.toDisplayString(("formatCurrency" in _ctx ? _ctx.formatCurrency : vueExports.unref(formatCurrency))(row.original.advance_amount)), 1),
                        vueExports.createVNode("p", { class: "text-xs text-slate-400" }, vueExports.toDisplayString(row.original.quantity) + " " + vueExports.toDisplayString(row.original.unit), 1)
                      ])
                    ];
                  }
                }),
                "status-cell": vueExports.withCtx(({ row }, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    _push3(`<div class="flex flex-col items-end gap-1"${_scopeId2}>`);
                    _push3(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UBadge, {
                      label: row.original.is_paid ? "Đã hoàn" : "Chưa hoàn",
                      color: row.original.is_paid ? "success" : "warning",
                      variant: "subtle",
                      size: "sm"
                    }, null, _parent3, _scopeId2));
                    if (row.original.is_paid && row.original.paid_at) {
                      _push3(`<p class="text-xs text-slate-400"${_scopeId2}>${serverRenderer_cjs_prodExports.ssrInterpolate(row.original.paid_at)}</p>`);
                    } else {
                      _push3(`<!---->`);
                    }
                    _push3(`</div>`);
                  } else {
                    return [
                      vueExports.createVNode("div", { class: "flex flex-col items-end gap-1" }, [
                        vueExports.createVNode(_component_UBadge, {
                          label: row.original.is_paid ? "Đã hoàn" : "Chưa hoàn",
                          color: row.original.is_paid ? "success" : "warning",
                          variant: "subtle",
                          size: "sm"
                        }, null, 8, ["label", "color"]),
                        row.original.is_paid && row.original.paid_at ? (vueExports.openBlock(), vueExports.createBlock("p", {
                          key: 0,
                          class: "text-xs text-slate-400"
                        }, vueExports.toDisplayString(row.original.paid_at), 1)) : vueExports.createCommentVNode("", true)
                      ])
                    ];
                  }
                }),
                "actions-cell": vueExports.withCtx(({ row }, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    _push3(`<div class="flex items-center gap-1"${_scopeId2}>`);
                    if (!row.original.is_paid) {
                      _push3(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UButton, {
                        icon: "i-lucide-check",
                        label: "Ghi hoàn",
                        size: "xs",
                        variant: "soft",
                        color: "success",
                        onClick: ($event) => openPayModal(row.original)
                      }, null, _parent3, _scopeId2));
                    } else {
                      _push3(`<!---->`);
                    }
                    _push3(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UButton, {
                      icon: "i-lucide-qr-code",
                      size: "xs",
                      variant: "ghost",
                      color: "neutral",
                      disabled: !row.original.advance_payer?.bank_info,
                      title: row.original.advance_payer?.bank_info ? "Xem QR chuyển khoản" : "Chưa có STK",
                      onClick: ($event) => openQrModal(row.original)
                    }, null, _parent3, _scopeId2));
                    _push3(`</div>`);
                  } else {
                    return [
                      vueExports.createVNode("div", { class: "flex items-center gap-1" }, [
                        !row.original.is_paid ? (vueExports.openBlock(), vueExports.createBlock(_component_UButton, {
                          key: 0,
                          icon: "i-lucide-check",
                          label: "Ghi hoàn",
                          size: "xs",
                          variant: "soft",
                          color: "success",
                          onClick: ($event) => openPayModal(row.original)
                        }, null, 8, ["onClick"])) : vueExports.createCommentVNode("", true),
                        vueExports.createVNode(_component_UButton, {
                          icon: "i-lucide-qr-code",
                          size: "xs",
                          variant: "ghost",
                          color: "neutral",
                          disabled: !row.original.advance_payer?.bank_info,
                          title: row.original.advance_payer?.bank_info ? "Xem QR chuyển khoản" : "Chưa có STK",
                          onClick: ($event) => openQrModal(row.original)
                        }, null, 8, ["disabled", "title", "onClick"])
                      ])
                    ];
                  }
                }),
                _: 1
              }, _parent2, _scopeId));
            }
          } else {
            return [
              vueExports.unref(listStatus) === "pending" ? (vueExports.openBlock(), vueExports.createBlock("div", {
                key: 0,
                class: "py-12 flex justify-center"
              }, [
                vueExports.createVNode(_component_UIcon, {
                  name: "i-lucide-loader-2",
                  class: "size-6 animate-spin text-slate-400"
                })
              ])) : vueExports.unref(rows).length === 0 ? (vueExports.openBlock(), vueExports.createBlock("div", {
                key: 1,
                class: "py-12 text-center"
              }, [
                vueExports.createVNode(_component_UIcon, {
                  name: "i-lucide-package-open",
                  class: "size-10 text-slate-300 mx-auto mb-2"
                }),
                vueExports.createVNode("p", { class: "text-sm text-slate-500" }, " Không có dòng nào khớp với bộ lọc. ")
              ])) : (vueExports.openBlock(), vueExports.createBlock(_component_UTable, {
                key: 2,
                data: vueExports.unref(rows),
                columns
              }, {
                "select-header": vueExports.withCtx(() => [
                  vueExports.createVNode(_component_UCheckbox, {
                    "model-value": vueExports.unref(isAllSelected),
                    indeterminate: vueExports.unref(isSomeSelected) && !vueExports.unref(isAllSelected),
                    "aria-label": "Chọn tất cả",
                    "onUpdate:modelValue": toggleSelectAll
                  }, null, 8, ["model-value", "indeterminate"])
                ]),
                "select-cell": vueExports.withCtx(({ row }) => [
                  vueExports.createVNode(_component_UCheckbox, {
                    "model-value": vueExports.unref(selectedIds).has(row.original.order_line_id),
                    disabled: row.original.is_paid,
                    "onUpdate:modelValue": (v) => toggleRow(row.original.order_line_id, v)
                  }, null, 8, ["model-value", "disabled", "onUpdate:modelValue"])
                ]),
                "payer-cell": vueExports.withCtx(({ row }) => [
                  vueExports.createVNode("div", { class: "min-w-0" }, [
                    vueExports.createVNode("p", { class: "text-sm font-medium text-slate-900 truncate" }, vueExports.toDisplayString(row.original.advance_payer?.name ?? "—"), 1),
                    vueExports.createVNode("p", { class: "text-xs text-slate-500" }, vueExports.toDisplayString(row.original.advance_payer?.employee_code ?? ""), 1)
                  ])
                ]),
                "order_line-cell": vueExports.withCtx(({ row }) => [
                  vueExports.createVNode(_component_NuxtLink, {
                    to: `/pmc/orders/${row.original.order_id}`,
                    class: "text-sm text-primary-600 hover:underline font-mono"
                  }, {
                    default: vueExports.withCtx(() => [
                      vueExports.createTextVNode(vueExports.toDisplayString(row.original.order_code), 1)
                    ]),
                    _: 2
                  }, 1032, ["to"]),
                  vueExports.createVNode("p", { class: "text-xs text-slate-500 truncate max-w-sm" }, vueExports.toDisplayString(row.original.line_name), 1)
                ]),
                "amount-cell": vueExports.withCtx(({ row }) => [
                  vueExports.createVNode("div", { class: "text-right" }, [
                    vueExports.createVNode("p", { class: "text-sm font-semibold tabular-nums text-slate-900" }, vueExports.toDisplayString(("formatCurrency" in _ctx ? _ctx.formatCurrency : vueExports.unref(formatCurrency))(row.original.advance_amount)), 1),
                    vueExports.createVNode("p", { class: "text-xs text-slate-400" }, vueExports.toDisplayString(row.original.quantity) + " " + vueExports.toDisplayString(row.original.unit), 1)
                  ])
                ]),
                "status-cell": vueExports.withCtx(({ row }) => [
                  vueExports.createVNode("div", { class: "flex flex-col items-end gap-1" }, [
                    vueExports.createVNode(_component_UBadge, {
                      label: row.original.is_paid ? "Đã hoàn" : "Chưa hoàn",
                      color: row.original.is_paid ? "success" : "warning",
                      variant: "subtle",
                      size: "sm"
                    }, null, 8, ["label", "color"]),
                    row.original.is_paid && row.original.paid_at ? (vueExports.openBlock(), vueExports.createBlock("p", {
                      key: 0,
                      class: "text-xs text-slate-400"
                    }, vueExports.toDisplayString(row.original.paid_at), 1)) : vueExports.createCommentVNode("", true)
                  ])
                ]),
                "actions-cell": vueExports.withCtx(({ row }) => [
                  vueExports.createVNode("div", { class: "flex items-center gap-1" }, [
                    !row.original.is_paid ? (vueExports.openBlock(), vueExports.createBlock(_component_UButton, {
                      key: 0,
                      icon: "i-lucide-check",
                      label: "Ghi hoàn",
                      size: "xs",
                      variant: "soft",
                      color: "success",
                      onClick: ($event) => openPayModal(row.original)
                    }, null, 8, ["onClick"])) : vueExports.createCommentVNode("", true),
                    vueExports.createVNode(_component_UButton, {
                      icon: "i-lucide-qr-code",
                      size: "xs",
                      variant: "ghost",
                      color: "neutral",
                      disabled: !row.original.advance_payer?.bank_info,
                      title: row.original.advance_payer?.bank_info ? "Xem QR chuyển khoản" : "Chưa có STK",
                      onClick: ($event) => openQrModal(row.original)
                    }, null, 8, ["disabled", "title", "onClick"])
                  ])
                ]),
                _: 1
              }, 8, ["data"]))
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_SharedSectionCard, {
        title: `Lịch sử hoàn tiền ứng (${vueExports.unref(history).length})`
      }, {
        default: vueExports.withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            if (vueExports.unref(history).length === 0) {
              _push2(`<div class="py-8 text-center"${_scopeId}>`);
              _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UIcon, {
                name: "i-lucide-file-clock",
                class: "size-8 text-slate-300 mx-auto mb-2"
              }, null, _parent2, _scopeId));
              _push2(`<p class="text-sm text-slate-500"${_scopeId}> Chưa có lịch sử hoàn tiền. </p></div>`);
            } else {
              _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UTable, {
                data: vueExports.unref(history),
                columns: historyColumns
              }, {
                "payer-cell": vueExports.withCtx(({ row }, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    _push3(`<span class="font-medium"${_scopeId2}>${serverRenderer_cjs_prodExports.ssrInterpolate(row.original.account?.name ?? "—")}</span>`);
                  } else {
                    return [
                      vueExports.createVNode("span", { class: "font-medium" }, vueExports.toDisplayString(row.original.account?.name ?? "—"), 1)
                    ];
                  }
                }),
                "order-cell": vueExports.withCtx(({ row }, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    if (row.original.order) {
                      _push3(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_NuxtLink, {
                        to: `/pmc/orders/${row.original.order.id}`,
                        class: "text-primary-600 hover:underline font-mono text-sm"
                      }, {
                        default: vueExports.withCtx((_2, _push4, _parent4, _scopeId3) => {
                          if (_push4) {
                            _push4(`${serverRenderer_cjs_prodExports.ssrInterpolate(row.original.order.code)}`);
                          } else {
                            return [
                              vueExports.createTextVNode(vueExports.toDisplayString(row.original.order.code), 1)
                            ];
                          }
                        }),
                        _: 2
                      }, _parent3, _scopeId2));
                    } else {
                      _push3(`<span class="text-slate-300"${_scopeId2}>—</span>`);
                    }
                  } else {
                    return [
                      row.original.order ? (vueExports.openBlock(), vueExports.createBlock(_component_NuxtLink, {
                        key: 0,
                        to: `/pmc/orders/${row.original.order.id}`,
                        class: "text-primary-600 hover:underline font-mono text-sm"
                      }, {
                        default: vueExports.withCtx(() => [
                          vueExports.createTextVNode(vueExports.toDisplayString(row.original.order.code), 1)
                        ]),
                        _: 2
                      }, 1032, ["to"])) : (vueExports.openBlock(), vueExports.createBlock("span", {
                        key: 1,
                        class: "text-slate-300"
                      }, "—"))
                    ];
                  }
                }),
                "line-cell": vueExports.withCtx(({ row }, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    _push3(`<span class="text-sm"${_scopeId2}>${serverRenderer_cjs_prodExports.ssrInterpolate(row.original.order_line?.name ?? "—")}</span>`);
                  } else {
                    return [
                      vueExports.createVNode("span", { class: "text-sm" }, vueExports.toDisplayString(row.original.order_line?.name ?? "—"), 1)
                    ];
                  }
                }),
                "amount-cell": vueExports.withCtx(({ row }, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    _push3(`<span class="font-medium tabular-nums"${_scopeId2}>${serverRenderer_cjs_prodExports.ssrInterpolate(("formatCurrency" in _ctx ? _ctx.formatCurrency : vueExports.unref(formatCurrency))(row.original.amount))}</span>`);
                  } else {
                    return [
                      vueExports.createVNode("span", { class: "font-medium tabular-nums" }, vueExports.toDisplayString(("formatCurrency" in _ctx ? _ctx.formatCurrency : vueExports.unref(formatCurrency))(row.original.amount)), 1)
                    ];
                  }
                }),
                "paid_at-cell": vueExports.withCtx(({ row }, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    _push3(`${serverRenderer_cjs_prodExports.ssrInterpolate(row.original.paid_at ?? "—")}`);
                  } else {
                    return [
                      vueExports.createTextVNode(vueExports.toDisplayString(row.original.paid_at ?? "—"), 1)
                    ];
                  }
                }),
                _: 1
              }, _parent2, _scopeId));
            }
          } else {
            return [
              vueExports.unref(history).length === 0 ? (vueExports.openBlock(), vueExports.createBlock("div", {
                key: 0,
                class: "py-8 text-center"
              }, [
                vueExports.createVNode(_component_UIcon, {
                  name: "i-lucide-file-clock",
                  class: "size-8 text-slate-300 mx-auto mb-2"
                }),
                vueExports.createVNode("p", { class: "text-sm text-slate-500" }, " Chưa có lịch sử hoàn tiền. ")
              ])) : (vueExports.openBlock(), vueExports.createBlock(_component_UTable, {
                key: 1,
                data: vueExports.unref(history),
                columns: historyColumns
              }, {
                "payer-cell": vueExports.withCtx(({ row }) => [
                  vueExports.createVNode("span", { class: "font-medium" }, vueExports.toDisplayString(row.original.account?.name ?? "—"), 1)
                ]),
                "order-cell": vueExports.withCtx(({ row }) => [
                  row.original.order ? (vueExports.openBlock(), vueExports.createBlock(_component_NuxtLink, {
                    key: 0,
                    to: `/pmc/orders/${row.original.order.id}`,
                    class: "text-primary-600 hover:underline font-mono text-sm"
                  }, {
                    default: vueExports.withCtx(() => [
                      vueExports.createTextVNode(vueExports.toDisplayString(row.original.order.code), 1)
                    ]),
                    _: 2
                  }, 1032, ["to"])) : (vueExports.openBlock(), vueExports.createBlock("span", {
                    key: 1,
                    class: "text-slate-300"
                  }, "—"))
                ]),
                "line-cell": vueExports.withCtx(({ row }) => [
                  vueExports.createVNode("span", { class: "text-sm" }, vueExports.toDisplayString(row.original.order_line?.name ?? "—"), 1)
                ]),
                "amount-cell": vueExports.withCtx(({ row }) => [
                  vueExports.createVNode("span", { class: "font-medium tabular-nums" }, vueExports.toDisplayString(("formatCurrency" in _ctx ? _ctx.formatCurrency : vueExports.unref(formatCurrency))(row.original.amount)), 1)
                ]),
                "paid_at-cell": vueExports.withCtx(({ row }) => [
                  vueExports.createTextVNode(vueExports.toDisplayString(row.original.paid_at ?? "—"), 1)
                ]),
                _: 1
              }, 8, ["data"]))
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</div>`);
      _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UModal, {
        open: vueExports.unref(payModalOpen),
        "onUpdate:open": ($event) => vueExports.isRef(payModalOpen) ? payModalOpen.value = $event : null,
        title: "Ghi nhận hoàn tiền ứng"
      }, vueExports.createSlots({
        footer: vueExports.withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="flex justify-end gap-2 w-full"${_scopeId}>`);
            _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UButton, {
              label: "Hủy",
              color: "neutral",
              variant: "ghost",
              onClick: ($event) => payModalOpen.value = false
            }, null, _parent2, _scopeId));
            _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UButton, {
              label: "Xác nhận hoàn",
              icon: "i-lucide-check",
              color: "primary",
              loading: vueExports.unref(isPaying),
              onClick: submitSinglePay
            }, null, _parent2, _scopeId));
            _push2(`</div>`);
          } else {
            return [
              vueExports.createVNode("div", { class: "flex justify-end gap-2 w-full" }, [
                vueExports.createVNode(_component_UButton, {
                  label: "Hủy",
                  color: "neutral",
                  variant: "ghost",
                  onClick: ($event) => payModalOpen.value = false
                }, null, 8, ["onClick"]),
                vueExports.createVNode(_component_UButton, {
                  label: "Xác nhận hoàn",
                  icon: "i-lucide-check",
                  color: "primary",
                  loading: vueExports.unref(isPaying),
                  onClick: submitSinglePay
                }, null, 8, ["loading"])
              ])
            ];
          }
        }),
        _: 2
      }, [
        vueExports.unref(payTarget) ? {
          name: "body",
          fn: vueExports.withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`<div class="flex flex-col gap-4"${_scopeId}><div class="rounded-lg bg-slate-50 px-4 py-3 text-sm space-y-1.5"${_scopeId}><div class="flex justify-between"${_scopeId}><span class="text-slate-500"${_scopeId}>Nhân sự</span><span class="font-medium"${_scopeId}>${serverRenderer_cjs_prodExports.ssrInterpolate(vueExports.unref(payTarget).advance_payer?.name)}</span></div><div class="flex justify-between"${_scopeId}><span class="text-slate-500"${_scopeId}>Đơn hàng</span><span class="font-mono"${_scopeId}>${serverRenderer_cjs_prodExports.ssrInterpolate(vueExports.unref(payTarget).order_code)}</span></div><div class="flex justify-between"${_scopeId}><span class="text-slate-500"${_scopeId}>Hạng mục</span><span class="max-w-[60%] text-right"${_scopeId}>${serverRenderer_cjs_prodExports.ssrInterpolate(vueExports.unref(payTarget).line_name)}</span></div><div class="flex justify-between border-t pt-1.5 mt-1"${_scopeId}><span class="text-slate-500"${_scopeId}>Số tiền hoàn</span><span class="font-bold text-amber-600 tabular-nums"${_scopeId}>${serverRenderer_cjs_prodExports.ssrInterpolate(("formatCurrency" in _ctx ? _ctx.formatCurrency : vueExports.unref(formatCurrency))(vueExports.unref(payTarget).advance_amount))}</span></div></div>`);
              _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UFormField, { label: "Ghi chú" }, {
                default: vueExports.withCtx((_2, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    _push3(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UTextarea, {
                      modelValue: vueExports.unref(payNote),
                      "onUpdate:modelValue": ($event) => vueExports.isRef(payNote) ? payNote.value = $event : null,
                      rows: 2,
                      class: "w-full"
                    }, null, _parent3, _scopeId2));
                  } else {
                    return [
                      vueExports.createVNode(_component_UTextarea, {
                        modelValue: vueExports.unref(payNote),
                        "onUpdate:modelValue": ($event) => vueExports.isRef(payNote) ? payNote.value = $event : null,
                        rows: 2,
                        class: "w-full"
                      }, null, 8, ["modelValue", "onUpdate:modelValue"])
                    ];
                  }
                }),
                _: 1
              }, _parent2, _scopeId));
              _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UFormField, { label: "Ngày hoàn" }, {
                default: vueExports.withCtx((_2, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    _push3(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UInput, {
                      modelValue: vueExports.unref(payPaidAt),
                      "onUpdate:modelValue": ($event) => vueExports.isRef(payPaidAt) ? payPaidAt.value = $event : null,
                      type: "date"
                    }, null, _parent3, _scopeId2));
                  } else {
                    return [
                      vueExports.createVNode(_component_UInput, {
                        modelValue: vueExports.unref(payPaidAt),
                        "onUpdate:modelValue": ($event) => vueExports.isRef(payPaidAt) ? payPaidAt.value = $event : null,
                        type: "date"
                      }, null, 8, ["modelValue", "onUpdate:modelValue"])
                    ];
                  }
                }),
                _: 1
              }, _parent2, _scopeId));
              _push2(`</div>`);
            } else {
              return [
                vueExports.createVNode("div", { class: "flex flex-col gap-4" }, [
                  vueExports.createVNode("div", { class: "rounded-lg bg-slate-50 px-4 py-3 text-sm space-y-1.5" }, [
                    vueExports.createVNode("div", { class: "flex justify-between" }, [
                      vueExports.createVNode("span", { class: "text-slate-500" }, "Nhân sự"),
                      vueExports.createVNode("span", { class: "font-medium" }, vueExports.toDisplayString(vueExports.unref(payTarget).advance_payer?.name), 1)
                    ]),
                    vueExports.createVNode("div", { class: "flex justify-between" }, [
                      vueExports.createVNode("span", { class: "text-slate-500" }, "Đơn hàng"),
                      vueExports.createVNode("span", { class: "font-mono" }, vueExports.toDisplayString(vueExports.unref(payTarget).order_code), 1)
                    ]),
                    vueExports.createVNode("div", { class: "flex justify-between" }, [
                      vueExports.createVNode("span", { class: "text-slate-500" }, "Hạng mục"),
                      vueExports.createVNode("span", { class: "max-w-[60%] text-right" }, vueExports.toDisplayString(vueExports.unref(payTarget).line_name), 1)
                    ]),
                    vueExports.createVNode("div", { class: "flex justify-between border-t pt-1.5 mt-1" }, [
                      vueExports.createVNode("span", { class: "text-slate-500" }, "Số tiền hoàn"),
                      vueExports.createVNode("span", { class: "font-bold text-amber-600 tabular-nums" }, vueExports.toDisplayString(("formatCurrency" in _ctx ? _ctx.formatCurrency : vueExports.unref(formatCurrency))(vueExports.unref(payTarget).advance_amount)), 1)
                    ])
                  ]),
                  vueExports.createVNode(_component_UFormField, { label: "Ghi chú" }, {
                    default: vueExports.withCtx(() => [
                      vueExports.createVNode(_component_UTextarea, {
                        modelValue: vueExports.unref(payNote),
                        "onUpdate:modelValue": ($event) => vueExports.isRef(payNote) ? payNote.value = $event : null,
                        rows: 2,
                        class: "w-full"
                      }, null, 8, ["modelValue", "onUpdate:modelValue"])
                    ]),
                    _: 1
                  }),
                  vueExports.createVNode(_component_UFormField, { label: "Ngày hoàn" }, {
                    default: vueExports.withCtx(() => [
                      vueExports.createVNode(_component_UInput, {
                        modelValue: vueExports.unref(payPaidAt),
                        "onUpdate:modelValue": ($event) => vueExports.isRef(payPaidAt) ? payPaidAt.value = $event : null,
                        type: "date"
                      }, null, 8, ["modelValue", "onUpdate:modelValue"])
                    ]),
                    _: 1
                  })
                ])
              ];
            }
          }),
          key: "0"
        } : void 0
      ]), _parent));
      _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UModal, {
        open: vueExports.unref(batchModalOpen),
        "onUpdate:open": ($event) => vueExports.isRef(batchModalOpen) ? batchModalOpen.value = $event : null,
        title: "Hoàn tiền ứng gộp"
      }, {
        body: vueExports.withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="flex flex-col gap-4"${_scopeId}><div class="rounded-lg bg-slate-50 px-4 py-3 text-sm max-h-64 overflow-auto"${_scopeId}><p class="font-medium mb-2 text-slate-700"${_scopeId}> Các dòng sẽ hoàn (${serverRenderer_cjs_prodExports.ssrInterpolate(vueExports.unref(batchTargets).length)}) </p><ul class="space-y-1 text-xs"${_scopeId}><!--[-->`);
            serverRenderer_cjs_prodExports.ssrRenderList(vueExports.unref(batchTargets), (t) => {
              _push2(`<li class="flex justify-between gap-3"${_scopeId}><span class="truncate"${_scopeId}>${serverRenderer_cjs_prodExports.ssrInterpolate(t.advance_payer?.name)} — ${serverRenderer_cjs_prodExports.ssrInterpolate(t.order_code)} — ${serverRenderer_cjs_prodExports.ssrInterpolate(t.line_name)}</span><span class="tabular-nums font-medium shrink-0"${_scopeId}>${serverRenderer_cjs_prodExports.ssrInterpolate(("formatCurrency" in _ctx ? _ctx.formatCurrency : vueExports.unref(formatCurrency))(t.advance_amount))}</span></li>`);
            });
            _push2(`<!--]--></ul><div class="mt-2 pt-2 border-t border-slate-200 flex justify-between font-bold"${_scopeId}><span${_scopeId}>Tổng</span><span class="tabular-nums text-amber-600"${_scopeId}>${serverRenderer_cjs_prodExports.ssrInterpolate(("formatCurrency" in _ctx ? _ctx.formatCurrency : vueExports.unref(formatCurrency))(vueExports.unref(batchTotal)))}</span></div></div>`);
            _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UFormField, { label: "Ghi chú chung" }, {
              default: vueExports.withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UTextarea, {
                    modelValue: vueExports.unref(batchNote),
                    "onUpdate:modelValue": ($event) => vueExports.isRef(batchNote) ? batchNote.value = $event : null,
                    rows: 2,
                    class: "w-full"
                  }, null, _parent3, _scopeId2));
                } else {
                  return [
                    vueExports.createVNode(_component_UTextarea, {
                      modelValue: vueExports.unref(batchNote),
                      "onUpdate:modelValue": ($event) => vueExports.isRef(batchNote) ? batchNote.value = $event : null,
                      rows: 2,
                      class: "w-full"
                    }, null, 8, ["modelValue", "onUpdate:modelValue"])
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UFormField, { label: "Ngày hoàn" }, {
              default: vueExports.withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UInput, {
                    modelValue: vueExports.unref(batchPaidAt),
                    "onUpdate:modelValue": ($event) => vueExports.isRef(batchPaidAt) ? batchPaidAt.value = $event : null,
                    type: "date"
                  }, null, _parent3, _scopeId2));
                } else {
                  return [
                    vueExports.createVNode(_component_UInput, {
                      modelValue: vueExports.unref(batchPaidAt),
                      "onUpdate:modelValue": ($event) => vueExports.isRef(batchPaidAt) ? batchPaidAt.value = $event : null,
                      type: "date"
                    }, null, 8, ["modelValue", "onUpdate:modelValue"])
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(`</div>`);
          } else {
            return [
              vueExports.createVNode("div", { class: "flex flex-col gap-4" }, [
                vueExports.createVNode("div", { class: "rounded-lg bg-slate-50 px-4 py-3 text-sm max-h-64 overflow-auto" }, [
                  vueExports.createVNode("p", { class: "font-medium mb-2 text-slate-700" }, " Các dòng sẽ hoàn (" + vueExports.toDisplayString(vueExports.unref(batchTargets).length) + ") ", 1),
                  vueExports.createVNode("ul", { class: "space-y-1 text-xs" }, [
                    (vueExports.openBlock(true), vueExports.createBlock(vueExports.Fragment, null, vueExports.renderList(vueExports.unref(batchTargets), (t) => {
                      return vueExports.openBlock(), vueExports.createBlock("li", {
                        key: t.order_line_id,
                        class: "flex justify-between gap-3"
                      }, [
                        vueExports.createVNode("span", { class: "truncate" }, vueExports.toDisplayString(t.advance_payer?.name) + " — " + vueExports.toDisplayString(t.order_code) + " — " + vueExports.toDisplayString(t.line_name), 1),
                        vueExports.createVNode("span", { class: "tabular-nums font-medium shrink-0" }, vueExports.toDisplayString(("formatCurrency" in _ctx ? _ctx.formatCurrency : vueExports.unref(formatCurrency))(t.advance_amount)), 1)
                      ]);
                    }), 128))
                  ]),
                  vueExports.createVNode("div", { class: "mt-2 pt-2 border-t border-slate-200 flex justify-between font-bold" }, [
                    vueExports.createVNode("span", null, "Tổng"),
                    vueExports.createVNode("span", { class: "tabular-nums text-amber-600" }, vueExports.toDisplayString(("formatCurrency" in _ctx ? _ctx.formatCurrency : vueExports.unref(formatCurrency))(vueExports.unref(batchTotal))), 1)
                  ])
                ]),
                vueExports.createVNode(_component_UFormField, { label: "Ghi chú chung" }, {
                  default: vueExports.withCtx(() => [
                    vueExports.createVNode(_component_UTextarea, {
                      modelValue: vueExports.unref(batchNote),
                      "onUpdate:modelValue": ($event) => vueExports.isRef(batchNote) ? batchNote.value = $event : null,
                      rows: 2,
                      class: "w-full"
                    }, null, 8, ["modelValue", "onUpdate:modelValue"])
                  ]),
                  _: 1
                }),
                vueExports.createVNode(_component_UFormField, { label: "Ngày hoàn" }, {
                  default: vueExports.withCtx(() => [
                    vueExports.createVNode(_component_UInput, {
                      modelValue: vueExports.unref(batchPaidAt),
                      "onUpdate:modelValue": ($event) => vueExports.isRef(batchPaidAt) ? batchPaidAt.value = $event : null,
                      type: "date"
                    }, null, 8, ["modelValue", "onUpdate:modelValue"])
                  ]),
                  _: 1
                })
              ])
            ];
          }
        }),
        footer: vueExports.withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="flex justify-end gap-2 w-full"${_scopeId}>`);
            _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UButton, {
              label: "Hủy",
              color: "neutral",
              variant: "ghost",
              onClick: ($event) => batchModalOpen.value = false
            }, null, _parent2, _scopeId));
            _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UButton, {
              label: `Hoàn ${vueExports.unref(batchTargets).length} mục`,
              icon: "i-lucide-check",
              color: "primary",
              loading: vueExports.unref(isPaying),
              onClick: submitBatchPay
            }, null, _parent2, _scopeId));
            _push2(`</div>`);
          } else {
            return [
              vueExports.createVNode("div", { class: "flex justify-end gap-2 w-full" }, [
                vueExports.createVNode(_component_UButton, {
                  label: "Hủy",
                  color: "neutral",
                  variant: "ghost",
                  onClick: ($event) => batchModalOpen.value = false
                }, null, 8, ["onClick"]),
                vueExports.createVNode(_component_UButton, {
                  label: `Hoàn ${vueExports.unref(batchTargets).length} mục`,
                  icon: "i-lucide-check",
                  color: "primary",
                  loading: vueExports.unref(isPaying),
                  onClick: submitBatchPay
                }, null, 8, ["label", "loading"])
              ])
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_SharedBankQrModal, {
        open: vueExports.unref(qrModalOpen),
        "onUpdate:open": ($event) => vueExports.isRef(qrModalOpen) ? qrModalOpen.value = $event : null,
        bank: vueExports.unref(qrBank),
        amount: vueExports.unref(qrAmount),
        description: vueExports.unref(qrDescription),
        "recipient-name": vueExports.unref(qrRecipientName),
        title: "QR hoàn tiền ứng"
      }, null, _parent));
      _push(`</div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = vueExports.useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/pmc/finance/advance-payments/index.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=index-CnUcFy28.mjs.map
