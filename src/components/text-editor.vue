<template>
  <div style="border: 1px solid #ccc;">
    <!--头部工具栏-->
    <Toolbar
      style="border-bottom: 1px solid #ccc"
      :editor="editor"
      :defaultConfig="toolbarConfig"
      :mode="mode"
    />
    <!--真正的内容区，课程详情应该与之绑定-->
    <!--courseData.courseDescriptionMarkDown  -> value -> html -->
    <!--让三者连起来: MarkDown改了html也该改，html改了 MarkDown也该改-->
    <Editor
      style="height: 500px; overflow-y: hidden;"
      v-model="html"
      :defaultConfig="editorConfig"
      :mode="html"
      @onCreated="onCreated"
    />
    <!--@onChange="onChange"-->
  </div>
</template>

<script>
import { Editor, Toolbar } from '@wangeditor/editor-for-vue'
// 上传图片获取对应服务器URL
import { uploadImage } from '@/api/course'

export default {
  name: 'TextEditor',
  props: {
    value: {
      type: String
    }
  },
  watch: {
    value: {
      handler (newVal) {
        this.html = newVal
      }
    },
    html: {
      handler (newVal) {
        this.$emit('input', newVal)
      }
    }
  },
  components: {
    Editor,
    Toolbar
  },
  data () {
    return {
      editor: null,
      html: this.value,
      toolbarConfig: {},
      editorConfig: {
        placeholder: '请输入内容...',
        MENU_CONF: {
          uploadImage: {
            customUpload: this.customUpload
          }
        }
      },
      mode: 'default' // or 'simple'
    }
  },
  methods: {
    onCreated (editor) {
      this.editor = Object.seal(editor) // 一定要用 Object.seal() ，否则会报错
    },
    // 自定义，富文本上传图片方法
    customUpload (file, insertFn) {
      const fd = new FormData()
      fd.append('file', file)
      uploadImage(fd).then(res => {
        if (res.data.code === '000000') {
          insertFn(res.data.data.name)
        } else {
          this.$message.error('上传图片失败！')
        }
      })
    }
    // 可用watch html
    // onChange (editor) {
    //   this.$emit('input', editor.getHtml())
    // }
  },
  beforeDestroy () {
    const editor = this.editor
    if (editor == null) return
    editor.destroy() // 组件销毁时，及时销毁编辑器
  }
}
</script>

<style src="@wangeditor/editor/dist/css/style.css"></style>
