<template>
  <div class="ip-search-container">
    <el-autocomplete
      v-model="inputValue"
      :fetch-suggestions="querySearch"
      :trigger-on-focus="true"
      :placeholder="placeholder"
      class="ip-search-input"
      @select="handleSelect"
      @input="handleInput"
      clearable
    >
      <template #suffix>
        <el-icon v-if="loading" class="loading-icon"><Loading /></el-icon>
      </template>
      <template #default="{ item }">
        <div class="suggestion-item">
          <div class="ip-address">{{ item.value }}</div>
          <div class="ip-description" v-if="item.description">{{ item.description }}</div>
        </div>
      </template>
    </el-autocomplete>
  </div>
</template>

<script setup>
import { ref, onMounted, defineProps, defineEmits, watch } from 'vue';
import { Loading } from '@element-plus/icons-vue';
import { ElMessage } from 'element-plus';

const props = defineProps({
  modelValue: {
    type: String,
    default: ''
  },
  placeholder: {
    type: String,
    default: '请输入服务器IP'
  }
});

const emit = defineEmits(['update:modelValue', 'select']);

// 本地状态
const inputValue = ref(props.modelValue);
const loading = ref(false);
const ipHistory = ref([]);

// 监听外部传入的值变化
watch(() => props.modelValue, (newValue) => {
  inputValue.value = newValue;
});

// 监听内部值变化，向外发射更新事件
watch(inputValue, (newValue) => {
  emit('update:modelValue', newValue);
});

// 从后端获取服务器列表
const loadIpHistory = async () => {
  try {
    const token = localStorage.getItem('token');
    if (!token) {
      return getDefaultIpList();
    }
    
    const response = await fetch('http://113.44.170.52:8080/agent/list', {
      method: 'GET',
      headers: {
        'Authorization': token,
        'Accept': 'application/json',
        //'ngrok-skip-browser-warning': 'true'
      }
    });
    
    // 检查响应是否成功
    if (!response.ok) {
      return getDefaultIpList();
    }
    
    // 获取响应数据
    let data;
    try {
      const text = await response.text();
      data = JSON.parse(text);
      //console.log(data);
    } catch (error) {
      console.error('解析响应失败:', error);
      
      // 若处理失败使用静态数据
      data = {
        hosts: [
          {
            id: 1,
            host_name: "root1",
            ip: "127.0.0.1",
            platform: "Ubuntu 20.04"
          },
          {
            id: 2,
            host_name: "root2",
            ip: "127.0.0.2",
            platform: "CentOS Stream 9"
          },
          {
            id: 3,
            host_name: "root3",
            ip: "127.0.0.3",
            platform: "CentOS 6"
          }
        ]
      };
    }
    
    // 处理数据
    let serverList = [];
    
    // 优先使用hosts数组
    if (data && data.hosts && Array.isArray(data.hosts)) {
      serverList = data.hosts;
    } else if (Array.isArray(data)) {
      serverList = data;
    } else if (data && data.ip) {
      serverList = [data];
    }
    
    // 生成IP列表
    const ipList = [];
    for (const server of serverList) {
      if (server && server.ip) {
        ipList.push({
          value: server.ip,
          description: server.platform ? `${server.platform}` : server.ip
        });
      }
    }
      
    if (ipList.length > 0) {
      return ipList;
    }
    
    // 如果没有有效数据，返回默认列表
    return getDefaultIpList();
  } catch (error) {
    console.error('获取服务器列表异常:', error);
    return getDefaultIpList();
  } finally {
    console.log('完成服务器列表获取请求');
  }
};

// 获取默认IP列表
const getDefaultIpList = () => {
  return [
    { value: '172.31.0.1', description: '生产服务器' },
    { value: '192.168.1.100', description: '测试服务器' },
    { value: '10.0.0.1', description: '开发服务器' },
    { value: '172.31.0.2', description: '备用服务器' }
  ];
};

// 模糊搜索函数
const querySearch = (queryString, callback) => {
  const results = queryString
    ? ipHistory.value.filter(ip => {
        return ip.value.toLowerCase().indexOf(queryString.toLowerCase()) === 0;
      })
    : ipHistory.value;
  
  callback(results);
};

// 选择建议项
const handleSelect = (item) => {
  inputValue.value = item.value;
  emit('select', item.value);
};

// 输入变化
const handleInput = (value) => {
  emit('update:modelValue', value);
};

// 组件挂载时加载服务器列表
onMounted(async () => {
  loading.value = true;
  ipHistory.value = await loadIpHistory();
  loading.value = false;
});
</script>

<style scoped>
.ip-search-container {
  width: 100%;
}

.ip-search-input {
  width: 100%;
}

.suggestion-item {
  padding: 5px 0;
}

.ip-address {
  font-weight: bold;
}

.ip-description {
  font-size: 12px;
  color: #999;
  margin-top: 2px;
}

.loading-icon {
  animation: rotating 2s linear infinite;
}

@keyframes rotating {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

:deep(.el-input__wrapper) {
  background-color: #4F4F4F;
  box-shadow: 0 0 0 1px #636161 inset;
}

:deep(.el-input__inner) {
  color: white;
}

:deep(.el-input__inner::placeholder) {
  color: #999;
}

:deep(.el-autocomplete-suggestion) {
  background-color: #333;
  border: 1px solid #555;
}

:deep(.el-autocomplete-suggestion__list) {
  color: white;
}

:deep(.el-autocomplete-suggestion__wrap) {
  max-height: 280px;
}

:deep(.el-scrollbar__wrap) {
  max-height: 280px;
}

:deep(.el-autocomplete-suggestion li) {
  background-color: #333;
  color: white;
}

:deep(.el-autocomplete-suggestion li:hover) {
  background-color: #444;
}
</style>
