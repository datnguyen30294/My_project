import { _ as _sfc_main$7 } from './Card-ywPiICev.mjs';
import { v as vueExports, u as useSeoMeta, j as useToast, s as serverRenderer_cjs_prodExports, l as _sfc_main$c, k as _sfc_main$h, _ as __nuxt_component_0$4, aD as $platformApi, q as navigateTo } from './server.mjs';
import { _ as _sfc_main$8 } from './Skeleton-CKN2C2Mt.mjs';
import { _ as _sfc_main$2 } from './Input-JXN8po_F.mjs';
import { _ as _sfc_main$3 } from './Select-CZE7Ef6n.mjs';
import { _ as _sfc_main$4 } from './Alert-tTsPKADX.mjs';
import { _ as _sfc_main$5 } from './Table-17SH0cIR.mjs';
import { _ as _sfc_main$6 } from './Badge-W93D3Jpz.mjs';
import { _ as __nuxt_component_10 } from './TablePagination-CZYWB-qm.mjs';
import { u as useVendorActions, a as __nuxt_component_10$1, _ as __nuxt_component_12 } from './PartnerFormModal-Cph3AHtC.mjs';
import { _ as __nuxt_component_11 } from './DeleteModal-B4AevDGU.mjs';
import { a as formatDate } from './date-R5YK0ast.mjs';
import { j as usePlatformPartnerList, v as usePlatformPartnerStats, p as partnerStatusBadgeColor, l as apiProvisionPartner, w as apiCreatePartner, m as apiUpdatePartner, x as apiDeletePartner } from './usePartners-DhKs6EM6.mjs';
import { D as DEFAULT_PER_PAGE } from './constants-G9YmtWtp.mjs';
import { u as useTableSearch } from './useTableSearch-BhG9s2Ie.mjs';
import { s as stickyRight } from './table-z_7x7CvB.mjs';
import { g as getApiErrorMessage, a as getApiValidationErrors } from './apiError-DBrxF9au.mjs';
import { u as useCrudModals } from './useCrudModals-BUUQWYeI.mjs';
import { u as useCrudSubmit } from './useCrudSubmit-gMGxLTGY.mjs';
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
import './index-CSThDD3J.mjs';
import './Pagination-fZq_Msxb.mjs';
import './Modal-BimZZbNl.mjs';
import './DialogTrigger-C3iwCYMu.mjs';
import './DialogClose-DGkUxau7.mjs';
import './BaseFormModal-CG7aCaIV.mjs';
import './FormField-DFdmv6Lu.mjs';
import './Label-BBgw4vHh.mjs';
import './FormFieldError-cu7WK1i1.mjs';
import './Textarea-DTCNHwKm.mjs';
import './SelectMenu-DKHEMZj7.mjs';
import './useKbd-JjFOu4f7.mjs';
import './utils-BgcT7rQQ.mjs';
import './VisuallyHiddenInput-q6Pz-w0i.mjs';
import './useOrganizations-DNv3fDw1.mjs';

const _sfc_main$1 = /* @__PURE__ */ vueExports.defineComponent({
  __name: "StatsCards",
  __ssrInlineRender: true,
  props: {
    stats: {},
    pending: { type: Boolean, default: false }
  },
  setup(__props) {
    const items = [
      { key: "total", label: "Tổng vendor", icon: "i-lucide-store", color: "text-primary" },
      { key: "active", label: "Đang hoạt động", icon: "i-lucide-circle-check", color: "text-emerald-600" },
      { key: "pending", label: "Chờ duyệt", icon: "i-lucide-clock", color: "text-amber-600" },
      { key: "inactive", label: "Đã vô hiệu", icon: "i-lucide-circle-pause", color: "text-slate-500" }
    ];
    return (_ctx, _push, _parent, _attrs) => {
      const _component_UCard = _sfc_main$7;
      const _component_UIcon = _sfc_main$h;
      const _component_USkeleton = _sfc_main$8;
      _push(`<div${serverRenderer_cjs_prodExports.ssrRenderAttrs(vueExports.mergeProps({
        role: "group",
        "aria-label": "Thống kê vendor",
        class: "grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-6"
      }, _attrs))}><!--[-->`);
      serverRenderer_cjs_prodExports.ssrRenderList(items, (item) => {
        _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UCard, {
          key: item.key,
          ui: { body: "px-5 py-4" }
        }, {
          default: vueExports.withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`<div class="flex items-center gap-4"${_scopeId}><div class="flex size-10 shrink-0 items-center justify-center rounded-lg bg-slate-50"${_scopeId}>`);
              _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UIcon, {
                name: item.icon,
                class: ["size-5", item.color]
              }, null, _parent2, _scopeId));
              _push2(`</div><div class="min-w-0"${_scopeId}><div class="text-sm text-[var(--ui-text-muted)]"${_scopeId}>${serverRenderer_cjs_prodExports.ssrInterpolate(item.label)}</div>`);
              if (__props.pending) {
                _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_USkeleton, { class: "mt-1 h-7 w-10" }, null, _parent2, _scopeId));
              } else {
                _push2(`<div class="mt-1 text-2xl font-bold text-slate-900"${_scopeId}>${serverRenderer_cjs_prodExports.ssrInterpolate(__props.stats?.[item.key] ?? 0)}</div>`);
              }
              _push2(`</div></div>`);
            } else {
              return [
                vueExports.createVNode("div", { class: "flex items-center gap-4" }, [
                  vueExports.createVNode("div", { class: "flex size-10 shrink-0 items-center justify-center rounded-lg bg-slate-50" }, [
                    vueExports.createVNode(_component_UIcon, {
                      name: item.icon,
                      class: ["size-5", item.color]
                    }, null, 8, ["name", "class"])
                  ]),
                  vueExports.createVNode("div", { class: "min-w-0" }, [
                    vueExports.createVNode("div", { class: "text-sm text-[var(--ui-text-muted)]" }, vueExports.toDisplayString(item.label), 1),
                    __props.pending ? (vueExports.openBlock(), vueExports.createBlock(_component_USkeleton, {
                      key: 0,
                      class: "mt-1 h-7 w-10"
                    })) : (vueExports.openBlock(), vueExports.createBlock("div", {
                      key: 1,
                      class: "mt-1 text-2xl font-bold text-slate-900"
                    }, vueExports.toDisplayString(__props.stats?.[item.key] ?? 0), 1))
                  ])
                ])
              ];
            }
          }),
          _: 2
        }, _parent));
      });
      _push(`<!--]--></div>`);
    };
  }
});
const _sfc_setup$1 = _sfc_main$1.setup;
_sfc_main$1.setup = (props, ctx) => {
  const ssrContext = vueExports.useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/vendor-console/StatsCards.vue");
  return _sfc_setup$1 ? _sfc_setup$1(props, ctx) : void 0;
};
const __nuxt_component_0 = Object.assign(_sfc_main$1, { __name: "VendorConsoleStatsCards" });
const DETAIL_BASE = "/platform/quan-ly-van-hanh/quan-ly-vendor";
const _sfc_main = /* @__PURE__ */ vueExports.defineComponent({
  __name: "index",
  __ssrInlineRender: true,
  setup(__props) {
    useSeoMeta({ title: "Quản lý Vendor - Thần Nông" });
    const params = vueExports.reactive({
      search: void 0,
      status: void 0,
      owner_source: void 0,
      include: "stats",
      per_page: DEFAULT_PER_PAGE
    });
    const page = vueExports.ref(1);
    const { searchInput, onSearch } = useTableSearch((value) => {
      params.search = value || void 0;
      page.value = 1;
    });
    const statusItems = [
      { label: "Trạng thái: Tất cả", value: void 0 },
      { label: "Chờ duyệt", value: "pending" },
      { label: "Đang hoạt động", value: "active" },
      { label: "Đã vô hiệu", value: "suspended" }
    ];
    const ownerSourceItems = [
      { label: "Người tạo: Tất cả", value: void 0 },
      { label: "Platform TNP", value: "platform" },
      { label: "Công ty vận hành", value: "tenant" }
    ];
    vueExports.watch(() => params.status, () => {
      page.value = 1;
    });
    vueExports.watch(() => params.owner_source, () => {
      page.value = 1;
    });
    const hasFilters = vueExports.computed(
      () => !!searchInput.value || !!params.status || !!params.owner_source
    );
    function clearFilters() {
      searchInput.value = "";
      params.search = void 0;
      params.status = void 0;
      params.owner_source = void 0;
      page.value = 1;
    }
    const { data, status, error, refresh } = usePlatformPartnerList(
      vueExports.computed(() => ({ ...params, page: page.value }))
    );
    const vendors = vueExports.computed(() => data.value?.data ?? []);
    const { data: statsData, status: statsStatus, refresh: refreshStats } = usePlatformPartnerStats();
    const stats = vueExports.computed(() => statsData.value?.data ?? null);
    const columns = [
      { accessorKey: "slug", header: "Mã vendor" },
      { accessorKey: "name", header: "Tên vendor" },
      { id: "status", header: "Trạng thái" },
      { id: "owner", header: "Người tạo" },
      { id: "project_count", header: "Dự án" },
      { id: "rating", header: "Đánh giá CD" },
      { id: "offer_count", header: "Gói DV" },
      { id: "provisioned", header: "Resi_mart" },
      { accessorKey: "created_at", header: "Ngày tạo" },
      stickyRight({ id: "actions", header: "Thao tác" }, { width: "w-[210px] min-w-[210px]" })
    ];
    const toast = useToast();
    const showCreateModal = vueExports.ref(false);
    const isCreating = vueExports.ref(false);
    const createApiErrors = vueExports.ref({});
    function openCreate() {
      createApiErrors.value = {};
      showCreateModal.value = true;
    }
    async function handleCreate(formData) {
      createApiErrors.value = {};
      isCreating.value = true;
      const { id: _omit, ...payload } = formData;
      try {
        const res = await apiCreatePartner(payload);
        toast.add({ title: "Tạo vendor thành công", color: "success", icon: "i-lucide-check-circle" });
        showCreateModal.value = false;
        await navigateTo(`${DETAIL_BASE}/${res.data.id}`);
      } catch (err) {
        const errs = getApiValidationErrors(err);
        if (errs) {
          createApiErrors.value = errs;
        } else {
          toast.add({ title: getApiErrorMessage(err, "Tạo vendor thất bại"), color: "error", icon: "i-lucide-alert-circle" });
        }
      } finally {
        isCreating.value = false;
      }
    }
    const { runVendorAction } = useVendorActions();
    const actionTarget = vueExports.ref(null);
    const actionType = vueExports.ref(null);
    const actionLoading = vueExports.ref(false);
    const showActionModal = vueExports.ref(false);
    function askAction(type, vendor) {
      actionType.value = type;
      actionTarget.value = vendor;
      showActionModal.value = true;
    }
    async function confirmAction() {
      if (!actionType.value || !actionTarget.value) return;
      actionLoading.value = true;
      const ok = await runVendorAction(actionType.value, actionTarget.value.id);
      actionLoading.value = false;
      if (ok) {
        showActionModal.value = false;
        await Promise.all([refresh(), refreshStats()]);
      }
    }
    async function refreshAll() {
      await Promise.all([refresh(), refreshStats()]);
    }
    const provisioningId = vueExports.ref(null);
    async function handleProvision(vendor) {
      provisioningId.value = vendor.id;
      try {
        await apiProvisionPartner(vendor.id);
        toast.add({
          title: "Đã provision tenant ở resi_mart",
          color: "success",
          icon: "i-lucide-check-circle"
        });
        await refreshAll();
      } catch (err) {
        toast.add({
          title: getApiErrorMessage(err, "Provision thất bại — resi_mart không phản hồi"),
          description: "Hãy chắc chắn resi_mart đang chạy và env RESI_MART_INTERNAL_URL/TOKEN đã cấu hình.",
          color: "error",
          icon: "i-lucide-alert-circle"
        });
      } finally {
        provisioningId.value = null;
      }
    }
    const crud = useCrudModals();
    const {
      showFormModal,
      editTarget,
      formApiErrors,
      openEditModal,
      showDeleteModal,
      deleteTarget,
      openDeleteModal
    } = crud;
    const { isSubmitting, submitForm, isDeleting, submitDelete } = useCrudSubmit(crud, refreshAll);
    const editProjectIds = vueExports.ref([]);
    async function openEdit(vendor) {
      editProjectIds.value = [];
      openEditModal(vendor);
      if (vendor.owner_tenant_id) {
        try {
          const res = await $platformApi(
            `/platform/partners/${vendor.id}`
          );
          editProjectIds.value = res.data.project_ids ?? [];
        } catch {
          editProjectIds.value = [];
        }
      }
    }
    function handleEditSubmit(formData) {
      const { id: _omit, slug: _slug, ...payload } = formData;
      const cleanPayload = Object.fromEntries(
        Object.entries(payload).filter(([key, val]) => {
          if (key === "owner_email" && (val === "" || val == null)) return false;
          return true;
        })
      );
      submitForm(
        null,
        () => apiUpdatePartner(editTarget.value.id, cleanPayload),
        { update: "Cập nhật vendor thành công" }
      );
    }
    function handleDelete() {
      submitDelete(
        () => apiDeletePartner(deleteTarget.value.id),
        { message: "Đã xoá vendor" }
      );
    }
    return (_ctx, _push, _parent, _attrs) => {
      const _component_VendorConsoleStatsCards = __nuxt_component_0;
      const _component_UInput = _sfc_main$2;
      const _component_USelect = _sfc_main$3;
      const _component_UButton = _sfc_main$c;
      const _component_UAlert = _sfc_main$4;
      const _component_UTable = _sfc_main$5;
      const _component_NuxtLink = __nuxt_component_0$4;
      const _component_UBadge = _sfc_main$6;
      const _component_UIcon = _sfc_main$h;
      const _component_SharedCrudTablePagination = __nuxt_component_10;
      const _component_PartnerFormModal = __nuxt_component_10$1;
      const _component_SharedCrudDeleteModal = __nuxt_component_11;
      const _component_VendorConsoleActionConfirmModal = __nuxt_component_12;
      _push(`<div${serverRenderer_cjs_prodExports.ssrRenderAttrs(_attrs)}><div class="mb-6"><h1 class="text-2xl font-black text-slate-900 tracking-tight"> Quản lý Vendor </h1><p class="text-slate-500 text-sm mt-1"> Quản lý toàn bộ vendor (đối tác) trên nền tảng: duyệt, vô hiệu, cấu hình hoa hồng và theo dõi đơn hàng. </p></div>`);
      _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_VendorConsoleStatsCards, {
        stats: vueExports.unref(stats),
        pending: vueExports.unref(statsStatus) === "pending" && !vueExports.unref(statsData)
      }, null, _parent));
      _push(`<div class="mb-4 flex items-center gap-3 flex-wrap">`);
      _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UInput, {
        modelValue: vueExports.unref(searchInput),
        "onUpdate:modelValue": [($event) => vueExports.isRef(searchInput) ? searchInput.value = $event : null, vueExports.unref(onSearch)],
        icon: "i-lucide-search",
        placeholder: "Tìm mã/tên vendor, người tạo...",
        class: "max-w-sm"
      }, null, _parent));
      _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_USelect, {
        modelValue: vueExports.unref(params).status,
        "onUpdate:modelValue": ($event) => vueExports.unref(params).status = $event,
        items: statusItems,
        "value-key": "value",
        class: "min-w-[180px]"
      }, null, _parent));
      _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_USelect, {
        modelValue: vueExports.unref(params).owner_source,
        "onUpdate:modelValue": ($event) => vueExports.unref(params).owner_source = $event,
        items: ownerSourceItems,
        "value-key": "value",
        class: "min-w-[180px]"
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
      _push(`<div class="flex-1"></div>`);
      _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UButton, {
        icon: "i-lucide-plus",
        label: "Tạo vendor",
        onClick: openCreate
      }, null, _parent));
      _push(`</div>`);
      if (vueExports.unref(error)) {
        _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UAlert, {
          icon: "i-lucide-alert-circle",
          color: "error",
          variant: "subtle",
          description: "Không thể tải danh sách vendor. Vui lòng thử lại.",
          class: "mb-4"
        }, null, _parent));
      } else {
        _push(`<!---->`);
      }
      _push(`<div class="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">`);
      _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UTable, {
        data: vueExports.unref(vendors),
        columns,
        loading: vueExports.unref(status) === "pending"
      }, {
        "slug-cell": vueExports.withCtx(({ row }, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_NuxtLink, {
              to: `${DETAIL_BASE}/${row.original.id}`,
              class: "font-mono font-semibold text-primary-700 hover:underline"
            }, {
              default: vueExports.withCtx((_, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(`${serverRenderer_cjs_prodExports.ssrInterpolate(row.original.slug)}`);
                } else {
                  return [
                    vueExports.createTextVNode(vueExports.toDisplayString(row.original.slug), 1)
                  ];
                }
              }),
              _: 2
            }, _parent2, _scopeId));
          } else {
            return [
              vueExports.createVNode(_component_NuxtLink, {
                to: `${DETAIL_BASE}/${row.original.id}`,
                class: "font-mono font-semibold text-primary-700 hover:underline"
              }, {
                default: vueExports.withCtx(() => [
                  vueExports.createTextVNode(vueExports.toDisplayString(row.original.slug), 1)
                ]),
                _: 2
              }, 1032, ["to"])
            ];
          }
        }),
        "name-cell": vueExports.withCtx(({ row }, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<span class="font-medium text-slate-900"${_scopeId}>${serverRenderer_cjs_prodExports.ssrInterpolate(row.original.name)}</span>`);
          } else {
            return [
              vueExports.createVNode("span", { class: "font-medium text-slate-900" }, vueExports.toDisplayString(row.original.name), 1)
            ];
          }
        }),
        "status-cell": vueExports.withCtx(({ row }, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UBadge, {
              color: vueExports.unref(partnerStatusBadgeColor)(row.original.status.value),
              variant: "subtle",
              label: row.original.status.label
            }, null, _parent2, _scopeId));
          } else {
            return [
              vueExports.createVNode(_component_UBadge, {
                color: vueExports.unref(partnerStatusBadgeColor)(row.original.status.value),
                variant: "subtle",
                label: row.original.status.label
              }, null, 8, ["color", "label"])
            ];
          }
        }),
        "owner-cell": vueExports.withCtx(({ row }, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="flex flex-col gap-0.5"${_scopeId}>`);
            _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UBadge, {
              color: row.original.owner_source.value === "platform" ? "primary" : "neutral",
              variant: "subtle",
              size: "xs",
              class: "w-fit",
              label: row.original.owner_source.label
            }, null, _parent2, _scopeId));
            if (row.original.owner_tenant) {
              _push2(`<span class="text-xs text-slate-500"${_scopeId}>${serverRenderer_cjs_prodExports.ssrInterpolate(row.original.owner_tenant.name ?? row.original.owner_tenant.id)}</span>`);
            } else {
              _push2(`<!---->`);
            }
            _push2(`</div>`);
          } else {
            return [
              vueExports.createVNode("div", { class: "flex flex-col gap-0.5" }, [
                vueExports.createVNode(_component_UBadge, {
                  color: row.original.owner_source.value === "platform" ? "primary" : "neutral",
                  variant: "subtle",
                  size: "xs",
                  class: "w-fit",
                  label: row.original.owner_source.label
                }, null, 8, ["color", "label"]),
                row.original.owner_tenant ? (vueExports.openBlock(), vueExports.createBlock("span", {
                  key: 0,
                  class: "text-xs text-slate-500"
                }, vueExports.toDisplayString(row.original.owner_tenant.name ?? row.original.owner_tenant.id), 1)) : vueExports.createCommentVNode("", true)
              ])
            ];
          }
        }),
        "project_count-cell": vueExports.withCtx(({ row }, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<span class="tabular-nums"${_scopeId}>${serverRenderer_cjs_prodExports.ssrInterpolate(row.original.project_count ?? 0)}</span>`);
          } else {
            return [
              vueExports.createVNode("span", { class: "tabular-nums" }, vueExports.toDisplayString(row.original.project_count ?? 0), 1)
            ];
          }
        }),
        "rating-cell": vueExports.withCtx(({ row }, _push2, _parent2, _scopeId) => {
          if (_push2) {
            if (row.original.rating) {
              _push2(`<div class="flex items-center gap-1 text-sm"${_scopeId}>`);
              _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UIcon, {
                name: "i-lucide-star",
                class: "size-3.5 text-amber-500"
              }, null, _parent2, _scopeId));
              _push2(`<span class="font-medium text-slate-900"${_scopeId}>${serverRenderer_cjs_prodExports.ssrInterpolate(row.original.rating.avg.toFixed(1))}</span><span class="text-slate-400"${_scopeId}>(${serverRenderer_cjs_prodExports.ssrInterpolate(row.original.rating.count)})</span></div>`);
            } else {
              _push2(`<span class="text-slate-400"${_scopeId}>—</span>`);
            }
          } else {
            return [
              row.original.rating ? (vueExports.openBlock(), vueExports.createBlock("div", {
                key: 0,
                class: "flex items-center gap-1 text-sm"
              }, [
                vueExports.createVNode(_component_UIcon, {
                  name: "i-lucide-star",
                  class: "size-3.5 text-amber-500"
                }),
                vueExports.createVNode("span", { class: "font-medium text-slate-900" }, vueExports.toDisplayString(row.original.rating.avg.toFixed(1)), 1),
                vueExports.createVNode("span", { class: "text-slate-400" }, "(" + vueExports.toDisplayString(row.original.rating.count) + ")", 1)
              ])) : (vueExports.openBlock(), vueExports.createBlock("span", {
                key: 1,
                class: "text-slate-400"
              }, "—"))
            ];
          }
        }),
        "offer_count-cell": vueExports.withCtx(({ row }, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<span class="tabular-nums"${_scopeId}>${serverRenderer_cjs_prodExports.ssrInterpolate(row.original.offer_count ?? 0)}</span>`);
          } else {
            return [
              vueExports.createVNode("span", { class: "tabular-nums" }, vueExports.toDisplayString(row.original.offer_count ?? 0), 1)
            ];
          }
        }),
        "provisioned-cell": vueExports.withCtx(({ row }, _push2, _parent2, _scopeId) => {
          if (_push2) {
            if (row.original.is_provisioned) {
              _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UBadge, {
                color: "success",
                variant: "subtle",
                label: "Đã provision",
                icon: "i-lucide-check",
                size: "xs"
              }, null, _parent2, _scopeId));
            } else {
              _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UBadge, {
                color: "warning",
                variant: "subtle",
                label: "Chờ provision",
                icon: "i-lucide-clock",
                size: "xs"
              }, null, _parent2, _scopeId));
            }
          } else {
            return [
              row.original.is_provisioned ? (vueExports.openBlock(), vueExports.createBlock(_component_UBadge, {
                key: 0,
                color: "success",
                variant: "subtle",
                label: "Đã provision",
                icon: "i-lucide-check",
                size: "xs"
              })) : (vueExports.openBlock(), vueExports.createBlock(_component_UBadge, {
                key: 1,
                color: "warning",
                variant: "subtle",
                label: "Chờ provision",
                icon: "i-lucide-clock",
                size: "xs"
              }))
            ];
          }
        }),
        "created_at-cell": vueExports.withCtx(({ row }, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<span class="text-sm"${_scopeId}>${serverRenderer_cjs_prodExports.ssrInterpolate(row.original.created_at ? ("formatDate" in _ctx ? _ctx.formatDate : vueExports.unref(formatDate))(row.original.created_at) : "—")}</span>`);
          } else {
            return [
              vueExports.createVNode("span", { class: "text-sm" }, vueExports.toDisplayString(row.original.created_at ? ("formatDate" in _ctx ? _ctx.formatDate : vueExports.unref(formatDate))(row.original.created_at) : "—"), 1)
            ];
          }
        }),
        "actions-cell": vueExports.withCtx(({ row }, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="flex items-center justify-end gap-1"${_scopeId}>`);
            _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UButton, {
              icon: "i-lucide-eye",
              color: "neutral",
              variant: "ghost",
              size: "xs",
              to: `${DETAIL_BASE}/${row.original.id}`,
              "aria-label": "Xem chi tiết"
            }, null, _parent2, _scopeId));
            if (row.original.status.value === "pending") {
              _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UButton, {
                icon: "i-lucide-check",
                color: "success",
                variant: "ghost",
                size: "xs",
                "aria-label": "Duyệt",
                onClick: ($event) => askAction("approve", row.original)
              }, null, _parent2, _scopeId));
            } else if (row.original.status.value === "active") {
              _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UButton, {
                icon: "i-lucide-ban",
                color: "warning",
                variant: "ghost",
                size: "xs",
                "aria-label": "Vô hiệu hoá",
                onClick: ($event) => askAction("deactivate", row.original)
              }, null, _parent2, _scopeId));
            } else if (row.original.status.value === "suspended") {
              _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UButton, {
                icon: "i-lucide-power",
                color: "primary",
                variant: "ghost",
                size: "xs",
                "aria-label": "Kích hoạt lại",
                onClick: ($event) => askAction("reactivate", row.original)
              }, null, _parent2, _scopeId));
            } else {
              _push2(`<!---->`);
            }
            if (!row.original.is_provisioned) {
              _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UButton, {
                icon: "i-lucide-rocket",
                color: "warning",
                variant: "ghost",
                size: "xs",
                "aria-label": "Provision tenant ở resi_mart",
                title: "Provision tenant ở resi_mart",
                loading: vueExports.unref(provisioningId) === row.original.id,
                onClick: ($event) => handleProvision(row.original)
              }, null, _parent2, _scopeId));
            } else {
              _push2(`<!---->`);
            }
            _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UButton, {
              icon: "i-lucide-pencil",
              color: "neutral",
              variant: "ghost",
              size: "xs",
              "aria-label": "Sửa",
              title: "Sửa",
              onClick: ($event) => openEdit(row.original)
            }, null, _parent2, _scopeId));
            _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UButton, {
              icon: "i-lucide-trash-2",
              color: "neutral",
              variant: "ghost",
              size: "xs",
              class: "hover:!text-red-500 hover:!bg-red-50",
              "aria-label": "Xoá",
              title: "Xoá",
              onClick: ($event) => vueExports.unref(openDeleteModal)(row.original)
            }, null, _parent2, _scopeId));
            _push2(`</div>`);
          } else {
            return [
              vueExports.createVNode("div", { class: "flex items-center justify-end gap-1" }, [
                vueExports.createVNode(_component_UButton, {
                  icon: "i-lucide-eye",
                  color: "neutral",
                  variant: "ghost",
                  size: "xs",
                  to: `${DETAIL_BASE}/${row.original.id}`,
                  "aria-label": "Xem chi tiết"
                }, null, 8, ["to"]),
                row.original.status.value === "pending" ? (vueExports.openBlock(), vueExports.createBlock(_component_UButton, {
                  key: 0,
                  icon: "i-lucide-check",
                  color: "success",
                  variant: "ghost",
                  size: "xs",
                  "aria-label": "Duyệt",
                  onClick: ($event) => askAction("approve", row.original)
                }, null, 8, ["onClick"])) : row.original.status.value === "active" ? (vueExports.openBlock(), vueExports.createBlock(_component_UButton, {
                  key: 1,
                  icon: "i-lucide-ban",
                  color: "warning",
                  variant: "ghost",
                  size: "xs",
                  "aria-label": "Vô hiệu hoá",
                  onClick: ($event) => askAction("deactivate", row.original)
                }, null, 8, ["onClick"])) : row.original.status.value === "suspended" ? (vueExports.openBlock(), vueExports.createBlock(_component_UButton, {
                  key: 2,
                  icon: "i-lucide-power",
                  color: "primary",
                  variant: "ghost",
                  size: "xs",
                  "aria-label": "Kích hoạt lại",
                  onClick: ($event) => askAction("reactivate", row.original)
                }, null, 8, ["onClick"])) : vueExports.createCommentVNode("", true),
                !row.original.is_provisioned ? (vueExports.openBlock(), vueExports.createBlock(_component_UButton, {
                  key: 3,
                  icon: "i-lucide-rocket",
                  color: "warning",
                  variant: "ghost",
                  size: "xs",
                  "aria-label": "Provision tenant ở resi_mart",
                  title: "Provision tenant ở resi_mart",
                  loading: vueExports.unref(provisioningId) === row.original.id,
                  onClick: ($event) => handleProvision(row.original)
                }, null, 8, ["loading", "onClick"])) : vueExports.createCommentVNode("", true),
                vueExports.createVNode(_component_UButton, {
                  icon: "i-lucide-pencil",
                  color: "neutral",
                  variant: "ghost",
                  size: "xs",
                  "aria-label": "Sửa",
                  title: "Sửa",
                  onClick: ($event) => openEdit(row.original)
                }, null, 8, ["onClick"]),
                vueExports.createVNode(_component_UButton, {
                  icon: "i-lucide-trash-2",
                  color: "neutral",
                  variant: "ghost",
                  size: "xs",
                  class: "hover:!text-red-500 hover:!bg-red-50",
                  "aria-label": "Xoá",
                  title: "Xoá",
                  onClick: ($event) => vueExports.unref(openDeleteModal)(row.original)
                }, null, 8, ["onClick"])
              ])
            ];
          }
        }),
        empty: vueExports.withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="py-8 text-center text-sm text-slate-500"${_scopeId}> Chưa có vendor nào. </div>`);
          } else {
            return [
              vueExports.createVNode("div", { class: "py-8 text-center text-sm text-slate-500" }, " Chưa có vendor nào. ")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_SharedCrudTablePagination, {
        page: vueExports.unref(page),
        "onUpdate:page": ($event) => vueExports.isRef(page) ? page.value = $event : null,
        meta: vueExports.unref(data)?.meta
      }, null, _parent));
      _push(`</div>`);
      _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_PartnerFormModal, {
        open: vueExports.unref(showCreateModal),
        "onUpdate:open": ($event) => vueExports.isRef(showCreateModal) ? showCreateModal.value = $event : null,
        mode: "create",
        loading: vueExports.unref(isCreating),
        "api-errors": vueExports.unref(createApiErrors),
        onSubmit: handleCreate
      }, null, _parent));
      _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_PartnerFormModal, {
        open: vueExports.unref(showFormModal),
        "onUpdate:open": ($event) => vueExports.isRef(showFormModal) ? showFormModal.value = $event : null,
        mode: "edit",
        item: vueExports.unref(editTarget),
        "initial-project-ids": vueExports.unref(editProjectIds),
        loading: vueExports.unref(isSubmitting),
        "api-errors": vueExports.unref(formApiErrors),
        onSubmit: handleEditSubmit
      }, null, _parent));
      _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_SharedCrudDeleteModal, {
        open: vueExports.unref(showDeleteModal),
        "onUpdate:open": ($event) => vueExports.isRef(showDeleteModal) ? showDeleteModal.value = $event : null,
        title: "Xoá vendor",
        "item-name": vueExports.unref(deleteTarget)?.name,
        loading: vueExports.unref(isDeleting),
        description: "Soft-delete vendor. Schema tenant ở resi_mart KHÔNG bị xoá — dữ liệu vẫn còn nguyên cho audit.",
        onConfirm: handleDelete
      }, null, _parent));
      _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_VendorConsoleActionConfirmModal, {
        open: vueExports.unref(showActionModal),
        "onUpdate:open": ($event) => vueExports.isRef(showActionModal) ? showActionModal.value = $event : null,
        action: vueExports.unref(actionType),
        "vendor-name": vueExports.unref(actionTarget)?.name,
        loading: vueExports.unref(actionLoading),
        onConfirm: confirmAction
      }, null, _parent));
      _push(`</div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = vueExports.useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/platform/quan-ly-van-hanh/quan-ly-vendor/index.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=index-C3FYYZkL.mjs.map
