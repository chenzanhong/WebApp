<template>
  <div 
    class="warning-notification"
    :class="{ 'sidebar-open': drawerVisible && warningCount > 0 }"
  >
    <el-badge 
      :value="warningCount" 
      :hidden="warningCount === 0"
      type="warning"
      class="notification-badge"
    >
      <el-button 
        :icon="WarningFilled" 
        circle 
        :type="warningCount > 0 ? 'warning' : 'info'"
        :disabled="warningCount === 0"
        @click="toggleSidebar"
      />
    </el-badge>

    <el-drawer
      v-model="drawerVisible"
      title="警告详情"
      direction="rtl"
      size="30%"
      :before-close="handleClose"
      custom-class="warning-drawer-custom"
    >
      <div v-if="warnings.length > 0" class="warning-list">
        <div v-for="(warning, index) in warnings" :key="index" class="warning-item">
          <el-icon class="warning-icon"><WarningFilled /></el-icon>
          <div class="warning-content">
            <div class="warning-title">{{ warning.title }}</div>
            <div class="warning-message">{{ warning.message }}</div>
            <div class="warning-time">{{ warning.time }}</div>
          </div>
        </div>
      </div>
      <el-empty v-else description="暂无警告" />
    </el-drawer>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { WarningFilled } from '@element-plus/icons-vue';

const props = defineProps({
  // 模拟数据，实际使用时可以通过API获取
  initialWarnings: {
    type: Array,
    default: () => [
      {
        id: 1,
        title: 'CPU使用率过高',
        message: '服务器 192.168.1.1 的CPU使用率达到95%',
        time: '2025-06-07 10:30:22',
        level: 'high'
      },
      {
        id: 2,
        title: '内存不足',
        message: '服务器 192.168.1.2 的可用内存不足10%',
        time: '2025-06-07 11:15:45',
        level: 'medium'
      }
    ]
  }
});

const warnings = ref([...props.initialWarnings]);
const drawerVisible = ref(false);
const warningCount = computed(() => warnings.value.length);

// 切换侧边栏显示/隐藏
const toggleSidebar = () => {
  if (warningCount.value > 0) {
    drawerVisible.value = !drawerVisible.value;
  }
};

// 关闭侧边栏
const handleClose = (done) => {
  done();
};

// 模拟添加新警告（实际使用时可以通过WebSocket或轮询获取）
const addWarning = (warning) => {
  warnings.value.unshift({
    id: Date.now(),
    time: new Date().toLocaleString(),
    ...warning
  });};

// 模拟清除所有警告
const clearWarnings = () => {
  warnings.value = [];
};

// 暴露方法给父组件
defineExpose({
  addWarning,
  clearWarnings
});
</script>

<style scoped>
.warning-notification {
  position: fixed; /* Changed to fixed */
  top: 10%;       /* Adjust as needed, e.g., to align with header */
  right: 20px;      /* Initial position from the right edge */
  z-index: 2000;   /* Ensure it's above other content, including ElMessage */
  transition: right 0.3s ease-in-out; /* Smooth transition for movement */
}

.warning-notification.sidebar-open {
  /* Adjust right position when sidebar is open (30% width + initial 20px offset) */
  right: calc(30% + 20px);
}

.notification-badge {
  /* margin-right: 16px; */ /* Original margin, likely not needed with fixed positioning */
  /* Add any specific badge styling if needed, e.g., cursor */
}

.warning-list {
  padding: 0 16px;
}

.warning-item {
  display: flex;
  align-items: center; /* Align icon and text vertically */
  padding: 12px 0;
  border-bottom: 1px solid #4A5568; /* Darker border for dark theme */
}

.warning-icon {
  font-size: 24px;
  color: #e6a23c; /* Keep warning color */
  margin-right: 12px;
}

.warning-content {
  flex: 1;
}

.warning-title {
  font-weight: bold;
  color:rgb(6, 6, 6); /* Light text for dark theme */
  margin-bottom: 4px;
}

.warning-message {
  color: #A0AEC0; /* Lighter gray for message on dark theme */
  font-size: 14px;
  margin-bottom: 4px;
}

.warning-time {
  color: #718096; /* Medium gray for time on dark theme */
  font-size: 12px;
}

/* Dark theme for el-drawer */
:deep(.el-drawer.warning-drawer-custom) {
  background-color: #2D3748 !important; /* Main background for the drawer root */
}

/* If el-drawer contains an el-dialog, style it too as it might be the actual visual container */
:deep(.el-drawer.warning-drawer-custom .el-dialog) {
  background-color: #2D3748 !important; /* Background for nested el-dialog */
}

:deep(.el-drawer.warning-drawer-custom .el-drawer__header) {
  background-color: #2D3748 !important; /* Explicit background for header */
  color: #E2E8F0 !important; /* Light header text */
  border-bottom: 1px solid #4A5568 !important; /* Darker border */
  margin-bottom: 0 !important; /* Override default margin */
  padding: 16px 20px !important; /* Consistent padding */
}

:deep(.el-drawer.warning-drawer-custom .el-drawer__title) {
  color: #E2E8F0 !important;
}

:deep(.el-drawer.warning-drawer-custom .el-drawer__close) {
  color: #E2E8F0 !important;
}
:deep(.el-drawer.warning-drawer-custom .el-drawer__close:hover) {
  color: #63b3ed !important; /* A light blue for hover, adjust to your theme's primary */
}

:deep(.el-drawer.warning-drawer-custom .el-drawer__body) {
  background-color: #2D3748 !important; /* Explicit background for body */
  padding: 20px;
  color: #E2E8F0; /* Default text color for drawer body */
}

/* Styling for el-empty component within the dark drawer */
:deep(.el-drawer.warning-drawer-custom .el-empty__description) {
  color: #A0AEC0 !important; /* Lighter gray for empty state description */
}

:deep(.el-drawer.warning-drawer-custom .el-empty__image svg) {
  /* Attempt to make the default empty SVG look better on a dark background */
  /* This might need adjustment based on the specific SVG */
  filter: brightness(1.5) grayscale(30%);
}
</style>
