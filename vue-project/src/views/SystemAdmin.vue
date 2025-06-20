<template>
  <div class="systemadmin">
    <!-- 左侧管理 -->
    <div class="left">
      <div class="main-content">
        <div class="top">
          <div class="placeholder-button"></div>
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
                  <span class="info-value" style="width:170px;">{{ company.email }}</span>
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
              <!-- <el-button 
                :type="company.isDisabled ? 'success' : 'danger'"
                :class="company.isDisabled ? 'custom-button1-enabled' : 'custom-button1'"
                @click="toggleDisable(company)"
              >
                {{ company.isDisabled ? '启动' : '停用' }}
              </el-button> -->
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
  </div>
</template>


<script setup>
import { ref, onMounted } from 'vue';
import { ElInput, ElMessageBox, ElButton, ElMessage } from 'element-plus';
import { Search, Plus, HomeFilled, Setting, ChatDotRound, QuestionFilled, Briefcase } from '@element-plus/icons-vue';
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

// 获取公司列表
const fetchCompanyList = async () => {
  try {
    const token = localStorage.getItem('token');
    if (!token) {
      ElMessage.error('请先登录');
      router.push('/login');
      return;
    }

    const response = await fetch('http://localhost:8080/agent/get-company-list', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `${token}` 
      }
    });

    if (!response.ok) {
      const data = await response.json();
      ElMessage.error(data.message || '获取公司列表失败');
      return;
    }

    const data = await response.json();
    console.log('获取公司列表接口返回的原始数据:', data);
    console.log('data.data:', data.data);

    if (data.message === '查询成功') {
      const mappedCompanies = data.data.map(company => {
        console.log('单个公司数据:', company);
        return {
          id: company.id,
          name: company.name,
          manager: company.adminName,
          email: company.adminEmail,
          staffCount: company.membernum,
          serverCount: company.systemnum,
          isDisabled: false
        };
      });
      
      console.log('映射后的公司数据:', mappedCompanies);
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
      router.push('/headbar/home');
      break;
    case 'notice':
      router.push('/headbar/notice');
      break;
    case 'setting':
      router.push('/headbar/setting');
      break;
    case 'teambusiness':
      router.push('/headbar/display/teambusiness');
      break;
    case 'help':
      router.push('/headbar/help');
      break;
    case 'companyadmin':
      router.push({ 
        path: '/headbar/companyadmin',
        query: { companyName: companyName }
      });
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


.content-container {
  max-width: 1400px; /* 增加最大宽度 */
  margin: 0 auto;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  padding: 20px;
}

.left {
  width: 100%; /* 修改为100%宽度 */
  display: flex;
  flex-direction: column;
  padding: 0;
  background-color: #000000;
}


.main-content {
  flex: 1;
  background-color:  rgb(94, 118, 144, 0.34);
  border-radius: 1rem;
  padding: 25px;
  margin: 23px 30px 80px 30px; 
  border: 1px solid #374151;
}

.top {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.placeholder-button {
  width: 120px;
  height: 34px;
  background-color: transparent;
  border: none;
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
  gap: 5px;
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
