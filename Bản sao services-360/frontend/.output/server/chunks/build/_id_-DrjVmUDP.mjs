import { _ as _sfc_main$2 } from './Skeleton-CKN2C2Mt.mjs';
import { _ as __nuxt_component_2 } from './PageError-kZWsA9dh.mjs';
import { v as vueExports, p as useRoute$1, j as useToast, s as serverRenderer_cjs_prodExports, l as _sfc_main$c, q as navigateTo, _ as __nuxt_component_0$4 } from './server.mjs';
import { _ as __nuxt_component_5 } from './FieldDisplay-BM6nmr2i.mjs';
import { _ as _sfc_main$3 } from './Badge-W93D3Jpz.mjs';
import { _ as _sfc_main$4 } from './Table-17SH0cIR.mjs';
import { _ as _sfc_main$5 } from './Alert-tTsPKADX.mjs';
import { _ as __nuxt_component_3 } from './TableActions-b69bU2gG.mjs';
import { _ as _sfc_main$6 } from './FormField-DFdmv6Lu.mjs';
import { u as useTeamSchedule, _ as __nuxt_component_4, a as __nuxt_component_11 } from './SlotDetailDrawer-LTINo05F.mjs';
import { _ as __nuxt_component_10, a as __nuxt_component_5$1 } from './AccountMultiSelect-C48Ujkod.mjs';
import { _ as __nuxt_component_9 } from './ProjectFormModal-DmXkzlFJ.mjs';
import { _ as _sfc_main$7 } from './Modal-BimZZbNl.mjs';
import { _ as _sfc_main$8 } from './SelectMenu-DKHEMZj7.mjs';
import { _ as _sfc_main$9 } from './Input-JXN8po_F.mjs';
import { V as VIETNAM_BANKS, f as findBankByBin } from './vietqr-D50vgfgj.mjs';
import { u as useProjectDetail, a as apiUpdateProject, b as apiDeleteProject, c as apiSyncProjectMembers } from './useProjects-D4K3VYdb.mjs';
import { g as getApiErrorMessage } from './apiError-DBrxF9au.mjs';
import { _ as __nuxt_component_11$1 } from './DeleteModal-B4AevDGU.mjs';
import { _ as __nuxt_component_10$1 } from './DepartmentFormModal-LJgYT5QE.mjs';
import { u as useBreadcrumb } from './useBreadcrumb-zkNa_uJG.mjs';
import { u as useCrudModals } from './useCrudModals-BUUQWYeI.mjs';
import { u as useCrudSubmit } from './useCrudSubmit-gMGxLTGY.mjs';
import { S as SELECT_ALL_PER_PAGE } from './constants-G9YmtWtp.mjs';
import { u as useDepartmentList, a as apiCreateDepartment, b as apiUpdateDepartment, c as apiDeleteDepartment } from './useDepartments-C8BvGnCs.mjs';
import { s as stickyRight } from './table-z_7x7CvB.mjs';
import { c as currentYearMonth } from './date-R5YK0ast.mjs';
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
import './index-QmZAbLx-.mjs';
import './Label-BBgw4vHh.mjs';
import './useOgTickets-DPRh9tlL.mjs';
import './Slideover-C_jHRSNJ.mjs';
import './DialogTrigger-C3iwCYMu.mjs';
import './FocusScope-BZehoQSg.mjs';
import './utils-DY0Zag2O.mjs';
import './DialogClose-DGkUxau7.mjs';
import './SectionCard-CH-mG9Mf.mjs';
import './CapabilityRatingBadge-BBWBj9qN.mjs';
import './useEntitySelect-DG9pQ_n0.mjs';
import './useAccounts-BDWM8ZpB.mjs';
import './BaseFormModal-CG7aCaIV.mjs';
import './FormFieldError-cu7WK1i1.mjs';
import './Select-CZE7Ef6n.mjs';
import './useDirection-CXYby7CP.mjs';
import './useFormControl-_Lqv8ipK.mjs';
import './PopperArrow-C9hHWuSZ.mjs';
import './useFocusGuards-CJykkUFH.mjs';
import './handleAndDispatchCustomEvent-Bk_AVSSo.mjs';
import './useKbd-JjFOu4f7.mjs';
import './utils-BgcT7rQQ.mjs';
import './VisuallyHiddenInput-q6Pz-w0i.mjs';
import './ProjectSelect-BTBiFCd5.mjs';
import './Textarea-DTCNHwKm.mjs';

const _sfc_main$1 = /* @__PURE__ */ vueExports.defineComponent({
  __name: "ProjectBqtBankModal",
  __ssrInlineRender: true,
  props: {
    open: { type: Boolean },
    projectId: {},
    initial: {}
  },
  emits: ["update:open", "saved"],
  setup(__props, { emit: __emit }) {
    const props = __props;
    const emit = __emit;
    const toast = useToast();
    const form = vueExports.reactive({
      bqt_bank_bin: "",
      bqt_account_number: "",
      bqt_account_holder: ""
    });
    const isSaving = vueExports.ref(false);
    vueExports.watch(
      () => props.open,
      (isOpen) => {
        if (!isOpen) return;
        form.bqt_bank_bin = props.initial?.bqt_bank_bin ?? "";
        form.bqt_account_number = props.initial?.bqt_account_number ?? "";
        form.bqt_account_holder = props.initial?.bqt_account_holder ?? "";
      }
    );
    const bankOptions = vueExports.computed(
      () => VIETNAM_BANKS.map((b) => ({
        label: `${b.shortName} — ${b.name}`,
        value: b.bin
      }))
    );
    const validationErrors = vueExports.computed(() => {
      const errors = [];
      const bin = form.bqt_bank_bin.trim();
      const num = form.bqt_account_number.trim();
      const holder = form.bqt_account_holder.trim();
      const anyFilled = !!bin || !!num || !!holder;
      const allFilled = !!bin && !!num && !!holder;
      if (anyFilled && !allFilled) {
        errors.push("Vui lòng điền đủ Ngân hàng + Số tài khoản + Tên chủ tài khoản, hoặc xoá trống cả ba.");
      }
      if (num && !/^\d+$/.test(num)) errors.push("Số tài khoản chỉ được chứa chữ số.");
      if (bin && !/^\d{6}$/.test(bin)) errors.push("Mã BIN ngân hàng không hợp lệ.");
      return errors;
    });
    async function handleSave() {
      if (validationErrors.value.length > 0) return;
      isSaving.value = true;
      try {
        const bin = form.bqt_bank_bin.trim();
        const bank = bin ? findBankByBin(bin) : null;
        await apiUpdateProject(props.projectId, {
          bqt_bank_bin: bin || null,
          bqt_bank_name: bank?.shortName ?? null,
          bqt_account_number: form.bqt_account_number.trim() || null,
          bqt_account_holder: form.bqt_account_holder.trim() || null
        });
        toast.add({ title: "Đã lưu tài khoản BQT", color: "success" });
        emit("saved");
        emit("update:open", false);
      } catch (err) {
        toast.add({ title: getApiErrorMessage(err, "Lưu thất bại"), color: "error" });
      } finally {
        isSaving.value = false;
      }
    }
    function handleClear() {
      form.bqt_bank_bin = "";
      form.bqt_account_number = "";
      form.bqt_account_holder = "";
    }
    return (_ctx, _push, _parent, _attrs) => {
      const _component_UModal = _sfc_main$7;
      const _component_UAlert = _sfc_main$5;
      const _component_UFormField = _sfc_main$6;
      const _component_USelectMenu = _sfc_main$8;
      const _component_UInput = _sfc_main$9;
      const _component_UButton = _sfc_main$c;
      _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UModal, vueExports.mergeProps({
        open: __props.open,
        title: "Cài đặt tài khoản Ban quản trị",
        ui: { content: "sm:max-w-lg" },
        "onUpdate:open": ($event) => emit("update:open", $event)
      }, _attrs), {
        body: vueExports.withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="flex flex-col gap-4"${_scopeId}>`);
            _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UAlert, {
              color: "info",
              variant: "subtle",
              icon: "i-lucide-info",
              description: "Thông tin STK này dùng để in QR chuyển khoản hoa hồng BQT trên trang Tổng hợp hoa hồng."
            }, null, _parent2, _scopeId));
            if (vueExports.unref(validationErrors).length > 0) {
              _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UAlert, {
                color: "error",
                variant: "subtle",
                icon: "i-lucide-alert-triangle",
                title: "Lỗi cấu hình"
              }, {
                description: vueExports.withCtx((_2, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    _push3(`<ul class="list-disc pl-4 text-sm space-y-0.5"${_scopeId2}><!--[-->`);
                    serverRenderer_cjs_prodExports.ssrRenderList(vueExports.unref(validationErrors), (e, i) => {
                      _push3(`<li${_scopeId2}>${serverRenderer_cjs_prodExports.ssrInterpolate(e)}</li>`);
                    });
                    _push3(`<!--]--></ul>`);
                  } else {
                    return [
                      vueExports.createVNode("ul", { class: "list-disc pl-4 text-sm space-y-0.5" }, [
                        (vueExports.openBlock(true), vueExports.createBlock(vueExports.Fragment, null, vueExports.renderList(vueExports.unref(validationErrors), (e, i) => {
                          return vueExports.openBlock(), vueExports.createBlock("li", { key: i }, vueExports.toDisplayString(e), 1);
                        }), 128))
                      ])
                    ];
                  }
                }),
                _: 1
              }, _parent2, _scopeId));
            } else {
              _push2(`<!---->`);
            }
            _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UFormField, {
              label: "Ngân hàng",
              name: "bqt_bank_bin"
            }, {
              default: vueExports.withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_USelectMenu, {
                    modelValue: vueExports.unref(form).bqt_bank_bin,
                    "onUpdate:modelValue": ($event) => vueExports.unref(form).bqt_bank_bin = $event,
                    items: vueExports.unref(bankOptions),
                    "value-key": "value",
                    placeholder: "Chọn ngân hàng",
                    "search-input": { placeholder: "Tìm theo tên ngân hàng..." },
                    class: "w-full"
                  }, null, _parent3, _scopeId2));
                } else {
                  return [
                    vueExports.createVNode(_component_USelectMenu, {
                      modelValue: vueExports.unref(form).bqt_bank_bin,
                      "onUpdate:modelValue": ($event) => vueExports.unref(form).bqt_bank_bin = $event,
                      items: vueExports.unref(bankOptions),
                      "value-key": "value",
                      placeholder: "Chọn ngân hàng",
                      "search-input": { placeholder: "Tìm theo tên ngân hàng..." },
                      class: "w-full"
                    }, null, 8, ["modelValue", "onUpdate:modelValue", "items"])
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UFormField, {
              label: "Số tài khoản",
              name: "bqt_account_number"
            }, {
              default: vueExports.withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UInput, {
                    modelValue: vueExports.unref(form).bqt_account_number,
                    "onUpdate:modelValue": ($event) => vueExports.unref(form).bqt_account_number = $event,
                    placeholder: "Nhập số tài khoản",
                    maxlength: 30,
                    class: "w-full"
                  }, null, _parent3, _scopeId2));
                } else {
                  return [
                    vueExports.createVNode(_component_UInput, {
                      modelValue: vueExports.unref(form).bqt_account_number,
                      "onUpdate:modelValue": ($event) => vueExports.unref(form).bqt_account_number = $event,
                      placeholder: "Nhập số tài khoản",
                      maxlength: 30,
                      class: "w-full"
                    }, null, 8, ["modelValue", "onUpdate:modelValue"])
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UFormField, {
              label: "Tên chủ tài khoản",
              name: "bqt_account_holder",
              hint: "Viết hoa không dấu (sẽ hiển thị trên app ngân hàng của người chuyển)"
            }, {
              default: vueExports.withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UInput, {
                    modelValue: vueExports.unref(form).bqt_account_holder,
                    "onUpdate:modelValue": ($event) => vueExports.unref(form).bqt_account_holder = $event,
                    placeholder: "VD: BAN QUAN TRI CHUNG CU X",
                    maxlength: 100,
                    class: "w-full"
                  }, null, _parent3, _scopeId2));
                } else {
                  return [
                    vueExports.createVNode(_component_UInput, {
                      modelValue: vueExports.unref(form).bqt_account_holder,
                      "onUpdate:modelValue": ($event) => vueExports.unref(form).bqt_account_holder = $event,
                      placeholder: "VD: BAN QUAN TRI CHUNG CU X",
                      maxlength: 100,
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
                vueExports.createVNode(_component_UAlert, {
                  color: "info",
                  variant: "subtle",
                  icon: "i-lucide-info",
                  description: "Thông tin STK này dùng để in QR chuyển khoản hoa hồng BQT trên trang Tổng hợp hoa hồng."
                }),
                vueExports.unref(validationErrors).length > 0 ? (vueExports.openBlock(), vueExports.createBlock(_component_UAlert, {
                  key: 0,
                  color: "error",
                  variant: "subtle",
                  icon: "i-lucide-alert-triangle",
                  title: "Lỗi cấu hình"
                }, {
                  description: vueExports.withCtx(() => [
                    vueExports.createVNode("ul", { class: "list-disc pl-4 text-sm space-y-0.5" }, [
                      (vueExports.openBlock(true), vueExports.createBlock(vueExports.Fragment, null, vueExports.renderList(vueExports.unref(validationErrors), (e, i) => {
                        return vueExports.openBlock(), vueExports.createBlock("li", { key: i }, vueExports.toDisplayString(e), 1);
                      }), 128))
                    ])
                  ]),
                  _: 1
                })) : vueExports.createCommentVNode("", true),
                vueExports.createVNode(_component_UFormField, {
                  label: "Ngân hàng",
                  name: "bqt_bank_bin"
                }, {
                  default: vueExports.withCtx(() => [
                    vueExports.createVNode(_component_USelectMenu, {
                      modelValue: vueExports.unref(form).bqt_bank_bin,
                      "onUpdate:modelValue": ($event) => vueExports.unref(form).bqt_bank_bin = $event,
                      items: vueExports.unref(bankOptions),
                      "value-key": "value",
                      placeholder: "Chọn ngân hàng",
                      "search-input": { placeholder: "Tìm theo tên ngân hàng..." },
                      class: "w-full"
                    }, null, 8, ["modelValue", "onUpdate:modelValue", "items"])
                  ]),
                  _: 1
                }),
                vueExports.createVNode(_component_UFormField, {
                  label: "Số tài khoản",
                  name: "bqt_account_number"
                }, {
                  default: vueExports.withCtx(() => [
                    vueExports.createVNode(_component_UInput, {
                      modelValue: vueExports.unref(form).bqt_account_number,
                      "onUpdate:modelValue": ($event) => vueExports.unref(form).bqt_account_number = $event,
                      placeholder: "Nhập số tài khoản",
                      maxlength: 30,
                      class: "w-full"
                    }, null, 8, ["modelValue", "onUpdate:modelValue"])
                  ]),
                  _: 1
                }),
                vueExports.createVNode(_component_UFormField, {
                  label: "Tên chủ tài khoản",
                  name: "bqt_account_holder",
                  hint: "Viết hoa không dấu (sẽ hiển thị trên app ngân hàng của người chuyển)"
                }, {
                  default: vueExports.withCtx(() => [
                    vueExports.createVNode(_component_UInput, {
                      modelValue: vueExports.unref(form).bqt_account_holder,
                      "onUpdate:modelValue": ($event) => vueExports.unref(form).bqt_account_holder = $event,
                      placeholder: "VD: BAN QUAN TRI CHUNG CU X",
                      maxlength: 100,
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
            _push2(`<div class="flex justify-between w-full"${_scopeId}>`);
            _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UButton, {
              label: "Xoá thông tin",
              color: "error",
              variant: "ghost",
              icon: "i-lucide-eraser",
              onClick: handleClear
            }, null, _parent2, _scopeId));
            _push2(`<div class="flex gap-2"${_scopeId}>`);
            _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UButton, {
              label: "Huỷ",
              color: "neutral",
              variant: "outline",
              onClick: ($event) => emit("update:open", false)
            }, null, _parent2, _scopeId));
            _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UButton, {
              label: "Lưu",
              icon: "i-lucide-save",
              loading: vueExports.unref(isSaving),
              disabled: vueExports.unref(validationErrors).length > 0,
              onClick: handleSave
            }, null, _parent2, _scopeId));
            _push2(`</div></div>`);
          } else {
            return [
              vueExports.createVNode("div", { class: "flex justify-between w-full" }, [
                vueExports.createVNode(_component_UButton, {
                  label: "Xoá thông tin",
                  color: "error",
                  variant: "ghost",
                  icon: "i-lucide-eraser",
                  onClick: handleClear
                }),
                vueExports.createVNode("div", { class: "flex gap-2" }, [
                  vueExports.createVNode(_component_UButton, {
                    label: "Huỷ",
                    color: "neutral",
                    variant: "outline",
                    onClick: ($event) => emit("update:open", false)
                  }, null, 8, ["onClick"]),
                  vueExports.createVNode(_component_UButton, {
                    label: "Lưu",
                    icon: "i-lucide-save",
                    loading: vueExports.unref(isSaving),
                    disabled: vueExports.unref(validationErrors).length > 0,
                    onClick: handleSave
                  }, null, 8, ["loading", "disabled"])
                ])
              ])
            ];
          }
        }),
        _: 1
      }, _parent));
    };
  }
});
const _sfc_setup$1 = _sfc_main$1.setup;
_sfc_main$1.setup = (props, ctx) => {
  const ssrContext = vueExports.useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/project/ProjectBqtBankModal.vue");
  return _sfc_setup$1 ? _sfc_setup$1(props, ctx) : void 0;
};
const __nuxt_component_14 = Object.assign(_sfc_main$1, { __name: "ProjectBqtBankModal" });
const _sfc_main = /* @__PURE__ */ vueExports.defineComponent({
  __name: "[id]",
  __ssrInlineRender: true,
  setup(__props) {
    const route = useRoute$1();
    const id = vueExports.computed(() => Number(route.params.id));
    const toast = useToast();
    const { data, status, error, refresh } = useProjectDetail(id);
    const { useDynamicLabel } = useBreadcrumb();
    useDynamicLabel(vueExports.computed(() => data.value?.data?.name ?? null));
    const project = vueExports.computed(() => data.value?.data ?? null);
    const accounts = vueExports.computed(() => project.value?.accounts ?? []);
    const accountColumns = [
      { accessorKey: "employee_code", header: "Mã NV" },
      { accessorKey: "full_name", header: "Họ tên" },
      { accessorKey: "email", header: "Email" },
      { id: "department", header: "Phòng ban" },
      { id: "job_title", header: "Chức danh" }
    ];
    const crud = useCrudModals();
    const { showFormModal, formMode, editTarget, formApiErrors, openEditModal, showDeleteModal, deleteTarget, openDeleteModal } = crud;
    const { isSubmitting: isUpdating, submitForm, isDeleting, submitDelete } = useCrudSubmit(crud, refresh);
    function handleFormSubmit(formData) {
      submitForm(
        null,
        () => apiUpdateProject(editTarget.value.id, { name: formData.name, address: formData.address, status: formData.status }),
        { update: "Cập nhật dự án thành công" }
      );
    }
    function handleDelete() {
      submitDelete(
        () => apiDeleteProject(deleteTarget.value.id),
        { message: "Đã xoá dự án", navigateAfter: "/pmc/projects" }
      );
    }
    const showMemberModal = vueExports.ref(false);
    const selectedAccountIds = vueExports.ref([]);
    const isSyncing = vueExports.ref(false);
    function openMemberModal() {
      selectedAccountIds.value = accounts.value.map((a) => a.id);
      showMemberModal.value = true;
    }
    async function handleSyncMembers() {
      isSyncing.value = true;
      try {
        await apiSyncProjectMembers(id.value, selectedAccountIds.value);
        showMemberModal.value = false;
        toast.add({ title: "Cập nhật nhân viên thành công", color: "success" });
        refresh();
      } catch {
        toast.add({ title: "Có lỗi xảy ra", color: "error" });
      } finally {
        isSyncing.value = false;
      }
    }
    const departmentParams = vueExports.computed(() => ({
      project_id: id.value,
      per_page: SELECT_ALL_PER_PAGE
    }));
    const {
      data: departmentData,
      status: departmentStatus,
      error: departmentError,
      refresh: refreshDepartments
    } = useDepartmentList(departmentParams);
    const departments = vueExports.computed(() => departmentData.value?.data ?? []);
    const departmentColumns = [
      { accessorKey: "code", header: "Mã" },
      { accessorKey: "name", header: "Tên phòng ban" },
      { id: "parent", header: "Phòng ban cha" },
      { accessorKey: "description", header: "Mô tả" },
      stickyRight({ id: "actions", header: "Thao tác" })
    ];
    const departmentCrud = useCrudModals();
    const {
      showFormModal: showDepartmentFormModal,
      formMode: departmentFormMode,
      editTarget: departmentEditTarget,
      formApiErrors: departmentFormApiErrors,
      openCreateModal: openCreateDepartmentModal,
      openEditModal: openEditDepartmentModal,
      showDeleteModal: showDepartmentDeleteModal,
      deleteTarget: departmentDeleteTarget,
      openDeleteModal: openDeleteDepartmentModal
    } = departmentCrud;
    const {
      isSubmitting: isSubmittingDepartment,
      submitForm: submitDepartmentForm,
      isDeleting: isDeletingDepartment,
      submitDelete: submitDepartmentDelete
    } = useCrudSubmit(departmentCrud, refreshDepartments);
    function handleDepartmentSubmit(formData) {
      submitDepartmentForm(
        () => apiCreateDepartment({ ...formData, project_id: id.value }),
        () => apiUpdateDepartment(departmentEditTarget.value.id, {
          project_id: id.value,
          name: formData.name,
          parent_id: formData.parent_id,
          description: formData.description
        }),
        { create: "Thêm phòng ban thành công", update: "Cập nhật phòng ban thành công" }
      );
    }
    function handleDepartmentDelete() {
      submitDepartmentDelete(
        () => apiDeleteDepartment(departmentDeleteTarget.value.id),
        { message: "Đã xoá phòng ban" }
      );
    }
    const scheduleMonth = vueExports.ref(currentYearMonth());
    const scheduleParams = vueExports.computed(() => ({
      month: scheduleMonth.value,
      project_id: id.value,
      strict_project: true
    }));
    const {
      data: scheduleData,
      status: scheduleStatus,
      error: scheduleError
    } = useTeamSchedule(scheduleParams);
    const schedulePayload = vueExports.computed(() => scheduleData.value?.data ?? null);
    const slotDrawerOpen = vueExports.ref(false);
    const slotDrawerParams = vueExports.ref(null);
    function openSlotDrawer(params) {
      slotDrawerParams.value = params;
      slotDrawerOpen.value = true;
    }
    const showBqtBankModal = vueExports.ref(false);
    return (_ctx, _push, _parent, _attrs) => {
      const _component_USkeleton = _sfc_main$2;
      const _component_SharedCrudPageError = __nuxt_component_2;
      const _component_UButton = _sfc_main$c;
      const _component_SharedFieldDisplay = __nuxt_component_5;
      const _component_UBadge = _sfc_main$3;
      const _component_UTable = _sfc_main$4;
      const _component_NuxtLink = __nuxt_component_0$4;
      const _component_UAlert = _sfc_main$5;
      const _component_SharedCrudTableActions = __nuxt_component_3;
      const _component_UFormField = _sfc_main$6;
      const _component_ScheduleMonthPicker = __nuxt_component_4;
      const _component_ScheduleTeamMatrixTable = __nuxt_component_10;
      const _component_ScheduleSlotDetailDrawer = __nuxt_component_11;
      const _component_ProjectFormModal = __nuxt_component_9;
      const _component_ProjectBqtBankModal = __nuxt_component_14;
      const _component_SharedCrudDeleteModal = __nuxt_component_11$1;
      const _component_DepartmentFormModal = __nuxt_component_10$1;
      const _component_UModal = _sfc_main$7;
      const _component_SharedAccountMultiSelect = __nuxt_component_5$1;
      _push(`<div${serverRenderer_cjs_prodExports.ssrRenderAttrs(_attrs)}>`);
      if (vueExports.unref(status) === "pending") {
        _push(`<div class="space-y-4">`);
        _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_USkeleton, { class: "h-8 w-48" }, null, _parent));
        _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_USkeleton, { class: "h-64 w-full" }, null, _parent));
        _push(`</div>`);
      } else if (vueExports.unref(error)) {
        _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_SharedCrudPageError, {
          error: vueExports.unref(error),
          retry: vueExports.unref(refresh)
        }, null, _parent));
      } else if (vueExports.unref(project)) {
        _push(`<div><div class="flex items-center justify-between mb-6"><div class="flex items-center gap-3">`);
        _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UButton, {
          icon: "i-lucide-arrow-left",
          color: "neutral",
          variant: "ghost",
          onClick: ($event) => ("navigateTo" in _ctx ? _ctx.navigateTo : vueExports.unref(navigateTo))("/pmc/projects")
        }, null, _parent));
        _push(`<div><h1 class="text-2xl font-bold text-[var(--ui-text-highlighted)]">${serverRenderer_cjs_prodExports.ssrInterpolate(vueExports.unref(project).name)}</h1><p class="mt-1 text-sm text-[var(--ui-text-muted)]"> Mã: ${serverRenderer_cjs_prodExports.ssrInterpolate(vueExports.unref(project).code)}</p></div></div><div class="flex items-center gap-2">`);
        _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UButton, {
          icon: "i-lucide-pencil",
          label: "Sửa",
          variant: "outline",
          onClick: ($event) => vueExports.unref(openEditModal)(vueExports.unref(project))
        }, null, _parent));
        _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UButton, {
          icon: "i-lucide-trash-2",
          label: "Xoá",
          color: "error",
          variant: "outline",
          onClick: ($event) => vueExports.unref(openDeleteModal)(vueExports.unref(project))
        }, null, _parent));
        _push(`</div></div><div class="rounded-xl border border-[var(--ui-border)] bg-[var(--ui-bg)] p-6 space-y-4">`);
        _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_SharedFieldDisplay, { label: "Mã dự án" }, {
          default: vueExports.withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`<span class="font-medium"${_scopeId}>${serverRenderer_cjs_prodExports.ssrInterpolate(vueExports.unref(project).code)}</span>`);
            } else {
              return [
                vueExports.createVNode("span", { class: "font-medium" }, vueExports.toDisplayString(vueExports.unref(project).code), 1)
              ];
            }
          }),
          _: 1
        }, _parent));
        _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_SharedFieldDisplay, { label: "Tên dự án" }, {
          default: vueExports.withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`<span class="font-medium"${_scopeId}>${serverRenderer_cjs_prodExports.ssrInterpolate(vueExports.unref(project).name)}</span>`);
            } else {
              return [
                vueExports.createVNode("span", { class: "font-medium" }, vueExports.toDisplayString(vueExports.unref(project).name), 1)
              ];
            }
          }),
          _: 1
        }, _parent));
        _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_SharedFieldDisplay, { label: "Địa chỉ" }, {
          default: vueExports.withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`<span class="font-medium"${_scopeId}>${serverRenderer_cjs_prodExports.ssrInterpolate(vueExports.unref(project).address ?? "—")}</span>`);
            } else {
              return [
                vueExports.createVNode("span", { class: "font-medium" }, vueExports.toDisplayString(vueExports.unref(project).address ?? "—"), 1)
              ];
            }
          }),
          _: 1
        }, _parent));
        _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_SharedFieldDisplay, { label: "Trạng thái" }, {
          default: vueExports.withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UBadge, {
                label: vueExports.unref(project).status.label,
                color: vueExports.unref(project).status.value === "managing" ? "success" : "error",
                variant: "subtle",
                size: "sm"
              }, null, _parent2, _scopeId));
            } else {
              return [
                vueExports.createVNode(_component_UBadge, {
                  label: vueExports.unref(project).status.label,
                  color: vueExports.unref(project).status.value === "managing" ? "success" : "error",
                  variant: "subtle",
                  size: "sm"
                }, null, 8, ["label", "color"])
              ];
            }
          }),
          _: 1
        }, _parent));
        _push(`</div><div class="mt-6 rounded-xl border border-[var(--ui-border)] bg-[var(--ui-bg)] p-6"><div class="flex items-center justify-between mb-4"><div><h2 class="text-lg font-semibold text-[var(--ui-text-highlighted)]"> Tài khoản Ban quản trị </h2><p class="mt-0.5 text-xs text-[var(--ui-text-muted)]"> Dùng để in QR chuyển khoản hoa hồng BQT trên trang Tổng hợp hoa hồng. </p></div>`);
        _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UButton, {
          icon: "i-lucide-pencil",
          label: vueExports.unref(project).bqt_bank ? "Sửa" : "Cấu hình",
          variant: "outline",
          onClick: ($event) => showBqtBankModal.value = true
        }, null, _parent));
        _push(`</div>`);
        if (vueExports.unref(project).bqt_bank) {
          _push(`<!--[-->`);
          _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_SharedFieldDisplay, { label: "Ngân hàng" }, {
            default: vueExports.withCtx((_, _push2, _parent2, _scopeId) => {
              if (_push2) {
                _push2(`<span class="font-medium"${_scopeId}>${serverRenderer_cjs_prodExports.ssrInterpolate(vueExports.unref(project).bqt_bank.label || "—")}</span>`);
              } else {
                return [
                  vueExports.createVNode("span", { class: "font-medium" }, vueExports.toDisplayString(vueExports.unref(project).bqt_bank.label || "—"), 1)
                ];
              }
            }),
            _: 1
          }, _parent));
          _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_SharedFieldDisplay, { label: "Số tài khoản" }, {
            default: vueExports.withCtx((_, _push2, _parent2, _scopeId) => {
              if (_push2) {
                _push2(`<span class="font-mono"${_scopeId}>${serverRenderer_cjs_prodExports.ssrInterpolate(vueExports.unref(project).bqt_bank.account_number)}</span>`);
              } else {
                return [
                  vueExports.createVNode("span", { class: "font-mono" }, vueExports.toDisplayString(vueExports.unref(project).bqt_bank.account_number), 1)
                ];
              }
            }),
            _: 1
          }, _parent));
          _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_SharedFieldDisplay, { label: "Chủ tài khoản" }, {
            default: vueExports.withCtx((_, _push2, _parent2, _scopeId) => {
              if (_push2) {
                _push2(`<span class="uppercase"${_scopeId}>${serverRenderer_cjs_prodExports.ssrInterpolate(vueExports.unref(project).bqt_bank.account_name)}</span>`);
              } else {
                return [
                  vueExports.createVNode("span", { class: "uppercase" }, vueExports.toDisplayString(vueExports.unref(project).bqt_bank.account_name), 1)
                ];
              }
            }),
            _: 1
          }, _parent));
          _push(`<!--]-->`);
        } else {
          _push(`<p class="text-sm text-[var(--ui-text-muted)] italic"> Chưa cấu hình tài khoản BQT cho dự án này. </p>`);
        }
        _push(`</div><div class="mt-8"><div class="flex items-center justify-between mb-4"><h2 class="text-lg font-semibold text-[var(--ui-text-highlighted)]"> Danh sách nhân viên </h2>`);
        _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UButton, {
          icon: "i-lucide-user-plus",
          label: "Quản lý nhân viên",
          variant: "outline",
          onClick: openMemberModal
        }, null, _parent));
        _push(`</div>`);
        if (vueExports.unref(accounts).length > 0) {
          _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UTable, {
            data: vueExports.unref(accounts),
            columns: accountColumns,
            class: "border border-[var(--ui-border)] rounded-lg"
          }, {
            "employee_code-cell": vueExports.withCtx(({ row }, _push2, _parent2, _scopeId) => {
              if (_push2) {
                _push2(`${serverRenderer_cjs_prodExports.ssrInterpolate(row.original.employee_code ?? "—")}`);
              } else {
                return [
                  vueExports.createTextVNode(vueExports.toDisplayString(row.original.employee_code ?? "—"), 1)
                ];
              }
            }),
            "full_name-cell": vueExports.withCtx(({ row }, _push2, _parent2, _scopeId) => {
              if (_push2) {
                _push2(`${serverRenderer_cjs_prodExports.ssrInterpolate(row.original.full_name ?? "—")}`);
              } else {
                return [
                  vueExports.createTextVNode(vueExports.toDisplayString(row.original.full_name ?? "—"), 1)
                ];
              }
            }),
            "department-cell": vueExports.withCtx(({ row }, _push2, _parent2, _scopeId) => {
              if (_push2) {
                if (row.original.departments?.length) {
                  _push2(`<div class="flex flex-wrap gap-1"${_scopeId}><!--[-->`);
                  serverRenderer_cjs_prodExports.ssrRenderList(row.original.departments, (dept) => {
                    _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_NuxtLink, {
                      key: dept.id,
                      to: `/pmc/departments/${dept.id}`
                    }, {
                      default: vueExports.withCtx((_, _push3, _parent3, _scopeId2) => {
                        if (_push3) {
                          _push3(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UBadge, {
                            label: dept.name,
                            color: "neutral",
                            variant: "subtle",
                            size: "sm",
                            class: "cursor-pointer hover:opacity-80"
                          }, null, _parent3, _scopeId2));
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
                    }, _parent2, _scopeId));
                  });
                  _push2(`<!--]--></div>`);
                } else {
                  _push2(`<span class="text-(--ui-text-muted)"${_scopeId}>—</span>`);
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
            "job_title-cell": vueExports.withCtx(({ row }, _push2, _parent2, _scopeId) => {
              if (_push2) {
                if (row.original.job_title) {
                  _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_NuxtLink, {
                    to: `/pmc/job-titles/${row.original.job_title.id}`,
                    class: "text-blue-600 hover:text-blue-800 hover:underline"
                  }, {
                    default: vueExports.withCtx((_, _push3, _parent3, _scopeId2) => {
                      if (_push3) {
                        _push3(`${serverRenderer_cjs_prodExports.ssrInterpolate(row.original.job_title.name)}`);
                      } else {
                        return [
                          vueExports.createTextVNode(vueExports.toDisplayString(row.original.job_title.name), 1)
                        ];
                      }
                    }),
                    _: 2
                  }, _parent2, _scopeId));
                } else {
                  _push2(`<span${_scopeId}>—</span>`);
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
            _: 1
          }, _parent));
        } else {
          _push(`<p class="text-sm text-[var(--ui-text-muted)] italic"> Chưa có nhân viên nào trong dự án. </p>`);
        }
        _push(`</div><div class="mt-8"><div class="flex items-center justify-between mb-4"><h2 class="text-lg font-semibold text-[var(--ui-text-highlighted)]"> Phòng ban </h2>`);
        _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UButton, {
          icon: "i-lucide-plus",
          label: "Thêm phòng ban",
          onClick: vueExports.unref(openCreateDepartmentModal)
        }, null, _parent));
        _push(`</div>`);
        if (vueExports.unref(departmentError)) {
          _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UAlert, {
            color: "error",
            variant: "subtle",
            icon: "i-lucide-triangle-alert",
            title: "Không tải được danh sách phòng ban",
            description: vueExports.unref(departmentError).message
          }, null, _parent));
        } else if (vueExports.unref(departmentStatus) === "pending") {
          _push(`<div class="space-y-2"><!--[-->`);
          serverRenderer_cjs_prodExports.ssrRenderList(3, (n) => {
            _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_USkeleton, {
              key: n,
              class: "h-10 w-full"
            }, null, _parent));
          });
          _push(`<!--]--></div>`);
        } else if (vueExports.unref(departments).length > 0) {
          _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UTable, {
            data: vueExports.unref(departments),
            columns: departmentColumns,
            class: "border border-[var(--ui-border)] rounded-lg"
          }, {
            "parent-cell": vueExports.withCtx(({ row }, _push2, _parent2, _scopeId) => {
              if (_push2) {
                if (row.original.parent) {
                  _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_NuxtLink, {
                    to: `/pmc/departments/${row.original.parent.id}`,
                    class: "text-blue-600 hover:text-blue-800 hover:underline"
                  }, {
                    default: vueExports.withCtx((_, _push3, _parent3, _scopeId2) => {
                      if (_push3) {
                        _push3(`${serverRenderer_cjs_prodExports.ssrInterpolate(row.original.parent.name)}`);
                      } else {
                        return [
                          vueExports.createTextVNode(vueExports.toDisplayString(row.original.parent.name), 1)
                        ];
                      }
                    }),
                    _: 2
                  }, _parent2, _scopeId));
                } else {
                  _push2(`<span${_scopeId}>—</span>`);
                }
              } else {
                return [
                  row.original.parent ? (vueExports.openBlock(), vueExports.createBlock(_component_NuxtLink, {
                    key: 0,
                    to: `/pmc/departments/${row.original.parent.id}`,
                    class: "text-blue-600 hover:text-blue-800 hover:underline"
                  }, {
                    default: vueExports.withCtx(() => [
                      vueExports.createTextVNode(vueExports.toDisplayString(row.original.parent.name), 1)
                    ]),
                    _: 2
                  }, 1032, ["to"])) : (vueExports.openBlock(), vueExports.createBlock("span", { key: 1 }, "—"))
                ];
              }
            }),
            "description-cell": vueExports.withCtx(({ row }, _push2, _parent2, _scopeId) => {
              if (_push2) {
                _push2(`${serverRenderer_cjs_prodExports.ssrInterpolate(row.original.description ?? "—")}`);
              } else {
                return [
                  vueExports.createTextVNode(vueExports.toDisplayString(row.original.description ?? "—"), 1)
                ];
              }
            }),
            "actions-cell": vueExports.withCtx(({ row }, _push2, _parent2, _scopeId) => {
              if (_push2) {
                _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_SharedCrudTableActions, {
                  "detail-to": `/pmc/departments/${row.original.id}`,
                  onEdit: ($event) => vueExports.unref(openEditDepartmentModal)(row.original),
                  onDelete: ($event) => vueExports.unref(openDeleteDepartmentModal)(row.original)
                }, null, _parent2, _scopeId));
              } else {
                return [
                  vueExports.createVNode(_component_SharedCrudTableActions, {
                    "detail-to": `/pmc/departments/${row.original.id}`,
                    onEdit: ($event) => vueExports.unref(openEditDepartmentModal)(row.original),
                    onDelete: ($event) => vueExports.unref(openDeleteDepartmentModal)(row.original)
                  }, null, 8, ["detail-to", "onEdit", "onDelete"])
                ];
              }
            }),
            _: 1
          }, _parent));
        } else {
          _push(`<p class="text-sm text-[var(--ui-text-muted)] italic"> Chưa có phòng ban nào trong dự án. </p>`);
        }
        _push(`</div><div class="mt-8 space-y-4"><div class="flex flex-wrap items-center justify-between gap-3"><div><h2 class="text-lg font-semibold text-[var(--ui-text-highlighted)]"> Lịch ca kíp </h2><p class="mt-0.5 text-sm text-[var(--ui-text-muted)]"> Ma trận ca × ngày của nhân sự thuộc dự án này trong tháng </p></div>`);
        _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UFormField, { label: "Tháng" }, {
          default: vueExports.withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_ScheduleMonthPicker, {
                modelValue: vueExports.unref(scheduleMonth),
                "onUpdate:modelValue": ($event) => vueExports.isRef(scheduleMonth) ? scheduleMonth.value = $event : null
              }, null, _parent2, _scopeId));
            } else {
              return [
                vueExports.createVNode(_component_ScheduleMonthPicker, {
                  modelValue: vueExports.unref(scheduleMonth),
                  "onUpdate:modelValue": ($event) => vueExports.isRef(scheduleMonth) ? scheduleMonth.value = $event : null
                }, null, 8, ["modelValue", "onUpdate:modelValue"])
              ];
            }
          }),
          _: 1
        }, _parent));
        _push(`</div>`);
        if (vueExports.unref(scheduleError)) {
          _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UAlert, {
            color: "error",
            variant: "subtle",
            icon: "i-lucide-triangle-alert",
            title: "Không tải được lịch ca kíp",
            description: vueExports.unref(scheduleError).message
          }, null, _parent));
        } else if (vueExports.unref(scheduleStatus) === "pending") {
          _push(`<div class="flex flex-col gap-1 rounded-xl border border-[var(--ui-border)] bg-white p-2"><!--[-->`);
          serverRenderer_cjs_prodExports.ssrRenderList(4, (n) => {
            _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_USkeleton, {
              key: n,
              class: "h-[72px] w-full"
            }, null, _parent));
          });
          _push(`<!--]--></div>`);
        } else {
          _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_ScheduleTeamMatrixTable, {
            payload: vueExports.unref(schedulePayload),
            onClickSlot: openSlotDrawer
          }, null, _parent));
        }
        _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_ScheduleSlotDetailDrawer, {
          open: vueExports.unref(slotDrawerOpen),
          "onUpdate:open": ($event) => vueExports.isRef(slotDrawerOpen) ? slotDrawerOpen.value = $event : null,
          params: vueExports.unref(slotDrawerParams)
        }, null, _parent));
        _push(`</div></div>`);
      } else {
        _push(`<!---->`);
      }
      _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_ProjectFormModal, {
        open: vueExports.unref(showFormModal),
        "onUpdate:open": ($event) => vueExports.isRef(showFormModal) ? showFormModal.value = $event : null,
        mode: vueExports.unref(formMode),
        item: vueExports.unref(editTarget),
        loading: vueExports.unref(isUpdating),
        "api-errors": vueExports.unref(formApiErrors),
        onSubmit: handleFormSubmit
      }, null, _parent));
      if (vueExports.unref(project)) {
        _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_ProjectBqtBankModal, {
          open: vueExports.unref(showBqtBankModal),
          "onUpdate:open": ($event) => vueExports.isRef(showBqtBankModal) ? showBqtBankModal.value = $event : null,
          "project-id": vueExports.unref(id),
          initial: {
            bqt_bank_bin: vueExports.unref(project).bqt_bank?.bin ?? null,
            bqt_bank_name: vueExports.unref(project).bqt_bank?.label ?? null,
            bqt_account_number: vueExports.unref(project).bqt_bank?.account_number ?? null,
            bqt_account_holder: vueExports.unref(project).bqt_bank?.account_name ?? null
          },
          onSaved: ($event) => vueExports.unref(refresh)()
        }, null, _parent));
      } else {
        _push(`<!---->`);
      }
      _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_SharedCrudDeleteModal, {
        open: vueExports.unref(showDeleteModal),
        "onUpdate:open": ($event) => vueExports.isRef(showDeleteModal) ? showDeleteModal.value = $event : null,
        title: "Xoá dự án",
        "item-name": vueExports.unref(deleteTarget)?.name,
        description: "Tất cả nhân viên đã gán vào dự án này cũng sẽ bị gỡ khỏi dự án.",
        loading: vueExports.unref(isDeleting),
        onConfirm: handleDelete
      }, null, _parent));
      _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_DepartmentFormModal, {
        open: vueExports.unref(showDepartmentFormModal),
        "onUpdate:open": ($event) => vueExports.isRef(showDepartmentFormModal) ? showDepartmentFormModal.value = $event : null,
        mode: vueExports.unref(departmentFormMode),
        item: vueExports.unref(departmentEditTarget),
        loading: vueExports.unref(isSubmittingDepartment),
        "api-errors": vueExports.unref(departmentFormApiErrors),
        "locked-project-id": vueExports.unref(id),
        onSubmit: handleDepartmentSubmit
      }, null, _parent));
      _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_SharedCrudDeleteModal, {
        open: vueExports.unref(showDepartmentDeleteModal),
        "onUpdate:open": ($event) => vueExports.isRef(showDepartmentDeleteModal) ? showDepartmentDeleteModal.value = $event : null,
        title: "Xoá phòng ban",
        "item-name": vueExports.unref(departmentDeleteTarget)?.name,
        loading: vueExports.unref(isDeletingDepartment),
        onConfirm: handleDepartmentDelete
      }, null, _parent));
      _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UModal, {
        open: vueExports.unref(showMemberModal),
        "onUpdate:open": ($event) => vueExports.isRef(showMemberModal) ? showMemberModal.value = $event : null,
        title: "Quản lý nhân viên",
        ui: { content: "sm:max-w-lg" }
      }, {
        body: vueExports.withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="space-y-4"${_scopeId}><p class="text-sm text-[var(--ui-text-muted)]"${_scopeId}> Chọn nhân viên để gán vào dự án. Nhân viên không được chọn sẽ bị gỡ khỏi dự án. </p>`);
            _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_SharedAccountMultiSelect, {
              modelValue: vueExports.unref(selectedAccountIds),
              "onUpdate:modelValue": ($event) => vueExports.isRef(selectedAccountIds) ? selectedAccountIds.value = $event : null
            }, null, _parent2, _scopeId));
            _push2(`</div>`);
          } else {
            return [
              vueExports.createVNode("div", { class: "space-y-4" }, [
                vueExports.createVNode("p", { class: "text-sm text-[var(--ui-text-muted)]" }, " Chọn nhân viên để gán vào dự án. Nhân viên không được chọn sẽ bị gỡ khỏi dự án. "),
                vueExports.createVNode(_component_SharedAccountMultiSelect, {
                  modelValue: vueExports.unref(selectedAccountIds),
                  "onUpdate:modelValue": ($event) => vueExports.isRef(selectedAccountIds) ? selectedAccountIds.value = $event : null
                }, null, 8, ["modelValue", "onUpdate:modelValue"])
              ])
            ];
          }
        }),
        footer: vueExports.withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="flex justify-end gap-2"${_scopeId}>`);
            _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UButton, {
              label: "Huỷ",
              color: "neutral",
              variant: "outline",
              onClick: ($event) => showMemberModal.value = false
            }, null, _parent2, _scopeId));
            _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UButton, {
              label: "Lưu",
              loading: vueExports.unref(isSyncing),
              onClick: handleSyncMembers
            }, null, _parent2, _scopeId));
            _push2(`</div>`);
          } else {
            return [
              vueExports.createVNode("div", { class: "flex justify-end gap-2" }, [
                vueExports.createVNode(_component_UButton, {
                  label: "Huỷ",
                  color: "neutral",
                  variant: "outline",
                  onClick: ($event) => showMemberModal.value = false
                }, null, 8, ["onClick"]),
                vueExports.createVNode(_component_UButton, {
                  label: "Lưu",
                  loading: vueExports.unref(isSyncing),
                  onClick: handleSyncMembers
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/pmc/projects/[id].vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=_id_-DrjVmUDP.mjs.map
