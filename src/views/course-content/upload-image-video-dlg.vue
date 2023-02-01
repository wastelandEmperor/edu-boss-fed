<template>
  <el-dialog
    title="上传视频"
    :visible.sync="dialogVisible"
    :close-on-press-escape="false"
    :close-on-click-modal="false">
    <!--accept 筛选出视频文件-->
    <el-upload
      class="upload-demo"
      action="#"
      accept="video/*"
      :show-file-list="false"
      :before-upload="storeVideoFile"
    >
      <el-button plain type="primary">选择视频</el-button>
      <div slot="tip" class="el-upload__tip">{{ uploadOption.videoTip }}</div>
    </el-upload>
    <el-upload
      class="upload-demo"
      action="#"
      accept="image/*"
      :show-file-list="false"
      :before-upload="storeImageFile"
      :http-request="handleUploadImage"
    >
      <el-button plain type="primary">选择图片</el-button>
      <div slot="tip" class="el-upload__tip">{{ uploadOption.imageTip }}</div>
    </el-upload>
    <el-button type="primary" @click="handleUploadVideo">开始上传</el-button>
    <p style="font-weight: bold">上传进度: {{ uploadOption.loadedPercent }}%</p>
    <p style="font-weight: bold">转码进度: {{ uploadOption.transCodePrecent }}%</p>
  </el-dialog>

</template>

<script>
// 上传的顺序：视频先保存，图片则去获取到服务器URL，之后开始上传视频和图片一起
import { aliyunTransCode, aliyunTransCodePercent, getImageUploadAuth, getVideoUploadAuth } from '@/api/aliyun-upload'

export default {
  name: 'UploadImageVideoDlg',
  data () {
    return {
      dialogVisible: false,
      uploadOption: {
        videoFile: null,
        videoTip: '只能上传 mp4 文件',
        imageFile: null,
        imageTip: '只能上传jpg/png文件',
        imageUrl: '',
        loadedPercent: 0, // 上传进度
        transCodePrecent: 0 // 视频转码进度,
      },
      lessonId: 0, // 课时ID
      initData: {}
    }
  },
  created () {
    this.initData = Object.assign({}, this.uploadOption)
  },
  methods: {
    // 返回一个 uploader 上传实例
    initUploader () {
      return new window.AliyunUpload.Vod({
        // userID，必填，您可以使用阿里云账号访问账号中心（https://account.console.aliyun.com/），即可查看账号ID
        userId: '1618139964448548',
        // 上传到视频点播的地域，默认值为'cn-shanghai'，
        // eu-central-1，ap-southeast-1
        region: '',
        // 分片大小默认1 MB，不能小于100 KB（100*1024）
        partSize: 1048576,
        // 并行上传分片个数，默认5
        parallel: 5,
        // 网络原因失败时，重新上传次数，默认为3
        retryCount: 3,
        // 网络原因失败时，重新上传间隔时间，默认为2秒
        retryDuration: 2,
        // 开始上传
        onUploadstarted: function (uploadInfo) {
        },
        // 文件上传成功
        onUploadSucceed: function (uploadInfo) {
        },
        // 文件上传失败
        onUploadFailed: function (uploadInfo, code, message) {
        },
        // 文件上传进度，单位：字节
        onUploadProgress: function (uploadInfo, totalSize, loadedPercent) {
        },
        // 上传凭证或STS token超时
        onUploadTokenExpired: function (uploadInfo) {
        },
        // 全部文件上传结束
        onUploadEnd: function (uploadInfo) {
        }
      })
    },
    showAndInit (node, data) {
      // 初始化
      this.dialogVisible = true
      this.uploadOption = Object.assign({}, this.initData)
      this.lessonId = data.id
    },
    // 储存视频文件信息
    storeVideoFile (file) {
      this.uploadOption.videoFile = file
      this.uploadOption.videoTip = file.name
      return false
    },
    // 储存图片文件信息
    storeImageFile (file) {
      this.uploadOption.imageFile = file
      this.uploadOption.imageTip = file.name
      return true
    },
    handleUploadImage (option) {
      // 阿里云的上传实例
      const uploader = this.initUploader()
      // 获取上传图片的凭证
      uploader.options.onUploadstarted = (uploadInfo) => {
        getImageUploadAuth().then(res => {
          if (res.data.code === '000000') {
            const {
              uploadAuth, // 授权
              uploadAddress, // 地址
              imageId,
              imageURL
            } = res.data.data
            uploader.setUploadAuthAndAddress(uploadInfo, uploadAuth, uploadAddress, imageId)
            this.uploadOption.imageUrl = imageURL
          } else {
            this.$message.error('获取上传图片的凭证失败！')
          }
        })
      }
      // 指定要上传的文件
      uploader.addFile(option.file)
      // 进行要上传操作
      uploader.startUpload()
    },
    handleUploadVideo () {
      const uploader = this.initUploader()
      // 获取上传视频的凭证
      uploader.options.onUploadstarted = (uploadInfo) => {
        getVideoUploadAuth(this.uploadOption.videoFile.name, this.uploadOption.imageUrl).then(res => {
          if (res.data.code === '000000') {
            const {
              uploadAuth, // 权限
              uploadAddress, // 地址
              videoId
            } = res.data.data
            // 配置一下
            uploader.setUploadAuthAndAddress(uploadInfo, uploadAuth, uploadAddress, videoId)
            this.uploadOption.videoId = videoId
          } else {
            this.$message.error('获取上传视频的凭证失败！')
          }
        })
      }
      // 上传进度
      uploader.options.onUploadProgress = (uploadInfo, totalSize, loadedPercent) => {
        this.uploadOption.loadedPercent = loadedPercent * 100
      }
      // 当上传完成后，发出转码请求
      uploader.options.onUploadEnd = async (uploadInfo) => {
        // 发起请求转码（课时对应的视频去转码）
        aliyunTransCode({
          lessonId: this.lessonId,
          coverImageUrl: this.uploadOption.imageUrl,
          fileId: this.uploadOption.videoId,
          fileName: this.uploadOption.videoFile.name
        })
          .then(res => {
            if (res.data.code === '000000') {
              // 已发送转码请求，每隔一会去获取转码的进度
              const timer = setInterval(() => {
                // 课时对应视频的转码进度
                aliyunTransCodePercent(this.lessonId).then(res => {
                  if (res.data.code === '000000') {
                    this.uploadOption.transCodePrecent = res.data.data
                    // 转码完成
                    if (res.data.data === 100) {
                      clearInterval(timer)
                      this.$message.success('转码成功')
                    }
                  }
                })
              }, 1000)
            }
          })
      }
      uploader.addFile(this.uploadOption.videoFile)
      uploader.startUpload()
    }
  }
}
</script>

<style scoped>
.upload-demo {
  height: 100px;
}
</style>
