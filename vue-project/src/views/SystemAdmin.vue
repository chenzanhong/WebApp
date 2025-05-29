<template>
  <div class="systemadmin">
    <!-- 左侧管理 -->
    <div class="left">
      <div class="header">
        <div class="logo">
          <img src="@/assets/display/icons/stLine-server-l.png" width="36">
          <p>SeverM</p>
        </div>
      </div>

      <div class="main-content">
        <div class="top">
          <el-button 
            type="danger" 
            class="custom-button"
            @click="toggleAllDisable"
          >
            {{ isAllDisabled ? '全部启用' : '全部停用' }}
          </el-button>
          <div class="search-group">
            <el-input v-model="searchQuery" placeholder="请输入搜索内容" class="s-input" :prefix-icon="Search" style="width:400px;height: 35px;"/>
            <el-icon
              style="width: 2rem; height: 2rem; margin-left: 0.5rem; background-color: #ffffff; border-radius: 50%;">
              <Search style="font-size: 1.2rem; color: #000000;" />
            </el-icon>
          </div>
        </div>

        <div class="company-list" style="height: calc(100vh - 225px); overflow-y: auto;">
          <div 
            class="company-bar" 
            v-for="(company, index) in companies" 
            :key="index"
            :class="{ 'disabled-state': company.isDisabled }"
          >
            <div class="company-info">
              <div class="company-name">{{ company.name }}</div>
              <div class="detail-boxes">
                <div class="info-item">
                  <span class="info-label">机构管理员</span>
                  <span class="info-value"  style="width:100px;">{{ company.manager }}</span>
                </div>
                <div class="info-item">
                  <span class="info-label">管理员邮箱</span>
                  <span class="info-value" style="width:250px;">{{ company.email }}</span>
                </div>
                <div class="info-item">
                  <span class="info-label">人员总数</span>
                  <span class="info-value" style="width:100px;">{{ company.staffCount }}</span>
                </div>
                <div class="info-item">
                  <span class="info-label">服务器总数</span>
                  <span class="info-value" style="width:100px;">{{ company.serverCount }}</span>
                </div>
              </div>
            </div>
            <div class="button-group">
              <el-button 
                :type="company.isDisabled ? 'success' : 'danger'"
                :class="company.isDisabled ? 'custom-button1-enabled' : 'custom-button1'"
                @click="toggleDisable(company)"
              >
                {{ company.isDisabled ? '启动' : '停用' }}
              </el-button>
              <el-button 
                type="info" 
                class="custom-button2"
                :disabled="company.isDisabled"
                @click="handleToolClick('companyadmin', company.name)"
              >
                管理
              </el-button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 右侧工具栏 -->
    <div class="toolbar">
      <div class="tool-item" :class="{ active: selectedTool === 'home' }" @click="handleToolClick('home')">
        <el-icon size="32">
          <HomeFilled />
        </el-icon>
      </div>
      <div class="tool-item" :class="{ active: selectedTool === 'notice' }" @click="handleToolClick('notice')">
        <el-icon size="32">
          <ChatDotRound />
        </el-icon>
      </div>
      <div class="tool-item" :class="{ active: selectedTool ==='setting' }" @click="handleToolClick('setting')">
        <el-icon size="32">
          <Setting />
        </el-icon>
      </div>
      <div class="tool-item" :class="{ active: selectedTool === 'teambusiness' }" @click="handleToolClick('teambusiness')">
        <el-icon size="32">
          <Briefcase />
        </el-icon>
      </div>
      <div class="tool-item" :class="{ active: selectedTool === 'help' }" @click="handleToolClick('help')">
        <el-icon size="32">
          <QuestionFilled />
        </el-icon>
      </div>
    </div>

    <ServerAddCard v-model:visible="show" @submit="handleSubmit" />
    <ConfirmDeleteDialog v-model:visible="deleteDialogVisible" :serverName="serverToDelete" @confirm="openDeleteDialog" />
  </div>
</template>

<style scoped>
@font-face {
  font-family: 'PangMenZhengDao';
  src: url('@/assets/PangMenZhengDaoBiaoTiTiMianFeiBan-2.ttf');
  font-weight: normal;
  font-style: normal;
}

@font-face {
  font-family: 'Ubuntu';
  src: url('@/assets/._Ubuntu-M.ttf');
  font-weight: normal;
  font-style: normal;
}

.systemadmin {
  width: 100%;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  height: 100vh;
  background-color: #000000;
}

.left {
  width: calc(100% - 6rem);
  display: flex;
  flex-direction: column;
  padding: 0;
  background-color: #000000;
}

.header {
  width: 100%;
  padding-top: 12px;
  padding-left: 20px;
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
  font-size: 28px;
  justify-content: start;
  font-family: 'PangMenZhengDao', sans-serif;
}

.logo p {
  margin-left: 10px;
  margin-top: 0.2rem;
  font-weight: bold;
}

.main-content {
  flex: 1;
  background-color: rgb(94, 118, 144, 0.34);
  border-radius: 1rem;
  padding: 25px;
  margin: 13px 15px 28px 30px;
  border: 1px solid #374151;
}

.top {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.search-group {
  display: flex;
  align-items: center;
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
}

.company-list {
  width: 100%;
  height: 100%;
  margin-top: 12px;
  overflow-y: auto;
}

/* 隐藏滚动条 */
.company-list::-webkit-scrollbar {
  display: none;
}

.company-list {
  scrollbar-width: none; /* Firefox 隐藏滚动条 */
}

.company-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px;
  background-color: rgb(123, 136, 150, 0.38);
  margin: 5px 0;
  border-radius: 5px;
  transition: all 0.3s ease;
}

.company-bar.disabled-state {
  background-color: rgb(79, 87, 96, 0.38);
}

.company-info {
  display: flex;
  flex-direction: column;
  gap: 5px;
  align-items: flex-start;
}

.company-name {
  color: white;
  font-size: 20px;
  font-weight: bold;
  transition: color 0.3s ease;
}

.company-bar.disabled-state .company-name {
  color: #636161;
}

.detail-boxes {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  gap: 10px;
}

.info-item {
  display: flex;
  align-items: center;
}

.info-label {
  font-weight: bold;
  font-size: 15px;
  color: white;
  margin-right: 5px;
  transition: color 0.3s ease;
}

.company-bar.disabled-state .info-label {
  color: #636161;
}

.info-value {
  font-size: 15px;
  color: #ABB4BD;
  transition: color 0.3s ease;
  text-align: left;
}

.company-bar.disabled-state .info-value {
  color: #636161;
}

.button-group {
  display: flex;
  gap: 5px;
  align-items: center;
  margin-right: 15px;
}

.custom-button {
  background-color: #DB5151;
  border: #DB5151;
  width: 120px;
  height:34px;
  padding: 8px 16px;
  border-radius: 12px;
  transition: all 0.3s ease;
  font-weight: bold;
}

.custom-button1 {
  background-color: #DB5151;
  width: 100px;
  height:34px;
  padding: 8px 16px;
  border-radius: 12px;
  transition: all 0.3s ease;
  font-weight: bold;
}

.custom-button1-enabled {
  background-color: #88E36A;
  width: 100px;
  height:34px;
  padding: 8px 16px;
  border-radius: 12px;
  font-weight: bold;
}

.custom-button2 {
  background-color: #7B8896;
  width: 100px;
  height:34px;
  padding: 8px 16px;
  border-radius: 12px;
  transition: all 0.3s ease;
  font-weight: bold;
}

.company-bar.disabled-state .custom-button2 {
  background-color: #636161;
  color: #7B8896;
  border: #636161;
}
</style>

<script setup>
import { ref, onMounted } from 'vue';
import { ElInput, ElMessageBox, ElButton, ElMessage } from 'element-plus';
import { Search, Plus, HomeFilled, Setting, ChatDotRound, QuestionFilled, Briefcase } from '@element-plus/icons-vue';
import ServerAddCard from "@/components/ServerAddCard.vue";
import ConfirmDeleteDialog from "@/components/ConfirmDeleteDialog.vue";
import { useRouter } from 'vue-router';

const router = useRouter();

// 初始化公司列表
const companies = ref([]);
const isAllDisabled = ref(false);
const searchQuery = ref('');
const show = ref(false);
const deleteDialogVisible = ref(false);
const serverToDelete = ref("");
const selectedTool = ref('home');

// 获取公司列表的API调用
const fetchCompanyList = async () => {
  try {
    const token = localStorage.getItem('token');
    if (!token) {
      ElMessage.error('请先登录');
      router.push('/login');
      return;
    }

    const response = await fetch('http://47.86.232.20:8080/agent/get-company-list', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `${token}` // JWT令牌格式
      }
    });

    if (!response.ok) {
      const data = await response.json();
      ElMessage.error(data.message || '获取公司列表失败');
      return;
    }

    const data = await response.json();
    if (data.message === '查询成功') {
      // 数据映射处理：将API数据转换为组件需要的格式
      const mappedCompanies = data.data.map(company => ({
        id: company.id,
        name: company.name,
        manager: company.admin_id, // 假设admin_id为管理员标识（需根据实际接口调整）
        email: '暂无邮箱信息', // 示例API中没有邮箱字段，可根据实际接口补充
        staffCount: company.membernum,
        serverCount: company.systemnum,
        isDisabled: false // 假设初始状态为启用，如需同步状态需从API获取
      }));
      
      companies.value = mappedCompanies;
      // 更新全选状态
      isAllDisabled.value = companies.value.every(c => c.isDisabled);
    }
  } catch (error) {
    console.error('获取公司列表出错:', error);
    ElMessage.error('网络请求失败，请检查网络或稍后重试');
  }
};

// 组件挂载后获取数据
onMounted(() => {
  fetchCompanyList();
});

// 切换全部状态
const toggleAllDisable = () => {
  const newState = !isAllDisabled.value;
  companies.value.forEach(company => {
    company.isDisabled = newState;
  });
  isAllDisabled.value = newState;
};

// 切换单个公司状态
const toggleDisable = (company) => {
  company.isDisabled = !company.isDisabled;
  isAllDisabled.value = companies.value.every(c => c.isDisabled);
  console.log(`切换公司状态：${company.name} 现在为 ${company.isDisabled ? '停用' : '启用'}`);
};

// 其他功能函数（删除、添加、工具栏处理等）保持不变
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

const handleToolClick = (tool, companyName) => {
  selectedTool.value = tool;
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
};

const navigateToHome = () => {
  currentView.value = 'home';
};

const openSettings = () => {};
const showMessages = () => {};
const showBriefcase = () => {};
const showHelp = () => {};
</script>