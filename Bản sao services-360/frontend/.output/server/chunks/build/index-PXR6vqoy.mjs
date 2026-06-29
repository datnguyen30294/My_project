import { _ as __nuxt_component_0, a as __nuxt_component_2 } from './LandingFooter-ButK23zG.mjs';
import { v as vueExports, u as useSeoMeta, s as serverRenderer_cjs_prodExports, _ as __nuxt_component_0$4 } from './server.mjs';
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

const title = "Thần Nông - Gửi yêu cầu sửa chữa & bảo trì";
const description = "Gửi yêu cầu sửa chữa, bảo trì căn hộ nhanh chóng. Đội ngũ kỹ thuật viên phản hồi trong 24 giờ.";
const _sfc_main = /* @__PURE__ */ vueExports.defineComponent({
  __name: "index",
  __ssrInlineRender: true,
  setup(__props) {
    useSeoMeta({
      title,
      description,
      ogTitle: title,
      ogDescription: description,
      ogType: "website",
      ogSiteName: "Thần Nông"
    });
    const steps = [
      {
        number: "1",
        title: "Điền thông tin",
        description: "Họ tên, SĐT và mô tả sự cố.",
        gradient: "from-indigo-500 to-indigo-600"
      },
      {
        number: "2",
        title: "Tiếp nhận & phân công",
        description: "Phân công kỹ thuật viên phù hợp.",
        gradient: "from-violet-500 to-violet-600"
      },
      {
        number: "3",
        title: "Xử lý & hoàn thành",
        description: "KTV đến tận nơi, theo dõi qua mã.",
        gradient: "from-fuchsia-500 to-fuchsia-600"
      }
    ];
    return (_ctx, _push, _parent, _attrs) => {
      const _component_LandingHeader = __nuxt_component_0;
      const _component_NuxtLink = __nuxt_component_0$4;
      const _component_LandingFooter = __nuxt_component_2;
      _push(`<div${serverRenderer_cjs_prodExports.ssrRenderAttrs(vueExports.mergeProps({ class: "relative flex min-h-screen w-full flex-col overflow-x-hidden bg-[#f6f7f8]" }, _attrs))}>`);
      _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_LandingHeader, null, null, _parent));
      _push(`<main class="flex-1"><section class="relative overflow-hidden bg-slate-900"><div class="absolute top-0 left-1/3 size-[500px] rounded-full bg-indigo-500/10 blur-[150px]"></div><div class="absolute bottom-0 right-1/4 size-[400px] rounded-full bg-violet-500/8 blur-[120px]"></div><div class="absolute inset-0 opacity-[0.04]" style="${serverRenderer_cjs_prodExports.ssrRenderStyle({ "background-image": "linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(to right, rgba(255,255,255,0.5) 1px, transparent 1px)", "background-size": "60px 60px" })}"></div><div class="relative max-w-7xl mx-auto px-6 lg:px-20 py-20 lg:py-28"><div class="max-w-2xl mx-auto text-center flex flex-col items-center gap-5 mb-16"><span class="inline-flex items-center gap-2 bg-white/10 border border-white/10 text-slate-300 text-xs font-bold px-4 py-2 rounded-full"><span class="relative flex size-2"><span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span><span class="relative inline-flex size-2 rounded-full bg-emerald-400"></span></span> Hỗ trợ 24/7 </span><h1 class="text-white text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-[1.1]"> Cần sửa chữa, bảo trì?<br><span class="text-indigo-400"> Gửi yêu cầu ngay </span></h1><p class="text-slate-400 text-lg max-w-lg"> Chỉ vài phút để gửi yêu cầu. Kỹ thuật viên phản hồi nhanh nhất có thể. </p><div class="flex flex-wrap items-center justify-center gap-4 mt-2">`);
      _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_NuxtLink, {
        to: "/ticket",
        class: "flex items-center gap-3 h-14 px-10 rounded-2xl bg-indigo-500 text-white text-base font-bold shadow-xl shadow-indigo-500/30 hover:bg-indigo-400 hover:scale-105 active:scale-95 transition-all"
      }, {
        default: vueExports.withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<span class="material-symbols-outlined text-xl"${_scopeId}>send</span> Gửi yêu cầu hỗ trợ `);
          } else {
            return [
              vueExports.createVNode("span", { class: "material-symbols-outlined text-xl" }, "send"),
              vueExports.createTextVNode(" Gửi yêu cầu hỗ trợ ")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_NuxtLink, {
        to: "/dich-vu",
        class: "flex items-center gap-2 h-14 px-8 rounded-2xl bg-slate-800 border border-slate-700 text-slate-300 text-base font-semibold hover:bg-slate-700 hover:text-white transition-all"
      }, {
        default: vueExports.withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<span class="material-symbols-outlined text-xl"${_scopeId}>storefront</span> Xem dịch vụ `);
          } else {
            return [
              vueExports.createVNode("span", { class: "material-symbols-outlined text-xl" }, "storefront"),
              vueExports.createTextVNode(" Xem dịch vụ ")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</div></div><div class="grid grid-cols-1 md:grid-cols-3 gap-5"><!--[-->`);
      serverRenderer_cjs_prodExports.ssrRenderList(steps, (step, idx) => {
        _push(`<div class="relative"><div class="flex items-start gap-4 bg-slate-800/80 border border-slate-700/50 rounded-2xl px-5 py-5"><div class="${serverRenderer_cjs_prodExports.ssrRenderClass([step.gradient, "size-10 shrink-0 rounded-xl bg-gradient-to-br text-white flex items-center justify-center font-black text-sm"])}">${serverRenderer_cjs_prodExports.ssrInterpolate(step.number)}</div><div><h3 class="text-white font-bold text-sm mb-1">${serverRenderer_cjs_prodExports.ssrInterpolate(step.title)}</h3><p class="text-slate-400 text-xs leading-relaxed">${serverRenderer_cjs_prodExports.ssrInterpolate(step.description)}</p></div></div>`);
        if (idx < steps.length - 1) {
          _push(`<div class="hidden md:flex absolute -right-2.5 top-1/2 -translate-y-1/2 z-10 size-5 rounded-full bg-slate-700 items-center justify-center"><span class="material-symbols-outlined text-slate-400" style="${serverRenderer_cjs_prodExports.ssrRenderStyle({ "font-size": "12px" })}">arrow_forward</span></div>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</div>`);
      });
      _push(`<!--]--></div></div></section><section class="py-16 px-6 lg:px-20"><div class="max-w-7xl mx-auto"><div class="text-center mb-10"><h2 class="text-slate-900 text-3xl font-bold tracking-tight mb-2"> Dịch vụ của chúng tôi </h2><p class="text-slate-500"> Chọn dịch vụ phù hợp với nhu cầu của bạn </p></div><div class="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl mx-auto">`);
      _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_NuxtLink, {
        to: "/dich-vu",
        class: "group flex flex-col p-8 bg-white border border-slate-100 rounded-2xl shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
      }, {
        default: vueExports.withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="size-14 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform"${_scopeId}><span class="material-symbols-outlined text-3xl"${_scopeId}>storefront</span></div><h3 class="text-xl font-bold text-slate-900 mb-2"${_scopeId}>Danh mục dịch vụ</h3><p class="text-slate-500 text-sm leading-relaxed mb-6"${_scopeId}> Xem danh sách các dịch vụ sửa chữa, bảo trì và tiện ích dành cho cư dân. </p><div class="mt-auto flex items-center gap-2 text-slate-900 font-bold text-sm group-hover:underline underline-offset-4"${_scopeId}> Xem dịch vụ <span class="material-symbols-outlined text-sm"${_scopeId}>arrow_forward</span></div>`);
          } else {
            return [
              vueExports.createVNode("div", { class: "size-14 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform" }, [
                vueExports.createVNode("span", { class: "material-symbols-outlined text-3xl" }, "storefront")
              ]),
              vueExports.createVNode("h3", { class: "text-xl font-bold text-slate-900 mb-2" }, "Danh mục dịch vụ"),
              vueExports.createVNode("p", { class: "text-slate-500 text-sm leading-relaxed mb-6" }, " Xem danh sách các dịch vụ sửa chữa, bảo trì và tiện ích dành cho cư dân. "),
              vueExports.createVNode("div", { class: "mt-auto flex items-center gap-2 text-slate-900 font-bold text-sm group-hover:underline underline-offset-4" }, [
                vueExports.createTextVNode(" Xem dịch vụ "),
                vueExports.createVNode("span", { class: "material-symbols-outlined text-sm" }, "arrow_forward")
              ])
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_NuxtLink, {
        to: "/ticket",
        class: "group flex flex-col p-8 bg-white border border-slate-100 rounded-2xl shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
      }, {
        default: vueExports.withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="size-14 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform"${_scopeId}><span class="material-symbols-outlined text-3xl"${_scopeId}>send</span></div><h3 class="text-xl font-bold text-slate-900 mb-2"${_scopeId}>Gửi yêu cầu hỗ trợ</h3><p class="text-slate-500 text-sm leading-relaxed mb-6"${_scopeId}> Gửi yêu cầu sửa chữa, bảo trì nhanh chóng. Đội ngũ kỹ thuật phản hồi trong 24 giờ. </p><div class="mt-auto flex items-center gap-2 text-slate-900 font-bold text-sm group-hover:underline underline-offset-4"${_scopeId}> Gửi yêu cầu <span class="material-symbols-outlined text-sm"${_scopeId}>arrow_forward</span></div>`);
          } else {
            return [
              vueExports.createVNode("div", { class: "size-14 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform" }, [
                vueExports.createVNode("span", { class: "material-symbols-outlined text-3xl" }, "send")
              ]),
              vueExports.createVNode("h3", { class: "text-xl font-bold text-slate-900 mb-2" }, "Gửi yêu cầu hỗ trợ"),
              vueExports.createVNode("p", { class: "text-slate-500 text-sm leading-relaxed mb-6" }, " Gửi yêu cầu sửa chữa, bảo trì nhanh chóng. Đội ngũ kỹ thuật phản hồi trong 24 giờ. "),
              vueExports.createVNode("div", { class: "mt-auto flex items-center gap-2 text-slate-900 font-bold text-sm group-hover:underline underline-offset-4" }, [
                vueExports.createTextVNode(" Gửi yêu cầu "),
                vueExports.createVNode("span", { class: "material-symbols-outlined text-sm" }, "arrow_forward")
              ])
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</div></div></section></main>`);
      _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_LandingFooter, null, null, _parent));
      _push(`</div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = vueExports.useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/index.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=index-PXR6vqoy.mjs.map
