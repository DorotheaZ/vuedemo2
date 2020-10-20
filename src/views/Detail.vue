<template>
  <div>
    <div class="header">
      <div class="left" @click="$router.back()">
        <i class="iconfont iconjiantou2"></i>
      </div>
      <div class="center">
        <i class="iconfont iconnew"></i>
      </div>
      <div class="right">
        <div v-if="detail.has_follow" class="follow" @click="unfollow">
          已关注
        </div>
        <div v-else class="follow" @click="follow">关注</div>
      </div>
      <van-dialog></van-dialog>
    </div>
    <!-- 内容 -->
    <div class="container">
      <div class="title line2">
        {{ detail.title }}
      </div>
      <div class="name">
        <span>{{ detail.user.nickname }}</span>
        <span>{{ detail.create_date | date('YYYY-MM-DD HH:mm') }}</span>
      </div>
      <!-- 内容部分 -->
      <!-- 1. 文本内容 (图片 + 文字) -->
      <div
        v-if="detail.type == 1"
        class="content"
        v-html="detail.content"
      ></div>
      <!-- 2. 视频 -->
      <video v-else :src="detail.content" controls></video>
    </div>
    <div class="bottom">
      <div
        class="like"
        @click="like(detail.id)"
        :class="{ active: detail.has_like }"
      >
        <i class="iconfont icondianzan"></i>
        <i>{{ detail.like_length }}</i>
      </div>
    </div>
    <div ref="box"></div>
    <!-- 评论 -->
    <div class="comments">
      <hm-comment
        v-for="comment in commentList"
        :key="comment.id"
        :comment="comment"
      ></hm-comment>
    </div>
    <!-- 底部 -->
    <!-- 底部 -->
    <div class="footer">
      <!-- input -->
      <div class="input" v-if="!isShow">
        <div class="left">
          <input
            ref="input"
            @focus="handleFocus"
            type="text"
            placeholder="写跟帖"
          />
        </div>
        <div class="center">
          <van-icon name="chat-o" :badge="detail.comment_length" />
        </div>
        <div class="right">
          <van-icon
            name="star-o"
            :class="{ active: detail.has_star }"
            @click="star"
          />
        </div>
      </div>
      <!-- textarea -->
      <div class="textarea" v-else>
        <div class="left">
          <textarea
            ref="textarea"
            @blur="handleBlur"
            :placeholder="replyName ? '回复:' + replyName : '请输入内容'"
            v-model="content"
          ></textarea>
        </div>
        <div class="right">
          <div class="send" @mousedown="send">发送</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      detail: {
        user: '',
      },
      commentList: [],
      isShow: false,
      replyId: '',
      replyName: '',
      content: '',
    }
  },
  created() {
    this.getDetail()
    this.getComments()
    this.$bus.$on('reply', async (replyId, replyName) => {
      this.replyId = replyId
      this.replyName = replyName
      this.isShow = true
      await this.$nextTick()
      this.$refs.textarea.focus()
    })
  },
  methods: {
    async getDetail() {
      let res = await this.$axios.get(`/post/${this.$route.params.id}`)
      console.log(res)
      this.detail = res.data.data
    },
    async unfollow() {
      let res = await this.$axios.get(`/user_unfollow/${this.detail.user.id}`)
      this.$toast.success(res.data.message)
      this.getDetail()
    },
    async follow() {
      let token = localStorage.getItem('token')
      if (!token) {
        try {
          await this.$dialog.confirm({
            title: '温馨提示',
            message: '该操作需要登录喔亲~',
          })
          this.$router.push({
            name: 'login',
            params: {
              back: 1,
            },
          })
        } catch (error) {}

        return
      }
      let res = await this.$axios.get(`/user_follows/${this.detail.user.id}`)
      this.$toast.success(res.data.message)
      this.getDetail()
    },
    async like(id) {
      let res = await this.$axios.get(`/post_like/${id}`)
      const { statusCode, message } = res.data
      if (statusCode === 200) {
        this.$toast.success(message)
        this.getDetail()
      }
    },
    async getComments() {
      let res = await this.$axios.get(`/post_comment/${this.$route.params.id}`)
      console.log(res)
      this.commentList = res.data.data
    },
    async handleFocus() {
      this.isShow = true
      await this.$nextTick()
      this.$refs.textarea.focus()
    },
    handleBlur() {
      this.isShow = false
      if (!this.content) {
        this.replyId = ''
        this.replyName = ''
      }
    },
    async send() {
      let res = await this.$axios.post(
        `/post_comment/${this.$route.params.id}`,
        {
          content: this.content,
          parent_id: this.replyId,
        }
      )
      const { statusCode, message } = res.data
      if (statusCode === 200) {
        this.$toast.success(message)
        this.getComments()
        this.content = ''
        this.replyId = ''
        this.replyName = ''
        this.isShow = false
        this.$refs.box.scrollIntoView()
      }
    },
    async star() {
      let res = await this.$axios.get(`/post_star/${this.$route.params.id}`)
      const { statusCode, message } = res.data
      if (statusCode === 200) {
        this.$toast.success(message)
        this.getDetail()
      }
    },
  },
}
</script>

<style lang="less" scoped>
.active {
  color: #f00;
}
.header {
  position: fixed;
  width: 100%;
  z-index: 999;
  display: flex;
  height: 50px;
  border-bottom: 1px solid #ccc;
  align-items: center;
  background-color: #fff;
  .left {
    width: 40px;
    text-align: center;
    i {
      font-size: 20px;
    }
  }
  .center {
    flex: 1;
    padding-left: 10px;
    i {
      font-size: 50px;
    }
  }
  .right {
    width: 80px;
    // background: pink;
    .follow {
      border: 1px solid #666;
      width: 60px;
      height: 24px;
      text-align: center;
      line-height: 26px;
      border-radius: 12px;
    }
  }
}

.container {
  padding: 10px;
  padding-top: 50px;
  .title {
    font-size: 20px;
    font-weight: 700;
    margin: 10px 0;
  }
  .name {
    color: #999;
    span {
      margin-right: 20px;
    }
  }
  .content {
    margin-top: 20px;
  }
}

/deep/ img {
  width: 100%;
}

video {
  width: 100%;
  margin-top: 10px;
}

// 点赞
.bottom {
  display: flex;
  justify-content: flex-end;
  margin: 10px 0;
  margin-right: 10px;
  .like {
    height: 30px;
    width: 80px;
    border: 1px solid #000;
    line-height: 30px;
    text-align: center;
    border-radius: 15px;
    i {
      margin: 0 5px;
    }
  }
  .like.active {
    border: 1px solid #f00;
    i {
      color: red;
    }
  }
}

.like.active {
  border: 1px solid #f00;
  i {
    color: red;
  }
}

// 评论部分
.comments {
  border-top: 3px solid #ccc;
  padding-bottom: 40px;
}
// 底部
.footer {
  background: #fff;
  border-top: 1px solid #ccc;
  position: fixed;
  bottom: 0;
  width: 100%;
  .input {
    height: 40px;
    display: flex;
    .left {
      flex: 1;
      // background: red;
      display: flex;
      justify-content: center;
      align-items: center;
      input {
        height: 30px;
        width: 80%;
        border: none;
        border-radius: 15px;
        background: #ddd;
        text-indent: 1em;
      }
    }
    .center,
    .right {
      width: 60px;
      font-size: 24px;
      display: flex;
      justify-content: center;
      align-items: center;
    }
  }
  .textarea {
    height: 70px;
    display: flex;
    .left {
      flex: 1;
      // background: pink;
      display: flex;
      justify-content: center;
      align-items: center;
      textarea {
        border: none;
        width: 90%;
        height: 75%;
        border-radius: 8px;
        resize: none;
        background: #ddd;
        text-indent: 1em;
        padding-top: 5px;
      }
    }
    .right {
      width: 80px;
      display: flex;
      justify-content: center;
      align-items: center;
      .send {
        background: #f00;
        color: #fff;
        width: 40px;
        height: 30px;
        border-radius: 5px;
        line-height: 30px;
        text-align: center;
      }
    }
  }
}
</style>
