<template>
  <div v-if="visible" class="dialog-overlay" @click.self="closeDialog">
    <div class="dialog-box">
      <div class="box-title">获取代理配置脚本</div>
      <div class="divider"></div>
      <div class="dialog-content">
        <div class="form-group">
          <label class="input-title">服务器主机名</label>
          <input 
            v-model="hostname" 
            class="info-input" 
            placeholder="请输入目标服务器主机名"
          />
        </div>
      </div>
      
      <div class="dialog-buttons">
        <div class="button-container">
          <button 
            class="confirm-button" 
            @click="downloadScript" 
            :disabled="isLoading"
          >
            {{ isLoading ? '下载中...' : '获取脚本' }}
          </button>
          <button 
            class="cancel-button" 
            @click="closeDialog"
            :disabled="isLoading"
          >
            取消
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue';
import { ElMessage } from 'element-plus';

const props = defineProps({
  visible: {
    type: Boolean,
    default: false
  }
});

const emit = defineEmits(['update:visible', 'transfer']);

// 响应式变量
const hostname = ref('');
const isLoading = ref(false);

// 关闭弹窗
const closeDialog = () => {
  emit('update:visible', false);
};

// 下载脚本
const downloadScript = async () => {
  if (!hostname.value.trim()) {
    ElMessage.error('请输入服务器主机名');
    return;
  }

  isLoading.value = true;

  try {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('未找到登录凭证');
    }
    console.log('token为：',token)
    // 构造查询参数（GET 请求参数放在 URL 里）
    const params = new URLSearchParams({
      hostname: hostname.value.trim(), // 确保参数名与后端一致
    });

    // 发送 GET 请求，参数放在 URL 中
    const response = await fetch(
      `http://113.44.170.52:8080/agent/combinedscript?${params}`,
      {
        method: 'GET',
        headers: {
          'Authorization': ` ${token}`, // 确保格式正确
        },
      }
    );

    if (!response.ok) {
      const errorMsg = await response.text();
      throw new Error(`服务器响应错误: ${errorMsg || response.status}`);
    }

    // 处理文件下载
    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `agent-config-${hostname.value}.sh`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);

    // 通知父组件
    emit('transfer', {
      success: true,
      hostname: hostname.value,
      message: '脚本下载成功',
    });

    // 关闭弹窗
    closeDialog();
  } catch (error) {
    console.error('获取代理脚本失败:', error);
    emit('transfer', {
      success: false,
      hostname: hostname.value,
      message: error.message,
    });

    if (error.message.includes('未找到登录凭证') || error.message.includes('401')) {
      ElMessage.error('登录已过期，请重新登录');
    } else {
      ElMessage.error(`获取脚本失败: ${error.message}`);
    }
  } finally {
    isLoading.value = false;
  }
};

// 监听visible变化，重置状态
watch(() => props.visible, (newVal) => {
  if (!newVal) {
    hostname.value = '';
  }
});
</script>

<style scoped>
.dialog-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.dialog-box {
  width: 60vw;
  max-width: 600px;
  background-color: #222222;
  border: 1px solid #636161;
  color: white;
  padding: 20px;
  border-radius: 10px;
  display: flex;
  flex-direction: column;
}

.box-title {
  text-align: left;
  margin-left: 10px;
  font-size: 20px;
  font-weight: bold;
  height: 30px;
}

.divider {
  width: 96%;
  height: 1px;
  background-color: #636161;
  margin: 10px 10px 15px 10px;
}

.dialog-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 10px;
  max-height: 60vh;
  overflow-y: auto;
  padding: 0 10px;
}

.form-group {
  display: flex;
  align-items: center;
  margin-bottom: 10px;
}

.input-title {
  width: 180px;
  text-align: right;
  padding-right: 20px;
  color: #9A9A9A;
  font-size: 16px;
  font-weight: bold;
  flex-shrink: 0;
}

.info-input {
  flex: 1;
  background-color: #4F4F4F;
  border: 1px solid #636161;
  color: white;
  padding: 8px;
  border-radius: 4px;
}

.password-input-wrapper {
  position: relative;
  display: flex;
  align-items: center;
  flex: 1;
}

.toggle-password {
  position: absolute;
  right: 10px;
  top: 50%;
  transform: translateY(-50%);
  cursor: pointer;
}

.dialog-buttons {
  display: flex;
  justify-content: center;
  margin-top: 20px;
}

.button-container {
  display: flex;
  justify-content: center;
  gap: 20px;
  width: 100%;
}

.progress-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 10px 0;
}

.progress-text {
  margin: 10px 0;
  font-size: 16px;
  color: #ffffff;
}

.confirm-button {
  width: 35%;
  height: 40px;
  background-color: rgba(39, 67, 124, 0.7);
  font-size: 18px;
  font-weight: bold;
  color: white;
  border-radius: 15px;
  border: none;
  cursor: pointer;
  transition: all 0.3s;
}

.confirm-button:hover {
  background-color: #21396a;
}

.cancel-button {
  width: 35%;
  height: 40px;
  background-color: #636161;
  font-size: 18px;
  font-weight: bold;
  color: white;
  border-radius: 15px;
  border: none;
  cursor: pointer;
  transition: all 0.3s;
}

.cancel-button:hover {
  background-color: #504f4f;
}

.cancel-transfer {
  width: auto;
  min-width: 120px;
  margin-top: 10px;
}
</style>