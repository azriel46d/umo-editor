<template>
<<<<<<< HEAD
  <editor-content class="umo-editor-container" :class="{
    'is-empty': isEmpty,
    'show-line-number': page.showLineNumber,
    'format-painter': painter.enabled,
    'disable-page-break': !page.pagination,
  }" :editor="editor" :style="{
      lineHeight: defaultLineHeight,
      '--umo-editor-placeholder': `'${l(options.document?.placeholder ?? {})}'`,
    }" :spellcheck="options.document?.enableSpellcheck && $document.enableSpellcheck
      " />
  <menus-bubble v-if="editor && !page.preview?.enabled && !editorDestroyed" />
  <menus-context-block v-if="
    options.document?.enableBlockMenu &&
    !page.preview?.enabled &&
    editor &&
    !editorDestroyed
  " />
=======
  <editor-content
    class="umo-editor-content"
    :class="{
      'show-bookmark': bookmark,
      'show-line-number': page.showLineNumber,
      'format-painter': painter.enabled,
      'is-empty': editor?.isEmpty,
    }"
    :editor="editor"
    :style="{
      lineHeight: defaultLineHeight,
    }"
    :spellcheck="
      options.document?.enableSpellcheck && $document.enableSpellcheck
    "
  />
  <template
    v-if="
      editor && !editorDestroyed && !page.preview?.enabled && !editorDestroyed
    "
  >
    <menus-context-block v-if="options.document?.enableBlockMenu" />
    <menus-bubble />
  </template>
>>>>>>> 2c2ed5be5052d8803ba4e9eb804ba6ea001c2a60
</template>

<script setup lang="ts">
import { Editor, EditorContent, type Extension } from '@tiptap/vue-3'

<<<<<<< HEAD
import { extensions } from '@/extensions'
import Image from '@/extensions/image'
import Pagination, { PageNode } from '@/extensions/pagination/src'

const {
  options,
  editor,
  page,
  painter,
  setEditor,
  editorDestroyed,
  container,
  tableOfContents,
} = useStore()
=======
import { extensions, inputAndPasteRules } from '@/extensions'

const { options, editor, page, painter, bookmark, setEditor, editorDestroyed } =
  useStore()
>>>>>>> 2c2ed5be5052d8803ba4e9eb804ba6ea001c2a60

const $document = useState('document')

const defaultLineHeight = $computed(
  () =>
    options.value.dicts?.lineHeights?.find((item: any) => item.default)?.value,
)

const editorInstance: Editor = new Editor({
  editable: !options.value.document?.readOnly,
  autofocus: options.value.document?.autofocus,
  content: options.value.document?.content,
  enableInputRules: inputAndPasteRules(),
  enablePasteRules: inputAndPasteRules(),
  editorProps: {
    attributes: {
      class: 'umo-editor',
    },
    ...options.value.document?.editorProps,
  },
  parseOptions: options.value.document?.parseOptions,
<<<<<<< HEAD
  extensions: [
    // Page.configure({
    //   types: options.value.page.nodesComputedOption?.types ?? [],
    //   slots: useSlots(),
    // }),
    PageNode, Pagination,
    ...extensions(options.value, container, tableOfContents.value),
    ...(options.value.extensions as Extension[]),
  ],
  onCreate({ editor }) {
    isReady = true
    isEmpty = editor.commands.setPlaceholder('')
  },
  onUpdate({ editor }) {
    isEmpty = editor.commands.setPlaceholder('')
=======
  extensions: [...extensions, ...(options.value.extensions as Extension[])],
  onUpdate({ editor }) {
>>>>>>> 2c2ed5be5052d8803ba4e9eb804ba6ea001c2a60
    $document.value.content = editor.getHTML()
  },
})
setEditor(editorInstance)

<<<<<<< HEAD

=======
>>>>>>> 2c2ed5be5052d8803ba4e9eb804ba6ea001c2a60
// 动态导入 katex 样式
const loadTatexStyle = () => {
  const katexStyleElement = document.querySelector('#katex-style')
  if (
    katexStyleElement === null &&
    !options.value.toolbar?.disableMenuItems.includes('math')
  ) {
    const style = document.createElement('link')
    style.href = `${options.value.cdnUrl}/libs/katex/katex.min.css`
    style.rel = 'stylesheet'
    style.id = 'katex-style'
    document.querySelector('head')?.append(style)
  }
}

onMounted(() => {
  loadTatexStyle()
})

// 销毁编辑器实例
onBeforeUnmount(() => {
  editorInstance.destroy()
})
</script>

<style lang="less">
@import '@/assets/styles/editor.less';
@import '@/assets/styles/drager.less';
</style>
