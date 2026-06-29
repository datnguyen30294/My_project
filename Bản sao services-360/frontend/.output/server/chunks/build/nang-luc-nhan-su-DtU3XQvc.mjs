import { _ as __nuxt_component_1 } from './CapabilityRatingBadge-BBWBj9qN.mjs';
import { v as vueExports, p as useRoute$1, i as useRouter, j as useToast, aO as useHead, s as serverRenderer_cjs_prodExports, l as _sfc_main$c, _ as __nuxt_component_0$4, o as useApiFetch } from './server.mjs';
import { _ as __nuxt_component_0 } from './PageHeader-BJhealxW.mjs';
import { _ as _sfc_main$1 } from './Card-ywPiICev.mjs';
import { _ as _sfc_main$2 } from './Skeleton-CKN2C2Mt.mjs';
import { _ as _sfc_main$3 } from './FormField-DFdmv6Lu.mjs';
import { _ as __nuxt_component_3 } from './ProjectSelect-BTBiFCd5.mjs';
import { _ as _sfc_main$4 } from './Input-JXN8po_F.mjs';
import { _ as _sfc_main$5 } from './Alert-tTsPKADX.mjs';
import { _ as __nuxt_component_2 } from './TableWrapper-VwUckvcF.mjs';
import { _ as _sfc_main$6 } from './Table-17SH0cIR.mjs';
import { u as useTableSearch } from './useTableSearch-BhG9s2Ie.mjs';
import './Badge-W93D3Jpz.mjs';
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
import './Label-BBgw4vHh.mjs';
import './SelectMenu-DKHEMZj7.mjs';
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
import './useEntitySelect-DG9pQ_n0.mjs';
import './constants-G9YmtWtp.mjs';
import './useProjects-D4K3VYdb.mjs';
import './PageError-kZWsA9dh.mjs';
import './apiError-DBrxF9au.mjs';

function useWorkforceCapacityList(filters) {
  const query = vueExports.computed(() => {
    const f = vueExports.toValue(filters);
    const params = {};
    if (f.projectId != null) params.project_id = f.projectId;
    if (f.search && f.search.trim() !== "") params.search = f.search.trim();
    return params;
  });
  return useApiFetch("/pmc/workforce/capacity", {
    query,
    watch: [query]
  });
}
const _sfc_main = /* @__PURE__ */ vueExports.defineComponent({
  __name: "nang-luc-nhan-su",
  __ssrInlineRender: true,
  setup(__props) {
    const route = useRoute$1();
    const router = useRouter();
    const filterProjectId = vueExports.ref(null);
    const searchInput = vueExports.ref("");
    const searchValue = vueExports.ref(void 0);
    if (route.query.project_id) {
      const n = Number(route.query.project_id);
      if (!Number.isNaN(n)) filterProjectId.value = n;
    }
    if (typeof route.query.search === "string" && route.query.search.length <= 100) {
      searchInput.value = route.query.search;
      searchValue.value = route.query.search;
    }
    const isInit = vueExports.ref(true);
    vueExports.nextTick(() => {
      isInit.value = false;
    });
    vueExports.watch([filterProjectId, searchValue], () => {
      if (isInit.value) return;
      const query = {};
      if (filterProjectId.value != null) query.project_id = String(filterProjectId.value);
      if (searchValue.value) query.search = searchValue.value;
      router.replace({ query });
    });
    const { onSearch } = useTableSearch((value) => {
      searchValue.value = value;
    });
    const hasFilters = vueExports.computed(
      () => filterProjectId.value != null || !!searchValue.value
    );
    function clearFilters() {
      filterProjectId.value = null;
      searchInput.value = "";
      searchValue.value = void 0;
    }
    const { data, status, error, refresh } = useWorkforceCapacityList(
      vueExports.computed(() => ({ projectId: filterProjectId.value, search: searchValue.value ?? null }))
    );
    const payload = vueExports.computed(() => data.value?.data ?? null);
    const rows = vueExports.computed(() => payload.value?.rows ?? []);
    const summary = vueExports.computed(() => payload.value?.summary ?? null);
    const toast = useToast();
    const tooManyStaff = vueExports.ref(false);
    vueExports.watch(error, (err) => {
      if (!err) {
        tooManyStaff.value = false;
        return;
      }
      const statusCode = err.statusCode ?? err.status;
      const errData = err.data;
      if (statusCode === 422) {
        if (errData?.errors?.search) {
          toast.add({
            color: "warning",
            title: "Từ khóa tối đa 100 ký tự",
            description: errData.errors.search[0]
          });
        } else {
          tooManyStaff.value = true;
        }
      } else {
        tooManyStaff.value = false;
      }
    });
    const columns = [
      {
        accessorKey: "full_name",
        header: "Nhân sự",
        cell: ({ row }) => vueExports.h("div", {}, [
          vueExports.h("div", { class: "font-medium text-[var(--ui-text)]" }, row.original.full_name),
          row.original.employee_code ? vueExports.h("div", { class: "text-xs text-[var(--ui-text-muted)]" }, row.original.employee_code) : null
        ])
      },
      {
        accessorKey: "job_title_name",
        header: "Chức danh",
        cell: ({ row }) => row.original.job_title_name ?? "—"
      },
      {
        accessorKey: "project_names",
        header: "Dự án",
        meta: { class: { td: "max-w-[200px] text-sm whitespace-normal" } },
        cell: ({ row }) => row.original.project_names.length > 0 ? row.original.project_names.join(", ") : "—"
      },
      { accessorKey: "pending", header: "Chờ" },
      { accessorKey: "in_progress", header: "Đang làm" },
      { accessorKey: "completed", header: "Xong" },
      {
        id: "rating",
        header: "ĐTB đánh giá",
        meta: { class: { td: "text-sm tabular-nums" } },
        cell: ({ row }) => {
          const r = row.original;
          if (r.avg_rating == null) return "—";
          return `${r.avg_rating} / 5 · ${r.rating_count} lượt`;
        }
      },
      {
        id: "capability_rating",
        header: "Năng lực nhân sự",
        meta: { class: { td: "text-sm" } },
        cell: ({ row }) => vueExports.h(__nuxt_component_1, {
          rating: row.original.capability_rating,
          showWhenNull: true,
          nullLabel: "—"
        })
      },
      {
        id: "link",
        header: "",
        meta: { class: { td: "text-right" } },
        cell: ({ row }) => vueExports.h(
          __nuxt_component_0$4,
          { to: `/pmc/accounts/${row.original.account_id}` },
          () => vueExports.h(_sfc_main$c, {
            variant: "link",
            size: "xs",
            label: "Hồ sơ",
            icon: "i-lucide-external-link"
          })
        )
      }
    ];
    useHead({ title: "Năng lực nhân sự — TNP Service" });
    return (_ctx, _push, _parent, _attrs) => {
      const _component_SharedCrudPageHeader = __nuxt_component_0;
      const _component_UCard = _sfc_main$1;
      const _component_USkeleton = _sfc_main$2;
      const _component_UFormField = _sfc_main$3;
      const _component_SharedProjectSelect = __nuxt_component_3;
      const _component_UInput = _sfc_main$4;
      const _component_UButton = _sfc_main$c;
      const _component_UAlert = _sfc_main$5;
      const _component_SharedCrudTableWrapper = __nuxt_component_2;
      const _component_UTable = _sfc_main$6;
      const _component_NuxtLink = __nuxt_component_0$4;
      _push(`<div${serverRenderer_cjs_prodExports.ssrRenderAttrs(vueExports.mergeProps({ class: "space-y-4" }, _attrs))}>`);
      _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_SharedCrudPageHeader, {
        title: "Năng lực nhân sự",
        description: "Theo dõi tải việc và điểm đánh giá của nhân sự theo dự án"
      }, null, _parent));
      _push(`<div class="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3">`);
      _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UCard, null, {
        default: vueExports.withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<p class="text-xs text-[var(--ui-text-muted)] mb-1"${_scopeId}> Nhân sự (theo bộ lọc) </p>`);
            if (vueExports.unref(status) === "pending" && !vueExports.unref(summary)) {
              _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_USkeleton, { class: "h-8 w-16" }, null, _parent2, _scopeId));
            } else {
              _push2(`<p class="text-2xl font-bold tabular-nums"${_scopeId}>${serverRenderer_cjs_prodExports.ssrInterpolate(vueExports.unref(summary)?.staff_count ?? 0)}</p>`);
            }
          } else {
            return [
              vueExports.createVNode("p", { class: "text-xs text-[var(--ui-text-muted)] mb-1" }, " Nhân sự (theo bộ lọc) "),
              vueExports.unref(status) === "pending" && !vueExports.unref(summary) ? (vueExports.openBlock(), vueExports.createBlock(_component_USkeleton, {
                key: 0,
                class: "h-8 w-16"
              })) : (vueExports.openBlock(), vueExports.createBlock("p", {
                key: 1,
                class: "text-2xl font-bold tabular-nums"
              }, vueExports.toDisplayString(vueExports.unref(summary)?.staff_count ?? 0), 1))
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UCard, null, {
        default: vueExports.withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<p class="text-xs text-[var(--ui-text-muted)] mb-1"${_scopeId}> Đang xử lý </p>`);
            if (vueExports.unref(status) === "pending" && !vueExports.unref(summary)) {
              _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_USkeleton, { class: "h-8 w-16" }, null, _parent2, _scopeId));
            } else {
              _push2(`<p class="text-2xl font-bold tabular-nums text-amber-600 dark:text-amber-400"${_scopeId}>${serverRenderer_cjs_prodExports.ssrInterpolate(vueExports.unref(summary)?.total_in_progress ?? 0)}</p>`);
            }
          } else {
            return [
              vueExports.createVNode("p", { class: "text-xs text-[var(--ui-text-muted)] mb-1" }, " Đang xử lý "),
              vueExports.unref(status) === "pending" && !vueExports.unref(summary) ? (vueExports.openBlock(), vueExports.createBlock(_component_USkeleton, {
                key: 0,
                class: "h-8 w-16"
              })) : (vueExports.openBlock(), vueExports.createBlock("p", {
                key: 1,
                class: "text-2xl font-bold tabular-nums text-amber-600 dark:text-amber-400"
              }, vueExports.toDisplayString(vueExports.unref(summary)?.total_in_progress ?? 0), 1))
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UCard, null, {
        default: vueExports.withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<p class="text-xs text-[var(--ui-text-muted)] mb-1"${_scopeId}> Chờ xử lý </p>`);
            if (vueExports.unref(status) === "pending" && !vueExports.unref(summary)) {
              _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_USkeleton, { class: "h-8 w-16" }, null, _parent2, _scopeId));
            } else {
              _push2(`<p class="text-2xl font-bold tabular-nums text-[var(--ui-primary)]"${_scopeId}>${serverRenderer_cjs_prodExports.ssrInterpolate(vueExports.unref(summary)?.total_pending ?? 0)}</p>`);
            }
          } else {
            return [
              vueExports.createVNode("p", { class: "text-xs text-[var(--ui-text-muted)] mb-1" }, " Chờ xử lý "),
              vueExports.unref(status) === "pending" && !vueExports.unref(summary) ? (vueExports.openBlock(), vueExports.createBlock(_component_USkeleton, {
                key: 0,
                class: "h-8 w-16"
              })) : (vueExports.openBlock(), vueExports.createBlock("p", {
                key: 1,
                class: "text-2xl font-bold tabular-nums text-[var(--ui-primary)]"
              }, vueExports.toDisplayString(vueExports.unref(summary)?.total_pending ?? 0), 1))
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UCard, null, {
        default: vueExports.withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<p class="text-xs text-[var(--ui-text-muted)] mb-1"${_scopeId}> TB đánh giá (nhóm) </p>`);
            if (vueExports.unref(status) === "pending" && !vueExports.unref(summary)) {
              _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_USkeleton, { class: "h-8 w-16" }, null, _parent2, _scopeId));
            } else {
              _push2(`<!--[--><p class="text-2xl font-bold tabular-nums"${_scopeId}>${serverRenderer_cjs_prodExports.ssrInterpolate(vueExports.unref(summary)?.pooled_avg_rating != null ? `${vueExports.unref(summary).pooled_avg_rating} / 5` : "—")}</p><p class="text-[11px] text-[var(--ui-text-muted)] mt-1"${_scopeId}>${serverRenderer_cjs_prodExports.ssrInterpolate(vueExports.unref(summary)?.total_rating_events ?? 0)} lượt · ${serverRenderer_cjs_prodExports.ssrInterpolate(vueExports.unref(summary)?.staff_with_ratings ?? 0)} nhân sự có điểm </p><!--]-->`);
            }
          } else {
            return [
              vueExports.createVNode("p", { class: "text-xs text-[var(--ui-text-muted)] mb-1" }, " TB đánh giá (nhóm) "),
              vueExports.unref(status) === "pending" && !vueExports.unref(summary) ? (vueExports.openBlock(), vueExports.createBlock(_component_USkeleton, {
                key: 0,
                class: "h-8 w-16"
              })) : (vueExports.openBlock(), vueExports.createBlock(vueExports.Fragment, { key: 1 }, [
                vueExports.createVNode("p", { class: "text-2xl font-bold tabular-nums" }, vueExports.toDisplayString(vueExports.unref(summary)?.pooled_avg_rating != null ? `${vueExports.unref(summary).pooled_avg_rating} / 5` : "—"), 1),
                vueExports.createVNode("p", { class: "text-[11px] text-[var(--ui-text-muted)] mt-1" }, vueExports.toDisplayString(vueExports.unref(summary)?.total_rating_events ?? 0) + " lượt · " + vueExports.toDisplayString(vueExports.unref(summary)?.staff_with_ratings ?? 0) + " nhân sự có điểm ", 1)
              ], 64))
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</div><div class="flex flex-wrap items-end gap-4">`);
      _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UFormField, {
        label: "Dự án",
        class: "min-w-56"
      }, {
        default: vueExports.withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_SharedProjectSelect, {
              modelValue: vueExports.unref(filterProjectId),
              "onUpdate:modelValue": ($event) => vueExports.isRef(filterProjectId) ? filterProjectId.value = $event : null,
              placeholder: "Tất cả dự án"
            }, null, _parent2, _scopeId));
          } else {
            return [
              vueExports.createVNode(_component_SharedProjectSelect, {
                modelValue: vueExports.unref(filterProjectId),
                "onUpdate:modelValue": ($event) => vueExports.isRef(filterProjectId) ? filterProjectId.value = $event : null,
                placeholder: "Tất cả dự án"
              }, null, 8, ["modelValue", "onUpdate:modelValue"])
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UFormField, {
        label: "Tìm nhân sự",
        class: "min-w-64"
      }, {
        default: vueExports.withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UInput, {
              modelValue: vueExports.unref(searchInput),
              "onUpdate:modelValue": [($event) => vueExports.isRef(searchInput) ? searchInput.value = $event : null, vueExports.unref(onSearch)],
              icon: "i-lucide-search",
              placeholder: "Tên hoặc mã NV...",
              autocomplete: "nope"
            }, null, _parent2, _scopeId));
          } else {
            return [
              vueExports.createVNode(_component_UInput, {
                modelValue: vueExports.unref(searchInput),
                "onUpdate:modelValue": [($event) => vueExports.isRef(searchInput) ? searchInput.value = $event : null, vueExports.unref(onSearch)],
                icon: "i-lucide-search",
                placeholder: "Tên hoặc mã NV...",
                autocomplete: "nope"
              }, null, 8, ["modelValue", "onUpdate:modelValue"])
            ];
          }
        }),
        _: 1
      }, _parent));
      if (vueExports.unref(hasFilters)) {
        _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UButton, {
          icon: "i-lucide-x",
          label: "Xóa bộ lọc",
          color: "neutral",
          variant: "ghost",
          size: "sm",
          class: "mb-1",
          onClick: clearFilters
        }, null, _parent));
      } else {
        _push(`<!---->`);
      }
      _push(`</div>`);
      if (vueExports.unref(tooManyStaff)) {
        _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UAlert, {
          color: "warning",
          variant: "subtle",
          icon: "i-lucide-triangle-alert",
          title: "Quá nhiều nhân sự",
          description: "Vui lòng lọc theo dự án để thu hẹp danh sách."
        }, null, _parent));
      } else {
        _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_SharedCrudTableWrapper, {
          status: vueExports.unref(status),
          error: vueExports.unref(error),
          data: vueExports.unref(data),
          refresh: vueExports.unref(refresh)
        }, {
          default: vueExports.withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`<div class="bg-white border border-border-gray rounded-xl overflow-hidden shadow-sm"${_scopeId}>`);
              _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UTable, {
                data: vueExports.unref(rows),
                columns,
                "empty-state": { icon: "i-lucide-users", label: "Không có nhân sự khớp bộ lọc." }
              }, null, _parent2, _scopeId));
              _push2(`</div><p class="text-xs text-[var(--ui-text-muted)] mt-4"${_scopeId}> Đã hoàn thành: <strong${_scopeId}>${serverRenderer_cjs_prodExports.ssrInterpolate(vueExports.unref(summary)?.total_completed ?? 0)}</strong> phân công. Xem chi tiết lịch: `);
              _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_NuxtLink, {
                to: "/quan-ly-cong-viec/lich-viec-doi",
                class: "text-[var(--ui-primary)] underline"
              }, {
                default: vueExports.withCtx((_2, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    _push3(` Lịch việc đội `);
                  } else {
                    return [
                      vueExports.createTextVNode(" Lịch việc đội ")
                    ];
                  }
                }),
                _: 1
              }, _parent2, _scopeId));
              _push2(`, `);
              _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_NuxtLink, {
                to: "/quan-ly-cong-viec/lich-viec-ca-nhan",
                class: "text-[var(--ui-primary)] underline"
              }, {
                default: vueExports.withCtx((_2, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    _push3(` Lịch việc cá nhân `);
                  } else {
                    return [
                      vueExports.createTextVNode(" Lịch việc cá nhân ")
                    ];
                  }
                }),
                _: 1
              }, _parent2, _scopeId));
              _push2(`. </p>`);
            } else {
              return [
                vueExports.createVNode("div", { class: "bg-white border border-border-gray rounded-xl overflow-hidden shadow-sm" }, [
                  vueExports.createVNode(_component_UTable, {
                    data: vueExports.unref(rows),
                    columns,
                    "empty-state": { icon: "i-lucide-users", label: "Không có nhân sự khớp bộ lọc." }
                  }, null, 8, ["data"])
                ]),
                vueExports.createVNode("p", { class: "text-xs text-[var(--ui-text-muted)] mt-4" }, [
                  vueExports.createTextVNode(" Đã hoàn thành: "),
                  vueExports.createVNode("strong", null, vueExports.toDisplayString(vueExports.unref(summary)?.total_completed ?? 0), 1),
                  vueExports.createTextVNode(" phân công. Xem chi tiết lịch: "),
                  vueExports.createVNode(_component_NuxtLink, {
                    to: "/quan-ly-cong-viec/lich-viec-doi",
                    class: "text-[var(--ui-primary)] underline"
                  }, {
                    default: vueExports.withCtx(() => [
                      vueExports.createTextVNode(" Lịch việc đội ")
                    ]),
                    _: 1
                  }),
                  vueExports.createTextVNode(", "),
                  vueExports.createVNode(_component_NuxtLink, {
                    to: "/quan-ly-cong-viec/lich-viec-ca-nhan",
                    class: "text-[var(--ui-primary)] underline"
                  }, {
                    default: vueExports.withCtx(() => [
                      vueExports.createTextVNode(" Lịch việc cá nhân ")
                    ]),
                    _: 1
                  }),
                  vueExports.createTextVNode(". ")
                ])
              ];
            }
          }),
          _: 1
        }, _parent));
      }
      _push(`</div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = vueExports.useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/quan-ly-cong-viec/nang-luc-nhan-su.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=nang-luc-nhan-su-DtU3XQvc.mjs.map
