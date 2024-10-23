<template>
  <menus-button
    ico="bold"
    text="Foreach"
    shortcut="Ctrl+Shift+F"
    hide-text
    @menu-click="onClick"
  />
</template>

<script setup lang="ts">
const { editor } = useStore()

const onClick = () => {
  console.log(editor.value)
  editor.value?.chain().focus().toggleForEach().run()
}

</script>
