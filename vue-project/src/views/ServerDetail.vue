<template>
    <div>
        <!-- <myHeader></myHeader> -->

        <el-container style="height: 100vh; 
      border: 1px solid #eee; 
      margin: 0;
      border: 0;
      padding: 0;"> <!-- style： 隐藏滚动条  去掉白边-->
            <!-- 侧边栏 -->
            <el-aside style="position: fixed; left: 0; top: 0; height: 100vh; z-index: 2000; width: 600px;">
                <asideNav></asideNav>
            </el-aside>
            <!-- 主页面 -->
            <el-main style="flex: 1; margin-left: 0;">
                <router-view></router-view>
            </el-main>
        </el-container>
    </div>
</template>

<script>
import asideNav from "@/views/asideNav.vue"
export default {
    name: 'MonitorDetail',
    components: { asideNav }  // 注册组件
}

</script>
<style scoped>

</style>
