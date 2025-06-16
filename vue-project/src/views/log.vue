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
            value-format="YYYY-MM-DD HH:mm:ss"
            class="date-picker-item"
          />
          <span class="date-separator">-</span>
          <el-date-picker
            v-model="dateRangeEnd"
            type="datetime"
            placeholder="请选择终止日期"
            value-format="YYYY-MM-DD HH:mm:ss"
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
            <el-option label="文件上传" value="文件上传" />
            <el-option label="文件下载" value="文件下载" />
            <el-option label="两服务器间单文件传输" value="两服务器间单文件传输" />
            <el-option label="申请注册公司" value="申请注册公司" />
            <el-option label="邀请公司成员" value="邀请公司成员" />
          </el-select>
        </div>

        <el-icon
              style="width: 2rem; height: 2rem; margin-left: 0.5rem; background-color: #ffffff; border-radius: 50%; cursor: pointer;" @click="handleSearch">
              <Search style="font-size: 1.2rem; color: #000000;" />
        </el-icon>
      </div>
    </div>

    <div class="log-content">
      <el-table
        :data="filteredLogs"
        style="width: 100%"
        :stripe="true"
        :border="false"
        class="log-table"
      >
        <el-table-column type="index" label="序号" width="80" />
        <el-table-column prop="timestamp" label="操作时间" :min-width="12 + 'vw'">
          <template #default="scope">
            {{ formatDate(scope.row.timestamp) }}
          </template>
        </el-table-column>
        <el-table-column v-if="showOperatorColumn" prop="username" label="操作人" :min-width="8 + 'vw'" />
        <el-table-column prop="type" label="操作类型" :min-width="10 + 'vw'" />
        <el-table-column prop="detail" label="操作详情" :min-width="15 + 'vw'" show-overflow-tooltip>
          <template #default="scope">
            <div style="white-space: normal; word-break: break-all;">{{ scope.row.detail }}</div>
          </template>
        </el-table-column>
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
import { ref, onMounted, computed } from 'vue';
import { ElMessage } from 'element-plus';
import { Search } from '@element-plus/icons-vue';

// 状态变量
const logType = ref('all');
const dateRangeStart = ref(null);
const dateRangeEnd = ref(null);
const currentPage = ref(1);
const pageSize = ref(20);
const total = ref(0);
const logs = ref([]);

// 添加用户角色状态
const userRole = ref('');

// 计算属性：判断是否显示操作人列
const showOperatorColumn = computed(() => {
  return userRole.value === 'ROOT' || userRole.value === 'ADMIN';
});

// 检查用户角色
const checkUserRole = () => {
  const role = localStorage.getItem('userRole');
  userRole.value = role || '';
  console.log('当前用户角色:', userRole.value);
};

// 在组件挂载时检查用户角色
onMounted(() => {
  checkUserRole();
});

// 计算属性：过滤后的日志数据
const filteredLogs = computed(() => {
  let currentLogs = logs.value;

  // 根据操作结果进行前端过滤
  if (logType.value !== 'all') {
    currentLogs = currentLogs.filter(log => {
      return log.type === logType.value;
    });
  }

  // 这里可以添加其他前端筛选逻辑（例如 serverName）

  // 更新总数以反映过滤后的日志数量
  total.value = currentLogs.length;

  return currentLogs;
});

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

// 将时间转换为ISO8601格式 (带时区偏移)
const convertToISO8601WithOffset = (date) => {
  if (!date) return '';
  let d = date;
  if (!(d instanceof Date)) {
    // 尝试将输入解析为 Date 对象，假设输入是本地时间字符串
    // 注意：直接解析 'YYYY-MM-DD HH:mm:ss' 可能在不同浏览器行为不一致
    // 一个更健壮的方法是手动解析年、月、日、时、分、秒来构建 Date 对象，或者考虑使用日期处理库
    // 这里为了简化，先尝试直接创建 Date 对象。如果发现时区问题，需要进一步调整。
    d = new Date(date.replace(' ', 'T')); // 将空格替换为'T'尝试用ISO 8601解析
    if (isNaN(d.getTime())) {
        // 如果标准解析失败，尝试手动解析 YYYY-MM-DD HH:mm:ss 格式
        const parts = date.match(/(\d{4})-(\d{2})-(\d{2}) (\d{2}):(\d{2}):(\d{2})/);
        if (parts) {
            // 注意：月份是从 0 开始的
            d = new Date(parts[1], parts[2] - 1, parts[3], parts[4], parts[5], parts[6]);
        } else {
             console.error('无法解析日期格式:', date);
             return ''; // 返回空字符串或根据需要处理错误
        }
    }
  }

  const year = d.getFullYear();
  const month = ('0' + (d.getMonth() + 1)).slice(-2);
  const day = ('0' + d.getDate()).slice(-2);
  const hours = ('0' + d.getHours()).slice(-2);
  const minutes = ('0' + d.getMinutes()).slice(-2);
  const seconds = ('0' + d.getSeconds()).slice(-2);
  const milliseconds = ('00' + d.getMilliseconds()).slice(-3);

  const timezoneOffset = d.getTimezoneOffset(); // 分钟为单位
  const offsetHours = Math.abs(Math.floor(timezoneOffset / 60));
  const offsetMinutes = Math.abs(timezoneOffset % 60);
  const offsetSign = timezoneOffset > 0 ? '-' : '+';
  const formattedOffset = `${offsetSign}${('0' + offsetHours).slice(-2)}${('0' + offsetMinutes).slice(-2)}`;

  return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}.${milliseconds}${formattedOffset}`;
};

// 刷新日志数据
const refreshLogs = async (isSearch = false) => {
  try {
    const token = localStorage.getItem('token');
    if (!token) {
      ElMessage.error('未找到登录凭证，请重新登录');
      return;
    }
    
    // 从localStorage获取用户角色
    const role = localStorage.getItem('userRole');
    userRole.value = role || '';
    
    // 构建请求体
    const requestBody = {
      username: '',  // 不设置默认值，让后端处理
      fromTime: '',
      toTime: '',
      operation: '',
      level: ''
    };
    
    // 只有在点击搜索时才添加搜索参数
    if (isSearch) {
      if (dateRangeStart.value) {
        requestBody.fromTime = convertToISO8601WithOffset(dateRangeStart.value);
      }
      if (dateRangeEnd.value) {
        requestBody.toTime = convertToISO8601WithOffset(dateRangeEnd.value);
      }
      if (logType.value !== 'all') {
        requestBody.operation = logType.value;
      }
    }

    console.log('完整的请求参数:', requestBody);

    const response = await fetch('http://113.44.170.52:8080/agent/getuseroperationlogs', {
      method: 'POST',
      headers: {
        'Authorization': token,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(requestBody)
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('服务器响应错误:', {
        status: response.status,
        statusText: response.statusText,
        errorText: errorText
      });
      throw new Error(`获取日志失败: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    console.log('服务器响应数据:', data);

    // 将接口返回的数据映射到表格数据
    if (!data.logs) {
      logs.value = [];
      total.value = 0;
      return;
    }

    logs.value = data.logs.map(log => ({
      timestamp: log.ts,
      type: log.msg,
      result: log.level === 'error' ? '失败' : '成功',
      server_name: log.username,
      detail: log.detail,
      username: log.username
    })) || [];

    total.value = logs.value.length;

  } catch (error) {
    console.error('获取日志失败:', error);
    ElMessage.error(`获取日志失败: ${error.message}`);
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

// 处理搜索按钮点击
const handleSearch = () => {
  refreshLogs(true);
};

// 组件挂载时获取日志数据（不带参数）
onMounted(() => {
  refreshLogs(false);
});
</script>

<style scoped>
.log-container {
  padding: 20px;
  height: 100vh;
  background-color: #1a1a1a;
  color: white;
  overflow-y: auto;
  scrollbar-width: none; 
  -ms-overflow-style: none; 
  display: flex;
  flex-direction: column;
}

.log-container::-webkit-scrollbar {
  display: none;
}

.log-header {
  margin-bottom: 20px;
  position: sticky;
  top: 0;
  background-color: #1a1a1a;
  z-index: 1;
  padding: 10px 0 3px 0;
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
  flex-wrap: wrap; 
  justify-content: center; 
  background-color: transparent;
}

.filter-group {
    display: flex;
    align-items: center;
    gap: 5px;
}

.filter-label {
    color: white; 
    font-size: 14px;
    flex-shrink: 0; 
    font-weight: bold; 
}

.date-picker-item {
    width: 180px;
}

.date-separator {
    color: white;
    margin: 0 5px;
    font-size: 20px; 
    font-weight: bold; 
}

.filter-select {
  width: 150px;
}

.log-content {
  flex: 1;
  background-color:  #212831;
  border-radius: 1rem;
  padding: 5px 25px;
  margin: 13px 15px 6px 30px;
  border: 1px solid #374151;
  overflow-x: auto;
  scrollbar-width: none; 
  -ms-overflow-style: none;
  min-width: 60vw;
  max-width: 95vw;
  display: flex;
  flex-direction: column;
  max-height: calc(100vh - 220px);
}

.log-content::-webkit-scrollbar {
  display: none; /* Chrome, Safari, Opera */
}

.log-table {
  margin-bottom: 20px;
}

.pagination-container {
  display: flex;
  justify-content: flex-end;
  margin-top: 20px;
  padding-bottom: 20px;
}

:deep(.el-table) {
  background-color: transparent !important; 
  color: white;
  border-collapse: collapse; 
  border: none !important;
  table-layout: fixed !important; 
  width: 100% !important;
  min-width: 60vw !important; /* 设置表格最小宽度 */
  max-width: 95vw !important; /* 设置表格最大宽度 */
}

:deep(.el-table__header) {
  background-color: transparent !important;
  width: 100% !important;
}

:deep(.el-table__header-wrapper) {
  background-color: transparent !important;
  width: 100% !important;
  overflow-x: auto !important;
  scrollbar-width: none !important; /* Firefox */
  -ms-overflow-style: none !important; /* IE and Edge */
}

:deep(.el-table__header-wrapper::-webkit-scrollbar) {
  display: none !important; /* Chrome, Safari, Opera */
}

:deep(.el-table__body) {
  width: 100% !important;
  background-color: transparent !important;
}

:deep(.el-table__body-wrapper) {
  width: 100% !important;
  background-color: transparent !important;
  overflow-y: auto !important;
  max-height: calc(100vh - 300px) !important;
  scrollbar-width: none !important;
  -ms-overflow-style: none !important;
}

:deep(.el-table__body-wrapper::-webkit-scrollbar) {
  display: none !important;
}

:deep(.el-table__header tr) {
  background-color: transparent !important;
}

:deep(.el-table__header th) {
  background-color: transparent !important;
  padding: 12px 8px !important;
  text-align: center !important;
  border-bottom: 2px solid #ffffff !important;
  border-right: none !important;
  color: white !important;
  white-space: nowrap !important;
  font-size: 14px !important; /* 固定字体大小 */
}

:deep(.el-table__body td) {
  padding: 12px 8px !important;
  text-align: center !important;
  background-color: transparent !important;
  white-space: nowrap !important;
  font-size: 14px !important; /* 固定字体大小 */
}

:deep(.el-table__row) {
  background-color: transparent !important;
}

:deep(.el-table__row--striped) {
  background-color: transparent !important;
}

:deep(.el-table__fixed) {
  background-color: transparent !important;
}

:deep(.el-table__fixed-right) {
  background-color: transparent !important;
}

:deep(.el-table__fixed-header-wrapper) {
  background-color: transparent !important;
}

:deep(.el-table__body td.el-table__cell) {
  overflow: hidden !important;
  text-overflow: ellipsis !important;
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