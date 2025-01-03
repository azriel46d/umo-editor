<script setup lang="ts">
import { nodeViewProps, NodeViewWrapper } from '@tiptap/vue-3'
import JsBarcode from 'jsbarcode'
import Drager from 'es-drager'

const { options } = useStore()
const { node, updateAttributes } = defineProps(nodeViewProps)

const barcode = ref(null)
let selected = $ref(false)

const settings = computed(() => {
  return JSON.parse(node.attrs.settings)
})

const onDrag = ({ left, top }: { left: number; top: number }) => {
  updateAttributes({ left, top })
}

const onRotate = ({ angle }: { angle: number }) => {
  updateAttributes({ angle })
}

const renderBarcode = () => {
  JsBarcode(
    barcode.value,
    settings.value.content,
    settings.value,
  )
}

const propsBarCode = computed(() => {
  const { width = 100, height = 30 } = barcode.value?.getBoundingClientRect?.() ?? {}

  return { width, height }
})

onClickOutside(barcode, () => {
  selected = false
})

onMounted(() => {
  renderBarcode()
})

watch(settings, () => {
  renderBarcode()
})

watch(() => node.attrs.draggable, () => {
  updateAttributes({ top: 0, left: 0 })
})
</script>
<template>
  <NodeViewWrapper
    :id="node.attrs.id"
    :style="{ justifyContent: node.attrs.nodeAlign, display: 'flex' }"
  >
    <div :class="{ 'is-draggable': node.attrs.draggable }">
      <drager
        :selected="selected"
        :rotatable="true"
        :boundary="false"
        :resizable="false"
        :disabled="!Boolean(node.attrs.draggable) || options.document?.readOnly"
        :angle="node.attrs.angle"
        v-bind="propsBarCode"
        :left="Number(node.attrs.left)"
        :top="Number(node.attrs.top)"
        :z-index="node.attrs.zIndex"
        @rotate="onRotate"
        @drag="onDrag"
        @click="selected = true"
      >
        <svg ref="barcode"></svg>
      </drager>
    </div>
  </NodeViewWrapper>
</template>
