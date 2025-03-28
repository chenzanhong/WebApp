<template>
  <!-- 全屏容器 -->
  <div id="app">

    <!-- 路由内容会在此处渲染 -->
    <router-view>
    </router-view>
  </div>
</template>
<script>
export default {
  name: 'App',
  methods: {
    isActive(path) {
      return this.$route.path === path;
    }
  }
};
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #000000;
  width: 100%;
  height: 100%;
}
.el-dialog{
  background-color: #2c3e50 !important;
  width: 45rem !important;
  height: 42rem !important;
}

</style>