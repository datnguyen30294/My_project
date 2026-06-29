import { _ as _sfc_main$1 } from './Alert-tTsPKADX.mjs';
import { _ as _sfc_main$2 } from './Badge-W93D3Jpz.mjs';
import { v as vueExports, p as useRoute$1, i as useRouter, j as useToast, u as useSeoMeta, s as serverRenderer_cjs_prodExports, k as _sfc_main$h, l as _sfc_main$c, _ as __nuxt_component_0$4 } from './server.mjs';
import { _ as _sfc_main$3 } from './Card-ywPiICev.mjs';
import { _ as _sfc_main$4 } from './Tabs-Djlffbcc.mjs';
import { _ as __nuxt_component_4 } from './SectionCard-CH-mG9Mf.mjs';
import { _ as __nuxt_component_5 } from './FieldDisplay-BM6nmr2i.mjs';
import { _ as _sfc_main$5 } from './Table-17SH0cIR.mjs';
import { _ as __nuxt_component_10 } from './TablePagination-CZYWB-qm.mjs';
import { _ as __nuxt_component_11 } from './CustomerFormModal-DTm98NMJ.mjs';
import { _ as __nuxt_component_11$1 } from './DeleteModal-B4AevDGU.mjs';
import { f as formatPhone } from './phone-DErPjpTB.mjs';
import { f as formatCurrency } from './currency-DEb2TrW3.mjs';
import { f as formatDateTime, a as formatDate } from './date-R5YK0ast.mjs';
import { h as useCustomerDetail, i as useCustomerTickets, j as useCustomerOrders, k as useCustomerPayments, c as apiUpdateCustomer, d as apiDeleteCustomer, e as apiCheckDeleteCustomer } from './useCustomers-ByvzwLgR.mjs';
import { u as useBreadcrumb } from './useBreadcrumb-zkNa_uJG.mjs';
import { D as DEFAULT_PER_PAGE, S as SELECT_ALL_PER_PAGE } from './constants-G9YmtWtp.mjs';
import { u as useCrudModals } from './useCrudModals-BUUQWYeI.mjs';
import { u as useCrudSubmit } from './useCrudSubmit-gMGxLTGY.mjs';
import { u as useCheckDelete } from './useCheckDelete-ka2wDn0T.mjs';
import { o as ogTicketPriorityColor, a as ogTicketStatusColor } from './useOgTickets-DPRh9tlL.mjs';
import { o as orderStatusColor } from './useOrders-Da-CMLMo.mjs';
import { r as receivableStatusColor } from './useReceivables-eUxCdlsS.mjs';
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
import './FocusScope-BZehoQSg.mjs';
import './RovingFocusGroup-Vsbo7D6E.mjs';
import './utils-BgcT7rQQ.mjs';
import './RovingFocusItem-DwKRAYZk.mjs';
import './index-CSThDD3J.mjs';
import './index-QmZAbLx-.mjs';
import './Pagination-fZq_Msxb.mjs';
import './Modal-BimZZbNl.mjs';
import './DialogTrigger-C3iwCYMu.mjs';
import './utils-DY0Zag2O.mjs';
import './DialogClose-DGkUxau7.mjs';
import './FormField-DFdmv6Lu.mjs';
import './Label-BBgw4vHh.mjs';
import './Input-JXN8po_F.mjs';
import './Textarea-DTCNHwKm.mjs';
import './apiError-DBrxF9au.mjs';

const _sfc_main = /* @__PURE__ */ vueExports.defineComponent({
  __name: "index",
  __ssrInlineRender: true,
  setup(__props) {
    const route = useRoute$1();
    const router = useRouter();
    const toast = useToast();
    const id = vueExports.computed(() => Number(route.params.id));
    const { data, status, error, refresh } = useCustomerDetail(id);
    const customer = vueExports.computed(() => data.value?.data ?? null);
    const { useDynamicLabel } = useBreadcrumb();
    useDynamicLabel(vueExports.computed(() => customer.value?.full_name ?? null));
    useSeoMeta({
      title: vueExports.computed(() => customer.value ? `${customer.value.full_name} - Khách hàng` : "Chi tiết khách hàng")
    });
    const aggregates = vueExports.computed(() => customer.value?.aggregates ?? null);
    const tabItems = [
      { label: "Thông tin", value: "info", icon: "i-lucide-user" },
      { label: "Ticket", value: "tickets", icon: "i-lucide-ticket" },
      { label: "Đơn hàng & Thanh toán", value: "orders", icon: "i-lucide-shopping-cart" },
      { label: "Đánh giá", value: "csat", icon: "i-lucide-star" }
    ];
    const allowedTabs = tabItems.map((t) => t.value);
    const activeTab = vueExports.ref(
      typeof route.query.tab === "string" && allowedTabs.includes(route.query.tab) ? route.query.tab : "info"
    );
    vueExports.watch(activeTab, (next) => {
      router.replace({ query: { ...route.query, tab: next } });
    });
    const ticketPage = vueExports.ref(1);
    const ticketParams = vueExports.computed(() => ({ page: ticketPage.value, per_page: DEFAULT_PER_PAGE }));
    const {
      data: ticketData,
      status: ticketStatus,
      error: ticketError
    } = useCustomerTickets(id, ticketParams);
    const tickets = vueExports.computed(() => ticketData.value?.data ?? []);
    const ticketColumns = [
      { id: "code", header: "Tiêu đề" },
      { id: "project", header: "Dự án" },
      { accessorKey: "apartment_name", header: "Căn hộ" },
      { id: "status", header: "Trạng thái" },
      { id: "priority", header: "Ưu tiên" },
      { id: "received_at", header: "Ngày nhận" },
      { id: "rating", header: "Đánh giá" }
    ];
    const orderPage = vueExports.ref(1);
    const orderParams = vueExports.computed(() => ({ page: orderPage.value, per_page: DEFAULT_PER_PAGE }));
    const {
      data: orderData,
      status: orderStatus,
      error: orderError
    } = useCustomerOrders(id, orderParams);
    const orders = vueExports.computed(() => orderData.value?.data ?? []);
    const orderColumns = [
      { accessorKey: "code", header: "Mã đơn" },
      { id: "ticket", header: "Ticket" },
      { id: "status", header: "Trạng thái" },
      { id: "total_amount", header: "Tổng tiền" },
      { id: "receivable_status", header: "Tình trạng thu" },
      { id: "paid_amount", header: "Đã thu" },
      { id: "outstanding", header: "Còn nợ" }
    ];
    const paymentPage = vueExports.ref(1);
    const paymentParams = vueExports.computed(() => ({ page: paymentPage.value, per_page: DEFAULT_PER_PAGE }));
    const {
      data: paymentData,
      status: paymentStatus,
      error: paymentError
    } = useCustomerPayments(id, paymentParams);
    const payments = vueExports.computed(() => paymentData.value?.data ?? []);
    const paymentColumns = [
      { accessorKey: "id", header: "ID" },
      { id: "order", header: "Đơn liên quan" },
      { id: "amount", header: "Số tiền" },
      { id: "payment_method", header: "Phương thức" },
      { id: "paid_at", header: "Ngày thu" }
    ];
    const csatParams = vueExports.computed(() => ({ page: 1, per_page: SELECT_ALL_PER_PAGE }));
    const { data: csatData, status: csatStatus } = useCustomerTickets(id, csatParams);
    const ratedTickets = vueExports.computed(
      () => (csatData.value?.data ?? []).filter((t) => t.resident_rating != null)
    );
    const ratingHistogram = vueExports.computed(() => {
      const buckets = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
      for (const t of ratedTickets.value) {
        const r = t.resident_rating;
        if (r != null && r >= 1 && r <= 5) buckets[r] = (buckets[r] ?? 0) + 1;
      }
      const total = ratedTickets.value.length;
      return [5, 4, 3, 2, 1].map((star) => {
        const count = buckets[star] ?? 0;
        return {
          star,
          count,
          percent: total > 0 ? Math.round(count / total * 100) : 0
        };
      });
    });
    const crud = useCrudModals();
    const {
      showFormModal,
      formMode,
      editTarget,
      formApiErrors,
      formErrorMessage,
      openEditModal,
      showDeleteModal,
      deleteTarget
    } = crud;
    const { isSubmitting, submitForm, isDeleting, submitDelete } = useCrudSubmit(crud, async () => {
      await refresh();
    });
    function onEditClick() {
      if (!customer.value) return;
      openEditModal(customer.value);
    }
    function handleFormSubmit(values) {
      submitForm(
        null,
        () => apiUpdateCustomer(editTarget.value.id, {
          full_name: values.full_name,
          phone: values.phone,
          email: values.email || null,
          note: values.note || null
        }),
        { update: "Đã cập nhật khách hàng" }
      );
    }
    const { isCheckingDelete, deleteBlockedMessage, openDeleteModal, handleDelete } = useCheckDelete({
      crud,
      submitDelete,
      checkFn: apiCheckDeleteCustomer,
      deleteFn: apiDeleteCustomer,
      successMessage: "Đã xoá khách hàng",
      errorFallback: "Không thể xoá khách hàng này",
      navigateAfter: "/pmc/customers"
    });
    function onDeleteClick() {
      if (!customer.value) return;
      openDeleteModal(customer.value);
    }
    function ticketStatusColor(v) {
      return ogTicketStatusColor(v);
    }
    function ticketPriorityColor(v) {
      return ogTicketPriorityColor(v);
    }
    function orderStatusBadge(v) {
      return orderStatusColor(v);
    }
    function receivableStatusBadge(v) {
      return receivableStatusColor(v);
    }
    function refreshAll() {
      refresh();
      toast.add({ title: "Đã làm mới dữ liệu", color: "info" });
    }
    return (_ctx, _push, _parent, _attrs) => {
      const _component_UAlert = _sfc_main$1;
      const _component_UBadge = _sfc_main$2;
      const _component_UIcon = _sfc_main$h;
      const _component_UButton = _sfc_main$c;
      const _component_UCard = _sfc_main$3;
      const _component_UTabs = _sfc_main$4;
      const _component_SharedSectionCard = __nuxt_component_4;
      const _component_SharedFieldDisplay = __nuxt_component_5;
      const _component_UTable = _sfc_main$5;
      const _component_NuxtLink = __nuxt_component_0$4;
      const _component_SharedCrudTablePagination = __nuxt_component_10;
      const _component_CustomerFormModal = __nuxt_component_11;
      const _component_SharedCrudDeleteModal = __nuxt_component_11$1;
      _push(`<div${serverRenderer_cjs_prodExports.ssrRenderAttrs(_attrs)}>`);
      if (vueExports.unref(status) === "pending" && !vueExports.unref(customer)) {
        _push(`<div class="flex flex-col gap-4"><div class="h-24 bg-slate-100 rounded-xl animate-pulse"></div><div class="grid grid-cols-1 md:grid-cols-4 gap-4"><!--[-->`);
        serverRenderer_cjs_prodExports.ssrRenderList(4, (i) => {
          _push(`<div class="h-24 bg-slate-100 rounded-xl animate-pulse"></div>`);
        });
        _push(`<!--]--></div><div class="h-48 bg-slate-100 rounded-xl animate-pulse"></div></div>`);
      } else if (vueExports.unref(error)) {
        _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UAlert, {
          color: "error",
          variant: "subtle",
          icon: "i-lucide-alert-circle",
          description: "Không tìm thấy khách hàng này."
        }, null, _parent));
      } else if (vueExports.unref(customer)) {
        _push(`<div class="flex flex-col gap-6"><div class="bg-white border border-border-gray rounded-xl shadow-sm p-5"><div class="flex flex-wrap items-start justify-between gap-4"><div class="min-w-0 flex-1"><div class="flex items-center gap-3 flex-wrap"><h1 class="text-xl font-bold text-slate-900">${serverRenderer_cjs_prodExports.ssrInterpolate(vueExports.unref(customer).full_name)}</h1>`);
        _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UBadge, {
          label: vueExports.unref(customer).code ?? "—",
          color: "neutral",
          variant: "subtle",
          size: "sm",
          class: "font-mono"
        }, null, _parent));
        _push(`</div><div class="mt-2 flex flex-wrap items-center gap-x-5 gap-y-1 text-sm text-slate-600"><span class="inline-flex items-center gap-1.5">`);
        _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UIcon, {
          name: "i-lucide-phone",
          class: "size-4 text-slate-400"
        }, null, _parent));
        _push(`<span class="font-mono">${serverRenderer_cjs_prodExports.ssrInterpolate(("formatPhone" in _ctx ? _ctx.formatPhone : vueExports.unref(formatPhone))(vueExports.unref(customer).phone))}</span></span>`);
        if (vueExports.unref(customer).email) {
          _push(`<span class="inline-flex items-center gap-1.5">`);
          _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UIcon, {
            name: "i-lucide-mail",
            class: "size-4 text-slate-400"
          }, null, _parent));
          _push(` ${serverRenderer_cjs_prodExports.ssrInterpolate(vueExports.unref(customer).email)}</span>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</div></div><div class="flex items-center gap-2 shrink-0">`);
        _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UButton, {
          icon: "i-lucide-refresh-cw",
          color: "neutral",
          variant: "ghost",
          size: "sm",
          onClick: refreshAll
        }, null, _parent));
        _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UButton, {
          icon: "i-lucide-pencil",
          label: "Chỉnh sửa",
          variant: "soft",
          color: "primary",
          onClick: onEditClick
        }, null, _parent));
        _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UButton, {
          icon: "i-lucide-trash-2",
          variant: "soft",
          color: "error",
          "aria-label": "Xoá khách",
          onClick: onDeleteClick
        }, null, _parent));
        _push(`</div></div></div>`);
        if (vueExports.unref(aggregates)) {
          _push(`<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">`);
          _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UCard, null, {
            default: vueExports.withCtx((_, _push2, _parent2, _scopeId) => {
              if (_push2) {
                _push2(`<div class="text-xs text-[var(--ui-text-muted)] uppercase tracking-wide"${_scopeId}> Tổng ticket </div><div class="mt-2 text-2xl font-bold text-slate-900"${_scopeId}>${serverRenderer_cjs_prodExports.ssrInterpolate(vueExports.unref(aggregates).ticket_count)}</div>`);
                if (Object.keys(vueExports.unref(aggregates).ticket_by_status).length) {
                  _push2(`<div class="mt-2 flex flex-wrap gap-1.5"${_scopeId}><!--[-->`);
                  serverRenderer_cjs_prodExports.ssrRenderList(vueExports.unref(aggregates).ticket_by_status, (count, key) => {
                    _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UBadge, {
                      key,
                      label: `${key}: ${count}`,
                      color: "neutral",
                      variant: "subtle",
                      size: "xs"
                    }, null, _parent2, _scopeId));
                  });
                  _push2(`<!--]--></div>`);
                } else {
                  _push2(`<!---->`);
                }
              } else {
                return [
                  vueExports.createVNode("div", { class: "text-xs text-[var(--ui-text-muted)] uppercase tracking-wide" }, " Tổng ticket "),
                  vueExports.createVNode("div", { class: "mt-2 text-2xl font-bold text-slate-900" }, vueExports.toDisplayString(vueExports.unref(aggregates).ticket_count), 1),
                  Object.keys(vueExports.unref(aggregates).ticket_by_status).length ? (vueExports.openBlock(), vueExports.createBlock("div", {
                    key: 0,
                    class: "mt-2 flex flex-wrap gap-1.5"
                  }, [
                    (vueExports.openBlock(true), vueExports.createBlock(vueExports.Fragment, null, vueExports.renderList(vueExports.unref(aggregates).ticket_by_status, (count, key) => {
                      return vueExports.openBlock(), vueExports.createBlock(_component_UBadge, {
                        key,
                        label: `${key}: ${count}`,
                        color: "neutral",
                        variant: "subtle",
                        size: "xs"
                      }, null, 8, ["label"]);
                    }), 128))
                  ])) : vueExports.createCommentVNode("", true)
                ];
              }
            }),
            _: 1
          }, _parent));
          _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UCard, null, {
            default: vueExports.withCtx((_, _push2, _parent2, _scopeId) => {
              if (_push2) {
                _push2(`<div class="text-xs text-[var(--ui-text-muted)] uppercase tracking-wide"${_scopeId}> CSAT trung bình </div><div class="mt-2 flex items-baseline gap-2"${_scopeId}><span class="text-2xl font-bold text-slate-900"${_scopeId}>${serverRenderer_cjs_prodExports.ssrInterpolate(vueExports.unref(aggregates).avg_rating !== null ? vueExports.unref(aggregates).avg_rating.toFixed(1) : "—")}</span>`);
                if (vueExports.unref(aggregates).avg_rating !== null) {
                  _push2(`<span class="text-sm text-[var(--ui-text-muted)]"${_scopeId}>/ 5</span>`);
                } else {
                  _push2(`<!---->`);
                }
                _push2(`</div><div class="mt-1 text-xs text-[var(--ui-text-muted)]"${_scopeId}> Trên ${serverRenderer_cjs_prodExports.ssrInterpolate(vueExports.unref(aggregates).rating_count)} đánh giá </div>`);
              } else {
                return [
                  vueExports.createVNode("div", { class: "text-xs text-[var(--ui-text-muted)] uppercase tracking-wide" }, " CSAT trung bình "),
                  vueExports.createVNode("div", { class: "mt-2 flex items-baseline gap-2" }, [
                    vueExports.createVNode("span", { class: "text-2xl font-bold text-slate-900" }, vueExports.toDisplayString(vueExports.unref(aggregates).avg_rating !== null ? vueExports.unref(aggregates).avg_rating.toFixed(1) : "—"), 1),
                    vueExports.unref(aggregates).avg_rating !== null ? (vueExports.openBlock(), vueExports.createBlock("span", {
                      key: 0,
                      class: "text-sm text-[var(--ui-text-muted)]"
                    }, "/ 5")) : vueExports.createCommentVNode("", true)
                  ]),
                  vueExports.createVNode("div", { class: "mt-1 text-xs text-[var(--ui-text-muted)]" }, " Trên " + vueExports.toDisplayString(vueExports.unref(aggregates).rating_count) + " đánh giá ", 1)
                ];
              }
            }),
            _: 1
          }, _parent));
          _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UCard, null, {
            default: vueExports.withCtx((_, _push2, _parent2, _scopeId) => {
              if (_push2) {
                _push2(`<div class="text-xs text-[var(--ui-text-muted)] uppercase tracking-wide"${_scopeId}> Tổng đã thu </div><div class="mt-2 text-2xl font-bold text-emerald-700"${_scopeId}>${serverRenderer_cjs_prodExports.ssrInterpolate(("formatCurrency" in _ctx ? _ctx.formatCurrency : vueExports.unref(formatCurrency))(vueExports.unref(aggregates).total_paid))}</div><div class="mt-1 text-xs text-[var(--ui-text-muted)]"${_scopeId}>${serverRenderer_cjs_prodExports.ssrInterpolate(vueExports.unref(aggregates).order_count)} đơn hàng </div>`);
              } else {
                return [
                  vueExports.createVNode("div", { class: "text-xs text-[var(--ui-text-muted)] uppercase tracking-wide" }, " Tổng đã thu "),
                  vueExports.createVNode("div", { class: "mt-2 text-2xl font-bold text-emerald-700" }, vueExports.toDisplayString(("formatCurrency" in _ctx ? _ctx.formatCurrency : vueExports.unref(formatCurrency))(vueExports.unref(aggregates).total_paid)), 1),
                  vueExports.createVNode("div", { class: "mt-1 text-xs text-[var(--ui-text-muted)]" }, vueExports.toDisplayString(vueExports.unref(aggregates).order_count) + " đơn hàng ", 1)
                ];
              }
            }),
            _: 1
          }, _parent));
          _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UCard, null, {
            default: vueExports.withCtx((_, _push2, _parent2, _scopeId) => {
              if (_push2) {
                _push2(`<div class="text-xs text-[var(--ui-text-muted)] uppercase tracking-wide"${_scopeId}> Còn nợ </div><div class="${serverRenderer_cjs_prodExports.ssrRenderClass([Number(vueExports.unref(aggregates).total_outstanding) > 0 ? "text-red-600" : "text-slate-900", "mt-2 text-2xl font-bold"])}"${_scopeId}>${serverRenderer_cjs_prodExports.ssrInterpolate(("formatCurrency" in _ctx ? _ctx.formatCurrency : vueExports.unref(formatCurrency))(vueExports.unref(aggregates).total_outstanding))}</div>`);
              } else {
                return [
                  vueExports.createVNode("div", { class: "text-xs text-[var(--ui-text-muted)] uppercase tracking-wide" }, " Còn nợ "),
                  vueExports.createVNode("div", {
                    class: ["mt-2 text-2xl font-bold", Number(vueExports.unref(aggregates).total_outstanding) > 0 ? "text-red-600" : "text-slate-900"]
                  }, vueExports.toDisplayString(("formatCurrency" in _ctx ? _ctx.formatCurrency : vueExports.unref(formatCurrency))(vueExports.unref(aggregates).total_outstanding)), 3)
                ];
              }
            }),
            _: 1
          }, _parent));
          _push(`</div>`);
        } else {
          _push(`<!---->`);
        }
        _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UTabs, {
          modelValue: vueExports.unref(activeTab),
          "onUpdate:modelValue": ($event) => vueExports.isRef(activeTab) ? activeTab.value = $event : null,
          items: tabItems,
          variant: "link",
          content: false,
          class: "w-full"
        }, null, _parent));
        if (vueExports.unref(activeTab) === "info") {
          _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_SharedSectionCard, { title: "Thông tin khách hàng" }, {
            default: vueExports.withCtx((_, _push2, _parent2, _scopeId) => {
              if (_push2) {
                _push2(`<div class="grid grid-cols-1 sm:grid-cols-2 gap-5"${_scopeId}>`);
                _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_SharedFieldDisplay, { label: "Họ tên" }, {
                  default: vueExports.withCtx((_2, _push3, _parent3, _scopeId2) => {
                    if (_push3) {
                      _push3(`<span class="font-medium"${_scopeId2}>${serverRenderer_cjs_prodExports.ssrInterpolate(vueExports.unref(customer).full_name)}</span>`);
                    } else {
                      return [
                        vueExports.createVNode("span", { class: "font-medium" }, vueExports.toDisplayString(vueExports.unref(customer).full_name), 1)
                      ];
                    }
                  }),
                  _: 1
                }, _parent2, _scopeId));
                _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_SharedFieldDisplay, { label: "Số điện thoại" }, {
                  default: vueExports.withCtx((_2, _push3, _parent3, _scopeId2) => {
                    if (_push3) {
                      _push3(`<span class="font-mono font-medium"${_scopeId2}>${serverRenderer_cjs_prodExports.ssrInterpolate(("formatPhone" in _ctx ? _ctx.formatPhone : vueExports.unref(formatPhone))(vueExports.unref(customer).phone))}</span>`);
                    } else {
                      return [
                        vueExports.createVNode("span", { class: "font-mono font-medium" }, vueExports.toDisplayString(("formatPhone" in _ctx ? _ctx.formatPhone : vueExports.unref(formatPhone))(vueExports.unref(customer).phone)), 1)
                      ];
                    }
                  }),
                  _: 1
                }, _parent2, _scopeId));
                _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_SharedFieldDisplay, { label: "Email" }, {
                  default: vueExports.withCtx((_2, _push3, _parent3, _scopeId2) => {
                    if (_push3) {
                      _push3(`${serverRenderer_cjs_prodExports.ssrInterpolate(vueExports.unref(customer).email ?? "—")}`);
                    } else {
                      return [
                        vueExports.createTextVNode(vueExports.toDisplayString(vueExports.unref(customer).email ?? "—"), 1)
                      ];
                    }
                  }),
                  _: 1
                }, _parent2, _scopeId));
                _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_SharedFieldDisplay, { label: "Mã khách" }, {
                  default: vueExports.withCtx((_2, _push3, _parent3, _scopeId2) => {
                    if (_push3) {
                      _push3(`<span class="font-mono"${_scopeId2}>${serverRenderer_cjs_prodExports.ssrInterpolate(vueExports.unref(customer).code ?? "—")}</span>`);
                    } else {
                      return [
                        vueExports.createVNode("span", { class: "font-mono" }, vueExports.toDisplayString(vueExports.unref(customer).code ?? "—"), 1)
                      ];
                    }
                  }),
                  _: 1
                }, _parent2, _scopeId));
                _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_SharedFieldDisplay, { label: "Lần đầu liên hệ" }, {
                  default: vueExports.withCtx((_2, _push3, _parent3, _scopeId2) => {
                    if (_push3) {
                      _push3(`${serverRenderer_cjs_prodExports.ssrInterpolate(("formatDateTime" in _ctx ? _ctx.formatDateTime : vueExports.unref(formatDateTime))(vueExports.unref(customer).first_contacted_at))}`);
                    } else {
                      return [
                        vueExports.createTextVNode(vueExports.toDisplayString(("formatDateTime" in _ctx ? _ctx.formatDateTime : vueExports.unref(formatDateTime))(vueExports.unref(customer).first_contacted_at)), 1)
                      ];
                    }
                  }),
                  _: 1
                }, _parent2, _scopeId));
                _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_SharedFieldDisplay, { label: "Lần gần nhất liên hệ" }, {
                  default: vueExports.withCtx((_2, _push3, _parent3, _scopeId2) => {
                    if (_push3) {
                      _push3(`${serverRenderer_cjs_prodExports.ssrInterpolate(("formatDateTime" in _ctx ? _ctx.formatDateTime : vueExports.unref(formatDateTime))(vueExports.unref(customer).last_contacted_at))}`);
                    } else {
                      return [
                        vueExports.createTextVNode(vueExports.toDisplayString(("formatDateTime" in _ctx ? _ctx.formatDateTime : vueExports.unref(formatDateTime))(vueExports.unref(customer).last_contacted_at)), 1)
                      ];
                    }
                  }),
                  _: 1
                }, _parent2, _scopeId));
                _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_SharedFieldDisplay, { label: "Ngày tạo" }, {
                  default: vueExports.withCtx((_2, _push3, _parent3, _scopeId2) => {
                    if (_push3) {
                      _push3(`${serverRenderer_cjs_prodExports.ssrInterpolate(("formatDateTime" in _ctx ? _ctx.formatDateTime : vueExports.unref(formatDateTime))(vueExports.unref(customer).created_at))}`);
                    } else {
                      return [
                        vueExports.createTextVNode(vueExports.toDisplayString(("formatDateTime" in _ctx ? _ctx.formatDateTime : vueExports.unref(formatDateTime))(vueExports.unref(customer).created_at)), 1)
                      ];
                    }
                  }),
                  _: 1
                }, _parent2, _scopeId));
                _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_SharedFieldDisplay, { label: "Cập nhật lần cuối" }, {
                  default: vueExports.withCtx((_2, _push3, _parent3, _scopeId2) => {
                    if (_push3) {
                      _push3(`${serverRenderer_cjs_prodExports.ssrInterpolate(("formatDateTime" in _ctx ? _ctx.formatDateTime : vueExports.unref(formatDateTime))(vueExports.unref(customer).updated_at))}`);
                    } else {
                      return [
                        vueExports.createTextVNode(vueExports.toDisplayString(("formatDateTime" in _ctx ? _ctx.formatDateTime : vueExports.unref(formatDateTime))(vueExports.unref(customer).updated_at)), 1)
                      ];
                    }
                  }),
                  _: 1
                }, _parent2, _scopeId));
                _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_SharedFieldDisplay, {
                  label: "Ghi chú",
                  class: "sm:col-span-2"
                }, {
                  default: vueExports.withCtx((_2, _push3, _parent3, _scopeId2) => {
                    if (_push3) {
                      _push3(`<span class="whitespace-pre-line"${_scopeId2}>${serverRenderer_cjs_prodExports.ssrInterpolate(vueExports.unref(customer).note || "—")}</span>`);
                    } else {
                      return [
                        vueExports.createVNode("span", { class: "whitespace-pre-line" }, vueExports.toDisplayString(vueExports.unref(customer).note || "—"), 1)
                      ];
                    }
                  }),
                  _: 1
                }, _parent2, _scopeId));
                _push2(`</div>`);
              } else {
                return [
                  vueExports.createVNode("div", { class: "grid grid-cols-1 sm:grid-cols-2 gap-5" }, [
                    vueExports.createVNode(_component_SharedFieldDisplay, { label: "Họ tên" }, {
                      default: vueExports.withCtx(() => [
                        vueExports.createVNode("span", { class: "font-medium" }, vueExports.toDisplayString(vueExports.unref(customer).full_name), 1)
                      ]),
                      _: 1
                    }),
                    vueExports.createVNode(_component_SharedFieldDisplay, { label: "Số điện thoại" }, {
                      default: vueExports.withCtx(() => [
                        vueExports.createVNode("span", { class: "font-mono font-medium" }, vueExports.toDisplayString(("formatPhone" in _ctx ? _ctx.formatPhone : vueExports.unref(formatPhone))(vueExports.unref(customer).phone)), 1)
                      ]),
                      _: 1
                    }),
                    vueExports.createVNode(_component_SharedFieldDisplay, { label: "Email" }, {
                      default: vueExports.withCtx(() => [
                        vueExports.createTextVNode(vueExports.toDisplayString(vueExports.unref(customer).email ?? "—"), 1)
                      ]),
                      _: 1
                    }),
                    vueExports.createVNode(_component_SharedFieldDisplay, { label: "Mã khách" }, {
                      default: vueExports.withCtx(() => [
                        vueExports.createVNode("span", { class: "font-mono" }, vueExports.toDisplayString(vueExports.unref(customer).code ?? "—"), 1)
                      ]),
                      _: 1
                    }),
                    vueExports.createVNode(_component_SharedFieldDisplay, { label: "Lần đầu liên hệ" }, {
                      default: vueExports.withCtx(() => [
                        vueExports.createTextVNode(vueExports.toDisplayString(("formatDateTime" in _ctx ? _ctx.formatDateTime : vueExports.unref(formatDateTime))(vueExports.unref(customer).first_contacted_at)), 1)
                      ]),
                      _: 1
                    }),
                    vueExports.createVNode(_component_SharedFieldDisplay, { label: "Lần gần nhất liên hệ" }, {
                      default: vueExports.withCtx(() => [
                        vueExports.createTextVNode(vueExports.toDisplayString(("formatDateTime" in _ctx ? _ctx.formatDateTime : vueExports.unref(formatDateTime))(vueExports.unref(customer).last_contacted_at)), 1)
                      ]),
                      _: 1
                    }),
                    vueExports.createVNode(_component_SharedFieldDisplay, { label: "Ngày tạo" }, {
                      default: vueExports.withCtx(() => [
                        vueExports.createTextVNode(vueExports.toDisplayString(("formatDateTime" in _ctx ? _ctx.formatDateTime : vueExports.unref(formatDateTime))(vueExports.unref(customer).created_at)), 1)
                      ]),
                      _: 1
                    }),
                    vueExports.createVNode(_component_SharedFieldDisplay, { label: "Cập nhật lần cuối" }, {
                      default: vueExports.withCtx(() => [
                        vueExports.createTextVNode(vueExports.toDisplayString(("formatDateTime" in _ctx ? _ctx.formatDateTime : vueExports.unref(formatDateTime))(vueExports.unref(customer).updated_at)), 1)
                      ]),
                      _: 1
                    }),
                    vueExports.createVNode(_component_SharedFieldDisplay, {
                      label: "Ghi chú",
                      class: "sm:col-span-2"
                    }, {
                      default: vueExports.withCtx(() => [
                        vueExports.createVNode("span", { class: "whitespace-pre-line" }, vueExports.toDisplayString(vueExports.unref(customer).note || "—"), 1)
                      ]),
                      _: 1
                    })
                  ])
                ];
              }
            }),
            _: 1
          }, _parent));
        } else if (vueExports.unref(activeTab) === "tickets") {
          _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_SharedSectionCard, { title: "Lịch sử ticket" }, {
            default: vueExports.withCtx((_, _push2, _parent2, _scopeId) => {
              if (_push2) {
                if (vueExports.unref(ticketStatus) === "pending" && vueExports.unref(tickets).length === 0) {
                  _push2(`<div class="h-24 bg-slate-50 rounded-lg animate-pulse"${_scopeId}></div>`);
                } else if (vueExports.unref(ticketError)) {
                  _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UAlert, {
                    color: "error",
                    variant: "subtle",
                    icon: "i-lucide-alert-circle",
                    description: "Không thể tải danh sách ticket."
                  }, null, _parent2, _scopeId));
                } else if (vueExports.unref(tickets).length === 0) {
                  _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UAlert, {
                    color: "info",
                    variant: "subtle",
                    icon: "i-lucide-inbox",
                    description: "Khách hàng chưa có ticket nào."
                  }, null, _parent2, _scopeId));
                } else {
                  _push2(`<div class="-mx-6 -mb-5"${_scopeId}>`);
                  _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UTable, {
                    data: vueExports.unref(tickets),
                    columns: ticketColumns
                  }, {
                    "code-cell": vueExports.withCtx(({ row }, _push3, _parent3, _scopeId2) => {
                      if (_push3) {
                        _push3(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_NuxtLink, {
                          to: `/pmc/og-tickets/${row.original.id}`,
                          class: "font-medium text-primary-700 hover:underline"
                        }, {
                          default: vueExports.withCtx((_2, _push4, _parent4, _scopeId3) => {
                            if (_push4) {
                              _push4(`${serverRenderer_cjs_prodExports.ssrInterpolate(row.original.subject)}`);
                            } else {
                              return [
                                vueExports.createTextVNode(vueExports.toDisplayString(row.original.subject), 1)
                              ];
                            }
                          }),
                          _: 2
                        }, _parent3, _scopeId2));
                      } else {
                        return [
                          vueExports.createVNode(_component_NuxtLink, {
                            to: `/pmc/og-tickets/${row.original.id}`,
                            class: "font-medium text-primary-700 hover:underline"
                          }, {
                            default: vueExports.withCtx(() => [
                              vueExports.createTextVNode(vueExports.toDisplayString(row.original.subject), 1)
                            ]),
                            _: 2
                          }, 1032, ["to"])
                        ];
                      }
                    }),
                    "project-cell": vueExports.withCtx(({ row }, _push3, _parent3, _scopeId2) => {
                      if (_push3) {
                        if (row.original.project) {
                          _push3(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_NuxtLink, {
                            to: `/pmc/projects/${row.original.project.id}`,
                            class: "text-primary-600 hover:underline"
                          }, {
                            default: vueExports.withCtx((_2, _push4, _parent4, _scopeId3) => {
                              if (_push4) {
                                _push4(`${serverRenderer_cjs_prodExports.ssrInterpolate(row.original.project.name)}`);
                              } else {
                                return [
                                  vueExports.createTextVNode(vueExports.toDisplayString(row.original.project.name), 1)
                                ];
                              }
                            }),
                            _: 2
                          }, _parent3, _scopeId2));
                        } else {
                          _push3(`<span${_scopeId2}>—</span>`);
                        }
                      } else {
                        return [
                          row.original.project ? (vueExports.openBlock(), vueExports.createBlock(_component_NuxtLink, {
                            key: 0,
                            to: `/pmc/projects/${row.original.project.id}`,
                            class: "text-primary-600 hover:underline"
                          }, {
                            default: vueExports.withCtx(() => [
                              vueExports.createTextVNode(vueExports.toDisplayString(row.original.project.name), 1)
                            ]),
                            _: 2
                          }, 1032, ["to"])) : (vueExports.openBlock(), vueExports.createBlock("span", { key: 1 }, "—"))
                        ];
                      }
                    }),
                    "status-cell": vueExports.withCtx(({ row }, _push3, _parent3, _scopeId2) => {
                      if (_push3) {
                        _push3(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UBadge, {
                          label: row.original.status.label,
                          color: ticketStatusColor(row.original.status.value),
                          variant: "subtle",
                          size: "sm"
                        }, null, _parent3, _scopeId2));
                      } else {
                        return [
                          vueExports.createVNode(_component_UBadge, {
                            label: row.original.status.label,
                            color: ticketStatusColor(row.original.status.value),
                            variant: "subtle",
                            size: "sm"
                          }, null, 8, ["label", "color"])
                        ];
                      }
                    }),
                    "priority-cell": vueExports.withCtx(({ row }, _push3, _parent3, _scopeId2) => {
                      if (_push3) {
                        _push3(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UBadge, {
                          label: row.original.priority.label,
                          color: ticketPriorityColor(row.original.priority.value),
                          variant: "subtle",
                          size: "sm"
                        }, null, _parent3, _scopeId2));
                      } else {
                        return [
                          vueExports.createVNode(_component_UBadge, {
                            label: row.original.priority.label,
                            color: ticketPriorityColor(row.original.priority.value),
                            variant: "subtle",
                            size: "sm"
                          }, null, 8, ["label", "color"])
                        ];
                      }
                    }),
                    "received_at-cell": vueExports.withCtx(({ row }, _push3, _parent3, _scopeId2) => {
                      if (_push3) {
                        _push3(`${serverRenderer_cjs_prodExports.ssrInterpolate(("formatDate" in _ctx ? _ctx.formatDate : vueExports.unref(formatDate))(row.original.received_at))}`);
                      } else {
                        return [
                          vueExports.createTextVNode(vueExports.toDisplayString(("formatDate" in _ctx ? _ctx.formatDate : vueExports.unref(formatDate))(row.original.received_at)), 1)
                        ];
                      }
                    }),
                    "rating-cell": vueExports.withCtx(({ row }, _push3, _parent3, _scopeId2) => {
                      if (_push3) {
                        if (row.original.resident_rating != null) {
                          _push3(`<span class="text-amber-500 text-base tracking-tight"${_scopeId2}><!--[-->`);
                          serverRenderer_cjs_prodExports.ssrRenderList(5, (n) => {
                            _push3(`<span${_scopeId2}>${serverRenderer_cjs_prodExports.ssrInterpolate(n <= (row.original.resident_rating ?? 0) ? "★" : "☆")}</span>`);
                          });
                          _push3(`<!--]--></span>`);
                        } else {
                          _push3(`<span class="text-[var(--ui-text-muted)]"${_scopeId2}>—</span>`);
                        }
                      } else {
                        return [
                          row.original.resident_rating != null ? (vueExports.openBlock(), vueExports.createBlock("span", {
                            key: 0,
                            class: "text-amber-500 text-base tracking-tight"
                          }, [
                            (vueExports.openBlock(), vueExports.createBlock(vueExports.Fragment, null, vueExports.renderList(5, (n) => {
                              return vueExports.createVNode("span", { key: n }, vueExports.toDisplayString(n <= (row.original.resident_rating ?? 0) ? "★" : "☆"), 1);
                            }), 64))
                          ])) : (vueExports.openBlock(), vueExports.createBlock("span", {
                            key: 1,
                            class: "text-[var(--ui-text-muted)]"
                          }, "—"))
                        ];
                      }
                    }),
                    _: 1
                  }, _parent2, _scopeId));
                  _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_SharedCrudTablePagination, {
                    page: vueExports.unref(ticketPage),
                    "onUpdate:page": ($event) => vueExports.isRef(ticketPage) ? ticketPage.value = $event : null,
                    meta: vueExports.unref(ticketData)?.meta
                  }, null, _parent2, _scopeId));
                  _push2(`</div>`);
                }
              } else {
                return [
                  vueExports.unref(ticketStatus) === "pending" && vueExports.unref(tickets).length === 0 ? (vueExports.openBlock(), vueExports.createBlock("div", {
                    key: 0,
                    class: "h-24 bg-slate-50 rounded-lg animate-pulse"
                  })) : vueExports.unref(ticketError) ? (vueExports.openBlock(), vueExports.createBlock(_component_UAlert, {
                    key: 1,
                    color: "error",
                    variant: "subtle",
                    icon: "i-lucide-alert-circle",
                    description: "Không thể tải danh sách ticket."
                  })) : vueExports.unref(tickets).length === 0 ? (vueExports.openBlock(), vueExports.createBlock(_component_UAlert, {
                    key: 2,
                    color: "info",
                    variant: "subtle",
                    icon: "i-lucide-inbox",
                    description: "Khách hàng chưa có ticket nào."
                  })) : (vueExports.openBlock(), vueExports.createBlock("div", {
                    key: 3,
                    class: "-mx-6 -mb-5"
                  }, [
                    vueExports.createVNode(_component_UTable, {
                      data: vueExports.unref(tickets),
                      columns: ticketColumns
                    }, {
                      "code-cell": vueExports.withCtx(({ row }) => [
                        vueExports.createVNode(_component_NuxtLink, {
                          to: `/pmc/og-tickets/${row.original.id}`,
                          class: "font-medium text-primary-700 hover:underline"
                        }, {
                          default: vueExports.withCtx(() => [
                            vueExports.createTextVNode(vueExports.toDisplayString(row.original.subject), 1)
                          ]),
                          _: 2
                        }, 1032, ["to"])
                      ]),
                      "project-cell": vueExports.withCtx(({ row }) => [
                        row.original.project ? (vueExports.openBlock(), vueExports.createBlock(_component_NuxtLink, {
                          key: 0,
                          to: `/pmc/projects/${row.original.project.id}`,
                          class: "text-primary-600 hover:underline"
                        }, {
                          default: vueExports.withCtx(() => [
                            vueExports.createTextVNode(vueExports.toDisplayString(row.original.project.name), 1)
                          ]),
                          _: 2
                        }, 1032, ["to"])) : (vueExports.openBlock(), vueExports.createBlock("span", { key: 1 }, "—"))
                      ]),
                      "status-cell": vueExports.withCtx(({ row }) => [
                        vueExports.createVNode(_component_UBadge, {
                          label: row.original.status.label,
                          color: ticketStatusColor(row.original.status.value),
                          variant: "subtle",
                          size: "sm"
                        }, null, 8, ["label", "color"])
                      ]),
                      "priority-cell": vueExports.withCtx(({ row }) => [
                        vueExports.createVNode(_component_UBadge, {
                          label: row.original.priority.label,
                          color: ticketPriorityColor(row.original.priority.value),
                          variant: "subtle",
                          size: "sm"
                        }, null, 8, ["label", "color"])
                      ]),
                      "received_at-cell": vueExports.withCtx(({ row }) => [
                        vueExports.createTextVNode(vueExports.toDisplayString(("formatDate" in _ctx ? _ctx.formatDate : vueExports.unref(formatDate))(row.original.received_at)), 1)
                      ]),
                      "rating-cell": vueExports.withCtx(({ row }) => [
                        row.original.resident_rating != null ? (vueExports.openBlock(), vueExports.createBlock("span", {
                          key: 0,
                          class: "text-amber-500 text-base tracking-tight"
                        }, [
                          (vueExports.openBlock(), vueExports.createBlock(vueExports.Fragment, null, vueExports.renderList(5, (n) => {
                            return vueExports.createVNode("span", { key: n }, vueExports.toDisplayString(n <= (row.original.resident_rating ?? 0) ? "★" : "☆"), 1);
                          }), 64))
                        ])) : (vueExports.openBlock(), vueExports.createBlock("span", {
                          key: 1,
                          class: "text-[var(--ui-text-muted)]"
                        }, "—"))
                      ]),
                      _: 1
                    }, 8, ["data"]),
                    vueExports.createVNode(_component_SharedCrudTablePagination, {
                      page: vueExports.unref(ticketPage),
                      "onUpdate:page": ($event) => vueExports.isRef(ticketPage) ? ticketPage.value = $event : null,
                      meta: vueExports.unref(ticketData)?.meta
                    }, null, 8, ["page", "onUpdate:page", "meta"])
                  ]))
                ];
              }
            }),
            _: 1
          }, _parent));
        } else if (vueExports.unref(activeTab) === "orders") {
          _push(`<!--[-->`);
          _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_SharedSectionCard, { title: "Đơn hàng" }, {
            default: vueExports.withCtx((_, _push2, _parent2, _scopeId) => {
              if (_push2) {
                if (vueExports.unref(orderStatus) === "pending" && vueExports.unref(orders).length === 0) {
                  _push2(`<div class="h-24 bg-slate-50 rounded-lg animate-pulse"${_scopeId}></div>`);
                } else if (vueExports.unref(orderError)) {
                  _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UAlert, {
                    color: "error",
                    variant: "subtle",
                    icon: "i-lucide-alert-circle",
                    description: "Không thể tải danh sách đơn hàng."
                  }, null, _parent2, _scopeId));
                } else if (vueExports.unref(orders).length === 0) {
                  _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UAlert, {
                    color: "info",
                    variant: "subtle",
                    icon: "i-lucide-inbox",
                    description: "Khách hàng chưa có đơn hàng nào."
                  }, null, _parent2, _scopeId));
                } else {
                  _push2(`<div class="-mx-6 -mb-5"${_scopeId}>`);
                  _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UTable, {
                    data: vueExports.unref(orders),
                    columns: orderColumns
                  }, {
                    "code-cell": vueExports.withCtx(({ row }, _push3, _parent3, _scopeId2) => {
                      if (_push3) {
                        _push3(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_NuxtLink, {
                          to: `/pmc/orders/${row.original.id}`,
                          class: "font-mono text-primary-600 hover:underline"
                        }, {
                          default: vueExports.withCtx((_2, _push4, _parent4, _scopeId3) => {
                            if (_push4) {
                              _push4(`${serverRenderer_cjs_prodExports.ssrInterpolate(row.original.code ?? "—")}`);
                            } else {
                              return [
                                vueExports.createTextVNode(vueExports.toDisplayString(row.original.code ?? "—"), 1)
                              ];
                            }
                          }),
                          _: 2
                        }, _parent3, _scopeId2));
                      } else {
                        return [
                          vueExports.createVNode(_component_NuxtLink, {
                            to: `/pmc/orders/${row.original.id}`,
                            class: "font-mono text-primary-600 hover:underline"
                          }, {
                            default: vueExports.withCtx(() => [
                              vueExports.createTextVNode(vueExports.toDisplayString(row.original.code ?? "—"), 1)
                            ]),
                            _: 2
                          }, 1032, ["to"])
                        ];
                      }
                    }),
                    "ticket-cell": vueExports.withCtx(({ row }, _push3, _parent3, _scopeId2) => {
                      if (_push3) {
                        if (row.original.ticket) {
                          _push3(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_NuxtLink, {
                            to: `/pmc/og-tickets/${row.original.ticket.id}`,
                            class: "text-primary-600 hover:underline"
                          }, {
                            default: vueExports.withCtx((_2, _push4, _parent4, _scopeId3) => {
                              if (_push4) {
                                _push4(`${serverRenderer_cjs_prodExports.ssrInterpolate(row.original.ticket.subject)}`);
                              } else {
                                return [
                                  vueExports.createTextVNode(vueExports.toDisplayString(row.original.ticket.subject), 1)
                                ];
                              }
                            }),
                            _: 2
                          }, _parent3, _scopeId2));
                        } else {
                          _push3(`<span${_scopeId2}>—</span>`);
                        }
                      } else {
                        return [
                          row.original.ticket ? (vueExports.openBlock(), vueExports.createBlock(_component_NuxtLink, {
                            key: 0,
                            to: `/pmc/og-tickets/${row.original.ticket.id}`,
                            class: "text-primary-600 hover:underline"
                          }, {
                            default: vueExports.withCtx(() => [
                              vueExports.createTextVNode(vueExports.toDisplayString(row.original.ticket.subject), 1)
                            ]),
                            _: 2
                          }, 1032, ["to"])) : (vueExports.openBlock(), vueExports.createBlock("span", { key: 1 }, "—"))
                        ];
                      }
                    }),
                    "status-cell": vueExports.withCtx(({ row }, _push3, _parent3, _scopeId2) => {
                      if (_push3) {
                        _push3(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UBadge, {
                          label: row.original.status.label,
                          color: orderStatusBadge(row.original.status.value),
                          variant: "subtle",
                          size: "sm"
                        }, null, _parent3, _scopeId2));
                      } else {
                        return [
                          vueExports.createVNode(_component_UBadge, {
                            label: row.original.status.label,
                            color: orderStatusBadge(row.original.status.value),
                            variant: "subtle",
                            size: "sm"
                          }, null, 8, ["label", "color"])
                        ];
                      }
                    }),
                    "total_amount-cell": vueExports.withCtx(({ row }, _push3, _parent3, _scopeId2) => {
                      if (_push3) {
                        _push3(`<span class="font-medium"${_scopeId2}>${serverRenderer_cjs_prodExports.ssrInterpolate(("formatCurrency" in _ctx ? _ctx.formatCurrency : vueExports.unref(formatCurrency))(row.original.total_amount))}</span>`);
                      } else {
                        return [
                          vueExports.createVNode("span", { class: "font-medium" }, vueExports.toDisplayString(("formatCurrency" in _ctx ? _ctx.formatCurrency : vueExports.unref(formatCurrency))(row.original.total_amount)), 1)
                        ];
                      }
                    }),
                    "receivable_status-cell": vueExports.withCtx(({ row }, _push3, _parent3, _scopeId2) => {
                      if (_push3) {
                        if (row.original.receivable?.status) {
                          _push3(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UBadge, {
                            label: row.original.receivable.status.label,
                            color: receivableStatusBadge(row.original.receivable.status.value),
                            variant: "subtle",
                            size: "sm"
                          }, null, _parent3, _scopeId2));
                        } else {
                          _push3(`<span class="text-[var(--ui-text-muted)]"${_scopeId2}>—</span>`);
                        }
                      } else {
                        return [
                          row.original.receivable?.status ? (vueExports.openBlock(), vueExports.createBlock(_component_UBadge, {
                            key: 0,
                            label: row.original.receivable.status.label,
                            color: receivableStatusBadge(row.original.receivable.status.value),
                            variant: "subtle",
                            size: "sm"
                          }, null, 8, ["label", "color"])) : (vueExports.openBlock(), vueExports.createBlock("span", {
                            key: 1,
                            class: "text-[var(--ui-text-muted)]"
                          }, "—"))
                        ];
                      }
                    }),
                    "paid_amount-cell": vueExports.withCtx(({ row }, _push3, _parent3, _scopeId2) => {
                      if (_push3) {
                        _push3(`${serverRenderer_cjs_prodExports.ssrInterpolate(row.original.receivable ? ("formatCurrency" in _ctx ? _ctx.formatCurrency : vueExports.unref(formatCurrency))(row.original.receivable.paid_amount) : "—")}`);
                      } else {
                        return [
                          vueExports.createTextVNode(vueExports.toDisplayString(row.original.receivable ? ("formatCurrency" in _ctx ? _ctx.formatCurrency : vueExports.unref(formatCurrency))(row.original.receivable.paid_amount) : "—"), 1)
                        ];
                      }
                    }),
                    "outstanding-cell": vueExports.withCtx(({ row }, _push3, _parent3, _scopeId2) => {
                      if (_push3) {
                        if (row.original.receivable) {
                          _push3(`<span class="${serverRenderer_cjs_prodExports.ssrRenderClass(Number(row.original.receivable.outstanding_amount) > 0 ? "text-red-600 font-medium" : "")}"${_scopeId2}>${serverRenderer_cjs_prodExports.ssrInterpolate(("formatCurrency" in _ctx ? _ctx.formatCurrency : vueExports.unref(formatCurrency))(row.original.receivable.outstanding_amount))}</span>`);
                        } else {
                          _push3(`<span class="text-[var(--ui-text-muted)]"${_scopeId2}>—</span>`);
                        }
                      } else {
                        return [
                          row.original.receivable ? (vueExports.openBlock(), vueExports.createBlock("span", {
                            key: 0,
                            class: Number(row.original.receivable.outstanding_amount) > 0 ? "text-red-600 font-medium" : ""
                          }, vueExports.toDisplayString(("formatCurrency" in _ctx ? _ctx.formatCurrency : vueExports.unref(formatCurrency))(row.original.receivable.outstanding_amount)), 3)) : (vueExports.openBlock(), vueExports.createBlock("span", {
                            key: 1,
                            class: "text-[var(--ui-text-muted)]"
                          }, "—"))
                        ];
                      }
                    }),
                    _: 1
                  }, _parent2, _scopeId));
                  _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_SharedCrudTablePagination, {
                    page: vueExports.unref(orderPage),
                    "onUpdate:page": ($event) => vueExports.isRef(orderPage) ? orderPage.value = $event : null,
                    meta: vueExports.unref(orderData)?.meta
                  }, null, _parent2, _scopeId));
                  _push2(`</div>`);
                }
              } else {
                return [
                  vueExports.unref(orderStatus) === "pending" && vueExports.unref(orders).length === 0 ? (vueExports.openBlock(), vueExports.createBlock("div", {
                    key: 0,
                    class: "h-24 bg-slate-50 rounded-lg animate-pulse"
                  })) : vueExports.unref(orderError) ? (vueExports.openBlock(), vueExports.createBlock(_component_UAlert, {
                    key: 1,
                    color: "error",
                    variant: "subtle",
                    icon: "i-lucide-alert-circle",
                    description: "Không thể tải danh sách đơn hàng."
                  })) : vueExports.unref(orders).length === 0 ? (vueExports.openBlock(), vueExports.createBlock(_component_UAlert, {
                    key: 2,
                    color: "info",
                    variant: "subtle",
                    icon: "i-lucide-inbox",
                    description: "Khách hàng chưa có đơn hàng nào."
                  })) : (vueExports.openBlock(), vueExports.createBlock("div", {
                    key: 3,
                    class: "-mx-6 -mb-5"
                  }, [
                    vueExports.createVNode(_component_UTable, {
                      data: vueExports.unref(orders),
                      columns: orderColumns
                    }, {
                      "code-cell": vueExports.withCtx(({ row }) => [
                        vueExports.createVNode(_component_NuxtLink, {
                          to: `/pmc/orders/${row.original.id}`,
                          class: "font-mono text-primary-600 hover:underline"
                        }, {
                          default: vueExports.withCtx(() => [
                            vueExports.createTextVNode(vueExports.toDisplayString(row.original.code ?? "—"), 1)
                          ]),
                          _: 2
                        }, 1032, ["to"])
                      ]),
                      "ticket-cell": vueExports.withCtx(({ row }) => [
                        row.original.ticket ? (vueExports.openBlock(), vueExports.createBlock(_component_NuxtLink, {
                          key: 0,
                          to: `/pmc/og-tickets/${row.original.ticket.id}`,
                          class: "text-primary-600 hover:underline"
                        }, {
                          default: vueExports.withCtx(() => [
                            vueExports.createTextVNode(vueExports.toDisplayString(row.original.ticket.subject), 1)
                          ]),
                          _: 2
                        }, 1032, ["to"])) : (vueExports.openBlock(), vueExports.createBlock("span", { key: 1 }, "—"))
                      ]),
                      "status-cell": vueExports.withCtx(({ row }) => [
                        vueExports.createVNode(_component_UBadge, {
                          label: row.original.status.label,
                          color: orderStatusBadge(row.original.status.value),
                          variant: "subtle",
                          size: "sm"
                        }, null, 8, ["label", "color"])
                      ]),
                      "total_amount-cell": vueExports.withCtx(({ row }) => [
                        vueExports.createVNode("span", { class: "font-medium" }, vueExports.toDisplayString(("formatCurrency" in _ctx ? _ctx.formatCurrency : vueExports.unref(formatCurrency))(row.original.total_amount)), 1)
                      ]),
                      "receivable_status-cell": vueExports.withCtx(({ row }) => [
                        row.original.receivable?.status ? (vueExports.openBlock(), vueExports.createBlock(_component_UBadge, {
                          key: 0,
                          label: row.original.receivable.status.label,
                          color: receivableStatusBadge(row.original.receivable.status.value),
                          variant: "subtle",
                          size: "sm"
                        }, null, 8, ["label", "color"])) : (vueExports.openBlock(), vueExports.createBlock("span", {
                          key: 1,
                          class: "text-[var(--ui-text-muted)]"
                        }, "—"))
                      ]),
                      "paid_amount-cell": vueExports.withCtx(({ row }) => [
                        vueExports.createTextVNode(vueExports.toDisplayString(row.original.receivable ? ("formatCurrency" in _ctx ? _ctx.formatCurrency : vueExports.unref(formatCurrency))(row.original.receivable.paid_amount) : "—"), 1)
                      ]),
                      "outstanding-cell": vueExports.withCtx(({ row }) => [
                        row.original.receivable ? (vueExports.openBlock(), vueExports.createBlock("span", {
                          key: 0,
                          class: Number(row.original.receivable.outstanding_amount) > 0 ? "text-red-600 font-medium" : ""
                        }, vueExports.toDisplayString(("formatCurrency" in _ctx ? _ctx.formatCurrency : vueExports.unref(formatCurrency))(row.original.receivable.outstanding_amount)), 3)) : (vueExports.openBlock(), vueExports.createBlock("span", {
                          key: 1,
                          class: "text-[var(--ui-text-muted)]"
                        }, "—"))
                      ]),
                      _: 1
                    }, 8, ["data"]),
                    vueExports.createVNode(_component_SharedCrudTablePagination, {
                      page: vueExports.unref(orderPage),
                      "onUpdate:page": ($event) => vueExports.isRef(orderPage) ? orderPage.value = $event : null,
                      meta: vueExports.unref(orderData)?.meta
                    }, null, 8, ["page", "onUpdate:page", "meta"])
                  ]))
                ];
              }
            }),
            _: 1
          }, _parent));
          _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_SharedSectionCard, { title: "Phiếu thanh toán" }, {
            default: vueExports.withCtx((_, _push2, _parent2, _scopeId) => {
              if (_push2) {
                if (vueExports.unref(paymentStatus) === "pending" && vueExports.unref(payments).length === 0) {
                  _push2(`<div class="h-24 bg-slate-50 rounded-lg animate-pulse"${_scopeId}></div>`);
                } else if (vueExports.unref(paymentError)) {
                  _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UAlert, {
                    color: "error",
                    variant: "subtle",
                    icon: "i-lucide-alert-circle",
                    description: "Không thể tải danh sách phiếu thanh toán."
                  }, null, _parent2, _scopeId));
                } else if (vueExports.unref(payments).length === 0) {
                  _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UAlert, {
                    color: "info",
                    variant: "subtle",
                    icon: "i-lucide-inbox",
                    description: "Khách hàng chưa có phiếu thanh toán nào."
                  }, null, _parent2, _scopeId));
                } else {
                  _push2(`<div class="-mx-6 -mb-5"${_scopeId}>`);
                  _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UTable, {
                    data: vueExports.unref(payments),
                    columns: paymentColumns
                  }, {
                    "id-cell": vueExports.withCtx(({ row }, _push3, _parent3, _scopeId2) => {
                      if (_push3) {
                        _push3(`<span class="font-mono text-xs"${_scopeId2}>#${serverRenderer_cjs_prodExports.ssrInterpolate(row.original.id)}</span>`);
                      } else {
                        return [
                          vueExports.createVNode("span", { class: "font-mono text-xs" }, "#" + vueExports.toDisplayString(row.original.id), 1)
                        ];
                      }
                    }),
                    "order-cell": vueExports.withCtx(({ row }, _push3, _parent3, _scopeId2) => {
                      if (_push3) {
                        if (row.original.order) {
                          _push3(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_NuxtLink, {
                            to: `/pmc/orders/${row.original.order.id}`,
                            class: "font-mono text-primary-600 hover:underline"
                          }, {
                            default: vueExports.withCtx((_2, _push4, _parent4, _scopeId3) => {
                              if (_push4) {
                                _push4(`${serverRenderer_cjs_prodExports.ssrInterpolate(row.original.order.code ?? "—")}`);
                              } else {
                                return [
                                  vueExports.createTextVNode(vueExports.toDisplayString(row.original.order.code ?? "—"), 1)
                                ];
                              }
                            }),
                            _: 2
                          }, _parent3, _scopeId2));
                        } else {
                          _push3(`<span${_scopeId2}>—</span>`);
                        }
                      } else {
                        return [
                          row.original.order ? (vueExports.openBlock(), vueExports.createBlock(_component_NuxtLink, {
                            key: 0,
                            to: `/pmc/orders/${row.original.order.id}`,
                            class: "font-mono text-primary-600 hover:underline"
                          }, {
                            default: vueExports.withCtx(() => [
                              vueExports.createTextVNode(vueExports.toDisplayString(row.original.order.code ?? "—"), 1)
                            ]),
                            _: 2
                          }, 1032, ["to"])) : (vueExports.openBlock(), vueExports.createBlock("span", { key: 1 }, "—"))
                        ];
                      }
                    }),
                    "amount-cell": vueExports.withCtx(({ row }, _push3, _parent3, _scopeId2) => {
                      if (_push3) {
                        _push3(`<span class="font-medium"${_scopeId2}>${serverRenderer_cjs_prodExports.ssrInterpolate(("formatCurrency" in _ctx ? _ctx.formatCurrency : vueExports.unref(formatCurrency))(row.original.amount))}</span>`);
                      } else {
                        return [
                          vueExports.createVNode("span", { class: "font-medium" }, vueExports.toDisplayString(("formatCurrency" in _ctx ? _ctx.formatCurrency : vueExports.unref(formatCurrency))(row.original.amount)), 1)
                        ];
                      }
                    }),
                    "payment_method-cell": vueExports.withCtx(({ row }, _push3, _parent3, _scopeId2) => {
                      if (_push3) {
                        _push3(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UBadge, {
                          label: row.original.payment_method.label,
                          color: "neutral",
                          variant: "subtle",
                          size: "sm"
                        }, null, _parent3, _scopeId2));
                      } else {
                        return [
                          vueExports.createVNode(_component_UBadge, {
                            label: row.original.payment_method.label,
                            color: "neutral",
                            variant: "subtle",
                            size: "sm"
                          }, null, 8, ["label"])
                        ];
                      }
                    }),
                    "paid_at-cell": vueExports.withCtx(({ row }, _push3, _parent3, _scopeId2) => {
                      if (_push3) {
                        _push3(`${serverRenderer_cjs_prodExports.ssrInterpolate(("formatDate" in _ctx ? _ctx.formatDate : vueExports.unref(formatDate))(row.original.paid_at))}`);
                      } else {
                        return [
                          vueExports.createTextVNode(vueExports.toDisplayString(("formatDate" in _ctx ? _ctx.formatDate : vueExports.unref(formatDate))(row.original.paid_at)), 1)
                        ];
                      }
                    }),
                    _: 1
                  }, _parent2, _scopeId));
                  _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_SharedCrudTablePagination, {
                    page: vueExports.unref(paymentPage),
                    "onUpdate:page": ($event) => vueExports.isRef(paymentPage) ? paymentPage.value = $event : null,
                    meta: vueExports.unref(paymentData)?.meta
                  }, null, _parent2, _scopeId));
                  _push2(`</div>`);
                }
              } else {
                return [
                  vueExports.unref(paymentStatus) === "pending" && vueExports.unref(payments).length === 0 ? (vueExports.openBlock(), vueExports.createBlock("div", {
                    key: 0,
                    class: "h-24 bg-slate-50 rounded-lg animate-pulse"
                  })) : vueExports.unref(paymentError) ? (vueExports.openBlock(), vueExports.createBlock(_component_UAlert, {
                    key: 1,
                    color: "error",
                    variant: "subtle",
                    icon: "i-lucide-alert-circle",
                    description: "Không thể tải danh sách phiếu thanh toán."
                  })) : vueExports.unref(payments).length === 0 ? (vueExports.openBlock(), vueExports.createBlock(_component_UAlert, {
                    key: 2,
                    color: "info",
                    variant: "subtle",
                    icon: "i-lucide-inbox",
                    description: "Khách hàng chưa có phiếu thanh toán nào."
                  })) : (vueExports.openBlock(), vueExports.createBlock("div", {
                    key: 3,
                    class: "-mx-6 -mb-5"
                  }, [
                    vueExports.createVNode(_component_UTable, {
                      data: vueExports.unref(payments),
                      columns: paymentColumns
                    }, {
                      "id-cell": vueExports.withCtx(({ row }) => [
                        vueExports.createVNode("span", { class: "font-mono text-xs" }, "#" + vueExports.toDisplayString(row.original.id), 1)
                      ]),
                      "order-cell": vueExports.withCtx(({ row }) => [
                        row.original.order ? (vueExports.openBlock(), vueExports.createBlock(_component_NuxtLink, {
                          key: 0,
                          to: `/pmc/orders/${row.original.order.id}`,
                          class: "font-mono text-primary-600 hover:underline"
                        }, {
                          default: vueExports.withCtx(() => [
                            vueExports.createTextVNode(vueExports.toDisplayString(row.original.order.code ?? "—"), 1)
                          ]),
                          _: 2
                        }, 1032, ["to"])) : (vueExports.openBlock(), vueExports.createBlock("span", { key: 1 }, "—"))
                      ]),
                      "amount-cell": vueExports.withCtx(({ row }) => [
                        vueExports.createVNode("span", { class: "font-medium" }, vueExports.toDisplayString(("formatCurrency" in _ctx ? _ctx.formatCurrency : vueExports.unref(formatCurrency))(row.original.amount)), 1)
                      ]),
                      "payment_method-cell": vueExports.withCtx(({ row }) => [
                        vueExports.createVNode(_component_UBadge, {
                          label: row.original.payment_method.label,
                          color: "neutral",
                          variant: "subtle",
                          size: "sm"
                        }, null, 8, ["label"])
                      ]),
                      "paid_at-cell": vueExports.withCtx(({ row }) => [
                        vueExports.createTextVNode(vueExports.toDisplayString(("formatDate" in _ctx ? _ctx.formatDate : vueExports.unref(formatDate))(row.original.paid_at)), 1)
                      ]),
                      _: 1
                    }, 8, ["data"]),
                    vueExports.createVNode(_component_SharedCrudTablePagination, {
                      page: vueExports.unref(paymentPage),
                      "onUpdate:page": ($event) => vueExports.isRef(paymentPage) ? paymentPage.value = $event : null,
                      meta: vueExports.unref(paymentData)?.meta
                    }, null, 8, ["page", "onUpdate:page", "meta"])
                  ]))
                ];
              }
            }),
            _: 1
          }, _parent));
          _push(`<!--]-->`);
        } else if (vueExports.unref(activeTab) === "csat") {
          _push(`<!--[-->`);
          _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_SharedSectionCard, { title: "Tổng quan đánh giá" }, {
            default: vueExports.withCtx((_, _push2, _parent2, _scopeId) => {
              if (_push2) {
                if (vueExports.unref(csatStatus) === "pending" && vueExports.unref(ratedTickets).length === 0) {
                  _push2(`<div class="h-24 bg-slate-50 rounded-lg animate-pulse"${_scopeId}></div>`);
                } else if (vueExports.unref(ratedTickets).length === 0) {
                  _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UAlert, {
                    color: "info",
                    variant: "subtle",
                    icon: "i-lucide-inbox",
                    description: "Khách hàng chưa có đánh giá nào."
                  }, null, _parent2, _scopeId));
                } else {
                  _push2(`<div class="grid grid-cols-1 md:grid-cols-5 gap-6"${_scopeId}><div class="md:col-span-2 flex flex-col items-center justify-center p-4 bg-slate-50 rounded-xl"${_scopeId}><div class="text-5xl font-bold text-slate-900"${_scopeId}>${serverRenderer_cjs_prodExports.ssrInterpolate(vueExports.unref(aggregates)?.avg_rating !== null && vueExports.unref(aggregates)?.avg_rating !== void 0 ? vueExports.unref(aggregates).avg_rating.toFixed(1) : "—")}</div><div class="mt-2 text-amber-500 text-xl tracking-tight"${_scopeId}><!--[-->`);
                  serverRenderer_cjs_prodExports.ssrRenderList(5, (n) => {
                    _push2(`<span${_scopeId}>${serverRenderer_cjs_prodExports.ssrInterpolate(n <= Math.round(vueExports.unref(aggregates)?.avg_rating ?? 0) ? "★" : "☆")}</span>`);
                  });
                  _push2(`<!--]--></div><div class="mt-1 text-sm text-[var(--ui-text-muted)]"${_scopeId}>${serverRenderer_cjs_prodExports.ssrInterpolate(vueExports.unref(aggregates)?.rating_count ?? vueExports.unref(ratedTickets).length)} đánh giá </div></div><div class="md:col-span-3 flex flex-col gap-2"${_scopeId}><!--[-->`);
                  serverRenderer_cjs_prodExports.ssrRenderList(vueExports.unref(ratingHistogram), (row) => {
                    _push2(`<div class="flex items-center gap-3"${_scopeId}><span class="w-10 text-sm font-medium text-slate-700"${_scopeId}>${serverRenderer_cjs_prodExports.ssrInterpolate(row.star)} ★</span><div class="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden"${_scopeId}><div class="h-full bg-amber-400" style="${serverRenderer_cjs_prodExports.ssrRenderStyle({ width: `${row.percent}%` })}"${_scopeId}></div></div><span class="w-16 text-right text-sm text-[var(--ui-text-muted)]"${_scopeId}>${serverRenderer_cjs_prodExports.ssrInterpolate(row.count)} (${serverRenderer_cjs_prodExports.ssrInterpolate(row.percent)}%) </span></div>`);
                  });
                  _push2(`<!--]--></div></div>`);
                }
              } else {
                return [
                  vueExports.unref(csatStatus) === "pending" && vueExports.unref(ratedTickets).length === 0 ? (vueExports.openBlock(), vueExports.createBlock("div", {
                    key: 0,
                    class: "h-24 bg-slate-50 rounded-lg animate-pulse"
                  })) : vueExports.unref(ratedTickets).length === 0 ? (vueExports.openBlock(), vueExports.createBlock(_component_UAlert, {
                    key: 1,
                    color: "info",
                    variant: "subtle",
                    icon: "i-lucide-inbox",
                    description: "Khách hàng chưa có đánh giá nào."
                  })) : (vueExports.openBlock(), vueExports.createBlock("div", {
                    key: 2,
                    class: "grid grid-cols-1 md:grid-cols-5 gap-6"
                  }, [
                    vueExports.createVNode("div", { class: "md:col-span-2 flex flex-col items-center justify-center p-4 bg-slate-50 rounded-xl" }, [
                      vueExports.createVNode("div", { class: "text-5xl font-bold text-slate-900" }, vueExports.toDisplayString(vueExports.unref(aggregates)?.avg_rating !== null && vueExports.unref(aggregates)?.avg_rating !== void 0 ? vueExports.unref(aggregates).avg_rating.toFixed(1) : "—"), 1),
                      vueExports.createVNode("div", { class: "mt-2 text-amber-500 text-xl tracking-tight" }, [
                        (vueExports.openBlock(), vueExports.createBlock(vueExports.Fragment, null, vueExports.renderList(5, (n) => {
                          return vueExports.createVNode("span", { key: n }, vueExports.toDisplayString(n <= Math.round(vueExports.unref(aggregates)?.avg_rating ?? 0) ? "★" : "☆"), 1);
                        }), 64))
                      ]),
                      vueExports.createVNode("div", { class: "mt-1 text-sm text-[var(--ui-text-muted)]" }, vueExports.toDisplayString(vueExports.unref(aggregates)?.rating_count ?? vueExports.unref(ratedTickets).length) + " đánh giá ", 1)
                    ]),
                    vueExports.createVNode("div", { class: "md:col-span-3 flex flex-col gap-2" }, [
                      (vueExports.openBlock(true), vueExports.createBlock(vueExports.Fragment, null, vueExports.renderList(vueExports.unref(ratingHistogram), (row) => {
                        return vueExports.openBlock(), vueExports.createBlock("div", {
                          key: row.star,
                          class: "flex items-center gap-3"
                        }, [
                          vueExports.createVNode("span", { class: "w-10 text-sm font-medium text-slate-700" }, vueExports.toDisplayString(row.star) + " ★", 1),
                          vueExports.createVNode("div", { class: "flex-1 h-2 bg-slate-100 rounded-full overflow-hidden" }, [
                            vueExports.createVNode("div", {
                              class: "h-full bg-amber-400",
                              style: { width: `${row.percent}%` }
                            }, null, 4)
                          ]),
                          vueExports.createVNode("span", { class: "w-16 text-right text-sm text-[var(--ui-text-muted)]" }, vueExports.toDisplayString(row.count) + " (" + vueExports.toDisplayString(row.percent) + "%) ", 1)
                        ]);
                      }), 128))
                    ])
                  ]))
                ];
              }
            }),
            _: 1
          }, _parent));
          if (vueExports.unref(ratedTickets).length > 0) {
            _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_SharedSectionCard, { title: "Nhận xét của khách" }, {
              default: vueExports.withCtx((_, _push2, _parent2, _scopeId) => {
                if (_push2) {
                  _push2(`<div class="flex flex-col gap-3"${_scopeId}><!--[-->`);
                  serverRenderer_cjs_prodExports.ssrRenderList(vueExports.unref(ratedTickets), (t) => {
                    _push2(`<div class="border border-border-gray rounded-lg p-4 bg-white"${_scopeId}><div class="flex items-start justify-between gap-3"${_scopeId}><div class="min-w-0 flex-1"${_scopeId}><div class="text-amber-500 text-base tracking-tight"${_scopeId}><!--[-->`);
                    serverRenderer_cjs_prodExports.ssrRenderList(5, (n) => {
                      _push2(`<span${_scopeId}>${serverRenderer_cjs_prodExports.ssrInterpolate(n <= (t.resident_rating ?? 0) ? "★" : "☆")}</span>`);
                    });
                    _push2(`<!--]--></div>`);
                    if (t.resident_rating_comment) {
                      _push2(`<p class="mt-2 text-sm text-slate-700 whitespace-pre-line"${_scopeId}>${serverRenderer_cjs_prodExports.ssrInterpolate(t.resident_rating_comment)}</p>`);
                    } else {
                      _push2(`<!---->`);
                    }
                    _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_NuxtLink, {
                      to: `/pmc/og-tickets/${t.id}`,
                      class: "mt-2 inline-flex items-center gap-1 text-sm text-primary-600 hover:underline"
                    }, {
                      default: vueExports.withCtx((_2, _push3, _parent3, _scopeId2) => {
                        if (_push3) {
                          _push3(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UIcon, {
                            name: "i-lucide-ticket",
                            class: "size-3.5"
                          }, null, _parent3, _scopeId2));
                          _push3(` ${serverRenderer_cjs_prodExports.ssrInterpolate(t.subject)}`);
                        } else {
                          return [
                            vueExports.createVNode(_component_UIcon, {
                              name: "i-lucide-ticket",
                              class: "size-3.5"
                            }),
                            vueExports.createTextVNode(" " + vueExports.toDisplayString(t.subject), 1)
                          ];
                        }
                      }),
                      _: 2
                    }, _parent2, _scopeId));
                    _push2(`</div><span class="text-xs text-[var(--ui-text-muted)] shrink-0"${_scopeId}>${serverRenderer_cjs_prodExports.ssrInterpolate(("formatDate" in _ctx ? _ctx.formatDate : vueExports.unref(formatDate))(t.completed_at ?? t.received_at))}</span></div></div>`);
                  });
                  _push2(`<!--]--></div>`);
                } else {
                  return [
                    vueExports.createVNode("div", { class: "flex flex-col gap-3" }, [
                      (vueExports.openBlock(true), vueExports.createBlock(vueExports.Fragment, null, vueExports.renderList(vueExports.unref(ratedTickets), (t) => {
                        return vueExports.openBlock(), vueExports.createBlock("div", {
                          key: t.id,
                          class: "border border-border-gray rounded-lg p-4 bg-white"
                        }, [
                          vueExports.createVNode("div", { class: "flex items-start justify-between gap-3" }, [
                            vueExports.createVNode("div", { class: "min-w-0 flex-1" }, [
                              vueExports.createVNode("div", { class: "text-amber-500 text-base tracking-tight" }, [
                                (vueExports.openBlock(), vueExports.createBlock(vueExports.Fragment, null, vueExports.renderList(5, (n) => {
                                  return vueExports.createVNode("span", { key: n }, vueExports.toDisplayString(n <= (t.resident_rating ?? 0) ? "★" : "☆"), 1);
                                }), 64))
                              ]),
                              t.resident_rating_comment ? (vueExports.openBlock(), vueExports.createBlock("p", {
                                key: 0,
                                class: "mt-2 text-sm text-slate-700 whitespace-pre-line"
                              }, vueExports.toDisplayString(t.resident_rating_comment), 1)) : vueExports.createCommentVNode("", true),
                              vueExports.createVNode(_component_NuxtLink, {
                                to: `/pmc/og-tickets/${t.id}`,
                                class: "mt-2 inline-flex items-center gap-1 text-sm text-primary-600 hover:underline"
                              }, {
                                default: vueExports.withCtx(() => [
                                  vueExports.createVNode(_component_UIcon, {
                                    name: "i-lucide-ticket",
                                    class: "size-3.5"
                                  }),
                                  vueExports.createTextVNode(" " + vueExports.toDisplayString(t.subject), 1)
                                ]),
                                _: 2
                              }, 1032, ["to"])
                            ]),
                            vueExports.createVNode("span", { class: "text-xs text-[var(--ui-text-muted)] shrink-0" }, vueExports.toDisplayString(("formatDate" in _ctx ? _ctx.formatDate : vueExports.unref(formatDate))(t.completed_at ?? t.received_at)), 1)
                          ])
                        ]);
                      }), 128))
                    ])
                  ];
                }
              }),
              _: 1
            }, _parent));
          } else {
            _push(`<!---->`);
          }
          _push(`<!--]-->`);
        } else {
          _push(`<!---->`);
        }
        _push(`</div>`);
      } else {
        _push(`<!---->`);
      }
      _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_CustomerFormModal, {
        open: vueExports.unref(showFormModal),
        "onUpdate:open": ($event) => vueExports.isRef(showFormModal) ? showFormModal.value = $event : null,
        mode: vueExports.unref(formMode),
        item: vueExports.unref(editTarget),
        loading: vueExports.unref(isSubmitting),
        "api-errors": vueExports.unref(formApiErrors),
        "error-message": vueExports.unref(formErrorMessage),
        onSubmit: handleFormSubmit
      }, null, _parent));
      _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_SharedCrudDeleteModal, {
        open: vueExports.unref(showDeleteModal),
        "onUpdate:open": ($event) => vueExports.isRef(showDeleteModal) ? showDeleteModal.value = $event : null,
        title: "Xoá khách hàng",
        "item-name": vueExports.unref(deleteTarget)?.full_name,
        "blocked-message": vueExports.unref(deleteBlockedMessage),
        loading: vueExports.unref(isDeleting),
        checking: vueExports.unref(isCheckingDelete),
        onConfirm: vueExports.unref(handleDelete)
      }, null, _parent));
      _push(`</div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = vueExports.useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/pmc/customers/[id]/index.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=index-CwtKWGie.mjs.map
