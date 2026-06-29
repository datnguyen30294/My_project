import { _ as __nuxt_component_0 } from './PageHeader-BJhealxW.mjs';
import { x as _export_sfc, v as vueExports, u as useSeoMeta, p as useRoute$1, j as useToast, s as serverRenderer_cjs_prodExports, l as _sfc_main$c, _ as __nuxt_component_0$4 } from './server.mjs';
import { _ as _sfc_main$1 } from './Card-ywPiICev.mjs';
import { _ as _sfc_main$2 } from './Input-JXN8po_F.mjs';
import { _ as _sfc_main$3 } from './Select-CZE7Ef6n.mjs';
import { _ as __nuxt_component_3 } from './ProjectSelect-BTBiFCd5.mjs';
import { _ as __nuxt_component_2 } from './TableWrapper-VwUckvcF.mjs';
import { _ as _sfc_main$4 } from './Table-17SH0cIR.mjs';
import { _ as _sfc_main$6 } from './Checkbox-Cp_FPUkd.mjs';
import { _ as _sfc_main$5 } from './Badge-W93D3Jpz.mjs';
import { _ as __nuxt_component_10 } from './TablePagination-CZYWB-qm.mjs';
import { _ as _sfc_main$7 } from './Modal-BimZZbNl.mjs';
import { _ as _sfc_main$8 } from './FormField-DFdmv6Lu.mjs';
import { f as formatCurrency } from './currency-DEb2TrW3.mjs';
import { u as useReconciliationList, a as useReconciliationSummary, R as RECONCILIATION_STATUS_OPTIONS, b as RECONCILIATION_SOURCE_OPTIONS, P as PAYMENT_TYPE_FILTER_OPTIONS, r as reconciliationStatusColor, c as reconciliationSourceColor, d as apiReconcile, e as apiBatchReconcile } from './useReconciliations-BSqve17o.mjs';
import { r as receivableStatusColor, p as paymentReceiptTypeColor } from './useReceivables-eUxCdlsS.mjs';
import { f as formatDateTime, a as formatDate } from './date-R5YK0ast.mjs';
import { Z as Zl } from './vue-datepicker-6F5-CyxW.mjs';
import { D as DEFAULT_PER_PAGE } from './constants-G9YmtWtp.mjs';
import { u as useTableSearch } from './useTableSearch-BhG9s2Ie.mjs';
import { u as useUrlFilters } from './useUrlFilters-D9dcjQcy.mjs';
import { s as stickyRight } from './table-z_7x7CvB.mjs';
import { g as getApiErrorMessage } from './apiError-DBrxF9au.mjs';
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
import './index-QmZAbLx-.mjs';
import './useDirection-CXYby7CP.mjs';
import './useFormControl-_Lqv8ipK.mjs';
import './PopperArrow-C9hHWuSZ.mjs';
import './FocusScope-BZehoQSg.mjs';
import './useFocusGuards-CJykkUFH.mjs';
import './utils-DY0Zag2O.mjs';
import './handleAndDispatchCustomEvent-Bk_AVSSo.mjs';
import './SelectMenu-DKHEMZj7.mjs';
import './useKbd-JjFOu4f7.mjs';
import './utils-BgcT7rQQ.mjs';
import './VisuallyHiddenInput-q6Pz-w0i.mjs';
import './index-CSThDD3J.mjs';
import './useEntitySelect-DG9pQ_n0.mjs';
import './useProjects-D4K3VYdb.mjs';
import './PageError-kZWsA9dh.mjs';
import './RovingFocusItem-DwKRAYZk.mjs';
import './RovingFocusGroup-Vsbo7D6E.mjs';
import './Label-BBgw4vHh.mjs';
import './Pagination-fZq_Msxb.mjs';
import './DialogTrigger-C3iwCYMu.mjs';
import './DialogClose-DGkUxau7.mjs';

const _sfc_main = /* @__PURE__ */ vueExports.defineComponent({
  __name: "index",
  __ssrInlineRender: true,
  setup(__props) {
    useSeoMeta({ title: "Đối soát tài chính - Thần Nông" });
    const params = vueExports.reactive({
      per_page: DEFAULT_PER_PAGE
    });
    const page = vueExports.ref(1);
    const { searchInput, onSearch } = useTableSearch((value) => {
      params.search = value || void 0;
      page.value = 1;
    });
    const selectedStatus = vueExports.ref(void 0);
    const selectedSource = vueExports.ref(void 0);
    const selectedProjectId = vueExports.ref(void 0);
    const selectedType = vueExports.ref(void 0);
    const dateRange = vueExports.ref(null);
    const dateFromRef = vueExports.ref("");
    const dateToRef = vueExports.ref("");
    const route = useRoute$1();
    if (route.query.receivable_id) {
      params.receivable_id = Number(route.query.receivable_id);
    }
    const { isInitFromUrl } = useUrlFilters({
      search: { ref: vueExports.toRef(params, "search"), type: "string", onInit: (v) => {
        searchInput.value = String(v);
      } },
      page: { ref: page, type: "number", defaultValue: 1 },
      status: { ref: selectedStatus, type: "string" },
      source: { ref: selectedSource, type: "string" },
      project_id: { ref: selectedProjectId, type: "number" },
      type: { ref: selectedType, type: "string" },
      date_from: { ref: dateFromRef, type: "string", onInit: (v) => {
        params.date_from = String(v);
      } },
      date_to: { ref: dateToRef, type: "string", onInit: (v) => {
        params.date_to = String(v);
      } }
    });
    if (dateFromRef.value && dateToRef.value) {
      dateRange.value = [dateFromRef.value, dateToRef.value];
    }
    vueExports.watch(selectedStatus, (val) => {
      params.status = val || void 0;
      if (!isInitFromUrl.value) page.value = 1;
    });
    vueExports.watch(selectedSource, (val) => {
      params.source = val || void 0;
      if (!isInitFromUrl.value) page.value = 1;
    });
    vueExports.watch(selectedProjectId, (val) => {
      params.project_id = val || void 0;
      if (!isInitFromUrl.value) page.value = 1;
    });
    vueExports.watch(selectedType, (val) => {
      params.type = val || void 0;
      if (!isInitFromUrl.value) page.value = 1;
    });
    vueExports.watch(dateRange, (val) => {
      if (val && val[0] && val[1]) {
        params.date_from = val[0];
        params.date_to = val[1];
        dateFromRef.value = val[0];
        dateToRef.value = val[1];
      } else {
        params.date_from = void 0;
        params.date_to = void 0;
        dateFromRef.value = "";
        dateToRef.value = "";
      }
      if (!isInitFromUrl.value) page.value = 1;
    });
    const hasFilters = vueExports.computed(
      () => !!searchInput.value || !!selectedStatus.value || !!selectedSource.value || selectedProjectId.value != null || !!selectedType.value || !!dateRange.value
    );
    function clearFilters() {
      searchInput.value = "";
      params.search = void 0;
      selectedStatus.value = void 0;
      selectedSource.value = void 0;
      selectedProjectId.value = void 0;
      selectedType.value = void 0;
      dateRange.value = null;
      params.date_from = void 0;
      params.date_to = void 0;
      params.source = void 0;
      params.receivable_id = void 0;
      page.value = 1;
    }
    function formatDateRange(dates) {
      if (!dates || dates.length < 2) return "";
      const fmt = (d) => `${String(d.getDate()).padStart(2, "0")}/${String(d.getMonth() + 1).padStart(2, "0")}/${d.getFullYear()}`;
      return `${fmt(dates[0])} - ${fmt(dates[1])}`;
    }
    const { data, status, error, refresh } = useReconciliationList(
      vueExports.computed(() => ({ ...params, page: page.value }))
    );
    const items = vueExports.computed(() => data.value?.data ?? []);
    const { data: summaryData } = useReconciliationSummary(
      vueExports.computed(() => ({ ...params }))
    );
    const summary = vueExports.computed(() => summaryData.value?.data);
    const totalAmount = vueExports.computed(() => {
      if (!summary.value) return "";
      return formatCurrency(String(parseFloat(summary.value.pending_amount) + parseFloat(summary.value.reconciled_amount)));
    });
    const columns = [
      { id: "select", header: "" },
      { id: "source_label", header: "Nguồn" },
      { id: "order_info", header: "Đơn hàng / Giao dịch" },
      { id: "project", header: "Dự án" },
      { id: "type", header: "Loại" },
      { id: "receipt_amount", header: "Số tiền GD" },
      { id: "receivable_amount", header: "Phải thu" },
      { id: "receivable_paid", header: "Đã thu" },
      { id: "receivable_status", header: "TT công nợ" },
      { id: "paid_at", header: "Ngày GD" },
      { id: "status", header: "TT đối soát" },
      { id: "reconciled_info", header: "Đối soát" },
      { id: "cash_transaction", header: "Giao dịch quỹ" },
      stickyRight({ id: "actions", header: "" })
    ];
    const selectedIds = vueExports.ref(/* @__PURE__ */ new Set());
    const toast = useToast();
    function toggleSelection(id) {
      if (selectedIds.value.has(id)) {
        selectedIds.value.delete(id);
      } else {
        selectedIds.value.add(id);
      }
      selectedIds.value = new Set(selectedIds.value);
    }
    function toggleSelectAll() {
      const pendingItems = items.value.filter((i) => i.status.value === "pending");
      if (pendingItems.every((i) => selectedIds.value.has(i.id))) {
        pendingItems.forEach((i) => selectedIds.value.delete(i.id));
      } else {
        pendingItems.forEach((i) => selectedIds.value.add(i.id));
      }
      selectedIds.value = new Set(selectedIds.value);
    }
    const isAllSelected = vueExports.computed(() => {
      const pendingItems = items.value.filter((i) => i.status.value === "pending");
      return pendingItems.length > 0 && pendingItems.every((i) => selectedIds.value.has(i.id));
    });
    const showBatchConfirm = vueExports.ref(false);
    const isBatchReconciling = vueExports.ref(false);
    const batchNote = vueExports.ref("");
    async function submitBatchReconcile() {
      isBatchReconciling.value = true;
      try {
        const result = await apiBatchReconcile({
          ids: [...selectedIds.value],
          note: batchNote.value || void 0
        });
        toast.add({ title: `Đã đối soát ${result.data.reconciled_count} dòng tiền`, color: "success" });
        showBatchConfirm.value = false;
        selectedIds.value = /* @__PURE__ */ new Set();
        batchNote.value = "";
        await refresh();
      } catch (err) {
        toast.add({ title: getApiErrorMessage(err, "Đối soát hàng loạt thất bại"), color: "error" });
      } finally {
        isBatchReconciling.value = false;
      }
    }
    async function quickReconcile(item) {
      try {
        await apiReconcile(item.id, {});
        toast.add({ title: "Đã xác nhận đối soát", color: "success" });
        await refresh();
      } catch (err) {
        toast.add({ title: getApiErrorMessage(err, "Đối soát thất bại"), color: "error" });
      }
    }
    return (_ctx, _push, _parent, _attrs) => {
      const _component_SharedCrudPageHeader = __nuxt_component_0;
      const _component_UButton = _sfc_main$c;
      const _component_UCard = _sfc_main$1;
      const _component_UInput = _sfc_main$2;
      const _component_USelect = _sfc_main$3;
      const _component_SharedProjectSelect = __nuxt_component_3;
      const _component_SharedCrudTableWrapper = __nuxt_component_2;
      const _component_UTable = _sfc_main$4;
      const _component_UCheckbox = _sfc_main$6;
      const _component_UBadge = _sfc_main$5;
      const _component_NuxtLink = __nuxt_component_0$4;
      const _component_SharedCrudTablePagination = __nuxt_component_10;
      const _component_UModal = _sfc_main$7;
      const _component_UFormField = _sfc_main$8;
      _push(`<div${serverRenderer_cjs_prodExports.ssrRenderAttrs(_attrs)} data-v-8f191cd1>`);
      _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_SharedCrudPageHeader, {
        title: "Đối soát tài chính",
        description: "Quản lý đối soát các dòng tiền thu/trả"
      }, {
        actions: vueExports.withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            if (vueExports.unref(selectedIds).size > 0) {
              _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UButton, {
                label: `Đối soát đã chọn (${vueExports.unref(selectedIds).size})`,
                color: "primary",
                icon: "i-lucide-check-check",
                onClick: ($event) => showBatchConfirm.value = true
              }, null, _parent2, _scopeId));
            } else {
              _push2(`<!---->`);
            }
          } else {
            return [
              vueExports.unref(selectedIds).size > 0 ? (vueExports.openBlock(), vueExports.createBlock(_component_UButton, {
                key: 0,
                label: `Đối soát đã chọn (${vueExports.unref(selectedIds).size})`,
                color: "primary",
                icon: "i-lucide-check-check",
                onClick: ($event) => showBatchConfirm.value = true
              }, null, 8, ["label", "onClick"])) : vueExports.createCommentVNode("", true)
            ];
          }
        }),
        _: 1
      }, _parent));
      if (vueExports.unref(summary)) {
        _push(`<div class="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 mb-4 sm:mb-6" data-v-8f191cd1>`);
        _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UCard, null, {
          default: vueExports.withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`<div class="text-xs text-slate-500 mb-1" data-v-8f191cd1${_scopeId}> Tổng dòng tiền </div><div class="text-lg font-bold text-slate-900" data-v-8f191cd1${_scopeId}>${serverRenderer_cjs_prodExports.ssrInterpolate(vueExports.unref(totalAmount))}</div><div class="text-xs text-slate-400" data-v-8f191cd1${_scopeId}>${serverRenderer_cjs_prodExports.ssrInterpolate(vueExports.unref(summary).total_count)} dòng </div>`);
            } else {
              return [
                vueExports.createVNode("div", { class: "text-xs text-slate-500 mb-1" }, " Tổng dòng tiền "),
                vueExports.createVNode("div", { class: "text-lg font-bold text-slate-900" }, vueExports.toDisplayString(vueExports.unref(totalAmount)), 1),
                vueExports.createVNode("div", { class: "text-xs text-slate-400" }, vueExports.toDisplayString(vueExports.unref(summary).total_count) + " dòng ", 1)
              ];
            }
          }),
          _: 1
        }, _parent));
        if (vueExports.unref(summary)) {
          _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UCard, null, {
            default: vueExports.withCtx((_, _push2, _parent2, _scopeId) => {
              if (_push2) {
                _push2(`<div class="text-xs text-slate-500 mb-1" data-v-8f191cd1${_scopeId}> Chờ đối soát </div><div class="text-lg font-bold text-[var(--ui-warning)]" data-v-8f191cd1${_scopeId}>${serverRenderer_cjs_prodExports.ssrInterpolate(vueExports.unref(summary).pending_count)}</div><div class="text-xs text-slate-400" data-v-8f191cd1${_scopeId}>${serverRenderer_cjs_prodExports.ssrInterpolate(("formatCurrency" in _ctx ? _ctx.formatCurrency : vueExports.unref(formatCurrency))(vueExports.unref(summary).pending_amount))}</div>`);
              } else {
                return [
                  vueExports.createVNode("div", { class: "text-xs text-slate-500 mb-1" }, " Chờ đối soát "),
                  vueExports.createVNode("div", { class: "text-lg font-bold text-[var(--ui-warning)]" }, vueExports.toDisplayString(vueExports.unref(summary).pending_count), 1),
                  vueExports.createVNode("div", { class: "text-xs text-slate-400" }, vueExports.toDisplayString(("formatCurrency" in _ctx ? _ctx.formatCurrency : vueExports.unref(formatCurrency))(vueExports.unref(summary).pending_amount)), 1)
                ];
              }
            }),
            _: 1
          }, _parent));
        } else {
          _push(`<!---->`);
        }
        if (vueExports.unref(summary)) {
          _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UCard, null, {
            default: vueExports.withCtx((_, _push2, _parent2, _scopeId) => {
              if (_push2) {
                _push2(`<div class="text-xs text-slate-500 mb-1" data-v-8f191cd1${_scopeId}> Đã đối soát </div><div class="text-lg font-bold text-[var(--ui-success)]" data-v-8f191cd1${_scopeId}>${serverRenderer_cjs_prodExports.ssrInterpolate(vueExports.unref(summary).reconciled_count)}</div><div class="text-xs text-slate-400" data-v-8f191cd1${_scopeId}>${serverRenderer_cjs_prodExports.ssrInterpolate(("formatCurrency" in _ctx ? _ctx.formatCurrency : vueExports.unref(formatCurrency))(vueExports.unref(summary).reconciled_amount))}</div>`);
              } else {
                return [
                  vueExports.createVNode("div", { class: "text-xs text-slate-500 mb-1" }, " Đã đối soát "),
                  vueExports.createVNode("div", { class: "text-lg font-bold text-[var(--ui-success)]" }, vueExports.toDisplayString(vueExports.unref(summary).reconciled_count), 1),
                  vueExports.createVNode("div", { class: "text-xs text-slate-400" }, vueExports.toDisplayString(("formatCurrency" in _ctx ? _ctx.formatCurrency : vueExports.unref(formatCurrency))(vueExports.unref(summary).reconciled_amount)), 1)
                ];
              }
            }),
            _: 1
          }, _parent));
        } else {
          _push(`<!---->`);
        }
        _push(`</div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`<div class="mb-4 flex flex-wrap items-center gap-3" data-v-8f191cd1>`);
      _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UInput, {
        modelValue: vueExports.unref(searchInput),
        "onUpdate:modelValue": [($event) => vueExports.isRef(searchInput) ? searchInput.value = $event : null, vueExports.unref(onSearch)],
        icon: "i-lucide-search",
        placeholder: "Tìm theo mã đơn, khách hàng...",
        class: "max-w-sm"
      }, null, _parent));
      _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_USelect, {
        modelValue: vueExports.unref(selectedStatus),
        "onUpdate:modelValue": ($event) => vueExports.isRef(selectedStatus) ? selectedStatus.value = $event : null,
        items: "RECONCILIATION_STATUS_OPTIONS" in _ctx ? _ctx.RECONCILIATION_STATUS_OPTIONS : vueExports.unref(RECONCILIATION_STATUS_OPTIONS),
        placeholder: "Trạng thái",
        class: "w-44"
      }, null, _parent));
      _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_USelect, {
        modelValue: vueExports.unref(selectedSource),
        "onUpdate:modelValue": ($event) => vueExports.isRef(selectedSource) ? selectedSource.value = $event : null,
        items: "RECONCILIATION_SOURCE_OPTIONS" in _ctx ? _ctx.RECONCILIATION_SOURCE_OPTIONS : vueExports.unref(RECONCILIATION_SOURCE_OPTIONS),
        placeholder: "Nguồn",
        class: "w-44"
      }, null, _parent));
      _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_USelect, {
        modelValue: vueExports.unref(selectedType),
        "onUpdate:modelValue": ($event) => vueExports.isRef(selectedType) ? selectedType.value = $event : null,
        items: "PAYMENT_TYPE_FILTER_OPTIONS" in _ctx ? _ctx.PAYMENT_TYPE_FILTER_OPTIONS : vueExports.unref(PAYMENT_TYPE_FILTER_OPTIONS),
        placeholder: "Loại",
        class: "w-36"
      }, null, _parent));
      _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_SharedProjectSelect, {
        modelValue: vueExports.unref(selectedProjectId),
        "onUpdate:modelValue": ($event) => vueExports.isRef(selectedProjectId) ? selectedProjectId.value = $event : null,
        placeholder: "Dự án",
        class: "w-48"
      }, null, _parent));
      _push(`<div class="w-64 dp-nuxt-ui" data-v-8f191cd1>`);
      _push(serverRenderer_cjs_prodExports.ssrRenderComponent(vueExports.unref(Zl), {
        modelValue: vueExports.unref(dateRange),
        "onUpdate:modelValue": ($event) => vueExports.isRef(dateRange) ? dateRange.value = $event : null,
        range: "",
        "partial-range": false,
        "time-config": { enableTimePicker: false },
        "model-type": "yyyy-MM-dd",
        format: formatDateRange,
        placeholder: "Ngày đối soát",
        "auto-apply": ""
      }, null, _parent));
      _push(`</div>`);
      if (vueExports.unref(hasFilters)) {
        _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UButton, {
          icon: "i-lucide-x",
          label: "Xóa bộ lọc",
          color: "neutral",
          variant: "ghost",
          size: "sm",
          onClick: clearFilters
        }, null, _parent));
      } else {
        _push(`<!---->`);
      }
      _push(`</div>`);
      _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_SharedCrudTableWrapper, {
        status: vueExports.unref(status),
        error: vueExports.unref(error),
        data: vueExports.unref(data),
        refresh: vueExports.unref(refresh)
      }, {
        default: vueExports.withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="bg-white border border-border-gray rounded-xl overflow-hidden shadow-sm" data-v-8f191cd1${_scopeId}>`);
            _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UTable, {
              data: vueExports.unref(items),
              columns
            }, {
              "select-cell": vueExports.withCtx(({ row }, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  if (row.original.status.value === "pending") {
                    _push3(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UCheckbox, {
                      "model-value": vueExports.unref(selectedIds).has(row.original.id),
                      "onUpdate:modelValue": ($event) => toggleSelection(row.original.id)
                    }, null, _parent3, _scopeId2));
                  } else {
                    _push3(`<!---->`);
                  }
                } else {
                  return [
                    row.original.status.value === "pending" ? (vueExports.openBlock(), vueExports.createBlock(_component_UCheckbox, {
                      key: 0,
                      "model-value": vueExports.unref(selectedIds).has(row.original.id),
                      "onUpdate:modelValue": ($event) => toggleSelection(row.original.id)
                    }, null, 8, ["model-value", "onUpdate:modelValue"])) : vueExports.createCommentVNode("", true)
                  ];
                }
              }),
              "select-header": vueExports.withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UCheckbox, {
                    "model-value": vueExports.unref(isAllSelected),
                    "onUpdate:modelValue": toggleSelectAll
                  }, null, _parent3, _scopeId2));
                } else {
                  return [
                    vueExports.createVNode(_component_UCheckbox, {
                      "model-value": vueExports.unref(isAllSelected),
                      "onUpdate:modelValue": toggleSelectAll
                    }, null, 8, ["model-value"])
                  ];
                }
              }),
              "source_label-cell": vueExports.withCtx(({ row }, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UBadge, {
                    label: row.original.source.type === "manual_cash" ? "Quỹ thủ công" : "Công nợ",
                    color: ("reconciliationSourceColor" in _ctx ? _ctx.reconciliationSourceColor : vueExports.unref(reconciliationSourceColor))(row.original.source.type),
                    variant: "subtle",
                    size: "sm"
                  }, null, _parent3, _scopeId2));
                } else {
                  return [
                    vueExports.createVNode(_component_UBadge, {
                      label: row.original.source.type === "manual_cash" ? "Quỹ thủ công" : "Công nợ",
                      color: ("reconciliationSourceColor" in _ctx ? _ctx.reconciliationSourceColor : vueExports.unref(reconciliationSourceColor))(row.original.source.type),
                      variant: "subtle",
                      size: "sm"
                    }, null, 8, ["label", "color"])
                  ];
                }
              }),
              "order_info-cell": vueExports.withCtx(({ row }, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  if (row.original.source.type === "manual_cash" && row.original.source.cash_transaction) {
                    _push3(`<div class="flex flex-col gap-0.5" data-v-8f191cd1${_scopeId2}>`);
                    _push3(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_NuxtLink, {
                      to: "/pmc/finance/treasury",
                      class: "text-primary hover:underline font-mono text-xs font-semibold"
                    }, {
                      default: vueExports.withCtx((_2, _push4, _parent4, _scopeId3) => {
                        if (_push4) {
                          _push4(`${serverRenderer_cjs_prodExports.ssrInterpolate(row.original.source.cash_transaction.code)}`);
                        } else {
                          return [
                            vueExports.createTextVNode(vueExports.toDisplayString(row.original.source.cash_transaction.code), 1)
                          ];
                        }
                      }),
                      _: 2
                    }, _parent3, _scopeId2));
                    _push3(`<span class="text-xs text-slate-700" data-v-8f191cd1${_scopeId2}>${serverRenderer_cjs_prodExports.ssrInterpolate(row.original.source.cash_transaction.category.label)}</span>`);
                    if (row.original.source.cash_transaction.note) {
                      _push3(`<span class="text-[11px] text-slate-400 truncate max-w-40"${serverRenderer_cjs_prodExports.ssrRenderAttr("title", row.original.source.cash_transaction.note)} data-v-8f191cd1${_scopeId2}>${serverRenderer_cjs_prodExports.ssrInterpolate(row.original.source.cash_transaction.note)}</span>`);
                    } else {
                      _push3(`<!---->`);
                    }
                    _push3(`</div>`);
                  } else {
                    _push3(`<div class="flex flex-col gap-0.5" data-v-8f191cd1${_scopeId2}>`);
                    if (row.original.receivable) {
                      _push3(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_NuxtLink, {
                        to: `/pmc/receivables/${row.original.receivable.id}`,
                        class: "text-primary hover:underline font-mono text-xs font-semibold"
                      }, {
                        default: vueExports.withCtx((_2, _push4, _parent4, _scopeId3) => {
                          if (_push4) {
                            _push4(`${serverRenderer_cjs_prodExports.ssrInterpolate(row.original.receivable.order_code ?? "—")}`);
                          } else {
                            return [
                              vueExports.createTextVNode(vueExports.toDisplayString(row.original.receivable.order_code ?? "—"), 1)
                            ];
                          }
                        }),
                        _: 2
                      }, _parent3, _scopeId2));
                    } else {
                      _push3(`<!---->`);
                    }
                    _push3(`<span class="text-xs text-slate-700" data-v-8f191cd1${_scopeId2}>${serverRenderer_cjs_prodExports.ssrInterpolate(row.original.receivable?.customer?.full_name ?? row.original.receivable?.requester_name ?? "—")}</span>`);
                    if (row.original.receivable?.apartment_name) {
                      _push3(`<span class="text-[11px] text-slate-400" data-v-8f191cd1${_scopeId2}>${serverRenderer_cjs_prodExports.ssrInterpolate(row.original.receivable.apartment_name)}</span>`);
                    } else {
                      _push3(`<!---->`);
                    }
                    _push3(`</div>`);
                  }
                } else {
                  return [
                    row.original.source.type === "manual_cash" && row.original.source.cash_transaction ? (vueExports.openBlock(), vueExports.createBlock("div", {
                      key: 0,
                      class: "flex flex-col gap-0.5"
                    }, [
                      vueExports.createVNode(_component_NuxtLink, {
                        to: "/pmc/finance/treasury",
                        class: "text-primary hover:underline font-mono text-xs font-semibold"
                      }, {
                        default: vueExports.withCtx(() => [
                          vueExports.createTextVNode(vueExports.toDisplayString(row.original.source.cash_transaction.code), 1)
                        ]),
                        _: 2
                      }, 1024),
                      vueExports.createVNode("span", { class: "text-xs text-slate-700" }, vueExports.toDisplayString(row.original.source.cash_transaction.category.label), 1),
                      row.original.source.cash_transaction.note ? (vueExports.openBlock(), vueExports.createBlock("span", {
                        key: 0,
                        class: "text-[11px] text-slate-400 truncate max-w-40",
                        title: row.original.source.cash_transaction.note
                      }, vueExports.toDisplayString(row.original.source.cash_transaction.note), 9, ["title"])) : vueExports.createCommentVNode("", true)
                    ])) : (vueExports.openBlock(), vueExports.createBlock("div", {
                      key: 1,
                      class: "flex flex-col gap-0.5"
                    }, [
                      row.original.receivable ? (vueExports.openBlock(), vueExports.createBlock(_component_NuxtLink, {
                        key: 0,
                        to: `/pmc/receivables/${row.original.receivable.id}`,
                        class: "text-primary hover:underline font-mono text-xs font-semibold"
                      }, {
                        default: vueExports.withCtx(() => [
                          vueExports.createTextVNode(vueExports.toDisplayString(row.original.receivable.order_code ?? "—"), 1)
                        ]),
                        _: 2
                      }, 1032, ["to"])) : vueExports.createCommentVNode("", true),
                      vueExports.createVNode("span", { class: "text-xs text-slate-700" }, vueExports.toDisplayString(row.original.receivable?.customer?.full_name ?? row.original.receivable?.requester_name ?? "—"), 1),
                      row.original.receivable?.apartment_name ? (vueExports.openBlock(), vueExports.createBlock("span", {
                        key: 1,
                        class: "text-[11px] text-slate-400"
                      }, vueExports.toDisplayString(row.original.receivable.apartment_name), 1)) : vueExports.createCommentVNode("", true)
                    ]))
                  ];
                }
              }),
              "project-cell": vueExports.withCtx(({ row }, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(`<span class="${serverRenderer_cjs_prodExports.ssrRenderClass(row.original.project ? "" : "text-slate-400")}" data-v-8f191cd1${_scopeId2}>${serverRenderer_cjs_prodExports.ssrInterpolate(row.original.project?.name ?? "—")}</span>`);
                } else {
                  return [
                    vueExports.createVNode("span", {
                      class: row.original.project ? "" : "text-slate-400"
                    }, vueExports.toDisplayString(row.original.project?.name ?? "—"), 3)
                  ];
                }
              }),
              "type-cell": vueExports.withCtx(({ row }, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  if (row.original.payment_receipt) {
                    _push3(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UBadge, {
                      label: row.original.payment_receipt.type.label,
                      color: ("paymentReceiptTypeColor" in _ctx ? _ctx.paymentReceiptTypeColor : vueExports.unref(paymentReceiptTypeColor))(row.original.payment_receipt.type.value),
                      variant: "subtle",
                      size: "sm"
                    }, null, _parent3, _scopeId2));
                  } else if (row.original.source.type === "manual_cash" && row.original.source.cash_transaction) {
                    _push3(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UBadge, {
                      label: row.original.source.cash_transaction.direction.label,
                      color: row.original.source.cash_transaction.direction.value === "inflow" ? "success" : "warning",
                      variant: "subtle",
                      size: "sm"
                    }, null, _parent3, _scopeId2));
                  } else {
                    _push3(`<!---->`);
                  }
                } else {
                  return [
                    row.original.payment_receipt ? (vueExports.openBlock(), vueExports.createBlock(_component_UBadge, {
                      key: 0,
                      label: row.original.payment_receipt.type.label,
                      color: ("paymentReceiptTypeColor" in _ctx ? _ctx.paymentReceiptTypeColor : vueExports.unref(paymentReceiptTypeColor))(row.original.payment_receipt.type.value),
                      variant: "subtle",
                      size: "sm"
                    }, null, 8, ["label", "color"])) : row.original.source.type === "manual_cash" && row.original.source.cash_transaction ? (vueExports.openBlock(), vueExports.createBlock(_component_UBadge, {
                      key: 1,
                      label: row.original.source.cash_transaction.direction.label,
                      color: row.original.source.cash_transaction.direction.value === "inflow" ? "success" : "warning",
                      variant: "subtle",
                      size: "sm"
                    }, null, 8, ["label", "color"])) : vueExports.createCommentVNode("", true)
                  ];
                }
              }),
              "receipt_amount-cell": vueExports.withCtx(({ row }, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(`<span class="font-medium" data-v-8f191cd1${_scopeId2}>${serverRenderer_cjs_prodExports.ssrInterpolate(("formatCurrency" in _ctx ? _ctx.formatCurrency : vueExports.unref(formatCurrency))(row.original.amount))}</span>`);
                } else {
                  return [
                    vueExports.createVNode("span", { class: "font-medium" }, vueExports.toDisplayString(("formatCurrency" in _ctx ? _ctx.formatCurrency : vueExports.unref(formatCurrency))(row.original.amount)), 1)
                  ];
                }
              }),
              "receivable_amount-cell": vueExports.withCtx(({ row }, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(`<span class="${serverRenderer_cjs_prodExports.ssrRenderClass([row.original.receivable ? "" : "text-slate-400", "text-sm"])}" data-v-8f191cd1${_scopeId2}>${serverRenderer_cjs_prodExports.ssrInterpolate(row.original.receivable ? ("formatCurrency" in _ctx ? _ctx.formatCurrency : vueExports.unref(formatCurrency))(row.original.receivable.amount) : "—")}</span>`);
                } else {
                  return [
                    vueExports.createVNode("span", {
                      class: ["text-sm", row.original.receivable ? "" : "text-slate-400"]
                    }, vueExports.toDisplayString(row.original.receivable ? ("formatCurrency" in _ctx ? _ctx.formatCurrency : vueExports.unref(formatCurrency))(row.original.receivable.amount) : "—"), 3)
                  ];
                }
              }),
              "receivable_paid-cell": vueExports.withCtx(({ row }, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(`<span class="${serverRenderer_cjs_prodExports.ssrRenderClass([row.original.receivable ? "text-[var(--ui-success)]" : "text-slate-400", "text-sm"])}" data-v-8f191cd1${_scopeId2}>${serverRenderer_cjs_prodExports.ssrInterpolate(row.original.receivable ? ("formatCurrency" in _ctx ? _ctx.formatCurrency : vueExports.unref(formatCurrency))(row.original.receivable.paid_amount) : "—")}</span>`);
                } else {
                  return [
                    vueExports.createVNode("span", {
                      class: ["text-sm", row.original.receivable ? "text-[var(--ui-success)]" : "text-slate-400"]
                    }, vueExports.toDisplayString(row.original.receivable ? ("formatCurrency" in _ctx ? _ctx.formatCurrency : vueExports.unref(formatCurrency))(row.original.receivable.paid_amount) : "—"), 3)
                  ];
                }
              }),
              "receivable_status-cell": vueExports.withCtx(({ row }, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  if (row.original.receivable) {
                    _push3(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UBadge, {
                      label: row.original.receivable.status.label,
                      color: ("receivableStatusColor" in _ctx ? _ctx.receivableStatusColor : vueExports.unref(receivableStatusColor))(row.original.receivable.status.value),
                      variant: "subtle",
                      size: "sm"
                    }, null, _parent3, _scopeId2));
                  } else {
                    _push3(`<span class="text-xs text-slate-400" data-v-8f191cd1${_scopeId2}>—</span>`);
                  }
                } else {
                  return [
                    row.original.receivable ? (vueExports.openBlock(), vueExports.createBlock(_component_UBadge, {
                      key: 0,
                      label: row.original.receivable.status.label,
                      color: ("receivableStatusColor" in _ctx ? _ctx.receivableStatusColor : vueExports.unref(receivableStatusColor))(row.original.receivable.status.value),
                      variant: "subtle",
                      size: "sm"
                    }, null, 8, ["label", "color"])) : (vueExports.openBlock(), vueExports.createBlock("span", {
                      key: 1,
                      class: "text-xs text-slate-400"
                    }, "—"))
                  ];
                }
              }),
              "paid_at-cell": vueExports.withCtx(({ row }, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(`<span class="text-xs" data-v-8f191cd1${_scopeId2}>`);
                  if (row.original.payment_receipt) {
                    _push3(`<!--[-->${serverRenderer_cjs_prodExports.ssrInterpolate(("formatDateTime" in _ctx ? _ctx.formatDateTime : vueExports.unref(formatDateTime))(row.original.payment_receipt.paid_at))}<!--]-->`);
                  } else if (row.original.source.type === "manual_cash" && row.original.source.cash_transaction?.transaction_date) {
                    _push3(`<!--[-->${serverRenderer_cjs_prodExports.ssrInterpolate(("formatDate" in _ctx ? _ctx.formatDate : vueExports.unref(formatDate))(row.original.source.cash_transaction.transaction_date))}<!--]-->`);
                  } else {
                    _push3(`<!--[-->—<!--]-->`);
                  }
                  _push3(`</span>`);
                } else {
                  return [
                    vueExports.createVNode("span", { class: "text-xs" }, [
                      row.original.payment_receipt ? (vueExports.openBlock(), vueExports.createBlock(vueExports.Fragment, { key: 0 }, [
                        vueExports.createTextVNode(vueExports.toDisplayString(("formatDateTime" in _ctx ? _ctx.formatDateTime : vueExports.unref(formatDateTime))(row.original.payment_receipt.paid_at)), 1)
                      ], 64)) : row.original.source.type === "manual_cash" && row.original.source.cash_transaction?.transaction_date ? (vueExports.openBlock(), vueExports.createBlock(vueExports.Fragment, { key: 1 }, [
                        vueExports.createTextVNode(vueExports.toDisplayString(("formatDate" in _ctx ? _ctx.formatDate : vueExports.unref(formatDate))(row.original.source.cash_transaction.transaction_date)), 1)
                      ], 64)) : (vueExports.openBlock(), vueExports.createBlock(vueExports.Fragment, { key: 2 }, [
                        vueExports.createTextVNode("—")
                      ], 64))
                    ])
                  ];
                }
              }),
              "status-cell": vueExports.withCtx(({ row }, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UBadge, {
                    label: row.original.status.label,
                    color: ("reconciliationStatusColor" in _ctx ? _ctx.reconciliationStatusColor : vueExports.unref(reconciliationStatusColor))(row.original.status.value),
                    variant: "subtle",
                    size: "sm"
                  }, null, _parent3, _scopeId2));
                } else {
                  return [
                    vueExports.createVNode(_component_UBadge, {
                      label: row.original.status.label,
                      color: ("reconciliationStatusColor" in _ctx ? _ctx.reconciliationStatusColor : vueExports.unref(reconciliationStatusColor))(row.original.status.value),
                      variant: "subtle",
                      size: "sm"
                    }, null, 8, ["label", "color"])
                  ];
                }
              }),
              "reconciled_info-cell": vueExports.withCtx(({ row }, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  if (row.original.reconciled_at) {
                    _push3(`<div class="flex flex-col" data-v-8f191cd1${_scopeId2}><span class="text-xs" data-v-8f191cd1${_scopeId2}>${serverRenderer_cjs_prodExports.ssrInterpolate(("formatDateTime" in _ctx ? _ctx.formatDateTime : vueExports.unref(formatDateTime))(row.original.reconciled_at))}</span><span class="text-[11px] text-slate-400" data-v-8f191cd1${_scopeId2}>${serverRenderer_cjs_prodExports.ssrInterpolate(row.original.reconciled_by?.name ?? "")}</span></div>`);
                  } else {
                    _push3(`<span class="text-slate-400" data-v-8f191cd1${_scopeId2}>—</span>`);
                  }
                } else {
                  return [
                    row.original.reconciled_at ? (vueExports.openBlock(), vueExports.createBlock("div", {
                      key: 0,
                      class: "flex flex-col"
                    }, [
                      vueExports.createVNode("span", { class: "text-xs" }, vueExports.toDisplayString(("formatDateTime" in _ctx ? _ctx.formatDateTime : vueExports.unref(formatDateTime))(row.original.reconciled_at)), 1),
                      vueExports.createVNode("span", { class: "text-[11px] text-slate-400" }, vueExports.toDisplayString(row.original.reconciled_by?.name ?? ""), 1)
                    ])) : (vueExports.openBlock(), vueExports.createBlock("span", {
                      key: 1,
                      class: "text-slate-400"
                    }, "—"))
                  ];
                }
              }),
              "cash_transaction-cell": vueExports.withCtx(({ row }, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  if (row.original.status.value === "rejected") {
                    _push3(`<span class="text-slate-400 text-xs" data-v-8f191cd1${_scopeId2}>N/A</span>`);
                  } else if (row.original.cash_transaction) {
                    _push3(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_NuxtLink, {
                      to: "/pmc/finance/treasury",
                      class: "font-mono text-sm text-[var(--ui-primary)] hover:underline"
                    }, {
                      default: vueExports.withCtx((_2, _push4, _parent4, _scopeId3) => {
                        if (_push4) {
                          _push4(`${serverRenderer_cjs_prodExports.ssrInterpolate(row.original.cash_transaction.code)}`);
                        } else {
                          return [
                            vueExports.createTextVNode(vueExports.toDisplayString(row.original.cash_transaction.code), 1)
                          ];
                        }
                      }),
                      _: 2
                    }, _parent3, _scopeId2));
                  } else {
                    _push3(`<span class="text-slate-400" data-v-8f191cd1${_scopeId2}>—</span>`);
                  }
                } else {
                  return [
                    row.original.status.value === "rejected" ? (vueExports.openBlock(), vueExports.createBlock("span", {
                      key: 0,
                      class: "text-slate-400 text-xs"
                    }, "N/A")) : row.original.cash_transaction ? (vueExports.openBlock(), vueExports.createBlock(_component_NuxtLink, {
                      key: 1,
                      to: "/pmc/finance/treasury",
                      class: "font-mono text-sm text-[var(--ui-primary)] hover:underline"
                    }, {
                      default: vueExports.withCtx(() => [
                        vueExports.createTextVNode(vueExports.toDisplayString(row.original.cash_transaction.code), 1)
                      ]),
                      _: 2
                    }, 1024)) : (vueExports.openBlock(), vueExports.createBlock("span", {
                      key: 2,
                      class: "text-slate-400"
                    }, "—"))
                  ];
                }
              }),
              "actions-cell": vueExports.withCtx(({ row }, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(`<div class="flex gap-1" data-v-8f191cd1${_scopeId2}>`);
                  if (row.original.status.value === "pending") {
                    _push3(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UButton, {
                      icon: "i-lucide-check",
                      color: "success",
                      variant: "ghost",
                      size: "sm",
                      title: "Đối soát",
                      onClick: ($event) => quickReconcile(row.original)
                    }, null, _parent3, _scopeId2));
                  } else {
                    _push3(`<!---->`);
                  }
                  _push3(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UButton, {
                    icon: "i-lucide-eye",
                    color: "neutral",
                    variant: "ghost",
                    size: "sm",
                    title: "Chi tiết",
                    to: `/pmc/finance/reconciliation/${row.original.id}`
                  }, null, _parent3, _scopeId2));
                  _push3(`</div>`);
                } else {
                  return [
                    vueExports.createVNode("div", { class: "flex gap-1" }, [
                      row.original.status.value === "pending" ? (vueExports.openBlock(), vueExports.createBlock(_component_UButton, {
                        key: 0,
                        icon: "i-lucide-check",
                        color: "success",
                        variant: "ghost",
                        size: "sm",
                        title: "Đối soát",
                        onClick: ($event) => quickReconcile(row.original)
                      }, null, 8, ["onClick"])) : vueExports.createCommentVNode("", true),
                      vueExports.createVNode(_component_UButton, {
                        icon: "i-lucide-eye",
                        color: "neutral",
                        variant: "ghost",
                        size: "sm",
                        title: "Chi tiết",
                        to: `/pmc/finance/reconciliation/${row.original.id}`
                      }, null, 8, ["to"])
                    ])
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
              vueExports.createVNode("div", { class: "bg-white border border-border-gray rounded-xl overflow-hidden shadow-sm" }, [
                vueExports.createVNode(_component_UTable, {
                  data: vueExports.unref(items),
                  columns
                }, {
                  "select-cell": vueExports.withCtx(({ row }) => [
                    row.original.status.value === "pending" ? (vueExports.openBlock(), vueExports.createBlock(_component_UCheckbox, {
                      key: 0,
                      "model-value": vueExports.unref(selectedIds).has(row.original.id),
                      "onUpdate:modelValue": ($event) => toggleSelection(row.original.id)
                    }, null, 8, ["model-value", "onUpdate:modelValue"])) : vueExports.createCommentVNode("", true)
                  ]),
                  "select-header": vueExports.withCtx(() => [
                    vueExports.createVNode(_component_UCheckbox, {
                      "model-value": vueExports.unref(isAllSelected),
                      "onUpdate:modelValue": toggleSelectAll
                    }, null, 8, ["model-value"])
                  ]),
                  "source_label-cell": vueExports.withCtx(({ row }) => [
                    vueExports.createVNode(_component_UBadge, {
                      label: row.original.source.type === "manual_cash" ? "Quỹ thủ công" : "Công nợ",
                      color: ("reconciliationSourceColor" in _ctx ? _ctx.reconciliationSourceColor : vueExports.unref(reconciliationSourceColor))(row.original.source.type),
                      variant: "subtle",
                      size: "sm"
                    }, null, 8, ["label", "color"])
                  ]),
                  "order_info-cell": vueExports.withCtx(({ row }) => [
                    row.original.source.type === "manual_cash" && row.original.source.cash_transaction ? (vueExports.openBlock(), vueExports.createBlock("div", {
                      key: 0,
                      class: "flex flex-col gap-0.5"
                    }, [
                      vueExports.createVNode(_component_NuxtLink, {
                        to: "/pmc/finance/treasury",
                        class: "text-primary hover:underline font-mono text-xs font-semibold"
                      }, {
                        default: vueExports.withCtx(() => [
                          vueExports.createTextVNode(vueExports.toDisplayString(row.original.source.cash_transaction.code), 1)
                        ]),
                        _: 2
                      }, 1024),
                      vueExports.createVNode("span", { class: "text-xs text-slate-700" }, vueExports.toDisplayString(row.original.source.cash_transaction.category.label), 1),
                      row.original.source.cash_transaction.note ? (vueExports.openBlock(), vueExports.createBlock("span", {
                        key: 0,
                        class: "text-[11px] text-slate-400 truncate max-w-40",
                        title: row.original.source.cash_transaction.note
                      }, vueExports.toDisplayString(row.original.source.cash_transaction.note), 9, ["title"])) : vueExports.createCommentVNode("", true)
                    ])) : (vueExports.openBlock(), vueExports.createBlock("div", {
                      key: 1,
                      class: "flex flex-col gap-0.5"
                    }, [
                      row.original.receivable ? (vueExports.openBlock(), vueExports.createBlock(_component_NuxtLink, {
                        key: 0,
                        to: `/pmc/receivables/${row.original.receivable.id}`,
                        class: "text-primary hover:underline font-mono text-xs font-semibold"
                      }, {
                        default: vueExports.withCtx(() => [
                          vueExports.createTextVNode(vueExports.toDisplayString(row.original.receivable.order_code ?? "—"), 1)
                        ]),
                        _: 2
                      }, 1032, ["to"])) : vueExports.createCommentVNode("", true),
                      vueExports.createVNode("span", { class: "text-xs text-slate-700" }, vueExports.toDisplayString(row.original.receivable?.customer?.full_name ?? row.original.receivable?.requester_name ?? "—"), 1),
                      row.original.receivable?.apartment_name ? (vueExports.openBlock(), vueExports.createBlock("span", {
                        key: 1,
                        class: "text-[11px] text-slate-400"
                      }, vueExports.toDisplayString(row.original.receivable.apartment_name), 1)) : vueExports.createCommentVNode("", true)
                    ]))
                  ]),
                  "project-cell": vueExports.withCtx(({ row }) => [
                    vueExports.createVNode("span", {
                      class: row.original.project ? "" : "text-slate-400"
                    }, vueExports.toDisplayString(row.original.project?.name ?? "—"), 3)
                  ]),
                  "type-cell": vueExports.withCtx(({ row }) => [
                    row.original.payment_receipt ? (vueExports.openBlock(), vueExports.createBlock(_component_UBadge, {
                      key: 0,
                      label: row.original.payment_receipt.type.label,
                      color: ("paymentReceiptTypeColor" in _ctx ? _ctx.paymentReceiptTypeColor : vueExports.unref(paymentReceiptTypeColor))(row.original.payment_receipt.type.value),
                      variant: "subtle",
                      size: "sm"
                    }, null, 8, ["label", "color"])) : row.original.source.type === "manual_cash" && row.original.source.cash_transaction ? (vueExports.openBlock(), vueExports.createBlock(_component_UBadge, {
                      key: 1,
                      label: row.original.source.cash_transaction.direction.label,
                      color: row.original.source.cash_transaction.direction.value === "inflow" ? "success" : "warning",
                      variant: "subtle",
                      size: "sm"
                    }, null, 8, ["label", "color"])) : vueExports.createCommentVNode("", true)
                  ]),
                  "receipt_amount-cell": vueExports.withCtx(({ row }) => [
                    vueExports.createVNode("span", { class: "font-medium" }, vueExports.toDisplayString(("formatCurrency" in _ctx ? _ctx.formatCurrency : vueExports.unref(formatCurrency))(row.original.amount)), 1)
                  ]),
                  "receivable_amount-cell": vueExports.withCtx(({ row }) => [
                    vueExports.createVNode("span", {
                      class: ["text-sm", row.original.receivable ? "" : "text-slate-400"]
                    }, vueExports.toDisplayString(row.original.receivable ? ("formatCurrency" in _ctx ? _ctx.formatCurrency : vueExports.unref(formatCurrency))(row.original.receivable.amount) : "—"), 3)
                  ]),
                  "receivable_paid-cell": vueExports.withCtx(({ row }) => [
                    vueExports.createVNode("span", {
                      class: ["text-sm", row.original.receivable ? "text-[var(--ui-success)]" : "text-slate-400"]
                    }, vueExports.toDisplayString(row.original.receivable ? ("formatCurrency" in _ctx ? _ctx.formatCurrency : vueExports.unref(formatCurrency))(row.original.receivable.paid_amount) : "—"), 3)
                  ]),
                  "receivable_status-cell": vueExports.withCtx(({ row }) => [
                    row.original.receivable ? (vueExports.openBlock(), vueExports.createBlock(_component_UBadge, {
                      key: 0,
                      label: row.original.receivable.status.label,
                      color: ("receivableStatusColor" in _ctx ? _ctx.receivableStatusColor : vueExports.unref(receivableStatusColor))(row.original.receivable.status.value),
                      variant: "subtle",
                      size: "sm"
                    }, null, 8, ["label", "color"])) : (vueExports.openBlock(), vueExports.createBlock("span", {
                      key: 1,
                      class: "text-xs text-slate-400"
                    }, "—"))
                  ]),
                  "paid_at-cell": vueExports.withCtx(({ row }) => [
                    vueExports.createVNode("span", { class: "text-xs" }, [
                      row.original.payment_receipt ? (vueExports.openBlock(), vueExports.createBlock(vueExports.Fragment, { key: 0 }, [
                        vueExports.createTextVNode(vueExports.toDisplayString(("formatDateTime" in _ctx ? _ctx.formatDateTime : vueExports.unref(formatDateTime))(row.original.payment_receipt.paid_at)), 1)
                      ], 64)) : row.original.source.type === "manual_cash" && row.original.source.cash_transaction?.transaction_date ? (vueExports.openBlock(), vueExports.createBlock(vueExports.Fragment, { key: 1 }, [
                        vueExports.createTextVNode(vueExports.toDisplayString(("formatDate" in _ctx ? _ctx.formatDate : vueExports.unref(formatDate))(row.original.source.cash_transaction.transaction_date)), 1)
                      ], 64)) : (vueExports.openBlock(), vueExports.createBlock(vueExports.Fragment, { key: 2 }, [
                        vueExports.createTextVNode("—")
                      ], 64))
                    ])
                  ]),
                  "status-cell": vueExports.withCtx(({ row }) => [
                    vueExports.createVNode(_component_UBadge, {
                      label: row.original.status.label,
                      color: ("reconciliationStatusColor" in _ctx ? _ctx.reconciliationStatusColor : vueExports.unref(reconciliationStatusColor))(row.original.status.value),
                      variant: "subtle",
                      size: "sm"
                    }, null, 8, ["label", "color"])
                  ]),
                  "reconciled_info-cell": vueExports.withCtx(({ row }) => [
                    row.original.reconciled_at ? (vueExports.openBlock(), vueExports.createBlock("div", {
                      key: 0,
                      class: "flex flex-col"
                    }, [
                      vueExports.createVNode("span", { class: "text-xs" }, vueExports.toDisplayString(("formatDateTime" in _ctx ? _ctx.formatDateTime : vueExports.unref(formatDateTime))(row.original.reconciled_at)), 1),
                      vueExports.createVNode("span", { class: "text-[11px] text-slate-400" }, vueExports.toDisplayString(row.original.reconciled_by?.name ?? ""), 1)
                    ])) : (vueExports.openBlock(), vueExports.createBlock("span", {
                      key: 1,
                      class: "text-slate-400"
                    }, "—"))
                  ]),
                  "cash_transaction-cell": vueExports.withCtx(({ row }) => [
                    row.original.status.value === "rejected" ? (vueExports.openBlock(), vueExports.createBlock("span", {
                      key: 0,
                      class: "text-slate-400 text-xs"
                    }, "N/A")) : row.original.cash_transaction ? (vueExports.openBlock(), vueExports.createBlock(_component_NuxtLink, {
                      key: 1,
                      to: "/pmc/finance/treasury",
                      class: "font-mono text-sm text-[var(--ui-primary)] hover:underline"
                    }, {
                      default: vueExports.withCtx(() => [
                        vueExports.createTextVNode(vueExports.toDisplayString(row.original.cash_transaction.code), 1)
                      ]),
                      _: 2
                    }, 1024)) : (vueExports.openBlock(), vueExports.createBlock("span", {
                      key: 2,
                      class: "text-slate-400"
                    }, "—"))
                  ]),
                  "actions-cell": vueExports.withCtx(({ row }) => [
                    vueExports.createVNode("div", { class: "flex gap-1" }, [
                      row.original.status.value === "pending" ? (vueExports.openBlock(), vueExports.createBlock(_component_UButton, {
                        key: 0,
                        icon: "i-lucide-check",
                        color: "success",
                        variant: "ghost",
                        size: "sm",
                        title: "Đối soát",
                        onClick: ($event) => quickReconcile(row.original)
                      }, null, 8, ["onClick"])) : vueExports.createCommentVNode("", true),
                      vueExports.createVNode(_component_UButton, {
                        icon: "i-lucide-eye",
                        color: "neutral",
                        variant: "ghost",
                        size: "sm",
                        title: "Chi tiết",
                        to: `/pmc/finance/reconciliation/${row.original.id}`
                      }, null, 8, ["to"])
                    ])
                  ]),
                  _: 1
                }, 8, ["data"]),
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
      _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UModal, {
        open: vueExports.unref(showBatchConfirm),
        "onUpdate:open": ($event) => vueExports.isRef(showBatchConfirm) ? showBatchConfirm.value = $event : null,
        title: "Đối soát hàng loạt"
      }, {
        body: vueExports.withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="flex flex-col gap-4" data-v-8f191cd1${_scopeId}><p class="text-slate-700" data-v-8f191cd1${_scopeId}> Xác nhận đối soát <strong data-v-8f191cd1${_scopeId}>${serverRenderer_cjs_prodExports.ssrInterpolate(vueExports.unref(selectedIds).size)}</strong> dòng tiền? </p>`);
            _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UFormField, { label: "Ghi chú chung" }, {
              default: vueExports.withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UInput, {
                    modelValue: vueExports.unref(batchNote),
                    "onUpdate:modelValue": ($event) => vueExports.isRef(batchNote) ? batchNote.value = $event : null,
                    placeholder: "Nhập ghi chú (tùy chọn)",
                    maxlength: 500,
                    class: "w-full"
                  }, null, _parent3, _scopeId2));
                } else {
                  return [
                    vueExports.createVNode(_component_UInput, {
                      modelValue: vueExports.unref(batchNote),
                      "onUpdate:modelValue": ($event) => vueExports.isRef(batchNote) ? batchNote.value = $event : null,
                      placeholder: "Nhập ghi chú (tùy chọn)",
                      maxlength: 500,
                      class: "w-full"
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
                vueExports.createVNode("p", { class: "text-slate-700" }, [
                  vueExports.createTextVNode(" Xác nhận đối soát "),
                  vueExports.createVNode("strong", null, vueExports.toDisplayString(vueExports.unref(selectedIds).size), 1),
                  vueExports.createTextVNode(" dòng tiền? ")
                ]),
                vueExports.createVNode(_component_UFormField, { label: "Ghi chú chung" }, {
                  default: vueExports.withCtx(() => [
                    vueExports.createVNode(_component_UInput, {
                      modelValue: vueExports.unref(batchNote),
                      "onUpdate:modelValue": ($event) => vueExports.isRef(batchNote) ? batchNote.value = $event : null,
                      placeholder: "Nhập ghi chú (tùy chọn)",
                      maxlength: 500,
                      class: "w-full"
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
            _push2(`<div class="flex justify-end gap-2 w-full" data-v-8f191cd1${_scopeId}>`);
            _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UButton, {
              label: "Quay lại",
              color: "neutral",
              variant: "ghost",
              onClick: ($event) => showBatchConfirm.value = false
            }, null, _parent2, _scopeId));
            _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UButton, {
              label: `Xác nhận (${vueExports.unref(selectedIds).size})`,
              color: "primary",
              loading: vueExports.unref(isBatchReconciling),
              onClick: submitBatchReconcile
            }, null, _parent2, _scopeId));
            _push2(`</div>`);
          } else {
            return [
              vueExports.createVNode("div", { class: "flex justify-end gap-2 w-full" }, [
                vueExports.createVNode(_component_UButton, {
                  label: "Quay lại",
                  color: "neutral",
                  variant: "ghost",
                  onClick: ($event) => showBatchConfirm.value = false
                }, null, 8, ["onClick"]),
                vueExports.createVNode(_component_UButton, {
                  label: `Xác nhận (${vueExports.unref(selectedIds).size})`,
                  color: "primary",
                  loading: vueExports.unref(isBatchReconciling),
                  onClick: submitBatchReconcile
                }, null, 8, ["label", "loading"])
              ])
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = vueExports.useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/pmc/finance/reconciliation/index.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const index = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-8f191cd1"]]);

export { index as default };
//# sourceMappingURL=index-zwamzo35.mjs.map
