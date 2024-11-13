import { mergeAttributes, Node } from '@tiptap/core'
import { VueNodeViewRenderer } from '@tiptap/vue-3'
import Component from '../../components/editor/extensions/blade/foreach.vue'

export const BladeForeach = Node.create({
  name: 'bladeForeach',

  group: 'block',
  content: 'block+',

  defining: true,

  addOptions() {
    return {
      HTMLAttributes: {},
    }
  },

  addAttributes() {
    return {
      start: {
        default: 1,
        parseHTML: element => {
          return element.hasAttribute('start')
            ? parseInt(element.getAttribute('start') || '', 10)
            : 1
        },
      },
      type: {
        default: undefined,
        parseHTML: element => {
          return element.getAttribute('type')
        },
      },
    }
  },

  parseHTML() {
    return [
      {
        tag: 'blade-foreach',
      },
    ]
  },

  renderHTML({ HTMLAttributes }) {
    return ['blade-foreach', mergeAttributes(this.options.HTMLAttributes, HTMLAttributes), 0]
  },

  addCommands(): any {
    return {
      toggleForEach: () => (args: any) => {
        return args.commands.toggleWrap(this.name, { level: 1 })
      },
    }
  },

  addNodeView() {
    return VueNodeViewRenderer(Component)
  },
})
