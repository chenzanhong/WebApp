<template>
    <div class="search-bar">
      <el-input
        placeholder="请输入内容"
        :value="search"
        @input="updateSearch"
        clearable
      >
        <template #append>
          <el-button icon="el-icon-search"></el-button>
        </template>
      </el-input>
    </div>
  </template>
  
  <script setup>
  import {  defineEmits } from 'vue';
  
  const props = defineProps({
    search: {
      type: String,
      required: true,
    },
  });
  
  const emit = defineEmits(['update:search']);
  
  const updateSearch = (value) => {
    emit('update:search', value);
  };
  </script>
  
  <style scoped>
  .search-bar {
    width: 500px;
  }
  </style>