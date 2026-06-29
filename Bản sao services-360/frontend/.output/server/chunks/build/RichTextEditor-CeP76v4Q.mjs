import { v as vueExports, s as serverRenderer_cjs_prodExports, k as _sfc_main$h } from './server.mjs';
import { useEditor, EditorContent } from '@tiptap/vue-3';
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import TextAlign from '@tiptap/extension-text-align';
import Link from '@tiptap/extension-link';
import Image from '@tiptap/extension-image';
import Placeholder from '@tiptap/extension-placeholder';
import { Table } from '@tiptap/extension-table';
import { TableRow } from '@tiptap/extension-table-row';
import { TableHeader } from '@tiptap/extension-table-header';
import { TableCell } from '@tiptap/extension-table-cell';

const _sfc_main = /* @__PURE__ */ vueExports.defineComponent({
  __name: "RichTextEditor",
  __ssrInlineRender: true,
  props: {
    modelValue: {},
    placeholder: { default: "Nhập nội dung..." },
    minHeight: { default: "200px" },
    uploadImage: { type: Function, default: void 0 }
  },
  emits: ["update:modelValue"],
  setup(__props, { emit: __emit }) {
    const props = __props;
    const emit = __emit;
    const isUploading = vueExports.ref(false);
    const fileInput = vueExports.ref();
    const editor = useEditor({
      content: props.modelValue ?? "",
      extensions: [
        StarterKit,
        Underline,
        TextAlign.configure({ types: ["heading", "paragraph"] }),
        Link.configure({ openOnClick: false }),
        Image.configure({ inline: false }),
        Placeholder.configure({ placeholder: props.placeholder }),
        Table.configure({ resizable: true, HTMLAttributes: { style: "width:100%;border-collapse:collapse" } }),
        TableRow,
        TableHeader,
        TableCell
      ],
      editorProps: {
        attributes: {
          class: "prose prose-sm max-w-none focus:outline-none px-4 py-3"
        }
      },
      onUpdate: ({ editor: e }) => {
        const html = e.getHTML();
        emit("update:modelValue", html === "<p></p>" ? null : html);
      }
    });
    vueExports.watch(() => props.modelValue, (val) => {
      if (!editor.value) return;
      const current = editor.value.getHTML();
      if (current !== val) {
        editor.value.commands.setContent(val ?? "", { emitUpdate: false });
      }
    });
    function setLink() {
      if (!editor.value) return;
      const previousUrl = editor.value.getAttributes("link").href;
      const url = (void 0).prompt("URL", previousUrl);
      if (url === null) return;
      if (url === "") {
        editor.value.chain().focus().extendMarkRange("link").unsetLink().run();
        return;
      }
      editor.value.chain().focus().extendMarkRange("link").setLink({ href: url }).run();
    }
    function addImage() {
      if (!editor.value) return;
      if (props.uploadImage) {
        fileInput.value?.click();
        return;
      }
      const url = (void 0).prompt("URL hình ảnh");
      if (url) {
        editor.value.chain().focus().setImage({ src: url }).run();
      }
    }
    const toolbarButtons = vueExports.computed(() => {
      if (!editor.value) return [];
      const e = editor.value;
      return [
        [
          { icon: "i-lucide-bold", title: "Bold", action: () => e.chain().focus().toggleBold().run(), isActive: () => e.isActive("bold") },
          { icon: "i-lucide-italic", title: "Italic", action: () => e.chain().focus().toggleItalic().run(), isActive: () => e.isActive("italic") },
          { icon: "i-lucide-underline", title: "Underline", action: () => e.chain().focus().toggleUnderline().run(), isActive: () => e.isActive("underline") },
          { icon: "i-lucide-strikethrough", title: "Strikethrough", action: () => e.chain().focus().toggleStrike().run(), isActive: () => e.isActive("strike") }
        ],
        [
          { icon: "i-lucide-heading-1", title: "H1", action: () => e.chain().focus().toggleHeading({ level: 2 }).run(), isActive: () => e.isActive("heading", { level: 2 }) },
          { icon: "i-lucide-heading-2", title: "H2", action: () => e.chain().focus().toggleHeading({ level: 3 }).run(), isActive: () => e.isActive("heading", { level: 3 }) }
        ],
        [
          { icon: "i-lucide-list", title: "Bullet List", action: () => e.chain().focus().toggleBulletList().run(), isActive: () => e.isActive("bulletList") },
          { icon: "i-lucide-list-ordered", title: "Ordered List", action: () => e.chain().focus().toggleOrderedList().run(), isActive: () => e.isActive("orderedList") },
          { icon: "i-lucide-text-quote", title: "Blockquote", action: () => e.chain().focus().toggleBlockquote().run(), isActive: () => e.isActive("blockquote") }
        ],
        [
          { icon: "i-lucide-align-left", title: "Left", action: () => e.chain().focus().setTextAlign("left").run(), isActive: () => e.isActive({ textAlign: "left" }) },
          { icon: "i-lucide-align-center", title: "Center", action: () => e.chain().focus().setTextAlign("center").run(), isActive: () => e.isActive({ textAlign: "center" }) },
          { icon: "i-lucide-align-right", title: "Right", action: () => e.chain().focus().setTextAlign("right").run(), isActive: () => e.isActive({ textAlign: "right" }) }
        ],
        [
          { icon: "i-lucide-link", title: "Link", action: setLink, isActive: () => e.isActive("link") },
          { icon: "i-lucide-image", title: "Tải ảnh lên", action: addImage, loading: isUploading.value }
        ],
        [
          { icon: "i-lucide-table", title: "Chèn bảng 2 cột (A / B)", action: () => e.chain().focus().insertTable({ rows: 1, cols: 2, withHeaderRow: false }).run() },
          { icon: "i-lucide-table-2", title: "Chèn bảng 3x3", action: () => e.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run() },
          { icon: "i-lucide-rows-3", title: "Thêm hàng dưới", action: () => e.chain().focus().addRowAfter().run() },
          { icon: "i-lucide-columns-3", title: "Thêm cột bên phải", action: () => e.chain().focus().addColumnAfter().run() },
          { icon: "i-lucide-trash-2", title: "Xoá bảng", action: () => e.chain().focus().deleteTable().run() }
        ],
        [
          { icon: "i-lucide-minus", title: "Horizontal Rule", action: () => e.chain().focus().setHorizontalRule().run() },
          { icon: "i-lucide-undo", title: "Undo", action: () => e.chain().focus().undo().run() },
          { icon: "i-lucide-redo", title: "Redo", action: () => e.chain().focus().redo().run() }
        ]
      ];
    });
    return (_ctx, _push, _parent, _attrs) => {
      const _component_UIcon = _sfc_main$h;
      _push(`<div${serverRenderer_cjs_prodExports.ssrRenderAttrs(vueExports.mergeProps({ class: "border border-slate-200 rounded-lg overflow-hidden" }, _attrs))}><input type="file" accept="image/jpeg,image/png,image/gif,image/webp" class="hidden">`);
      if (vueExports.unref(editor)) {
        _push(`<div class="flex flex-wrap items-center gap-0.5 border-b border-slate-200 bg-slate-50 px-2 py-1.5"><!--[-->`);
        serverRenderer_cjs_prodExports.ssrRenderList(vueExports.unref(toolbarButtons), (group, gi) => {
          _push(`<!--[-->`);
          if (gi > 0) {
            _push(`<div class="w-px h-5 bg-slate-200 mx-1"></div>`);
          } else {
            _push(`<!---->`);
          }
          _push(`<!--[-->`);
          serverRenderer_cjs_prodExports.ssrRenderList(group, (btn, bi) => {
            _push(`<button type="button"${serverRenderer_cjs_prodExports.ssrRenderAttr("title", btn.title)}${serverRenderer_cjs_prodExports.ssrIncludeBooleanAttr(btn.loading) ? " disabled" : ""} class="${serverRenderer_cjs_prodExports.ssrRenderClass([btn.isActive?.() ? "bg-slate-200 text-slate-900" : "text-slate-500", "p-1.5 rounded hover:bg-slate-200 transition-colors disabled:opacity-50"])}">`);
            if (btn.loading) {
              _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UIcon, {
                name: "i-lucide-loader-circle",
                class: "size-4 animate-spin"
              }, null, _parent));
            } else {
              _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UIcon, {
                name: btn.icon,
                class: "size-4"
              }, null, _parent));
            }
            _push(`</button>`);
          });
          _push(`<!--]--><!--]-->`);
        });
        _push(`<!--]--></div>`);
      } else {
        _push(`<!---->`);
      }
      _push(serverRenderer_cjs_prodExports.ssrRenderComponent(vueExports.unref(EditorContent), {
        editor: vueExports.unref(editor),
        style: { minHeight: __props.minHeight },
        class: "bg-white"
      }, null, _parent));
      _push(`</div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = vueExports.useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/shared/RichTextEditor.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const __nuxt_component_7 = Object.assign(_sfc_main, { __name: "SharedRichTextEditor" });

export { __nuxt_component_7 as _ };
//# sourceMappingURL=RichTextEditor-CeP76v4Q.mjs.map
