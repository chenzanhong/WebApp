<template>
  <div class="container">
    <!-- 左侧侧边栏 -->
    <div class="left-sidebar">
      <h2 class="sidebar-title">信息通知</h2>
      <ul class="sidebar-menu">
        <li 
          v-for="item in filterCategories" 
          :key="item.type"
          :class="{ active: selectedCategory === item.type }"
          @click="selectedCategory = item.type"
        >
          {{ item.label }}
        </li>
      </ul>
    </div>

   <!-- 主要内容 -->
   <div class="main-content">
      <InfoList 
        :selectedCategory="selectedCategory"
        :selectedStatus="selectedStatus"
        @update-status="selectedStatus = $event"
      />
    </div>
  </div>
</template>

<script>
import InfoList from './InfoList.vue';
import { Search, Plus, HomeFilled, Setting, ChatDotRound, QuestionFilled, Briefcase } from '@element-plus/icons-vue';

export default {
  components: { 
    InfoList,
    HomeFilled,
    Setting,
    ChatDotRound,
    QuestionFilled,
    Search,
    Plus,
    Briefcase
  },
  data() {
    return {
      selectedCategory: 'all',
      selectedStatus: 'all',
      filterCategories: [
        { type: 'all', label: '全部通知' },
        { type: 'sent', label: '发送信息通知' },
        { type: 'received', label: '接收信息通知' }
      ]
    }
  },
  methods: {
    navigateTo(path) {
      this.$router.push(path);
    },
   
  }
}
</script>

<style scoped>
/* 保持与主界面一致的布局 */
.container {
  font-size: 17px; /* 全局基础字号 */
  display: flex;
  height: 100vh;
  background-color: #000000;
  margin: 0;
  padding: 0;
}

.sidebar-menu li {
  font-size: 16px;
  padding: 14px 10px;
  margin: 8px 0;
  border-left: 4px solid transparent;
  transition: all 0.3s ease;
}

.sidebar-menu li.active {
  border-left-color: #4299e1;
  background-color: rgba(66, 153, 225, 0.1);
}
/* 左侧侧边栏样式 */
.left-sidebar {
  width: 240px;
  background-color: #1f2931;
  padding: 0;
  color: white;
  margin: 0;
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
  padding: 15px 10px;
  margin: 0 0 20px;
  border-bottom: 1px solid #374151;
  font-family: "Poppins", sans-serif;
  text-align: center;
}

.sidebar-menu {
  padding: 10px;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.sidebar-menu li {
  font-size: 16px;
  padding: 14px 10px;
  margin: 8px 0;
  border-left: 4px solid transparent;
  transition: all 0.3s ease;
  width: 80%;
  text-align: center;
}

.sidebar-menu li.active {
  border-left-color: #4299e1;
  background-color: rgba(66, 153, 225, 0.1);
}

.sidebar-menu li {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 12px 10px;
  margin: 6px 0;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s;
  font-family: "Poppins", sans-serif;
  width: 80%;
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
  margin: 0;
  border-radius: 0;
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