<template>
  <div>
    <!-- 头部 -->
    <hm-header>编辑资料</hm-header>
    <!-- 头部 -->
    <div class="avatar">
      <img :src="$axios.defaults.baseURL + info.head_img" alt />
      <van-uploader class="uploader" :after-read="afterRed" />
    </div>
    <van-cell-group>
      <van-cell
        title="昵称"
        :value="info.nickname"
        is-link
        @click="showNickname"
      />
      <van-cell title="密码" :value="info.password" is-link />
      <van-cell
        title="性别"
        :value="info.gender === 1 ? '男' : '女'"
        is-link
        @click="showGender"
      />
    </van-cell-group>
    <!-- 修改昵称 -->
    <van-dialog
      @confirm="confirmNickname"
      v-model="show"
      title="标题"
      show-cancel-button
    >
      <van-field v-model="nickname" placeholder="请输入用户昵称" />
    </van-dialog>
    <!-- 修改性别 -->
    <van-dialog
      v-model="show_gender"
      @confirm="confirmGender"
      title="修改性别"
      show-cancel-button
    >
      <van-radio-group v-model="gender">
        <van-cell-group>
          <van-cell title="男" clickable @click="gender = 1">
            <van-radio slot="right-icon" :name="1" />
          </van-cell>
          <van-cell title="女" clickable @click="gender = 0">
            <van-radio slot="right-icon" :name="0" />
          </van-cell>
        </van-cell-group>
      </van-radio-group>
    </van-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      info: '',
      show: false,
      nickname: '',
      show_gender: false,
      gender: 0,
    }
  },
  created() {
    this.getInfo()
  },
  methods: {
    async getInfo() {
      const user_id = localStorage.getItem('user_id')
      const token = localStorage.getItem('token')
      let res = await this.$axios.get(`/user/${user_id}`)
      this.info = res.data.data
    },
    showNickname() {
      this.show = true
      this.nickname = this.info.nickname
    },
    confirmNickname() {
      this.editUser({
        nickname: this.nickname,
      })
    },
    showGender() {
      this.show_gender = true
      this.gender = this.info.gender
    },
    confirmGender() {
      if (this.gender == this.info.gender) {
        this.$toast.fail('未做修改不能保存')
      } else {
        this.editUser({
          gender: this.gender,
        })
      }
    },

    async editUser(data) {
      const user_id = localStorage.getItem('user_id')
      const token = localStorage.getItem('token')

      await this.$axios.post(`/user_update/${user_id}`, data)
      // 1. 重新渲染
      this.getInfo()
      // 2. 给一个成功的提示
      this.$toast.success('修改成功')
    },
    afterRed(file) {
      let token = localStorage.getItem('token')

      // 拼接 FormData
      let formData = new FormData()
      formData.append('file', file.file)

      this.$axios.post('/upload', formData).then(res => {
        console.log('结果', res)
        this.editUser({
          head_img: res.data.data.url,
        })
      })
    },
  },
}
</script>

<style lang="less" scoped>
.avatar {
  text-align: center;
  margin: 20px 0;
  img {
    width: 70px;
    height: 70px;
    border-radius: 50%;
  }
  // 上传图片
  .uploader {
    position: absolute;
    left: 50%;
    transform: translateX(-50%);
    opacity: 0;
  }
}
</style>
