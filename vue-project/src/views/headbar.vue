<template>
  <div class="headbar-container">
    <div class="top-bar">
      <div class="logo">
        <img src="@/assets/display/icons/stLine-server-l.png" width="36" style="vertical-align: middle;" alt="" srcset="">
        <p>SeverM</p>
      </div>
      <div class="nav-buttons">
        <button :class="{ active: activeButton === 'home' }" @click="navigateTo('home')">主页面</button>
        <button :class="{ active: activeButton === 'notice' }" @click="navigateTo('notice')">通知</button>
        <button :class="{ active: activeButton === 'teambusiness' }" @click="navigateTo('teambusiness')">团队业务</button>
      </div>
      <div class="right-icons">
        <el-icon :class="{ active: activeButton === 'user', 'user-active': isDropdownVisible  }"
          @click="toggleDropdown">
          <UserFilled />
        </el-icon>
        <!-- <el-icon :class="{ active: activeButton ==='setting' }" @click="navigateTo('setting')">
          <Setting />
        </el-icon> -->
        <el-icon :class="{ active: activeButton === 'help' }" @click="navigateTo('help')">
          <QuestionFilled />
        </el-icon>
      </div>
    </div>

    <!-- 下拉栏 -->
    <div v-show="isDropdownVisible" class="dropdown" @click.stop>
      <button @click="showUserInfoPopup">修改个人信息</button>
      <button @click="logout">退出登录</button>
    </div>

    <!-- 内容区 -->
    <div class="content-container">
      <!-- 侧边栏+按钮////////////////////////////////////////////////////////// -->
      <div v-if="isHomeRoute" class="sidebar-wrapper">
        <div class="sidebar" :class="{ 'sidebar-collapsed': !sidebarOpen }">
          <div class="sidebar-header">功能</div>
          <div class="sidebar-menu">
            <button class="sidebar-button" @click="showServerFileTransferDialog">
              <el-icon>
                <ArrowRight />
              </el-icon>
              <span>服务器文件互传</span>
            </button>
            <button class="sidebar-button" @click="showLocalFileTransferDialog">
              <el-icon>
                <ArrowRight />
              </el-icon>
              <span>本机文件传输</span>
            </button>
            <button class="sidebar-button" @click="openServerFileDownloadDialog">
              <el-icon>
                <ArrowRight />
              </el-icon>
              <span>服务器文件下载</span>
            </button>
          </div>
        </div>
        <div class="sidebar-toggle" @click="toggleSidebar">
          <el-icon :size="20">
            <Operation />
          </el-icon>
        </div>
      </div>
      <!-- ///////////////////////////////////////////////////////////////// -->
       
      <!-- 主内容区 -->
      <div class="main-content" :class="{ 'content-expanded': !sidebarOpen && isHomeRoute }">
        <router-view></router-view>
      </div>
    </div>

    <!-- 修改个人信息弹窗 -->
    <div v-if="showEditDialog" @click.self="closeEditDialog">
      <div class="edit-dialog-box">
        <div class="box-title">个人信息</div>
        <div class="divider"></div>
        <div class="user-info-container">
          <div class="info-item">
            <span class="input-title">用户名：</span>
            <span class="info-value">{{ userInfo.name }}</span>
          </div>

          <div class="info-item">
            <span class="input-title">邮箱：</span>
            <template v-if="!isEditing">
              <span class="info-value">{{ userInfo.email }}</span>
            </template>
            <input v-else v-model="userInfo.email" class="info-input" type="email">
          </div>

          <div class="info-item">
            <span class="input-title">密码：</span>
            <div class="password-input-wrapper">
              <template v-if="!isEditing">
                <span class="info-value">********</span>
              </template>
              <input v-else v-model="userInfo.password" :type="passwordType" class="info-input">
              <span class="toggle-password" @click="togglePasswordVisibility">
                <el-icon :is="passwordType === 'password' ? 'Hide' : 'View'" style="color: white" />
              </span>
            </div>
          </div>
        </div>
        <div class="dialog-buttons">
          <button v-if="!isEditing" class="edit-button" @click="startEditing">修改</button>
          <button v-else class="edit-button" @click="confirmEdit">确认修改</button>
          <button class="cancle-button" @click="closeEditDialog">取消</button>
        </div>
      </div>
    </div>

    <!-- 服务器文件互传弹窗 -->
    <ServerFileTransferDialog
      v-model:visible="showServerFileDialog"
      @transfer="handleServerFileTransfer"
    />

    <!-- 本机文件传输弹窗 -->
    <LocalFileTransferDialog
      v-model:visible="showLocalFileDialog"
      @transfer="handleLocalFileTransfer"
    />

    <!-- 服务器文件下载弹窗 -->
    <ServerFileDownloadDialog
      v-model:visible="showServerFileDownloadDialog"
      @transfer="handleServerFileDownload"
    />
  </div>
</template>

<script setup>
import { ref, watch, onMounted, computed } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { UserFilled, Setting, QuestionFilled, View, Hide, ArrowLeft, ArrowRight, Operation } from '@element-plus/icons-vue';
import { ElMessage } from 'element-plus';
import ServerFileTransferDialog from '@/components/dialogs/ServerFileTransferDialog.vue';
import LocalFileTransferDialog from '@/components/dialogs/LocalFileTransferDialog.vue';
import ServerFileDownloadDialog from '@/components/dialogs/ServerFileDownloadDialog.vue';

const router = useRouter();
const route = useRoute();

//////////////////////////////////////////////////////////////////
// 侧边栏状态
const sidebarOpen = ref(false);

// 检查当前是否是home路由
const isHomeRoute = computed(() => {
    return route.path.includes('/headbar/home') || route.path === '/headbar';
});

// 切换侧边栏
const toggleSidebar = () => {
    sidebarOpen.value = !sidebarOpen.value;
};
//////////////////////////////////////////////////////////////////

const activeButton = ref('home');
const isDropdownVisible = ref(false);

const updateActiveState = () => {
    const path = route.path;
    if (path.includes('home')) activeButton.value = 'home';
    else if (path.includes('notice')) activeButton.value = 'notice';
    else if (path.includes('teambusiness')) activeButton.value = 'teambusiness';
    else if (path.includes('setting')) activeButton.value = 'setting';
    else if (path.includes('help')) activeButton.value = 'help';
};

watch(() => route.path, updateActiveState);
updateActiveState();

const navigateTo = (target) => {
    switch (target) {
        case 'home':
            router.push('/headbar/home');
            break;
        case 'notice':
            router.push('/headbar/notice');
            break;
        case 'teambusiness':
            router.push('/headbar/display/teambusiness');
            break;
        case 'setting':
            router.push('/headbar/setting');
            break;
        case 'help':
            router.push('/headbar/help');
            break;
    }
};

// 下拉栏
const toggleDropdown = () => {
    isDropdownVisible.value = !isDropdownVisible.value;
};

// 个人信息弹窗
const showEditDialog = ref(false);
const isEditing = ref(false);
const passwordType = ref('password');
const userInfo = ref({
    name: '',
    email: '',
    password: ''
});

// 显示个人信息弹窗
const showUserInfoPopup = async () => {
    showEditDialog.value = true;
    isEditing.value = false;
    await fetchUserInfo();
};

// 获取用户信息
const fetchUserInfo = async () => {
    try {
        const token = localStorage.getItem('token');
        if (!token) {
            throw new Error('未找到登录凭证');
        }

        const response = await fetch('http://120.79.200.209:8080/agent/userInfo', {
            method: 'GET',
            headers: {
                'Authorization': token
            }
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(errorText || `请求失败，状态码: ${response.status}`);
        }

        // 检查
        const contentType = response.headers.get('content-type');
        if (!contentType?.includes('application/json')) {
            throw new Error('响应不是有效的JSON格式');
        }

        const result = await response.json();

        if (!result.user) {
            throw new Error('用户数据格式不正确');
        }

        // 更新
        userInfo.value = {
            name: result.user.name || '',
            email: result.user.email || '',
            password: result.user.password || ''
        };

        ElMessage.success(result.message || '用户信息加载成功');

    } catch (error) {
        console.error('获取用户信息失败:', error);
        ElMessage.error(error.message || '获取用户信息失败');
        // token无效跳转
        if (error.message.includes('未授权') || error.message.includes('凭证')) {
            router.push('/');
        }
    }
};

// 缺人修改
const confirmEdit = async () => {
    try {
        const token = localStorage.getItem('token');
        if (!token) {
            throw new Error('未找到登录凭证');
        }

        const requestData = {
            new_name: userInfo.value.name,
            new_password: userInfo.value.password,
            new_email: userInfo.value.email,
            realname: userInfo.value.name
        };

        const response = await fetch('http://120.79.200.209:8080/agent/updateUserInfo', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': token
            },
            body: JSON.stringify(requestData)
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(errorText || `更新失败，状态码: ${response.status}`);
        }

        const contentType = response.headers.get('content-type');
        if (!contentType?.includes('application/json')) {
            throw new Error('响应不是有效的JSON格式');
        }

        const result = await response.json();

        await fetchUserInfo();
        ElMessage.success(result.message || '用户信息更新成功');
        isEditing.value = false;

    } catch (error) {
        console.error('更新用户信息失败:', error);
        ElMessage.error(error.message || '更新用户信息失败');
        // token无效跳转
        if (error.message.includes('未授权') || error.message.includes('凭证')) {
            router.push('/');
        }
    }
};

// 关闭弹窗
const closeEditDialog = () => {
    showEditDialog.value = false;
    isEditing.value = false;
};

// 开始编辑
const startEditing = () => {
    isEditing.value = true;
};

// 密码眼睛图标
const togglePasswordVisibility = () => {
    passwordType.value = passwordType.value === 'password' ? 'text' : 'password';
};

// 退出登录
const logout = () => {
    localStorage.removeItem('token');
    router.push('/login');
};

// 文件传输弹窗状态
const showServerFileDialog = ref(false);
const showLocalFileDialog = ref(false);
const showServerFileDownloadDialog = ref(false);

// 显示服务器文件互传弹窗
const showServerFileTransferDialog = () => {
    showServerFileDialog.value = true;
};

// 显示本机文件传输弹窗
const showLocalFileTransferDialog = () => {
    showLocalFileDialog.value = true;
};

// 处理服务器文件传输
const handleServerFileTransfer = (formData) => {
    console.log('服务器文件传输数据:', formData);
    // 这里可以添加实际的文件传输逻辑
    ElMessage.success('服务器文件传输请求已提交');
};

// 处理本机文件传输
const handleLocalFileTransfer = (formData) => {
    console.log('本机文件传输数据:', formData);
    // 这里可以添加实际的文件传输逻辑
    ElMessage.success('本机文件传输请求已提交');
};

// 显示服务器文件下载弹窗
const openServerFileDownloadDialog = () => {
    showServerFileDownloadDialog.value = true;
    isDropdownVisible.value = false;
};

// 处理服务器文件下载
const handleServerFileDownload = (formData) => {
    console.log('处理服务器文件下载:', formData);
    // 这里可以添加其他处理逻辑
    ElMessage.success('服务器文件下载请求已提交');
};

// 点击外部关闭下拉栏
onMounted(() => {
    document.addEventListener('click', (event) => {
        const dropdown = document.querySelector('.dropdown');
        const icon = document.querySelector('.right-icons');
        if (dropdown && !dropdown.contains(event.target) && !icon.contains(event.target)) {
            isDropdownVisible.value = false;
        }
    });
});
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

  .headbar-container {
    background-color: #1a1a1a;
    height: 100vh;
    display: flex;
    flex-direction: column;
  }

  .top-bar {
    display: flex;
    align-items: center;
    padding: 0 20px;
    height: 77px;
    background-color: #29333E;
    border-bottom: 4px solid #4095E5;
    backdrop-filter: blur(8px);
    position: relative;
  }

  .top-bar::after {
    content: '';
    position: absolute;
    bottom: -10px;
    left: 0;
    right: 0;
    height: 6px;
    background: #4095E5;
    filter: blur(6px);
    z-index: -1;
    opacity: 0.7;
  }

  .logo {
    font-size: 1.2rem;
    color: white;
    margin-right: 7vw;
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

  .nav-buttons {
    display: flex;
    gap: 9vw;
    flex-grow: 1;
  }

  .nav-buttons button {
    background: transparent;
    border: none;
    color: #B8B5B5;
    font-size: 20px;
    cursor: pointer;
    padding: 5px 0;
    position: relative;
  }

  .nav-buttons button:hover {
    color: white;
  }

  .nav-buttons button.active {
    font-weight: bold;
    color: white;
    transform: scale(1.1);
  }

  .right-icons {
    margin-left: auto;
    display: flex;
    gap: 20px;
  }

  .el-icon {
    color: #B8B5B5;
    font-size: 26px;
    cursor: pointer;
    transition: all 0.3s ease;
  }

  .el-icon:hover {
    color: #ffffff;
    transform: scale(1.1);
  }

  .el-icon.active {
    color: #4095E5;
    transform: scale(1.1);
  }

  .el-icon.user-active {
    color: rgb(175, 195, 235) !important;
    transform: scale(1.1);
  }

  /* 下拉栏 */
  .dropdown {
    position: absolute;
    top: 65px;
    /* right: 130px; */
    right: 80px;
    background-color: #29333E;
    box-shadow: 0 0 5px rgb(172, 194, 255);
    padding: 6px;
    border-radius: 5px;
    z-index: 1000;
  }

  .dropdown button {
    display: block;
    width: 120px;
    padding: 10px;
    color: #ffffff;
    text-align: center;
    border: none;
    background: transparent;
    cursor: pointer;
  }

  .dropdown button:hover {
    background-color: #3d4b5a;
    border-radius: 5px;
  }

  .dropdown button:active {
    background-color: #54677a;
    border-radius: 5px;
  }

  /* 内容区 */
  .content-container {
    display: flex;
    flex: 1;
    position: relative;
    overflow: hidden;
    z-index: 100;
  }


  /* /////////////////////////////////////////////////////////////////////////////////// */
  /* 侧边栏包装器 */
  .sidebar-wrapper {
    position: relative;
    height: 100%;
    display: flex;
  }

  /* 侧边栏样式 */
  .sidebar {
    width: 200px;
    background-color: #29333E;
    transition: all 0.3s ease;
    overflow: hidden;
    flex-shrink: 0;
    height: 100%;
    z-index: 100;
  }

  .sidebar-collapsed {
    width: 0;
  }

  .sidebar-header {
    padding: 15px 20px;
    font-size: 18px;
    font-weight: bold;
    color: white;
    border-bottom: 1px solid #3d4b5a;
  }

  .sidebar-menu {
    padding: 10px 0;
  }

  .sidebar-button {
    width: 100%;
    padding: 12px 20px;
    background: transparent;
    border: none;
    color: #B8B5B5;
    text-align: left;
    display: flex;
    align-items: center;
    cursor: pointer;
    transition: all 0.2s;
  }

  .sidebar-button:hover {
    background-color: #3d4b5a;
    color: white;
  }

  .sidebar-button .el-icon {
    margin-right: 10px;
    font-size: 14px;
  }

  /* 侧边栏弹出按钮 */
  .sidebar-toggle {
    position: absolute;
    right: -25px;
    top: 20px;
    width: 25px;
    height: 40px;
    background-color: #29333E;
    border-radius: 0 5px 5px 0;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: all 0.3s ease;
    z-index: 200;
  }

  .sidebar-toggle:hover {
    background-color: #3d4b5a;
  }

  .sidebar-toggle .el-icon {
    color: white;
    font-size: 16px;
  }
  /* /////////////////////////////////////////////////////////////////////////////////// */


  /* 内容显示区*/
  .main-content {
    flex: 1;
    overflow: hidden;
    transition: margin-left 0.3s ease;
    z-index: 100;
  }

  .content-expanded {
    margin-left: 0;
  }

  /* 修改个人信息弹窗 */
  .edit-dialog-box {
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 60vw;
    max-width: 550px;
    height: 320px;
    background-color: #222222;
    border: 1px solid #636161;
    color: white;
    padding: 20px;
    border-radius: 10px;
    display: flex;
    flex-direction: column;
    z-index: 100;
  }

  .box-title {
    text-align: left;
    margin-left: 10px;
    font-size: 20px;
    font-weight: bold;
    height: 30px;
  }

  .divider {
    width: 96%;
    height: 1px;
    background-color: #636161;
    margin: 10px 10px 15px 10px;
  }

  .user-info-container {
    flex: 1;
    display: flex;
    flex-direction: column;
    font-size: 13px;
    padding: 0 50px;
    height: 30%;
    gap: 10px;
  }

  .info-item {
    display: flex;
    align-items: center;
    min-height: 36px;
  }

  .input-title {
    width: 100px;
    text-align: right;
    padding-right: 20px;
    color: #9A9A9A;
    font-size: 16px;
    font-weight: bold;
    flex-shrink: 0;
    line-height: 1;
  }

  .info-value,
  .password-input-wrapper,
  .info-input {
    flex: 1;
    text-align: left;
  }

  .info-input {
    background-color: #333;
    border: 1px solid #636161;
    color: white;
    padding: 8px;
    border-radius: 4px;
    height: 29px;
    line-height: 24px;
  }

  .password-input-wrapper {
    position: relative;
    display: flex;
    align-items: center;
  }

  .toggle-password {
    position: absolute;
    right: 10px;
    top: 50%;
    transform: translateY(-50%);
  }

  .info-input {
    background-color: #4F4F4F;
    border: 1px solid #636161;
    color: white;
    padding: 8px;
    border-radius: 4px;
    width: 100%;
  }

  .dialog-buttons {
    display: flex;
    justify-content: center;
    gap: 20px;
  }

  .edit-button {
    width: 35%;
    height: 6vh;
    background-color: rgba(39, 67, 124, 0.7);
    font-size: 20px;
    font-weight: bold;
    color: white;
    margin-bottom: 2vh;
    z-index: 2;
    margin-top: 2vh;
    margin-bottom: 2vh;
    border-radius: 15px;
    border: none;
    cursor: pointer;
    transition: all 0.3s;
  }

  .edit-button:hover {
    background-color: #21396a;
    color: white;
  }

  .edit-button:active {
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
    margin-top: 2vh;
    margin-bottom: 2vh;
    border-radius: 15px;
    border: none;
    cursor: pointer;
    transition: all 0.3s;
  }

  .cancle-button:hover {
    background-color: #504f4f;
    color: white;
  }

  .cancle-button:active {
    background-color: #484848;
    color: white;
  }
</style>