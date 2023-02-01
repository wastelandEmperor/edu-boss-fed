<template>
  <div class="login">
    <el-form ref="loginForm" :model="formData" :rules="rules" label-position="top" label-width="80px">
      <h2>登录</h2>
      <!-- prop: 应用 rules 中哪一“套”规则 -->
      <!-- 为何不将规则应用到指定表单项上？ 样式-->
      <el-form-item label="手机号" prop="phone">
        <el-input v-model="formData.phone"></el-input>
      </el-form-item>
      <el-form-item label="密码" prop="password">
        <el-input type="password" v-model="formData.password"></el-input>
      </el-form-item>
      <el-form-item>
        <!--v-loading :loading 不是一个，真值时开个遮罩让用户点不了-->
        <el-button type="primary" @click="loginSubmit" :loading="isLoading">登录</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { login } from '@/api/user'

export default {
  name: 'LoginIndex',
  data () {
    return {
      formData: {
        phone: '18201288771',
        password: '111111'
      },
      rules: {
        // 一"套"规则，意为着可能有多条规则
        // "失去焦点"触发下，收集"blur"规则，顺序校验
        phone: [
          {
            required: true,
            message: '手机号是必填项！',
            trigger: 'blur'
          },
          {
            pattern: /^1(3\d|4[5-9]|5[0-35-9]|6[567]|7[0-8]|8\d|9[0-35-9])\d{8}$/,
            message: '手机号不合法',
            trigger: 'blur'
          }
        ],
        password: [
          {
            required: true,
            message: '密码是必填项！',
            trigger: 'blur'
          },
          {
            min: 3,
            max: 6,
            message: '密码的长度应该是3~6位！',
            trigger: 'blur'
          }
        ]
      },
      isLoading: false // 是否正在请求中，避免多次请求
    }
  },
  methods: {
    loginSubmit () {
      this.isLoading = true
      // 再做一次表单验证，成功then , 失败catch
      this.$refs.loginForm
        .validate()
        .then(() => login(this.formData))
        .then(res => {
          // 取得响应信息，查看是否允许登入
          const { data } = res
          if (data.success) {
            this.$message.success('登录成功！')
            // 这个需在路由导航前，因为home在未登录前看不了，因此会再跳到当前Login，重复跳转会报错
            this.$store.commit('saveTokenInfo', data.content)
            // 有参数代表是未登录导致切换过来的，因此跳转目的地应该是原先的地址
            this.$router.replace(this.$route.query.redirect || '/')
          } else {
            this.$message.error('登录失败！')
          }
        })
        .catch(() => {
          this.$message.error('登录异常！')
        })
        .finally(() => {
          // finally回调会在期约"落定"时被调用，无论这个期约是兑现还是被拒绝，你的回调都会被调用。
          // 请求发送遮罩开启，若登录/表单验证失败，遮罩应该关闭，因此会在两个地方加上 isLoading = false;
          // validate或login(),它们都是基于Promise的，我们可以加上finally,不管resolve或reject，finally都会执行
          // 登录这一套流程下来，最终都会关闭遮罩
          this.isLoading = false
        })
    }
  }
}
</script>

<style scoped lang="scss">
.login {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;

  .el-form {
    width: 300px;
    background-color: #fff;
    padding: 30px;
    border-radius: 10px;
    box-shadow: rgba(149, 157, 165, 0.2) 0px 8px 24px;

    .el-button {
      width: 100%;
    }
  }

}

</style>
