<template>
    <div class="container">
      <!-- 左侧侧边栏 -->
      <div class="left-sidebar">
        <!-- 添加 logo -->
        <div class="logo">
          <img src="@/assets/display/icons/stLine-server-l.png" width="30" height="30"  style="vertical-align: middle;" alt="" srcset="">
          <p>SeverM</p>
        </div>
        <h2 class="sidebar-title">信息通知</h2>
        <ul class="sidebar-menu">
          <li 
            v-for="item in menuItems" 
            :key="item.type"
            :class="{ active: selectedInfo === item.type }"
            @click="selectedInfo = item.type"
          >
            <span class="icon">{{ item.icon }}</span>
            {{ item.label }}
          </li>
        </ul>
      </div>
  
      <!-- 主要内容 -->
      <div class="main-content">
        <InfoList :selectedInfo="selectedInfo" />
      </div>
  
      <!-- 右侧系统栏（与主界面统一） -->
      <div class="toolbar">
        <div class="tool-item" :class="{ active: $route.path === '/home' }" @click="navigateTo('/home')">
          <el-icon size="32">
            <HomeFilled />
          </el-icon>
        </div>
        <div class="tool-item" :class="{ active: $route.path === '/settings' }" @click="navigateTo('/settings')">
          <el-icon size="32">
            <Setting />
          </el-icon>
        </div>
        <div class="tool-item" :class="{ active: $route.path === '/info' }" @click="navigateTo('/info')">
          <el-icon size="32">
            <ChatDotRound />
          </el-icon>
        </div>
        <div class="tool-item" @click="navigateTo('/help')">
          <el-icon size="32">
            <QuestionFilled />
          </el-icon>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  import InfoList from './InfoList.vue';
  import { HomeFilled, Setting, ChatDotRound, QuestionFilled } from '@element-plus/icons-vue';
  
  export default {
    components: { 
      InfoList,
      HomeFilled,
      Setting,
      ChatDotRound,
      QuestionFilled
    },
    data() {
      return {
        selectedInfo: 'all',
        menuItems: [
          { type: 'all', label: '全部信息' },
          { type: 'processedApply', label: '已处理申请' },
          { type: 'unprocessedApply', label: '未处理申请' },
          { type: 'processedReview', label: '已处理审核'},
          { type: 'unprocessedReview', label: '未处理审核'}
        ]
      }
    },
    methods: {
      navigateTo(path) {
        this.$router.push(path);
      }
    }
  }
  </script>
  
  <style scoped>
  /* 保持与主界面一致的布局 */
  .container {
    display: flex;
    height: 100vh;
    background-color: #000000;
  }
  
  /* 左侧侧边栏样式 */
  .left-sidebar {
    width: 240px;
    background-color: #1f2931;
    padding: 20px;
    color: white;
  }
  
  /* 添加 logo 样式 */
  .logo {
    display: flex;
    align-items: center;
    margin-bottom: 20px;
    font-family: "Poppins", sans-serif;
  }
  .logo p {
    margin-left: 10px;
    font-size: 20px;
    margin-top: 0.2rem;
    font-weight: bold;
  }
  
  .sidebar-title {
    padding: 15px;
    margin: 0 0 20px;
    border-bottom: 1px solid #374151;
    font-family: "Poppins", sans-serif;
  }
  
  .sidebar-menu li {
    display: flex;
    align-items: center;
    padding: 12px 15px;
    margin: 6px 0;
    border-radius: 6px;
    cursor: pointer;
    transition: all 0.2s;
    font-family: "Poppins", sans-serif;
  }
  
  .sidebar-menu li:hover {
    background-color: #374151;
  }
  
  .sidebar-menu li.active {
    background-color: #4299e1;
  }
  
  .icon {
    margin-right: 12px;
    font-size: 18px;
  }
  
  /* 主要内容区域 */
  .main-content {
    flex: 1;
    padding: 20px;
    background-color: rgba(31, 41, 49, 0.7);
    margin: 20px;
    border-radius: 1rem;
  }
  
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