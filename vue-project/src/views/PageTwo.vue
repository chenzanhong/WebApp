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
            processData: []
        };
    },
    mounted() {
        // 修改后的服务器二数据
        setTimeout(() => {
            this.hostInfo = {
                hostname: 'db-server-02',
                os: 'Linux',
                platform: 'CentOS 7.9',
                kernel_arch: 'x86_64'
            };

            this.cpuData = {
                model_name: 'AMD EPYC 7763',
                percent: 28.7,
                cores_num: 16
            };

            this.memoryData = {
                total: '64GB',
                used: '38.4GB',
                user_percent: 60.0
            };

            this.netData = [
                {
                    data: {
                        name: 'eno1',
                        bytes_sent: 24567890,
                        bytes_recv: 345678901
                    },
                    time: '2024-03-15T15:45:00Z'
                },
                {
                    data: {
                        name: 'vlan20',
                        bytes_sent: 456789,
                        bytes_recv: 5678901
                    },
                    time: '2024-03-15T15:45:00Z'
                }
            ];

            this.processData = [
                {
                    data: {
                        pid: 6543,
                        cmdline: '/usr/sbin/mysqld --basedir=/usr',
                        cpu_percent: 18.2,
                        mem_percent: 22.1
                    }
                },
                {
                    data: {
                        pid: 6789,
                        cmdline: '/usr/bin/redis-server *:6379',
                        cpu_percent: 6.5,
                        mem_percent: 8.4
                    }
                },
                {
                    data: {
                        pid: 6821,
                        cmdline: '/usr/sbin/nginx -g daemon on;',
                        cpu_percent: 3.1,
                        mem_percent: 4.7
                    }
                }
            ];
        }, 1000);
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
