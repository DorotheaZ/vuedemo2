<template>
  <div>
    <hm-header>注册</hm-header>
    <hm-logo></hm-logo>
    <!-- 用户名 -->
    <van-field
      v-model="username"
      required
      label="用户名"
      placeholder="请输入用户名"
      :error-message="usernameErrMsg"
      @input="checkUsername"
      @clear="clear1"
      clearable
    />
    <!-- 昵称 -->
    <van-field
      v-model="nickname"
      required
      label="昵称"
      placeholder="请输入昵称"
      :error-message="nicknameErrMsg"
      @input="checkNickname"
      @clear="clear2"
      clearable
    />
    <!-- 密码 -->
    <van-field
      v-model="password"
      required
      label="密码"
      placeholder="请输入密码"
      :error-message="passwordErrMsg"
      @input="checkPassword"
      @clear="clear3"
      clearable
    />
    <hm-button @click.native="startRegister">注册</hm-button>
  </div>
</template>

<script>
// 正则
const REG_USERNAME = /^1\d{3,5}$/
const REG_NICKNAME = /^[\u4e00-\u9fa5]{3,7}$/
const REG_PASSWORD = /^\d{3,12}$/
export default {
  data() {
    return {
      username: '',
      nickname: '',
      password: '',
      usernameErrMsg: '',
      nicknameErrMsg: '',
      passwordErrMsg: '',
    }
  },
  methods: {
    clear1() {
      ;(this.username = ''), (this.usernameErrMsg = '')
    },
    clear2() {
      ;(this.nickname = ''), (this.nicknameErrMsg = '')
    },
    clear3() {
      ;(this.password = ''), (this.passwordErrMsg = '')
    },
    checkUsername() {
      if (REG_USERNAME.test(this.username)) {
        this.usernameErrMsg = ''
      } else {
        this.usernameErrMsg = '用户名格式不正确'
      }
    },
    checkNickname() {
      if (REG_NICKNAME.test(this.nickname)) {
        this.nicknameErrMsg = ''
      } else {
        this.nicknameErrMsg = '昵称格式不正确'
      }
    },
    checkPassword() {
      if (REG_PASSWORD.test(this.password)) {
        this.passwordErrMsg = ''
      } else {
        this.passwordErrMsg = '密码格式不正确'
      }
    },
    async startRegister() {
      if (
        this.username !== '' &&
        this.nickname !== '' &&
        this.password !== '' &&
        this.usernameErrMsg === '' &&
        this.nicknameErrMsg === '' &&
        this.passwordErrMsg === ''
      ) {
        let res = await this.$axios.post('/register', {
          username: this.username,
          nickname: this.nickname,
          password: this.password,
        })
        const { statusCode, message } = res.data
        if (statusCode === 200) {
          this.$toast.success(message)
          this.$router.push({
            name: 'login',
            params: {
              username: this.username,
              password: this.password,
            },
          })
        } else {
          this.$toast.fail(message)
        }
      }
    },
  },
}
</script>

<style></style>
