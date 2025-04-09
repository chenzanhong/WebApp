<template>
    <div>
        <!-- <myHeader></myHeader> -->

        <el-container style="height: 100vh; 
      border: 1px solid #eee; 
      margin: 0;
      border: 0;
      padding: 0;"> <!-- style： 隐藏滚动条  去掉白边-->
            <!-- 侧边栏 -->
            <el-aside style="position: fixed; left: 0; top: 0; height: 100vh; z-index: 2000; width: 300px;">
                <asideNav  @serverListUpdated="updateServerList"></asideNav>
            </el-aside>
            <!-- 主页面 -->
            <el-main style="flex: 1; margin-left: 350px;">
                <DetailPage :serverList="serverList"></DetailPage>
            </el-main>
        </el-container>
    </div>
</template>

<script>
import asideNav from "@/views/asideNav.vue"
import DetailPage from "@/views/DetailPage.vue"

export default {
    name: 'MonitorDetail',
    components: { asideNav, DetailPage },
    data() {
        return {
            serverList: []
        };
    },
    methods: {
        updateServerList(list) {
            this.serverList = list;
        }
    }
};
</script>
<style scoped>

</style>
