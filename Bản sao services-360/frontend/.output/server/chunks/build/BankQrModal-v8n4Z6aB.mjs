import { _ as _sfc_main$1 } from './Modal-BimZZbNl.mjs';
import { v as vueExports, s as serverRenderer_cjs_prodExports, l as _sfc_main$c, k as _sfc_main$h } from './server.mjs';
import { _ as __nuxt_component_2 } from './QrCode-B1G5K_8N.mjs';
import { f as formatCurrency } from './currency-DEb2TrW3.mjs';
import { s as sanitizeQrDescription, a as buildVietQrPayload } from './vietqr-D50vgfgj.mjs';

const _sfc_main = /* @__PURE__ */ vueExports.defineComponent({
  __name: "BankQrModal",
  __ssrInlineRender: true,
  props: {
    open: { type: Boolean },
    bank: {},
    amount: {},
    description: {},
    recipientName: { default: "" },
    title: { default: "QR chuyển khoản" }
  },
  emits: ["update:open"],
  setup(__props) {
    const props = __props;
    const headerTitle = vueExports.computed(
      () => props.recipientName ? `${props.title} — ${props.recipientName}` : props.title
    );
    const sanitizedDescription = vueExports.computed(() => sanitizeQrDescription(props.description));
    const qrPayload = vueExports.computed(() => {
      if (!props.bank) return "";
      return buildVietQrPayload({
        bankBin: props.bank.bin,
        accountNumber: props.bank.account_number,
        amount: props.amount,
        description: sanitizedDescription.value
      });
    });
    return (_ctx, _push, _parent, _attrs) => {
      const _component_UModal = _sfc_main$1;
      const _component_UIcon = _sfc_main$h;
      const _component_SharedQrCode = __nuxt_component_2;
      const _component_UButton = _sfc_main$c;
      _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UModal, vueExports.mergeProps({
        open: __props.open,
        title: vueExports.unref(headerTitle),
        "onUpdate:open": ($event) => _ctx.$emit("update:open", $event)
      }, _attrs), {
        body: vueExports.withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            if (!__props.bank) {
              _push2(`<div class="flex flex-col items-center gap-3 py-8 text-center"${_scopeId}>`);
              _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UIcon, {
                name: "i-lucide-alert-triangle",
                class: "size-10 text-amber-400"
              }, null, _parent2, _scopeId));
              _push2(`<p class="text-sm font-medium text-slate-700"${_scopeId}> Nhân sự chưa có thông tin ngân hàng </p><p class="text-xs text-slate-500 max-w-xs"${_scopeId}> Vui lòng cập nhật số tài khoản và mã BIN VietQR trong hồ sơ tài khoản để sinh QR. </p></div>`);
            } else {
              _push2(`<div class="flex flex-col items-center gap-4"${_scopeId}><div class="w-full rounded-lg bg-slate-50 px-4 py-3 text-sm space-y-1.5"${_scopeId}><div class="flex justify-between"${_scopeId}><span class="text-slate-500"${_scopeId}>Ngân hàng</span><span class="font-medium"${_scopeId}>${serverRenderer_cjs_prodExports.ssrInterpolate(__props.bank.label || __props.bank.bin)}</span></div><div class="flex justify-between"${_scopeId}><span class="text-slate-500"${_scopeId}>Số TK</span><span class="font-mono font-medium"${_scopeId}>${serverRenderer_cjs_prodExports.ssrInterpolate(__props.bank.account_number)}</span></div><div class="flex justify-between"${_scopeId}><span class="text-slate-500"${_scopeId}>Chủ TK</span><span class="font-medium uppercase"${_scopeId}>${serverRenderer_cjs_prodExports.ssrInterpolate(__props.bank.account_name)}</span></div><div class="flex justify-between"${_scopeId}><span class="text-slate-500"${_scopeId}>Số tiền</span><span class="font-semibold text-amber-600 tabular-nums"${_scopeId}>${serverRenderer_cjs_prodExports.ssrInterpolate(("formatCurrency" in _ctx ? _ctx.formatCurrency : vueExports.unref(formatCurrency))(__props.amount))}</span></div><div class="flex justify-between"${_scopeId}><span class="text-slate-500"${_scopeId}>Nội dung CK</span><span class="font-mono text-xs text-right max-w-[60%] break-all"${_scopeId}>${serverRenderer_cjs_prodExports.ssrInterpolate(vueExports.unref(sanitizedDescription))}</span></div></div>`);
              _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_SharedQrCode, {
                value: vueExports.unref(qrPayload),
                size: 240,
                "file-name": `qr-${__props.bank.account_number}.png`
              }, null, _parent2, _scopeId));
              _push2(`<p class="text-xs text-slate-400 text-center max-w-xs"${_scopeId}> Quét QR bằng ứng dụng ngân hàng (VietQR) để chuyển khoản nhanh. </p></div>`);
            }
          } else {
            return [
              !__props.bank ? (vueExports.openBlock(), vueExports.createBlock("div", {
                key: 0,
                class: "flex flex-col items-center gap-3 py-8 text-center"
              }, [
                vueExports.createVNode(_component_UIcon, {
                  name: "i-lucide-alert-triangle",
                  class: "size-10 text-amber-400"
                }),
                vueExports.createVNode("p", { class: "text-sm font-medium text-slate-700" }, " Nhân sự chưa có thông tin ngân hàng "),
                vueExports.createVNode("p", { class: "text-xs text-slate-500 max-w-xs" }, " Vui lòng cập nhật số tài khoản và mã BIN VietQR trong hồ sơ tài khoản để sinh QR. ")
              ])) : (vueExports.openBlock(), vueExports.createBlock("div", {
                key: 1,
                class: "flex flex-col items-center gap-4"
              }, [
                vueExports.createVNode("div", { class: "w-full rounded-lg bg-slate-50 px-4 py-3 text-sm space-y-1.5" }, [
                  vueExports.createVNode("div", { class: "flex justify-between" }, [
                    vueExports.createVNode("span", { class: "text-slate-500" }, "Ngân hàng"),
                    vueExports.createVNode("span", { class: "font-medium" }, vueExports.toDisplayString(__props.bank.label || __props.bank.bin), 1)
                  ]),
                  vueExports.createVNode("div", { class: "flex justify-between" }, [
                    vueExports.createVNode("span", { class: "text-slate-500" }, "Số TK"),
                    vueExports.createVNode("span", { class: "font-mono font-medium" }, vueExports.toDisplayString(__props.bank.account_number), 1)
                  ]),
                  vueExports.createVNode("div", { class: "flex justify-between" }, [
                    vueExports.createVNode("span", { class: "text-slate-500" }, "Chủ TK"),
                    vueExports.createVNode("span", { class: "font-medium uppercase" }, vueExports.toDisplayString(__props.bank.account_name), 1)
                  ]),
                  vueExports.createVNode("div", { class: "flex justify-between" }, [
                    vueExports.createVNode("span", { class: "text-slate-500" }, "Số tiền"),
                    vueExports.createVNode("span", { class: "font-semibold text-amber-600 tabular-nums" }, vueExports.toDisplayString(("formatCurrency" in _ctx ? _ctx.formatCurrency : vueExports.unref(formatCurrency))(__props.amount)), 1)
                  ]),
                  vueExports.createVNode("div", { class: "flex justify-between" }, [
                    vueExports.createVNode("span", { class: "text-slate-500" }, "Nội dung CK"),
                    vueExports.createVNode("span", { class: "font-mono text-xs text-right max-w-[60%] break-all" }, vueExports.toDisplayString(vueExports.unref(sanitizedDescription)), 1)
                  ])
                ]),
                vueExports.createVNode(_component_SharedQrCode, {
                  value: vueExports.unref(qrPayload),
                  size: 240,
                  "file-name": `qr-${__props.bank.account_number}.png`
                }, null, 8, ["value", "file-name"]),
                vueExports.createVNode("p", { class: "text-xs text-slate-400 text-center max-w-xs" }, " Quét QR bằng ứng dụng ngân hàng (VietQR) để chuyển khoản nhanh. ")
              ]))
            ];
          }
        }),
        footer: vueExports.withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="flex justify-end w-full"${_scopeId}>`);
            _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UButton, {
              label: "Đóng",
              color: "neutral",
              variant: "ghost",
              onClick: ($event) => _ctx.$emit("update:open", false)
            }, null, _parent2, _scopeId));
            _push2(`</div>`);
          } else {
            return [
              vueExports.createVNode("div", { class: "flex justify-end w-full" }, [
                vueExports.createVNode(_component_UButton, {
                  label: "Đóng",
                  color: "neutral",
                  variant: "ghost",
                  onClick: ($event) => _ctx.$emit("update:open", false)
                }, null, 8, ["onClick"])
              ])
            ];
          }
        }),
        _: 1
      }, _parent));
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = vueExports.useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/shared/BankQrModal.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const __nuxt_component_13 = Object.assign(_sfc_main, { __name: "SharedBankQrModal" });

export { __nuxt_component_13 as _ };
//# sourceMappingURL=BankQrModal-v8n4Z6aB.mjs.map
