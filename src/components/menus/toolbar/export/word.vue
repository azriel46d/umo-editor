<template>
  <menus-button text="Word" ico="word" huge @click="exportToWord" />
</template>

<script setup lang="ts">
import { Document, HeadingLevel, HeightRule, ImageRun, Packer, PageBreak, Paragraph, Table, TableCell, TableLayoutType, TableRow, TextRun, VerticalAlign, WidthType } from 'docx'

const { editor, options } = useStore()


// Convert base64 to array buffer
const base64ToArrayBuffer = (base64: string) => {
  const binaryString = window.atob(base64)
  const bytes = new Uint8Array(binaryString.length)
  for (let i = 0; i < binaryString.length; i++) {
    bytes[i] = binaryString.charCodeAt(i)
  }
  return bytes.buffer
}

// Fetch image and convert to array buffer
const getImageBuffer = async (src: string): Promise<ArrayBuffer> => {
  if (src.startsWith('data:')) {
    //@ts-ignore
    const base64 = src.split(',')[1]
    return base64ToArrayBuffer(base64)
  }

  const response = await fetch(src)
  return await response.arrayBuffer()
}

const convertTextToRuns = (text: string, marks: any[] = []) => {
  const options: any = {}

  marks?.forEach(mark => {
    if (mark.type === 'bold') options.bold = true
    if (mark.type === 'italic') options.italic = true
    if (mark.type === 'underline') options.underline = {}
    if (mark.type === 'strike') options.strike = true
    if (mark.type === 'textStyle' && mark.attrs.color) {
      options.color = mark.attrs.color
    }
  })

  return new TextRun({ text, ...options })
}

const processNode = async (node: any): Promise<any[]> => {
  const elements: any[] = []

  if (node.type === 'doc') {
    // Process all child nodes
    const children = await Promise.all(node.content?.map(processNode) || [])
    return children.flat()
  }

  if (node.type === 'page') {
    // Process page content and add page break
    const pageContent = await Promise.all(node.content?.map(processNode) || [])
    elements.push(...pageContent.flat())

    // Add page break after each page except the last one
    if (node.attrs?.isLastPage !== true) {
      elements.push(new Paragraph({
        children: [new PageBreak()]
      }))
    }
    return elements
  }

  if (node.type === 'text') {
    return [convertTextToRuns(node.text, node.marks)]
  }

  if (node.type === 'paragraph') {
    const runs = await Promise.all(node.content?.map(processNode) || [])
    elements.push(new Paragraph({ children: runs.flat() }))
  }

  if (node.type === 'heading') {
    const level = node.attrs.level as number
    const runs = await Promise.all(node.content?.map(processNode) || [])
    elements.push(new Paragraph({
      children: runs.flat(),
      //@ts-ignore
      heading: HeadingLevel[`HEADING_${level}`]
    }))
  }

  if (node.type === 'table') {
    const rows = await Promise.all(node.content?.map(async (row: any) => {
      const cells = await Promise.all(row.content?.map(async (cell: any, columnIndex: number) => {
        const paragraphs = (await Promise.all(cell.content?.map(processNode) || [])).flat()

        return new TableCell({
          children: paragraphs,
          width: {
            size: columnIndex === 0 ? 1000 : 8000, // First column 1000 twips, second column 8000 twips
            type: WidthType.DXA
          },
          margins: {
            top: 100,
            bottom: 100,
            left: 150,
            right: 150
          },
          verticalAlign: VerticalAlign.TOP
        })
      }) || [])
      return new TableRow({
        children: cells,
        height: {
          value: 400,
          rule: HeightRule.ATLEAST
        }
      })
    }) || [])

    elements.push(new Table({
      rows,
      width: {
        size: 9000,
        type: WidthType.DXA
      },
      columnWidths: [1000, 8000], // Explicitly set column widths
      margins: {
        top: 100,
        bottom: 100,
        left: 0,
        right: 0
      },
      indent: {
        size: 0,
        type: WidthType.DXA
      },
      layout: TableLayoutType.FIXED // Force fixed width layout
    }))
  }
  if (node.type === 'bulletList') {
    const listItems = await Promise.all(node.content?.map(async (item: any) => {
      // Get the text content from the nested structure
      const text = item.content?.[0]?.content?.[0]?.text || ''

      return new Paragraph({
        bullet: {
          level: 0
        },
        children: [
          new TextRun(text)
        ],
        indent: { left: 720 }
      })
    }) || [])

    elements.push(...listItems)
  }
  if (node.type === 'image') {
    try {
      const imageBuffer = await getImageBuffer(node.attrs.src)
      elements.push(new Paragraph({
        children: [
          new ImageRun({
            data: imageBuffer,
            transformation: {
              width: node.attrs.width,
              height: node.attrs.height
            }
          })
        ]
      }))
    } catch (error) {
      console.error('Error processing image:', error)
      elements.push(new Paragraph({
        children: [new TextRun({ text: '[Image]' })]
      }))
    }
  }

  return elements
}

const exportToWord = async () => {
  try {
    const json = editor.value?.getJSON()
    if (!json) {
      useMessage('error', {
        content: t('save.failed'),
        placement: 'bottom',
        offset: [0, -20],
      })
      return
    }

    // Process the document starting from the root
    const elements = await processNode(json)

    const doc = new Document({
      sections: [{
        properties: {},
        children: elements
      }]
    })

    const blob = await Packer.toBlob(doc)
    const url = URL.createObjectURL(blob)

    const link = document.createElement('a')
    link.href = url
    link.download = `${options.value.document.title || 'document'}.docx`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)

    useMessage('success', {
      content: t('export.success'),
      placement: 'bottom',
      offset: [0, -20],
    })
  } catch (error) {
    console.error('Export error:', error)
    useMessage('error', {
      content: t('export.error'),
      placement: 'bottom',
      offset: [0, -20],
    })
  }
}
</script>

<style lang="less" scoped></style>
