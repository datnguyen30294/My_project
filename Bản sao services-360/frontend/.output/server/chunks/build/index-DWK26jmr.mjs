import { v as vueExports, p as useRoute$1, j as useToast, u as useSeoMeta, s as serverRenderer_cjs_prodExports, l as _sfc_main$c, _ as __nuxt_component_0$4, aM as _sfc_main$b, k as _sfc_main$h } from './server.mjs';
import { _ as _sfc_main$2 } from './Badge-W93D3Jpz.mjs';
import { _ as __nuxt_component_2 } from './PageError-kZWsA9dh.mjs';
import { _ as _sfc_main$3 } from './Alert-tTsPKADX.mjs';
import { _ as __nuxt_component_4 } from './SectionCard-CH-mG9Mf.mjs';
import { f as formatCurrency } from './currency-DEb2TrW3.mjs';
import { _ as _sfc_main$4 } from './Card-ywPiICev.mjs';
import { _ as __nuxt_component_5$1 } from './FieldDisplay-BM6nmr2i.mjs';
import { _ as _sfc_main$5 } from './Table-17SH0cIR.mjs';
import { _ as _sfc_main$6 } from './Modal-BimZZbNl.mjs';
import { _ as _sfc_main$7 } from './FormField-DFdmv6Lu.mjs';
import { _ as __nuxt_component_5$2 } from './NumberInput-BfLKWOCC.mjs';
import { _ as _sfc_main$8 } from './Select-CZE7Ef6n.mjs';
import { _ as _sfc_main$9 } from './Input-JXN8po_F.mjs';
import { b as useReceivableDetail, c as useReceivableAudits, r as receivableStatusColor, p as paymentReceiptTypeColor, f as formatAgingDays, P as PAYMENT_METHOD_OPTIONS, d as apiUpdatePayment, e as apiCreatePayment, g as clearReceivableCache, h as apiCreateRefund, i as apiMarkCompleted, j as apiWriteOffReceivable } from './useReceivables-eUxCdlsS.mjs';
import { o as orderStatusColor } from './useOrders-Da-CMLMo.mjs';
import { f as formatPhone } from './phone-DErPjpTB.mjs';
import { a as formatDate, f as formatDateTime } from './date-R5YK0ast.mjs';
import { r as reconciliationStatusColor } from './useReconciliations-BSqve17o.mjs';
import { A as AUDIT_EVENT_COLORS, a as AUDIT_EVENT_LABELS, g as getAuditChangedFields } from './audit-BekS3Wny.mjs';
import { b as buildVietQrImageUrl } from './vietqr-D50vgfgj.mjs';
import { u as useBreadcrumb } from './useBreadcrumb-zkNa_uJG.mjs';
import { u as useSettingsGroup, p as parseBankAccountSettings, i as isBankAccountConfigured } from './useSettings-Bc7XNrjh.mjs';
import { s as stickyRight } from './table-z_7x7CvB.mjs';
import { g as getApiErrorMessage } from './apiError-DBrxF9au.mjs';
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
import './DialogTrigger-C3iwCYMu.mjs';
import './FocusScope-BZehoQSg.mjs';
import './utils-DY0Zag2O.mjs';
import './DialogClose-DGkUxau7.mjs';
import './Label-BBgw4vHh.mjs';
import './useDirection-CXYby7CP.mjs';
import './useFormControl-_Lqv8ipK.mjs';
import './PopperArrow-C9hHWuSZ.mjs';
import './useFocusGuards-CJykkUFH.mjs';
import './handleAndDispatchCustomEvent-Bk_AVSSo.mjs';

const _sfc_main$1 = /* @__PURE__ */ vueExports.defineComponent({
  __name: "LifecycleStepper",
  __ssrInlineRender: true,
  props: {
    receivable: {},
    payments: {}
  },
  setup(__props) {
    const props = __props;
    const steps = vueExports.computed(() => {
      const r = props.receivable;
      const list = [];
      list.push({
        key: "issued",
        title: "Phát sinh",
        subtitle: formatCurrency(r.amount),
        icon: "i-lucide-file-plus-2",
        state: "completed",
        time: r.issued_at
      });
      const sorted = [...props.payments].sort((a, b) => {
        const ta = a.paid_at ? new Date(a.paid_at).getTime() : 0;
        const tb = b.paid_at ? new Date(b.paid_at).getTime() : 0;
        if (ta !== tb) return ta - tb;
        return a.id - b.id;
      });
      let collectionIdx = 0;
      let refundIdx = 0;
      for (const p of sorted) {
        const isRefund = p.type.value === "refund";
        if (isRefund) {
          refundIdx++;
          list.push({
            key: `payment-${p.id}`,
            title: refundIdx > 1 ? `Hoàn trả ${refundIdx}` : "Hoàn trả",
            subtitle: `− ${formatCurrency(p.amount)}`,
            icon: "i-lucide-undo-2",
            state: "completed",
            time: p.paid_at
          });
        } else {
          collectionIdx++;
          list.push({
            key: `payment-${p.id}`,
            title: `Lần thanh toán ${collectionIdx}`,
            subtitle: formatCurrency(p.amount),
            icon: "i-lucide-banknote",
            state: "completed",
            time: p.paid_at
          });
        }
      }
      const status = r.status.value;
      switch (status) {
        case "unpaid":
          list.push({
            key: "pending",
            title: "Chờ thu",
            subtitle: formatCurrency(r.outstanding),
            icon: "i-lucide-hourglass",
            state: "active"
          });
          break;
        case "partial":
          list.push({
            key: "partial",
            title: "Còn nợ",
            subtitle: formatCurrency(r.outstanding),
            icon: "i-lucide-circle-dashed",
            state: "active"
          });
          break;
        case "overdue":
          list.push({
            key: "overdue",
            title: "Quá hạn",
            subtitle: formatCurrency(r.outstanding),
            icon: "i-lucide-alarm-clock",
            state: "error"
          });
          break;
        case "paid":
          list.push({
            key: "paid",
            title: "Đã thu đủ",
            icon: "i-lucide-circle-check",
            state: "active"
          });
          break;
        case "overpaid":
          list.push({
            key: "overpaid",
            title: "Thu thừa",
            subtitle: formatCurrency(r.overpaid_amount),
            icon: "i-lucide-circle-alert",
            state: "active"
          });
          break;
        case "completed":
          list.push({
            key: "paid",
            title: "Đã thu đủ",
            icon: "i-lucide-circle-check",
            state: "completed"
          });
          break;
        case "written_off":
          list.push({
            key: "written_off",
            title: "Xóa nợ",
            subtitle: formatCurrency(r.outstanding),
            icon: "i-lucide-x-circle",
            state: "error",
            time: r.updated_at
          });
          break;
      }
      if (status !== "written_off") {
        list.push({
          key: "completed",
          title: "Hoàn thành",
          icon: "i-lucide-circle-check-big",
          state: status === "completed" ? "active" : "default",
          time: status === "completed" ? r.updated_at : null
        });
      }
      return list;
    });
    const colorClasses = {
      completed: {
        indicator: "bg-green-500 text-white border-green-500",
        separator: "bg-green-500"
      },
      active: {
        indicator: "bg-green-500 text-white border-green-500 ring-2 ring-green-200 shadow-sm",
        separator: "bg-green-500"
      },
      error: {
        indicator: "bg-red-500 text-white border-red-500",
        separator: "bg-red-300"
      },
      default: {
        indicator: "bg-white text-slate-400 border-slate-300",
        separator: "bg-slate-200"
      }
    };
    function textColorClass(state) {
      return state === "default" ? "text-slate-400" : "text-slate-700";
    }
    function subtitleColorClass(state) {
      return state === "default" ? "text-slate-300" : "text-slate-500";
    }
    function formatStepTime(dateStr) {
      if (!dateStr) return "";
      const d = new Date(dateStr);
      if (Number.isNaN(d.getTime())) return "";
      const pad = (n) => String(n).padStart(2, "0");
      return `${pad(d.getDate())}/${pad(d.getMonth() + 1)}/${d.getFullYear()} ${pad(d.getHours())}:${pad(d.getMinutes())}`;
    }
    const minWidth = vueExports.computed(() => `${Math.max(600, steps.value.length * 120)}px`);
    return (_ctx, _push, _parent, _attrs) => {
      const _component_UIcon = _sfc_main$h;
      _push(`<div${serverRenderer_cjs_prodExports.ssrRenderAttrs(vueExports.mergeProps({ class: "overflow-x-auto overflow-y-visible -mx-1 px-1 py-2" }, _attrs))}><div class="flex items-start" style="${serverRenderer_cjs_prodExports.ssrRenderStyle({ minWidth: vueExports.unref(minWidth) })}"><!--[-->`);
      serverRenderer_cjs_prodExports.ssrRenderList(vueExports.unref(steps), (step, index) => {
        _push(`<div class="flex flex-col items-center flex-1 relative"><div class="flex items-center w-full">`);
        if (index > 0) {
          _push(`<div class="${serverRenderer_cjs_prodExports.ssrRenderClass([colorClasses[step.state].separator, "h-0.5 flex-1 transition-colors"])}"></div>`);
        } else {
          _push(`<div class="flex-1"></div>`);
        }
        _push(`<div class="${serverRenderer_cjs_prodExports.ssrRenderClass([colorClasses[step.state].indicator, "relative size-8 rounded-full border-2 flex items-center justify-center transition-all shrink-0"])}">`);
        _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UIcon, {
          name: step.icon,
          class: "size-4"
        }, null, _parent));
        _push(`</div>`);
        if (index < vueExports.unref(steps).length - 1) {
          _push(`<div class="${serverRenderer_cjs_prodExports.ssrRenderClass([colorClasses[vueExports.unref(steps)[index + 1].state].separator, "h-0.5 flex-1 transition-colors"])}"></div>`);
        } else {
          _push(`<div class="flex-1"></div>`);
        }
        _push(`</div><span class="${serverRenderer_cjs_prodExports.ssrRenderClass([textColorClass(step.state), "text-xs font-medium mt-1.5 text-center leading-tight"])}">${serverRenderer_cjs_prodExports.ssrInterpolate(step.title)}</span>`);
        if (step.subtitle) {
          _push(`<span class="${serverRenderer_cjs_prodExports.ssrRenderClass([subtitleColorClass(step.state), "text-[11px] font-semibold text-center leading-tight mt-0.5"])}">${serverRenderer_cjs_prodExports.ssrInterpolate(step.subtitle)}</span>`);
        } else {
          _push(`<!---->`);
        }
        if (step.time) {
          _push(`<span class="${serverRenderer_cjs_prodExports.ssrRenderClass([subtitleColorClass(step.state), "text-[11px] text-center leading-tight mt-0.5"])}">${serverRenderer_cjs_prodExports.ssrInterpolate(formatStepTime(step.time))}</span>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</div>`);
      });
      _push(`<!--]--></div></div>`);
    };
  }
});
const _sfc_setup$1 = _sfc_main$1.setup;
_sfc_main$1.setup = (props, ctx) => {
  const ssrContext = vueExports.useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/shared/receivable/LifecycleStepper.vue");
  return _sfc_setup$1 ? _sfc_setup$1(props, ctx) : void 0;
};
const __nuxt_component_5 = Object.assign(_sfc_main$1, { __name: "SharedReceivableLifecycleStepper" });
const _sfc_main = /* @__PURE__ */ vueExports.defineComponent({
  __name: "index",
  __ssrInlineRender: true,
  setup(__props) {
    const route = useRoute$1();
    const id = vueExports.computed(() => Number(route.params.id));
    const toast = useToast();
    const { data, status, error, refresh } = useReceivableDetail(id);
    const receivable = vueExports.computed(() => data.value?.data);
    const { useDynamicLabel } = useBreadcrumb();
    useDynamicLabel(vueExports.computed(
      () => receivable.value?.order ? `Công nợ đơn ${receivable.value.order.code}` : null
    ));
    useSeoMeta({
      title: vueExports.computed(
        () => receivable.value?.order ? `Công nợ ${receivable.value.order.code}` : "Chi tiết công nợ"
      )
    });
    const { data: bankSettingsData } = useSettingsGroup("bank_account");
    const bankSettings = vueExports.computed(() => parseBankAccountSettings(bankSettingsData.value?.data));
    const bankConfigured = vueExports.computed(() => isBankAccountConfigured(bankSettings.value));
    const { data: auditsData, refresh: refreshAudits } = useReceivableAudits(id);
    const audits = vueExports.computed(() => auditsData.value?.data ?? []);
    const RECEIVABLE_AUDIT_FIELD_LABELS = {
      status: "Trạng thái",
      amount: "Phải thu",
      paid_amount: "Đã thu",
      due_date: "Hạn thanh toán",
      issued_at: "Ngày phát sinh",
      payment_method: "Phương thức",
      note: "Ghi chú",
      paid_at: "Ngày thu"
    };
    const RECEIVABLE_AUDIT_DATETIME_FIELDS = /* @__PURE__ */ new Set(["issued_at", "paid_at", "due_date"]);
    const AUDITABLE_TYPE_LABELS = {
      receivable: "Công nợ",
      payment_receipt: "Phiếu thu"
    };
    function getChangedFields(audit) {
      return getAuditChangedFields(audit, RECEIVABLE_AUDIT_FIELD_LABELS, RECEIVABLE_AUDIT_DATETIME_FIELDS);
    }
    const canCollect = vueExports.computed(() => receivable.value?.can_collect ?? false);
    const canRefund = vueExports.computed(() => receivable.value?.can_refund ?? false);
    const canComplete = vueExports.computed(() => receivable.value?.can_complete ?? false);
    const isTerminal = vueExports.computed(() => {
      const s = receivable.value?.status.value;
      return s === "completed" || s === "written_off";
    });
    const payments = vueExports.computed(() => {
      const raw = receivable.value?.payments;
      if (!raw || raw.length === 0) return [];
      if (typeof raw[0] === "string") return [];
      return raw;
    });
    const reconciliationProgress = vueExports.computed(() => {
      const p = receivable.value?.reconciliation_progress;
      return {
        total: Number(p?.total ?? 0),
        reconciled: Number(p?.reconciled ?? 0),
        pending: Number(p?.pending ?? 0)
      };
    });
    const reconciliationPercent = vueExports.computed(() => {
      const p = reconciliationProgress.value;
      return p.total > 0 ? Math.round(p.reconciled / p.total * 100) : 0;
    });
    const statusAlertConfig = vueExports.computed(() => {
      if (!receivable.value) return null;
      const s = receivable.value.status.value;
      const outstanding = formatCurrency(receivable.value.outstanding);
      const dueDate = formatDate(receivable.value.due_date);
      const overpaid = formatCurrency(receivable.value.overpaid_amount);
      switch (s) {
        case "unpaid":
          return { color: "neutral", title: "Chưa thu", description: `Chưa thu. Hạn thanh toán: ${dueDate}.` };
        case "partial":
          return { color: "warning", title: "Thu một phần", description: `Còn nợ ${outstanding}.` };
        case "paid":
          return { color: "success", title: "Đã thu đủ", description: "Đã thu đủ toàn bộ số tiền phải thu." };
        case "overpaid":
          return { color: "info", title: "Thu thừa", description: `Thu thừa ${overpaid}. Vui lòng ghi nhận hoàn trả.` };
        case "overdue":
          return { color: "error", title: "Quá hạn", description: `Quá hạn thanh toán. Còn nợ ${outstanding}.` };
        case "completed":
          return { color: "success", title: "Hoàn thành", description: "Đã thu đủ và đối soát hoàn tất." };
        case "written_off":
          return { color: "neutral", title: "Xóa nợ", description: "Khoản nợ đã được xóa." };
        default:
          return null;
      }
    });
    const paymentColumns = [
      { id: "type", header: "Loại" },
      { id: "paid_at", header: "Ngày" },
      { id: "amount", header: "Số tiền" },
      { id: "payment_method", header: "Phương thức" },
      { id: "collected_by", header: "Người thực hiện" },
      { id: "reconciliation_status", header: "Đối soát" },
      { id: "note", header: "Ghi chú" },
      stickyRight({ id: "actions", header: "" })
    ];
    const showPaymentModal = vueExports.ref(false);
    const isSubmittingPayment = vueExports.ref(false);
    const editingPaymentId = vueExports.ref(null);
    const isEditMode = vueExports.computed(() => editingPaymentId.value !== null);
    const paymentForm = vueExports.reactive({
      amount: null,
      payment_method: "transfer",
      paid_at: (/* @__PURE__ */ new Date()).toISOString().slice(0, 10),
      note: ""
    });
    function openPaymentModal() {
      editingPaymentId.value = null;
      paymentForm.amount = null;
      paymentForm.payment_method = "transfer";
      paymentForm.paid_at = (/* @__PURE__ */ new Date()).toISOString().slice(0, 10);
      paymentForm.note = "";
      showPaymentModal.value = true;
    }
    function openEditPaymentModal(payment) {
      editingPaymentId.value = payment.id;
      paymentForm.amount = parseFloat(payment.amount);
      paymentForm.payment_method = payment.payment_method.value;
      paymentForm.paid_at = payment.paid_at ? payment.paid_at.slice(0, 10) : (/* @__PURE__ */ new Date()).toISOString().slice(0, 10);
      paymentForm.note = payment.note ?? "";
      showPaymentModal.value = true;
    }
    const isOverpaymentWarning = vueExports.computed(() => {
      const amt = paymentForm.amount;
      const outstanding = parseFloat(receivable.value?.outstanding ?? "0");
      return amt !== null && amt > outstanding && !isEditMode.value;
    });
    const isPaymentValid = vueExports.computed(() => {
      const amt = paymentForm.amount;
      return amt !== null && amt > 0;
    });
    async function submitPayment() {
      if (!isPaymentValid.value || !paymentForm.amount) return;
      isSubmittingPayment.value = true;
      try {
        const payload = {
          amount: paymentForm.amount,
          payment_method: paymentForm.payment_method,
          paid_at: paymentForm.paid_at,
          note: paymentForm.note || void 0
        };
        if (isEditMode.value) {
          await apiUpdatePayment(id.value, editingPaymentId.value, payload);
          toast.add({ title: "Đã cập nhật phiếu thu", color: "success" });
        } else {
          await apiCreatePayment(id.value, payload);
          toast.add({ title: "Ghi nhận thu tiền thành công", color: "success" });
        }
        showPaymentModal.value = false;
        clearReceivableCache(id.value);
        await Promise.all([refresh(), refreshAudits()]);
      } catch (err) {
        toast.add({ title: getApiErrorMessage(err, isEditMode.value ? "Cập nhật thất bại" : "Ghi nhận thất bại"), color: "error" });
      } finally {
        isSubmittingPayment.value = false;
      }
    }
    const showRefundModal = vueExports.ref(false);
    const isSubmittingRefund = vueExports.ref(false);
    const refundForm = vueExports.reactive({
      amount: null,
      payment_method: "transfer",
      paid_at: (/* @__PURE__ */ new Date()).toISOString().slice(0, 10),
      note: ""
    });
    const maxRefundAmount = vueExports.computed(() => parseFloat(receivable.value?.overpaid_amount ?? "0"));
    function openRefundModal() {
      refundForm.amount = null;
      refundForm.payment_method = "transfer";
      refundForm.paid_at = (/* @__PURE__ */ new Date()).toISOString().slice(0, 10);
      refundForm.note = "";
      showRefundModal.value = true;
    }
    const isRefundValid = vueExports.computed(() => {
      const amt = refundForm.amount;
      return amt !== null && amt > 0 && amt <= maxRefundAmount.value;
    });
    async function submitRefund() {
      if (!isRefundValid.value || !refundForm.amount) return;
      isSubmittingRefund.value = true;
      try {
        await apiCreateRefund(id.value, {
          amount: refundForm.amount,
          payment_method: refundForm.payment_method,
          paid_at: refundForm.paid_at,
          note: refundForm.note || void 0
        });
        toast.add({ title: "Ghi nhận trả tiền thành công", color: "success" });
        showRefundModal.value = false;
        clearReceivableCache(id.value);
        await Promise.all([refresh(), refreshAudits()]);
      } catch (err) {
        toast.add({ title: getApiErrorMessage(err, "Ghi nhận hoàn trả thất bại"), color: "error" });
      } finally {
        isSubmittingRefund.value = false;
      }
    }
    const showQrModal = vueExports.ref(false);
    const qrModalAmount = vueExports.ref(0);
    const qrModalContext = vueExports.ref("outstanding");
    const qrTransferDescription = vueExports.computed(() => {
      const orderCode = receivable.value?.order?.code;
      return orderCode ? `TT ${orderCode}` : "";
    });
    const qrModalImageUrl = vueExports.computed(() => {
      if (!bankConfigured.value || qrModalAmount.value <= 0) return "";
      return buildVietQrImageUrl({
        bankBin: bankSettings.value.bank_bin,
        accountNumber: bankSettings.value.account_number,
        accountName: bankSettings.value.account_holder,
        amount: qrModalAmount.value,
        description: qrTransferDescription.value
      });
    });
    function openPaymentQrModal(payment) {
      qrModalAmount.value = Math.round(parseFloat(payment.amount) || 0);
      qrModalContext.value = "payment";
      showQrModal.value = true;
    }
    async function downloadQrCode() {
      if (!qrModalImageUrl.value) return;
      try {
        const res = await fetch(qrModalImageUrl.value);
        const blob = await res.blob();
        const objectUrl = URL.createObjectURL(blob);
        const link = (void 0).createElement("a");
        link.href = objectUrl;
        link.download = `qr-${receivable.value?.order?.code ?? "payment"}-${qrModalAmount.value}.jpg`;
        (void 0).body.appendChild(link);
        link.click();
        (void 0).body.removeChild(link);
        URL.revokeObjectURL(objectUrl);
      } catch {
        toast.add({ title: "Không tải được ảnh QR", color: "error" });
      }
    }
    const showCompleteConfirm = vueExports.ref(false);
    const isCompleting = vueExports.ref(false);
    async function submitComplete() {
      isCompleting.value = true;
      try {
        await apiMarkCompleted(id.value);
        toast.add({ title: "Đã hoàn thành khoản công nợ", color: "success" });
        showCompleteConfirm.value = false;
        clearReceivableCache(id.value);
        await Promise.all([refresh(), refreshAudits()]);
      } catch (err) {
        toast.add({ title: getApiErrorMessage(err, "Hoàn thành thất bại"), color: "error" });
      } finally {
        isCompleting.value = false;
      }
    }
    const showWriteOffConfirm = vueExports.ref(false);
    const isWritingOff = vueExports.ref(false);
    const writeOffNote = vueExports.ref("");
    async function submitWriteOff() {
      isWritingOff.value = true;
      try {
        await apiWriteOffReceivable(id.value, {
          note: writeOffNote.value || void 0
        });
        toast.add({ title: "Đã xóa nợ", color: "success" });
        showWriteOffConfirm.value = false;
        clearReceivableCache(id.value);
        await Promise.all([refresh(), refreshAudits()]);
      } catch (err) {
        toast.add({ title: getApiErrorMessage(err, "Xóa nợ thất bại"), color: "error" });
      } finally {
        isWritingOff.value = false;
      }
    }
    return (_ctx, _push, _parent, _attrs) => {
      const _component_UButton = _sfc_main$c;
      const _component_UBadge = _sfc_main$2;
      const _component_SharedCrudPageError = __nuxt_component_2;
      const _component_UAlert = _sfc_main$3;
      const _component_SharedSectionCard = __nuxt_component_4;
      const _component_SharedReceivableLifecycleStepper = __nuxt_component_5;
      const _component_UCard = _sfc_main$4;
      const _component_SharedFieldDisplay = __nuxt_component_5$1;
      const _component_NuxtLink = __nuxt_component_0$4;
      const _component_UTable = _sfc_main$5;
      const _component_UProgress = _sfc_main$b;
      const _component_UIcon = _sfc_main$h;
      const _component_UModal = _sfc_main$6;
      const _component_UFormField = _sfc_main$7;
      const _component_SharedNumberInput = __nuxt_component_5$2;
      const _component_USelect = _sfc_main$8;
      const _component_UInput = _sfc_main$9;
      _push(`<div${serverRenderer_cjs_prodExports.ssrRenderAttrs(_attrs)}><div class="mb-4 sm:mb-6 flex items-center gap-3 sm:gap-4">`);
      _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UButton, {
        icon: "i-lucide-arrow-left",
        color: "neutral",
        variant: "ghost",
        to: "/pmc/receivables",
        class: "shrink-0"
      }, null, _parent));
      _push(`<div class="min-w-0"><div class="flex items-center gap-2 flex-wrap"><h1 class="text-lg sm:text-2xl font-black text-slate-900 tracking-tight"> Chi tiết công nợ </h1>`);
      if (vueExports.unref(receivable)) {
        _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UBadge, {
          label: vueExports.unref(receivable).status.label,
          color: ("receivableStatusColor" in _ctx ? _ctx.receivableStatusColor : vueExports.unref(receivableStatusColor))(vueExports.unref(receivable).status.value),
          variant: "subtle",
          size: "sm"
        }, null, _parent));
      } else {
        _push(`<!---->`);
      }
      _push(`</div><p class="text-slate-500 text-sm mt-0.5">`);
      if (vueExports.unref(receivable)?.order) {
        _push(`<span class="font-mono font-semibold">${serverRenderer_cjs_prodExports.ssrInterpolate(vueExports.unref(receivable).order.code)}</span>`);
      } else {
        _push(`<span>...</span>`);
      }
      _push(`</p></div></div>`);
      if (vueExports.unref(status) === "pending" && !vueExports.unref(receivable)) {
        _push(`<div class="flex flex-col gap-4"><!--[-->`);
        serverRenderer_cjs_prodExports.ssrRenderList(4, (i) => {
          _push(`<div class="h-24 bg-slate-100 rounded-xl animate-pulse"></div>`);
        });
        _push(`<!--]--></div>`);
      } else if (vueExports.unref(error)) {
        _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_SharedCrudPageError, {
          error: vueExports.unref(error),
          retry: vueExports.unref(refresh)
        }, null, _parent));
      } else if (vueExports.unref(receivable)) {
        _push(`<div class="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6"><div class="lg:col-span-2 flex flex-col gap-4 sm:gap-6">`);
        if (vueExports.unref(statusAlertConfig)) {
          _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UAlert, {
            color: vueExports.unref(statusAlertConfig).color,
            variant: "subtle",
            title: vueExports.unref(statusAlertConfig).title,
            description: vueExports.unref(statusAlertConfig).description
          }, null, _parent));
        } else {
          _push(`<!---->`);
        }
        _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_SharedSectionCard, { title: "Giai đoạn công nợ" }, {
          default: vueExports.withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_SharedReceivableLifecycleStepper, {
                receivable: vueExports.unref(receivable),
                payments: vueExports.unref(payments)
              }, null, _parent2, _scopeId));
            } else {
              return [
                vueExports.createVNode(_component_SharedReceivableLifecycleStepper, {
                  receivable: vueExports.unref(receivable),
                  payments: vueExports.unref(payments)
                }, null, 8, ["receivable", "payments"])
              ];
            }
          }),
          _: 1
        }, _parent));
        _push(`<div class="${serverRenderer_cjs_prodExports.ssrRenderClass([vueExports.unref(receivable).status.value === "overpaid" ? "grid-cols-1 sm:grid-cols-4" : "grid-cols-1 sm:grid-cols-3", "grid gap-3 sm:gap-4"])}">`);
        _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UCard, null, {
          default: vueExports.withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`<div class="text-xs text-slate-500 mb-1"${_scopeId}> Phải thu </div><div class="text-lg font-bold text-slate-900"${_scopeId}>${serverRenderer_cjs_prodExports.ssrInterpolate(("formatCurrency" in _ctx ? _ctx.formatCurrency : vueExports.unref(formatCurrency))(vueExports.unref(receivable).amount))}</div>`);
            } else {
              return [
                vueExports.createVNode("div", { class: "text-xs text-slate-500 mb-1" }, " Phải thu "),
                vueExports.createVNode("div", { class: "text-lg font-bold text-slate-900" }, vueExports.toDisplayString(("formatCurrency" in _ctx ? _ctx.formatCurrency : vueExports.unref(formatCurrency))(vueExports.unref(receivable).amount)), 1)
              ];
            }
          }),
          _: 1
        }, _parent));
        _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UCard, null, {
          default: vueExports.withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`<div class="text-xs text-slate-500 mb-1"${_scopeId}> Đã thu </div><div class="text-lg font-bold text-[var(--ui-success)]"${_scopeId}>${serverRenderer_cjs_prodExports.ssrInterpolate(("formatCurrency" in _ctx ? _ctx.formatCurrency : vueExports.unref(formatCurrency))(vueExports.unref(receivable).paid_amount))}</div>`);
            } else {
              return [
                vueExports.createVNode("div", { class: "text-xs text-slate-500 mb-1" }, " Đã thu "),
                vueExports.createVNode("div", { class: "text-lg font-bold text-[var(--ui-success)]" }, vueExports.toDisplayString(("formatCurrency" in _ctx ? _ctx.formatCurrency : vueExports.unref(formatCurrency))(vueExports.unref(receivable).paid_amount)), 1)
              ];
            }
          }),
          _: 1
        }, _parent));
        _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UCard, null, {
          default: vueExports.withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`<div class="text-xs text-slate-500 mb-1"${_scopeId}> Còn nợ </div><div class="${serverRenderer_cjs_prodExports.ssrRenderClass([parseFloat(vueExports.unref(receivable).outstanding) > 0 ? "text-[var(--ui-warning)]" : "text-[var(--ui-success)]", "text-lg font-bold"])}"${_scopeId}>${serverRenderer_cjs_prodExports.ssrInterpolate(("formatCurrency" in _ctx ? _ctx.formatCurrency : vueExports.unref(formatCurrency))(vueExports.unref(receivable).outstanding))}</div>`);
            } else {
              return [
                vueExports.createVNode("div", { class: "text-xs text-slate-500 mb-1" }, " Còn nợ "),
                vueExports.createVNode("div", {
                  class: ["text-lg font-bold", parseFloat(vueExports.unref(receivable).outstanding) > 0 ? "text-[var(--ui-warning)]" : "text-[var(--ui-success)]"]
                }, vueExports.toDisplayString(("formatCurrency" in _ctx ? _ctx.formatCurrency : vueExports.unref(formatCurrency))(vueExports.unref(receivable).outstanding)), 3)
              ];
            }
          }),
          _: 1
        }, _parent));
        if (vueExports.unref(receivable).status.value === "overpaid") {
          _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UCard, null, {
            default: vueExports.withCtx((_, _push2, _parent2, _scopeId) => {
              if (_push2) {
                _push2(`<div class="text-xs text-slate-500 mb-1"${_scopeId}> Thu thừa </div><div class="text-lg font-bold text-[var(--ui-info)]"${_scopeId}>${serverRenderer_cjs_prodExports.ssrInterpolate(("formatCurrency" in _ctx ? _ctx.formatCurrency : vueExports.unref(formatCurrency))(vueExports.unref(receivable).overpaid_amount))}</div>`);
              } else {
                return [
                  vueExports.createVNode("div", { class: "text-xs text-slate-500 mb-1" }, " Thu thừa "),
                  vueExports.createVNode("div", { class: "text-lg font-bold text-[var(--ui-info)]" }, vueExports.toDisplayString(("formatCurrency" in _ctx ? _ctx.formatCurrency : vueExports.unref(formatCurrency))(vueExports.unref(receivable).overpaid_amount)), 1)
                ];
              }
            }),
            _: 1
          }, _parent));
        } else {
          _push(`<!---->`);
        }
        _push(`</div>`);
        _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_SharedSectionCard, { title: "Thông tin công nợ" }, {
          "header-actions": vueExports.withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UBadge, {
                label: vueExports.unref(receivable).status.label,
                color: ("receivableStatusColor" in _ctx ? _ctx.receivableStatusColor : vueExports.unref(receivableStatusColor))(vueExports.unref(receivable).status.value),
                variant: "subtle",
                size: "sm"
              }, null, _parent2, _scopeId));
            } else {
              return [
                vueExports.createVNode(_component_UBadge, {
                  label: vueExports.unref(receivable).status.label,
                  color: ("receivableStatusColor" in _ctx ? _ctx.receivableStatusColor : vueExports.unref(receivableStatusColor))(vueExports.unref(receivable).status.value),
                  variant: "subtle",
                  size: "sm"
                }, null, 8, ["label", "color"])
              ];
            }
          }),
          default: vueExports.withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`<div class="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5"${_scopeId}>`);
              _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_SharedFieldDisplay, { label: "Đơn hàng" }, {
                default: vueExports.withCtx((_2, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    if (vueExports.unref(receivable).order) {
                      _push3(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_NuxtLink, {
                        to: `/pmc/orders/${vueExports.unref(receivable).order.id}`,
                        class: "text-primary hover:underline font-mono text-sm font-medium"
                      }, {
                        default: vueExports.withCtx((_3, _push4, _parent4, _scopeId3) => {
                          if (_push4) {
                            _push4(`${serverRenderer_cjs_prodExports.ssrInterpolate(vueExports.unref(receivable).order.code)}`);
                          } else {
                            return [
                              vueExports.createTextVNode(vueExports.toDisplayString(vueExports.unref(receivable).order.code), 1)
                            ];
                          }
                        }),
                        _: 1
                      }, _parent3, _scopeId2));
                    } else {
                      _push3(`<span class="text-slate-400"${_scopeId2}>—</span>`);
                    }
                  } else {
                    return [
                      vueExports.unref(receivable).order ? (vueExports.openBlock(), vueExports.createBlock(_component_NuxtLink, {
                        key: 0,
                        to: `/pmc/orders/${vueExports.unref(receivable).order.id}`,
                        class: "text-primary hover:underline font-mono text-sm font-medium"
                      }, {
                        default: vueExports.withCtx(() => [
                          vueExports.createTextVNode(vueExports.toDisplayString(vueExports.unref(receivable).order.code), 1)
                        ]),
                        _: 1
                      }, 8, ["to"])) : (vueExports.openBlock(), vueExports.createBlock("span", {
                        key: 1,
                        class: "text-slate-400"
                      }, "—"))
                    ];
                  }
                }),
                _: 1
              }, _parent2, _scopeId));
              if (vueExports.unref(receivable).order) {
                _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_SharedFieldDisplay, { label: "Trạng thái đơn" }, {
                  default: vueExports.withCtx((_2, _push3, _parent3, _scopeId2) => {
                    if (_push3) {
                      _push3(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UBadge, {
                        label: vueExports.unref(receivable).order.status.label,
                        color: ("orderStatusColor" in _ctx ? _ctx.orderStatusColor : vueExports.unref(orderStatusColor))(vueExports.unref(receivable).order.status.value),
                        variant: "subtle",
                        size: "sm"
                      }, null, _parent3, _scopeId2));
                    } else {
                      return [
                        vueExports.createVNode(_component_UBadge, {
                          label: vueExports.unref(receivable).order.status.label,
                          color: ("orderStatusColor" in _ctx ? _ctx.orderStatusColor : vueExports.unref(orderStatusColor))(vueExports.unref(receivable).order.status.value),
                          variant: "subtle",
                          size: "sm"
                        }, null, 8, ["label", "color"])
                      ];
                    }
                  }),
                  _: 1
                }, _parent2, _scopeId));
              } else {
                _push2(`<!---->`);
              }
              _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_SharedFieldDisplay, { label: "Khách hàng" }, {
                default: vueExports.withCtx((_2, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    if (vueExports.unref(receivable).og_ticket?.customer) {
                      _push3(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_NuxtLink, {
                        to: `/pmc/customers/${vueExports.unref(receivable).og_ticket.customer.id}`,
                        class: "font-medium text-primary-600 hover:underline"
                      }, {
                        default: vueExports.withCtx((_3, _push4, _parent4, _scopeId3) => {
                          if (_push4) {
                            _push4(`${serverRenderer_cjs_prodExports.ssrInterpolate(vueExports.unref(receivable).og_ticket.customer.full_name)}`);
                          } else {
                            return [
                              vueExports.createTextVNode(vueExports.toDisplayString(vueExports.unref(receivable).og_ticket.customer.full_name), 1)
                            ];
                          }
                        }),
                        _: 1
                      }, _parent3, _scopeId2));
                    } else {
                      _push3(`<span${_scopeId2}>${serverRenderer_cjs_prodExports.ssrInterpolate(vueExports.unref(receivable).og_ticket?.requester_name ?? "—")}</span>`);
                    }
                  } else {
                    return [
                      vueExports.unref(receivable).og_ticket?.customer ? (vueExports.openBlock(), vueExports.createBlock(_component_NuxtLink, {
                        key: 0,
                        to: `/pmc/customers/${vueExports.unref(receivable).og_ticket.customer.id}`,
                        class: "font-medium text-primary-600 hover:underline"
                      }, {
                        default: vueExports.withCtx(() => [
                          vueExports.createTextVNode(vueExports.toDisplayString(vueExports.unref(receivable).og_ticket.customer.full_name), 1)
                        ]),
                        _: 1
                      }, 8, ["to"])) : (vueExports.openBlock(), vueExports.createBlock("span", { key: 1 }, vueExports.toDisplayString(vueExports.unref(receivable).og_ticket?.requester_name ?? "—"), 1))
                    ];
                  }
                }),
                _: 1
              }, _parent2, _scopeId));
              _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_SharedFieldDisplay, { label: "Số điện thoại" }, {
                default: vueExports.withCtx((_2, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    _push3(`<span class="font-mono"${_scopeId2}>${serverRenderer_cjs_prodExports.ssrInterpolate(("formatPhone" in _ctx ? _ctx.formatPhone : vueExports.unref(formatPhone))(vueExports.unref(receivable).og_ticket?.customer?.phone ?? vueExports.unref(receivable).og_ticket?.requester_phone))}</span>`);
                  } else {
                    return [
                      vueExports.createVNode("span", { class: "font-mono" }, vueExports.toDisplayString(("formatPhone" in _ctx ? _ctx.formatPhone : vueExports.unref(formatPhone))(vueExports.unref(receivable).og_ticket?.customer?.phone ?? vueExports.unref(receivable).og_ticket?.requester_phone)), 1)
                    ];
                  }
                }),
                _: 1
              }, _parent2, _scopeId));
              _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_SharedFieldDisplay, { label: "Căn hộ" }, {
                default: vueExports.withCtx((_2, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    _push3(`${serverRenderer_cjs_prodExports.ssrInterpolate(vueExports.unref(receivable).og_ticket?.apartment_name ?? "—")}`);
                  } else {
                    return [
                      vueExports.createTextVNode(vueExports.toDisplayString(vueExports.unref(receivable).og_ticket?.apartment_name ?? "—"), 1)
                    ];
                  }
                }),
                _: 1
              }, _parent2, _scopeId));
              _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_SharedFieldDisplay, { label: "Dự án" }, {
                default: vueExports.withCtx((_2, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    _push3(`${serverRenderer_cjs_prodExports.ssrInterpolate(vueExports.unref(receivable).project?.name ?? "—")}`);
                  } else {
                    return [
                      vueExports.createTextVNode(vueExports.toDisplayString(vueExports.unref(receivable).project?.name ?? "—"), 1)
                    ];
                  }
                }),
                _: 1
              }, _parent2, _scopeId));
              _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_SharedFieldDisplay, { label: "Ngày phát sinh" }, {
                default: vueExports.withCtx((_2, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    _push3(`${serverRenderer_cjs_prodExports.ssrInterpolate(("formatDateTime" in _ctx ? _ctx.formatDateTime : vueExports.unref(formatDateTime))(vueExports.unref(receivable).issued_at))}`);
                  } else {
                    return [
                      vueExports.createTextVNode(vueExports.toDisplayString(("formatDateTime" in _ctx ? _ctx.formatDateTime : vueExports.unref(formatDateTime))(vueExports.unref(receivable).issued_at)), 1)
                    ];
                  }
                }),
                _: 1
              }, _parent2, _scopeId));
              _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_SharedFieldDisplay, { label: "Hạn thanh toán" }, {
                default: vueExports.withCtx((_2, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    _push3(`${serverRenderer_cjs_prodExports.ssrInterpolate(("formatDate" in _ctx ? _ctx.formatDate : vueExports.unref(formatDate))(vueExports.unref(receivable).due_date))}`);
                  } else {
                    return [
                      vueExports.createTextVNode(vueExports.toDisplayString(("formatDate" in _ctx ? _ctx.formatDate : vueExports.unref(formatDate))(vueExports.unref(receivable).due_date)), 1)
                    ];
                  }
                }),
                _: 1
              }, _parent2, _scopeId));
              _push2(`</div>`);
            } else {
              return [
                vueExports.createVNode("div", { class: "grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5" }, [
                  vueExports.createVNode(_component_SharedFieldDisplay, { label: "Đơn hàng" }, {
                    default: vueExports.withCtx(() => [
                      vueExports.unref(receivable).order ? (vueExports.openBlock(), vueExports.createBlock(_component_NuxtLink, {
                        key: 0,
                        to: `/pmc/orders/${vueExports.unref(receivable).order.id}`,
                        class: "text-primary hover:underline font-mono text-sm font-medium"
                      }, {
                        default: vueExports.withCtx(() => [
                          vueExports.createTextVNode(vueExports.toDisplayString(vueExports.unref(receivable).order.code), 1)
                        ]),
                        _: 1
                      }, 8, ["to"])) : (vueExports.openBlock(), vueExports.createBlock("span", {
                        key: 1,
                        class: "text-slate-400"
                      }, "—"))
                    ]),
                    _: 1
                  }),
                  vueExports.unref(receivable).order ? (vueExports.openBlock(), vueExports.createBlock(_component_SharedFieldDisplay, {
                    key: 0,
                    label: "Trạng thái đơn"
                  }, {
                    default: vueExports.withCtx(() => [
                      vueExports.createVNode(_component_UBadge, {
                        label: vueExports.unref(receivable).order.status.label,
                        color: ("orderStatusColor" in _ctx ? _ctx.orderStatusColor : vueExports.unref(orderStatusColor))(vueExports.unref(receivable).order.status.value),
                        variant: "subtle",
                        size: "sm"
                      }, null, 8, ["label", "color"])
                    ]),
                    _: 1
                  })) : vueExports.createCommentVNode("", true),
                  vueExports.createVNode(_component_SharedFieldDisplay, { label: "Khách hàng" }, {
                    default: vueExports.withCtx(() => [
                      vueExports.unref(receivable).og_ticket?.customer ? (vueExports.openBlock(), vueExports.createBlock(_component_NuxtLink, {
                        key: 0,
                        to: `/pmc/customers/${vueExports.unref(receivable).og_ticket.customer.id}`,
                        class: "font-medium text-primary-600 hover:underline"
                      }, {
                        default: vueExports.withCtx(() => [
                          vueExports.createTextVNode(vueExports.toDisplayString(vueExports.unref(receivable).og_ticket.customer.full_name), 1)
                        ]),
                        _: 1
                      }, 8, ["to"])) : (vueExports.openBlock(), vueExports.createBlock("span", { key: 1 }, vueExports.toDisplayString(vueExports.unref(receivable).og_ticket?.requester_name ?? "—"), 1))
                    ]),
                    _: 1
                  }),
                  vueExports.createVNode(_component_SharedFieldDisplay, { label: "Số điện thoại" }, {
                    default: vueExports.withCtx(() => [
                      vueExports.createVNode("span", { class: "font-mono" }, vueExports.toDisplayString(("formatPhone" in _ctx ? _ctx.formatPhone : vueExports.unref(formatPhone))(vueExports.unref(receivable).og_ticket?.customer?.phone ?? vueExports.unref(receivable).og_ticket?.requester_phone)), 1)
                    ]),
                    _: 1
                  }),
                  vueExports.createVNode(_component_SharedFieldDisplay, { label: "Căn hộ" }, {
                    default: vueExports.withCtx(() => [
                      vueExports.createTextVNode(vueExports.toDisplayString(vueExports.unref(receivable).og_ticket?.apartment_name ?? "—"), 1)
                    ]),
                    _: 1
                  }),
                  vueExports.createVNode(_component_SharedFieldDisplay, { label: "Dự án" }, {
                    default: vueExports.withCtx(() => [
                      vueExports.createTextVNode(vueExports.toDisplayString(vueExports.unref(receivable).project?.name ?? "—"), 1)
                    ]),
                    _: 1
                  }),
                  vueExports.createVNode(_component_SharedFieldDisplay, { label: "Ngày phát sinh" }, {
                    default: vueExports.withCtx(() => [
                      vueExports.createTextVNode(vueExports.toDisplayString(("formatDateTime" in _ctx ? _ctx.formatDateTime : vueExports.unref(formatDateTime))(vueExports.unref(receivable).issued_at)), 1)
                    ]),
                    _: 1
                  }),
                  vueExports.createVNode(_component_SharedFieldDisplay, { label: "Hạn thanh toán" }, {
                    default: vueExports.withCtx(() => [
                      vueExports.createTextVNode(vueExports.toDisplayString(("formatDate" in _ctx ? _ctx.formatDate : vueExports.unref(formatDate))(vueExports.unref(receivable).due_date)), 1)
                    ]),
                    _: 1
                  })
                ])
              ];
            }
          }),
          _: 1
        }, _parent));
        _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_SharedSectionCard, {
          title: `Lịch sử dòng tiền (${vueExports.unref(payments).length})`
        }, {
          "header-actions": vueExports.withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`<div class="flex items-center gap-2"${_scopeId}>`);
              _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UButton, {
                icon: "i-lucide-file-search",
                label: "Đối soát",
                size: "sm",
                color: "neutral",
                variant: "ghost",
                to: "/pmc/finance/reconciliation"
              }, null, _parent2, _scopeId));
              if (vueExports.unref(canCollect)) {
                _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UButton, {
                  icon: "i-lucide-plus",
                  label: "Ghi nhận thu tiền",
                  size: "sm",
                  color: "primary",
                  variant: "soft",
                  onClick: openPaymentModal
                }, null, _parent2, _scopeId));
              } else {
                _push2(`<!---->`);
              }
              if (vueExports.unref(canRefund)) {
                _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UButton, {
                  icon: "i-lucide-undo-2",
                  label: "Ghi nhận trả tiền",
                  size: "sm",
                  class: "bg-rose-800 text-white hover:bg-rose-900 active:bg-rose-900 focus-visible:outline-rose-800",
                  onClick: openRefundModal
                }, null, _parent2, _scopeId));
              } else {
                _push2(`<!---->`);
              }
              _push2(`</div>`);
            } else {
              return [
                vueExports.createVNode("div", { class: "flex items-center gap-2" }, [
                  vueExports.createVNode(_component_UButton, {
                    icon: "i-lucide-file-search",
                    label: "Đối soát",
                    size: "sm",
                    color: "neutral",
                    variant: "ghost",
                    to: "/pmc/finance/reconciliation"
                  }),
                  vueExports.unref(canCollect) ? (vueExports.openBlock(), vueExports.createBlock(_component_UButton, {
                    key: 0,
                    icon: "i-lucide-plus",
                    label: "Ghi nhận thu tiền",
                    size: "sm",
                    color: "primary",
                    variant: "soft",
                    onClick: openPaymentModal
                  })) : vueExports.createCommentVNode("", true),
                  vueExports.unref(canRefund) ? (vueExports.openBlock(), vueExports.createBlock(_component_UButton, {
                    key: 1,
                    icon: "i-lucide-undo-2",
                    label: "Ghi nhận trả tiền",
                    size: "sm",
                    class: "bg-rose-800 text-white hover:bg-rose-900 active:bg-rose-900 focus-visible:outline-rose-800",
                    onClick: openRefundModal
                  })) : vueExports.createCommentVNode("", true)
                ])
              ];
            }
          }),
          default: vueExports.withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              if (vueExports.unref(payments).length > 0) {
                _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UTable, {
                  data: vueExports.unref(payments),
                  columns: paymentColumns
                }, {
                  "type-cell": vueExports.withCtx(({ row }, _push3, _parent3, _scopeId2) => {
                    if (_push3) {
                      _push3(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UBadge, {
                        label: row.original.type.label,
                        color: ("paymentReceiptTypeColor" in _ctx ? _ctx.paymentReceiptTypeColor : vueExports.unref(paymentReceiptTypeColor))(row.original.type.value),
                        variant: "subtle",
                        size: "sm"
                      }, null, _parent3, _scopeId2));
                    } else {
                      return [
                        vueExports.createVNode(_component_UBadge, {
                          label: row.original.type.label,
                          color: ("paymentReceiptTypeColor" in _ctx ? _ctx.paymentReceiptTypeColor : vueExports.unref(paymentReceiptTypeColor))(row.original.type.value),
                          variant: "subtle",
                          size: "sm"
                        }, null, 8, ["label", "color"])
                      ];
                    }
                  }),
                  "paid_at-cell": vueExports.withCtx(({ row }, _push3, _parent3, _scopeId2) => {
                    if (_push3) {
                      _push3(`${serverRenderer_cjs_prodExports.ssrInterpolate(("formatDateTime" in _ctx ? _ctx.formatDateTime : vueExports.unref(formatDateTime))(row.original.paid_at))}`);
                    } else {
                      return [
                        vueExports.createTextVNode(vueExports.toDisplayString(("formatDateTime" in _ctx ? _ctx.formatDateTime : vueExports.unref(formatDateTime))(row.original.paid_at)), 1)
                      ];
                    }
                  }),
                  "amount-cell": vueExports.withCtx(({ row }, _push3, _parent3, _scopeId2) => {
                    if (_push3) {
                      _push3(`<span class="font-medium"${_scopeId2}>${serverRenderer_cjs_prodExports.ssrInterpolate(("formatCurrency" in _ctx ? _ctx.formatCurrency : vueExports.unref(formatCurrency))(row.original.amount))}</span>`);
                    } else {
                      return [
                        vueExports.createVNode("span", { class: "font-medium" }, vueExports.toDisplayString(("formatCurrency" in _ctx ? _ctx.formatCurrency : vueExports.unref(formatCurrency))(row.original.amount)), 1)
                      ];
                    }
                  }),
                  "payment_method-cell": vueExports.withCtx(({ row }, _push3, _parent3, _scopeId2) => {
                    if (_push3) {
                      _push3(`${serverRenderer_cjs_prodExports.ssrInterpolate(row.original.payment_method.label)}`);
                    } else {
                      return [
                        vueExports.createTextVNode(vueExports.toDisplayString(row.original.payment_method.label), 1)
                      ];
                    }
                  }),
                  "collected_by-cell": vueExports.withCtx(({ row }, _push3, _parent3, _scopeId2) => {
                    if (_push3) {
                      _push3(`${serverRenderer_cjs_prodExports.ssrInterpolate(row.original.collected_by?.name ?? "—")}`);
                    } else {
                      return [
                        vueExports.createTextVNode(vueExports.toDisplayString(row.original.collected_by?.name ?? "—"), 1)
                      ];
                    }
                  }),
                  "reconciliation_status-cell": vueExports.withCtx(({ row }, _push3, _parent3, _scopeId2) => {
                    if (_push3) {
                      if (row.original.reconciliation_status) {
                        _push3(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UBadge, {
                          label: row.original.reconciliation_status.label,
                          color: ("reconciliationStatusColor" in _ctx ? _ctx.reconciliationStatusColor : vueExports.unref(reconciliationStatusColor))(row.original.reconciliation_status.value),
                          variant: "subtle",
                          size: "sm"
                        }, null, _parent3, _scopeId2));
                      } else {
                        _push3(`<span class="text-slate-400"${_scopeId2}>—</span>`);
                      }
                    } else {
                      return [
                        row.original.reconciliation_status ? (vueExports.openBlock(), vueExports.createBlock(_component_UBadge, {
                          key: 0,
                          label: row.original.reconciliation_status.label,
                          color: ("reconciliationStatusColor" in _ctx ? _ctx.reconciliationStatusColor : vueExports.unref(reconciliationStatusColor))(row.original.reconciliation_status.value),
                          variant: "subtle",
                          size: "sm"
                        }, null, 8, ["label", "color"])) : (vueExports.openBlock(), vueExports.createBlock("span", {
                          key: 1,
                          class: "text-slate-400"
                        }, "—"))
                      ];
                    }
                  }),
                  "note-cell": vueExports.withCtx(({ row }, _push3, _parent3, _scopeId2) => {
                    if (_push3) {
                      _push3(`${serverRenderer_cjs_prodExports.ssrInterpolate(row.original.note ?? "—")}`);
                    } else {
                      return [
                        vueExports.createTextVNode(vueExports.toDisplayString(row.original.note ?? "—"), 1)
                      ];
                    }
                  }),
                  "actions-cell": vueExports.withCtx(({ row }, _push3, _parent3, _scopeId2) => {
                    if (_push3) {
                      _push3(`<div class="flex gap-1"${_scopeId2}>`);
                      _push3(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UButton, {
                        icon: "i-lucide-qr-code",
                        color: "neutral",
                        variant: "ghost",
                        size: "sm",
                        title: "Xem mã QR chuyển khoản",
                        onClick: ($event) => openPaymentQrModal(row.original)
                      }, null, _parent3, _scopeId2));
                      if (row.original.reconciliation_id) {
                        _push3(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UButton, {
                          icon: "i-lucide-file-search",
                          color: "neutral",
                          variant: "ghost",
                          size: "sm",
                          title: "Xem đối soát",
                          to: `/pmc/finance/reconciliation/${row.original.reconciliation_id}`
                        }, null, _parent3, _scopeId2));
                      } else {
                        _push3(`<!---->`);
                      }
                      if (!vueExports.unref(isTerminal)) {
                        _push3(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UButton, {
                          icon: "i-lucide-pencil",
                          color: "neutral",
                          variant: "ghost",
                          size: "sm",
                          title: "Sửa phiếu thu",
                          onClick: ($event) => openEditPaymentModal(row.original)
                        }, null, _parent3, _scopeId2));
                      } else {
                        _push3(`<!---->`);
                      }
                      _push3(`</div>`);
                    } else {
                      return [
                        vueExports.createVNode("div", { class: "flex gap-1" }, [
                          vueExports.createVNode(_component_UButton, {
                            icon: "i-lucide-qr-code",
                            color: "neutral",
                            variant: "ghost",
                            size: "sm",
                            title: "Xem mã QR chuyển khoản",
                            onClick: ($event) => openPaymentQrModal(row.original)
                          }, null, 8, ["onClick"]),
                          row.original.reconciliation_id ? (vueExports.openBlock(), vueExports.createBlock(_component_UButton, {
                            key: 0,
                            icon: "i-lucide-file-search",
                            color: "neutral",
                            variant: "ghost",
                            size: "sm",
                            title: "Xem đối soát",
                            to: `/pmc/finance/reconciliation/${row.original.reconciliation_id}`
                          }, null, 8, ["to"])) : vueExports.createCommentVNode("", true),
                          !vueExports.unref(isTerminal) ? (vueExports.openBlock(), vueExports.createBlock(_component_UButton, {
                            key: 1,
                            icon: "i-lucide-pencil",
                            color: "neutral",
                            variant: "ghost",
                            size: "sm",
                            title: "Sửa phiếu thu",
                            onClick: ($event) => openEditPaymentModal(row.original)
                          }, null, 8, ["onClick"])) : vueExports.createCommentVNode("", true)
                        ])
                      ];
                    }
                  }),
                  _: 1
                }, _parent2, _scopeId));
              } else {
                _push2(`<div class="text-center py-8 text-sm text-slate-400"${_scopeId}><p${_scopeId}>Chưa có dòng tiền nào.</p>`);
                if (vueExports.unref(canCollect)) {
                  _push2(`<p class="mt-1"${_scopeId}> Bấm &#39;Ghi nhận thu tiền&#39; để thêm phiếu thu. </p>`);
                } else {
                  _push2(`<!---->`);
                }
                _push2(`</div>`);
              }
            } else {
              return [
                vueExports.unref(payments).length > 0 ? (vueExports.openBlock(), vueExports.createBlock(_component_UTable, {
                  key: 0,
                  data: vueExports.unref(payments),
                  columns: paymentColumns
                }, {
                  "type-cell": vueExports.withCtx(({ row }) => [
                    vueExports.createVNode(_component_UBadge, {
                      label: row.original.type.label,
                      color: ("paymentReceiptTypeColor" in _ctx ? _ctx.paymentReceiptTypeColor : vueExports.unref(paymentReceiptTypeColor))(row.original.type.value),
                      variant: "subtle",
                      size: "sm"
                    }, null, 8, ["label", "color"])
                  ]),
                  "paid_at-cell": vueExports.withCtx(({ row }) => [
                    vueExports.createTextVNode(vueExports.toDisplayString(("formatDateTime" in _ctx ? _ctx.formatDateTime : vueExports.unref(formatDateTime))(row.original.paid_at)), 1)
                  ]),
                  "amount-cell": vueExports.withCtx(({ row }) => [
                    vueExports.createVNode("span", { class: "font-medium" }, vueExports.toDisplayString(("formatCurrency" in _ctx ? _ctx.formatCurrency : vueExports.unref(formatCurrency))(row.original.amount)), 1)
                  ]),
                  "payment_method-cell": vueExports.withCtx(({ row }) => [
                    vueExports.createTextVNode(vueExports.toDisplayString(row.original.payment_method.label), 1)
                  ]),
                  "collected_by-cell": vueExports.withCtx(({ row }) => [
                    vueExports.createTextVNode(vueExports.toDisplayString(row.original.collected_by?.name ?? "—"), 1)
                  ]),
                  "reconciliation_status-cell": vueExports.withCtx(({ row }) => [
                    row.original.reconciliation_status ? (vueExports.openBlock(), vueExports.createBlock(_component_UBadge, {
                      key: 0,
                      label: row.original.reconciliation_status.label,
                      color: ("reconciliationStatusColor" in _ctx ? _ctx.reconciliationStatusColor : vueExports.unref(reconciliationStatusColor))(row.original.reconciliation_status.value),
                      variant: "subtle",
                      size: "sm"
                    }, null, 8, ["label", "color"])) : (vueExports.openBlock(), vueExports.createBlock("span", {
                      key: 1,
                      class: "text-slate-400"
                    }, "—"))
                  ]),
                  "note-cell": vueExports.withCtx(({ row }) => [
                    vueExports.createTextVNode(vueExports.toDisplayString(row.original.note ?? "—"), 1)
                  ]),
                  "actions-cell": vueExports.withCtx(({ row }) => [
                    vueExports.createVNode("div", { class: "flex gap-1" }, [
                      vueExports.createVNode(_component_UButton, {
                        icon: "i-lucide-qr-code",
                        color: "neutral",
                        variant: "ghost",
                        size: "sm",
                        title: "Xem mã QR chuyển khoản",
                        onClick: ($event) => openPaymentQrModal(row.original)
                      }, null, 8, ["onClick"]),
                      row.original.reconciliation_id ? (vueExports.openBlock(), vueExports.createBlock(_component_UButton, {
                        key: 0,
                        icon: "i-lucide-file-search",
                        color: "neutral",
                        variant: "ghost",
                        size: "sm",
                        title: "Xem đối soát",
                        to: `/pmc/finance/reconciliation/${row.original.reconciliation_id}`
                      }, null, 8, ["to"])) : vueExports.createCommentVNode("", true),
                      !vueExports.unref(isTerminal) ? (vueExports.openBlock(), vueExports.createBlock(_component_UButton, {
                        key: 1,
                        icon: "i-lucide-pencil",
                        color: "neutral",
                        variant: "ghost",
                        size: "sm",
                        title: "Sửa phiếu thu",
                        onClick: ($event) => openEditPaymentModal(row.original)
                      }, null, 8, ["onClick"])) : vueExports.createCommentVNode("", true)
                    ])
                  ]),
                  _: 1
                }, 8, ["data"])) : (vueExports.openBlock(), vueExports.createBlock("div", {
                  key: 1,
                  class: "text-center py-8 text-sm text-slate-400"
                }, [
                  vueExports.createVNode("p", null, "Chưa có dòng tiền nào."),
                  vueExports.unref(canCollect) ? (vueExports.openBlock(), vueExports.createBlock("p", {
                    key: 0,
                    class: "mt-1"
                  }, " Bấm 'Ghi nhận thu tiền' để thêm phiếu thu. ")) : vueExports.createCommentVNode("", true)
                ]))
              ];
            }
          }),
          _: 1
        }, _parent));
        _push(`</div><div class="flex flex-col gap-4">`);
        _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_SharedSectionCard, {
          title: "Hành động",
          compact: ""
        }, {
          default: vueExports.withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`<div class="flex flex-col gap-2"${_scopeId}>`);
              if (vueExports.unref(canCollect)) {
                _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UButton, {
                  label: "Ghi nhận thu tiền",
                  icon: "i-lucide-banknote",
                  color: "primary",
                  class: "w-full",
                  onClick: openPaymentModal
                }, null, _parent2, _scopeId));
              } else {
                _push2(`<!---->`);
              }
              if (vueExports.unref(canComplete)) {
                _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UButton, {
                  label: "Hoàn thành",
                  icon: "i-lucide-check-circle",
                  color: "success",
                  class: "w-full",
                  onClick: ($event) => showCompleteConfirm.value = true
                }, null, _parent2, _scopeId));
              } else {
                _push2(`<!---->`);
              }
              if (vueExports.unref(canCollect)) {
                _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UButton, {
                  label: "Xóa nợ",
                  icon: "i-lucide-x-circle",
                  color: "error",
                  variant: "outline",
                  class: "w-full",
                  onClick: ($event) => showWriteOffConfirm.value = true
                }, null, _parent2, _scopeId));
              } else {
                _push2(`<!---->`);
              }
              if (vueExports.unref(isTerminal)) {
                _push2(`<p class="text-sm text-slate-400 italic"${_scopeId}>`);
                if (vueExports.unref(receivable).status.value === "completed") {
                  _push2(`<!--[--> Khoản công nợ đã hoàn thành. <!--]-->`);
                } else {
                  _push2(`<!--[--> Khoản nợ đã được xóa. <!--]-->`);
                }
                _push2(`</p>`);
              } else {
                _push2(`<!---->`);
              }
              if (vueExports.unref(receivable).status.value === "paid" && !vueExports.unref(canComplete)) {
                _push2(`<p class="text-sm text-slate-400 italic"${_scopeId}> Đã thu đủ. Cần đối soát tất cả dòng tiền để hoàn thành. </p>`);
              } else {
                _push2(`<!---->`);
              }
              _push2(`</div>`);
            } else {
              return [
                vueExports.createVNode("div", { class: "flex flex-col gap-2" }, [
                  vueExports.unref(canCollect) ? (vueExports.openBlock(), vueExports.createBlock(_component_UButton, {
                    key: 0,
                    label: "Ghi nhận thu tiền",
                    icon: "i-lucide-banknote",
                    color: "primary",
                    class: "w-full",
                    onClick: openPaymentModal
                  })) : vueExports.createCommentVNode("", true),
                  vueExports.unref(canComplete) ? (vueExports.openBlock(), vueExports.createBlock(_component_UButton, {
                    key: 1,
                    label: "Hoàn thành",
                    icon: "i-lucide-check-circle",
                    color: "success",
                    class: "w-full",
                    onClick: ($event) => showCompleteConfirm.value = true
                  }, null, 8, ["onClick"])) : vueExports.createCommentVNode("", true),
                  vueExports.unref(canCollect) ? (vueExports.openBlock(), vueExports.createBlock(_component_UButton, {
                    key: 2,
                    label: "Xóa nợ",
                    icon: "i-lucide-x-circle",
                    color: "error",
                    variant: "outline",
                    class: "w-full",
                    onClick: ($event) => showWriteOffConfirm.value = true
                  }, null, 8, ["onClick"])) : vueExports.createCommentVNode("", true),
                  vueExports.unref(isTerminal) ? (vueExports.openBlock(), vueExports.createBlock("p", {
                    key: 3,
                    class: "text-sm text-slate-400 italic"
                  }, [
                    vueExports.unref(receivable).status.value === "completed" ? (vueExports.openBlock(), vueExports.createBlock(vueExports.Fragment, { key: 0 }, [
                      vueExports.createTextVNode(" Khoản công nợ đã hoàn thành. ")
                    ], 64)) : (vueExports.openBlock(), vueExports.createBlock(vueExports.Fragment, { key: 1 }, [
                      vueExports.createTextVNode(" Khoản nợ đã được xóa. ")
                    ], 64))
                  ])) : vueExports.createCommentVNode("", true),
                  vueExports.unref(receivable).status.value === "paid" && !vueExports.unref(canComplete) ? (vueExports.openBlock(), vueExports.createBlock("p", {
                    key: 4,
                    class: "text-sm text-slate-400 italic"
                  }, " Đã thu đủ. Cần đối soát tất cả dòng tiền để hoàn thành. ")) : vueExports.createCommentVNode("", true)
                ])
              ];
            }
          }),
          _: 1
        }, _parent));
        if (vueExports.unref(reconciliationProgress).total > 0) {
          _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_SharedSectionCard, {
            title: "Tiến độ đối soát",
            compact: ""
          }, {
            default: vueExports.withCtx((_, _push2, _parent2, _scopeId) => {
              if (_push2) {
                _push2(`<div class="flex items-center gap-2"${_scopeId}>`);
                _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UProgress, {
                  value: vueExports.unref(reconciliationPercent),
                  color: vueExports.unref(reconciliationPercent) === 100 ? "success" : "warning",
                  class: "flex-1"
                }, null, _parent2, _scopeId));
                _push2(`<span class="text-sm whitespace-nowrap font-medium"${_scopeId}>${serverRenderer_cjs_prodExports.ssrInterpolate(vueExports.unref(reconciliationProgress).reconciled)}/${serverRenderer_cjs_prodExports.ssrInterpolate(vueExports.unref(reconciliationProgress).total)}</span></div>`);
                if (vueExports.unref(reconciliationProgress).pending > 0) {
                  _push2(`<p class="text-sm text-slate-400 mt-1"${_scopeId}> Còn ${serverRenderer_cjs_prodExports.ssrInterpolate(vueExports.unref(reconciliationProgress).pending)} dòng tiền chưa đối soát </p>`);
                } else {
                  _push2(`<!---->`);
                }
                _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_NuxtLink, {
                  to: `/pmc/finance/reconciliation?receivable_id=${vueExports.unref(receivable).id}`,
                  class: "text-sm text-primary hover:underline mt-2 inline-block"
                }, {
                  default: vueExports.withCtx((_2, _push3, _parent3, _scopeId2) => {
                    if (_push3) {
                      _push3(` Xem đối soát (${serverRenderer_cjs_prodExports.ssrInterpolate(vueExports.unref(reconciliationProgress).pending)} chờ) `);
                    } else {
                      return [
                        vueExports.createTextVNode(" Xem đối soát (" + vueExports.toDisplayString(vueExports.unref(reconciliationProgress).pending) + " chờ) ", 1)
                      ];
                    }
                  }),
                  _: 1
                }, _parent2, _scopeId));
              } else {
                return [
                  vueExports.createVNode("div", { class: "flex items-center gap-2" }, [
                    vueExports.createVNode(_component_UProgress, {
                      value: vueExports.unref(reconciliationPercent),
                      color: vueExports.unref(reconciliationPercent) === 100 ? "success" : "warning",
                      class: "flex-1"
                    }, null, 8, ["value", "color"]),
                    vueExports.createVNode("span", { class: "text-sm whitespace-nowrap font-medium" }, vueExports.toDisplayString(vueExports.unref(reconciliationProgress).reconciled) + "/" + vueExports.toDisplayString(vueExports.unref(reconciliationProgress).total), 1)
                  ]),
                  vueExports.unref(reconciliationProgress).pending > 0 ? (vueExports.openBlock(), vueExports.createBlock("p", {
                    key: 0,
                    class: "text-sm text-slate-400 mt-1"
                  }, " Còn " + vueExports.toDisplayString(vueExports.unref(reconciliationProgress).pending) + " dòng tiền chưa đối soát ", 1)) : vueExports.createCommentVNode("", true),
                  vueExports.createVNode(_component_NuxtLink, {
                    to: `/pmc/finance/reconciliation?receivable_id=${vueExports.unref(receivable).id}`,
                    class: "text-sm text-primary hover:underline mt-2 inline-block"
                  }, {
                    default: vueExports.withCtx(() => [
                      vueExports.createTextVNode(" Xem đối soát (" + vueExports.toDisplayString(vueExports.unref(reconciliationProgress).pending) + " chờ) ", 1)
                    ]),
                    _: 1
                  }, 8, ["to"])
                ];
              }
            }),
            _: 1
          }, _parent));
        } else {
          _push(`<!---->`);
        }
        _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_SharedSectionCard, {
          title: "Thông tin",
          compact: ""
        }, {
          default: vueExports.withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`<div class="flex flex-col gap-3"${_scopeId}>`);
              _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_SharedFieldDisplay, { label: "Trạng thái" }, {
                default: vueExports.withCtx((_2, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    _push3(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UBadge, {
                      label: vueExports.unref(receivable).status.label,
                      color: ("receivableStatusColor" in _ctx ? _ctx.receivableStatusColor : vueExports.unref(receivableStatusColor))(vueExports.unref(receivable).status.value),
                      variant: "subtle",
                      size: "sm"
                    }, null, _parent3, _scopeId2));
                  } else {
                    return [
                      vueExports.createVNode(_component_UBadge, {
                        label: vueExports.unref(receivable).status.label,
                        color: ("receivableStatusColor" in _ctx ? _ctx.receivableStatusColor : vueExports.unref(receivableStatusColor))(vueExports.unref(receivable).status.value),
                        variant: "subtle",
                        size: "sm"
                      }, null, 8, ["label", "color"])
                    ];
                  }
                }),
                _: 1
              }, _parent2, _scopeId));
              _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_SharedFieldDisplay, { label: "Tuổi nợ" }, {
                default: vueExports.withCtx((_2, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    _push3(`${serverRenderer_cjs_prodExports.ssrInterpolate(("formatAgingDays" in _ctx ? _ctx.formatAgingDays : vueExports.unref(formatAgingDays))(vueExports.unref(receivable).aging_days, vueExports.unref(receivable).status.value))}`);
                  } else {
                    return [
                      vueExports.createTextVNode(vueExports.toDisplayString(("formatAgingDays" in _ctx ? _ctx.formatAgingDays : vueExports.unref(formatAgingDays))(vueExports.unref(receivable).aging_days, vueExports.unref(receivable).status.value)), 1)
                    ];
                  }
                }),
                _: 1
              }, _parent2, _scopeId));
              _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_SharedFieldDisplay, { label: "Tạo lúc" }, {
                default: vueExports.withCtx((_2, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    _push3(`${serverRenderer_cjs_prodExports.ssrInterpolate(("formatDateTime" in _ctx ? _ctx.formatDateTime : vueExports.unref(formatDateTime))(vueExports.unref(receivable).created_at))}`);
                  } else {
                    return [
                      vueExports.createTextVNode(vueExports.toDisplayString(("formatDateTime" in _ctx ? _ctx.formatDateTime : vueExports.unref(formatDateTime))(vueExports.unref(receivable).created_at)), 1)
                    ];
                  }
                }),
                _: 1
              }, _parent2, _scopeId));
              _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_SharedFieldDisplay, { label: "Cập nhật" }, {
                default: vueExports.withCtx((_2, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    _push3(`${serverRenderer_cjs_prodExports.ssrInterpolate(("formatDateTime" in _ctx ? _ctx.formatDateTime : vueExports.unref(formatDateTime))(vueExports.unref(receivable).updated_at))}`);
                  } else {
                    return [
                      vueExports.createTextVNode(vueExports.toDisplayString(("formatDateTime" in _ctx ? _ctx.formatDateTime : vueExports.unref(formatDateTime))(vueExports.unref(receivable).updated_at)), 1)
                    ];
                  }
                }),
                _: 1
              }, _parent2, _scopeId));
              _push2(`</div>`);
            } else {
              return [
                vueExports.createVNode("div", { class: "flex flex-col gap-3" }, [
                  vueExports.createVNode(_component_SharedFieldDisplay, { label: "Trạng thái" }, {
                    default: vueExports.withCtx(() => [
                      vueExports.createVNode(_component_UBadge, {
                        label: vueExports.unref(receivable).status.label,
                        color: ("receivableStatusColor" in _ctx ? _ctx.receivableStatusColor : vueExports.unref(receivableStatusColor))(vueExports.unref(receivable).status.value),
                        variant: "subtle",
                        size: "sm"
                      }, null, 8, ["label", "color"])
                    ]),
                    _: 1
                  }),
                  vueExports.createVNode(_component_SharedFieldDisplay, { label: "Tuổi nợ" }, {
                    default: vueExports.withCtx(() => [
                      vueExports.createTextVNode(vueExports.toDisplayString(("formatAgingDays" in _ctx ? _ctx.formatAgingDays : vueExports.unref(formatAgingDays))(vueExports.unref(receivable).aging_days, vueExports.unref(receivable).status.value)), 1)
                    ]),
                    _: 1
                  }),
                  vueExports.createVNode(_component_SharedFieldDisplay, { label: "Tạo lúc" }, {
                    default: vueExports.withCtx(() => [
                      vueExports.createTextVNode(vueExports.toDisplayString(("formatDateTime" in _ctx ? _ctx.formatDateTime : vueExports.unref(formatDateTime))(vueExports.unref(receivable).created_at)), 1)
                    ]),
                    _: 1
                  }),
                  vueExports.createVNode(_component_SharedFieldDisplay, { label: "Cập nhật" }, {
                    default: vueExports.withCtx(() => [
                      vueExports.createTextVNode(vueExports.toDisplayString(("formatDateTime" in _ctx ? _ctx.formatDateTime : vueExports.unref(formatDateTime))(vueExports.unref(receivable).updated_at)), 1)
                    ]),
                    _: 1
                  })
                ])
              ];
            }
          }),
          _: 1
        }, _parent));
        if (vueExports.unref(audits).length > 0) {
          _push(`<div class="bg-white border border-border-gray rounded-xl shadow-sm overflow-hidden"><div class="px-5 py-4 border-b border-border-gray"><h2 class="font-bold text-slate-900 text-sm"> Lịch sử thay đổi </h2></div><div class="px-5 py-4 max-h-[500px] overflow-y-auto"><div class="relative"><div class="absolute top-0 bottom-0 left-2.5 w-px bg-slate-200"></div><!--[-->`);
          serverRenderer_cjs_prodExports.ssrRenderList(vueExports.unref(audits), (audit) => {
            _push(`<div class="relative flex gap-3 pb-4 last:pb-0"><div class="relative z-10 flex items-center justify-center size-5 rounded-full bg-white border-2 border-slate-300 shrink-0"><div class="size-1.5 rounded-full bg-slate-400"></div></div><div class="flex-1 min-w-0 -mt-0.5"><div class="flex items-center gap-1.5 flex-wrap">`);
            _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UBadge, {
              label: ("AUDIT_EVENT_LABELS" in _ctx ? _ctx.AUDIT_EVENT_LABELS : vueExports.unref(AUDIT_EVENT_LABELS))[audit.event] ?? audit.event,
              color: ("AUDIT_EVENT_COLORS" in _ctx ? _ctx.AUDIT_EVENT_COLORS : vueExports.unref(AUDIT_EVENT_COLORS))[audit.event] ?? "neutral",
              variant: "subtle",
              size: "xs"
            }, null, _parent));
            _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UBadge, {
              label: AUDITABLE_TYPE_LABELS[audit.auditable_type] ?? audit.auditable_type,
              color: "neutral",
              variant: "outline",
              size: "xs"
            }, null, _parent));
            _push(`</div><p class="text-[11px] text-slate-500 mt-0.5">`);
            if (audit.user) {
              _push(`<span>${serverRenderer_cjs_prodExports.ssrInterpolate(audit.user.name)} · </span>`);
            } else {
              _push(`<!---->`);
            }
            _push(` ${serverRenderer_cjs_prodExports.ssrInterpolate(("formatDateTime" in _ctx ? _ctx.formatDateTime : vueExports.unref(formatDateTime))(audit.created_at))}</p>`);
            if (audit.event !== "created") {
              _push(`<div class="mt-1.5 flex flex-col gap-1"><!--[-->`);
              serverRenderer_cjs_prodExports.ssrRenderList(getChangedFields(audit), (change) => {
                _push(`<div class="text-[11px] leading-relaxed"><span class="font-medium text-slate-600">${serverRenderer_cjs_prodExports.ssrInterpolate(change.field)}:</span><span class="text-red-500 line-through ml-1">${serverRenderer_cjs_prodExports.ssrInterpolate(change.old)}</span>`);
                _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UIcon, {
                  name: "i-lucide-arrow-right",
                  class: "size-3 text-slate-400 mx-0.5 inline-block align-middle"
                }, null, _parent));
                _push(`<span class="text-emerald-600">${serverRenderer_cjs_prodExports.ssrInterpolate(change.new)}</span></div>`);
              });
              _push(`<!--]--></div>`);
            } else {
              _push(`<!---->`);
            }
            _push(`</div></div>`);
          });
          _push(`<!--]--></div></div></div>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</div></div>`);
      } else {
        _push(`<!---->`);
      }
      _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UModal, {
        open: vueExports.unref(showPaymentModal),
        "onUpdate:open": ($event) => vueExports.isRef(showPaymentModal) ? showPaymentModal.value = $event : null,
        title: vueExports.unref(isEditMode) ? "Chỉnh sửa phiếu thu" : "Ghi nhận thu tiền",
        description: `Còn nợ: ${vueExports.unref(receivable) ? ("formatCurrency" in _ctx ? _ctx.formatCurrency : vueExports.unref(formatCurrency))(vueExports.unref(receivable).outstanding) : ""}`
      }, {
        body: vueExports.withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="flex flex-col gap-4"${_scopeId}>`);
            _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UFormField, {
              label: "Số tiền (đ)",
              required: ""
            }, {
              default: vueExports.withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(`<div class="flex gap-2"${_scopeId2}>`);
                  _push3(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_SharedNumberInput, {
                    modelValue: vueExports.unref(paymentForm).amount,
                    "onUpdate:modelValue": ($event) => vueExports.unref(paymentForm).amount = $event,
                    placeholder: "Nhập số tiền",
                    min: 1,
                    class: "flex-1"
                  }, null, _parent3, _scopeId2));
                  if (!vueExports.unref(isEditMode)) {
                    _push3(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UButton, {
                      label: "Tất cả",
                      color: "neutral",
                      variant: "outline",
                      size: "sm",
                      class: "shrink-0",
                      onClick: ($event) => vueExports.unref(paymentForm).amount = parseFloat(vueExports.unref(receivable)?.outstanding ?? "0")
                    }, null, _parent3, _scopeId2));
                  } else {
                    _push3(`<!---->`);
                  }
                  _push3(`</div>`);
                } else {
                  return [
                    vueExports.createVNode("div", { class: "flex gap-2" }, [
                      vueExports.createVNode(_component_SharedNumberInput, {
                        modelValue: vueExports.unref(paymentForm).amount,
                        "onUpdate:modelValue": ($event) => vueExports.unref(paymentForm).amount = $event,
                        placeholder: "Nhập số tiền",
                        min: 1,
                        class: "flex-1"
                      }, null, 8, ["modelValue", "onUpdate:modelValue"]),
                      !vueExports.unref(isEditMode) ? (vueExports.openBlock(), vueExports.createBlock(_component_UButton, {
                        key: 0,
                        label: "Tất cả",
                        color: "neutral",
                        variant: "outline",
                        size: "sm",
                        class: "shrink-0",
                        onClick: ($event) => vueExports.unref(paymentForm).amount = parseFloat(vueExports.unref(receivable)?.outstanding ?? "0")
                      }, null, 8, ["onClick"])) : vueExports.createCommentVNode("", true)
                    ])
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            if (vueExports.unref(isOverpaymentWarning)) {
              _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UAlert, {
                color: "warning",
                variant: "subtle",
                title: "Số tiền vượt quá công nợ",
                description: `Sẽ thu thừa ${("formatCurrency" in _ctx ? _ctx.formatCurrency : vueExports.unref(formatCurrency))(String((vueExports.unref(paymentForm).amount ?? 0) - parseFloat(vueExports.unref(receivable)?.outstanding ?? "0")))}`
              }, null, _parent2, _scopeId));
            } else {
              _push2(`<!---->`);
            }
            _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UFormField, {
              label: "Phương thức",
              required: ""
            }, {
              default: vueExports.withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_USelect, {
                    modelValue: vueExports.unref(paymentForm).payment_method,
                    "onUpdate:modelValue": ($event) => vueExports.unref(paymentForm).payment_method = $event,
                    items: "PAYMENT_METHOD_OPTIONS" in _ctx ? _ctx.PAYMENT_METHOD_OPTIONS : vueExports.unref(PAYMENT_METHOD_OPTIONS),
                    class: "w-full"
                  }, null, _parent3, _scopeId2));
                } else {
                  return [
                    vueExports.createVNode(_component_USelect, {
                      modelValue: vueExports.unref(paymentForm).payment_method,
                      "onUpdate:modelValue": ($event) => vueExports.unref(paymentForm).payment_method = $event,
                      items: "PAYMENT_METHOD_OPTIONS" in _ctx ? _ctx.PAYMENT_METHOD_OPTIONS : vueExports.unref(PAYMENT_METHOD_OPTIONS),
                      class: "w-full"
                    }, null, 8, ["modelValue", "onUpdate:modelValue", "items"])
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UFormField, {
              label: "Ngày thu",
              required: ""
            }, {
              default: vueExports.withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UInput, {
                    modelValue: vueExports.unref(paymentForm).paid_at,
                    "onUpdate:modelValue": ($event) => vueExports.unref(paymentForm).paid_at = $event,
                    type: "date",
                    class: "w-full"
                  }, null, _parent3, _scopeId2));
                } else {
                  return [
                    vueExports.createVNode(_component_UInput, {
                      modelValue: vueExports.unref(paymentForm).paid_at,
                      "onUpdate:modelValue": ($event) => vueExports.unref(paymentForm).paid_at = $event,
                      type: "date",
                      class: "w-full"
                    }, null, 8, ["modelValue", "onUpdate:modelValue"])
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UFormField, { label: "Ghi chú" }, {
              default: vueExports.withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UInput, {
                    modelValue: vueExports.unref(paymentForm).note,
                    "onUpdate:modelValue": ($event) => vueExports.unref(paymentForm).note = $event,
                    placeholder: "Ghi chú (tùy chọn)",
                    maxlength: 500,
                    class: "w-full"
                  }, null, _parent3, _scopeId2));
                } else {
                  return [
                    vueExports.createVNode(_component_UInput, {
                      modelValue: vueExports.unref(paymentForm).note,
                      "onUpdate:modelValue": ($event) => vueExports.unref(paymentForm).note = $event,
                      placeholder: "Ghi chú (tùy chọn)",
                      maxlength: 500,
                      class: "w-full"
                    }, null, 8, ["modelValue", "onUpdate:modelValue"])
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(`</div>`);
          } else {
            return [
              vueExports.createVNode("div", { class: "flex flex-col gap-4" }, [
                vueExports.createVNode(_component_UFormField, {
                  label: "Số tiền (đ)",
                  required: ""
                }, {
                  default: vueExports.withCtx(() => [
                    vueExports.createVNode("div", { class: "flex gap-2" }, [
                      vueExports.createVNode(_component_SharedNumberInput, {
                        modelValue: vueExports.unref(paymentForm).amount,
                        "onUpdate:modelValue": ($event) => vueExports.unref(paymentForm).amount = $event,
                        placeholder: "Nhập số tiền",
                        min: 1,
                        class: "flex-1"
                      }, null, 8, ["modelValue", "onUpdate:modelValue"]),
                      !vueExports.unref(isEditMode) ? (vueExports.openBlock(), vueExports.createBlock(_component_UButton, {
                        key: 0,
                        label: "Tất cả",
                        color: "neutral",
                        variant: "outline",
                        size: "sm",
                        class: "shrink-0",
                        onClick: ($event) => vueExports.unref(paymentForm).amount = parseFloat(vueExports.unref(receivable)?.outstanding ?? "0")
                      }, null, 8, ["onClick"])) : vueExports.createCommentVNode("", true)
                    ])
                  ]),
                  _: 1
                }),
                vueExports.unref(isOverpaymentWarning) ? (vueExports.openBlock(), vueExports.createBlock(_component_UAlert, {
                  key: 0,
                  color: "warning",
                  variant: "subtle",
                  title: "Số tiền vượt quá công nợ",
                  description: `Sẽ thu thừa ${("formatCurrency" in _ctx ? _ctx.formatCurrency : vueExports.unref(formatCurrency))(String((vueExports.unref(paymentForm).amount ?? 0) - parseFloat(vueExports.unref(receivable)?.outstanding ?? "0")))}`
                }, null, 8, ["description"])) : vueExports.createCommentVNode("", true),
                vueExports.createVNode(_component_UFormField, {
                  label: "Phương thức",
                  required: ""
                }, {
                  default: vueExports.withCtx(() => [
                    vueExports.createVNode(_component_USelect, {
                      modelValue: vueExports.unref(paymentForm).payment_method,
                      "onUpdate:modelValue": ($event) => vueExports.unref(paymentForm).payment_method = $event,
                      items: "PAYMENT_METHOD_OPTIONS" in _ctx ? _ctx.PAYMENT_METHOD_OPTIONS : vueExports.unref(PAYMENT_METHOD_OPTIONS),
                      class: "w-full"
                    }, null, 8, ["modelValue", "onUpdate:modelValue", "items"])
                  ]),
                  _: 1
                }),
                vueExports.createVNode(_component_UFormField, {
                  label: "Ngày thu",
                  required: ""
                }, {
                  default: vueExports.withCtx(() => [
                    vueExports.createVNode(_component_UInput, {
                      modelValue: vueExports.unref(paymentForm).paid_at,
                      "onUpdate:modelValue": ($event) => vueExports.unref(paymentForm).paid_at = $event,
                      type: "date",
                      class: "w-full"
                    }, null, 8, ["modelValue", "onUpdate:modelValue"])
                  ]),
                  _: 1
                }),
                vueExports.createVNode(_component_UFormField, { label: "Ghi chú" }, {
                  default: vueExports.withCtx(() => [
                    vueExports.createVNode(_component_UInput, {
                      modelValue: vueExports.unref(paymentForm).note,
                      "onUpdate:modelValue": ($event) => vueExports.unref(paymentForm).note = $event,
                      placeholder: "Ghi chú (tùy chọn)",
                      maxlength: 500,
                      class: "w-full"
                    }, null, 8, ["modelValue", "onUpdate:modelValue"])
                  ]),
                  _: 1
                })
              ])
            ];
          }
        }),
        footer: vueExports.withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="flex justify-end gap-2 w-full"${_scopeId}>`);
            _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UButton, {
              label: "Hủy",
              color: "neutral",
              variant: "ghost",
              onClick: ($event) => showPaymentModal.value = false
            }, null, _parent2, _scopeId));
            _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UButton, {
              label: vueExports.unref(isEditMode) ? "Cập nhật" : "Ghi nhận",
              color: "primary",
              disabled: !vueExports.unref(isPaymentValid),
              loading: vueExports.unref(isSubmittingPayment),
              onClick: submitPayment
            }, null, _parent2, _scopeId));
            _push2(`</div>`);
          } else {
            return [
              vueExports.createVNode("div", { class: "flex justify-end gap-2 w-full" }, [
                vueExports.createVNode(_component_UButton, {
                  label: "Hủy",
                  color: "neutral",
                  variant: "ghost",
                  onClick: ($event) => showPaymentModal.value = false
                }, null, 8, ["onClick"]),
                vueExports.createVNode(_component_UButton, {
                  label: vueExports.unref(isEditMode) ? "Cập nhật" : "Ghi nhận",
                  color: "primary",
                  disabled: !vueExports.unref(isPaymentValid),
                  loading: vueExports.unref(isSubmittingPayment),
                  onClick: submitPayment
                }, null, 8, ["label", "disabled", "loading"])
              ])
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UModal, {
        open: vueExports.unref(showRefundModal),
        "onUpdate:open": ($event) => vueExports.isRef(showRefundModal) ? showRefundModal.value = $event : null,
        title: "Ghi nhận trả tiền",
        description: `Thu thừa: ${vueExports.unref(receivable) ? ("formatCurrency" in _ctx ? _ctx.formatCurrency : vueExports.unref(formatCurrency))(vueExports.unref(receivable).overpaid_amount) : ""}`
      }, {
        body: vueExports.withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="flex flex-col gap-4"${_scopeId}>`);
            _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UFormField, {
              label: "Số tiền hoàn trả (đ)",
              required: ""
            }, {
              default: vueExports.withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(`<div class="flex gap-2"${_scopeId2}>`);
                  _push3(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_SharedNumberInput, {
                    modelValue: vueExports.unref(refundForm).amount,
                    "onUpdate:modelValue": ($event) => vueExports.unref(refundForm).amount = $event,
                    placeholder: "Nhập số tiền",
                    min: 1,
                    max: vueExports.unref(maxRefundAmount),
                    class: "flex-1"
                  }, null, _parent3, _scopeId2));
                  _push3(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UButton, {
                    label: "Tất cả",
                    color: "neutral",
                    variant: "outline",
                    size: "sm",
                    class: "shrink-0",
                    onClick: ($event) => vueExports.unref(refundForm).amount = vueExports.unref(maxRefundAmount)
                  }, null, _parent3, _scopeId2));
                  _push3(`</div>`);
                } else {
                  return [
                    vueExports.createVNode("div", { class: "flex gap-2" }, [
                      vueExports.createVNode(_component_SharedNumberInput, {
                        modelValue: vueExports.unref(refundForm).amount,
                        "onUpdate:modelValue": ($event) => vueExports.unref(refundForm).amount = $event,
                        placeholder: "Nhập số tiền",
                        min: 1,
                        max: vueExports.unref(maxRefundAmount),
                        class: "flex-1"
                      }, null, 8, ["modelValue", "onUpdate:modelValue", "max"]),
                      vueExports.createVNode(_component_UButton, {
                        label: "Tất cả",
                        color: "neutral",
                        variant: "outline",
                        size: "sm",
                        class: "shrink-0",
                        onClick: ($event) => vueExports.unref(refundForm).amount = vueExports.unref(maxRefundAmount)
                      }, null, 8, ["onClick"])
                    ])
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UFormField, {
              label: "Phương thức",
              required: ""
            }, {
              default: vueExports.withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_USelect, {
                    modelValue: vueExports.unref(refundForm).payment_method,
                    "onUpdate:modelValue": ($event) => vueExports.unref(refundForm).payment_method = $event,
                    items: "PAYMENT_METHOD_OPTIONS" in _ctx ? _ctx.PAYMENT_METHOD_OPTIONS : vueExports.unref(PAYMENT_METHOD_OPTIONS),
                    class: "w-full"
                  }, null, _parent3, _scopeId2));
                } else {
                  return [
                    vueExports.createVNode(_component_USelect, {
                      modelValue: vueExports.unref(refundForm).payment_method,
                      "onUpdate:modelValue": ($event) => vueExports.unref(refundForm).payment_method = $event,
                      items: "PAYMENT_METHOD_OPTIONS" in _ctx ? _ctx.PAYMENT_METHOD_OPTIONS : vueExports.unref(PAYMENT_METHOD_OPTIONS),
                      class: "w-full"
                    }, null, 8, ["modelValue", "onUpdate:modelValue", "items"])
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UFormField, {
              label: "Ngày trả",
              required: ""
            }, {
              default: vueExports.withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UInput, {
                    modelValue: vueExports.unref(refundForm).paid_at,
                    "onUpdate:modelValue": ($event) => vueExports.unref(refundForm).paid_at = $event,
                    type: "date",
                    class: "w-full"
                  }, null, _parent3, _scopeId2));
                } else {
                  return [
                    vueExports.createVNode(_component_UInput, {
                      modelValue: vueExports.unref(refundForm).paid_at,
                      "onUpdate:modelValue": ($event) => vueExports.unref(refundForm).paid_at = $event,
                      type: "date",
                      class: "w-full"
                    }, null, 8, ["modelValue", "onUpdate:modelValue"])
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UFormField, { label: "Ghi chú" }, {
              default: vueExports.withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UInput, {
                    modelValue: vueExports.unref(refundForm).note,
                    "onUpdate:modelValue": ($event) => vueExports.unref(refundForm).note = $event,
                    placeholder: "Ghi chú (tùy chọn)",
                    maxlength: 500,
                    class: "w-full"
                  }, null, _parent3, _scopeId2));
                } else {
                  return [
                    vueExports.createVNode(_component_UInput, {
                      modelValue: vueExports.unref(refundForm).note,
                      "onUpdate:modelValue": ($event) => vueExports.unref(refundForm).note = $event,
                      placeholder: "Ghi chú (tùy chọn)",
                      maxlength: 500,
                      class: "w-full"
                    }, null, 8, ["modelValue", "onUpdate:modelValue"])
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(`</div>`);
          } else {
            return [
              vueExports.createVNode("div", { class: "flex flex-col gap-4" }, [
                vueExports.createVNode(_component_UFormField, {
                  label: "Số tiền hoàn trả (đ)",
                  required: ""
                }, {
                  default: vueExports.withCtx(() => [
                    vueExports.createVNode("div", { class: "flex gap-2" }, [
                      vueExports.createVNode(_component_SharedNumberInput, {
                        modelValue: vueExports.unref(refundForm).amount,
                        "onUpdate:modelValue": ($event) => vueExports.unref(refundForm).amount = $event,
                        placeholder: "Nhập số tiền",
                        min: 1,
                        max: vueExports.unref(maxRefundAmount),
                        class: "flex-1"
                      }, null, 8, ["modelValue", "onUpdate:modelValue", "max"]),
                      vueExports.createVNode(_component_UButton, {
                        label: "Tất cả",
                        color: "neutral",
                        variant: "outline",
                        size: "sm",
                        class: "shrink-0",
                        onClick: ($event) => vueExports.unref(refundForm).amount = vueExports.unref(maxRefundAmount)
                      }, null, 8, ["onClick"])
                    ])
                  ]),
                  _: 1
                }),
                vueExports.createVNode(_component_UFormField, {
                  label: "Phương thức",
                  required: ""
                }, {
                  default: vueExports.withCtx(() => [
                    vueExports.createVNode(_component_USelect, {
                      modelValue: vueExports.unref(refundForm).payment_method,
                      "onUpdate:modelValue": ($event) => vueExports.unref(refundForm).payment_method = $event,
                      items: "PAYMENT_METHOD_OPTIONS" in _ctx ? _ctx.PAYMENT_METHOD_OPTIONS : vueExports.unref(PAYMENT_METHOD_OPTIONS),
                      class: "w-full"
                    }, null, 8, ["modelValue", "onUpdate:modelValue", "items"])
                  ]),
                  _: 1
                }),
                vueExports.createVNode(_component_UFormField, {
                  label: "Ngày trả",
                  required: ""
                }, {
                  default: vueExports.withCtx(() => [
                    vueExports.createVNode(_component_UInput, {
                      modelValue: vueExports.unref(refundForm).paid_at,
                      "onUpdate:modelValue": ($event) => vueExports.unref(refundForm).paid_at = $event,
                      type: "date",
                      class: "w-full"
                    }, null, 8, ["modelValue", "onUpdate:modelValue"])
                  ]),
                  _: 1
                }),
                vueExports.createVNode(_component_UFormField, { label: "Ghi chú" }, {
                  default: vueExports.withCtx(() => [
                    vueExports.createVNode(_component_UInput, {
                      modelValue: vueExports.unref(refundForm).note,
                      "onUpdate:modelValue": ($event) => vueExports.unref(refundForm).note = $event,
                      placeholder: "Ghi chú (tùy chọn)",
                      maxlength: 500,
                      class: "w-full"
                    }, null, 8, ["modelValue", "onUpdate:modelValue"])
                  ]),
                  _: 1
                })
              ])
            ];
          }
        }),
        footer: vueExports.withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="flex justify-end gap-2 w-full"${_scopeId}>`);
            _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UButton, {
              label: "Hủy",
              color: "neutral",
              variant: "ghost",
              onClick: ($event) => showRefundModal.value = false
            }, null, _parent2, _scopeId));
            _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UButton, {
              label: "Ghi nhận",
              color: "primary",
              disabled: !vueExports.unref(isRefundValid),
              loading: vueExports.unref(isSubmittingRefund),
              onClick: submitRefund
            }, null, _parent2, _scopeId));
            _push2(`</div>`);
          } else {
            return [
              vueExports.createVNode("div", { class: "flex justify-end gap-2 w-full" }, [
                vueExports.createVNode(_component_UButton, {
                  label: "Hủy",
                  color: "neutral",
                  variant: "ghost",
                  onClick: ($event) => showRefundModal.value = false
                }, null, 8, ["onClick"]),
                vueExports.createVNode(_component_UButton, {
                  label: "Ghi nhận",
                  color: "primary",
                  disabled: !vueExports.unref(isRefundValid),
                  loading: vueExports.unref(isSubmittingRefund),
                  onClick: submitRefund
                }, null, 8, ["disabled", "loading"])
              ])
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UModal, {
        open: vueExports.unref(showCompleteConfirm),
        "onUpdate:open": ($event) => vueExports.isRef(showCompleteConfirm) ? showCompleteConfirm.value = $event : null,
        title: "Xác nhận hoàn thành"
      }, {
        body: vueExports.withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<p class="text-slate-700"${_scopeId}> Khoản công nợ sẽ được đánh dấu hoàn thành. Đã đối soát <strong${_scopeId}>${serverRenderer_cjs_prodExports.ssrInterpolate(vueExports.unref(reconciliationProgress).reconciled)}/${serverRenderer_cjs_prodExports.ssrInterpolate(vueExports.unref(reconciliationProgress).total)}</strong> dòng tiền. </p>`);
          } else {
            return [
              vueExports.createVNode("p", { class: "text-slate-700" }, [
                vueExports.createTextVNode(" Khoản công nợ sẽ được đánh dấu hoàn thành. Đã đối soát "),
                vueExports.createVNode("strong", null, vueExports.toDisplayString(vueExports.unref(reconciliationProgress).reconciled) + "/" + vueExports.toDisplayString(vueExports.unref(reconciliationProgress).total), 1),
                vueExports.createTextVNode(" dòng tiền. ")
              ])
            ];
          }
        }),
        footer: vueExports.withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="flex justify-end gap-2 w-full"${_scopeId}>`);
            _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UButton, {
              label: "Quay lại",
              color: "neutral",
              variant: "ghost",
              onClick: ($event) => showCompleteConfirm.value = false
            }, null, _parent2, _scopeId));
            _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UButton, {
              label: "Xác nhận hoàn thành",
              color: "success",
              loading: vueExports.unref(isCompleting),
              onClick: submitComplete
            }, null, _parent2, _scopeId));
            _push2(`</div>`);
          } else {
            return [
              vueExports.createVNode("div", { class: "flex justify-end gap-2 w-full" }, [
                vueExports.createVNode(_component_UButton, {
                  label: "Quay lại",
                  color: "neutral",
                  variant: "ghost",
                  onClick: ($event) => showCompleteConfirm.value = false
                }, null, 8, ["onClick"]),
                vueExports.createVNode(_component_UButton, {
                  label: "Xác nhận hoàn thành",
                  color: "success",
                  loading: vueExports.unref(isCompleting),
                  onClick: submitComplete
                }, null, 8, ["loading"])
              ])
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UModal, {
        open: vueExports.unref(showQrModal),
        "onUpdate:open": ($event) => vueExports.isRef(showQrModal) ? showQrModal.value = $event : null,
        title: vueExports.unref(qrModalContext) === "outstanding" ? "Mã QR thanh toán còn nợ" : "Mã QR chuyển khoản",
        description: `Số tiền: ${("formatCurrency" in _ctx ? _ctx.formatCurrency : vueExports.unref(formatCurrency))(String(vueExports.unref(qrModalAmount)))}`
      }, {
        body: vueExports.withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="flex flex-col items-center gap-4"${_scopeId}>`);
            if (!vueExports.unref(bankConfigured)) {
              _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UAlert, {
                icon: "i-lucide-alert-triangle",
                color: "warning",
                variant: "subtle",
                title: "Chưa cấu hình tài khoản nhận chuyển khoản",
                class: "w-full"
              }, {
                description: vueExports.withCtx((_2, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    _push3(` Vui lòng cấu hình số tài khoản ngân hàng tại trang `);
                    _push3(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_NuxtLink, {
                      to: "/pmc/settings/bank-account",
                      class: "text-primary underline font-medium"
                    }, {
                      default: vueExports.withCtx((_3, _push4, _parent4, _scopeId3) => {
                        if (_push4) {
                          _push4(` Cài đặt → Tài khoản nhận CK `);
                        } else {
                          return [
                            vueExports.createTextVNode(" Cài đặt → Tài khoản nhận CK ")
                          ];
                        }
                      }),
                      _: 1
                    }, _parent3, _scopeId2));
                    _push3(` để có thể tạo mã QR chuyển khoản. `);
                  } else {
                    return [
                      vueExports.createTextVNode(" Vui lòng cấu hình số tài khoản ngân hàng tại trang "),
                      vueExports.createVNode(_component_NuxtLink, {
                        to: "/pmc/settings/bank-account",
                        class: "text-primary underline font-medium"
                      }, {
                        default: vueExports.withCtx(() => [
                          vueExports.createTextVNode(" Cài đặt → Tài khoản nhận CK ")
                        ]),
                        _: 1
                      }),
                      vueExports.createTextVNode(" để có thể tạo mã QR chuyển khoản. ")
                    ];
                  }
                }),
                _: 1
              }, _parent2, _scopeId));
            } else {
              _push2(`<!--[-->`);
              if (vueExports.unref(qrModalImageUrl)) {
                _push2(`<img${serverRenderer_cjs_prodExports.ssrRenderAttr("src", vueExports.unref(qrModalImageUrl))}${serverRenderer_cjs_prodExports.ssrRenderAttr("alt", `QR VietQR ${vueExports.unref(bankSettings).account_number}`)} class="w-[280px] rounded-lg border border-slate-200 bg-white" width="280" height="360" loading="lazy"${_scopeId}>`);
              } else {
                _push2(`<!---->`);
              }
              _push2(`<div class="w-full rounded-lg bg-slate-50 border border-slate-200 px-3 py-2 text-sm text-slate-700 flex flex-col gap-0.5"${_scopeId}><div class="flex justify-between"${_scopeId}><span class="text-slate-500"${_scopeId}>Số tiền:</span><span class="font-semibold text-slate-900"${_scopeId}>${serverRenderer_cjs_prodExports.ssrInterpolate(("formatCurrency" in _ctx ? _ctx.formatCurrency : vueExports.unref(formatCurrency))(String(vueExports.unref(qrModalAmount))))}</span></div>`);
              if (vueExports.unref(qrTransferDescription)) {
                _push2(`<div class="flex justify-between"${_scopeId}><span class="text-slate-500"${_scopeId}>Nội dung:</span><span class="font-mono"${_scopeId}>${serverRenderer_cjs_prodExports.ssrInterpolate(vueExports.unref(qrTransferDescription))}</span></div>`);
              } else {
                _push2(`<!---->`);
              }
              _push2(`</div><p class="text-xs text-slate-500 text-center"${_scopeId}> Khách hàng dùng app ngân hàng quét mã để chuyển khoản. Số tiền và nội dung được điền sẵn. </p><!--]-->`);
            }
            _push2(`</div>`);
          } else {
            return [
              vueExports.createVNode("div", { class: "flex flex-col items-center gap-4" }, [
                !vueExports.unref(bankConfigured) ? (vueExports.openBlock(), vueExports.createBlock(_component_UAlert, {
                  key: 0,
                  icon: "i-lucide-alert-triangle",
                  color: "warning",
                  variant: "subtle",
                  title: "Chưa cấu hình tài khoản nhận chuyển khoản",
                  class: "w-full"
                }, {
                  description: vueExports.withCtx(() => [
                    vueExports.createTextVNode(" Vui lòng cấu hình số tài khoản ngân hàng tại trang "),
                    vueExports.createVNode(_component_NuxtLink, {
                      to: "/pmc/settings/bank-account",
                      class: "text-primary underline font-medium"
                    }, {
                      default: vueExports.withCtx(() => [
                        vueExports.createTextVNode(" Cài đặt → Tài khoản nhận CK ")
                      ]),
                      _: 1
                    }),
                    vueExports.createTextVNode(" để có thể tạo mã QR chuyển khoản. ")
                  ]),
                  _: 1
                })) : (vueExports.openBlock(), vueExports.createBlock(vueExports.Fragment, { key: 1 }, [
                  vueExports.unref(qrModalImageUrl) ? (vueExports.openBlock(), vueExports.createBlock("img", {
                    key: 0,
                    src: vueExports.unref(qrModalImageUrl),
                    alt: `QR VietQR ${vueExports.unref(bankSettings).account_number}`,
                    class: "w-[280px] rounded-lg border border-slate-200 bg-white",
                    width: "280",
                    height: "360",
                    loading: "lazy"
                  }, null, 8, ["src", "alt"])) : vueExports.createCommentVNode("", true),
                  vueExports.createVNode("div", { class: "w-full rounded-lg bg-slate-50 border border-slate-200 px-3 py-2 text-sm text-slate-700 flex flex-col gap-0.5" }, [
                    vueExports.createVNode("div", { class: "flex justify-between" }, [
                      vueExports.createVNode("span", { class: "text-slate-500" }, "Số tiền:"),
                      vueExports.createVNode("span", { class: "font-semibold text-slate-900" }, vueExports.toDisplayString(("formatCurrency" in _ctx ? _ctx.formatCurrency : vueExports.unref(formatCurrency))(String(vueExports.unref(qrModalAmount)))), 1)
                    ]),
                    vueExports.unref(qrTransferDescription) ? (vueExports.openBlock(), vueExports.createBlock("div", {
                      key: 0,
                      class: "flex justify-between"
                    }, [
                      vueExports.createVNode("span", { class: "text-slate-500" }, "Nội dung:"),
                      vueExports.createVNode("span", { class: "font-mono" }, vueExports.toDisplayString(vueExports.unref(qrTransferDescription)), 1)
                    ])) : vueExports.createCommentVNode("", true)
                  ]),
                  vueExports.createVNode("p", { class: "text-xs text-slate-500 text-center" }, " Khách hàng dùng app ngân hàng quét mã để chuyển khoản. Số tiền và nội dung được điền sẵn. ")
                ], 64))
              ])
            ];
          }
        }),
        footer: vueExports.withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="flex justify-end gap-2 w-full"${_scopeId}>`);
            _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UButton, {
              label: "Đóng",
              color: "neutral",
              variant: "ghost",
              onClick: ($event) => showQrModal.value = false
            }, null, _parent2, _scopeId));
            if (vueExports.unref(bankConfigured)) {
              _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UButton, {
                label: "Tải mã QR",
                icon: "i-lucide-download",
                color: "primary",
                onClick: downloadQrCode
              }, null, _parent2, _scopeId));
            } else {
              _push2(`<!---->`);
            }
            _push2(`</div>`);
          } else {
            return [
              vueExports.createVNode("div", { class: "flex justify-end gap-2 w-full" }, [
                vueExports.createVNode(_component_UButton, {
                  label: "Đóng",
                  color: "neutral",
                  variant: "ghost",
                  onClick: ($event) => showQrModal.value = false
                }, null, 8, ["onClick"]),
                vueExports.unref(bankConfigured) ? (vueExports.openBlock(), vueExports.createBlock(_component_UButton, {
                  key: 0,
                  label: "Tải mã QR",
                  icon: "i-lucide-download",
                  color: "primary",
                  onClick: downloadQrCode
                })) : vueExports.createCommentVNode("", true)
              ])
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UModal, {
        open: vueExports.unref(showWriteOffConfirm),
        "onUpdate:open": ($event) => vueExports.isRef(showWriteOffConfirm) ? showWriteOffConfirm.value = $event : null,
        title: "Xác nhận xóa nợ"
      }, {
        body: vueExports.withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="flex flex-col gap-4"${_scopeId}><p class="text-slate-700"${_scopeId}> Khoản nợ còn <strong${_scopeId}>${serverRenderer_cjs_prodExports.ssrInterpolate(vueExports.unref(receivable) ? ("formatCurrency" in _ctx ? _ctx.formatCurrency : vueExports.unref(formatCurrency))(vueExports.unref(receivable).outstanding) : "")}</strong> sẽ được xóa. Hành động này không thể hoàn tác. </p>`);
            _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UFormField, { label: "Ghi chú lý do" }, {
              default: vueExports.withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UInput, {
                    modelValue: vueExports.unref(writeOffNote),
                    "onUpdate:modelValue": ($event) => vueExports.isRef(writeOffNote) ? writeOffNote.value = $event : null,
                    placeholder: "Nhập lý do xóa nợ (tùy chọn)",
                    maxlength: 500,
                    class: "w-full"
                  }, null, _parent3, _scopeId2));
                } else {
                  return [
                    vueExports.createVNode(_component_UInput, {
                      modelValue: vueExports.unref(writeOffNote),
                      "onUpdate:modelValue": ($event) => vueExports.isRef(writeOffNote) ? writeOffNote.value = $event : null,
                      placeholder: "Nhập lý do xóa nợ (tùy chọn)",
                      maxlength: 500,
                      class: "w-full"
                    }, null, 8, ["modelValue", "onUpdate:modelValue"])
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(`</div>`);
          } else {
            return [
              vueExports.createVNode("div", { class: "flex flex-col gap-4" }, [
                vueExports.createVNode("p", { class: "text-slate-700" }, [
                  vueExports.createTextVNode(" Khoản nợ còn "),
                  vueExports.createVNode("strong", null, vueExports.toDisplayString(vueExports.unref(receivable) ? ("formatCurrency" in _ctx ? _ctx.formatCurrency : vueExports.unref(formatCurrency))(vueExports.unref(receivable).outstanding) : ""), 1),
                  vueExports.createTextVNode(" sẽ được xóa. Hành động này không thể hoàn tác. ")
                ]),
                vueExports.createVNode(_component_UFormField, { label: "Ghi chú lý do" }, {
                  default: vueExports.withCtx(() => [
                    vueExports.createVNode(_component_UInput, {
                      modelValue: vueExports.unref(writeOffNote),
                      "onUpdate:modelValue": ($event) => vueExports.isRef(writeOffNote) ? writeOffNote.value = $event : null,
                      placeholder: "Nhập lý do xóa nợ (tùy chọn)",
                      maxlength: 500,
                      class: "w-full"
                    }, null, 8, ["modelValue", "onUpdate:modelValue"])
                  ]),
                  _: 1
                })
              ])
            ];
          }
        }),
        footer: vueExports.withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="flex justify-end gap-2 w-full"${_scopeId}>`);
            _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UButton, {
              label: "Quay lại",
              color: "neutral",
              variant: "ghost",
              onClick: ($event) => showWriteOffConfirm.value = false
            }, null, _parent2, _scopeId));
            _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UButton, {
              label: "Xác nhận xóa nợ",
              color: "error",
              loading: vueExports.unref(isWritingOff),
              onClick: submitWriteOff
            }, null, _parent2, _scopeId));
            _push2(`</div>`);
          } else {
            return [
              vueExports.createVNode("div", { class: "flex justify-end gap-2 w-full" }, [
                vueExports.createVNode(_component_UButton, {
                  label: "Quay lại",
                  color: "neutral",
                  variant: "ghost",
                  onClick: ($event) => showWriteOffConfirm.value = false
                }, null, 8, ["onClick"]),
                vueExports.createVNode(_component_UButton, {
                  label: "Xác nhận xóa nợ",
                  color: "error",
                  loading: vueExports.unref(isWritingOff),
                  onClick: submitWriteOff
                }, null, 8, ["loading"])
              ])
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = vueExports.useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/pmc/receivables/[id]/index.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=index-DWK26jmr.mjs.map
