<template>
  <div>
      <!-- <myHeader></myHeader> -->

      <el-container style="height: 100vh; 
    border: 1px solid #eee; 
    margin: 0;
    border: 0;
    padding: 0;"> <!-- style： 隐藏滚动条  去掉白边-->
          <!-- 侧边栏 -->
          <el-aside style="position: fixed; left:0; top: 80px; height: 100vh; z-index: 2000; width: 300px;">
              <asideNav  @serverListUpdated="updateServerList"></asideNav>
          </el-aside>
          <!-- 主页面 -->
          <el-main style="flex: 1; margin-left: 0px;">
              <DetailPage :serverList="serverList"></DetailPage>
          </el-main>
          
      </el-container>

  </div>
</template>

<script>
import router from "@/router";
import asideNav from "@/views/asideNav.vue"
import DetailPage from "@/views/DetailPage.vue"
import { Search, Plus, HomeFilled, Setting, ChatDotRound, QuestionFilled, Briefcase } from '@element-plus/icons-vue';

export default {
  name: 'MonitorDetail',
  components: { 
    asideNav,
    DetailPage,
    HomeFilled,
    Setting,
    ChatDotRound,
    QuestionFilled,
    Briefcase
  },
  data() {
      return {
          serverList: [],
          selectedTool: null
      };
  },
  methods: {
      updateServerList(list) {
          this.serverList = list;
      },
      handleToolClick(tool, companyName) {
          this.selectedTool = tool;
          switch (tool) {
              case 'home':
                  router.push('/home');
                  break;
              case 'notice':
                  router.push('/info');
                  break;
              case 'setting':
                  router.push('/setting');
                  break;
              case 'teambusiness':
                  router.push('/display/teambusiness');
                  break;
              case 'help':
                  router.push('/help');
                  break;
              case 'companyadmin':
                  router.push({ name: 'companyadmin', params: { companyName: companyName } });// 将公司名传到companyadmin页面
                  break;
          }
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