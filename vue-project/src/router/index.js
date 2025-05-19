import { createRouter, createWebHistory } from "vue-router";
import Welcome from "@/views/Welcome.vue";
import Login from "@/views/Login.vue";
import Register from "@/views/Register.vue";
import ResetPassword from "@/views/ResetPassword.vue";
import Home from "@/views/ServerDisplay/index.vue";
import ServerDetail from "@/views/ServerDetail.vue";
import InfoNotification from "@/views/InfoNotification.vue";
import SystemAdmin from "@/views/SystemAdmin.vue";
import CompanyAdmin from "@/views/CompanyAdmin.vue";
import Setting from "@/views/Setting.vue";
import Notice from "@/views/Notice.vue";
import Help from "@/views/Help.vue";
import TeamBusiness from "@/views/TeamBusiness/TeamBusiness.vue";
import ApplyToTeam from "@/views/TeamBusiness/ApplyToTeam.vue";
import InviteMember from "@/views/TeamBusiness/InviteMember.vue";
import ChangeMonitor from "@/views/TeamBusiness/ChangeMonitor.vue";
import Headbar from "@/views/headbar.vue";

const routes = [
  // 欢迎页（设为默认路由）
  {
    path: "/",
    name: "Welcome",
    component: Welcome,
  },

  // 登录页
  {
    path: "/login",
    name: "Login",
    component: Login,
  },

  // 注册页
  {
    path: "/register",
    name: "Register",
    component: Register,
  },

  //重置密码页
  {
    path:"/resetpassword",
    name:"ResetPassword",
    component:ResetPassword,

  },
  // 系统管理员界面
  {
    path: "/systemadmin",
    name: "SystemAdmin",
    component: SystemAdmin,
  },

  // 公司管理员界面
  {
    path: "/companyadmin",
    name: "CompanyAdmin",
    component: CompanyAdmin,
  },

  // 主界面
  {
    path: "/home",
    name: "Home",
    component: () => import('@/views/ServerDisplay/index.vue'),
  },
  // {
  //   path: "/display/server",
  //   name: "Server",
  //   component: () => import('@/views/ServerDisplay/index.vue'),
  // },
  // 服务器详情页（动态路由）
  {
    path: "/monitor/:hostname",
    name: "MonitorDetail",
    component: ServerDetail,
    props: true,
    children: [
      {
        path: '',
        name: 'DetailPage',
        component: () => import('@/views/DetailPage.vue'),
        props: true
      },
    ]
  },
  {
    path: "/display/teambusiness",
    name: "TeamBusiness1",
    component: TeamBusiness,
  },
  // 设置界面
  {
    path: "/setting",
    name: "Set",
    component: Setting,
  },
  // 通知界面
  {
    path: "/info",
    name: "Info",
    component: InfoNotification,
  },
  // 帮助界面
  {
    path: "/help",
    name: "Help",
    component: Help,
  },


  // layout
  {
    path: "/headbar",
    component: Headbar,
    redirect: { path: "/headbar/home" },
    children: [
      // 默认路由
      {
        path: "",
        component: Home // 直接渲染Home组件
      },
      // 主界面
      {
        path: "home",
        name: "Home",
        component: Home,
      },
      {
        path: "display/server",
        name: "Server",
        component: () => import('@/views/ServerDisplay/index.vue'),
      },
      // 服务器详情页（动态路由）
      {
        path: "monitor/:hostname",
        name: "MonitorDetail",
        component: ServerDetail,
        props: true,
        children: [
          {
            path: '', // 默认子路由，直接显示 DetailPage
            name: 'DetailPage',
            component: () => import('@/views/DetailPage.vue'),
            props: true
          },
        ]
      },
      {
        path: "display/teambusiness",
        name: "TeamBusiness",
        component: () => import('@/views/TeamBusiness/TeamBusiness.vue'),
        redirect: '/headbar/display/teambusiness/applytoteam', // 设置默认重定向到 applytoteam
        children: [
          {
            path: 'applytoteam', // 
            name: 'ApplyToTeam',//申请公司组件
            component: () => import('@/views/TeamBusiness/ApplyToTeam.vue'),
          },
          {
            path: 'invitemember',
            name: 'InviteMember',//邀请成员组件
            component: () => import('@/views/TeamBusiness/InviteMember.vue'),
          },
          {
            path: 'changemonitor',
            name: 'ChangeMonitor',//更换管理员组件
            component: () => import('@/views/TeamBusiness/ChangeMonitor.vue'),
          },
        ]
      },
      // 设置界面
      {
        path: "setting",
        name: "Setting",
        component: Setting,
      },
      // 通知界面
      {
        path: "notice",
        name: "Notice",
        component: InfoNotification,
      },
      // 帮助界面
      {
        path: "help",
        name: "Help",
        component: Help,
      },
    ]
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;