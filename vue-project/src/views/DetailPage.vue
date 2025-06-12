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
          <!-- 左侧容器 -->
        <div class="left-container">
      <!-- 实例信息区域 -->
      <div class="metric-box">
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
      <!-- 右侧容器 -->
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
             <div class="process-charts">
            <div 
              id="cpuUsageTrend"
              class="chart-container"
              style="width: 100%; height: 340px; margin-top: 20px"
            ></div>
             </div>
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
               <div 
              id="memoryProcessChart"
              class="chart-container"
              style="width: 100%; height: 340px; margin-top: 20px"
            ></div>
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
    memoryUsageChart: null,
    cpuUsageChart:null,
    cpuUsageHistory: [],
    memoryUsageHistory:[],
    initialHistoryLoaded: false, // 标记是否已加载初始历史数据
    dataRefreshInterval:null,
  }
},
watch: {
  '$route.params.hostname': {
    handler(newVal) {
      if (newVal) {
        console.log('路由参数变化:', newVal)
        this.fetchServerDetail()
        // 启动定时刷新
        this.startDataRefresh()
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
    this.startDataRefresh();
  } else {
    this.error = "缺少主机名参数";
  }
},
mounted() {
    this.initCpuChart();
    this.initMemoryChart();
    this.initCpuUsageTrendChart();
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
//获取历史数据
   async fetchHistoryData() {
  try {
    const hostname = encodeURIComponent(this.$route.params.hostname)
    const token = localStorage.getItem('token')
    
    // 请求历史数据接口
    const response = await fetch(
      //`http://127.0.0.1:4523/m1/5953319-5641373-default/agent/monitor/1`,
      `http://113.44.170.52:8080//agent/monitor/{hostname}`,
      { headers: { 'Authorization': ` ${token}` } }
    )

    if (!response.ok) throw new Error(`历史数据请求失败: ${response.status}`)
    
    const historyData = await response.json()
    console.log('获取到的历史监控数据:', historyData)
    
    // 检查并处理CPU历史数据
    if (historyData.cpu_info && Array.isArray(historyData.cpu_info)) {
      // 将历史数据存入数组
      const allCpuData = historyData.cpu_info.map(item => ({
        value: item.percent,
        time: new Date(item.cpu_info_created_at).getTime(),
        created_at: item.cpu_info_created_at
      }))
      
      // 按时间戳排序（从新到旧）
      allCpuData.sort((a, b) => b.time - a.time)
      
      // 取最近的30个数据点
      this.cpuUsageHistory = allCpuData.slice(0, 30)
      
      console.log('已加载初始历史数据点:', this.cpuUsageHistory.length)
    } else {
      console.warn('返回的历史数据中没有有效的cpu_info数组')
    }
    
     // 处理内存历史数据
        if (historyData.mem_info && Array.isArray(historyData.mem_info)) {
          const allMemData = historyData.mem_info.map(item => ({
            value: item.user_percent,
            time: new Date(item.mem_info_created_at).getTime(),
            created_at: item.mem_info_created_at
          }))
          
          // 按时间戳排序（从新到旧）
          allMemData.sort((a, b) => b.time - a.time)
          
          // 取最近的30个数据点
          this.memoryUsageHistory = allMemData.slice(0, 30)
          console.log('已加载初始内存历史数据点:', this.memoryUsageHistory.length)
        } else {
          console.warn('返回的历史数据中没有有效的mem_info数组')
        }

    this.initialHistoryLoaded = true
  } catch (error) {
    console.error('获取历史数据失败:', error)
    // 即使失败也标记为已加载，避免阻塞后续流程
    this.initialHistoryLoaded = true
  }
},
//获取实时信息
  async fetchServerDetail() {
    try {
      this.loading = true
      this.error = null
      // 如果尚未加载历史数据，先加载历史数据
        if (!this.initialHistoryLoaded) {
          await this.fetchHistoryData()
        }
      const hostname = encodeURIComponent(this.$route.params.hostname)
      const token = localStorage.getItem('token')
      
      const response = await fetch(
        `http://113.44.170.52:8080/agent/monitor/status/${hostname}`,
        //`http://127.0.0.1:4523/m1/5953319-5641373-default/agent/monitor/status/1`,
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

  //刷新界面
    async refreshDataOnly() {
      try {
        const hostname = encodeURIComponent(this.$route.params.hostname)
        const token = localStorage.getItem('token')
        
        const response = await fetch(
          //`http://127.0.0.1:4523/m1/5953319-5641373-default/agent/monitor/status/1`,
          `http://113.44.170.52:8080/agent/monitor/status/${hostname}`,
          { headers: { 'Authorization': ` ${token}` } }
        )

        if (!response.ok) throw new Error(`请求失败: ${response.status}`)
        
        const serverData = await response.json()
        this.updateData(serverData)
        
      } catch (error) {
        console.error('数据刷新失败:', error)
        // 错误处理可以更轻量级，不需要重置整个界面
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


   // 初始化CPU使用率趋势图表
   async initCpuUsageTrendChart() {
  let retryCount = 0;
  const maxRetries = 5;
  
  const tryInit = () => {
    const dom = document.getElementById('cpuUsageTrend');
    
    if (dom) {
      if (this.cpuUsageChart) this.cpuUsageChart.dispose();
      
      try {
        this.cpuUsageChart = echarts.init(dom, 'dark');
        console.log('CPU趋势图初始化成功');
        this.updateCpuUsageTrendChart();
      } catch (error) {
        console.error('CPU趋势图初始化失败:', error);
      }
    } else if (retryCount < maxRetries) {
      retryCount++;
      console.warn(`第 ${retryCount} 次重试查找CPU趋势图容器...`);
      setTimeout(tryInit, 300);
    } else {
      console.error(`无法找到CPU趋势图容器，已尝试 ${maxRetries} 次`);
    }
  };

  // 在nextTick中尝试初始化，确保DOM已更新
  this.$nextTick(() => tryInit());
},

    // 新增内存进程图表初始化
    async initMemoryProcessChart() {
      let retryCount = 0;
      const maxRetries = 5;
      
      const tryInit = () => {
        const dom = document.getElementById('memoryProcessChart'); // 使用内存进程图表容器
        if (dom) {
          if (this.memoryUsageChart) this.memoryUsageChart.dispose();
          
          try {
            this.memoryUsageChart = echarts.init(dom, 'dark');
            console.log('内存趋势图初始化成功');
            this.updateMemoryUsageTrendChart(); // 初始化后立即更新数据
          } catch (error) {
            console.error('内存趋势图初始化失败:', error);
          }
        } else if (retryCount < maxRetries) {
          retryCount++;
          setTimeout(tryInit, 300);
        }
      };

      this.$nextTick(() => tryInit());
    },

   // 更新CPU使用率趋势图表
    updateCpuUsageTrendChart() {
      if (!this.cpuUsageChart) return;

      // 处理历史数据
      const cpuhistory = this.cpuUsageHistory.slice(-30);
      const data = cpuhistory.map((item, index) => ({
        x: index, // 使用索引作为X轴
        y: item.value,
        time: item.time // 保留时间戳用于tooltip
      }));

      const option = {
        title: {
          text: 'CPU使用率趋势',
          left: 'center',
          textStyle: { color: '#fff', fontSize: 14 }
        },
         tooltip: {
      trigger: 'axis',
      backgroundColor: 'rgba(40, 40, 40, 0.9)', // 深色背景
      borderColor: '#4ECDC4', // 边框颜色匹配折线
      borderWidth: 1,
      axisPointer: {
    type: 'none' // 禁用指示线
  },
      textStyle: {
        color: '#fff',
        fontSize: 12
      },
      formatter: (params) => {
        const point = params[0];
        const date = new Date(point.data.time);
        // 格式化日期时间：YYYY-MM-DD HH:mm:ss
        const formattedDate = `${date.getFullYear()}-${(date.getMonth()+1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')} ${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}:${date.getSeconds().toString().padStart(2, '0')}`;
        
        // 使用HTML自定义tooltip布局
        return `
          <div style="margin: 5px 0;">
            <div style="font-weight: bold; margin-bottom: 5px;">${formattedDate}</div>
            <div style="display: flex; align-items: center;">
              <span style="display: inline-block; width: 10px; height: 10px; background: ${point.color}; border-radius: 50%; margin-right: 5px;"></span>
              <span>CPU使用率: ${point.data.y.toFixed(1)}%</span>
            </div>
          </div>
        `;
      }
    },
        xAxis: {
          type: 'category',
          axisLine: { lineStyle: { color: '#666' } },
          axisLabel: { 
            show: true, 
            color: '#999',
            formatter: (index) => {
              const seconds = Math.round(index * 30); 
              return `${seconds}s`;
            }
          },
          boundaryGap: false,
          data: data.map(item => item.x)
        },
        yAxis: {
          type: 'value',
          min: 0,
          max: 100,
          interval: 20,
          axisLabel: { 
            color: '#999', 
            formatter: (value) => `${value}%` 
          },
          splitLine: { 
            show: true, 
            lineStyle: { color: '#333', type: 'dashed' } 
          }
        },
        series: [{
          name: 'CPU使用率',
          type: 'line',
          showSymbol: false, // 显示数据点
          symbol: 'circle', // 设置为圆形
          symbolSize: 8,    // 调整圆点大小（推荐6-10）
          smooth: true,
          data: data.map(item => item.y),
          itemStyle: {
            color: '#fff',      // 圆点填充色
            borderColor: '#4ECDC4', // 圆点边框色
            borderWidth: 2       // 边框粗细
          },
           emphasis: {  // 鼠标悬停时放大效果
              itemStyle: {
                borderColor: '#ffeb3b', // 悬停时边框变为黄色
                borderWidth: 3,
                symbolSize: 12
              }
            },
          lineStyle: {
            width: 2,
            color: '#4ECDC4' 
           },
          areaStyle: {
            color: new echarts.graphic.LinearGradient(
              0, 0, 0, 1,
              [{ offset: 0, color: 'rgba(78, 205, 196, 0.4)' }],
              false
            )
          }
        }],
        grid: { top: 40, bottom: 5, left: 5, right: 5 }
      };

      this.cpuUsageChart.setOption(option, true); // 不清除动画直接更新
    },


    // 更新内存进程图表
     updateMemoryUsageTrendChart() {
      if (!this.memoryUsageChart) return;

      // 处理历史数据
      const memHistory = this.memoryUsageHistory.slice(-30);
      if (memHistory.length === 0) return;

      const data = memHistory.map((item, index) => ({
        x: index, // 使用索引作为时间轴（假设30秒间隔）
        y: item.value,
        time: item.time // 保存时间戳用于tooltip显示
      }));

      const option = {
        title: {
          text: '内存使用率趋势',
          left: 'center',
          textStyle: { color: '#fff', fontSize: 14 }
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
    type: 'none' // 禁用指示线
  },
          formatter: (params) => {
            const date = new Date(params[0].data.time);
            return `时间: ${date.toLocaleTimeString()}\n使用率: ${params[0].data.y.toFixed(1)}%`;
          }
        },
        xAxis: {
          type: 'category',
          axisLine: { lineStyle: { color: '#666' } },
          axisLabel: { 
            show: true, 
            color: '#999',
            formatter: (index) => `${index * 30}s` // 显示相对时间间隔
          },
          boundaryGap: false,
          data: data.map(item => item.x)
        },
        yAxis: {
          type: 'value',
          min: 0,
          max: 100,
          interval: 20,
          axisLabel: { 
            color: '#999', 
            formatter: (value) => `${value}%` 
          },
          splitLine: { 
            show: true, 
            lineStyle: { color: '#333', type: 'dashed' } 
          }
        },
        series: [{
          name: '内存使用率',
          type: 'line',
          showSymbol: false, // 显示数据点
          symbol: 'circle', // 设置为圆形
          symbolSize: 8,    // 调整圆点大小（推荐6-10）
          smooth: true,
          data: data.map(item => item.y),
          itemStyle: {
            color: '#fff',      // 圆点填充色
            borderColor: '#6A67CE', // 圆点边框色
            borderWidth: 2       // 边框粗细
          },
           emphasis: {  // 鼠标悬停时放大效果
              itemStyle: {
                borderColor: '#ffeb3b', // 悬停时边框变为黄色
                borderWidth: 3,
                symbolSize: 12
              }
            },
          lineStyle: {
            width: 2,
            color: '#6A67CE'
           },
          areaStyle: {
            // 渐变填充区域
            color: new echarts.graphic.LinearGradient(
              0, 0, 0, 1,
              [
                { offset: 0, color: 'rgba(46, 134, 222, 0.4)' }, // 起始颜色
                { offset: 1, color: 'rgba(46, 134, 222, 0.05)' } // 结束颜色
              ],
              false
            )
          }
        }],
        grid: { top: 40, bottom: 5, left: 5, right: 5 }
      };

      this.memoryUsageChart.setOption(option, true); // 平滑更新图表
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
      if (this.memoryUsageChart) this.memoryUsageChart.resize();

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
      if (this.memoryUsageChart) {
        this.memoryUsageChart.dispose();
        this.memoryUsageChart = null;
      }
    },


    // 新增：只刷新数据的定时器
    startDataRefresh() {
      // 先停止可能存在的旧定时器
      this.stopRefresh()
      
      // 启动新的数据刷新定时器
      this.dataRefreshInterval = setInterval(() => {
        this.refreshDataOnly();
      }, 10000)
    },
    
    // 修改停止刷新方法
    stopRefresh() {
      if (this.refreshInterval) {
        clearInterval(this.refreshInterval)
        this.refreshInterval = null
      }
      if (this.dataRefreshInterval) {
        clearInterval(this.dataRefreshInterval)
        this.dataRefreshInterval = null
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
 // 获取最新CPU使用率并添加到历史记录
      const latestCpuPercent = this.cpuData.percent;
      this.cpuUsageHistory.push({
        value: latestCpuPercent,
        time: Date.now() // 记录时间戳
      });
       // 限制历史记录长度
      if (this.cpuUsageHistory.length > 100) {
        this.cpuUsageHistory.shift();
      }

      // 更新趋势图表（无需重新初始化，直接更新数据）
      if (this.cpuProcessChart) {
        this.updateCpuUsageTrendChart();
      }
// 内存数据
this.memoryData = {
total:serverData.mem_info?.total || 'N/A',
used: serverData.mem_info?.used || 'N/A',
user_percent: serverData.mem_info?.user_percent?.toFixed(1) || 0.00
}
 const latestMemPercent = Number(this.memoryData.user_percent);
      if (!isNaN(latestMemPercent)) {
        this.memoryUsageHistory.push({
          value: latestMemPercent,
          time: Date.now()
        });
        // 限制历史记录长度
        if (this.memoryUsageHistory.length > 100) {
          this.memoryUsageHistory.shift();
        }
      }

      // 更新内存趋势图表
      if (this.memoryUsageChart) {
        this.updateMemoryUsageTrendChart();
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

// 只更新图表，不重新初始化组件
      this.updateCpuChart();
      this.updateMemoryChart();
      
      if (this.cpuUsageChart) {
        this.updateCpuUsageTrendChart();
      }
      
      if (this.memoryUsageChart) {
        this.updateMemoryUsageTrendChart();
      }
    },


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
  grid-template-columns: 1fr 2fr; /* 左侧1份，右侧2份 */
  gap: 20px;
  padding: 20px;
   height: calc(100vh - 160px); /* 根据导航栏高度调整 */
  min-height: 600px; /* 最小高度保障 */
}

.left-container {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.right-container {
  display: grid;
  grid-template-columns: repeat(2, 1fr); /* 两列布局 */
  gap: 20px;
  align-items: start;
  height: 100%;
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