<template>
  <menus-button
    ico="image"
    :text="t('insert.image')"
    huge
    @menu-click="editor?.chain().focus().selectFiles('image', true).run()"
  />
  <menus-button
    ico="image"
    :text="t('insert.link.image')"
    huge
    @menu-click="dialogVisible.imageUrl = true"
  >
    <modal
      :visible="dialogVisible.imageUrl"
      icon="image"
      :header="t('insert.link.image')"
      width="420px"
      @confirm="setImage"
      @close="dialogVisible.imageUrl = false"
    >
      <div class="umo-link-container">
        <t-form label-align="top">
          <t-form-item :label="t('insert.link.href')">
            <t-input
              @blur="onBlur"
              v-model="form.url"
              type="url"
              clearable
              :placeholder="t('insert.link.hrefTip')"
            />
          </t-form-item>
        </t-form>
        <div class="umo-preview-image-render">
          <div
            class="umo-preview-title"
            v-text="t('tools.barcode.preview')"
          ></div>
          <div class="umo-preview-image narrow-scrollbar">
            <img :src="urlPreview" />
          </div>
        </div>
      </div>
    </modal>
  </menus-button>
</template>

<script setup lang="ts">
import { validImage } from '@/extensions/image';

const { editor } = useStore()

const dialogVisible = reactive({
  imageUrl: false
})

const form = reactive({
  url: '',
  errors: {
    url: false
  }
})

const IMAGE_PLACEHOLDER = 'https://dummyimage.com/100x100/eee/aaa'

let urlPreview = $ref(IMAGE_PLACEHOLDER)

const onBlur = async () => {
  if (form?.url?.match(/^https?:\/\//)) {
    try {
      await validImage(form.url, 1000)
      form.errors.url = false
      urlPreview = form.url
    } catch (e) {
      form.errors.url = true
    }

    return;
  }

  form.errors.url = true
  urlPreview = IMAGE_PLACEHOLDER
}

const setImage = () => {
  editor.value
    ?.chain()
    .focus()
    .setImage({
      type: 'image-url',
      src: urlPreview,
      originalSrc: form.errors.url ? form.url : null,
      width: 'auto',
      height: 150,
      rotatable: true,
    }, true)
    .run()

  dialogVisible.imageUrl = false
}

</script>
<style lang="less" scoped>
.umo-link-container {
  padding: 2px;
  :deep(.umo-form__item) {
    &:not(:last-child) {
      margin-bottom: 10px;
    }
  }
}

.umo-preview-image-render {
  border: solid 1px var(--td-border-level-2-color);
  border-radius: var(--umo-radius);
  position: relative;
  overflow: hidden;
  box-sizing: border-box;
  margin-top: 10px;
  .umo-preview-title {
    background-color: var(--umo-button-hover-background);
    padding: 0 10px;
    position: absolute;
    font-size: 12px;
    border-bottom-right-radius: var(--umo-radius);
  }
  .umo-preview-image {
    display: flex;
    align-items: center;
    justify-content: center;
    min-height: 100px;
  }
}
</style>
