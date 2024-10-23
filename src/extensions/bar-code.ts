import { Node, mergeAttributes } from '@tiptap/core'
import { VueNodeViewRenderer } from '@tiptap/vue-3'
import Component from '@/components/editor/extensions/barcode.vue'

export default Node.create({
  name: 'barCode',
  group: 'block',

  atom: true,

  addAttributes() {
    return {
      value: {
        default: '0148043',
      },
      settings: {
        default: {
          default: '{}'
        }
      }
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
    return ['bar-code', mergeAttributes(HTMLAttributes)]
  },

  addNodeView() {
    return VueNodeViewRenderer(Component)
  },
})


