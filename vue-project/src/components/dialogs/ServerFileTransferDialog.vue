<template>
  <div v-if="visible" class="dialog-overlay" @click.self="closeDialog">
    <div class="dialog-box">
      <div class="box-title">服务器文件互传</div>
      <div class="divider"></div>
      <div class="dialog-content">
        <div class="form-group">
          <label class="input-title">传输服务器用户名：</label>
          <input v-model="formData.serverUsername" class="info-input" placeholder="请输入用户名">
        </div>
        
        <div class="form-group">
          <label class="input-title">传输服务器IP：</label>
          <IpSearchInput v-model="formData.serverIp" placeholder="请输入传输服务器IP" />
        </div>
        
        <div class="form-group">
          <label class="input-title">传输服务器密钥：</label>
          <div class="password-input-wrapper">
            <input v-model="formData.serverPassword" :type="passwordType" class="info-input" placeholder="请输入传输服务器密码">
            <span class="toggle-password" @click="togglePasswordVisibility">
              <el-icon :is="passwordType === 'password' ? 'Hide' : 'View'" style="color: white" />
            </span>
          </div>
        </div>
        
        <div class="form-group">
          <label class="input-title">文件地址：</label>
          <input v-model="formData.filePath" class="info-input" placeholder="请输入待传输文件的文件地址">
        </div>
        
        <div class="form-group">
          <label class="input-title">目标服务器用户名：</label>
          <input v-model="formData.targetUsername" class="info-input" placeholder="请输入用户名">
        </div>
        
        <div class="form-group">
          <label class="input-title">目标服务器IP：</label>
          <IpSearchInput v-model="formData.targetIp" placeholder="请输入目标服务器IP" />
        </div>
        
        <div class="form-group">
          <label class="input-title">目标服务器密钥：</label>
          <div class="password-input-wrapper">
            <input v-model="formData.targetPassword" :type="passwordType" class="info-input" placeholder="请输入目标服务器密码">
            <span class="toggle-password" @click="togglePasswordVisibility">
              <el-icon :is="passwordType === 'password' ? 'Hide' : 'View'" style="color: white" />
            </span>
          </div>
        </div>
        
        <div class="form-group">
          <label class="input-title">传输路径：</label>
          <input v-model="formData.transferPath" class="info-input" placeholder="请输入要传输的文件路径">
        </div>
      </div>
      
      <div class="dialog-buttons">
        <div v-if="!isLoading" class="button-container">
          <button class="confirm-button" @click="startTransfer">开始传送</button>
          <button class="cancel-button" @click="closeDialog">取消</button>
        </div>
        <div v-else class="progress-container">
          <el-progress type="dashboard" :percentage="percentage" :color="progressColors" />
          <div class="progress-text">正在准备传输...</div>
          <button class="cancel-button cancel-transfer" @click="cancelTransfer">取消传输</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, defineProps, defineEmits } from 'vue';
import { View, Hide } from '@element-plus/icons-vue';
import { ElMessage } from 'element-plus';
import IpSearchInput from '@/components/common/IpSearchInput.vue';

const props = defineProps({
  visible: {
    type: Boolean,
    default: false
  }
});

const emit = defineEmits(['update:visible', 'transfer']);

const passwordType = ref('password');
const formData = ref({
  serverUsername: '',
  serverIp: '',
  serverPassword: '',
  filePath: '',
  targetUsername: '',
  targetIp: '',
  targetPassword: '',
  transferPath: ''
});

// 进度条相关变量
const isLoading = ref(false);
const percentage = ref(0);
const transferTimer = ref(null);
const transferTimeout = ref(null);

// 进度条颜色
const progressColors = [
  { color: '#f56c6c', percentage: 20 },
  { color: '#e6a23c', percentage: 40 },
  { color: '#5cb87a', percentage: 60 },
  { color: '#1989fa', percentage: 80 },
  { color: '#6f7ad3', percentage: 100 },
];

const togglePasswordVisibility = () => {
  passwordType.value = passwordType.value === 'password' ? 'text' : 'password';
};

const closeDialog = () => {
  if (isLoading.value) {
    cancelTransfer();
  }
  emit('update:visible', false);
};

const cancelTransfer = () => {
  if (transferTimer.value) {
    clearInterval(transferTimer.value);
    transferTimer.value = null;
  }
  
  if (transferTimeout.value) {
    clearTimeout(transferTimeout.value);
    transferTimeout.value = null;
  }
  
  isLoading.value = false;
  percentage.value = 0;
  ElMessage.info('传输已取消');
};

const startTransfer = async () => {
  // 验证表单
  if (!formData.value.serverUsername || !formData.value.serverIp || !formData.value.serverPassword ||
      !formData.value.filePath || !formData.value.targetUsername || !formData.value.targetIp ||
      !formData.value.targetPassword || !formData.value.transferPath) {
    ElMessage.error('请填写所有必填字段');
    return;
  }
  
  // 准备请求数据
  const requestData = {
    source_server: formData.value.serverIp,
    source_user: formData.value.serverUsername,
    source_auth: formData.value.serverPassword,
    source_path: formData.value.filePath,
    target_server: formData.value.targetIp,
    target_user: formData.value.targetUsername,
    target_auth: formData.value.targetPassword,
    target_path: formData.value.transferPath
  };
  
  // 显示进度条
  isLoading.value = true;
  percentage.value = 0;
  
  // 设置进度条动画
  transferTimer.value = setInterval(() => {
    if (percentage.value < 90) {
      percentage.value += 11;
    }
  }, 100);
  
  // 设置2秒后发送请求
  transferTimeout.value = setTimeout(async () => {
    try {
      console.log('发送文件传输请求:', requestData);
      
      // 发送网络请求
      //const response = await fetch('http://113.44.170.52:8080/agent/transfer', {
      const response = await fetch('https://a4d3-116-7-245-184.ngrok-free.app/agent/transfer', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': localStorage.getItem('token') || ''
        },
        body: JSON.stringify(requestData)
      });
      
      // 停止进度条动画
      if (transferTimer.value) {
        clearInterval(transferTimer.value);
        transferTimer.value = null;
      }
      
      if (response.ok) {
        // 设置进度为100%
        percentage.value = 100;
        
        const result = await response.json();
        console.log('传输请求响应:', result);
        ElMessage.success('文件传输请求已提交');
        
        // 发射事件，将数据传递给父组件
        emit('transfer', formData.value);
        
        // 延迟关闭对话框，让用户看到100%进度
        setTimeout(() => {
          isLoading.value = false;
          closeDialog();
        }, 100);
      } else {
        isLoading.value = false;
        const errorData = await response.text();
        console.error('传输请求失败:', errorData);
        ElMessage.error(`传输请求失败: ${response.status}`);
      }
    } catch (error) {
      isLoading.value = false;
      console.error('传输请求异常:', error);
      
      // 停止进度条动画
      if (transferTimer.value) {
        clearInterval(transferTimer.value);
        transferTimer.value = null;
      }
    }
  }, 2000); // 2秒后发送请求
};
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

.progress-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 15px;
  margin: 10px 0;
}

.progress-text {
  color: white;
  font-size: 14px;
  margin: 5px 0;
}

.button-container {
  display: flex;
  justify-content: center;
  gap: 20px;
}

.cancel-transfer {
  margin-top: 10px;
  min-width: 100px;
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
  gap: 20px;
  margin-top: 20px;
}

.confirm-button {
  min-width: 120px;
  height: 40px;
  background-color: rgba(39, 67, 124, 0.7);
  font-size: 16px;
  font-weight: bold;
  color: white;
  border-radius: 15px;
  border: none;
  cursor: pointer;
  transition: all 0.3s;
  white-space: nowrap;
  padding: 0 15px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.confirm-button:hover {
  background-color: #21396a;
}

.cancel-button {
  min-width: 80px;
  height: 40px;
  background-color: #636161;
  font-size: 16px;
  font-weight: bold;
  color: white;
  border-radius: 15px;
  border: none;
  cursor: pointer;
  transition: all 0.3s;
  padding: 0 15px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.cancel-button:hover {
  background-color: #504f4f;
}
</style>
