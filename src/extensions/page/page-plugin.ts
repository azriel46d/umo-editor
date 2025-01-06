import { type Editor, findParentNode } from '@tiptap/core'
import type { Node } from '@tiptap/pm/model'
import { type EditorState, Plugin, PluginKey } from '@tiptap/pm/state'
import type { EditorView } from '@tiptap/pm/view'

import type { NodesComputed } from '@/extensions/page/types'
import { PageState } from '@/extensions/page/types'

import { defaultNodesComputed, PageComputedContext } from './computed'
import {
  buildComputedHtml,
  findParentDomRefOfType,
  getDomHeight,
  getId,
  getPageOption,
  removeAbsentHtmlH,
} from './core'
import { CODE_BLOCK, IFRAME, IMAGE, PAGE, TOC, VIDEO } from './node-names'

let composition = false

function getTotalChildrenHeight(parentElement: Element) {
  let totalHeight = 0

  // 遍历所有的子元素
  const { children } = parentElement
  for (const child of children) {
    // 获取子元素的高度
    const { height } = getDomHeight(child as HTMLElement)
    // 累加高度
    totalHeight += height
  }

  // 返回所有子元素的高度总和
  return totalHeight
}

class PageDetector {
  #editor: Editor
  #pageClass: string
  #checkPoints = [IMAGE, IFRAME, CODE_BLOCK, TOC, VIDEO]
  lastTableUpdate: number | null = null

  constructor(editor: Editor, pageClass = '.umo-page-node-content') {
    this.#editor = editor
    this.#pageClass = pageClass
  }

  isOverflown(childrenHeight: number) {
    const { bodyHeight } = getPageOption()
    return childrenHeight > bodyHeight
  }

  checkCriticalPoint(node: Node) {
    const { childCount, firstChild } = node
    if (
      childCount === 1 &&
      firstChild?.type.name === 'table' &&
      firstChild.childCount === 1
    ) {
      return true
    }
    if (
      firstChild &&
      childCount === 1 &&
      this.#checkPoints.includes(firstChild.type.name)
    )
      return true
    return false
  }

  getTableRowsHeight(tableNode: Node): number {
    try {
      const domAtPos = this.#editor.view.domAtPos.bind(this.#editor.view)
      const resolvedPos = this.#editor.state.selection.$from
      const tableDOM = findParentDomRefOfType(
        this.#editor.schema.nodes.table,
        domAtPos
      )(this.#editor.state.selection)
      
      if (!tableDOM) return 0
      return (tableDOM as HTMLElement).offsetHeight
    } catch (e) {
      console.warn('Error measuring table height:', e)
      return 0
    }
  }

  #isTableCell(selection: Selection): boolean {
    const { $from } = selection
    let depth = $from.depth
    while (depth > 0) {
      const node = $from.node(depth)
      if (node.type.name === 'table_cell' || node.type.name === 'table_header') {
        return true
      }
      depth--
    }
    return false
  }

  update(view: EditorView, prevState: EditorState) {
    if (composition) return
    
    const state = paginationPluginKey.getState(view.state)
    if (!state.runState) return
    
    const { selection, schema, tr } = view.state
    if (view.state.doc.eq(prevState.doc)) return

    // Quick check for table cell editing
    if (this.#isTableCell(selection)) {
      return
    }

    const domAtPos = view.domAtPos.bind(view)
    const { scrollHeight } = paginationPluginKey.getState(prevState)
    const pageDOM = findParentDomRefOfType(
      schema.nodes[PAGE],
      domAtPos,
    )(selection)

    if (!pageDOM) return

    const pageBody = (pageDOM as HTMLElement).querySelector(this.#pageClass)
    if (!pageBody) { return; }

    const childrenHeight = getTotalChildrenHeight(pageBody)
    const deleting = scrollHeight > childrenHeight
    
    tr.setMeta('scrollHeight', childrenHeight)
    const inserting = this.isOverflown(childrenHeight)

    if (inserting) {
      const curPage = findParentNode((n) => n.type.name === PAGE)(selection)
      if (curPage && this.checkCriticalPoint(curPage.node)) return
      tr.setMeta('inserting', inserting)
    }

    if (deleting) {
      tr.setMeta('deleting', true)
    }
    view.dispatch(tr)
  }
}

export const paginationPluginKey = new PluginKey('pagination')
export const pagePlugin = (editor: Editor, nodesComputed: NodesComputed) => {
  buildComputedHtml()
  const plugin = new Plugin({
    key: paginationPluginKey,
    view: () => {
      return new PageDetector(editor)
    },
    state: {
      init: () => {
        return new PageState(false, false, false, false, 0, true)
      },
      apply: (tr, prevState) => {
        const newState = prevState.transform(tr)
        // Prevent rapid re-pagination
        if (tr.getMeta('preventPagination')) {
          newState.runState = false
        }
        return newState
      },
    },
    appendTransaction([newTr], _prevState, state) {
      // Skip if pagination is disabled
      if (!this.getState(state).runState) {
        return null
      }

      removeAbsentHtmlH()
      const page = new PageComputedContext(
        editor,
        { ...defaultNodesComputed, ...nodesComputed },
        this.getState(state),
        state,
      )
      return page.run()
    },
    props: {
      handleDOMEvents: {
        compositionstart(view) {
          composition = true
          // Disable pagination during composition
          view.dispatch(view.state.tr.setMeta('preventPagination', true))
          return false
        },
        compositionend(view) {
          composition = false
          // Re-enable pagination after composition
          setTimeout(() => {
            if (!view.isDestroyed) {
              view.dispatch(view.state.tr.setMeta('preventPagination', false))
            }
          }, 300)
          return false
        },
        keydown(view, event) {
          // Disable pagination during rapid typing
          if (!event.ctrlKey && !event.metaKey && !event.altKey) {
            view.dispatch(view.state.tr.setMeta('preventPagination', true))
            clearTimeout(this.paginationTimeout)
            this.paginationTimeout = setTimeout(() => {
              if (!view.isDestroyed) {
                view.dispatch(view.state.tr.setMeta('preventPagination', false))
              }
            }, 500)
          }
          return false
        }
      },
      transformPasted(slice) {
        slice.content.descendants((node: any) => {
          node.attrs.id = getId()
        })
        return slice
      },
    },
  })
  return plugin
}

export const idPluginKey = new PluginKey('attrkey')
export const idPlugin = (types: string[]) => {
  const plugin = new Plugin({
    key: idPluginKey,
    state: {
      init: () => {
        return false
      },
      apply: (tr, prevState) => {
        const data = tr.getMeta('initSplit')
        return data
      },
    },
    appendTransaction(transactions, _prevState, nextState) {
      const { tr } = nextState
      let modified = false
      const idsUsed = new Set()
      const init = idPluginKey.getState(nextState)
      if (init || transactions.some((transaction) => transaction.docChanged)) {
        nextState.doc.descendants((node, pos) => {
          const { attrs } = node

          if (types.includes(node.type.name) && (!attrs.id || idsUsed.has(attrs?.id))) {
            tr.setNodeMarkup(pos, undefined, { ...attrs, id: getId() })
            modified = true
          }

          if (attrs?.id) idsUsed.add(attrs.id)
        })
      }
      return modified ? tr : null
    },
  })

  return plugin
}
