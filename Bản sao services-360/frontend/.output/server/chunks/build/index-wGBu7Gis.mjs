import { _ as __nuxt_component_0, a as __nuxt_component_2 } from './LandingFooter-ButK23zG.mjs';
import { v as vueExports, u as useSeoMeta, s as serverRenderer_cjs_prodExports, k as _sfc_main$h, _ as __nuxt_component_0$4, q as navigateTo } from './server.mjs';
import { f as formatCurrency } from './currency-DEb2TrW3.mjs';
import { u as useAppContext } from './useAppContext-qiCJKBCF.mjs';
import { P as PUBLIC_SERVICES_PER_PAGE } from './constants-G9YmtWtp.mjs';
import { u as useUrlFilters } from './useUrlFilters-D9dcjQcy.mjs';
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

const _sfc_main = /* @__PURE__ */ vueExports.defineComponent({
  __name: "index",
  __ssrInlineRender: true,
  setup(__props) {
    useSeoMeta({
      title: "Danh mục dịch vụ - Thần Nông",
      description: "Chào mừng cư dân, hãy chọn các dịch vụ tiện ích chuyên nghiệp cho ngôi nhà của bạn.",
      ogTitle: "Danh mục dịch vụ - Thần Nông",
      ogDescription: "Chào mừng cư dân, hãy chọn các dịch vụ tiện ích chuyên nghiệp cho ngôi nhà của bạn."
    });
    const { isTenantDomain } = useAppContext();
    const searchInput = vueExports.ref("");
    const searchQuery = vueExports.ref("");
    const activeCategory = vueExports.ref("all");
    const currentPage = vueExports.ref(1);
    const perPage = PUBLIC_SERVICES_PER_PAGE;
    const { isInitFromUrl } = useUrlFilters({
      category: { ref: activeCategory, type: "string", defaultValue: "all" },
      search: { ref: searchQuery, type: "string" }
    });
    vueExports.watch(searchQuery, (val) => {
      searchInput.value = val;
    }, { immediate: true });
    const apiParams = vueExports.computed(() => ({
      search: searchQuery.value.trim() || void 0,
      category: activeCategory.value !== "all" ? activeCategory.value : void 0,
      page: currentPage.value,
      per_page: perPage
    }));
    const tenantParams = vueExports.computed(() => isTenantDomain.value ? apiParams.value : void 0);
    const { data: apiData, status: apiStatus } = usePublicServices(tenantParams);
    const apiCategories = vueExports.computed(() => apiData.value?.categories ?? []);
    const apiMeta = vueExports.computed(() => apiData.value?.meta ?? { current_page: 1, last_page: 1, per_page: perPage, total: 0 });
    const loadedExtraPages = vueExports.ref([]);
    vueExports.watch(apiData, (newData) => {
      if (!newData?.data) return;
      if (currentPage.value === 1) {
        loadedExtraPages.value = [];
      } else {
        loadedExtraPages.value = [...loadedExtraPages.value, ...newData.data];
      }
    });
    const displayedServices = vueExports.computed(() => {
      const firstPage = apiData.value?.data ?? [];
      return [...firstPage, ...loadedExtraPages.value];
    });
    const staticCategories = [
      { key: "all", label: "Tất cả" },
      { key: "cleaning", label: "Vệ sinh" },
      { key: "repair", label: "Sửa chữa" },
      { key: "moving", label: "Vận chuyển" },
      { key: "care", label: "Chăm sóc" }
    ];
    const staticServices = [
      { id: 1, title: "Vệ sinh nhà cửa", description: "Dịch vụ dọn dẹp chuyên nghiệp, bao gồm hút bụi, lau sàn và khử khuẩn không gian sống.", price: "200.000đ", category: "cleaning", image: "https://lh3.googleusercontent.com/aida-public/AB6AXuBwrgXvX2GebRALBcp_RZwhTKYmeY5zMOW6xs1SIjT_H2LZIcFYbfNS-foCFuKCdkYUcZaYgAHWqo9tNx_qQb0P0fW17OmL-wjZ9L96HlaxXmPbExiZTrwxuxsgdGjxVsB09X2Eas4lh8jLNsyLgbjrXSLjdn9Act1G5p9LdxUFk-ng6lDDU5LTXSutMWVqj5vGVlH9VcirYTwvG6KN5ObyRhV7ZwJ7ObDsrF8VAyH0qgYbCvN8muGeguw5pqHF5ZalCu23Crn_2UZB" },
      { id: 2, title: "Sửa chữa điện nước", description: "Khắc phục sự cố điện, rò rỉ nước nhanh chóng bởi đội ngũ kỹ thuật tay nghề cao.", price: "150.000đ", category: "repair", image: "https://lh3.googleusercontent.com/aida-public/AB6AXuBaXMUonRSasnsMMsR_AXt-d6Gd3_RN1T3RB2RoUZzpVQJzLZ7uT64F2ZiGDod9AayjI6Cd6tSXg12U2-T8xc4ls-sTDIfbJmQJDHcWdA6ak1pAjLwcOe11I3NQmmFIeCn6oyFD2tMzdrtgEW1f-rWbtHlPmdOZVbWK-Jp6EmZuraGPiFyn62LW6dpb_DR6qhBFNYQ4L_z6hRCvu_rkMUmCrfP7s5vkdX5eRlcTy1jQ_wK49bsvfh9sG0SNK3vbfNo_MYpIAEeXhdC3" },
      { id: 3, title: "Vận chuyển nhà", description: "Dịch vụ đóng gói và chuyển đồ đạc trọn gói, an toàn và chuyên nghiệp nhất.", price: "500.000đ", category: "moving", image: "https://lh3.googleusercontent.com/aida-public/AB6AXuD1H8zY3ZmX0dSmfZOgfiRPNzowWDGihu7CJ9a2hZVTIJnTlWqKMho6PFvVfDfGRdDRujwpnh74HCtpzdzS15EsEfBMXirGDgYEqKMdi5OkLDVS8zCjAi71olgQi8cHbrKCtW_bGLs_euxO0LjsRf0Y_7phg_3RPhml4byrw5GujZpvZ4vMl3CMRlOhBFuNJJYs8rT2uAoTkEl982ZpMxyOJwwmE3VyFib3W8od6Q5CGgqHKkLk6ZAXSwY9Sx21AbqX80Hsaqcn7Mi9" },
      { id: 4, title: "Chăm sóc cây cảnh", description: "Cắt tỉa, bón phân và chăm sóc định kỳ cho ban công và vườn cây của bạn.", price: "100.000đ", category: "care", image: "https://lh3.googleusercontent.com/aida-public/AB6AXuBQIX0ozrCgXLny6mrHoFU25U3k7s2iS6UndHGgboVUGapwhjQhnmscGvgD2eSiHHskv2iUjtpdDcMJ7mc_lNF0ew1oESyYbxrFPlTxDhtdtEwn7GSn-D6cBnWewYj8YpTJc_wRMnDDFT8LYNHuy7gvuoCEGkWs031XZGyFdIQXoP4z47f6faKWxXWNHaB2BFjQMTT3w70KaR9tSCTdefVpTzSZoPxNiqqfynDOdElUX-eACkuNn64mNZI1YuSE_uu85Rt-GBgjhsWR" },
      { id: 5, title: "Vệ sinh máy lạnh", description: "Bảo dưỡng và vệ sinh máy lạnh giúp tiết kiệm điện và làm sạch không khí trong phòng.", price: "250.000đ", category: "repair", image: "https://lh3.googleusercontent.com/aida-public/AB6AXuAd-tge9KRiUmoavYlw_daQnnsKjsYlUKet5vaW7O1OOzWwvtJCz75d_sSlCi2vwMfRz7I7q-u4cp9nAuqEh7ZcKp0U0EqbzlxQj3RhB1PiqGlTNy_RmoMk7dxLfJDdA2sgaUwsy9VPlIIDoTKabMUmkQdu589iI11nJZbWtcHH98kUCmkPaHhlledtapLDG2rsWtV2edLmVP6amR4fXrm8aJr9LS5gKEjAOzidI2Olys4t05aViO_YXlCsp94mwE9ptNWnX_R1y-uN" },
      { id: 6, title: "Diệt côn trùng", description: "Kiểm soát và tiêu diệt các loại côn trùng gây hại như mối, gián, muỗi định kỳ.", price: "400.000đ", category: "cleaning", image: "https://lh3.googleusercontent.com/aida-public/AB6AXuBKpKg6A-ul7L1xzKkF3ozkFJCQlR3Lfs9kgaImLiD1KuAiWGlyexGYu_ykgmWz8jW99TIbPgBxkjM1TrIGFBWMwq5W50UBptk7zIbW3kW_y8frP3J5bT0byo7f3mBcBDbFF3OvDT87Qvcrm06sVz9wpaXWnOXONsD75wsAxBOQxgpIJ8IAEinsbxnnVazymps4pF0R9PjPeGrkpSnIuFlggly04a7D0nIlPqaHIlPZZoSYyfW6qfk97cZLz6LiBHO9ryR2-pmam8xv" }
    ];
    const filteredStaticServices = vueExports.computed(() => {
      let services = staticServices;
      if (activeCategory.value !== "all") {
        services = services.filter((s) => s.category === activeCategory.value);
      }
      if (searchQuery.value.trim()) {
        const q = searchQuery.value.toLowerCase();
        services = services.filter((s) => s.title.toLowerCase().includes(q) || s.description.toLowerCase().includes(q));
      }
      return services;
    });
    function getStaticCategoryLabel(key) {
      return staticCategories.find((c) => c.key === key)?.label ?? key;
    }
    vueExports.watch([activeCategory, searchQuery], () => {
      if (isInitFromUrl.value) return;
      currentPage.value = 1;
      loadedExtraPages.value = [];
    });
    function orderService(serviceName) {
      navigateTo({ path: "/ticket", query: { service: serviceName } });
    }
    return (_ctx, _push, _parent, _attrs) => {
      const _component_LandingHeader = __nuxt_component_0;
      const _component_UIcon = _sfc_main$h;
      const _component_NuxtLink = __nuxt_component_0$4;
      const _component_LandingFooter = __nuxt_component_2;
      _push(`<div${serverRenderer_cjs_prodExports.ssrRenderAttrs(vueExports.mergeProps({ class: "relative flex min-h-screen w-full flex-col overflow-x-hidden bg-[#f6f7f8]" }, _attrs))}>`);
      _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_LandingHeader, null, null, _parent));
      _push(`<main class="flex-1 max-w-7xl mx-auto w-full px-6 lg:px-20 py-10"><div class="flex flex-col gap-6 mb-12"><div class="max-w-2xl"><h1 class="text-slate-900 text-4xl font-extrabold leading-tight tracking-tight mb-3"> Danh mục dịch vụ </h1><p class="text-slate-600 text-lg"> Chào mừng cư dân, hãy chọn các dịch vụ tiện ích chuyên nghiệp cho ngôi nhà của bạn. </p></div><div class="w-full max-w-3xl mt-4"><div class="flex items-center rounded-xl bg-white shadow-sm border border-slate-200 p-1"><div class="flex-1 flex items-center px-4">`);
      _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UIcon, {
        name: "i-lucide-search",
        class: "text-slate-400 text-xl shrink-0 mr-3"
      }, null, _parent));
      _push(`<input${serverRenderer_cjs_prodExports.ssrRenderAttr("value", vueExports.unref(searchInput))} class="w-full border-none bg-transparent focus:ring-0 text-slate-900 placeholder:text-slate-400 py-3" placeholder="Bạn cần tìm dịch vụ gì hôm nay?" type="text"></div><button class="bg-slate-900 text-white px-8 py-3 rounded-lg font-bold hover:bg-slate-800 transition-all"> Tìm kiếm </button></div></div></div><div class="flex flex-wrap gap-3 mb-10"><button class="${serverRenderer_cjs_prodExports.ssrRenderClass([
        "flex items-center gap-2 px-6 py-2.5 rounded-full font-semibold transition-all",
        vueExports.unref(activeCategory) === "all" ? "bg-slate-900 text-white shadow-md" : "bg-white text-slate-700 border border-slate-200 hover:border-slate-900"
      ])}"><span class="material-symbols-outlined text-xl">apps</span> Tất cả </button>`);
      if (vueExports.unref(isTenantDomain)) {
        _push(`<!--[-->`);
        serverRenderer_cjs_prodExports.ssrRenderList(vueExports.unref(apiCategories), (cat) => {
          _push(`<button class="${serverRenderer_cjs_prodExports.ssrRenderClass([
            "flex items-center gap-2 px-6 py-2.5 rounded-full font-semibold transition-all",
            vueExports.unref(activeCategory) === cat.code ? "bg-slate-900 text-white shadow-md" : "bg-white text-slate-700 border border-slate-200 hover:border-slate-900"
          ])}">${serverRenderer_cjs_prodExports.ssrInterpolate(cat.name)}</button>`);
        });
        _push(`<!--]-->`);
      } else {
        _push(`<!--[-->`);
        serverRenderer_cjs_prodExports.ssrRenderList(staticCategories.slice(1), (cat) => {
          _push(`<button class="${serverRenderer_cjs_prodExports.ssrRenderClass([
            "flex items-center gap-2 px-6 py-2.5 rounded-full font-semibold transition-all",
            vueExports.unref(activeCategory) === cat.key ? "bg-slate-900 text-white shadow-md" : "bg-white text-slate-700 border border-slate-200 hover:border-slate-900"
          ])}">${serverRenderer_cjs_prodExports.ssrInterpolate(cat.label)}</button>`);
        });
        _push(`<!--]-->`);
      }
      _push(`</div>`);
      if (vueExports.unref(isTenantDomain) && vueExports.unref(apiStatus) === "pending") {
        _push(`<div class="flex justify-center py-20">`);
        _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UIcon, {
          name: "i-lucide-loader-circle",
          class: "animate-spin text-4xl text-slate-400"
        }, null, _parent));
        _push(`</div>`);
      } else if (vueExports.unref(isTenantDomain)) {
        _push(`<!--[--><div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8"><!--[-->`);
        serverRenderer_cjs_prodExports.ssrRenderList(vueExports.unref(displayedServices), (service) => {
          _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_NuxtLink, {
            key: service.id,
            to: service.slug ? `/dich-vu/${service.slug}` : void 0,
            class: "group flex flex-col bg-white rounded-xl overflow-hidden shadow-sm border border-slate-100 hover:shadow-xl transition-all duration-300"
          }, {
            default: vueExports.withCtx((_, _push2, _parent2, _scopeId) => {
              if (_push2) {
                _push2(`<div class="relative h-48 w-full overflow-hidden"${_scopeId}>`);
                if (service.image_url) {
                  _push2(`<div class="absolute inset-0 bg-center bg-no-repeat bg-cover transition-transform duration-500 group-hover:scale-110" style="${serverRenderer_cjs_prodExports.ssrRenderStyle({ backgroundImage: `url('${service.image_url}')` })}"${_scopeId}></div>`);
                } else {
                  _push2(`<div class="absolute inset-0 bg-slate-100 flex items-center justify-center"${_scopeId}><span class="material-symbols-outlined text-5xl text-slate-300"${_scopeId}>image</span></div>`);
                }
                _push2(`<div class="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"${_scopeId}></div>`);
                if (service.category) {
                  _push2(`<div class="absolute top-3 left-3 bg-slate-900/90 text-white text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded"${_scopeId}>${serverRenderer_cjs_prodExports.ssrInterpolate(service.category.name)}</div>`);
                } else {
                  _push2(`<!---->`);
                }
                if (service.is_featured) {
                  _push2(`<div class="absolute top-3 right-3 bg-amber-500 text-white text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded"${_scopeId}> Nổi bật </div>`);
                } else {
                  _push2(`<!---->`);
                }
                _push2(`</div><div class="p-5 flex flex-col flex-1"${_scopeId}><h3 class="text-slate-900 text-lg font-bold mb-2 group-hover:text-slate-700 transition-colors"${_scopeId}>${serverRenderer_cjs_prodExports.ssrInterpolate(service.name)}</h3><p class="text-slate-500 text-sm leading-relaxed mb-6 flex-1 line-clamp-3"${_scopeId}>${serverRenderer_cjs_prodExports.ssrInterpolate(service.description)}</p><div class="flex items-end justify-between gap-2 mt-auto"${_scopeId}><div class="flex flex-col min-w-0"${_scopeId}><span class="text-xs text-slate-400 font-medium"${_scopeId}>Từ</span><span class="text-slate-900 font-extrabold text-base truncate"${_scopeId}>${serverRenderer_cjs_prodExports.ssrInterpolate(("formatCurrency" in _ctx ? _ctx.formatCurrency : vueExports.unref(formatCurrency))(service.unit_price))}/${serverRenderer_cjs_prodExports.ssrInterpolate(service.unit)}</span>`);
                if (service.price_note) {
                  _push2(`<span class="text-xs text-slate-400 italic mt-0.5"${_scopeId}>${serverRenderer_cjs_prodExports.ssrInterpolate(service.price_note)}</span>`);
                } else {
                  _push2(`<!---->`);
                }
                _push2(`</div><button class="shrink-0 bg-slate-900 text-white text-sm font-bold px-4 py-2.5 rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"${_scopeId}> Đặt ngay </button></div></div>`);
              } else {
                return [
                  vueExports.createVNode("div", { class: "relative h-48 w-full overflow-hidden" }, [
                    service.image_url ? (vueExports.openBlock(), vueExports.createBlock("div", {
                      key: 0,
                      class: "absolute inset-0 bg-center bg-no-repeat bg-cover transition-transform duration-500 group-hover:scale-110",
                      style: { backgroundImage: `url('${service.image_url}')` }
                    }, null, 4)) : (vueExports.openBlock(), vueExports.createBlock("div", {
                      key: 1,
                      class: "absolute inset-0 bg-slate-100 flex items-center justify-center"
                    }, [
                      vueExports.createVNode("span", { class: "material-symbols-outlined text-5xl text-slate-300" }, "image")
                    ])),
                    vueExports.createVNode("div", { class: "absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" }),
                    service.category ? (vueExports.openBlock(), vueExports.createBlock("div", {
                      key: 2,
                      class: "absolute top-3 left-3 bg-slate-900/90 text-white text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded"
                    }, vueExports.toDisplayString(service.category.name), 1)) : vueExports.createCommentVNode("", true),
                    service.is_featured ? (vueExports.openBlock(), vueExports.createBlock("div", {
                      key: 3,
                      class: "absolute top-3 right-3 bg-amber-500 text-white text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded"
                    }, " Nổi bật ")) : vueExports.createCommentVNode("", true)
                  ]),
                  vueExports.createVNode("div", { class: "p-5 flex flex-col flex-1" }, [
                    vueExports.createVNode("h3", { class: "text-slate-900 text-lg font-bold mb-2 group-hover:text-slate-700 transition-colors" }, vueExports.toDisplayString(service.name), 1),
                    vueExports.createVNode("p", { class: "text-slate-500 text-sm leading-relaxed mb-6 flex-1 line-clamp-3" }, vueExports.toDisplayString(service.description), 1),
                    vueExports.createVNode("div", { class: "flex items-end justify-between gap-2 mt-auto" }, [
                      vueExports.createVNode("div", { class: "flex flex-col min-w-0" }, [
                        vueExports.createVNode("span", { class: "text-xs text-slate-400 font-medium" }, "Từ"),
                        vueExports.createVNode("span", { class: "text-slate-900 font-extrabold text-base truncate" }, vueExports.toDisplayString(("formatCurrency" in _ctx ? _ctx.formatCurrency : vueExports.unref(formatCurrency))(service.unit_price)) + "/" + vueExports.toDisplayString(service.unit), 1),
                        service.price_note ? (vueExports.openBlock(), vueExports.createBlock("span", {
                          key: 0,
                          class: "text-xs text-slate-400 italic mt-0.5"
                        }, vueExports.toDisplayString(service.price_note), 1)) : vueExports.createCommentVNode("", true)
                      ]),
                      vueExports.createVNode("button", {
                        class: "shrink-0 bg-slate-900 text-white text-sm font-bold px-4 py-2.5 rounded-lg hover:bg-slate-800 transition-colors cursor-pointer",
                        onClick: vueExports.withModifiers(($event) => orderService(service.name), ["prevent"])
                      }, " Đặt ngay ", 8, ["onClick"])
                    ])
                  ])
                ];
              }
            }),
            _: 2
          }, _parent));
        });
        _push(`<!--]--></div>`);
        if (vueExports.unref(displayedServices).length === 0 && vueExports.unref(apiStatus) !== "pending") {
          _push(`<div class="flex flex-col items-center justify-center py-20"><span class="material-symbols-outlined text-6xl text-slate-300 mb-4">search_off</span><p class="text-slate-500 text-lg"> Không tìm thấy dịch vụ phù hợp </p><button class="mt-4 text-slate-900 font-semibold underline underline-offset-4"> Xem tất cả dịch vụ </button></div>`);
        } else {
          _push(`<!---->`);
        }
        if (vueExports.unref(displayedServices).length > 0) {
          _push(`<div class="mt-16 flex flex-col items-center gap-4"><p class="text-sm text-slate-500"> Đang hiển thị ${serverRenderer_cjs_prodExports.ssrInterpolate(vueExports.unref(displayedServices).length)} trên ${serverRenderer_cjs_prodExports.ssrInterpolate(vueExports.unref(apiMeta).total)} dịch vụ </p>`);
          if (vueExports.unref(apiMeta).current_page < vueExports.unref(apiMeta).last_page) {
            _push(`<button class="bg-white text-slate-900 border-2 border-slate-900 px-10 py-3 rounded-xl font-bold hover:bg-slate-900 hover:text-white transition-all"> Xem thêm dịch vụ </button>`);
          } else {
            _push(`<!---->`);
          }
          _push(`</div>`);
        } else {
          _push(`<!---->`);
        }
        _push(`<!--]-->`);
      } else {
        _push(`<!--[--><div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8"><!--[-->`);
        serverRenderer_cjs_prodExports.ssrRenderList(vueExports.unref(filteredStaticServices), (service) => {
          _push(`<div class="group flex flex-col bg-white rounded-xl overflow-hidden shadow-sm border border-slate-100 hover:shadow-xl transition-all duration-300"><div class="relative h-48 w-full overflow-hidden"><div class="absolute inset-0 bg-center bg-no-repeat bg-cover transition-transform duration-500 group-hover:scale-110" style="${serverRenderer_cjs_prodExports.ssrRenderStyle({ backgroundImage: `url('${service.image}')` })}"></div><div class="absolute top-3 left-3 bg-slate-900/90 text-white text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded">${serverRenderer_cjs_prodExports.ssrInterpolate(getStaticCategoryLabel(service.category))}</div></div><div class="p-5 flex flex-col flex-1"><h3 class="text-slate-900 text-lg font-bold mb-2">${serverRenderer_cjs_prodExports.ssrInterpolate(service.title)}</h3><p class="text-slate-500 text-sm leading-relaxed mb-6 flex-1">${serverRenderer_cjs_prodExports.ssrInterpolate(service.description)}</p><div class="flex items-end justify-between gap-2 mt-auto"><div class="flex flex-col min-w-0"><span class="text-xs text-slate-400 font-medium">Từ</span><span class="text-slate-900 font-extrabold text-base truncate">${serverRenderer_cjs_prodExports.ssrInterpolate(service.price)}</span></div><button class="shrink-0 bg-slate-900 text-white text-sm font-bold px-4 py-2.5 rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"> Đặt ngay </button></div></div></div>`);
        });
        _push(`<!--]--></div>`);
        if (vueExports.unref(filteredStaticServices).length === 0) {
          _push(`<div class="flex flex-col items-center justify-center py-20"><span class="material-symbols-outlined text-6xl text-slate-300 mb-4">search_off</span><p class="text-slate-500 text-lg"> Không tìm thấy dịch vụ phù hợp </p><button class="mt-4 text-slate-900 font-semibold underline underline-offset-4"> Xem tất cả dịch vụ </button></div>`);
        } else {
          _push(`<!---->`);
        }
        if (vueExports.unref(filteredStaticServices).length > 0) {
          _push(`<div class="mt-16 flex flex-col items-center gap-4"><p class="text-sm text-slate-500"> Đang hiển thị ${serverRenderer_cjs_prodExports.ssrInterpolate(vueExports.unref(filteredStaticServices).length)} trên ${serverRenderer_cjs_prodExports.ssrInterpolate(staticServices.length)} dịch vụ </p></div>`);
        } else {
          _push(`<!---->`);
        }
        _push(`<!--]-->`);
      }
      _push(`</main>`);
      _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_LandingFooter, null, null, _parent));
      _push(`</div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = vueExports.useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/dich-vu/index.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=index-wGBu7Gis.mjs.map
