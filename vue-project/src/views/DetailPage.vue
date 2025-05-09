<template>
  <div class="dashboard-container">
      <!-- 加载状态 -->
      <!-- <div v-if="loading" class="loading-overlay">
          <el-icon class="is-loading" :size="35" style="color: #ffffff"><Loading /></el-icon>
          <span class="loading-text":size="35" style="color: #ffffff">数据加载中...</span>
      </div> -->

      <!-- 错误提示 -->
      <div v-if="error" class="error-message">
          <el-alert type="error" :title="error" show-icon />
      </div>
      <template v-if="!loading && !error">
      <!-- 实例信息区域 -->
      <div class="instance-info metric-box">
          <h2>实例信息</h2>
          <div class="info-item">
              <span>主机名称：</span>
              <span>{{ hostInfo.hostname }}</span>
          </div>
          <div class="info-item">
              <span>操作系统：</span>
              <span>{{ hostInfo.os }} {{ hostInfo.platform }}</span>
          </div>
          <div class="info-item">
              <span>系统架构：</span>
              <span>{{ hostInfo.kernel_arch }}</span>
          </div>
          <div class="info-item">
              <span>上传时间：</span>
              <span>{{ formatTime(hostInfo.last_report) }}</span>
          </div>
      </div>
      <!-- 右侧四个框的容器 -->
      <div class="right-container">
          <!-- CPU利用率区域 -->
          <div class="metric-box">
              <h2>CPU 使用情况</h2>
              <div class="info-item">
                  <span>处理器型号：</span>
                  <span>{{ cpuData.model_name }}</span>
              </div>
              <div class="info-item">
                  <span>使用率：</span>
                  <span>{{ cpuData.percent }}% ({{ cpuData.cores_num }} 核)</span>
              </div>
              <div class="info-item">
                  <span>物理核心：</span>
                  <span>{{ cpuData.cores_num }}</span>
              </div>
              <div class="chart-placeholder">
                  <canvas id="cpuChart"></canvas>
              </div>
          </div>
          <!-- 内存使用区域 -->
          <div class="metric-box">
              <h2>内存使用情况</h2>
              <div class="info-item">
                  <span>总内存：</span>
                  <span>{{ memoryData.total }}</span>
              </div>
              <div class="info-item">
                  <span>已用内存：</span>
                  <span>{{ memoryData.used }} ({{ memoryData.user_percent }})</span>
              </div>
              <div class="info-item">
                  <span>使用占比：</span>
                  <span>{{ memoryData.user_percent }}%</span>
              </div>
              <div class="chart-placeholder">
                  <canvas id="memoryChart"></canvas>
              </div>
          </div>
          <!-- 网络信息区域 -->
          <div class="metric-box">
              <h2>网络流量</h2>
              <div v-for="(net, index) in netData" :key="index" class="info-item">
                  <span>发送</span>
                  <span>{{ net.bytes_sent }} </span>
              </div>
              <div v-for="(net, index) in netData" :key="index" class="info-item">
                  <span>接收</span>
                  <span>{{ net.bytes_recv }} </span>
              </div>
             
          </div>
          <!-- 进程信息区域 -->
          <div class="metric-box">
              <h2>运行进程</h2>
              <div  v-for="(process, index) in processData" :key="index" class="info-item">
                      <span>PID</span>
                      <span>{{ process.pid }}</span>
                  </div>
                  <div  v-for="(process, index) in processData" :key="index" class="info-item">
                      <span>CPU：</span>
                      <span>{{ process.cpu_percent }}%</span>
                  </div>
                  <div  v-for="(process, index) in processData" :key="index" class="info-item">
                      <span>MEM：</span>
                      <span>{{ process.mem_percent }}%</span>
                  </div>
          </div>
      </div>
  </template>
  </div>
</template>

<script>
import { Loading } from '@element-plus/icons-vue'

const formatTraffic = bytes => {
if (typeof bytes !== 'number') return '0 B'
const units = ['B', 'KB', 'MB', 'GB']
let i = 0
while (bytes >= 1024 && i < units.length - 1) {
  bytes /= 1024
  i++
}
return `${bytes.toFixed(1)} ${units[i]}`
}

export default {
components: { Loading },
data() {
  return {
    hostInfo: {
      hostname: 'N/A',
      os: 'N/A',
      platform: 'N/A',
      kernel_arch: 'N/A',
      last_report: null
    },
    cpuData: {
      model_name: 'N/A',
      percent: 0,
      cores_num: 0
    },
    memoryData: {
      total: 'N/A',
      used: 'N/A',
      user_percent: 0
    },
    netData: [],
    processData: [],
    loading: false,
    error: null,
    refreshInterval: null // 用于存储定时器ID
  }
},
watch: {
  '$route.params.hostname': {
    handler(newVal) {
      if (newVal) {
        console.log('路由参数变化:', newVal)
        this.fetchServerDetail()
        // 启动定时刷新
        this.startRefresh()
      } else {
        this.error = "缺少主机名参数"
        // 清除定时器
        this.stopRefresh()
      }
    }
  }
},
created() {
  // 组件创建时手动调用一次获取数据的方法
  const hostname = this.$route.params.hostname;
  if (hostname) {
    this.fetchServerDetail();
    this.startRefresh();
  } else {
    this.error = "缺少主机名参数";
  }
},
methods: {
    formatTime(isoString) {
  try {
    return isoString ? new Date(isoString).toLocaleString('zh-CN', { 
      hour12: false,
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    }) : 'N/A'
  } catch {
    return '无效时间'
  }
},
  async fetchServerDetail() {
    try {
      this.loading = true
      this.error = null
      
      const hostname = encodeURIComponent(this.$route.params.hostname)
      const token = localStorage.getItem('token')
      
      const response = await fetch(
        `http://120.79.200.209:8080/agent/monitor/status/${hostname}`,
        //`http://127.0.0.1:4523/m1/5953319-5641373-default/agent/monitor/status/1`,
        { headers: { 'Authorization': token } }
      )

      if (!response.ok) throw new Error(`请求失败: ${response.status}`)
      
      const serverData = await response.json()
      console.log('后端系统信息:', serverData);
      this.updateData(serverData)
      
    } catch (error) {
      console.error('数据获取失败:', error)
      this.error = error.message || '请求异常，请检查网络连接'
    } finally {
      this.loading = false
    }
  },

  updateData(serverData) {
// 主机信息
this.hostInfo = {
hostname: serverData.host_info?.host_name || 'N/A',
os: serverData.host_info?.os || 'N/A',
platform: serverData.host_info?.platform || 'N/A',
kernel_arch: serverData.host_info?.kernel_arch || 'N/A',
last_report: serverData.host_info?.host_info_created_at
}

// CPU数据（取最新时间点的数据）
const latestCpuEntry = serverData.cpu_info?.slice(-1)[0] || {}
const cpuData = latestCpuEntry || {}
this.cpuData = {
model_name: cpuData.model_name || 'N/A',
percent: cpuData.percent?.toFixed(1) || 0,
cores_num: cpuData.cores_num || 0
}

// 内存数据
this.memoryData = {
total:serverData.mem_info?.total || 'N/A',
used: serverData.mem_info?.used || 'N/A',
user_percent: serverData.mem_info?.user_percent?.toFixed(1) || 0.00
}

// 网络数据处理
const latestNetEntry = serverData.net_info?.slice(-1)[0] || {}
const netData = latestNetEntry || {}
this.netData = [{
name: netData.name || '未知接口',
bytes_sent: formatTraffic(netData.bytes_sent),
bytes_recv: formatTraffic(netData.bytes_recv),
update_time: netData.net_info_created_at
}]

// 进程数据处理
const latestProcessEntry = serverData.pro_info?.slice(-1)[0] || {}
const processData = latestProcessEntry || {}
this.processData = [{
pid: processData.pid || 'N/A',
cmdline: processData.cmdline || '未知命令',
cpu_percent: processData.cpu_percent?.toFixed(1) || 0,
mem_percent: processData.mem_percent?.toFixed(1) || 0
}]
},
  startRefresh() {
    this.refreshInterval = setInterval(() => {
      this.fetchServerDetail()
    }, 30000) 
  },
  stopRefresh() {
    clearInterval(this.refreshInterval)
    this.refreshInterval = null
  }
},
beforeDestroy() {
  // 在组件销毁前清除定时器
  this.stopRefresh()
}
}
</script>

<style scoped>
.loading-overlay {
  position: fixed;
  top: 80px;
  left: 0;
  width: 100%;
  height: 100%;
  transform: translateY(0%); 
  background-color: rgba(0, 0, 0, 0.5); /* 半透明黑色背景 */
  display: flex;
  justify-content: center;
  align-items: center;
}

.is-loading {
  font-size: 60px; /* 放大图标 */
  margin-bottom: 5px; /* 图标和文字之间的间距 */
  margin-top: -150px; 
}

.loading-text {
  font-size: 24px; /* 放大文字 */
  color: #ffffff;
  margin-top: -150px; 
}
.dashboard-container {
  display: grid;
  grid-template-columns: minmax(500px, 1fr) 2fr; /* 调整列宽比例 */
  gap: 20px;
  padding: 20px;
  max-width: 1200vw; /* 限制最大宽度 */
  margin: 0 auto; /* 居中显示 */
  margin-left: -30px;
}

.instance-info {
  grid-column: 1 / 2; /* 实例信息框在第一列 */
  min-width: 400px; /* 设置最小宽度 */
  background: #1e1e1e;
  border-radius: 8px;
  padding: 20px;
}

.right-container {
  display: grid;
  grid-template-columns: repeat(2, minmax(450px, 1fr)); /* 自适应列宽 */
  grid-auto-rows: minmax(300px, auto);
  gap: 10px;
  width: 100%;
}


.metric-box {
  background: #1e1e1e;
  border-radius: 8px;
  padding: 20px;
  color: #fff;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}

.info-item {
  display: flex;
  justify-content: space-between;
  margin: 10px 0;
  padding: 8px;
  background: #2a2a2a;
  border-radius: 4px;
  font-size: 15px;
}


.cmdline {
  color: #888;
  font-size: 0.9em;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.no-process {
  color: #f7f3f3;
  text-align: center;
  padding: 20px;
  font-size: 16px;
}


.chart-placeholder {
  height: 150px;
  margin-top: 15px;
  background: #2a2a2a;
  border-radius: 4px;
}

h2 {
  margin: 0 0 15px 0;
  padding-bottom: 10px;
  border-bottom: 1px solid #333;
  font-size: 20px;
}
</style>