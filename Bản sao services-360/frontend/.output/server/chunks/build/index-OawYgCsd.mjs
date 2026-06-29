import { _ as __nuxt_component_0 } from './PageHeader-BJhealxW.mjs';
import { _ as _sfc_main$1 } from './Input-JXN8po_F.mjs';
import { _ as _sfc_main$2 } from './Select-CZE7Ef6n.mjs';
import { v as vueExports, u as useSeoMeta, i as useRouter, j as useToast, s as serverRenderer_cjs_prodExports, l as _sfc_main$c, y as _sfc_main$f } from './server.mjs';
import { _ as _sfc_main$3 } from './Alert-tTsPKADX.mjs';
import { _ as _sfc_main$4 } from './Table-17SH0cIR.mjs';
import { _ as _sfc_main$6 } from './Badge-W93D3Jpz.mjs';
import { _ as _sfc_main$5 } from './Tooltip-Dasyzope.mjs';
import { _ as __nuxt_component_10 } from './TablePagination-CZYWB-qm.mjs';
import { _ as __nuxt_component_11 } from './DeleteModal-B4AevDGU.mjs';
import { a as formatDate } from './date-R5YK0ast.mjs';
import { D as DEFAULT_PER_PAGE } from './constants-G9YmtWtp.mjs';
import { u as useTableSearch } from './useTableSearch-BhG9s2Ie.mjs';
import { u as useTenantPartnerList, a as apiProvisionTenantPartner, b as apiDeleteTenantPartner } from './usePartners-DhKs6EM6.mjs';
import { s as stickyRight } from './table-z_7x7CvB.mjs';
import { u as useCrudModals } from './useCrudModals-BUUQWYeI.mjs';
import { u as useCrudSubmit } from './useCrudSubmit-gMGxLTGY.mjs';
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
import './index-CSThDD3J.mjs';
import './useGraceArea-B6BTYtpN.mjs';
import './Kbd-T8yC2vfh.mjs';
import './Pagination-fZq_Msxb.mjs';
import './Modal-BimZZbNl.mjs';
import './DialogTrigger-C3iwCYMu.mjs';
import './DialogClose-DGkUxau7.mjs';

const _sfc_main = /* @__PURE__ */ vueExports.defineComponent({
  __name: "index",
  __ssrInlineRender: true,
  setup(__props) {
    useSeoMeta({ title: "Vendor của tôi - Thần Nông" });
    const router = useRouter();
    const toast = useToast();
    const params = vueExports.reactive({
      search: void 0,
      status: void 0,
      provisioned: void 0,
      category: void 0,
      per_page: DEFAULT_PER_PAGE
    });
    const page = vueExports.ref(1);
    const { searchInput, onSearch } = useTableSearch((value) => {
      params.search = value || void 0;
      page.value = 1;
    });
    const statusFilter = vueExports.ref("all");
    function applyStatusFilter(value) {
      statusFilter.value = value;
      params.status = value === "all" ? void 0 : value;
      page.value = 1;
    }
    const provisionFilter = vueExports.ref("all");
    function applyProvisionFilter(value) {
      provisionFilter.value = value;
      params.provisioned = value === "all" ? void 0 : value === "provisioned";
      page.value = 1;
    }
    const hasFilters = vueExports.computed(
      () => !!searchInput.value || statusFilter.value !== "all" || provisionFilter.value !== "all"
    );
    function clearFilters() {
      searchInput.value = "";
      params.search = void 0;
      statusFilter.value = "all";
      params.status = void 0;
      provisionFilter.value = "all";
      params.provisioned = void 0;
      page.value = 1;
    }
    const { data, status, error, refresh } = useTenantPartnerList(
      vueExports.computed(() => ({ ...params, page: page.value }))
    );
    vueExports.watch(error, (e) => {
      if (!e) return;
      const apiErr = e;
      const code = apiErr?.data?.error_code;
      const status2 = apiErr?.status ?? apiErr?.statusCode;
      if (code === "VENDOR_FEATURE_DISABLED" || status2 === 403) {
        toast.add({
          title: "Tenant chưa kích hoạt gói vendor",
          description: "Liên hệ Platform admin để bật gói vendor cho tenant của bạn.",
          color: "warning",
          icon: "i-lucide-shield-off"
        });
        router.replace("/pmc/dashboard");
      }
    }, { immediate: true });
    const vendors = vueExports.computed(() => data.value?.data ?? []);
    const columns = [
      { id: "logo", header: "" },
      { id: "name", header: "Tên hiển thị" },
      { accessorKey: "slug", header: "Slug" },
      { id: "categories", header: "Danh mục" },
      { id: "status", header: "Trạng thái" },
      { id: "provisioned", header: "Provision" },
      { accessorKey: "created_at", header: "Ngày tạo" },
      stickyRight({ id: "actions", header: "Thao tác" }, { width: "w-[120px] min-w-[120px]" })
    ];
    function goDetail(item) {
      router.push(`/pmc/vendors/${item.id}`);
    }
    function goEdit(item) {
      router.push(`/pmc/vendors/${item.id}/edit`);
    }
    const crud = useCrudModals();
    const { showDeleteModal, deleteTarget, openDeleteModal } = crud;
    const { isDeleting, submitDelete } = useCrudSubmit(crud, refresh);
    function handleDelete() {
      submitDelete(
        () => apiDeleteTenantPartner(deleteTarget.value.id),
        {
          message: "Đã xoá vendor.",
          onError: (err) => {
            const apiErr = err;
            if (apiErr?.data?.error_code === "VENDOR_ALREADY_PROVISIONED") {
              toast.add({
                title: "Không thể xoá vendor đã kích hoạt",
                description: "Vendor đã được kích hoạt. Vui lòng liên hệ Platform admin để xoá.",
                color: "warning",
                icon: "i-lucide-shield-alert"
              });
              showDeleteModal.value = false;
              return true;
            }
            return false;
          }
        }
      );
    }
    function firstChar(name) {
      const trimmed = (name ?? "").trim();
      return trimmed ? trimmed.charAt(0).toUpperCase() : "?";
    }
    const provisioningId = vueExports.ref(null);
    async function retryProvision(item) {
      provisioningId.value = item.id;
      try {
        await apiProvisionTenantPartner(item.id);
        toast.add({
          title: "Đã kích hoạt shop trên resi_mart",
          color: "success",
          icon: "i-lucide-check-circle"
        });
        await refresh();
      } catch (err) {
        toast.add({
          title: getApiErrorMessage(err, "Kích hoạt shop thất bại — resi_mart không phản hồi"),
          description: "Vui lòng thử lại sau ít phút. Nếu vẫn lỗi, liên hệ Platform admin.",
          color: "error",
          icon: "i-lucide-alert-circle"
        });
      } finally {
        provisioningId.value = null;
      }
    }
    return (_ctx, _push, _parent, _attrs) => {
      const _component_SharedCrudPageHeader = __nuxt_component_0;
      const _component_UInput = _sfc_main$1;
      const _component_USelect = _sfc_main$2;
      const _component_UButton = _sfc_main$c;
      const _component_UAlert = _sfc_main$3;
      const _component_UTable = _sfc_main$4;
      const _component_UAvatar = _sfc_main$f;
      const _component_UBadge = _sfc_main$6;
      const _component_UTooltip = _sfc_main$5;
      const _component_SharedCrudTablePagination = __nuxt_component_10;
      const _component_SharedCrudDeleteModal = __nuxt_component_11;
      _push(`<div${serverRenderer_cjs_prodExports.ssrRenderAttrs(_attrs)}>`);
      _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_SharedCrudPageHeader, {
        title: "Vendor của tôi",
        description: "Quản lý các vendor (đối tác marketplace) mà tenant của bạn đăng ký.",
        "create-to": "/pmc/vendors/tao-moi",
        "create-label": "Đăng ký vendor"
      }, null, _parent));
      _push(`<div class="mb-4 flex items-center gap-3 flex-wrap">`);
      _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UInput, {
        modelValue: vueExports.unref(searchInput),
        "onUpdate:modelValue": [($event) => vueExports.isRef(searchInput) ? searchInput.value = $event : null, vueExports.unref(onSearch)],
        icon: "i-lucide-search",
        placeholder: "Tìm theo tên, slug, email...",
        class: "max-w-sm"
      }, null, _parent));
      _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_USelect, {
        "model-value": vueExports.unref(statusFilter),
        items: [
          { label: "Trạng thái: Tất cả", value: "all" },
          { label: "Đang hoạt động", value: "active" },
          { label: "Tạm khoá", value: "suspended" },
          { label: "Đã chấm dứt", value: "terminated" }
        ],
        class: "min-w-[180px]",
        "onUpdate:modelValue": (v) => applyStatusFilter(v)
      }, null, _parent));
      _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_USelect, {
        modelValue: vueExports.unref(provisionFilter),
        "onUpdate:modelValue": [($event) => vueExports.isRef(provisionFilter) ? provisionFilter.value = $event : null, (v) => applyProvisionFilter(v)],
        items: [
          { label: "Provision: Tất cả", value: "all" },
          { label: "Đã kích hoạt", value: "provisioned" },
          { label: "Chờ provision", value: "pending" }
        ],
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
      _push(`</div>`);
      if (vueExports.unref(error) && vueExports.unref(error).status !== 403) {
        _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UAlert, {
          icon: "i-lucide-alert-circle",
          color: "error",
          variant: "subtle",
          description: "Không thể tải dữ liệu. Vui lòng thử lại.",
          class: "mb-4"
        }, null, _parent));
      } else {
        _push(`<!---->`);
      }
      _push(`<div class="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">`);
      _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UTable, {
        data: vueExports.unref(vendors),
        columns,
        loading: vueExports.unref(status) === "pending",
        empty: "Chưa có vendor nào. Đăng ký vendor đầu tiên để bắt đầu bán trên marketplace."
      }, {
        "logo-cell": vueExports.withCtx(({ row }, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UAvatar, {
              src: row.original.logo_url ?? void 0,
              alt: row.original.name,
              text: firstChar(row.original.display_name ?? row.original.name),
              size: "sm"
            }, null, _parent2, _scopeId));
          } else {
            return [
              vueExports.createVNode(_component_UAvatar, {
                src: row.original.logo_url ?? void 0,
                alt: row.original.name,
                text: firstChar(row.original.display_name ?? row.original.name),
                size: "sm"
              }, null, 8, ["src", "alt", "text"])
            ];
          }
        }),
        "name-cell": vueExports.withCtx(({ row }, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<button type="button" class="text-left font-medium text-primary-700 hover:underline"${_scopeId}>${serverRenderer_cjs_prodExports.ssrInterpolate(row.original.display_name ?? row.original.name)}</button>`);
          } else {
            return [
              vueExports.createVNode("button", {
                type: "button",
                class: "text-left font-medium text-primary-700 hover:underline",
                onClick: ($event) => goDetail(row.original)
              }, vueExports.toDisplayString(row.original.display_name ?? row.original.name), 9, ["onClick"])
            ];
          }
        }),
        "slug-cell": vueExports.withCtx(({ row }, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<span class="font-mono text-xs text-slate-600"${_scopeId}>${serverRenderer_cjs_prodExports.ssrInterpolate(row.original.slug)}</span>`);
          } else {
            return [
              vueExports.createVNode("span", { class: "font-mono text-xs text-slate-600" }, vueExports.toDisplayString(row.original.slug), 1)
            ];
          }
        }),
        "categories-cell": vueExports.withCtx(({ row }, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="flex flex-wrap gap-1"${_scopeId}><!--[-->`);
            serverRenderer_cjs_prodExports.ssrRenderList(row.original.categories.slice(0, 3), (cat) => {
              _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UBadge, {
                key: cat,
                variant: "subtle",
                color: "info",
                label: cat,
                size: "xs"
              }, null, _parent2, _scopeId));
            });
            _push2(`<!--]-->`);
            if (row.original.categories.length > 3) {
              _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UBadge, {
                variant: "subtle",
                color: "neutral",
                label: `+${row.original.categories.length - 3}`,
                size: "xs"
              }, null, _parent2, _scopeId));
            } else {
              _push2(`<!---->`);
            }
            if (!row.original.categories?.length) {
              _push2(`<span class="text-xs text-gray-400"${_scopeId}>—</span>`);
            } else {
              _push2(`<!---->`);
            }
            _push2(`</div>`);
          } else {
            return [
              vueExports.createVNode("div", { class: "flex flex-wrap gap-1" }, [
                (vueExports.openBlock(true), vueExports.createBlock(vueExports.Fragment, null, vueExports.renderList(row.original.categories.slice(0, 3), (cat) => {
                  return vueExports.openBlock(), vueExports.createBlock(_component_UBadge, {
                    key: cat,
                    variant: "subtle",
                    color: "info",
                    label: cat,
                    size: "xs"
                  }, null, 8, ["label"]);
                }), 128)),
                row.original.categories.length > 3 ? (vueExports.openBlock(), vueExports.createBlock(_component_UBadge, {
                  key: 0,
                  variant: "subtle",
                  color: "neutral",
                  label: `+${row.original.categories.length - 3}`,
                  size: "xs"
                }, null, 8, ["label"])) : vueExports.createCommentVNode("", true),
                !row.original.categories?.length ? (vueExports.openBlock(), vueExports.createBlock("span", {
                  key: 1,
                  class: "text-xs text-gray-400"
                }, "—")) : vueExports.createCommentVNode("", true)
              ])
            ];
          }
        }),
        "status-cell": vueExports.withCtx(({ row }, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UBadge, {
              color: row.original.status.value === "active" ? "success" : row.original.status.value === "suspended" ? "warning" : "neutral",
              variant: "subtle",
              label: row.original.status.label
            }, null, _parent2, _scopeId));
          } else {
            return [
              vueExports.createVNode(_component_UBadge, {
                color: row.original.status.value === "active" ? "success" : row.original.status.value === "suspended" ? "warning" : "neutral",
                variant: "subtle",
                label: row.original.status.label
              }, null, 8, ["color", "label"])
            ];
          }
        }),
        "provisioned-cell": vueExports.withCtx(({ row }, _push2, _parent2, _scopeId) => {
          if (_push2) {
            if (row.original.is_provisioned) {
              _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UBadge, {
                color: "success",
                variant: "subtle",
                label: "Đã kích hoạt",
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
                label: "Đã kích hoạt",
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
            _push2(`${serverRenderer_cjs_prodExports.ssrInterpolate(row.original.created_at ? ("formatDate" in _ctx ? _ctx.formatDate : vueExports.unref(formatDate))(row.original.created_at) : "—")}`);
          } else {
            return [
              vueExports.createTextVNode(vueExports.toDisplayString(row.original.created_at ? ("formatDate" in _ctx ? _ctx.formatDate : vueExports.unref(formatDate))(row.original.created_at) : "—"), 1)
            ];
          }
        }),
        "actions-cell": vueExports.withCtx(({ row }, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="flex items-center gap-1"${_scopeId}>`);
            if (!row.original.is_provisioned) {
              _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UTooltip, { text: "Thử kích hoạt lại shop trên resi_mart" }, {
                default: vueExports.withCtx((_, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    _push3(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UButton, {
                      icon: "i-lucide-rocket",
                      color: "warning",
                      variant: "ghost",
                      size: "xs",
                      loading: vueExports.unref(provisioningId) === row.original.id,
                      "aria-label": "Retry provision",
                      onClick: ($event) => retryProvision(row.original)
                    }, null, _parent3, _scopeId2));
                  } else {
                    return [
                      vueExports.createVNode(_component_UButton, {
                        icon: "i-lucide-rocket",
                        color: "warning",
                        variant: "ghost",
                        size: "xs",
                        loading: vueExports.unref(provisioningId) === row.original.id,
                        "aria-label": "Retry provision",
                        onClick: ($event) => retryProvision(row.original)
                      }, null, 8, ["loading", "onClick"])
                    ];
                  }
                }),
                _: 2
              }, _parent2, _scopeId));
            } else {
              _push2(`<!---->`);
            }
            _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UTooltip, { text: "Hợp đồng hoa hồng" }, {
              default: vueExports.withCtx((_, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UButton, {
                    icon: "i-lucide-handshake",
                    color: "neutral",
                    variant: "ghost",
                    size: "xs",
                    "aria-label": "Hợp đồng hoa hồng",
                    to: `/pmc/vendors/${row.original.id}?tab=contracts`
                  }, null, _parent3, _scopeId2));
                } else {
                  return [
                    vueExports.createVNode(_component_UButton, {
                      icon: "i-lucide-handshake",
                      color: "neutral",
                      variant: "ghost",
                      size: "xs",
                      "aria-label": "Hợp đồng hoa hồng",
                      to: `/pmc/vendors/${row.original.id}?tab=contracts`
                    }, null, 8, ["to"])
                  ];
                }
              }),
              _: 2
            }, _parent2, _scopeId));
            _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UButton, {
              icon: "i-lucide-pencil",
              color: "neutral",
              variant: "ghost",
              size: "xs",
              "aria-label": "Chỉnh sửa",
              onClick: ($event) => goEdit(row.original)
            }, null, _parent2, _scopeId));
            if (!row.original.is_provisioned) {
              _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UButton, {
                icon: "i-lucide-trash-2",
                color: "neutral",
                variant: "ghost",
                size: "xs",
                class: "hover:text-red-500 hover:bg-red-50",
                "aria-label": "Xoá vendor",
                onClick: ($event) => vueExports.unref(openDeleteModal)(row.original)
              }, null, _parent2, _scopeId));
            } else {
              _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UTooltip, { text: "Liên hệ Platform admin để xoá vendor đã kích hoạt." }, {
                default: vueExports.withCtx((_, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    _push3(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UButton, {
                      icon: "i-lucide-trash-2",
                      color: "neutral",
                      variant: "ghost",
                      size: "xs",
                      disabled: ""
                    }, null, _parent3, _scopeId2));
                  } else {
                    return [
                      vueExports.createVNode(_component_UButton, {
                        icon: "i-lucide-trash-2",
                        color: "neutral",
                        variant: "ghost",
                        size: "xs",
                        disabled: ""
                      })
                    ];
                  }
                }),
                _: 2
              }, _parent2, _scopeId));
            }
            _push2(`</div>`);
          } else {
            return [
              vueExports.createVNode("div", { class: "flex items-center gap-1" }, [
                !row.original.is_provisioned ? (vueExports.openBlock(), vueExports.createBlock(_component_UTooltip, {
                  key: 0,
                  text: "Thử kích hoạt lại shop trên resi_mart"
                }, {
                  default: vueExports.withCtx(() => [
                    vueExports.createVNode(_component_UButton, {
                      icon: "i-lucide-rocket",
                      color: "warning",
                      variant: "ghost",
                      size: "xs",
                      loading: vueExports.unref(provisioningId) === row.original.id,
                      "aria-label": "Retry provision",
                      onClick: ($event) => retryProvision(row.original)
                    }, null, 8, ["loading", "onClick"])
                  ]),
                  _: 2
                }, 1024)) : vueExports.createCommentVNode("", true),
                vueExports.createVNode(_component_UTooltip, { text: "Hợp đồng hoa hồng" }, {
                  default: vueExports.withCtx(() => [
                    vueExports.createVNode(_component_UButton, {
                      icon: "i-lucide-handshake",
                      color: "neutral",
                      variant: "ghost",
                      size: "xs",
                      "aria-label": "Hợp đồng hoa hồng",
                      to: `/pmc/vendors/${row.original.id}?tab=contracts`
                    }, null, 8, ["to"])
                  ]),
                  _: 2
                }, 1024),
                vueExports.createVNode(_component_UButton, {
                  icon: "i-lucide-pencil",
                  color: "neutral",
                  variant: "ghost",
                  size: "xs",
                  "aria-label": "Chỉnh sửa",
                  onClick: ($event) => goEdit(row.original)
                }, null, 8, ["onClick"]),
                !row.original.is_provisioned ? (vueExports.openBlock(), vueExports.createBlock(_component_UButton, {
                  key: 1,
                  icon: "i-lucide-trash-2",
                  color: "neutral",
                  variant: "ghost",
                  size: "xs",
                  class: "hover:text-red-500 hover:bg-red-50",
                  "aria-label": "Xoá vendor",
                  onClick: ($event) => vueExports.unref(openDeleteModal)(row.original)
                }, null, 8, ["onClick"])) : (vueExports.openBlock(), vueExports.createBlock(_component_UTooltip, {
                  key: 2,
                  text: "Liên hệ Platform admin để xoá vendor đã kích hoạt."
                }, {
                  default: vueExports.withCtx(() => [
                    vueExports.createVNode(_component_UButton, {
                      icon: "i-lucide-trash-2",
                      color: "neutral",
                      variant: "ghost",
                      size: "xs",
                      disabled: ""
                    })
                  ]),
                  _: 1
                }))
              ])
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
      _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_SharedCrudDeleteModal, {
        open: vueExports.unref(showDeleteModal),
        "onUpdate:open": ($event) => vueExports.isRef(showDeleteModal) ? showDeleteModal.value = $event : null,
        title: "Xoá vendor",
        "item-name": vueExports.unref(deleteTarget)?.display_name ?? vueExports.unref(deleteTarget)?.name,
        loading: vueExports.unref(isDeleting),
        description: "Vendor sẽ bị xoá (soft-delete). Hành động này chỉ áp dụng cho vendor chưa được kích hoạt shop trên resi_mart.",
        onConfirm: handleDelete
      }, null, _parent));
      _push(`</div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = vueExports.useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/pmc/vendors/index.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=index-OawYgCsd.mjs.map
