<template>
  <div class="home">
    <!-- 头部 -->
    <div class="header">
      <div class="left">
        <i class="iconfont iconnew"></i>
      </div>
      <div class="center">
        <span class="iconfont iconsearch"></span>
        <span class="text">搜索新闻</span>
      </div>
      <div class="right">
        <i class="iconfont iconwode" @click="$router.push('/user')"></i>
      </div>
    </div>
    <!-- 列表 -->
    <van-sticky z-index="999">
      <div class="container" @click="$router.push('/tabsEdit')">
        <i class="iconfont iconjiantou1"> </i>
      </div>
    </van-sticky>
    <van-tabs v-model="active" sticky>
      <van-tab :title="tab.name" v-for="tab in tabsList" :key="tab.id">
        <van-pull-refresh v-model="isRefreshing" @refresh="onRefresh">
          <van-list
            v-model="loading"
            :finished="finished"
            :immediate-check="false"
            @load="onLoad"
            finished-text="我也是有底线的 !"
          >
            <hm-post
              @click.native="$router.push(`/detail/${post.id}`)"
              v-for="(post, index) in postList"
              :key="index.id"
              :post="post"
            />
          </van-list>
        </van-pull-refresh>
      </van-tab>
    </van-tabs>
  </div>
</template>

<script>
export default {
  name: 'home',
  data() {
    return {
      active: 1,
      tabsList: [],
      postList: [],
      pageIndex: 1,
      pageSize: 5,
      loading: false,
      finished: false,
      isRefreshing: false,
    }
  },
  created() {
    this.getTabsList()
  },
  watch: {
    active(newActive) {
      this.postList = []
      this.pageIndex = 1
      this.finished = false
      this.loading = true
      this.getPostList(this.tabsList[newActive].id)
    },
  },
  methods: {
    async getTabsList() {
      let res = await this.$axios.get('/category')
      this.tabsList = res.data.data
      // 请求完tabsList 才有 postList
      this.getPostList(this.tabsList[this.active].id)
    },
    async getPostList(id) {
      let res = await this.$axios.get('/post', {
        params: {
          category: id,
          pageIndex: this.pageIndex,
          pageSize: this.pageSize,
        },
      })
      this.postList = [...this.postList, ...res.data.data]
      this.loading = false
      this.isRefreshing = false

      if (res.data.data.length < this.pageSize) {
        this.finished = true
      }
    },
    onLoad() {
      setTimeout(() => {
        this.pageIndex++
        this.getPostList(this.tabsList[this.active].id)
      }, 200)
    },
    onRefresh() {
      this.postList = []
      this.pageIndex = 1
      this.finished = false
      this.loading = true
      this.getPostList(this.tabsList[this.active].id)
    },
    fn() {},
  },
}
</script>

<style lang="less" scoped>
/deep/ .van-tabs__nav {
  background: skyblue;
}
.header {
  height: 50px;
  background: #f00;
  color: #fff;
  display: flex;
  align-items: center;
  .left,
  .right {
    width: 60px;
    height: 50px;
    line-height: 50px;
    text-align: center;
    // background: pink;
  }
  .iconnew {
    font-size: 50px;
  }
  .iconwode {
    font-size: 24px;
  }
  .center {
    flex: 1;
    height: 34px;
    line-height: 34px;
    background: rgba(255, 255, 255, 0.5);
    text-align: center;
    border-radius: 17px;
    .text {
      margin-left: 5px;
    }
  }
}

/deep/ .van-tabs__nav {
  background: #ddd;
  margin-right: 40px;
}

// 小三角
.container {
  width: 40px;
  height: 45px;
  background: #ddd;
  line-height: 44px;
  text-align: center;
  color: #000;
  position: absolute;
  right: 0;
  z-index: 999;
}
</style>
