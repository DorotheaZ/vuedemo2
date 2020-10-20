<template>
  <div class="my-comments">
    <hm-header>我的跟帖</hm-header>
    <!-- 列表 -->
    <van-list
      :immediate-check="false"
      v-model="loading"
      :finished="finished"
      offset="50"
      @load="onLoad"
      finished-text="我也是有底线的!"
    >
      <div class="list">
        <div class="item" v-for="item in list" :key="item.id">
          <!-- 1. 时间 -->
          <div class="time">
            {{ item.create_date | date }}
          </div>

          <!-- 2 我的内容 -->
          <div class="parent-comment" v-if="item.parent">
            <div class="parent-name">
              回复 : {{ item.parent.user.nickname }}
            </div>
            <div class="parent-content">
              {{ item.parent.content }}
            </div>
          </div>
          <div class="content line1">{{ item.content }}</div>

          <!-- 3. 原文 -->
          <div class="link">
            <div class="title">{{ item.post.title }}</div>
            <i class="iconfont iconjiantou1"></i>
          </div>
        </div>
      </div>
    </van-list>
  </div>
</template>

<script>
export default {
  data() {
    return {
      list: [],
      pageIndex: 1,
      loading: false,
      finished: false,
    }
  },
  created() {
    this.getCommentsList()
  },
  methods: {
    async getCommentsList() {
      let res = await this.$axios.get('/user_comments', {
        params: {
          pageIndex: this.pageIndex,
          pageSize: 4,
        },
      })
      const { statusCode, data } = res.data
      if (statusCode === 200) {
        this.list = [...this.list, ...data]
        this.loading = false
        if (data.length < 4) {
          this.finished = true
        }
      }
    },
    onLoad() {
      setTimeout(() => {
        this.pageIndex++
        this.getCommentsList()
      }, 600)
    },
  },
}
</script>
<style lang="less" scoped>
.line1 {
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
}

/*多行溢出*/
.line2 {
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}
.item {
  border-bottom: 1px solid #ccc;
  padding: 10px;
  .time {
    color: #999;
    height: 30px;
    line-height: 30px;
  }
  .parent-comment {
    padding: 10px;
    background: #eee;
    color: #666;
    line-height: 20px;

    .parent-name {
      height: 25px;
      line-height: 25px;
    }
  }
  .content {
    font-size: 14px;
    padding: 10px 0;
  }
  .link {
    color: #999;
    display: flex;
    margin-top: 10px;
    // justify-content: space-between;
    .title {
      flex: 1;
    }
    i {
      width: 50px;
      text-align: right;
    }
  }
}
</style>
