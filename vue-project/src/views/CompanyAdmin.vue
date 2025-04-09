<template>
  <div class="companyadmin">
    <!-- 左侧管理 -->
    <div class="left">
      <div class="header">
        <div class="logo">
          <img src="@/assets/display/icons/stLine-server-l.png" width="36">
          <p>SeverM</p>
        </div>
      </div>
      <div class="company-info">
        <div class="company-info-content">
          <el-button type="text" class="back-button">< 返回管理页面</el-button>
          <div class="company-middle-info">
            <div class="company-name">深圳大学计算机与软件学院</div>
            <div class="count-info">
              <span>成员总数 {{ members.length }}</span>
              <span>服务器总数 15</span>
            </div>
          </div>
          <el-button type="text" class="forward-button"> 进入主页面 ></el-button>
        </div>
      </div>
      <div class="main-content">
        <div class="top">
          <div class="button-group">
            <el-button class="button" @click="openAddMemberDialog">+</el-button>
            <el-button class="button" @click="openDeleteSelectedDialog"> -</el-button>
          </div>
          <div class="search-group">
            <el-input v-model="searchQuery" placeholder="请输入搜索内容" class="s-input" :prefix-icon="Search" style="width:400px;height: 35px;"/>
            <el-icon
              style="width: 2rem; height: 2rem; margin-left: 0.5rem; background-color: #ffffff; border-radius: 50%;">
              <Search style="font-size: 1.2rem; color: #000000;" />
            </el-icon>
          </div>
        </div>
        <div class="member-list" style="height: calc(100vh - 320px); overflow-y: auto;">
          <!-- 表头 -->
          <div class="member-header">
            <div class="header-item select-header" style="height: 45px;">
              <el-checkbox v-model="isAllSelected" @change="handleSelectAll" style="color: white;font-weight: bold;">全选</el-checkbox>
            </div>
            <div class="header-item name-header">成员姓名</div>
            <div class="header-item email-header">成员邮箱</div>
            <div class="header-item action-header">操作</div>
          </div>
          <!-- 成员数据 -->
          <div class="member-row" v-for="(member, index) in members" :key="index">
            <div class="member-item select-item">
              <el-checkbox v-model="member.isSelected" @change="checkAllSelected"></el-checkbox>
            </div>
            <div class="member-item name-item">{{ member.name }}</div>
            <div class="member-item email-item">{{ member.email }}</div>
            <button class="deletebutton" @click="openDeleteMemberDialog(member)">删除</button>
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
    <!-- 添加成员弹窗 -->
    <div v-if="showAddMemberDialog" class="addbox">
      <div class="box-title">添加成员</div>
      <div class="divider"></div>
      <div class="input-title">成员姓名</div>
      <div class="input-wrapper">
        <span class="input-icon1">
          <el-icon><UserFilled /></el-icon>
        </span>
        <input type="text" v-model="username" placeholder="请输入成员姓名" class="bar">
      </div>
      <div class="input-title">成员邮箱</div>
      <div class="input-wrapper">
        <span class="input-icon2">
          <el-icon><Comment /></el-icon>
        </span>
        <input type="passwordType" v-model="email" placeholder="请输入成员邮箱" class="bar2">
      </div>
      <div class="buttons">
        <button class="add-button" @click="addMember">添加</button>
        <button class="cancle-button" @click="showAddMemberDialog = false">取消</button>
      </div>
    </div>
    <!-- 删除成员弹窗 -->
    <div v-if="showDeleteMemberDialog" class="deletebox">
      <div class="box-title">删除确认</div>
      <div class="divider"></div>
      <div class="confirm-text">{{ confirmText }}</div>
      <div class="buttons">
        <button class="confirm-button" @click="confirmDelete">确定</button>
        <button class="cancle-button" @click="showDeleteMemberDialog = false">取消</button>
      </div>
    </div>
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

.companyadmin {
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

.company-info {
  background-color: rgb(94, 118, 144, 0.34);
  border: 1px solid #374151;
  border-radius: 1rem;
  height: 300px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 25px;
  margin: 13px 15px 13px 30px;
}

.company-info-content {
  display: flex;
  justify-content: space-between;
  width: 100%;
  align-items: center;
  /* 添加垂直居中属性 */
}

/* 提高选择器优先级 */
.el-button.back-button {
  background-color: rgb(123, 136, 150, 0.73);
  width: 150px;
  height: 43px;
  color: white;
  font-size: 16px;
  border-radius: 12px;
}

.el-button.back-button:hover {
  background-color: rgba(87, 97, 106, 0.38);
  color: white;
}

.el-button.back-button:active {
  background-color: rgba(65, 72, 79, 0.38);
  color: white;
}

.el-button.forward-button {
  background-color: rgb(123, 136, 150, 0.39);
  width: 150px;
  height: 43px;
  color: white;
  font-size: 16px;
}

.el-button.forward-button:hover {
  background-color: rgba(87, 97, 106, 0.38);
  color: white;
}

.el-button.forward-button:active {
  background-color: rgba(65, 72, 79, 0.38);
  color: white;
}

.company-middle-info {
  text-align: center;
}

.company-name {
  color: white;
  font-size: 30px;
  font-weight: bold;
}

.count-info {
  color: white;
  font-size: 16px;
  display: flex;
  justify-content: center;
  /* 整体水平居中 */
  gap: 100px;
  /* 成员总数和服务器总数中间间距为20px ，可按需调整 */
}

.main-content {
  background-color: rgb(94, 118, 144, 0.34);
  border-radius: 1rem;
  padding: 25px;
  margin: 13px 15px 13px 30px;
  border: 1px solid #374151;
  /* 移除 flex: 1; 避免影响布局 */
}

.top {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.button-group {
  display: flex;
}

.el-button.button {
  background-color: rgb(123, 136, 150, 0.39);
  border: rgb(123, 136, 150, 0.39);
  width: 35px;
  height: 35px;
  color: white;
  font-size: 16px;
  color: white;
  font-size: 20px;
  border-radius: 7px;
}

.el-button.button:hover {
  background-color: rgba(87, 97, 106, 0.38);
  color: white;
}

.el-button.button:active {
  background-color: rgba(65, 72, 79, 0.38);
  color: white;
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
  color: #636161!important;
}

.member-list {
  width: 100%;
  height: 100%;
  margin-top: 12px;
  overflow-y: auto;
  color: white;
}

.member-list::-webkit-scrollbar {
  display: none;
}

.member-list {
  scrollbar-width: none;
}

.member-header {
  display: flex;
  font-size: 15px;
  font-weight: bold;
  color: white;
  margin-bottom: 7px;
  align-items: center;
}

.header-item {
  height: 45px;
  padding: 5px;
  margin-right: 10px;
  background-color: rgb(94, 118, 144, 0.34);
  border-radius: 7px;
  display: flex;
  justify-content: center;
  align-items: center;
  font-weight: bold;
}

.header-item:last-child {
  margin-right: 0;
}

.select-header {
  width: 100px;
  display: flex;
  justify-content: center;
}

.name-header {
  width: 250px;
}

.email-header {
  flex: 1;
}

.action-header {
  width: 150px;
  display: flex;
  justify-content: center;
}

.member-row {
  display: flex;
  margin-bottom: 7px;
  border-radius: 5px;
  height: 45px;
}

.member-item {
  padding: 10px;
  font-size: 15px;
  margin-right: 10px;
  /* 增大成员元素右边距 */
  border-radius: 7px;
  background-color: rgb(123, 136, 150, 0.38);
  display: flex;
  justify-content: center;
  align-items: center;
}

.member-item:last-child {
  margin-right: 0;
}

.select-item {
  width: 100px;
  display: flex;
  justify-content: center;
}

.name-item {
  width: 250px;
}

.email-item {
  flex: 1;
}

.deletebutton {
  width: 150px;
  display: flex;
  justify-content: center;
  background-color: rgb(123, 136, 150, 0.38);
}

.deletebutton:hover {
  background-color: rgba(87, 97, 106, 0.38);
}

.deletebutton:active {
  background-color: rgba(65, 72, 79, 0.38);
}

.add-member-dialog.el-dialog {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  text-align: center;
  width: 60vw;
  max-width: 660px;
  height: 60vh;
  background-color: #333333;
  color: white;
  padding: 20px;
  border-radius: 10px;
}

/* 添加成员弹窗 */
.addbox {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 60vw;
  max-width: 660px;
  height: 41vh;
  background-color: #222222;
  border: 1px solid #636161;
  color: white;
  padding: 10px;
  border-radius: 10px;
}

.box-title {
  text-align: left;
  margin-left: 10px;
  margin-top: 0%;
  font-size: 20px;
  font-weight: bold;
}

.divider {
  width: 96%;
  height: 1px;
  background-color: #636161;
  margin: 10px auto;
}

.input-title{
  text-align: left;
  margin-left: 30px;
  color:#9A9A9A;
  font-size: 16px;
  font-weight: bold;
  margin-bottom: 0px;
}

.bar,
.bar2 {
  background-color: rgb(94, 118, 144, 0.34);
  border: 1px solid #636161;
  color: #9A9A9A;
  font-size: 16px;
  box-sizing: border-box;
  border-radius: 15px;
  height: 6vh;
  width: 80%;
  z-index: 2;
  padding-left: 60px;
}

.bar {
  margin: 0.5vh 0 2vh 0;
}

.bar2 {
  margin: 0.5vh 0 0 0;
}

.input-wrapper {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
}

.input-icon1,
.input-icon2 {
  position: absolute;
  left: 12%;
  transform: translateY(-50%);
  color: white;
  font-weight: bold;
  font-size: 38px;
  z-index: 4;
}

.input-icon1 {
  top: 50%;
}

.input-icon2 {
  top: 66%;
}
 .buttons{
  display: flex;
  justify-content: center;
  gap:20px;

 }

.add-button {
  width: 35%;
  height: 6vh;
  background-color: rgb(39,67,124,70);
  font-size: 20px;
  font-weight: bold;
  color: white;
  margin-bottom: 2vh;
  z-index: 2;
  margin-top: 3vh;
  margin-bottom: 3.4vh;
  border-radius: 15px;
  border: none;
}

.add-button:hover {
  background-color: #21396a;
  color: white;
}

.add-button:active {
  background-color: rgb(25, 49, 74);
  color: white;
}

.cancle-button {
  width: 35%;
  height: 6vh;
  background-color: #636161;
  font-size: 20px;
  font-weight: bold;
  color: white;
  margin-bottom: 2vh;
  z-index: 2;
  margin-top: 3vh;
  margin-bottom: 3.4vh;
  border-radius: 15px;
  border: none;
}

.cancle-button:hover {
  background-color: #504f4f;
  color: white;
}

.cancle-button:active {
  background-color: #484848;
  color: white;
}

.deletebox {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 60vw;
  max-width: 660px;
  height: 25vh;
  background-color: #222222;
  border: 1px solid #636161;
  color: white;
  padding: 10px;
  border-radius: 10px;
}

.confirm-text{
  margin-top: 3vh;
  font-size: 18px;
}
.confirm-button {
  width: 35%;
  height: 6vh;
  background-color: rgb(39,67,124,70);
  font-size: 20px;
  font-weight: bold;
  color: white;
  margin-bottom: 2vh;
  z-index: 2;
  margin-top: 3vh;
  margin-bottom: 3.4vh;
  border-radius: 15px;
  border: none;
}

.confirm-button:hover {
  background-color: #21396a;
  color: white;
}

.confirm-button:active {
  background-color: rgb(25, 49, 74);
  color: white;
}
</style>


<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { ElInput, ElCheckbox, ElIcon } from 'element-plus';
import { Search, HomeFilled, Setting, ChatDotRound, QuestionFilled, Briefcase, UserFilled, Comment } from '@element-plus/icons-vue';

const members = ref([
  {
    name: '成员1',
    email: '123452345@szu.email.cn',
    isSelected: false
  },
  {
    name: '成员2',
    email: '123642365@szu.email.cn',
    isSelected: false
  },
  {
    name: '成员3',
    email: '13522345@szu.email.cn',
    isSelected: false
  }
]);

const isAllSelected = ref(false);
const searchQuery = ref('');
const showAddMemberDialog = ref(false);
const showDeleteMemberDialog = ref(false);
const username = ref('');
const email = ref('');
const passwordType = ref('password');
const confirmText = ref('');
const selectedMembersToDelete = ref([]);

// 工具栏状态管理
const selectedTool = ref('home'); 
const currentView = ref('home'); 

// 获取路由实例
const router = useRouter();
// 处理工具栏点击事件
const handleToolClick = (tool) => {
  selectedTool.value = tool;
  switch (tool) {
    case 'home':
      router.push('/home');
      break;
    case 'notice':
      router.push('/notice');
      break;
    case'setting':
      router.push('/setting');
      break;
    case 'teambusiness':
      router.push('/display/teambusiness');
      break;
    case 'help':
      router.push('/help');
      break;
  }
};
// 全选/取消全选逻辑
const handleSelectAll = () => {
  members.value.forEach(member => {
    member.isSelected = isAllSelected.value;
  });
};

// 检查是否全选
const checkAllSelected = () => {
  isAllSelected.value = members.value.every(member => member.isSelected);
};

// 打开删除单个成员确认弹窗
const openDeleteMemberDialog = (member) => {
  confirmText.value = `确定要删除${member.name}吗？`;
  selectedMembersToDelete.value = [member];
  showDeleteMemberDialog.value = true;
};

// 打开删除选中成员确认弹窗
const openDeleteSelectedDialog = () => {
  const selectedMembers = members.value.filter(member => member.isSelected);
  if (selectedMembers.length === 0) {
    alert('请先选择要删除的成员');
    return;
  }
  confirmText.value = `确定要删除${selectedMembers.length}个成员吗？`;
  selectedMembersToDelete.value = selectedMembers;
  showDeleteMemberDialog.value = true;
};

// 确认删除成员
const confirmDelete = () => {
  selectedMembersToDelete.value.forEach(member => {
    const index = members.value.indexOf(member);
    if (index!== -1) {
      members.value.splice(index, 1);
    }
  });
  showDeleteMemberDialog.value = false;
};

// 打开添加成员弹窗
const openAddMemberDialog = () => {
  showAddMemberDialog.value = true;
};

const addMember = () => {
  if (username.value && email.value) {
    members.value.push({ 
      name: username.value, 
      email: email.value, 
      isSelected: false 
    });
    showAddMemberDialog.value = false;
    username.value = '';
    email.value = '';
  } else {
    alert('请输入成员姓名和成员邮箱');
  }
};

const togglePasswordVisibility = () => {
  passwordType.value = passwordType.value === 'password'? 'text' : 'password';
};

const handlePasswordInput = () => {
  // 处理密码输入逻辑
};
</script>      
<!-- 接口‘http://120.79.200.209:8080/agent/getCompanyInfo’以获取company-info，以下为接口示例，admin是机构管理员的值、第一个成员的邮箱即是管理员邮箱
// 示例
// {
//     "message": "获取公司信息成功",
//     "data": {
//         "Company": {
//             "id": 1,
//             "name": "示例公司",
//             "admin": "adminUser",
//             "member_num": 10,
//             "server_num": 5,
//             "description": "这是一个示例公司"
//         },
//         "Members": [
//             {
//                 "username": "member1",
//                 "email": "member1@example.com"
//             },
//             {
//                 "username": "member2",
//                 "email": "member2@example.com"
//             },
//             {
//                 "username": "member3",
//                 "email": "member3@example.com"
//             }
//             // 更多成员...
//         ]
//     }
// } -->