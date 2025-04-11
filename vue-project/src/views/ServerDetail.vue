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
            <!-- 右侧系统栏（与主界面统一） -->
      <div class="toolbar">
        <div class="tool-item" :class="{ active: $route.path === '/home' }" @click="navigateTo('/home')">
          <el-icon size="32">
            <HomeFilled />
          </el-icon>
        </div>
        <div class="tool-item" :class="{ active: $route.path === '/settings' }" @click="navigateTo('/settings')">
          <el-icon size="32">
            <Setting />
          </el-icon>
        </div>
        <div class="tool-item" :class="{ active: $route.path === '/info' }" @click="navigateTo('/info')">
          <el-icon size="32">
            <ChatDotRound />
          </el-icon>
        </div>
        <div class="tool-item" @click="navigateTo('/help')">
          <el-icon size="32">
            <QuestionFilled />
          </el-icon>
        </div>
      </div>
        </el-container>

    </div>
</template>

<script>
import asideNav from "@/views/asideNav.vue"
import DetailPage from "@/views/DetailPage.vue"
import { HomeFilled, Setting, ChatDotRound, QuestionFilled } from '@element-plus/icons-vue';


export default {
    name: 'MonitorDetail',
    components: { 
      asideNav,
      DetailPage,
      HomeFilled,
      Setting,
      ChatDotRound,
      QuestionFilled
    },
    data() {
        return {
            serverList: []
        };
    },
    methods: {
        updateServerList(list) {
            this.serverList = list;
        },
        navigateTo(path) {
        this.$router.push(path);
      }
    }
};
</script>
<style scoped>
/* 右侧工具栏（与主界面完全一致） */
.toolbar {
    width: 5rem;
    padding: 1rem 0;
    background-color: #1f2931;
    display: flex;
    flex-direction: column;
    gap: 20px;
    border-left: 1px solid #374151;
  }
  
  .tool-item {
    text-align: center;
    cursor: pointer;
    color: #bbbbbb;
    transition: color 0.2s ease;
  }
  
  .tool-item:hover {
    color: #636161;
  }
  
  .tool-item.active {
    color: #636161 !important;
  }
</style>
