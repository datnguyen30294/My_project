import { v as vueExports, p as useRoute$1, u as useSeoMeta, s as serverRenderer_cjs_prodExports, l as _sfc_main$c } from './server.mjs';
import { _ as _sfc_main$1 } from './Alert-tTsPKADX.mjs';
import { _ as __nuxt_component_5 } from './FieldDisplay-BM6nmr2i.mjs';
import { _ as _sfc_main$2 } from './Table-17SH0cIR.mjs';
import { _ as _sfc_main$3 } from './Badge-W93D3Jpz.mjs';
import { f as formatDateTime, a as formatDate } from './date-R5YK0ast.mjs';
import { f as usePlatformCustomerDetail } from './useCustomers-ByvzwLgR.mjs';
import { s as stickyRight } from './table-z_7x7CvB.mjs';
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

const _sfc_main = /* @__PURE__ */ vueExports.defineComponent({
  __name: "[id]",
  __ssrInlineRender: true,
  setup(__props) {
    const route = useRoute$1();
    const id = vueExports.computed(() => Number(route.params.id));
    const { data, status, error } = usePlatformCustomerDetail(id);
    const customer = vueExports.computed(() => data.value?.data);
    const tickets = vueExports.computed(() => customer.value?.tickets ?? []);
    useSeoMeta({
      title: vueExports.computed(() => customer.value ? `${customer.value.name} - Thần Nông` : "Chi tiết cư dân")
    });
    function statusColor(value) {
      switch (value) {
        case "pending":
          return "warning";
        case "received":
          return "info";
        case "in_progress":
          return "primary";
        case "completed":
          return "success";
        case "cancelled":
          return "neutral";
        default:
          return "neutral";
      }
    }
    const ticketColumns = [
      { accessorKey: "code", header: "Mã" },
      { accessorKey: "subject", header: "Tiêu đề" },
      { accessorKey: "status", header: "Trạng thái" },
      { accessorKey: "channel", header: "Kênh" },
      { accessorKey: "created_at", header: "Ngày gửi" },
      stickyRight({ id: "actions", header: "" }, { width: "w-[80px] min-w-[80px]" })
    ];
    return (_ctx, _push, _parent, _attrs) => {
      const _component_UButton = _sfc_main$c;
      const _component_UAlert = _sfc_main$1;
      const _component_SharedFieldDisplay = __nuxt_component_5;
      const _component_UTable = _sfc_main$2;
      const _component_UBadge = _sfc_main$3;
      _push(`<div${serverRenderer_cjs_prodExports.ssrRenderAttrs(_attrs)}><div class="mb-6 flex items-center gap-4">`);
      _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UButton, {
        icon: "i-lucide-arrow-left",
        color: "neutral",
        variant: "ghost",
        to: "/platform/customers"
      }, null, _parent));
      _push(`<div><h1 class="text-2xl font-black text-slate-900 tracking-tight"> Chi tiết cư dân </h1><p class="text-slate-500 text-sm mt-0.5">${serverRenderer_cjs_prodExports.ssrInterpolate(vueExports.unref(customer)?.name ?? "...")}</p></div></div>`);
      if (vueExports.unref(status) === "pending") {
        _push(`<div class="flex flex-col gap-4"><!--[-->`);
        serverRenderer_cjs_prodExports.ssrRenderList(3, (i) => {
          _push(`<div class="h-20 bg-slate-100 rounded-xl animate-pulse"></div>`);
        });
        _push(`<!--]--></div>`);
      } else if (vueExports.unref(error)) {
        _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UAlert, {
          icon: "i-lucide-alert-circle",
          color: "error",
          variant: "subtle",
          description: "Không tìm thấy cư dân này."
        }, null, _parent));
      } else if (vueExports.unref(customer)) {
        _push(`<div class="flex flex-col gap-6"><div class="grid grid-cols-1 lg:grid-cols-3 gap-6"><div class="lg:col-span-2 bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden"><div class="px-6 py-4 border-b border-slate-100"><h2 class="font-bold text-slate-900"> Thông tin cư dân </h2></div><div class="px-6 py-5 flex flex-col gap-5"><div class="grid grid-cols-2 gap-4">`);
        _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_SharedFieldDisplay, { label: "Họ tên" }, {
          default: vueExports.withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`<span class="font-medium"${_scopeId}>${serverRenderer_cjs_prodExports.ssrInterpolate(vueExports.unref(customer).name)}</span>`);
            } else {
              return [
                vueExports.createVNode("span", { class: "font-medium" }, vueExports.toDisplayString(vueExports.unref(customer).name), 1)
              ];
            }
          }),
          _: 1
        }, _parent));
        _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_SharedFieldDisplay, { label: "Số điện thoại" }, {
          default: vueExports.withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`<span class="font-mono"${_scopeId}>${serverRenderer_cjs_prodExports.ssrInterpolate(vueExports.unref(customer).phone)}</span>`);
            } else {
              return [
                vueExports.createVNode("span", { class: "font-mono" }, vueExports.toDisplayString(vueExports.unref(customer).phone), 1)
              ];
            }
          }),
          _: 1
        }, _parent));
        _push(`</div>`);
        if (vueExports.unref(customer).address) {
          _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_SharedFieldDisplay, { label: "Địa chỉ" }, {
            default: vueExports.withCtx((_, _push2, _parent2, _scopeId) => {
              if (_push2) {
                _push2(`${serverRenderer_cjs_prodExports.ssrInterpolate(vueExports.unref(customer).address)}`);
              } else {
                return [
                  vueExports.createTextVNode(vueExports.toDisplayString(vueExports.unref(customer).address), 1)
                ];
              }
            }),
            _: 1
          }, _parent));
        } else {
          _push(`<!---->`);
        }
        _push(`<div class="grid grid-cols-2 gap-4">`);
        _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_SharedFieldDisplay, { label: "Ngày tạo" }, {
          default: vueExports.withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`${serverRenderer_cjs_prodExports.ssrInterpolate(("formatDateTime" in _ctx ? _ctx.formatDateTime : vueExports.unref(formatDateTime))(vueExports.unref(customer).created_at))}`);
            } else {
              return [
                vueExports.createTextVNode(vueExports.toDisplayString(("formatDateTime" in _ctx ? _ctx.formatDateTime : vueExports.unref(formatDateTime))(vueExports.unref(customer).created_at)), 1)
              ];
            }
          }),
          _: 1
        }, _parent));
        _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_SharedFieldDisplay, { label: "Cập nhật lần cuối" }, {
          default: vueExports.withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`${serverRenderer_cjs_prodExports.ssrInterpolate(("formatDateTime" in _ctx ? _ctx.formatDateTime : vueExports.unref(formatDateTime))(vueExports.unref(customer).updated_at))}`);
            } else {
              return [
                vueExports.createTextVNode(vueExports.toDisplayString(("formatDateTime" in _ctx ? _ctx.formatDateTime : vueExports.unref(formatDateTime))(vueExports.unref(customer).updated_at)), 1)
              ];
            }
          }),
          _: 1
        }, _parent));
        _push(`</div></div></div><div class="flex flex-col gap-4"><div class="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden"><div class="px-5 py-4 border-b border-slate-100"><h3 class="font-bold text-slate-900 text-sm"> Thống kê </h3></div><div class="px-5 py-4 flex flex-col gap-3">`);
        _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_SharedFieldDisplay, { label: "Tổng số yêu cầu" }, {
          default: vueExports.withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`<span class="text-lg font-bold text-primary-600"${_scopeId}>${serverRenderer_cjs_prodExports.ssrInterpolate(vueExports.unref(tickets).length)}</span>`);
            } else {
              return [
                vueExports.createVNode("span", { class: "text-lg font-bold text-primary-600" }, vueExports.toDisplayString(vueExports.unref(tickets).length), 1)
              ];
            }
          }),
          _: 1
        }, _parent));
        _push(`</div></div></div></div><div class="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden"><div class="px-6 py-4 border-b border-slate-100"><h2 class="font-bold text-slate-900"> Danh sách yêu cầu <span class="text-slate-400 font-normal text-sm ml-1">(${serverRenderer_cjs_prodExports.ssrInterpolate(vueExports.unref(tickets).length)})</span></h2></div>`);
        _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UTable, {
          data: vueExports.unref(tickets),
          columns: ticketColumns
        }, {
          "status-cell": vueExports.withCtx(({ row }, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UBadge, {
                color: statusColor(row.original.status.value),
                variant: "subtle",
                label: row.original.status.label
              }, null, _parent2, _scopeId));
            } else {
              return [
                vueExports.createVNode(_component_UBadge, {
                  color: statusColor(row.original.status.value),
                  variant: "subtle",
                  label: row.original.status.label
                }, null, 8, ["color", "label"])
              ];
            }
          }),
          "channel-cell": vueExports.withCtx(({ row }, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`${serverRenderer_cjs_prodExports.ssrInterpolate(row.original.channel.label)}`);
            } else {
              return [
                vueExports.createTextVNode(vueExports.toDisplayString(row.original.channel.label), 1)
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
                to: `/platform/tickets/${row.original.id}`
              }, null, _parent2, _scopeId));
            } else {
              return [
                vueExports.createVNode(_component_UButton, {
                  icon: "i-lucide-eye",
                  color: "neutral",
                  variant: "ghost",
                  size: "sm",
                  to: `/platform/tickets/${row.original.id}`
                }, null, 8, ["to"])
              ];
            }
          }),
          _: 1
        }, _parent));
        if (vueExports.unref(tickets).length === 0) {
          _push(`<div class="px-6 py-8 text-center text-slate-400 text-sm"> Chưa có yêu cầu nào. </div>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</div></div>`);
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/platform/customers/[id].vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=_id_-DODZgOG6.mjs.map
