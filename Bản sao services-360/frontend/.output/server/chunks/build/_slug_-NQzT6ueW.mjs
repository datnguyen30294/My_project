import { _ as __nuxt_component_0, a as __nuxt_component_2 } from './LandingFooter-ButK23zG.mjs';
import { v as vueExports, p as useRoute$1, u as useSeoMeta, s as serverRenderer_cjs_prodExports, _ as __nuxt_component_0$4 } from './server.mjs';
import { f as formatCurrency } from './currency-DEb2TrW3.mjs';
import { a as usePublicServiceDetail } from './useCatalogItems-Db1MWi3b.mjs';
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
import './constants-G9YmtWtp.mjs';

const _sfc_main = /* @__PURE__ */ vueExports.defineComponent({
  __name: "[slug]",
  __ssrInlineRender: true,
  setup(__props) {
    const route = useRoute$1();
    const slug = vueExports.computed(() => String(route.params.slug));
    const { data, status, error } = usePublicServiceDetail(slug);
    const service = vueExports.computed(() => data.value?.data ?? null);
    vueExports.watchEffect(() => {
      if (!service.value) return;
      useSeoMeta({
        title: `${service.value.name} - Thần Nông`,
        description: service.value.description || `Dịch vụ ${service.value.name}`,
        ogTitle: `${service.value.name} - Thần Nông`,
        ogDescription: service.value.description || `Dịch vụ ${service.value.name}`,
        ogImage: service.value.image_url || void 0
      });
    });
    const lightboxIndex = vueExports.ref(null);
    const galleryImages = vueExports.computed(() => {
      if (!service.value) return [];
      const imgs = [];
      if (service.value.image_url) {
        imgs.push({ url: service.value.image_url, alt: service.value.name });
      }
      if (Array.isArray(service.value.images)) {
        for (const img of service.value.images) {
          const url = typeof img === "string" ? img : typeof img === "object" && img !== null && "image_url" in img ? String(img.image_url) : null;
          if (url) imgs.push({ url, alt: `${service.value.name} gallery` });
        }
      }
      return imgs;
    });
    return (_ctx, _push, _parent, _attrs) => {
      const _component_LandingHeader = __nuxt_component_0;
      const _component_NuxtLink = __nuxt_component_0$4;
      const _component_LandingFooter = __nuxt_component_2;
      _push(`<div${serverRenderer_cjs_prodExports.ssrRenderAttrs(vueExports.mergeProps({ class: "relative flex min-h-screen w-full flex-col overflow-x-hidden bg-[#f6f7f8]" }, _attrs))}>`);
      _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_LandingHeader, null, null, _parent));
      _push(`<main class="flex-1">`);
      if (vueExports.unref(status) === "pending") {
        _push(`<div class="max-w-4xl mx-auto px-6 lg:px-20 py-16"><div class="animate-pulse space-y-6"><div class="h-5 w-40 bg-slate-200 rounded"></div><div class="h-10 w-3/4 bg-slate-200 rounded"></div><div class="h-80 w-full bg-slate-200 rounded-2xl"></div><div class="space-y-3"><div class="h-4 w-full bg-slate-200 rounded"></div><div class="h-4 w-5/6 bg-slate-200 rounded"></div><div class="h-4 w-2/3 bg-slate-200 rounded"></div></div></div></div>`);
      } else if (vueExports.unref(error) || !vueExports.unref(service)) {
        _push(`<div class="max-w-4xl mx-auto px-6 lg:px-20 py-20 text-center"><span class="material-symbols-outlined text-7xl text-slate-300 mb-6 block"> error_outline </span><h2 class="text-2xl font-bold text-slate-900 mb-3"> Không tìm thấy dịch vụ </h2><p class="text-slate-500 mb-8"> Dịch vụ bạn tìm kiếm không tồn tại hoặc đã bị gỡ. </p>`);
        _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_NuxtLink, {
          to: "/dich-vu",
          class: "inline-flex items-center gap-2 bg-slate-900 text-white px-8 py-3 rounded-xl font-bold hover:bg-slate-800 transition-all"
        }, {
          default: vueExports.withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`<span class="material-symbols-outlined text-xl"${_scopeId}>arrow_back</span> Quay lại danh sách dịch vụ `);
            } else {
              return [
                vueExports.createVNode("span", { class: "material-symbols-outlined text-xl" }, "arrow_back"),
                vueExports.createTextVNode(" Quay lại danh sách dịch vụ ")
              ];
            }
          }),
          _: 1
        }, _parent));
        _push(`</div>`);
      } else {
        _push(`<!--[-->`);
        if (vueExports.unref(service).image_url) {
          _push(`<div class="relative w-full h-[340px] sm:h-[420px] lg:h-[480px] overflow-hidden bg-slate-900"><img${serverRenderer_cjs_prodExports.ssrRenderAttr("src", vueExports.unref(service).image_url)}${serverRenderer_cjs_prodExports.ssrRenderAttr("alt", vueExports.unref(service).name)} class="absolute inset-0 w-full h-full object-cover opacity-70"><div class="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/40 to-transparent"></div><div class="relative h-full max-w-4xl mx-auto px-6 lg:px-20 flex flex-col justify-end pb-10"><nav class="flex items-center gap-2 text-sm text-white/60 mb-5">`);
          _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_NuxtLink, {
            to: "/dich-vu",
            class: "hover:text-white transition-colors"
          }, {
            default: vueExports.withCtx((_, _push2, _parent2, _scopeId) => {
              if (_push2) {
                _push2(` Dịch vụ `);
              } else {
                return [
                  vueExports.createTextVNode(" Dịch vụ ")
                ];
              }
            }),
            _: 1
          }, _parent));
          _push(`<span class="material-symbols-outlined text-sm">chevron_right</span>`);
          if (vueExports.unref(service).category) {
            _push(`<span class="hover:text-white transition-colors">${serverRenderer_cjs_prodExports.ssrInterpolate(vueExports.unref(service).category.name)}</span>`);
          } else {
            _push(`<!---->`);
          }
          if (vueExports.unref(service).category) {
            _push(`<span class="material-symbols-outlined text-sm">chevron_right</span>`);
          } else {
            _push(`<!---->`);
          }
          _push(`<span class="text-white/90 truncate max-w-xs">${serverRenderer_cjs_prodExports.ssrInterpolate(vueExports.unref(service).name)}</span></nav><div class="flex items-center gap-3 mb-4">`);
          if (vueExports.unref(service).category) {
            _push(`<span class="inline-flex items-center bg-white/15 border border-white/20 text-white text-xs font-bold uppercase tracking-wider px-3 py-1.5 rounded-full backdrop-blur-sm">${serverRenderer_cjs_prodExports.ssrInterpolate(vueExports.unref(service).category.name)}</span>`);
          } else {
            _push(`<!---->`);
          }
          if (vueExports.unref(service).is_featured) {
            _push(`<span class="inline-flex items-center gap-1.5 bg-amber-500/90 text-white text-xs font-bold uppercase tracking-wider px-3 py-1.5 rounded-full"><span class="material-symbols-outlined text-sm">star</span> Nổi bật </span>`);
          } else {
            _push(`<!---->`);
          }
          _push(`</div><h1 class="text-white text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-tight max-w-3xl">${serverRenderer_cjs_prodExports.ssrInterpolate(vueExports.unref(service).name)}</h1></div></div>`);
        } else {
          _push(`<div class="relative overflow-hidden bg-slate-900"><div class="absolute top-0 right-0 w-[500px] h-[500px] rounded-full bg-indigo-500/8 blur-[120px]"></div><div class="absolute bottom-0 left-1/4 w-[300px] h-[300px] rounded-full bg-slate-600/10 blur-[80px]"></div><div class="absolute inset-0 opacity-[0.03]" style="${serverRenderer_cjs_prodExports.ssrRenderStyle({ "background-image": "linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(to right, rgba(255,255,255,0.5) 1px, transparent 1px)", "background-size": "48px 48px" })}"></div><div class="relative max-w-4xl mx-auto px-6 lg:px-20 pt-8 pb-14"><nav class="flex items-center gap-2 text-sm text-white/50 mb-6">`);
          _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_NuxtLink, {
            to: "/dich-vu",
            class: "hover:text-white transition-colors"
          }, {
            default: vueExports.withCtx((_, _push2, _parent2, _scopeId) => {
              if (_push2) {
                _push2(` Dịch vụ `);
              } else {
                return [
                  vueExports.createTextVNode(" Dịch vụ ")
                ];
              }
            }),
            _: 1
          }, _parent));
          _push(`<span class="material-symbols-outlined text-sm">chevron_right</span>`);
          if (vueExports.unref(service).category) {
            _push(`<span class="hover:text-white transition-colors">${serverRenderer_cjs_prodExports.ssrInterpolate(vueExports.unref(service).category.name)}</span>`);
          } else {
            _push(`<!---->`);
          }
          if (vueExports.unref(service).category) {
            _push(`<span class="material-symbols-outlined text-sm">chevron_right</span>`);
          } else {
            _push(`<!---->`);
          }
          _push(`<span class="text-white/80 truncate max-w-xs">${serverRenderer_cjs_prodExports.ssrInterpolate(vueExports.unref(service).name)}</span></nav><div class="flex items-center gap-3 mb-4">`);
          if (vueExports.unref(service).category) {
            _push(`<span class="inline-flex items-center bg-white/10 border border-white/10 text-white text-xs font-bold uppercase tracking-wider px-3 py-1.5 rounded-full">${serverRenderer_cjs_prodExports.ssrInterpolate(vueExports.unref(service).category.name)}</span>`);
          } else {
            _push(`<!---->`);
          }
          if (vueExports.unref(service).is_featured) {
            _push(`<span class="inline-flex items-center gap-1.5 bg-amber-500/90 text-white text-xs font-bold uppercase tracking-wider px-3 py-1.5 rounded-full"><span class="material-symbols-outlined text-sm">star</span> Nổi bật </span>`);
          } else {
            _push(`<!---->`);
          }
          _push(`</div><h1 class="text-white text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-tight max-w-3xl">${serverRenderer_cjs_prodExports.ssrInterpolate(vueExports.unref(service).name)}</h1></div></div>`);
        }
        _push(`<div class="max-w-4xl mx-auto px-6 lg:px-20 -mt-6 relative z-10 pb-28 sm:pb-0"><div class="hidden sm:block bg-white rounded-2xl shadow-xl border border-slate-100 p-6 sm:p-8 mb-10"><div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-5"><div class="flex flex-col gap-1"><span class="text-xs text-slate-400 font-semibold uppercase tracking-wider">Giá dịch vụ</span><div class="flex items-baseline gap-2"><span class="text-3xl sm:text-4xl font-black text-slate-900">${serverRenderer_cjs_prodExports.ssrInterpolate(("formatCurrency" in _ctx ? _ctx.formatCurrency : vueExports.unref(formatCurrency))(vueExports.unref(service).unit_price))}</span><span class="text-slate-500 font-medium">/${serverRenderer_cjs_prodExports.ssrInterpolate(vueExports.unref(service).unit)}</span></div>`);
        if (vueExports.unref(service).price_note) {
          _push(`<span class="text-sm text-slate-400 italic mt-1">${serverRenderer_cjs_prodExports.ssrInterpolate(vueExports.unref(service).price_note)}</span>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</div><button class="flex items-center justify-center gap-2 bg-slate-900 text-white font-bold text-base px-8 py-4 rounded-xl hover:bg-slate-800 hover:scale-[1.02] active:scale-[0.98] transition-all shadow-lg shadow-slate-900/20"><span class="material-symbols-outlined text-xl">send</span> Đặt dịch vụ ngay </button></div></div>`);
        if (vueExports.unref(service).description) {
          _push(`<div class="mb-10"><p class="text-lg text-slate-600 leading-relaxed">${serverRenderer_cjs_prodExports.ssrInterpolate(vueExports.unref(service).description)}</p></div>`);
        } else {
          _push(`<!---->`);
        }
        if (vueExports.unref(service).content) {
          _push(`<div class="mb-12"><div class="prose prose-slate prose-lg max-w-none prose-headings:text-slate-900 prose-headings:font-bold prose-headings:tracking-tight prose-p:text-slate-600 prose-p:leading-relaxed prose-a:text-slate-900 prose-a:font-semibold prose-a:underline-offset-4 prose-img:rounded-xl prose-img:shadow-md prose-blockquote:border-l-slate-900 prose-blockquote:text-slate-600 prose-strong:text-slate-900 prose-li:text-slate-600">${vueExports.unref(service).content ?? ""}</div></div>`);
        } else {
          _push(`<!---->`);
        }
        if (vueExports.unref(galleryImages).length > 1) {
          _push(`<div class="mb-12"><h2 class="text-xl font-bold text-slate-900 mb-5"> Hình ảnh dịch vụ </h2><div class="grid grid-cols-2 sm:grid-cols-3 gap-3"><!--[-->`);
          serverRenderer_cjs_prodExports.ssrRenderList(vueExports.unref(galleryImages), (img, idx) => {
            _push(`<button class="group relative aspect-[4/3] rounded-xl overflow-hidden cursor-pointer focus:outline-none focus:ring-2 focus:ring-slate-900 focus:ring-offset-2"><img${serverRenderer_cjs_prodExports.ssrRenderAttr("src", img.url)}${serverRenderer_cjs_prodExports.ssrRenderAttr("alt", img.alt)} class="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"><div class="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300 flex items-center justify-center"><span class="material-symbols-outlined text-white text-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 drop-shadow-lg"> zoom_in </span></div></button>`);
          });
          _push(`<!--]--></div></div>`);
        } else {
          _push(`<!---->`);
        }
        _push(`<div class="py-10 border-t border-slate-200">`);
        _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_NuxtLink, {
          to: "/dich-vu",
          class: "inline-flex items-center gap-2 text-slate-600 font-semibold hover:text-slate-900 transition-colors"
        }, {
          default: vueExports.withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`<span class="material-symbols-outlined text-xl"${_scopeId}>arrow_back</span> Quay lại danh sách dịch vụ `);
            } else {
              return [
                vueExports.createVNode("span", { class: "material-symbols-outlined text-xl" }, "arrow_back"),
                vueExports.createTextVNode(" Quay lại danh sách dịch vụ ")
              ];
            }
          }),
          _: 1
        }, _parent));
        _push(`</div></div><!--]-->`);
      }
      _push(`</main>`);
      _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_LandingFooter, null, null, _parent));
      if (vueExports.unref(service)) {
        _push(`<div class="sm:hidden fixed inset-x-0 bottom-0 z-40 bg-white border-t border-slate-200 shadow-[0_-8px_24px_-8px_rgba(15,23,42,0.15)] px-4 py-3 pb-[calc(env(safe-area-inset-bottom)+0.75rem)]"><div class="flex items-center justify-between gap-3"><div class="flex flex-col min-w-0"><span class="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">Giá dịch vụ</span><div class="flex items-baseline gap-1 truncate"><span class="text-xl font-black text-slate-900 truncate">${serverRenderer_cjs_prodExports.ssrInterpolate(("formatCurrency" in _ctx ? _ctx.formatCurrency : vueExports.unref(formatCurrency))(vueExports.unref(service).unit_price))}</span><span class="text-slate-500 text-sm font-medium">/${serverRenderer_cjs_prodExports.ssrInterpolate(vueExports.unref(service).unit)}</span></div></div><button class="flex items-center justify-center gap-2 bg-slate-900 text-white font-bold text-sm px-5 py-3 rounded-xl hover:bg-slate-800 active:scale-[0.98] transition-all shadow-lg shadow-slate-900/20 shrink-0"><span class="material-symbols-outlined text-lg">send</span> Đặt ngay </button></div></div>`);
      } else {
        _push(`<!---->`);
      }
      serverRenderer_cjs_prodExports.ssrRenderTeleport(_push, (_push2) => {
        if (vueExports.unref(lightboxIndex) !== null) {
          _push2(`<div class="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 backdrop-blur-sm"><button class="absolute top-5 right-5 p-2 rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors"><span class="material-symbols-outlined text-2xl">close</span></button>`);
          if (vueExports.unref(galleryImages).length > 1) {
            _push2(`<button class="absolute left-4 p-3 rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors"><span class="material-symbols-outlined text-2xl">chevron_left</span></button>`);
          } else {
            _push2(`<!---->`);
          }
          _push2(`<img${serverRenderer_cjs_prodExports.ssrRenderAttr("src", vueExports.unref(galleryImages)[vueExports.unref(lightboxIndex)]?.url)}${serverRenderer_cjs_prodExports.ssrRenderAttr("alt", vueExports.unref(galleryImages)[vueExports.unref(lightboxIndex)]?.alt)} class="max-h-[85vh] max-w-[90vw] rounded-lg object-contain shadow-2xl">`);
          if (vueExports.unref(galleryImages).length > 1) {
            _push2(`<button class="absolute right-4 p-3 rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors"><span class="material-symbols-outlined text-2xl">chevron_right</span></button>`);
          } else {
            _push2(`<!---->`);
          }
          _push2(`<div class="absolute bottom-6 text-white/60 text-sm font-medium">${serverRenderer_cjs_prodExports.ssrInterpolate((vueExports.unref(lightboxIndex) ?? 0) + 1)} / ${serverRenderer_cjs_prodExports.ssrInterpolate(vueExports.unref(galleryImages).length)}</div></div>`);
        } else {
          _push2(`<!---->`);
        }
      }, "body", false, _parent);
      _push(`</div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = vueExports.useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/dich-vu/[slug].vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=_slug_-NQzT6ueW.mjs.map
