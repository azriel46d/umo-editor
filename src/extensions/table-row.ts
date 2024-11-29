import TableRow from "@tiptap/extension-table-row";

export default TableRow.extend({
  addAttributes() {
    return {
      ...this.parent?.(),
      class: {
        default: null,
        parseHTML: (element) => element.getAttribute('data-class'),
        renderHTML: ({ class: className }) => {
          const attrs: { 'data-class': any; class?: string } = {
            'data-class': className,
          }

          if (className) {
            attrs.class = className
          }

          return attrs
        },
      }
    }
  },
})
