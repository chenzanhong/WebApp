<template>
  <div v-if="visible" class="dialog-overlay" @click.self="closeDialog">
    <div class="dialog-box">
      <div class="box-title">添加服务器</div>
      <div class="divider"></div>
      <div class="dialog-content">
        <div class="form-group">
          <label class="input-title">服务器IP：</label>
          <input v-model="formData.host" class="info-input" placeholder="请输入服务器IP地址">
        </div>
        
        <div class="form-group">
          <label class="input-title">用户名：</label>
          <input v-model="formData.user" class="info-input" placeholder="请输入服务器用户名">
        </div>
        
        <div class="form-group">
          <label class="input-title">密码：</label>
          <div class="password-input-wrapper">
            <input v-model="formData.password" :type="passwordType" class="info-input" placeholder="请输入服务器密码">
            <span class="toggle-password" @click="togglePasswordVisibility">
              <el-icon :is="passwordType === 'password' ? 'Hide' : 'View'" style="color: white" />
            </span>
          </div>
        </div>
        
        <div class="form-group">
          <label class="input-title">端口：</label>
          <input v-model.number="formData.port" type="number" class="info-input" placeholder="请输入端口号">
        </div>
        
        <div class="form-group">
          <label class="input-title">服务器名称：</label>
          <input v-model="formData.Host_Name" class="info-input" placeholder="请输入服务器名称">
        </div>
        
        <div class="form-group">
          <label class="input-title">操作系统：</label>
          <input v-model="formData.os" class="info-input" placeholder="例如: linux, windows">
        </div>
        
        <div class="form-group">
          <label class="input-title">平台：</label>
          <input v-model="formData.platform" class="info-input" placeholder="例如: ubuntu, centos">
        </div>
        
        <div class="form-group">
          <label class="input-title">内核：</label>
          <input v-model="formData.kernel_arch" class="info-input" placeholder="例如: amd64, x86_64">
        </div>
        
        <div class="form-group">
          <label class="input-title">CPU告警阈值(%)：</label>
          <el-input-number 
            v-model="formData.cpuThreshold" 
            :min="1" 
            :max="100" 
            :precision="0"
            class="threshold-input"
          />
        </div>
        
        <div class="form-group">
          <label class="input-title">内存告警阈值(%)：</label>
          <el-input-number 
            v-model="formData.memoryThreshold" 
            :min="1" 
            :max="100" 
            :precision="0"
            class="threshold-input"
          />
        </div>
      </div>
      
      <div class="dialog-buttons">
        <div class="button-container">
          <button class="confirm-button" @click="submitForm" :disabled="isSubmitting">
            {{ isSubmitting ? '提交中...' : '确认添加' }}
          </button>
          <button class="cancel-button" @click="closeDialog" :disabled="isSubmitting">取消</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, defineProps, defineEmits, watch } from 'vue';
import { View, Hide } from '@element-plus/icons-vue';
import { ElMessage } from 'element-plus';

const props = defineProps({
  visible: {
    type: Boolean,
    default: false
  }
});

const emit = defineEmits(['update:visible', 'success']);

const passwordType = ref('password');
const isSubmitting = ref(false);

const formData = ref({
        host: '',
        user: '',
        password: '',
        port: 22,
        Host_Name: '',
        os: '',
        platform: '',
        kernel_arch: '',
        cpuThreshold: 90,
        memoryThreshold: 90
});

const togglePasswordVisibility = () => {
  passwordType.value = passwordType.value === 'password' ? 'text' : 'password';
};

const closeDialog = () => {
  if (!isSubmitting.value) {
    emit('update:visible', false);
  }
};

const validateForm = () => {
  // 验证必填字段
  const requiredFields = [
    { key: 'Host_Name', label: '服务器名称' },
    { key: 'host', label: '服务器IP' },
    { key: 'user', label: '用户名' },
    { key: 'password', label: '密码' },
    { key: 'os', label: '操作系统' },
    { key: 'platform', label: '平台' },
    { key: 'kernel_arch', label: '内核架构' }
  ];

  // 检查必填字段
  for (const { key, label } of requiredFields) {
    if (!formData.value[key] || formData.value[key].trim() === '') {
      ElMessage.error(`请填写${label}`);
      return false;
    }
  }

  // 验证IP地址格式
  const ipRegex = /^(\d{1,3}\.){3}\d{1,3}$/;
  if (!ipRegex.test(formData.value.host)) {
    ElMessage.error('请输入有效的IP地址');
    return false;
  }

  // 验证端口号范围
  if (formData.value.port < 1 || formData.value.port > 65535) {
    ElMessage.error('端口号必须在1-65535之间');
    return false;
  }

  // 验证阈值范围
  if (formData.value.cpuThreshold < 1 || formData.value.cpuThreshold > 100) {
    ElMessage.error('CPU告警阈值必须在1-100之间');
    return false;
  }

  if (formData.value.memoryThreshold < 1 || formData.value.memoryThreshold > 100) {
    ElMessage.error('内存告警阈值必须在1-100之间');
    return false;
  }
  if (!ipRegex.test(formData.value.host)) {
    ElMessage.error('请输入有效的IP地址');
    return false;
  }
  
  // 验证端口范围
  if (formData.value.port < 1 || formData.value.port > 65535) {
    ElMessage.error('端口号必须在1-65535之间');
    return false;
  }
  
  return true;
};

const submitForm = async () => {
  if (!validateForm()) {
    return;
  }
  
  isSubmitting.value = true;
  
  try {
    // 准备要发送的数据（不包含阈值）
    const requestData = {
      host: formData.value.host,
      user: formData.value.user,
      password: formData.value.password,
      port: formData.value.port,
      Host_Name: formData.value.Host_Name, // Fixed: Changed from hostName to Host_Name to match the form binding
      os: formData.value.os,
      platform: formData.value.platform,
      kernel_arch: formData.value.kernel_arch,
      cpu_threshold: formData.value.cpuThreshold,
      mem_threshold: formData.value.memoryThreshold
    };
    
    console.log('Submitting server data:', requestData); // Add debug log
    
    // 获取token
    const token = localStorage.getItem('token');
    if (!token) {
      ElMessage.error('未找到用户认证信息，请重新登录');
      return;
    }

    // 发送请求到指定URL
    const response = await fetch('http://113.44.170.52:8080/agent/install', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': ` ${token}`
      },
      body: JSON.stringify(requestData)
    });
    
     // 第一步：先以 blob 形式读取响应
    const blob = await response.blob();

    if (response.ok) {
      // 下载脚本
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'install_agent.sh');
      document.body.appendChild(link);
      link.click();
      link.remove();

      // 服务器创建成功，现在设置阈值
      // 第二步：如果需要获取 JSON 数据，可单独发起请求或从 blob 解析（不推荐）
      // 这里假设你不需要 JSON 响应数据，继续设置阈值
      // const thresholdResponse = await fetch('http://113.44.170.52:8080/agent/setthreshold', {
      //   method: 'POST',
      //   headers: {
      //     'Content-Type': 'application/json',
      //     'Authorization': ` ${token}`
      //   },
      //   body: JSON.stringify({
      //     hostname: formData.value.Host_Name,
      //     cpu_threshold: formData.value.cpuThreshold,
      //     mem_threshold: formData.value.memoryThreshold
      //   })
      // });

      // if (!thresholdResponse.ok) {
      //   throw new Error('设置阈值失败');
      // }

      ElMessage.success({
        message: '服务器添加成功，请把浏览器下载的脚本放到被监控服务器上执行，或者见"功能"->"获取删除代理服务的脚本"，又或者点击添加的服务器->“帮助”',
        duration: 0,
        showClose: true,
        style: {
          fontSize: '22px' // 设置字体大小
        }
      });
      emit('success', {});
      closeDialog();
    } else {
      console.error('Server error details:', {
        status: response.status,
        statusText: response.statusText,
        data: responseData
      });
      
      throw new Error(
        responseData.message || 
        `添加服务器失败 (${response.status} ${response.statusText})`
      );
    }
  } catch (error) {
    console.error('添加服务器出错:', error);
    
    // 检查错误类型并显示更友好的错误信息
    let errorMessage = error.message || '未知错误';
    
    if (error.response) {
      // 服务器响应了请求但返回了错误状态码
      errorMessage = `服务器错误: ${error.response.status} ${error.response.statusText}`;
    } else if (error.request) {
      // 请求已发送但没有收到响应
      errorMessage = '无法连接到服务器，请检查网络连接';
    }
    
    ElMessage.error(`添加服务器失败: ${errorMessage}`);
  } finally {
    isSubmitting.value = false;
  }
};

// 监听visible变化，重置表单
watch(() => props.visible, (newVal) => {
  if (newVal) {
    // 重置表单
    formData.value = {
      host: '',
        user: '',
        password: '',
        port: 22,
        Host_Name: '',
        os: '',
        platform: '',
        kernel_arch: '',
        cpuThreshold: 90,
        memoryThreshold: 90
    };
  }
});
</script>

<style scoped>
/* 使用与LocalFileTransferDialog相同的样式 */
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
  background: #222222;
  border-radius: 10px;
  width: 600px;
  max-width: 90%;
  max-height: 90vh;
  overflow-y: auto;
  color: #fff;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
  position: relative;
}

.box-title {
  font-size: 18px;
  font-weight: 600;
  padding: 20px 24px;
  color: #fff;
}

.divider {
  height: 1px;
  background-color: #2d2d3d;
  margin: 0 24px;
}

.dialog-content {
  padding: 24px;
  max-height: 60vh;
  overflow-y: auto;
}

.form-group {
  margin-bottom: 20px;
}

.input-title {
  display: block;
  margin-bottom: 8px;
  font-size: 14px;
  color: #a2a3b7;
}

.info-input {
  width: 100%;
  height: 40px;
  background-color: rgba(74, 85, 104, 0.34);
  border: 1px solid #2d2d3d;
  border-radius: 4px;
  color: #e0e0e0;
  padding: 0 12px;
  font-size: 14px;
  transition: all 0.3s ease;
}

.info-input:focus {
  border-color: #4A5568;
  background-color: #1e1e34;
  box-shadow: 0 0 0 2px rgba(93, 120, 255, 0.2);
  outline: none;
}

.info-input::placeholder {
  color: #5d5d7a;
}

.password-input-wrapper {
  position: relative;
  display: flex;
  align-items: center;
}

.toggle-password {
  position: absolute;
  right: 12px;
  cursor: pointer;
  color: #a2a3b7;
}

.threshold-input {
  width: 100%;
  background-color: rgba(74, 85, 104, 0.34);
}

.dialog-buttons {
  padding: 0 24px 24px;
  text-align: right;
}

.button-container {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
}

.confirm-button,
.cancel-button {
  margin-top: 20px;
  padding: 10px 24px;
  border: none;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s;
}

.confirm-button {
  background-color: #27437C;
  opacity: 0.71;
  color: #fff;
}

.confirm-button:hover {
  background-color: #4a67d6;
}

.confirm-button:disabled {
  background-color: #3a4b8c;
  cursor: not-allowed;
}

.cancel-button {
  background-color: #636161;
  color: #a2a3b7;
}

.cancel-button:hover {
  background-color: #3a3a4c;
  color: #fff;
}

.cancel-button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

/* 滚动条样式 */
.dialog-content::-webkit-scrollbar {
  width: 6px;
}

.dialog-content::-webkit-scrollbar-track {
  background: #1e1e2d;
}

.dialog-content::-webkit-scrollbar-thumb {
  background: #5d78ff;
  border-radius: 3px;
}

.dialog-content::-webkit-scrollbar-thumb:hover {
  background: #4a67d6;
}
</style>
