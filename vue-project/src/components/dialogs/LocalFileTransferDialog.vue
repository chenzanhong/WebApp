<template>
  <div v-if="visible" class="dialog-overlay" @click.self="closeDialog">
    <div class="dialog-box">
      <div class="box-title">本地文件上传</div>
      <div class="divider"></div>
      <div class="dialog-content">
        <div class="form-group">
          <label class="input-title">本地文件路径：</label>
          <el-upload
            class="upload-demo custom-upload"
            drag
            action=""
            :auto-upload="false"
            :on-change="handleFileChange"
            :limit="1"
          >
            <el-icon class="el-icon--upload"><upload-filled /></el-icon>
            <div class="el-upload__text">
              拖拽文件到此处或 <em>点击上传</em>
            </div>
            <!-- <template #tip>
              <div class="el-upload__tip">
                选择要传输到服务器的文件
              </div>
            </template> -->
          </el-upload>
        </div>
        
        <div class="form-group">
          <label class="input-title">目标服务器的主机名或IP：</label>
          <IpSearchInput v-model="formData.target_server" placeholder="请输入目标服务器的主机名或IP" />
        </div>
        
        <div class="form-group">
          <label class="input-title">目标服务器用户名：</label>
          <input v-model="formData.targetUsername" class="info-input" placeholder="请输入登录目标服务器的用户名">
        </div>
        
        <div class="form-group">
          <label class="input-title">目标服务器密码：</label>
          <div class="password-input-wrapper">
            <input v-model="formData.targetPassword" :type="passwordType" class="info-input" placeholder="请输入登录目标服务器的密码">
            <span class="toggle-password" @click="togglePasswordVisibility">
              <el-icon :is="passwordType === 'password' ? 'Hide' : 'View'" style="color: white" />
            </span>
          </div>
        </div>
        
        <div class="form-group">
          <label class="input-title">目标文件路径：</label>
          <input v-model="formData.transferPath" class="info-input" placeholder="请输入文件在目标服务器上的存放路径">
        </div>
      </div>
      
      <div class="dialog-buttons">
        <div v-if="!isTransferring" class="button-container">
          <button class="confirm-button" @click="startTransfer">开始传送</button>
          <button class="cancel-button" @click="closeDialog">取消</button>
        </div>
        <div v-else class="progress-container">
          <el-progress type="dashboard" :percentage="transferPercentage" :color="progressColors" />
          <div class="progress-text">正在准备传输...</div>
          <button class="cancel-button cancel-transfer" @click="cancelTransfer">取消传输</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, defineProps, defineEmits } from 'vue';
import { View, Hide, UploadFilled } from '@element-plus/icons-vue';
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
const isTransferring = ref(false);
const transferPercentage = ref(0);
const transferTimer = ref(null);
const transferTimeout = ref(null);

const progressColors = [
  { color: '#f56c6c', percentage: 20 },
  { color: '#e6a23c', percentage: 40 },
  { color: '#5cb87a', percentage: 60 },
  { color: '#1989fa', percentage: 80 },
  { color: '#6f7ad3', percentage: 100 },
];

const formData = ref({
  filePath: '',
  targetUsername: '',
  target_server: '',
  targetPassword: '',
  transferPath: ''
});

// 存储选择的文件对象
const selectedFile = ref(null);

const togglePasswordVisibility = () => {
  passwordType.value = passwordType.value === 'password' ? 'text' : 'password';
};

const handleFileChange = (file) => {
  // 获取文件对象并更新表单数据
  if (file && file.raw) {
    selectedFile.value = file.raw;
    formData.value.filePath = file.raw.name;
    console.log('选择的文件:', formData.value.filePath);
  }
};

const closeDialog = () => {
  if (isTransferring.value) {
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
  
  isTransferring.value = false;
  transferPercentage.value = 0;
  ElMessage.info('传输已取消');
};

const startTransfer = async () => {
  // 验证表单
  if (!selectedFile.value || !formData.value.targetUsername || 
      !formData.value.target_server || !formData.value.targetPassword || 
      !formData.value.transferPath) {
    ElMessage.error('请填写所有必填字段并选择文件');
    return;
  }
  
  // 显示进度条
  isTransferring.value = true;
  transferPercentage.value = 0;
  
  // 设置进度条动画
  transferTimer.value = setInterval(() => {
    if (transferPercentage.value < 90) {
      transferPercentage.value += 20;
    }
  }, 100);
  
  // 设置2秒后发送请求
  transferTimeout.value = setTimeout(async () => {
    try {
      // 创建FormData对象来发送文件
      const formDataToSend = new FormData();
      formDataToSend.append('file', selectedFile.value);
      formDataToSend.append('server', formData.value.target_server);
      formDataToSend.append('user', formData.value.targetUsername);
      formDataToSend.append('auth', formData.value.targetPassword);
      formDataToSend.append('path', formData.value.transferPath);
      
      console.log('发送本地文件传输请求，文件名:', selectedFile.value.name);
      
      // 发送网络请求
      const response = await fetch('http://113.44.170.52:8080/agent/upload', {
        method: 'POST',
        headers: {
          'Authorization': localStorage.getItem('token') || ''
          //移除了手动设置的Content-Type头，让浏览器自动设置正确的multipart/form-data边界
        },
        body: formDataToSend
      });
      
      // 停止进度条动画
      if (transferTimer.value) {
        clearInterval(transferTimer.value);
        transferTimer.value = null;
      }
      
      if (response.ok) {
        // 设置进度为100%
        transferPercentage.value = 100;
        
        const result = await response.json();
        console.log('传输请求响应:', result);
        ElMessage.success('本地文件传输请求已提交');
        
        // 发射事件，将数据传递给父组件
        emit('transfer', formData.value);
        
        // 延迟关闭对话框，让用户看到100%进度
        setTimeout(() => {
          isTransferring.value = false;
          closeDialog();
        }, 100);
      } else {
        isTransferring.value = false;
        const errorData = await response.text();
        console.error('传输请求失败:', errorData);
        ElMessage.error(`传输请求失败: ${response.status}`);
      }
    } catch (error) {
      isTransferring.value = false;
      console.error('传输请求异常:', error);
      ElMessage.error('传输请求发生错误，请检查网络连接');
      
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
  white-space: nowrap;
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
  white-space: nowrap;
}

.cancel-button:hover {
  background-color: #504f4f;
}

.cancel-transfer {
  width: auto;
  min-width: 120px;
  margin-top: 10px;
}
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
  align-items: flex-start;
  margin-bottom: 15px;
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

/* 自定义上传框样式 */
.custom-upload {
  width: 100%;
}

.custom-upload :deep(.el-upload) {
  width: 100%;
}

.custom-upload :deep(.el-upload-dragger) {
  width: 100%;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #4F4F4F;
  border: 1px solid #636161;
  border-radius: 4px;
}

.custom-upload :deep(.el-upload__text) {
  color: #fff;
  font-size: 14px;
}
</style>
