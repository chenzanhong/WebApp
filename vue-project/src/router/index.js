import { createRouter, createWebHistory } from "vue-router";
import Welcome from "@/views/Welcome.vue";
import Login from "@/views/Login.vue";
import Register from "@/views/Register.vue";
import Home from "@/views/Home.vue";
import ServerDetail from "@/views/ServerDetail.vue";
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
      {
        path: 'pagetwo',
        name: 'pagetwo',
        component: () => import('@/views/PageTwo.vue'),
        props: true
      },
    ]
  },

  // // 个人信息页
  // {
  //   path: "/profile",
  //   name: "Profile",
  //   component: Profile,
  // },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;