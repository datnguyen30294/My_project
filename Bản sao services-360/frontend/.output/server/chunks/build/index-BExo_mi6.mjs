import { _ as __nuxt_component_0 } from './PageHeader-BJhealxW.mjs';
import { v as vueExports, j as useToast, s as serverRenderer_cjs_prodExports, l as _sfc_main$c, _ as __nuxt_component_0$4, k as _sfc_main$h } from './server.mjs';
import { _ as _sfc_main$1 } from './Select-CZE7Ef6n.mjs';
import { _ as __nuxt_component_2 } from './TableWrapper-VwUckvcF.mjs';
import { _ as _sfc_main$2 } from './Card-ywPiICev.mjs';
import { _ as _sfc_main$3 } from './Badge-W93D3Jpz.mjs';
import { _ as _sfc_main$4 } from './Modal-BimZZbNl.mjs';
import { _ as _sfc_main$5 } from './FormField-DFdmv6Lu.mjs';
import { _ as _sfc_main$6 } from './Input-JXN8po_F.mjs';
import { _ as _sfc_main$7 } from './Alert-tTsPKADX.mjs';
import { _ as _sfc_main$8 } from './Checkbox-Cp_FPUkd.mjs';
import { _ as _sfc_main$9 } from './Textarea-DTCNHwKm.mjs';
import { u as useClosingPeriodList, a as useEligibleOrders, C as CLOSING_PERIOD_STATUS_OPTIONS, c as closingPeriodStatusColor, b as apiCreateClosingPeriod, d as apiAddOrders, e as apiClosePeriod, f as apiReopenPeriod } from './useClosingPeriods-HdCSZwWv.mjs';
import { a as formatDate, f as formatDateTime } from './date-R5YK0ast.mjs';
import { f as formatCurrency } from './currency-DEb2TrW3.mjs';
import { Z as Zl } from './vue-datepicker-6F5-CyxW.mjs';
import { S as SELECT_ALL_PER_PAGE } from './constants-G9YmtWtp.mjs';
import { u as useUrlFilters } from './useUrlFilters-D9dcjQcy.mjs';
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
import './useDirection-CXYby7CP.mjs';
import './useFormControl-_Lqv8ipK.mjs';
import './PopperArrow-C9hHWuSZ.mjs';
import './FocusScope-BZehoQSg.mjs';
import './useFocusGuards-CJykkUFH.mjs';
import './utils-DY0Zag2O.mjs';
import './handleAndDispatchCustomEvent-Bk_AVSSo.mjs';
import './PageError-kZWsA9dh.mjs';
import './DialogTrigger-C3iwCYMu.mjs';
import './DialogClose-DGkUxau7.mjs';
import './index-QmZAbLx-.mjs';
import './Label-BBgw4vHh.mjs';
import './RovingFocusItem-DwKRAYZk.mjs';
import './utils-BgcT7rQQ.mjs';
import './RovingFocusGroup-Vsbo7D6E.mjs';
import './VisuallyHiddenInput-q6Pz-w0i.mjs';

const _sfc_main = /* @__PURE__ */ vueExports.defineComponent({
  __name: "index",
  __ssrInlineRender: true,
  setup(__props) {
    const toast = useToast();
    const params = vueExports.reactive({ per_page: SELECT_ALL_PER_PAGE });
    const page = vueExports.ref(1);
    const selectedStatus = vueExports.ref(void 0);
    const { isInitFromUrl } = useUrlFilters({
      page: { ref: page, type: "number", defaultValue: 1 },
      status: { ref: selectedStatus, type: "string", onInit: (v) => {
        params.status = String(v);
      } }
    });
    vueExports.watch(selectedStatus, (val) => {
      params.status = val || void 0;
      if (!isInitFromUrl.value) page.value = 1;
    });
    const { data, status, error, refresh } = useClosingPeriodList(
      vueExports.computed(() => ({ ...params, page: page.value }))
    );
    const periods = vueExports.computed(() => data.value?.data ?? []);
    const showCreateModal = vueExports.ref(false);
    const createLoading = vueExports.ref(false);
    const createForm = vueExports.reactive({
      name: "",
      period_start: "",
      period_end: "",
      project_id: null
    });
    function resetCreateForm() {
      createForm.name = "";
      createForm.period_start = "";
      createForm.period_end = "";
      createForm.project_id = null;
    }
    const periodEndMinDate = vueExports.computed(() => {
      if (!createForm.period_start) return void 0;
      const [y, m, d] = createForm.period_start.split("-").map(Number);
      if (!y || !m || !d) return void 0;
      return new Date(y, m - 1, d);
    });
    async function submitCreate() {
      createLoading.value = true;
      try {
        await apiCreateClosingPeriod(createForm);
        toast.add({ title: "Đã tạo kỳ chốt", color: "success" });
        showCreateModal.value = false;
        resetCreateForm();
        await refresh();
      } catch (err) {
        toast.add({ title: getApiErrorMessage(err), color: "error" });
      } finally {
        createLoading.value = false;
      }
    }
    const showAddOrdersModal = vueExports.ref(false);
    const addOrdersPeriod = vueExports.ref(null);
    const selectedOrderIds = vueExports.ref(/* @__PURE__ */ new Set());
    const addOrdersLoading = vueExports.ref(false);
    const eligibleQuery = useEligibleOrders(
      vueExports.computed(() => addOrdersPeriod.value?.id ?? 0)
    );
    const eligibleOrders = vueExports.computed(
      () => addOrdersPeriod.value ? eligibleQuery.data.value?.data ?? [] : []
    );
    function openAddOrdersModal(period) {
      addOrdersPeriod.value = period;
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
      if (!addOrdersPeriod.value || selectedOrderIds.value.size === 0) return;
      addOrdersLoading.value = true;
      try {
        await apiAddOrders(addOrdersPeriod.value.id, { order_ids: [...selectedOrderIds.value] });
        toast.add({ title: `Đã thêm ${selectedOrderIds.value.size} đơn vào kỳ`, color: "success" });
        showAddOrdersModal.value = false;
        await refresh();
      } catch (err) {
        toast.add({ title: getApiErrorMessage(err), color: "error" });
      } finally {
        addOrdersLoading.value = false;
      }
    }
    const showCloseConfirm = vueExports.ref(false);
    const showReopenConfirm = vueExports.ref(false);
    const actionPeriod = vueExports.ref(null);
    const actionNote = vueExports.ref("");
    const actionLoading = vueExports.ref(false);
    function openCloseConfirm(period) {
      actionPeriod.value = period;
      actionNote.value = "";
      showCloseConfirm.value = true;
    }
    function openReopenConfirm(period) {
      actionPeriod.value = period;
      actionNote.value = "";
      showReopenConfirm.value = true;
    }
    async function submitClose() {
      if (!actionPeriod.value) return;
      actionLoading.value = true;
      try {
        await apiClosePeriod(actionPeriod.value.id, { note: actionNote.value || null });
        toast.add({ title: "Đã chốt kỳ", color: "success" });
        showCloseConfirm.value = false;
        await refresh();
      } catch (err) {
        toast.add({ title: getApiErrorMessage(err), color: "error" });
      } finally {
        actionLoading.value = false;
      }
    }
    async function submitReopen() {
      if (!actionPeriod.value) return;
      actionLoading.value = true;
      try {
        await apiReopenPeriod(actionPeriod.value.id, { note: actionNote.value || null });
        toast.add({ title: "Đã mở lại kỳ", color: "success" });
        showReopenConfirm.value = false;
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
    return (_ctx, _push, _parent, _attrs) => {
      const _component_SharedCrudPageHeader = __nuxt_component_0;
      const _component_UButton = _sfc_main$c;
      const _component_USelect = _sfc_main$1;
      const _component_SharedCrudTableWrapper = __nuxt_component_2;
      const _component_UCard = _sfc_main$2;
      const _component_NuxtLink = __nuxt_component_0$4;
      const _component_UBadge = _sfc_main$3;
      const _component_UModal = _sfc_main$4;
      const _component_UFormField = _sfc_main$5;
      const _component_UInput = _sfc_main$6;
      const _component_UAlert = _sfc_main$7;
      const _component_UIcon = _sfc_main$h;
      const _component_UCheckbox = _sfc_main$8;
      const _component_UTextarea = _sfc_main$9;
      _push(`<div${serverRenderer_cjs_prodExports.ssrRenderAttrs(_attrs)}>`);
      _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_SharedCrudPageHeader, {
        title: "Kỳ kế toán",
        description: "Quản lý kỳ quyết toán — chốt kỳ khóa sửa đơn, đóng băng snapshot hoa hồng."
      }, {
        actions: vueExports.withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UButton, {
              icon: "i-lucide-plus",
              label: "Tạo kỳ mới",
              color: "primary",
              onClick: ($event) => showCreateModal.value = true
            }, null, _parent2, _scopeId));
          } else {
            return [
              vueExports.createVNode(_component_UButton, {
                icon: "i-lucide-plus",
                label: "Tạo kỳ mới",
                color: "primary",
                onClick: ($event) => showCreateModal.value = true
              }, null, 8, ["onClick"])
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`<div class="mb-4 flex items-center gap-3">`);
      _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_USelect, {
        modelValue: vueExports.unref(selectedStatus),
        "onUpdate:modelValue": ($event) => vueExports.isRef(selectedStatus) ? selectedStatus.value = $event : null,
        items: "CLOSING_PERIOD_STATUS_OPTIONS" in _ctx ? _ctx.CLOSING_PERIOD_STATUS_OPTIONS : vueExports.unref(CLOSING_PERIOD_STATUS_OPTIONS),
        class: "w-48",
        placeholder: "Tất cả trạng thái"
      }, null, _parent));
      _push(`</div>`);
      _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_SharedCrudTableWrapper, {
        status: vueExports.unref(status),
        error: vueExports.unref(error),
        data: vueExports.unref(data),
        refresh: vueExports.unref(refresh)
      }, {
        default: vueExports.withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            if (vueExports.unref(periods).length > 0) {
              _push2(`<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6"${_scopeId}><!--[-->`);
              serverRenderer_cjs_prodExports.ssrRenderList(vueExports.unref(periods), (period) => {
                _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UCard, {
                  key: period.id,
                  class: "cursor-pointer hover:shadow-md transition-shadow"
                }, {
                  header: vueExports.withCtx((_2, _push3, _parent3, _scopeId2) => {
                    if (_push3) {
                      _push3(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_NuxtLink, {
                        to: `/pmc/finance/closing-periods/${period.id}`,
                        class: "flex items-center justify-between"
                      }, {
                        default: vueExports.withCtx((_3, _push4, _parent4, _scopeId3) => {
                          if (_push4) {
                            _push4(`<span class="font-semibold text-slate-900"${_scopeId3}>${serverRenderer_cjs_prodExports.ssrInterpolate(period.name)}</span>`);
                            _push4(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UBadge, {
                              label: period.status.label,
                              color: ("closingPeriodStatusColor" in _ctx ? _ctx.closingPeriodStatusColor : vueExports.unref(closingPeriodStatusColor))(period.status.value),
                              variant: "subtle"
                            }, null, _parent4, _scopeId3));
                          } else {
                            return [
                              vueExports.createVNode("span", { class: "font-semibold text-slate-900" }, vueExports.toDisplayString(period.name), 1),
                              vueExports.createVNode(_component_UBadge, {
                                label: period.status.label,
                                color: ("closingPeriodStatusColor" in _ctx ? _ctx.closingPeriodStatusColor : vueExports.unref(closingPeriodStatusColor))(period.status.value),
                                variant: "subtle"
                              }, null, 8, ["label", "color"])
                            ];
                          }
                        }),
                        _: 2
                      }, _parent3, _scopeId2));
                    } else {
                      return [
                        vueExports.createVNode(_component_NuxtLink, {
                          to: `/pmc/finance/closing-periods/${period.id}`,
                          class: "flex items-center justify-between"
                        }, {
                          default: vueExports.withCtx(() => [
                            vueExports.createVNode("span", { class: "font-semibold text-slate-900" }, vueExports.toDisplayString(period.name), 1),
                            vueExports.createVNode(_component_UBadge, {
                              label: period.status.label,
                              color: ("closingPeriodStatusColor" in _ctx ? _ctx.closingPeriodStatusColor : vueExports.unref(closingPeriodStatusColor))(period.status.value),
                              variant: "subtle"
                            }, null, 8, ["label", "color"])
                          ]),
                          _: 2
                        }, 1032, ["to"])
                      ];
                    }
                  }),
                  footer: vueExports.withCtx((_2, _push3, _parent3, _scopeId2) => {
                    if (_push3) {
                      _push3(`<div class="flex items-center gap-2"${_scopeId2}>`);
                      if (period.status.value === "open") {
                        _push3(`<!--[-->`);
                        _push3(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UButton, {
                          size: "xs",
                          variant: "outline",
                          icon: "i-lucide-plus",
                          label: "Thêm đơn",
                          onClick: ($event) => openAddOrdersModal(period)
                        }, null, _parent3, _scopeId2));
                        _push3(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UButton, {
                          size: "xs",
                          color: "success",
                          icon: "i-lucide-lock",
                          label: "Chốt kỳ",
                          onClick: ($event) => openCloseConfirm(period)
                        }, null, _parent3, _scopeId2));
                        _push3(`<!--]-->`);
                      } else {
                        _push3(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UButton, {
                          size: "xs",
                          variant: "outline",
                          color: "warning",
                          icon: "i-lucide-unlock",
                          label: "Mở lại",
                          onClick: ($event) => openReopenConfirm(period)
                        }, null, _parent3, _scopeId2));
                      }
                      _push3(`</div>`);
                    } else {
                      return [
                        vueExports.createVNode("div", { class: "flex items-center gap-2" }, [
                          period.status.value === "open" ? (vueExports.openBlock(), vueExports.createBlock(vueExports.Fragment, { key: 0 }, [
                            vueExports.createVNode(_component_UButton, {
                              size: "xs",
                              variant: "outline",
                              icon: "i-lucide-plus",
                              label: "Thêm đơn",
                              onClick: vueExports.withModifiers(($event) => openAddOrdersModal(period), ["stop"])
                            }, null, 8, ["onClick"]),
                            vueExports.createVNode(_component_UButton, {
                              size: "xs",
                              color: "success",
                              icon: "i-lucide-lock",
                              label: "Chốt kỳ",
                              onClick: vueExports.withModifiers(($event) => openCloseConfirm(period), ["stop"])
                            }, null, 8, ["onClick"])
                          ], 64)) : (vueExports.openBlock(), vueExports.createBlock(_component_UButton, {
                            key: 1,
                            size: "xs",
                            variant: "outline",
                            color: "warning",
                            icon: "i-lucide-unlock",
                            label: "Mở lại",
                            onClick: vueExports.withModifiers(($event) => openReopenConfirm(period), ["stop"])
                          }, null, 8, ["onClick"]))
                        ])
                      ];
                    }
                  }),
                  default: vueExports.withCtx((_2, _push3, _parent3, _scopeId2) => {
                    if (_push3) {
                      _push3(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_NuxtLink, {
                        to: `/pmc/finance/closing-periods/${period.id}`,
                        class: "block space-y-2 text-sm"
                      }, {
                        default: vueExports.withCtx((_3, _push4, _parent4, _scopeId3) => {
                          if (_push4) {
                            _push4(`<div class="flex justify-between text-slate-500"${_scopeId3}><span${_scopeId3}>Thời gian</span><span class="text-slate-700"${_scopeId3}>${serverRenderer_cjs_prodExports.ssrInterpolate(("formatDate" in _ctx ? _ctx.formatDate : vueExports.unref(formatDate))(period.period_start))} — ${serverRenderer_cjs_prodExports.ssrInterpolate(("formatDate" in _ctx ? _ctx.formatDate : vueExports.unref(formatDate))(period.period_end))}</span></div><div class="flex justify-between text-slate-500"${_scopeId3}><span${_scopeId3}>Số đơn</span><span class="font-medium text-slate-700"${_scopeId3}>${serverRenderer_cjs_prodExports.ssrInterpolate(period.orders_count)}</span></div><div class="flex justify-between text-slate-500"${_scopeId3}><span${_scopeId3}>Tổng phải thu</span><span class="text-slate-700"${_scopeId3}>${serverRenderer_cjs_prodExports.ssrInterpolate(("formatCurrency" in _ctx ? _ctx.formatCurrency : vueExports.unref(formatCurrency))(period.total_receivable))}</span></div><div class="flex justify-between text-slate-500"${_scopeId3}><span${_scopeId3}>Tổng hoa hồng</span><span class="text-slate-700"${_scopeId3}>${serverRenderer_cjs_prodExports.ssrInterpolate(("formatCurrency" in _ctx ? _ctx.formatCurrency : vueExports.unref(formatCurrency))(period.total_commission))}</span></div>`);
                            if (period.closed_at) {
                              _push4(`<div class="flex justify-between text-slate-500"${_scopeId3}><span${_scopeId3}>Chốt lúc</span><span class="text-slate-700"${_scopeId3}>${serverRenderer_cjs_prodExports.ssrInterpolate(("formatDateTime" in _ctx ? _ctx.formatDateTime : vueExports.unref(formatDateTime))(period.closed_at))}</span></div>`);
                            } else {
                              _push4(`<!---->`);
                            }
                          } else {
                            return [
                              vueExports.createVNode("div", { class: "flex justify-between text-slate-500" }, [
                                vueExports.createVNode("span", null, "Thời gian"),
                                vueExports.createVNode("span", { class: "text-slate-700" }, vueExports.toDisplayString(("formatDate" in _ctx ? _ctx.formatDate : vueExports.unref(formatDate))(period.period_start)) + " — " + vueExports.toDisplayString(("formatDate" in _ctx ? _ctx.formatDate : vueExports.unref(formatDate))(period.period_end)), 1)
                              ]),
                              vueExports.createVNode("div", { class: "flex justify-between text-slate-500" }, [
                                vueExports.createVNode("span", null, "Số đơn"),
                                vueExports.createVNode("span", { class: "font-medium text-slate-700" }, vueExports.toDisplayString(period.orders_count), 1)
                              ]),
                              vueExports.createVNode("div", { class: "flex justify-between text-slate-500" }, [
                                vueExports.createVNode("span", null, "Tổng phải thu"),
                                vueExports.createVNode("span", { class: "text-slate-700" }, vueExports.toDisplayString(("formatCurrency" in _ctx ? _ctx.formatCurrency : vueExports.unref(formatCurrency))(period.total_receivable)), 1)
                              ]),
                              vueExports.createVNode("div", { class: "flex justify-between text-slate-500" }, [
                                vueExports.createVNode("span", null, "Tổng hoa hồng"),
                                vueExports.createVNode("span", { class: "text-slate-700" }, vueExports.toDisplayString(("formatCurrency" in _ctx ? _ctx.formatCurrency : vueExports.unref(formatCurrency))(period.total_commission)), 1)
                              ]),
                              period.closed_at ? (vueExports.openBlock(), vueExports.createBlock("div", {
                                key: 0,
                                class: "flex justify-between text-slate-500"
                              }, [
                                vueExports.createVNode("span", null, "Chốt lúc"),
                                vueExports.createVNode("span", { class: "text-slate-700" }, vueExports.toDisplayString(("formatDateTime" in _ctx ? _ctx.formatDateTime : vueExports.unref(formatDateTime))(period.closed_at)), 1)
                              ])) : vueExports.createCommentVNode("", true)
                            ];
                          }
                        }),
                        _: 2
                      }, _parent3, _scopeId2));
                    } else {
                      return [
                        vueExports.createVNode(_component_NuxtLink, {
                          to: `/pmc/finance/closing-periods/${period.id}`,
                          class: "block space-y-2 text-sm"
                        }, {
                          default: vueExports.withCtx(() => [
                            vueExports.createVNode("div", { class: "flex justify-between text-slate-500" }, [
                              vueExports.createVNode("span", null, "Thời gian"),
                              vueExports.createVNode("span", { class: "text-slate-700" }, vueExports.toDisplayString(("formatDate" in _ctx ? _ctx.formatDate : vueExports.unref(formatDate))(period.period_start)) + " — " + vueExports.toDisplayString(("formatDate" in _ctx ? _ctx.formatDate : vueExports.unref(formatDate))(period.period_end)), 1)
                            ]),
                            vueExports.createVNode("div", { class: "flex justify-between text-slate-500" }, [
                              vueExports.createVNode("span", null, "Số đơn"),
                              vueExports.createVNode("span", { class: "font-medium text-slate-700" }, vueExports.toDisplayString(period.orders_count), 1)
                            ]),
                            vueExports.createVNode("div", { class: "flex justify-between text-slate-500" }, [
                              vueExports.createVNode("span", null, "Tổng phải thu"),
                              vueExports.createVNode("span", { class: "text-slate-700" }, vueExports.toDisplayString(("formatCurrency" in _ctx ? _ctx.formatCurrency : vueExports.unref(formatCurrency))(period.total_receivable)), 1)
                            ]),
                            vueExports.createVNode("div", { class: "flex justify-between text-slate-500" }, [
                              vueExports.createVNode("span", null, "Tổng hoa hồng"),
                              vueExports.createVNode("span", { class: "text-slate-700" }, vueExports.toDisplayString(("formatCurrency" in _ctx ? _ctx.formatCurrency : vueExports.unref(formatCurrency))(period.total_commission)), 1)
                            ]),
                            period.closed_at ? (vueExports.openBlock(), vueExports.createBlock("div", {
                              key: 0,
                              class: "flex justify-between text-slate-500"
                            }, [
                              vueExports.createVNode("span", null, "Chốt lúc"),
                              vueExports.createVNode("span", { class: "text-slate-700" }, vueExports.toDisplayString(("formatDateTime" in _ctx ? _ctx.formatDateTime : vueExports.unref(formatDateTime))(period.closed_at)), 1)
                            ])) : vueExports.createCommentVNode("", true)
                          ]),
                          _: 2
                        }, 1032, ["to"])
                      ];
                    }
                  }),
                  _: 2
                }, _parent2, _scopeId));
              });
              _push2(`<!--]--></div>`);
            } else {
              _push2(`<div class="text-center py-12 text-slate-500"${_scopeId}> Chưa có kỳ chốt nào. Bấm &quot;Tạo kỳ mới&quot; để bắt đầu. </div>`);
            }
          } else {
            return [
              vueExports.unref(periods).length > 0 ? (vueExports.openBlock(), vueExports.createBlock("div", {
                key: 0,
                class: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6"
              }, [
                (vueExports.openBlock(true), vueExports.createBlock(vueExports.Fragment, null, vueExports.renderList(vueExports.unref(periods), (period) => {
                  return vueExports.openBlock(), vueExports.createBlock(_component_UCard, {
                    key: period.id,
                    class: "cursor-pointer hover:shadow-md transition-shadow"
                  }, {
                    header: vueExports.withCtx(() => [
                      vueExports.createVNode(_component_NuxtLink, {
                        to: `/pmc/finance/closing-periods/${period.id}`,
                        class: "flex items-center justify-between"
                      }, {
                        default: vueExports.withCtx(() => [
                          vueExports.createVNode("span", { class: "font-semibold text-slate-900" }, vueExports.toDisplayString(period.name), 1),
                          vueExports.createVNode(_component_UBadge, {
                            label: period.status.label,
                            color: ("closingPeriodStatusColor" in _ctx ? _ctx.closingPeriodStatusColor : vueExports.unref(closingPeriodStatusColor))(period.status.value),
                            variant: "subtle"
                          }, null, 8, ["label", "color"])
                        ]),
                        _: 2
                      }, 1032, ["to"])
                    ]),
                    footer: vueExports.withCtx(() => [
                      vueExports.createVNode("div", { class: "flex items-center gap-2" }, [
                        period.status.value === "open" ? (vueExports.openBlock(), vueExports.createBlock(vueExports.Fragment, { key: 0 }, [
                          vueExports.createVNode(_component_UButton, {
                            size: "xs",
                            variant: "outline",
                            icon: "i-lucide-plus",
                            label: "Thêm đơn",
                            onClick: vueExports.withModifiers(($event) => openAddOrdersModal(period), ["stop"])
                          }, null, 8, ["onClick"]),
                          vueExports.createVNode(_component_UButton, {
                            size: "xs",
                            color: "success",
                            icon: "i-lucide-lock",
                            label: "Chốt kỳ",
                            onClick: vueExports.withModifiers(($event) => openCloseConfirm(period), ["stop"])
                          }, null, 8, ["onClick"])
                        ], 64)) : (vueExports.openBlock(), vueExports.createBlock(_component_UButton, {
                          key: 1,
                          size: "xs",
                          variant: "outline",
                          color: "warning",
                          icon: "i-lucide-unlock",
                          label: "Mở lại",
                          onClick: vueExports.withModifiers(($event) => openReopenConfirm(period), ["stop"])
                        }, null, 8, ["onClick"]))
                      ])
                    ]),
                    default: vueExports.withCtx(() => [
                      vueExports.createVNode(_component_NuxtLink, {
                        to: `/pmc/finance/closing-periods/${period.id}`,
                        class: "block space-y-2 text-sm"
                      }, {
                        default: vueExports.withCtx(() => [
                          vueExports.createVNode("div", { class: "flex justify-between text-slate-500" }, [
                            vueExports.createVNode("span", null, "Thời gian"),
                            vueExports.createVNode("span", { class: "text-slate-700" }, vueExports.toDisplayString(("formatDate" in _ctx ? _ctx.formatDate : vueExports.unref(formatDate))(period.period_start)) + " — " + vueExports.toDisplayString(("formatDate" in _ctx ? _ctx.formatDate : vueExports.unref(formatDate))(period.period_end)), 1)
                          ]),
                          vueExports.createVNode("div", { class: "flex justify-between text-slate-500" }, [
                            vueExports.createVNode("span", null, "Số đơn"),
                            vueExports.createVNode("span", { class: "font-medium text-slate-700" }, vueExports.toDisplayString(period.orders_count), 1)
                          ]),
                          vueExports.createVNode("div", { class: "flex justify-between text-slate-500" }, [
                            vueExports.createVNode("span", null, "Tổng phải thu"),
                            vueExports.createVNode("span", { class: "text-slate-700" }, vueExports.toDisplayString(("formatCurrency" in _ctx ? _ctx.formatCurrency : vueExports.unref(formatCurrency))(period.total_receivable)), 1)
                          ]),
                          vueExports.createVNode("div", { class: "flex justify-between text-slate-500" }, [
                            vueExports.createVNode("span", null, "Tổng hoa hồng"),
                            vueExports.createVNode("span", { class: "text-slate-700" }, vueExports.toDisplayString(("formatCurrency" in _ctx ? _ctx.formatCurrency : vueExports.unref(formatCurrency))(period.total_commission)), 1)
                          ]),
                          period.closed_at ? (vueExports.openBlock(), vueExports.createBlock("div", {
                            key: 0,
                            class: "flex justify-between text-slate-500"
                          }, [
                            vueExports.createVNode("span", null, "Chốt lúc"),
                            vueExports.createVNode("span", { class: "text-slate-700" }, vueExports.toDisplayString(("formatDateTime" in _ctx ? _ctx.formatDateTime : vueExports.unref(formatDateTime))(period.closed_at)), 1)
                          ])) : vueExports.createCommentVNode("", true)
                        ]),
                        _: 2
                      }, 1032, ["to"])
                    ]),
                    _: 2
                  }, 1024);
                }), 128))
              ])) : (vueExports.openBlock(), vueExports.createBlock("div", {
                key: 1,
                class: "text-center py-12 text-slate-500"
              }, ' Chưa có kỳ chốt nào. Bấm "Tạo kỳ mới" để bắt đầu. '))
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UModal, {
        open: vueExports.unref(showCreateModal),
        "onUpdate:open": ($event) => vueExports.isRef(showCreateModal) ? showCreateModal.value = $event : null,
        title: "Tạo kỳ chốt mới",
        ui: { body: "overflow-y-visible", content: "overflow-visible" }
      }, {
        body: vueExports.withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="space-y-4"${_scopeId}>`);
            _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UFormField, {
              label: "Tên kỳ",
              required: ""
            }, {
              default: vueExports.withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UInput, {
                    modelValue: vueExports.unref(createForm).name,
                    "onUpdate:modelValue": ($event) => vueExports.unref(createForm).name = $event,
                    placeholder: "VD: Tháng 4/2026",
                    class: "w-full"
                  }, null, _parent3, _scopeId2));
                } else {
                  return [
                    vueExports.createVNode(_component_UInput, {
                      modelValue: vueExports.unref(createForm).name,
                      "onUpdate:modelValue": ($event) => vueExports.unref(createForm).name = $event,
                      placeholder: "VD: Tháng 4/2026",
                      class: "w-full"
                    }, null, 8, ["modelValue", "onUpdate:modelValue"])
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(`<div class="grid grid-cols-2 gap-4"${_scopeId}>`);
            _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UFormField, {
              label: "Từ ngày",
              required: ""
            }, {
              default: vueExports.withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(serverRenderer_cjs_prodExports.ssrRenderComponent(vueExports.unref(Zl), {
                    modelValue: vueExports.unref(createForm).period_start,
                    "onUpdate:modelValue": ($event) => vueExports.unref(createForm).period_start = $event,
                    "time-config": { enableTimePicker: false },
                    "model-type": "yyyy-MM-dd",
                    format: "dd/MM/yyyy",
                    placeholder: "Chọn ngày",
                    "auto-apply": ""
                  }, null, _parent3, _scopeId2));
                } else {
                  return [
                    vueExports.createVNode(vueExports.unref(Zl), {
                      modelValue: vueExports.unref(createForm).period_start,
                      "onUpdate:modelValue": ($event) => vueExports.unref(createForm).period_start = $event,
                      "time-config": { enableTimePicker: false },
                      "model-type": "yyyy-MM-dd",
                      format: "dd/MM/yyyy",
                      placeholder: "Chọn ngày",
                      "auto-apply": ""
                    }, null, 8, ["modelValue", "onUpdate:modelValue"])
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UFormField, {
              label: "Đến ngày",
              required: ""
            }, {
              default: vueExports.withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(serverRenderer_cjs_prodExports.ssrRenderComponent(vueExports.unref(Zl), {
                    modelValue: vueExports.unref(createForm).period_end,
                    "onUpdate:modelValue": ($event) => vueExports.unref(createForm).period_end = $event,
                    "time-config": { enableTimePicker: false },
                    "min-date": vueExports.unref(periodEndMinDate),
                    "model-type": "yyyy-MM-dd",
                    format: "dd/MM/yyyy",
                    placeholder: "Chọn ngày",
                    "auto-apply": ""
                  }, null, _parent3, _scopeId2));
                } else {
                  return [
                    vueExports.createVNode(vueExports.unref(Zl), {
                      modelValue: vueExports.unref(createForm).period_end,
                      "onUpdate:modelValue": ($event) => vueExports.unref(createForm).period_end = $event,
                      "time-config": { enableTimePicker: false },
                      "min-date": vueExports.unref(periodEndMinDate),
                      "model-type": "yyyy-MM-dd",
                      format: "dd/MM/yyyy",
                      placeholder: "Chọn ngày",
                      "auto-apply": ""
                    }, null, 8, ["modelValue", "onUpdate:modelValue", "min-date"])
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(`</div></div>`);
          } else {
            return [
              vueExports.createVNode("div", { class: "space-y-4" }, [
                vueExports.createVNode(_component_UFormField, {
                  label: "Tên kỳ",
                  required: ""
                }, {
                  default: vueExports.withCtx(() => [
                    vueExports.createVNode(_component_UInput, {
                      modelValue: vueExports.unref(createForm).name,
                      "onUpdate:modelValue": ($event) => vueExports.unref(createForm).name = $event,
                      placeholder: "VD: Tháng 4/2026",
                      class: "w-full"
                    }, null, 8, ["modelValue", "onUpdate:modelValue"])
                  ]),
                  _: 1
                }),
                vueExports.createVNode("div", { class: "grid grid-cols-2 gap-4" }, [
                  vueExports.createVNode(_component_UFormField, {
                    label: "Từ ngày",
                    required: ""
                  }, {
                    default: vueExports.withCtx(() => [
                      vueExports.createVNode(vueExports.unref(Zl), {
                        modelValue: vueExports.unref(createForm).period_start,
                        "onUpdate:modelValue": ($event) => vueExports.unref(createForm).period_start = $event,
                        "time-config": { enableTimePicker: false },
                        "model-type": "yyyy-MM-dd",
                        format: "dd/MM/yyyy",
                        placeholder: "Chọn ngày",
                        "auto-apply": ""
                      }, null, 8, ["modelValue", "onUpdate:modelValue"])
                    ]),
                    _: 1
                  }),
                  vueExports.createVNode(_component_UFormField, {
                    label: "Đến ngày",
                    required: ""
                  }, {
                    default: vueExports.withCtx(() => [
                      vueExports.createVNode(vueExports.unref(Zl), {
                        modelValue: vueExports.unref(createForm).period_end,
                        "onUpdate:modelValue": ($event) => vueExports.unref(createForm).period_end = $event,
                        "time-config": { enableTimePicker: false },
                        "min-date": vueExports.unref(periodEndMinDate),
                        "model-type": "yyyy-MM-dd",
                        format: "dd/MM/yyyy",
                        placeholder: "Chọn ngày",
                        "auto-apply": ""
                      }, null, 8, ["modelValue", "onUpdate:modelValue", "min-date"])
                    ]),
                    _: 1
                  })
                ])
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
              label: "Hủy",
              onClick: ($event) => showCreateModal.value = false
            }, null, _parent2, _scopeId));
            _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UButton, {
              color: "primary",
              label: "Tạo",
              loading: vueExports.unref(createLoading),
              disabled: !vueExports.unref(createForm).name || !vueExports.unref(createForm).period_start || !vueExports.unref(createForm).period_end,
              onClick: submitCreate
            }, null, _parent2, _scopeId));
            _push2(`</div>`);
          } else {
            return [
              vueExports.createVNode("div", { class: "flex justify-end gap-2" }, [
                vueExports.createVNode(_component_UButton, {
                  variant: "outline",
                  color: "neutral",
                  label: "Hủy",
                  onClick: ($event) => showCreateModal.value = false
                }, null, 8, ["onClick"]),
                vueExports.createVNode(_component_UButton, {
                  color: "primary",
                  label: "Tạo",
                  loading: vueExports.unref(createLoading),
                  disabled: !vueExports.unref(createForm).name || !vueExports.unref(createForm).period_start || !vueExports.unref(createForm).period_end,
                  onClick: submitCreate
                }, null, 8, ["loading", "disabled"])
              ])
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UModal, {
        open: vueExports.unref(showAddOrdersModal),
        "onUpdate:open": ($event) => vueExports.isRef(showAddOrdersModal) ? showAddOrdersModal.value = $event : null,
        title: `Thêm đơn vào kỳ '${vueExports.unref(addOrdersPeriod)?.name ?? ""}'`
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
        open: vueExports.unref(showCloseConfirm),
        "onUpdate:open": ($event) => vueExports.isRef(showCloseConfirm) ? showCloseConfirm.value = $event : null,
        title: "Chốt kỳ?"
      }, {
        body: vueExports.withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<p class="text-sm text-slate-600 mb-4"${_scopeId}> Sau khi chốt, tất cả <strong${_scopeId}>${serverRenderer_cjs_prodExports.ssrInterpolate(vueExports.unref(actionPeriod)?.orders_count ?? 0)}</strong> đơn trong kỳ &quot;<strong${_scopeId}>${serverRenderer_cjs_prodExports.ssrInterpolate(vueExports.unref(actionPeriod)?.name)}</strong>&quot; sẽ bị khóa tài chính. Bạn có thể mở lại sau nếu cần. </p>`);
            _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UFormField, { label: "Ghi chú (tùy chọn)" }, {
              default: vueExports.withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UTextarea, {
                    modelValue: vueExports.unref(actionNote),
                    "onUpdate:modelValue": ($event) => vueExports.isRef(actionNote) ? actionNote.value = $event : null,
                    placeholder: "Ghi chú khi chốt...",
                    class: "w-full"
                  }, null, _parent3, _scopeId2));
                } else {
                  return [
                    vueExports.createVNode(_component_UTextarea, {
                      modelValue: vueExports.unref(actionNote),
                      "onUpdate:modelValue": ($event) => vueExports.isRef(actionNote) ? actionNote.value = $event : null,
                      placeholder: "Ghi chú khi chốt...",
                      class: "w-full"
                    }, null, 8, ["modelValue", "onUpdate:modelValue"])
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
          } else {
            return [
              vueExports.createVNode("p", { class: "text-sm text-slate-600 mb-4" }, [
                vueExports.createTextVNode(" Sau khi chốt, tất cả "),
                vueExports.createVNode("strong", null, vueExports.toDisplayString(vueExports.unref(actionPeriod)?.orders_count ?? 0), 1),
                vueExports.createTextVNode(' đơn trong kỳ "'),
                vueExports.createVNode("strong", null, vueExports.toDisplayString(vueExports.unref(actionPeriod)?.name), 1),
                vueExports.createTextVNode('" sẽ bị khóa tài chính. Bạn có thể mở lại sau nếu cần. ')
              ]),
              vueExports.createVNode(_component_UFormField, { label: "Ghi chú (tùy chọn)" }, {
                default: vueExports.withCtx(() => [
                  vueExports.createVNode(_component_UTextarea, {
                    modelValue: vueExports.unref(actionNote),
                    "onUpdate:modelValue": ($event) => vueExports.isRef(actionNote) ? actionNote.value = $event : null,
                    placeholder: "Ghi chú khi chốt...",
                    class: "w-full"
                  }, null, 8, ["modelValue", "onUpdate:modelValue"])
                ]),
                _: 1
              })
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
            _push2(`<p class="text-sm text-slate-600 mb-4"${_scopeId}> Mở lại sẽ mở khóa tài chính cho tất cả đơn trong kỳ &quot;<strong${_scopeId}>${serverRenderer_cjs_prodExports.ssrInterpolate(vueExports.unref(actionPeriod)?.name)}</strong>&quot; và tính lại toàn bộ hoa hồng theo cấu hình mới nhất. Bạn có chắc chắn? </p>`);
            _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UFormField, { label: "Lý do mở lại (tùy chọn)" }, {
              default: vueExports.withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UTextarea, {
                    modelValue: vueExports.unref(actionNote),
                    "onUpdate:modelValue": ($event) => vueExports.isRef(actionNote) ? actionNote.value = $event : null,
                    placeholder: "Lý do mở lại...",
                    class: "w-full"
                  }, null, _parent3, _scopeId2));
                } else {
                  return [
                    vueExports.createVNode(_component_UTextarea, {
                      modelValue: vueExports.unref(actionNote),
                      "onUpdate:modelValue": ($event) => vueExports.isRef(actionNote) ? actionNote.value = $event : null,
                      placeholder: "Lý do mở lại...",
                      class: "w-full"
                    }, null, 8, ["modelValue", "onUpdate:modelValue"])
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
          } else {
            return [
              vueExports.createVNode("p", { class: "text-sm text-slate-600 mb-4" }, [
                vueExports.createTextVNode(' Mở lại sẽ mở khóa tài chính cho tất cả đơn trong kỳ "'),
                vueExports.createVNode("strong", null, vueExports.toDisplayString(vueExports.unref(actionPeriod)?.name), 1),
                vueExports.createTextVNode('" và tính lại toàn bộ hoa hồng theo cấu hình mới nhất. Bạn có chắc chắn? ')
              ]),
              vueExports.createVNode(_component_UFormField, { label: "Lý do mở lại (tùy chọn)" }, {
                default: vueExports.withCtx(() => [
                  vueExports.createVNode(_component_UTextarea, {
                    modelValue: vueExports.unref(actionNote),
                    "onUpdate:modelValue": ($event) => vueExports.isRef(actionNote) ? actionNote.value = $event : null,
                    placeholder: "Lý do mở lại...",
                    class: "w-full"
                  }, null, 8, ["modelValue", "onUpdate:modelValue"])
                ]),
                _: 1
              })
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/pmc/finance/closing-periods/index.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=index-BExo_mi6.mjs.map
