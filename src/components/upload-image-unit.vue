<template>
  <div class="upload-image-unit">
    <!--图片上传完后，进度条显示成功-->
    <el-progress
      type="circle"
      :width="178"
      :percentage="uploadedPercentage"
      :status="uploadedPercentage === 100 ? 'success' : undefined"
      v-if="isUploading"
    />
    <el-upload
      class="avatar-uploader"
      action="#"
      :show-file-list="false"
      :http-request="handleUpload"
      v-else
    >
      <img v-if="value" :src="value" class="avatar">
      <i v-else class="el-icon-plus avatar-uploader-icon"></i>
    </el-upload>
  </div>
</template>

<script>
// 功能： 上传图片至服务器，获取到URL并将其保存至课程信息中
import { uploadImage } from '@/api/course'

export default {
  name: 'UploadImageUnit',
  props: {
    value: {
      type: String
    }
  },
  data () {
    return {
      uploadedPercentage: 0, // 上传进度条
      isUploading: false // 标识当前是否正在上传
    }
  },
  methods: {
    // 上传图片的自定义方法
    handleUpload (option) {
      // 自己定义的上传行为方法，那会执行该方法并将上传的图片相关信息，以option
      this.isUploading = true
      const fd = new FormData()
      fd.append('file', option.file)
      // 图片上传到服务器，获取对应的URL地址
      uploadImage(fd, (e) => {
        // 上传这一过程中，有很多时刻会调用onUploadProgress
        // e.total 数据总大小(图片大小) e.loaded 当前已上传多少(图片已上传了多少)
        this.uploadedPercentage = Math.floor(e.loaded / e.total * 100)
      })
        .then(res => {
          if (res.data.code === '000000') {
            // 将响应的图片 URL 存储，但不能直接修改value,需通过input事件来（固定死的）
            this.$emit('input', res.data.data.name)
          } else {
            this.$message.error('图片上传失败！')
          }
        })
        .finally(() => {
          this.isUploading = false
        })
    }
  }
}
</script>

<style lang="scss" scoped>
/* 头像上传 */
.avatar-uploader ::v-deep .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}

.avatar-uploader ::v-deep .el-upload:hover {
  border-color: #409EFF;
}

.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  line-height: 178px;
  text-align: center;
}

.avatar {
  width: 178px;
  height: 178px;
  display: block;
}
</style>
