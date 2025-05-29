<template>
  <div class="log-container">
    <div class="log-header">
      <div class="filter-area">
        <div class="filter-group date-range-group">
          <span class="filter-label">日期区间:</span>
          <el-date-picker
            v-model="dateRangeStart"
            type="datetime"
            placeholder="请选择起始日期"
            value-format="YYYY-MM-DDTHH:mm:ssZ"
            class="date-picker-item"
          />
          <span class="date-separator">-</span>
          <el-date-picker
            v-model="dateRangeEnd"
            type="datetime"
            placeholder="请选择终止日期"
            value-format="YYYY-MM-DDTHH:mm:ssZ"
            class="date-picker-item"
          />
        </div>

        <div class="filter-group">
          <span class="filter-label">操作类型:</span>
          <el-select v-model="logType" placeholder="请选择/输入操作" filterable allow-create class="filter-select">
            <el-option label="全部" value="all" />
            <el-option label="添加服务器" value="添加服务器" />
            <el-option label="删除服务器" value="删除服务器" />
            <el-option label="修改服务器" value="修改服务器" />
             <el-option label="本地文件上传" value="本地文件上传" />
             <el-option label="服务器文件传输" value="服务器文件传输" />
             <el-option label="服务器文件下载" value="服务器文件下载" />
          </el-select>
        </div>

        <div class="filter-group">
          <span class="filter-label">操作结果:</span>
          <el-select v-model="resultType" placeholder="请选择结果类型" class="filter-select">
            <el-option label="全部" value="all" />
            <el-option label="成功" value="成功" />
            <el-option label="失败" value="失败" />
          </el-select>
        </div>

         <div class="filter-group">
          <span class="filter-label">相关服务器:</span>
          <el-input v-model="serverName" placeholder="请输入服务器ip/名称" class="server-input"></el-input>
        </div>

        <el-icon
              style="width: 2rem; height: 2rem; margin-left: 0.5rem; background-color: #ffffff; border-radius: 50%; cursor: pointer;" @click="refreshLogs">
              <Search style="font-size: 1.2rem; color: #000000;" />
        </el-icon>
      </div>
    </div>

    <div class="log-content">
      <el-table
        :data="logs"
        style="width: 100%"
        :stripe="true"
        :border="false"
        class="log-table"
      >
        <el-table-column type="index" label="序号" width="80" />
        <el-table-column prop="timestamp" label="操作时间" width="180">
           <template #default="scope">
            {{ formatDate(scope.row.timestamp) }}
          </template>
        </el-table-column>
        <el-table-column prop="type" label="操作类型" width="120" />
        <el-table-column prop="server_name" label="相关服务器" width="150" />
        <el-table-column prop="result" label="操作结果" width="150" />
        <el-table-column prop="detail" label="操作详情" />
      </el-table>

      <div class="pagination-container">
        <el-pagination
          v-model:current-page="currentPage"
          v-model:page-size="pageSize"
          :page-sizes="[10, 20, 50, 100]"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { ElMessage } from 'element-plus';
import { Search } from '@element-plus/icons-vue';

// 状态变量
const logType = ref('all');
const resultType = ref('all');
const serverName = ref('');
const dateRangeStart = ref(null);
const dateRangeEnd = ref(null);
const currentPage = ref(1);
const pageSize = ref(20);
const total = ref(0);
const logs = ref([]);

// 格式化日期
const formatDate = (dateString) => {
  if (!dateString) return '';
  const date = new Date(dateString);
   // 格式化为 'YYYY年M月D日 HH:mm:ss'
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();
  const hours = date.getHours().toString().padStart(2, '0');
  const minutes = date.getMinutes().toString().padStart(2, '0');
  const seconds = date.getSeconds().toString().padStart(2, '0');
  return `${year}年${month}月${day}日 ${hours}:${minutes}:${seconds}`;
};


// 刷新日志数据
const refreshLogs = async () => {
  try {
    const token = localStorage.getItem('token');
    const params = new URLSearchParams({
      page: currentPage.value,
      size: pageSize.value
    });

    if (logType.value !== 'all') {
      params.append('type', logType.value);
    }

    if (resultType.value !== 'all') {
      params.append('result', resultType.value);
    }

    if (serverName.value) {
      params.append('server_name', serverName.value);
    }

    if (dateRangeStart.value) {
      params.append('from', dateRangeStart.value);
    }
     if (dateRangeEnd.value) {
      params.append('to', dateRangeEnd.value);
    }

    const response = await fetch(`http://47.86.232.20:8080/agent/log?${params.toString()}`, {
      method: 'GET',
      headers: {
        'Authorization': token,
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      throw new Error('获取日志失败');
    }

    const data = await response.json();

     // 将示例中的 timestamp, type, result, server_name, detail 映射到表格数据
    logs.value = data.logs.map(log => ({
      timestamp: log.from, // 使用from作为操作时间
      type: log.type,
      result: log.result,
      server_name: log.server_name,
      detail: log.result // 直接使用result作为操作详情
    })) || [];

    total.value = data.total || 0;

  } catch (error) {
    console.error('获取日志失败:', error);
    ElMessage.error('获取日志失败，请稍后重试');
  }
};

// 处理分页大小变化
const handleSizeChange = (val) => {
  pageSize.value = val;
  refreshLogs();
};

// 处理页码变化
const handleCurrentChange = (val) => {
  currentPage.value = val;
  refreshLogs();
};

// 组件挂载时获取日志数据
onMounted(() => {
  refreshLogs();
});
</script>

<style scoped>
.log-container {
  padding: 20px;
  height: 100%;
  background-color: #1a1a1a;
  color: white;
}

.log-header {
  margin-bottom: 20px;
}

.log-header h2 {
  margin: 0 0 20px 0;
  color: #4095e5;
  font-size: 24px;
}

.filter-area {
  display: flex;
  gap: 20px;
  align-items: center;
  flex-wrap: wrap; /* 允许换行 */
  justify-content: center; /* 居中 */
  background-color: transparent; /* 透明背景 */
}

.filter-group {
    display: flex;
    align-items: center;
    gap: 5px;
}

.filter-label {
    color: white; /* 文字颜色为白色 */
    font-size: 14px;
    flex-shrink: 0; /* 防止标签收缩 */
    font-weight: bold; /* 加粗 */
}

.date-range-group {
    /* align-items: stretch; */ /* 确保日期选择器高度一致 */
}

.date-picker-item {
    width: 180px; /* 调整单个日期选择器宽度 */
}

.date-separator {
    color: white;
    margin: 0 5px;
    font-size: 20px; /* 加大字体 */
    font-weight: bold; /* 加粗 */
}

.filter-select {
  width: 150px; /* 调整选择器宽度 */
}

.server-input {
  width: 200px; /* 调整输入框宽度 */
}

.log-content  {
  flex: 1;
  background-color: rgba(62, 79, 96, 0.34);
  border-radius: 1rem;
  padding: 25px;
  margin: 13px 15px 28px 30px;
  border: 1px solid #374151;
}
.log-table {
  margin-bottom: 20px;
}

.pagination-container {
  display: flex;
  justify-content: flex-end;
  margin-top: 20px;
}

:deep(.el-table) {
  background-color: transparent; 
  color: white;
  border-collapse: collapse; 
  border: none !important;
}

:deep(.el-table--border) {
  border: none !important;
}

:deep(.el-table__inner-wrapper) {
  border: none !important;
}

:deep(.el-table__border-left-patch) {
  display: none !important;
}

:deep(.el-table__border-top) {
  display: none !important;
}

:deep(.el-table th) {
  background-color: transparent !important; 
  color: white !important;
  border-bottom: 2px solid #ffffff !important; 
  border-right: none !important; /* 去掉表头之间的边框 */
}

:deep(.el-table tr) {
    background-color: transparent !important; 
}

:deep(.el-table td) {
  background-color: transparent !important; 
  color: white !important;
  border: none !important;
}

:deep(.el-pagination) {
  --el-pagination-bg-color: #29333e;
  --el-pagination-button-color: white;
  --el-pagination-button-bg-color: #29333e;
  --el-pagination-hover-color: #4095e5;
  background-color: transparent;
}

:deep(.el-pagination .btn-prev),
:deep(.el-pagination .btn-next) {
  background-color: #374151 !important;
  color: white !important;
  border: 1px solid #4b5563 !important;
}

:deep(.el-pagination .btn-prev:hover),
:deep(.el-pagination .btn-next:hover) {
  color: #4095e5 !important;
  background-color: #4b5563 !important;
}

:deep(.el-pagination .el-pager li) {
  background-color: white !important;
  color: #606266 !important;
  border: 1px solid #dcdfe6 !important;
}

:deep(.el-pagination .el-pager li.active) {
  background-color: #4095e5 !important;
  color: white !important;
}

:deep(.el-pagination .el-pager li:hover) {
  color: #4095e5 !important;
}

:deep(.el-pagination .el-pagination__total) {
  color: #606266 !important;
}

:deep(.el-pagination .el-pagination__jump) {
  color: #606266 !important;
}

:deep(.el-pagination .el-pagination__sizes .el-input__wrapper) {
  background-color: white !important;
  box-shadow: 0 0 0 1px #dcdfe6 inset !important;
}

:deep(.el-pagination .el-pagination__sizes .el-input__inner) {
  color: #606266 !important;
}

:deep(.el-pagination .el-pagination__jump .el-input__wrapper) {
  background-color: white !important;
  box-shadow: 0 0 0 1px #dcdfe6 inset !important;
}

:deep(.el-pagination .el-pagination__jump .el-input__inner) {
  color: #606266 !important;
}

:deep(.el-select-dropdown) {
  background-color: white !important;
  border: 1px solid #dcdfe6 !important;
}

:deep(.el-select-dropdown__item) {
  color: #606266 !important;
}

:deep(.el-select-dropdown__item.hover),
:deep(.el-select-dropdown__item:hover) {
  background-color: #f5f7fa !important;
}

:deep(.el-select-dropdown__item.selected) {
  color: #4095e5 !important;
  font-weight: bold;
}

:deep(.el-popper__arrow::before) {
  background: white !important;
  border: 1px solid #dcdfe6 !important;
}

/* 修改 Element Plus 输入框、选择器、日期选择器等的背景和文字颜色 */
:deep(.el-input__wrapper),
:deep(.el-select__wrapper),
:deep(.el-range__wrapper) {
  background-color: white !important;
  box-shadow: 0 0 0 1px var(--el-input-border-color) inset; /* 添加边框 */
}

/* 修改 Element Plus 输入框、选择器等的文字颜色 */
:deep(.el-input__inner),
:deep(.el-select__single-input),
:deep(.el-range-input) {
    color: black !important; /* 确保输入框内的文本颜色是黑色 */
}

/* 修改 Element Plus 占位符颜色 */
:deep(.el-input__inner::placeholder),
:deep(.el-select__placeholder),
:deep(.el-range-input::placeholder) {
  color: #636161 !important;
}

:deep(.el-button) { /* 保留el-button的deep选择器，但将样式应用到el-icon */
  background-color: transparent; /* 将按钮背景设为透明 */
  border: none; /* 移除按钮边框 */
  padding: 0; /* 移除按钮内边距 */
}

:deep(.el-button:hover) {
  background-color: transparent; /* 保持透明 */
  border-color: transparent; /* 保持透明 */
}

:deep(.el-tag) {
  border: none;
}

:deep(.el-range-editor .el-range-separator) {
  color: #b8b5b5; /* 修改日期范围分隔符颜色 */
}

/* 针对拆分的日期时间选择器，调整其内部元素颜色 */
:deep(.el-date-editor.el-input__wrapper) {
    background-color: white !important;
}

:deep(.el-date-editor.el-input__wrapper .el-input__inner) {
    color: black !important;
}

:deep(.el-date-editor.el-input__wrapper .el-input__prefix-inner > *),
:deep(.el-date-editor.el-input__wrapper .el-input__suffix-inner > *) {
    color: #636161 !important; /* 修改日期选择器图标颜色 */
}
</style>