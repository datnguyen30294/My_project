import { v as vueExports, h as useAuth, s as serverRenderer_cjs_prodExports, k as _sfc_main$h, r as _sfc_main$d } from './server.mjs';
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
  __name: "dashboard",
  __ssrInlineRender: true,
  setup(__props) {
    const { user } = useAuth();
    const moduleGroups = [
      {
        label: "Nhân sự",
        icon: "i-lucide-users-round",
        children: [
          {
            label: "Tài khoản",
            description: "Quản lý tài khoản nhân viên",
            icon: "i-lucide-users",
            to: "/pmc/accounts"
          },
          {
            label: "Phòng ban",
            description: "Quản lý danh sách phòng ban",
            icon: "i-lucide-building",
            to: "/pmc/departments"
          },
          {
            label: "Chức danh",
            description: "Quản lý chức danh nhân viên",
            icon: "i-lucide-briefcase",
            to: "/pmc/job-titles"
          },
          {
            label: "Vai trò",
            description: "Quản lý vai trò và phân quyền",
            icon: "i-lucide-shield",
            to: "/pmc/roles"
          }
        ]
      },
      {
        label: "Dự án",
        icon: "i-lucide-folder-kanban",
        children: [
          {
            label: "Dự án",
            description: "Quản lý dự án và thành viên",
            icon: "i-lucide-folder-kanban",
            to: "/pmc/projects"
          }
        ]
      },
      {
        label: "Danh mục",
        icon: "i-lucide-package",
        children: [
          {
            label: "Nhà cung cấp",
            description: "Quản lý danh sách nhà cung cấp",
            icon: "i-lucide-truck",
            to: "/pmc/catalog/suppliers"
          },
          {
            label: "Danh mục hàng",
            description: "Quản lý vật tư và dịch vụ",
            icon: "i-lucide-boxes",
            to: "/pmc/catalog/items"
          }
        ]
      },
      {
        label: "Quản lý đơn hàng",
        icon: "i-lucide-shopping-cart",
        children: [
          {
            label: "Báo giá",
            description: "Quản lý báo giá cho ticket",
            icon: "i-lucide-file-text",
            to: "/pmc/quotes"
          },
          {
            label: "Đơn hàng",
            description: "Quản lý đơn hàng từ báo giá",
            icon: "i-lucide-clipboard-list",
            to: "/pmc/orders"
          }
        ]
      }
    ];
    return (_ctx, _push, _parent, _attrs) => {
      const _component_UIcon = _sfc_main$h;
      const _component_ULink = _sfc_main$d;
      _push(`<div${serverRenderer_cjs_prodExports.ssrRenderAttrs(_attrs)}><h1 class="text-2xl font-bold text-[var(--ui-text-highlighted)]"> Xin chào, ${serverRenderer_cjs_prodExports.ssrInterpolate(vueExports.unref(user)?.name)}</h1><p class="mt-1 text-[var(--ui-text-muted)]"> Chào mừng bạn quay trở lại </p><div class="mt-8 space-y-8"><!--[-->`);
      serverRenderer_cjs_prodExports.ssrRenderList(moduleGroups, (group) => {
        _push(`<section><div class="mb-4 flex items-center gap-2">`);
        _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UIcon, {
          name: group.icon,
          class: "size-5 text-[var(--ui-text-muted)]"
        }, null, _parent));
        _push(`<h2 class="text-lg font-semibold text-[var(--ui-text-highlighted)]">${serverRenderer_cjs_prodExports.ssrInterpolate(group.label)}</h2></div><div class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3"><!--[-->`);
        serverRenderer_cjs_prodExports.ssrRenderList(group.children, (mod) => {
          _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_ULink, {
            key: mod.to,
            to: mod.to,
            class: "group flex items-start gap-4 rounded-lg border border-[var(--ui-border)] p-5 transition hover:border-[var(--ui-primary)] hover:bg-[var(--ui-bg-elevated)]"
          }, {
            default: vueExports.withCtx((_, _push2, _parent2, _scopeId) => {
              if (_push2) {
                _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UIcon, {
                  name: mod.icon,
                  class: "size-10 shrink-0 text-[var(--ui-primary)]"
                }, null, _parent2, _scopeId));
                _push2(`<div${_scopeId}><p class="font-semibold text-[var(--ui-text-highlighted)] group-hover:text-[var(--ui-primary)]"${_scopeId}>${serverRenderer_cjs_prodExports.ssrInterpolate(mod.label)}</p><p class="mt-1 text-sm text-[var(--ui-text-muted)]"${_scopeId}>${serverRenderer_cjs_prodExports.ssrInterpolate(mod.description)}</p></div>`);
              } else {
                return [
                  vueExports.createVNode(_component_UIcon, {
                    name: mod.icon,
                    class: "size-10 shrink-0 text-[var(--ui-primary)]"
                  }, null, 8, ["name"]),
                  vueExports.createVNode("div", null, [
                    vueExports.createVNode("p", { class: "font-semibold text-[var(--ui-text-highlighted)] group-hover:text-[var(--ui-primary)]" }, vueExports.toDisplayString(mod.label), 1),
                    vueExports.createVNode("p", { class: "mt-1 text-sm text-[var(--ui-text-muted)]" }, vueExports.toDisplayString(mod.description), 1)
                  ])
                ];
              }
            }),
            _: 2
          }, _parent));
        });
        _push(`<!--]--></div></section>`);
      });
      _push(`<!--]--></div></div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = vueExports.useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/pmc/dashboard.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=dashboard-DXbklZ-O.mjs.map
