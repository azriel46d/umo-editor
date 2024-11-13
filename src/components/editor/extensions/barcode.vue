<script setup lang="ts">
import { nodeViewProps, NodeViewWrapper } from '@tiptap/vue-3'
import JsBarcode from 'jsbarcode'

const props = defineProps(nodeViewProps)

const barcode = ref(null)

const settings = computed(() => {
  return JSON.parse(props.node.attrs.settings)
})

onMounted(() => {
  JsBarcode(barcode.value, props.node.attrs.value, settings.value)
})

</script>
<template>
  <NodeViewWrapper :id="props.node.attrs.id">
    <svg ref="barcode"></svg>
  </NodeViewWrapper>
</template>
