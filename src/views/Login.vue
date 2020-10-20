<template>
  <div>
    <hm-header>登录</hm-header>
    <hm-logo></hm-logo>
    <van-field
      label="用户名"
      placeholder="请输入用户名"
      v-model="username"
      @input="checkPhone1"
      @clear="clearPhone1"
      clearable
      :error-message="usernameErrMsg"
    />

    <van-field
      label="密码"
      placeholder="请输入密码"
      v-model="password"
      @input="checkPhone2"
      @clear="clearPhone2"
      clearable
      :error-message="passwordErrMsg"
    />
    <hm-button @click.native="startLogin">登录</hm-button>
    <!-- 去注册的连接 -->
    <div class="go-register">
      没有账号？去<router-link class="link" to="/register">注册</router-link>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      username: '',
      password: '',
      usernameErrMsg: '',
      passwordErrMsg: '',
    }
  },
  created() {
    const { username, password } = this.$route.params
    if (username && password) {
      this.username = username
      this.password = password
    }
  },
  methods: {
    checkPhone1() {
      let reg = /^\d{1,5}$/
      if (reg.test(this.username)) {
        this.usernameErrMsg = ''
      } else {
        this.usernameErrMsg = '用户名格式不正确'
      }
    },
    clearPhone1() {
      this.username = ''
      this.usernameErrMsg = ''
    },
    clearPhone2() {
      this.password = ''
      this.passwordErrMsg = ''
    },
    checkPhone2() {
      let reg = /^\d{1,3}$/
      if (reg.test(this.password.trim())) {
        this.passwordErrMsg = ''
      } else {
        this.passwordErrMsg = '密码格式不正确'
      }
    },
    async startLogin() {
      if (
        this.usernameErrMsg === '' &&
        this.passwordErrMsg === '' &&
        this.username !== '' &&
        this.password !== ''
      ) {
        let res = await this.$axios.post('/login', {
          username: this.username,
          password: this.password,
        })
        const { statusCode, data, message } = res.data
        if (statusCode === 200) {
          localStorage.setItem('token', data.token)
          localStorage.setItem('user_id', data.user.id)
          this.$toast.success(message)
          if (this.$route.params.back) {
            this.$router.back()
          } else {
            this.$router.push('/home')
          }
        } else {
          this.$toast.fail('用户名密码错误')
        }
      }
    },
  },
}
</script>
<style scoped lang="less">
.go-register {
  padding: 0 20px;
  font-size: 18px;
  text-align: right;
  .link {
    color: orange;
  }
}
</style>
