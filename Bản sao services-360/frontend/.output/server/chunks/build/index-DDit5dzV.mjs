import { _ as _sfc_main$5 } from './Alert-tTsPKADX.mjs';
import { v as vueExports, p as useRoute$1, i as useRouter, j as useToast, u as useSeoMeta, s as serverRenderer_cjs_prodExports, y as _sfc_main$f, l as _sfc_main$c, k as _sfc_main$h, _ as __nuxt_component_0$4, aM as _sfc_main$b$1 } from './server.mjs';
import { _ as _sfc_main$6 } from './Badge-W93D3Jpz.mjs';
import { _ as _sfc_main$7 } from './Tabs-Djlffbcc.mjs';
import { _ as _sfc_main$8 } from './Input-JXN8po_F.mjs';
import { u as useTenantContractList, s as summarizeProjectContracts, P as PROJECT_HEALTH_META, t as tenantContractLocation } from './usePartnerCommissionContracts-DUXun7gY.mjs';
import { _ as __nuxt_component_4 } from './SectionCard-CH-mG9Mf.mjs';
import { _ as __nuxt_component_6$1, a as __nuxt_component_5$1$1, b as __nuxt_component_7, c as __nuxt_component_8 } from './ContractFormDrawer-D4QomKFW.mjs';
import { f as formatDateTime, a as formatDate } from './date-R5YK0ast.mjs';
import { S as SELECT_ALL_PER_PAGE } from './constants-G9YmtWtp.mjs';
import { d as useProjectList } from './useProjects-D4K3VYdb.mjs';
import { _ as __nuxt_component_0, a as __nuxt_component_7$1 } from './DetailDrawer-DcxElfkZ.mjs';
import { _ as _sfc_main$9 } from './Select-CZE7Ef6n.mjs';
import { _ as _sfc_main$a } from './Table-17SH0cIR.mjs';
import { _ as __nuxt_component_10$1 } from './TablePagination-CZYWB-qm.mjs';
import { f as formatCurrency } from './currency-DEb2TrW3.mjs';
import { u as useVendorOrderSummary, a as useVendorOrderList } from './useVendorOrders-DqEI_vYD.mjs';
import { u as useTableSearch } from './useTableSearch-BhG9s2Ie.mjs';
import { _ as __nuxt_component_5$1 } from './FieldDisplay-BM6nmr2i.mjs';
import { _ as _sfc_main$b } from './Modal-BimZZbNl.mjs';
import { _ as _sfc_main$d } from './FormField-DFdmv6Lu.mjs';
import { _ as _sfc_main$e } from './SelectMenu-DKHEMZj7.mjs';
import { f as useTenantPartnerDetail, a as apiProvisionTenantPartner, h as clearTenantPartnerCache, b as apiDeleteTenantPartner, i as apiDetachTenantPartner, e as apiAttachTenantPartner } from './usePartners-DhKs6EM6.mjs';
import { g as getApiErrorMessage } from './apiError-DBrxF9au.mjs';
import { _ as __nuxt_component_11 } from './DeleteModal-B4AevDGU.mjs';
import { f as formatPhone } from './phone-DErPjpTB.mjs';
import { u as useBreadcrumb } from './useBreadcrumb-zkNa_uJG.mjs';
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
import './useDirection-CXYby7CP.mjs';
import './FocusScope-BZehoQSg.mjs';
import './RovingFocusGroup-Vsbo7D6E.mjs';
import './utils-BgcT7rQQ.mjs';
import './RovingFocusItem-DwKRAYZk.mjs';
import './index-QmZAbLx-.mjs';
import './Drawer-D5sl7aXR.mjs';
import './DialogTrigger-C3iwCYMu.mjs';
import './utils-DY0Zag2O.mjs';
import './Textarea-DTCNHwKm.mjs';
import './NumberInput-BfLKWOCC.mjs';
import './RadioGroup-DnRwe9KX.mjs';
import './Label-BBgw4vHh.mjs';
import './useFormControl-_Lqv8ipK.mjs';
import './VisuallyHiddenInput-q6Pz-w0i.mjs';
import './handleAndDispatchCustomEvent-Bk_AVSSo.mjs';
import './useOrganizations-DNv3fDw1.mjs';
import './useAppContext-qiCJKBCF.mjs';
import './CommissionBreakdown-BKSDhXYk.mjs';
import './PopperArrow-C9hHWuSZ.mjs';
import './useFocusGuards-CJykkUFH.mjs';
import './index-CSThDD3J.mjs';
import './Pagination-fZq_Msxb.mjs';
import './DialogClose-DGkUxau7.mjs';
import './useKbd-JjFOu4f7.mjs';

const SEARCH_THRESHOLD = 7;
const _sfc_main$4 = /* @__PURE__ */ vueExports.defineComponent({
  __name: "ContractProjectRail",
  __ssrInlineRender: true,
  props: {
    items: {},
    modelValue: {},
    loading: { type: Boolean }
  },
  emits: ["update:modelValue"],
  setup(__props, { emit: __emit }) {
    const props = __props;
    const total = vueExports.computed(() => props.items.length);
    const activeCount = vueExports.computed(() => props.items.filter((i) => i.health === "active").length);
    const gapCount = vueExports.computed(() => props.items.filter((i) => i.health === "none").length);
    const fullyCovered = vueExports.computed(() => total.value > 0 && activeCount.value === total.value);
    const search = vueExports.ref("");
    const showSearch = vueExports.computed(() => props.items.length > SEARCH_THRESHOLD);
    const visibleItems = vueExports.computed(() => {
      const q = search.value.trim().toLowerCase();
      if (!q) return props.items;
      return props.items.filter((i) => i.projectName.toLowerCase().includes(q));
    });
    return (_ctx, _push, _parent, _attrs) => {
      const _component_UIcon = _sfc_main$h;
      const _component_UProgress = _sfc_main$b$1;
      const _component_UInput = _sfc_main$8;
      const _component_UBadge = _sfc_main$6;
      _push(`<div${serverRenderer_cjs_prodExports.ssrRenderAttrs(vueExports.mergeProps({ class: "bg-white border border-border-gray rounded-xl shadow-sm overflow-hidden flex flex-col" }, _attrs))}><div class="px-4 py-4 border-b border-border-gray"><div class="flex items-center justify-between gap-2"><h2 class="font-bold text-slate-900 text-sm flex items-center gap-2">`);
      _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UIcon, {
        name: "i-lucide-folder-kanban",
        class: "text-primary size-4 shrink-0"
      }, null, _parent));
      _push(` Dự án phục vụ </h2><span class="text-sm font-semibold tabular-nums text-slate-900">${serverRenderer_cjs_prodExports.ssrInterpolate(vueExports.unref(activeCount))}<span class="text-slate-400 font-normal">/${serverRenderer_cjs_prodExports.ssrInterpolate(vueExports.unref(total))}</span></span></div>`);
      _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UProgress, {
        "model-value": vueExports.unref(activeCount),
        max: Math.max(vueExports.unref(total), 1),
        color: vueExports.unref(fullyCovered) ? "success" : "warning",
        size: "sm",
        class: "mt-3"
      }, null, _parent));
      if (vueExports.unref(gapCount) > 0) {
        _push(`<p class="mt-2 text-xs text-red-600 flex items-center gap-1">`);
        _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UIcon, {
          name: "i-lucide-circle-alert",
          class: "size-3.5 shrink-0"
        }, null, _parent));
        _push(` ${serverRenderer_cjs_prodExports.ssrInterpolate(vueExports.unref(gapCount))} dự án chưa có hợp đồng hiệu lực </p>`);
      } else if (vueExports.unref(fullyCovered)) {
        _push(`<p class="mt-2 text-xs text-emerald-600 flex items-center gap-1">`);
        _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UIcon, {
          name: "i-lucide-circle-check",
          class: "size-3.5 shrink-0"
        }, null, _parent));
        _push(` Mọi dự án đều có hợp đồng hiệu lực </p>`);
      } else {
        _push(`<!---->`);
      }
      if (vueExports.unref(showSearch)) {
        _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UInput, {
          modelValue: vueExports.unref(search),
          "onUpdate:modelValue": ($event) => vueExports.isRef(search) ? search.value = $event : null,
          icon: "i-lucide-search",
          placeholder: "Tìm dự án...",
          size: "sm",
          class: "mt-3 w-full"
        }, null, _parent));
      } else {
        _push(`<!---->`);
      }
      _push(`</div>`);
      if (__props.loading) {
        _push(`<div class="p-3 space-y-2"><!--[-->`);
        serverRenderer_cjs_prodExports.ssrRenderList(4, (n) => {
          _push(`<div class="h-14 bg-slate-100 rounded-lg animate-pulse"></div>`);
        });
        _push(`<!--]--></div>`);
      } else {
        _push(`<div class="p-2 space-y-1 overflow-y-auto max-h-[28rem] lg:max-h-[calc(100vh-16rem)]"><!--[-->`);
        serverRenderer_cjs_prodExports.ssrRenderList(vueExports.unref(visibleItems), (item) => {
          _push(`<button type="button" class="${serverRenderer_cjs_prodExports.ssrRenderClass([item.projectId === __props.modelValue ? "bg-primary-50 ring-primary-200" : "ring-transparent hover:bg-slate-50", "w-full text-left rounded-lg px-3 py-2.5 flex items-start gap-2.5 transition ring-1 ring-inset"])}">`);
          _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UIcon, {
            name: vueExports.unref(PROJECT_HEALTH_META)[item.health].icon,
            class: ["size-4 mt-0.5 shrink-0", vueExports.unref(PROJECT_HEALTH_META)[item.health].tone]
          }, null, _parent));
          _push(`<div class="min-w-0 flex-1"><p class="${serverRenderer_cjs_prodExports.ssrRenderClass([item.projectId === __props.modelValue ? "text-primary-700" : "text-slate-900", "text-sm font-medium truncate"])}">${serverRenderer_cjs_prodExports.ssrInterpolate(item.projectName)}</p><p class="${serverRenderer_cjs_prodExports.ssrRenderClass([vueExports.unref(PROJECT_HEALTH_META)[item.health].tone, "text-xs truncate"])}">${serverRenderer_cjs_prodExports.ssrInterpolate(vueExports.unref(PROJECT_HEALTH_META)[item.health].label)} `);
          if (item.activeMode) {
            _push(`<span class="text-slate-400">· ${serverRenderer_cjs_prodExports.ssrInterpolate(item.activeMode.label)}</span>`);
          } else {
            _push(`<!---->`);
          }
          _push(`</p>`);
          if (item.pendingCount > 0 || item.draftCount > 0) {
            _push(`<div class="mt-1.5 flex flex-wrap gap-1">`);
            if (item.pendingCount > 0) {
              _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UBadge, {
                color: "warning",
                variant: "subtle",
                size: "xs",
                label: `${item.pendingCount} chờ`
              }, null, _parent));
            } else {
              _push(`<!---->`);
            }
            if (item.draftCount > 0) {
              _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UBadge, {
                color: "neutral",
                variant: "subtle",
                size: "xs",
                label: `${item.draftCount} nháp`
              }, null, _parent));
            } else {
              _push(`<!---->`);
            }
            _push(`</div>`);
          } else {
            _push(`<!---->`);
          }
          _push(`</div>`);
          if (item.projectId === __props.modelValue) {
            _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UIcon, {
              name: "i-lucide-chevron-right",
              class: "size-4 text-primary-500 mt-0.5 shrink-0"
            }, null, _parent));
          } else {
            _push(`<!---->`);
          }
          _push(`</button>`);
        });
        _push(`<!--]-->`);
        if (vueExports.unref(visibleItems).length === 0) {
          _push(`<p class="px-3 py-6 text-center text-sm text-slate-500"> Không tìm thấy dự án phù hợp. </p>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</div>`);
      }
      _push(`</div>`);
    };
  }
});
const _sfc_setup$4 = _sfc_main$4.setup;
_sfc_main$4.setup = (props, ctx) => {
  const ssrContext = vueExports.useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/partner-commission-contract/ContractProjectRail.vue");
  return _sfc_setup$4 ? _sfc_setup$4(props, ctx) : void 0;
};
const __nuxt_component_1 = Object.assign(_sfc_main$4, { __name: "PartnerCommissionContractProjectRail" });
const _sfc_main$3 = /* @__PURE__ */ vueExports.defineComponent({
  __name: "TenantContractsPanel",
  __ssrInlineRender: true,
  props: {
    partnerId: {},
    projectIds: { default: () => [] }
  },
  setup(__props) {
    const props = __props;
    const route = useRoute$1();
    const router = useRouter();
    const TERMINAL_STATUSES = ["replaced", "cancelled", "expired", "revoked"];
    const {
      data: contractsData,
      status: contractsStatus,
      refresh: refreshContracts
    } = useTenantContractList(
      vueExports.computed(() => ({ partner_id: Number(props.partnerId), per_page: SELECT_ALL_PER_PAGE }))
    );
    const allContracts = vueExports.computed(() => contractsData.value?.data ?? []);
    const { data: projectsData } = useProjectList(
      vueExports.computed(() => ({ per_page: SELECT_ALL_PER_PAGE }))
    );
    const projects = vueExports.computed(
      () => (projectsData.value?.data ?? []).map((p) => ({ id: p.id, name: p.name }))
    );
    const summaries = vueExports.computed(
      () => summarizeProjectContracts(allContracts.value, projects.value, props.projectIds)
    );
    const isInitialLoading = vueExports.computed(
      () => contractsStatus.value === "pending" && allContracts.value.length === 0
    );
    const selectedProjectId = vueExports.ref(
      route.query.project ? Number(route.query.project) : void 0
    );
    vueExports.watch(summaries, (rows) => {
      if (rows.length === 0) return;
      const exists = rows.some((r) => r.projectId === selectedProjectId.value);
      if (!selectedProjectId.value || !exists) {
        selectedProjectId.value = rows[0].projectId;
      }
    }, { immediate: true });
    vueExports.watch(selectedProjectId, (v) => {
      router.replace({ query: { ...route.query, project: v ? String(v) : void 0 } });
    });
    const selectedSummary = vueExports.computed(
      () => summaries.value.find((s) => s.projectId === selectedProjectId.value) ?? null
    );
    const projectContracts = vueExports.computed(
      () => allContracts.value.filter((c) => c.project_id === selectedProjectId.value)
    );
    const activeContract = vueExports.computed(
      () => projectContracts.value.find((c) => c.status.value === "active") ?? null
    );
    const pendingContracts = vueExports.computed(
      () => projectContracts.value.filter((c) => c.status.value === "pending")
    );
    const draftContracts = vueExports.computed(
      () => projectContracts.value.filter((c) => c.status.value === "draft")
    );
    const historyContracts = vueExports.computed(
      () => projectContracts.value.filter((c) => TERMINAL_STATUSES.includes(c.status.value))
    );
    const detailDrawerOpen = vueExports.ref(false);
    const selectedContractId = vueExports.ref(null);
    function openDetail(id) {
      selectedContractId.value = id;
      detailDrawerOpen.value = true;
    }
    const initialContractId = route.query.contract ? Number(route.query.contract) : null;
    if (initialContractId) {
      openDetail(initialContractId);
    }
    vueExports.watch(detailDrawerOpen, (open) => {
      if (open || !route.query.contract) return;
      const query = { ...route.query };
      delete query.contract;
      router.replace({ query });
    });
    const formDrawerOpen = vueExports.ref(false);
    const editContract = vueExports.ref(null);
    function openCreate() {
      editContract.value = null;
      formDrawerOpen.value = true;
    }
    function openEdit(contract) {
      detailDrawerOpen.value = false;
      editContract.value = contract;
      formDrawerOpen.value = true;
    }
    async function reloadAll() {
      await refreshContracts();
    }
    const showHistory = vueExports.ref(false);
    return (_ctx, _push, _parent, _attrs) => {
      const _component_UAlert = _sfc_main$5;
      const _component_PartnerCommissionContractProjectRail = __nuxt_component_1;
      const _component_UIcon = _sfc_main$h;
      const _component_UButton = _sfc_main$c;
      const _component_SharedSectionCard = __nuxt_component_4;
      const _component_PartnerCommissionContractStatusBadge = __nuxt_component_6$1;
      const _component_PartnerCommissionContractModeBadge = __nuxt_component_5$1$1;
      const _component_PartnerCommissionContractDetailDrawer = __nuxt_component_7;
      const _component_PartnerCommissionContractFormDrawer = __nuxt_component_8;
      _push(`<div${serverRenderer_cjs_prodExports.ssrRenderAttrs(_attrs)}>`);
      if (vueExports.unref(isInitialLoading)) {
        _push(`<div class="grid lg:grid-cols-[19rem_minmax(0,1fr)] gap-5"><div class="h-72 bg-slate-100 rounded-xl animate-pulse"></div><div class="h-72 bg-slate-100 rounded-xl animate-pulse"></div></div>`);
      } else if (vueExports.unref(summaries).length === 0) {
        _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UAlert, {
          color: "info",
          variant: "subtle",
          icon: "i-lucide-info",
          title: "Vendor chưa được gán cho dự án nào",
          description: "Sang tab Thông tin để thêm dự án cho vendor, sau đó tạo hợp đồng hoa hồng cho từng dự án."
        }, null, _parent));
      } else {
        _push(`<div class="grid lg:grid-cols-[19rem_minmax(0,1fr)] gap-5 items-start">`);
        _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_PartnerCommissionContractProjectRail, {
          modelValue: vueExports.unref(selectedProjectId),
          "onUpdate:modelValue": ($event) => vueExports.isRef(selectedProjectId) ? selectedProjectId.value = $event : null,
          items: vueExports.unref(summaries),
          loading: vueExports.unref(contractsStatus) === "pending" && vueExports.unref(allContracts).length === 0,
          class: "lg:sticky lg:top-4"
        }, null, _parent));
        _push(`<div class="space-y-5 min-w-0"><div class="flex flex-wrap items-start justify-between gap-3"><div class="min-w-0"><h3 class="text-lg font-bold text-slate-900 truncate">${serverRenderer_cjs_prodExports.ssrInterpolate(vueExports.unref(selectedSummary)?.projectName ?? "—")}</h3>`);
        if (vueExports.unref(selectedSummary)) {
          _push(`<p class="${serverRenderer_cjs_prodExports.ssrRenderClass([vueExports.unref(PROJECT_HEALTH_META)[vueExports.unref(selectedSummary).health].tone, "text-sm flex items-center gap-1.5 mt-0.5"])}">`);
          _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UIcon, {
            name: vueExports.unref(PROJECT_HEALTH_META)[vueExports.unref(selectedSummary).health].icon,
            class: "size-4 shrink-0"
          }, null, _parent));
          _push(` ${serverRenderer_cjs_prodExports.ssrInterpolate(vueExports.unref(PROJECT_HEALTH_META)[vueExports.unref(selectedSummary).health].label)}</p>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</div>`);
        _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UButton, {
          icon: "i-lucide-plus",
          label: "Tạo hợp đồng mới",
          color: "primary",
          variant: "soft",
          size: "sm",
          class: "shrink-0",
          onClick: openCreate
        }, null, _parent));
        _push(`</div>`);
        if (!vueExports.unref(activeContract)) {
          _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UAlert, {
            color: "error",
            variant: "subtle",
            icon: "i-lucide-alert-triangle",
            title: "Không có hợp đồng đang hiệu lực",
            description: "Vendor không thể nhận đơn mới ở dự án này. Vui lòng kích hoạt một hợp đồng chờ hoặc tạo hợp đồng mới."
          }, null, _parent));
        } else {
          _push(`<!---->`);
        }
        if (vueExports.unref(activeContract)) {
          _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_SharedSectionCard, { title: "Hợp đồng đang hiệu lực" }, {
            default: vueExports.withCtx((_, _push2, _parent2, _scopeId) => {
              if (_push2) {
                _push2(`<button type="button" class="w-full text-left flex flex-wrap items-start justify-between gap-4 group"${_scopeId}><div class="min-w-0 flex-1"${_scopeId}><div class="flex items-center gap-2 flex-wrap mb-2"${_scopeId}><span class="font-mono font-semibold text-slate-900 group-hover:text-primary-700 group-hover:underline"${_scopeId}>${serverRenderer_cjs_prodExports.ssrInterpolate(vueExports.unref(activeContract).contract_code)}</span>`);
                _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_PartnerCommissionContractStatusBadge, {
                  status: vueExports.unref(activeContract).status
                }, null, _parent2, _scopeId));
                _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_PartnerCommissionContractModeBadge, {
                  mode: vueExports.unref(activeContract).commission_mode
                }, null, _parent2, _scopeId));
                _push2(`</div><p class="text-sm text-slate-500"${_scopeId}> Hiệu lực: ${serverRenderer_cjs_prodExports.ssrInterpolate(vueExports.unref(activeContract).starts_at ? ("formatDate" in _ctx ? _ctx.formatDate : vueExports.unref(formatDate))(vueExports.unref(activeContract).starts_at) : "—")} → ${serverRenderer_cjs_prodExports.ssrInterpolate(vueExports.unref(activeContract).ends_at ? ("formatDate" in _ctx ? _ctx.formatDate : vueExports.unref(formatDate))(vueExports.unref(activeContract).ends_at) : "Không thời hạn")}</p>`);
                if (vueExports.unref(activeContract).activated_at) {
                  _push2(`<p class="text-xs text-slate-400 mt-1"${_scopeId}> Kích hoạt lúc ${serverRenderer_cjs_prodExports.ssrInterpolate(("formatDateTime" in _ctx ? _ctx.formatDateTime : vueExports.unref(formatDateTime))(vueExports.unref(activeContract).activated_at))}</p>`);
                } else {
                  _push2(`<!---->`);
                }
                _push2(`</div>`);
                _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UIcon, {
                  name: "i-lucide-chevron-right",
                  class: "text-slate-400 mt-1 shrink-0"
                }, null, _parent2, _scopeId));
                _push2(`</button>`);
              } else {
                return [
                  vueExports.createVNode("button", {
                    type: "button",
                    class: "w-full text-left flex flex-wrap items-start justify-between gap-4 group",
                    onClick: ($event) => openDetail(vueExports.unref(activeContract).id)
                  }, [
                    vueExports.createVNode("div", { class: "min-w-0 flex-1" }, [
                      vueExports.createVNode("div", { class: "flex items-center gap-2 flex-wrap mb-2" }, [
                        vueExports.createVNode("span", { class: "font-mono font-semibold text-slate-900 group-hover:text-primary-700 group-hover:underline" }, vueExports.toDisplayString(vueExports.unref(activeContract).contract_code), 1),
                        vueExports.createVNode(_component_PartnerCommissionContractStatusBadge, {
                          status: vueExports.unref(activeContract).status
                        }, null, 8, ["status"]),
                        vueExports.createVNode(_component_PartnerCommissionContractModeBadge, {
                          mode: vueExports.unref(activeContract).commission_mode
                        }, null, 8, ["mode"])
                      ]),
                      vueExports.createVNode("p", { class: "text-sm text-slate-500" }, " Hiệu lực: " + vueExports.toDisplayString(vueExports.unref(activeContract).starts_at ? ("formatDate" in _ctx ? _ctx.formatDate : vueExports.unref(formatDate))(vueExports.unref(activeContract).starts_at) : "—") + " → " + vueExports.toDisplayString(vueExports.unref(activeContract).ends_at ? ("formatDate" in _ctx ? _ctx.formatDate : vueExports.unref(formatDate))(vueExports.unref(activeContract).ends_at) : "Không thời hạn"), 1),
                      vueExports.unref(activeContract).activated_at ? (vueExports.openBlock(), vueExports.createBlock("p", {
                        key: 0,
                        class: "text-xs text-slate-400 mt-1"
                      }, " Kích hoạt lúc " + vueExports.toDisplayString(("formatDateTime" in _ctx ? _ctx.formatDateTime : vueExports.unref(formatDateTime))(vueExports.unref(activeContract).activated_at)), 1)) : vueExports.createCommentVNode("", true)
                    ]),
                    vueExports.createVNode(_component_UIcon, {
                      name: "i-lucide-chevron-right",
                      class: "text-slate-400 mt-1 shrink-0"
                    })
                  ], 8, ["onClick"])
                ];
              }
            }),
            _: 1
          }, _parent));
        } else {
          _push(`<!---->`);
        }
        if (vueExports.unref(draftContracts).length > 0) {
          _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_SharedSectionCard, {
            title: `Bản nháp (${vueExports.unref(draftContracts).length})`
          }, {
            default: vueExports.withCtx((_, _push2, _parent2, _scopeId) => {
              if (_push2) {
                _push2(`<div class="space-y-3"${_scopeId}><!--[-->`);
                serverRenderer_cjs_prodExports.ssrRenderList(vueExports.unref(draftContracts), (item) => {
                  _push2(`<button type="button" class="w-full text-left border border-slate-200 rounded-lg p-4 flex flex-wrap items-start justify-between gap-3 hover:border-primary-300 hover:bg-primary-50/30 transition"${_scopeId}><div class="min-w-0 flex-1"${_scopeId}><div class="flex items-center gap-2 flex-wrap mb-1"${_scopeId}><span class="font-mono font-semibold text-slate-900"${_scopeId}>${serverRenderer_cjs_prodExports.ssrInterpolate(item.contract_code ?? "Chưa có mã")}</span>`);
                  _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_PartnerCommissionContractStatusBadge, {
                    status: item.status
                  }, null, _parent2, _scopeId));
                  _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_PartnerCommissionContractModeBadge, {
                    mode: item.commission_mode
                  }, null, _parent2, _scopeId));
                  _push2(`</div><p class="text-xs text-slate-500"${_scopeId}> Hiệu lực: ${serverRenderer_cjs_prodExports.ssrInterpolate(item.starts_at ? ("formatDate" in _ctx ? _ctx.formatDate : vueExports.unref(formatDate))(item.starts_at) : "—")} → ${serverRenderer_cjs_prodExports.ssrInterpolate(item.ends_at ? ("formatDate" in _ctx ? _ctx.formatDate : vueExports.unref(formatDate))(item.ends_at) : "Không thời hạn")}</p></div>`);
                  _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UIcon, {
                    name: "i-lucide-chevron-right",
                    class: "text-slate-400 mt-1 shrink-0"
                  }, null, _parent2, _scopeId));
                  _push2(`</button>`);
                });
                _push2(`<!--]--></div>`);
              } else {
                return [
                  vueExports.createVNode("div", { class: "space-y-3" }, [
                    (vueExports.openBlock(true), vueExports.createBlock(vueExports.Fragment, null, vueExports.renderList(vueExports.unref(draftContracts), (item) => {
                      return vueExports.openBlock(), vueExports.createBlock("button", {
                        key: item.id,
                        type: "button",
                        class: "w-full text-left border border-slate-200 rounded-lg p-4 flex flex-wrap items-start justify-between gap-3 hover:border-primary-300 hover:bg-primary-50/30 transition",
                        onClick: ($event) => openDetail(item.id)
                      }, [
                        vueExports.createVNode("div", { class: "min-w-0 flex-1" }, [
                          vueExports.createVNode("div", { class: "flex items-center gap-2 flex-wrap mb-1" }, [
                            vueExports.createVNode("span", { class: "font-mono font-semibold text-slate-900" }, vueExports.toDisplayString(item.contract_code ?? "Chưa có mã"), 1),
                            vueExports.createVNode(_component_PartnerCommissionContractStatusBadge, {
                              status: item.status
                            }, null, 8, ["status"]),
                            vueExports.createVNode(_component_PartnerCommissionContractModeBadge, {
                              mode: item.commission_mode
                            }, null, 8, ["mode"])
                          ]),
                          vueExports.createVNode("p", { class: "text-xs text-slate-500" }, " Hiệu lực: " + vueExports.toDisplayString(item.starts_at ? ("formatDate" in _ctx ? _ctx.formatDate : vueExports.unref(formatDate))(item.starts_at) : "—") + " → " + vueExports.toDisplayString(item.ends_at ? ("formatDate" in _ctx ? _ctx.formatDate : vueExports.unref(formatDate))(item.ends_at) : "Không thời hạn"), 1)
                        ]),
                        vueExports.createVNode(_component_UIcon, {
                          name: "i-lucide-chevron-right",
                          class: "text-slate-400 mt-1 shrink-0"
                        })
                      ], 8, ["onClick"]);
                    }), 128))
                  ])
                ];
              }
            }),
            _: 1
          }, _parent));
        } else {
          _push(`<!---->`);
        }
        if (vueExports.unref(pendingContracts).length > 0) {
          _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_SharedSectionCard, {
            title: `Hợp đồng chờ kích hoạt (${vueExports.unref(pendingContracts).length})`
          }, {
            default: vueExports.withCtx((_, _push2, _parent2, _scopeId) => {
              if (_push2) {
                _push2(`<div class="space-y-3"${_scopeId}><!--[-->`);
                serverRenderer_cjs_prodExports.ssrRenderList(vueExports.unref(pendingContracts), (item) => {
                  _push2(`<button type="button" class="w-full text-left border border-amber-200 bg-amber-50/50 rounded-lg p-4 flex flex-wrap items-start justify-between gap-3 hover:border-amber-300 transition"${_scopeId}><div class="min-w-0 flex-1"${_scopeId}><div class="flex items-center gap-2 flex-wrap mb-1"${_scopeId}><span class="font-mono font-semibold text-slate-900"${_scopeId}>${serverRenderer_cjs_prodExports.ssrInterpolate(item.contract_code)}</span>`);
                  _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_PartnerCommissionContractStatusBadge, {
                    status: item.status
                  }, null, _parent2, _scopeId));
                  _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_PartnerCommissionContractModeBadge, {
                    mode: item.commission_mode
                  }, null, _parent2, _scopeId));
                  _push2(`</div><p class="text-xs text-slate-500"${_scopeId}> Hiệu lực: ${serverRenderer_cjs_prodExports.ssrInterpolate(item.starts_at ? ("formatDate" in _ctx ? _ctx.formatDate : vueExports.unref(formatDate))(item.starts_at) : "—")} → ${serverRenderer_cjs_prodExports.ssrInterpolate(item.ends_at ? ("formatDate" in _ctx ? _ctx.formatDate : vueExports.unref(formatDate))(item.ends_at) : "Không thời hạn")}</p></div>`);
                  _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UIcon, {
                    name: "i-lucide-chevron-right",
                    class: "text-slate-400 mt-1 shrink-0"
                  }, null, _parent2, _scopeId));
                  _push2(`</button>`);
                });
                _push2(`<!--]--></div>`);
              } else {
                return [
                  vueExports.createVNode("div", { class: "space-y-3" }, [
                    (vueExports.openBlock(true), vueExports.createBlock(vueExports.Fragment, null, vueExports.renderList(vueExports.unref(pendingContracts), (item) => {
                      return vueExports.openBlock(), vueExports.createBlock("button", {
                        key: item.id,
                        type: "button",
                        class: "w-full text-left border border-amber-200 bg-amber-50/50 rounded-lg p-4 flex flex-wrap items-start justify-between gap-3 hover:border-amber-300 transition",
                        onClick: ($event) => openDetail(item.id)
                      }, [
                        vueExports.createVNode("div", { class: "min-w-0 flex-1" }, [
                          vueExports.createVNode("div", { class: "flex items-center gap-2 flex-wrap mb-1" }, [
                            vueExports.createVNode("span", { class: "font-mono font-semibold text-slate-900" }, vueExports.toDisplayString(item.contract_code), 1),
                            vueExports.createVNode(_component_PartnerCommissionContractStatusBadge, {
                              status: item.status
                            }, null, 8, ["status"]),
                            vueExports.createVNode(_component_PartnerCommissionContractModeBadge, {
                              mode: item.commission_mode
                            }, null, 8, ["mode"])
                          ]),
                          vueExports.createVNode("p", { class: "text-xs text-slate-500" }, " Hiệu lực: " + vueExports.toDisplayString(item.starts_at ? ("formatDate" in _ctx ? _ctx.formatDate : vueExports.unref(formatDate))(item.starts_at) : "—") + " → " + vueExports.toDisplayString(item.ends_at ? ("formatDate" in _ctx ? _ctx.formatDate : vueExports.unref(formatDate))(item.ends_at) : "Không thời hạn"), 1)
                        ]),
                        vueExports.createVNode(_component_UIcon, {
                          name: "i-lucide-chevron-right",
                          class: "text-slate-400 mt-1 shrink-0"
                        })
                      ], 8, ["onClick"]);
                    }), 128))
                  ])
                ];
              }
            }),
            _: 1
          }, _parent));
        } else {
          _push(`<!---->`);
        }
        if (vueExports.unref(historyContracts).length > 0) {
          _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_SharedSectionCard, {
            title: "Lịch sử hợp đồng",
            compact: ""
          }, {
            "header-actions": vueExports.withCtx((_, _push2, _parent2, _scopeId) => {
              if (_push2) {
                _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UButton, {
                  icon: vueExports.unref(showHistory) ? "i-lucide-chevron-up" : "i-lucide-chevron-down",
                  label: vueExports.unref(showHistory) ? "Thu gọn" : `Xem ${vueExports.unref(historyContracts).length} mục`,
                  color: "neutral",
                  variant: "ghost",
                  size: "xs",
                  onClick: ($event) => showHistory.value = !vueExports.unref(showHistory)
                }, null, _parent2, _scopeId));
              } else {
                return [
                  vueExports.createVNode(_component_UButton, {
                    icon: vueExports.unref(showHistory) ? "i-lucide-chevron-up" : "i-lucide-chevron-down",
                    label: vueExports.unref(showHistory) ? "Thu gọn" : `Xem ${vueExports.unref(historyContracts).length} mục`,
                    color: "neutral",
                    variant: "ghost",
                    size: "xs",
                    onClick: ($event) => showHistory.value = !vueExports.unref(showHistory)
                  }, null, 8, ["icon", "label", "onClick"])
                ];
              }
            }),
            default: vueExports.withCtx((_, _push2, _parent2, _scopeId) => {
              if (_push2) {
                if (vueExports.unref(showHistory)) {
                  _push2(`<div class="space-y-1"${_scopeId}><!--[-->`);
                  serverRenderer_cjs_prodExports.ssrRenderList(vueExports.unref(historyContracts), (item) => {
                    _push2(`<button type="button" class="w-full flex items-center justify-between gap-3 py-2 px-1 border-b border-slate-100 last:border-0 text-sm hover:bg-slate-50 rounded transition text-left"${_scopeId}><div class="flex items-center gap-2 min-w-0 flex-1"${_scopeId}><span class="font-mono font-medium text-slate-700"${_scopeId}>${serverRenderer_cjs_prodExports.ssrInterpolate(item.contract_code)}</span>`);
                    _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_PartnerCommissionContractStatusBadge, {
                      status: item.status
                    }, null, _parent2, _scopeId));
                    _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_PartnerCommissionContractModeBadge, {
                      mode: item.commission_mode
                    }, null, _parent2, _scopeId));
                    _push2(`</div><span class="text-xs text-slate-500 shrink-0"${_scopeId}>${serverRenderer_cjs_prodExports.ssrInterpolate(item.activated_at ? ("formatDate" in _ctx ? _ctx.formatDate : vueExports.unref(formatDate))(item.activated_at) : item.signed_at ? ("formatDate" in _ctx ? _ctx.formatDate : vueExports.unref(formatDate))(item.signed_at) : "—")}</span></button>`);
                  });
                  _push2(`<!--]--></div>`);
                } else {
                  _push2(`<!---->`);
                }
              } else {
                return [
                  vueExports.unref(showHistory) ? (vueExports.openBlock(), vueExports.createBlock("div", {
                    key: 0,
                    class: "space-y-1"
                  }, [
                    (vueExports.openBlock(true), vueExports.createBlock(vueExports.Fragment, null, vueExports.renderList(vueExports.unref(historyContracts), (item) => {
                      return vueExports.openBlock(), vueExports.createBlock("button", {
                        key: item.id,
                        type: "button",
                        class: "w-full flex items-center justify-between gap-3 py-2 px-1 border-b border-slate-100 last:border-0 text-sm hover:bg-slate-50 rounded transition text-left",
                        onClick: ($event) => openDetail(item.id)
                      }, [
                        vueExports.createVNode("div", { class: "flex items-center gap-2 min-w-0 flex-1" }, [
                          vueExports.createVNode("span", { class: "font-mono font-medium text-slate-700" }, vueExports.toDisplayString(item.contract_code), 1),
                          vueExports.createVNode(_component_PartnerCommissionContractStatusBadge, {
                            status: item.status
                          }, null, 8, ["status"]),
                          vueExports.createVNode(_component_PartnerCommissionContractModeBadge, {
                            mode: item.commission_mode
                          }, null, 8, ["mode"])
                        ]),
                        vueExports.createVNode("span", { class: "text-xs text-slate-500 shrink-0" }, vueExports.toDisplayString(item.activated_at ? ("formatDate" in _ctx ? _ctx.formatDate : vueExports.unref(formatDate))(item.activated_at) : item.signed_at ? ("formatDate" in _ctx ? _ctx.formatDate : vueExports.unref(formatDate))(item.signed_at) : "—"), 1)
                      ], 8, ["onClick"]);
                    }), 128))
                  ])) : vueExports.createCommentVNode("", true)
                ];
              }
            }),
            _: 1
          }, _parent));
        } else {
          _push(`<!---->`);
        }
        _push(`</div></div>`);
      }
      _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_PartnerCommissionContractDetailDrawer, {
        open: vueExports.unref(detailDrawerOpen),
        "onUpdate:open": ($event) => vueExports.isRef(detailDrawerOpen) ? detailDrawerOpen.value = $event : null,
        "contract-id": vueExports.unref(selectedContractId),
        onChanged: reloadAll,
        onEdit: openEdit
      }, null, _parent));
      if (vueExports.unref(selectedProjectId)) {
        _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_PartnerCommissionContractFormDrawer, {
          open: vueExports.unref(formDrawerOpen),
          "onUpdate:open": ($event) => vueExports.isRef(formDrawerOpen) ? formDrawerOpen.value = $event : null,
          "partner-id": props.partnerId,
          "project-id": vueExports.unref(selectedProjectId),
          contract: vueExports.unref(editContract),
          onSaved: reloadAll
        }, null, _parent));
      } else {
        _push(`<!---->`);
      }
      _push(`</div>`);
    };
  }
});
const _sfc_setup$3 = _sfc_main$3.setup;
_sfc_main$3.setup = (props, ctx) => {
  const ssrContext = vueExports.useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/partner-commission-contract/TenantContractsPanel.vue");
  return _sfc_setup$3 ? _sfc_setup$3(props, ctx) : void 0;
};
const __nuxt_component_5 = Object.assign(_sfc_main$3, { __name: "PartnerCommissionContractTenantContractsPanel" });
const _sfc_main$2 = /* @__PURE__ */ vueExports.defineComponent({
  __name: "OrdersPanel",
  __ssrInlineRender: true,
  props: {
    partnerId: {}
  },
  setup(__props) {
    const props = __props;
    function defaultRange() {
      const to = /* @__PURE__ */ new Date();
      const from = /* @__PURE__ */ new Date();
      from.setDate(from.getDate() - 30);
      return {
        from: from.toISOString().slice(0, 10),
        to: to.toISOString().slice(0, 10)
      };
    }
    const range = vueExports.reactive(defaultRange());
    const projectFilter = vueExports.ref(void 0);
    const searchValue = vueExports.ref("");
    const page = vueExports.ref(1);
    const { searchInput, onSearch } = useTableSearch((v) => {
      searchValue.value = v ?? "";
      page.value = 1;
    });
    const { data: projectsData } = useProjectList(
      vueExports.computed(() => ({ per_page: SELECT_ALL_PER_PAGE }))
    );
    const projectOptions = vueExports.computed(() => [
      { label: "Tất cả dự án", value: void 0 },
      ...(projectsData.value?.data ?? []).map((p) => ({ label: p.name, value: p.id }))
    ]);
    const { data: summaryData, status: summaryStatus, refresh: refreshSummary } = useVendorOrderSummary(
      () => props.partnerId,
      vueExports.computed(() => ({ from: range.from, to: range.to }))
    );
    const listParams = vueExports.computed(() => ({
      from: range.from,
      to: range.to,
      project_id: projectFilter.value,
      search: searchValue.value || void 0,
      page: page.value,
      per_page: 20
    }));
    const { data: listData, status: listStatus, error: listError, refresh: refreshList } = useVendorOrderList(
      () => props.partnerId,
      listParams
    );
    const orders = vueExports.computed(() => listData.value?.data ?? []);
    vueExports.watch([() => range.from, () => range.to, projectFilter], async () => {
      page.value = 1;
      await Promise.all([refreshList(), refreshSummary()]);
    });
    const drawerOpen = vueExports.ref(false);
    const selectedOrderId = vueExports.ref(null);
    function openDrawer(id) {
      selectedOrderId.value = id;
      drawerOpen.value = true;
    }
    const columns = [
      { accessorKey: "code", header: "Mã đơn" },
      { id: "customer", header: "Khách hàng" },
      { id: "project", header: "Dự án" },
      { id: "products", header: "Sản phẩm" },
      { accessorKey: "total", header: "Tổng tiền" },
      { id: "commission", header: "Hoa hồng PMC" },
      { accessorKey: "completed_at", header: "Hoàn thành" }
    ];
    return (_ctx, _push, _parent, _attrs) => {
      const _component_VendorOrderSummaryCard = __nuxt_component_0;
      const _component_UInput = _sfc_main$8;
      const _component_USelect = _sfc_main$9;
      const _component_UAlert = _sfc_main$5;
      const _component_UTable = _sfc_main$a;
      const _component_NuxtLink = __nuxt_component_0$4;
      const _component_SharedCrudTablePagination = __nuxt_component_10$1;
      const _component_VendorOrderDetailDrawer = __nuxt_component_7$1;
      _push(`<div${serverRenderer_cjs_prodExports.ssrRenderAttrs(vueExports.mergeProps({ class: "space-y-4" }, _attrs))}>`);
      _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_VendorOrderSummaryCard, {
        summary: vueExports.unref(summaryData)?.data ?? null,
        loading: vueExports.unref(summaryStatus) === "pending"
      }, null, _parent));
      _push(`<div class="bg-white border border-slate-200 rounded-xl p-3 flex items-center gap-3 flex-wrap shadow-sm"><div class="flex items-center gap-2"><span class="text-sm text-slate-600">Từ</span>`);
      _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UInput, {
        modelValue: vueExports.unref(range).from,
        "onUpdate:modelValue": ($event) => vueExports.unref(range).from = $event,
        type: "date"
      }, null, _parent));
      _push(`<span class="text-sm text-slate-600">đến</span>`);
      _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UInput, {
        modelValue: vueExports.unref(range).to,
        "onUpdate:modelValue": ($event) => vueExports.unref(range).to = $event,
        type: "date"
      }, null, _parent));
      _push(`</div>`);
      _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_USelect, {
        modelValue: vueExports.unref(projectFilter),
        "onUpdate:modelValue": ($event) => vueExports.isRef(projectFilter) ? projectFilter.value = $event : null,
        items: vueExports.unref(projectOptions),
        "value-key": "value",
        class: "min-w-[180px]"
      }, null, _parent));
      _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UInput, {
        modelValue: vueExports.unref(searchInput),
        "onUpdate:modelValue": [($event) => vueExports.isRef(searchInput) ? searchInput.value = $event : null, vueExports.unref(onSearch)],
        icon: "i-lucide-search",
        placeholder: "Tìm mã đơn...",
        class: "max-w-xs"
      }, null, _parent));
      _push(`</div>`);
      if (vueExports.unref(listError)) {
        _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UAlert, {
          icon: "i-lucide-alert-circle",
          color: "error",
          variant: "subtle",
          description: "Không thể tải danh sách đơn hàng."
        }, null, _parent));
      } else {
        _push(`<!---->`);
      }
      _push(`<div class="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">`);
      _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UTable, {
        data: vueExports.unref(orders),
        columns,
        loading: vueExports.unref(listStatus) === "pending"
      }, {
        "code-cell": vueExports.withCtx(({ row }, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<button type="button" class="font-mono font-semibold text-primary-700 hover:underline"${_scopeId}>${serverRenderer_cjs_prodExports.ssrInterpolate(row.original.code)}</button>`);
          } else {
            return [
              vueExports.createVNode("button", {
                type: "button",
                class: "font-mono font-semibold text-primary-700 hover:underline",
                onClick: ($event) => openDrawer(row.original.id)
              }, vueExports.toDisplayString(row.original.code), 9, ["onClick"])
            ];
          }
        }),
        "customer-cell": vueExports.withCtx(({ row }, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div${_scopeId}><p class="font-medium text-slate-900"${_scopeId}>${serverRenderer_cjs_prodExports.ssrInterpolate(row.original.customer?.name ?? "—")}</p>`);
            if (row.original.customer?.phone) {
              _push2(`<p class="text-xs text-slate-500 font-mono"${_scopeId}>${serverRenderer_cjs_prodExports.ssrInterpolate(row.original.customer.phone)}</p>`);
            } else {
              _push2(`<!---->`);
            }
            _push2(`</div>`);
          } else {
            return [
              vueExports.createVNode("div", null, [
                vueExports.createVNode("p", { class: "font-medium text-slate-900" }, vueExports.toDisplayString(row.original.customer?.name ?? "—"), 1),
                row.original.customer?.phone ? (vueExports.openBlock(), vueExports.createBlock("p", {
                  key: 0,
                  class: "text-xs text-slate-500 font-mono"
                }, vueExports.toDisplayString(row.original.customer.phone), 1)) : vueExports.createCommentVNode("", true)
              ])
            ];
          }
        }),
        "project-cell": vueExports.withCtx(({ row }, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<span class="text-sm"${_scopeId}>${serverRenderer_cjs_prodExports.ssrInterpolate(row.original.project_name)}</span>`);
          } else {
            return [
              vueExports.createVNode("span", { class: "text-sm" }, vueExports.toDisplayString(row.original.project_name), 1)
            ];
          }
        }),
        "products-cell": vueExports.withCtx(({ row }, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="text-sm"${_scopeId}><p class="line-clamp-1"${_scopeId}>${serverRenderer_cjs_prodExports.ssrInterpolate(row.original.first_item_name ?? "—")}</p>`);
            if (row.original.items_count > 1) {
              _push2(`<p class="text-xs text-slate-500"${_scopeId}> (+${serverRenderer_cjs_prodExports.ssrInterpolate(row.original.items_count - 1)} sản phẩm khác) </p>`);
            } else {
              _push2(`<!---->`);
            }
            _push2(`</div>`);
          } else {
            return [
              vueExports.createVNode("div", { class: "text-sm" }, [
                vueExports.createVNode("p", { class: "line-clamp-1" }, vueExports.toDisplayString(row.original.first_item_name ?? "—"), 1),
                row.original.items_count > 1 ? (vueExports.openBlock(), vueExports.createBlock("p", {
                  key: 0,
                  class: "text-xs text-slate-500"
                }, " (+" + vueExports.toDisplayString(row.original.items_count - 1) + " sản phẩm khác) ", 1)) : vueExports.createCommentVNode("", true)
              ])
            ];
          }
        }),
        "total-cell": vueExports.withCtx(({ row }, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<span class="font-medium"${_scopeId}>${serverRenderer_cjs_prodExports.ssrInterpolate(("formatCurrency" in _ctx ? _ctx.formatCurrency : vueExports.unref(formatCurrency))(row.original.total))}</span>`);
          } else {
            return [
              vueExports.createVNode("span", { class: "font-medium" }, vueExports.toDisplayString(("formatCurrency" in _ctx ? _ctx.formatCurrency : vueExports.unref(formatCurrency))(row.original.total)), 1)
            ];
          }
        }),
        "commission-cell": vueExports.withCtx(({ row }, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="flex flex-col gap-0.5"${_scopeId}><span class="font-semibold text-primary-700"${_scopeId}>${serverRenderer_cjs_prodExports.ssrInterpolate(("formatCurrency" in _ctx ? _ctx.formatCurrency : vueExports.unref(formatCurrency))(row.original.commission.amount))}</span>`);
            if (row.original.commission.contract_id) {
              _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_NuxtLink, {
                to: ("tenantContractLocation" in _ctx ? _ctx.tenantContractLocation : vueExports.unref(tenantContractLocation))(props.partnerId, row.original.project_id, row.original.commission.contract_id),
                class: "font-mono text-xs text-slate-500 hover:text-primary-700 hover:underline",
                onClick: () => {
                }
              }, {
                default: vueExports.withCtx((_, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    _push3(`${serverRenderer_cjs_prodExports.ssrInterpolate(row.original.commission.contract_code)}`);
                  } else {
                    return [
                      vueExports.createTextVNode(vueExports.toDisplayString(row.original.commission.contract_code), 1)
                    ];
                  }
                }),
                _: 2
              }, _parent2, _scopeId));
            } else if (row.original.commission.source === "default") {
              _push2(`<span class="text-[11px] text-slate-400"${_scopeId}>Mặc định</span>`);
            } else {
              _push2(`<!---->`);
            }
            _push2(`</div>`);
          } else {
            return [
              vueExports.createVNode("div", { class: "flex flex-col gap-0.5" }, [
                vueExports.createVNode("span", { class: "font-semibold text-primary-700" }, vueExports.toDisplayString(("formatCurrency" in _ctx ? _ctx.formatCurrency : vueExports.unref(formatCurrency))(row.original.commission.amount)), 1),
                row.original.commission.contract_id ? (vueExports.openBlock(), vueExports.createBlock(_component_NuxtLink, {
                  key: 0,
                  to: ("tenantContractLocation" in _ctx ? _ctx.tenantContractLocation : vueExports.unref(tenantContractLocation))(props.partnerId, row.original.project_id, row.original.commission.contract_id),
                  class: "font-mono text-xs text-slate-500 hover:text-primary-700 hover:underline",
                  onClick: vueExports.withModifiers(() => {
                  }, ["stop"])
                }, {
                  default: vueExports.withCtx(() => [
                    vueExports.createTextVNode(vueExports.toDisplayString(row.original.commission.contract_code), 1)
                  ]),
                  _: 2
                }, 1032, ["to", "onClick"])) : row.original.commission.source === "default" ? (vueExports.openBlock(), vueExports.createBlock("span", {
                  key: 1,
                  class: "text-[11px] text-slate-400"
                }, "Mặc định")) : vueExports.createCommentVNode("", true)
              ])
            ];
          }
        }),
        "completed_at-cell": vueExports.withCtx(({ row }, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<span class="text-sm"${_scopeId}>${serverRenderer_cjs_prodExports.ssrInterpolate(row.original.completed_at ? ("formatDateTime" in _ctx ? _ctx.formatDateTime : vueExports.unref(formatDateTime))(row.original.completed_at) : "—")}</span>`);
          } else {
            return [
              vueExports.createVNode("span", { class: "text-sm" }, vueExports.toDisplayString(row.original.completed_at ? ("formatDateTime" in _ctx ? _ctx.formatDateTime : vueExports.unref(formatDateTime))(row.original.completed_at) : "—"), 1)
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_SharedCrudTablePagination, {
        page: vueExports.unref(page),
        "onUpdate:page": ($event) => vueExports.isRef(page) ? page.value = $event : null,
        meta: vueExports.unref(listData)?.meta
      }, null, _parent));
      _push(`</div>`);
      _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_VendorOrderDetailDrawer, {
        open: vueExports.unref(drawerOpen),
        "onUpdate:open": ($event) => vueExports.isRef(drawerOpen) ? drawerOpen.value = $event : null,
        "partner-id": props.partnerId,
        "order-id": vueExports.unref(selectedOrderId)
      }, null, _parent));
      _push(`</div>`);
    };
  }
});
const _sfc_setup$2 = _sfc_main$2.setup;
_sfc_main$2.setup = (props, ctx) => {
  const ssrContext = vueExports.useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/vendor-order/OrdersPanel.vue");
  return _sfc_setup$2 ? _sfc_setup$2(props, ctx) : void 0;
};
const __nuxt_component_6 = Object.assign(_sfc_main$2, { __name: "VendorOrderOrdersPanel" });
const _sfc_main$1 = /* @__PURE__ */ vueExports.defineComponent({
  __name: "VendorProjectsCard",
  __ssrInlineRender: true,
  props: {
    vendor: {}
  },
  emits: ["changed"],
  setup(__props, { emit: __emit }) {
    const props = __props;
    const emit = __emit;
    const toast = useToast();
    const { data: projectsData, status: projectsStatus } = useProjectList(
      vueExports.computed(() => ({ per_page: SELECT_ALL_PER_PAGE }))
    );
    const projectsById = vueExports.computed(() => {
      const map = /* @__PURE__ */ new Map();
      for (const p of projectsData.value?.data ?? []) {
        map.set(p.id, p.name);
      }
      return map;
    });
    const servedProjects = vueExports.computed(
      () => (props.vendor.project_ids ?? []).map((id) => ({
        id,
        name: projectsById.value.get(id) ?? `#${id}`
      }))
    );
    const addableOptions = vueExports.computed(() => {
      const served = new Set(props.vendor.project_ids ?? []);
      return (projectsData.value?.data ?? []).filter((p) => !served.has(p.id)).map((p) => ({ label: p.name, value: p.id }));
    });
    const addOpen = vueExports.ref(false);
    const addProjectIds = vueExports.ref([]);
    const isAttaching = vueExports.ref(false);
    function openAdd() {
      addProjectIds.value = [];
      addOpen.value = true;
    }
    async function confirmAdd() {
      if (addProjectIds.value.length === 0) return;
      isAttaching.value = true;
      try {
        await apiAttachTenantPartner(props.vendor.id, [...addProjectIds.value]);
        toast.add({ title: "Đã thêm dự án cho vendor", color: "success", icon: "i-lucide-check-circle" });
        addOpen.value = false;
        emit("changed");
      } catch (err) {
        toast.add({
          title: getApiErrorMessage(err, "Thêm dự án thất bại"),
          color: "error",
          icon: "i-lucide-alert-circle"
        });
      } finally {
        isAttaching.value = false;
      }
    }
    const detachingId = vueExports.ref(null);
    async function removeProject(projectId) {
      detachingId.value = projectId;
      try {
        await apiDetachTenantPartner(props.vendor.id, [projectId]);
        toast.add({ title: "Đã gỡ vendor khỏi dự án", color: "success", icon: "i-lucide-check-circle" });
        emit("changed");
      } catch (err) {
        const apiErr = err;
        if (apiErr?.data?.error_code === "PARTNER_HAS_ACTIVE_CONTRACT") {
          toast.add({
            title: "Không thể gỡ — vendor còn hợp đồng hoa hồng đang hiệu lực",
            description: "Vui lòng huỷ hợp đồng hoa hồng của dự án này trước khi gỡ vendor.",
            color: "warning",
            icon: "i-lucide-shield-alert"
          });
        } else {
          toast.add({
            title: getApiErrorMessage(err, "Gỡ vendor khỏi dự án thất bại"),
            color: "error",
            icon: "i-lucide-alert-circle"
          });
        }
      } finally {
        detachingId.value = null;
      }
    }
    return (_ctx, _push, _parent, _attrs) => {
      const _component_SharedSectionCard = __nuxt_component_4;
      const _component_UButton = _sfc_main$c;
      const _component_UBadge = _sfc_main$6;
      const _component_UIcon = _sfc_main$h;
      const _component_UModal = _sfc_main$b;
      const _component_UFormField = _sfc_main$d;
      const _component_USelectMenu = _sfc_main$e;
      _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_SharedSectionCard, vueExports.mergeProps({ title: "Dự án phục vụ" }, _attrs), {
        "header-actions": vueExports.withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UButton, {
              icon: "i-lucide-plus",
              label: "Thêm dự án",
              color: "primary",
              variant: "soft",
              size: "xs",
              disabled: vueExports.unref(addableOptions).length === 0,
              onClick: openAdd
            }, null, _parent2, _scopeId));
          } else {
            return [
              vueExports.createVNode(_component_UButton, {
                icon: "i-lucide-plus",
                label: "Thêm dự án",
                color: "primary",
                variant: "soft",
                size: "xs",
                disabled: vueExports.unref(addableOptions).length === 0,
                onClick: openAdd
              }, null, 8, ["disabled"])
            ];
          }
        }),
        default: vueExports.withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            if (vueExports.unref(servedProjects).length) {
              _push2(`<div class="flex flex-wrap gap-2"${_scopeId}><!--[-->`);
              serverRenderer_cjs_prodExports.ssrRenderList(vueExports.unref(servedProjects), (p) => {
                _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UBadge, {
                  key: p.id,
                  color: "info",
                  variant: "subtle",
                  class: "gap-1 pr-1"
                }, {
                  default: vueExports.withCtx((_2, _push3, _parent3, _scopeId2) => {
                    if (_push3) {
                      _push3(`${serverRenderer_cjs_prodExports.ssrInterpolate(p.name)} <button type="button" class="ml-1 rounded hover:bg-black/10 p-0.5 disabled:opacity-50"${serverRenderer_cjs_prodExports.ssrIncludeBooleanAttr(vueExports.unref(detachingId) === p.id) ? " disabled" : ""} aria-label="Gỡ dự án"${_scopeId2}>`);
                      _push3(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UIcon, {
                        name: vueExports.unref(detachingId) === p.id ? "i-lucide-loader-circle" : "i-lucide-x",
                        class: ["size-3", vueExports.unref(detachingId) === p.id && "animate-spin"]
                      }, null, _parent3, _scopeId2));
                      _push3(`</button>`);
                    } else {
                      return [
                        vueExports.createTextVNode(vueExports.toDisplayString(p.name) + " ", 1),
                        vueExports.createVNode("button", {
                          type: "button",
                          class: "ml-1 rounded hover:bg-black/10 p-0.5 disabled:opacity-50",
                          disabled: vueExports.unref(detachingId) === p.id,
                          "aria-label": "Gỡ dự án",
                          onClick: ($event) => removeProject(p.id)
                        }, [
                          vueExports.createVNode(_component_UIcon, {
                            name: vueExports.unref(detachingId) === p.id ? "i-lucide-loader-circle" : "i-lucide-x",
                            class: ["size-3", vueExports.unref(detachingId) === p.id && "animate-spin"]
                          }, null, 8, ["name", "class"])
                        ], 8, ["disabled", "onClick"])
                      ];
                    }
                  }),
                  _: 2
                }, _parent2, _scopeId));
              });
              _push2(`<!--]--></div>`);
            } else {
              _push2(`<p class="text-sm text-slate-500"${_scopeId}> Vendor chưa được gán cho dự án nào. Bấm &quot;Thêm dự án&quot; để liên kết. </p>`);
            }
            _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UModal, {
              open: vueExports.unref(addOpen),
              "onUpdate:open": ($event) => vueExports.isRef(addOpen) ? addOpen.value = $event : null,
              title: "Thêm dự án cho vendor"
            }, {
              body: vueExports.withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UFormField, {
                    label: "Dự án",
                    required: ""
                  }, {
                    default: vueExports.withCtx((_3, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_USelectMenu, {
                          modelValue: vueExports.unref(addProjectIds),
                          "onUpdate:modelValue": ($event) => vueExports.isRef(addProjectIds) ? addProjectIds.value = $event : null,
                          items: vueExports.unref(addableOptions),
                          "value-key": "value",
                          multiple: "",
                          searchable: "",
                          loading: vueExports.unref(projectsStatus) === "pending",
                          placeholder: "Chọn dự án...",
                          class: "w-full"
                        }, null, _parent4, _scopeId3));
                      } else {
                        return [
                          vueExports.createVNode(_component_USelectMenu, {
                            modelValue: vueExports.unref(addProjectIds),
                            "onUpdate:modelValue": ($event) => vueExports.isRef(addProjectIds) ? addProjectIds.value = $event : null,
                            items: vueExports.unref(addableOptions),
                            "value-key": "value",
                            multiple: "",
                            searchable: "",
                            loading: vueExports.unref(projectsStatus) === "pending",
                            placeholder: "Chọn dự án...",
                            class: "w-full"
                          }, null, 8, ["modelValue", "onUpdate:modelValue", "items", "loading"])
                        ];
                      }
                    }),
                    _: 1
                  }, _parent3, _scopeId2));
                } else {
                  return [
                    vueExports.createVNode(_component_UFormField, {
                      label: "Dự án",
                      required: ""
                    }, {
                      default: vueExports.withCtx(() => [
                        vueExports.createVNode(_component_USelectMenu, {
                          modelValue: vueExports.unref(addProjectIds),
                          "onUpdate:modelValue": ($event) => vueExports.isRef(addProjectIds) ? addProjectIds.value = $event : null,
                          items: vueExports.unref(addableOptions),
                          "value-key": "value",
                          multiple: "",
                          searchable: "",
                          loading: vueExports.unref(projectsStatus) === "pending",
                          placeholder: "Chọn dự án...",
                          class: "w-full"
                        }, null, 8, ["modelValue", "onUpdate:modelValue", "items", "loading"])
                      ]),
                      _: 1
                    })
                  ];
                }
              }),
              footer: vueExports.withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(`<div class="flex justify-end gap-2 w-full"${_scopeId2}>`);
                  _push3(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UButton, {
                    label: "Huỷ",
                    color: "neutral",
                    variant: "ghost",
                    disabled: vueExports.unref(isAttaching),
                    onClick: ($event) => addOpen.value = false
                  }, null, _parent3, _scopeId2));
                  _push3(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UButton, {
                    label: "Thêm",
                    icon: "i-lucide-check",
                    color: "primary",
                    loading: vueExports.unref(isAttaching),
                    disabled: vueExports.unref(addProjectIds).length === 0,
                    onClick: confirmAdd
                  }, null, _parent3, _scopeId2));
                  _push3(`</div>`);
                } else {
                  return [
                    vueExports.createVNode("div", { class: "flex justify-end gap-2 w-full" }, [
                      vueExports.createVNode(_component_UButton, {
                        label: "Huỷ",
                        color: "neutral",
                        variant: "ghost",
                        disabled: vueExports.unref(isAttaching),
                        onClick: ($event) => addOpen.value = false
                      }, null, 8, ["disabled", "onClick"]),
                      vueExports.createVNode(_component_UButton, {
                        label: "Thêm",
                        icon: "i-lucide-check",
                        color: "primary",
                        loading: vueExports.unref(isAttaching),
                        disabled: vueExports.unref(addProjectIds).length === 0,
                        onClick: confirmAdd
                      }, null, 8, ["loading", "disabled"])
                    ])
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
          } else {
            return [
              vueExports.unref(servedProjects).length ? (vueExports.openBlock(), vueExports.createBlock("div", {
                key: 0,
                class: "flex flex-wrap gap-2"
              }, [
                (vueExports.openBlock(true), vueExports.createBlock(vueExports.Fragment, null, vueExports.renderList(vueExports.unref(servedProjects), (p) => {
                  return vueExports.openBlock(), vueExports.createBlock(_component_UBadge, {
                    key: p.id,
                    color: "info",
                    variant: "subtle",
                    class: "gap-1 pr-1"
                  }, {
                    default: vueExports.withCtx(() => [
                      vueExports.createTextVNode(vueExports.toDisplayString(p.name) + " ", 1),
                      vueExports.createVNode("button", {
                        type: "button",
                        class: "ml-1 rounded hover:bg-black/10 p-0.5 disabled:opacity-50",
                        disabled: vueExports.unref(detachingId) === p.id,
                        "aria-label": "Gỡ dự án",
                        onClick: ($event) => removeProject(p.id)
                      }, [
                        vueExports.createVNode(_component_UIcon, {
                          name: vueExports.unref(detachingId) === p.id ? "i-lucide-loader-circle" : "i-lucide-x",
                          class: ["size-3", vueExports.unref(detachingId) === p.id && "animate-spin"]
                        }, null, 8, ["name", "class"])
                      ], 8, ["disabled", "onClick"])
                    ]),
                    _: 2
                  }, 1024);
                }), 128))
              ])) : (vueExports.openBlock(), vueExports.createBlock("p", {
                key: 1,
                class: "text-sm text-slate-500"
              }, ' Vendor chưa được gán cho dự án nào. Bấm "Thêm dự án" để liên kết. ')),
              vueExports.createVNode(_component_UModal, {
                open: vueExports.unref(addOpen),
                "onUpdate:open": ($event) => vueExports.isRef(addOpen) ? addOpen.value = $event : null,
                title: "Thêm dự án cho vendor"
              }, {
                body: vueExports.withCtx(() => [
                  vueExports.createVNode(_component_UFormField, {
                    label: "Dự án",
                    required: ""
                  }, {
                    default: vueExports.withCtx(() => [
                      vueExports.createVNode(_component_USelectMenu, {
                        modelValue: vueExports.unref(addProjectIds),
                        "onUpdate:modelValue": ($event) => vueExports.isRef(addProjectIds) ? addProjectIds.value = $event : null,
                        items: vueExports.unref(addableOptions),
                        "value-key": "value",
                        multiple: "",
                        searchable: "",
                        loading: vueExports.unref(projectsStatus) === "pending",
                        placeholder: "Chọn dự án...",
                        class: "w-full"
                      }, null, 8, ["modelValue", "onUpdate:modelValue", "items", "loading"])
                    ]),
                    _: 1
                  })
                ]),
                footer: vueExports.withCtx(() => [
                  vueExports.createVNode("div", { class: "flex justify-end gap-2 w-full" }, [
                    vueExports.createVNode(_component_UButton, {
                      label: "Huỷ",
                      color: "neutral",
                      variant: "ghost",
                      disabled: vueExports.unref(isAttaching),
                      onClick: ($event) => addOpen.value = false
                    }, null, 8, ["disabled", "onClick"]),
                    vueExports.createVNode(_component_UButton, {
                      label: "Thêm",
                      icon: "i-lucide-check",
                      color: "primary",
                      loading: vueExports.unref(isAttaching),
                      disabled: vueExports.unref(addProjectIds).length === 0,
                      onClick: confirmAdd
                    }, null, 8, ["loading", "disabled"])
                  ])
                ]),
                _: 1
              }, 8, ["open", "onUpdate:open"])
            ];
          }
        }),
        _: 1
      }, _parent));
    };
  }
});
const _sfc_setup$1 = _sfc_main$1.setup;
_sfc_main$1.setup = (props, ctx) => {
  const ssrContext = vueExports.useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/vendor/VendorProjectsCard.vue");
  return _sfc_setup$1 ? _sfc_setup$1(props, ctx) : void 0;
};
const __nuxt_component_10 = Object.assign(_sfc_main$1, { __name: "VendorProjectsCard" });
const _sfc_main = /* @__PURE__ */ vueExports.defineComponent({
  __name: "index",
  __ssrInlineRender: true,
  setup(__props) {
    const route = useRoute$1();
    const router = useRouter();
    const toast = useToast();
    const id = vueExports.computed(() => Number(route.params.id));
    const { data, status, error, refresh } = useTenantPartnerDetail(id);
    const vendor = vueExports.computed(() => data.value?.data ?? null);
    async function refreshVendor() {
      clearTenantPartnerCache(id.value);
      await refresh();
    }
    const { useDynamicLabel } = useBreadcrumb();
    useDynamicLabel(vueExports.computed(() => vendor.value?.display_name ?? vendor.value?.name ?? null));
    useSeoMeta({
      title: vueExports.computed(() => vendor.value ? `${vendor.value.display_name ?? vendor.value.name} - Vendor` : "Chi tiết vendor")
    });
    vueExports.watch(error, (e) => {
      if (!e) return;
      const apiErr = e;
      const status2 = apiErr?.status ?? apiErr?.statusCode;
      if (status2 === 404) {
        toast.add({
          title: "Không tìm thấy vendor",
          description: "Vendor không tồn tại hoặc không thuộc tenant của bạn.",
          color: "error"
        });
        router.replace("/pmc/vendors");
      } else if (status2 === 403 && apiErr?.data?.error_code === "VENDOR_FEATURE_DISABLED") {
        toast.add({
          title: "Tenant chưa kích hoạt gói vendor",
          color: "warning"
        });
        router.replace("/pmc/dashboard");
      }
    });
    const crud = useCrudModals();
    const { showDeleteModal, deleteTarget, openDeleteModal } = crud;
    const { isDeleting, submitDelete } = useCrudSubmit(crud, async () => {
      await refresh();
    });
    function onDeleteClick() {
      if (!vendor.value) return;
      openDeleteModal(vendor.value);
    }
    function handleDelete() {
      submitDelete(
        () => apiDeleteTenantPartner(deleteTarget.value.id),
        {
          message: "Đã xoá vendor.",
          navigateAfter: "/pmc/vendors",
          onError: (err) => {
            const apiErr = err;
            if (apiErr?.data?.error_code === "VENDOR_ALREADY_PROVISIONED") {
              toast.add({
                title: "Không thể xoá vendor đã kích hoạt",
                description: "Vendor đã được kích hoạt. Vui lòng liên hệ Platform admin để xoá.",
                color: "warning",
                icon: "i-lucide-shield-alert"
              });
              showDeleteModal.value = false;
              return true;
            }
            return false;
          }
        }
      );
    }
    function firstChar(name) {
      const trimmed = (name ?? "").trim();
      return trimmed ? trimmed.charAt(0).toUpperCase() : "?";
    }
    function customDomainUrl(domain) {
      return /^https?:\/\//i.test(domain) ? domain : `https://${domain}`;
    }
    const tabItems = [
      { value: "info", label: "Thông tin", icon: "i-lucide-info" },
      { value: "contracts", label: "Hợp đồng hoa hồng", icon: "i-lucide-handshake" },
      { value: "orders", label: "Đơn hàng", icon: "i-lucide-shopping-bag" }
    ];
    const activeTab = vueExports.ref(
      ["contracts", "orders"].includes(route.query.tab) ? route.query.tab : "info"
    );
    vueExports.watch(activeTab, (v) => {
      router.replace({ query: { ...route.query, tab: v === "info" ? void 0 : v } });
    });
    const isProvisioning = vueExports.ref(false);
    async function retryProvision() {
      if (!vendor.value) return;
      isProvisioning.value = true;
      try {
        await apiProvisionTenantPartner(vendor.value.id);
        toast.add({
          title: "Đã kích hoạt shop trên resi_mart",
          color: "success",
          icon: "i-lucide-check-circle"
        });
        await refresh();
      } catch (err) {
        toast.add({
          title: getApiErrorMessage(err, "Kích hoạt shop thất bại — resi_mart không phản hồi"),
          description: "Vui lòng thử lại sau ít phút. Nếu vẫn lỗi, liên hệ Platform admin.",
          color: "error",
          icon: "i-lucide-alert-circle"
        });
      } finally {
        isProvisioning.value = false;
      }
    }
    return (_ctx, _push, _parent, _attrs) => {
      const _component_UAlert = _sfc_main$5;
      const _component_UAvatar = _sfc_main$f;
      const _component_UBadge = _sfc_main$6;
      const _component_UButton = _sfc_main$c;
      const _component_UTabs = _sfc_main$7;
      const _component_PartnerCommissionContractTenantContractsPanel = __nuxt_component_5;
      const _component_VendorOrderOrdersPanel = __nuxt_component_6;
      const _component_SharedSectionCard = __nuxt_component_4;
      const _component_SharedFieldDisplay = __nuxt_component_5$1;
      const _component_UIcon = _sfc_main$h;
      const _component_VendorProjectsCard = __nuxt_component_10;
      const _component_SharedCrudDeleteModal = __nuxt_component_11;
      _push(`<div${serverRenderer_cjs_prodExports.ssrRenderAttrs(_attrs)}>`);
      if (vueExports.unref(status) === "pending" && !vueExports.unref(vendor)) {
        _push(`<div class="flex flex-col gap-4"><div class="h-24 bg-slate-100 rounded-xl animate-pulse"></div><div class="h-48 bg-slate-100 rounded-xl animate-pulse"></div></div>`);
      } else if (vueExports.unref(error) && !vueExports.unref(vendor)) {
        _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UAlert, {
          color: "error",
          variant: "subtle",
          icon: "i-lucide-alert-circle",
          description: "Không tải được thông tin vendor."
        }, null, _parent));
      } else if (vueExports.unref(vendor)) {
        _push(`<div class="flex flex-col gap-6"><div class="bg-white border border-slate-200 rounded-xl shadow-sm p-5"><div class="flex flex-wrap items-start justify-between gap-4"><div class="flex items-start gap-4 min-w-0 flex-1">`);
        _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UAvatar, {
          src: vueExports.unref(vendor).logo_url ?? void 0,
          alt: vueExports.unref(vendor).name,
          text: firstChar(vueExports.unref(vendor).display_name ?? vueExports.unref(vendor).name),
          size: "lg"
        }, null, _parent));
        _push(`<div class="min-w-0"><div class="flex items-center gap-3 flex-wrap"><h1 class="text-xl font-bold text-slate-900">${serverRenderer_cjs_prodExports.ssrInterpolate(vueExports.unref(vendor).display_name ?? vueExports.unref(vendor).name)}</h1>`);
        _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UBadge, {
          color: vueExports.unref(vendor).status.value === "active" ? "success" : vueExports.unref(vendor).status.value === "suspended" ? "warning" : "neutral",
          variant: "subtle",
          label: vueExports.unref(vendor).status.label
        }, null, _parent));
        if (vueExports.unref(vendor).is_provisioned) {
          _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UBadge, {
            color: "success",
            variant: "subtle",
            label: "Đã kích hoạt",
            icon: "i-lucide-check"
          }, null, _parent));
        } else {
          _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UBadge, {
            color: "warning",
            variant: "subtle",
            label: "Chờ provision",
            icon: "i-lucide-clock"
          }, null, _parent));
        }
        _push(`</div><p class="mt-1 text-sm text-slate-500 font-mono">${serverRenderer_cjs_prodExports.ssrInterpolate(vueExports.unref(vendor).slug)}</p></div></div>`);
        if (vueExports.unref(vendor).is_owned) {
          _push(`<div class="flex items-center gap-2 shrink-0">`);
          _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UButton, {
            icon: "i-lucide-pencil",
            label: "Chỉnh sửa",
            variant: "soft",
            color: "primary",
            to: `/pmc/vendors/${vueExports.unref(vendor).id}/edit`
          }, null, _parent));
          if (!vueExports.unref(vendor).is_provisioned) {
            _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UButton, {
              icon: "i-lucide-trash-2",
              variant: "soft",
              color: "error",
              "aria-label": "Xoá vendor",
              onClick: onDeleteClick
            }, null, _parent));
          } else {
            _push(`<!---->`);
          }
          _push(`</div>`);
        } else {
          _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UBadge, {
            color: "neutral",
            variant: "subtle",
            icon: "i-lucide-store",
            label: "Vendor dùng chung",
            class: "shrink-0"
          }, null, _parent));
        }
        _push(`</div></div>`);
        _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UTabs, {
          modelValue: vueExports.unref(activeTab),
          "onUpdate:modelValue": ($event) => vueExports.isRef(activeTab) ? activeTab.value = $event : null,
          items: tabItems,
          variant: "link",
          content: false,
          class: "w-full"
        }, null, _parent));
        if (vueExports.unref(activeTab) === "contracts") {
          _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_PartnerCommissionContractTenantContractsPanel, {
            "partner-id": vueExports.unref(vendor).id,
            "project-ids": vueExports.unref(vendor).project_ids ?? []
          }, null, _parent));
        } else {
          _push(`<!---->`);
        }
        if (vueExports.unref(activeTab) === "orders") {
          _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_VendorOrderOrdersPanel, {
            "partner-id": vueExports.unref(vendor).id
          }, null, _parent));
        } else {
          _push(`<!---->`);
        }
        if (vueExports.unref(activeTab) === "info") {
          _push(`<!--[-->`);
          if (vueExports.unref(vendor).is_owned && !vueExports.unref(vendor).is_provisioned) {
            _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UAlert, {
              color: "warning",
              variant: "subtle",
              icon: "i-lucide-clock",
              title: "Vendor chưa kích hoạt shop trên resi_mart",
              description: "Lần tạo trước, hệ thống không liên hệ được resi_mart. Bạn có thể bấm 'Thử kích hoạt lại'; nếu vẫn lỗi, liên hệ Platform admin."
            }, {
              actions: vueExports.withCtx((_, _push2, _parent2, _scopeId) => {
                if (_push2) {
                  _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UButton, {
                    icon: "i-lucide-rocket",
                    color: "warning",
                    label: "Thử kích hoạt lại",
                    size: "sm",
                    loading: vueExports.unref(isProvisioning),
                    onClick: retryProvision
                  }, null, _parent2, _scopeId));
                } else {
                  return [
                    vueExports.createVNode(_component_UButton, {
                      icon: "i-lucide-rocket",
                      color: "warning",
                      label: "Thử kích hoạt lại",
                      size: "sm",
                      loading: vueExports.unref(isProvisioning),
                      onClick: retryProvision
                    }, null, 8, ["loading"])
                  ];
                }
              }),
              _: 1
            }, _parent));
          } else if (vueExports.unref(vendor).is_provisioned) {
            _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UAlert, {
              color: "info",
              variant: "subtle",
              icon: "i-lucide-info",
              title: "Vendor đã được kích hoạt",
              description: "Vendor đã có shop trên resi_mart. Để xoá vendor, vui lòng liên hệ Platform admin."
            }, null, _parent));
          } else {
            _push(`<!---->`);
          }
          _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_SharedSectionCard, { title: "Thông tin cơ bản" }, {
            default: vueExports.withCtx((_, _push2, _parent2, _scopeId) => {
              if (_push2) {
                _push2(`<div class="grid grid-cols-1 sm:grid-cols-2 gap-5"${_scopeId}>`);
                _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_SharedFieldDisplay, { label: "Tên đầy đủ" }, {
                  default: vueExports.withCtx((_2, _push3, _parent3, _scopeId2) => {
                    if (_push3) {
                      _push3(`<span class="font-medium"${_scopeId2}>${serverRenderer_cjs_prodExports.ssrInterpolate(vueExports.unref(vendor).name)}</span>`);
                    } else {
                      return [
                        vueExports.createVNode("span", { class: "font-medium" }, vueExports.toDisplayString(vueExports.unref(vendor).name), 1)
                      ];
                    }
                  }),
                  _: 1
                }, _parent2, _scopeId));
                _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_SharedFieldDisplay, { label: "Tên hiển thị" }, {
                  default: vueExports.withCtx((_2, _push3, _parent3, _scopeId2) => {
                    if (_push3) {
                      _push3(`${serverRenderer_cjs_prodExports.ssrInterpolate(vueExports.unref(vendor).display_name ?? "—")}`);
                    } else {
                      return [
                        vueExports.createTextVNode(vueExports.toDisplayString(vueExports.unref(vendor).display_name ?? "—"), 1)
                      ];
                    }
                  }),
                  _: 1
                }, _parent2, _scopeId));
                _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_SharedFieldDisplay, { label: "Slug" }, {
                  default: vueExports.withCtx((_2, _push3, _parent3, _scopeId2) => {
                    if (_push3) {
                      _push3(`<span class="font-mono"${_scopeId2}>${serverRenderer_cjs_prodExports.ssrInterpolate(vueExports.unref(vendor).slug)}</span>`);
                    } else {
                      return [
                        vueExports.createVNode("span", { class: "font-mono" }, vueExports.toDisplayString(vueExports.unref(vendor).slug), 1)
                      ];
                    }
                  }),
                  _: 1
                }, _parent2, _scopeId));
                _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_SharedFieldDisplay, { label: "Trạng thái" }, {
                  default: vueExports.withCtx((_2, _push3, _parent3, _scopeId2) => {
                    if (_push3) {
                      _push3(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UBadge, {
                        color: vueExports.unref(vendor).status.value === "active" ? "success" : vueExports.unref(vendor).status.value === "suspended" ? "warning" : "neutral",
                        variant: "subtle",
                        label: vueExports.unref(vendor).status.label,
                        size: "sm"
                      }, null, _parent3, _scopeId2));
                    } else {
                      return [
                        vueExports.createVNode(_component_UBadge, {
                          color: vueExports.unref(vendor).status.value === "active" ? "success" : vueExports.unref(vendor).status.value === "suspended" ? "warning" : "neutral",
                          variant: "subtle",
                          label: vueExports.unref(vendor).status.label,
                          size: "sm"
                        }, null, 8, ["color", "label"])
                      ];
                    }
                  }),
                  _: 1
                }, _parent2, _scopeId));
                _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_SharedFieldDisplay, {
                  label: "Danh mục",
                  class: "sm:col-span-2"
                }, {
                  default: vueExports.withCtx((_2, _push3, _parent3, _scopeId2) => {
                    if (_push3) {
                      if (vueExports.unref(vendor).categories.length) {
                        _push3(`<div class="flex flex-wrap gap-1.5"${_scopeId2}><!--[-->`);
                        serverRenderer_cjs_prodExports.ssrRenderList(vueExports.unref(vendor).categories, (cat) => {
                          _push3(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UBadge, {
                            key: cat,
                            color: "info",
                            variant: "subtle",
                            label: cat,
                            size: "xs"
                          }, null, _parent3, _scopeId2));
                        });
                        _push3(`<!--]--></div>`);
                      } else {
                        _push3(`<span class="text-slate-400"${_scopeId2}>—</span>`);
                      }
                    } else {
                      return [
                        vueExports.unref(vendor).categories.length ? (vueExports.openBlock(), vueExports.createBlock("div", {
                          key: 0,
                          class: "flex flex-wrap gap-1.5"
                        }, [
                          (vueExports.openBlock(true), vueExports.createBlock(vueExports.Fragment, null, vueExports.renderList(vueExports.unref(vendor).categories, (cat) => {
                            return vueExports.openBlock(), vueExports.createBlock(_component_UBadge, {
                              key: cat,
                              color: "info",
                              variant: "subtle",
                              label: cat,
                              size: "xs"
                            }, null, 8, ["label"]);
                          }), 128))
                        ])) : (vueExports.openBlock(), vueExports.createBlock("span", {
                          key: 1,
                          class: "text-slate-400"
                        }, "—"))
                      ];
                    }
                  }),
                  _: 1
                }, _parent2, _scopeId));
                _push2(`</div>`);
              } else {
                return [
                  vueExports.createVNode("div", { class: "grid grid-cols-1 sm:grid-cols-2 gap-5" }, [
                    vueExports.createVNode(_component_SharedFieldDisplay, { label: "Tên đầy đủ" }, {
                      default: vueExports.withCtx(() => [
                        vueExports.createVNode("span", { class: "font-medium" }, vueExports.toDisplayString(vueExports.unref(vendor).name), 1)
                      ]),
                      _: 1
                    }),
                    vueExports.createVNode(_component_SharedFieldDisplay, { label: "Tên hiển thị" }, {
                      default: vueExports.withCtx(() => [
                        vueExports.createTextVNode(vueExports.toDisplayString(vueExports.unref(vendor).display_name ?? "—"), 1)
                      ]),
                      _: 1
                    }),
                    vueExports.createVNode(_component_SharedFieldDisplay, { label: "Slug" }, {
                      default: vueExports.withCtx(() => [
                        vueExports.createVNode("span", { class: "font-mono" }, vueExports.toDisplayString(vueExports.unref(vendor).slug), 1)
                      ]),
                      _: 1
                    }),
                    vueExports.createVNode(_component_SharedFieldDisplay, { label: "Trạng thái" }, {
                      default: vueExports.withCtx(() => [
                        vueExports.createVNode(_component_UBadge, {
                          color: vueExports.unref(vendor).status.value === "active" ? "success" : vueExports.unref(vendor).status.value === "suspended" ? "warning" : "neutral",
                          variant: "subtle",
                          label: vueExports.unref(vendor).status.label,
                          size: "sm"
                        }, null, 8, ["color", "label"])
                      ]),
                      _: 1
                    }),
                    vueExports.createVNode(_component_SharedFieldDisplay, {
                      label: "Danh mục",
                      class: "sm:col-span-2"
                    }, {
                      default: vueExports.withCtx(() => [
                        vueExports.unref(vendor).categories.length ? (vueExports.openBlock(), vueExports.createBlock("div", {
                          key: 0,
                          class: "flex flex-wrap gap-1.5"
                        }, [
                          (vueExports.openBlock(true), vueExports.createBlock(vueExports.Fragment, null, vueExports.renderList(vueExports.unref(vendor).categories, (cat) => {
                            return vueExports.openBlock(), vueExports.createBlock(_component_UBadge, {
                              key: cat,
                              color: "info",
                              variant: "subtle",
                              label: cat,
                              size: "xs"
                            }, null, 8, ["label"]);
                          }), 128))
                        ])) : (vueExports.openBlock(), vueExports.createBlock("span", {
                          key: 1,
                          class: "text-slate-400"
                        }, "—"))
                      ]),
                      _: 1
                    })
                  ])
                ];
              }
            }),
            _: 1
          }, _parent));
          _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_SharedSectionCard, { title: "Liên hệ" }, {
            default: vueExports.withCtx((_, _push2, _parent2, _scopeId) => {
              if (_push2) {
                _push2(`<div class="grid grid-cols-1 sm:grid-cols-2 gap-5"${_scopeId}>`);
                _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_SharedFieldDisplay, { label: "Email chủ sở hữu" }, {
                  default: vueExports.withCtx((_2, _push3, _parent3, _scopeId2) => {
                    if (_push3) {
                      _push3(`${serverRenderer_cjs_prodExports.ssrInterpolate(vueExports.unref(vendor).owner_email)}`);
                    } else {
                      return [
                        vueExports.createTextVNode(vueExports.toDisplayString(vueExports.unref(vendor).owner_email), 1)
                      ];
                    }
                  }),
                  _: 1
                }, _parent2, _scopeId));
                _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_SharedFieldDisplay, { label: "SĐT chủ sở hữu" }, {
                  default: vueExports.withCtx((_2, _push3, _parent3, _scopeId2) => {
                    if (_push3) {
                      if (vueExports.unref(vendor).owner_phone) {
                        _push3(`<span class="font-mono"${_scopeId2}>${serverRenderer_cjs_prodExports.ssrInterpolate(("formatPhone" in _ctx ? _ctx.formatPhone : vueExports.unref(formatPhone))(vueExports.unref(vendor).owner_phone))}</span>`);
                      } else {
                        _push3(`<span${_scopeId2}>—</span>`);
                      }
                    } else {
                      return [
                        vueExports.unref(vendor).owner_phone ? (vueExports.openBlock(), vueExports.createBlock("span", {
                          key: 0,
                          class: "font-mono"
                        }, vueExports.toDisplayString(("formatPhone" in _ctx ? _ctx.formatPhone : vueExports.unref(formatPhone))(vueExports.unref(vendor).owner_phone)), 1)) : (vueExports.openBlock(), vueExports.createBlock("span", { key: 1 }, "—"))
                      ];
                    }
                  }),
                  _: 1
                }, _parent2, _scopeId));
                _push2(`</div>`);
              } else {
                return [
                  vueExports.createVNode("div", { class: "grid grid-cols-1 sm:grid-cols-2 gap-5" }, [
                    vueExports.createVNode(_component_SharedFieldDisplay, { label: "Email chủ sở hữu" }, {
                      default: vueExports.withCtx(() => [
                        vueExports.createTextVNode(vueExports.toDisplayString(vueExports.unref(vendor).owner_email), 1)
                      ]),
                      _: 1
                    }),
                    vueExports.createVNode(_component_SharedFieldDisplay, { label: "SĐT chủ sở hữu" }, {
                      default: vueExports.withCtx(() => [
                        vueExports.unref(vendor).owner_phone ? (vueExports.openBlock(), vueExports.createBlock("span", {
                          key: 0,
                          class: "font-mono"
                        }, vueExports.toDisplayString(("formatPhone" in _ctx ? _ctx.formatPhone : vueExports.unref(formatPhone))(vueExports.unref(vendor).owner_phone)), 1)) : (vueExports.openBlock(), vueExports.createBlock("span", { key: 1 }, "—"))
                      ]),
                      _: 1
                    })
                  ])
                ];
              }
            }),
            _: 1
          }, _parent));
          _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_SharedSectionCard, { title: "Trang shop" }, {
            default: vueExports.withCtx((_, _push2, _parent2, _scopeId) => {
              if (_push2) {
                _push2(`<div class="grid grid-cols-1 sm:grid-cols-2 gap-5"${_scopeId}>`);
                _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_SharedFieldDisplay, { label: "Custom domain" }, {
                  default: vueExports.withCtx((_2, _push3, _parent3, _scopeId2) => {
                    if (_push3) {
                      if (vueExports.unref(vendor).custom_domain && vueExports.unref(vendor).is_provisioned) {
                        _push3(`<a${serverRenderer_cjs_prodExports.ssrRenderAttr("href", customDomainUrl(vueExports.unref(vendor).custom_domain))} target="_blank" rel="noopener" class="text-primary-600 hover:underline inline-flex items-center gap-1"${_scopeId2}>${serverRenderer_cjs_prodExports.ssrInterpolate(vueExports.unref(vendor).custom_domain)} `);
                        _push3(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UIcon, {
                          name: "i-lucide-external-link",
                          class: "size-3.5"
                        }, null, _parent3, _scopeId2));
                        _push3(`</a>`);
                      } else {
                        _push3(`<span${_scopeId2}>${serverRenderer_cjs_prodExports.ssrInterpolate(vueExports.unref(vendor).custom_domain ?? "—")}</span>`);
                      }
                    } else {
                      return [
                        vueExports.unref(vendor).custom_domain && vueExports.unref(vendor).is_provisioned ? (vueExports.openBlock(), vueExports.createBlock("a", {
                          key: 0,
                          href: customDomainUrl(vueExports.unref(vendor).custom_domain),
                          target: "_blank",
                          rel: "noopener",
                          class: "text-primary-600 hover:underline inline-flex items-center gap-1"
                        }, [
                          vueExports.createTextVNode(vueExports.toDisplayString(vueExports.unref(vendor).custom_domain) + " ", 1),
                          vueExports.createVNode(_component_UIcon, {
                            name: "i-lucide-external-link",
                            class: "size-3.5"
                          })
                        ], 8, ["href"])) : (vueExports.openBlock(), vueExports.createBlock("span", { key: 1 }, vueExports.toDisplayString(vueExports.unref(vendor).custom_domain ?? "—"), 1))
                      ];
                    }
                  }),
                  _: 1
                }, _parent2, _scopeId));
                _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_SharedFieldDisplay, { label: "Trạng thái provision" }, {
                  default: vueExports.withCtx((_2, _push3, _parent3, _scopeId2) => {
                    if (_push3) {
                      if (vueExports.unref(vendor).is_provisioned) {
                        _push3(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UBadge, {
                          color: "success",
                          variant: "subtle",
                          label: "Đã kích hoạt",
                          icon: "i-lucide-check",
                          size: "sm"
                        }, null, _parent3, _scopeId2));
                      } else {
                        _push3(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UBadge, {
                          color: "warning",
                          variant: "subtle",
                          label: "Chờ provision",
                          icon: "i-lucide-clock",
                          size: "sm"
                        }, null, _parent3, _scopeId2));
                      }
                    } else {
                      return [
                        vueExports.unref(vendor).is_provisioned ? (vueExports.openBlock(), vueExports.createBlock(_component_UBadge, {
                          key: 0,
                          color: "success",
                          variant: "subtle",
                          label: "Đã kích hoạt",
                          icon: "i-lucide-check",
                          size: "sm"
                        })) : (vueExports.openBlock(), vueExports.createBlock(_component_UBadge, {
                          key: 1,
                          color: "warning",
                          variant: "subtle",
                          label: "Chờ provision",
                          icon: "i-lucide-clock",
                          size: "sm"
                        }))
                      ];
                    }
                  }),
                  _: 1
                }, _parent2, _scopeId));
                if (vueExports.unref(vendor).is_provisioned) {
                  _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_SharedFieldDisplay, { label: "Tenant ID resi_mart" }, {
                    default: vueExports.withCtx((_2, _push3, _parent3, _scopeId2) => {
                      if (_push3) {
                        _push3(`<span class="font-mono text-sm"${_scopeId2}>${serverRenderer_cjs_prodExports.ssrInterpolate(vueExports.unref(vendor).tenant_id ?? "—")}</span>`);
                      } else {
                        return [
                          vueExports.createVNode("span", { class: "font-mono text-sm" }, vueExports.toDisplayString(vueExports.unref(vendor).tenant_id ?? "—"), 1)
                        ];
                      }
                    }),
                    _: 1
                  }, _parent2, _scopeId));
                } else {
                  _push2(`<!---->`);
                }
                _push2(`</div>`);
              } else {
                return [
                  vueExports.createVNode("div", { class: "grid grid-cols-1 sm:grid-cols-2 gap-5" }, [
                    vueExports.createVNode(_component_SharedFieldDisplay, { label: "Custom domain" }, {
                      default: vueExports.withCtx(() => [
                        vueExports.unref(vendor).custom_domain && vueExports.unref(vendor).is_provisioned ? (vueExports.openBlock(), vueExports.createBlock("a", {
                          key: 0,
                          href: customDomainUrl(vueExports.unref(vendor).custom_domain),
                          target: "_blank",
                          rel: "noopener",
                          class: "text-primary-600 hover:underline inline-flex items-center gap-1"
                        }, [
                          vueExports.createTextVNode(vueExports.toDisplayString(vueExports.unref(vendor).custom_domain) + " ", 1),
                          vueExports.createVNode(_component_UIcon, {
                            name: "i-lucide-external-link",
                            class: "size-3.5"
                          })
                        ], 8, ["href"])) : (vueExports.openBlock(), vueExports.createBlock("span", { key: 1 }, vueExports.toDisplayString(vueExports.unref(vendor).custom_domain ?? "—"), 1))
                      ]),
                      _: 1
                    }),
                    vueExports.createVNode(_component_SharedFieldDisplay, { label: "Trạng thái provision" }, {
                      default: vueExports.withCtx(() => [
                        vueExports.unref(vendor).is_provisioned ? (vueExports.openBlock(), vueExports.createBlock(_component_UBadge, {
                          key: 0,
                          color: "success",
                          variant: "subtle",
                          label: "Đã kích hoạt",
                          icon: "i-lucide-check",
                          size: "sm"
                        })) : (vueExports.openBlock(), vueExports.createBlock(_component_UBadge, {
                          key: 1,
                          color: "warning",
                          variant: "subtle",
                          label: "Chờ provision",
                          icon: "i-lucide-clock",
                          size: "sm"
                        }))
                      ]),
                      _: 1
                    }),
                    vueExports.unref(vendor).is_provisioned ? (vueExports.openBlock(), vueExports.createBlock(_component_SharedFieldDisplay, {
                      key: 0,
                      label: "Tenant ID resi_mart"
                    }, {
                      default: vueExports.withCtx(() => [
                        vueExports.createVNode("span", { class: "font-mono text-sm" }, vueExports.toDisplayString(vueExports.unref(vendor).tenant_id ?? "—"), 1)
                      ]),
                      _: 1
                    })) : vueExports.createCommentVNode("", true)
                  ])
                ];
              }
            }),
            _: 1
          }, _parent));
          _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_VendorProjectsCard, {
            vendor: vueExports.unref(vendor),
            onChanged: refreshVendor
          }, null, _parent));
          if (vueExports.unref(vendor).description) {
            _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_SharedSectionCard, { title: "Mô tả" }, {
              default: vueExports.withCtx((_, _push2, _parent2, _scopeId) => {
                if (_push2) {
                  _push2(`<p class="whitespace-pre-line text-slate-700"${_scopeId}>${serverRenderer_cjs_prodExports.ssrInterpolate(vueExports.unref(vendor).description)}</p>`);
                } else {
                  return [
                    vueExports.createVNode("p", { class: "whitespace-pre-line text-slate-700" }, vueExports.toDisplayString(vueExports.unref(vendor).description), 1)
                  ];
                }
              }),
              _: 1
            }, _parent));
          } else {
            _push(`<!---->`);
          }
          _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_SharedSectionCard, {
            title: "Audit",
            compact: ""
          }, {
            default: vueExports.withCtx((_, _push2, _parent2, _scopeId) => {
              if (_push2) {
                _push2(`<div class="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm"${_scopeId}>`);
                _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_SharedFieldDisplay, { label: "Ngày tạo" }, {
                  default: vueExports.withCtx((_2, _push3, _parent3, _scopeId2) => {
                    if (_push3) {
                      _push3(`${serverRenderer_cjs_prodExports.ssrInterpolate(vueExports.unref(vendor).created_at ? ("formatDateTime" in _ctx ? _ctx.formatDateTime : vueExports.unref(formatDateTime))(vueExports.unref(vendor).created_at) : "—")}`);
                    } else {
                      return [
                        vueExports.createTextVNode(vueExports.toDisplayString(vueExports.unref(vendor).created_at ? ("formatDateTime" in _ctx ? _ctx.formatDateTime : vueExports.unref(formatDateTime))(vueExports.unref(vendor).created_at) : "—"), 1)
                      ];
                    }
                  }),
                  _: 1
                }, _parent2, _scopeId));
                _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_SharedFieldDisplay, { label: "Cập nhật lần cuối" }, {
                  default: vueExports.withCtx((_2, _push3, _parent3, _scopeId2) => {
                    if (_push3) {
                      _push3(`${serverRenderer_cjs_prodExports.ssrInterpolate(vueExports.unref(vendor).updated_at ? ("formatDateTime" in _ctx ? _ctx.formatDateTime : vueExports.unref(formatDateTime))(vueExports.unref(vendor).updated_at) : "—")}`);
                    } else {
                      return [
                        vueExports.createTextVNode(vueExports.toDisplayString(vueExports.unref(vendor).updated_at ? ("formatDateTime" in _ctx ? _ctx.formatDateTime : vueExports.unref(formatDateTime))(vueExports.unref(vendor).updated_at) : "—"), 1)
                      ];
                    }
                  }),
                  _: 1
                }, _parent2, _scopeId));
                _push2(`</div>`);
              } else {
                return [
                  vueExports.createVNode("div", { class: "grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm" }, [
                    vueExports.createVNode(_component_SharedFieldDisplay, { label: "Ngày tạo" }, {
                      default: vueExports.withCtx(() => [
                        vueExports.createTextVNode(vueExports.toDisplayString(vueExports.unref(vendor).created_at ? ("formatDateTime" in _ctx ? _ctx.formatDateTime : vueExports.unref(formatDateTime))(vueExports.unref(vendor).created_at) : "—"), 1)
                      ]),
                      _: 1
                    }),
                    vueExports.createVNode(_component_SharedFieldDisplay, { label: "Cập nhật lần cuối" }, {
                      default: vueExports.withCtx(() => [
                        vueExports.createTextVNode(vueExports.toDisplayString(vueExports.unref(vendor).updated_at ? ("formatDateTime" in _ctx ? _ctx.formatDateTime : vueExports.unref(formatDateTime))(vueExports.unref(vendor).updated_at) : "—"), 1)
                      ]),
                      _: 1
                    })
                  ])
                ];
              }
            }),
            _: 1
          }, _parent));
          _push(`<!--]-->`);
        } else {
          _push(`<!---->`);
        }
        _push(`</div>`);
      } else {
        _push(`<!---->`);
      }
      _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_SharedCrudDeleteModal, {
        open: vueExports.unref(showDeleteModal),
        "onUpdate:open": ($event) => vueExports.isRef(showDeleteModal) ? showDeleteModal.value = $event : null,
        title: "Xoá vendor",
        "item-name": vueExports.unref(deleteTarget)?.display_name ?? vueExports.unref(deleteTarget)?.name,
        loading: vueExports.unref(isDeleting),
        description: "Vendor sẽ bị xoá (soft-delete). Chỉ áp dụng cho vendor chưa được kích hoạt shop.",
        onConfirm: handleDelete
      }, null, _parent));
      _push(`</div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = vueExports.useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/pmc/vendors/[id]/index.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=index-DDit5dzV.mjs.map
