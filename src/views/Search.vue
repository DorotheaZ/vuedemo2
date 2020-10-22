<template>
  <div class="search">
    <!-- 头部 -->
    <div class="header">
      <div class="left" @click="back">
        <span class="iconfont iconjiantou2"></span>
      </div>
      <div class="center">
        <input
          @input="recommend_search"
          v-model="keyword"
          @keyup.enter="search"
          type="text"
          placeholder="请输入搜索的内容"
        />
        <span class="iconfont iconsearch"></span>
      </div>
      <div class="right" @click="search">搜索</div>
    </div>
    <!-- 搜索推荐 -->
    <div class="search_recommend" v-if="recommendList.length > 0">
      <div
        v-for="item in recommendList"
        @click="recommendSearch(item.title)"
        :key="item.id"
      >
        {{ item.title }}
      </div>
    </div>
    <!-- 渲染文章列表 -->
    <div v-else-if="postList.length > 0">
      <hm-post v-for="post in postList" :key="post.id" :post="post"></hm-post>
    </div>
    <div v-else class="content">
      <!-- 历史记录 -->
      <h3>历史记录</h3>
      <div class="list">
        <div
          class="item"
          @click="history_search(h)"
          v-for="h in historyList"
          :key="h"
        >
          {{ h }}
        </div>
      </div>

      <!-- 热门搜索 -->
      <h3>热门搜索</h3>
      <div class="list">
        <div
          class="item"
          @click="hot_search(hot)"
          v-for="hot in hotSearchKeyword"
          :key="hot"
        >
          {{ hot }}
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      keyword: '',
      postList: [],
      historyList: [],
      hotSearchKeyword: ['关晓彤', '情火', '肺炎', '1'],
      recommendList: [],
    }
  },
  created() {
    this.recommend_search = this.$_.debounce(this.recommend_search, 500)
    let historyList = JSON.parse(localStorage.getItem('historyList'))
    this.historyList = historyList || []
  },
  watch: {
    keyword(value) {
      if (!value) {
        this.postList = []
        this.recommendList = []
      }
    },
  },
  methods: {
    async search() {
      this.recommendList = []
      this.historyList.unshift(this.keyword)
      this.historyList = [...new Set(this.historyList)]
      localStorage.setItem('historyList', JSON.stringify(this.historyList))
      let res = await this.$axios.get('/post_search', {
        params: {
          keyword: this.keyword,
        },
      })
      const { data, statusCode } = res.data
      if (statusCode === 200) {
        this.postList = data
      }
    },
    history_search(item) {
      this.keyword = item
      this.search()
    },
    hot_search(item) {
      this.keyword = item
      this.search()
    },
    async recommend_search() {
      if (!this.keyword.trim()) return
      let res = await this.$axios.get('/post_search_recommend', {
        params: {
          keyword: this.keyword,
        },
      })
      const { statusCode, data } = res.data
      this.recommendList = data
    },
    recommendSearch(title) {
      this.keyword = title
      this.search()
    },
    back() {
      if (this.keyword) {
        this.keyword = ''
      } else {
        this.$router.back()
      }
    },
  },
}
</script>

<style lang="less" scoped>
.header {
  height: 40px;
  line-height: 40px;
  background: #eee;
  border-bottom: 1px solid #ccc;
  display: flex;
  padding: 0 10px;
  .left,
  .right {
    width: 50px;
  }
  .right {
    text-align: center;
  }
  .center {
    flex: 1;
    // background: red;
    position: relative;
    input {
      height: 30px;
      width: 100%;
      border: none;
      outline: none;
      border: 1px solid #ccc;
      border-radius: 15px;
      text-indent: 30px;
    }
    .iconfont {
      position: absolute;
      left: 10px;
      top: 0px;
    }
  }
}

.content {
  padding: 20px;
  h3 {
    height: 30px;
    line-height: 30px;
  }
  .list {
    display: flex;
    flex-wrap: wrap;
    .item {
      height: 30px;
      // width: 40px;
      padding: 0 10px;
      background: #ddd;
      text-align: center;
      line-height: 30px;
      margin-bottom: 10px;
      margin-right: 10px;
      color: #000;
    }
  }
}
.search_recommend {
  padding: 10px;
  div {
    border-bottom: 1px solid #ccc;
    line-height: 50px;
    height: 50px;
    font-size: 16px;
  }
}
</style>
