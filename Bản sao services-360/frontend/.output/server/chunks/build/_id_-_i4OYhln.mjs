import { v as vueExports, p as useRoute$1, i as useRouter, j as useToast, s as serverRenderer_cjs_prodExports, l as _sfc_main$c, y as _sfc_main$f, k as _sfc_main$h, _ as __nuxt_component_0$4 } from './server.mjs';
import { _ as __nuxt_component_2 } from './PageError-kZWsA9dh.mjs';
import { _ as __nuxt_component_7 } from './StatusBadge-DeQimcpk.mjs';
import { _ as __nuxt_component_1 } from './CapabilityRatingBadge-BBWBj9qN.mjs';
import { _ as _sfc_main$1 } from './Tooltip-Dasyzope.mjs';
import { _ as _sfc_main$2 } from './Badge-W93D3Jpz.mjs';
import { _ as _sfc_main$3 } from './Tabs-Djlffbcc.mjs';
import { _ as __nuxt_component_4 } from './SectionCard-CH-mG9Mf.mjs';
import { _ as __nuxt_component_5 } from './FieldDisplay-BM6nmr2i.mjs';
import { _ as _sfc_main$4 } from './Alert-tTsPKADX.mjs';
import { _ as _sfc_main$5 } from './Table-17SH0cIR.mjs';
import { _ as __nuxt_component_5$1 } from './AccountSchedulePanel-1RCVXmFK.mjs';
import { _ as __nuxt_component_16, a as __nuxt_component_17 } from './AccountChangePasswordModal-rohcABJW.mjs';
import { _ as __nuxt_component_11 } from './DeleteModal-B4AevDGU.mjs';
import { u as useOgTicketList, o as ogTicketPriorityColor, a as ogTicketStatusColor } from './useOgTickets-DPRh9tlL.mjs';
import { f as formatDateTime } from './date-R5YK0ast.mjs';
import { u as useAccountDetail, a as apiUpdateAccount, b as apiChangeAccountPassword, c as apiDeleteAccount } from './useAccounts-BDWM8ZpB.mjs';
import { u as useBreadcrumb } from './useBreadcrumb-zkNa_uJG.mjs';
import { b as buildVietQrImageUrl } from './vietqr-D50vgfgj.mjs';
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
import './PopperArrow-C9hHWuSZ.mjs';
import './FocusScope-BZehoQSg.mjs';
import './useGraceArea-B6BTYtpN.mjs';
import './Kbd-T8yC2vfh.mjs';
import './useDirection-CXYby7CP.mjs';
import './RovingFocusGroup-Vsbo7D6E.mjs';
import './utils-BgcT7rQQ.mjs';
import './RovingFocusItem-DwKRAYZk.mjs';
import './index-CSThDD3J.mjs';
import './index-QmZAbLx-.mjs';
import './FormField-DFdmv6Lu.mjs';
import './Label-BBgw4vHh.mjs';
import './SlotDetailDrawer-LTINo05F.mjs';
import './Slideover-C_jHRSNJ.mjs';
import './DialogTrigger-C3iwCYMu.mjs';
import './utils-DY0Zag2O.mjs';
import './DialogClose-DGkUxau7.mjs';
import './Skeleton-CKN2C2Mt.mjs';
import './UnscheduledDetailDrawer-2sLtSk2r.mjs';
import './BaseFormModal-CG7aCaIV.mjs';
import './Modal-BimZZbNl.mjs';
import './AvatarUpload-CsEPx2JP.mjs';
import './Input-JXN8po_F.mjs';
import './FormFieldError-cu7WK1i1.mjs';
import './Select-CZE7Ef6n.mjs';
import './useFormControl-_Lqv8ipK.mjs';
import './useFocusGuards-CJykkUFH.mjs';
import './handleAndDispatchCustomEvent-Bk_AVSSo.mjs';
import './SelectMenu-DKHEMZj7.mjs';
import './useKbd-JjFOu4f7.mjs';
import './VisuallyHiddenInput-q6Pz-w0i.mjs';
import './useEntitySelect-DG9pQ_n0.mjs';
import './constants-G9YmtWtp.mjs';
import './useDepartments-C8BvGnCs.mjs';
import './useJobTitles-DzuQHrcS.mjs';
import './useRoles-Bl-GRSKI.mjs';
import './useProjects-D4K3VYdb.mjs';
import './Switch-1cJNH-6C.mjs';
import './Separator-DeO-OPIs.mjs';
import './Separator-DtmsHEyk.mjs';

const _sfc_main = /* @__PURE__ */ vueExports.defineComponent({
  __name: "[id]",
  __ssrInlineRender: true,
  setup(__props) {
    const route = useRoute$1();
    const router = useRouter();
    const id = vueExports.computed(() => Number(route.params.id));
    const { data, status, error, refresh } = useAccountDetail(id);
    const { useDynamicLabel } = useBreadcrumb();
    useDynamicLabel(vueExports.computed(() => data.value?.data?.name ?? null));
    const account = vueExports.computed(() => data.value?.data ?? null);
    const bankQrUrl = vueExports.computed(() => {
      const bank = account.value?.bank_info;
      if (!bank?.bin || !bank?.account_number) return "";
      return buildVietQrImageUrl({
        bankBin: bank.bin,
        accountNumber: bank.account_number,
        accountName: bank.account_name
      });
    });
    const tabItems = [
      { label: "Tổng quan", value: "overview", icon: "i-lucide-user" },
      { label: "Ticket được giao", value: "tickets", icon: "i-lucide-ticket" },
      { label: "Lịch làm việc", value: "schedule", icon: "i-lucide-calendar-days" }
    ];
    const allowedTabs = tabItems.map((t) => t.value);
    const activeTab = vueExports.ref(
      typeof route.query.tab === "string" && allowedTabs.includes(route.query.tab) ? route.query.tab : "overview"
    );
    vueExports.watch(activeTab, (next) => {
      router.replace({ query: { ...route.query, tab: next } });
    });
    const ticketParams = vueExports.computed(() => ({ assignee_id: id.value, per_page: 20 }));
    const { data: ticketData, status: ticketStatus } = useOgTicketList(ticketParams);
    const assignedTickets = vueExports.computed(() => ticketData.value?.data ?? []);
    const ticketColumns = [
      { accessorKey: "code", header: "Mã" },
      { accessorKey: "subject", header: "Tiêu đề" },
      { id: "project", header: "Dự án" },
      { id: "status", header: "Trạng thái" },
      { id: "priority", header: "Ưu tiên" },
      { id: "received_at", header: "Tiếp nhận" }
    ];
    const crud = useCrudModals();
    const {
      showFormModal,
      formMode,
      editTarget,
      formApiErrors,
      openEditModal,
      showDeleteModal,
      deleteTarget,
      openDeleteModal
    } = crud;
    const { isSubmitting: isUpdating, submitForm, isDeleting, submitDelete } = useCrudSubmit(crud, refresh);
    function handleFormSubmit(formData) {
      submitForm(
        null,
        () => apiUpdateAccount(editTarget.value.id, {
          name: formData.name,
          gender: formData.gender ?? null,
          department_ids: formData.department_ids,
          job_title_id: formData.job_title_id,
          role_id: formData.role_id,
          project_ids: formData.project_ids.length ? formData.project_ids : null,
          is_active: formData.is_active,
          bank_bin: formData.bank_bin || null,
          bank_label: formData.bank_label || null,
          bank_account_number: formData.bank_account_number || null,
          bank_account_name: formData.bank_account_name || null,
          capability_rating: formData.capability_rating != null ? Number(formData.capability_rating) : null
        }),
        { update: "Cập nhật tài khoản thành công" }
      );
    }
    const toast = useToast();
    const showPasswordModal = vueExports.ref(false);
    const passwordTarget = vueExports.ref(null);
    const passwordApiErrors = vueExports.ref({});
    const isChangingPassword = vueExports.ref(false);
    function openPasswordModal(item) {
      passwordTarget.value = item;
      passwordApiErrors.value = {};
      showPasswordModal.value = true;
    }
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
        { message: "Xoá tài khoản thành công", navigateAfter: "/pmc/accounts" }
      );
    }
    return (_ctx, _push, _parent, _attrs) => {
      const _component_UButton = _sfc_main$c;
      const _component_SharedCrudPageError = __nuxt_component_2;
      const _component_UAvatar = _sfc_main$f;
      const _component_SharedStatusBadge = __nuxt_component_7;
      const _component_SharedCapabilityRatingBadge = __nuxt_component_1;
      const _component_UTooltip = _sfc_main$1;
      const _component_UBadge = _sfc_main$2;
      const _component_UIcon = _sfc_main$h;
      const _component_NuxtLink = __nuxt_component_0$4;
      const _component_UTabs = _sfc_main$3;
      const _component_SharedSectionCard = __nuxt_component_4;
      const _component_SharedFieldDisplay = __nuxt_component_5;
      const _component_UAlert = _sfc_main$4;
      const _component_UTable = _sfc_main$5;
      const _component_SharedAccountSchedulePanel = __nuxt_component_5$1;
      const _component_AccountFormModal = __nuxt_component_16;
      const _component_AccountChangePasswordModal = __nuxt_component_17;
      const _component_SharedCrudDeleteModal = __nuxt_component_11;
      _push(`<div${serverRenderer_cjs_prodExports.ssrRenderAttrs(_attrs)}><div class="mb-6 flex items-center gap-4">`);
      _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UButton, {
        icon: "i-lucide-arrow-left",
        color: "neutral",
        variant: "ghost",
        to: "/pmc/accounts"
      }, null, _parent));
      _push(`<div><h1 class="text-2xl font-black text-slate-900 tracking-tight"> Chi tiết tài khoản </h1><p class="text-slate-500 text-sm mt-0.5">${serverRenderer_cjs_prodExports.ssrInterpolate(vueExports.unref(account)?.name ?? "...")}</p></div></div>`);
      if (vueExports.unref(status) === "pending") {
        _push(`<div class="flex flex-col gap-6"><div class="h-32 bg-slate-100 rounded-xl animate-pulse"></div><div class="h-96 bg-slate-100 rounded-xl animate-pulse"></div></div>`);
      } else if (vueExports.unref(error)) {
        _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_SharedCrudPageError, {
          error: vueExports.unref(error),
          retry: vueExports.unref(refresh)
        }, null, _parent));
      } else if (vueExports.unref(account)) {
        _push(`<div class="flex flex-col gap-6"><div class="rounded-xl border border-slate-200 bg-white shadow-sm p-5"><div class="flex flex-col gap-4 md:flex-row md:items-center md:justify-between"><div class="flex items-start gap-5 min-w-0">`);
        _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UAvatar, {
          src: vueExports.unref(account).avatar_url ?? void 0,
          alt: vueExports.unref(account).name,
          size: "3xl"
        }, null, _parent));
        _push(`<div class="min-w-0"><div class="flex flex-wrap items-center gap-2"><h2 class="text-lg font-bold text-slate-900 truncate">${serverRenderer_cjs_prodExports.ssrInterpolate(vueExports.unref(account).name)}</h2>`);
        _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_SharedStatusBadge, {
          active: Boolean(vueExports.unref(account).is_active)
        }, null, _parent));
        _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_SharedCapabilityRatingBadge, {
          rating: vueExports.unref(account).capability_rating,
          size: "sm"
        }, null, _parent));
        if (vueExports.unref(account).has_active_assignment) {
          _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UTooltip, {
            text: `Đang xử lý ${vueExports.unref(account).active_assignment_count} ticket chưa hoàn thành`
          }, {
            default: vueExports.withCtx((_, _push2, _parent2, _scopeId) => {
              if (_push2) {
                _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UBadge, {
                  label: `Đang giao việc (${vueExports.unref(account).active_assignment_count})`,
                  color: "warning",
                  variant: "subtle",
                  size: "sm",
                  icon: "i-lucide-loader-circle"
                }, null, _parent2, _scopeId));
              } else {
                return [
                  vueExports.createVNode(_component_UBadge, {
                    label: `Đang giao việc (${vueExports.unref(account).active_assignment_count})`,
                    color: "warning",
                    variant: "subtle",
                    size: "sm",
                    icon: "i-lucide-loader-circle"
                  }, null, 8, ["label"])
                ];
              }
            }),
            _: 1
          }, _parent));
        } else {
          _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UBadge, {
            label: "Rảnh",
            color: "neutral",
            variant: "subtle",
            size: "sm"
          }, null, _parent));
        }
        _push(`</div><p class="text-sm text-slate-500 mt-1">${serverRenderer_cjs_prodExports.ssrInterpolate(vueExports.unref(account).email)}</p><div class="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-slate-600">`);
        if (vueExports.unref(account).employee_code) {
          _push(`<span class="inline-flex items-center gap-1">`);
          _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UIcon, {
            name: "i-lucide-hash",
            class: "size-3.5 text-slate-400"
          }, null, _parent));
          _push(` ${serverRenderer_cjs_prodExports.ssrInterpolate(vueExports.unref(account).employee_code)}</span>`);
        } else {
          _push(`<!---->`);
        }
        if (vueExports.unref(account).departments?.length) {
          _push(`<!--[-->`);
          serverRenderer_cjs_prodExports.ssrRenderList(vueExports.unref(account).departments, (dept) => {
            _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_NuxtLink, {
              key: dept.id,
              to: `/pmc/departments/${dept.id}`,
              class: "inline-flex items-center gap-1 text-primary-600 hover:underline"
            }, {
              default: vueExports.withCtx((_, _push2, _parent2, _scopeId) => {
                if (_push2) {
                  _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UIcon, {
                    name: "i-lucide-building-2",
                    class: "size-3.5"
                  }, null, _parent2, _scopeId));
                  _push2(` ${serverRenderer_cjs_prodExports.ssrInterpolate(dept.name)}`);
                } else {
                  return [
                    vueExports.createVNode(_component_UIcon, {
                      name: "i-lucide-building-2",
                      class: "size-3.5"
                    }),
                    vueExports.createTextVNode(" " + vueExports.toDisplayString(dept.name), 1)
                  ];
                }
              }),
              _: 2
            }, _parent));
          });
          _push(`<!--]-->`);
        } else {
          _push(`<!---->`);
        }
        if (vueExports.unref(account).job_title) {
          _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_NuxtLink, {
            to: `/pmc/job-titles/${vueExports.unref(account).job_title.id}`,
            class: "inline-flex items-center gap-1 text-primary-600 hover:underline"
          }, {
            default: vueExports.withCtx((_, _push2, _parent2, _scopeId) => {
              if (_push2) {
                _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UIcon, {
                  name: "i-lucide-briefcase",
                  class: "size-3.5"
                }, null, _parent2, _scopeId));
                _push2(` ${serverRenderer_cjs_prodExports.ssrInterpolate(vueExports.unref(account).job_title.name)}`);
              } else {
                return [
                  vueExports.createVNode(_component_UIcon, {
                    name: "i-lucide-briefcase",
                    class: "size-3.5"
                  }),
                  vueExports.createTextVNode(" " + vueExports.toDisplayString(vueExports.unref(account).job_title.name), 1)
                ];
              }
            }),
            _: 1
          }, _parent));
        } else {
          _push(`<!---->`);
        }
        if (vueExports.unref(account).role) {
          _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_NuxtLink, {
            to: `/pmc/roles/${vueExports.unref(account).role.id}`,
            class: "inline-flex items-center gap-1 text-primary-600 hover:underline"
          }, {
            default: vueExports.withCtx((_, _push2, _parent2, _scopeId) => {
              if (_push2) {
                _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UIcon, {
                  name: "i-lucide-shield",
                  class: "size-3.5"
                }, null, _parent2, _scopeId));
                _push2(` ${serverRenderer_cjs_prodExports.ssrInterpolate(vueExports.unref(account).role.name)}`);
              } else {
                return [
                  vueExports.createVNode(_component_UIcon, {
                    name: "i-lucide-shield",
                    class: "size-3.5"
                  }),
                  vueExports.createTextVNode(" " + vueExports.toDisplayString(vueExports.unref(account).role.name), 1)
                ];
              }
            }),
            _: 1
          }, _parent));
        } else {
          _push(`<!---->`);
        }
        _push(`</div></div></div><div class="flex flex-wrap items-center gap-2 shrink-0">`);
        _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UButton, {
          icon: "i-lucide-pencil",
          label: "Chỉnh sửa",
          variant: "soft",
          color: "primary",
          onClick: ($event) => vueExports.unref(openEditModal)(vueExports.unref(account))
        }, null, _parent));
        _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UButton, {
          icon: "i-lucide-key-round",
          label: "Đổi mật khẩu",
          variant: "soft",
          color: "neutral",
          onClick: ($event) => openPasswordModal(vueExports.unref(account))
        }, null, _parent));
        _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UButton, {
          icon: "i-lucide-trash-2",
          variant: "soft",
          color: "error",
          "aria-label": "Xoá tài khoản",
          onClick: ($event) => vueExports.unref(openDeleteModal)(vueExports.unref(account))
        }, null, _parent));
        _push(`</div></div></div>`);
        _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UTabs, {
          modelValue: vueExports.unref(activeTab),
          "onUpdate:modelValue": ($event) => vueExports.isRef(activeTab) ? activeTab.value = $event : null,
          items: tabItems,
          variant: "link",
          content: false,
          class: "w-full"
        }, null, _parent));
        if (vueExports.unref(activeTab) === "overview") {
          _push(`<div class="flex flex-col gap-6">`);
          _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_SharedSectionCard, { title: "Thông tin chi tiết" }, {
            default: vueExports.withCtx((_, _push2, _parent2, _scopeId) => {
              if (_push2) {
                _push2(`<div class="grid grid-cols-1 sm:grid-cols-2 gap-5"${_scopeId}>`);
                _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_SharedFieldDisplay, { label: "Họ tên" }, {
                  default: vueExports.withCtx((_2, _push3, _parent3, _scopeId2) => {
                    if (_push3) {
                      _push3(`<span class="font-medium"${_scopeId2}>${serverRenderer_cjs_prodExports.ssrInterpolate(vueExports.unref(account).name)}</span>`);
                    } else {
                      return [
                        vueExports.createVNode("span", { class: "font-medium" }, vueExports.toDisplayString(vueExports.unref(account).name), 1)
                      ];
                    }
                  }),
                  _: 1
                }, _parent2, _scopeId));
                _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_SharedFieldDisplay, { label: "Email" }, {
                  default: vueExports.withCtx((_2, _push3, _parent3, _scopeId2) => {
                    if (_push3) {
                      _push3(`<span class="font-medium"${_scopeId2}>${serverRenderer_cjs_prodExports.ssrInterpolate(vueExports.unref(account).email)}</span>`);
                    } else {
                      return [
                        vueExports.createVNode("span", { class: "font-medium" }, vueExports.toDisplayString(vueExports.unref(account).email), 1)
                      ];
                    }
                  }),
                  _: 1
                }, _parent2, _scopeId));
                _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_SharedFieldDisplay, { label: "Mã nhân viên" }, {
                  default: vueExports.withCtx((_2, _push3, _parent3, _scopeId2) => {
                    if (_push3) {
                      _push3(`<span class="font-medium"${_scopeId2}>${serverRenderer_cjs_prodExports.ssrInterpolate(vueExports.unref(account).employee_code ?? "—")}</span>`);
                    } else {
                      return [
                        vueExports.createVNode("span", { class: "font-medium" }, vueExports.toDisplayString(vueExports.unref(account).employee_code ?? "—"), 1)
                      ];
                    }
                  }),
                  _: 1
                }, _parent2, _scopeId));
                _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_SharedFieldDisplay, { label: "Giới tính" }, {
                  default: vueExports.withCtx((_2, _push3, _parent3, _scopeId2) => {
                    if (_push3) {
                      _push3(`<span class="font-medium"${_scopeId2}>${serverRenderer_cjs_prodExports.ssrInterpolate(vueExports.unref(account).gender?.label ?? "—")}</span>`);
                    } else {
                      return [
                        vueExports.createVNode("span", { class: "font-medium" }, vueExports.toDisplayString(vueExports.unref(account).gender?.label ?? "—"), 1)
                      ];
                    }
                  }),
                  _: 1
                }, _parent2, _scopeId));
                _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_SharedFieldDisplay, { label: "Phòng ban" }, {
                  default: vueExports.withCtx((_2, _push3, _parent3, _scopeId2) => {
                    if (_push3) {
                      if (vueExports.unref(account).departments?.length) {
                        _push3(`<div class="flex flex-wrap gap-2"${_scopeId2}><!--[-->`);
                        serverRenderer_cjs_prodExports.ssrRenderList(vueExports.unref(account).departments, (dept) => {
                          _push3(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_NuxtLink, {
                            key: dept.id,
                            to: `/pmc/departments/${dept.id}`,
                            class: "font-medium text-primary-600 hover:text-primary-800 hover:underline"
                          }, {
                            default: vueExports.withCtx((_3, _push4, _parent4, _scopeId3) => {
                              if (_push4) {
                                _push4(`${serverRenderer_cjs_prodExports.ssrInterpolate(dept.name)}`);
                              } else {
                                return [
                                  vueExports.createTextVNode(vueExports.toDisplayString(dept.name), 1)
                                ];
                              }
                            }),
                            _: 2
                          }, _parent3, _scopeId2));
                        });
                        _push3(`<!--]--></div>`);
                      } else {
                        _push3(`<span class="text-slate-400"${_scopeId2}>—</span>`);
                      }
                    } else {
                      return [
                        vueExports.unref(account).departments?.length ? (vueExports.openBlock(), vueExports.createBlock("div", {
                          key: 0,
                          class: "flex flex-wrap gap-2"
                        }, [
                          (vueExports.openBlock(true), vueExports.createBlock(vueExports.Fragment, null, vueExports.renderList(vueExports.unref(account).departments, (dept) => {
                            return vueExports.openBlock(), vueExports.createBlock(_component_NuxtLink, {
                              key: dept.id,
                              to: `/pmc/departments/${dept.id}`,
                              class: "font-medium text-primary-600 hover:text-primary-800 hover:underline"
                            }, {
                              default: vueExports.withCtx(() => [
                                vueExports.createTextVNode(vueExports.toDisplayString(dept.name), 1)
                              ]),
                              _: 2
                            }, 1032, ["to"]);
                          }), 128))
                        ])) : (vueExports.openBlock(), vueExports.createBlock("span", {
                          key: 1,
                          class: "text-slate-400"
                        }, "—"))
                      ];
                    }
                  }),
                  _: 1
                }, _parent2, _scopeId));
                _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_SharedFieldDisplay, { label: "Chức danh" }, {
                  default: vueExports.withCtx((_2, _push3, _parent3, _scopeId2) => {
                    if (_push3) {
                      if (vueExports.unref(account).job_title) {
                        _push3(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_NuxtLink, {
                          to: `/pmc/job-titles/${vueExports.unref(account).job_title.id}`,
                          class: "font-medium text-primary-600 hover:text-primary-800 hover:underline"
                        }, {
                          default: vueExports.withCtx((_3, _push4, _parent4, _scopeId3) => {
                            if (_push4) {
                              _push4(`${serverRenderer_cjs_prodExports.ssrInterpolate(vueExports.unref(account).job_title.name)}`);
                            } else {
                              return [
                                vueExports.createTextVNode(vueExports.toDisplayString(vueExports.unref(account).job_title.name), 1)
                              ];
                            }
                          }),
                          _: 1
                        }, _parent3, _scopeId2));
                      } else {
                        _push3(`<span class="text-slate-400"${_scopeId2}>—</span>`);
                      }
                    } else {
                      return [
                        vueExports.unref(account).job_title ? (vueExports.openBlock(), vueExports.createBlock(_component_NuxtLink, {
                          key: 0,
                          to: `/pmc/job-titles/${vueExports.unref(account).job_title.id}`,
                          class: "font-medium text-primary-600 hover:text-primary-800 hover:underline"
                        }, {
                          default: vueExports.withCtx(() => [
                            vueExports.createTextVNode(vueExports.toDisplayString(vueExports.unref(account).job_title.name), 1)
                          ]),
                          _: 1
                        }, 8, ["to"])) : (vueExports.openBlock(), vueExports.createBlock("span", {
                          key: 1,
                          class: "text-slate-400"
                        }, "—"))
                      ];
                    }
                  }),
                  _: 1
                }, _parent2, _scopeId));
                _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_SharedFieldDisplay, { label: "Vai trò" }, {
                  default: vueExports.withCtx((_2, _push3, _parent3, _scopeId2) => {
                    if (_push3) {
                      if (vueExports.unref(account).role) {
                        _push3(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_NuxtLink, {
                          to: `/pmc/roles/${vueExports.unref(account).role.id}`,
                          class: "font-medium text-primary-600 hover:text-primary-800 hover:underline"
                        }, {
                          default: vueExports.withCtx((_3, _push4, _parent4, _scopeId3) => {
                            if (_push4) {
                              _push4(`${serverRenderer_cjs_prodExports.ssrInterpolate(vueExports.unref(account).role.name)}`);
                            } else {
                              return [
                                vueExports.createTextVNode(vueExports.toDisplayString(vueExports.unref(account).role.name), 1)
                              ];
                            }
                          }),
                          _: 1
                        }, _parent3, _scopeId2));
                      } else {
                        _push3(`<span class="text-slate-400"${_scopeId2}>—</span>`);
                      }
                    } else {
                      return [
                        vueExports.unref(account).role ? (vueExports.openBlock(), vueExports.createBlock(_component_NuxtLink, {
                          key: 0,
                          to: `/pmc/roles/${vueExports.unref(account).role.id}`,
                          class: "font-medium text-primary-600 hover:text-primary-800 hover:underline"
                        }, {
                          default: vueExports.withCtx(() => [
                            vueExports.createTextVNode(vueExports.toDisplayString(vueExports.unref(account).role.name), 1)
                          ]),
                          _: 1
                        }, 8, ["to"])) : (vueExports.openBlock(), vueExports.createBlock("span", {
                          key: 1,
                          class: "text-slate-400"
                        }, "—"))
                      ];
                    }
                  }),
                  _: 1
                }, _parent2, _scopeId));
                _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_SharedFieldDisplay, { label: "Trạng thái" }, {
                  default: vueExports.withCtx((_2, _push3, _parent3, _scopeId2) => {
                    if (_push3) {
                      _push3(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_SharedStatusBadge, {
                        active: Boolean(vueExports.unref(account).is_active)
                      }, null, _parent3, _scopeId2));
                    } else {
                      return [
                        vueExports.createVNode(_component_SharedStatusBadge, {
                          active: Boolean(vueExports.unref(account).is_active)
                        }, null, 8, ["active"])
                      ];
                    }
                  }),
                  _: 1
                }, _parent2, _scopeId));
                _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_SharedFieldDisplay, { label: "Năng lực" }, {
                  default: vueExports.withCtx((_2, _push3, _parent3, _scopeId2) => {
                    if (_push3) {
                      _push3(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_SharedCapabilityRatingBadge, {
                        rating: vueExports.unref(account).capability_rating,
                        "show-when-null": "",
                        "null-label": "Chưa đánh giá"
                      }, null, _parent3, _scopeId2));
                    } else {
                      return [
                        vueExports.createVNode(_component_SharedCapabilityRatingBadge, {
                          rating: vueExports.unref(account).capability_rating,
                          "show-when-null": "",
                          "null-label": "Chưa đánh giá"
                        }, null, 8, ["rating"])
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
                        vueExports.createVNode("span", { class: "font-medium" }, vueExports.toDisplayString(vueExports.unref(account).name), 1)
                      ]),
                      _: 1
                    }),
                    vueExports.createVNode(_component_SharedFieldDisplay, { label: "Email" }, {
                      default: vueExports.withCtx(() => [
                        vueExports.createVNode("span", { class: "font-medium" }, vueExports.toDisplayString(vueExports.unref(account).email), 1)
                      ]),
                      _: 1
                    }),
                    vueExports.createVNode(_component_SharedFieldDisplay, { label: "Mã nhân viên" }, {
                      default: vueExports.withCtx(() => [
                        vueExports.createVNode("span", { class: "font-medium" }, vueExports.toDisplayString(vueExports.unref(account).employee_code ?? "—"), 1)
                      ]),
                      _: 1
                    }),
                    vueExports.createVNode(_component_SharedFieldDisplay, { label: "Giới tính" }, {
                      default: vueExports.withCtx(() => [
                        vueExports.createVNode("span", { class: "font-medium" }, vueExports.toDisplayString(vueExports.unref(account).gender?.label ?? "—"), 1)
                      ]),
                      _: 1
                    }),
                    vueExports.createVNode(_component_SharedFieldDisplay, { label: "Phòng ban" }, {
                      default: vueExports.withCtx(() => [
                        vueExports.unref(account).departments?.length ? (vueExports.openBlock(), vueExports.createBlock("div", {
                          key: 0,
                          class: "flex flex-wrap gap-2"
                        }, [
                          (vueExports.openBlock(true), vueExports.createBlock(vueExports.Fragment, null, vueExports.renderList(vueExports.unref(account).departments, (dept) => {
                            return vueExports.openBlock(), vueExports.createBlock(_component_NuxtLink, {
                              key: dept.id,
                              to: `/pmc/departments/${dept.id}`,
                              class: "font-medium text-primary-600 hover:text-primary-800 hover:underline"
                            }, {
                              default: vueExports.withCtx(() => [
                                vueExports.createTextVNode(vueExports.toDisplayString(dept.name), 1)
                              ]),
                              _: 2
                            }, 1032, ["to"]);
                          }), 128))
                        ])) : (vueExports.openBlock(), vueExports.createBlock("span", {
                          key: 1,
                          class: "text-slate-400"
                        }, "—"))
                      ]),
                      _: 1
                    }),
                    vueExports.createVNode(_component_SharedFieldDisplay, { label: "Chức danh" }, {
                      default: vueExports.withCtx(() => [
                        vueExports.unref(account).job_title ? (vueExports.openBlock(), vueExports.createBlock(_component_NuxtLink, {
                          key: 0,
                          to: `/pmc/job-titles/${vueExports.unref(account).job_title.id}`,
                          class: "font-medium text-primary-600 hover:text-primary-800 hover:underline"
                        }, {
                          default: vueExports.withCtx(() => [
                            vueExports.createTextVNode(vueExports.toDisplayString(vueExports.unref(account).job_title.name), 1)
                          ]),
                          _: 1
                        }, 8, ["to"])) : (vueExports.openBlock(), vueExports.createBlock("span", {
                          key: 1,
                          class: "text-slate-400"
                        }, "—"))
                      ]),
                      _: 1
                    }),
                    vueExports.createVNode(_component_SharedFieldDisplay, { label: "Vai trò" }, {
                      default: vueExports.withCtx(() => [
                        vueExports.unref(account).role ? (vueExports.openBlock(), vueExports.createBlock(_component_NuxtLink, {
                          key: 0,
                          to: `/pmc/roles/${vueExports.unref(account).role.id}`,
                          class: "font-medium text-primary-600 hover:text-primary-800 hover:underline"
                        }, {
                          default: vueExports.withCtx(() => [
                            vueExports.createTextVNode(vueExports.toDisplayString(vueExports.unref(account).role.name), 1)
                          ]),
                          _: 1
                        }, 8, ["to"])) : (vueExports.openBlock(), vueExports.createBlock("span", {
                          key: 1,
                          class: "text-slate-400"
                        }, "—"))
                      ]),
                      _: 1
                    }),
                    vueExports.createVNode(_component_SharedFieldDisplay, { label: "Trạng thái" }, {
                      default: vueExports.withCtx(() => [
                        vueExports.createVNode(_component_SharedStatusBadge, {
                          active: Boolean(vueExports.unref(account).is_active)
                        }, null, 8, ["active"])
                      ]),
                      _: 1
                    }),
                    vueExports.createVNode(_component_SharedFieldDisplay, { label: "Năng lực" }, {
                      default: vueExports.withCtx(() => [
                        vueExports.createVNode(_component_SharedCapabilityRatingBadge, {
                          rating: vueExports.unref(account).capability_rating,
                          "show-when-null": "",
                          "null-label": "Chưa đánh giá"
                        }, null, 8, ["rating"])
                      ]),
                      _: 1
                    })
                  ])
                ];
              }
            }),
            _: 1
          }, _parent));
          _push(`<div class="grid grid-cols-1 lg:grid-cols-2 gap-6">`);
          _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_SharedSectionCard, { title: "Thông tin ngân hàng" }, {
            "header-actions": vueExports.withCtx((_, _push2, _parent2, _scopeId) => {
              if (_push2) {
                if (vueExports.unref(account).bank_info) {
                  _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UBadge, {
                    label: "Đã cấu hình",
                    color: "success",
                    variant: "subtle",
                    size: "sm"
                  }, null, _parent2, _scopeId));
                } else {
                  _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UBadge, {
                    label: "Chưa cấu hình",
                    color: "neutral",
                    variant: "subtle",
                    size: "sm"
                  }, null, _parent2, _scopeId));
                }
              } else {
                return [
                  vueExports.unref(account).bank_info ? (vueExports.openBlock(), vueExports.createBlock(_component_UBadge, {
                    key: 0,
                    label: "Đã cấu hình",
                    color: "success",
                    variant: "subtle",
                    size: "sm"
                  })) : (vueExports.openBlock(), vueExports.createBlock(_component_UBadge, {
                    key: 1,
                    label: "Chưa cấu hình",
                    color: "neutral",
                    variant: "subtle",
                    size: "sm"
                  }))
                ];
              }
            }),
            default: vueExports.withCtx((_, _push2, _parent2, _scopeId) => {
              if (_push2) {
                if (vueExports.unref(account).bank_info) {
                  _push2(`<div class="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between"${_scopeId}><div class="grid grid-cols-1 gap-5 flex-1 min-w-0"${_scopeId}>`);
                  _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_SharedFieldDisplay, { label: "Ngân hàng" }, {
                    default: vueExports.withCtx((_2, _push3, _parent3, _scopeId2) => {
                      if (_push3) {
                        _push3(`<span class="font-medium"${_scopeId2}>${serverRenderer_cjs_prodExports.ssrInterpolate(vueExports.unref(account).bank_info.label || "—")}</span><span class="text-xs text-slate-400 ml-2 font-mono"${_scopeId2}>(${serverRenderer_cjs_prodExports.ssrInterpolate(vueExports.unref(account).bank_info.bin)})</span>`);
                      } else {
                        return [
                          vueExports.createVNode("span", { class: "font-medium" }, vueExports.toDisplayString(vueExports.unref(account).bank_info.label || "—"), 1),
                          vueExports.createVNode("span", { class: "text-xs text-slate-400 ml-2 font-mono" }, "(" + vueExports.toDisplayString(vueExports.unref(account).bank_info.bin) + ")", 1)
                        ];
                      }
                    }),
                    _: 1
                  }, _parent2, _scopeId));
                  _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_SharedFieldDisplay, { label: "Số tài khoản" }, {
                    default: vueExports.withCtx((_2, _push3, _parent3, _scopeId2) => {
                      if (_push3) {
                        _push3(`<span class="font-mono font-medium"${_scopeId2}>${serverRenderer_cjs_prodExports.ssrInterpolate(vueExports.unref(account).bank_info.account_number)}</span>`);
                      } else {
                        return [
                          vueExports.createVNode("span", { class: "font-mono font-medium" }, vueExports.toDisplayString(vueExports.unref(account).bank_info.account_number), 1)
                        ];
                      }
                    }),
                    _: 1
                  }, _parent2, _scopeId));
                  _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_SharedFieldDisplay, { label: "Chủ tài khoản" }, {
                    default: vueExports.withCtx((_2, _push3, _parent3, _scopeId2) => {
                      if (_push3) {
                        _push3(`<span class="font-medium uppercase"${_scopeId2}>${serverRenderer_cjs_prodExports.ssrInterpolate(vueExports.unref(account).bank_info.account_name)}</span>`);
                      } else {
                        return [
                          vueExports.createVNode("span", { class: "font-medium uppercase" }, vueExports.toDisplayString(vueExports.unref(account).bank_info.account_name), 1)
                        ];
                      }
                    }),
                    _: 1
                  }, _parent2, _scopeId));
                  _push2(`</div>`);
                  if (vueExports.unref(bankQrUrl)) {
                    _push2(`<div class="flex flex-col items-center gap-2 shrink-0"${_scopeId}><img${serverRenderer_cjs_prodExports.ssrRenderAttr("src", vueExports.unref(bankQrUrl))}${serverRenderer_cjs_prodExports.ssrRenderAttr("alt", `QR ngân hàng ${vueExports.unref(account).name}`)} class="w-[220px] rounded-lg border border-slate-200 bg-white" width="220" height="280" loading="lazy"${_scopeId}><p class="text-[11px] text-slate-400 text-center max-w-[220px]"${_scopeId}> Quét bằng app ngân hàng để chuyển khoản (VietQR) </p></div>`);
                  } else {
                    _push2(`<!---->`);
                  }
                  _push2(`</div>`);
                } else {
                  _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UAlert, {
                    icon: "i-lucide-info",
                    color: "neutral",
                    variant: "subtle",
                    title: "Chưa cấu hình thông tin ngân hàng",
                    description: "Cấu hình STK để hệ thống sinh QR khi chuyển tiền ứng vật tư hoặc tiền hoa hồng cho nhân sự."
                  }, null, _parent2, _scopeId));
                }
              } else {
                return [
                  vueExports.unref(account).bank_info ? (vueExports.openBlock(), vueExports.createBlock("div", {
                    key: 0,
                    class: "flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between"
                  }, [
                    vueExports.createVNode("div", { class: "grid grid-cols-1 gap-5 flex-1 min-w-0" }, [
                      vueExports.createVNode(_component_SharedFieldDisplay, { label: "Ngân hàng" }, {
                        default: vueExports.withCtx(() => [
                          vueExports.createVNode("span", { class: "font-medium" }, vueExports.toDisplayString(vueExports.unref(account).bank_info.label || "—"), 1),
                          vueExports.createVNode("span", { class: "text-xs text-slate-400 ml-2 font-mono" }, "(" + vueExports.toDisplayString(vueExports.unref(account).bank_info.bin) + ")", 1)
                        ]),
                        _: 1
                      }),
                      vueExports.createVNode(_component_SharedFieldDisplay, { label: "Số tài khoản" }, {
                        default: vueExports.withCtx(() => [
                          vueExports.createVNode("span", { class: "font-mono font-medium" }, vueExports.toDisplayString(vueExports.unref(account).bank_info.account_number), 1)
                        ]),
                        _: 1
                      }),
                      vueExports.createVNode(_component_SharedFieldDisplay, { label: "Chủ tài khoản" }, {
                        default: vueExports.withCtx(() => [
                          vueExports.createVNode("span", { class: "font-medium uppercase" }, vueExports.toDisplayString(vueExports.unref(account).bank_info.account_name), 1)
                        ]),
                        _: 1
                      })
                    ]),
                    vueExports.unref(bankQrUrl) ? (vueExports.openBlock(), vueExports.createBlock("div", {
                      key: 0,
                      class: "flex flex-col items-center gap-2 shrink-0"
                    }, [
                      vueExports.createVNode("img", {
                        src: vueExports.unref(bankQrUrl),
                        alt: `QR ngân hàng ${vueExports.unref(account).name}`,
                        class: "w-[220px] rounded-lg border border-slate-200 bg-white",
                        width: "220",
                        height: "280",
                        loading: "lazy"
                      }, null, 8, ["src", "alt"]),
                      vueExports.createVNode("p", { class: "text-[11px] text-slate-400 text-center max-w-[220px]" }, " Quét bằng app ngân hàng để chuyển khoản (VietQR) ")
                    ])) : vueExports.createCommentVNode("", true)
                  ])) : (vueExports.openBlock(), vueExports.createBlock(_component_UAlert, {
                    key: 1,
                    icon: "i-lucide-info",
                    color: "neutral",
                    variant: "subtle",
                    title: "Chưa cấu hình thông tin ngân hàng",
                    description: "Cấu hình STK để hệ thống sinh QR khi chuyển tiền ứng vật tư hoặc tiền hoa hồng cho nhân sự."
                  }))
                ];
              }
            }),
            _: 1
          }, _parent));
          _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_SharedSectionCard, { title: "Dự án tham gia" }, {
            "header-actions": vueExports.withCtx((_, _push2, _parent2, _scopeId) => {
              if (_push2) {
                _push2(`<span class="text-xs text-slate-500"${_scopeId}>${serverRenderer_cjs_prodExports.ssrInterpolate(vueExports.unref(account).projects?.length ?? 0)} dự án </span>`);
              } else {
                return [
                  vueExports.createVNode("span", { class: "text-xs text-slate-500" }, vueExports.toDisplayString(vueExports.unref(account).projects?.length ?? 0) + " dự án ", 1)
                ];
              }
            }),
            default: vueExports.withCtx((_, _push2, _parent2, _scopeId) => {
              if (_push2) {
                if (vueExports.unref(account).projects?.length) {
                  _push2(`<div class="flex flex-wrap gap-2"${_scopeId}><!--[-->`);
                  serverRenderer_cjs_prodExports.ssrRenderList(vueExports.unref(account).projects, (project) => {
                    _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_NuxtLink, {
                      key: project.id,
                      to: `/pmc/projects/${project.id}`
                    }, {
                      default: vueExports.withCtx((_2, _push3, _parent3, _scopeId2) => {
                        if (_push3) {
                          _push3(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UBadge, {
                            label: project.name,
                            color: "primary",
                            variant: "subtle",
                            size: "md",
                            class: "cursor-pointer hover:opacity-80"
                          }, null, _parent3, _scopeId2));
                        } else {
                          return [
                            vueExports.createVNode(_component_UBadge, {
                              label: project.name,
                              color: "primary",
                              variant: "subtle",
                              size: "md",
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
                  _push2(`<div class="py-6 text-center"${_scopeId}>`);
                  _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UIcon, {
                    name: "i-lucide-folder-open",
                    class: "text-slate-300 size-10 mx-auto mb-3"
                  }, null, _parent2, _scopeId));
                  _push2(`<p class="text-sm text-slate-500"${_scopeId}> Chưa tham gia dự án nào </p></div>`);
                }
              } else {
                return [
                  vueExports.unref(account).projects?.length ? (vueExports.openBlock(), vueExports.createBlock("div", {
                    key: 0,
                    class: "flex flex-wrap gap-2"
                  }, [
                    (vueExports.openBlock(true), vueExports.createBlock(vueExports.Fragment, null, vueExports.renderList(vueExports.unref(account).projects, (project) => {
                      return vueExports.openBlock(), vueExports.createBlock(_component_NuxtLink, {
                        key: project.id,
                        to: `/pmc/projects/${project.id}`
                      }, {
                        default: vueExports.withCtx(() => [
                          vueExports.createVNode(_component_UBadge, {
                            label: project.name,
                            color: "primary",
                            variant: "subtle",
                            size: "md",
                            class: "cursor-pointer hover:opacity-80"
                          }, null, 8, ["label"])
                        ]),
                        _: 2
                      }, 1032, ["to"]);
                    }), 128))
                  ])) : (vueExports.openBlock(), vueExports.createBlock("div", {
                    key: 1,
                    class: "py-6 text-center"
                  }, [
                    vueExports.createVNode(_component_UIcon, {
                      name: "i-lucide-folder-open",
                      class: "text-slate-300 size-10 mx-auto mb-3"
                    }),
                    vueExports.createVNode("p", { class: "text-sm text-slate-500" }, " Chưa tham gia dự án nào ")
                  ]))
                ];
              }
            }),
            _: 1
          }, _parent));
          _push(`</div></div>`);
        } else if (vueExports.unref(activeTab) === "tickets") {
          _push(`<div class="flex flex-col gap-6">`);
          _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_SharedSectionCard, { title: "Ticket được giao" }, {
            "header-actions": vueExports.withCtx((_, _push2, _parent2, _scopeId) => {
              if (_push2) {
                _push2(`<span class="text-xs text-slate-500"${_scopeId}>${serverRenderer_cjs_prodExports.ssrInterpolate(vueExports.unref(assignedTickets).length)} ticket </span>`);
              } else {
                return [
                  vueExports.createVNode("span", { class: "text-xs text-slate-500" }, vueExports.toDisplayString(vueExports.unref(assignedTickets).length) + " ticket ", 1)
                ];
              }
            }),
            default: vueExports.withCtx((_, _push2, _parent2, _scopeId) => {
              if (_push2) {
                if (vueExports.unref(ticketStatus) === "pending") {
                  _push2(`<div class="py-6 flex justify-center"${_scopeId}>`);
                  _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UIcon, {
                    name: "i-lucide-loader-2",
                    class: "size-5 animate-spin text-slate-400"
                  }, null, _parent2, _scopeId));
                  _push2(`</div>`);
                } else if (vueExports.unref(assignedTickets).length) {
                  _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UTable, {
                    data: vueExports.unref(assignedTickets),
                    columns: ticketColumns,
                    ui: { tr: "cursor-pointer hover:bg-slate-50" }
                  }, {
                    "code-cell": vueExports.withCtx(({ row }, _push3, _parent3, _scopeId2) => {
                      if (_push3) {
                        _push3(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_NuxtLink, {
                          to: `/pmc/og-tickets/${row.original.id}`,
                          class: "font-medium text-primary-600 hover:underline"
                        }, {
                          default: vueExports.withCtx((_2, _push4, _parent4, _scopeId3) => {
                            if (_push4) {
                              _push4(`${serverRenderer_cjs_prodExports.ssrInterpolate(row.original.code ?? `#${row.original.id}`)}`);
                            } else {
                              return [
                                vueExports.createTextVNode(vueExports.toDisplayString(row.original.code ?? `#${row.original.id}`), 1)
                              ];
                            }
                          }),
                          _: 2
                        }, _parent3, _scopeId2));
                      } else {
                        return [
                          vueExports.createVNode(_component_NuxtLink, {
                            to: `/pmc/og-tickets/${row.original.id}`,
                            class: "font-medium text-primary-600 hover:underline"
                          }, {
                            default: vueExports.withCtx(() => [
                              vueExports.createTextVNode(vueExports.toDisplayString(row.original.code ?? `#${row.original.id}`), 1)
                            ]),
                            _: 2
                          }, 1032, ["to"])
                        ];
                      }
                    }),
                    "subject-cell": vueExports.withCtx(({ row }, _push3, _parent3, _scopeId2) => {
                      if (_push3) {
                        _push3(`<span class="line-clamp-1 max-w-xs"${_scopeId2}>${serverRenderer_cjs_prodExports.ssrInterpolate(row.original.subject)}</span>`);
                      } else {
                        return [
                          vueExports.createVNode("span", { class: "line-clamp-1 max-w-xs" }, vueExports.toDisplayString(row.original.subject), 1)
                        ];
                      }
                    }),
                    "project-cell": vueExports.withCtx(({ row }, _push3, _parent3, _scopeId2) => {
                      if (_push3) {
                        _push3(`${serverRenderer_cjs_prodExports.ssrInterpolate(row.original.project?.name ?? "—")}`);
                      } else {
                        return [
                          vueExports.createTextVNode(vueExports.toDisplayString(row.original.project?.name ?? "—"), 1)
                        ];
                      }
                    }),
                    "status-cell": vueExports.withCtx(({ row }, _push3, _parent3, _scopeId2) => {
                      if (_push3) {
                        _push3(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UBadge, {
                          label: row.original.status.label,
                          color: ("ogTicketStatusColor" in _ctx ? _ctx.ogTicketStatusColor : vueExports.unref(ogTicketStatusColor))(row.original.status.value),
                          variant: "subtle",
                          size: "sm"
                        }, null, _parent3, _scopeId2));
                      } else {
                        return [
                          vueExports.createVNode(_component_UBadge, {
                            label: row.original.status.label,
                            color: ("ogTicketStatusColor" in _ctx ? _ctx.ogTicketStatusColor : vueExports.unref(ogTicketStatusColor))(row.original.status.value),
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
                          color: ("ogTicketPriorityColor" in _ctx ? _ctx.ogTicketPriorityColor : vueExports.unref(ogTicketPriorityColor))(row.original.priority.value),
                          variant: "subtle",
                          size: "sm"
                        }, null, _parent3, _scopeId2));
                      } else {
                        return [
                          vueExports.createVNode(_component_UBadge, {
                            label: row.original.priority.label,
                            color: ("ogTicketPriorityColor" in _ctx ? _ctx.ogTicketPriorityColor : vueExports.unref(ogTicketPriorityColor))(row.original.priority.value),
                            variant: "subtle",
                            size: "sm"
                          }, null, 8, ["label", "color"])
                        ];
                      }
                    }),
                    "received_at-cell": vueExports.withCtx(({ row }, _push3, _parent3, _scopeId2) => {
                      if (_push3) {
                        _push3(`<span class="text-sm text-slate-500"${_scopeId2}>${serverRenderer_cjs_prodExports.ssrInterpolate(("formatDateTime" in _ctx ? _ctx.formatDateTime : vueExports.unref(formatDateTime))(row.original.received_at ?? null))}</span>`);
                      } else {
                        return [
                          vueExports.createVNode("span", { class: "text-sm text-slate-500" }, vueExports.toDisplayString(("formatDateTime" in _ctx ? _ctx.formatDateTime : vueExports.unref(formatDateTime))(row.original.received_at ?? null)), 1)
                        ];
                      }
                    }),
                    _: 1
                  }, _parent2, _scopeId));
                } else {
                  _push2(`<div class="py-6 text-center"${_scopeId}>`);
                  _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UIcon, {
                    name: "i-lucide-ticket",
                    class: "text-slate-300 size-10 mx-auto mb-3"
                  }, null, _parent2, _scopeId));
                  _push2(`<p class="text-sm text-slate-500"${_scopeId}> Chưa có ticket nào được giao </p></div>`);
                }
              } else {
                return [
                  vueExports.unref(ticketStatus) === "pending" ? (vueExports.openBlock(), vueExports.createBlock("div", {
                    key: 0,
                    class: "py-6 flex justify-center"
                  }, [
                    vueExports.createVNode(_component_UIcon, {
                      name: "i-lucide-loader-2",
                      class: "size-5 animate-spin text-slate-400"
                    })
                  ])) : vueExports.unref(assignedTickets).length ? (vueExports.openBlock(), vueExports.createBlock(_component_UTable, {
                    key: 1,
                    data: vueExports.unref(assignedTickets),
                    columns: ticketColumns,
                    ui: { tr: "cursor-pointer hover:bg-slate-50" }
                  }, {
                    "code-cell": vueExports.withCtx(({ row }) => [
                      vueExports.createVNode(_component_NuxtLink, {
                        to: `/pmc/og-tickets/${row.original.id}`,
                        class: "font-medium text-primary-600 hover:underline"
                      }, {
                        default: vueExports.withCtx(() => [
                          vueExports.createTextVNode(vueExports.toDisplayString(row.original.code ?? `#${row.original.id}`), 1)
                        ]),
                        _: 2
                      }, 1032, ["to"])
                    ]),
                    "subject-cell": vueExports.withCtx(({ row }) => [
                      vueExports.createVNode("span", { class: "line-clamp-1 max-w-xs" }, vueExports.toDisplayString(row.original.subject), 1)
                    ]),
                    "project-cell": vueExports.withCtx(({ row }) => [
                      vueExports.createTextVNode(vueExports.toDisplayString(row.original.project?.name ?? "—"), 1)
                    ]),
                    "status-cell": vueExports.withCtx(({ row }) => [
                      vueExports.createVNode(_component_UBadge, {
                        label: row.original.status.label,
                        color: ("ogTicketStatusColor" in _ctx ? _ctx.ogTicketStatusColor : vueExports.unref(ogTicketStatusColor))(row.original.status.value),
                        variant: "subtle",
                        size: "sm"
                      }, null, 8, ["label", "color"])
                    ]),
                    "priority-cell": vueExports.withCtx(({ row }) => [
                      vueExports.createVNode(_component_UBadge, {
                        label: row.original.priority.label,
                        color: ("ogTicketPriorityColor" in _ctx ? _ctx.ogTicketPriorityColor : vueExports.unref(ogTicketPriorityColor))(row.original.priority.value),
                        variant: "subtle",
                        size: "sm"
                      }, null, 8, ["label", "color"])
                    ]),
                    "received_at-cell": vueExports.withCtx(({ row }) => [
                      vueExports.createVNode("span", { class: "text-sm text-slate-500" }, vueExports.toDisplayString(("formatDateTime" in _ctx ? _ctx.formatDateTime : vueExports.unref(formatDateTime))(row.original.received_at ?? null)), 1)
                    ]),
                    _: 1
                  }, 8, ["data"])) : (vueExports.openBlock(), vueExports.createBlock("div", {
                    key: 2,
                    class: "py-6 text-center"
                  }, [
                    vueExports.createVNode(_component_UIcon, {
                      name: "i-lucide-ticket",
                      class: "text-slate-300 size-10 mx-auto mb-3"
                    }),
                    vueExports.createVNode("p", { class: "text-sm text-slate-500" }, " Chưa có ticket nào được giao ")
                  ]))
                ];
              }
            }),
            _: 1
          }, _parent));
          _push(`</div>`);
        } else if (vueExports.unref(activeTab) === "schedule") {
          _push(`<div class="flex flex-col gap-6">`);
          _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_SharedSectionCard, { title: "Lịch làm việc cá nhân" }, {
            default: vueExports.withCtx((_, _push2, _parent2, _scopeId) => {
              if (_push2) {
                _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_SharedAccountSchedulePanel, { "account-id": vueExports.unref(id) }, null, _parent2, _scopeId));
              } else {
                return [
                  vueExports.createVNode(_component_SharedAccountSchedulePanel, { "account-id": vueExports.unref(id) }, null, 8, ["account-id"])
                ];
              }
            }),
            _: 1
          }, _parent));
          _push(`</div>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</div>`);
      } else {
        _push(`<!---->`);
      }
      _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_AccountFormModal, {
        open: vueExports.unref(showFormModal),
        "onUpdate:open": ($event) => vueExports.isRef(showFormModal) ? showFormModal.value = $event : null,
        mode: vueExports.unref(formMode),
        item: vueExports.unref(editTarget),
        loading: vueExports.unref(isUpdating),
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/pmc/accounts/[id].vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=_id_-_i4OYhln.mjs.map
