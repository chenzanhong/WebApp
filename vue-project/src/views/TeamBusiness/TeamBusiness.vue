<template>
  <div class="register-container">
    <!-- 左侧导航栏 -->
    <div class="left-nav">
      <h2>团队业务</h2>
      <router-link
    to="/headbar/display/teambusiness/applytoteam"
    class="nav-item"
    active-class="active"
  >申请团队</router-link >
  <router-link
    to="/headbar/display/teambusiness/invitemember"
    class="nav-item"
    active-class="active"
  >邀请成员</router-link>
  <router-link
    to="/headbar/display/teambusiness/changemonitor"
    class="nav-item"
    active-class="active"
  >更换管理员</router-link>
    </div>

    <!-- 主体内容区域 -->
     <router-view />
  </div>
</template>

<script setup>
// import ApplyToTeam from "@/views/TeamBusiness/ApplyToTeam.vue";
// import InviteMember from "@/views/TeamBusiness/InviteMember.vue";
// import ChangeMonitor from "@/views/TeamBusiness/ChangeMonitor.vue";
// import { ref, reactive } from 'vue'
// //import { Plus } from '@element-plus/icons-vue'
// import { ElMessage } from 'element-plus'
// import { HomeFilled, Setting, ChatDotRound, QuestionFilled,Plus } from '@element-plus/icons-vue';
// import src from '@/assets/image.png'; // 使用 import 引入

</script>

<style scoped>
h2{
  color: #ffffff;
  font-size: 20px;
  margin-top: 1%;
  margin-bottom: 20px; /* 添加底部间距 */
}
/* ::v-deep是vue3提供的深度选择器，.el-form-item__label是element-plus官方定义的类 */
/* 更新深度选择器的写法 */
:deep(.el-form-item__label) {
  color: white;
  font-size: 14px;
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

.register-container {
  background: black;
  min-height: 100vh;
  display: flex;
  padding: 0;
  margin: 0;
}

.left-nav {
  width: 240px;
  background: rgba(94, 118, 144, 0.34);
  padding: 20px;
  border-radius: 4px;
  margin-right: 20px;
  color: #ffffff !important;
  font-size: 14px;
  text-align: left;
}

.nav-item {
  display: block; /* 确保链接为块级元素 */
  padding: 12px;
  cursor: pointer;
  border-radius: 4px;
  margin-bottom: 8px;
  color: #ffffff; /* 设置默认文字颜色为白色 */
  text-decoration: none; /* 移除下划线 */
  transition: background-color 0.3s, color 0.3s; /* 添加过渡效果 */
}

.nav-item.active {
  background: rgba(187, 187, 187, 0.61);    
  color: #ffffff !important; /* 确保激活状态文字为白色 */ 
}

.main-content {
  flex: 1;
  display: flex;
  background: rgba(94, 118, 144, 0.34);
  border-radius: 4px;
  padding: 30px;
  margin: 20px 20px 0px 0;
}

.form-section {
  flex: 2;
  padding-right: 30px;
}

.notice-section {
  flex: 1;
  border-left: 1px solid #ebeef5;
  padding-left: 30px;
}

.form-tips {
  color: #999;
  font-size: 12px;
  line-height: 1.5;
  margin-top: 8px;
}

.upload-tips {
  font-size: 12px;
  color: #666;
  margin-top: 8px;
}

.id-upload {
  display: flex;
  gap: 20px;
}

.id-card-upload {
  width: 150px;
}

.submit-btn {
  width: 20%;
  margin-top: 30px;
}

.demo-image__placeholder {
  padding: 30px 0;
  text-align: center;
  /* border-right: solid 1px var(--el-border-color); */
  display: inline-block;
  width: 49%;
  box-sizing: border-box;
  vertical-align: top;
}
.demo-image__placeholder .demonstration {
  display: block;
  color: var(--el-text-color-secondary);
  font-size: 14px;
  margin-bottom: 20px;
}
.demo-image__placeholder .el-image {
  padding: 0 5px;
  max-width: 300px;
  max-height: 200px;
}

.demo-image__placeholder.image-slot {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
  background: var(--el-fill-color-light);
  color: var(--el-text-color-secondary);
  font-size: 14px;
}
.demo-image__placeholder .dot {
  animation: dot 2s infinite steps(3, start);
  overflow: hidden;
}
.form-section {
  transition: opacity 0.3s ease;
}

/* 导航项悬停效果 */
.nav-item:hover {
  background: #ecf5ff;
  color: #409eff;
}
</style>