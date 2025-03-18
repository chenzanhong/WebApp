<template>
    <div class="dashboard-container">
        <!-- 实例信息区域 -->
        <div class="instance-info metric-box">
            <h2>实例信息</h2>
            <div class="info-item">
                <span>名称：</span>
                <span>{{ hostInfo.hostname }}</span>
            </div>
            <div class="info-item">
                <span>操作系统：</span>
                <span>{{ hostInfo.os }} {{ hostInfo.platform }}</span>
            </div>
            <div class="info-item">
                <span>架构：</span>
                <span>{{ hostInfo.kernel_arch }}</span>
            </div>
        </div>
        <!-- 右侧四个框的容器 -->
        <div class="right-container">
            <!-- CPU利用率区域 -->
            <div class="metric-box">
                <h2>CPU 使用情况</h2>
                <div class="info-item">
                    <span>型号：</span>
                    <span>{{ cpuData.model_name }}</span>
                </div>
                <div class="info-item">
                    <span>使用率：</span>
                    <span>{{ cpuData.percent }}% ({{ cpuData.cores_num }} 核)</span>
                </div>
                <div class="chart-placeholder">
                    <canvas id="cpuChart"></canvas>
                </div>
            </div>
            <!-- 内存使用区域 -->
            <div class="metric-box">
                <h2>内存使用情况</h2>
                <div class="info-item">
                    <span>总量：</span>
                    <span>{{ memoryData.total }}</span>
                </div>
                <div class="info-item">
                    <span>已用：</span>
                    <span>{{ memoryData.used }} ({{ memoryData.user_percent }})</span>
                </div>
                <div class="chart-placeholder">
                    <canvas id="memoryChart"></canvas>
                </div>
            </div>
            <!-- 网络信息区域 -->
            <div class="metric-box">
                <h2>网络流量</h2>
                <div v-for="(net, index) in netData" :key="index" class="info-item">
                    <span>{{ net.data.name }}：</span>
                    <span>↑ {{ net.data.bytes_sent }}B / ↓ {{ net.data.bytes_recv }}B</span>
                </div>
                <div class="info-item">
                    <span>最近更新时间：</span>
                    <span>{{ netData[0]?.time }}</span>
                </div>
            </div>
            <!-- 进程信息区域 -->
            <div class="metric-box">
                <h2>运行进程</h2>
                <div v-for="(process, index) in processData" :key="index" class="process-item">
                    <div class="process-info">
                        <span class="pid">PID: {{ process.data.pid }}</span>
                        <span class="cpu">CPU: {{ process.data.cpu_percent }}%</span>
                        <span class="mem">MEM: {{ process.data.mem_percent }}%</span>
                    </div>
                    <div class="cmdline">{{ process.data.cmdline }}</div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import axios from 'axios'

// 新增格式化工具函数
const formatTime = (isoString) => new Date(isoString).toLocaleString()
const formatTraffic = bytes => {
  const units = ['B', 'KB', 'MB', 'GB']
  let i = 0
  while (bytes >= 1024 && i < units.length - 1) {
    bytes /= 1024
    i++
  }
  return `${bytes.toFixed(1)}${units[i]}`
}

export default {
    data() {
        return {
            hostInfo: {
                hostname: '',
                os: '',
                platform: '',
                kernel_arch: ''
            },
            cpuData: {
                model_name: '',
                percent: 0,
                cores_num: 0
            },
            memoryData: {
                total: '',
                used: '',
                user_percent: 0
            },
            netData: [],
            processData: [],
            loading: true, // 新增加载状态
            error: null    // 新增错误状态
        };
    },

    async mounted() { 
        try {
            const host_name = this.$route.params.host_name

            const token = localStorage.getItem('token');

            const response = await axios.get(`http://localhost:8080/monitor/${host_name}`, {
                
                headers: {  //添加 Authorization 头
                    Authorization: `Bearer ${token}`
                }
            })
            const apiData = response.data
               // 映射主机信息，使用可选链操作符进行安全访问
            this.hostInfo = {
                hostname: apiData?.host?.host_name || '',
                os: apiData?.host?.os || '',
                platform: apiData?.host?.platform || '',
                kernel_arch: apiData?.host?.kernel_arch || ''
            }

            // 映射 CPU 数据（取最新一条）
            const latestCpu = apiData?.cpu?.[apiData.cpu.length - 1]?.data || {}
            this.cpuData = {
                model_name: latestCpu.model_name,
                percent: latestCpu.percent,
                cores_num: latestCpu.cores_num
            }

            // 映射内存数据（取最新一条）
            const latestMem = apiData?.memory?.[apiData.memory.length - 1]?.data || {}
            this.memoryData = {
                total: latestMem.total,      
                used: latestMem.used,        
                user_percent: latestMem.user_percent
            }
            // 映射网络数据
            this.netData = apiData?.net?.map(item => ({
                data: {
                    name: item?.data?.name || '',
                    bytes_sent: formatTraffic(item?.data?.bytes_sent || 0), 
                    bytes_recv: formatTraffic(item?.data?.bytes_recv || 0)
                },
                time: formatTime(item?.time || '')
            })) || []

            // 映射进程数据
            this.processData = apiData?.process?.map(p => ({
                data: {
                    pid: p?.data?.pid || 0,
                    cmdline: p?.data?.cmdline || '',
                    cpu_percent: p?.data?.cpu_percent || 0,
                    mem_percent: p?.data?.mem_percent || 0
                }
            })) || []

        } catch (error) {
            console.error('接口请求失败:', error)
            this.error = '数据加载失败，请检查网络连接'
        } finally {
            this.loading = false
        }
    }
};
</script>

<style scoped>
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
}

.process-item {
    margin: 10px 0;
    padding: 12px;
    background: #2a2a2a;
    border-radius: 4px;
}

.process-info {
    display: flex;
    gap: 15px;
    margin-bottom: 6px;
}

.cmdline {
    color: #888;
    font-size: 0.9em;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}

.pid { color: #4CAF50; }
.cpu { color: #2196F3; }
.mem { color: #FF9800; }

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
}
</style>
