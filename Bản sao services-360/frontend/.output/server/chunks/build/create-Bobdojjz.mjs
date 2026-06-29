import { v as vueExports, u as useSeoMeta, j as useToast, s as serverRenderer_cjs_prodExports, l as _sfc_main$c, k as _sfc_main$h, q as navigateTo } from './server.mjs';
import { _ as __nuxt_component_4 } from './SectionCard-CH-mG9Mf.mjs';
import { _ as _sfc_main$1 } from './SelectMenu-DKHEMZj7.mjs';
import { _ as _sfc_main$2 } from './Badge-W93D3Jpz.mjs';
import { _ as _sfc_main$3 } from './Input-JXN8po_F.mjs';
import { _ as _sfc_main$4 } from './Textarea-DTCNHwKm.mjs';
import { _ as _sfc_main$5 } from './Select-CZE7Ef6n.mjs';
import { _ as __nuxt_component_3 } from './ProjectSelect-BTBiFCd5.mjs';
import { _ as __nuxt_component_9 } from './AddressMapPicker-jpXrfuln.mjs';
import { A as ATTACHMENT_MAX_FILES, i as isImageMime, f as formatFileSize, b as ATTACHMENT_MAX_FILE_SIZE, a as ATTACHMENT_ALLOWED_TYPES } from './file-DEnEYJZ3.mjs';
import { O as OG_TICKET_PRIORITY_OPTIONS, n as apiCreateOgTicket } from './useOgTickets-DPRh9tlL.mjs';
import { u as useCustomerList } from './useCustomers-ByvzwLgR.mjs';
import { s as stripPhone } from './phone-DErPjpTB.mjs';
import { d as useAccountList } from './useAccounts-BDWM8ZpB.mjs';
import { S as SELECT_ALL_PER_PAGE } from './constants-G9YmtWtp.mjs';
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
import './FocusScope-BZehoQSg.mjs';
import './PopperArrow-C9hHWuSZ.mjs';
import './useDirection-CXYby7CP.mjs';
import './useFormControl-_Lqv8ipK.mjs';
import './useKbd-JjFOu4f7.mjs';
import './utils-BgcT7rQQ.mjs';
import './VisuallyHiddenInput-q6Pz-w0i.mjs';
import './handleAndDispatchCustomEvent-Bk_AVSSo.mjs';
import './index-CSThDD3J.mjs';
import './index-QmZAbLx-.mjs';
import './useFocusGuards-CJykkUFH.mjs';
import './utils-DY0Zag2O.mjs';
import './useEntitySelect-DG9pQ_n0.mjs';
import './useProjects-D4K3VYdb.mjs';

/* empty css                 */
const _sfc_main = /* @__PURE__ */ vueExports.defineComponent({
  __name: "create",
  __ssrInlineRender: true,
  setup(__props) {
    useSeoMeta({ title: "Tạo OG Ticket - Thần Nông" });
    const toast = useToast();
    const form = vueExports.reactive({
      requester_name: "",
      requester_phone: "",
      subject: "",
      description: null,
      address: null,
      apartment_name: null,
      latitude: null,
      longitude: null,
      channel: "website",
      project_id: null,
      priority: "normal",
      internal_note: null,
      received_by_id: null,
      assigned_to_ids: [],
      category_ids: []
    });
    const files = vueExports.ref([]);
    const fileInputRef = vueExports.ref(null);
    const priorityOptions = OG_TICKET_PRIORITY_OPTIONS;
    const channelOptions = [
      { label: "Website", value: "website" },
      { label: "Ứng dụng", value: "app" },
      { label: "Điện thoại", value: "phone" },
      { label: "Trực tiếp", value: "direct" }
    ];
    const customerMode = vueExports.ref("picker");
    const selectedCustomer = vueExports.ref(null);
    const customerPickerValue = vueExports.ref(void 0);
    const customerSearchTerm = vueExports.ref("");
    const customerSearchParams = vueExports.ref({ per_page: 10 });
    const { data: customerListData, status: customerListStatus } = useCustomerList(customerSearchParams);
    const customerPickerItems = vueExports.computed(
      () => (customerListData.value?.data ?? []).map((c) => ({
        id: c.id,
        label: `${c.full_name} — ${c.phone}`,
        customer: c
      }))
    );
    const isSearchingCustomer = vueExports.computed(() => customerListStatus.value === "pending");
    let customerSearchTimeout = null;
    function onCustomerSearchTerm(term) {
      customerSearchTerm.value = term;
      if (customerSearchTimeout) clearTimeout(customerSearchTimeout);
      customerSearchTimeout = setTimeout(() => {
        customerSearchParams.value = { ...customerSearchParams.value, search: term || void 0 };
      }, 300);
    }
    vueExports.watch(customerPickerValue, (item) => {
      if (item) {
        selectedCustomer.value = item.customer;
        form.requester_phone = item.customer.phone;
        form.requester_name = item.customer.full_name;
        customerMode.value = "selected";
      }
    });
    function switchToManual() {
      customerMode.value = "manual";
      selectedCustomer.value = null;
      customerPickerValue.value = void 0;
      const term = customerSearchTerm.value.trim();
      if (term) {
        if (/^[0-9+\-\s]+$/.test(term)) {
          form.requester_phone = stripPhone(term);
        } else {
          form.requester_name = term;
        }
      }
    }
    function resetCustomerPicker() {
      customerMode.value = "picker";
      selectedCustomer.value = null;
      customerPickerValue.value = void 0;
      customerSearchTerm.value = "";
      customerSearchParams.value = { per_page: 10 };
      form.requester_phone = "";
      form.requester_name = "";
    }
    const { data: accountsData } = useAccountList(vueExports.computed(() => ({ per_page: SELECT_ALL_PER_PAGE })));
    const accountOptions = vueExports.computed(() => (accountsData.value?.data ?? []).map((acc) => ({
      label: acc.name,
      value: acc.id
    })));
    const categoryOptions = vueExports.ref([]);
    const totalFileCount = vueExports.computed(() => files.value.length);
    function handleFileSelect(event) {
      const input = event.target;
      if (!input.files) return;
      for (const file of Array.from(input.files)) {
        if (totalFileCount.value >= ATTACHMENT_MAX_FILES) break;
        if (file.size > ATTACHMENT_MAX_FILE_SIZE || !ATTACHMENT_ALLOWED_TYPES.includes(file.type)) continue;
        files.value.push(file);
      }
      input.value = "";
    }
    function removeFile(index) {
      files.value.splice(index, 1);
    }
    const isSubmitting = vueExports.ref(false);
    const errors = vueExports.reactive({});
    vueExports.watch(() => form.requester_name, () => {
      errors.requester_name = void 0;
    });
    vueExports.watch(() => form.requester_phone, () => {
      errors.requester_phone = void 0;
    });
    vueExports.watch(() => form.subject, () => {
      errors.subject = void 0;
    });
    function validate() {
      errors.requester_name = form.requester_name.trim() ? void 0 : "Vui lòng nhập tên khách hàng.";
      errors.requester_phone = form.requester_phone.trim() ? void 0 : "Vui lòng nhập số điện thoại.";
      errors.subject = form.subject.trim() ? void 0 : "Vui lòng nhập tiêu đề.";
      return !errors.requester_name && !errors.requester_phone && !errors.subject;
    }
    async function handleSubmit() {
      if (!validate()) {
        toast.add({ title: "Vui lòng kiểm tra lại các trường bắt buộc.", color: "warning" });
        return;
      }
      isSubmitting.value = true;
      try {
        const res = await apiCreateOgTicket({
          ...form,
          attachments: files.value.length > 0 ? files.value : void 0
        });
        toast.add({ title: "Đã tạo OG Ticket", color: "success" });
        navigateTo(`/pmc/og-tickets/${res.data.id}`);
      } catch (err) {
        toast.add({ title: getApiErrorMessage(err, "Tạo ticket thất bại"), color: "error" });
      } finally {
        isSubmitting.value = false;
      }
    }
    function handleCancel() {
      navigateTo("/pmc/og-tickets");
    }
    return (_ctx, _push, _parent, _attrs) => {
      const _component_UButton = _sfc_main$c;
      const _component_SharedSectionCard = __nuxt_component_4;
      const _component_USelectMenu = _sfc_main$1;
      const _component_UIcon = _sfc_main$h;
      const _component_UBadge = _sfc_main$2;
      const _component_UInput = _sfc_main$3;
      const _component_UTextarea = _sfc_main$4;
      const _component_USelect = _sfc_main$5;
      const _component_SharedProjectSelect = __nuxt_component_3;
      const _component_SharedAddressMapPicker = __nuxt_component_9;
      _push(`<div${serverRenderer_cjs_prodExports.ssrRenderAttrs(_attrs)}><div class="mb-6 flex items-start justify-between gap-4"><div class="flex items-center gap-4">`);
      _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UButton, {
        icon: "i-lucide-arrow-left",
        color: "neutral",
        variant: "ghost",
        to: "/pmc/og-tickets"
      }, null, _parent));
      _push(`<div><h1 class="text-2xl font-black text-slate-900 tracking-tight"> Tạo OG Ticket </h1><p class="text-slate-500 text-sm mt-0.5"> Tạo ticket mới cho khách hàng (gồm ticket gốc ở hệ thống) </p></div></div><div class="flex items-center gap-2 shrink-0">`);
      _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UButton, {
        label: "Hủy",
        color: "neutral",
        variant: "ghost",
        onClick: handleCancel
      }, null, _parent));
      _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UButton, {
        label: "Tạo ticket",
        icon: "i-lucide-plus",
        color: "primary",
        loading: vueExports.unref(isSubmitting),
        onClick: handleSubmit
      }, null, _parent));
      _push(`</div></div><div class="flex flex-col gap-6">`);
      _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_SharedSectionCard, { title: "Khách hàng" }, {
        default: vueExports.withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            if (vueExports.unref(customerMode) === "picker") {
              _push2(`<div${_scopeId}><p class="text-sm font-medium text-slate-700 mb-1.5"${_scopeId}> Tìm khách hàng <span class="text-red-500"${_scopeId}>*</span></p>`);
              _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_USelectMenu, {
                modelValue: vueExports.unref(customerPickerValue),
                "onUpdate:modelValue": ($event) => vueExports.isRef(customerPickerValue) ? customerPickerValue.value = $event : null,
                items: vueExports.unref(customerPickerItems),
                loading: vueExports.unref(isSearchingCustomer),
                "ignore-filter": true,
                "search-input": { placeholder: "Nhập số điện thoại hoặc tên khách hàng..." },
                placeholder: "Nhập SĐT hoặc tên để tìm trong danh bạ",
                class: "w-full",
                "onUpdate:searchTerm": onCustomerSearchTerm
              }, {
                empty: vueExports.withCtx((_2, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    _push3(`<div class="px-2 py-3 text-center"${_scopeId2}><p class="text-sm text-slate-500 mb-2"${_scopeId2}>${serverRenderer_cjs_prodExports.ssrInterpolate(vueExports.unref(customerSearchTerm) ? "Không tìm thấy khách hàng phù hợp" : "Nhập SĐT hoặc tên để tìm kiếm")}</p>`);
                    if (vueExports.unref(customerSearchTerm)) {
                      _push3(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UButton, {
                        label: "Tạo khách hàng mới",
                        icon: "i-lucide-user-plus",
                        color: "primary",
                        variant: "soft",
                        size: "xs",
                        onClick: switchToManual
                      }, null, _parent3, _scopeId2));
                    } else {
                      _push3(`<!---->`);
                    }
                    _push3(`</div>`);
                  } else {
                    return [
                      vueExports.createVNode("div", { class: "px-2 py-3 text-center" }, [
                        vueExports.createVNode("p", { class: "text-sm text-slate-500 mb-2" }, vueExports.toDisplayString(vueExports.unref(customerSearchTerm) ? "Không tìm thấy khách hàng phù hợp" : "Nhập SĐT hoặc tên để tìm kiếm"), 1),
                        vueExports.unref(customerSearchTerm) ? (vueExports.openBlock(), vueExports.createBlock(_component_UButton, {
                          key: 0,
                          label: "Tạo khách hàng mới",
                          icon: "i-lucide-user-plus",
                          color: "primary",
                          variant: "soft",
                          size: "xs",
                          onClick: switchToManual
                        })) : vueExports.createCommentVNode("", true)
                      ])
                    ];
                  }
                }),
                _: 1
              }, _parent2, _scopeId));
              _push2(`<p class="text-xs text-slate-400 mt-1.5 flex items-center gap-2"${_scopeId}><span${_scopeId}>Không có khách hàng trong danh bạ?</span><button type="button" class="text-indigo-600 hover:text-indigo-700 font-medium cursor-pointer"${_scopeId}> Tạo mới </button></p>`);
              if (vueExports.unref(errors).requester_phone || vueExports.unref(errors).requester_name) {
                _push2(`<p class="text-xs text-red-500 mt-1"${_scopeId}> Vui lòng chọn khách hàng hoặc nhập thông tin mới. </p>`);
              } else {
                _push2(`<!---->`);
              }
              _push2(`</div>`);
            } else if (vueExports.unref(customerMode) === "selected" && vueExports.unref(selectedCustomer)) {
              _push2(`<div${_scopeId}><div class="flex items-start gap-3 rounded-lg border border-emerald-200 bg-emerald-50/50 px-4 py-3"${_scopeId}><div class="size-10 rounded-full bg-emerald-100 flex items-center justify-center shrink-0"${_scopeId}>`);
              _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UIcon, {
                name: "i-lucide-user-check",
                class: "size-5 text-emerald-600"
              }, null, _parent2, _scopeId));
              _push2(`</div><div class="flex-1 min-w-0"${_scopeId}><div class="flex items-center gap-2 flex-wrap"${_scopeId}><p class="text-sm font-semibold text-slate-900"${_scopeId}>${serverRenderer_cjs_prodExports.ssrInterpolate(vueExports.unref(selectedCustomer).full_name)}</p>`);
              _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UBadge, {
                color: "success",
                variant: "subtle",
                size: "xs"
              }, {
                default: vueExports.withCtx((_2, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    _push3(` Đã có trong danh bạ `);
                  } else {
                    return [
                      vueExports.createTextVNode(" Đã có trong danh bạ ")
                    ];
                  }
                }),
                _: 1
              }, _parent2, _scopeId));
              _push2(`</div><div class="mt-1 flex items-center gap-4 flex-wrap text-xs text-slate-500"${_scopeId}><span class="flex items-center gap-1"${_scopeId}>`);
              _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UIcon, {
                name: "i-lucide-phone",
                class: "size-3.5"
              }, null, _parent2, _scopeId));
              _push2(` ${serverRenderer_cjs_prodExports.ssrInterpolate(vueExports.unref(selectedCustomer).phone)}</span>`);
              if (vueExports.unref(selectedCustomer).email) {
                _push2(`<span class="flex items-center gap-1"${_scopeId}>`);
                _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UIcon, {
                  name: "i-lucide-mail",
                  class: "size-3.5"
                }, null, _parent2, _scopeId));
                _push2(` ${serverRenderer_cjs_prodExports.ssrInterpolate(vueExports.unref(selectedCustomer).email)}</span>`);
              } else {
                _push2(`<!---->`);
              }
              if (vueExports.unref(selectedCustomer).code) {
                _push2(`<span class="font-mono"${_scopeId}>${serverRenderer_cjs_prodExports.ssrInterpolate(vueExports.unref(selectedCustomer).code)}</span>`);
              } else {
                _push2(`<!---->`);
              }
              _push2(`</div></div>`);
              _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UButton, {
                label: "Đổi",
                icon: "i-lucide-refresh-cw",
                color: "neutral",
                variant: "ghost",
                size: "xs",
                onClick: resetCustomerPicker
              }, null, _parent2, _scopeId));
              _push2(`</div></div>`);
            } else {
              _push2(`<div${_scopeId}><div class="flex items-center justify-between mb-3"${_scopeId}><div class="flex items-center gap-2"${_scopeId}>`);
              _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UIcon, {
                name: "i-lucide-user-plus",
                class: "size-4 text-indigo-500"
              }, null, _parent2, _scopeId));
              _push2(`<span class="text-sm font-semibold text-slate-700"${_scopeId}>Khách hàng mới</span>`);
              _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UBadge, {
                color: "info",
                variant: "subtle",
                size: "xs"
              }, {
                default: vueExports.withCtx((_2, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    _push3(` Sẽ thêm vào danh bạ khi lưu `);
                  } else {
                    return [
                      vueExports.createTextVNode(" Sẽ thêm vào danh bạ khi lưu ")
                    ];
                  }
                }),
                _: 1
              }, _parent2, _scopeId));
              _push2(`</div>`);
              _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UButton, {
                label: "Tìm trong danh bạ",
                icon: "i-lucide-search",
                color: "neutral",
                variant: "ghost",
                size: "xs",
                onClick: resetCustomerPicker
              }, null, _parent2, _scopeId));
              _push2(`</div><div class="grid grid-cols-1 sm:grid-cols-2 gap-4"${_scopeId}><div${_scopeId}><p class="text-sm font-medium text-slate-700 mb-1.5"${_scopeId}> Số điện thoại <span class="text-red-500"${_scopeId}>*</span></p>`);
              _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UInput, {
                modelValue: vueExports.unref(form).requester_phone,
                "onUpdate:modelValue": ($event) => vueExports.unref(form).requester_phone = $event,
                placeholder: "VD: 0901234567",
                class: "w-full",
                color: vueExports.unref(errors).requester_phone ? "error" : void 0
              }, null, _parent2, _scopeId));
              if (vueExports.unref(errors).requester_phone) {
                _push2(`<p class="text-xs text-red-500 mt-1"${_scopeId}>${serverRenderer_cjs_prodExports.ssrInterpolate(vueExports.unref(errors).requester_phone)}</p>`);
              } else {
                _push2(`<!---->`);
              }
              _push2(`</div><div${_scopeId}><p class="text-sm font-medium text-slate-700 mb-1.5"${_scopeId}> Tên khách hàng <span class="text-red-500"${_scopeId}>*</span></p>`);
              _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UInput, {
                modelValue: vueExports.unref(form).requester_name,
                "onUpdate:modelValue": ($event) => vueExports.unref(form).requester_name = $event,
                placeholder: "Nhập họ tên",
                class: "w-full",
                color: vueExports.unref(errors).requester_name ? "error" : void 0
              }, null, _parent2, _scopeId));
              if (vueExports.unref(errors).requester_name) {
                _push2(`<p class="text-xs text-red-500 mt-1"${_scopeId}>${serverRenderer_cjs_prodExports.ssrInterpolate(vueExports.unref(errors).requester_name)}</p>`);
              } else {
                _push2(`<!---->`);
              }
              _push2(`</div></div></div>`);
            }
          } else {
            return [
              vueExports.unref(customerMode) === "picker" ? (vueExports.openBlock(), vueExports.createBlock("div", { key: 0 }, [
                vueExports.createVNode("p", { class: "text-sm font-medium text-slate-700 mb-1.5" }, [
                  vueExports.createTextVNode(" Tìm khách hàng "),
                  vueExports.createVNode("span", { class: "text-red-500" }, "*")
                ]),
                vueExports.createVNode(_component_USelectMenu, {
                  modelValue: vueExports.unref(customerPickerValue),
                  "onUpdate:modelValue": ($event) => vueExports.isRef(customerPickerValue) ? customerPickerValue.value = $event : null,
                  items: vueExports.unref(customerPickerItems),
                  loading: vueExports.unref(isSearchingCustomer),
                  "ignore-filter": true,
                  "search-input": { placeholder: "Nhập số điện thoại hoặc tên khách hàng..." },
                  placeholder: "Nhập SĐT hoặc tên để tìm trong danh bạ",
                  class: "w-full",
                  "onUpdate:searchTerm": onCustomerSearchTerm
                }, {
                  empty: vueExports.withCtx(() => [
                    vueExports.createVNode("div", { class: "px-2 py-3 text-center" }, [
                      vueExports.createVNode("p", { class: "text-sm text-slate-500 mb-2" }, vueExports.toDisplayString(vueExports.unref(customerSearchTerm) ? "Không tìm thấy khách hàng phù hợp" : "Nhập SĐT hoặc tên để tìm kiếm"), 1),
                      vueExports.unref(customerSearchTerm) ? (vueExports.openBlock(), vueExports.createBlock(_component_UButton, {
                        key: 0,
                        label: "Tạo khách hàng mới",
                        icon: "i-lucide-user-plus",
                        color: "primary",
                        variant: "soft",
                        size: "xs",
                        onClick: switchToManual
                      })) : vueExports.createCommentVNode("", true)
                    ])
                  ]),
                  _: 1
                }, 8, ["modelValue", "onUpdate:modelValue", "items", "loading"]),
                vueExports.createVNode("p", { class: "text-xs text-slate-400 mt-1.5 flex items-center gap-2" }, [
                  vueExports.createVNode("span", null, "Không có khách hàng trong danh bạ?"),
                  vueExports.createVNode("button", {
                    type: "button",
                    class: "text-indigo-600 hover:text-indigo-700 font-medium cursor-pointer",
                    onClick: switchToManual
                  }, " Tạo mới ")
                ]),
                vueExports.unref(errors).requester_phone || vueExports.unref(errors).requester_name ? (vueExports.openBlock(), vueExports.createBlock("p", {
                  key: 0,
                  class: "text-xs text-red-500 mt-1"
                }, " Vui lòng chọn khách hàng hoặc nhập thông tin mới. ")) : vueExports.createCommentVNode("", true)
              ])) : vueExports.unref(customerMode) === "selected" && vueExports.unref(selectedCustomer) ? (vueExports.openBlock(), vueExports.createBlock("div", { key: 1 }, [
                vueExports.createVNode("div", { class: "flex items-start gap-3 rounded-lg border border-emerald-200 bg-emerald-50/50 px-4 py-3" }, [
                  vueExports.createVNode("div", { class: "size-10 rounded-full bg-emerald-100 flex items-center justify-center shrink-0" }, [
                    vueExports.createVNode(_component_UIcon, {
                      name: "i-lucide-user-check",
                      class: "size-5 text-emerald-600"
                    })
                  ]),
                  vueExports.createVNode("div", { class: "flex-1 min-w-0" }, [
                    vueExports.createVNode("div", { class: "flex items-center gap-2 flex-wrap" }, [
                      vueExports.createVNode("p", { class: "text-sm font-semibold text-slate-900" }, vueExports.toDisplayString(vueExports.unref(selectedCustomer).full_name), 1),
                      vueExports.createVNode(_component_UBadge, {
                        color: "success",
                        variant: "subtle",
                        size: "xs"
                      }, {
                        default: vueExports.withCtx(() => [
                          vueExports.createTextVNode(" Đã có trong danh bạ ")
                        ]),
                        _: 1
                      })
                    ]),
                    vueExports.createVNode("div", { class: "mt-1 flex items-center gap-4 flex-wrap text-xs text-slate-500" }, [
                      vueExports.createVNode("span", { class: "flex items-center gap-1" }, [
                        vueExports.createVNode(_component_UIcon, {
                          name: "i-lucide-phone",
                          class: "size-3.5"
                        }),
                        vueExports.createTextVNode(" " + vueExports.toDisplayString(vueExports.unref(selectedCustomer).phone), 1)
                      ]),
                      vueExports.unref(selectedCustomer).email ? (vueExports.openBlock(), vueExports.createBlock("span", {
                        key: 0,
                        class: "flex items-center gap-1"
                      }, [
                        vueExports.createVNode(_component_UIcon, {
                          name: "i-lucide-mail",
                          class: "size-3.5"
                        }),
                        vueExports.createTextVNode(" " + vueExports.toDisplayString(vueExports.unref(selectedCustomer).email), 1)
                      ])) : vueExports.createCommentVNode("", true),
                      vueExports.unref(selectedCustomer).code ? (vueExports.openBlock(), vueExports.createBlock("span", {
                        key: 1,
                        class: "font-mono"
                      }, vueExports.toDisplayString(vueExports.unref(selectedCustomer).code), 1)) : vueExports.createCommentVNode("", true)
                    ])
                  ]),
                  vueExports.createVNode(_component_UButton, {
                    label: "Đổi",
                    icon: "i-lucide-refresh-cw",
                    color: "neutral",
                    variant: "ghost",
                    size: "xs",
                    onClick: resetCustomerPicker
                  })
                ])
              ])) : (vueExports.openBlock(), vueExports.createBlock("div", { key: 2 }, [
                vueExports.createVNode("div", { class: "flex items-center justify-between mb-3" }, [
                  vueExports.createVNode("div", { class: "flex items-center gap-2" }, [
                    vueExports.createVNode(_component_UIcon, {
                      name: "i-lucide-user-plus",
                      class: "size-4 text-indigo-500"
                    }),
                    vueExports.createVNode("span", { class: "text-sm font-semibold text-slate-700" }, "Khách hàng mới"),
                    vueExports.createVNode(_component_UBadge, {
                      color: "info",
                      variant: "subtle",
                      size: "xs"
                    }, {
                      default: vueExports.withCtx(() => [
                        vueExports.createTextVNode(" Sẽ thêm vào danh bạ khi lưu ")
                      ]),
                      _: 1
                    })
                  ]),
                  vueExports.createVNode(_component_UButton, {
                    label: "Tìm trong danh bạ",
                    icon: "i-lucide-search",
                    color: "neutral",
                    variant: "ghost",
                    size: "xs",
                    onClick: resetCustomerPicker
                  })
                ]),
                vueExports.createVNode("div", { class: "grid grid-cols-1 sm:grid-cols-2 gap-4" }, [
                  vueExports.createVNode("div", null, [
                    vueExports.createVNode("p", { class: "text-sm font-medium text-slate-700 mb-1.5" }, [
                      vueExports.createTextVNode(" Số điện thoại "),
                      vueExports.createVNode("span", { class: "text-red-500" }, "*")
                    ]),
                    vueExports.createVNode(_component_UInput, {
                      modelValue: vueExports.unref(form).requester_phone,
                      "onUpdate:modelValue": ($event) => vueExports.unref(form).requester_phone = $event,
                      placeholder: "VD: 0901234567",
                      class: "w-full",
                      color: vueExports.unref(errors).requester_phone ? "error" : void 0
                    }, null, 8, ["modelValue", "onUpdate:modelValue", "color"]),
                    vueExports.unref(errors).requester_phone ? (vueExports.openBlock(), vueExports.createBlock("p", {
                      key: 0,
                      class: "text-xs text-red-500 mt-1"
                    }, vueExports.toDisplayString(vueExports.unref(errors).requester_phone), 1)) : vueExports.createCommentVNode("", true)
                  ]),
                  vueExports.createVNode("div", null, [
                    vueExports.createVNode("p", { class: "text-sm font-medium text-slate-700 mb-1.5" }, [
                      vueExports.createTextVNode(" Tên khách hàng "),
                      vueExports.createVNode("span", { class: "text-red-500" }, "*")
                    ]),
                    vueExports.createVNode(_component_UInput, {
                      modelValue: vueExports.unref(form).requester_name,
                      "onUpdate:modelValue": ($event) => vueExports.unref(form).requester_name = $event,
                      placeholder: "Nhập họ tên",
                      class: "w-full",
                      color: vueExports.unref(errors).requester_name ? "error" : void 0
                    }, null, 8, ["modelValue", "onUpdate:modelValue", "color"]),
                    vueExports.unref(errors).requester_name ? (vueExports.openBlock(), vueExports.createBlock("p", {
                      key: 0,
                      class: "text-xs text-red-500 mt-1"
                    }, vueExports.toDisplayString(vueExports.unref(errors).requester_name), 1)) : vueExports.createCommentVNode("", true)
                  ])
                ])
              ]))
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_SharedSectionCard, { title: "Nội dung ticket" }, {
        default: vueExports.withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="grid grid-cols-1 sm:grid-cols-2 gap-4"${_scopeId}><div class="sm:col-span-2"${_scopeId}><p class="text-sm font-medium text-slate-700 mb-1.5"${_scopeId}> Tiêu đề <span class="text-red-500"${_scopeId}>*</span></p>`);
            _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UInput, {
              modelValue: vueExports.unref(form).subject,
              "onUpdate:modelValue": ($event) => vueExports.unref(form).subject = $event,
              placeholder: "VD: Sửa điện phòng 101",
              class: "w-full",
              color: vueExports.unref(errors).subject ? "error" : void 0
            }, null, _parent2, _scopeId));
            if (vueExports.unref(errors).subject) {
              _push2(`<p class="text-xs text-red-500 mt-1"${_scopeId}>${serverRenderer_cjs_prodExports.ssrInterpolate(vueExports.unref(errors).subject)}</p>`);
            } else {
              _push2(`<!---->`);
            }
            _push2(`</div><div class="sm:col-span-2"${_scopeId}><p class="text-sm font-medium text-slate-700 mb-1.5"${_scopeId}> Mô tả </p>`);
            _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UTextarea, {
              modelValue: vueExports.unref(form).description,
              "onUpdate:modelValue": ($event) => vueExports.unref(form).description = $event,
              rows: 3,
              class: "w-full",
              placeholder: "Mô tả chi tiết..."
            }, null, _parent2, _scopeId));
            _push2(`</div><div${_scopeId}><p class="text-sm font-medium text-slate-700 mb-1.5"${_scopeId}> Kênh tiếp nhận <span class="text-red-500"${_scopeId}>*</span></p>`);
            _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_USelect, {
              modelValue: vueExports.unref(form).channel,
              "onUpdate:modelValue": ($event) => vueExports.unref(form).channel = $event,
              items: channelOptions,
              class: "w-full"
            }, null, _parent2, _scopeId));
            _push2(`</div><div${_scopeId}><p class="text-sm font-medium text-slate-700 mb-1.5"${_scopeId}> Căn hộ </p>`);
            _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UInput, {
              modelValue: vueExports.unref(form).apartment_name,
              "onUpdate:modelValue": ($event) => vueExports.unref(form).apartment_name = $event,
              placeholder: "VD: A-101",
              class: "w-full"
            }, null, _parent2, _scopeId));
            _push2(`</div><div${_scopeId}><p class="text-sm font-medium text-slate-700 mb-1.5"${_scopeId}> Dự án </p>`);
            _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_SharedProjectSelect, {
              modelValue: vueExports.unref(form).project_id,
              "onUpdate:modelValue": ($event) => vueExports.unref(form).project_id = $event
            }, null, _parent2, _scopeId));
            _push2(`</div><div${_scopeId}><p class="text-sm font-medium text-slate-700 mb-1.5"${_scopeId}> Phân loại </p>`);
            _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_USelectMenu, {
              "model-value": vueExports.unref(form).category_ids ?? [],
              items: vueExports.unref(categoryOptions),
              "value-key": "value",
              multiple: "",
              placeholder: "Chọn phân loại",
              class: "w-full",
              "onUpdate:modelValue": ($event) => vueExports.unref(form).category_ids = $event
            }, null, _parent2, _scopeId));
            _push2(`</div></div><div class="border-t border-slate-100 pt-5 mt-5"${_scopeId}>`);
            _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_SharedAddressMapPicker, {
              "model-value": vueExports.unref(form).address ?? "",
              latitude: vueExports.unref(form).latitude ?? null,
              longitude: vueExports.unref(form).longitude ?? null,
              collapsible: "",
              "onUpdate:modelValue": ($event) => vueExports.unref(form).address = $event,
              "onUpdate:latitude": ($event) => vueExports.unref(form).latitude = $event,
              "onUpdate:longitude": ($event) => vueExports.unref(form).longitude = $event
            }, null, _parent2, _scopeId));
            _push2(`</div><div class="border-t border-slate-100 pt-5 mt-5"${_scopeId}><div class="flex items-center gap-2 mb-3"${_scopeId}>`);
            _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UIcon, {
              name: "i-lucide-paperclip",
              class: "size-4 text-slate-400"
            }, null, _parent2, _scopeId));
            _push2(`<span class="text-sm font-semibold text-slate-700"${_scopeId}>Tệp đính kèm</span><span class="text-xs text-slate-400"${_scopeId}>(${serverRenderer_cjs_prodExports.ssrInterpolate(vueExports.unref(totalFileCount))}/${serverRenderer_cjs_prodExports.ssrInterpolate("ATTACHMENT_MAX_FILES" in _ctx ? _ctx.ATTACHMENT_MAX_FILES : vueExports.unref(ATTACHMENT_MAX_FILES))})</span></div>`);
            if (vueExports.unref(files).length > 0) {
              _push2(`<div class="flex flex-col gap-2 mb-3"${_scopeId}><!--[-->`);
              serverRenderer_cjs_prodExports.ssrRenderList(vueExports.unref(files), (file, idx) => {
                _push2(`<div class="flex items-center gap-3 rounded-lg border border-slate-200 px-3 py-2"${_scopeId}><div class="${serverRenderer_cjs_prodExports.ssrRenderClass([("isImageMime" in _ctx ? _ctx.isImageMime : vueExports.unref(isImageMime))(file.type) ? "bg-violet-100" : "bg-amber-100", "size-8 rounded-lg flex items-center justify-center shrink-0"])}"${_scopeId}>`);
                _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UIcon, {
                  name: ("isImageMime" in _ctx ? _ctx.isImageMime : vueExports.unref(isImageMime))(file.type) ? "i-lucide-image" : "i-lucide-file-text",
                  class: ["size-4", ("isImageMime" in _ctx ? _ctx.isImageMime : vueExports.unref(isImageMime))(file.type) ? "text-violet-500" : "text-amber-600"]
                }, null, _parent2, _scopeId));
                _push2(`</div><div class="flex-1 min-w-0"${_scopeId}><p class="text-xs font-medium text-slate-700 truncate"${_scopeId}>${serverRenderer_cjs_prodExports.ssrInterpolate(file.name)}</p><p class="text-[10px] text-slate-400"${_scopeId}>${serverRenderer_cjs_prodExports.ssrInterpolate(("formatFileSize" in _ctx ? _ctx.formatFileSize : vueExports.unref(formatFileSize))(file.size))}</p></div><button type="button" class="size-6 rounded-md hover:bg-red-50 flex items-center justify-center cursor-pointer"${_scopeId}>`);
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
                vueExports.createVNode("div", { class: "sm:col-span-2" }, [
                  vueExports.createVNode("p", { class: "text-sm font-medium text-slate-700 mb-1.5" }, [
                    vueExports.createTextVNode(" Tiêu đề "),
                    vueExports.createVNode("span", { class: "text-red-500" }, "*")
                  ]),
                  vueExports.createVNode(_component_UInput, {
                    modelValue: vueExports.unref(form).subject,
                    "onUpdate:modelValue": ($event) => vueExports.unref(form).subject = $event,
                    placeholder: "VD: Sửa điện phòng 101",
                    class: "w-full",
                    color: vueExports.unref(errors).subject ? "error" : void 0
                  }, null, 8, ["modelValue", "onUpdate:modelValue", "color"]),
                  vueExports.unref(errors).subject ? (vueExports.openBlock(), vueExports.createBlock("p", {
                    key: 0,
                    class: "text-xs text-red-500 mt-1"
                  }, vueExports.toDisplayString(vueExports.unref(errors).subject), 1)) : vueExports.createCommentVNode("", true)
                ]),
                vueExports.createVNode("div", { class: "sm:col-span-2" }, [
                  vueExports.createVNode("p", { class: "text-sm font-medium text-slate-700 mb-1.5" }, " Mô tả "),
                  vueExports.createVNode(_component_UTextarea, {
                    modelValue: vueExports.unref(form).description,
                    "onUpdate:modelValue": ($event) => vueExports.unref(form).description = $event,
                    rows: 3,
                    class: "w-full",
                    placeholder: "Mô tả chi tiết..."
                  }, null, 8, ["modelValue", "onUpdate:modelValue"])
                ]),
                vueExports.createVNode("div", null, [
                  vueExports.createVNode("p", { class: "text-sm font-medium text-slate-700 mb-1.5" }, [
                    vueExports.createTextVNode(" Kênh tiếp nhận "),
                    vueExports.createVNode("span", { class: "text-red-500" }, "*")
                  ]),
                  vueExports.createVNode(_component_USelect, {
                    modelValue: vueExports.unref(form).channel,
                    "onUpdate:modelValue": ($event) => vueExports.unref(form).channel = $event,
                    items: channelOptions,
                    class: "w-full"
                  }, null, 8, ["modelValue", "onUpdate:modelValue"])
                ]),
                vueExports.createVNode("div", null, [
                  vueExports.createVNode("p", { class: "text-sm font-medium text-slate-700 mb-1.5" }, " Căn hộ "),
                  vueExports.createVNode(_component_UInput, {
                    modelValue: vueExports.unref(form).apartment_name,
                    "onUpdate:modelValue": ($event) => vueExports.unref(form).apartment_name = $event,
                    placeholder: "VD: A-101",
                    class: "w-full"
                  }, null, 8, ["modelValue", "onUpdate:modelValue"])
                ]),
                vueExports.createVNode("div", null, [
                  vueExports.createVNode("p", { class: "text-sm font-medium text-slate-700 mb-1.5" }, " Dự án "),
                  vueExports.createVNode(_component_SharedProjectSelect, {
                    modelValue: vueExports.unref(form).project_id,
                    "onUpdate:modelValue": ($event) => vueExports.unref(form).project_id = $event
                  }, null, 8, ["modelValue", "onUpdate:modelValue"])
                ]),
                vueExports.createVNode("div", null, [
                  vueExports.createVNode("p", { class: "text-sm font-medium text-slate-700 mb-1.5" }, " Phân loại "),
                  vueExports.createVNode(_component_USelectMenu, {
                    "model-value": vueExports.unref(form).category_ids ?? [],
                    items: vueExports.unref(categoryOptions),
                    "value-key": "value",
                    multiple: "",
                    placeholder: "Chọn phân loại",
                    class: "w-full",
                    "onUpdate:modelValue": ($event) => vueExports.unref(form).category_ids = $event
                  }, null, 8, ["model-value", "items", "onUpdate:modelValue"])
                ])
              ]),
              vueExports.createVNode("div", { class: "border-t border-slate-100 pt-5 mt-5" }, [
                vueExports.createVNode(_component_SharedAddressMapPicker, {
                  "model-value": vueExports.unref(form).address ?? "",
                  latitude: vueExports.unref(form).latitude ?? null,
                  longitude: vueExports.unref(form).longitude ?? null,
                  collapsible: "",
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
                  vueExports.createVNode("span", { class: "text-sm font-semibold text-slate-700" }, "Tệp đính kèm"),
                  vueExports.createVNode("span", { class: "text-xs text-slate-400" }, "(" + vueExports.toDisplayString(vueExports.unref(totalFileCount)) + "/" + vueExports.toDisplayString("ATTACHMENT_MAX_FILES" in _ctx ? _ctx.ATTACHMENT_MAX_FILES : vueExports.unref(ATTACHMENT_MAX_FILES)) + ")", 1)
                ]),
                vueExports.unref(files).length > 0 ? (vueExports.openBlock(), vueExports.createBlock("div", {
                  key: 0,
                  class: "flex flex-col gap-2 mb-3"
                }, [
                  (vueExports.openBlock(true), vueExports.createBlock(vueExports.Fragment, null, vueExports.renderList(vueExports.unref(files), (file, idx) => {
                    return vueExports.openBlock(), vueExports.createBlock("div", {
                      key: idx,
                      class: "flex items-center gap-3 rounded-lg border border-slate-200 px-3 py-2"
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
                        vueExports.createVNode("p", { class: "text-[10px] text-slate-400" }, vueExports.toDisplayString(("formatFileSize" in _ctx ? _ctx.formatFileSize : vueExports.unref(formatFileSize))(file.size)), 1)
                      ]),
                      vueExports.createVNode("button", {
                        type: "button",
                        class: "size-6 rounded-md hover:bg-red-50 flex items-center justify-center cursor-pointer",
                        onClick: ($event) => removeFile(idx)
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
                  key: 1,
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
      _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_SharedSectionCard, { title: "Phân công & xử lý" }, {
        default: vueExports.withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="grid grid-cols-1 sm:grid-cols-2 gap-5"${_scopeId}><div${_scopeId}><p class="text-sm font-medium text-slate-700 mb-1.5"${_scopeId}> Ưu tiên <span class="text-red-500"${_scopeId}>*</span></p>`);
            _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_USelect, {
              modelValue: vueExports.unref(form).priority,
              "onUpdate:modelValue": ($event) => vueExports.unref(form).priority = $event,
              items: vueExports.unref(priorityOptions),
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
            _push2(`</div><div class="sm:col-span-2"${_scopeId}><p class="text-sm font-medium text-slate-700 mb-1.5"${_scopeId}> Người thi công </p>`);
            _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_USelectMenu, {
              "model-value": vueExports.unref(form).assigned_to_ids ?? [],
              items: vueExports.unref(accountOptions),
              "value-key": "value",
              multiple: "",
              placeholder: "Chọn người thi công",
              class: "w-full",
              "onUpdate:modelValue": ($event) => vueExports.unref(form).assigned_to_ids = $event
            }, null, _parent2, _scopeId));
            _push2(`<p class="text-xs text-slate-400 mt-1"${_scopeId}> Gán người thi công sẽ tự chuyển trạng thái sang <strong${_scopeId}>Đã phân công</strong>. </p></div><div class="sm:col-span-2"${_scopeId}><p class="text-sm font-medium text-slate-700 mb-1.5"${_scopeId}> Ghi chú nội bộ </p>`);
            _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UTextarea, {
              modelValue: vueExports.unref(form).internal_note,
              "onUpdate:modelValue": ($event) => vueExports.unref(form).internal_note = $event,
              placeholder: "Nhập ghi chú nội bộ...",
              rows: 3,
              class: "w-full"
            }, null, _parent2, _scopeId));
            _push2(`</div></div>`);
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
                vueExports.createVNode("div", { class: "sm:col-span-2" }, [
                  vueExports.createVNode("p", { class: "text-sm font-medium text-slate-700 mb-1.5" }, " Người thi công "),
                  vueExports.createVNode(_component_USelectMenu, {
                    "model-value": vueExports.unref(form).assigned_to_ids ?? [],
                    items: vueExports.unref(accountOptions),
                    "value-key": "value",
                    multiple: "",
                    placeholder: "Chọn người thi công",
                    class: "w-full",
                    "onUpdate:modelValue": ($event) => vueExports.unref(form).assigned_to_ids = $event
                  }, null, 8, ["model-value", "items", "onUpdate:modelValue"]),
                  vueExports.createVNode("p", { class: "text-xs text-slate-400 mt-1" }, [
                    vueExports.createTextVNode(" Gán người thi công sẽ tự chuyển trạng thái sang "),
                    vueExports.createVNode("strong", null, "Đã phân công"),
                    vueExports.createTextVNode(". ")
                  ])
                ]),
                vueExports.createVNode("div", { class: "sm:col-span-2" }, [
                  vueExports.createVNode("p", { class: "text-sm font-medium text-slate-700 mb-1.5" }, " Ghi chú nội bộ "),
                  vueExports.createVNode(_component_UTextarea, {
                    modelValue: vueExports.unref(form).internal_note,
                    "onUpdate:modelValue": ($event) => vueExports.unref(form).internal_note = $event,
                    placeholder: "Nhập ghi chú nội bộ...",
                    rows: 3,
                    class: "w-full"
                  }, null, 8, ["modelValue", "onUpdate:modelValue"])
                ])
              ])
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`<div class="flex items-center gap-3 lg:hidden">`);
      _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UButton, {
        label: "Tạo ticket",
        icon: "i-lucide-plus",
        color: "primary",
        loading: vueExports.unref(isSubmitting),
        class: "flex-1",
        onClick: handleSubmit
      }, null, _parent));
      _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UButton, {
        label: "Hủy",
        color: "neutral",
        variant: "ghost",
        onClick: handleCancel
      }, null, _parent));
      _push(`</div></div></div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = vueExports.useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/pmc/og-tickets/create.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=create-Bobdojjz.mjs.map
