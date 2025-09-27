<template>
  <div class="setting-page">
    <h1 style="color: white;">设置页</h1>
    <button class="confirm" @click="handleServerClick">退出登录</button>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'; 
const count = ref(0)
const router = useRouter(); // 获取路由实例
const handleServerClick = () => {
      // 这里使用 router.push 方法进行路由跳转
      router.push('/login');
    };
</script>

<style scoped>

</style>