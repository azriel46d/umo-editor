import ImageExtension from '@tiptap/extension-image'
import { type CommandProps, VueNodeViewRenderer } from '@tiptap/vue-3'

import NodeView from './node-view.vue'
declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    setImage: {
      setImage: (options: any, replace?: any) => ReturnType
    }
  }
}

export function validImage(url: string, timeoutT?: number) {
    return new Promise(function (resolve, reject) {
        var timeout = timeoutT || 5000;
        var timer: NodeJS.Timeout, img = new Image();

        img.onerror = img.onabort = function () {
            clearTimeout(timer);
            reject("error");
        };

        img.onload = function () {
            clearTimeout(timer);
            resolve("success");
        };

        timer = setTimeout(function () {
            img.src = "//!!!!/test.jpg";
            reject("timeout");
        }, timeout);
        img.src = url;
    });
}

export default ImageExtension.extend({
  atom: true,
  addAttributes() {
    return {
      vnode: {
        default: true,
      },
      id: {
        default: null,
      },
      type: {
        default: 'image',
      },
      name: {
        default: null,
      },
      originalSrc: {
        default: null
      },
      size: {
        default: null,
      },
      file: {
        default: null,
      },
      src: {
        default: null,
      },
      content: {
        default: null,
      },
      width: {
        default: null,
      },
      height: {
        default: 200,
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
      draggable: {
        default: false,
      },
      rotatable: {
        default: false,
      },
      equalProportion: {
        default: true,
      },
      flipX: {
        default: false,
      },
      flipY: {
        default: false,
      },
      uploaded: {
        default: false,
      },
      error: {
        default: false,
      },
      previewType: {
        default: 'image',
      },
      zIndex: {
        default: 0
      }
    }
  },
  parseHTML() {
    return [{ tag: 'img' }]
  },
  addNodeView() {
    return VueNodeViewRenderer(NodeView)
  },
  addCommands() {
    return {
      setImage:
        (
          options: { src: string; alt?: string; title?: string },
          replace?: boolean,
        ) =>
        ({ commands, editor }: CommandProps) => {
          if (replace) {
            return commands.insertContent({
              type: this.name,
              attrs: options,
            })
          }
          return commands.insertContentAt(editor.state.selection.anchor, {
            type: this.name,
            attrs: options,
          })
        },
    }
  },
})
