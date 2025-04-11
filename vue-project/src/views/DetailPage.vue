<template>
    <div class="dashboard-container">
        <!-- 加载状态 -->
        <div v-if="loading" class="loading-overlay">
            <el-icon class="is-loading" :size="35" style="color: #ffffff"><Loading /></el-icon>
            <span class="loading-text":size="35" style="color: #ffffff">数据加载中...</span>
        </div>

        <!-- 错误提示 -->
        <div v-if="error" class="error-message">
            <el-alert type="error" :title="error" show-icon />
        </div>
        <template v-if="!loading && !error">
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
                    <span>{{ net.name }}：</span>
                    <span>↑ {{ net.bytes_sent }}B / ↓ {{ net.bytes_recv }}B</span>
                </div>
                <div class="info-item">
                    <span>最近更新时间：</span>
                    <span>{{ netData[0]?.net_info_created_at || '' }}</span>
                </div>
            </div>
            <!-- 进程信息区域 -->
            <!-- <div class="metric-box">
                <h2>运行进程</h2>
                <div v-for="(process, index) in processData" :key="index" class="process-item">
                    <div class="process-info">
                        <span class="pid">PID: {{ process.data.pid }}</span>
                        <span class="cpu">CPU: {{ process.data.cpu_percent }}%</span>
                        <span class="mem">MEM: {{ process.data.mem_percent }}%</span>
                    </div>
                    <div class="cmdline">{{ process.data.cmdline }}</div>
                </div>
            </div> -->
        </div>
    </template>
    </div>
</template>

<script>
import { Loading } from '@element-plus/icons-vue'

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
    components: { Loading },
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
            // processData: [],
            loading: false, // 新增加载状态
            error: null    // 新增错误状态
        };
    },
    watch: {
        // 新增路由监听
        '$route.params.host_name': {
            immediate: true,
            handler(newVal, oldVal) {
                if (newVal !== oldVal) this.fetchServerDetail()
            }
        }
    },
    methods: {
        async fetchServerDetail() {
            this.loading = true
            this.error = null
            
            try {
                const hostName = encodeURIComponent(this.$route.params.host_name)
                console.log('获取的服务器名称为:', hostName);
                const token = localStorage.getItem('token') 
                const response =  await fetch(
                    `http://120.79.200.209:8080/agent/monitor/${hostName}`,
                    {
                        method: 'GET',
                        headers: {
                            'Authorization': `${token}`
                        }
                    }
                )

                if (response.status === 404) {
                    throw new Error(`服务器 ${hostName} 不存在`)
                }

            

                const serverData = await response.json()
                if (!serverData) {
                    throw new Error('服务器返回空数据')
                }
                console.log('从后端获取的原始数据:', serverData);
                this.updateData(serverData)
                
            } catch (error) {
                console.error('获取监控数据失败:', error)
                this.error = error.response?.data?.message 
                    || error.message 
                    || `请求失败：${error.code || '未知错误'}`
            } finally {
                this.loading = false
            }
        },
        updateData(serverData) {
            // 更新实例信息
            this.hostInfo = {
        hostname: serverData.host?.host_name || 'N/A',
        os: serverData.host?.os || 'N/A',
        platform: serverData.host?.platform || 'N/A',
        kernel_arch: serverData.host?.kernel_arch || 'N/A'
    };

            // 处理CPU数据，获取最新的一条数据
    const cpuDataArray = serverData.cpu || [];
    const latestCpu = cpuDataArray.length > 0 
       ? cpuDataArray[cpuDataArray.length - 1] 
        : {};
    this.cpuData = {
        model_name: latestCpu.model_name || 'N/A',
        percent: latestCpu.percent?.toFixed(1) || 0,
        cores_num: latestCpu.cores_num || 0
    };

                // 处理内存数据，获取最新的一条数据
            const memoryDataArray = serverData.memory || [];
            const latestMem = memoryDataArray.length > 0 
               ? memoryDataArray[memoryDataArray.length - 1] 
                : {};
            this.memoryData = {
                total: latestMem.total || '',
                used: latestMem.used || '',
                user_percent: `${latestMem.user_percent}%` || ''
            };


// 处理网络数据，获取最新的一条数据
const netDataArray = serverData.net || [];
            if (netDataArray.length > 0) {
                const latestNetData = netDataArray[netDataArray.length - 1];
                if (Array.isArray(latestNetData)) {
                    this.netData = latestNetData.map(net => ({
                        name: net.name || 'Unknown',
                        bytes_sent: net.bytes_sent || 0,
                        bytes_recv: net.bytes_recv || 0,
                        net_info_created_at: net.net_info_created_at || ''
                    }));
                } else {
                    this.netData = [
                        {
                            name: latestNetData.name || 'Unknown',
                            bytes_sent: latestNetData.bytes_sent || 0,
                            bytes_recv: latestNetData.bytes_recv || 0,
                            net_info_created_at: latestNetData.net_info_created_at || ''
                        }
                    ];
                }
            } else {
                this.netData = [];
            }

            // 处理进程数据
            // this.processData = (serverData.process || []).map(p => ({
            //     data: {
            //         pid: p?.data?.pid || 0,
            //         cmdline: p?.data?.cmdline?.join(' ') || '',
            //         cpu_percent: p?.data?.cpu_percent?.toFixed(1) || 0,
            //         mem_percent: p?.data?.mem_percent?.toFixed(1) || 0
            //     }
            // }))
        }
    }
}
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