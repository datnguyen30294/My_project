import { _ as __nuxt_component_0 } from './PageHeader-BJhealxW.mjs';
import { _ as _sfc_main$1 } from './FormField-DFdmv6Lu.mjs';
import { _ as _sfc_main$2 } from './Select-CZE7Ef6n.mjs';
import { _ as __nuxt_component_3 } from './ProjectSelect-BTBiFCd5.mjs';
import { v as vueExports, j as useToast, aO as useHead, s as serverRenderer_cjs_prodExports, l as _sfc_main$c, _ as __nuxt_component_0$4, k as _sfc_main$h } from './server.mjs';
import { _ as __nuxt_component_2 } from './TableWrapper-VwUckvcF.mjs';
import { _ as _sfc_main$3 } from './Card-ywPiICev.mjs';
import { _ as __nuxt_component_4 } from './SectionCard-CH-mG9Mf.mjs';
import { _ as _sfc_main$4 } from './Table-17SH0cIR.mjs';
import { _ as _sfc_main$5 } from './Badge-W93D3Jpz.mjs';
import { _ as _sfc_main$6 } from './Tooltip-Dasyzope.mjs';
import { _ as __nuxt_component_13 } from './BankQrModal-v8n4Z6aB.mjs';
import { u as useClosingPeriodList, g as useCommissionSummary, S as SNAPSHOT_RECIPIENT_TYPE_OPTIONS, p as payoutStatusLabel, h as payoutStatusBadgeColor, r as recipientTypeBadgeColor, i as apiUpdatePayoutStatus } from './useClosingPeriods-HdCSZwWv.mjs';
import { f as formatCurrency, b as formatPercent } from './currency-DEb2TrW3.mjs';
import { u as useUrlFilters } from './useUrlFilters-D9dcjQcy.mjs';
import { S as SELECT_ALL_PER_PAGE } from './constants-G9YmtWtp.mjs';
import { s as stickyRight } from './table-z_7x7CvB.mjs';
import './Label-BBgw4vHh.mjs';
import './useDirection-CXYby7CP.mjs';
import './useFormControl-_Lqv8ipK.mjs';
import './PopperArrow-C9hHWuSZ.mjs';
import './FocusScope-BZehoQSg.mjs';
import './useFocusGuards-CJykkUFH.mjs';
import './utils-DY0Zag2O.mjs';
import './handleAndDispatchCustomEvent-Bk_AVSSo.mjs';
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
import './SelectMenu-DKHEMZj7.mjs';
import './useKbd-JjFOu4f7.mjs';
import './utils-BgcT7rQQ.mjs';
import './VisuallyHiddenInput-q6Pz-w0i.mjs';
import './index-CSThDD3J.mjs';
import './index-QmZAbLx-.mjs';
import './Input-JXN8po_F.mjs';
import './useEntitySelect-DG9pQ_n0.mjs';
import './useProjects-D4K3VYdb.mjs';
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
import './PageError-kZWsA9dh.mjs';
import './apiError-DBrxF9au.mjs';
import './useGraceArea-B6BTYtpN.mjs';
import './Kbd-T8yC2vfh.mjs';
import './Modal-BimZZbNl.mjs';
import './DialogTrigger-C3iwCYMu.mjs';
import './DialogClose-DGkUxau7.mjs';
import './QrCode-B1G5K_8N.mjs';
import './vietqr-D50vgfgj.mjs';

const _sfc_main = /* @__PURE__ */ vueExports.defineComponent({
  __name: "index",
  __ssrInlineRender: true,
  setup(__props) {
    const filterClosingPeriodId = vueExports.ref("pending");
    const filterProjectId = vueExports.ref(null);
    const filterRecipientType = vueExports.ref("");
    useUrlFilters({
      closing_period_id: { ref: filterClosingPeriodId, type: "string", defaultValue: "pending" },
      project_id: { ref: filterProjectId, type: "number" },
      recipient_type: { ref: filterRecipientType, type: "string" }
    });
    const queryParams = vueExports.computed(() => ({
      closing_period_id: filterClosingPeriodId.value,
      project_id: filterProjectId.value || void 0,
      recipient_type: filterRecipientType.value || void 0
    }));
    const { data: periodsData } = useClosingPeriodList({ per_page: SELECT_ALL_PER_PAGE });
    const closingPeriodOptions = vueExports.computed(() => {
      const periods = periodsData.value?.data ?? [];
      const options = [
        { label: "Chưa chốt (đơn trong kỳ đang mở)", value: "pending" },
        { label: "Tất cả kỳ", value: "all" }
      ];
      for (const p of periods) {
        const statusLabel = p.status.value === "closed" ? "Đã chốt" : "Đang mở";
        options.push({ label: `${p.name} · ${statusLabel}`, value: String(p.id) });
      }
      return options;
    });
    const recipientTypeOptions = [...SNAPSHOT_RECIPIENT_TYPE_OPTIONS];
    const hasFilters = vueExports.computed(
      () => filterClosingPeriodId.value !== "pending" || filterProjectId.value != null || !!filterRecipientType.value
    );
    function clearFilters() {
      filterClosingPeriodId.value = "pending";
      filterProjectId.value = null;
      filterRecipientType.value = "";
    }
    const { data, status, error, refresh } = useCommissionSummary(queryParams);
    const summaryData = vueExports.computed(() => data.value?.data);
    const stats = vueExports.computed(() => summaryData.value?.stats);
    const RECIPIENT_TYPE_ORDER = {
      platform: 0,
      operating_company: 1,
      board_of_directors: 2,
      staff: 3
    };
    function recipientTypeRank(value) {
      return RECIPIENT_TYPE_ORDER[value] ?? 99;
    }
    const byRecipient = vueExports.computed(() => {
      const rows = [...summaryData.value?.by_recipient ?? []];
      return rows.sort((a, b) => {
        const rank = recipientTypeRank(a.recipient_type.value) - recipientTypeRank(b.recipient_type.value);
        if (rank !== 0) return rank;
        return parseFloat(b.total_amount) - parseFloat(a.total_amount);
      });
    });
    const snapshots = vueExports.computed(() => {
      const rows = [...summaryData.value?.snapshots ?? []];
      return rows.sort((a, b) => {
        const rank = recipientTypeRank(a.recipient_type.value) - recipientTypeRank(b.recipient_type.value);
        if (rank !== 0) return rank;
        const nameCmp = a.recipient_name.localeCompare(b.recipient_name, "vi");
        if (nameCmp !== 0) return nameCmp;
        return parseFloat(b.amount) - parseFloat(a.amount);
      });
    });
    const kpiCards = vueExports.computed(() => [
      { label: "Tổng hoa hồng", value: stats.value ? formatCurrency(stats.value.total_commission) : "—" },
      { label: "Số đơn có snapshot", value: stats.value?.order_count ?? "—" },
      { label: "Số dòng snapshot", value: stats.value?.snapshot_count ?? "—" },
      { label: "Số người nhận", value: stats.value?.recipient_count ?? "—" }
    ]);
    const recipientColumns = [
      { accessorKey: "recipient_name", header: "Người / Bên nhận" },
      { accessorKey: "recipient_type", header: "Loại" },
      { accessorKey: "total_amount", header: "Tổng hoa hồng" },
      { accessorKey: "order_count", header: "Số đơn hàng" },
      { accessorKey: "payout_status", header: "Thanh toán HH" },
      { id: "qr", header: "QR" },
      stickyRight({ id: "actions", header: "Thanh toán" })
    ];
    const snapshotColumns = [
      { accessorKey: "order_code", header: "Đơn hàng" },
      { accessorKey: "closing_period_name", header: "Kỳ chốt" },
      { accessorKey: "recipient_name", header: "Người nhận" },
      { accessorKey: "recipient_type", header: "Loại" },
      { accessorKey: "amount", header: "Số tiền" },
      { accessorKey: "resolved_from", header: "Nguồn" },
      { accessorKey: "formula", header: "Giá trị" },
      { accessorKey: "payout_status", header: "Thanh toán HH" },
      { accessorKey: "cash_transaction", header: "Đã vào quỹ" },
      { id: "qr", header: "QR" }
    ];
    const commissionQrOpen = vueExports.ref(false);
    const commissionQrBank = vueExports.ref(null);
    const commissionQrAmount = vueExports.ref(0);
    const commissionQrDescription = vueExports.ref("");
    const commissionQrRecipientName = vueExports.ref("");
    function openCommissionQr(bankInfo, amount, recipientName, context) {
      if (!bankInfo) return;
      commissionQrBank.value = bankInfo;
      commissionQrAmount.value = typeof amount === "string" ? parseFloat(amount) : amount;
      commissionQrDescription.value = `HOA HONG ${context}`.trim();
      commissionQrRecipientName.value = recipientName;
      commissionQrOpen.value = true;
    }
    const toast = useToast();
    const payoutLoadingKey = vueExports.ref(null);
    function recipientKey(r) {
      return `${r.recipient_type.value}|${r.account_id ?? ""}|${r.recipient_name}`;
    }
    function snapshotsForRecipient(r) {
      const key = recipientKey(r);
      return snapshots.value.filter((s) => recipientKey(s) === key);
    }
    async function payRecipientTotal(r, payoutStatus) {
      const target = snapshotsForRecipient(r).filter(
        (s) => payoutStatus === "paid" ? s.payout_status.value !== "paid" : s.payout_status.value === "paid"
      );
      if (target.length === 0) {
        toast.add({
          title: payoutStatus === "paid" ? "Tất cả dòng của người nhận này đã được thanh toán" : "Không có dòng nào đang ở trạng thái đã thanh toán để hoàn tác",
          color: "info"
        });
        return;
      }
      const key = recipientKey(r);
      payoutLoadingKey.value = key;
      try {
        const result = await apiUpdatePayoutStatus({
          snapshot_ids: target.map((s) => s.id),
          payout_status: payoutStatus
        });
        toast.add({ title: result.message, color: "success" });
        await refresh();
      } catch (err) {
        const message = err instanceof Error ? err.message : "Có lỗi xảy ra";
        toast.add({ title: message, color: "error" });
      } finally {
        payoutLoadingKey.value = null;
      }
    }
    function buildFormula(s) {
      if (!s.value_type) return "—";
      const vt = s.value_type.value;
      if (vt === "percent") return formatPercent(s.percent);
      if (vt === "fixed") return formatCurrency(s.value_fixed ?? "0");
      if (vt === "both") return `${formatCurrency(s.value_fixed ?? "0")} + ${formatPercent(s.percent)}`;
      return "—";
    }
    useHead({ title: "Tổng hợp hoa hồng" });
    return (_ctx, _push, _parent, _attrs) => {
      const _component_SharedCrudPageHeader = __nuxt_component_0;
      const _component_UFormField = _sfc_main$1;
      const _component_USelect = _sfc_main$2;
      const _component_SharedProjectSelect = __nuxt_component_3;
      const _component_UButton = _sfc_main$c;
      const _component_SharedCrudTableWrapper = __nuxt_component_2;
      const _component_UCard = _sfc_main$3;
      const _component_SharedSectionCard = __nuxt_component_4;
      const _component_UTable = _sfc_main$4;
      const _component_NuxtLink = __nuxt_component_0$4;
      const _component_UBadge = _sfc_main$5;
      const _component_UTooltip = _sfc_main$6;
      const _component_UIcon = _sfc_main$h;
      const _component_SharedBankQrModal = __nuxt_component_13;
      _push(`<div${serverRenderer_cjs_prodExports.ssrRenderAttrs(_attrs)}>`);
      _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_SharedCrudPageHeader, {
        title: "Tổng hợp hoa hồng",
        description: "Báo cáo hoa hồng theo kỳ chốt, dự án, người nhận"
      }, {
        actions: vueExports.withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<span${_scopeId}></span>`);
          } else {
            return [
              vueExports.createVNode("span")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`<div class="flex flex-wrap items-end gap-3 mb-6">`);
      _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UFormField, { label: "Kỳ chốt" }, {
        default: vueExports.withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_USelect, {
              modelValue: vueExports.unref(filterClosingPeriodId),
              "onUpdate:modelValue": ($event) => vueExports.isRef(filterClosingPeriodId) ? filterClosingPeriodId.value = $event : null,
              items: vueExports.unref(closingPeriodOptions),
              "value-key": "value",
              class: "min-w-56"
            }, null, _parent2, _scopeId));
          } else {
            return [
              vueExports.createVNode(_component_USelect, {
                modelValue: vueExports.unref(filterClosingPeriodId),
                "onUpdate:modelValue": ($event) => vueExports.isRef(filterClosingPeriodId) ? filterClosingPeriodId.value = $event : null,
                items: vueExports.unref(closingPeriodOptions),
                "value-key": "value",
                class: "min-w-56"
              }, null, 8, ["modelValue", "onUpdate:modelValue", "items"])
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UFormField, { label: "Dự án" }, {
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
      _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UFormField, { label: "Loại người nhận" }, {
        default: vueExports.withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_USelect, {
              modelValue: vueExports.unref(filterRecipientType),
              "onUpdate:modelValue": ($event) => vueExports.isRef(filterRecipientType) ? filterRecipientType.value = $event : null,
              items: recipientTypeOptions,
              "value-key": "value",
              placeholder: "Tất cả loại",
              class: "min-w-40"
            }, null, _parent2, _scopeId));
          } else {
            return [
              vueExports.createVNode(_component_USelect, {
                modelValue: vueExports.unref(filterRecipientType),
                "onUpdate:modelValue": ($event) => vueExports.isRef(filterRecipientType) ? filterRecipientType.value = $event : null,
                items: recipientTypeOptions,
                "value-key": "value",
                placeholder: "Tất cả loại",
                class: "min-w-40"
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
          onClick: clearFilters
        }, null, _parent));
      } else {
        _push(`<!---->`);
      }
      _push(`</div>`);
      _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_SharedCrudTableWrapper, {
        status: vueExports.unref(status),
        error: vueExports.unref(error),
        data: vueExports.unref(summaryData),
        refresh: vueExports.unref(refresh)
      }, {
        default: vueExports.withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6"${_scopeId}><!--[-->`);
            serverRenderer_cjs_prodExports.ssrRenderList(vueExports.unref(kpiCards), (card) => {
              _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UCard, {
                key: card.label
              }, {
                default: vueExports.withCtx((_2, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    _push3(`<div class="text-center"${_scopeId2}><p class="text-xs text-[var(--ui-text-muted)] mb-1"${_scopeId2}>${serverRenderer_cjs_prodExports.ssrInterpolate(card.label)}</p><p class="text-lg font-bold"${_scopeId2}>${serverRenderer_cjs_prodExports.ssrInterpolate(card.value)}</p></div>`);
                  } else {
                    return [
                      vueExports.createVNode("div", { class: "text-center" }, [
                        vueExports.createVNode("p", { class: "text-xs text-[var(--ui-text-muted)] mb-1" }, vueExports.toDisplayString(card.label), 1),
                        vueExports.createVNode("p", { class: "text-lg font-bold" }, vueExports.toDisplayString(card.value), 1)
                      ])
                    ];
                  }
                }),
                _: 2
              }, _parent2, _scopeId));
            });
            _push2(`<!--]--></div>`);
            _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_SharedSectionCard, {
              title: "Hoa hồng theo người / bên nhận",
              compact: "",
              class: "mb-6"
            }, {
              default: vueExports.withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  if (vueExports.unref(byRecipient).length === 0) {
                    _push3(`<div class="py-8 text-center text-sm text-[var(--ui-text-muted)]"${_scopeId2}> Chưa có dữ liệu hoa hồng cho bộ lọc này </div>`);
                  } else {
                    _push3(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UTable, {
                      data: vueExports.unref(byRecipient),
                      columns: recipientColumns
                    }, {
                      "recipient_name-cell": vueExports.withCtx(({ row }, _push4, _parent4, _scopeId3) => {
                        if (_push4) {
                          if (row.original.account_id) {
                            _push4(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_NuxtLink, {
                              to: `/pmc/accounts/${row.original.account_id}`,
                              class: "text-[var(--ui-primary)] hover:underline font-medium"
                            }, {
                              default: vueExports.withCtx((_3, _push5, _parent5, _scopeId4) => {
                                if (_push5) {
                                  _push5(`${serverRenderer_cjs_prodExports.ssrInterpolate(row.original.recipient_name)}`);
                                } else {
                                  return [
                                    vueExports.createTextVNode(vueExports.toDisplayString(row.original.recipient_name), 1)
                                  ];
                                }
                              }),
                              _: 2
                            }, _parent4, _scopeId3));
                          } else {
                            _push4(`<span${_scopeId3}>${serverRenderer_cjs_prodExports.ssrInterpolate(row.original.recipient_name)}</span>`);
                          }
                        } else {
                          return [
                            row.original.account_id ? (vueExports.openBlock(), vueExports.createBlock(_component_NuxtLink, {
                              key: 0,
                              to: `/pmc/accounts/${row.original.account_id}`,
                              class: "text-[var(--ui-primary)] hover:underline font-medium"
                            }, {
                              default: vueExports.withCtx(() => [
                                vueExports.createTextVNode(vueExports.toDisplayString(row.original.recipient_name), 1)
                              ]),
                              _: 2
                            }, 1032, ["to"])) : (vueExports.openBlock(), vueExports.createBlock("span", { key: 1 }, vueExports.toDisplayString(row.original.recipient_name), 1))
                          ];
                        }
                      }),
                      "recipient_type-cell": vueExports.withCtx(({ row }, _push4, _parent4, _scopeId3) => {
                        if (_push4) {
                          _push4(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UBadge, {
                            color: ("recipientTypeBadgeColor" in _ctx ? _ctx.recipientTypeBadgeColor : vueExports.unref(recipientTypeBadgeColor))(row.original.recipient_type.value),
                            variant: "subtle",
                            label: row.original.recipient_type.label
                          }, null, _parent4, _scopeId3));
                        } else {
                          return [
                            vueExports.createVNode(_component_UBadge, {
                              color: ("recipientTypeBadgeColor" in _ctx ? _ctx.recipientTypeBadgeColor : vueExports.unref(recipientTypeBadgeColor))(row.original.recipient_type.value),
                              variant: "subtle",
                              label: row.original.recipient_type.label
                            }, null, 8, ["color", "label"])
                          ];
                        }
                      }),
                      "total_amount-cell": vueExports.withCtx(({ row }, _push4, _parent4, _scopeId3) => {
                        if (_push4) {
                          _push4(`${serverRenderer_cjs_prodExports.ssrInterpolate(("formatCurrency" in _ctx ? _ctx.formatCurrency : vueExports.unref(formatCurrency))(row.original.total_amount))}`);
                        } else {
                          return [
                            vueExports.createTextVNode(vueExports.toDisplayString(("formatCurrency" in _ctx ? _ctx.formatCurrency : vueExports.unref(formatCurrency))(row.original.total_amount)), 1)
                          ];
                        }
                      }),
                      "payout_status-cell": vueExports.withCtx(({ row }, _push4, _parent4, _scopeId3) => {
                        if (_push4) {
                          _push4(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UBadge, {
                            color: ("payoutStatusBadgeColor" in _ctx ? _ctx.payoutStatusBadgeColor : vueExports.unref(payoutStatusBadgeColor))(row.original.payout_status),
                            variant: "subtle",
                            label: ("payoutStatusLabel" in _ctx ? _ctx.payoutStatusLabel : vueExports.unref(payoutStatusLabel))(row.original.payout_status)
                          }, null, _parent4, _scopeId3));
                        } else {
                          return [
                            vueExports.createVNode(_component_UBadge, {
                              color: ("payoutStatusBadgeColor" in _ctx ? _ctx.payoutStatusBadgeColor : vueExports.unref(payoutStatusBadgeColor))(row.original.payout_status),
                              variant: "subtle",
                              label: ("payoutStatusLabel" in _ctx ? _ctx.payoutStatusLabel : vueExports.unref(payoutStatusLabel))(row.original.payout_status)
                            }, null, 8, ["color", "label"])
                          ];
                        }
                      }),
                      "qr-cell": vueExports.withCtx(({ row }, _push4, _parent4, _scopeId3) => {
                        if (_push4) {
                          if (row.original.bank_info) {
                            _push4(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UButton, {
                              icon: "i-lucide-qr-code",
                              size: "xs",
                              variant: "ghost",
                              color: "neutral",
                              title: "QR chuyển khoản",
                              onClick: ($event) => openCommissionQr(row.original.bank_info, row.original.total_amount, row.original.recipient_name, `TONG ${row.original.recipient_name}`)
                            }, null, _parent4, _scopeId3));
                          } else {
                            _push4(`<span class="text-xs text-slate-300"${_scopeId3}>—</span>`);
                          }
                        } else {
                          return [
                            row.original.bank_info ? (vueExports.openBlock(), vueExports.createBlock(_component_UButton, {
                              key: 0,
                              icon: "i-lucide-qr-code",
                              size: "xs",
                              variant: "ghost",
                              color: "neutral",
                              title: "QR chuyển khoản",
                              onClick: ($event) => openCommissionQr(row.original.bank_info, row.original.total_amount, row.original.recipient_name, `TONG ${row.original.recipient_name}`)
                            }, null, 8, ["onClick"])) : (vueExports.openBlock(), vueExports.createBlock("span", {
                              key: 1,
                              class: "text-xs text-slate-300"
                            }, "—"))
                          ];
                        }
                      }),
                      "actions-cell": vueExports.withCtx(({ row }, _push4, _parent4, _scopeId3) => {
                        if (_push4) {
                          _push4(`<div class="flex items-center gap-1"${_scopeId3}>`);
                          if (row.original.payout_status !== "paid") {
                            _push4(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UButton, {
                              size: "xs",
                              color: "success",
                              variant: "soft",
                              icon: "i-lucide-check",
                              label: "Thanh toán tổng",
                              loading: vueExports.unref(payoutLoadingKey) === recipientKey(row.original),
                              onClick: ($event) => payRecipientTotal(row.original, "paid")
                            }, null, _parent4, _scopeId3));
                          } else {
                            _push4(`<!---->`);
                          }
                          if (row.original.payout_status !== "unpaid") {
                            _push4(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UButton, {
                              size: "xs",
                              color: "warning",
                              variant: "soft",
                              icon: "i-lucide-rotate-ccw",
                              label: "Hoàn tác",
                              loading: vueExports.unref(payoutLoadingKey) === recipientKey(row.original),
                              onClick: ($event) => payRecipientTotal(row.original, "unpaid")
                            }, null, _parent4, _scopeId3));
                          } else {
                            _push4(`<!---->`);
                          }
                          _push4(`</div>`);
                        } else {
                          return [
                            vueExports.createVNode("div", { class: "flex items-center gap-1" }, [
                              row.original.payout_status !== "paid" ? (vueExports.openBlock(), vueExports.createBlock(_component_UButton, {
                                key: 0,
                                size: "xs",
                                color: "success",
                                variant: "soft",
                                icon: "i-lucide-check",
                                label: "Thanh toán tổng",
                                loading: vueExports.unref(payoutLoadingKey) === recipientKey(row.original),
                                onClick: ($event) => payRecipientTotal(row.original, "paid")
                              }, null, 8, ["loading", "onClick"])) : vueExports.createCommentVNode("", true),
                              row.original.payout_status !== "unpaid" ? (vueExports.openBlock(), vueExports.createBlock(_component_UButton, {
                                key: 1,
                                size: "xs",
                                color: "warning",
                                variant: "soft",
                                icon: "i-lucide-rotate-ccw",
                                label: "Hoàn tác",
                                loading: vueExports.unref(payoutLoadingKey) === recipientKey(row.original),
                                onClick: ($event) => payRecipientTotal(row.original, "unpaid")
                              }, null, 8, ["loading", "onClick"])) : vueExports.createCommentVNode("", true)
                            ])
                          ];
                        }
                      }),
                      _: 1
                    }, _parent3, _scopeId2));
                  }
                } else {
                  return [
                    vueExports.unref(byRecipient).length === 0 ? (vueExports.openBlock(), vueExports.createBlock("div", {
                      key: 0,
                      class: "py-8 text-center text-sm text-[var(--ui-text-muted)]"
                    }, " Chưa có dữ liệu hoa hồng cho bộ lọc này ")) : (vueExports.openBlock(), vueExports.createBlock(_component_UTable, {
                      key: 1,
                      data: vueExports.unref(byRecipient),
                      columns: recipientColumns
                    }, {
                      "recipient_name-cell": vueExports.withCtx(({ row }) => [
                        row.original.account_id ? (vueExports.openBlock(), vueExports.createBlock(_component_NuxtLink, {
                          key: 0,
                          to: `/pmc/accounts/${row.original.account_id}`,
                          class: "text-[var(--ui-primary)] hover:underline font-medium"
                        }, {
                          default: vueExports.withCtx(() => [
                            vueExports.createTextVNode(vueExports.toDisplayString(row.original.recipient_name), 1)
                          ]),
                          _: 2
                        }, 1032, ["to"])) : (vueExports.openBlock(), vueExports.createBlock("span", { key: 1 }, vueExports.toDisplayString(row.original.recipient_name), 1))
                      ]),
                      "recipient_type-cell": vueExports.withCtx(({ row }) => [
                        vueExports.createVNode(_component_UBadge, {
                          color: ("recipientTypeBadgeColor" in _ctx ? _ctx.recipientTypeBadgeColor : vueExports.unref(recipientTypeBadgeColor))(row.original.recipient_type.value),
                          variant: "subtle",
                          label: row.original.recipient_type.label
                        }, null, 8, ["color", "label"])
                      ]),
                      "total_amount-cell": vueExports.withCtx(({ row }) => [
                        vueExports.createTextVNode(vueExports.toDisplayString(("formatCurrency" in _ctx ? _ctx.formatCurrency : vueExports.unref(formatCurrency))(row.original.total_amount)), 1)
                      ]),
                      "payout_status-cell": vueExports.withCtx(({ row }) => [
                        vueExports.createVNode(_component_UBadge, {
                          color: ("payoutStatusBadgeColor" in _ctx ? _ctx.payoutStatusBadgeColor : vueExports.unref(payoutStatusBadgeColor))(row.original.payout_status),
                          variant: "subtle",
                          label: ("payoutStatusLabel" in _ctx ? _ctx.payoutStatusLabel : vueExports.unref(payoutStatusLabel))(row.original.payout_status)
                        }, null, 8, ["color", "label"])
                      ]),
                      "qr-cell": vueExports.withCtx(({ row }) => [
                        row.original.bank_info ? (vueExports.openBlock(), vueExports.createBlock(_component_UButton, {
                          key: 0,
                          icon: "i-lucide-qr-code",
                          size: "xs",
                          variant: "ghost",
                          color: "neutral",
                          title: "QR chuyển khoản",
                          onClick: ($event) => openCommissionQr(row.original.bank_info, row.original.total_amount, row.original.recipient_name, `TONG ${row.original.recipient_name}`)
                        }, null, 8, ["onClick"])) : (vueExports.openBlock(), vueExports.createBlock("span", {
                          key: 1,
                          class: "text-xs text-slate-300"
                        }, "—"))
                      ]),
                      "actions-cell": vueExports.withCtx(({ row }) => [
                        vueExports.createVNode("div", { class: "flex items-center gap-1" }, [
                          row.original.payout_status !== "paid" ? (vueExports.openBlock(), vueExports.createBlock(_component_UButton, {
                            key: 0,
                            size: "xs",
                            color: "success",
                            variant: "soft",
                            icon: "i-lucide-check",
                            label: "Thanh toán tổng",
                            loading: vueExports.unref(payoutLoadingKey) === recipientKey(row.original),
                            onClick: ($event) => payRecipientTotal(row.original, "paid")
                          }, null, 8, ["loading", "onClick"])) : vueExports.createCommentVNode("", true),
                          row.original.payout_status !== "unpaid" ? (vueExports.openBlock(), vueExports.createBlock(_component_UButton, {
                            key: 1,
                            size: "xs",
                            color: "warning",
                            variant: "soft",
                            icon: "i-lucide-rotate-ccw",
                            label: "Hoàn tác",
                            loading: vueExports.unref(payoutLoadingKey) === recipientKey(row.original),
                            onClick: ($event) => payRecipientTotal(row.original, "unpaid")
                          }, null, 8, ["loading", "onClick"])) : vueExports.createCommentVNode("", true)
                        ])
                      ]),
                      _: 1
                    }, 8, ["data"]))
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_SharedSectionCard, {
              title: "Chi tiết theo đơn hàng",
              compact: ""
            }, {
              default: vueExports.withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  if (vueExports.unref(snapshots).length === 0) {
                    _push3(`<div class="py-8 text-center text-sm text-[var(--ui-text-muted)]"${_scopeId2}> Chưa có dữ liệu hoa hồng cho bộ lọc này </div>`);
                  } else {
                    _push3(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UTable, {
                      data: vueExports.unref(snapshots),
                      columns: snapshotColumns
                    }, {
                      "order_code-cell": vueExports.withCtx(({ row }, _push4, _parent4, _scopeId3) => {
                        if (_push4) {
                          _push4(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_NuxtLink, {
                            to: `/pmc/orders/${row.original.order_id}`,
                            class: "text-[var(--ui-primary)] hover:underline font-medium"
                          }, {
                            default: vueExports.withCtx((_3, _push5, _parent5, _scopeId4) => {
                              if (_push5) {
                                _push5(`${serverRenderer_cjs_prodExports.ssrInterpolate(row.original.order_code)}`);
                              } else {
                                return [
                                  vueExports.createTextVNode(vueExports.toDisplayString(row.original.order_code), 1)
                                ];
                              }
                            }),
                            _: 2
                          }, _parent4, _scopeId3));
                        } else {
                          return [
                            vueExports.createVNode(_component_NuxtLink, {
                              to: `/pmc/orders/${row.original.order_id}`,
                              class: "text-[var(--ui-primary)] hover:underline font-medium"
                            }, {
                              default: vueExports.withCtx(() => [
                                vueExports.createTextVNode(vueExports.toDisplayString(row.original.order_code), 1)
                              ]),
                              _: 2
                            }, 1032, ["to"])
                          ];
                        }
                      }),
                      "recipient_name-cell": vueExports.withCtx(({ row }, _push4, _parent4, _scopeId3) => {
                        if (_push4) {
                          if (row.original.account_id) {
                            _push4(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_NuxtLink, {
                              to: `/pmc/accounts/${row.original.account_id}`,
                              class: "text-[var(--ui-primary)] hover:underline font-medium"
                            }, {
                              default: vueExports.withCtx((_3, _push5, _parent5, _scopeId4) => {
                                if (_push5) {
                                  _push5(`${serverRenderer_cjs_prodExports.ssrInterpolate(row.original.recipient_name)}`);
                                } else {
                                  return [
                                    vueExports.createTextVNode(vueExports.toDisplayString(row.original.recipient_name), 1)
                                  ];
                                }
                              }),
                              _: 2
                            }, _parent4, _scopeId3));
                          } else {
                            _push4(`<span${_scopeId3}>${serverRenderer_cjs_prodExports.ssrInterpolate(row.original.recipient_name)}</span>`);
                          }
                        } else {
                          return [
                            row.original.account_id ? (vueExports.openBlock(), vueExports.createBlock(_component_NuxtLink, {
                              key: 0,
                              to: `/pmc/accounts/${row.original.account_id}`,
                              class: "text-[var(--ui-primary)] hover:underline font-medium"
                            }, {
                              default: vueExports.withCtx(() => [
                                vueExports.createTextVNode(vueExports.toDisplayString(row.original.recipient_name), 1)
                              ]),
                              _: 2
                            }, 1032, ["to"])) : (vueExports.openBlock(), vueExports.createBlock("span", { key: 1 }, vueExports.toDisplayString(row.original.recipient_name), 1))
                          ];
                        }
                      }),
                      "recipient_type-cell": vueExports.withCtx(({ row }, _push4, _parent4, _scopeId3) => {
                        if (_push4) {
                          _push4(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UBadge, {
                            color: ("recipientTypeBadgeColor" in _ctx ? _ctx.recipientTypeBadgeColor : vueExports.unref(recipientTypeBadgeColor))(row.original.recipient_type.value),
                            variant: "subtle",
                            label: row.original.recipient_type.label
                          }, null, _parent4, _scopeId3));
                        } else {
                          return [
                            vueExports.createVNode(_component_UBadge, {
                              color: ("recipientTypeBadgeColor" in _ctx ? _ctx.recipientTypeBadgeColor : vueExports.unref(recipientTypeBadgeColor))(row.original.recipient_type.value),
                              variant: "subtle",
                              label: row.original.recipient_type.label
                            }, null, 8, ["color", "label"])
                          ];
                        }
                      }),
                      "amount-cell": vueExports.withCtx(({ row }, _push4, _parent4, _scopeId3) => {
                        if (_push4) {
                          _push4(`${serverRenderer_cjs_prodExports.ssrInterpolate(("formatCurrency" in _ctx ? _ctx.formatCurrency : vueExports.unref(formatCurrency))(row.original.amount))}`);
                        } else {
                          return [
                            vueExports.createTextVNode(vueExports.toDisplayString(("formatCurrency" in _ctx ? _ctx.formatCurrency : vueExports.unref(formatCurrency))(row.original.amount)), 1)
                          ];
                        }
                      }),
                      "resolved_from-cell": vueExports.withCtx(({ row }, _push4, _parent4, _scopeId3) => {
                        if (_push4) {
                          _push4(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UBadge, {
                            color: row.original.resolved_from === "override" ? "warning" : "neutral",
                            variant: "subtle",
                            label: row.original.resolved_from === "override" ? "Override" : "Config"
                          }, null, _parent4, _scopeId3));
                        } else {
                          return [
                            vueExports.createVNode(_component_UBadge, {
                              color: row.original.resolved_from === "override" ? "warning" : "neutral",
                              variant: "subtle",
                              label: row.original.resolved_from === "override" ? "Override" : "Config"
                            }, null, 8, ["color", "label"])
                          ];
                        }
                      }),
                      "formula-cell": vueExports.withCtx(({ row }, _push4, _parent4, _scopeId3) => {
                        if (_push4) {
                          _push4(`${serverRenderer_cjs_prodExports.ssrInterpolate(buildFormula(row.original))}`);
                        } else {
                          return [
                            vueExports.createTextVNode(vueExports.toDisplayString(buildFormula(row.original)), 1)
                          ];
                        }
                      }),
                      "payout_status-cell": vueExports.withCtx(({ row }, _push4, _parent4, _scopeId3) => {
                        if (_push4) {
                          _push4(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UBadge, {
                            color: ("payoutStatusBadgeColor" in _ctx ? _ctx.payoutStatusBadgeColor : vueExports.unref(payoutStatusBadgeColor))(row.original.payout_status.value),
                            variant: "subtle",
                            label: row.original.payout_status.label
                          }, null, _parent4, _scopeId3));
                        } else {
                          return [
                            vueExports.createVNode(_component_UBadge, {
                              color: ("payoutStatusBadgeColor" in _ctx ? _ctx.payoutStatusBadgeColor : vueExports.unref(payoutStatusBadgeColor))(row.original.payout_status.value),
                              variant: "subtle",
                              label: row.original.payout_status.label
                            }, null, 8, ["color", "label"])
                          ];
                        }
                      }),
                      "cash_transaction-cell": vueExports.withCtx(({ row }, _push4, _parent4, _scopeId3) => {
                        if (_push4) {
                          if (row.original.payout_status.value === "unpaid") {
                            _push4(`<span class="text-slate-400"${_scopeId3}>—</span>`);
                          } else if (row.original.cash_transaction) {
                            _push4(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UTooltip, {
                              text: `Đã chi ra quỹ: ${row.original.cash_transaction.code}`
                            }, {
                              default: vueExports.withCtx((_3, _push5, _parent5, _scopeId4) => {
                                if (_push5) {
                                  _push5(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_NuxtLink, {
                                    to: "/pmc/finance/treasury",
                                    class: "flex items-center gap-1 text-[var(--ui-success)] hover:underline text-sm font-mono"
                                  }, {
                                    default: vueExports.withCtx((_4, _push6, _parent6, _scopeId5) => {
                                      if (_push6) {
                                        _push6(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UIcon, {
                                          name: "i-lucide-check-circle",
                                          class: "size-3.5 shrink-0"
                                        }, null, _parent6, _scopeId5));
                                        _push6(` ${serverRenderer_cjs_prodExports.ssrInterpolate(row.original.cash_transaction.code)}`);
                                      } else {
                                        return [
                                          vueExports.createVNode(_component_UIcon, {
                                            name: "i-lucide-check-circle",
                                            class: "size-3.5 shrink-0"
                                          }),
                                          vueExports.createTextVNode(" " + vueExports.toDisplayString(row.original.cash_transaction.code), 1)
                                        ];
                                      }
                                    }),
                                    _: 2
                                  }, _parent5, _scopeId4));
                                } else {
                                  return [
                                    vueExports.createVNode(_component_NuxtLink, {
                                      to: "/pmc/finance/treasury",
                                      class: "flex items-center gap-1 text-[var(--ui-success)] hover:underline text-sm font-mono"
                                    }, {
                                      default: vueExports.withCtx(() => [
                                        vueExports.createVNode(_component_UIcon, {
                                          name: "i-lucide-check-circle",
                                          class: "size-3.5 shrink-0"
                                        }),
                                        vueExports.createTextVNode(" " + vueExports.toDisplayString(row.original.cash_transaction.code), 1)
                                      ]),
                                      _: 2
                                    }, 1024)
                                  ];
                                }
                              }),
                              _: 2
                            }, _parent4, _scopeId3));
                          } else if (row.original.payout_status.value === "paid") {
                            _push4(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UTooltip, { text: "Giao dịch quỹ đã bị huỷ" }, {
                              default: vueExports.withCtx((_3, _push5, _parent5, _scopeId4) => {
                                if (_push5) {
                                  _push5(`<span class="flex items-center gap-1 text-[var(--ui-warning)]"${_scopeId4}>`);
                                  _push5(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UIcon, {
                                    name: "i-lucide-alert-triangle",
                                    class: "size-3.5 shrink-0"
                                  }, null, _parent5, _scopeId4));
                                  _push5(`<span class="text-xs"${_scopeId4}>Đã huỷ</span></span>`);
                                } else {
                                  return [
                                    vueExports.createVNode("span", { class: "flex items-center gap-1 text-[var(--ui-warning)]" }, [
                                      vueExports.createVNode(_component_UIcon, {
                                        name: "i-lucide-alert-triangle",
                                        class: "size-3.5 shrink-0"
                                      }),
                                      vueExports.createVNode("span", { class: "text-xs" }, "Đã huỷ")
                                    ])
                                  ];
                                }
                              }),
                              _: 2
                            }, _parent4, _scopeId3));
                          } else {
                            _push4(`<span class="text-slate-400"${_scopeId3}>—</span>`);
                          }
                        } else {
                          return [
                            row.original.payout_status.value === "unpaid" ? (vueExports.openBlock(), vueExports.createBlock("span", {
                              key: 0,
                              class: "text-slate-400"
                            }, "—")) : row.original.cash_transaction ? (vueExports.openBlock(), vueExports.createBlock(_component_UTooltip, {
                              key: 1,
                              text: `Đã chi ra quỹ: ${row.original.cash_transaction.code}`
                            }, {
                              default: vueExports.withCtx(() => [
                                vueExports.createVNode(_component_NuxtLink, {
                                  to: "/pmc/finance/treasury",
                                  class: "flex items-center gap-1 text-[var(--ui-success)] hover:underline text-sm font-mono"
                                }, {
                                  default: vueExports.withCtx(() => [
                                    vueExports.createVNode(_component_UIcon, {
                                      name: "i-lucide-check-circle",
                                      class: "size-3.5 shrink-0"
                                    }),
                                    vueExports.createTextVNode(" " + vueExports.toDisplayString(row.original.cash_transaction.code), 1)
                                  ]),
                                  _: 2
                                }, 1024)
                              ]),
                              _: 2
                            }, 1032, ["text"])) : row.original.payout_status.value === "paid" ? (vueExports.openBlock(), vueExports.createBlock(_component_UTooltip, {
                              key: 2,
                              text: "Giao dịch quỹ đã bị huỷ"
                            }, {
                              default: vueExports.withCtx(() => [
                                vueExports.createVNode("span", { class: "flex items-center gap-1 text-[var(--ui-warning)]" }, [
                                  vueExports.createVNode(_component_UIcon, {
                                    name: "i-lucide-alert-triangle",
                                    class: "size-3.5 shrink-0"
                                  }),
                                  vueExports.createVNode("span", { class: "text-xs" }, "Đã huỷ")
                                ])
                              ]),
                              _: 1
                            })) : (vueExports.openBlock(), vueExports.createBlock("span", {
                              key: 3,
                              class: "text-slate-400"
                            }, "—"))
                          ];
                        }
                      }),
                      "qr-cell": vueExports.withCtx(({ row }, _push4, _parent4, _scopeId3) => {
                        if (_push4) {
                          if (row.original.bank_info) {
                            _push4(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UButton, {
                              icon: "i-lucide-qr-code",
                              size: "xs",
                              variant: "ghost",
                              color: "neutral",
                              title: "QR chuyển khoản",
                              onClick: ($event) => openCommissionQr(row.original.bank_info, row.original.amount, row.original.recipient_name, `${row.original.order_code ?? ""} ${row.original.recipient_name}`)
                            }, null, _parent4, _scopeId3));
                          } else {
                            _push4(`<span class="text-xs text-slate-300"${_scopeId3}>—</span>`);
                          }
                        } else {
                          return [
                            row.original.bank_info ? (vueExports.openBlock(), vueExports.createBlock(_component_UButton, {
                              key: 0,
                              icon: "i-lucide-qr-code",
                              size: "xs",
                              variant: "ghost",
                              color: "neutral",
                              title: "QR chuyển khoản",
                              onClick: ($event) => openCommissionQr(row.original.bank_info, row.original.amount, row.original.recipient_name, `${row.original.order_code ?? ""} ${row.original.recipient_name}`)
                            }, null, 8, ["onClick"])) : (vueExports.openBlock(), vueExports.createBlock("span", {
                              key: 1,
                              class: "text-xs text-slate-300"
                            }, "—"))
                          ];
                        }
                      }),
                      _: 1
                    }, _parent3, _scopeId2));
                  }
                } else {
                  return [
                    vueExports.unref(snapshots).length === 0 ? (vueExports.openBlock(), vueExports.createBlock("div", {
                      key: 0,
                      class: "py-8 text-center text-sm text-[var(--ui-text-muted)]"
                    }, " Chưa có dữ liệu hoa hồng cho bộ lọc này ")) : (vueExports.openBlock(), vueExports.createBlock(_component_UTable, {
                      key: 1,
                      data: vueExports.unref(snapshots),
                      columns: snapshotColumns
                    }, {
                      "order_code-cell": vueExports.withCtx(({ row }) => [
                        vueExports.createVNode(_component_NuxtLink, {
                          to: `/pmc/orders/${row.original.order_id}`,
                          class: "text-[var(--ui-primary)] hover:underline font-medium"
                        }, {
                          default: vueExports.withCtx(() => [
                            vueExports.createTextVNode(vueExports.toDisplayString(row.original.order_code), 1)
                          ]),
                          _: 2
                        }, 1032, ["to"])
                      ]),
                      "recipient_name-cell": vueExports.withCtx(({ row }) => [
                        row.original.account_id ? (vueExports.openBlock(), vueExports.createBlock(_component_NuxtLink, {
                          key: 0,
                          to: `/pmc/accounts/${row.original.account_id}`,
                          class: "text-[var(--ui-primary)] hover:underline font-medium"
                        }, {
                          default: vueExports.withCtx(() => [
                            vueExports.createTextVNode(vueExports.toDisplayString(row.original.recipient_name), 1)
                          ]),
                          _: 2
                        }, 1032, ["to"])) : (vueExports.openBlock(), vueExports.createBlock("span", { key: 1 }, vueExports.toDisplayString(row.original.recipient_name), 1))
                      ]),
                      "recipient_type-cell": vueExports.withCtx(({ row }) => [
                        vueExports.createVNode(_component_UBadge, {
                          color: ("recipientTypeBadgeColor" in _ctx ? _ctx.recipientTypeBadgeColor : vueExports.unref(recipientTypeBadgeColor))(row.original.recipient_type.value),
                          variant: "subtle",
                          label: row.original.recipient_type.label
                        }, null, 8, ["color", "label"])
                      ]),
                      "amount-cell": vueExports.withCtx(({ row }) => [
                        vueExports.createTextVNode(vueExports.toDisplayString(("formatCurrency" in _ctx ? _ctx.formatCurrency : vueExports.unref(formatCurrency))(row.original.amount)), 1)
                      ]),
                      "resolved_from-cell": vueExports.withCtx(({ row }) => [
                        vueExports.createVNode(_component_UBadge, {
                          color: row.original.resolved_from === "override" ? "warning" : "neutral",
                          variant: "subtle",
                          label: row.original.resolved_from === "override" ? "Override" : "Config"
                        }, null, 8, ["color", "label"])
                      ]),
                      "formula-cell": vueExports.withCtx(({ row }) => [
                        vueExports.createTextVNode(vueExports.toDisplayString(buildFormula(row.original)), 1)
                      ]),
                      "payout_status-cell": vueExports.withCtx(({ row }) => [
                        vueExports.createVNode(_component_UBadge, {
                          color: ("payoutStatusBadgeColor" in _ctx ? _ctx.payoutStatusBadgeColor : vueExports.unref(payoutStatusBadgeColor))(row.original.payout_status.value),
                          variant: "subtle",
                          label: row.original.payout_status.label
                        }, null, 8, ["color", "label"])
                      ]),
                      "cash_transaction-cell": vueExports.withCtx(({ row }) => [
                        row.original.payout_status.value === "unpaid" ? (vueExports.openBlock(), vueExports.createBlock("span", {
                          key: 0,
                          class: "text-slate-400"
                        }, "—")) : row.original.cash_transaction ? (vueExports.openBlock(), vueExports.createBlock(_component_UTooltip, {
                          key: 1,
                          text: `Đã chi ra quỹ: ${row.original.cash_transaction.code}`
                        }, {
                          default: vueExports.withCtx(() => [
                            vueExports.createVNode(_component_NuxtLink, {
                              to: "/pmc/finance/treasury",
                              class: "flex items-center gap-1 text-[var(--ui-success)] hover:underline text-sm font-mono"
                            }, {
                              default: vueExports.withCtx(() => [
                                vueExports.createVNode(_component_UIcon, {
                                  name: "i-lucide-check-circle",
                                  class: "size-3.5 shrink-0"
                                }),
                                vueExports.createTextVNode(" " + vueExports.toDisplayString(row.original.cash_transaction.code), 1)
                              ]),
                              _: 2
                            }, 1024)
                          ]),
                          _: 2
                        }, 1032, ["text"])) : row.original.payout_status.value === "paid" ? (vueExports.openBlock(), vueExports.createBlock(_component_UTooltip, {
                          key: 2,
                          text: "Giao dịch quỹ đã bị huỷ"
                        }, {
                          default: vueExports.withCtx(() => [
                            vueExports.createVNode("span", { class: "flex items-center gap-1 text-[var(--ui-warning)]" }, [
                              vueExports.createVNode(_component_UIcon, {
                                name: "i-lucide-alert-triangle",
                                class: "size-3.5 shrink-0"
                              }),
                              vueExports.createVNode("span", { class: "text-xs" }, "Đã huỷ")
                            ])
                          ]),
                          _: 1
                        })) : (vueExports.openBlock(), vueExports.createBlock("span", {
                          key: 3,
                          class: "text-slate-400"
                        }, "—"))
                      ]),
                      "qr-cell": vueExports.withCtx(({ row }) => [
                        row.original.bank_info ? (vueExports.openBlock(), vueExports.createBlock(_component_UButton, {
                          key: 0,
                          icon: "i-lucide-qr-code",
                          size: "xs",
                          variant: "ghost",
                          color: "neutral",
                          title: "QR chuyển khoản",
                          onClick: ($event) => openCommissionQr(row.original.bank_info, row.original.amount, row.original.recipient_name, `${row.original.order_code ?? ""} ${row.original.recipient_name}`)
                        }, null, 8, ["onClick"])) : (vueExports.openBlock(), vueExports.createBlock("span", {
                          key: 1,
                          class: "text-xs text-slate-300"
                        }, "—"))
                      ]),
                      _: 1
                    }, 8, ["data"]))
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
          } else {
            return [
              vueExports.createVNode("div", { class: "grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6" }, [
                (vueExports.openBlock(true), vueExports.createBlock(vueExports.Fragment, null, vueExports.renderList(vueExports.unref(kpiCards), (card) => {
                  return vueExports.openBlock(), vueExports.createBlock(_component_UCard, {
                    key: card.label
                  }, {
                    default: vueExports.withCtx(() => [
                      vueExports.createVNode("div", { class: "text-center" }, [
                        vueExports.createVNode("p", { class: "text-xs text-[var(--ui-text-muted)] mb-1" }, vueExports.toDisplayString(card.label), 1),
                        vueExports.createVNode("p", { class: "text-lg font-bold" }, vueExports.toDisplayString(card.value), 1)
                      ])
                    ]),
                    _: 2
                  }, 1024);
                }), 128))
              ]),
              vueExports.createVNode(_component_SharedSectionCard, {
                title: "Hoa hồng theo người / bên nhận",
                compact: "",
                class: "mb-6"
              }, {
                default: vueExports.withCtx(() => [
                  vueExports.unref(byRecipient).length === 0 ? (vueExports.openBlock(), vueExports.createBlock("div", {
                    key: 0,
                    class: "py-8 text-center text-sm text-[var(--ui-text-muted)]"
                  }, " Chưa có dữ liệu hoa hồng cho bộ lọc này ")) : (vueExports.openBlock(), vueExports.createBlock(_component_UTable, {
                    key: 1,
                    data: vueExports.unref(byRecipient),
                    columns: recipientColumns
                  }, {
                    "recipient_name-cell": vueExports.withCtx(({ row }) => [
                      row.original.account_id ? (vueExports.openBlock(), vueExports.createBlock(_component_NuxtLink, {
                        key: 0,
                        to: `/pmc/accounts/${row.original.account_id}`,
                        class: "text-[var(--ui-primary)] hover:underline font-medium"
                      }, {
                        default: vueExports.withCtx(() => [
                          vueExports.createTextVNode(vueExports.toDisplayString(row.original.recipient_name), 1)
                        ]),
                        _: 2
                      }, 1032, ["to"])) : (vueExports.openBlock(), vueExports.createBlock("span", { key: 1 }, vueExports.toDisplayString(row.original.recipient_name), 1))
                    ]),
                    "recipient_type-cell": vueExports.withCtx(({ row }) => [
                      vueExports.createVNode(_component_UBadge, {
                        color: ("recipientTypeBadgeColor" in _ctx ? _ctx.recipientTypeBadgeColor : vueExports.unref(recipientTypeBadgeColor))(row.original.recipient_type.value),
                        variant: "subtle",
                        label: row.original.recipient_type.label
                      }, null, 8, ["color", "label"])
                    ]),
                    "total_amount-cell": vueExports.withCtx(({ row }) => [
                      vueExports.createTextVNode(vueExports.toDisplayString(("formatCurrency" in _ctx ? _ctx.formatCurrency : vueExports.unref(formatCurrency))(row.original.total_amount)), 1)
                    ]),
                    "payout_status-cell": vueExports.withCtx(({ row }) => [
                      vueExports.createVNode(_component_UBadge, {
                        color: ("payoutStatusBadgeColor" in _ctx ? _ctx.payoutStatusBadgeColor : vueExports.unref(payoutStatusBadgeColor))(row.original.payout_status),
                        variant: "subtle",
                        label: ("payoutStatusLabel" in _ctx ? _ctx.payoutStatusLabel : vueExports.unref(payoutStatusLabel))(row.original.payout_status)
                      }, null, 8, ["color", "label"])
                    ]),
                    "qr-cell": vueExports.withCtx(({ row }) => [
                      row.original.bank_info ? (vueExports.openBlock(), vueExports.createBlock(_component_UButton, {
                        key: 0,
                        icon: "i-lucide-qr-code",
                        size: "xs",
                        variant: "ghost",
                        color: "neutral",
                        title: "QR chuyển khoản",
                        onClick: ($event) => openCommissionQr(row.original.bank_info, row.original.total_amount, row.original.recipient_name, `TONG ${row.original.recipient_name}`)
                      }, null, 8, ["onClick"])) : (vueExports.openBlock(), vueExports.createBlock("span", {
                        key: 1,
                        class: "text-xs text-slate-300"
                      }, "—"))
                    ]),
                    "actions-cell": vueExports.withCtx(({ row }) => [
                      vueExports.createVNode("div", { class: "flex items-center gap-1" }, [
                        row.original.payout_status !== "paid" ? (vueExports.openBlock(), vueExports.createBlock(_component_UButton, {
                          key: 0,
                          size: "xs",
                          color: "success",
                          variant: "soft",
                          icon: "i-lucide-check",
                          label: "Thanh toán tổng",
                          loading: vueExports.unref(payoutLoadingKey) === recipientKey(row.original),
                          onClick: ($event) => payRecipientTotal(row.original, "paid")
                        }, null, 8, ["loading", "onClick"])) : vueExports.createCommentVNode("", true),
                        row.original.payout_status !== "unpaid" ? (vueExports.openBlock(), vueExports.createBlock(_component_UButton, {
                          key: 1,
                          size: "xs",
                          color: "warning",
                          variant: "soft",
                          icon: "i-lucide-rotate-ccw",
                          label: "Hoàn tác",
                          loading: vueExports.unref(payoutLoadingKey) === recipientKey(row.original),
                          onClick: ($event) => payRecipientTotal(row.original, "unpaid")
                        }, null, 8, ["loading", "onClick"])) : vueExports.createCommentVNode("", true)
                      ])
                    ]),
                    _: 1
                  }, 8, ["data"]))
                ]),
                _: 1
              }),
              vueExports.createVNode(_component_SharedSectionCard, {
                title: "Chi tiết theo đơn hàng",
                compact: ""
              }, {
                default: vueExports.withCtx(() => [
                  vueExports.unref(snapshots).length === 0 ? (vueExports.openBlock(), vueExports.createBlock("div", {
                    key: 0,
                    class: "py-8 text-center text-sm text-[var(--ui-text-muted)]"
                  }, " Chưa có dữ liệu hoa hồng cho bộ lọc này ")) : (vueExports.openBlock(), vueExports.createBlock(_component_UTable, {
                    key: 1,
                    data: vueExports.unref(snapshots),
                    columns: snapshotColumns
                  }, {
                    "order_code-cell": vueExports.withCtx(({ row }) => [
                      vueExports.createVNode(_component_NuxtLink, {
                        to: `/pmc/orders/${row.original.order_id}`,
                        class: "text-[var(--ui-primary)] hover:underline font-medium"
                      }, {
                        default: vueExports.withCtx(() => [
                          vueExports.createTextVNode(vueExports.toDisplayString(row.original.order_code), 1)
                        ]),
                        _: 2
                      }, 1032, ["to"])
                    ]),
                    "recipient_name-cell": vueExports.withCtx(({ row }) => [
                      row.original.account_id ? (vueExports.openBlock(), vueExports.createBlock(_component_NuxtLink, {
                        key: 0,
                        to: `/pmc/accounts/${row.original.account_id}`,
                        class: "text-[var(--ui-primary)] hover:underline font-medium"
                      }, {
                        default: vueExports.withCtx(() => [
                          vueExports.createTextVNode(vueExports.toDisplayString(row.original.recipient_name), 1)
                        ]),
                        _: 2
                      }, 1032, ["to"])) : (vueExports.openBlock(), vueExports.createBlock("span", { key: 1 }, vueExports.toDisplayString(row.original.recipient_name), 1))
                    ]),
                    "recipient_type-cell": vueExports.withCtx(({ row }) => [
                      vueExports.createVNode(_component_UBadge, {
                        color: ("recipientTypeBadgeColor" in _ctx ? _ctx.recipientTypeBadgeColor : vueExports.unref(recipientTypeBadgeColor))(row.original.recipient_type.value),
                        variant: "subtle",
                        label: row.original.recipient_type.label
                      }, null, 8, ["color", "label"])
                    ]),
                    "amount-cell": vueExports.withCtx(({ row }) => [
                      vueExports.createTextVNode(vueExports.toDisplayString(("formatCurrency" in _ctx ? _ctx.formatCurrency : vueExports.unref(formatCurrency))(row.original.amount)), 1)
                    ]),
                    "resolved_from-cell": vueExports.withCtx(({ row }) => [
                      vueExports.createVNode(_component_UBadge, {
                        color: row.original.resolved_from === "override" ? "warning" : "neutral",
                        variant: "subtle",
                        label: row.original.resolved_from === "override" ? "Override" : "Config"
                      }, null, 8, ["color", "label"])
                    ]),
                    "formula-cell": vueExports.withCtx(({ row }) => [
                      vueExports.createTextVNode(vueExports.toDisplayString(buildFormula(row.original)), 1)
                    ]),
                    "payout_status-cell": vueExports.withCtx(({ row }) => [
                      vueExports.createVNode(_component_UBadge, {
                        color: ("payoutStatusBadgeColor" in _ctx ? _ctx.payoutStatusBadgeColor : vueExports.unref(payoutStatusBadgeColor))(row.original.payout_status.value),
                        variant: "subtle",
                        label: row.original.payout_status.label
                      }, null, 8, ["color", "label"])
                    ]),
                    "cash_transaction-cell": vueExports.withCtx(({ row }) => [
                      row.original.payout_status.value === "unpaid" ? (vueExports.openBlock(), vueExports.createBlock("span", {
                        key: 0,
                        class: "text-slate-400"
                      }, "—")) : row.original.cash_transaction ? (vueExports.openBlock(), vueExports.createBlock(_component_UTooltip, {
                        key: 1,
                        text: `Đã chi ra quỹ: ${row.original.cash_transaction.code}`
                      }, {
                        default: vueExports.withCtx(() => [
                          vueExports.createVNode(_component_NuxtLink, {
                            to: "/pmc/finance/treasury",
                            class: "flex items-center gap-1 text-[var(--ui-success)] hover:underline text-sm font-mono"
                          }, {
                            default: vueExports.withCtx(() => [
                              vueExports.createVNode(_component_UIcon, {
                                name: "i-lucide-check-circle",
                                class: "size-3.5 shrink-0"
                              }),
                              vueExports.createTextVNode(" " + vueExports.toDisplayString(row.original.cash_transaction.code), 1)
                            ]),
                            _: 2
                          }, 1024)
                        ]),
                        _: 2
                      }, 1032, ["text"])) : row.original.payout_status.value === "paid" ? (vueExports.openBlock(), vueExports.createBlock(_component_UTooltip, {
                        key: 2,
                        text: "Giao dịch quỹ đã bị huỷ"
                      }, {
                        default: vueExports.withCtx(() => [
                          vueExports.createVNode("span", { class: "flex items-center gap-1 text-[var(--ui-warning)]" }, [
                            vueExports.createVNode(_component_UIcon, {
                              name: "i-lucide-alert-triangle",
                              class: "size-3.5 shrink-0"
                            }),
                            vueExports.createVNode("span", { class: "text-xs" }, "Đã huỷ")
                          ])
                        ]),
                        _: 1
                      })) : (vueExports.openBlock(), vueExports.createBlock("span", {
                        key: 3,
                        class: "text-slate-400"
                      }, "—"))
                    ]),
                    "qr-cell": vueExports.withCtx(({ row }) => [
                      row.original.bank_info ? (vueExports.openBlock(), vueExports.createBlock(_component_UButton, {
                        key: 0,
                        icon: "i-lucide-qr-code",
                        size: "xs",
                        variant: "ghost",
                        color: "neutral",
                        title: "QR chuyển khoản",
                        onClick: ($event) => openCommissionQr(row.original.bank_info, row.original.amount, row.original.recipient_name, `${row.original.order_code ?? ""} ${row.original.recipient_name}`)
                      }, null, 8, ["onClick"])) : (vueExports.openBlock(), vueExports.createBlock("span", {
                        key: 1,
                        class: "text-xs text-slate-300"
                      }, "—"))
                    ]),
                    _: 1
                  }, 8, ["data"]))
                ]),
                _: 1
              })
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_SharedBankQrModal, {
        open: vueExports.unref(commissionQrOpen),
        "onUpdate:open": ($event) => vueExports.isRef(commissionQrOpen) ? commissionQrOpen.value = $event : null,
        bank: vueExports.unref(commissionQrBank),
        amount: vueExports.unref(commissionQrAmount),
        description: vueExports.unref(commissionQrDescription),
        "recipient-name": vueExports.unref(commissionQrRecipientName),
        title: "QR chi tiền hoa hồng"
      }, null, _parent));
      _push(`</div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = vueExports.useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/pmc/finance/commission-summary/index.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=index-BKHGeRNH.mjs.map
