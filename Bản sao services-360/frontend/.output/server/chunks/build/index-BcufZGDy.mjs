import { _ as __nuxt_component_0 } from './PageHeader-BJhealxW.mjs';
import { v as vueExports, j as useToast, s as serverRenderer_cjs_prodExports, l as _sfc_main$c, _ as __nuxt_component_0$4, y as _sfc_main$f } from './server.mjs';
import { _ as _sfc_main$2 } from './Input-JXN8po_F.mjs';
import { _ as _sfc_main$6 } from './SelectMenu-DKHEMZj7.mjs';
import { u as useEntitySelect } from './useEntitySelect-DG9pQ_n0.mjs';
import { u as useDepartmentList, d as apiGetDepartment } from './useDepartments-C8BvGnCs.mjs';
import { b as __nuxt_component_4, _ as __nuxt_component_16, a as __nuxt_component_17 } from './AccountChangePasswordModal-rohcABJW.mjs';
import { _ as __nuxt_component_3$1 } from './ProjectSelect-BTBiFCd5.mjs';
import { _ as __nuxt_component_2 } from './TableWrapper-VwUckvcF.mjs';
import { _ as _sfc_main$3 } from './Table-17SH0cIR.mjs';
import { _ as _sfc_main$4 } from './Badge-W93D3Jpz.mjs';
import { _ as __nuxt_component_7 } from './StatusBadge-DeQimcpk.mjs';
import { _ as __nuxt_component_1 } from './CapabilityRatingBadge-BBWBj9qN.mjs';
import { _ as _sfc_main$5 } from './Tooltip-Dasyzope.mjs';
import { _ as __nuxt_component_3$2 } from './TableActions-b69bU2gG.mjs';
import { _ as __nuxt_component_10 } from './TablePagination-CZYWB-qm.mjs';
import { _ as __nuxt_component_11 } from './DeleteModal-B4AevDGU.mjs';
import { D as DEFAULT_PER_PAGE } from './constants-G9YmtWtp.mjs';
import { u as useTableSearch } from './useTableSearch-BhG9s2Ie.mjs';
import { u as useUrlFilters } from './useUrlFilters-D9dcjQcy.mjs';
import { d as useAccountList, e as apiCreateAccount, a as apiUpdateAccount, b as apiChangeAccountPassword, c as apiDeleteAccount } from './useAccounts-BDWM8ZpB.mjs';
import { s as stickyRight } from './table-z_7x7CvB.mjs';
import { u as useCrudModals } from './useCrudModals-BUUQWYeI.mjs';
import { u as useCrudSubmit } from './useCrudSubmit-gMGxLTGY.mjs';
import { a as getApiValidationErrors, g as getApiErrorMessage } from './apiError-DBrxF9au.mjs';
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
import './FocusScope-BZehoQSg.mjs';
import './PopperArrow-C9hHWuSZ.mjs';
import './useDirection-CXYby7CP.mjs';
import './useFormControl-_Lqv8ipK.mjs';
import './useKbd-JjFOu4f7.mjs';
import './utils-BgcT7rQQ.mjs';
import './VisuallyHiddenInput-q6Pz-w0i.mjs';
import './handleAndDispatchCustomEvent-Bk_AVSSo.mjs';
import './index-CSThDD3J.mjs';
import './BaseFormModal-CG7aCaIV.mjs';
import './Modal-BimZZbNl.mjs';
import './DialogTrigger-C3iwCYMu.mjs';
import './utils-DY0Zag2O.mjs';
import './DialogClose-DGkUxau7.mjs';
import './Alert-tTsPKADX.mjs';
import './AvatarUpload-CsEPx2JP.mjs';
import './FormField-DFdmv6Lu.mjs';
import './Label-BBgw4vHh.mjs';
import './FormFieldError-cu7WK1i1.mjs';
import './Select-CZE7Ef6n.mjs';
import './useFocusGuards-CJykkUFH.mjs';
import './useJobTitles-DzuQHrcS.mjs';
import './useRoles-Bl-GRSKI.mjs';
import './useProjects-D4K3VYdb.mjs';
import './Switch-1cJNH-6C.mjs';
import './Separator-DeO-OPIs.mjs';
import './Separator-DtmsHEyk.mjs';
import './vietqr-D50vgfgj.mjs';
import './PageError-kZWsA9dh.mjs';
import './useGraceArea-B6BTYtpN.mjs';
import './Kbd-T8yC2vfh.mjs';
import './Pagination-fZq_Msxb.mjs';

const _sfc_main$1 = /* @__PURE__ */ vueExports.defineComponent({
  __name: "DepartmentSelect",
  __ssrInlineRender: true,
  props: {
    modelValue: { default: null },
    placeholder: { default: "Chọn phòng ban" }
  },
  emits: ["update:modelValue", "update:label"],
  setup(__props, { emit: __emit }) {
    const props = __props;
    const emit = __emit;
    const { selectedItem, items, loading, onSearchTerm } = useEntitySelect(
      () => props.modelValue,
      (val) => emit("update:modelValue", val),
      {
        fetchList: useDepartmentList,
        resolveItem: async (id) => {
          const r = await apiGetDepartment(id);
          return { id: r.data.id, label: r.data.name };
        },
        onLabelChange: (val) => emit("update:label", val)
      }
    );
    return (_ctx, _push, _parent, _attrs) => {
      const _component_USelectMenu = _sfc_main$6;
      _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_USelectMenu, vueExports.mergeProps({
        modelValue: vueExports.unref(selectedItem),
        "onUpdate:modelValue": ($event) => vueExports.isRef(selectedItem) ? selectedItem.value = $event : null,
        items: vueExports.unref(items),
        loading: vueExports.unref(loading),
        "ignore-filter": true,
        "search-input": { placeholder: "Tìm phòng ban..." },
        placeholder: __props.placeholder,
        clear: "",
        class: "w-full",
        "onUpdate:searchTerm": vueExports.unref(onSearchTerm)
      }, _attrs), null, _parent));
    };
  }
});
const _sfc_setup$1 = _sfc_main$1.setup;
_sfc_main$1.setup = (props, ctx) => {
  const ssrContext = vueExports.useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/shared/department/DepartmentSelect.vue");
  return _sfc_setup$1 ? _sfc_setup$1(props, ctx) : void 0;
};
const __nuxt_component_3 = Object.assign(_sfc_main$1, { __name: "SharedDepartmentSelect" });
const _sfc_main = /* @__PURE__ */ vueExports.defineComponent({
  __name: "index",
  __ssrInlineRender: true,
  setup(__props) {
    const params = vueExports.reactive({
      search: void 0,
      department_id: void 0,
      job_title_id: void 0,
      project_id: void 0,
      per_page: DEFAULT_PER_PAGE
    });
    const page = vueExports.ref(1);
    const { searchInput, onSearch } = useTableSearch((value) => {
      params.search = value;
      page.value = 1;
    });
    const filterDepartmentId = vueExports.ref(null);
    const filterJobTitleId = vueExports.ref(null);
    const filterProjectId = vueExports.ref(null);
    const { isInitFromUrl } = useUrlFilters({
      search: { ref: vueExports.toRef(params, "search"), type: "string", onInit: (v) => {
        searchInput.value = String(v);
      } },
      page: { ref: page, type: "number", defaultValue: 1 },
      department_id: { ref: filterDepartmentId, type: "number", onInit: (v) => {
        params.department_id = v;
      } },
      job_title_id: { ref: filterJobTitleId, type: "number", onInit: (v) => {
        params.job_title_id = v;
      } },
      project_id: { ref: filterProjectId, type: "number", onInit: (v) => {
        params.project_id = v;
      } }
    });
    vueExports.watch(filterDepartmentId, (val) => {
      params.department_id = val ?? void 0;
      if (!isInitFromUrl.value) page.value = 1;
    });
    vueExports.watch(filterJobTitleId, (val) => {
      params.job_title_id = val ?? void 0;
      if (!isInitFromUrl.value) page.value = 1;
    });
    vueExports.watch(filterProjectId, (val) => {
      params.project_id = val ?? void 0;
      if (!isInitFromUrl.value) page.value = 1;
    });
    const hasFilters = vueExports.computed(
      () => !!searchInput.value || !!filterDepartmentId.value || !!filterJobTitleId.value || !!filterProjectId.value
    );
    function clearFilters() {
      searchInput.value = "";
      params.search = void 0;
      filterDepartmentId.value = null;
      filterJobTitleId.value = null;
      filterProjectId.value = null;
      page.value = 1;
    }
    const { data, status, error, refresh } = useAccountList(
      vueExports.computed(() => ({ ...params, page: page.value }))
    );
    const accounts = vueExports.computed(() => data.value?.data ?? []);
    const columns = [
      { id: "avatar", header: "Avatar" },
      { accessorKey: "employee_code", header: "Mã NV" },
      { accessorKey: "name", header: "Họ tên" },
      { accessorKey: "email", header: "Email" },
      { id: "gender", header: "Giới tính" },
      { id: "department", header: "Phòng ban" },
      { id: "job_title", header: "Chức danh" },
      { id: "role", header: "Role" },
      { id: "is_active", header: "Trạng thái" },
      { id: "capability_rating", header: "Năng lực" },
      { id: "assignment_status", header: "Đang giao việc" },
      { id: "projects", header: "Dự án" },
      stickyRight({ id: "actions", header: "Thao tác" }, { width: "w-[160px] min-w-[160px]" })
    ];
    const crud = useCrudModals();
    const {
      showFormModal,
      formMode,
      editTarget,
      formApiErrors,
      openCreateModal,
      openEditModal,
      showDeleteModal,
      deleteTarget,
      openDeleteModal
    } = crud;
    const { isSubmitting, submitForm, isDeleting, submitDelete } = useCrudSubmit(crud, refresh);
    const showPasswordModal = vueExports.ref(false);
    const passwordTarget = vueExports.ref(null);
    const passwordApiErrors = vueExports.ref({});
    function openPasswordModal(item) {
      passwordTarget.value = item;
      passwordApiErrors.value = {};
      showPasswordModal.value = true;
    }
    function handleFormSubmit(formData) {
      const bankPayload = {
        bank_bin: formData.bank_bin || null,
        bank_label: formData.bank_label || null,
        bank_account_number: formData.bank_account_number || null,
        bank_account_name: formData.bank_account_name || null
      };
      const ratingPayload = {
        capability_rating: formData.capability_rating != null ? Number(formData.capability_rating) : null
      };
      submitForm(
        () => apiCreateAccount({
          email: formData.email,
          name: formData.name,
          employee_code: formData.employee_code,
          gender: formData.gender ?? null,
          department_ids: formData.department_ids,
          job_title_id: formData.job_title_id,
          role_id: formData.role_id,
          project_ids: formData.project_ids.length ? formData.project_ids : null,
          is_active: formData.is_active,
          password: formData.password || null,
          ...bankPayload,
          ...ratingPayload
        }),
        () => apiUpdateAccount(editTarget.value.id, {
          name: formData.name,
          gender: formData.gender ?? null,
          department_ids: formData.department_ids,
          job_title_id: formData.job_title_id,
          role_id: formData.role_id,
          project_ids: formData.project_ids.length ? formData.project_ids : null,
          is_active: formData.is_active,
          ...bankPayload,
          ...ratingPayload
        }),
        { create: "Tạo tài khoản thành công", update: "Cập nhật tài khoản thành công" }
      );
    }
    const toast = useToast();
    const isChangingPassword = vueExports.ref(false);
    async function handlePasswordSubmit(formData) {
      passwordApiErrors.value = {};
      if (!passwordTarget.value) return;
      isChangingPassword.value = true;
      try {
        await apiChangeAccountPassword(passwordTarget.value.id, formData);
        toast.add({ title: "Đổi mật khẩu thành công", color: "success" });
        showPasswordModal.value = false;
      } catch (err) {
        const errors = getApiValidationErrors(err);
        if (errors) {
          passwordApiErrors.value = errors;
        } else {
          toast.add({ title: getApiErrorMessage(err, "Đổi mật khẩu thất bại"), color: "error" });
        }
      } finally {
        isChangingPassword.value = false;
      }
    }
    function handleDelete() {
      submitDelete(
        () => apiDeleteAccount(deleteTarget.value.id),
        { message: "Xoá tài khoản thành công" }
      );
    }
    return (_ctx, _push, _parent, _attrs) => {
      const _component_SharedCrudPageHeader = __nuxt_component_0;
      const _component_UButton = _sfc_main$c;
      const _component_UInput = _sfc_main$2;
      const _component_SharedDepartmentSelect = __nuxt_component_3;
      const _component_SharedJobTitleSelect = __nuxt_component_4;
      const _component_SharedProjectSelect = __nuxt_component_3$1;
      const _component_SharedCrudTableWrapper = __nuxt_component_2;
      const _component_UTable = _sfc_main$3;
      const _component_UAvatar = _sfc_main$f;
      const _component_NuxtLink = __nuxt_component_0$4;
      const _component_UBadge = _sfc_main$4;
      const _component_SharedStatusBadge = __nuxt_component_7;
      const _component_SharedCapabilityRatingBadge = __nuxt_component_1;
      const _component_UTooltip = _sfc_main$5;
      const _component_SharedCrudTableActions = __nuxt_component_3$2;
      const _component_SharedCrudTablePagination = __nuxt_component_10;
      const _component_AccountFormModal = __nuxt_component_16;
      const _component_AccountChangePasswordModal = __nuxt_component_17;
      const _component_SharedCrudDeleteModal = __nuxt_component_11;
      _push(`<div${serverRenderer_cjs_prodExports.ssrRenderAttrs(_attrs)}>`);
      _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_SharedCrudPageHeader, {
        title: "Tài khoản",
        description: "Quản lý tài khoản nhân viên"
      }, {
        actions: vueExports.withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UButton, {
              icon: "i-lucide-plus",
              label: "Thêm tài khoản",
              onClick: vueExports.unref(openCreateModal)
            }, null, _parent2, _scopeId));
          } else {
            return [
              vueExports.createVNode(_component_UButton, {
                icon: "i-lucide-plus",
                label: "Thêm tài khoản",
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
        placeholder: "Tìm kiếm tên, email, mã NV...",
        class: "max-w-sm",
        autocomplete: "nope"
      }, null, _parent));
      _push(`<div class="w-48">`);
      _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_SharedDepartmentSelect, {
        modelValue: vueExports.unref(filterDepartmentId),
        "onUpdate:modelValue": ($event) => vueExports.isRef(filterDepartmentId) ? filterDepartmentId.value = $event : null,
        placeholder: "Tất cả phòng ban"
      }, null, _parent));
      _push(`</div><div class="w-48">`);
      _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_SharedJobTitleSelect, {
        modelValue: vueExports.unref(filterJobTitleId),
        "onUpdate:modelValue": ($event) => vueExports.isRef(filterJobTitleId) ? filterJobTitleId.value = $event : null,
        placeholder: "Tất cả chức danh"
      }, null, _parent));
      _push(`</div><div class="w-48">`);
      _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_SharedProjectSelect, {
        modelValue: vueExports.unref(filterProjectId),
        "onUpdate:modelValue": ($event) => vueExports.isRef(filterProjectId) ? filterProjectId.value = $event : null,
        placeholder: "Tất cả dự án"
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
            _push2(`<div class="bg-white border border-border-gray rounded-xl overflow-hidden shadow-sm"${_scopeId}>`);
            _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UTable, {
              data: vueExports.unref(accounts),
              columns
            }, {
              "avatar-cell": vueExports.withCtx(({ row }, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UAvatar, {
                    src: row.original.avatar_url ?? void 0,
                    alt: row.original.name,
                    size: "sm"
                  }, null, _parent3, _scopeId2));
                } else {
                  return [
                    vueExports.createVNode(_component_UAvatar, {
                      src: row.original.avatar_url ?? void 0,
                      alt: row.original.name,
                      size: "sm"
                    }, null, 8, ["src", "alt"])
                  ];
                }
              }),
              "gender-cell": vueExports.withCtx(({ row }, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(`${serverRenderer_cjs_prodExports.ssrInterpolate(row.original.gender?.label ?? "—")}`);
                } else {
                  return [
                    vueExports.createTextVNode(vueExports.toDisplayString(row.original.gender?.label ?? "—"), 1)
                  ];
                }
              }),
              "department-cell": vueExports.withCtx(({ row }, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  if (row.original.departments?.length) {
                    _push3(`<div class="flex flex-wrap gap-1"${_scopeId2}><!--[-->`);
                    serverRenderer_cjs_prodExports.ssrRenderList(row.original.departments, (dept) => {
                      _push3(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_NuxtLink, {
                        key: dept.id,
                        to: `/pmc/departments/${dept.id}`
                      }, {
                        default: vueExports.withCtx((_2, _push4, _parent4, _scopeId3) => {
                          if (_push4) {
                            _push4(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UBadge, {
                              label: dept.name,
                              color: "neutral",
                              variant: "subtle",
                              size: "sm",
                              class: "cursor-pointer hover:opacity-80"
                            }, null, _parent4, _scopeId3));
                          } else {
                            return [
                              vueExports.createVNode(_component_UBadge, {
                                label: dept.name,
                                color: "neutral",
                                variant: "subtle",
                                size: "sm",
                                class: "cursor-pointer hover:opacity-80"
                              }, null, 8, ["label"])
                            ];
                          }
                        }),
                        _: 2
                      }, _parent3, _scopeId2));
                    });
                    _push3(`<!--]--></div>`);
                  } else {
                    _push3(`<span class="text-(--ui-text-muted)"${_scopeId2}>—</span>`);
                  }
                } else {
                  return [
                    row.original.departments?.length ? (vueExports.openBlock(), vueExports.createBlock("div", {
                      key: 0,
                      class: "flex flex-wrap gap-1"
                    }, [
                      (vueExports.openBlock(true), vueExports.createBlock(vueExports.Fragment, null, vueExports.renderList(row.original.departments, (dept) => {
                        return vueExports.openBlock(), vueExports.createBlock(_component_NuxtLink, {
                          key: dept.id,
                          to: `/pmc/departments/${dept.id}`
                        }, {
                          default: vueExports.withCtx(() => [
                            vueExports.createVNode(_component_UBadge, {
                              label: dept.name,
                              color: "neutral",
                              variant: "subtle",
                              size: "sm",
                              class: "cursor-pointer hover:opacity-80"
                            }, null, 8, ["label"])
                          ]),
                          _: 2
                        }, 1032, ["to"]);
                      }), 128))
                    ])) : (vueExports.openBlock(), vueExports.createBlock("span", {
                      key: 1,
                      class: "text-(--ui-text-muted)"
                    }, "—"))
                  ];
                }
              }),
              "job_title-cell": vueExports.withCtx(({ row }, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  if (row.original.job_title) {
                    _push3(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_NuxtLink, {
                      to: `/pmc/job-titles/${row.original.job_title.id}`,
                      class: "text-blue-600 hover:text-blue-800 hover:underline"
                    }, {
                      default: vueExports.withCtx((_2, _push4, _parent4, _scopeId3) => {
                        if (_push4) {
                          _push4(`${serverRenderer_cjs_prodExports.ssrInterpolate(row.original.job_title.name)}`);
                        } else {
                          return [
                            vueExports.createTextVNode(vueExports.toDisplayString(row.original.job_title.name), 1)
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
                    row.original.job_title ? (vueExports.openBlock(), vueExports.createBlock(_component_NuxtLink, {
                      key: 0,
                      to: `/pmc/job-titles/${row.original.job_title.id}`,
                      class: "text-blue-600 hover:text-blue-800 hover:underline"
                    }, {
                      default: vueExports.withCtx(() => [
                        vueExports.createTextVNode(vueExports.toDisplayString(row.original.job_title.name), 1)
                      ]),
                      _: 2
                    }, 1032, ["to"])) : (vueExports.openBlock(), vueExports.createBlock("span", { key: 1 }, "—"))
                  ];
                }
              }),
              "role-cell": vueExports.withCtx(({ row }, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  if (row.original.role) {
                    _push3(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_NuxtLink, {
                      to: `/pmc/roles/${row.original.role.id}`,
                      class: "text-blue-600 hover:text-blue-800 hover:underline"
                    }, {
                      default: vueExports.withCtx((_2, _push4, _parent4, _scopeId3) => {
                        if (_push4) {
                          _push4(`${serverRenderer_cjs_prodExports.ssrInterpolate(row.original.role.name)}`);
                        } else {
                          return [
                            vueExports.createTextVNode(vueExports.toDisplayString(row.original.role.name), 1)
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
                    row.original.role ? (vueExports.openBlock(), vueExports.createBlock(_component_NuxtLink, {
                      key: 0,
                      to: `/pmc/roles/${row.original.role.id}`,
                      class: "text-blue-600 hover:text-blue-800 hover:underline"
                    }, {
                      default: vueExports.withCtx(() => [
                        vueExports.createTextVNode(vueExports.toDisplayString(row.original.role.name), 1)
                      ]),
                      _: 2
                    }, 1032, ["to"])) : (vueExports.openBlock(), vueExports.createBlock("span", { key: 1 }, "—"))
                  ];
                }
              }),
              "is_active-cell": vueExports.withCtx(({ row }, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_SharedStatusBadge, {
                    active: Boolean(row.original.is_active)
                  }, null, _parent3, _scopeId2));
                } else {
                  return [
                    vueExports.createVNode(_component_SharedStatusBadge, {
                      active: Boolean(row.original.is_active)
                    }, null, 8, ["active"])
                  ];
                }
              }),
              "capability_rating-cell": vueExports.withCtx(({ row }, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_SharedCapabilityRatingBadge, {
                    rating: row.original.capability_rating,
                    "show-when-null": "",
                    "null-label": "—"
                  }, null, _parent3, _scopeId2));
                } else {
                  return [
                    vueExports.createVNode(_component_SharedCapabilityRatingBadge, {
                      rating: row.original.capability_rating,
                      "show-when-null": "",
                      "null-label": "—"
                    }, null, 8, ["rating"])
                  ];
                }
              }),
              "assignment_status-cell": vueExports.withCtx(({ row }, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  if (row.original.has_active_assignment) {
                    _push3(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UTooltip, {
                      text: `Đang xử lý ${row.original.active_assignment_count} ticket chưa hoàn thành`
                    }, {
                      default: vueExports.withCtx((_2, _push4, _parent4, _scopeId3) => {
                        if (_push4) {
                          _push4(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UBadge, {
                            label: `Đang xử lý (${row.original.active_assignment_count})`,
                            color: "warning",
                            variant: "subtle",
                            size: "sm",
                            icon: "i-lucide-loader-circle"
                          }, null, _parent4, _scopeId3));
                        } else {
                          return [
                            vueExports.createVNode(_component_UBadge, {
                              label: `Đang xử lý (${row.original.active_assignment_count})`,
                              color: "warning",
                              variant: "subtle",
                              size: "sm",
                              icon: "i-lucide-loader-circle"
                            }, null, 8, ["label"])
                          ];
                        }
                      }),
                      _: 2
                    }, _parent3, _scopeId2));
                  } else {
                    _push3(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UBadge, {
                      label: "Rảnh",
                      color: "neutral",
                      variant: "subtle",
                      size: "sm"
                    }, null, _parent3, _scopeId2));
                  }
                } else {
                  return [
                    row.original.has_active_assignment ? (vueExports.openBlock(), vueExports.createBlock(_component_UTooltip, {
                      key: 0,
                      text: `Đang xử lý ${row.original.active_assignment_count} ticket chưa hoàn thành`
                    }, {
                      default: vueExports.withCtx(() => [
                        vueExports.createVNode(_component_UBadge, {
                          label: `Đang xử lý (${row.original.active_assignment_count})`,
                          color: "warning",
                          variant: "subtle",
                          size: "sm",
                          icon: "i-lucide-loader-circle"
                        }, null, 8, ["label"])
                      ]),
                      _: 2
                    }, 1032, ["text"])) : (vueExports.openBlock(), vueExports.createBlock(_component_UBadge, {
                      key: 1,
                      label: "Rảnh",
                      color: "neutral",
                      variant: "subtle",
                      size: "sm"
                    }))
                  ];
                }
              }),
              "projects-cell": vueExports.withCtx(({ row }, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  if (row.original.projects?.length) {
                    _push3(`<div class="flex flex-wrap gap-1"${_scopeId2}><!--[-->`);
                    serverRenderer_cjs_prodExports.ssrRenderList(row.original.projects, (project) => {
                      _push3(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_NuxtLink, {
                        key: project.id,
                        to: `/pmc/projects/${project.id}`
                      }, {
                        default: vueExports.withCtx((_2, _push4, _parent4, _scopeId3) => {
                          if (_push4) {
                            _push4(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UBadge, {
                              label: project.name,
                              color: "primary",
                              variant: "subtle",
                              size: "sm",
                              class: "cursor-pointer hover:opacity-80"
                            }, null, _parent4, _scopeId3));
                          } else {
                            return [
                              vueExports.createVNode(_component_UBadge, {
                                label: project.name,
                                color: "primary",
                                variant: "subtle",
                                size: "sm",
                                class: "cursor-pointer hover:opacity-80"
                              }, null, 8, ["label"])
                            ];
                          }
                        }),
                        _: 2
                      }, _parent3, _scopeId2));
                    });
                    _push3(`<!--]--></div>`);
                  } else {
                    _push3(`<span class="text-(--ui-text-muted)"${_scopeId2}>—</span>`);
                  }
                } else {
                  return [
                    row.original.projects?.length ? (vueExports.openBlock(), vueExports.createBlock("div", {
                      key: 0,
                      class: "flex flex-wrap gap-1"
                    }, [
                      (vueExports.openBlock(true), vueExports.createBlock(vueExports.Fragment, null, vueExports.renderList(row.original.projects, (project) => {
                        return vueExports.openBlock(), vueExports.createBlock(_component_NuxtLink, {
                          key: project.id,
                          to: `/pmc/projects/${project.id}`
                        }, {
                          default: vueExports.withCtx(() => [
                            vueExports.createVNode(_component_UBadge, {
                              label: project.name,
                              color: "primary",
                              variant: "subtle",
                              size: "sm",
                              class: "cursor-pointer hover:opacity-80"
                            }, null, 8, ["label"])
                          ]),
                          _: 2
                        }, 1032, ["to"]);
                      }), 128))
                    ])) : (vueExports.openBlock(), vueExports.createBlock("span", {
                      key: 1,
                      class: "text-(--ui-text-muted)"
                    }, "—"))
                  ];
                }
              }),
              "actions-cell": vueExports.withCtx(({ row }, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_SharedCrudTableActions, {
                    "detail-to": `/pmc/accounts/${row.original.id}`,
                    onEdit: ($event) => vueExports.unref(openEditModal)(row.original),
                    onDelete: ($event) => vueExports.unref(openDeleteModal)(row.original)
                  }, {
                    extra: vueExports.withCtx((_2, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UButton, {
                          icon: "i-lucide-key-round",
                          color: "neutral",
                          variant: "ghost",
                          size: "sm",
                          title: "Đổi mật khẩu",
                          onClick: ($event) => openPasswordModal(row.original)
                        }, null, _parent4, _scopeId3));
                      } else {
                        return [
                          vueExports.createVNode(_component_UButton, {
                            icon: "i-lucide-key-round",
                            color: "neutral",
                            variant: "ghost",
                            size: "sm",
                            title: "Đổi mật khẩu",
                            onClick: ($event) => openPasswordModal(row.original)
                          }, null, 8, ["onClick"])
                        ];
                      }
                    }),
                    _: 2
                  }, _parent3, _scopeId2));
                } else {
                  return [
                    vueExports.createVNode(_component_SharedCrudTableActions, {
                      "detail-to": `/pmc/accounts/${row.original.id}`,
                      onEdit: ($event) => vueExports.unref(openEditModal)(row.original),
                      onDelete: ($event) => vueExports.unref(openDeleteModal)(row.original)
                    }, {
                      extra: vueExports.withCtx(() => [
                        vueExports.createVNode(_component_UButton, {
                          icon: "i-lucide-key-round",
                          color: "neutral",
                          variant: "ghost",
                          size: "sm",
                          title: "Đổi mật khẩu",
                          onClick: ($event) => openPasswordModal(row.original)
                        }, null, 8, ["onClick"])
                      ]),
                      _: 2
                    }, 1032, ["detail-to", "onEdit", "onDelete"])
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
                  data: vueExports.unref(accounts),
                  columns
                }, {
                  "avatar-cell": vueExports.withCtx(({ row }) => [
                    vueExports.createVNode(_component_UAvatar, {
                      src: row.original.avatar_url ?? void 0,
                      alt: row.original.name,
                      size: "sm"
                    }, null, 8, ["src", "alt"])
                  ]),
                  "gender-cell": vueExports.withCtx(({ row }) => [
                    vueExports.createTextVNode(vueExports.toDisplayString(row.original.gender?.label ?? "—"), 1)
                  ]),
                  "department-cell": vueExports.withCtx(({ row }) => [
                    row.original.departments?.length ? (vueExports.openBlock(), vueExports.createBlock("div", {
                      key: 0,
                      class: "flex flex-wrap gap-1"
                    }, [
                      (vueExports.openBlock(true), vueExports.createBlock(vueExports.Fragment, null, vueExports.renderList(row.original.departments, (dept) => {
                        return vueExports.openBlock(), vueExports.createBlock(_component_NuxtLink, {
                          key: dept.id,
                          to: `/pmc/departments/${dept.id}`
                        }, {
                          default: vueExports.withCtx(() => [
                            vueExports.createVNode(_component_UBadge, {
                              label: dept.name,
                              color: "neutral",
                              variant: "subtle",
                              size: "sm",
                              class: "cursor-pointer hover:opacity-80"
                            }, null, 8, ["label"])
                          ]),
                          _: 2
                        }, 1032, ["to"]);
                      }), 128))
                    ])) : (vueExports.openBlock(), vueExports.createBlock("span", {
                      key: 1,
                      class: "text-(--ui-text-muted)"
                    }, "—"))
                  ]),
                  "job_title-cell": vueExports.withCtx(({ row }) => [
                    row.original.job_title ? (vueExports.openBlock(), vueExports.createBlock(_component_NuxtLink, {
                      key: 0,
                      to: `/pmc/job-titles/${row.original.job_title.id}`,
                      class: "text-blue-600 hover:text-blue-800 hover:underline"
                    }, {
                      default: vueExports.withCtx(() => [
                        vueExports.createTextVNode(vueExports.toDisplayString(row.original.job_title.name), 1)
                      ]),
                      _: 2
                    }, 1032, ["to"])) : (vueExports.openBlock(), vueExports.createBlock("span", { key: 1 }, "—"))
                  ]),
                  "role-cell": vueExports.withCtx(({ row }) => [
                    row.original.role ? (vueExports.openBlock(), vueExports.createBlock(_component_NuxtLink, {
                      key: 0,
                      to: `/pmc/roles/${row.original.role.id}`,
                      class: "text-blue-600 hover:text-blue-800 hover:underline"
                    }, {
                      default: vueExports.withCtx(() => [
                        vueExports.createTextVNode(vueExports.toDisplayString(row.original.role.name), 1)
                      ]),
                      _: 2
                    }, 1032, ["to"])) : (vueExports.openBlock(), vueExports.createBlock("span", { key: 1 }, "—"))
                  ]),
                  "is_active-cell": vueExports.withCtx(({ row }) => [
                    vueExports.createVNode(_component_SharedStatusBadge, {
                      active: Boolean(row.original.is_active)
                    }, null, 8, ["active"])
                  ]),
                  "capability_rating-cell": vueExports.withCtx(({ row }) => [
                    vueExports.createVNode(_component_SharedCapabilityRatingBadge, {
                      rating: row.original.capability_rating,
                      "show-when-null": "",
                      "null-label": "—"
                    }, null, 8, ["rating"])
                  ]),
                  "assignment_status-cell": vueExports.withCtx(({ row }) => [
                    row.original.has_active_assignment ? (vueExports.openBlock(), vueExports.createBlock(_component_UTooltip, {
                      key: 0,
                      text: `Đang xử lý ${row.original.active_assignment_count} ticket chưa hoàn thành`
                    }, {
                      default: vueExports.withCtx(() => [
                        vueExports.createVNode(_component_UBadge, {
                          label: `Đang xử lý (${row.original.active_assignment_count})`,
                          color: "warning",
                          variant: "subtle",
                          size: "sm",
                          icon: "i-lucide-loader-circle"
                        }, null, 8, ["label"])
                      ]),
                      _: 2
                    }, 1032, ["text"])) : (vueExports.openBlock(), vueExports.createBlock(_component_UBadge, {
                      key: 1,
                      label: "Rảnh",
                      color: "neutral",
                      variant: "subtle",
                      size: "sm"
                    }))
                  ]),
                  "projects-cell": vueExports.withCtx(({ row }) => [
                    row.original.projects?.length ? (vueExports.openBlock(), vueExports.createBlock("div", {
                      key: 0,
                      class: "flex flex-wrap gap-1"
                    }, [
                      (vueExports.openBlock(true), vueExports.createBlock(vueExports.Fragment, null, vueExports.renderList(row.original.projects, (project) => {
                        return vueExports.openBlock(), vueExports.createBlock(_component_NuxtLink, {
                          key: project.id,
                          to: `/pmc/projects/${project.id}`
                        }, {
                          default: vueExports.withCtx(() => [
                            vueExports.createVNode(_component_UBadge, {
                              label: project.name,
                              color: "primary",
                              variant: "subtle",
                              size: "sm",
                              class: "cursor-pointer hover:opacity-80"
                            }, null, 8, ["label"])
                          ]),
                          _: 2
                        }, 1032, ["to"]);
                      }), 128))
                    ])) : (vueExports.openBlock(), vueExports.createBlock("span", {
                      key: 1,
                      class: "text-(--ui-text-muted)"
                    }, "—"))
                  ]),
                  "actions-cell": vueExports.withCtx(({ row }) => [
                    vueExports.createVNode(_component_SharedCrudTableActions, {
                      "detail-to": `/pmc/accounts/${row.original.id}`,
                      onEdit: ($event) => vueExports.unref(openEditModal)(row.original),
                      onDelete: ($event) => vueExports.unref(openDeleteModal)(row.original)
                    }, {
                      extra: vueExports.withCtx(() => [
                        vueExports.createVNode(_component_UButton, {
                          icon: "i-lucide-key-round",
                          color: "neutral",
                          variant: "ghost",
                          size: "sm",
                          title: "Đổi mật khẩu",
                          onClick: ($event) => openPasswordModal(row.original)
                        }, null, 8, ["onClick"])
                      ]),
                      _: 2
                    }, 1032, ["detail-to", "onEdit", "onDelete"])
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
      _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_AccountFormModal, {
        open: vueExports.unref(showFormModal),
        "onUpdate:open": ($event) => vueExports.isRef(showFormModal) ? showFormModal.value = $event : null,
        mode: vueExports.unref(formMode),
        item: vueExports.unref(editTarget),
        loading: vueExports.unref(isSubmitting),
        "api-errors": vueExports.unref(formApiErrors),
        onSubmit: handleFormSubmit,
        onAvatarChanged: ($event) => vueExports.unref(refresh)()
      }, null, _parent));
      _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_AccountChangePasswordModal, {
        open: vueExports.unref(showPasswordModal),
        "onUpdate:open": ($event) => vueExports.isRef(showPasswordModal) ? showPasswordModal.value = $event : null,
        item: vueExports.unref(passwordTarget),
        loading: vueExports.unref(isChangingPassword),
        "api-errors": vueExports.unref(passwordApiErrors),
        onSubmit: handlePasswordSubmit
      }, null, _parent));
      _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_SharedCrudDeleteModal, {
        open: vueExports.unref(showDeleteModal),
        "onUpdate:open": ($event) => vueExports.isRef(showDeleteModal) ? showDeleteModal.value = $event : null,
        title: "Xoá tài khoản",
        "item-name": vueExports.unref(deleteTarget)?.name,
        loading: vueExports.unref(isDeleting),
        onConfirm: handleDelete
      }, null, _parent));
      _push(`</div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = vueExports.useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/pmc/accounts/index.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=index-BcufZGDy.mjs.map
