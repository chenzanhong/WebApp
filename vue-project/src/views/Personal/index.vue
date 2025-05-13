<template>
  <el-container class="dark-container">
    <!-- 顶部导航栏 -->
    <el-header class="main-header">
      <div class="header-left">
        <div class="logo" style="display: flex; flex-direction: row; align-items: center;">
          <img src="@/assets/display/icons/stLine-server-l.png" width="54" style="vertical-align: middle;" alt=""
               srcset="">
          <p class="logo-name" style="color: white; font-size: 20px;">SeverM</p>
        </div>
        <div style="margin-left: 10rem">
          <el-button link class="nav-btn">主页面</el-button>
          <el-button link class="nav-btn">通知</el-button>
          <el-button link class="nav-btn">团队业务</el-button>
        </div>
      </div>
      <div class="header-right">
        <el-button link class="action-btn">
          <el-icon>
            <Setting/>
          </el-icon>
        </el-button>
        <el-button link class="action-btn">
          <el-icon>
            <QuestionFilled/>
          </el-icon>
        </el-button>
        <!--        <el-divider direction="vertical"/>-->
        <!--        <el-button type="danger" @click="handleLogout">退出登录</el-button>-->
      </div>
    </el-header>

    <el-container>
      <!-- 左侧导航 -->
      <el-aside width="240px" class="dark-sidebar">
        <p style="font-size: 20px; text-align: start; margin-left: 1rem; margin-top: 1rem; color: white">设置</p>
        <div style="display: flex; flex-direction: row; justify-content: start; margin-left: 1rem">
          <input style="width: 60%; height: 2rem; margin-left: 0;"/>
        </div>
        <el-menu
            class="nav-menu"
            :default-active="activeMenu"
            background-color="#404148"
            text-color="#ffffff"
            active-text-color="#ffffff"
            router
        >
          <el-menu-item style="" index="1">
            <template #title>
              <el-icon>
                <User/>
              </el-icon>
              <span>个人信息</span>
            </template>
          </el-menu-item>
          <el-menu-item index="2">
            <el-icon>
              <Setting/>
            </el-icon>
            <span>设置1</span>
          </el-menu-item>
          <el-menu-item index="3">
            <el-icon>
              <Tools/>
            </el-icon>
            <span>设置2</span>
          </el-menu-item>
        </el-menu>
      </el-aside>

      <!-- 右侧内容 -->
      <el-main class="content-main">
        <div class="content-card">
          <!-- 修改详细信息绑定 -->
          <el-row :gutter="40" class="detail-section">
            <el-col :span="2">
              <el-avatar :src="avatarImg" :size="80"/>
            </el-col>
            <el-col :span="22">
              <div class="info-item">
                <p class="info-value" style="font-size: 20px;">{{ user.name }}</p>
              </div>
              <div class="info-item">
                <label>邮箱</label>
                <p class="info-value">{{ user.email || '未绑定' }}</p>
              </div>
              <div class="info-item">
                <label>密码</label>
                <p class="info-value">{{ !user.password ? '******' : '未设置' }} <img :src="password_eye" alt="" srcset="" style="width: 12px; margin-left: 10px; margin-top: -20px;"></p>
              </div>
              <div class="info-item">
                <label>所属公司</label>
                <p class="info-value">{{ user.company_id === 0 ? '深圳大学计算机与软件学院' : '未绑定' }}</p>
              </div>
              <div class="info-item">
                <label>所属公司管理员</label>
                <p class="info-value">{{ user.name }}</p>
              </div>
            </el-col>

            <el-col :span="24" style="border-top: 1px solid #ffffff">
              <button style="width: 60vw; margin-top: 20px; background-color: transparent">退出登录</button>
            </el-col>
          </el-row>
        </div>
      </el-main>
    </el-container>
  </el-container>
</template>

<script setup>
import {onMounted, ref} from 'vue'
import {
  User,
  Setting,
  Tools,
  QuestionFilled
} from '@element-plus/icons-vue'
import {getUserInfo} from "@/api/server.js";
const avatarImg = new URL('@/assets/display/avatar.png', import.meta.url).href
const password_eye = new URL('@/assets/display/password_eye.png', import.meta.url).href

const activeMenu = ref('1')

const handleLogout = () => {
  console.log('执行退出登录操作')
}

const user = ref({})

onMounted(() => {
  getUserInfo().then(r => {
    console.log(r)
    user.value = r.user
  })
})
</script>

<style lang="scss">
.dark-container {
  height: 100vh;
  background: #000000;

  .main-header {
    height: 64px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 24px;
    background: #001529;
    border-bottom: 1px solid #1f2d3d;

    .header-left {
      display: flex;
      align-items: center;
      gap: 32px;

      .system-title {
        color: #fff;
        font-size: 20px;
        font-weight: 500;
      }

      .nav-btn {
        color: #a8abb2;
        font-size: 20px;

        &:hover {
          color: #fff;
        }
      }
    }

    .header-right {
      display: flex;
      align-items: center;
      gap: 16px;

      .action-btn {
        color: #a8abb2;

        &:hover {
          color: #fff;
        }
      }

      .el-divider {
        background-color: #1f2d3d;
        height: 1.2em;
      }
    }
  }

  .dark-sidebar {
    background: #1f2931;
    border-right: 1px solid #1f2d3d;
    height: 90vh;

    .nav-menu {
      border-right: none;
      padding-top: 20px;
      background-color: #1f2931;

      .el-menu-item.is-active {
        color: #409EFF !important; /* 设置选中颜色 */
        background-color: #1f2931 !important; /* 设置选中背景颜色 */
      }

      .el-menu-item:hover {
        background-color: #404148;
      }

      .el-menu-item {
        height: 50px;
        margin: 4px 0;
        font-size: 14px;
      }
    }
  }

  .content-main {
    background: #0f1a2d;
    padding: 24px;

    .content-card {
      background: #1f2931;
      border-radius: 8px;
      padding: 32px;
    }

    .page-title {
      color: #fff;
      margin-bottom: 32px;
      font-weight: 500;
    }

    .avatar-section {
      display: flex;
      align-items: center;
      gap: 24px;
      margin-bottom: 40px;

      .user-name {
        color: #fff;
        margin: 0 0 8px;
      }

      .company-info {
        color: #5d6678;
        margin: 0;
      }
    }

    .detail-section {
      .info-item {
        margin-bottom: 24px;
        display: flex;
        flex-direction: row;
        align-items: center;
        gap: 24px;

        label {
          display: block;
          color: #5d6678;
          margin-bottom: 0;
          font-size: 14px;
        }

        .info-value {
          color: #fff;
          margin: 0;
          font-size: 16px;
        }
      }
    }
  }
}

.logo-name {
  font-family: 'PangMenZhengDao', sans-serif;
}
</style>