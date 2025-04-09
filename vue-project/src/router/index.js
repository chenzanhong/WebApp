import { createRouter, createWebHistory } from "vue-router";
import Welcome from "@/views/Welcome.vue";
import Login from "@/views/Login.vue";
import Register from "@/views/Register.vue";
import Home from "@/views/Home.vue";
import ServerDetail from "@/views/ServerDetail.vue";
import SystemAdmin from "@/views/SystemAdmin.vue";
import CompanyAdmin from "@/views/CompanyAdmin.vue";
import Setting from "@/views/Setting.vue";
import Notice from "@/views/Notice.vue";
import Help from "@/views/Help.vue";
import TeamBusiness from "@/views/TeamBusiness.vue";

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
        path: 'pageone', // 相对路径，无需重复父级路径
        name: 'pageone',
        component: () => import('@/views/PageOne.vue'),
        props: true
      },
    ]
  },
  {
    path: "/display/teambusiness",
    name: "TeamBusiness",
    component: TeamBusiness,
  },

  // 设置界面
  {
    path: "/setting",
    name: "Setting",
    component: Setting,
  },

  // 通知界面
  {
    path: "/notice",
    name: "Notice",
    component: Notice,
  },

  // 帮助界面
  {
    path: "/help",
    name: "Help",
    component: Help,
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
    