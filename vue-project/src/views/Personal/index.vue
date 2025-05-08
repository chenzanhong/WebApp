<template>
  <el-container class="dark-container">
    <!-- 左侧导航 -->
    <el-aside width="200px" class="dark-sidebar">
      <div class="system-title">
        <span>SeverM</span>
      </div>
      <el-menu
          class="nav-menu"
          :default-active="activeMenu"
          background-color="#001529"
          text-color="#a8abb2"
          active-text-color="#409EFF"
      >
        <el-menu-item index="1">
          <el-icon><User /></el-icon>
          <span>个人信息</span>
        </el-menu-item>
        <el-menu-item index="2">
          <el-icon><Setting /></el-icon>
          <span>设置1</span>
        </el-menu-item>
        <el-menu-item index="3">
          <el-icon><Tools /></el-icon>
          <span>设置2</span>
        </el-menu-item>
      </el-menu>
    </el-aside>

    <!-- 右侧内容 -->
    <el-main class="content-main">
      <div class="header-area">
        <h2>个人信息设置</h2>
        <div class="header-actions">
          <el-button type="text" @click="handleEdit">
            <el-icon><Edit /></el-icon>
            <span>编辑</span>
          </el-button>
          <el-button type="danger" @click="handleLogout">退出登录</el-button>
        </div>
      </div>

      <el-form class="info-form" label-position="left" label-width="140px">
        <el-form-item label="用户名">
          <span class="info-text">张三</span>
        </el-form-item>
        <el-form-item label="邮箱">
          <span class="info-text">123456@qq.com</span>
        </el-form-item>
        <el-form-item label="密码">
          <span class="info-text">********</span>
        </el-form-item>
        <el-form-item label="所属公司">
          <span class="info-text">深圳大学计算机与软件学院</span>
        </el-form-item>
        <el-form-item label="公司管理员">
          <span class="info-text">张三</span>
        </el-form-item>
      </el-form>
    </el-main>
  </el-container>
</template>

<script setup>
import { ref } from 'vue'
import {
  User,
  Setting,
  Tools,
  Edit
} from '@element-plus/icons-vue'

const activeMenu = ref('1')

const handleEdit = () => {
  console.log('进入编辑模式')
}

const handleLogout = () => {
  console.log('执行退出登录操作')
}
</script>

<style lang="scss" scoped>
.dark-container {
  height: 100vh;
  background: #0a1625;

  .dark-sidebar {
    background: #001529;
    border-right: 1px solid #001a33;

    .system-title {
      height: 60px;
      display: flex;
      align-items: center;
      padding-left: 20px;
      color: #fff;
      font-size: 18px;
      border-bottom: 1px solid #001a33;
    }

    .nav-menu {
      border-right: none;
      padding-top: 20px;

      .el-menu-item {
        height: 50px;
        margin: 4px 0;
      }
    }
  }

  .content-main {
    background: #0f1a2d;
    color: #c0c4cc;
    padding: 24px;

    .header-area {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding-bottom: 20px;
      border-bottom: 1px solid #1f2d3d;

      h2 {
        color: #fff;
        margin: 0;
        font-weight: 500;
      }

      .header-actions {
        .el-button {
          margin-left: 15px;
        }

        .el-icon {
          margin-right: 5px;
        }
      }
    }

    .info-form {
      margin-top: 30px;
      width: 680px;

      :deep(.el-form-item__label) {
        color: #8a8e99;
        font-weight: 400;
      }

      .info-text {
        color: #c0c4cc;
        font-size: 14px;
      }
    }
  }
}
</style>