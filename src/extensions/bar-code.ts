import { Node, mergeAttributes } from '@tiptap/core'
import { VueNodeViewRenderer } from '@tiptap/vue-3'
import Component from '@/components/editor/extensions/barcode.vue'

export default Node.create({
  name: BARCODE,
  group: 'block',

  atom: true,

  addAttributes() {
    return {
      id: {
        default: null,
      },
      settings: {
        default: '{}'
      },
      nodeAlign: {
        default: 'flex-start'
      },
      draggable: {
        default: false,
      },
      left: {
        default: 0,
      },
      top: {
        default: 0,
      },
      angle: {
        default: null,
      },
      zIndex: {
        default: 100,
      },
    }
  },

  parseHTML() {
    return [
      {
        tag: 'bar-code',
      },
    ]
  },

  renderHTML({ HTMLAttributes }) {
    return ['bar-code', mergeAttributes(this.options.HTMLAttributes, HTMLAttributes)]
  },

  addNodeView() {
    return VueNodeViewRenderer(Component)
  },
})


