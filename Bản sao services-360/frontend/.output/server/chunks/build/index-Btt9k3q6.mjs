import { v as vueExports, u as useSeoMeta, p as useRoute$1, s as serverRenderer_cjs_prodExports, _ as __nuxt_component_0$4 } from './server.mjs';
import { _ as _sfc_main$1 } from './Alert-tTsPKADX.mjs';
import { _ as __nuxt_component_9 } from './AddressMapPicker-jpXrfuln.mjs';
import { A as ATTACHMENT_MAX_FILES } from './file-DEnEYJZ3.mjs';
import { u as useAppContext } from './useAppContext-qiCJKBCF.mjs';
import { S as SELECT_ALL_PER_PAGE } from './constants-G9YmtWtp.mjs';
import { u as usePublicServices } from './useCatalogItems-Db1MWi3b.mjs';
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

/* empty css                 */
const _sfc_main = /* @__PURE__ */ vueExports.defineComponent({
  __name: "index",
  __ssrInlineRender: true,
  setup(__props) {
    useSeoMeta({
      title: "Gửi yêu cầu hỗ trợ - Thần Nông",
      description: "Gửi yêu cầu sửa chữa và bảo trì căn hộ nhanh chóng. Phản hồi trong 24 giờ."
    });
    const route = useRoute$1();
    const q = route.query;
    const { isTenantDomain, tenantSubdomain } = useAppContext();
    const locked = {
      name: !!q.name,
      phone: !!q.phone,
      org_id: !!q.org_id || isTenantDomain.value,
      project_id: !!q.project_id,
      channel: !!q.channel,
      address: !!q.address
    };
    const requesterName = vueExports.ref(locked.name ? String(q.name) : "");
    const requesterPhone = vueExports.ref(locked.phone ? String(q.phone) : "");
    const requesterEmail = vueExports.ref("");
    vueExports.ref(
      q.org_id ? String(q.org_id) : isTenantDomain.value ? tenantSubdomain.value ?? void 0 : void 0
    );
    vueExports.ref(locked.project_id ? Number(q.project_id) : null);
    const subject = vueExports.ref("");
    const description = vueExports.ref("");
    const address = vueExports.ref(locked.address ? String(q.address) : "");
    const latitude = vueExports.ref(null);
    const longitude = vueExports.ref(null);
    vueExports.ref(locked.channel ? String(q.channel) : "website");
    const attachments = vueExports.ref([]);
    const errors = vueExports.ref({});
    const isSubmitting = vueExports.ref(false);
    const submittedTicket = vueExports.ref(null);
    const serviceParams = vueExports.ref({ per_page: SELECT_ALL_PER_PAGE });
    const { data: servicesData, status: servicesStatus } = usePublicServices(serviceParams);
    const quickCategories = vueExports.computed(() => {
      const categories = servicesData.value?.categories ?? [];
      const items = servicesData.value?.data ?? [];
      return categories.map((cat) => ({
        name: cat.name,
        items: items.filter((item) => item.category?.id === cat.id).map((item) => item.name)
      })).filter((cat) => cat.items.length > 0);
    });
    const prefilledService = q.service ? String(q.service) : null;
    const selectedQuickItems = vueExports.ref(prefilledService ? /* @__PURE__ */ new Set([prefilledService]) : /* @__PURE__ */ new Set());
    const activeCategory = vueExports.ref(0);
    if (prefilledService) {
      const stopWatch = vueExports.watch(quickCategories, (cats) => {
        if (!cats.length) return;
        const idx = cats.findIndex((cat) => cat.items.includes(prefilledService));
        if (idx >= 0) activeCategory.value = idx;
        vueExports.nextTick(() => {
          stopWatch();
        });
      });
    }
    const activeCategoryItems = vueExports.computed(() => quickCategories.value[activeCategory.value]?.items ?? []);
    function categorySelectionCount(catIndex) {
      return quickCategories.value[catIndex]?.items.filter((item) => selectedQuickItems.value.has(item)).length ?? 0;
    }
    const totalSelected = vueExports.computed(() => selectedQuickItems.value.size);
    const selectedItemsWithCategory = vueExports.computed(() => {
      const result = [];
      for (const cat of quickCategories.value) {
        for (const item of cat.items) {
          if (selectedQuickItems.value.has(item)) {
            result.push({ item, category: cat.name });
          }
        }
      }
      return result;
    });
    const orgName = vueExports.ref(null);
    const projectName = vueExports.ref(null);
    const isLookupLoading = vueExports.ref(false);
    vueExports.ref(null);
    function isImageFile(file) {
      return file.type.startsWith("image/");
    }
    const faqs = [
      { question: "Thời gian phản hồi yêu cầu là bao lâu?", answer: "Đội ngũ kỹ thuật sẽ tiếp nhận yêu cầu trong vòng 24 giờ làm việc và liên hệ trực tiếp với bạn để xác nhận lịch xử lý." },
      { question: "Làm sao để theo dõi tiến độ xử lý?", answer: "Sau khi gửi yêu cầu, bạn sẽ nhận được mã yêu cầu (ví dụ: #TNP-2026-0042). Sử dụng mã này để tra cứu trạng thái trên hệ thống." },
      { question: "Chi phí dịch vụ được tính như thế nào?", answer: "Chi phí được báo giá cụ thể sau khi kỹ thuật viên khảo sát thực tế. Bạn sẽ được thông báo trước khi tiến hành sửa chữa." },
      { question: "Tôi cần cung cấp thông tin gì?", answer: "Bạn chỉ cần điền họ tên, số điện thoại và mô tả vấn đề." }
    ];
    const openFaqIndex = vueExports.ref(null);
    return (_ctx, _push, _parent, _attrs) => {
      const _component_NuxtLink = __nuxt_component_0$4;
      const _component_UAlert = _sfc_main$1;
      const _component_SharedAddressMapPicker = __nuxt_component_9;
      _push(`<div${serverRenderer_cjs_prodExports.ssrRenderAttrs(vueExports.mergeProps({ class: "min-h-screen w-full overflow-x-hidden bg-white" }, _attrs))}><section class="relative overflow-hidden bg-slate-900"><div class="absolute top-0 left-1/4 size-[500px] rounded-full bg-indigo-500/10 blur-[150px]"></div><div class="absolute bottom-0 right-1/4 size-[400px] rounded-full bg-violet-500/8 blur-[120px]"></div><div class="absolute inset-0 opacity-[0.04]" style="${serverRenderer_cjs_prodExports.ssrRenderStyle({ "background-image": "linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(to right, rgba(255,255,255,0.5) 1px, transparent 1px)", "background-size": "60px 60px" })}"></div><div class="relative max-w-7xl mx-auto px-6 lg:px-16 py-6 lg:py-10"><div class="flex items-center justify-between mb-8">`);
      _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_NuxtLink, {
        to: "/",
        class: "flex items-center gap-3 group"
      }, {
        default: vueExports.withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="size-10 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center group-hover:bg-slate-700 transition-colors"${_scopeId}><span class="material-symbols-outlined text-white" style="${serverRenderer_cjs_prodExports.ssrRenderStyle({ "font-size": "20px" })}"${_scopeId}>domain</span></div><span class="text-white font-bold text-lg tracking-tight"${_scopeId}>Thần Nông</span>`);
          } else {
            return [
              vueExports.createVNode("div", { class: "size-10 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center group-hover:bg-slate-700 transition-colors" }, [
                vueExports.createVNode("span", {
                  class: "material-symbols-outlined text-white",
                  style: { "font-size": "20px" }
                }, "domain")
              ]),
              vueExports.createVNode("span", { class: "text-white font-bold text-lg tracking-tight" }, "Thần Nông")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`<div class="flex items-center gap-3">`);
      _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_NuxtLink, {
        to: "/dich-vu",
        class: "hidden sm:flex items-center gap-1.5 text-slate-400 text-sm font-medium hover:text-white transition-colors"
      }, {
        default: vueExports.withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(` Dịch vụ <span class="material-symbols-outlined text-sm"${_scopeId}>arrow_forward</span>`);
          } else {
            return [
              vueExports.createTextVNode(" Dịch vụ "),
              vueExports.createVNode("span", { class: "material-symbols-outlined text-sm" }, "arrow_forward")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_NuxtLink, {
        to: "/",
        class: "flex items-center gap-1.5 rounded-full px-5 py-2.5 bg-slate-800 border border-slate-700 text-slate-300 text-sm font-semibold hover:bg-slate-700 hover:text-white transition-all"
      }, {
        default: vueExports.withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<span class="material-symbols-outlined text-sm"${_scopeId}>home</span> Trang chủ `);
          } else {
            return [
              vueExports.createVNode("span", { class: "material-symbols-outlined text-sm" }, "home"),
              vueExports.createTextVNode(" Trang chủ ")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</div></div><div class="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-start"><div class="flex flex-col gap-6 lg:pt-8"><div class="flex items-center gap-3"><span class="inline-flex items-center gap-2 bg-slate-800 border border-slate-700 text-slate-300 text-xs font-bold px-4 py-2 rounded-full"><span class="relative flex size-2"><span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span><span class="relative inline-flex size-2 rounded-full bg-emerald-400"></span></span> Đang hoạt động 24/7 </span></div><h1 class="text-white text-4xl sm:text-5xl xl:text-6xl font-black tracking-tight leading-[1.08]"> Cần hỗ trợ?<br><span class="text-indigo-400"> Gửi ngay tại đây </span></h1><p class="text-slate-400 text-lg leading-relaxed max-w-md"> Điền form bên cạnh để gửi yêu cầu sửa chữa, bảo trì. Đội ngũ kỹ thuật viên sẽ phản hồi trong thời gian nhanh nhất. </p><div class="flex flex-wrap gap-6 mt-4"><div class="flex items-center gap-3"><div class="size-11 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center"><span class="material-symbols-outlined text-amber-300" style="${serverRenderer_cjs_prodExports.ssrRenderStyle({ "font-size": "22px" })}">schedule</span></div><div><p class="text-white text-xl font-black leading-none"> 24h </p><p class="text-slate-500 text-xs font-medium mt-0.5"> Phản hồi </p></div></div><div class="flex items-center gap-3"><div class="size-11 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center"><span class="material-symbols-outlined text-emerald-300" style="${serverRenderer_cjs_prodExports.ssrRenderStyle({ "font-size": "22px" })}">verified</span></div><div><p class="text-white text-xl font-black leading-none"> 98% </p><p class="text-slate-500 text-xs font-medium mt-0.5"> Hài lòng </p></div></div><div class="flex items-center gap-3"><div class="size-11 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center"><span class="material-symbols-outlined text-sky-300" style="${serverRenderer_cjs_prodExports.ssrRenderStyle({ "font-size": "22px" })}">engineering</span></div><div><p class="text-white text-xl font-black leading-none"> 50+ </p><p class="text-slate-500 text-xs font-medium mt-0.5"> Kỹ thuật viên </p></div></div></div><div class="hidden lg:flex items-center gap-5 mt-8 pt-8 border-t border-slate-800"><div class="flex items-center gap-2 text-slate-500 text-xs font-medium"><span class="material-symbols-outlined text-emerald-500" style="${serverRenderer_cjs_prodExports.ssrRenderStyle({ "font-size": "16px" })}">lock</span> Bảo mật thông tin </div><div class="flex items-center gap-2 text-slate-500 text-xs font-medium"><span class="material-symbols-outlined text-amber-500" style="${serverRenderer_cjs_prodExports.ssrRenderStyle({ "font-size": "16px" })}">bolt</span> Xử lý nhanh chóng </div><div class="flex items-center gap-2 text-slate-500 text-xs font-medium"><span class="material-symbols-outlined text-sky-500" style="${serverRenderer_cjs_prodExports.ssrRenderStyle({ "font-size": "16px" })}">support_agent</span> Hỗ trợ tận tình </div></div></div><div class="relative"><div class="absolute -inset-4 bg-indigo-500/5 rounded-[2rem] blur-2xl"></div><div class="relative bg-white rounded-3xl shadow-2xl shadow-black/20 overflow-hidden"><div class="h-1.5 bg-indigo-500"></div><div class="px-6 pt-5 pb-4 border-b border-slate-100"><div class="flex items-center gap-2.5"><div class="size-8 rounded-lg bg-slate-900 text-white flex items-center justify-center"><span class="material-symbols-outlined" style="${serverRenderer_cjs_prodExports.ssrRenderStyle({ "font-size": "17px" })}">edit_note</span></div><div><h2 class="text-slate-900 text-base font-black tracking-tight leading-none"> Gửi yêu cầu hỗ trợ </h2><p class="text-slate-400 text-[10px] mt-1"><span class="text-red-500">*</span> Bắt buộc </p></div></div></div>`);
      if (vueExports.unref(submittedTicket)) {
        _push(`<div class="flex items-center justify-center p-10"><div class="text-center w-full max-w-xs"><div class="relative inline-flex items-center justify-center mb-5"><div class="size-20 rounded-full bg-gradient-to-br from-emerald-100 to-teal-50 flex items-center justify-center"><span class="material-symbols-outlined text-emerald-500" style="${serverRenderer_cjs_prodExports.ssrRenderStyle({ "font-size": "40px", "font-variation-settings": "'FILL' 1" })}">check_circle</span></div><div class="absolute inset-0 rounded-full border-2 border-emerald-300 animate-ping opacity-30"></div></div><h3 class="text-slate-900 text-2xl font-black mb-2"> Gửi thành công! </h3><p class="text-slate-400 text-sm mb-6 leading-relaxed"> Lưu mã bên dưới để theo dõi tiến độ </p><div class="bg-gradient-to-br from-slate-50 to-slate-100 border-2 border-dashed border-slate-200 rounded-2xl px-6 py-5 mb-6"><p class="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1.5"> Mã yêu cầu </p><p class="text-3xl font-black text-slate-900 font-mono tracking-widest">${serverRenderer_cjs_prodExports.ssrInterpolate(vueExports.unref(submittedTicket).code)}</p></div><button class="w-full h-11 rounded-xl bg-indigo-500 text-white text-sm font-bold hover:bg-indigo-600 active:scale-[0.98] transition-all cursor-pointer shadow-lg shadow-indigo-500/25"> Gửi yêu cầu khác </button></div></div>`);
      } else {
        _push(`<form class="px-6 pt-5 pb-6 flex flex-col gap-3">`);
        if (vueExports.unref(errors).general) {
          _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UAlert, {
            icon: "i-lucide-alert-circle",
            color: "error",
            variant: "subtle",
            description: vueExports.unref(errors).general
          }, null, _parent));
        } else {
          _push(`<!---->`);
        }
        if (vueExports.unref(orgName) || vueExports.unref(projectName)) {
          _push(`<div class="rounded-xl bg-indigo-50 border border-indigo-200 px-4 py-3 flex flex-col gap-1">`);
          if (vueExports.unref(orgName)) {
            _push(`<div class="flex items-center gap-2 text-sm"><span class="material-symbols-outlined text-indigo-500" style="${serverRenderer_cjs_prodExports.ssrRenderStyle({ "font-size": "16px" })}">business</span><span class="text-slate-500 text-xs">Đơn vị:</span><span class="font-semibold text-slate-800">${serverRenderer_cjs_prodExports.ssrInterpolate(vueExports.unref(orgName))}</span></div>`);
          } else {
            _push(`<!---->`);
          }
          if (vueExports.unref(projectName)) {
            _push(`<div class="flex items-center gap-2 text-sm"><span class="material-symbols-outlined text-indigo-500" style="${serverRenderer_cjs_prodExports.ssrRenderStyle({ "font-size": "16px" })}">apartment</span><span class="text-slate-500 text-xs">Dự án:</span><span class="font-semibold text-slate-800">${serverRenderer_cjs_prodExports.ssrInterpolate(vueExports.unref(projectName))}</span></div>`);
          } else {
            _push(`<!---->`);
          }
          _push(`</div>`);
        } else if (vueExports.unref(isLookupLoading)) {
          _push(`<div class="rounded-xl bg-slate-50 border border-slate-200 px-4 py-3 flex items-center gap-2 text-sm text-slate-400"><span class="material-symbols-outlined text-sm animate-spin">progress_activity</span> Đang tải thông tin... </div>`);
        } else {
          _push(`<!---->`);
        }
        _push(`<div class="grid grid-cols-1 sm:grid-cols-2 gap-3"><div class="flex flex-col gap-1.5"><label for="f-name" class="text-xs font-bold text-slate-600">Họ và tên <span class="text-red-500">*</span></label><input id="f-name"${serverRenderer_cjs_prodExports.ssrRenderAttr("value", vueExports.unref(requesterName))} type="text" placeholder="Nguyễn Văn A"${serverRenderer_cjs_prodExports.ssrIncludeBooleanAttr(vueExports.unref(isSubmitting) || locked.name) ? " disabled" : ""} class="${serverRenderer_cjs_prodExports.ssrRenderClass([vueExports.unref(errors).requester_name ? "border-red-400 bg-red-50" : locked.name ? "border-slate-200 bg-slate-100" : "border-slate-200 bg-slate-50/80 focus:bg-white focus:border-indigo-500", "h-10 rounded-xl border px-3.5 text-sm text-slate-900 placeholder:text-slate-300 outline-none transition-all focus:ring-2 focus:ring-indigo-500/20 disabled:opacity-60 disabled:cursor-not-allowed"])}">`);
        if (vueExports.unref(errors).requester_name) {
          _push(`<p class="text-[11px] text-red-500">${serverRenderer_cjs_prodExports.ssrInterpolate(vueExports.unref(errors).requester_name)}</p>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</div><div class="flex flex-col gap-1.5"><label for="f-phone" class="text-xs font-bold text-slate-600">Số điện thoại <span class="text-red-500">*</span></label><input id="f-phone"${serverRenderer_cjs_prodExports.ssrRenderAttr("value", vueExports.unref(requesterPhone))} type="tel" placeholder="0901 234 567"${serverRenderer_cjs_prodExports.ssrIncludeBooleanAttr(vueExports.unref(isSubmitting) || locked.phone) ? " disabled" : ""} class="${serverRenderer_cjs_prodExports.ssrRenderClass([vueExports.unref(errors).requester_phone ? "border-red-400 bg-red-50" : locked.phone ? "border-slate-200 bg-slate-100" : "border-slate-200 bg-slate-50/80 focus:bg-white focus:border-indigo-500", "h-10 rounded-xl border px-3.5 text-sm text-slate-900 placeholder:text-slate-300 outline-none transition-all focus:ring-2 focus:ring-indigo-500/20 disabled:opacity-60 disabled:cursor-not-allowed"])}">`);
        if (vueExports.unref(errors).requester_phone) {
          _push(`<p class="text-[11px] text-red-500">${serverRenderer_cjs_prodExports.ssrInterpolate(vueExports.unref(errors).requester_phone)}</p>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</div></div><div class="flex flex-col gap-1.5"><label for="f-email" class="text-xs font-bold text-slate-600">Email <span class="text-[10px] font-semibold text-slate-400">(không bắt buộc — để nhận cập nhật qua mail)</span></label><input id="f-email"${serverRenderer_cjs_prodExports.ssrRenderAttr("value", vueExports.unref(requesterEmail))} type="email" autocomplete="email" placeholder="ban@example.com"${serverRenderer_cjs_prodExports.ssrIncludeBooleanAttr(vueExports.unref(isSubmitting)) ? " disabled" : ""} class="${serverRenderer_cjs_prodExports.ssrRenderClass([vueExports.unref(errors).requester_email ? "border-red-400 bg-red-50" : "border-slate-200 bg-slate-50/80 focus:bg-white focus:border-indigo-500", "h-10 rounded-xl border px-3.5 text-sm text-slate-900 placeholder:text-slate-300 outline-none transition-all focus:ring-2 focus:ring-indigo-500/20 disabled:opacity-60 disabled:cursor-not-allowed"])}">`);
        if (vueExports.unref(errors).requester_email) {
          _push(`<p class="text-[11px] text-red-500">${serverRenderer_cjs_prodExports.ssrInterpolate(vueExports.unref(errors).requester_email)}</p>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</div><div class="border-t border-slate-100 my-0.5"></div><div class="flex flex-col gap-2"><div class="flex flex-col gap-0.5"><div class="flex items-center justify-between"><label class="text-xs font-bold text-slate-600"> Danh mục <span class="text-red-500">*</span></label>`);
        if (vueExports.unref(totalSelected) > 0) {
          _push(`<span class="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-600 bg-emerald-50 pl-1.5 pr-2 py-0.5 rounded-full"><span class="material-symbols-outlined" style="${serverRenderer_cjs_prodExports.ssrRenderStyle({ "font-size": "13px" })}">check_circle</span> ${serverRenderer_cjs_prodExports.ssrInterpolate(vueExports.unref(totalSelected))}</span>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</div><p class="text-[10px] text-slate-400"> Có thể chọn nhiều danh mục cùng lúc </p></div>`);
        if (vueExports.unref(servicesStatus) === "pending") {
          _push(`<div class="flex items-center justify-center py-4"><span class="material-symbols-outlined animate-spin text-slate-400" style="${serverRenderer_cjs_prodExports.ssrRenderStyle({ "font-size": "20px" })}">progress_activity</span><span class="ml-2 text-xs text-slate-400">Đang tải danh mục...</span></div>`);
        } else if (vueExports.unref(quickCategories).length > 0) {
          _push(`<!--[--><div class="flex gap-1 overflow-x-auto pb-0.5" style="${serverRenderer_cjs_prodExports.ssrRenderStyle({ "scrollbar-width": "none", "-ms-overflow-style": "none" })}"><!--[-->`);
          serverRenderer_cjs_prodExports.ssrRenderList(vueExports.unref(quickCategories), (cat, idx) => {
            _push(`<button type="button"${serverRenderer_cjs_prodExports.ssrIncludeBooleanAttr(vueExports.unref(isSubmitting)) ? " disabled" : ""} class="${serverRenderer_cjs_prodExports.ssrRenderClass([vueExports.unref(activeCategory) === idx ? "bg-slate-800 text-white shadow-sm" : "bg-slate-100 text-slate-500 hover:bg-slate-200 hover:text-slate-700", "relative flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-[11px] font-semibold whitespace-nowrap transition-all shrink-0 cursor-pointer disabled:opacity-50"])}">${serverRenderer_cjs_prodExports.ssrInterpolate(cat.name)} `);
            if (categorySelectionCount(idx) > 0) {
              _push(`<span class="${serverRenderer_cjs_prodExports.ssrRenderClass([vueExports.unref(activeCategory) === idx ? "bg-indigo-400 text-white" : "bg-indigo-500 text-white", "size-[15px] rounded-full text-[9px] font-bold flex items-center justify-center"])}">${serverRenderer_cjs_prodExports.ssrInterpolate(categorySelectionCount(idx))}</span>`);
            } else {
              _push(`<!---->`);
            }
            _push(`</button>`);
          });
          _push(`<!--]--></div><div class="grid grid-cols-2 gap-1.5"><!--[-->`);
          serverRenderer_cjs_prodExports.ssrRenderList(vueExports.unref(activeCategoryItems), (item) => {
            _push(`<button type="button"${serverRenderer_cjs_prodExports.ssrIncludeBooleanAttr(vueExports.unref(isSubmitting)) ? " disabled" : ""} class="${serverRenderer_cjs_prodExports.ssrRenderClass([vueExports.unref(selectedQuickItems).has(item) ? "bg-indigo-50 border-indigo-300 text-indigo-700" : "bg-white border-slate-200 text-slate-600 hover:border-slate-300 hover:bg-slate-50", "flex items-center gap-1.5 px-3 py-2 rounded-lg border text-xs font-medium transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed text-left"])}"><span class="${serverRenderer_cjs_prodExports.ssrRenderClass([vueExports.unref(selectedQuickItems).has(item) ? "bg-indigo-500 text-white" : "border border-slate-300", "size-4 rounded shrink-0 flex items-center justify-center transition-colors"])}">`);
            if (vueExports.unref(selectedQuickItems).has(item)) {
              _push(`<span class="material-symbols-outlined" style="${serverRenderer_cjs_prodExports.ssrRenderStyle({ "font-size": "12px" })}">check</span>`);
            } else {
              _push(`<!---->`);
            }
            _push(`</span><span class="leading-tight">${serverRenderer_cjs_prodExports.ssrInterpolate(item)}</span></button>`);
          });
          _push(`<!--]--></div>`);
          if (vueExports.unref(selectedItemsWithCategory).length > 0) {
            _push(`<div class="flex flex-wrap gap-1.5"><!--[-->`);
            serverRenderer_cjs_prodExports.ssrRenderList(vueExports.unref(selectedItemsWithCategory), ({ item, category }) => {
              _push(`<span class="inline-flex items-center gap-1 bg-indigo-50 border border-indigo-200 text-indigo-700 rounded-full pl-2 pr-1 py-0.5 text-[10px] font-medium"><span class="text-indigo-400 font-bold">${serverRenderer_cjs_prodExports.ssrInterpolate(category)}</span><span class="mx-0.5 text-indigo-300">·</span> ${serverRenderer_cjs_prodExports.ssrInterpolate(item)} <button type="button"${serverRenderer_cjs_prodExports.ssrIncludeBooleanAttr(vueExports.unref(isSubmitting)) ? " disabled" : ""} class="size-4 rounded-full flex items-center justify-center hover:bg-indigo-200 transition-colors cursor-pointer ml-0.5 disabled:opacity-50"><span class="material-symbols-outlined text-indigo-400 hover:text-indigo-600" style="${serverRenderer_cjs_prodExports.ssrRenderStyle({ "font-size": "11px" })}">close</span></button></span>`);
            });
            _push(`<!--]--></div>`);
          } else {
            _push(`<!---->`);
          }
          _push(`<!--]-->`);
        } else {
          _push(`<!---->`);
        }
        _push(`<input id="f-subject"${serverRenderer_cjs_prodExports.ssrRenderAttr("value", vueExports.unref(subject))} type="text" placeholder="Hoặc ghi vấn đề khác..."${serverRenderer_cjs_prodExports.ssrIncludeBooleanAttr(vueExports.unref(isSubmitting)) ? " disabled" : ""} class="h-8 rounded-lg border border-dashed border-slate-200 bg-transparent px-3 text-xs text-slate-700 placeholder:text-slate-300 outline-none transition-all focus:bg-white focus:border-indigo-400 focus:border-solid focus:ring-2 focus:ring-indigo-500/15 disabled:opacity-50">`);
        if (vueExports.unref(errors).subject) {
          _push(`<p class="text-[11px] text-red-500 -mt-1">${serverRenderer_cjs_prodExports.ssrInterpolate(vueExports.unref(errors).subject)}</p>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</div><div class="flex flex-col gap-1"><label for="f-desc" class="text-xs font-bold text-slate-600">Mô tả chi tiết</label><textarea id="f-desc" rows="2" placeholder="Mô tả thêm về vấn đề..."${serverRenderer_cjs_prodExports.ssrIncludeBooleanAttr(vueExports.unref(isSubmitting)) ? " disabled" : ""} class="rounded-lg border border-slate-200 bg-slate-50/80 focus:bg-white focus:border-indigo-500 px-3 py-2 text-xs text-slate-900 placeholder:text-slate-300 outline-none resize-none transition-all focus:ring-2 focus:ring-indigo-500/15 disabled:opacity-50">${serverRenderer_cjs_prodExports.ssrInterpolate(vueExports.unref(description))}</textarea></div>`);
        if (locked.address) {
          _push(`<div class="flex flex-col gap-1.5"><label class="text-xs font-bold text-slate-600">Địa chỉ</label><input${serverRenderer_cjs_prodExports.ssrRenderAttr("value", vueExports.unref(address))} type="text" disabled class="h-10 rounded-xl border border-slate-200 bg-slate-100 px-3.5 text-sm text-slate-900 disabled:opacity-60 disabled:cursor-not-allowed"></div>`);
        } else {
          _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_SharedAddressMapPicker, {
            modelValue: vueExports.unref(address),
            "onUpdate:modelValue": ($event) => vueExports.isRef(address) ? address.value = $event : null,
            latitude: vueExports.unref(latitude),
            "onUpdate:latitude": ($event) => vueExports.isRef(latitude) ? latitude.value = $event : null,
            longitude: vueExports.unref(longitude),
            "onUpdate:longitude": ($event) => vueExports.isRef(longitude) ? longitude.value = $event : null,
            disabled: vueExports.unref(isSubmitting),
            collapsible: ""
          }, null, _parent));
        }
        _push(`<div class="flex flex-col gap-1.5"><input type="file" multiple accept="image/jpeg,image/png,image/gif,image/webp,application/pdf,.doc,.docx,.xls,.xlsx" class="hidden"${serverRenderer_cjs_prodExports.ssrIncludeBooleanAttr(vueExports.unref(isSubmitting)) ? " disabled" : ""}>`);
        if (vueExports.unref(attachments).length < ("ATTACHMENT_MAX_FILES" in _ctx ? _ctx.ATTACHMENT_MAX_FILES : vueExports.unref(ATTACHMENT_MAX_FILES))) {
          _push(`<button type="button"${serverRenderer_cjs_prodExports.ssrIncludeBooleanAttr(vueExports.unref(isSubmitting)) ? " disabled" : ""} class="flex items-center gap-2 self-start px-3 py-2 rounded-lg border border-dashed border-slate-300 text-xs font-medium text-slate-500 transition-all hover:border-indigo-400 hover:text-indigo-600 hover:bg-indigo-50/50 disabled:opacity-50 cursor-pointer"><span class="material-symbols-outlined" style="${serverRenderer_cjs_prodExports.ssrRenderStyle({ "font-size": "16px" })}">attach_file</span> Đính kèm tệp <span class="text-[10px] text-slate-400 font-normal">(tối đa ${serverRenderer_cjs_prodExports.ssrInterpolate("ATTACHMENT_MAX_FILES" in _ctx ? _ctx.ATTACHMENT_MAX_FILES : vueExports.unref(ATTACHMENT_MAX_FILES))})</span></button>`);
        } else {
          _push(`<!---->`);
        }
        if (vueExports.unref(attachments).length > 0) {
          _push(`<div class="flex flex-wrap gap-1.5"><!--[-->`);
          serverRenderer_cjs_prodExports.ssrRenderList(vueExports.unref(attachments), (file, idx) => {
            _push(`<div class="flex items-center gap-1.5 rounded-md bg-slate-50 border border-slate-200 pl-2 pr-1 py-1 max-w-[200px]"><span class="${serverRenderer_cjs_prodExports.ssrRenderClass([isImageFile(file) ? "text-violet-500" : "text-amber-600", "material-symbols-outlined shrink-0"])}" style="${serverRenderer_cjs_prodExports.ssrRenderStyle({ "font-size": "13px" })}">${serverRenderer_cjs_prodExports.ssrInterpolate(isImageFile(file) ? "image" : "description")}</span><span class="text-[10px] font-medium text-slate-600 truncate">${serverRenderer_cjs_prodExports.ssrInterpolate(file.name)}</span><button type="button" class="size-5 rounded flex items-center justify-center hover:bg-red-100 transition-colors cursor-pointer shrink-0"${serverRenderer_cjs_prodExports.ssrIncludeBooleanAttr(vueExports.unref(isSubmitting)) ? " disabled" : ""}><span class="material-symbols-outlined text-slate-400 hover:text-red-500" style="${serverRenderer_cjs_prodExports.ssrRenderStyle({ "font-size": "12px" })}">close</span></button></div>`);
          });
          _push(`<!--]--></div>`);
        } else {
          _push(`<!---->`);
        }
        if (vueExports.unref(errors).attachments) {
          _push(`<p class="text-[11px] text-red-500">${serverRenderer_cjs_prodExports.ssrInterpolate(vueExports.unref(errors).attachments)}</p>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</div><button type="submit"${serverRenderer_cjs_prodExports.ssrIncludeBooleanAttr(vueExports.unref(isSubmitting)) ? " disabled" : ""} class="flex items-center justify-center gap-2 w-full h-11 rounded-xl bg-slate-900 text-white text-sm font-bold hover:bg-slate-800 active:scale-[0.98] transition-all disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer">`);
        if (vueExports.unref(isSubmitting)) {
          _push(`<span class="material-symbols-outlined text-base animate-spin">progress_activity</span>`);
        } else {
          _push(`<span class="material-symbols-outlined text-base">send</span>`);
        }
        _push(` ${serverRenderer_cjs_prodExports.ssrInterpolate(vueExports.unref(isSubmitting) ? "Đang gửi..." : "Gửi yêu cầu")}</button></form>`);
      }
      _push(`</div></div></div></div></section><section class="relative bg-slate-50 py-20 overflow-hidden"><div class="absolute top-0 right-0 size-96 rounded-full bg-indigo-100/40 blur-[100px]"></div><div class="absolute bottom-0 left-0 size-72 rounded-full bg-fuchsia-100/30 blur-[80px]"></div><div class="relative max-w-7xl mx-auto px-6 lg:px-16"><div class="text-center mb-14"><span class="inline-flex items-center gap-2 bg-indigo-100 text-indigo-700 text-xs font-bold px-4 py-1.5 rounded-full mb-4"><span class="material-symbols-outlined" style="${serverRenderer_cjs_prodExports.ssrRenderStyle({ "font-size": "14px" })}">route</span> Quy trình </span><h2 class="text-slate-900 text-3xl lg:text-4xl font-black tracking-tight mb-3"> Đơn giản chỉ <span class="bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent">3 bước</span></h2><p class="text-slate-500 text-lg max-w-xl mx-auto"> Nhanh gọn, tiện lợi — không cần đăng ký tài khoản </p></div><div class="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8"><div class="relative group"><div class="bg-white rounded-2xl p-8 border border-slate-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300"><div class="flex items-center gap-3 mb-5"><div class="size-12 rounded-2xl bg-gradient-to-br from-indigo-500 to-indigo-600 text-white flex items-center justify-center shadow-lg shadow-indigo-500/30 font-black text-lg"> 1 </div><div class="h-0.5 flex-1 bg-gradient-to-r from-indigo-200 to-transparent rounded"></div></div><div class="size-12 rounded-xl bg-indigo-50 flex items-center justify-center mb-4"><span class="material-symbols-outlined text-indigo-600" style="${serverRenderer_cjs_prodExports.ssrRenderStyle({ "font-size": "26px" })}">edit_note</span></div><h3 class="text-slate-900 text-lg font-bold mb-2"> Điền thông tin </h3><p class="text-slate-500 text-sm leading-relaxed"> Nhập họ tên, số điện thoại và mô tả sự cố cần hỗ trợ. </p></div><div class="hidden md:flex absolute -right-3 top-1/2 -translate-y-1/2 z-10 size-6 rounded-full bg-white border border-slate-200 shadow items-center justify-center"><span class="material-symbols-outlined text-indigo-500" style="${serverRenderer_cjs_prodExports.ssrRenderStyle({ "font-size": "14px" })}">arrow_forward</span></div></div><div class="relative group"><div class="bg-white rounded-2xl p-8 border border-slate-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300"><div class="flex items-center gap-3 mb-5"><div class="size-12 rounded-2xl bg-gradient-to-br from-violet-500 to-violet-600 text-white flex items-center justify-center shadow-lg shadow-violet-500/30 font-black text-lg"> 2 </div><div class="h-0.5 flex-1 bg-gradient-to-r from-violet-200 to-transparent rounded"></div></div><div class="size-12 rounded-xl bg-violet-50 flex items-center justify-center mb-4"><span class="material-symbols-outlined text-violet-600" style="${serverRenderer_cjs_prodExports.ssrRenderStyle({ "font-size": "26px" })}">task_alt</span></div><h3 class="text-slate-900 text-lg font-bold mb-2"> Tiếp nhận &amp; phân công </h3><p class="text-slate-500 text-sm leading-relaxed"> Đội ngũ đánh giá yêu cầu và phân công kỹ thuật viên phù hợp. </p></div><div class="hidden md:flex absolute -right-3 top-1/2 -translate-y-1/2 z-10 size-6 rounded-full bg-white border border-slate-200 shadow items-center justify-center"><span class="material-symbols-outlined text-violet-500" style="${serverRenderer_cjs_prodExports.ssrRenderStyle({ "font-size": "14px" })}">arrow_forward</span></div></div><div class="group"><div class="bg-white rounded-2xl p-8 border border-slate-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300"><div class="flex items-center gap-3 mb-5"><div class="size-12 rounded-2xl bg-gradient-to-br from-fuchsia-500 to-fuchsia-600 text-white flex items-center justify-center shadow-lg shadow-fuchsia-500/30 font-black text-lg"> 3 </div><div class="h-0.5 flex-1 bg-gradient-to-r from-fuchsia-200 to-transparent rounded"></div></div><div class="size-12 rounded-xl bg-fuchsia-50 flex items-center justify-center mb-4"><span class="material-symbols-outlined text-fuchsia-600" style="${serverRenderer_cjs_prodExports.ssrRenderStyle({ "font-size": "26px" })}">handyman</span></div><h3 class="text-slate-900 text-lg font-bold mb-2"> Xử lý &amp; hoàn thành </h3><p class="text-slate-500 text-sm leading-relaxed"> Kỹ thuật viên đến tận nơi xử lý. Theo dõi qua mã yêu cầu. </p></div></div></div></div></section><section class="py-20"><div class="max-w-7xl mx-auto px-6 lg:px-16"><div class="text-center mb-14"><span class="inline-flex items-center gap-2 bg-emerald-100 text-emerald-700 text-xs font-bold px-4 py-1.5 rounded-full mb-4"><span class="material-symbols-outlined" style="${serverRenderer_cjs_prodExports.ssrRenderStyle({ "font-size": "14px" })}">star</span> Cam kết </span><h2 class="text-slate-900 text-3xl lg:text-4xl font-black tracking-tight mb-3"> Tại sao chọn <span class="bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">Thần Nông?</span></h2><p class="text-slate-500 text-lg max-w-xl mx-auto"> Dịch vụ hỗ trợ cư dân hàng đầu </p></div><div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"><div class="group p-6 rounded-2xl border border-slate-100 bg-white hover:shadow-xl hover:-translate-y-1 transition-all duration-300"><div class="size-12 rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center mb-4 shadow-lg shadow-amber-400/30 group-hover:scale-110 transition-transform"><span class="material-symbols-outlined text-white" style="${serverRenderer_cjs_prodExports.ssrRenderStyle({ "font-size": "24px" })}">bolt</span></div><h3 class="text-slate-900 text-base font-bold mb-1.5"> Phản hồi nhanh chóng </h3><p class="text-slate-500 text-sm leading-relaxed"> Tiếp nhận trong 24h. Sự cố khẩn cấp ưu tiên xử lý ngay. </p></div><div class="group p-6 rounded-2xl border border-slate-100 bg-white hover:shadow-xl hover:-translate-y-1 transition-all duration-300"><div class="size-12 rounded-xl bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center mb-4 shadow-lg shadow-emerald-400/30 group-hover:scale-110 transition-transform"><span class="material-symbols-outlined text-white" style="${serverRenderer_cjs_prodExports.ssrRenderStyle({ "font-size": "24px" })}">manage_search</span></div><h3 class="text-slate-900 text-base font-bold mb-1.5"> Theo dõi minh bạch </h3><p class="text-slate-500 text-sm leading-relaxed"> Mã yêu cầu giúp tra cứu trạng thái mọi lúc, mọi nơi. </p></div><div class="group p-6 rounded-2xl border border-slate-100 bg-white hover:shadow-xl hover:-translate-y-1 transition-all duration-300"><div class="size-12 rounded-xl bg-gradient-to-br from-indigo-400 to-blue-500 flex items-center justify-center mb-4 shadow-lg shadow-indigo-400/30 group-hover:scale-110 transition-transform"><span class="material-symbols-outlined text-white" style="${serverRenderer_cjs_prodExports.ssrRenderStyle({ "font-size": "24px" })}">verified_user</span></div><h3 class="text-slate-900 text-base font-bold mb-1.5"> KTV chuyên nghiệp </h3><p class="text-slate-500 text-sm leading-relaxed"> Đội ngũ được đào tạo bài bản, chứng nhận chuyên môn. </p></div><div class="group p-6 rounded-2xl border border-slate-100 bg-white hover:shadow-xl hover:-translate-y-1 transition-all duration-300"><div class="size-12 rounded-xl bg-gradient-to-br from-violet-400 to-purple-500 flex items-center justify-center mb-4 shadow-lg shadow-violet-400/30 group-hover:scale-110 transition-transform"><span class="material-symbols-outlined text-white" style="${serverRenderer_cjs_prodExports.ssrRenderStyle({ "font-size": "24px" })}">payments</span></div><h3 class="text-slate-900 text-base font-bold mb-1.5"> Báo giá minh bạch </h3><p class="text-slate-500 text-sm leading-relaxed"> Chi phí thông báo rõ trước khi sửa. Không phí ẩn. </p></div><div class="group p-6 rounded-2xl border border-slate-100 bg-white hover:shadow-xl hover:-translate-y-1 transition-all duration-300"><div class="size-12 rounded-xl bg-gradient-to-br from-rose-400 to-pink-500 flex items-center justify-center mb-4 shadow-lg shadow-rose-400/30 group-hover:scale-110 transition-transform"><span class="material-symbols-outlined text-white" style="${serverRenderer_cjs_prodExports.ssrRenderStyle({ "font-size": "24px" })}">support</span></div><h3 class="text-slate-900 text-base font-bold mb-1.5"> Hỗ trợ đa kênh </h3><p class="text-slate-500 text-sm leading-relaxed"> Gửi qua website, hotline hoặc app. Luôn sẵn sàng. </p></div><div class="group p-6 rounded-2xl border border-slate-100 bg-white hover:shadow-xl hover:-translate-y-1 transition-all duration-300"><div class="size-12 rounded-xl bg-gradient-to-br from-cyan-400 to-sky-500 flex items-center justify-center mb-4 shadow-lg shadow-cyan-400/30 group-hover:scale-110 transition-transform"><span class="material-symbols-outlined text-white" style="${serverRenderer_cjs_prodExports.ssrRenderStyle({ "font-size": "24px" })}">workspace_premium</span></div><h3 class="text-slate-900 text-base font-bold mb-1.5"> Bảo hành dịch vụ </h3><p class="text-slate-500 text-sm leading-relaxed"> Cam kết bảo hành sau sửa chữa. Hỗ trợ xử lý lại. </p></div></div></div></section><section class="bg-slate-50 py-20"><div class="max-w-3xl mx-auto px-6 lg:px-16"><div class="text-center mb-12"><span class="inline-flex items-center gap-2 bg-violet-100 text-violet-700 text-xs font-bold px-4 py-1.5 rounded-full mb-4"><span class="material-symbols-outlined" style="${serverRenderer_cjs_prodExports.ssrRenderStyle({ "font-size": "14px" })}">help</span> FAQ </span><h2 class="text-slate-900 text-3xl lg:text-4xl font-black tracking-tight mb-3"> Câu hỏi thường gặp </h2><p class="text-slate-500 text-lg"> Giải đáp thắc mắc phổ biến từ cư dân </p></div><div class="flex flex-col gap-3"><!--[-->`);
      serverRenderer_cjs_prodExports.ssrRenderList(faqs, (faq, index) => {
        _push(`<div class="${serverRenderer_cjs_prodExports.ssrRenderClass([vueExports.unref(openFaqIndex) === index ? "bg-white border-indigo-200 shadow-md shadow-indigo-100/50" : "bg-white border-slate-200 hover:border-slate-300", "rounded-2xl border overflow-hidden transition-all duration-200"])}"><button class="w-full flex items-center justify-between px-6 py-5 text-left cursor-pointer"><span class="text-slate-900 font-bold text-sm pr-4">${serverRenderer_cjs_prodExports.ssrInterpolate(faq.question)}</span><div class="${serverRenderer_cjs_prodExports.ssrRenderClass([vueExports.unref(openFaqIndex) === index ? "bg-gradient-to-br from-indigo-500 to-violet-600 text-white rotate-180" : "bg-slate-100 text-slate-400", "size-7 rounded-full shrink-0 flex items-center justify-center transition-all duration-200"])}"><span class="material-symbols-outlined" style="${serverRenderer_cjs_prodExports.ssrRenderStyle({ "font-size": "18px" })}">expand_more</span></div></button>`);
        if (vueExports.unref(openFaqIndex) === index) {
          _push(`<div class="px-6 pb-5"><p class="text-slate-500 text-sm leading-relaxed">${serverRenderer_cjs_prodExports.ssrInterpolate(faq.answer)}</p></div>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</div>`);
      });
      _push(`<!--]--></div></div></section><footer class="py-8 border-t border-slate-100"><div class="max-w-7xl mx-auto px-6 lg:px-16 flex flex-col sm:flex-row items-center justify-between gap-4"><div class="flex items-center gap-2 text-slate-400 text-sm"><span class="material-symbols-outlined" style="${serverRenderer_cjs_prodExports.ssrRenderStyle({ "font-size": "18px" })}">domain</span><span class="font-semibold">Thần Nông</span><span class="text-slate-300">·</span><span>© ${serverRenderer_cjs_prodExports.ssrInterpolate((/* @__PURE__ */ new Date()).getFullYear())}</span></div><div class="flex items-center gap-6">`);
      _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_NuxtLink, {
        to: "/",
        class: "text-sm text-slate-400 hover:text-slate-600 transition-colors"
      }, {
        default: vueExports.withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`Trang chủ`);
          } else {
            return [
              vueExports.createTextVNode("Trang chủ")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_NuxtLink, {
        to: "/dich-vu",
        class: "text-sm text-slate-400 hover:text-slate-600 transition-colors"
      }, {
        default: vueExports.withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`Dịch vụ`);
          } else {
            return [
              vueExports.createTextVNode("Dịch vụ")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_NuxtLink, {
        to: "/login",
        class: "text-sm text-slate-400 hover:text-slate-600 transition-colors"
      }, {
        default: vueExports.withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`Đăng nhập`);
          } else {
            return [
              vueExports.createTextVNode("Đăng nhập")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</div></div></footer></div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = vueExports.useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/ticket/index.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=index-Btt9k3q6.mjs.map
