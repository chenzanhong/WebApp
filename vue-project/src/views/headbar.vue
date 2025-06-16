<template>
  <div class="headbar-container">
    <div class="top-bar">
      <div class="logo">
        <img src="@/assets/display/icons/stLine-server-l.png" width="36" style="vertical-align: middle;" alt="" srcset="">
        <p>SeverM</p>
      </div>
      <div class="nav-buttons">
        <button v-if="isAdmin" :class="{ active: activeButton === 'admin' }" @click="navigateTo('admin')">管理</button>
        <button :class="{ active: activeButton === 'home' }" @click="navigateTo('home')">主页面</button>
        <button :class="{ active: activeButton === 'notice' }" class="notice-button-container" @click="navigateTo('notice')">
    <span>通知</span>
    <div v-if="unreadCount > 0" class="notification-badge">
      {{ unreadCount }}
    </div>
        </button>
        <button :class="{ active: activeButton === 'teambusiness' }" @click="navigateTo('teambusiness')">团队业务</button>
        <button :class="{ active: activeButton === 'log' }" @click="navigateTo('log')">日志</button>
      </div>
      <div class="right-icons">
        <el-icon :class="{ active: activeButton === 'user', 'user-active': isDropdownVisible  }"
          @click="toggleDropdown">
          <UserFilled />
        </el-icon>

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
      <!-- 功能侧边栏+按钮 -->
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
              <span>本地文件上传</span>
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
      
      <!-- 告警侧边栏内容 -->
    <div v-if="isHomeRoute" class="warning-sidebar-content-wrapper" :class="{ 'sidebar-open': sidebarOpen2 }">
      <div class="sidebar2">
        <div class="sidebar-header2">告警</div>
        <div class="sidebar-menu2">
          <div v-if="noAlertsFlag === 0" v-for="(warning, index) in warnings" :key="index" class="warning-item" @click="viewAlert(warning)">
            <div class="warning-content">
              <div class="warning-title">{{ formatWarningTitle(warning.warning_title, warning.warning_type) }}</div>
              <div class="warning-message">{{ warning.warning_message }}</div>
              <div class="warning-time">{{ warning.warning_time }}</div>
            </div>
          </div>
          <el-empty v-if="noAlertsFlag === 1 || warnings.length === 0" description="服务器都在正常运作中！" />
        </div>
      </div>
    </div>

    <!-- 告警侧边栏激活按钮 -->
    <div v-if="isHomeRoute" class="warning-sidebar-toggle-button" :class="{ 'button-open': sidebarOpen2 }" @click="toggleSidebar2">
      <el-icon class="warning-icon-button">
        <WarningFilled />
      </el-icon>
      <span class="warning-count-text">{{ noAlertsFlag === 0 ? warnings.length : 0 }}</span>
    </div>
       
      <!-- 主内容区 -->
      <div class="main-content" :class="{
        'content-expanded': !sidebarOpen && isHomeRoute,
        'margin-right-active': sidebarOpen2 && isHomeRoute
      }">
        <router-view></router-view>
      </div>
      <!-- 告警悬浮框 -->
      <div v-for="(alert, index) in activeAlerts" 
           v-if="noAlertsFlag === 0"
           :key="index" 
           class="alert-popup" 
           :style="{ top: `${index * 60 + 90}px` }">
        <div class="alert-content">
          <el-icon class="warning-icon"><Warning /></el-icon>
          <div class="alert-text">
            <template v-if="alert.warning_type === '通用告警'">
              <div class="alert-title">{{ alert.warning_title }}</div>
            </template>
            <template v-else>
              <div class="alert-title">{{ alert.host_name }} {{ alert.warning_type }}告警</div>
              <div class="alert-detail">{{ formatWarningTitle(alert.warning_title, alert.warning_type) }}</div>
            </template>
          </div>
          <button class="view-button" @click="viewAlert(alert)">查看</button>
        </div>
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

            <div class="info-item">
              <span class="input-title">真实姓名：</span>
              <template v-if="!isEditing">
                <span class="info-value">{{ userInfo.realname || '未填写' }}</span>
              </template>
              <input v-else v-model="userInfo.realname" class="info-input" type="text" placeholder="请输入真实姓名">
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

    <!-- 本地文件上传弹窗 -->
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
import { eventBus } from '@/utils/eventBus';
import { ref, watch, onMounted, computed, onBeforeUnmount, onUnmounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { UserFilled, Setting, QuestionFilled, View, Hide, ArrowLeft, ArrowRight, Operation, WarningFilled, Warning } from '@element-plus/icons-vue';
import { ElMessage } from 'element-plus';
import ServerFileTransferDialog from '@/components/dialogs/ServerFileTransferDialog.vue';
import LocalFileTransferDialog from '@/components/dialogs/LocalFileTransferDialog.vue';
import ServerFileDownloadDialog from '@/components/dialogs/ServerFileDownloadDialog.vue';
import axios from 'axios';

const router = useRouter();
const route = useRoute();

//////////////////////////////////////////////////////////////////
// 功能侧边栏状态
const sidebarOpen = ref(false);

// 告警侧边栏状态
const sidebarOpen2 = ref(false);

// 预警信息
const warnings = ref([
  {
    id: 1,
    host_name: "web-server-01",
    warning_type: "CPU与内存",
    warning_title: "主机 web-server-01 发生 CPU与内存，CPU使用率: 85.00%，内存使用率: 92.00%",
    warning_time: "2025-06-12T10:30:00+08:00"
  },
  {
    id: 2,
    host_name: "web-server-02",
    warning_type: "CPU",
    warning_title: "主机 web-server-01 发生 CPU，CPU使用率: 88.00%，内存使用率: 75.00%",
    warning_time: "2025-06-12T10:45:00+08:00"
  }
]);

// 活跃告警列表
const activeAlerts = ref([]);

// 添加告警显示控制标识
const noAlertsFlag = ref(0);

// 存储上一次获取到的告警数量
const previousWarningCount = ref(0);

// 清空所有告警显示的函数
const clearAllAlerts = () => {
  console.log('清空所有告警显示');
  warnings.value = [];
  activeAlerts.value = [];
  noAlertsFlag.value = 1;
  previousWarningCount.value = 0; // 重置上一次告警数量
};

// 处理新告警
const handleNewAlert = (alert) => {
  // 如果标识为1或alert为空，直接返回
  if (noAlertsFlag.value === 1 || !alert) {
    console.log('noAlertsFlag为1或收到空告警，跳过处理');
    return;
  }
  
  console.log('处理新告警:', alert);
  
  // 直接添加到活跃告警列表
  activeAlerts.value.push({
    id: alert.id, // Ensure ID is passed for removal
    host_name: alert.host_name,
    warning_type: alert.warning_type,
    warning_time: alert.warning_time,
    warning_title: alert.warning_title
  });
  
  // 3秒后从活跃告警列表中移除
  setTimeout(() => {
    if (noAlertsFlag.value === 1) return; // 如果flag为1，不执行移除操作
    const index = activeAlerts.value.findIndex(a => 
      a.id === alert.id // Use unique ID for generic alert
    );
    if (index !== -1) {
      activeAlerts.value.splice(index, 1);
      console.log('移除告警:', alert);
    }
  }, 3000);
};

// 查看告警详情
const viewAlert = (alert) => {
  if (alert.warning_type === '通用告警') {
    console.log('点击通用告警查看按钮，打开告警侧边栏');
    toggleSidebar2(); // Open the warning sidebar
  } else {
    // 这是针对具体告警的逻辑
    console.log('查看具体告警:', alert);
    if (alert.host_name) {
      router.push(`/headbar/monitor/${alert.host_name}`);
      console.log(`导航到: /headbar/monitor/${alert.host_name}`);
      // 可以选择在导航后关闭侧边栏
      // sidebarOpen2.value = false;
    } else {
      console.warn('告警缺少host_name，无法导航到监控页面。告警数据:', alert);
    }
  }
};

// 格式化警告标题，根据warning_type显示相应的使用率数据
const formatWarningTitle = (title, warning_type) => {
  if (!title) return '';
  
  // 提取主机名和告警类型
  const hostMatch = title.match(/主机\s+([^\s]+)\s+发生\s+([^，]+)/);
  // 对于通用告警，不尝试解析
  if (warning_type === '通用告警' || !hostMatch) return title;
  
  const hostName = hostMatch[1];
  const alertType = hostMatch[2];
  
  // 提取使用率数据
  const cpuMatch = title.match(/CPU使用率:\s*(\d+\.\d+)%/);
  const memoryMatch = title.match(/内存使用率:\s*(\d+\.\d+)%/);
  
  // 构建格式化后的标题
  let formattedTitle = `${hostName} 发生 ${alertType}告警\n`;
  
  // 根据warning_type添加相应的使用率数据
  if (warning_type.includes('CPU') && cpuMatch) {
    formattedTitle += `CPU使用率: ${cpuMatch[1]}%\n`;
  }
  if (warning_type.includes('内存') && memoryMatch) {
    formattedTitle += `内存使用率: ${memoryMatch[1]}%`;
  }
  
  return formattedTitle;
};

// 获取预警信息
const fetchWarnings = async () => {
  try {
    const token = localStorage.getItem('token');
    console.log('使用的token:', token);
    console.log('请求URL:', 'http://113.44.170.52:8080/agent/getwarning');
    console.log('请求头:', {
      'Authorization': token
    });
    
    const response = await axios.get('http://113.44.170.52:8080/agent/getwarning', {
      headers: {
        'Authorization': token 
      }
    });
    
    if (response.status === 200) {
      console.log('成功获取预警信息:');
      console.log('完整响应:', response);
      console.log('响应状态:', response.status);
      console.log('响应头:', response.headers);
      console.log('响应数据:', response.data);
      
      // 提取实际的告警数据
      const rawResponseData = response.data && response.data.data ? response.data.data : response.data;
      const warningData = Array.isArray(rawResponseData) ? rawResponseData : (rawResponseData ? [rawResponseData] : []);
      console.log('处理后的warningData:', warningData);
      
      // 如果数据为空数组，立即清空所有显示
      if (!warningData || warningData.length === 0) { 
        clearAllAlerts();
        // 更新上一次的告警数量
        previousWarningCount.value = 0; 
        return;
      }
      
      // 检查告警数量是否增加，如果增加才显示悬浮窗
      const currentWarningCount = warningData.length;
      const shouldShowPopup = currentWarningCount > previousWarningCount.value;
      console.log(`当前告警数量: ${currentWarningCount}, 上次告警数量: ${previousWarningCount.value}, 是否显示悬浮窗: ${shouldShowPopup}`);

      // 重置标识
      noAlertsFlag.value = 0;
      
      // 更新warnings数组 (侧边栏始终显示所有告警)
      warnings.value = warningData.map(warning => ({
        id: warning.id,
        host_name: warning.host_name,
        warning_type: warning.warning_type,
        warning_title: warning.warning_title,
        warning_time: warning.warning_time
      }));

      // 清空之前的活跃告警
      activeAlerts.value = [];
      
      // 只有当告警数量增加时才处理悬浮窗
      if (shouldShowPopup) {
        // 区分处理：单个告警显示详情，多个告警显示通用提示
        if (warningData.length > 1) {
          console.log('检测到多条告警，显示一条通用悬浮窗');
          handleNewAlert({
            id: 'generic-multiple-alerts', // Unique ID for generic alert
            host_name: '', // Not relevant for generic
            warning_type: '通用告警', // Special type for generic message
            warning_title: '有新的告警！', // The generic message
            warning_time: new Date().toISOString() // Current time for generic
          });
        } else if (warningData.length === 1) { // Only one alert
          console.log('检测到单条告警，显示具体悬浮窗');
          if (warningData[0]) {
            handleNewAlert(warningData[0]);
          }
        }
      }
      
      console.log('处理后的预警数据:', warnings.value);
      console.log('当前活跃告警:', activeAlerts.value);

      // 更新上一次的告警数量
      previousWarningCount.value = currentWarningCount; 

    }
  } catch (error) {
    console.error('获取预警信息失败:', error);
    // 发生错误时也清空所有显示
    clearAllAlerts();
    // 确保错误时也重置上一次告警数量
    previousWarningCount.value = 0; 
    if (error.response) {
      console.error('错误状态码:', error.response.status);
      console.error('错误响应头:', error.response.headers);
      console.error('错误响应数据:', error.response.data);
      
      if (error.response.status === 401) {
        console.error('Token 可能已过期或无效');
        ElMessage.error('登录已过期，请重新登录');
      }
    } else if (error.request) {
      console.error('未收到响应，请求信息:', error.request);
    } else {
      console.error('请求配置错误:', error.message);
    }
    ElMessage.error('获取预警信息失败，请检查网络连接');
  }
};

// 检查当前是否是home路由
const isHomeRoute = computed(() => {
    return route.path.includes('/headbar/home') || route.path === '/headbar';
});

// 切换功能侧边栏
const toggleSidebar = () => {
    sidebarOpen.value = !sidebarOpen.value;
};

// 切换告警侧边栏
const toggleSidebar2 = () => {
    sidebarOpen2.value = !sidebarOpen2.value;
};

const activeButton = ref('home');
const isDropdownVisible = ref(false);

// 添加管理员角色判断
const isAdmin = ref(false);

// 检查用户角色
const checkUserRole = () => {
  try {
    const userRole = localStorage.getItem('userRole');
    console.log('从localStorage获取的用户角色:', userRole);

    if (!userRole) {
      console.log('未找到用户角色信息，设置isAdmin为false');
      isAdmin.value = false;
      return;
    }

    isAdmin.value = userRole === 'ADMIN' || userRole === 'ROOT';
    console.log('最终isAdmin值:', isAdmin.value);
  } catch (error) {
    console.error('检查用户角色失败:', error);
    isAdmin.value = false;
  }
};
const unreadCount = ref(0);
// 获取未读通知数量
async function fetchUnreadCount() {
  try {
    const token = localStorage.getItem('token');
    if (!token) return;
    
    const response = await axios.get(
      'http://113.44.170.52:8080/agent/info/recivelist', 
      { headers: { Authorization: ` ${token}` } }
    );
    
    if (response.data && response.data.receiveNotices) {
      // 计算未确认的通知数量
      unreadCount.value = response.data.receiveNotices.filter(
        notice => mapProcessedStatus(notice.state) === 'unconfirmed'
      ).length;
      
      // 发送事件让其他组件知道未读数量
      eventBus.emit('unread-count', unreadCount.value);
    }
  } catch (error) {
    console.error('获取未读通知数量失败:', error);
    unreadCount.value = 0;
  }
}
// 复制通知界面中的状态映射逻辑
function mapProcessedStatus(state) {
  if (typeof state === 'boolean') {
    return state ? 'confirmed' : 'unconfirmed';
  }
  const statusMap = {
    unprocessed: 'unconfirmed',
    processed: 'confirmed',
    expired: 'expired'
  };
  return statusMap[state?.toLowerCase()] || 'expired';
}
// 监听事件更新未读数量
eventBus.on('unread-count', (count) => {
  unreadCount.value = count;
});

// 在组件挂载时初始化
onMounted(() => {
  console.log('组件开始挂载');
  checkUserRole();
  console.log('组件挂载完成，最终管理员状态:', isAdmin.value);
  
  // 如果当前是主页面，开始获取预警信息
  if (isHomeRoute.value) {
    clearAllAlerts(); // 初始化时清空所有显示
    fetchWarnings();
  }

   // 监听未读消息数量变化
   if (localStorage.getItem('token')) {
    fetchUnreadCount();
  }
  // 监听登录状态变化
  watch(() => localStorage.getItem('token'), (newToken) => {
    if (newToken) fetchUnreadCount();
    else unreadCount.value = 0;
     });
});

// 定期获取告警
let alertInterval;
onMounted(() => {
  clearAllAlerts(); // 初始化时清空所有显示
  fetchWarnings(); // 初始获取
  alertInterval = setInterval(fetchWarnings, 60000); // 每60秒获取一次
});

onUnmounted(() => {
  if (alertInterval) {
    clearInterval(alertInterval);
  }
  // 组件卸载时取消监听
  eventBus.off('unread-count');
  clearAllAlerts(); // 组件卸载时清空所有显示
});

// 修改导航函数
const navigateTo = (target) => {
    switch (target) {
        case 'admin':
            // 根据用户角色决定跳转到哪个管理页面
            const userRole = localStorage.getItem('userRole');
            if (userRole === 'ROOT') {
                router.push('/headbar/systemadmin');
            } else if (userRole === 'ADMIN') {
                router.push('/headbar/companyadmin');
            }
            break;
        case 'home':
            router.push('/headbar/home');
            break;
        case 'notice':
            router.push('/headbar/notice');
            break;
        case 'teambusiness':
            router.push('/headbar/display/teambusiness');
            break;
        case 'log':
            router.push('/headbar/log');
            break;
        case 'setting':
            router.push('/headbar/setting');
            break;
        case 'help':
            router.push('/headbar/help');
            break;
    }
};

// 修改活动状态更新函数
const updateActiveState = () => {
    const path = route.path;
    if (path.includes('admin')) activeButton.value = 'admin';
    else if (path.includes('home')) activeButton.value = 'home';
    else if (path.includes('notice')) activeButton.value = 'notice';
    else if (path.includes('teambusiness')) activeButton.value = 'teambusiness';
    else if (path.includes('log')) activeButton.value = 'log';
    else if (path.includes('setting')) activeButton.value = 'setting';
    else if (path.includes('help')) activeButton.value = 'help';
};

watch(() => route.path, updateActiveState);
updateActiveState();

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
  password: '',
  realname: ''
});

// 切换密码可见性
const togglePasswordVisibility = () => {
  passwordType.value = passwordType.value === 'password' ? 'text' : 'password';
};

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

    const response = await fetch('http://113.44.170.52:8080/agent/userInfo  ', {
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
      password: result.user.password || '',
      realname: result.user.realname || ''
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

// 确认修改
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
      realname: userInfo.value.realname
    };

    const response = await fetch('http://113.44.170.52:8080/agent/updateUserInfo  ', {
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

const logout = () => {
  // 模拟退出登录，实际应清除认证信息并跳转到登录页
  localStorage.removeItem('userRole'); // 清除用户角色信息
  unreadCount.value = 0; // 重置计数
  eventBus.emit('unread-count', 0); // 通知其他组件
    router.push('/login');
};

// 文件传输弹窗相关
const showServerFileDialog = ref(false);
const showLocalFileDialog = ref(false);
const showServerFileDownloadDialog = ref(false);

// 显示服务器文件互传弹窗
const showServerFileTransferDialog = () => {
  showServerFileDialog.value = true;
};

// 显示本地文件上传弹窗
const showLocalFileTransferDialog = () => {
  showLocalFileDialog.value = true;
};

// 显示服务器文件下载弹窗
const openServerFileDownloadDialog = () => {
  showServerFileDownloadDialog.value = true;
};

const handleServerFileTransfer = (data) => {
  console.log('服务器文件传输完成:', data);
  ElMessage.success('服务器文件传输成功！');
};

const handleLocalFileTransfer = (data) => {
  console.log('本地文件上传完成:', data);
  ElMessage.success('本地文件上传成功！');
};

const handleServerFileDownload = (data) => {
  console.log('服务器文件下载完成:', data);
  ElMessage.success('服务器文件下载成功！');
};
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
  overflow: hidden;
  }

  .top-bar {
    display: flex;
  justify-content: space-between;
    align-items: center;
    padding: 0 20px;
    height: 77px;
    background-color: #29333E;
    border-bottom: 4px solid #4095E5;
    backdrop-filter: blur(8px);
    position: relative;
  z-index: 1000;
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

.logo img {
  margin-right: 10px;
}

  .logo p {
    margin-left: 10px;
    margin-top: 0.2rem;
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
  transition: all 0.3s ease;
  border-radius: 5px;
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
.right-icons .el-icon {
    color: #B8B5B5;
    font-size: 26px;
    cursor: pointer;
    transition: all 0.3s ease;
  }

.right-icons .el-icon:hover {
    color: #ffffff;
    transform: scale(1.1);
  }

.right-icons .el-icon.active {
    color: #4095E5;
    transform: scale(1.1);
  }

.right-icons .user-active {
    color: rgb(175, 195, 235) !important;
    transform: scale(1.1);
  }

  .dropdown {
    position: absolute;
    top: 65px;
    right: 80px;
    background-color: #29333E;
    box-shadow: 0 0 5px rgb(172, 194, 255);
    padding: 6px;
    border-radius: 5px;
    z-index: 1000;
  min-width: 150px;
  }

  .dropdown button {
    display: block;
    width: 140px;
    padding: 10px;
    color: #ffffff;
    text-align: center;
    border: none;
    background: transparent;
    cursor: pointer;
  font-size: 14px;
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
  overflow: hidden;
    position: relative;
    z-index: 100;
  }

  /* /////////////////////////////////////////////////////////////////////////////////// */
/* 功能侧边栏 */
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

/*告警侧边栏 /////////////////////////////////////////////////////////////////////////////////// */
/* 侧边栏包装器 (实际内容) */
.warning-sidebar-content-wrapper {
  position: fixed;
  right: -300px; /* 初始时隐藏在屏幕右侧外 */
  top: 60px;
  height: calc(100vh - 60px);
  width: 300px; /* 修改宽度为260px */
  background-color: #29333E;
  display: flex;
  flex-direction: column;
  z-index: 100;
  transition: right 0.3s ease;
}

.warning-sidebar-content-wrapper.sidebar-open {
  right: 0; /* 展开时滑入屏幕，右边缘紧贴窗口右侧 */
}

/* 侧边栏样式 */
.sidebar2 {
  width: 100%; /* 占据其包装器的全部宽度 */
  background-color: #29333E; /* 一致的背景 */
  height: 100%; /* 占据其包装器的全部高度 */
  display: flex;
  flex-direction: column;
}

/* 侧边栏头部 */
.sidebar-header2 {
  padding: 28px 20px 10px 20px;
  font-size: 18px;
  font-weight: bold;
  color: white;
  border-bottom: 1px solid #3d4b5a;
}

/* 侧边栏菜单 */
.sidebar-menu2 {
  padding: 10px;
  overflow-y: auto;
  max-height: calc(100vh - 60px);
}

.sidebar-menu2::-webkit-scrollbar {
  width: 6px;
}

.sidebar-menu2::-webkit-scrollbar-thumb {
  background-color: #3c4553;
  border-radius: 3px;
}

.sidebar-menu2::-webkit-scrollbar-track {
  background-color: #2D3748;
}

/* 告警列表项样式 */
.warning-item {
  display: flex;
  align-items: flex-start;
  padding: 16px;
  margin-bottom: 8px;
  background-color: #414951;
  border-radius: 8px;
  color: white;
  cursor: pointer;
}


.warning-content {
  flex: 1;
  text-align: left;
  width: 100%;
}

.warning-title {
  font-weight: bold;
  color: white;
  margin-bottom: 4px;
  white-space: pre-line;
  line-height: 1.5;
  text-align: left;
  font-size: 15px;
}

.warning-message {
  color: #A0AEC0;
  font-size: 16px;
  margin-bottom: 4px;
  text-align: left;
}

.warning-time {
  color: #718096;
  font-size: 12px;
  text-align: left;
}

/* 告警侧边栏激活按钮 */
.warning-sidebar-toggle-button {
  position: fixed;
  right: 2px; /* 初始时右边缘距离窗口右侧 2px */
  top: 102px;
  width: auto;
  min-width: 60px;
  padding: 8px 12px;
  height: 40px;
  background-color: #29333E;
  border-radius: 5px 0 0 5px;
  display: flex;
  align-items: center;
    justify-content: center;
  cursor: pointer;
  transition: right 0.3s ease;
  z-index: 200;
  gap: 5px;
}

.warning-sidebar-toggle-button.button-open {
  right: 300px; 
}

.warning-sidebar-toggle-button:hover {
  background-color: #3d4b5a;
  }

.warning-icon-button {
  color:  #f8c200;; /* 警告颜色 */
  font-size: 24px;
}

.warning-count-text {
    color: white;
  font-size: 16px;
    font-weight: bold;
}

/* 调整主内容区样式 */
.main-content {
  /* 默认无左右外边距 */
  flex: 1;
  overflow: hidden;
  transition: all 0.3s ease; /* 左右边距变化的平滑过渡 */
}

.main-content.content-expanded {
  margin-left: 0; /* 左侧边栏关闭时，左侧边距为0 */
}

.main-content.margin-right-active {
  margin-right: 300px; /* 修改为260px */
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
  
  .notice-button-container {
    position: relative;
    padding: 5px 0;
    cursor: pointer;
  }
  
  .notification-badge {
    position: absolute;
    top: -8px;
    right: -12px;
    background-color: #ff4d4f;
    color: white;
    border-radius: 50%;
    min-width: 18px;
    height: 18px;
    font-size: 12px;
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 0 2px;
    box-shadow: 0 0 0 2px rgba(255, 255, 255, 0.3);
    animation: pulse 1.5s infinite;
  }

/* 告警悬浮框样式 */
.alert-popup {
  position: fixed;
  right: 20px;
  background-color: #29333E;
  border: 1px solid #636161;
  border-radius: 8px;
  padding: 12px 20px;
  z-index: 1000;
  animation: slideIn 0.3s ease-out;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.alert-content {
  display: flex;
  align-items: center;
  gap: 10px;
}

.warning-icon {
  color: #E6A23C;
  font-size: 20px;
  margin-right: 0;
}

.alert-text {
  color: white;
  font-size: 14px;
}

.view-button {
  background: none;
  border: none;
  color: #4095E5;
  text-decoration: underline;
  cursor: pointer;
  padding: 0;
  font-size: 14px;
}

.view-button:hover {
  color: #1473d7;
}

@keyframes slideIn {
  from {
    transform: translateX(100%);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
}

.notice-button-container {
  position: relative;
  padding: 5px 0;
  cursor: pointer;
}

.notification-badge {
  position: absolute;
  top: -8px;
  right: -12px;
  background-color: #ff4d4f;
  color: white;
  border-radius: 50%;
  min-width: 18px;
  height: 18px;
  font-size: 12px;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 0 2px;
  box-shadow: 0 0 0 2px rgba(255, 255, 255, 0.3);
  animation: pulse 1.5s infinite;
}
</style>