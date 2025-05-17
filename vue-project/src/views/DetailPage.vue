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
          <!-- 新增进程趋势图 -->
          <div class="process-charts">
            <div 
              id="cpuProcessChart"
              class="chart-container"
              style="width: 100%; height: 240px; margin-top: 20px"
            ></div>
            <div 
              id="memoryProcessChart"
              class="chart-container"
              style="width: 100%; height: 240px; margin-top: 20px"
            ></div>
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
                  <span>{{ cpuData.percent }}%</span>
              </div>
              <div class="info-item">
                  <span>物理核心：</span>
                  <span>{{ cpuData.cores_num }} 核</span>
              </div>
             <!-- 修改图表容器 -->
            <div 
              id="cpuChart"
              class="chart-container"
              style="width: 100%; height: 220px"
            ></div>
          </div>
          <!-- 内存使用区域 -->
          <div class="metric-box">
              <h2>内存使用情况</h2>
              <div class="info-item">
                  <span>总内存：</span>
                  <span>{{ memoryData.total }}G</span>
              </div>
              <div class="info-item">
                  <span>已用内存：</span>
                  <span>{{ memoryData.used }}G</span>
              </div>
              <div class="info-item">
                  <span>使用占比：</span>
                  <span>{{ memoryData.user_percent }}%</span>
              </div>
              <!-- 修改图表容器 -->
              <div 
                id="memoryChart"
                class="chart-container"
                style="width: 100%; height: 220px"
              ></div>
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
                      <span>命令行：</span>
                      <span>{{ process.cmdline }}</span>
                  </div>
              <div  v-for="(process, index) in processData" :key="index" class="info-item">
                      <span>PID：</span>
                      <span>{{ process.pid }}</span>
                  </div>
                  <div  v-for="(process, index) in processData" :key="index" class="info-item">
                      <span>CPU占用：</span>
                      <span>{{ process.cpu_percent }}%</span>
                  </div>
                  <div  v-for="(process, index) in processData" :key="index" class="info-item">
                      <span>内存占用：</span>
                      <span>{{ process.mem_percent }}%</span>
                  </div>
          </div>
      </div>
  </template>
  </div>
</template>

<script>
import { Loading } from '@element-plus/icons-vue';
import * as echarts from 'echarts/core';
import { PieChart } from 'echarts/charts';
import { LineChart } from 'echarts/charts';
import {
  TitleComponent,
  TooltipComponent,
  LegendComponent,
  GridComponent,
  DatasetComponent
} from 'echarts/components';
import { CanvasRenderer } from 'echarts/renderers';
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
echarts.use([
  LineChart,
  GridComponent,
  DatasetComponent,
  PieChart,
  TitleComponent,
  TooltipComponent,
  LegendComponent,
  CanvasRenderer
]);
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
    refreshInterval: null,// 用于存储定时器ID
    cpuChart: null,
    memoryChart: null,
    processHistory:[],
    cpuProcessChart: null,
    memoryProcessChart: null,
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
mounted() {
    this.initCpuChart();
    this.initMemoryChart();
    this.initCpuProcessChart();
    this.initMemoryProcessChart();
    window.addEventListener('resize', this.handleChartResize);
  },
  beforeDestroy() {
    this.cleanupCharts();
    window.removeEventListener('resize', this.handleChartResize);
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
        //`http://120.79.200.209:8080/agent/monitor/status/${hostname}`,
        `http://127.0.0.1:4523/m1/5953319-5641373-default/agent/monitor/status/1`,
        {  headers: { 'Authorization': ` ${token}` } }
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

// 初始化CPU图表
 async initCpuChart() {
    let retryCount = 0;
    const maxRetries = 5;
    
    const tryInit = () => {
      const dom = document.getElementById('cpuChart');
      
      if (dom) {
        if (this.cpuChart) this.cpuChart.dispose();
        
        try {
          this.cpuChart = echarts.init(dom, 'dark');
          this.updateCpuChart();
        } catch (error) {
          console.error('图表初始化失败:', error);
        }
      } else if (retryCount < maxRetries) {
        retryCount++;
        console.warn(`第 ${retryCount} 次重试查找容器...`);
        setTimeout(tryInit, 300);
      } else {
        console.error(`无法找到图表容器，已尝试 ${maxRetries} 次`);
      }
    };
    // 首次尝试
    this.$nextTick(() => {
      tryInit();
    });
  },

   // 初始化内存图表
  async initMemoryChart() {
    let retryCount = 0;
    const maxRetries = 5;
    
    const tryInit = () => {
      const dom = document.getElementById('memoryChart');
      
      if (dom) {
        if (this.memoryChart) this.memoryChart.dispose();
        
        try {
          this.memoryChart = echarts.init(dom, 'dark');
          this.updateMemoryChart();
        } catch (error) {
          console.error('内存图表初始化失败:', error);
        }
      } else if (retryCount < maxRetries) {
        retryCount++;
        setTimeout(tryInit, 300);
      }
    };

    this.$nextTick(() => {
      tryInit();
    });
  },

  
  

  getCpuColor(percent) {
    if (percent < 60) {
      return {
        start: '#64d572', // 浅绿
        end: '#37be4e'    // 深绿
      }
    } else if (percent < 90) {
      return {
        start: '#ffb74d', // 浅橙
        end: '#ff9800'    // 深橙
      }
    } else {
      return {
        start: '#ff5252', // 浅红
        end: '#d32f2f'    // 深红
      }
    }
  },

    // 更新CPU图表
    updateCpuChart() {
  
      if (!this.cpuChart) return;

      const cpuPercent = Number(this.cpuData.percent);
      const colorRange = this.getCpuColor(cpuPercent);

      const option = {
        title: {
          text: 'CPU使用率',
          left: 'center',
          textStyle: {
            color: '#fff',
            fontSize: 14
          }
        },
        tooltip: {
          trigger: 'item',
          formatter: ({ name, percent }) => 
            `${name}: ${percent}%`
        },
        series: [{
          name: 'CPU Usage',
          type: 'pie',
          radius: ['60%', '80%'],
          center: ['50%', '52%'],
          avoidLabelOverlap: false,
          label: {
            show: true,
            position: 'center',
            formatter: () => [
              `{percent|${this.cpuData.percent}%}`,
              '{name|使用率}'
            ].join('\n'),
            rich: {
              percent: {
                fontSize: 24,
                color: '#36a3eb',
                fontWeight: 'bold',
                lineHeight: 30
              },
              name: {
                fontSize: 12,
                color: '#909399',
                lineHeight: 20
              }
            }
          },
          emphasis: {
            label: {
              show: true,
              fontSize: 24,
              fontWeight: 'bold'
            }
          },
          data: [
            { 
              value: Number(this.cpuData.percent), 
              name: '已使用',
              itemStyle: {
                color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                   { offset: 0, color: colorRange.start },
                { offset: 1, color: colorRange.end }
                ])
              }
            },
            { 
              value: 100 - Number(this.cpuData.percent), 
              name: '空闲',
              itemStyle: {
                color: '#2a2a2a' // 深灰色背景
              }
            }
          ],
          animationDuration: 800,
          animationEasing: 'cubicOut'
        }]
      };

      this.cpuChart.setOption(option, true); // true表示不清除缓存，直接更新
    },

     // 更新内存图表
  updateMemoryChart() {
    if (!this.memoryChart) return;

    const memPercent = Number(this.memoryData.user_percent);
    const colorRange = this.getCpuColor(memPercent); // 复用CPU颜色逻辑

    const option = {
      title: {
        text: `内存使用率 (${memPercent}%)`,
        left: 'center',
        textStyle: {
          color: memPercent >= 90 ? '#ff0000' : 
                memPercent >= 60 ? '#ff9800' : '#37be4e',
          fontSize: 14
        }
      },
      tooltip: {
        trigger: 'item',
        formatter: ({ name, percent }) => 
          `${name}: ${percent}%`
      },
      series: [{
        name: 'Memory Usage',
        type: 'pie',
        radius: ['60%', '80%'],
        center: ['50%', '52%'],
        avoidLabelOverlap: false,
        label: {
          show: true,
          position: 'center',
          formatter: () => `{percent|${memPercent}%}\n{name|使用率}`,
          rich: {
            percent: {
              fontSize: 24,
              color: colorRange.end,
              fontWeight: 'bold',
              lineHeight: 30
            },
            name: {
              fontSize: 12,
              color: '#909399',
              lineHeight: 20
            }
          }
        },
        emphasis: {
          label: {
            show: true,
            fontSize: 24,
            fontWeight: 'bold'
          }
        },
        data: [
          { 
            value: memPercent,
            name: '已使用',
            itemStyle: {
              color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                { offset: 0, color: colorRange.start },
                { offset: 1, color: colorRange.end }
              ])
            }
          },
          { 
            value: 100 - memPercent,
            name: '空闲',
            itemStyle: {
              color: '#2a2a2a'
            }
          }
        ],
        animationDuration: 800,
        animationEasing: 'cubicOut'
      }]
    };

    this.memoryChart.setOption(option, true);
  },


  // 新增CPU进程图表初始化
    async initCpuProcessChart() {
      let retryCount = 0;
      const maxRetries = 5;
      const tryInit = () => {
        const dom = document.getElementById('cpuProcessChart');
        if (dom) {
          if (this.cpuProcessChart) this.cpuProcessChart.dispose();
          try {
            this.cpuProcessChart = echarts.init(dom, 'dark');
            this.updateCpuProcessChart(this.processHistory);
          } catch (error) {
            console.error('CPU进程图表初始化失败:', error);
          }
        } else if (retryCount < maxRetries) {
          retryCount++;
          setTimeout(tryInit, 300);
        }
      };
      this.$nextTick(() => tryInit());
    },

    // 新增内存进程图表初始化
    async initMemoryProcessChart() {
      let retryCount = 0;
      const maxRetries = 5;
      const tryInit = () => {
        const dom = document.getElementById('memoryProcessChart');
        if (dom) {
          if (this.memoryProcessChart) this.memoryProcessChart.dispose();
          try {
            this.memoryProcessChart = echarts.init(dom, 'dark');
            this.updateMemoryProcessChart(this.processHistory);
          } catch (error) {
            console.error('内存进程图表初始化失败:', error);
          }
        } else if (retryCount < maxRetries) {
          retryCount++;
          setTimeout(tryInit, 300);
        }
      };
      this.$nextTick(() => tryInit());
    },

    // 更新CPU进程图表
    updateCpuProcessChart(processData) {
      if (!this.cpuProcessChart) return;
      
      const safeData = Array.isArray(processData) ? processData : [];
      const chartData = safeData.slice(-100).map((item, index) => ({
        index,
        time: item.time,
        value: item.cpu_percent
      }));

      const option = {
        title: {
          text: 'CPU使用趋势',
          left: 'center',
          textStyle: { color: '#fff', fontSize: 14 }
        },
        tooltip: {
          trigger: 'axis',
          formatter: (params) => {
            const data = params[0].data;
            return `时间: ${data.time}<br/>CPU: ${data.value}%`;
          }
        },
        xAxis: {
          type: 'category',
          axisLine: { lineStyle: { color: '#666' } },
          axisLabel: { show: false },
          data: chartData.map(d => d.index)
        },
        yAxis: {
          type: 'value',
          min: 0,
          max: 100,
          interval: 20,
          axisLabel: { color: '#999',
            formatter: (value) => `${value}%`
           },
          splitLine: { 
            show: true,  // 确保显示分割线
            lineStyle: { 
              color: '#333',
              type: 'dashed' 
            } 
          }
        },
        series: [{
          type: 'line',
          showSymbol: false,
          smooth: true,
          data: chartData.map(d => ({
            name: d.time,
            value: [d.index, d.value],
            time: d.time
          })),
          itemStyle: { color: '#ff9f43' },
          lineStyle: { width: 2 },
          areaStyle: {
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
              { offset: 0, color: 'rgba(255,159,67,0.4)' },
              { offset: 1, color: 'rgba(255,159,67,0.05)' }
            ])
          }
        }],
        grid: { top: 40, bottom: 5, left: 5, right: 5 }
      };

      this.cpuProcessChart.setOption(option);
    },

    // 更新内存进程图表
    updateMemoryProcessChart(processData) {
      if (!this.memoryProcessChart) return;
      
        // 添加数据校验和过滤
      const safeData = (Array.isArray(processData) ? processData : [])
        .filter(item => !!item && !!item.time && !!item.mem_percent)
        .map(item => ({
          time: item.time,
          mem_percent: Number(item.mem_percent) || 0
        }));

      // 使用安全数据生成图表数据
      const chartData = safeData.slice(-100).map((item, index) => ({
        index,
        time: item.time,
        value: item.mem_percent
      }));
      const option = {
        title: {
          text: '内存使用趋势',
          left: 'center',
          textStyle: { color: '#fff', fontSize: 14 }
        },
        tooltip: {
          trigger: 'axis',
          formatter: (params) => {
            const data = params[0].data;
            return `时间: ${data.time}<br/>内存: ${data.value}%`;
          }
        },
        xAxis: {
          type: 'category',
          axisLine: { lineStyle: { color: '#666' } },
          axisLabel: { show: false },
          data: chartData.map(d => d.index)
        },
        yAxis: {
          type: 'value',
          min: 0,
          max: 100,
          interval: 20, // 新增间隔配置
          axisLabel: {
            color: '#999',
            formatter: (value) => `${value}%` // 新增百分比格式化
          },
          splitLine: {
            show: true,
            lineStyle: {
              color: '#333',
              type: 'dashed' // 保持虚线样式
            }
          }
        },
        series: [{
          type: 'line',
          showSymbol: false,
          smooth: true,
          data: chartData.map(d => ({
            name: d.time,
            value: [d.index, d.value],
            time: d.time
          })),
          itemStyle: { color: '#2e86de' },
          lineStyle: { width: 2 },
          areaStyle: {
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
              { offset: 0, color: 'rgba(46,134,222,0.4)' },
              { offset: 1, color: 'rgba(46,134,222,0.05)' }
            ])
          }
        }],
        grid: { top: 40, bottom: 5, left: 5, right: 5 }
      };

      this.memoryProcessChart.setOption(option);
    },


    // 窗口缩放处理
    handleChartResize() {
      if (this.cpuChart) {
        this.cpuChart.resize({//CPU图表响应
          animation: {
            duration: 300
          }
        });
      }
      if (this.memoryChart) { // 内存图表响应
      this.memoryChart.resize({
        animation: { duration: 300 }
      });
    }if (this.cpuProcessChart) this.cpuProcessChart.resize();
      if (this.memoryProcessChart) this.memoryProcessChart.resize();

    },

    // 清理资源
    cleanupCharts() {
      if (this.cpuChart) {
        this.cpuChart.dispose();
        this.cpuChart = null;
      }
      if (this.memoryChart) { 
      this.memoryChart.dispose();
      this.memoryChart = null;
      }
      if (this.cpuProcessChart) {
        this.cpuProcessChart.dispose();
        this.cpuProcessChart = null;
      }
      if (this.memoryProcessChart) {
        this.memoryProcessChart.dispose();
        this.memoryProcessChart = null;
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
// const processHistory = serverData.pro_info || []

// console.log('进程图表数据为：',processHistory )

this.processHistory = serverData.pro_info || []

 // 新增强制重新初始化
    this.$nextTick(() => {
      //CPU图表更新
      if (!document.getElementById('cpuChart')) {
        this.initCpuChart();
      } else {
        this.updateCpuChart();
      }

       // 内存图表更新
      if (!document.getElementById('memoryChart')) {
        this.initMemoryChart();
      } else {
        this.updateMemoryChart();
      }

      // CPU进程趋势图
    if (!document.getElementById('cpuProcessChart')) {
      this.initCpuProcessChart();
    } else {
      // 先销毁旧实例
      if (this.cpuProcessChart && !this.cpuProcessChart.isDisposed) {
        this.cpuProcessChart.dispose();
      }
      // 重新初始化
      this.cpuProcessChart = echarts.init(document.getElementById('cpuProcessChart'), 'dark');
      this.updateCpuProcessChart(this.processHistory);
    }

    // 内存进程趋势图
    if (!document.getElementById('memoryProcessChart')) {
      this.initMemoryProcessChart();
    } else {
      // 先销毁旧实例
      if (this.memoryProcessChart && !this.memoryProcessChart.isDisposed) {
        this.memoryProcessChart.dispose();
      }
      // 重新初始化
      this.memoryProcessChart = echarts.init(document.getElementById('memoryProcessChart'), 'dark');
      this.updateMemoryProcessChart(this.processHistory);
    }

    });


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

/* 图表容器 */
.chart-container {
  background: #2a2a2a;
  border-radius: 8px;
  margin-top: 15px;
  overflow: hidden;
}

h2 {
  margin: 0 0 15px 0;
  padding-bottom: 10px;
  border-bottom: 1px solid #333;
  font-size: 20px;
}
</style>