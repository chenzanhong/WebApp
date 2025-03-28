<template>
    <div class="server-detail">
      <h3>{{ selectedServer.name }}</h3>
      <p>操作系统: {{ selectedServer.os }}</p>
      <p>IP: {{ selectedServer.ip }}</p>
      <p>运行时长: {{ selectedServer.runtime }}</p>
    </div>
  </template>
  
  <script setup>
  import { defineProps } from 'vue';
  
  const props = defineProps({
    selectedServer: {
      type: Object,
      required: true,
    },
  });
  </script>
  
  <style scoped>
  .server-detail {
    margin-top: 20px;
    background-color: #282c34;
    border-radius: 8px;
    padding: 20px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  }
  </style>