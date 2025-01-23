<template>
  <iframe ref="iframeRef" class="umo-print-iframe" :srcdoc="iframeCode" />
</template>

<script setup lang="ts">
const { container, options, editor, page, printing, exportPDF } = useStore()

const iframeRef = $ref<HTMLIFrameElement | null>(null)
let iframeCode = $ref('')
const getStylesHtml = () => {
  return Array.from(document.querySelectorAll('link, style'))
    .map((item) => item.outerHTML)
    .join('')
}

const getPlyrSprite = () => {
  return document.querySelector('#sprite-plyr')?.innerHTML ?? ''
}

const getContentHtml = () => {
  return (
    document.querySelector(`${container} .umo-page-content`)?.outerHTML ?? ''
  )
}

const defaultLineHeight = $computed(
  () =>
    options.value.dicts?.lineHeights.find(
      (item: { default: any }) => item.default,
    )?.value,
)

const getIframeCode = () => {
<<<<<<< HEAD
  const { readOnly } = options.value.document
  const { orientation, size, background } = page.value

=======
  const { orientation, size, margin, background } = page.value
>>>>>>> 2c2ed5be5052d8803ba4e9eb804ba6ea001c2a60
  /* eslint-disable */
  return `
    <!DOCTYPE html>
    <html lang="zh-CN" theme-mode="${options.value.theme}">
    <head>
      <title>${options.value.document?.title}</title>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      ${getStylesHtml()}
      <style>
      body{
        overflow: auto;
        height: auto;
        background-color: ${background};
        -webkit-print-color-adjust: exact;
      }
      .umo-page-content{
        transform: scale(1) !important;
      }
      @page {
<<<<<<< HEAD
        size: ${orientation === 'portrait' ? size?.width : size?.height}cm ${orientation === 'portrait' ? size?.height : size?.width}cm;
        margin:0;
        background: ${background};
=======
        size: ${orientation === 'portrait' ? size?.width : size?.height}cm ${orientation === 'portrait' ? size?.height : size?.width}cm; 
        margin: ${margin?.top}cm 0 ${margin?.bottom}cm;
        padding: 0;
      }
      @page:first {
        margin-top: 0;
      }
      @page:last {
        margin-bottom: 0;
        page-break-after: avoid;
>>>>>>> 2c2ed5be5052d8803ba4e9eb804ba6ea001c2a60
      }
      </style>
    </head>
    <body class="is-print">
      <div id="sprite-plyr" style="display: none;">
      ${getPlyrSprite()}
      </div>
      <div ${readOnly ? 'class="hide-editor"' : ''}>
        <div class="umo-editor-container" style="line-height: ${defaultLineHeight};" aria-expanded="false">
          <div class="tiptap umo-editor" translate="no">
            ${getContentHtml()}
          </div>
        </div>
      </div>
      <script>
        document.addEventListener("DOMContentLoaded", (event) => {
          const observer = new MutationObserver(mutations => {
            mutations.forEach(mutation => {
              if (mutation.removedNodes) {
                Array.from(mutation.removedNodes).forEach(node => {
                  if (node?.classList?.contains('umo-page-watermark')) {
                    location.reload();
                  }
                });
              }
            });
          });
        });
      <\/script>
    </body>
    </html>`
  /* eslint-enable */
}

const printPage = () => {
  editor.value?.commands.blur()
  iframeCode = getIframeCode()

  const dialog = useConfirm({
    theme: 'info',
    header: printing.value ? t('print.title') : t('export.pdf.title'),
    body: printing.value ? t('print.message') : t('export.pdf.message'),
    confirmBtn: printing.value ? t('print.confirm') : t('export.pdf.confirm'),
    onConfirm() {
      dialog.destroy()
      setTimeout(() => {
        iframeRef?.contentWindow?.print()
      }, 300)
    },
    onClosed() {
      printing.value = false
      exportPDF.value = false
    },
  })
}

watch(
  () => [printing.value, exportPDF.value],
  (value: [boolean, boolean]) => {
    if (!value[0] && !value[1]) {
      return
    }
    printPage()
  },
)
</script>

<style lang="less" scoped>
.umo-print-iframe {
  position: absolute;
  width: 0;
  height: 0;
  border: none;
  overflow: auto;
}
</style>
