import { _ as __nuxt_component_0 } from './PageHeader-BJhealxW.mjs';
import { v as vueExports, p as useRoute$1, j as useToast, s as serverRenderer_cjs_prodExports, l as _sfc_main$c, k as _sfc_main$h, _ as __nuxt_component_0$4 } from './server.mjs';
import { _ as __nuxt_component_2 } from './TableWrapper-VwUckvcF.mjs';
import { _ as _sfc_main$1 } from './Alert-tTsPKADX.mjs';
import { _ as __nuxt_component_4 } from './SectionCard-CH-mG9Mf.mjs';
import { _ as __nuxt_component_5 } from './FieldDisplay-BM6nmr2i.mjs';
import { _ as _sfc_main$2 } from './Badge-W93D3Jpz.mjs';
import { _ as _sfc_main$3 } from './Textarea-DTCNHwKm.mjs';
import { _ as _sfc_main$4 } from './Modal-BimZZbNl.mjs';
import { _ as _sfc_main$5 } from './Checkbox-Cp_FPUkd.mjs';
import { f as formatDateTime, a as formatDate } from './date-R5YK0ast.mjs';
import { j as useClosingPeriodDetail, a as useEligibleOrders, c as closingPeriodStatusColor, d as apiAddOrders, k as clearClosingPeriodCache, l as apiRemoveOrder, e as apiClosePeriod, f as apiReopenPeriod } from './useClosingPeriods-HdCSZwWv.mjs';
import { f as formatCurrency, b as formatPercent } from './currency-DEb2TrW3.mjs';
import { u as useBreadcrumb } from './useBreadcrumb-zkNa_uJG.mjs';
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
import './PageError-kZWsA9dh.mjs';
import './index-QmZAbLx-.mjs';
import './DialogTrigger-C3iwCYMu.mjs';
import './FocusScope-BZehoQSg.mjs';
import './utils-DY0Zag2O.mjs';
import './DialogClose-DGkUxau7.mjs';
import './useFormControl-_Lqv8ipK.mjs';
import './RovingFocusItem-DwKRAYZk.mjs';
import './utils-BgcT7rQQ.mjs';
import './RovingFocusGroup-Vsbo7D6E.mjs';
import './useDirection-CXYby7CP.mjs';
import './VisuallyHiddenInput-q6Pz-w0i.mjs';
import './Label-BBgw4vHh.mjs';

const _sfc_main = /* @__PURE__ */ vueExports.defineComponent({
  __name: "index",
  __ssrInlineRender: true,
  setup(__props) {
    const route = useRoute$1();
    const toast = useToast();
    const periodId = vueExports.computed(() => route.params.id);
    const { data, status, error, refresh } = useClosingPeriodDetail(periodId);
    const period = vueExports.computed(() => data.value?.data ?? null);
    const isOpen = vueExports.computed(() => period.value?.status.value === "open");
    const { useDynamicLabel } = useBreadcrumb();
    useDynamicLabel(vueExports.computed(() => period.value?.name));
    const totalReceivable = vueExports.computed(() => {
      if (!period.value) return 0;
      return period.value.orders.reduce((sum, o) => sum + parseFloat(o.frozen_receivable_amount || "0"), 0);
    });
    const totalCommission = vueExports.computed(() => {
      if (!period.value) return 0;
      return period.value.orders.reduce((sum, o) => sum + getTopLevelCommission(o.snapshots), 0);
    });
    const expandedRows = vueExports.ref(/* @__PURE__ */ new Set());
    function toggleRow(orderId) {
      const s = new Set(expandedRows.value);
      if (s.has(orderId)) s.delete(orderId);
      else s.add(orderId);
      expandedRows.value = s;
    }
    const showAddOrdersModal = vueExports.ref(false);
    const selectedOrderIds = vueExports.ref(/* @__PURE__ */ new Set());
    const addOrdersLoading = vueExports.ref(false);
    const eligibleQuery = useEligibleOrders(periodId);
    const eligibleOrders = vueExports.computed(
      () => showAddOrdersModal.value ? eligibleQuery.data.value?.data ?? [] : []
    );
    function openAddOrdersModal() {
      selectedOrderIds.value = /* @__PURE__ */ new Set();
      showAddOrdersModal.value = true;
      eligibleQuery.refresh();
    }
    function toggleOrderSelection(id) {
      const s = new Set(selectedOrderIds.value);
      if (s.has(id)) s.delete(id);
      else s.add(id);
      selectedOrderIds.value = s;
    }
    function toggleAllOrders() {
      if (selectedOrderIds.value.size === eligibleOrders.value.length) {
        selectedOrderIds.value = /* @__PURE__ */ new Set();
      } else {
        selectedOrderIds.value = new Set(eligibleOrders.value.map((o) => o.id));
      }
    }
    async function submitAddOrders() {
      if (selectedOrderIds.value.size === 0) return;
      addOrdersLoading.value = true;
      try {
        await apiAddOrders(Number(periodId.value), { order_ids: [...selectedOrderIds.value] });
        toast.add({ title: `Đã thêm ${selectedOrderIds.value.size} đơn vào kỳ`, color: "success" });
        showAddOrdersModal.value = false;
        clearClosingPeriodCache(periodId.value);
        await refresh();
      } catch (err) {
        toast.add({ title: getApiErrorMessage(err), color: "error" });
      } finally {
        addOrdersLoading.value = false;
      }
    }
    const showRemoveConfirm = vueExports.ref(false);
    const removeTarget = vueExports.ref(null);
    const removeLoading = vueExports.ref(false);
    function openRemoveConfirm(order) {
      removeTarget.value = order;
      showRemoveConfirm.value = true;
    }
    async function submitRemove() {
      if (!removeTarget.value) return;
      removeLoading.value = true;
      try {
        await apiRemoveOrder(Number(periodId.value), removeTarget.value.order.id);
        toast.add({ title: "Đã xóa đơn khỏi kỳ", color: "success" });
        showRemoveConfirm.value = false;
        clearClosingPeriodCache(periodId.value);
        await refresh();
      } catch (err) {
        toast.add({ title: getApiErrorMessage(err), color: "error" });
      } finally {
        removeLoading.value = false;
      }
    }
    const showCloseConfirm = vueExports.ref(false);
    const showReopenConfirm = vueExports.ref(false);
    const actionNote = vueExports.ref("");
    const actionLoading = vueExports.ref(false);
    async function submitClose() {
      actionLoading.value = true;
      try {
        await apiClosePeriod(Number(periodId.value), { note: actionNote.value || null });
        toast.add({ title: "Đã chốt kỳ", color: "success" });
        showCloseConfirm.value = false;
        clearClosingPeriodCache(periodId.value);
        await refresh();
      } catch (err) {
        toast.add({ title: getApiErrorMessage(err), color: "error" });
      } finally {
        actionLoading.value = false;
      }
    }
    async function submitReopen() {
      actionLoading.value = true;
      try {
        await apiReopenPeriod(Number(periodId.value), { note: actionNote.value || null });
        toast.add({ title: "Đã mở lại kỳ và tính lại hoa hồng", color: "success" });
        showReopenConfirm.value = false;
        clearClosingPeriodCache(periodId.value);
        await refresh();
      } catch (err) {
        const apiErr = err;
        if (apiErr?.data?.error_code === "CLOSING_PERIOD_HAS_PAID_COMMISSION") {
          toast.add({
            title: "Không thể mở lại kỳ",
            description: apiErr.data?.message ?? 'Còn hoa hồng đã thanh toán trong kỳ. Vui lòng chuyển các dòng "Đã thanh toán" về "Chưa thanh toán" trong trang Tổng hợp hoa hồng, sau đó thử mở lại.',
            color: "warning",
            duration: 1e4
          });
        } else {
          toast.add({ title: getApiErrorMessage(err), color: "error" });
        }
      } finally {
        actionLoading.value = false;
      }
    }
    const TOP_LEVEL_RECIPIENT_TYPES = ["platform", "operating_company", "board_of_directors", "management"];
    const INTERMEDIARY_TYPES = ["management", "department"];
    function isIntermediary(snap) {
      if (snap.resolved_from === "override") return false;
      return INTERMEDIARY_TYPES.includes(snap.recipient_type);
    }
    function getSnapshotLevel(snap) {
      if (snap.resolved_from === "override") return 0;
      if (snap.recipient_type === "department") return 1;
      if (snap.recipient_type === "staff") return 2;
      return 0;
    }
    function getTopLevelCommission(snapshots) {
      return snapshots.filter((s) => s.resolved_from === "override" || TOP_LEVEL_RECIPIENT_TYPES.includes(s.recipient_type)).reduce((sum, s) => sum + parseFloat(s.amount || "0"), 0);
    }
    function buildSnapshotFormula(snap) {
      if (snap.value_type === "fixed") return `cứng ${formatCurrency(snap.value_fixed ?? 0)}/đơn`;
      if (snap.value_type === "percent") return formatPercent(snap.percent);
      return `${formatCurrency(snap.value_fixed ?? 0)} + ${formatPercent(snap.percent)}`;
    }
    return (_ctx, _push, _parent, _attrs) => {
      const _component_SharedCrudPageHeader = __nuxt_component_0;
      const _component_UButton = _sfc_main$c;
      const _component_SharedCrudTableWrapper = __nuxt_component_2;
      const _component_UAlert = _sfc_main$1;
      const _component_SharedSectionCard = __nuxt_component_4;
      const _component_SharedFieldDisplay = __nuxt_component_5;
      const _component_UBadge = _sfc_main$2;
      const _component_UIcon = _sfc_main$h;
      const _component_NuxtLink = __nuxt_component_0$4;
      const _component_UTextarea = _sfc_main$3;
      const _component_UModal = _sfc_main$4;
      const _component_UCheckbox = _sfc_main$5;
      _push(`<div${serverRenderer_cjs_prodExports.ssrRenderAttrs(_attrs)}>`);
      _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_SharedCrudPageHeader, {
        title: vueExports.unref(period)?.name ?? "Chi tiết kỳ chốt"
      }, {
        actions: vueExports.withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UButton, {
              variant: "outline",
              icon: "i-lucide-arrow-left",
              label: "Quay lại",
              to: "/pmc/finance/closing-periods"
            }, null, _parent2, _scopeId));
          } else {
            return [
              vueExports.createVNode(_component_UButton, {
                variant: "outline",
                icon: "i-lucide-arrow-left",
                label: "Quay lại",
                to: "/pmc/finance/closing-periods"
              })
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_SharedCrudTableWrapper, {
        status: vueExports.unref(status),
        error: vueExports.unref(error),
        data: vueExports.unref(data),
        refresh: vueExports.unref(refresh)
      }, {
        default: vueExports.withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            if (vueExports.unref(period)) {
              _push2(`<div class="grid grid-cols-1 lg:grid-cols-3 gap-6"${_scopeId}><div class="lg:col-span-2 space-y-6"${_scopeId}>`);
              if (vueExports.unref(isOpen)) {
                _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UAlert, {
                  color: "info",
                  variant: "subtle",
                  title: "Kỳ đang mở",
                  description: "Có thể thêm/bớt đơn. Khi chốt, tất cả đơn sẽ bị khóa tài chính."
                }, null, _parent2, _scopeId));
              } else {
                _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UAlert, {
                  color: "success",
                  variant: "subtle",
                  title: "Đã chốt",
                  description: `Kỳ đã chốt lúc ${("formatDateTime" in _ctx ? _ctx.formatDateTime : vueExports.unref(formatDateTime))(vueExports.unref(period).closed_at)} bởi ${vueExports.unref(period).closed_by?.name ?? "—"}. Tất cả đơn trong kỳ bị khóa tài chính.`
                }, null, _parent2, _scopeId));
              }
              _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_SharedSectionCard, {
                title: "Thông tin kỳ chốt",
                compact: ""
              }, {
                default: vueExports.withCtx((_2, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    _push3(`<div class="grid grid-cols-2 gap-4"${_scopeId2}>`);
                    _push3(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_SharedFieldDisplay, { label: "Tên kỳ" }, {
                      default: vueExports.withCtx((_3, _push4, _parent4, _scopeId3) => {
                        if (_push4) {
                          _push4(`${serverRenderer_cjs_prodExports.ssrInterpolate(vueExports.unref(period).name)}`);
                        } else {
                          return [
                            vueExports.createTextVNode(vueExports.toDisplayString(vueExports.unref(period).name), 1)
                          ];
                        }
                      }),
                      _: 1
                    }, _parent3, _scopeId2));
                    _push3(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_SharedFieldDisplay, { label: "Dự án" }, {
                      default: vueExports.withCtx((_3, _push4, _parent4, _scopeId3) => {
                        if (_push4) {
                          _push4(`${serverRenderer_cjs_prodExports.ssrInterpolate(vueExports.unref(period).project?.name ?? "Toàn hệ thống")}`);
                        } else {
                          return [
                            vueExports.createTextVNode(vueExports.toDisplayString(vueExports.unref(period).project?.name ?? "Toàn hệ thống"), 1)
                          ];
                        }
                      }),
                      _: 1
                    }, _parent3, _scopeId2));
                    _push3(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_SharedFieldDisplay, { label: "Khoảng thời gian" }, {
                      default: vueExports.withCtx((_3, _push4, _parent4, _scopeId3) => {
                        if (_push4) {
                          _push4(`${serverRenderer_cjs_prodExports.ssrInterpolate(("formatDate" in _ctx ? _ctx.formatDate : vueExports.unref(formatDate))(vueExports.unref(period).period_start))} — ${serverRenderer_cjs_prodExports.ssrInterpolate(("formatDate" in _ctx ? _ctx.formatDate : vueExports.unref(formatDate))(vueExports.unref(period).period_end))}`);
                        } else {
                          return [
                            vueExports.createTextVNode(vueExports.toDisplayString(("formatDate" in _ctx ? _ctx.formatDate : vueExports.unref(formatDate))(vueExports.unref(period).period_start)) + " — " + vueExports.toDisplayString(("formatDate" in _ctx ? _ctx.formatDate : vueExports.unref(formatDate))(vueExports.unref(period).period_end)), 1)
                          ];
                        }
                      }),
                      _: 1
                    }, _parent3, _scopeId2));
                    _push3(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_SharedFieldDisplay, { label: "Trạng thái" }, {
                      default: vueExports.withCtx((_3, _push4, _parent4, _scopeId3) => {
                        if (_push4) {
                          _push4(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UBadge, {
                            label: vueExports.unref(period).status.label,
                            color: ("closingPeriodStatusColor" in _ctx ? _ctx.closingPeriodStatusColor : vueExports.unref(closingPeriodStatusColor))(vueExports.unref(period).status.value),
                            variant: "subtle"
                          }, null, _parent4, _scopeId3));
                        } else {
                          return [
                            vueExports.createVNode(_component_UBadge, {
                              label: vueExports.unref(period).status.label,
                              color: ("closingPeriodStatusColor" in _ctx ? _ctx.closingPeriodStatusColor : vueExports.unref(closingPeriodStatusColor))(vueExports.unref(period).status.value),
                              variant: "subtle"
                            }, null, 8, ["label", "color"])
                          ];
                        }
                      }),
                      _: 1
                    }, _parent3, _scopeId2));
                    _push3(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_SharedFieldDisplay, { label: "Chốt lúc" }, {
                      default: vueExports.withCtx((_3, _push4, _parent4, _scopeId3) => {
                        if (_push4) {
                          _push4(`${serverRenderer_cjs_prodExports.ssrInterpolate(vueExports.unref(period).closed_at ? ("formatDateTime" in _ctx ? _ctx.formatDateTime : vueExports.unref(formatDateTime))(vueExports.unref(period).closed_at) : "—")}`);
                        } else {
                          return [
                            vueExports.createTextVNode(vueExports.toDisplayString(vueExports.unref(period).closed_at ? ("formatDateTime" in _ctx ? _ctx.formatDateTime : vueExports.unref(formatDateTime))(vueExports.unref(period).closed_at) : "—"), 1)
                          ];
                        }
                      }),
                      _: 1
                    }, _parent3, _scopeId2));
                    _push3(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_SharedFieldDisplay, { label: "Người chốt" }, {
                      default: vueExports.withCtx((_3, _push4, _parent4, _scopeId3) => {
                        if (_push4) {
                          _push4(`${serverRenderer_cjs_prodExports.ssrInterpolate(vueExports.unref(period).closed_by?.name ?? "—")}`);
                        } else {
                          return [
                            vueExports.createTextVNode(vueExports.toDisplayString(vueExports.unref(period).closed_by?.name ?? "—"), 1)
                          ];
                        }
                      }),
                      _: 1
                    }, _parent3, _scopeId2));
                    if (vueExports.unref(period).note) {
                      _push3(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_SharedFieldDisplay, {
                        label: "Ghi chú",
                        class: "col-span-2"
                      }, {
                        default: vueExports.withCtx((_3, _push4, _parent4, _scopeId3) => {
                          if (_push4) {
                            _push4(`${serverRenderer_cjs_prodExports.ssrInterpolate(vueExports.unref(period).note)}`);
                          } else {
                            return [
                              vueExports.createTextVNode(vueExports.toDisplayString(vueExports.unref(period).note), 1)
                            ];
                          }
                        }),
                        _: 1
                      }, _parent3, _scopeId2));
                    } else {
                      _push3(`<!---->`);
                    }
                    _push3(`</div>`);
                  } else {
                    return [
                      vueExports.createVNode("div", { class: "grid grid-cols-2 gap-4" }, [
                        vueExports.createVNode(_component_SharedFieldDisplay, { label: "Tên kỳ" }, {
                          default: vueExports.withCtx(() => [
                            vueExports.createTextVNode(vueExports.toDisplayString(vueExports.unref(period).name), 1)
                          ]),
                          _: 1
                        }),
                        vueExports.createVNode(_component_SharedFieldDisplay, { label: "Dự án" }, {
                          default: vueExports.withCtx(() => [
                            vueExports.createTextVNode(vueExports.toDisplayString(vueExports.unref(period).project?.name ?? "Toàn hệ thống"), 1)
                          ]),
                          _: 1
                        }),
                        vueExports.createVNode(_component_SharedFieldDisplay, { label: "Khoảng thời gian" }, {
                          default: vueExports.withCtx(() => [
                            vueExports.createTextVNode(vueExports.toDisplayString(("formatDate" in _ctx ? _ctx.formatDate : vueExports.unref(formatDate))(vueExports.unref(period).period_start)) + " — " + vueExports.toDisplayString(("formatDate" in _ctx ? _ctx.formatDate : vueExports.unref(formatDate))(vueExports.unref(period).period_end)), 1)
                          ]),
                          _: 1
                        }),
                        vueExports.createVNode(_component_SharedFieldDisplay, { label: "Trạng thái" }, {
                          default: vueExports.withCtx(() => [
                            vueExports.createVNode(_component_UBadge, {
                              label: vueExports.unref(period).status.label,
                              color: ("closingPeriodStatusColor" in _ctx ? _ctx.closingPeriodStatusColor : vueExports.unref(closingPeriodStatusColor))(vueExports.unref(period).status.value),
                              variant: "subtle"
                            }, null, 8, ["label", "color"])
                          ]),
                          _: 1
                        }),
                        vueExports.createVNode(_component_SharedFieldDisplay, { label: "Chốt lúc" }, {
                          default: vueExports.withCtx(() => [
                            vueExports.createTextVNode(vueExports.toDisplayString(vueExports.unref(period).closed_at ? ("formatDateTime" in _ctx ? _ctx.formatDateTime : vueExports.unref(formatDateTime))(vueExports.unref(period).closed_at) : "—"), 1)
                          ]),
                          _: 1
                        }),
                        vueExports.createVNode(_component_SharedFieldDisplay, { label: "Người chốt" }, {
                          default: vueExports.withCtx(() => [
                            vueExports.createTextVNode(vueExports.toDisplayString(vueExports.unref(period).closed_by?.name ?? "—"), 1)
                          ]),
                          _: 1
                        }),
                        vueExports.unref(period).note ? (vueExports.openBlock(), vueExports.createBlock(_component_SharedFieldDisplay, {
                          key: 0,
                          label: "Ghi chú",
                          class: "col-span-2"
                        }, {
                          default: vueExports.withCtx(() => [
                            vueExports.createTextVNode(vueExports.toDisplayString(vueExports.unref(period).note), 1)
                          ]),
                          _: 1
                        })) : vueExports.createCommentVNode("", true)
                      ])
                    ];
                  }
                }),
                _: 1
              }, _parent2, _scopeId));
              _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_SharedSectionCard, {
                title: `Đơn trong kỳ (${vueExports.unref(period).orders.length})`,
                compact: ""
              }, vueExports.createSlots({
                default: vueExports.withCtx((_2, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    if (vueExports.unref(period).orders.length === 0) {
                      _push3(`<div class="text-center py-8 text-slate-500"${_scopeId2}> Chưa có đơn nào trong kỳ này. Bấm &quot;Thêm đơn&quot; để thêm. </div>`);
                    } else {
                      _push3(`<div class="border rounded-lg overflow-hidden"${_scopeId2}><table class="w-full text-sm"${_scopeId2}><thead class="bg-slate-50 border-b"${_scopeId2}><tr${_scopeId2}><th class="px-3 py-2 text-left w-8"${_scopeId2}></th><th class="px-3 py-2 text-left font-medium text-slate-600"${_scopeId2}> Mã đơn </th><th class="px-3 py-2 text-right font-medium text-slate-600"${_scopeId2}> Phải thu (chốt) </th><th class="px-3 py-2 text-right font-medium text-slate-600"${_scopeId2}> Hoa hồng (chốt) </th>`);
                      if (vueExports.unref(isOpen)) {
                        _push3(`<th class="px-3 py-2 text-center font-medium text-slate-600 w-20"${_scopeId2}> Thao tác </th>`);
                      } else {
                        _push3(`<!---->`);
                      }
                      _push3(`</tr></thead><tbody${_scopeId2}><!--[-->`);
                      serverRenderer_cjs_prodExports.ssrRenderList(vueExports.unref(period).orders, (cpo) => {
                        _push3(`<!--[--><tr class="border-b hover:bg-slate-50 cursor-pointer"${_scopeId2}><td class="px-3 py-2"${_scopeId2}>`);
                        _push3(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UIcon, {
                          name: vueExports.unref(expandedRows).has(cpo.order.id) ? "i-lucide-chevron-down" : "i-lucide-chevron-right",
                          class: "size-4 text-slate-400"
                        }, null, _parent3, _scopeId2));
                        _push3(`</td><td class="px-3 py-2"${_scopeId2}>`);
                        _push3(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_NuxtLink, {
                          to: `/pmc/orders/${cpo.order.id}`,
                          class: "font-mono text-xs text-primary underline",
                          onClick: () => {
                          }
                        }, {
                          default: vueExports.withCtx((_3, _push4, _parent4, _scopeId3) => {
                            if (_push4) {
                              _push4(`${serverRenderer_cjs_prodExports.ssrInterpolate(cpo.order.code)}`);
                            } else {
                              return [
                                vueExports.createTextVNode(vueExports.toDisplayString(cpo.order.code), 1)
                              ];
                            }
                          }),
                          _: 2
                        }, _parent3, _scopeId2));
                        _push3(`</td><td class="px-3 py-2 text-right"${_scopeId2}>${serverRenderer_cjs_prodExports.ssrInterpolate(("formatCurrency" in _ctx ? _ctx.formatCurrency : vueExports.unref(formatCurrency))(cpo.frozen_receivable_amount))}</td><td class="px-3 py-2 text-right"${_scopeId2}>${serverRenderer_cjs_prodExports.ssrInterpolate(("formatCurrency" in _ctx ? _ctx.formatCurrency : vueExports.unref(formatCurrency))(getTopLevelCommission(cpo.snapshots)))}</td>`);
                        if (vueExports.unref(isOpen)) {
                          _push3(`<td class="px-3 py-2 text-center"${_scopeId2}>`);
                          _push3(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UButton, {
                            size: "xs",
                            variant: "ghost",
                            color: "error",
                            icon: "i-lucide-trash-2",
                            onClick: ($event) => openRemoveConfirm(cpo)
                          }, null, _parent3, _scopeId2));
                          _push3(`</td>`);
                        } else {
                          _push3(`<!---->`);
                        }
                        _push3(`</tr>`);
                        if (vueExports.unref(expandedRows).has(cpo.order.id)) {
                          _push3(`<tr${_scopeId2}><td${serverRenderer_cjs_prodExports.ssrRenderAttr("colspan", vueExports.unref(isOpen) ? 5 : 4)} class="px-0 py-0"${_scopeId2}><div class="bg-slate-50 px-6 py-3"${_scopeId2}><h4 class="text-xs font-semibold text-slate-500 mb-2"${_scopeId2}> Chi tiết hoa hồng </h4><table class="w-full text-xs"${_scopeId2}><thead${_scopeId2}><tr class="text-slate-500"${_scopeId2}><th class="px-2 py-1 text-left"${_scopeId2}> Bên nhận </th><th class="px-2 py-1 text-left"${_scopeId2}> Công thức </th><th class="px-2 py-1 text-right"${_scopeId2}> Số tiền HH </th><th class="px-2 py-1 text-center"${_scopeId2}> Nguồn </th></tr></thead><tbody${_scopeId2}><!--[-->`);
                          serverRenderer_cjs_prodExports.ssrRenderList(cpo.snapshots, (snap) => {
                            _push3(`<tr class="border-t border-slate-100"${_scopeId2}><td class="${serverRenderer_cjs_prodExports.ssrRenderClass([[
                              getSnapshotLevel(snap) === 0 && !isIntermediary(snap) ? "font-medium text-slate-900" : "",
                              isIntermediary(snap) ? "text-slate-600" : "",
                              getSnapshotLevel(snap) === 2 ? "text-slate-500" : ""
                            ], "px-2 py-1.5"])}"${_scopeId2}><div class="flex items-center gap-1.5" style="${serverRenderer_cjs_prodExports.ssrRenderStyle({ paddingLeft: `${getSnapshotLevel(snap) * 20}px` })}"${_scopeId2}>`);
                            if (getSnapshotLevel(snap) === 1) {
                              _push3(`<span class="text-slate-300"${_scopeId2}>├</span>`);
                            } else {
                              _push3(`<!---->`);
                            }
                            if (getSnapshotLevel(snap) === 2) {
                              _push3(`<span class="text-slate-300"${_scopeId2}>└</span>`);
                            } else {
                              _push3(`<!---->`);
                            }
                            _push3(`<span${_scopeId2}>${serverRenderer_cjs_prodExports.ssrInterpolate(snap.recipient_name)}</span></div></td><td class="px-2 py-1.5 font-mono text-slate-400"${_scopeId2}>${serverRenderer_cjs_prodExports.ssrInterpolate(buildSnapshotFormula(snap))}</td><td class="${serverRenderer_cjs_prodExports.ssrRenderClass([[
                              isIntermediary(snap) ? "text-slate-400" : "",
                              getSnapshotLevel(snap) === 0 && !isIntermediary(snap) ? "font-semibold text-slate-900" : "",
                              getSnapshotLevel(snap) === 2 ? "text-slate-500" : ""
                            ], "px-2 py-1.5 text-right font-mono tabular-nums"])}"${_scopeId2}>`);
                            if (isIntermediary(snap)) {
                              _push3(`<!--[--> — <!--]-->`);
                            } else {
                              _push3(`<!--[-->${serverRenderer_cjs_prodExports.ssrInterpolate(("formatCurrency" in _ctx ? _ctx.formatCurrency : vueExports.unref(formatCurrency))(snap.amount))}<!--]-->`);
                            }
                            _push3(`</td><td class="px-2 py-1.5 text-center"${_scopeId2}>`);
                            _push3(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UBadge, {
                              label: snap.resolved_from,
                              color: snap.resolved_from === "override" ? "warning" : "neutral",
                              variant: "subtle",
                              size: "xs"
                            }, null, _parent3, _scopeId2));
                            _push3(`</td></tr>`);
                          });
                          _push3(`<!--]--></tbody><tfoot${_scopeId2}><tr class="border-t-2 border-slate-300"${_scopeId2}><td colspan="2" class="px-2 py-1.5 text-right font-semibold text-slate-600"${_scopeId2}> Tổng hoa hồng </td><td class="px-2 py-1.5 text-right font-bold font-mono tabular-nums"${_scopeId2}>${serverRenderer_cjs_prodExports.ssrInterpolate(("formatCurrency" in _ctx ? _ctx.formatCurrency : vueExports.unref(formatCurrency))(getTopLevelCommission(cpo.snapshots)))}</td><td${_scopeId2}></td></tr></tfoot></table></div></td></tr>`);
                        } else {
                          _push3(`<!---->`);
                        }
                        _push3(`<!--]-->`);
                      });
                      _push3(`<!--]--></tbody></table></div>`);
                    }
                  } else {
                    return [
                      vueExports.unref(period).orders.length === 0 ? (vueExports.openBlock(), vueExports.createBlock("div", {
                        key: 0,
                        class: "text-center py-8 text-slate-500"
                      }, ' Chưa có đơn nào trong kỳ này. Bấm "Thêm đơn" để thêm. ')) : (vueExports.openBlock(), vueExports.createBlock("div", {
                        key: 1,
                        class: "border rounded-lg overflow-hidden"
                      }, [
                        vueExports.createVNode("table", { class: "w-full text-sm" }, [
                          vueExports.createVNode("thead", { class: "bg-slate-50 border-b" }, [
                            vueExports.createVNode("tr", null, [
                              vueExports.createVNode("th", { class: "px-3 py-2 text-left w-8" }),
                              vueExports.createVNode("th", { class: "px-3 py-2 text-left font-medium text-slate-600" }, " Mã đơn "),
                              vueExports.createVNode("th", { class: "px-3 py-2 text-right font-medium text-slate-600" }, " Phải thu (chốt) "),
                              vueExports.createVNode("th", { class: "px-3 py-2 text-right font-medium text-slate-600" }, " Hoa hồng (chốt) "),
                              vueExports.unref(isOpen) ? (vueExports.openBlock(), vueExports.createBlock("th", {
                                key: 0,
                                class: "px-3 py-2 text-center font-medium text-slate-600 w-20"
                              }, " Thao tác ")) : vueExports.createCommentVNode("", true)
                            ])
                          ]),
                          vueExports.createVNode("tbody", null, [
                            (vueExports.openBlock(true), vueExports.createBlock(vueExports.Fragment, null, vueExports.renderList(vueExports.unref(period).orders, (cpo) => {
                              return vueExports.openBlock(), vueExports.createBlock(vueExports.Fragment, {
                                key: cpo.id
                              }, [
                                vueExports.createVNode("tr", {
                                  class: "border-b hover:bg-slate-50 cursor-pointer",
                                  onClick: ($event) => toggleRow(cpo.order.id)
                                }, [
                                  vueExports.createVNode("td", { class: "px-3 py-2" }, [
                                    vueExports.createVNode(_component_UIcon, {
                                      name: vueExports.unref(expandedRows).has(cpo.order.id) ? "i-lucide-chevron-down" : "i-lucide-chevron-right",
                                      class: "size-4 text-slate-400"
                                    }, null, 8, ["name"])
                                  ]),
                                  vueExports.createVNode("td", { class: "px-3 py-2" }, [
                                    vueExports.createVNode(_component_NuxtLink, {
                                      to: `/pmc/orders/${cpo.order.id}`,
                                      class: "font-mono text-xs text-primary underline",
                                      onClick: vueExports.withModifiers(() => {
                                      }, ["stop"])
                                    }, {
                                      default: vueExports.withCtx(() => [
                                        vueExports.createTextVNode(vueExports.toDisplayString(cpo.order.code), 1)
                                      ]),
                                      _: 2
                                    }, 1032, ["to", "onClick"])
                                  ]),
                                  vueExports.createVNode("td", { class: "px-3 py-2 text-right" }, vueExports.toDisplayString(("formatCurrency" in _ctx ? _ctx.formatCurrency : vueExports.unref(formatCurrency))(cpo.frozen_receivable_amount)), 1),
                                  vueExports.createVNode("td", { class: "px-3 py-2 text-right" }, vueExports.toDisplayString(("formatCurrency" in _ctx ? _ctx.formatCurrency : vueExports.unref(formatCurrency))(getTopLevelCommission(cpo.snapshots))), 1),
                                  vueExports.unref(isOpen) ? (vueExports.openBlock(), vueExports.createBlock("td", {
                                    key: 0,
                                    class: "px-3 py-2 text-center"
                                  }, [
                                    vueExports.createVNode(_component_UButton, {
                                      size: "xs",
                                      variant: "ghost",
                                      color: "error",
                                      icon: "i-lucide-trash-2",
                                      onClick: vueExports.withModifiers(($event) => openRemoveConfirm(cpo), ["stop"])
                                    }, null, 8, ["onClick"])
                                  ])) : vueExports.createCommentVNode("", true)
                                ], 8, ["onClick"]),
                                vueExports.unref(expandedRows).has(cpo.order.id) ? (vueExports.openBlock(), vueExports.createBlock("tr", { key: 0 }, [
                                  vueExports.createVNode("td", {
                                    colspan: vueExports.unref(isOpen) ? 5 : 4,
                                    class: "px-0 py-0"
                                  }, [
                                    vueExports.createVNode("div", { class: "bg-slate-50 px-6 py-3" }, [
                                      vueExports.createVNode("h4", { class: "text-xs font-semibold text-slate-500 mb-2" }, " Chi tiết hoa hồng "),
                                      vueExports.createVNode("table", { class: "w-full text-xs" }, [
                                        vueExports.createVNode("thead", null, [
                                          vueExports.createVNode("tr", { class: "text-slate-500" }, [
                                            vueExports.createVNode("th", { class: "px-2 py-1 text-left" }, " Bên nhận "),
                                            vueExports.createVNode("th", { class: "px-2 py-1 text-left" }, " Công thức "),
                                            vueExports.createVNode("th", { class: "px-2 py-1 text-right" }, " Số tiền HH "),
                                            vueExports.createVNode("th", { class: "px-2 py-1 text-center" }, " Nguồn ")
                                          ])
                                        ]),
                                        vueExports.createVNode("tbody", null, [
                                          (vueExports.openBlock(true), vueExports.createBlock(vueExports.Fragment, null, vueExports.renderList(cpo.snapshots, (snap) => {
                                            return vueExports.openBlock(), vueExports.createBlock("tr", {
                                              key: snap.id,
                                              class: "border-t border-slate-100"
                                            }, [
                                              vueExports.createVNode("td", {
                                                class: ["px-2 py-1.5", [
                                                  getSnapshotLevel(snap) === 0 && !isIntermediary(snap) ? "font-medium text-slate-900" : "",
                                                  isIntermediary(snap) ? "text-slate-600" : "",
                                                  getSnapshotLevel(snap) === 2 ? "text-slate-500" : ""
                                                ]]
                                              }, [
                                                vueExports.createVNode("div", {
                                                  class: "flex items-center gap-1.5",
                                                  style: { paddingLeft: `${getSnapshotLevel(snap) * 20}px` }
                                                }, [
                                                  getSnapshotLevel(snap) === 1 ? (vueExports.openBlock(), vueExports.createBlock("span", {
                                                    key: 0,
                                                    class: "text-slate-300"
                                                  }, "├")) : vueExports.createCommentVNode("", true),
                                                  getSnapshotLevel(snap) === 2 ? (vueExports.openBlock(), vueExports.createBlock("span", {
                                                    key: 1,
                                                    class: "text-slate-300"
                                                  }, "└")) : vueExports.createCommentVNode("", true),
                                                  vueExports.createVNode("span", null, vueExports.toDisplayString(snap.recipient_name), 1)
                                                ], 4)
                                              ], 2),
                                              vueExports.createVNode("td", { class: "px-2 py-1.5 font-mono text-slate-400" }, vueExports.toDisplayString(buildSnapshotFormula(snap)), 1),
                                              vueExports.createVNode("td", {
                                                class: ["px-2 py-1.5 text-right font-mono tabular-nums", [
                                                  isIntermediary(snap) ? "text-slate-400" : "",
                                                  getSnapshotLevel(snap) === 0 && !isIntermediary(snap) ? "font-semibold text-slate-900" : "",
                                                  getSnapshotLevel(snap) === 2 ? "text-slate-500" : ""
                                                ]]
                                              }, [
                                                isIntermediary(snap) ? (vueExports.openBlock(), vueExports.createBlock(vueExports.Fragment, { key: 0 }, [
                                                  vueExports.createTextVNode(" — ")
                                                ], 64)) : (vueExports.openBlock(), vueExports.createBlock(vueExports.Fragment, { key: 1 }, [
                                                  vueExports.createTextVNode(vueExports.toDisplayString(("formatCurrency" in _ctx ? _ctx.formatCurrency : vueExports.unref(formatCurrency))(snap.amount)), 1)
                                                ], 64))
                                              ], 2),
                                              vueExports.createVNode("td", { class: "px-2 py-1.5 text-center" }, [
                                                vueExports.createVNode(_component_UBadge, {
                                                  label: snap.resolved_from,
                                                  color: snap.resolved_from === "override" ? "warning" : "neutral",
                                                  variant: "subtle",
                                                  size: "xs"
                                                }, null, 8, ["label", "color"])
                                              ])
                                            ]);
                                          }), 128))
                                        ]),
                                        vueExports.createVNode("tfoot", null, [
                                          vueExports.createVNode("tr", { class: "border-t-2 border-slate-300" }, [
                                            vueExports.createVNode("td", {
                                              colspan: "2",
                                              class: "px-2 py-1.5 text-right font-semibold text-slate-600"
                                            }, " Tổng hoa hồng "),
                                            vueExports.createVNode("td", { class: "px-2 py-1.5 text-right font-bold font-mono tabular-nums" }, vueExports.toDisplayString(("formatCurrency" in _ctx ? _ctx.formatCurrency : vueExports.unref(formatCurrency))(getTopLevelCommission(cpo.snapshots))), 1),
                                            vueExports.createVNode("td")
                                          ])
                                        ])
                                      ])
                                    ])
                                  ], 8, ["colspan"])
                                ])) : vueExports.createCommentVNode("", true)
                              ], 64);
                            }), 128))
                          ])
                        ])
                      ]))
                    ];
                  }
                }),
                _: 2
              }, [
                vueExports.unref(isOpen) ? {
                  name: "header-actions",
                  fn: vueExports.withCtx((_2, _push3, _parent3, _scopeId2) => {
                    if (_push3) {
                      _push3(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UButton, {
                        size: "xs",
                        icon: "i-lucide-plus",
                        label: "Thêm đơn",
                        onClick: openAddOrdersModal
                      }, null, _parent3, _scopeId2));
                    } else {
                      return [
                        vueExports.createVNode(_component_UButton, {
                          size: "xs",
                          icon: "i-lucide-plus",
                          label: "Thêm đơn",
                          onClick: openAddOrdersModal
                        })
                      ];
                    }
                  }),
                  key: "0"
                } : void 0
              ]), _parent2, _scopeId));
              _push2(`</div><div class="space-y-6"${_scopeId}>`);
              _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_SharedSectionCard, {
                title: "Hành động",
                compact: ""
              }, {
                default: vueExports.withCtx((_2, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    if (vueExports.unref(isOpen)) {
                      _push3(`<div class="space-y-3"${_scopeId2}>`);
                      _push3(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UTextarea, {
                        modelValue: vueExports.unref(actionNote),
                        "onUpdate:modelValue": ($event) => vueExports.isRef(actionNote) ? actionNote.value = $event : null,
                        placeholder: "Ghi chú khi chốt...",
                        class: "w-full",
                        rows: 3
                      }, null, _parent3, _scopeId2));
                      _push3(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UButton, {
                        color: "success",
                        icon: "i-lucide-lock",
                        label: "Chốt kỳ",
                        block: "",
                        onClick: ($event) => showCloseConfirm.value = true
                      }, null, _parent3, _scopeId2));
                      _push3(`</div>`);
                    } else {
                      _push3(`<div class="space-y-3"${_scopeId2}>`);
                      _push3(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UTextarea, {
                        modelValue: vueExports.unref(actionNote),
                        "onUpdate:modelValue": ($event) => vueExports.isRef(actionNote) ? actionNote.value = $event : null,
                        placeholder: "Lý do mở lại...",
                        class: "w-full",
                        rows: 3
                      }, null, _parent3, _scopeId2));
                      _push3(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UButton, {
                        color: "warning",
                        variant: "outline",
                        icon: "i-lucide-unlock",
                        label: "Mở lại",
                        block: "",
                        onClick: ($event) => showReopenConfirm.value = true
                      }, null, _parent3, _scopeId2));
                      _push3(`</div>`);
                    }
                  } else {
                    return [
                      vueExports.unref(isOpen) ? (vueExports.openBlock(), vueExports.createBlock("div", {
                        key: 0,
                        class: "space-y-3"
                      }, [
                        vueExports.createVNode(_component_UTextarea, {
                          modelValue: vueExports.unref(actionNote),
                          "onUpdate:modelValue": ($event) => vueExports.isRef(actionNote) ? actionNote.value = $event : null,
                          placeholder: "Ghi chú khi chốt...",
                          class: "w-full",
                          rows: 3
                        }, null, 8, ["modelValue", "onUpdate:modelValue"]),
                        vueExports.createVNode(_component_UButton, {
                          color: "success",
                          icon: "i-lucide-lock",
                          label: "Chốt kỳ",
                          block: "",
                          onClick: ($event) => showCloseConfirm.value = true
                        }, null, 8, ["onClick"])
                      ])) : (vueExports.openBlock(), vueExports.createBlock("div", {
                        key: 1,
                        class: "space-y-3"
                      }, [
                        vueExports.createVNode(_component_UTextarea, {
                          modelValue: vueExports.unref(actionNote),
                          "onUpdate:modelValue": ($event) => vueExports.isRef(actionNote) ? actionNote.value = $event : null,
                          placeholder: "Lý do mở lại...",
                          class: "w-full",
                          rows: 3
                        }, null, 8, ["modelValue", "onUpdate:modelValue"]),
                        vueExports.createVNode(_component_UButton, {
                          color: "warning",
                          variant: "outline",
                          icon: "i-lucide-unlock",
                          label: "Mở lại",
                          block: "",
                          onClick: ($event) => showReopenConfirm.value = true
                        }, null, 8, ["onClick"])
                      ]))
                    ];
                  }
                }),
                _: 1
              }, _parent2, _scopeId));
              _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_SharedSectionCard, {
                title: "Tổng hợp",
                compact: ""
              }, {
                default: vueExports.withCtx((_2, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    _push3(`<div class="space-y-3"${_scopeId2}>`);
                    _push3(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_SharedFieldDisplay, { label: "Số đơn" }, {
                      default: vueExports.withCtx((_3, _push4, _parent4, _scopeId3) => {
                        if (_push4) {
                          _push4(`${serverRenderer_cjs_prodExports.ssrInterpolate(vueExports.unref(period).orders.length)}`);
                        } else {
                          return [
                            vueExports.createTextVNode(vueExports.toDisplayString(vueExports.unref(period).orders.length), 1)
                          ];
                        }
                      }),
                      _: 1
                    }, _parent3, _scopeId2));
                    _push3(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_SharedFieldDisplay, { label: "Tổng phải thu" }, {
                      default: vueExports.withCtx((_3, _push4, _parent4, _scopeId3) => {
                        if (_push4) {
                          _push4(`${serverRenderer_cjs_prodExports.ssrInterpolate(("formatCurrency" in _ctx ? _ctx.formatCurrency : vueExports.unref(formatCurrency))(vueExports.unref(totalReceivable)))}`);
                        } else {
                          return [
                            vueExports.createTextVNode(vueExports.toDisplayString(("formatCurrency" in _ctx ? _ctx.formatCurrency : vueExports.unref(formatCurrency))(vueExports.unref(totalReceivable))), 1)
                          ];
                        }
                      }),
                      _: 1
                    }, _parent3, _scopeId2));
                    _push3(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_SharedFieldDisplay, { label: "Tổng hoa hồng" }, {
                      default: vueExports.withCtx((_3, _push4, _parent4, _scopeId3) => {
                        if (_push4) {
                          _push4(`${serverRenderer_cjs_prodExports.ssrInterpolate(("formatCurrency" in _ctx ? _ctx.formatCurrency : vueExports.unref(formatCurrency))(vueExports.unref(totalCommission)))}`);
                        } else {
                          return [
                            vueExports.createTextVNode(vueExports.toDisplayString(("formatCurrency" in _ctx ? _ctx.formatCurrency : vueExports.unref(formatCurrency))(vueExports.unref(totalCommission))), 1)
                          ];
                        }
                      }),
                      _: 1
                    }, _parent3, _scopeId2));
                    _push3(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_SharedFieldDisplay, { label: "Tạo lúc" }, {
                      default: vueExports.withCtx((_3, _push4, _parent4, _scopeId3) => {
                        if (_push4) {
                          _push4(`${serverRenderer_cjs_prodExports.ssrInterpolate(("formatDateTime" in _ctx ? _ctx.formatDateTime : vueExports.unref(formatDateTime))(vueExports.unref(period).created_at))}`);
                        } else {
                          return [
                            vueExports.createTextVNode(vueExports.toDisplayString(("formatDateTime" in _ctx ? _ctx.formatDateTime : vueExports.unref(formatDateTime))(vueExports.unref(period).created_at)), 1)
                          ];
                        }
                      }),
                      _: 1
                    }, _parent3, _scopeId2));
                    _push3(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_SharedFieldDisplay, { label: "Cập nhật" }, {
                      default: vueExports.withCtx((_3, _push4, _parent4, _scopeId3) => {
                        if (_push4) {
                          _push4(`${serverRenderer_cjs_prodExports.ssrInterpolate(("formatDateTime" in _ctx ? _ctx.formatDateTime : vueExports.unref(formatDateTime))(vueExports.unref(period).updated_at))}`);
                        } else {
                          return [
                            vueExports.createTextVNode(vueExports.toDisplayString(("formatDateTime" in _ctx ? _ctx.formatDateTime : vueExports.unref(formatDateTime))(vueExports.unref(period).updated_at)), 1)
                          ];
                        }
                      }),
                      _: 1
                    }, _parent3, _scopeId2));
                    _push3(`</div>`);
                  } else {
                    return [
                      vueExports.createVNode("div", { class: "space-y-3" }, [
                        vueExports.createVNode(_component_SharedFieldDisplay, { label: "Số đơn" }, {
                          default: vueExports.withCtx(() => [
                            vueExports.createTextVNode(vueExports.toDisplayString(vueExports.unref(period).orders.length), 1)
                          ]),
                          _: 1
                        }),
                        vueExports.createVNode(_component_SharedFieldDisplay, { label: "Tổng phải thu" }, {
                          default: vueExports.withCtx(() => [
                            vueExports.createTextVNode(vueExports.toDisplayString(("formatCurrency" in _ctx ? _ctx.formatCurrency : vueExports.unref(formatCurrency))(vueExports.unref(totalReceivable))), 1)
                          ]),
                          _: 1
                        }),
                        vueExports.createVNode(_component_SharedFieldDisplay, { label: "Tổng hoa hồng" }, {
                          default: vueExports.withCtx(() => [
                            vueExports.createTextVNode(vueExports.toDisplayString(("formatCurrency" in _ctx ? _ctx.formatCurrency : vueExports.unref(formatCurrency))(vueExports.unref(totalCommission))), 1)
                          ]),
                          _: 1
                        }),
                        vueExports.createVNode(_component_SharedFieldDisplay, { label: "Tạo lúc" }, {
                          default: vueExports.withCtx(() => [
                            vueExports.createTextVNode(vueExports.toDisplayString(("formatDateTime" in _ctx ? _ctx.formatDateTime : vueExports.unref(formatDateTime))(vueExports.unref(period).created_at)), 1)
                          ]),
                          _: 1
                        }),
                        vueExports.createVNode(_component_SharedFieldDisplay, { label: "Cập nhật" }, {
                          default: vueExports.withCtx(() => [
                            vueExports.createTextVNode(vueExports.toDisplayString(("formatDateTime" in _ctx ? _ctx.formatDateTime : vueExports.unref(formatDateTime))(vueExports.unref(period).updated_at)), 1)
                          ]),
                          _: 1
                        })
                      ])
                    ];
                  }
                }),
                _: 1
              }, _parent2, _scopeId));
              _push2(`</div></div>`);
            } else {
              _push2(`<!---->`);
            }
          } else {
            return [
              vueExports.unref(period) ? (vueExports.openBlock(), vueExports.createBlock("div", {
                key: 0,
                class: "grid grid-cols-1 lg:grid-cols-3 gap-6"
              }, [
                vueExports.createVNode("div", { class: "lg:col-span-2 space-y-6" }, [
                  vueExports.unref(isOpen) ? (vueExports.openBlock(), vueExports.createBlock(_component_UAlert, {
                    key: 0,
                    color: "info",
                    variant: "subtle",
                    title: "Kỳ đang mở",
                    description: "Có thể thêm/bớt đơn. Khi chốt, tất cả đơn sẽ bị khóa tài chính."
                  })) : (vueExports.openBlock(), vueExports.createBlock(_component_UAlert, {
                    key: 1,
                    color: "success",
                    variant: "subtle",
                    title: "Đã chốt",
                    description: `Kỳ đã chốt lúc ${("formatDateTime" in _ctx ? _ctx.formatDateTime : vueExports.unref(formatDateTime))(vueExports.unref(period).closed_at)} bởi ${vueExports.unref(period).closed_by?.name ?? "—"}. Tất cả đơn trong kỳ bị khóa tài chính.`
                  }, null, 8, ["description"])),
                  vueExports.createVNode(_component_SharedSectionCard, {
                    title: "Thông tin kỳ chốt",
                    compact: ""
                  }, {
                    default: vueExports.withCtx(() => [
                      vueExports.createVNode("div", { class: "grid grid-cols-2 gap-4" }, [
                        vueExports.createVNode(_component_SharedFieldDisplay, { label: "Tên kỳ" }, {
                          default: vueExports.withCtx(() => [
                            vueExports.createTextVNode(vueExports.toDisplayString(vueExports.unref(period).name), 1)
                          ]),
                          _: 1
                        }),
                        vueExports.createVNode(_component_SharedFieldDisplay, { label: "Dự án" }, {
                          default: vueExports.withCtx(() => [
                            vueExports.createTextVNode(vueExports.toDisplayString(vueExports.unref(period).project?.name ?? "Toàn hệ thống"), 1)
                          ]),
                          _: 1
                        }),
                        vueExports.createVNode(_component_SharedFieldDisplay, { label: "Khoảng thời gian" }, {
                          default: vueExports.withCtx(() => [
                            vueExports.createTextVNode(vueExports.toDisplayString(("formatDate" in _ctx ? _ctx.formatDate : vueExports.unref(formatDate))(vueExports.unref(period).period_start)) + " — " + vueExports.toDisplayString(("formatDate" in _ctx ? _ctx.formatDate : vueExports.unref(formatDate))(vueExports.unref(period).period_end)), 1)
                          ]),
                          _: 1
                        }),
                        vueExports.createVNode(_component_SharedFieldDisplay, { label: "Trạng thái" }, {
                          default: vueExports.withCtx(() => [
                            vueExports.createVNode(_component_UBadge, {
                              label: vueExports.unref(period).status.label,
                              color: ("closingPeriodStatusColor" in _ctx ? _ctx.closingPeriodStatusColor : vueExports.unref(closingPeriodStatusColor))(vueExports.unref(period).status.value),
                              variant: "subtle"
                            }, null, 8, ["label", "color"])
                          ]),
                          _: 1
                        }),
                        vueExports.createVNode(_component_SharedFieldDisplay, { label: "Chốt lúc" }, {
                          default: vueExports.withCtx(() => [
                            vueExports.createTextVNode(vueExports.toDisplayString(vueExports.unref(period).closed_at ? ("formatDateTime" in _ctx ? _ctx.formatDateTime : vueExports.unref(formatDateTime))(vueExports.unref(period).closed_at) : "—"), 1)
                          ]),
                          _: 1
                        }),
                        vueExports.createVNode(_component_SharedFieldDisplay, { label: "Người chốt" }, {
                          default: vueExports.withCtx(() => [
                            vueExports.createTextVNode(vueExports.toDisplayString(vueExports.unref(period).closed_by?.name ?? "—"), 1)
                          ]),
                          _: 1
                        }),
                        vueExports.unref(period).note ? (vueExports.openBlock(), vueExports.createBlock(_component_SharedFieldDisplay, {
                          key: 0,
                          label: "Ghi chú",
                          class: "col-span-2"
                        }, {
                          default: vueExports.withCtx(() => [
                            vueExports.createTextVNode(vueExports.toDisplayString(vueExports.unref(period).note), 1)
                          ]),
                          _: 1
                        })) : vueExports.createCommentVNode("", true)
                      ])
                    ]),
                    _: 1
                  }),
                  vueExports.createVNode(_component_SharedSectionCard, {
                    title: `Đơn trong kỳ (${vueExports.unref(period).orders.length})`,
                    compact: ""
                  }, vueExports.createSlots({
                    default: vueExports.withCtx(() => [
                      vueExports.unref(period).orders.length === 0 ? (vueExports.openBlock(), vueExports.createBlock("div", {
                        key: 0,
                        class: "text-center py-8 text-slate-500"
                      }, ' Chưa có đơn nào trong kỳ này. Bấm "Thêm đơn" để thêm. ')) : (vueExports.openBlock(), vueExports.createBlock("div", {
                        key: 1,
                        class: "border rounded-lg overflow-hidden"
                      }, [
                        vueExports.createVNode("table", { class: "w-full text-sm" }, [
                          vueExports.createVNode("thead", { class: "bg-slate-50 border-b" }, [
                            vueExports.createVNode("tr", null, [
                              vueExports.createVNode("th", { class: "px-3 py-2 text-left w-8" }),
                              vueExports.createVNode("th", { class: "px-3 py-2 text-left font-medium text-slate-600" }, " Mã đơn "),
                              vueExports.createVNode("th", { class: "px-3 py-2 text-right font-medium text-slate-600" }, " Phải thu (chốt) "),
                              vueExports.createVNode("th", { class: "px-3 py-2 text-right font-medium text-slate-600" }, " Hoa hồng (chốt) "),
                              vueExports.unref(isOpen) ? (vueExports.openBlock(), vueExports.createBlock("th", {
                                key: 0,
                                class: "px-3 py-2 text-center font-medium text-slate-600 w-20"
                              }, " Thao tác ")) : vueExports.createCommentVNode("", true)
                            ])
                          ]),
                          vueExports.createVNode("tbody", null, [
                            (vueExports.openBlock(true), vueExports.createBlock(vueExports.Fragment, null, vueExports.renderList(vueExports.unref(period).orders, (cpo) => {
                              return vueExports.openBlock(), vueExports.createBlock(vueExports.Fragment, {
                                key: cpo.id
                              }, [
                                vueExports.createVNode("tr", {
                                  class: "border-b hover:bg-slate-50 cursor-pointer",
                                  onClick: ($event) => toggleRow(cpo.order.id)
                                }, [
                                  vueExports.createVNode("td", { class: "px-3 py-2" }, [
                                    vueExports.createVNode(_component_UIcon, {
                                      name: vueExports.unref(expandedRows).has(cpo.order.id) ? "i-lucide-chevron-down" : "i-lucide-chevron-right",
                                      class: "size-4 text-slate-400"
                                    }, null, 8, ["name"])
                                  ]),
                                  vueExports.createVNode("td", { class: "px-3 py-2" }, [
                                    vueExports.createVNode(_component_NuxtLink, {
                                      to: `/pmc/orders/${cpo.order.id}`,
                                      class: "font-mono text-xs text-primary underline",
                                      onClick: vueExports.withModifiers(() => {
                                      }, ["stop"])
                                    }, {
                                      default: vueExports.withCtx(() => [
                                        vueExports.createTextVNode(vueExports.toDisplayString(cpo.order.code), 1)
                                      ]),
                                      _: 2
                                    }, 1032, ["to", "onClick"])
                                  ]),
                                  vueExports.createVNode("td", { class: "px-3 py-2 text-right" }, vueExports.toDisplayString(("formatCurrency" in _ctx ? _ctx.formatCurrency : vueExports.unref(formatCurrency))(cpo.frozen_receivable_amount)), 1),
                                  vueExports.createVNode("td", { class: "px-3 py-2 text-right" }, vueExports.toDisplayString(("formatCurrency" in _ctx ? _ctx.formatCurrency : vueExports.unref(formatCurrency))(getTopLevelCommission(cpo.snapshots))), 1),
                                  vueExports.unref(isOpen) ? (vueExports.openBlock(), vueExports.createBlock("td", {
                                    key: 0,
                                    class: "px-3 py-2 text-center"
                                  }, [
                                    vueExports.createVNode(_component_UButton, {
                                      size: "xs",
                                      variant: "ghost",
                                      color: "error",
                                      icon: "i-lucide-trash-2",
                                      onClick: vueExports.withModifiers(($event) => openRemoveConfirm(cpo), ["stop"])
                                    }, null, 8, ["onClick"])
                                  ])) : vueExports.createCommentVNode("", true)
                                ], 8, ["onClick"]),
                                vueExports.unref(expandedRows).has(cpo.order.id) ? (vueExports.openBlock(), vueExports.createBlock("tr", { key: 0 }, [
                                  vueExports.createVNode("td", {
                                    colspan: vueExports.unref(isOpen) ? 5 : 4,
                                    class: "px-0 py-0"
                                  }, [
                                    vueExports.createVNode("div", { class: "bg-slate-50 px-6 py-3" }, [
                                      vueExports.createVNode("h4", { class: "text-xs font-semibold text-slate-500 mb-2" }, " Chi tiết hoa hồng "),
                                      vueExports.createVNode("table", { class: "w-full text-xs" }, [
                                        vueExports.createVNode("thead", null, [
                                          vueExports.createVNode("tr", { class: "text-slate-500" }, [
                                            vueExports.createVNode("th", { class: "px-2 py-1 text-left" }, " Bên nhận "),
                                            vueExports.createVNode("th", { class: "px-2 py-1 text-left" }, " Công thức "),
                                            vueExports.createVNode("th", { class: "px-2 py-1 text-right" }, " Số tiền HH "),
                                            vueExports.createVNode("th", { class: "px-2 py-1 text-center" }, " Nguồn ")
                                          ])
                                        ]),
                                        vueExports.createVNode("tbody", null, [
                                          (vueExports.openBlock(true), vueExports.createBlock(vueExports.Fragment, null, vueExports.renderList(cpo.snapshots, (snap) => {
                                            return vueExports.openBlock(), vueExports.createBlock("tr", {
                                              key: snap.id,
                                              class: "border-t border-slate-100"
                                            }, [
                                              vueExports.createVNode("td", {
                                                class: ["px-2 py-1.5", [
                                                  getSnapshotLevel(snap) === 0 && !isIntermediary(snap) ? "font-medium text-slate-900" : "",
                                                  isIntermediary(snap) ? "text-slate-600" : "",
                                                  getSnapshotLevel(snap) === 2 ? "text-slate-500" : ""
                                                ]]
                                              }, [
                                                vueExports.createVNode("div", {
                                                  class: "flex items-center gap-1.5",
                                                  style: { paddingLeft: `${getSnapshotLevel(snap) * 20}px` }
                                                }, [
                                                  getSnapshotLevel(snap) === 1 ? (vueExports.openBlock(), vueExports.createBlock("span", {
                                                    key: 0,
                                                    class: "text-slate-300"
                                                  }, "├")) : vueExports.createCommentVNode("", true),
                                                  getSnapshotLevel(snap) === 2 ? (vueExports.openBlock(), vueExports.createBlock("span", {
                                                    key: 1,
                                                    class: "text-slate-300"
                                                  }, "└")) : vueExports.createCommentVNode("", true),
                                                  vueExports.createVNode("span", null, vueExports.toDisplayString(snap.recipient_name), 1)
                                                ], 4)
                                              ], 2),
                                              vueExports.createVNode("td", { class: "px-2 py-1.5 font-mono text-slate-400" }, vueExports.toDisplayString(buildSnapshotFormula(snap)), 1),
                                              vueExports.createVNode("td", {
                                                class: ["px-2 py-1.5 text-right font-mono tabular-nums", [
                                                  isIntermediary(snap) ? "text-slate-400" : "",
                                                  getSnapshotLevel(snap) === 0 && !isIntermediary(snap) ? "font-semibold text-slate-900" : "",
                                                  getSnapshotLevel(snap) === 2 ? "text-slate-500" : ""
                                                ]]
                                              }, [
                                                isIntermediary(snap) ? (vueExports.openBlock(), vueExports.createBlock(vueExports.Fragment, { key: 0 }, [
                                                  vueExports.createTextVNode(" — ")
                                                ], 64)) : (vueExports.openBlock(), vueExports.createBlock(vueExports.Fragment, { key: 1 }, [
                                                  vueExports.createTextVNode(vueExports.toDisplayString(("formatCurrency" in _ctx ? _ctx.formatCurrency : vueExports.unref(formatCurrency))(snap.amount)), 1)
                                                ], 64))
                                              ], 2),
                                              vueExports.createVNode("td", { class: "px-2 py-1.5 text-center" }, [
                                                vueExports.createVNode(_component_UBadge, {
                                                  label: snap.resolved_from,
                                                  color: snap.resolved_from === "override" ? "warning" : "neutral",
                                                  variant: "subtle",
                                                  size: "xs"
                                                }, null, 8, ["label", "color"])
                                              ])
                                            ]);
                                          }), 128))
                                        ]),
                                        vueExports.createVNode("tfoot", null, [
                                          vueExports.createVNode("tr", { class: "border-t-2 border-slate-300" }, [
                                            vueExports.createVNode("td", {
                                              colspan: "2",
                                              class: "px-2 py-1.5 text-right font-semibold text-slate-600"
                                            }, " Tổng hoa hồng "),
                                            vueExports.createVNode("td", { class: "px-2 py-1.5 text-right font-bold font-mono tabular-nums" }, vueExports.toDisplayString(("formatCurrency" in _ctx ? _ctx.formatCurrency : vueExports.unref(formatCurrency))(getTopLevelCommission(cpo.snapshots))), 1),
                                            vueExports.createVNode("td")
                                          ])
                                        ])
                                      ])
                                    ])
                                  ], 8, ["colspan"])
                                ])) : vueExports.createCommentVNode("", true)
                              ], 64);
                            }), 128))
                          ])
                        ])
                      ]))
                    ]),
                    _: 2
                  }, [
                    vueExports.unref(isOpen) ? {
                      name: "header-actions",
                      fn: vueExports.withCtx(() => [
                        vueExports.createVNode(_component_UButton, {
                          size: "xs",
                          icon: "i-lucide-plus",
                          label: "Thêm đơn",
                          onClick: openAddOrdersModal
                        })
                      ]),
                      key: "0"
                    } : void 0
                  ]), 1032, ["title"])
                ]),
                vueExports.createVNode("div", { class: "space-y-6" }, [
                  vueExports.createVNode(_component_SharedSectionCard, {
                    title: "Hành động",
                    compact: ""
                  }, {
                    default: vueExports.withCtx(() => [
                      vueExports.unref(isOpen) ? (vueExports.openBlock(), vueExports.createBlock("div", {
                        key: 0,
                        class: "space-y-3"
                      }, [
                        vueExports.createVNode(_component_UTextarea, {
                          modelValue: vueExports.unref(actionNote),
                          "onUpdate:modelValue": ($event) => vueExports.isRef(actionNote) ? actionNote.value = $event : null,
                          placeholder: "Ghi chú khi chốt...",
                          class: "w-full",
                          rows: 3
                        }, null, 8, ["modelValue", "onUpdate:modelValue"]),
                        vueExports.createVNode(_component_UButton, {
                          color: "success",
                          icon: "i-lucide-lock",
                          label: "Chốt kỳ",
                          block: "",
                          onClick: ($event) => showCloseConfirm.value = true
                        }, null, 8, ["onClick"])
                      ])) : (vueExports.openBlock(), vueExports.createBlock("div", {
                        key: 1,
                        class: "space-y-3"
                      }, [
                        vueExports.createVNode(_component_UTextarea, {
                          modelValue: vueExports.unref(actionNote),
                          "onUpdate:modelValue": ($event) => vueExports.isRef(actionNote) ? actionNote.value = $event : null,
                          placeholder: "Lý do mở lại...",
                          class: "w-full",
                          rows: 3
                        }, null, 8, ["modelValue", "onUpdate:modelValue"]),
                        vueExports.createVNode(_component_UButton, {
                          color: "warning",
                          variant: "outline",
                          icon: "i-lucide-unlock",
                          label: "Mở lại",
                          block: "",
                          onClick: ($event) => showReopenConfirm.value = true
                        }, null, 8, ["onClick"])
                      ]))
                    ]),
                    _: 1
                  }),
                  vueExports.createVNode(_component_SharedSectionCard, {
                    title: "Tổng hợp",
                    compact: ""
                  }, {
                    default: vueExports.withCtx(() => [
                      vueExports.createVNode("div", { class: "space-y-3" }, [
                        vueExports.createVNode(_component_SharedFieldDisplay, { label: "Số đơn" }, {
                          default: vueExports.withCtx(() => [
                            vueExports.createTextVNode(vueExports.toDisplayString(vueExports.unref(period).orders.length), 1)
                          ]),
                          _: 1
                        }),
                        vueExports.createVNode(_component_SharedFieldDisplay, { label: "Tổng phải thu" }, {
                          default: vueExports.withCtx(() => [
                            vueExports.createTextVNode(vueExports.toDisplayString(("formatCurrency" in _ctx ? _ctx.formatCurrency : vueExports.unref(formatCurrency))(vueExports.unref(totalReceivable))), 1)
                          ]),
                          _: 1
                        }),
                        vueExports.createVNode(_component_SharedFieldDisplay, { label: "Tổng hoa hồng" }, {
                          default: vueExports.withCtx(() => [
                            vueExports.createTextVNode(vueExports.toDisplayString(("formatCurrency" in _ctx ? _ctx.formatCurrency : vueExports.unref(formatCurrency))(vueExports.unref(totalCommission))), 1)
                          ]),
                          _: 1
                        }),
                        vueExports.createVNode(_component_SharedFieldDisplay, { label: "Tạo lúc" }, {
                          default: vueExports.withCtx(() => [
                            vueExports.createTextVNode(vueExports.toDisplayString(("formatDateTime" in _ctx ? _ctx.formatDateTime : vueExports.unref(formatDateTime))(vueExports.unref(period).created_at)), 1)
                          ]),
                          _: 1
                        }),
                        vueExports.createVNode(_component_SharedFieldDisplay, { label: "Cập nhật" }, {
                          default: vueExports.withCtx(() => [
                            vueExports.createTextVNode(vueExports.toDisplayString(("formatDateTime" in _ctx ? _ctx.formatDateTime : vueExports.unref(formatDateTime))(vueExports.unref(period).updated_at)), 1)
                          ]),
                          _: 1
                        })
                      ])
                    ]),
                    _: 1
                  })
                ])
              ])) : vueExports.createCommentVNode("", true)
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UModal, {
        open: vueExports.unref(showAddOrdersModal),
        "onUpdate:open": ($event) => vueExports.isRef(showAddOrdersModal) ? showAddOrdersModal.value = $event : null,
        title: `Thêm đơn vào kỳ '${vueExports.unref(period)?.name ?? ""}'`
      }, {
        body: vueExports.withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UAlert, {
              color: "info",
              variant: "subtle",
              title: "Chỉ hiển thị đơn đã hoàn thành và thu hết công nợ, chưa thuộc kỳ chốt nào.",
              class: "mb-4"
            }, null, _parent2, _scopeId));
            if (vueExports.unref(eligibleQuery).status.value === "pending") {
              _push2(`<div class="flex justify-center py-8"${_scopeId}>`);
              _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UIcon, {
                name: "i-lucide-loader-circle",
                class: "size-6 animate-spin text-[var(--ui-primary)]"
              }, null, _parent2, _scopeId));
              _push2(`</div>`);
            } else if (vueExports.unref(eligibleOrders).length === 0) {
              _push2(`<div class="text-center py-8 text-slate-500"${_scopeId}> Không có đơn nào đủ điều kiện. </div>`);
            } else {
              _push2(`<div class="border rounded-lg overflow-hidden"${_scopeId}><table class="w-full text-sm"${_scopeId}><thead class="bg-slate-50 border-b"${_scopeId}><tr${_scopeId}><th class="px-3 py-2 text-left w-10"${_scopeId}>`);
              _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UCheckbox, {
                "model-value": vueExports.unref(selectedOrderIds).size === vueExports.unref(eligibleOrders).length && vueExports.unref(eligibleOrders).length > 0,
                "onUpdate:modelValue": toggleAllOrders
              }, null, _parent2, _scopeId));
              _push2(`</th><th class="px-3 py-2 text-left font-medium text-slate-600"${_scopeId}> Mã đơn </th><th class="px-3 py-2 text-right font-medium text-slate-600"${_scopeId}> Tổng đơn </th><th class="px-3 py-2 text-right font-medium text-slate-600"${_scopeId}> Phải thu </th><th class="px-3 py-2 text-left font-medium text-slate-600"${_scopeId}> Dự án </th></tr></thead><tbody${_scopeId}><!--[-->`);
              serverRenderer_cjs_prodExports.ssrRenderList(vueExports.unref(eligibleOrders), (order) => {
                _push2(`<tr class="border-b last:border-0 hover:bg-slate-50 cursor-pointer"${_scopeId}><td class="px-3 py-2"${_scopeId}>`);
                _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UCheckbox, {
                  "model-value": vueExports.unref(selectedOrderIds).has(order.id),
                  "onUpdate:modelValue": ($event) => toggleOrderSelection(order.id)
                }, null, _parent2, _scopeId));
                _push2(`</td><td class="px-3 py-2 font-mono text-xs"${_scopeId}>${serverRenderer_cjs_prodExports.ssrInterpolate(order.code)}</td><td class="px-3 py-2 text-right"${_scopeId}>${serverRenderer_cjs_prodExports.ssrInterpolate(("formatCurrency" in _ctx ? _ctx.formatCurrency : vueExports.unref(formatCurrency))(order.total_amount))}</td><td class="px-3 py-2 text-right"${_scopeId}>${serverRenderer_cjs_prodExports.ssrInterpolate(order.receivable_amount ? ("formatCurrency" in _ctx ? _ctx.formatCurrency : vueExports.unref(formatCurrency))(order.receivable_amount) : "—")}</td><td class="px-3 py-2"${_scopeId}>${serverRenderer_cjs_prodExports.ssrInterpolate(order.project?.name ?? "—")}</td></tr>`);
              });
              _push2(`<!--]--></tbody></table></div>`);
            }
          } else {
            return [
              vueExports.createVNode(_component_UAlert, {
                color: "info",
                variant: "subtle",
                title: "Chỉ hiển thị đơn đã hoàn thành và thu hết công nợ, chưa thuộc kỳ chốt nào.",
                class: "mb-4"
              }),
              vueExports.unref(eligibleQuery).status.value === "pending" ? (vueExports.openBlock(), vueExports.createBlock("div", {
                key: 0,
                class: "flex justify-center py-8"
              }, [
                vueExports.createVNode(_component_UIcon, {
                  name: "i-lucide-loader-circle",
                  class: "size-6 animate-spin text-[var(--ui-primary)]"
                })
              ])) : vueExports.unref(eligibleOrders).length === 0 ? (vueExports.openBlock(), vueExports.createBlock("div", {
                key: 1,
                class: "text-center py-8 text-slate-500"
              }, " Không có đơn nào đủ điều kiện. ")) : (vueExports.openBlock(), vueExports.createBlock("div", {
                key: 2,
                class: "border rounded-lg overflow-hidden"
              }, [
                vueExports.createVNode("table", { class: "w-full text-sm" }, [
                  vueExports.createVNode("thead", { class: "bg-slate-50 border-b" }, [
                    vueExports.createVNode("tr", null, [
                      vueExports.createVNode("th", { class: "px-3 py-2 text-left w-10" }, [
                        vueExports.createVNode(_component_UCheckbox, {
                          "model-value": vueExports.unref(selectedOrderIds).size === vueExports.unref(eligibleOrders).length && vueExports.unref(eligibleOrders).length > 0,
                          "onUpdate:modelValue": toggleAllOrders
                        }, null, 8, ["model-value"])
                      ]),
                      vueExports.createVNode("th", { class: "px-3 py-2 text-left font-medium text-slate-600" }, " Mã đơn "),
                      vueExports.createVNode("th", { class: "px-3 py-2 text-right font-medium text-slate-600" }, " Tổng đơn "),
                      vueExports.createVNode("th", { class: "px-3 py-2 text-right font-medium text-slate-600" }, " Phải thu "),
                      vueExports.createVNode("th", { class: "px-3 py-2 text-left font-medium text-slate-600" }, " Dự án ")
                    ])
                  ]),
                  vueExports.createVNode("tbody", null, [
                    (vueExports.openBlock(true), vueExports.createBlock(vueExports.Fragment, null, vueExports.renderList(vueExports.unref(eligibleOrders), (order) => {
                      return vueExports.openBlock(), vueExports.createBlock("tr", {
                        key: order.id,
                        class: "border-b last:border-0 hover:bg-slate-50 cursor-pointer",
                        onClick: ($event) => toggleOrderSelection(order.id)
                      }, [
                        vueExports.createVNode("td", { class: "px-3 py-2" }, [
                          vueExports.createVNode(_component_UCheckbox, {
                            "model-value": vueExports.unref(selectedOrderIds).has(order.id),
                            "onUpdate:modelValue": ($event) => toggleOrderSelection(order.id)
                          }, null, 8, ["model-value", "onUpdate:modelValue"])
                        ]),
                        vueExports.createVNode("td", { class: "px-3 py-2 font-mono text-xs" }, vueExports.toDisplayString(order.code), 1),
                        vueExports.createVNode("td", { class: "px-3 py-2 text-right" }, vueExports.toDisplayString(("formatCurrency" in _ctx ? _ctx.formatCurrency : vueExports.unref(formatCurrency))(order.total_amount)), 1),
                        vueExports.createVNode("td", { class: "px-3 py-2 text-right" }, vueExports.toDisplayString(order.receivable_amount ? ("formatCurrency" in _ctx ? _ctx.formatCurrency : vueExports.unref(formatCurrency))(order.receivable_amount) : "—"), 1),
                        vueExports.createVNode("td", { class: "px-3 py-2" }, vueExports.toDisplayString(order.project?.name ?? "—"), 1)
                      ], 8, ["onClick"]);
                    }), 128))
                  ])
                ])
              ]))
            ];
          }
        }),
        footer: vueExports.withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="flex justify-end gap-2"${_scopeId}>`);
            _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UButton, {
              variant: "outline",
              color: "neutral",
              label: "Hủy",
              onClick: ($event) => showAddOrdersModal.value = false
            }, null, _parent2, _scopeId));
            _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UButton, {
              color: "primary",
              label: `Thêm (${vueExports.unref(selectedOrderIds).size} đơn)`,
              loading: vueExports.unref(addOrdersLoading),
              disabled: vueExports.unref(selectedOrderIds).size === 0,
              onClick: submitAddOrders
            }, null, _parent2, _scopeId));
            _push2(`</div>`);
          } else {
            return [
              vueExports.createVNode("div", { class: "flex justify-end gap-2" }, [
                vueExports.createVNode(_component_UButton, {
                  variant: "outline",
                  color: "neutral",
                  label: "Hủy",
                  onClick: ($event) => showAddOrdersModal.value = false
                }, null, 8, ["onClick"]),
                vueExports.createVNode(_component_UButton, {
                  color: "primary",
                  label: `Thêm (${vueExports.unref(selectedOrderIds).size} đơn)`,
                  loading: vueExports.unref(addOrdersLoading),
                  disabled: vueExports.unref(selectedOrderIds).size === 0,
                  onClick: submitAddOrders
                }, null, 8, ["label", "loading", "disabled"])
              ])
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UModal, {
        open: vueExports.unref(showRemoveConfirm),
        "onUpdate:open": ($event) => vueExports.isRef(showRemoveConfirm) ? showRemoveConfirm.value = $event : null,
        title: "Xóa đơn khỏi kỳ?"
      }, {
        body: vueExports.withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<p class="text-sm text-slate-600"${_scopeId}> Xóa đơn &quot;<strong${_scopeId}>${serverRenderer_cjs_prodExports.ssrInterpolate(vueExports.unref(removeTarget)?.order.code)}</strong>&quot; khỏi kỳ &quot;<strong${_scopeId}>${serverRenderer_cjs_prodExports.ssrInterpolate(vueExports.unref(period)?.name)}</strong>&quot;? Snapshot hoa hồng sẽ bị xóa theo. </p>`);
          } else {
            return [
              vueExports.createVNode("p", { class: "text-sm text-slate-600" }, [
                vueExports.createTextVNode(' Xóa đơn "'),
                vueExports.createVNode("strong", null, vueExports.toDisplayString(vueExports.unref(removeTarget)?.order.code), 1),
                vueExports.createTextVNode('" khỏi kỳ "'),
                vueExports.createVNode("strong", null, vueExports.toDisplayString(vueExports.unref(period)?.name), 1),
                vueExports.createTextVNode('"? Snapshot hoa hồng sẽ bị xóa theo. ')
              ])
            ];
          }
        }),
        footer: vueExports.withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="flex justify-end gap-2"${_scopeId}>`);
            _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UButton, {
              variant: "outline",
              color: "neutral",
              label: "Quay lại",
              onClick: ($event) => showRemoveConfirm.value = false
            }, null, _parent2, _scopeId));
            _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UButton, {
              color: "error",
              label: "Xóa",
              loading: vueExports.unref(removeLoading),
              onClick: submitRemove
            }, null, _parent2, _scopeId));
            _push2(`</div>`);
          } else {
            return [
              vueExports.createVNode("div", { class: "flex justify-end gap-2" }, [
                vueExports.createVNode(_component_UButton, {
                  variant: "outline",
                  color: "neutral",
                  label: "Quay lại",
                  onClick: ($event) => showRemoveConfirm.value = false
                }, null, 8, ["onClick"]),
                vueExports.createVNode(_component_UButton, {
                  color: "error",
                  label: "Xóa",
                  loading: vueExports.unref(removeLoading),
                  onClick: submitRemove
                }, null, 8, ["loading"])
              ])
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UModal, {
        open: vueExports.unref(showCloseConfirm),
        "onUpdate:open": ($event) => vueExports.isRef(showCloseConfirm) ? showCloseConfirm.value = $event : null,
        title: "Chốt kỳ?"
      }, {
        body: vueExports.withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<p class="text-sm text-slate-600"${_scopeId}> Sau khi chốt, tất cả <strong${_scopeId}>${serverRenderer_cjs_prodExports.ssrInterpolate(vueExports.unref(period)?.orders.length ?? 0)}</strong> đơn trong kỳ &quot;<strong${_scopeId}>${serverRenderer_cjs_prodExports.ssrInterpolate(vueExports.unref(period)?.name)}</strong>&quot; sẽ bị khóa tài chính. Bạn có thể mở lại sau nếu cần. </p>`);
          } else {
            return [
              vueExports.createVNode("p", { class: "text-sm text-slate-600" }, [
                vueExports.createTextVNode(" Sau khi chốt, tất cả "),
                vueExports.createVNode("strong", null, vueExports.toDisplayString(vueExports.unref(period)?.orders.length ?? 0), 1),
                vueExports.createTextVNode(' đơn trong kỳ "'),
                vueExports.createVNode("strong", null, vueExports.toDisplayString(vueExports.unref(period)?.name), 1),
                vueExports.createTextVNode('" sẽ bị khóa tài chính. Bạn có thể mở lại sau nếu cần. ')
              ])
            ];
          }
        }),
        footer: vueExports.withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="flex justify-end gap-2"${_scopeId}>`);
            _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UButton, {
              variant: "outline",
              color: "neutral",
              label: "Quay lại",
              onClick: ($event) => showCloseConfirm.value = false
            }, null, _parent2, _scopeId));
            _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UButton, {
              color: "success",
              label: "Chốt kỳ",
              loading: vueExports.unref(actionLoading),
              onClick: submitClose
            }, null, _parent2, _scopeId));
            _push2(`</div>`);
          } else {
            return [
              vueExports.createVNode("div", { class: "flex justify-end gap-2" }, [
                vueExports.createVNode(_component_UButton, {
                  variant: "outline",
                  color: "neutral",
                  label: "Quay lại",
                  onClick: ($event) => showCloseConfirm.value = false
                }, null, 8, ["onClick"]),
                vueExports.createVNode(_component_UButton, {
                  color: "success",
                  label: "Chốt kỳ",
                  loading: vueExports.unref(actionLoading),
                  onClick: submitClose
                }, null, 8, ["loading"])
              ])
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UModal, {
        open: vueExports.unref(showReopenConfirm),
        "onUpdate:open": ($event) => vueExports.isRef(showReopenConfirm) ? showReopenConfirm.value = $event : null,
        title: "Mở lại kỳ?"
      }, {
        body: vueExports.withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<p class="text-sm text-slate-600"${_scopeId}> Mở lại sẽ mở khóa tài chính cho tất cả đơn trong kỳ &quot;<strong${_scopeId}>${serverRenderer_cjs_prodExports.ssrInterpolate(vueExports.unref(period)?.name)}</strong>&quot; và tính lại toàn bộ hoa hồng theo cấu hình mới nhất. Bạn có chắc chắn? </p>`);
          } else {
            return [
              vueExports.createVNode("p", { class: "text-sm text-slate-600" }, [
                vueExports.createTextVNode(' Mở lại sẽ mở khóa tài chính cho tất cả đơn trong kỳ "'),
                vueExports.createVNode("strong", null, vueExports.toDisplayString(vueExports.unref(period)?.name), 1),
                vueExports.createTextVNode('" và tính lại toàn bộ hoa hồng theo cấu hình mới nhất. Bạn có chắc chắn? ')
              ])
            ];
          }
        }),
        footer: vueExports.withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="flex justify-end gap-2"${_scopeId}>`);
            _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UButton, {
              variant: "outline",
              color: "neutral",
              label: "Quay lại",
              onClick: ($event) => showReopenConfirm.value = false
            }, null, _parent2, _scopeId));
            _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UButton, {
              color: "warning",
              label: "Mở lại",
              loading: vueExports.unref(actionLoading),
              onClick: submitReopen
            }, null, _parent2, _scopeId));
            _push2(`</div>`);
          } else {
            return [
              vueExports.createVNode("div", { class: "flex justify-end gap-2" }, [
                vueExports.createVNode(_component_UButton, {
                  variant: "outline",
                  color: "neutral",
                  label: "Quay lại",
                  onClick: ($event) => showReopenConfirm.value = false
                }, null, 8, ["onClick"]),
                vueExports.createVNode(_component_UButton, {
                  color: "warning",
                  label: "Mở lại",
                  loading: vueExports.unref(actionLoading),
                  onClick: submitReopen
                }, null, 8, ["loading"])
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/pmc/finance/closing-periods/[id]/index.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=index-B6U5epPS.mjs.map
