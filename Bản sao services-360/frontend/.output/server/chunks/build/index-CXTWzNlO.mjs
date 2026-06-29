import { _ as _sfc_main$1 } from './Input-JXN8po_F.mjs';
import { v as vueExports, u as useSeoMeta, s as serverRenderer_cjs_prodExports, l as _sfc_main$c } from './server.mjs';
import { _ as _sfc_main$2 } from './Alert-tTsPKADX.mjs';
import { _ as _sfc_main$3 } from './Table-17SH0cIR.mjs';
import { _ as _sfc_main$4 } from './Badge-W93D3Jpz.mjs';
import { _ as __nuxt_component_10 } from './TablePagination-CZYWB-qm.mjs';
import { a as formatDate } from './date-R5YK0ast.mjs';
import { D as DEFAULT_PER_PAGE } from './constants-G9YmtWtp.mjs';
import { u as useTableSearch } from './useTableSearch-BhG9s2Ie.mjs';
import { g as usePlatformCustomerList } from './useCustomers-ByvzwLgR.mjs';
import { s as stickyRight } from './table-z_7x7CvB.mjs';
import './index-QmZAbLx-.mjs';
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
import './Pagination-fZq_Msxb.mjs';

const _sfc_main = /* @__PURE__ */ vueExports.defineComponent({
  __name: "index",
  __ssrInlineRender: true,
  setup(__props) {
    useSeoMeta({ title: "Quản lý cư dân - Thần Nông" });
    const params = vueExports.reactive({
      search: void 0,
      per_page: DEFAULT_PER_PAGE
    });
    const page = vueExports.ref(1);
    const { searchInput, onSearch } = useTableSearch((value) => {
      params.search = value || void 0;
      page.value = 1;
    });
    const hasFilters = vueExports.computed(() => !!searchInput.value);
    function clearFilters() {
      searchInput.value = "";
      params.search = void 0;
      page.value = 1;
    }
    const { data, status, error, refresh } = usePlatformCustomerList(
      vueExports.computed(() => ({ ...params, page: page.value }))
    );
    const customers = vueExports.computed(() => data.value?.data ?? []);
    const columns = [
      { accessorKey: "name", header: "Họ tên" },
      { accessorKey: "phone", header: "Số điện thoại" },
      { accessorKey: "address", header: "Địa chỉ" },
      { accessorKey: "tickets_count", header: "Số yêu cầu" },
      { accessorKey: "created_at", header: "Ngày tạo" },
      stickyRight({ id: "actions", header: "" }, { width: "w-[80px] min-w-[80px]" })
    ];
    return (_ctx, _push, _parent, _attrs) => {
      const _component_UInput = _sfc_main$1;
      const _component_UButton = _sfc_main$c;
      const _component_UAlert = _sfc_main$2;
      const _component_UTable = _sfc_main$3;
      const _component_UBadge = _sfc_main$4;
      const _component_SharedCrudTablePagination = __nuxt_component_10;
      _push(`<div${serverRenderer_cjs_prodExports.ssrRenderAttrs(_attrs)}><div class="mb-6"><h1 class="text-2xl font-black text-slate-900 tracking-tight"> Quản lý cư dân </h1><p class="text-slate-500 text-sm mt-1"> Danh sách cư dân đã gửi yêu cầu hỗ trợ. </p></div><div class="mb-4 flex items-center gap-3">`);
      _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UInput, {
        modelValue: vueExports.unref(searchInput),
        "onUpdate:modelValue": [($event) => vueExports.isRef(searchInput) ? searchInput.value = $event : null, vueExports.unref(onSearch)],
        icon: "i-lucide-search",
        placeholder: "Tìm theo tên, SĐT...",
        class: "max-w-sm"
      }, null, _parent));
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
      _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UButton, {
        icon: "i-lucide-refresh-cw",
        color: "neutral",
        variant: "ghost",
        size: "sm",
        loading: vueExports.unref(status) === "pending",
        onClick: ($event) => vueExports.unref(refresh)()
      }, null, _parent));
      _push(`</div>`);
      if (vueExports.unref(error)) {
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
        data: vueExports.unref(customers),
        columns,
        loading: vueExports.unref(status) === "pending"
      }, {
        "address-cell": vueExports.withCtx(({ row }, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<span class="text-slate-500"${_scopeId}>${serverRenderer_cjs_prodExports.ssrInterpolate(row.original.address || "—")}</span>`);
          } else {
            return [
              vueExports.createVNode("span", { class: "text-slate-500" }, vueExports.toDisplayString(row.original.address || "—"), 1)
            ];
          }
        }),
        "tickets_count-cell": vueExports.withCtx(({ row }, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UBadge, {
              label: String(row.original.tickets_count),
              color: "primary",
              variant: "subtle",
              size: "sm"
            }, null, _parent2, _scopeId));
          } else {
            return [
              vueExports.createVNode(_component_UBadge, {
                label: String(row.original.tickets_count),
                color: "primary",
                variant: "subtle",
                size: "sm"
              }, null, 8, ["label"])
            ];
          }
        }),
        "created_at-cell": vueExports.withCtx(({ row }, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`${serverRenderer_cjs_prodExports.ssrInterpolate(("formatDate" in _ctx ? _ctx.formatDate : vueExports.unref(formatDate))(row.original.created_at))}`);
          } else {
            return [
              vueExports.createTextVNode(vueExports.toDisplayString(("formatDate" in _ctx ? _ctx.formatDate : vueExports.unref(formatDate))(row.original.created_at)), 1)
            ];
          }
        }),
        "actions-cell": vueExports.withCtx(({ row }, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UButton, {
              icon: "i-lucide-eye",
              color: "neutral",
              variant: "ghost",
              size: "sm",
              to: `/platform/customers/${row.original.id}`
            }, null, _parent2, _scopeId));
          } else {
            return [
              vueExports.createVNode(_component_UButton, {
                icon: "i-lucide-eye",
                color: "neutral",
                variant: "ghost",
                size: "sm",
                to: `/platform/customers/${row.original.id}`
              }, null, 8, ["to"])
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
      _push(`</div></div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = vueExports.useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/platform/customers/index.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=index-CXTWzNlO.mjs.map
