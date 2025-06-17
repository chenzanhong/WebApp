<!-- ServerCard.vue -->
<template>
  <div>
    <div class="server-card" @dblclick="handleDblClick">
      <div class="server-card-header">
        <div class="status-dot" :class="statusClass"></div>
        <div class="server-name">{{ server.host_name }}</div>
        <el-icon class="edit-icon" @click="openEditDialog"><EditPen /></el-icon>
      </div>
      <div class="server-details">
        <div class="details">
          <div>操作系统</div>
          <div>CPU告警阈值</div>
          <div>内存告警阈值</div>
        </div>
        <div class="details">
          <div class="details-a">{{ server.os }}</div>
          <div class="details-a">{{ formatThreshold(server.cpu_threshold) }}</div>
          <div class="details-a">{{ formatThreshold(server.mem_threshold) }}</div>
        </div>
      </div>
      <div class="actions">
        <el-button style="background-color: #636161; color: #ffffff; border-radius: 2rem; border: 0;" plain
                   @click="deleteServer" :loading="deleting">删除
        </el-button>
        <el-button style="background-color: #215476; color: #ffffff; border-radius: 2rem; border: 0;"
                   @click="$emit('disable')">停用
        </el-button>
      </div>
    </div>
    <!-- 修改阈值的弹窗 -->
    <el-dialog
      v-model="editDialogVisible"
      title="修改告警阈值"
      width="400px"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      :show-close="false"
      class="threshold-dialog dark-dialog"
      style="margin-top: 15vh"
    >
      <div class="form-group">
        <label class="input-title">CPU告警阈值(%)：</label>
        <el-input-number 
          v-model="editForm.cpu_threshold" 
          :min="1" 
          :max="100" 
          :precision="0"
          class="threshold-input"
        />
      </div>
      
      <div class="form-group">
        <label class="input-title">内存告警阈值(%)：</label>
        <el-input-number 
          v-model="editForm.mem_threshold" 
          :min="1" 
          :max="100" 
          :precision="0"
          class="threshold-input"
        />
      </div>
      
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="editDialogVisible = false">取消</el-button>
          <el-button type="primary" @click="saveThresholds" :loading="isSaving">保存</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { defineEmits, computed, ref } from 'vue';
import { ElMessage } from 'element-plus';
import { EditPen } from '@element-plus/icons-vue';

const editDialogVisible = ref(false);
const isSaving = ref(false);
const deleting = ref(false);
const editForm = ref({
  cpu_threshold: 0,
  mem_threshold: 0
});

const props = defineProps({
  server: {
    type: Object,
    required: true,
  },
});

const emit = defineEmits(['delete', 'disable', 'update:thresholds', 'card-dblclick']);

const statusClass = computed(() => {
  return `dot-${props.server.status}`;
});

const handleDblClick = () => {
  emit('card-dblclick', props.server.host_name);
};

const openEditDialog = () => {
  editForm.value = {
    cpu_threshold: props.server.cpu_threshold || 90,
    mem_threshold: props.server.mem_threshold || 90
  };
  editDialogVisible.value = true;
};

const deleteServer = async () => {
  try {
    deleting.value = true;
    const token = localStorage.getItem('token');
    const response = await fetch('http://113.44.170.52:8080/agent/delete', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': ` ${token}`
      },
      body: JSON.stringify({
        ip: props.server.ip || props.server.host,
        host_name: props.server.host_name
      })
    });
    
    const responseText = await response.text();
    
    if (!response.ok) {
      throw new Error(`服务器请求失败: ${response.status}`);
    }

    try {
      const data = responseText ? JSON.parse(responseText) : {};
      ElMessage.success(data.msg || '服务器删除成功');
      // 触发成功事件，通知父组件更新服务器列表
      emit('delete:success', { 
        success: true, 
        message: data.msg || '服务器删除成功',
        server: props.server
      });
    } catch (e) {
      // 如果响应不是JSON但状态码是200，仍然认为删除成功
      ElMessage.success('服务器删除成功');
      emit('delete:success', { 
        success: true, 
        message: '服务器删除成功',
        server: props.server
      });
    }
  } catch (error) {
    console.error('删除服务器失败:', error);
    ElMessage.error('删除服务器失败: ' + error.message);
    emit('delete', { success: false, error });
  } finally {
    deleting.value = false;
  }
};

const saveThresholds = async () => {
  try {
    isSaving.value = true;
    // 这里添加保存阈值的API调用
    const token = localStorage.getItem('token');
    const response = await fetch('http://113.44.170.52:8080/agent/setthreshold', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': ` ${token}`
      },
      body: JSON.stringify({
        hostname: props.server.host_name, // 使用服务器IP
        cpu_threshold: editForm.value.cpu_threshold,
        mem_threshold: editForm.value.mem_threshold
      })
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || '更新阈值失败');
    }
    
    // 触发父组件更新
    emit('update:thresholds', {
      ...props.server,
      cpu_threshold: editForm.value.cpu_threshold,
      mem_threshold: editForm.value.mem_threshold
    });
    
    ElMessage.success('阈值更新成功');
    editDialogVisible.value = false;
  } catch (error) {
    console.error('更新阈值失败:', error);
    ElMessage.error('更新阈值失败: ' + (error.message || '未知错误'));
  } finally {
    isSaving.value = false;
  }
};

// 告警阈值以百分比形式展示
const formatThreshold = (threshold) => {
  if (threshold === undefined || threshold === null) return '未设置';
  return `${threshold*100}%`;
};
</script>

<style scoped>
.edit-icon {
  position: absolute;
  top: 1rem;
  right: 1rem;
  color: #999;
  cursor: pointer;
  font-size: 1.2rem;
  transition: color 0.3s;
}

.edit-icon:hover {
  color: #409EFF;
}

.threshold-dialog .el-dialog__body {
  padding: 20px;
}

.form-group {
  display: flex;
  align-items: center;
  margin-bottom: 20px;
}

.input-title {
  width: 120px;
  color: #606266;
  font-size: 14px;
}

.threshold-input {
  flex: 1;
}

.dialog-footer {
  text-align: right;
}

/* 深色对话框样式 - 使用深度选择器 */
:deep(.dark-dialog) {
  background: rgba(34, 34, 34, 0.5) !important;  /* 添加 !important 确保覆盖其他样式 */
  color: #ffffff;
}

/* 确保遮罩层背景色 */
:deep(.el-overlay) {
  background-color: rgba(34, 34, 34, 0.5);
}

/* 确保对话框内容区域背景色 */
:deep(.el-dialog) {
  background: rgba(34, 34, 34, 1) !important;
  border-radius: 8px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.3);
  max-height: 30.5vh;
  display: flex;
  flex-direction: column;
}

:deep(.el-dialog__body) {
  overflow-y: auto;
  padding: 15px 20px;
  flex: 1;
}

:deep(.el-dialog__footer) {
  padding: 10px 20px;
}

:deep(.dark-dialog .el-dialog) {
  background: #222222;
  color: #ffffff;
  --el-dialog-bg-color: #222222;
  --el-dialog-title-text-color: #ffffff;
  --el-text-color-regular: #ffffff;
}

:deep(.dark-dialog .el-dialog__header) {
  border-bottom: 1px solid #333;
  color: #ffffff;
}

:deep(.dark-dialog .el-dialog__body) {
  color: #ffffff;
  background: #222222;
}

:deep(.dark-dialog .el-dialog__footer) {
  border-top: 1px solid #333;
  background: #222222;
}

/* 调整输入框在深色背景下的样式 */
:deep(.dark-dialog .el-input-number) {
  --el-input-text-color: #ffffff;
  --el-input-bg-color: #333;
  --el-input-border-color: #555;
}

:deep(.dark-dialog .el-input-number__decrease),
:deep(.dark-dialog .el-input-number__increase) {
  background-color: #444;
  color: #fff;
  border-color: #555;
}

:deep(.dark-dialog .el-input-number__decrease):hover,
:deep(.dark-dialog .el-input-number__increase):hover {
  background-color: #555;
}

/* 确保弹窗标题文字颜色 */
:deep(.dark-dialog .el-dialog__title) {
  color: #ffffff;
}

/* 确保标签文字颜色 */
:deep(.dark-dialog .input-title) {
  color: #ffffff;
}

/* 确保按钮文字颜色 */
:deep(.dark-dialog .el-button) {
  color: #333;
}

:deep(.dark-dialog .el-button--default) {
  color: #333;
  background-color: #f0f0f0;
  border-color: #dcdfe6;
}

:deep(.dark-dialog .el-button--default:hover) {
  background-color: #e6e6e6;
  border-color: #c6e2ff;
  color: #333;
}

:deep(.dark-dialog .el-button--primary) {
  background-color: #215476;
  border-color: #215476;
  color: #fff;
}

:deep(.dark-dialog .el-button--primary:hover) {
  background-color: #2d6a91;
  border-color: #2d6a91;
  color: #fff;
}
.server-card {
  margin-top: 1rem;
  margin-left: 1rem;
  width: 11.7rem;
  height: 11.7rem;
  background: url("@/assets/bg1.png");
  opacity: 0.8;
  border-radius: 8px;
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  flex-wrap: wrap;
  transition: transform 0.3s ease;
}

.status-dot {
  background: url("@/assets/green-dot.png");
  width: 18px;
  height: 18px;
  border-radius: 50%;
  position: absolute;
  top: 1rem;
  left: 1rem;
}

.dot-offline {
  background: url("@/assets/display/icons/red-dot.png");
}

.server-name {
  margin-left: 0.5rem; /* 让出状态点空间 */
  /* margin-top: 1.5rem; 让出状态点空间 */
  font-size: 1rem;
  font-weight: bold;
  color: white;
}

.server-details {
  display: flex;
  flex-direction: row;
  justify-content: start;
  align-items: start;
}

.details {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  margin-right: 0.5rem;
}

.details div {
  color: #bfbfbf;
  margin: 5px 0;
}

.details-a {
  font-size: 1rem;
  color: #ffffff !important;
  text-align: start;
}

.details div:nth-child(1) {
  font-size: 0.8rem;
}

.details div:nth-child(2) {
  font-size: 0.8rem;
}

.details div:nth-child(3) {
  font-size: 0.8rem;
}

.actions {
  margin-top: 5px;
  color: #ffffff;
}
</style>