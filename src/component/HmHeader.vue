<template>
  <div class="hm-header">
    <div class="z">
      <div class="left" @click="$router.back()">
        <i class="iconfont iconjiantou2"></i>
      </div>
      <div class="center">
        <slot></slot>
      </div>
      <div class="right"></div>
    </div>
  </div>
</template>

<script>
export default {}
</script>

<style lang="less">
.hm-header {
  height: 40px;
  .z {
    position: fixed;
    width: 100%;
    height: 40px;
    z-index: 999;
    border-bottom: 1px solid #ccc;
    background: #f4f4f4;

    display: flex;
    text-align: center;
    align-items: center;

    .left,
    .right {
      width: 30px;
    }

    .center {
      flex: 1;
      font-size: 18px;
      font-weight: 700;
    }
  }
}
</style>
