<template>
<!-- TODO: add labels in json and get icon arrow up -->
  <menus-button
    ico="arrow-up"
    :text="'Go up layer'"
    @menu-click="upLayer"
  />
</template>

<script setup lang="ts">
import { getSelectionNode } from '@/extensions/selection'

const { editor } = useStore()

const upLayer = () => {
  const node = editor.value ? getSelectionNode(editor.value) : null
  if (node) {
    editor.value?.commands.updateAttributes(node.type, {
      zIndex: node.attrs.zIndex + 10,
    })
  }
}
</script>
