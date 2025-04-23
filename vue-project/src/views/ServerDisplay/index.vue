<template>
  <div class="server-management">
    <div class="server-left">
      <!-- 顶部导航栏 -->
      <div class="header">
        <
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
          <div class="server-count">服务器总数 {{ servers.length }}</div>
          <div class="server-list-container">
            <div class="server-add" style="margin-left: 1rem; margin-right: 1rem; margin-top: 1rem;"
                 @click="showDialog" >
              <img src="@/assets/display/add_icon.png" alt="" srcset="">
            </div>
            <ServerCard v-for="server in servers" :key="server.id" :server="server"
                        @delete="openDeleteDialog(server)" @disable="handleDisable(server)"
                        @click="handleServerClick(server)"/>
          </div>
        </div>
      </div>
    </div>

   
    


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
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router'; // 引入 useRouter 函数

import {
  ElInput,
  ElMessageBox
} from 'element-plus';
import {
  Search,
  Plus,
  HomeFilled,
  Setting,
  ChatDotRound,
  QuestionFilled,
  Briefcase
} from '@element-plus/icons-vue';
import ServerCard from "@/components/ServerCard.vue";
import ServerAddCard from "@/components/ServerAddCard.vue";
import ConfirmDeleteDialog from "@/components/ConfirmDeleteDialog.vue";
import IconCommunity from "@/components/icons/IconCommunity.vue";
import IconEcosystem from "@/components/icons/IconEcosystem.vue";



const servers = ref([
  { id: 1, name: '服务器1', os: 'Linux', ip: '134.36.3.6', runtime: '34:36:03', status: 'online' },
  { id: 2, name: '服务器2', os: 'Linux', ip: '134.36.3.7', runtime: '34:36:03', status: 'offline' },
  { id: 3, name: '服务器3', os: 'Windows', ip: '134.36.3.8', runtime: '12:45:12', status: 'online' }
]);

// 搜索功能
const searchQuery = ref('');
const filteredServers = computed(() => {
  return servers.value.filter(server =>
    server.name.includes(searchQuery.value)
  );
});

const show = ref(false);
const deleteDialogVisible = ref(false);
const serverToDelete = ref("");

const handleServerClick = (server) => {
      // 这里使用 router.push 方法进行路由跳转
      router.push('/monitor/machine');
    };

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
  alert("服务器信息提交成功！");
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
};

const selectedTool = ref('home'); // 记录当前选中的工具
const currentView = ref('home'); // 当前显示的视图

const router = useRouter(); // 获取路由实例



// 导航到首页（示例：重置视图）
const navigateToHome = () => {
  currentView.value = 'home';
};

// 打开设置弹窗
const openSettings = () => {

};

// 显示消息
const showMessages = () => {
  router.push({ name: 'InfoNotification' }); // 跳转到信息通知界面
};

// 显示帮助
const showHelp = () => {
  // ElMessageBox.alert('帮助文档暂未实现', '帮助');
};
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
  width: calc(100% - 6rem);
  display: flex;
  flex-direction: column;
  padding: 0;
  background-color: #000000;
}

.server-list-container {
  display: flex;
  flex-direction: row;
  justify-content: space-evenly;
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
  font-family: "Poppins",serif;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: start;
}

.logo p{
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
  flex: 1;
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
</style>