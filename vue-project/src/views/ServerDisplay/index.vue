<template>
  <div class="server-management">
    <div class="server-left">
      <!-- 顶部导航栏 -->
      <div class="header">
        <div class="header-left">
          <!-- <div class="logo">-->
<!--            <img src="@/assets/display/icons/stLine-server-l.png" width="36" style="vertical-align: middle;" alt=""-->
<!--                 srcset="">-->
<!--            <p class="logo-name">SeverM</p>-->
<!--          </div> -->
          <div class="search-bar">
            <el-input v-model="searchQuery" placeholder="请输入搜索内容" class="s-input" :prefix-icon="Search"/>
            <el-icon
                style="width: 2rem; height: 2rem; margin-left: 0.5rem; background-color: #ffffff; border-radius: 50%;">
              <Search style="font-size: 1.2rem; color: #000000;"/>
            </el-icon>
          </div>
        </div>
        <div class="header-right">
          <!-- <WarningNotification ref="warningNotification" /> -->
        </div>
      </div>

      <!-- 主内容区域 -->
      <div class="main-content">
        <div class="server-list">
          <!-- <div class="server-count">服务器总数 {{ filteredServers?.hosts || 0 }}</div> -->
          <div class="server-count">服务器总数 {{ filteredServers?.hosts?.length || 0 }}</div>
          <div class="server-list-container">
            <div v-if="!searchQuery" class="server-add" style="margin-left: 1rem; margin-right: 0.1rem; margin-top: 1rem;"
                 @click="showAddServerDialog = true">
              <img src="@/assets/display/add_icon.png" alt="" srcset="">
            </div>

            <ServerCard v-for="server in filteredServers?.hosts" :key="server.id" :server="server"
                        @delete="handleDelete(server)" @disable="handleDisable(server)" @delete:success="loadServers" @card-dblclick="handleCardDblClick"/>
          </div>
        </div>
      </div>
    </div>

    <AddServerDialog 
      v-model:visible="showAddServerDialog"
      @success="handleAddServerSuccess"
    />

    <!-- <ServerAddCard v-model:visible="show"
                   @submit="handleSubmit"/> -->

    <!-- Delete confirmation is now handled by ElMessageBox -->
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount, nextTick } from 'vue';
import { useRouter } from 'vue-router';
import { WarningFilled } from '@element-plus/icons-vue';
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
import AddServerDialog from "@/components/dialogs/AddServerDialog.vue";
// Cleaned up unused component imports
import { addServer, getServerInfo, deleteServer } from "@/api/server.js";
import { ElMessage } from 'element-plus';

const servers = ref([]);
const router = useRouter();
const handleCardDblClick = (hostName) => {
  if (hostName) {
    router.push(`/headbar/monitor/${hostName}`);
  }
};
const showAddServerDialog = ref(false);

// 获取服务器列表
const loadServers = async () => {
  try {
    console.log('正在加载服务器列表...');
    const response = await getServerInfo();
    if (response) {
      // 确保正确处理不同响应格式
      let serverData;
      if (response.data) {
        serverData = response.data;
      } else if (Array.isArray(response)) {
        serverData = { hosts: response };
      } else if (response.hosts) {
        serverData = response;
      } else {
        serverData = { hosts: [] };
      }
      
      // 创建一个新对象确保响应式更新
      servers.value = JSON.parse(JSON.stringify(serverData));
      console.log('服务器列表加载成功:', servers.value);
    }
  } catch (error) {
    console.error('获取服务器列表失败:', error);
    ElMessage.error('获取服务器列表失败: ' + (error.message || '未知错误'));
  }
};

// 在组件挂载时加载服务器列表
onMounted(() => {
  loadServers();
});

// 搜索功能
const searchQuery = ref('');

const filteredServers = computed(() => {
  if (!searchQuery.value) {
    return servers.value;
  }
  
  const filtered = [];
  const query = searchQuery.value.toLowerCase();
  
  for (let i = 0; i < servers.value.length; i++) {
    const server = servers.value[i];
    if (server.host_name && server.host_name.toLowerCase().includes(query)) {
      filtered.push(server);
    }
  }
  
  return filtered;
});

const show = ref(false);
// Delete dialog is now handled by ElMessageBox

// 删除服务器
const handleDelete = async (server) => {
  try {
    // 显示确认对话框
    await ElMessageBox.confirm(
      `确定要删除服务器 ${server.host_name || server.ip} 吗？`,
      '警告',
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }
    );
    
    // 显示加载中
    const loading = ElMessage({
      message: '正在删除服务器...',
      type: 'info',
      duration: 0, // 不自动关闭
      showClose: false
    });
    
    try {
      // 调用删除API
      const response = await deleteServer(server);
      console.log('删除服务器响应:', response);
      
      // 关闭加载中
      loading.close();
      
      // 显示成功消息
      ElMessage.success('服务器删除成功');
      
      // 从当前列表中移除已删除的服务器
      if (servers.value?.hosts) {
        servers.value.hosts = servers.value.hosts.filter(s => s.id !== server.id);
      }
      
      // 可选：重新加载服务器列表以确保数据最新
      await loadServers();
    } catch (apiError) {
      loading.close();
      console.error('删除服务器API错误:', apiError);
      
      // 检查是否是密码相关的错误
      if (apiError.response?.data?.includes('password')) {
        ElMessage.error('删除失败：密码错误，请检查服务器密码');
      } else {
        ElMessage.error(`删除服务器失败: ${apiError.message || '未知错误'}`);
      }
      throw apiError; // 重新抛出错误以便外部捕获
    }
  } catch (error) {
    if (error !== 'cancel') {
      console.error('删除服务器失败:', error);
    }
  }
};

const openDialog = () => {
  show.value = true;
};

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

const handleSubmit = (serverData) => {
  console.log("收到表单数据:", serverData);
  addServer(serverData)
};

// 添加服务器成功后的处理
const handleAddServerSuccess = async (responseData) => {
  try {
    showAddServerDialog.value = false;
    console.log('服务器添加成功，响应数据:', responseData);
    
    // 重新加载服务器列表
    await loadServers();
    
    // 确保UI更新
    await nextTick();
    
    ElMessage.success('服务器添加成功，请把浏览器下载的脚本放到被监控服务器上执行，或者查看“帮助”');
  } catch (error) {
    console.error('处理服务器添加成功时出错:', error);
    ElMessage.error('刷新服务器列表失败: ' + (error.message || '未知错误'));
  }
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
  showAddServerDialog.value = true;
}


// 导航到首页（示例：重置视图）
const navigateToHome = () => {
  currentView.value = 'home';
};

// 打开设置弹窗
// const openSettings = () => {

// };

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
    //console.log(r)
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