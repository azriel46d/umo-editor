<template>
  <menus-toolbar-tools-qrcode v-if="type === 'qrcode'" :content="content" />
  <menus-toolbar-tools-barcode v-if="type === BARCODE" :content="content" />
  <menus-toolbar-tools-diagrams v-if="type === 'diagrams'" :content="content" />
  <menus-toolbar-tools-mermaid v-if="type === 'mermaid'" :content="content" />
</template>

<script setup lang="ts">
import { BARCODE } from '@/extensions/page/node-names';

const { editor } = useStore()
const type = computed(() => {
  return editor.value?.getAttributes('image').type
})
const content = computed(() => {
  return editor.value?.getAttributes('image').content
})
</script>
