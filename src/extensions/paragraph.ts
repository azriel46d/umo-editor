import Paragraph from '@tiptap/extension-paragraph'

export default Paragraph.extend({
  addAttributes() {
    return {
      ...this.parent?.(),
      class: {
        default: null,
        parseHTML: (element) => element.getAttribute('class'),
        renderHTML: ({ class: className }) => {
          const attrs: { class?: string } = {}

          if (className) {
            attrs.class = className
          }

          return attrs
        },
      }
    }
  }
})
