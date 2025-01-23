const { container, editor } = useStore()

export const useNodePostion = () => {
  const currentNode = document.querySelector(
    `${container} .page[data-page=true] .umo-node-focused, ${container} .page[data-page=true] .ProseMirror-gapcursor`,
  ) as HTMLElement
  if (currentNode === null) {
    return { offsetTop: null, offsetLeft: null }
  }

  // 当前元素距离页面顶部的距离
  let { offsetTop, offsetLeft } = currentNode

  // Get the parent page element
  const pageElement = currentNode.closest('.page[data-page=true]') as HTMLElement
  if (pageElement) {
    // Add the page's position to get the absolute position
    offsetTop += pageElement.offsetTop
  }

  // 微修正菜单位置
  offsetTop = currentNode.tagName === 'DIV' ? offsetTop - 8 : offsetTop - 5
  console.dir(currentNode)
  if (
    editor.value.isActive('horizontalRule') ||
    editor.value.isActive('table') ||
    currentNode.classList.contains('ProseMirror-gapcursor')
  ) {
    offsetTop = offsetTop + 5
  }
  return { offsetTop, offsetLeft }
}
