<template>
    <div class="server-list">
      <div class="server-card" style="background-color: #343a40; cursor: pointer;" @click="addServer">
        <i class="el-icon-plus" style="font-size: 50px; color: #fff;"></i>
      </div>
      <div v-for="server in servers" :key="server.id">
        <ServerCard :server="server" @select="handleSelect" />
      </div>
    </div>
  </template>
  
  <script setup>
  import {  defineEmits } from 'vue';
  import ServerCard from './ServerCard.vue';
  
  const props = defineProps({
    servers: {
      type: Array,
      required: true,
    },
  });
  
  const emit = defineEmits(['select']);
  
  const handleSelect = (server) => {
    emit('select', server);
  };
  
  const addServer = () => {
    console.log('Add Server');
  };
  </script>
  
  <style scoped>
  .server-list {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
    gap: 20px;
  }
  </style>