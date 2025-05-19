<template>
  <div class="server-management">
    <div class="server-left">
      <!-- 顶部导航栏 -->
      <div class="header">
<!--        <div class="logo">-->
<!--          <img src="@/assets/display/icons/stLine-server-l.png" width="36" style="vertical-align: middle;" alt=""-->
<!--               srcset="">-->
<!--          <p class="logo-name">SeverM</p>-->
<!--        </div>-->
        <div class="search-bar">
          <el-input v-model="searchQuery" placeholder="请输入搜索内容" class="s-input" :prefix-icon="Search"/>
          <el-icon
              style="width: 2rem; height: 2rem; margin-left: 0.5rem; background-color: #ffffff; border-radius: 50%;">
            <Search style="font-size: 1.2rem; color: #000000;"/>
          </el-icon>
        </div>
      </div>

      <!-- 主内容区域 -->
      <div class="main-content">
        <div class="server-list">
          <div class="server-count">服务器总数 {{ filteredServers.length }}</div>
          <div class="server-list-container">
            <div v-if="!searchQuery" class="server-add" style="margin-left: 1rem; margin-right: 0.1rem; margin-top: 1rem;"
                 @click="showDialog">
              <img src="@/assets/display/add_icon.png" alt="" srcset="">
            </div>
            <ServerCard v-for="server in filteredServers" :key="server.id" :server="server"
                        @delete="openDeleteDialog(server)" @disable="handleDisable(server)"/>
          </div>
        </div>
      </div>
    </div>

    <!-- 右侧工具栏 -->
<!--    <div class="toolbar">-->
<!--      <div class="tool-item" :class="{ active: selectedTool === 'home' }" @click="handleToolClick('home')">-->
<!--        <el-icon size="32">-->
<!--          <HomeFilled/>-->
<!--        </el-icon>-->
<!--      </div>-->
<!--      <div class="tool-item" :class="{ active: selectedTool === 'settings' }"-->
<!--           @click="handleToolClick('settings')">-->
<!--        <el-icon size="32">-->
<!--          <Setting/>-->
<!--        </el-icon>-->
<!--      </div>-->
<!--      <div class="tool-item" :class="{ active: selectedTool === 'messages' }"-->
<!--           @click="handleToolClick('messages')">-->
<!--        <el-icon size="32">-->
<!--          <ChatDotRound/>-->
<!--        </el-icon>-->
<!--      </div>-->
<!--      <div class="tool-item" :class="{ active: selectedTool === 'messages' }"-->
<!--           @click="handleToolClick('messages')">-->
<!--        &lt;!&ndash;        <img src="@/assets/display/icons/store.png" alt="" srcset="">&ndash;&gt;-->
<!--        <IconEcosystem/>-->
<!--      </div>-->
<!--      <div class="tool-item" :class="{ active: selectedTool === 'help' }" @click="handleToolClick('help')">-->
<!--        <el-icon size="32">-->
<!--          <QuestionFilled/>-->
<!--        </el-icon>-->
<!--      </div>-->
<!--    </div>-->


    <ServerAddCard v-model:visible="show"
                   @submit="handleSubmit"/>

    <ConfirmDeleteDialog
        v-model:visible="deleteDialogVisible"
        :serverName="serverToDelete"
        @confirm="openDeleteDialog"
    />
  </div>
</template>

<script setup>
import {ref, computed, onMounted} from 'vue';
import {
  ElInput,
  ElMessageBox,
} from 'element-plus';
import {
  Search,
  Plus,
  HomeFilled,
  Setting,
  ChatDotRound,
  QuestionFilled,
} from '@element-plus/icons-vue';
import ServerCard from "@/components/ServerCard.vue";
import ServerAddCard from "@/components/ServerAddCard.vue";
import ConfirmDeleteDialog from "@/components/ConfirmDeleteDialog.vue";
import IconCommunity from "@/components/icons/IconCommunity.vue";
import IconEcosystem from "@/components/icons/IconEcosystem.vue";
import {addServer, getServerInfo} from "@/api/server.js";

const servers = ref([]);

// 搜索功能
const searchQuery = ref('');
const filteredServers = computed(() => {
  if (!searchQuery.value) {
    return servers.value;
  }
  return servers.value.filter(server =>
      server.host_name.toLowerCase().includes(searchQuery.value.toLowerCase())
  );
});

const show = ref(false);

const deleteDialogVisible = ref(false);
const serverToDelete = ref("");

const openDeleteDialog = (server) => {
  serverToDelete.value = server.name;
  deleteDialogVisible.value = true;
};

const handleDelete = () => {
  console.log("删除服务器:", serverToDelete.value);
  alert(`已删除服务器: ${serverToDelete.value}`);
};

const openDialog = () => {
  show.value = true;
};

const handleSubmit = (serverData) => {
  console.log("收到表单数据:", serverData);
  addServer(serverData)
};

// 添加服务器
const handleAddServer = () => {
  // 弹出添加表单
};

// 停用服务器
const handleDisable = (server) => {
  // 更新服务器状态
};

const showDialog = () => {
  show.value = true;
}


const selectedTool = ref('home'); // 记录当前选中的工具
const currentView = ref('home'); // 当前显示的视图

// 处理工具栏点击
const handleToolClick = (tool) => {
  selectedTool.value = tool;
  switch (tool) {
    case 'home':
      navigateToHome();
      break;
    case 'settings':
      openSettings();
      break;
    case 'messages':
      showMessages();
      break;
    case 'help':
      showHelp();
      break;
  }
};

// 导航到首页（示例：重置视图）
const navigateToHome = () => {
  currentView.value = 'home';
};

// 打开设置弹窗
const openSettings = () => {

};

// 显示消息
const showMessages = () => {
  // ElMessageBox.alert('消息中心暂未实现', '提示');
};

// 显示帮助
const showHelp = () => {
  // ElMessageBox.alert('帮助文档暂未实现', '帮助');
};

onMounted(() => {
  getServerInfo().then(r => {
    console.log(r)
    servers.value = r;
  })
})
</script>

<style scoped>
/* 样式部分 */
.server-management {
  width: 100%;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  height: 100vh;
  background-color: #000000;
}

.server-left {
  width: calc(100%);
  display: flex;
  flex-direction: column;
  padding: 0;
  background-color: #000000;
}

.server-list-container {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: start;
  margin: 0 auto;
}

.server-add {
  width: 11.7rem;
  height: 11.7rem;
  background: url("@/assets/display/add.png");
}

.header {
  width: 100%;
  padding: 20px;
  background-color: #000000;
}

.logo {
  width: 100%;
  font-size: 1.2rem;
  color: white;
  text-align: start;
  font-family: "Poppins", serif;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: start;
}

.logo p {
  margin-left: 10px;
  margin-top: 0.2rem;
  font-weight: bold;
}

.search-bar {
  width: 50%;
  background-color: #1f2931;
  padding: 1rem 5rem;
  border-radius: 1rem;
  margin: 0 auto;
  display: flex;
  flex-direction: row;
  align-items: center;
}

.main-content {
  width: 100%;
  height: 100%;
  padding: 20px;
  background-color: #000000;
}

.server-count {
  font-size: 20px;
  color: white;
  text-align: start;
  margin-left: 1.7rem;
}

.server-list {
  width: 100%;
  height: 100%;
  background-color: rgb(31, 41, 49, 0.7);
  margin: 0 auto;
  border-radius: 1rem;
  display: flex;
  flex-wrap: wrap;
  flex-direction: column;
  justify-content: start;
  align-items: start;
  padding: 1rem;
}

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

.active {
  color: #636161 !important;
  /* Element Plus 主色 */
}

.logo-name{
  font-family: 'PangMenZhengDao', sans-serif;
}
</style>