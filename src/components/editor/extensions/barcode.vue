<script setup lang="ts">
import { nodeViewProps, NodeViewWrapper } from '@tiptap/vue-3'
import JsBarcode from 'jsbarcode'

const props = defineProps(nodeViewProps)

const barcode = ref(null)

const settings = computed(() => {
  return JSON.parse(props.node.attrs.settings)
})

const renderBarcode = () => {
  JsBarcode(
    barcode.value,
    settings.value.content,
    settings.value,
  )
}

watch(settings, () => {
  renderBarcode()
})

onMounted(() => {
  renderBarcode()
})

</script>
<template>
  <NodeViewWrapper :id="props.node.attrs.id">
    <svg ref="barcode"></svg>
  </NodeViewWrapper>
</template>
