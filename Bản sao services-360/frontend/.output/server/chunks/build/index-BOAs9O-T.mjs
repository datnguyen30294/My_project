import { _ as __nuxt_component_0 } from './PageHeader-BJhealxW.mjs';
import { v as vueExports, u as useSeoMeta, j as useToast, s as serverRenderer_cjs_prodExports, l as _sfc_main$c, k as _sfc_main$h, _ as __nuxt_component_0$4 } from './server.mjs';
import { _ as _sfc_main$1 } from './Input-JXN8po_F.mjs';
import { _ as _sfc_main$2 } from './Select-CZE7Ef6n.mjs';
import { _ as __nuxt_component_2 } from './TableWrapper-VwUckvcF.mjs';
import { _ as _sfc_main$3 } from './Table-17SH0cIR.mjs';
import { _ as _sfc_main$4 } from './Badge-W93D3Jpz.mjs';
import { _ as __nuxt_component_3 } from './TableActions-b69bU2gG.mjs';
import { _ as __nuxt_component_10 } from './TablePagination-CZYWB-qm.mjs';
import { _ as __nuxt_component_11 } from './CustomerFormModal-DTm98NMJ.mjs';
import { _ as __nuxt_component_11$1 } from './DeleteModal-B4AevDGU.mjs';
import { f as formatPhone } from './phone-DErPjpTB.mjs';
import { f as formatDateTime, t as timeAgo } from './date-R5YK0ast.mjs';
import { D as DEFAULT_PER_PAGE } from './constants-G9YmtWtp.mjs';
import { u as useTableSearch } from './useTableSearch-BhG9s2Ie.mjs';
import { u as useUrlFilters } from './useUrlFilters-D9dcjQcy.mjs';
import { u as useCustomerList, a as apiGetCustomer, b as apiCreateCustomer, c as apiUpdateCustomer, d as apiDeleteCustomer, e as apiCheckDeleteCustomer } from './useCustomers-ByvzwLgR.mjs';
import { s as stickyRight } from './table-z_7x7CvB.mjs';
import { u as useCrudModals } from './useCrudModals-BUUQWYeI.mjs';
import { u as useCrudSubmit } from './useCrudSubmit-gMGxLTGY.mjs';
import { g as getApiErrorMessage } from './apiError-DBrxF9au.mjs';
import { u as useCheckDelete } from './useCheckDelete-ka2wDn0T.mjs';
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
import './PageError-kZWsA9dh.mjs';
import './index-CSThDD3J.mjs';
import './Pagination-fZq_Msxb.mjs';
import './Modal-BimZZbNl.mjs';
import './DialogTrigger-C3iwCYMu.mjs';
import './DialogClose-DGkUxau7.mjs';
import './Alert-tTsPKADX.mjs';
import './FormField-DFdmv6Lu.mjs';
import './Label-BBgw4vHh.mjs';
import './Textarea-DTCNHwKm.mjs';

const DEFAULT_SORT = "created_desc";
const _sfc_main = /* @__PURE__ */ vueExports.defineComponent({
  __name: "index",
  __ssrInlineRender: true,
  setup(__props) {
    useSeoMeta({ title: "Khách hàng - Thần Nông" });
    const SORT_OPTIONS = [
      { label: "Ngày tạo mới nhất", value: "created_desc" },
      { label: "Liên hệ gần nhất", value: "last_contacted_desc" },
      { label: "Tên A–Z", value: "full_name_asc" }
    ];
    function sortToParams(v) {
      switch (v) {
        case "full_name_asc":
          return { sort_by: "full_name", sort_direction: "asc" };
        case "last_contacted_desc":
          return { sort_by: "last_contacted_at", sort_direction: "desc" };
        case "created_desc":
        default:
          return { sort_by: "created_at", sort_direction: "desc" };
      }
    }
    const sortValue = vueExports.ref(DEFAULT_SORT);
    const page = vueExports.ref(1);
    const params = vueExports.reactive({
      search: void 0,
      per_page: DEFAULT_PER_PAGE,
      ...sortToParams(sortValue.value)
    });
    const { searchInput, onSearch } = useTableSearch((value) => {
      params.search = value;
      page.value = 1;
    });
    const { isInitFromUrl } = useUrlFilters({
      search: {
        ref: vueExports.toRef(params, "search"),
        type: "string",
        onInit: (v) => {
          searchInput.value = String(v);
        }
      },
      sort: {
        ref: sortValue,
        type: "string",
        defaultValue: DEFAULT_SORT,
        onInit: (v) => {
          Object.assign(params, sortToParams(v));
        }
      },
      page: { ref: page, type: "number", defaultValue: 1 }
    });
    vueExports.watch(sortValue, (next) => {
      Object.assign(params, sortToParams(next));
      if (!isInitFromUrl.value) page.value = 1;
    });
    const hasFilters = vueExports.computed(() => !!searchInput.value || sortValue.value !== DEFAULT_SORT);
    function clearFilters() {
      searchInput.value = "";
      params.search = void 0;
      sortValue.value = DEFAULT_SORT;
      page.value = 1;
    }
    const { data, status, error, refresh } = useCustomerList(
      vueExports.computed(() => ({ ...params, page: page.value }))
    );
    const customers = vueExports.computed(() => data.value?.data ?? []);
    const columns = [
      { accessorKey: "code", header: "Mã" },
      { accessorKey: "full_name", header: "Họ tên" },
      { id: "phone", header: "SĐT" },
      { id: "email", header: "Email" },
      { id: "ticket_count", header: "Số ticket" },
      { id: "avg_rating", header: "CSAT TB" },
      { id: "last_contacted_at", header: "Liên hệ gần nhất" },
      stickyRight({ id: "actions", header: "Thao tác" })
    ];
    const crud = useCrudModals();
    const {
      showFormModal,
      formMode,
      editTarget,
      formApiErrors,
      formErrorMessage,
      openCreateModal,
      openEditModal,
      showDeleteModal,
      deleteTarget
    } = crud;
    const { isSubmitting, submitForm, isDeleting, submitDelete } = useCrudSubmit(crud, refresh);
    const isLoadingEdit = vueExports.ref(false);
    const toast = useToast();
    async function handleEditClick(row) {
      isLoadingEdit.value = true;
      try {
        const res = await apiGetCustomer(row.id);
        openEditModal(res.data);
      } catch (err) {
        toast.add({ title: getApiErrorMessage(err, "Không thể tải khách hàng"), color: "error" });
      } finally {
        isLoadingEdit.value = false;
      }
    }
    function handleFormSubmit(values) {
      submitForm(
        () => apiCreateCustomer({
          full_name: values.full_name,
          phone: values.phone,
          email: values.email || null,
          note: values.note || null
        }),
        () => apiUpdateCustomer(editTarget.value.id, {
          full_name: values.full_name,
          phone: values.phone,
          email: values.email || null,
          note: values.note || null
        }),
        { create: "Đã tạo khách hàng", update: "Đã cập nhật khách hàng" }
      );
    }
    const { isCheckingDelete, deleteBlockedMessage, openDeleteModal, handleDelete } = useCheckDelete({
      crud,
      submitDelete,
      checkFn: apiCheckDeleteCustomer,
      deleteFn: apiDeleteCustomer,
      successMessage: "Đã xoá khách hàng",
      errorFallback: "Không thể xoá khách hàng này"
    });
    return (_ctx, _push, _parent, _attrs) => {
      const _component_SharedCrudPageHeader = __nuxt_component_0;
      const _component_UButton = _sfc_main$c;
      const _component_UInput = _sfc_main$1;
      const _component_USelect = _sfc_main$2;
      const _component_SharedCrudTableWrapper = __nuxt_component_2;
      const _component_UTable = _sfc_main$3;
      const _component_NuxtLink = __nuxt_component_0$4;
      const _component_UBadge = _sfc_main$4;
      const _component_UIcon = _sfc_main$h;
      const _component_SharedCrudTableActions = __nuxt_component_3;
      const _component_SharedCrudTablePagination = __nuxt_component_10;
      const _component_CustomerFormModal = __nuxt_component_11;
      const _component_SharedCrudDeleteModal = __nuxt_component_11$1;
      _push(`<div${serverRenderer_cjs_prodExports.ssrRenderAttrs(_attrs)}>`);
      _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_SharedCrudPageHeader, {
        title: "Khách hàng",
        description: "Danh bạ cư dân — tra cứu, xem lịch sử ticket và đơn hàng."
      }, {
        actions: vueExports.withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UButton, {
              icon: "i-lucide-plus",
              label: "Thêm khách",
              onClick: vueExports.unref(openCreateModal)
            }, null, _parent2, _scopeId));
          } else {
            return [
              vueExports.createVNode(_component_UButton, {
                icon: "i-lucide-plus",
                label: "Thêm khách",
                onClick: vueExports.unref(openCreateModal)
              }, null, 8, ["onClick"])
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`<div class="mb-4 flex flex-wrap items-center gap-3">`);
      _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UInput, {
        modelValue: vueExports.unref(searchInput),
        "onUpdate:modelValue": [($event) => vueExports.isRef(searchInput) ? searchInput.value = $event : null, vueExports.unref(onSearch)],
        icon: "i-lucide-search",
        placeholder: "Tìm tên, SĐT, email, mã khách...",
        class: "max-w-sm"
      }, null, _parent));
      _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_USelect, {
        modelValue: vueExports.unref(sortValue),
        "onUpdate:modelValue": ($event) => vueExports.isRef(sortValue) ? sortValue.value = $event : null,
        items: SORT_OPTIONS,
        class: "w-56"
      }, null, _parent));
      if (vueExports.unref(hasFilters)) {
        _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UButton, {
          icon: "i-lucide-x",
          label: "Xoá bộ lọc",
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
            _push2(`<div class="bg-white border border-border-gray rounded-xl overflow-hidden shadow-sm"${_scopeId}>`);
            _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UTable, {
              data: vueExports.unref(customers),
              columns
            }, {
              "code-cell": vueExports.withCtx(({ row }, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_NuxtLink, {
                    to: `/pmc/customers/${row.original.id}`,
                    class: "font-mono text-primary-600 hover:text-primary-800 hover:underline"
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
                      to: `/pmc/customers/${row.original.id}`,
                      class: "font-mono text-primary-600 hover:text-primary-800 hover:underline"
                    }, {
                      default: vueExports.withCtx(() => [
                        vueExports.createTextVNode(vueExports.toDisplayString(row.original.code ?? "—"), 1)
                      ]),
                      _: 2
                    }, 1032, ["to"])
                  ];
                }
              }),
              "full_name-cell": vueExports.withCtx(({ row }, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_NuxtLink, {
                    to: `/pmc/customers/${row.original.id}`,
                    class: "font-medium text-slate-900 hover:text-primary-700 hover:underline"
                  }, {
                    default: vueExports.withCtx((_2, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(`${serverRenderer_cjs_prodExports.ssrInterpolate(row.original.full_name)}`);
                      } else {
                        return [
                          vueExports.createTextVNode(vueExports.toDisplayString(row.original.full_name), 1)
                        ];
                      }
                    }),
                    _: 2
                  }, _parent3, _scopeId2));
                } else {
                  return [
                    vueExports.createVNode(_component_NuxtLink, {
                      to: `/pmc/customers/${row.original.id}`,
                      class: "font-medium text-slate-900 hover:text-primary-700 hover:underline"
                    }, {
                      default: vueExports.withCtx(() => [
                        vueExports.createTextVNode(vueExports.toDisplayString(row.original.full_name), 1)
                      ]),
                      _: 2
                    }, 1032, ["to"])
                  ];
                }
              }),
              "phone-cell": vueExports.withCtx(({ row }, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(`<span class="font-mono"${_scopeId2}>${serverRenderer_cjs_prodExports.ssrInterpolate(("formatPhone" in _ctx ? _ctx.formatPhone : vueExports.unref(formatPhone))(row.original.phone))}</span>`);
                } else {
                  return [
                    vueExports.createVNode("span", { class: "font-mono" }, vueExports.toDisplayString(("formatPhone" in _ctx ? _ctx.formatPhone : vueExports.unref(formatPhone))(row.original.phone)), 1)
                  ];
                }
              }),
              "email-cell": vueExports.withCtx(({ row }, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(`${serverRenderer_cjs_prodExports.ssrInterpolate(row.original.email ?? "—")}`);
                } else {
                  return [
                    vueExports.createTextVNode(vueExports.toDisplayString(row.original.email ?? "—"), 1)
                  ];
                }
              }),
              "ticket_count-cell": vueExports.withCtx(({ row }, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UBadge, {
                    label: String(row.original.ticket_count),
                    color: "primary",
                    variant: "subtle",
                    size: "sm"
                  }, null, _parent3, _scopeId2));
                } else {
                  return [
                    vueExports.createVNode(_component_UBadge, {
                      label: String(row.original.ticket_count),
                      color: "primary",
                      variant: "subtle",
                      size: "sm"
                    }, null, 8, ["label"])
                  ];
                }
              }),
              "avg_rating-cell": vueExports.withCtx(({ row }, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  if (row.original.avg_rating !== null) {
                    _push3(`<span class="inline-flex items-center gap-1"${_scopeId2}>`);
                    _push3(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UIcon, {
                      name: "i-lucide-star",
                      class: "size-4 text-amber-400"
                    }, null, _parent3, _scopeId2));
                    _push3(`<span class="font-medium"${_scopeId2}>${serverRenderer_cjs_prodExports.ssrInterpolate(row.original.avg_rating.toFixed(1))}</span><span class="text-xs text-[var(--ui-text-muted)]"${_scopeId2}>/ 5</span></span>`);
                  } else {
                    _push3(`<span class="text-[var(--ui-text-muted)]"${_scopeId2}>—</span>`);
                  }
                } else {
                  return [
                    row.original.avg_rating !== null ? (vueExports.openBlock(), vueExports.createBlock("span", {
                      key: 0,
                      class: "inline-flex items-center gap-1"
                    }, [
                      vueExports.createVNode(_component_UIcon, {
                        name: "i-lucide-star",
                        class: "size-4 text-amber-400"
                      }),
                      vueExports.createVNode("span", { class: "font-medium" }, vueExports.toDisplayString(row.original.avg_rating.toFixed(1)), 1),
                      vueExports.createVNode("span", { class: "text-xs text-[var(--ui-text-muted)]" }, "/ 5")
                    ])) : (vueExports.openBlock(), vueExports.createBlock("span", {
                      key: 1,
                      class: "text-[var(--ui-text-muted)]"
                    }, "—"))
                  ];
                }
              }),
              "last_contacted_at-cell": vueExports.withCtx(({ row }, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  if (row.original.last_contacted_at) {
                    _push3(`<span${serverRenderer_cjs_prodExports.ssrRenderAttr("title", ("formatDateTime" in _ctx ? _ctx.formatDateTime : vueExports.unref(formatDateTime))(row.original.last_contacted_at))}${_scopeId2}>${serverRenderer_cjs_prodExports.ssrInterpolate(("timeAgo" in _ctx ? _ctx.timeAgo : vueExports.unref(timeAgo))(row.original.last_contacted_at))}</span>`);
                  } else {
                    _push3(`<span class="text-[var(--ui-text-muted)]"${_scopeId2}>—</span>`);
                  }
                } else {
                  return [
                    row.original.last_contacted_at ? (vueExports.openBlock(), vueExports.createBlock("span", {
                      key: 0,
                      title: ("formatDateTime" in _ctx ? _ctx.formatDateTime : vueExports.unref(formatDateTime))(row.original.last_contacted_at)
                    }, vueExports.toDisplayString(("timeAgo" in _ctx ? _ctx.timeAgo : vueExports.unref(timeAgo))(row.original.last_contacted_at)), 9, ["title"])) : (vueExports.openBlock(), vueExports.createBlock("span", {
                      key: 1,
                      class: "text-[var(--ui-text-muted)]"
                    }, "—"))
                  ];
                }
              }),
              "actions-cell": vueExports.withCtx(({ row }, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_SharedCrudTableActions, {
                    "detail-to": `/pmc/customers/${row.original.id}`,
                    onEdit: ($event) => handleEditClick(row.original),
                    onDelete: ($event) => vueExports.unref(openDeleteModal)(row.original)
                  }, null, _parent3, _scopeId2));
                } else {
                  return [
                    vueExports.createVNode(_component_SharedCrudTableActions, {
                      "detail-to": `/pmc/customers/${row.original.id}`,
                      onEdit: ($event) => handleEditClick(row.original),
                      onDelete: ($event) => vueExports.unref(openDeleteModal)(row.original)
                    }, null, 8, ["detail-to", "onEdit", "onDelete"])
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
                  data: vueExports.unref(customers),
                  columns
                }, {
                  "code-cell": vueExports.withCtx(({ row }) => [
                    vueExports.createVNode(_component_NuxtLink, {
                      to: `/pmc/customers/${row.original.id}`,
                      class: "font-mono text-primary-600 hover:text-primary-800 hover:underline"
                    }, {
                      default: vueExports.withCtx(() => [
                        vueExports.createTextVNode(vueExports.toDisplayString(row.original.code ?? "—"), 1)
                      ]),
                      _: 2
                    }, 1032, ["to"])
                  ]),
                  "full_name-cell": vueExports.withCtx(({ row }) => [
                    vueExports.createVNode(_component_NuxtLink, {
                      to: `/pmc/customers/${row.original.id}`,
                      class: "font-medium text-slate-900 hover:text-primary-700 hover:underline"
                    }, {
                      default: vueExports.withCtx(() => [
                        vueExports.createTextVNode(vueExports.toDisplayString(row.original.full_name), 1)
                      ]),
                      _: 2
                    }, 1032, ["to"])
                  ]),
                  "phone-cell": vueExports.withCtx(({ row }) => [
                    vueExports.createVNode("span", { class: "font-mono" }, vueExports.toDisplayString(("formatPhone" in _ctx ? _ctx.formatPhone : vueExports.unref(formatPhone))(row.original.phone)), 1)
                  ]),
                  "email-cell": vueExports.withCtx(({ row }) => [
                    vueExports.createTextVNode(vueExports.toDisplayString(row.original.email ?? "—"), 1)
                  ]),
                  "ticket_count-cell": vueExports.withCtx(({ row }) => [
                    vueExports.createVNode(_component_UBadge, {
                      label: String(row.original.ticket_count),
                      color: "primary",
                      variant: "subtle",
                      size: "sm"
                    }, null, 8, ["label"])
                  ]),
                  "avg_rating-cell": vueExports.withCtx(({ row }) => [
                    row.original.avg_rating !== null ? (vueExports.openBlock(), vueExports.createBlock("span", {
                      key: 0,
                      class: "inline-flex items-center gap-1"
                    }, [
                      vueExports.createVNode(_component_UIcon, {
                        name: "i-lucide-star",
                        class: "size-4 text-amber-400"
                      }),
                      vueExports.createVNode("span", { class: "font-medium" }, vueExports.toDisplayString(row.original.avg_rating.toFixed(1)), 1),
                      vueExports.createVNode("span", { class: "text-xs text-[var(--ui-text-muted)]" }, "/ 5")
                    ])) : (vueExports.openBlock(), vueExports.createBlock("span", {
                      key: 1,
                      class: "text-[var(--ui-text-muted)]"
                    }, "—"))
                  ]),
                  "last_contacted_at-cell": vueExports.withCtx(({ row }) => [
                    row.original.last_contacted_at ? (vueExports.openBlock(), vueExports.createBlock("span", {
                      key: 0,
                      title: ("formatDateTime" in _ctx ? _ctx.formatDateTime : vueExports.unref(formatDateTime))(row.original.last_contacted_at)
                    }, vueExports.toDisplayString(("timeAgo" in _ctx ? _ctx.timeAgo : vueExports.unref(timeAgo))(row.original.last_contacted_at)), 9, ["title"])) : (vueExports.openBlock(), vueExports.createBlock("span", {
                      key: 1,
                      class: "text-[var(--ui-text-muted)]"
                    }, "—"))
                  ]),
                  "actions-cell": vueExports.withCtx(({ row }) => [
                    vueExports.createVNode(_component_SharedCrudTableActions, {
                      "detail-to": `/pmc/customers/${row.original.id}`,
                      onEdit: ($event) => handleEditClick(row.original),
                      onDelete: ($event) => vueExports.unref(openDeleteModal)(row.original)
                    }, null, 8, ["detail-to", "onEdit", "onDelete"])
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
      _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_CustomerFormModal, {
        open: vueExports.unref(showFormModal),
        "onUpdate:open": ($event) => vueExports.isRef(showFormModal) ? showFormModal.value = $event : null,
        mode: vueExports.unref(formMode),
        item: vueExports.unref(editTarget),
        loading: vueExports.unref(isSubmitting) || vueExports.unref(isLoadingEdit),
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/pmc/customers/index.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=index-BOAs9O-T.mjs.map
