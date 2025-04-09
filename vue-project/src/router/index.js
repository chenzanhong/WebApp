import { createRouter, createWebHistory } from "vue-router";
import Welcome from "@/views/Welcome.vue";
import Login from "@/views/Login.vue";
import Register from "@/views/Register.vue";
import Home from "@/views/ServerDisplay/index.vue";
import ServerDetail from "@/views/ServerDetail.vue";
import InfoNotification from "@/views/InfoNotification.vue";
//import Profile from "@/views/Profile.vue";


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

  // 主界面
  {
    path: "/home",
    name: "Home",
    component: Home,
  },
  {
    path: "/display/server",
    name: "Server",
    component: () => import('@/views/ServerDisplay/index.vue'),
  },
  // 服务器详情页（动态路由）
  {
    path: "/monitor/:host_name",
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
    path: "/display/TeamBusiness",
    name: "TeamBusiness",
    component: () => import('@/views/TeamBusiness.vue'),
  },

  // // 个人信息页
  // {
  //   path: "/profile",
  //   name: "Profile",
  //   component: Profile,
  // },
// 信息通知页
  {
    path: "/info",
    name: "InfoNotification",
    component: InfoNotification
  }
  
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;