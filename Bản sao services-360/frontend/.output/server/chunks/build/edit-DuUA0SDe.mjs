import { v as vueExports, p as useRoute$1, u as useSeoMeta, q as navigateTo, s as serverRenderer_cjs_prodExports, l as _sfc_main$c, k as _sfc_main$h, _ as __nuxt_component_0$4 } from './server.mjs';
import { _ as __nuxt_component_2 } from './PageError-kZWsA9dh.mjs';
import { _ as __nuxt_component_4 } from './SectionCard-CH-mG9Mf.mjs';
import { _ as _sfc_main$1 } from './Input-JXN8po_F.mjs';
import { _ as _sfc_main$2 } from './Badge-W93D3Jpz.mjs';
import { _ as _sfc_main$3 } from './Textarea-DTCNHwKm.mjs';
import { _ as _sfc_main$4 } from './Alert-tTsPKADX.mjs';
import { _ as __nuxt_component_3 } from './ProjectSelect-BTBiFCd5.mjs';
import { _ as __nuxt_component_9 } from './AddressMapPicker-jpXrfuln.mjs';
import { _ as _sfc_main$5 } from './Select-CZE7Ef6n.mjs';
import { _ as _sfc_main$6 } from './SelectMenu-DKHEMZj7.mjs';
import { _ as __nuxt_component_1 } from './CapabilityRatingBadge-BBWBj9qN.mjs';
import { _ as __nuxt_component_5 } from './FieldDisplay-BM6nmr2i.mjs';
import { _ as __nuxt_component_21 } from './OgTicketCategoryModal-vqxLvQYn.mjs';
import { f as formatPhone } from './phone-DErPjpTB.mjs';
import { i as isImageMime, f as formatFileSize, A as ATTACHMENT_MAX_FILES, b as ATTACHMENT_MAX_FILE_SIZE, a as ATTACHMENT_ALLOWED_TYPES } from './file-DEnEYJZ3.mjs';
import { f as formatDateTime, u as utcToLocal, l as localToUtc } from './date-R5YK0ast.mjs';
import { b as useOgTicketDetail, O as OG_TICKET_PRIORITY_OPTIONS, a as ogTicketStatusColor, o as ogTicketPriorityColor, c as apiUpdateOgTicket } from './useOgTickets-DPRh9tlL.mjs';
import { Z as Zl } from './vue-datepicker-6F5-CyxW.mjs';
import { d as useAccountList } from './useAccounts-BDWM8ZpB.mjs';
import { S as SELECT_ALL_PER_PAGE } from './constants-G9YmtWtp.mjs';
import { e as apiGetProject } from './useProjects-D4K3VYdb.mjs';
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
import './apiError-DBrxF9au.mjs';
import './index-QmZAbLx-.mjs';
import './useEntitySelect-DG9pQ_n0.mjs';
import './useDirection-CXYby7CP.mjs';
import './useFormControl-_Lqv8ipK.mjs';
import './PopperArrow-C9hHWuSZ.mjs';
import './FocusScope-BZehoQSg.mjs';
import './useFocusGuards-CJykkUFH.mjs';
import './utils-DY0Zag2O.mjs';
import './handleAndDispatchCustomEvent-Bk_AVSSo.mjs';
import './useKbd-JjFOu4f7.mjs';
import './utils-BgcT7rQQ.mjs';
import './VisuallyHiddenInput-q6Pz-w0i.mjs';
import './index-CSThDD3J.mjs';
import './Modal-BimZZbNl.mjs';
import './DialogTrigger-C3iwCYMu.mjs';
import './DialogClose-DGkUxau7.mjs';
import './Checkbox-Cp_FPUkd.mjs';
import './RovingFocusItem-DwKRAYZk.mjs';
import './RovingFocusGroup-Vsbo7D6E.mjs';
import './Label-BBgw4vHh.mjs';

const _sfc_main = /* @__PURE__ */ vueExports.defineComponent({
  __name: "edit",
  __ssrInlineRender: true,
  setup(__props) {
    const route = useRoute$1();
    const id = vueExports.computed(() => Number(route.params.id));
    const { data, status, error, refresh } = useOgTicketDetail(id);
    const ogTicket = vueExports.computed(() => data.value?.data);
    useSeoMeta({
      title: vueExports.computed(
        () => ogTicket.value ? `Chỉnh sửa: ${ogTicket.value.subject} - Thần Nông` : "Chỉnh sửa OG Ticket"
      )
    });
    vueExports.watch(ogTicket, (ticket) => {
      if (ticket?.status.value === "cancelled") {
        navigateTo(`/pmc/og-tickets/${id.value}`);
      }
    }, { immediate: true });
    const form = vueExports.reactive({
      priority: "normal",
      received_by_id: null,
      assigned_to_ids: [],
      sla_quote_due_at: null,
      sla_completion_due_at: null,
      internal_note: null,
      subject: "",
      description: null,
      address: null,
      latitude: null,
      longitude: null,
      apartment_name: null,
      project_id: null
    });
    function syncFormFromTicket() {
      const ticket = ogTicket.value;
      if (!ticket) return;
      form.priority = ticket.priority.value;
      form.received_by_id = ticket.received_by?.id ?? null;
      form.assigned_to_ids = (ticket.assignees ?? []).map((a) => a.id);
      form.sla_quote_due_at = utcToLocal(ticket.sla_quote_due_at);
      form.sla_completion_due_at = utcToLocal(ticket.sla_completion_due_at);
      form.internal_note = ticket.internal_note;
      form.subject = ticket.subject;
      form.description = ticket.description ?? null;
      form.address = ticket.address ?? null;
      form.latitude = ticket.latitude != null ? Number(ticket.latitude) : null;
      form.longitude = ticket.longitude != null ? Number(ticket.longitude) : null;
      form.apartment_name = ticket.apartment_name ?? null;
      form.project_id = ticket.project?.id ?? null;
      newFiles.value = [];
      deleteFileIds.value = [];
    }
    const newFiles = vueExports.ref([]);
    const deleteFileIds = vueExports.ref([]);
    const fileInputRef = vueExports.ref(null);
    vueExports.watch(ogTicket, () => syncFormFromTicket(), { immediate: true });
    const existingOgAttachments = vueExports.computed(
      () => (ogTicket.value?.attachments ?? []).filter((a) => !deleteFileIds.value.includes(a.id))
    );
    const categoriesModalOpen = vueExports.ref(false);
    const selectedCategoryIds = vueExports.computed(() => (ogTicket.value?.categories ?? []).map((c) => c.id));
    function openCategoriesModal() {
      categoriesModalOpen.value = true;
    }
    async function handleCategoriesSaved() {
      await refresh();
    }
    const totalFileCount = vueExports.computed(() => existingOgAttachments.value.length + newFiles.value.length);
    function handleFileSelect(event) {
      const input = event.target;
      if (!input.files) return;
      for (const file of Array.from(input.files)) {
        if (totalFileCount.value >= ATTACHMENT_MAX_FILES) break;
        if (file.size > ATTACHMENT_MAX_FILE_SIZE || !ATTACHMENT_ALLOWED_TYPES.includes(file.type)) continue;
        newFiles.value.push(file);
      }
      input.value = "";
    }
    function removeNewFile(index) {
      newFiles.value.splice(index, 1);
    }
    function markDeleteExisting(fileId) {
      deleteFileIds.value.push(fileId);
    }
    function undoDeleteExisting(fileId) {
      deleteFileIds.value = deleteFileIds.value.filter((i) => i !== fileId);
    }
    const priorityOptions = OG_TICKET_PRIORITY_OPTIONS;
    const isCompleted = vueExports.computed(() => ogTicket.value?.status.value === "completed");
    const isSlaQuoteViolated = vueExports.computed(() => {
      if (!ogTicket.value?.sla_quote_due_at) return false;
      if (isCompleted.value) return false;
      return new Date(ogTicket.value.sla_quote_due_at) < /* @__PURE__ */ new Date();
    });
    const isSlaCompletionViolated = vueExports.computed(() => {
      if (!ogTicket.value?.sla_completion_due_at) return false;
      if (isCompleted.value) return false;
      return new Date(ogTicket.value.sla_completion_due_at) < /* @__PURE__ */ new Date();
    });
    const { data: accountsData } = useAccountList(vueExports.computed(() => ({ per_page: SELECT_ALL_PER_PAGE })));
    const projectId = vueExports.computed(() => form.project_id);
    const projectMemberIds = vueExports.ref(/* @__PURE__ */ new Set());
    vueExports.watch(projectId, async (id2) => {
      if (!id2) {
        projectMemberIds.value = /* @__PURE__ */ new Set();
        return;
      }
      try {
        const res = await apiGetProject(id2);
        projectMemberIds.value = new Set((res.data.accounts ?? []).map((a) => a.id));
      } catch {
        projectMemberIds.value = /* @__PURE__ */ new Set();
      }
    }, { immediate: true });
    const accountOptions = vueExports.computed(() => {
      const all = (accountsData.value?.data ?? []).map((acc) => ({
        label: acc.name,
        value: acc.id
      }));
      if (!projectMemberIds.value.size) return all;
      const members = all.filter((a) => projectMemberIds.value.has(a.value));
      const others = all.filter((a) => !projectMemberIds.value.has(a.value));
      if (!members.length) return all;
      return [
        ...members.map((m) => ({ ...m, label: `${m.label} (Thuộc dự án)` })),
        ...others
      ];
    });
    const crud = useCrudModals();
    const { isSubmitting: isSaving, submitForm } = useCrudSubmit(crud, refresh);
    async function handleSave() {
      crud.formMode.value = "edit";
      crud.editTarget.value = ogTicket.value ?? null;
      const payload = {
        ...form,
        assigned_to_ids: form.assigned_to_ids,
        sla_quote_due_at: localToUtc(form.sla_quote_due_at ?? null),
        sla_completion_due_at: localToUtc(form.sla_completion_due_at ?? null),
        attachments: newFiles.value.length > 0 ? newFiles.value : void 0,
        delete_attachment_ids: deleteFileIds.value.length > 0 ? deleteFileIds.value : void 0
      };
      await submitForm(
        null,
        () => apiUpdateOgTicket(id.value, payload),
        { update: "Cập nhật thành công" }
      );
      navigateTo(`/pmc/og-tickets/${id.value}`);
    }
    function handleCancel() {
      navigateTo(`/pmc/og-tickets/${id.value}`);
    }
    return (_ctx, _push, _parent, _attrs) => {
      const _component_UButton = _sfc_main$c;
      const _component_SharedCrudPageError = __nuxt_component_2;
      const _component_SharedSectionCard = __nuxt_component_4;
      const _component_UInput = _sfc_main$1;
      const _component_UBadge = _sfc_main$2;
      const _component_UTextarea = _sfc_main$3;
      const _component_UIcon = _sfc_main$h;
      const _component_UAlert = _sfc_main$4;
      const _component_NuxtLink = __nuxt_component_0$4;
      const _component_SharedProjectSelect = __nuxt_component_3;
      const _component_SharedAddressMapPicker = __nuxt_component_9;
      const _component_USelect = _sfc_main$5;
      const _component_USelectMenu = _sfc_main$6;
      const _component_SharedCapabilityRatingBadge = __nuxt_component_1;
      const _component_SharedFieldDisplay = __nuxt_component_5;
      const _component_SharedOgTicketCategoryModal = __nuxt_component_21;
      _push(`<div${serverRenderer_cjs_prodExports.ssrRenderAttrs(_attrs)}><div class="mb-6 flex items-start justify-between gap-4"><div class="flex items-center gap-4">`);
      _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UButton, {
        icon: "i-lucide-arrow-left",
        color: "neutral",
        variant: "ghost",
        to: `/pmc/og-tickets/${vueExports.unref(id)}`
      }, null, _parent));
      _push(`<div><h1 class="text-2xl font-black text-slate-900 tracking-tight"> Chỉnh sửa OG Ticket </h1><p class="text-slate-500 text-sm mt-0.5">${serverRenderer_cjs_prodExports.ssrInterpolate(vueExports.unref(ogTicket)?.subject ?? "...")}</p></div></div>`);
      if (vueExports.unref(ogTicket)) {
        _push(`<div class="flex items-center gap-2 shrink-0">`);
        _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UButton, {
          label: "Hủy",
          color: "neutral",
          variant: "ghost",
          onClick: handleCancel
        }, null, _parent));
        _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UButton, {
          label: "Lưu thay đổi",
          icon: "i-lucide-save",
          color: "primary",
          loading: vueExports.unref(isSaving),
          onClick: handleSave
        }, null, _parent));
        _push(`</div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div>`);
      if (vueExports.unref(status) === "pending") {
        _push(`<div class="flex flex-col gap-4"><!--[-->`);
        serverRenderer_cjs_prodExports.ssrRenderList(3, (i) => {
          _push(`<div class="h-28 bg-slate-100 rounded-xl animate-pulse"></div>`);
        });
        _push(`<!--]--></div>`);
      } else if (vueExports.unref(error)) {
        _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_SharedCrudPageError, {
          error: vueExports.unref(error),
          retry: vueExports.unref(refresh)
        }, null, _parent));
      } else if (vueExports.unref(ogTicket)) {
        _push(`<div class="grid grid-cols-1 lg:grid-cols-3 gap-6"><div class="lg:col-span-2 flex flex-col gap-6">`);
        _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_SharedSectionCard, { title: "Thông tin ticket" }, {
          default: vueExports.withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`<div class="grid grid-cols-1 sm:grid-cols-2 gap-4"${_scopeId}><div${_scopeId}><p class="text-xs font-medium text-slate-500 mb-1.5"${_scopeId}> Tiêu đề </p>`);
              _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UInput, {
                modelValue: vueExports.unref(form).subject,
                "onUpdate:modelValue": ($event) => vueExports.unref(form).subject = $event,
                class: "w-full"
              }, null, _parent2, _scopeId));
              _push2(`</div><div${_scopeId}><p class="text-xs font-medium text-slate-500 mb-1.5"${_scopeId}> Kênh tiếp nhận </p><div class="flex items-center h-9"${_scopeId}>`);
              _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UBadge, {
                label: vueExports.unref(ogTicket).channel?.label,
                color: "neutral",
                variant: "subtle",
                size: "sm"
              }, null, _parent2, _scopeId));
              _push2(`</div></div><div class="sm:col-span-2"${_scopeId}><p class="text-xs font-medium text-slate-500 mb-1.5"${_scopeId}> Mô tả </p>`);
              _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UTextarea, {
                modelValue: vueExports.unref(form).description,
                "onUpdate:modelValue": ($event) => vueExports.unref(form).description = $event,
                rows: 3,
                class: "w-full",
                placeholder: "Mô tả chi tiết..."
              }, null, _parent2, _scopeId));
              _push2(`</div><div${_scopeId}><p class="text-xs font-medium text-slate-500 mb-1.5 flex items-center gap-1.5"${_scopeId}><span${_scopeId}>Khách hàng</span>`);
              _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UIcon, {
                name: "i-lucide-lock",
                class: "size-3 text-slate-400",
                title: "Sửa ở trang khách hàng"
              }, null, _parent2, _scopeId));
              _push2(`</p>`);
              _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UInput, {
                "model-value": vueExports.unref(ogTicket)?.customer?.full_name ?? vueExports.unref(ogTicket)?.requester_name ?? "",
                class: "w-full",
                readonly: "",
                disabled: ""
              }, null, _parent2, _scopeId));
              _push2(`</div><div${_scopeId}><p class="text-xs font-medium text-slate-500 mb-1.5 flex items-center gap-1.5"${_scopeId}><span${_scopeId}>Số điện thoại</span>`);
              _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UIcon, {
                name: "i-lucide-lock",
                class: "size-3 text-slate-400",
                title: "Sửa ở trang khách hàng"
              }, null, _parent2, _scopeId));
              _push2(`</p>`);
              _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UInput, {
                "model-value": ("formatPhone" in _ctx ? _ctx.formatPhone : vueExports.unref(formatPhone))(vueExports.unref(ogTicket)?.customer?.phone ?? vueExports.unref(ogTicket)?.requester_phone),
                class: "w-full",
                readonly: "",
                disabled: ""
              }, null, _parent2, _scopeId));
              _push2(`</div>`);
              if (vueExports.unref(ogTicket)?.customer) {
                _push2(`<div class="sm:col-span-2 -mt-2"${_scopeId}>`);
                _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UAlert, {
                  color: "info",
                  variant: "subtle",
                  icon: "i-lucide-info"
                }, {
                  description: vueExports.withCtx((_2, _push3, _parent3, _scopeId2) => {
                    if (_push3) {
                      _push3(`<span${_scopeId2}>Thông tin khách hiển thị theo hồ sơ hiện tại (live). Snapshot lúc tạo ticket: </span><span class="font-medium"${_scopeId2}>${serverRenderer_cjs_prodExports.ssrInterpolate(vueExports.unref(ogTicket).requester_name)}</span><span${_scopeId2}> — </span><span class="font-mono"${_scopeId2}>${serverRenderer_cjs_prodExports.ssrInterpolate(("formatPhone" in _ctx ? _ctx.formatPhone : vueExports.unref(formatPhone))(vueExports.unref(ogTicket).requester_phone))}</span><span${_scopeId2}>. Muốn cập nhật khách, sửa ở </span>`);
                      _push3(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_NuxtLink, {
                        to: `/pmc/customers/${vueExports.unref(ogTicket).customer.id}`,
                        class: "font-medium text-primary-700 hover:underline inline-flex items-center gap-1"
                      }, {
                        default: vueExports.withCtx((_3, _push4, _parent4, _scopeId3) => {
                          if (_push4) {
                            _push4(` trang khách hàng ${serverRenderer_cjs_prodExports.ssrInterpolate(vueExports.unref(ogTicket).customer.code ?? vueExports.unref(ogTicket).customer.full_name)} `);
                            _push4(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UIcon, {
                              name: "i-lucide-external-link",
                              class: "size-3.5"
                            }, null, _parent4, _scopeId3));
                          } else {
                            return [
                              vueExports.createTextVNode(" trang khách hàng " + vueExports.toDisplayString(vueExports.unref(ogTicket).customer.code ?? vueExports.unref(ogTicket).customer.full_name) + " ", 1),
                              vueExports.createVNode(_component_UIcon, {
                                name: "i-lucide-external-link",
                                class: "size-3.5"
                              })
                            ];
                          }
                        }),
                        _: 1
                      }, _parent3, _scopeId2));
                      _push3(`<span${_scopeId2}>.</span>`);
                    } else {
                      return [
                        vueExports.createVNode("span", null, "Thông tin khách hiển thị theo hồ sơ hiện tại (live). Snapshot lúc tạo ticket: "),
                        vueExports.createVNode("span", { class: "font-medium" }, vueExports.toDisplayString(vueExports.unref(ogTicket).requester_name), 1),
                        vueExports.createVNode("span", null, " — "),
                        vueExports.createVNode("span", { class: "font-mono" }, vueExports.toDisplayString(("formatPhone" in _ctx ? _ctx.formatPhone : vueExports.unref(formatPhone))(vueExports.unref(ogTicket).requester_phone)), 1),
                        vueExports.createVNode("span", null, ". Muốn cập nhật khách, sửa ở "),
                        vueExports.createVNode(_component_NuxtLink, {
                          to: `/pmc/customers/${vueExports.unref(ogTicket).customer.id}`,
                          class: "font-medium text-primary-700 hover:underline inline-flex items-center gap-1"
                        }, {
                          default: vueExports.withCtx(() => [
                            vueExports.createTextVNode(" trang khách hàng " + vueExports.toDisplayString(vueExports.unref(ogTicket).customer.code ?? vueExports.unref(ogTicket).customer.full_name) + " ", 1),
                            vueExports.createVNode(_component_UIcon, {
                              name: "i-lucide-external-link",
                              class: "size-3.5"
                            })
                          ]),
                          _: 1
                        }, 8, ["to"]),
                        vueExports.createVNode("span", null, ".")
                      ];
                    }
                  }),
                  _: 1
                }, _parent2, _scopeId));
                _push2(`</div>`);
              } else {
                _push2(`<!---->`);
              }
              _push2(`<div${_scopeId}><p class="text-xs font-medium text-slate-500 mb-1.5"${_scopeId}> Căn hộ </p>`);
              _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UInput, {
                modelValue: vueExports.unref(form).apartment_name,
                "onUpdate:modelValue": ($event) => vueExports.unref(form).apartment_name = $event,
                class: "w-full",
                placeholder: "—"
              }, null, _parent2, _scopeId));
              _push2(`</div><div${_scopeId}><p class="text-xs font-medium text-slate-500 mb-1.5"${_scopeId}> Dự án </p>`);
              _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_SharedProjectSelect, {
                modelValue: vueExports.unref(form).project_id,
                "onUpdate:modelValue": ($event) => vueExports.unref(form).project_id = $event
              }, null, _parent2, _scopeId));
              _push2(`</div><div class="sm:col-span-2"${_scopeId}><p class="text-xs font-medium text-slate-500 mb-1.5"${_scopeId}> Danh mục </p><div class="flex items-center flex-wrap gap-1.5 min-h-[36px]"${_scopeId}><!--[-->`);
              serverRenderer_cjs_prodExports.ssrRenderList(vueExports.unref(ogTicket)?.categories ?? [], (cat) => {
                _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UBadge, {
                  key: cat.id,
                  label: cat.name,
                  color: "primary",
                  variant: "subtle",
                  size: "sm"
                }, null, _parent2, _scopeId));
              });
              _push2(`<!--]-->`);
              if (!vueExports.unref(ogTicket)?.categories || vueExports.unref(ogTicket).categories.length === 0) {
                _push2(`<span class="text-slate-400 text-sm"${_scopeId}>—</span>`);
              } else {
                _push2(`<!---->`);
              }
              _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UButton, {
                icon: "i-lucide-pencil",
                size: "xs",
                color: "neutral",
                variant: "ghost",
                class: "ml-1",
                onClick: openCategoriesModal
              }, {
                default: vueExports.withCtx((_2, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    _push3(` Chỉnh sửa `);
                  } else {
                    return [
                      vueExports.createTextVNode(" Chỉnh sửa ")
                    ];
                  }
                }),
                _: 1
              }, _parent2, _scopeId));
              _push2(`</div></div></div><div class="border-t border-slate-100 pt-5 mt-5"${_scopeId}>`);
              _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_SharedAddressMapPicker, {
                "model-value": vueExports.unref(form).address ?? "",
                latitude: vueExports.unref(form).latitude ?? null,
                longitude: vueExports.unref(form).longitude ?? null,
                "onUpdate:modelValue": ($event) => vueExports.unref(form).address = $event,
                "onUpdate:latitude": ($event) => vueExports.unref(form).latitude = $event,
                "onUpdate:longitude": ($event) => vueExports.unref(form).longitude = $event
              }, null, _parent2, _scopeId));
              _push2(`</div><div class="border-t border-slate-100 pt-5 mt-5"${_scopeId}><div class="flex items-center gap-2 mb-3"${_scopeId}>`);
              _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UIcon, {
                name: "i-lucide-paperclip",
                class: "size-4 text-slate-400"
              }, null, _parent2, _scopeId));
              _push2(`<span class="text-sm font-semibold text-slate-700"${_scopeId}>Tệp đính kèm OG</span><span class="text-xs text-slate-400"${_scopeId}>(${serverRenderer_cjs_prodExports.ssrInterpolate(vueExports.unref(totalFileCount))})</span></div>`);
              if (vueExports.unref(existingOgAttachments).length > 0) {
                _push2(`<div class="flex flex-col gap-2 mb-3"${_scopeId}><!--[-->`);
                serverRenderer_cjs_prodExports.ssrRenderList(vueExports.unref(existingOgAttachments), (att) => {
                  _push2(`<div class="flex items-center gap-3 rounded-lg border border-slate-200 px-3 py-2"${_scopeId}><div class="${serverRenderer_cjs_prodExports.ssrRenderClass([("isImageMime" in _ctx ? _ctx.isImageMime : vueExports.unref(isImageMime))(att.mime_type) ? "bg-violet-100" : "bg-amber-100", "size-8 rounded-lg flex items-center justify-center shrink-0"])}"${_scopeId}>`);
                  _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UIcon, {
                    name: ("isImageMime" in _ctx ? _ctx.isImageMime : vueExports.unref(isImageMime))(att.mime_type) ? "i-lucide-image" : "i-lucide-file-text",
                    class: ["size-4", ("isImageMime" in _ctx ? _ctx.isImageMime : vueExports.unref(isImageMime))(att.mime_type) ? "text-violet-500" : "text-amber-600"]
                  }, null, _parent2, _scopeId));
                  _push2(`</div><a${serverRenderer_cjs_prodExports.ssrRenderAttr("href", att.url)} target="_blank" class="flex-1 min-w-0 hover:underline"${_scopeId}><p class="text-xs font-medium text-slate-700 truncate"${_scopeId}>${serverRenderer_cjs_prodExports.ssrInterpolate(att.original_name)}</p><p class="text-[10px] text-slate-400"${_scopeId}>${serverRenderer_cjs_prodExports.ssrInterpolate(("formatFileSize" in _ctx ? _ctx.formatFileSize : vueExports.unref(formatFileSize))(att.size_bytes))}</p></a><button type="button" class="size-6 rounded-md hover:bg-red-50 flex items-center justify-center cursor-pointer"${_scopeId}>`);
                  _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UIcon, {
                    name: "i-lucide-x",
                    class: "size-3.5 text-slate-400 hover:text-red-500"
                  }, null, _parent2, _scopeId));
                  _push2(`</button></div>`);
                });
                _push2(`<!--]--></div>`);
              } else {
                _push2(`<!---->`);
              }
              if (vueExports.unref(deleteFileIds).length > 0) {
                _push2(`<div class="flex flex-col gap-1 mb-3"${_scopeId}><!--[-->`);
                serverRenderer_cjs_prodExports.ssrRenderList(vueExports.unref(deleteFileIds), (delId) => {
                  _push2(`<div class="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-red-50 border border-red-200"${_scopeId}>`);
                  _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UIcon, {
                    name: "i-lucide-trash-2",
                    class: "size-3.5 text-red-400"
                  }, null, _parent2, _scopeId));
                  _push2(`<span class="text-xs text-red-600 flex-1"${_scopeId}>Sẽ xoá khi lưu</span><button class="text-xs text-red-500 hover:text-red-700 underline cursor-pointer"${_scopeId}> Hoàn tác </button></div>`);
                });
                _push2(`<!--]--></div>`);
              } else {
                _push2(`<!---->`);
              }
              if (vueExports.unref(newFiles).length > 0) {
                _push2(`<div class="flex flex-col gap-2 mb-3"${_scopeId}><!--[-->`);
                serverRenderer_cjs_prodExports.ssrRenderList(vueExports.unref(newFiles), (file, idx) => {
                  _push2(`<div class="flex items-center gap-3 rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2"${_scopeId}><div class="${serverRenderer_cjs_prodExports.ssrRenderClass([("isImageMime" in _ctx ? _ctx.isImageMime : vueExports.unref(isImageMime))(file.type) ? "bg-violet-100" : "bg-amber-100", "size-8 rounded-lg flex items-center justify-center shrink-0"])}"${_scopeId}>`);
                  _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UIcon, {
                    name: ("isImageMime" in _ctx ? _ctx.isImageMime : vueExports.unref(isImageMime))(file.type) ? "i-lucide-image" : "i-lucide-file-text",
                    class: ["size-4", ("isImageMime" in _ctx ? _ctx.isImageMime : vueExports.unref(isImageMime))(file.type) ? "text-violet-500" : "text-amber-600"]
                  }, null, _parent2, _scopeId));
                  _push2(`</div><div class="flex-1 min-w-0"${_scopeId}><p class="text-xs font-medium text-slate-700 truncate"${_scopeId}>${serverRenderer_cjs_prodExports.ssrInterpolate(file.name)}</p><p class="text-[10px] text-emerald-600"${_scopeId}> Mới — sẽ upload khi lưu </p></div><button type="button" class="size-6 rounded-md hover:bg-red-50 flex items-center justify-center cursor-pointer"${_scopeId}>`);
                  _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UIcon, {
                    name: "i-lucide-x",
                    class: "size-3.5 text-slate-400 hover:text-red-500"
                  }, null, _parent2, _scopeId));
                  _push2(`</button></div>`);
                });
                _push2(`<!--]--></div>`);
              } else {
                _push2(`<!---->`);
              }
              _push2(`<input type="file" multiple accept="image/jpeg,image/png,image/gif,image/webp,application/pdf,.doc,.docx,.xls,.xlsx" class="hidden"${_scopeId}>`);
              if (vueExports.unref(totalFileCount) < ("ATTACHMENT_MAX_FILES" in _ctx ? _ctx.ATTACHMENT_MAX_FILES : vueExports.unref(ATTACHMENT_MAX_FILES))) {
                _push2(`<button type="button" class="flex items-center gap-2 rounded-lg border-2 border-dashed border-slate-200 px-4 py-3 text-xs text-slate-500 hover:border-indigo-400 hover:text-indigo-600 transition-colors cursor-pointer w-full justify-center"${_scopeId}>`);
                _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UIcon, {
                  name: "i-lucide-upload",
                  class: "size-4"
                }, null, _parent2, _scopeId));
                _push2(` Thêm tệp đính kèm </button>`);
              } else {
                _push2(`<!---->`);
              }
              _push2(`</div>`);
            } else {
              return [
                vueExports.createVNode("div", { class: "grid grid-cols-1 sm:grid-cols-2 gap-4" }, [
                  vueExports.createVNode("div", null, [
                    vueExports.createVNode("p", { class: "text-xs font-medium text-slate-500 mb-1.5" }, " Tiêu đề "),
                    vueExports.createVNode(_component_UInput, {
                      modelValue: vueExports.unref(form).subject,
                      "onUpdate:modelValue": ($event) => vueExports.unref(form).subject = $event,
                      class: "w-full"
                    }, null, 8, ["modelValue", "onUpdate:modelValue"])
                  ]),
                  vueExports.createVNode("div", null, [
                    vueExports.createVNode("p", { class: "text-xs font-medium text-slate-500 mb-1.5" }, " Kênh tiếp nhận "),
                    vueExports.createVNode("div", { class: "flex items-center h-9" }, [
                      vueExports.createVNode(_component_UBadge, {
                        label: vueExports.unref(ogTicket).channel?.label,
                        color: "neutral",
                        variant: "subtle",
                        size: "sm"
                      }, null, 8, ["label"])
                    ])
                  ]),
                  vueExports.createVNode("div", { class: "sm:col-span-2" }, [
                    vueExports.createVNode("p", { class: "text-xs font-medium text-slate-500 mb-1.5" }, " Mô tả "),
                    vueExports.createVNode(_component_UTextarea, {
                      modelValue: vueExports.unref(form).description,
                      "onUpdate:modelValue": ($event) => vueExports.unref(form).description = $event,
                      rows: 3,
                      class: "w-full",
                      placeholder: "Mô tả chi tiết..."
                    }, null, 8, ["modelValue", "onUpdate:modelValue"])
                  ]),
                  vueExports.createVNode("div", null, [
                    vueExports.createVNode("p", { class: "text-xs font-medium text-slate-500 mb-1.5 flex items-center gap-1.5" }, [
                      vueExports.createVNode("span", null, "Khách hàng"),
                      vueExports.createVNode(_component_UIcon, {
                        name: "i-lucide-lock",
                        class: "size-3 text-slate-400",
                        title: "Sửa ở trang khách hàng"
                      })
                    ]),
                    vueExports.createVNode(_component_UInput, {
                      "model-value": vueExports.unref(ogTicket)?.customer?.full_name ?? vueExports.unref(ogTicket)?.requester_name ?? "",
                      class: "w-full",
                      readonly: "",
                      disabled: ""
                    }, null, 8, ["model-value"])
                  ]),
                  vueExports.createVNode("div", null, [
                    vueExports.createVNode("p", { class: "text-xs font-medium text-slate-500 mb-1.5 flex items-center gap-1.5" }, [
                      vueExports.createVNode("span", null, "Số điện thoại"),
                      vueExports.createVNode(_component_UIcon, {
                        name: "i-lucide-lock",
                        class: "size-3 text-slate-400",
                        title: "Sửa ở trang khách hàng"
                      })
                    ]),
                    vueExports.createVNode(_component_UInput, {
                      "model-value": ("formatPhone" in _ctx ? _ctx.formatPhone : vueExports.unref(formatPhone))(vueExports.unref(ogTicket)?.customer?.phone ?? vueExports.unref(ogTicket)?.requester_phone),
                      class: "w-full",
                      readonly: "",
                      disabled: ""
                    }, null, 8, ["model-value"])
                  ]),
                  vueExports.unref(ogTicket)?.customer ? (vueExports.openBlock(), vueExports.createBlock("div", {
                    key: 0,
                    class: "sm:col-span-2 -mt-2"
                  }, [
                    vueExports.createVNode(_component_UAlert, {
                      color: "info",
                      variant: "subtle",
                      icon: "i-lucide-info"
                    }, {
                      description: vueExports.withCtx(() => [
                        vueExports.createVNode("span", null, "Thông tin khách hiển thị theo hồ sơ hiện tại (live). Snapshot lúc tạo ticket: "),
                        vueExports.createVNode("span", { class: "font-medium" }, vueExports.toDisplayString(vueExports.unref(ogTicket).requester_name), 1),
                        vueExports.createVNode("span", null, " — "),
                        vueExports.createVNode("span", { class: "font-mono" }, vueExports.toDisplayString(("formatPhone" in _ctx ? _ctx.formatPhone : vueExports.unref(formatPhone))(vueExports.unref(ogTicket).requester_phone)), 1),
                        vueExports.createVNode("span", null, ". Muốn cập nhật khách, sửa ở "),
                        vueExports.createVNode(_component_NuxtLink, {
                          to: `/pmc/customers/${vueExports.unref(ogTicket).customer.id}`,
                          class: "font-medium text-primary-700 hover:underline inline-flex items-center gap-1"
                        }, {
                          default: vueExports.withCtx(() => [
                            vueExports.createTextVNode(" trang khách hàng " + vueExports.toDisplayString(vueExports.unref(ogTicket).customer.code ?? vueExports.unref(ogTicket).customer.full_name) + " ", 1),
                            vueExports.createVNode(_component_UIcon, {
                              name: "i-lucide-external-link",
                              class: "size-3.5"
                            })
                          ]),
                          _: 1
                        }, 8, ["to"]),
                        vueExports.createVNode("span", null, ".")
                      ]),
                      _: 1
                    })
                  ])) : vueExports.createCommentVNode("", true),
                  vueExports.createVNode("div", null, [
                    vueExports.createVNode("p", { class: "text-xs font-medium text-slate-500 mb-1.5" }, " Căn hộ "),
                    vueExports.createVNode(_component_UInput, {
                      modelValue: vueExports.unref(form).apartment_name,
                      "onUpdate:modelValue": ($event) => vueExports.unref(form).apartment_name = $event,
                      class: "w-full",
                      placeholder: "—"
                    }, null, 8, ["modelValue", "onUpdate:modelValue"])
                  ]),
                  vueExports.createVNode("div", null, [
                    vueExports.createVNode("p", { class: "text-xs font-medium text-slate-500 mb-1.5" }, " Dự án "),
                    vueExports.createVNode(_component_SharedProjectSelect, {
                      modelValue: vueExports.unref(form).project_id,
                      "onUpdate:modelValue": ($event) => vueExports.unref(form).project_id = $event
                    }, null, 8, ["modelValue", "onUpdate:modelValue"])
                  ]),
                  vueExports.createVNode("div", { class: "sm:col-span-2" }, [
                    vueExports.createVNode("p", { class: "text-xs font-medium text-slate-500 mb-1.5" }, " Danh mục "),
                    vueExports.createVNode("div", { class: "flex items-center flex-wrap gap-1.5 min-h-[36px]" }, [
                      (vueExports.openBlock(true), vueExports.createBlock(vueExports.Fragment, null, vueExports.renderList(vueExports.unref(ogTicket)?.categories ?? [], (cat) => {
                        return vueExports.openBlock(), vueExports.createBlock(_component_UBadge, {
                          key: cat.id,
                          label: cat.name,
                          color: "primary",
                          variant: "subtle",
                          size: "sm"
                        }, null, 8, ["label"]);
                      }), 128)),
                      !vueExports.unref(ogTicket)?.categories || vueExports.unref(ogTicket).categories.length === 0 ? (vueExports.openBlock(), vueExports.createBlock("span", {
                        key: 0,
                        class: "text-slate-400 text-sm"
                      }, "—")) : vueExports.createCommentVNode("", true),
                      vueExports.createVNode(_component_UButton, {
                        icon: "i-lucide-pencil",
                        size: "xs",
                        color: "neutral",
                        variant: "ghost",
                        class: "ml-1",
                        onClick: openCategoriesModal
                      }, {
                        default: vueExports.withCtx(() => [
                          vueExports.createTextVNode(" Chỉnh sửa ")
                        ]),
                        _: 1
                      })
                    ])
                  ])
                ]),
                vueExports.createVNode("div", { class: "border-t border-slate-100 pt-5 mt-5" }, [
                  vueExports.createVNode(_component_SharedAddressMapPicker, {
                    "model-value": vueExports.unref(form).address ?? "",
                    latitude: vueExports.unref(form).latitude ?? null,
                    longitude: vueExports.unref(form).longitude ?? null,
                    "onUpdate:modelValue": ($event) => vueExports.unref(form).address = $event,
                    "onUpdate:latitude": ($event) => vueExports.unref(form).latitude = $event,
                    "onUpdate:longitude": ($event) => vueExports.unref(form).longitude = $event
                  }, null, 8, ["model-value", "latitude", "longitude", "onUpdate:modelValue", "onUpdate:latitude", "onUpdate:longitude"])
                ]),
                vueExports.createVNode("div", { class: "border-t border-slate-100 pt-5 mt-5" }, [
                  vueExports.createVNode("div", { class: "flex items-center gap-2 mb-3" }, [
                    vueExports.createVNode(_component_UIcon, {
                      name: "i-lucide-paperclip",
                      class: "size-4 text-slate-400"
                    }),
                    vueExports.createVNode("span", { class: "text-sm font-semibold text-slate-700" }, "Tệp đính kèm OG"),
                    vueExports.createVNode("span", { class: "text-xs text-slate-400" }, "(" + vueExports.toDisplayString(vueExports.unref(totalFileCount)) + ")", 1)
                  ]),
                  vueExports.unref(existingOgAttachments).length > 0 ? (vueExports.openBlock(), vueExports.createBlock("div", {
                    key: 0,
                    class: "flex flex-col gap-2 mb-3"
                  }, [
                    (vueExports.openBlock(true), vueExports.createBlock(vueExports.Fragment, null, vueExports.renderList(vueExports.unref(existingOgAttachments), (att) => {
                      return vueExports.openBlock(), vueExports.createBlock("div", {
                        key: att.id,
                        class: "flex items-center gap-3 rounded-lg border border-slate-200 px-3 py-2"
                      }, [
                        vueExports.createVNode("div", {
                          class: ["size-8 rounded-lg flex items-center justify-center shrink-0", ("isImageMime" in _ctx ? _ctx.isImageMime : vueExports.unref(isImageMime))(att.mime_type) ? "bg-violet-100" : "bg-amber-100"]
                        }, [
                          vueExports.createVNode(_component_UIcon, {
                            name: ("isImageMime" in _ctx ? _ctx.isImageMime : vueExports.unref(isImageMime))(att.mime_type) ? "i-lucide-image" : "i-lucide-file-text",
                            class: ["size-4", ("isImageMime" in _ctx ? _ctx.isImageMime : vueExports.unref(isImageMime))(att.mime_type) ? "text-violet-500" : "text-amber-600"]
                          }, null, 8, ["name", "class"])
                        ], 2),
                        vueExports.createVNode("a", {
                          href: att.url,
                          target: "_blank",
                          class: "flex-1 min-w-0 hover:underline"
                        }, [
                          vueExports.createVNode("p", { class: "text-xs font-medium text-slate-700 truncate" }, vueExports.toDisplayString(att.original_name), 1),
                          vueExports.createVNode("p", { class: "text-[10px] text-slate-400" }, vueExports.toDisplayString(("formatFileSize" in _ctx ? _ctx.formatFileSize : vueExports.unref(formatFileSize))(att.size_bytes)), 1)
                        ], 8, ["href"]),
                        vueExports.createVNode("button", {
                          type: "button",
                          class: "size-6 rounded-md hover:bg-red-50 flex items-center justify-center cursor-pointer",
                          onClick: ($event) => markDeleteExisting(att.id)
                        }, [
                          vueExports.createVNode(_component_UIcon, {
                            name: "i-lucide-x",
                            class: "size-3.5 text-slate-400 hover:text-red-500"
                          })
                        ], 8, ["onClick"])
                      ]);
                    }), 128))
                  ])) : vueExports.createCommentVNode("", true),
                  vueExports.unref(deleteFileIds).length > 0 ? (vueExports.openBlock(), vueExports.createBlock("div", {
                    key: 1,
                    class: "flex flex-col gap-1 mb-3"
                  }, [
                    (vueExports.openBlock(true), vueExports.createBlock(vueExports.Fragment, null, vueExports.renderList(vueExports.unref(deleteFileIds), (delId) => {
                      return vueExports.openBlock(), vueExports.createBlock("div", {
                        key: delId,
                        class: "flex items-center gap-2 px-3 py-1.5 rounded-lg bg-red-50 border border-red-200"
                      }, [
                        vueExports.createVNode(_component_UIcon, {
                          name: "i-lucide-trash-2",
                          class: "size-3.5 text-red-400"
                        }),
                        vueExports.createVNode("span", { class: "text-xs text-red-600 flex-1" }, "Sẽ xoá khi lưu"),
                        vueExports.createVNode("button", {
                          class: "text-xs text-red-500 hover:text-red-700 underline cursor-pointer",
                          onClick: ($event) => undoDeleteExisting(delId)
                        }, " Hoàn tác ", 8, ["onClick"])
                      ]);
                    }), 128))
                  ])) : vueExports.createCommentVNode("", true),
                  vueExports.unref(newFiles).length > 0 ? (vueExports.openBlock(), vueExports.createBlock("div", {
                    key: 2,
                    class: "flex flex-col gap-2 mb-3"
                  }, [
                    (vueExports.openBlock(true), vueExports.createBlock(vueExports.Fragment, null, vueExports.renderList(vueExports.unref(newFiles), (file, idx) => {
                      return vueExports.openBlock(), vueExports.createBlock("div", {
                        key: idx,
                        class: "flex items-center gap-3 rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2"
                      }, [
                        vueExports.createVNode("div", {
                          class: ["size-8 rounded-lg flex items-center justify-center shrink-0", ("isImageMime" in _ctx ? _ctx.isImageMime : vueExports.unref(isImageMime))(file.type) ? "bg-violet-100" : "bg-amber-100"]
                        }, [
                          vueExports.createVNode(_component_UIcon, {
                            name: ("isImageMime" in _ctx ? _ctx.isImageMime : vueExports.unref(isImageMime))(file.type) ? "i-lucide-image" : "i-lucide-file-text",
                            class: ["size-4", ("isImageMime" in _ctx ? _ctx.isImageMime : vueExports.unref(isImageMime))(file.type) ? "text-violet-500" : "text-amber-600"]
                          }, null, 8, ["name", "class"])
                        ], 2),
                        vueExports.createVNode("div", { class: "flex-1 min-w-0" }, [
                          vueExports.createVNode("p", { class: "text-xs font-medium text-slate-700 truncate" }, vueExports.toDisplayString(file.name), 1),
                          vueExports.createVNode("p", { class: "text-[10px] text-emerald-600" }, " Mới — sẽ upload khi lưu ")
                        ]),
                        vueExports.createVNode("button", {
                          type: "button",
                          class: "size-6 rounded-md hover:bg-red-50 flex items-center justify-center cursor-pointer",
                          onClick: ($event) => removeNewFile(idx)
                        }, [
                          vueExports.createVNode(_component_UIcon, {
                            name: "i-lucide-x",
                            class: "size-3.5 text-slate-400 hover:text-red-500"
                          })
                        ], 8, ["onClick"])
                      ]);
                    }), 128))
                  ])) : vueExports.createCommentVNode("", true),
                  vueExports.createVNode("input", {
                    ref_key: "fileInputRef",
                    ref: fileInputRef,
                    type: "file",
                    multiple: "",
                    accept: "image/jpeg,image/png,image/gif,image/webp,application/pdf,.doc,.docx,.xls,.xlsx",
                    class: "hidden",
                    onChange: handleFileSelect
                  }, null, 544),
                  vueExports.unref(totalFileCount) < ("ATTACHMENT_MAX_FILES" in _ctx ? _ctx.ATTACHMENT_MAX_FILES : vueExports.unref(ATTACHMENT_MAX_FILES)) ? (vueExports.openBlock(), vueExports.createBlock("button", {
                    key: 3,
                    type: "button",
                    class: "flex items-center gap-2 rounded-lg border-2 border-dashed border-slate-200 px-4 py-3 text-xs text-slate-500 hover:border-indigo-400 hover:text-indigo-600 transition-colors cursor-pointer w-full justify-center",
                    onClick: ($event) => vueExports.unref(fileInputRef)?.click()
                  }, [
                    vueExports.createVNode(_component_UIcon, {
                      name: "i-lucide-upload",
                      class: "size-4"
                    }),
                    vueExports.createTextVNode(" Thêm tệp đính kèm ")
                  ], 8, ["onClick"])) : vueExports.createCommentVNode("", true)
                ])
              ];
            }
          }),
          _: 1
        }, _parent));
        _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_SharedSectionCard, { title: "Thông tin xử lý" }, {
          default: vueExports.withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`<div class="grid grid-cols-1 sm:grid-cols-2 gap-5"${_scopeId}><div${_scopeId}><p class="text-sm font-medium text-slate-700 mb-1.5"${_scopeId}> Ưu tiên <span class="text-red-500"${_scopeId}>*</span></p>`);
              _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_USelect, {
                modelValue: vueExports.unref(form).priority,
                "onUpdate:modelValue": ($event) => vueExports.unref(form).priority = $event,
                items: vueExports.unref(priorityOptions),
                placeholder: "Chọn ưu tiên",
                class: "w-full"
              }, null, _parent2, _scopeId));
              _push2(`</div><div${_scopeId}><p class="text-sm font-medium text-slate-700 mb-1.5"${_scopeId}> Người tiếp nhận </p>`);
              _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_USelect, {
                "model-value": vueExports.unref(form).received_by_id ?? void 0,
                items: vueExports.unref(accountOptions),
                placeholder: "Chọn người tiếp nhận",
                class: "w-full",
                "onUpdate:modelValue": ($event) => vueExports.unref(form).received_by_id = $event ?? null
              }, null, _parent2, _scopeId));
              _push2(`</div><div${_scopeId}><p class="text-sm font-medium text-slate-700 mb-1.5"${_scopeId}> Người thi công </p>`);
              _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_USelectMenu, {
                "model-value": vueExports.unref(form).assigned_to_ids ?? [],
                items: vueExports.unref(accountOptions),
                "value-key": "value",
                multiple: "",
                placeholder: "Chọn người thi công",
                class: "w-full",
                "onUpdate:modelValue": ($event) => vueExports.unref(form).assigned_to_ids = $event
              }, {
                "item-label": vueExports.withCtx(({ item }, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    _push3(`<div class="flex items-center justify-between gap-2 w-full"${_scopeId2}><span class="truncate"${_scopeId2}>${serverRenderer_cjs_prodExports.ssrInterpolate(item.label)}</span>`);
                    if (item.capability_rating != null) {
                      _push3(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_SharedCapabilityRatingBadge, {
                        rating: item.capability_rating,
                        size: "xs"
                      }, null, _parent3, _scopeId2));
                    } else {
                      _push3(`<!---->`);
                    }
                    _push3(`</div>`);
                  } else {
                    return [
                      vueExports.createVNode("div", { class: "flex items-center justify-between gap-2 w-full" }, [
                        vueExports.createVNode("span", { class: "truncate" }, vueExports.toDisplayString(item.label), 1),
                        item.capability_rating != null ? (vueExports.openBlock(), vueExports.createBlock(_component_SharedCapabilityRatingBadge, {
                          key: 0,
                          rating: item.capability_rating,
                          size: "xs"
                        }, null, 8, ["rating"])) : vueExports.createCommentVNode("", true)
                      ])
                    ];
                  }
                }),
                _: 1
              }, _parent2, _scopeId));
              _push2(`</div><div${_scopeId}><p class="text-sm font-medium text-slate-700 mb-1.5"${_scopeId}> Hạn SLA Báo giá </p>`);
              _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(vueExports.unref(Zl), {
                modelValue: vueExports.unref(form).sla_quote_due_at,
                "onUpdate:modelValue": ($event) => vueExports.unref(form).sla_quote_due_at = $event,
                "model-type": "yyyy-MM-dd HH:mm:ss",
                placeholder: "Chọn ngày giờ",
                clearable: true,
                teleport: "body"
              }, null, _parent2, _scopeId));
              if (vueExports.unref(isSlaQuoteViolated)) {
                _push2(`<p class="text-xs text-red-500 mt-1"${_scopeId}> Đã quá hạn SLA báo giá </p>`);
              } else {
                _push2(`<!---->`);
              }
              _push2(`</div><div${_scopeId}><p class="text-sm font-medium text-slate-700 mb-1.5"${_scopeId}> Hạn SLA Hoàn thành </p>`);
              _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(vueExports.unref(Zl), {
                modelValue: vueExports.unref(form).sla_completion_due_at,
                "onUpdate:modelValue": ($event) => vueExports.unref(form).sla_completion_due_at = $event,
                "model-type": "yyyy-MM-dd HH:mm:ss",
                placeholder: "Chọn ngày giờ",
                clearable: true,
                teleport: "body"
              }, null, _parent2, _scopeId));
              if (vueExports.unref(isSlaCompletionViolated)) {
                _push2(`<p class="text-xs text-red-500 mt-1"${_scopeId}> Đã quá hạn SLA hoàn thành </p>`);
              } else {
                _push2(`<!---->`);
              }
              _push2(`</div></div><div class="mt-5"${_scopeId}><p class="text-sm font-medium text-slate-700 mb-1.5"${_scopeId}> Ghi chú nội bộ </p>`);
              _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UTextarea, {
                modelValue: vueExports.unref(form).internal_note,
                "onUpdate:modelValue": ($event) => vueExports.unref(form).internal_note = $event,
                placeholder: "Nhập ghi chú nội bộ...",
                rows: 3,
                class: "w-full"
              }, null, _parent2, _scopeId));
              _push2(`</div>`);
            } else {
              return [
                vueExports.createVNode("div", { class: "grid grid-cols-1 sm:grid-cols-2 gap-5" }, [
                  vueExports.createVNode("div", null, [
                    vueExports.createVNode("p", { class: "text-sm font-medium text-slate-700 mb-1.5" }, [
                      vueExports.createTextVNode(" Ưu tiên "),
                      vueExports.createVNode("span", { class: "text-red-500" }, "*")
                    ]),
                    vueExports.createVNode(_component_USelect, {
                      modelValue: vueExports.unref(form).priority,
                      "onUpdate:modelValue": ($event) => vueExports.unref(form).priority = $event,
                      items: vueExports.unref(priorityOptions),
                      placeholder: "Chọn ưu tiên",
                      class: "w-full"
                    }, null, 8, ["modelValue", "onUpdate:modelValue", "items"])
                  ]),
                  vueExports.createVNode("div", null, [
                    vueExports.createVNode("p", { class: "text-sm font-medium text-slate-700 mb-1.5" }, " Người tiếp nhận "),
                    vueExports.createVNode(_component_USelect, {
                      "model-value": vueExports.unref(form).received_by_id ?? void 0,
                      items: vueExports.unref(accountOptions),
                      placeholder: "Chọn người tiếp nhận",
                      class: "w-full",
                      "onUpdate:modelValue": ($event) => vueExports.unref(form).received_by_id = $event ?? null
                    }, null, 8, ["model-value", "items", "onUpdate:modelValue"])
                  ]),
                  vueExports.createVNode("div", null, [
                    vueExports.createVNode("p", { class: "text-sm font-medium text-slate-700 mb-1.5" }, " Người thi công "),
                    vueExports.createVNode(_component_USelectMenu, {
                      "model-value": vueExports.unref(form).assigned_to_ids ?? [],
                      items: vueExports.unref(accountOptions),
                      "value-key": "value",
                      multiple: "",
                      placeholder: "Chọn người thi công",
                      class: "w-full",
                      "onUpdate:modelValue": ($event) => vueExports.unref(form).assigned_to_ids = $event
                    }, {
                      "item-label": vueExports.withCtx(({ item }) => [
                        vueExports.createVNode("div", { class: "flex items-center justify-between gap-2 w-full" }, [
                          vueExports.createVNode("span", { class: "truncate" }, vueExports.toDisplayString(item.label), 1),
                          item.capability_rating != null ? (vueExports.openBlock(), vueExports.createBlock(_component_SharedCapabilityRatingBadge, {
                            key: 0,
                            rating: item.capability_rating,
                            size: "xs"
                          }, null, 8, ["rating"])) : vueExports.createCommentVNode("", true)
                        ])
                      ]),
                      _: 1
                    }, 8, ["model-value", "items", "onUpdate:modelValue"])
                  ]),
                  vueExports.createVNode("div", null, [
                    vueExports.createVNode("p", { class: "text-sm font-medium text-slate-700 mb-1.5" }, " Hạn SLA Báo giá "),
                    vueExports.createVNode(vueExports.unref(Zl), {
                      modelValue: vueExports.unref(form).sla_quote_due_at,
                      "onUpdate:modelValue": ($event) => vueExports.unref(form).sla_quote_due_at = $event,
                      "model-type": "yyyy-MM-dd HH:mm:ss",
                      placeholder: "Chọn ngày giờ",
                      clearable: true,
                      teleport: "body"
                    }, null, 8, ["modelValue", "onUpdate:modelValue"]),
                    vueExports.unref(isSlaQuoteViolated) ? (vueExports.openBlock(), vueExports.createBlock("p", {
                      key: 0,
                      class: "text-xs text-red-500 mt-1"
                    }, " Đã quá hạn SLA báo giá ")) : vueExports.createCommentVNode("", true)
                  ]),
                  vueExports.createVNode("div", null, [
                    vueExports.createVNode("p", { class: "text-sm font-medium text-slate-700 mb-1.5" }, " Hạn SLA Hoàn thành "),
                    vueExports.createVNode(vueExports.unref(Zl), {
                      modelValue: vueExports.unref(form).sla_completion_due_at,
                      "onUpdate:modelValue": ($event) => vueExports.unref(form).sla_completion_due_at = $event,
                      "model-type": "yyyy-MM-dd HH:mm:ss",
                      placeholder: "Chọn ngày giờ",
                      clearable: true,
                      teleport: "body"
                    }, null, 8, ["modelValue", "onUpdate:modelValue"]),
                    vueExports.unref(isSlaCompletionViolated) ? (vueExports.openBlock(), vueExports.createBlock("p", {
                      key: 0,
                      class: "text-xs text-red-500 mt-1"
                    }, " Đã quá hạn SLA hoàn thành ")) : vueExports.createCommentVNode("", true)
                  ])
                ]),
                vueExports.createVNode("div", { class: "mt-5" }, [
                  vueExports.createVNode("p", { class: "text-sm font-medium text-slate-700 mb-1.5" }, " Ghi chú nội bộ "),
                  vueExports.createVNode(_component_UTextarea, {
                    modelValue: vueExports.unref(form).internal_note,
                    "onUpdate:modelValue": ($event) => vueExports.unref(form).internal_note = $event,
                    placeholder: "Nhập ghi chú nội bộ...",
                    rows: 3,
                    class: "w-full"
                  }, null, 8, ["modelValue", "onUpdate:modelValue"])
                ])
              ];
            }
          }),
          _: 1
        }, _parent));
        _push(`<div class="flex items-center gap-3 lg:hidden">`);
        _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UButton, {
          label: "Lưu thay đổi",
          icon: "i-lucide-save",
          color: "primary",
          loading: vueExports.unref(isSaving),
          class: "flex-1",
          onClick: handleSave
        }, null, _parent));
        _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UButton, {
          label: "Hủy",
          color: "neutral",
          variant: "ghost",
          onClick: handleCancel
        }, null, _parent));
        _push(`</div></div><div class="flex flex-col gap-4">`);
        _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_SharedSectionCard, {
          title: "Thông tin tiếp nhận",
          compact: ""
        }, {
          default: vueExports.withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`<div class="flex flex-col gap-4"${_scopeId}>`);
              _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_SharedFieldDisplay, { label: "Người nhận" }, {
                default: vueExports.withCtx((_2, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    _push3(`${serverRenderer_cjs_prodExports.ssrInterpolate(vueExports.unref(ogTicket).received_by?.name ?? "—")}`);
                  } else {
                    return [
                      vueExports.createTextVNode(vueExports.toDisplayString(vueExports.unref(ogTicket).received_by?.name ?? "—"), 1)
                    ];
                  }
                }),
                _: 1
              }, _parent2, _scopeId));
              _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_SharedFieldDisplay, { label: "Nhận lúc" }, {
                default: vueExports.withCtx((_2, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    _push3(`${serverRenderer_cjs_prodExports.ssrInterpolate(("formatDateTime" in _ctx ? _ctx.formatDateTime : vueExports.unref(formatDateTime))(vueExports.unref(ogTicket).received_at))}`);
                  } else {
                    return [
                      vueExports.createTextVNode(vueExports.toDisplayString(("formatDateTime" in _ctx ? _ctx.formatDateTime : vueExports.unref(formatDateTime))(vueExports.unref(ogTicket).received_at)), 1)
                    ];
                  }
                }),
                _: 1
              }, _parent2, _scopeId));
              if (vueExports.unref(ogTicket).assignees?.length) {
                _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_SharedFieldDisplay, { label: "Người thi công" }, {
                  default: vueExports.withCtx((_2, _push3, _parent3, _scopeId2) => {
                    if (_push3) {
                      _push3(`<div class="flex flex-col gap-1"${_scopeId2}><!--[-->`);
                      serverRenderer_cjs_prodExports.ssrRenderList(vueExports.unref(ogTicket).assignees, (a) => {
                        _push3(`<span${_scopeId2}>${serverRenderer_cjs_prodExports.ssrInterpolate(a.name)}</span>`);
                      });
                      _push3(`<!--]--></div>`);
                    } else {
                      return [
                        vueExports.createVNode("div", { class: "flex flex-col gap-1" }, [
                          (vueExports.openBlock(true), vueExports.createBlock(vueExports.Fragment, null, vueExports.renderList(vueExports.unref(ogTicket).assignees, (a) => {
                            return vueExports.openBlock(), vueExports.createBlock("span", {
                              key: a.id
                            }, vueExports.toDisplayString(a.name), 1);
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
              _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_SharedFieldDisplay, { label: "Trạng thái hiện tại" }, {
                default: vueExports.withCtx((_2, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    _push3(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UBadge, {
                      label: vueExports.unref(ogTicket).status.label,
                      color: ("ogTicketStatusColor" in _ctx ? _ctx.ogTicketStatusColor : vueExports.unref(ogTicketStatusColor))(vueExports.unref(ogTicket).status.value),
                      variant: "subtle",
                      size: "sm"
                    }, null, _parent3, _scopeId2));
                  } else {
                    return [
                      vueExports.createVNode(_component_UBadge, {
                        label: vueExports.unref(ogTicket).status.label,
                        color: ("ogTicketStatusColor" in _ctx ? _ctx.ogTicketStatusColor : vueExports.unref(ogTicketStatusColor))(vueExports.unref(ogTicket).status.value),
                        variant: "subtle",
                        size: "sm"
                      }, null, 8, ["label", "color"])
                    ];
                  }
                }),
                _: 1
              }, _parent2, _scopeId));
              _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_SharedFieldDisplay, { label: "Ưu tiên hiện tại" }, {
                default: vueExports.withCtx((_2, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    _push3(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UBadge, {
                      label: vueExports.unref(ogTicket).priority.label,
                      color: ("ogTicketPriorityColor" in _ctx ? _ctx.ogTicketPriorityColor : vueExports.unref(ogTicketPriorityColor))(vueExports.unref(ogTicket).priority.value),
                      variant: "soft",
                      size: "sm"
                    }, null, _parent3, _scopeId2));
                  } else {
                    return [
                      vueExports.createVNode(_component_UBadge, {
                        label: vueExports.unref(ogTicket).priority.label,
                        color: ("ogTicketPriorityColor" in _ctx ? _ctx.ogTicketPriorityColor : vueExports.unref(ogTicketPriorityColor))(vueExports.unref(ogTicket).priority.value),
                        variant: "soft",
                        size: "sm"
                      }, null, 8, ["label", "color"])
                    ];
                  }
                }),
                _: 1
              }, _parent2, _scopeId));
              _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_SharedFieldDisplay, { label: "Cập nhật lúc" }, {
                default: vueExports.withCtx((_2, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    _push3(`${serverRenderer_cjs_prodExports.ssrInterpolate(("formatDateTime" in _ctx ? _ctx.formatDateTime : vueExports.unref(formatDateTime))(vueExports.unref(ogTicket).updated_at))}`);
                  } else {
                    return [
                      vueExports.createTextVNode(vueExports.toDisplayString(("formatDateTime" in _ctx ? _ctx.formatDateTime : vueExports.unref(formatDateTime))(vueExports.unref(ogTicket).updated_at)), 1)
                    ];
                  }
                }),
                _: 1
              }, _parent2, _scopeId));
              _push2(`</div>`);
            } else {
              return [
                vueExports.createVNode("div", { class: "flex flex-col gap-4" }, [
                  vueExports.createVNode(_component_SharedFieldDisplay, { label: "Người nhận" }, {
                    default: vueExports.withCtx(() => [
                      vueExports.createTextVNode(vueExports.toDisplayString(vueExports.unref(ogTicket).received_by?.name ?? "—"), 1)
                    ]),
                    _: 1
                  }),
                  vueExports.createVNode(_component_SharedFieldDisplay, { label: "Nhận lúc" }, {
                    default: vueExports.withCtx(() => [
                      vueExports.createTextVNode(vueExports.toDisplayString(("formatDateTime" in _ctx ? _ctx.formatDateTime : vueExports.unref(formatDateTime))(vueExports.unref(ogTicket).received_at)), 1)
                    ]),
                    _: 1
                  }),
                  vueExports.unref(ogTicket).assignees?.length ? (vueExports.openBlock(), vueExports.createBlock(_component_SharedFieldDisplay, {
                    key: 0,
                    label: "Người thi công"
                  }, {
                    default: vueExports.withCtx(() => [
                      vueExports.createVNode("div", { class: "flex flex-col gap-1" }, [
                        (vueExports.openBlock(true), vueExports.createBlock(vueExports.Fragment, null, vueExports.renderList(vueExports.unref(ogTicket).assignees, (a) => {
                          return vueExports.openBlock(), vueExports.createBlock("span", {
                            key: a.id
                          }, vueExports.toDisplayString(a.name), 1);
                        }), 128))
                      ])
                    ]),
                    _: 1
                  })) : vueExports.createCommentVNode("", true),
                  vueExports.createVNode(_component_SharedFieldDisplay, { label: "Trạng thái hiện tại" }, {
                    default: vueExports.withCtx(() => [
                      vueExports.createVNode(_component_UBadge, {
                        label: vueExports.unref(ogTicket).status.label,
                        color: ("ogTicketStatusColor" in _ctx ? _ctx.ogTicketStatusColor : vueExports.unref(ogTicketStatusColor))(vueExports.unref(ogTicket).status.value),
                        variant: "subtle",
                        size: "sm"
                      }, null, 8, ["label", "color"])
                    ]),
                    _: 1
                  }),
                  vueExports.createVNode(_component_SharedFieldDisplay, { label: "Ưu tiên hiện tại" }, {
                    default: vueExports.withCtx(() => [
                      vueExports.createVNode(_component_UBadge, {
                        label: vueExports.unref(ogTicket).priority.label,
                        color: ("ogTicketPriorityColor" in _ctx ? _ctx.ogTicketPriorityColor : vueExports.unref(ogTicketPriorityColor))(vueExports.unref(ogTicket).priority.value),
                        variant: "soft",
                        size: "sm"
                      }, null, 8, ["label", "color"])
                    ]),
                    _: 1
                  }),
                  vueExports.createVNode(_component_SharedFieldDisplay, { label: "Cập nhật lúc" }, {
                    default: vueExports.withCtx(() => [
                      vueExports.createTextVNode(vueExports.toDisplayString(("formatDateTime" in _ctx ? _ctx.formatDateTime : vueExports.unref(formatDateTime))(vueExports.unref(ogTicket).updated_at)), 1)
                    ]),
                    _: 1
                  })
                ])
              ];
            }
          }),
          _: 1
        }, _parent));
        _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UButton, {
          label: "Xem chi tiết",
          icon: "i-lucide-eye",
          color: "primary",
          variant: "soft",
          class: "w-full",
          to: `/pmc/og-tickets/${vueExports.unref(id)}`
        }, null, _parent));
        _push(`</div></div>`);
      } else {
        _push(`<!---->`);
      }
      if (vueExports.unref(ogTicket)) {
        _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_SharedOgTicketCategoryModal, {
          open: vueExports.unref(categoriesModalOpen),
          "onUpdate:open": ($event) => vueExports.isRef(categoriesModalOpen) ? categoriesModalOpen.value = $event : null,
          "og-ticket-id": vueExports.unref(ogTicket).id,
          "selected-ids": vueExports.unref(selectedCategoryIds),
          onSaved: handleCategoriesSaved
        }, null, _parent));
      } else {
        _push(`<!---->`);
      }
      _push(`</div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = vueExports.useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/pmc/og-tickets/[id]/edit.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=edit-DuUA0SDe.mjs.map
