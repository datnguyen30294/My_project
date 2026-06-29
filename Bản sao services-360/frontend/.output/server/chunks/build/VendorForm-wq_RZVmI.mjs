import { _ as __nuxt_component_4 } from './SectionCard-CH-mG9Mf.mjs';
import { _ as _sfc_main$1 } from './FormField-DFdmv6Lu.mjs';
import { _ as _sfc_main$2 } from './Input-JXN8po_F.mjs';
import { _ as __nuxt_component_4$1 } from './FormFieldError-cu7WK1i1.mjs';
import { _ as _sfc_main$3 } from './Select-CZE7Ef6n.mjs';
import { v as vueExports, s as serverRenderer_cjs_prodExports, l as _sfc_main$c, k as _sfc_main$h } from './server.mjs';
import { _ as _sfc_main$4 } from './Badge-W93D3Jpz.mjs';
import { _ as _sfc_main$5 } from './Textarea-DTCNHwKm.mjs';
import { _ as _sfc_main$6 } from './SelectMenu-DKHEMZj7.mjs';
import { d as useProjectList } from './useProjects-D4K3VYdb.mjs';
import { S as SELECT_ALL_PER_PAGE } from './constants-G9YmtWtp.mjs';

const _sfc_main = /* @__PURE__ */ vueExports.defineComponent({
  __name: "VendorForm",
  __ssrInlineRender: true,
  props: {
    mode: {},
    item: { default: null },
    loading: { type: Boolean, default: false },
    apiErrors: { default: () => ({}) },
    submitLabel: { default: void 0 },
    cancelTo: {}
  },
  emits: ["submit"],
  setup(__props, { emit: __emit }) {
    const props = __props;
    const formState = vueExports.reactive({
      slug: "",
      name: "",
      display_name: "",
      status: "active",
      custom_domain: "",
      categories: [],
      owner_email: "",
      owner_phone: "",
      logo_url: "",
      description: "",
      project_ids: []
    });
    const newCategory = vueExports.ref("");
    const { data: projectsData, status: projectsStatus } = useProjectList(
      vueExports.computed(() => ({ per_page: SELECT_ALL_PER_PAGE }))
    );
    const projectOptions = vueExports.computed(
      () => (projectsData.value?.data ?? []).map((p) => ({ label: p.name, value: p.id }))
    );
    function reset() {
      if (props.mode === "edit" && props.item) {
        formState.slug = props.item.slug;
        formState.name = props.item.name;
        formState.display_name = props.item.display_name ?? "";
        formState.status = props.item.status.value;
        formState.custom_domain = props.item.custom_domain ?? "";
        formState.categories = [...props.item.categories ?? []];
        formState.owner_email = props.item.owner_email ?? "";
        formState.owner_phone = props.item.owner_phone ?? "";
        formState.logo_url = props.item.logo_url ?? "";
        formState.description = props.item.description ?? "";
        formState.project_ids = [...props.item.project_ids ?? []];
      } else {
        formState.slug = "";
        formState.name = "";
        formState.display_name = "";
        formState.status = "active";
        formState.custom_domain = "";
        formState.categories = [];
        formState.owner_email = "";
        formState.owner_phone = "";
        formState.logo_url = "";
        formState.description = "";
        formState.project_ids = [];
      }
      newCategory.value = "";
    }
    vueExports.watch(() => props.item, reset, { immediate: true });
    vueExports.watch(() => props.mode, reset);
    function addCategory() {
      const value = newCategory.value.trim().toLowerCase().replace(/\s+/g, "_");
      if (!value) return;
      if (formState.categories.includes(value)) {
        newCategory.value = "";
        return;
      }
      formState.categories.push(value);
      newCategory.value = "";
    }
    function removeCategory(category) {
      formState.categories = formState.categories.filter((c) => c !== category);
    }
    const computedSubmitLabel = vueExports.computed(
      () => props.submitLabel ?? (props.mode === "create" ? "Đăng ký vendor" : "Lưu thay đổi")
    );
    return (_ctx, _push, _parent, _attrs) => {
      const _component_SharedSectionCard = __nuxt_component_4;
      const _component_UFormField = _sfc_main$1;
      const _component_UInput = _sfc_main$2;
      const _component_SharedCrudFormFieldError = __nuxt_component_4$1;
      const _component_USelect = _sfc_main$3;
      const _component_UButton = _sfc_main$c;
      const _component_UBadge = _sfc_main$4;
      const _component_UIcon = _sfc_main$h;
      const _component_UTextarea = _sfc_main$5;
      const _component_USelectMenu = _sfc_main$6;
      _push(`<form${serverRenderer_cjs_prodExports.ssrRenderAttrs(vueExports.mergeProps({ class: "flex flex-col gap-6 w-full" }, _attrs))}>`);
      _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_SharedSectionCard, { title: "Thông tin cơ bản" }, {
        default: vueExports.withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="grid grid-cols-1 md:grid-cols-2 gap-4"${_scopeId}>`);
            if (__props.mode === "create") {
              _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UFormField, {
                label: "Slug (định danh URL)",
                name: "slug",
                required: "",
                help: "Chữ thường, số, gạch ngang. Dùng làm subdomain. Không sửa được sau khi tạo."
              }, {
                default: vueExports.withCtx((_2, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    _push3(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UInput, {
                      modelValue: vueExports.unref(formState).slug,
                      "onUpdate:modelValue": ($event) => vueExports.unref(formState).slug = $event,
                      placeholder: "vd: hoa-qua-abc",
                      class: "w-full"
                    }, null, _parent3, _scopeId2));
                    _push3(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_SharedCrudFormFieldError, {
                      errors: __props.apiErrors.slug
                    }, null, _parent3, _scopeId2));
                  } else {
                    return [
                      vueExports.createVNode(_component_UInput, {
                        modelValue: vueExports.unref(formState).slug,
                        "onUpdate:modelValue": ($event) => vueExports.unref(formState).slug = $event,
                        placeholder: "vd: hoa-qua-abc",
                        class: "w-full"
                      }, null, 8, ["modelValue", "onUpdate:modelValue"]),
                      vueExports.createVNode(_component_SharedCrudFormFieldError, {
                        errors: __props.apiErrors.slug
                      }, null, 8, ["errors"])
                    ];
                  }
                }),
                _: 1
              }, _parent2, _scopeId));
            } else {
              _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UFormField, {
                label: "Slug",
                name: "slug",
                help: "Slug không thể đổi sau khi vendor đã đăng ký."
              }, {
                default: vueExports.withCtx((_2, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    _push3(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UInput, {
                      "model-value": vueExports.unref(formState).slug,
                      disabled: "",
                      class: "w-full"
                    }, null, _parent3, _scopeId2));
                  } else {
                    return [
                      vueExports.createVNode(_component_UInput, {
                        "model-value": vueExports.unref(formState).slug,
                        disabled: "",
                        class: "w-full"
                      }, null, 8, ["model-value"])
                    ];
                  }
                }),
                _: 1
              }, _parent2, _scopeId));
            }
            _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UFormField, {
              label: "Trạng thái",
              name: "status"
            }, {
              default: vueExports.withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_USelect, {
                    modelValue: vueExports.unref(formState).status,
                    "onUpdate:modelValue": ($event) => vueExports.unref(formState).status = $event,
                    items: [
                      { label: "Đang hoạt động", value: "active" },
                      { label: "Tạm khoá", value: "suspended" },
                      { label: "Đã chấm dứt", value: "terminated" }
                    ],
                    class: "w-full"
                  }, null, _parent3, _scopeId2));
                  _push3(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_SharedCrudFormFieldError, {
                    errors: __props.apiErrors.status
                  }, null, _parent3, _scopeId2));
                } else {
                  return [
                    vueExports.createVNode(_component_USelect, {
                      modelValue: vueExports.unref(formState).status,
                      "onUpdate:modelValue": ($event) => vueExports.unref(formState).status = $event,
                      items: [
                        { label: "Đang hoạt động", value: "active" },
                        { label: "Tạm khoá", value: "suspended" },
                        { label: "Đã chấm dứt", value: "terminated" }
                      ],
                      class: "w-full"
                    }, null, 8, ["modelValue", "onUpdate:modelValue"]),
                    vueExports.createVNode(_component_SharedCrudFormFieldError, {
                      errors: __props.apiErrors.status
                    }, null, 8, ["errors"])
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UFormField, {
              label: "Tên đầy đủ",
              name: "name",
              required: ""
            }, {
              default: vueExports.withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UInput, {
                    modelValue: vueExports.unref(formState).name,
                    "onUpdate:modelValue": ($event) => vueExports.unref(formState).name = $event,
                    placeholder: "VD: Hoa Quả Sạch ABC",
                    class: "w-full"
                  }, null, _parent3, _scopeId2));
                  _push3(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_SharedCrudFormFieldError, {
                    errors: __props.apiErrors.name
                  }, null, _parent3, _scopeId2));
                } else {
                  return [
                    vueExports.createVNode(_component_UInput, {
                      modelValue: vueExports.unref(formState).name,
                      "onUpdate:modelValue": ($event) => vueExports.unref(formState).name = $event,
                      placeholder: "VD: Hoa Quả Sạch ABC",
                      class: "w-full"
                    }, null, 8, ["modelValue", "onUpdate:modelValue"]),
                    vueExports.createVNode(_component_SharedCrudFormFieldError, {
                      errors: __props.apiErrors.name
                    }, null, 8, ["errors"])
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UFormField, {
              label: "Tên hiển thị (tuỳ chọn)",
              name: "display_name",
              help: "Bỏ trống = dùng tên đầy đủ."
            }, {
              default: vueExports.withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UInput, {
                    modelValue: vueExports.unref(formState).display_name,
                    "onUpdate:modelValue": ($event) => vueExports.unref(formState).display_name = $event,
                    class: "w-full"
                  }, null, _parent3, _scopeId2));
                  _push3(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_SharedCrudFormFieldError, {
                    errors: __props.apiErrors.display_name
                  }, null, _parent3, _scopeId2));
                } else {
                  return [
                    vueExports.createVNode(_component_UInput, {
                      modelValue: vueExports.unref(formState).display_name,
                      "onUpdate:modelValue": ($event) => vueExports.unref(formState).display_name = $event,
                      class: "w-full"
                    }, null, 8, ["modelValue", "onUpdate:modelValue"]),
                    vueExports.createVNode(_component_SharedCrudFormFieldError, {
                      errors: __props.apiErrors.display_name
                    }, null, 8, ["errors"])
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(`</div>`);
          } else {
            return [
              vueExports.createVNode("div", { class: "grid grid-cols-1 md:grid-cols-2 gap-4" }, [
                __props.mode === "create" ? (vueExports.openBlock(), vueExports.createBlock(_component_UFormField, {
                  key: 0,
                  label: "Slug (định danh URL)",
                  name: "slug",
                  required: "",
                  help: "Chữ thường, số, gạch ngang. Dùng làm subdomain. Không sửa được sau khi tạo."
                }, {
                  default: vueExports.withCtx(() => [
                    vueExports.createVNode(_component_UInput, {
                      modelValue: vueExports.unref(formState).slug,
                      "onUpdate:modelValue": ($event) => vueExports.unref(formState).slug = $event,
                      placeholder: "vd: hoa-qua-abc",
                      class: "w-full"
                    }, null, 8, ["modelValue", "onUpdate:modelValue"]),
                    vueExports.createVNode(_component_SharedCrudFormFieldError, {
                      errors: __props.apiErrors.slug
                    }, null, 8, ["errors"])
                  ]),
                  _: 1
                })) : (vueExports.openBlock(), vueExports.createBlock(_component_UFormField, {
                  key: 1,
                  label: "Slug",
                  name: "slug",
                  help: "Slug không thể đổi sau khi vendor đã đăng ký."
                }, {
                  default: vueExports.withCtx(() => [
                    vueExports.createVNode(_component_UInput, {
                      "model-value": vueExports.unref(formState).slug,
                      disabled: "",
                      class: "w-full"
                    }, null, 8, ["model-value"])
                  ]),
                  _: 1
                })),
                vueExports.createVNode(_component_UFormField, {
                  label: "Trạng thái",
                  name: "status"
                }, {
                  default: vueExports.withCtx(() => [
                    vueExports.createVNode(_component_USelect, {
                      modelValue: vueExports.unref(formState).status,
                      "onUpdate:modelValue": ($event) => vueExports.unref(formState).status = $event,
                      items: [
                        { label: "Đang hoạt động", value: "active" },
                        { label: "Tạm khoá", value: "suspended" },
                        { label: "Đã chấm dứt", value: "terminated" }
                      ],
                      class: "w-full"
                    }, null, 8, ["modelValue", "onUpdate:modelValue"]),
                    vueExports.createVNode(_component_SharedCrudFormFieldError, {
                      errors: __props.apiErrors.status
                    }, null, 8, ["errors"])
                  ]),
                  _: 1
                }),
                vueExports.createVNode(_component_UFormField, {
                  label: "Tên đầy đủ",
                  name: "name",
                  required: ""
                }, {
                  default: vueExports.withCtx(() => [
                    vueExports.createVNode(_component_UInput, {
                      modelValue: vueExports.unref(formState).name,
                      "onUpdate:modelValue": ($event) => vueExports.unref(formState).name = $event,
                      placeholder: "VD: Hoa Quả Sạch ABC",
                      class: "w-full"
                    }, null, 8, ["modelValue", "onUpdate:modelValue"]),
                    vueExports.createVNode(_component_SharedCrudFormFieldError, {
                      errors: __props.apiErrors.name
                    }, null, 8, ["errors"])
                  ]),
                  _: 1
                }),
                vueExports.createVNode(_component_UFormField, {
                  label: "Tên hiển thị (tuỳ chọn)",
                  name: "display_name",
                  help: "Bỏ trống = dùng tên đầy đủ."
                }, {
                  default: vueExports.withCtx(() => [
                    vueExports.createVNode(_component_UInput, {
                      modelValue: vueExports.unref(formState).display_name,
                      "onUpdate:modelValue": ($event) => vueExports.unref(formState).display_name = $event,
                      class: "w-full"
                    }, null, 8, ["modelValue", "onUpdate:modelValue"]),
                    vueExports.createVNode(_component_SharedCrudFormFieldError, {
                      errors: __props.apiErrors.display_name
                    }, null, 8, ["errors"])
                  ]),
                  _: 1
                })
              ])
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_SharedSectionCard, { title: "Liên hệ chủ sở hữu" }, {
        default: vueExports.withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="grid grid-cols-1 md:grid-cols-2 gap-4"${_scopeId}>`);
            _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UFormField, {
              label: "Email chủ sở hữu",
              name: "owner_email",
              required: "",
              help: "Email nhận thông báo từ marketplace."
            }, {
              default: vueExports.withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UInput, {
                    modelValue: vueExports.unref(formState).owner_email,
                    "onUpdate:modelValue": ($event) => vueExports.unref(formState).owner_email = $event,
                    type: "email",
                    placeholder: "vd: admin@hoaquaabc.vn",
                    class: "w-full"
                  }, null, _parent3, _scopeId2));
                  _push3(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_SharedCrudFormFieldError, {
                    errors: __props.apiErrors.owner_email
                  }, null, _parent3, _scopeId2));
                } else {
                  return [
                    vueExports.createVNode(_component_UInput, {
                      modelValue: vueExports.unref(formState).owner_email,
                      "onUpdate:modelValue": ($event) => vueExports.unref(formState).owner_email = $event,
                      type: "email",
                      placeholder: "vd: admin@hoaquaabc.vn",
                      class: "w-full"
                    }, null, 8, ["modelValue", "onUpdate:modelValue"]),
                    vueExports.createVNode(_component_SharedCrudFormFieldError, {
                      errors: __props.apiErrors.owner_email
                    }, null, 8, ["errors"])
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UFormField, {
              label: "SĐT chủ sở hữu (tuỳ chọn)",
              name: "owner_phone"
            }, {
              default: vueExports.withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UInput, {
                    modelValue: vueExports.unref(formState).owner_phone,
                    "onUpdate:modelValue": ($event) => vueExports.unref(formState).owner_phone = $event,
                    class: "w-full"
                  }, null, _parent3, _scopeId2));
                  _push3(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_SharedCrudFormFieldError, {
                    errors: __props.apiErrors.owner_phone
                  }, null, _parent3, _scopeId2));
                } else {
                  return [
                    vueExports.createVNode(_component_UInput, {
                      modelValue: vueExports.unref(formState).owner_phone,
                      "onUpdate:modelValue": ($event) => vueExports.unref(formState).owner_phone = $event,
                      class: "w-full"
                    }, null, 8, ["modelValue", "onUpdate:modelValue"]),
                    vueExports.createVNode(_component_SharedCrudFormFieldError, {
                      errors: __props.apiErrors.owner_phone
                    }, null, 8, ["errors"])
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(`</div>`);
          } else {
            return [
              vueExports.createVNode("div", { class: "grid grid-cols-1 md:grid-cols-2 gap-4" }, [
                vueExports.createVNode(_component_UFormField, {
                  label: "Email chủ sở hữu",
                  name: "owner_email",
                  required: "",
                  help: "Email nhận thông báo từ marketplace."
                }, {
                  default: vueExports.withCtx(() => [
                    vueExports.createVNode(_component_UInput, {
                      modelValue: vueExports.unref(formState).owner_email,
                      "onUpdate:modelValue": ($event) => vueExports.unref(formState).owner_email = $event,
                      type: "email",
                      placeholder: "vd: admin@hoaquaabc.vn",
                      class: "w-full"
                    }, null, 8, ["modelValue", "onUpdate:modelValue"]),
                    vueExports.createVNode(_component_SharedCrudFormFieldError, {
                      errors: __props.apiErrors.owner_email
                    }, null, 8, ["errors"])
                  ]),
                  _: 1
                }),
                vueExports.createVNode(_component_UFormField, {
                  label: "SĐT chủ sở hữu (tuỳ chọn)",
                  name: "owner_phone"
                }, {
                  default: vueExports.withCtx(() => [
                    vueExports.createVNode(_component_UInput, {
                      modelValue: vueExports.unref(formState).owner_phone,
                      "onUpdate:modelValue": ($event) => vueExports.unref(formState).owner_phone = $event,
                      class: "w-full"
                    }, null, 8, ["modelValue", "onUpdate:modelValue"]),
                    vueExports.createVNode(_component_SharedCrudFormFieldError, {
                      errors: __props.apiErrors.owner_phone
                    }, null, 8, ["errors"])
                  ]),
                  _: 1
                })
              ])
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_SharedSectionCard, { title: "Storefront" }, {
        default: vueExports.withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="flex flex-col gap-4"${_scopeId}>`);
            _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UFormField, {
              label: "Custom domain (tuỳ chọn)",
              name: "custom_domain",
              help: "CHỈ hostname (không http://, không dấu /). Vd: shop.hoaquaabc.vn."
            }, {
              default: vueExports.withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UInput, {
                    modelValue: vueExports.unref(formState).custom_domain,
                    "onUpdate:modelValue": ($event) => vueExports.unref(formState).custom_domain = $event,
                    placeholder: "vd: shop.hoaquaabc.vn",
                    class: "w-full"
                  }, null, _parent3, _scopeId2));
                  _push3(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_SharedCrudFormFieldError, {
                    errors: __props.apiErrors.custom_domain
                  }, null, _parent3, _scopeId2));
                } else {
                  return [
                    vueExports.createVNode(_component_UInput, {
                      modelValue: vueExports.unref(formState).custom_domain,
                      "onUpdate:modelValue": ($event) => vueExports.unref(formState).custom_domain = $event,
                      placeholder: "vd: shop.hoaquaabc.vn",
                      class: "w-full"
                    }, null, 8, ["modelValue", "onUpdate:modelValue"]),
                    vueExports.createVNode(_component_SharedCrudFormFieldError, {
                      errors: __props.apiErrors.custom_domain
                    }, null, 8, ["errors"])
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UFormField, {
              label: "Logo URL (tuỳ chọn)",
              name: "logo_url"
            }, {
              default: vueExports.withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UInput, {
                    modelValue: vueExports.unref(formState).logo_url,
                    "onUpdate:modelValue": ($event) => vueExports.unref(formState).logo_url = $event,
                    type: "url",
                    placeholder: "https://...",
                    class: "w-full"
                  }, null, _parent3, _scopeId2));
                  _push3(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_SharedCrudFormFieldError, {
                    errors: __props.apiErrors.logo_url
                  }, null, _parent3, _scopeId2));
                } else {
                  return [
                    vueExports.createVNode(_component_UInput, {
                      modelValue: vueExports.unref(formState).logo_url,
                      "onUpdate:modelValue": ($event) => vueExports.unref(formState).logo_url = $event,
                      type: "url",
                      placeholder: "https://...",
                      class: "w-full"
                    }, null, 8, ["modelValue", "onUpdate:modelValue"]),
                    vueExports.createVNode(_component_SharedCrudFormFieldError, {
                      errors: __props.apiErrors.logo_url
                    }, null, 8, ["errors"])
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UFormField, {
              label: "Danh mục",
              name: "categories",
              help: "Phân loại vendor (vd: hoa_qua, giat_la, sua_chua). Enter để thêm tag."
            }, {
              default: vueExports.withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(`<div class="space-y-2"${_scopeId2}><div class="flex gap-2"${_scopeId2}>`);
                  _push3(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UInput, {
                    modelValue: vueExports.unref(newCategory),
                    "onUpdate:modelValue": ($event) => vueExports.isRef(newCategory) ? newCategory.value = $event : null,
                    placeholder: "vd: hoa_qua",
                    class: "flex-1",
                    onKeydown: addCategory
                  }, null, _parent3, _scopeId2));
                  _push3(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UButton, {
                    icon: "i-lucide-plus",
                    color: "neutral",
                    variant: "outline",
                    label: "Thêm",
                    disabled: !vueExports.unref(newCategory).trim(),
                    onClick: addCategory
                  }, null, _parent3, _scopeId2));
                  _push3(`</div>`);
                  if (vueExports.unref(formState).categories.length) {
                    _push3(`<div class="flex flex-wrap gap-2"${_scopeId2}><!--[-->`);
                    serverRenderer_cjs_prodExports.ssrRenderList(vueExports.unref(formState).categories, (cat) => {
                      _push3(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UBadge, {
                        key: cat,
                        color: "info",
                        variant: "subtle",
                        class: "gap-1 pr-1"
                      }, {
                        default: vueExports.withCtx((_3, _push4, _parent4, _scopeId3) => {
                          if (_push4) {
                            _push4(`${serverRenderer_cjs_prodExports.ssrInterpolate(cat)} <button type="button" class="ml-1 rounded hover:bg-black/10 p-0.5"${_scopeId3}>`);
                            _push4(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UIcon, {
                              name: "i-lucide-x",
                              class: "size-3"
                            }, null, _parent4, _scopeId3));
                            _push4(`</button>`);
                          } else {
                            return [
                              vueExports.createTextVNode(vueExports.toDisplayString(cat) + " ", 1),
                              vueExports.createVNode("button", {
                                type: "button",
                                class: "ml-1 rounded hover:bg-black/10 p-0.5",
                                onClick: ($event) => removeCategory(cat)
                              }, [
                                vueExports.createVNode(_component_UIcon, {
                                  name: "i-lucide-x",
                                  class: "size-3"
                                })
                              ], 8, ["onClick"])
                            ];
                          }
                        }),
                        _: 2
                      }, _parent3, _scopeId2));
                    });
                    _push3(`<!--]--></div>`);
                  } else {
                    _push3(`<p class="text-sm text-gray-400"${_scopeId2}> Chưa có danh mục nào. </p>`);
                  }
                  _push3(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_SharedCrudFormFieldError, {
                    errors: __props.apiErrors.categories
                  }, null, _parent3, _scopeId2));
                  _push3(`</div>`);
                } else {
                  return [
                    vueExports.createVNode("div", { class: "space-y-2" }, [
                      vueExports.createVNode("div", { class: "flex gap-2" }, [
                        vueExports.createVNode(_component_UInput, {
                          modelValue: vueExports.unref(newCategory),
                          "onUpdate:modelValue": ($event) => vueExports.isRef(newCategory) ? newCategory.value = $event : null,
                          placeholder: "vd: hoa_qua",
                          class: "flex-1",
                          onKeydown: vueExports.withKeys(vueExports.withModifiers(addCategory, ["prevent"]), ["enter"])
                        }, null, 8, ["modelValue", "onUpdate:modelValue", "onKeydown"]),
                        vueExports.createVNode(_component_UButton, {
                          icon: "i-lucide-plus",
                          color: "neutral",
                          variant: "outline",
                          label: "Thêm",
                          disabled: !vueExports.unref(newCategory).trim(),
                          onClick: addCategory
                        }, null, 8, ["disabled"])
                      ]),
                      vueExports.unref(formState).categories.length ? (vueExports.openBlock(), vueExports.createBlock("div", {
                        key: 0,
                        class: "flex flex-wrap gap-2"
                      }, [
                        (vueExports.openBlock(true), vueExports.createBlock(vueExports.Fragment, null, vueExports.renderList(vueExports.unref(formState).categories, (cat) => {
                          return vueExports.openBlock(), vueExports.createBlock(_component_UBadge, {
                            key: cat,
                            color: "info",
                            variant: "subtle",
                            class: "gap-1 pr-1"
                          }, {
                            default: vueExports.withCtx(() => [
                              vueExports.createTextVNode(vueExports.toDisplayString(cat) + " ", 1),
                              vueExports.createVNode("button", {
                                type: "button",
                                class: "ml-1 rounded hover:bg-black/10 p-0.5",
                                onClick: ($event) => removeCategory(cat)
                              }, [
                                vueExports.createVNode(_component_UIcon, {
                                  name: "i-lucide-x",
                                  class: "size-3"
                                })
                              ], 8, ["onClick"])
                            ]),
                            _: 2
                          }, 1024);
                        }), 128))
                      ])) : (vueExports.openBlock(), vueExports.createBlock("p", {
                        key: 1,
                        class: "text-sm text-gray-400"
                      }, " Chưa có danh mục nào. ")),
                      vueExports.createVNode(_component_SharedCrudFormFieldError, {
                        errors: __props.apiErrors.categories
                      }, null, 8, ["errors"])
                    ])
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UFormField, {
              label: "Mô tả (tuỳ chọn)",
              name: "description"
            }, {
              default: vueExports.withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UTextarea, {
                    modelValue: vueExports.unref(formState).description,
                    "onUpdate:modelValue": ($event) => vueExports.unref(formState).description = $event,
                    rows: 4,
                    class: "w-full"
                  }, null, _parent3, _scopeId2));
                  _push3(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_SharedCrudFormFieldError, {
                    errors: __props.apiErrors.description
                  }, null, _parent3, _scopeId2));
                } else {
                  return [
                    vueExports.createVNode(_component_UTextarea, {
                      modelValue: vueExports.unref(formState).description,
                      "onUpdate:modelValue": ($event) => vueExports.unref(formState).description = $event,
                      rows: 4,
                      class: "w-full"
                    }, null, 8, ["modelValue", "onUpdate:modelValue"]),
                    vueExports.createVNode(_component_SharedCrudFormFieldError, {
                      errors: __props.apiErrors.description
                    }, null, 8, ["errors"])
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
                  label: "Custom domain (tuỳ chọn)",
                  name: "custom_domain",
                  help: "CHỈ hostname (không http://, không dấu /). Vd: shop.hoaquaabc.vn."
                }, {
                  default: vueExports.withCtx(() => [
                    vueExports.createVNode(_component_UInput, {
                      modelValue: vueExports.unref(formState).custom_domain,
                      "onUpdate:modelValue": ($event) => vueExports.unref(formState).custom_domain = $event,
                      placeholder: "vd: shop.hoaquaabc.vn",
                      class: "w-full"
                    }, null, 8, ["modelValue", "onUpdate:modelValue"]),
                    vueExports.createVNode(_component_SharedCrudFormFieldError, {
                      errors: __props.apiErrors.custom_domain
                    }, null, 8, ["errors"])
                  ]),
                  _: 1
                }),
                vueExports.createVNode(_component_UFormField, {
                  label: "Logo URL (tuỳ chọn)",
                  name: "logo_url"
                }, {
                  default: vueExports.withCtx(() => [
                    vueExports.createVNode(_component_UInput, {
                      modelValue: vueExports.unref(formState).logo_url,
                      "onUpdate:modelValue": ($event) => vueExports.unref(formState).logo_url = $event,
                      type: "url",
                      placeholder: "https://...",
                      class: "w-full"
                    }, null, 8, ["modelValue", "onUpdate:modelValue"]),
                    vueExports.createVNode(_component_SharedCrudFormFieldError, {
                      errors: __props.apiErrors.logo_url
                    }, null, 8, ["errors"])
                  ]),
                  _: 1
                }),
                vueExports.createVNode(_component_UFormField, {
                  label: "Danh mục",
                  name: "categories",
                  help: "Phân loại vendor (vd: hoa_qua, giat_la, sua_chua). Enter để thêm tag."
                }, {
                  default: vueExports.withCtx(() => [
                    vueExports.createVNode("div", { class: "space-y-2" }, [
                      vueExports.createVNode("div", { class: "flex gap-2" }, [
                        vueExports.createVNode(_component_UInput, {
                          modelValue: vueExports.unref(newCategory),
                          "onUpdate:modelValue": ($event) => vueExports.isRef(newCategory) ? newCategory.value = $event : null,
                          placeholder: "vd: hoa_qua",
                          class: "flex-1",
                          onKeydown: vueExports.withKeys(vueExports.withModifiers(addCategory, ["prevent"]), ["enter"])
                        }, null, 8, ["modelValue", "onUpdate:modelValue", "onKeydown"]),
                        vueExports.createVNode(_component_UButton, {
                          icon: "i-lucide-plus",
                          color: "neutral",
                          variant: "outline",
                          label: "Thêm",
                          disabled: !vueExports.unref(newCategory).trim(),
                          onClick: addCategory
                        }, null, 8, ["disabled"])
                      ]),
                      vueExports.unref(formState).categories.length ? (vueExports.openBlock(), vueExports.createBlock("div", {
                        key: 0,
                        class: "flex flex-wrap gap-2"
                      }, [
                        (vueExports.openBlock(true), vueExports.createBlock(vueExports.Fragment, null, vueExports.renderList(vueExports.unref(formState).categories, (cat) => {
                          return vueExports.openBlock(), vueExports.createBlock(_component_UBadge, {
                            key: cat,
                            color: "info",
                            variant: "subtle",
                            class: "gap-1 pr-1"
                          }, {
                            default: vueExports.withCtx(() => [
                              vueExports.createTextVNode(vueExports.toDisplayString(cat) + " ", 1),
                              vueExports.createVNode("button", {
                                type: "button",
                                class: "ml-1 rounded hover:bg-black/10 p-0.5",
                                onClick: ($event) => removeCategory(cat)
                              }, [
                                vueExports.createVNode(_component_UIcon, {
                                  name: "i-lucide-x",
                                  class: "size-3"
                                })
                              ], 8, ["onClick"])
                            ]),
                            _: 2
                          }, 1024);
                        }), 128))
                      ])) : (vueExports.openBlock(), vueExports.createBlock("p", {
                        key: 1,
                        class: "text-sm text-gray-400"
                      }, " Chưa có danh mục nào. ")),
                      vueExports.createVNode(_component_SharedCrudFormFieldError, {
                        errors: __props.apiErrors.categories
                      }, null, 8, ["errors"])
                    ])
                  ]),
                  _: 1
                }),
                vueExports.createVNode(_component_UFormField, {
                  label: "Mô tả (tuỳ chọn)",
                  name: "description"
                }, {
                  default: vueExports.withCtx(() => [
                    vueExports.createVNode(_component_UTextarea, {
                      modelValue: vueExports.unref(formState).description,
                      "onUpdate:modelValue": ($event) => vueExports.unref(formState).description = $event,
                      rows: 4,
                      class: "w-full"
                    }, null, 8, ["modelValue", "onUpdate:modelValue"]),
                    vueExports.createVNode(_component_SharedCrudFormFieldError, {
                      errors: __props.apiErrors.description
                    }, null, 8, ["errors"])
                  ]),
                  _: 1
                })
              ])
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_SharedSectionCard, { title: "Dự án phục vụ" }, {
        default: vueExports.withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UFormField, {
              label: "Chọn dự án vendor được phép phục vụ",
              name: "project_ids",
              help: "Vendor sẽ được hiển thị trên storefront của các dự án đã chọn. Bỏ trống = vendor chỉ tồn tại trên marketplace, chưa gắn dự án nào."
            }, {
              default: vueExports.withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_USelectMenu, {
                    modelValue: vueExports.unref(formState).project_ids,
                    "onUpdate:modelValue": ($event) => vueExports.unref(formState).project_ids = $event,
                    items: vueExports.unref(projectOptions),
                    "value-key": "value",
                    multiple: "",
                    searchable: "",
                    loading: vueExports.unref(projectsStatus) === "pending",
                    placeholder: "Chọn dự án...",
                    class: "w-full"
                  }, null, _parent3, _scopeId2));
                  _push3(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_SharedCrudFormFieldError, {
                    errors: __props.apiErrors.project_ids
                  }, null, _parent3, _scopeId2));
                  _push3(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_SharedCrudFormFieldError, {
                    errors: __props.apiErrors["project_ids.0"]
                  }, null, _parent3, _scopeId2));
                } else {
                  return [
                    vueExports.createVNode(_component_USelectMenu, {
                      modelValue: vueExports.unref(formState).project_ids,
                      "onUpdate:modelValue": ($event) => vueExports.unref(formState).project_ids = $event,
                      items: vueExports.unref(projectOptions),
                      "value-key": "value",
                      multiple: "",
                      searchable: "",
                      loading: vueExports.unref(projectsStatus) === "pending",
                      placeholder: "Chọn dự án...",
                      class: "w-full"
                    }, null, 8, ["modelValue", "onUpdate:modelValue", "items", "loading"]),
                    vueExports.createVNode(_component_SharedCrudFormFieldError, {
                      errors: __props.apiErrors.project_ids
                    }, null, 8, ["errors"]),
                    vueExports.createVNode(_component_SharedCrudFormFieldError, {
                      errors: __props.apiErrors["project_ids.0"]
                    }, null, 8, ["errors"])
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
          } else {
            return [
              vueExports.createVNode(_component_UFormField, {
                label: "Chọn dự án vendor được phép phục vụ",
                name: "project_ids",
                help: "Vendor sẽ được hiển thị trên storefront của các dự án đã chọn. Bỏ trống = vendor chỉ tồn tại trên marketplace, chưa gắn dự án nào."
              }, {
                default: vueExports.withCtx(() => [
                  vueExports.createVNode(_component_USelectMenu, {
                    modelValue: vueExports.unref(formState).project_ids,
                    "onUpdate:modelValue": ($event) => vueExports.unref(formState).project_ids = $event,
                    items: vueExports.unref(projectOptions),
                    "value-key": "value",
                    multiple: "",
                    searchable: "",
                    loading: vueExports.unref(projectsStatus) === "pending",
                    placeholder: "Chọn dự án...",
                    class: "w-full"
                  }, null, 8, ["modelValue", "onUpdate:modelValue", "items", "loading"]),
                  vueExports.createVNode(_component_SharedCrudFormFieldError, {
                    errors: __props.apiErrors.project_ids
                  }, null, 8, ["errors"]),
                  vueExports.createVNode(_component_SharedCrudFormFieldError, {
                    errors: __props.apiErrors["project_ids.0"]
                  }, null, 8, ["errors"])
                ]),
                _: 1
              })
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`<div class="flex items-center justify-end gap-2">`);
      _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UButton, {
        label: "Huỷ",
        color: "neutral",
        variant: "ghost",
        to: __props.cancelTo,
        disabled: __props.loading
      }, null, _parent));
      _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UButton, {
        type: "submit",
        label: vueExports.unref(computedSubmitLabel),
        icon: "i-lucide-check",
        color: "primary",
        loading: __props.loading
      }, null, _parent));
      _push(`</div></form>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = vueExports.useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/vendor/VendorForm.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const __nuxt_component_2 = Object.assign(_sfc_main, { __name: "VendorForm" });

export { __nuxt_component_2 as _ };
//# sourceMappingURL=VendorForm-wq_RZVmI.mjs.map
