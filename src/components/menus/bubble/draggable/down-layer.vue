<template>
  <menus-button
    ico="arrow-down"
    :text="'Go down layer'"
    @menu-click="downLayer"
  />
</template>

<script setup lang="ts">
import { getSelectionNode } from '@/extensions/selection'

const { editor } = useStore()

const downLayer = () => {
  const node = editor.value ? getSelectionNode(editor.value) : null
  if (node) {
    editor.value?.commands.updateAttributes(node.type, {
      zIndex: Math.max(node.attrs.zIndex - 10, 0),
    })
  }
}
</script>
