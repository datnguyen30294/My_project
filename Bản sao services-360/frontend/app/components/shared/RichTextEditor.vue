<script setup lang="ts">
import { useEditor, EditorContent } from '@tiptap/vue-3'
import StarterKit from '@tiptap/starter-kit'
import Underline from '@tiptap/extension-underline'
import TextAlign from '@tiptap/extension-text-align'
import Link from '@tiptap/extension-link'
import Image from '@tiptap/extension-image'
import Placeholder from '@tiptap/extension-placeholder'
import { Table } from '@tiptap/extension-table'
import { TableRow } from '@tiptap/extension-table-row'
import { TableHeader } from '@tiptap/extension-table-header'
import { TableCell } from '@tiptap/extension-table-cell'

interface Props {
  modelValue: string | null
  placeholder?: string
  minHeight?: string
  uploadImage?: (file: File) => Promise<string>
}

const props = withDefaults(defineProps<Props>(), {
  placeholder: 'Nhập nội dung...',
  minHeight: '200px',
  uploadImage: undefined
})

const emit = defineEmits<{
  'update:modelValue': [value: string | null]
}>()

const isUploading = ref(false)
const fileInput = ref<HTMLInputElement>()

const editor = useEditor({
  content: props.modelValue ?? '',
  extensions: [
    StarterKit,
    Underline,
    TextAlign.configure({ types: ['heading', 'paragraph'] }),
    Link.configure({ openOnClick: false }),
    Image.configure({ inline: false }),
    Placeholder.configure({ placeholder: props.placeholder }),
    Table.configure({ resizable: true, HTMLAttributes: { style: 'width:100%;border-collapse:collapse' } }),
    TableRow,
    TableHeader,
    TableCell
  ],
  editorProps: {
    attributes: {
      class: 'prose prose-sm max-w-none focus:outline-none px-4 py-3'
    }
  },
  onUpdate: ({ editor: e }) => {
    const html = e.getHTML()
    emit('update:modelValue', html === '<p></p>' ? null : html)
  }
})

watch(() => props.modelValue, (val) => {
  if (!editor.value) return
  const current = editor.value.getHTML()
  if (current !== val) {
    editor.value.commands.setContent(val ?? '', { emitUpdate: false })
  }
})

onBeforeUnmount(() => {
  editor.value?.destroy()
})

function setLink() {
  if (!editor.value) return
  const previousUrl = editor.value.getAttributes('link').href
  const url = window.prompt('URL', previousUrl)
  if (url === null) return
  if (url === '') {
    editor.value.chain().focus().extendMarkRange('link').unsetLink().run()
    return
  }
  editor.value.chain().focus().extendMarkRange('link').setLink({ href: url }).run()
}

function addImage() {
  if (!editor.value) return

  // If upload function provided, open file picker
  if (props.uploadImage) {
    fileInput.value?.click()
    return
  }

  // Fallback: prompt for URL
  const url = window.prompt('URL hình ảnh')
  if (url) {
    editor.value.chain().focus().setImage({ src: url }).run()
  }
}

async function handleFileChange(event: Event) {
  const input = event.target as HTMLInputElement
  const file = input.files?.[0]
  if (!file || !editor.value || !props.uploadImage) return

  // Reset input so same file can be selected again
  input.value = ''

  isUploading.value = true
  try {
    const url = await props.uploadImage(file)
    editor.value.chain().focus().setImage({ src: url }).run()
  } catch {
    // Let parent handle error via the uploadImage promise rejection
  } finally {
    isUploading.value = false
  }
}

interface ToolbarBtn {
  icon: string
  title: string
  action: () => void
  isActive?: () => boolean
  loading?: boolean
}

const toolbarButtons = computed<ToolbarBtn[][]>(() => {
  if (!editor.value) return []
  const e = editor.value
  return [
    [
      { icon: 'i-lucide-bold', title: 'Bold', action: () => e.chain().focus().toggleBold().run(), isActive: () => e.isActive('bold') },
      { icon: 'i-lucide-italic', title: 'Italic', action: () => e.chain().focus().toggleItalic().run(), isActive: () => e.isActive('italic') },
      { icon: 'i-lucide-underline', title: 'Underline', action: () => e.chain().focus().toggleUnderline().run(), isActive: () => e.isActive('underline') },
      { icon: 'i-lucide-strikethrough', title: 'Strikethrough', action: () => e.chain().focus().toggleStrike().run(), isActive: () => e.isActive('strike') }
    ],
    [
      { icon: 'i-lucide-heading-1', title: 'H1', action: () => e.chain().focus().toggleHeading({ level: 2 }).run(), isActive: () => e.isActive('heading', { level: 2 }) },
      { icon: 'i-lucide-heading-2', title: 'H2', action: () => e.chain().focus().toggleHeading({ level: 3 }).run(), isActive: () => e.isActive('heading', { level: 3 }) }
    ],
    [
      { icon: 'i-lucide-list', title: 'Bullet List', action: () => e.chain().focus().toggleBulletList().run(), isActive: () => e.isActive('bulletList') },
      { icon: 'i-lucide-list-ordered', title: 'Ordered List', action: () => e.chain().focus().toggleOrderedList().run(), isActive: () => e.isActive('orderedList') },
      { icon: 'i-lucide-text-quote', title: 'Blockquote', action: () => e.chain().focus().toggleBlockquote().run(), isActive: () => e.isActive('blockquote') }
    ],
    [
      { icon: 'i-lucide-align-left', title: 'Left', action: () => e.chain().focus().setTextAlign('left').run(), isActive: () => e.isActive({ textAlign: 'left' }) },
      { icon: 'i-lucide-align-center', title: 'Center', action: () => e.chain().focus().setTextAlign('center').run(), isActive: () => e.isActive({ textAlign: 'center' }) },
      { icon: 'i-lucide-align-right', title: 'Right', action: () => e.chain().focus().setTextAlign('right').run(), isActive: () => e.isActive({ textAlign: 'right' }) }
    ],
    [
      { icon: 'i-lucide-link', title: 'Link', action: setLink, isActive: () => e.isActive('link') },
      { icon: 'i-lucide-image', title: 'Tải ảnh lên', action: addImage, loading: isUploading.value }
    ],
    [
      { icon: 'i-lucide-table', title: 'Chèn bảng 2 cột (A / B)', action: () => e.chain().focus().insertTable({ rows: 1, cols: 2, withHeaderRow: false }).run() },
      { icon: 'i-lucide-table-2', title: 'Chèn bảng 3x3', action: () => e.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run() },
      { icon: 'i-lucide-rows-3', title: 'Thêm hàng dưới', action: () => e.chain().focus().addRowAfter().run() },
      { icon: 'i-lucide-columns-3', title: 'Thêm cột bên phải', action: () => e.chain().focus().addColumnAfter().run() },
      { icon: 'i-lucide-trash-2', title: 'Xoá bảng', action: () => e.chain().focus().deleteTable().run() }
    ],
    [
      { icon: 'i-lucide-minus', title: 'Horizontal Rule', action: () => e.chain().focus().setHorizontalRule().run() },
      { icon: 'i-lucide-undo', title: 'Undo', action: () => e.chain().focus().undo().run() },
      { icon: 'i-lucide-redo', title: 'Redo', action: () => e.chain().focus().redo().run() }
    ]
  ]
})
</script>

<template>
  <div class="border border-slate-200 rounded-lg overflow-hidden">
    <!-- Hidden file input for image upload -->
    <input
      ref="fileInput"
      type="file"
      accept="image/jpeg,image/png,image/gif,image/webp"
      class="hidden"
      @change="handleFileChange"
    >

    <!-- Toolbar -->
    <div
      v-if="editor"
      class="flex flex-wrap items-center gap-0.5 border-b border-slate-200 bg-slate-50 px-2 py-1.5"
    >
      <template
        v-for="(group, gi) in toolbarButtons"
        :key="gi"
      >
        <div
          v-if="gi > 0"
          class="w-px h-5 bg-slate-200 mx-1"
        />
        <button
          v-for="(btn, bi) in group"
          :key="bi"
          type="button"
          :title="btn.title"
          :disabled="btn.loading"
          class="p-1.5 rounded hover:bg-slate-200 transition-colors disabled:opacity-50"
          :class="btn.isActive?.() ? 'bg-slate-200 text-slate-900' : 'text-slate-500'"
          @click="btn.action()"
        >
          <UIcon
            v-if="btn.loading"
            name="i-lucide-loader-circle"
            class="size-4 animate-spin"
          />
          <UIcon
            v-else
            :name="btn.icon"
            class="size-4"
          />
        </button>
      </template>
    </div>

    <!-- Editor -->
    <EditorContent
      :editor="editor"
      :style="{ minHeight }"
      class="bg-white"
    />
  </div>
</template>

<style>
.tiptap p.is-editor-empty:first-child::before {
  color: #94a3b8;
  content: attr(data-placeholder);
  float: left;
  height: 0;
  pointer-events: none;
}

.tiptap table {
  width: 100%;
  table-layout: fixed;
  border-collapse: collapse;
  margin: 0.5rem 0;
}

.tiptap table td,
.tiptap table th {
  border: 1px solid #e2e8f0;
  padding: 8px;
  vertical-align: top;
  min-width: 0;
  word-break: break-word;
}

.tiptap table th {
  background: #f8fafc;
  font-weight: 600;
}

.tiptap .selectedCell {
  background: rgba(59, 130, 246, 0.1);
}

.tiptap .column-resize-handle {
  position: absolute;
  right: -2px;
  top: 0;
  bottom: 0;
  width: 4px;
  background: #3b82f6;
  pointer-events: none;
}

.tiptap table .tableWrapper {
  overflow-x: auto;
}
</style>
