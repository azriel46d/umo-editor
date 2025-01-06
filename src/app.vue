<template>
  <div class="box" :class="{ 'hide-editor': readOnly }">
    <button @click="toggleReadOnly">readonly</button>
    <button @click="editorRef.print">print</button>
    <button @click="toggleLang">language</button>
    <umo-editor ref="editorRef" v-bind="options" />
  </div>
</template>

<script setup lang="ts">


import { shortId } from '@/utils/short-id'
// import { UmoEditor } from '../dist/umo-editor'

const editorRef = $ref(null)
let readOnly = $ref(false)


const toggleReadOnly = () => {
  readOnly = !readOnly
  editorRef.setReadOnly(readOnly)
}

onMounted(() => {
  editorRef.setReadOnly(readOnly)
})

const templates = [
  {
    title: { zh_CN: '工作任务', en_US: 'Work Task', pt_BR: 'Tarefas de Trabalho' },
    description: { zh_CN: '工作任务模板', en_US: 'Work Task Template', pt_BR: 'Modelo de Tarefas de Trabalho' },
    content:
      `<p id="b9s3774c" extend="false">@foreach ($data as $row)</p><bar-code value="{{ $row['eans_codigo'] }}" settings="{&quot;width&quot;:2,&quot;height&quot;:100,&quot;font&quot;:&quot;&quot;,&quot;format&quot;:&quot;CODE128&quot;,&quot;lineColor&quot;:&quot;#000&quot;,&quot;background&quot;:&quot;&quot;,&quot;fontOptions&quot;:&quot;&quot;,&quot;displayValue&quot;:true,&quot;textAlign&quot;:&quot;center&quot;,&quot;textPosition&quot;:&quot;bottom&quot;,&quot;fontSize&quot;:20,&quot;textMargin&quot;:2,&quot;margin&quot;:10}"></bar-code><p id="b9s3774c" extend="false">@endforeach</p><p id="b9s3774c" extend="false">fdsadfafdsadfa</p><p id="b9s3774c" extend="false">fdsadfa</p><p id="b9s3774c" extend="false">fdsadfa</p><p id="b9s3774c" extend="false">fdsadfa</p>`,
  },
  {
    title: { zh_CN: '工作周报', en_US: 'Weekly Report', pt_BR: 'Relatório Semanal' },
    description: { zh_CN: '工作周报模板', en_US: 'Weekly Report Template', pt_BR: 'Modelo de Relatório Semanal' },
    content:
      '<h1>工作周报</h1><h2>本周工作总结</h2><hr /><h3>已完成工作：</h3><ul><li>[任务1名称]：[简要描述任务内容及完成情况]</li><li>[任务2名称]：[简要描述任务内容及完成情况]</li><li>...</li></ul><h3>进行中工作：</h3><ul><li>[任务1名称]：[简要描述任务当前进度和下一步计划]</li><li>[任务2名称]：[简要描述任务当前进度和下一步计划]</li><li>...</li></ul><h3>问题与挑战：</h3><ul><li>[问题1]：[描述遇到的问题及当前解决方案或需要的支持]</li><li>[问题2]：[描述遇到的问题及当前解决方案或需要的支持]</li><li>...</li></ul><hr /><h2>下周工作计划</h2><h3>计划开展工作：</h3><ul><li>[任务1名称]：[简要描述下周计划开始的任务内容]</li><li>[任务2名称]：[简要描述下周计划开始的任务内容]</li><li>...</li></ul><h3>需要支持与资源：</h3><ul><li>[资源1]：[描述需要的资源或支持]</li><li>[资源2]：[描述需要的资源或支持]</li><li>...</li></ul>',
  },
]
const options = $ref({
  locale: 'en-US',
  toolbar: {
    // defaultMode: 'classic',
    // menus: ['base'],
    enableSourceEditor: true,
  },
  document: {
    // title: '测试文档',
    content: `<p id="r27887oo" extend="false"></p><p id="x9u7p4ur" extend="false" class="p-empty"></p><text-box id="v5uggu07" extend="false" vnode="true" width="200" height="34" left="6" top="10" draggable="true" rotatable="true" borderwidth="1" bordercolor="#000" borderstyle="solid" backgroundcolor="transparent"><p id="fcv0ph61" extend="false">ELIEZER 1</p></text-box><img id="7s9tr1vd" extend="false" vnode="true" type="image-url" originalsrc="http://izziback.local:83/api/clientes/edbf3cb0-dc12-11ea-b060-731e0ea9161d/imagem" src="https://dummyimage.com/100x100/eee/aaa" width="148.00" height="150" left="35" top="6" draggable="true" rotatable="true" equalproportion="true" flipx="false" flipy="false" uploaded="false" error="false" previewtype="image" zindex="10"><p id="vxbm4tnp" extend="false" class="p-empty"></p><p id="xfzcl1zj" extend="false" class="p-empty"></p><p id="3anxk869" extend="false" class="p-empty"></p><p id="qj7rpy7b" extend="false" class="p-empty"></p><p id="myz88385" extend="false" class="p-empty"></p><p id="avaff9cl" extend="false" class="p-empty"></p><p id="6i55syba" extend="false" class="p-empty"></p><p id="k7pywz29" extend="false" class="p-empty"></p><p id="ix5nap3y" extend="false" class="p-empty"></p><p id="hj87diu7" extend="false" class="p-empty"></p><p id="5pl19tvt" extend="false" class="p-empty"></p><p id="nwkibfdl" extend="false" class="p-empty"></p><p id="kboiw4k2" extend="false" class="p-empty"></p><p id="9we85xm2" extend="false" class="p-empty"></p><p id="r27887oo" extend="false"></p><p id="x9u7p4ur" extend="false" class="p-empty">s</p><p id="9we85xm3" extend="false" >x</p><text-box id="v5uggu07" extend="false" vnode="true" width="200" height="34" left="6" top="10" draggable="true" rotatable="true" borderwidth="1" bordercolor="#000" borderstyle="solid" backgroundcolor="transparent"><p id="fcv0ph61" extend="false">ELIEZER 1</p></text-box><img id="7s9tr1vd" extend="false" vnode="true" type="image-url" originalsrc="http://izziback.local:83/api/clientes/edbf3cb0-dc12-11ea-b060-731e0ea9161d/imagem" src="https://dummyimage.com/100x100/eee/aaa" width="148.00" height="150" left="35" top="6" draggable="true" rotatable="true" equalproportion="true" flipx="false" flipy="false" uploaded="false" error="false" previewtype="image" zindex="10"><p id="vxbm4tnp" extend="false" class="p-empty"></p><p id="xfzcl1zj" extend="false" class="p-empty"></p><p id="3anxk869" extend="false" class="p-empty"></p><p id="qj7rpy7b" extend="false" class="p-empty"></p><p id="myz88385" extend="false" class="p-empty"></p><p id="avaff9cl" extend="false" class="p-empty"></p><p id="6i55syba" extend="false" class="p-empty"></p><p id="k7pywz29" extend="false" class="p-empty"></p><p id="ix5nap3y" extend="false" class="p-empty"></p><p id="hj87diu7" extend="false" class="p-empty"></p><p id="5pl19tvt" extend="false" class="p-empty"></p><p id="nwkibfdl" extend="false" class="p-empty"></p><p id="kboiw4k2" extend="false" class="p-empty"></p><p id="9we85xm2" extend="false" class="p-empty"></p><p id="9we85xm2" extend="false" class="p-empty">p</p>`,
    typographyRules: {
      openDoubleQuote: false,
      rightArrow: false,
      leftArrow: false,
      closeDoubleQuote: false,
      openSingleQuote: false,
      closeSingleQuote: false,
      notEqual: false

    },
  },
  dicts: {
    "pageSizes": [
      {
        "label": "A4",
        "width": 21,
        "height": 29.4,
        "default": true
      }
    ]
  },
  templates,
  cdnUrl: 'https://cdn.umodoc.com',
  shareUrl: 'https://umodoc.com',
  file: {
    // allowedMimeTypes: [
    //   'application/pdf',
    //   'image/svg+xml',
    //   'video/mp4',
    //   'audio/*',
    // ],
  },
  assistant: {
    enabled: true,
  },
  user: {
    userId: 'umoeditor',
    nickName: 'Umo Editor',
    avatarUrl: 'https://tdesign.gtimg.com/site/avatar.jpg',
  },
  "page": {
    "defaultMargin": {
      "left": 1.18,
      "right": 1.18,
      "top": 2.54,
      "bottom": 2.54
    },
    "defaultOrientation": "portrait",
    "defaultBackground": "#fff",
    "watermark": {
      "type": "compact",
      "alpha": 0.2,
      "fontColor": "#000",
      "fontFamily": "SimSun",
      "fontSize": 16,
      "fontWeight": "normal",
      "text": ""
    },
    "nodesComputedOption": {
      "types": [],
      "nodesComputed": {}
    }
  },
  async onSave(_: string, __: number, document: { content: string }) {
    console.log(document.content)
    console.log(editorRef.getHTML())
    console.log(editorRef.getJSON())
  },
  async onFileDelete(...args: any) {
    console.log(args)
  },
  async onFileUpload(file: File & { url?: string }) {
    console.log(file)
    if (!file) {
      throw new Error('没有找到要上传的文件')
    }

    await new Promise((resolve) => setTimeout(resolve, 3000))
    return {
      id: shortId(),
      url: file.url ?? URL.createObjectURL(file),
      name: file.name,
      type: file.type,
      size: file.size,
    }
  },
  async onAssistant() {
    return await Promise.resolve('<p>AI助手测试</p>')
  },
  async onCustomImportWordMethod() {
    return await Promise.resolve({
      value: '<p>测试导入word</p>',
    })
  },
})
</script>

<style>
.box {
  margin: 20px;
  height: calc(400vh - 40px);
  border: solid 1px #ddd;
  box-sizing: border-box;
  position: relative;
}
</style>
