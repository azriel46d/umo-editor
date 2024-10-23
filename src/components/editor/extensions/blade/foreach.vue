<script setup lang="ts">
import { nodeViewProps, NodeViewWrapper, NodeViewContent } from '@tiptap/vue-3'

defineProps(nodeViewProps)
</script>
<template>
  <NodeViewWrapper>
    @inicioforeach
    <NodeViewContent />
    @fimforeach
  </NodeViewWrapper>
</template>
