<template>
  <div class="server-list-container">
    <div class="sidebar-header">
      <h3 class="server-list-title">
        <span>服务器列表</span>
      </h3>
      <div class="server-count">
        <span>服务器数量：{{ serverList.length }}</span>
      </div>
    </div>

    <el-scrollbar class="server-scrollbar">
      <el-menu
        active-text-color="#409EFF"
        background-color="#1f2931"
        class="custom-server-menu"
        text-color="#a7b1bb"
        :default-active="activeIndex"
      >
        <el-menu-item
          v-for="server in serverList"
          :key="server.id"
          :index="server.id.toString()"
          @click="selectServer(server)"
          class="server-item"
        >
          <template #title>
            <div class="server-content">
              <el-icon class="server-icon"><Cloudy /></el-icon>
              <div class="server-name">{{ server.host_name }}</div>
            </div>
          </template>
        </el-menu-item>
      </el-menu>
    </el-scrollbar>
    <!-- 操作指南按钮区域 -->
    <div class="guide-container">
      <el-button 
        class="guide-button" 
        type="primary" 
        @click="showGuide"
      >
        <el-icon class="guide-icon"><Warning /></el-icon>
        <span>帮助</span>
      </el-button>
    </div>
    <!-- 自定义帮助弹窗 -->
    <div v-show="guideDialogVisible" class="custom-guide-overlay" @click.self="hideGuide">
      <div class="custom-guide-dialog">
        <div class="custom-guide-header">
          <h2>代理服务操作指南</h2>
          <el-icon class="custom-close-icon" @click="hideGuide">
            <Close />
          </el-icon>
        </div>
        
        <div class="custom-guide-content">
          <!-- 添加代理部分 -->
          <div class="custom-guide-section">
            <div class="custom-section-title">
              <el-icon class="custom-section-icon"><CirclePlus /></el-icon>
              <span>添加代理服务以采集数据</span>
            </div>
            <div class="custom-step">
              <div class="custom-step-number">1</div>
              <div class="custom-step-content">获取配置代理服务的脚本：</div>
            </div>
            <pre class="custom-command">sudo curl http://localhost:8080/combinedscript?hostname=主机名 -o install.sh</pre>
            
            <div class="custom-step">
              <div class="custom-step-number">2</div>
              <div class="custom-step-content">添加执行权限：</div>
            </div>
            <pre class="custom-command">sudo chmod +x install.sh</pre>
            
            <div class="custom-step">
              <div class="custom-step-number">3</div>
              <div class="custom-step-content">执行安装脚本：</div>
            </div>
            <pre class="custom-command">./install.sh</pre>
          </div>
          
          <!-- 删除代理部分 -->
          <div class="custom-guide-section">
            <div class="custom-section-title">
              <el-icon class="custom-section-icon"><CircleClose /></el-icon>
              <span>删除代理服务</span>
            </div>
            <div class="custom-step">
              <div class="custom-step-number">1</div>
              <div class="custom-step-content">获取删除代理服务的脚本：</div>
            </div>
            <pre class="custom-command">sudo curl http://localhost:8080/uninstallcombinedscript?hostname=主机名 -o uninstall.sh</pre>
            
            <div class="custom-step">
              <div class="custom-step-number">2</div>
              <div class="custom-step-content">添加执行权限：</div>
            </div>
            <pre class="custom-command">sudo chmod +x uninstall.sh</pre>
            
            <div class="custom-step">
              <div class="custom-step-number">3</div>
              <div class="custom-step-content">执行卸载脚本：</div>
            </div>
            <pre class="custom-command">./uninstall.sh</pre>
          </div>
          <!-- 修改上报间隔部分 -->
          <div class="custom-guide-section">
            <div class="custom-section-title">
              <el-icon class="custom-section-icon"><Clock /></el-icon>
              <span>修改代理程序上报采集数据的时间间隔</span>
            </div>
            
            <div class="custom-step">
              <div class="custom-step-number">1</div>
              <div class="custom-step-content">进入代理的配置目录：</div>
            </div>
            <pre class="custom-command">cd /opt/monitor/agent/config</pre>
            
            <div class="custom-step">
              <div class="custom-step-number">2</div>
              <div class="custom-step-content">编辑配置文件：</div>
            </div>
            <pre class="custom-command">vim config.yaml</pre>
            <div class="custom-step-tip custom-tip-font">
              <el-icon><Notebook /></el-icon>
              配置文件中的<code>second: 30</code>表示上报间隔为30秒，修改该值即可（单位：秒）
            </div>
            
            <div class="custom-step">
              <div class="custom-step-number">3</div>
              <div class="custom-step-content">重新运行代理服务：</div>
            </div>
            <pre class="custom-command">sudo systemctl restart monitor_agent.service</pre>
            
            <div class="custom-step">
              <div class="custom-step-number">4</div>
              <div class="custom-step-content">（可选）确认服务状态：</div>
            </div>
            <pre class="custom-command">sudo systemctl status monitor_agent.service</pre>
          </div>
        </div>
      </div>
    </div>
  
  </div>
</template>

<script>
import { Warning, CirclePlus, CircleClose, Close, Clock } from '@element-plus/icons-vue';
export default {
  data() {
      return {
          serverList: [],
          token: localStorage.getItem('token') || '',  // 从 localStorage 获取 token
          selectedServer: null,//当前选中的服务器
          activeIndex: '', // 确保已定义activeIndex
          guideDialogVisible: false // 控制指南弹窗显示
      }
  },
    components: {
    Warning,
    CirclePlus,
    CircleClose,
    Close,
    Clock
  },
  watch: {
    // 监听路由变化
    '$route.params.hostname': {
      handler(newHostname) {
        if (newHostname) this.setActiveIndex()
      },
      immediate: true
    },
    // 监听服务器列表变化
    serverList() {
      this.setActiveIndex()
    }
  },
  mounted() {
      this.getserverList();
  },
  
  methods:{
    setActiveIndex() {
      const hostname = this.$route.params.hostname
      if (hostname && this.serverList.length) {
        const target = this.serverList.find(
          server => server.host_name === hostname
        )
        if (target) this.activeIndex = target.id.toString()
      }
    },// 显示帮助弹窗
    showGuide() {
      this.guideDialogVisible = true;
      
      // 防止背景滚动
      document.body.style.overflow = 'hidden';
    },
    
    // 隐藏帮助弹窗
    hideGuide() {
      this.guideDialogVisible = false;
      
      // 恢复背景滚动
      document.body.style.overflow = 'auto';
    },
  
      async getserverList() {
          try {
              const response = await fetch("http://localhost:8080/agent/list", {
                  method: 'GET',  
                  
                  headers: {
                      
                      Authorization: this.token,  // 携带 token
                  },
              }).then(response => {
                  if (!response.ok) {
                      throw new Error('Network response was not ok');
                  }
                  return response;
              })
              
              const data = await response.json();
              console.log(data);
              this.serverList = data.hosts.map(item => ({
              id: item.id,
              host_name: item.host_name,
              ip:item.ip,
              os: item.os,
              platform: item.platform,
              kernel_arch:item.kernel_arch,
              cpu_threshold:item.cpu_threshold,
              mem_threshold:item.mem_threshold,
              }))
              console.log(data);
              console.log(this.serverList);
              this.$emit('serverListUpdated', this.serverList);
          } catch (error) {
              console.error('获取服务器数据失败:', error.response?.data || error.message);
          }
      },
      selectServer(server) {
        this.activeIndex = server.id.toString() // 保持点击时更新
  this.$router.push({
    name: 'MonitorDetail',
    params: { hostname: server.host_name }
  });
},

    handleOpen(key, keyPath) {
      console.log(key, keyPath);
    },
    handleClose(key, keyPath) {
      console.log(key, keyPath);
    }
  }
}
</script>

<style scoped>
/* 容器样式 */
.server-list-container {
  background: #1f2931;
  height: 100vh;
  box-shadow: 4px 0 12px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  height: calc(100vh - 80px); 
}

/* 标题样式 */
.sidebar-header {
  font-weight: 600; /* 加粗 */
  padding: 24px;
  border-bottom: 1px solid #2d3843;
}

/* 标题样式修改部分 */
.server-list-title {
  padding: 0px 0px;
  font-size: 22px; /* 放大字体 */
  font-weight: 600; /* 加粗 */
  margin-bottom: 16px; /* 增加标题与数量的间距 */
  color: #e3eaf2;
}

.server-list-title .el-icon {
  margin-right: 12px;
  font-size: 24px;
  color: #409EFF;
}

/* 滚动条样式 */
.server-scrollbar {
  height: calc(100vh - 120px);
  flex-grow: 1;
}

/* 菜单项深度样式 */
:deep(.custom-server-menu) {
  border-right: none;
  padding: 0 24px;
}

:deep(.custom-server-menu .el-menu-item) {
  height: 60px;
  margin: 8px 0;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  transition: all 0.3s;
}

:deep(.custom-server-menu .el-menu-item:hover) {
  background: #2d3843 !important;
  transform: translateX(4px);
}

:deep(.custom-server-menu .el-menu-item.is-active) {
  background: #409EFF15 !important;
  border-left: 4px solid #409EFF;
}

/* 服务器项内容 */
.server-content {
  display: flex;
  align-items: center;
  gap: 16px;
}

.server-icon {
  font-size: 20px;
  color: #64748b;
  transition: color 0.3s;
}

.server-name {
  color: #e3eaf2;
  font-size: 18px;
  font-weight: 600;
}

/* 服务器数量样式 */
.server-count {
  padding: 16px 24px;
  font-weight: 600; /* 加粗 */
  border-top: 1px solid #2d3843;
  color: #e3eaf2;
  font-size: 16px;
}
/* 操作指南按钮区域 */
.guide-container {
  padding: 20px;
  border-top: 1px solid #2d3843;
  display: flex;
  justify-content: center;
}

.guide-button {
  width: 100%;
  background-color: #2d3843;
  border: none;
  color: #e3eaf2;
  font-weight: bold;
  padding: 15px;
  border-radius: 8px;
  transition: all 0.3s;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);
}

.guide-button:hover {
  background-color: #409EFF;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.4);
}

.guide-icon {
  font-size: 20px;
}

/* 自定义弹窗覆盖层 */
.custom-guide-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.85); /* 加深背景透明度 */
  z-index: 10000;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* 自定义弹窗样式 - 暗色调版本 */
.custom-guide-dialog {
  width: 80%;
  max-width: 800px;
  max-height: 80vh;
  background: linear-gradient(145deg, #121a24, #0d141f); /* 深蓝黑色渐变 */
  border-radius: 16px;
  box-shadow: 0 15px 50px rgba(0, 0, 0, 0.8);
  overflow: hidden;
  position: relative;
  animation: dialog-show 0.4s ease-out;
  border: 1px solid #2a3a4d; /* 添加深色边框 */
}

@keyframes dialog-show {
  from { 
    opacity: 0;
    transform: translateY(40px) scale(0.95);
  }
  to { 
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

/* 弹窗头部样式 - 深色标题栏 */
.custom-guide-header {
  background: linear-gradient(145deg, #1c2533, #161f2d); /* 深蓝渐变 */
  padding: 22px 30px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid #2d4056;
}

.custom-guide-header h2 {
  color: #e6edf8; /* 亮白色文字 */
  font-size: 1.7rem;
  font-weight: 700;
  margin: 0;
  letter-spacing: 0.5px;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.5);
}

/* 关闭按钮 - 银色设计 */
.custom-close-icon {
  color: #a1b9d6; /* 银蓝色调 */
  font-size: 26px;
  cursor: pointer;
  transition: all 0.3s;
  background: rgba(42, 58, 77, 0.5);
  border-radius: 50%;
  padding: 5px;
}

.custom-close-icon:hover {
  color: #ffffff;
  background: rgba(42, 58, 77, 0.8);
  transform: scale(1.1);
}

/* 内容区域样式 - 暗灰渐变 */
.custom-guide-content {
  /* 保留原有样式 */
  padding: 30px;
  background: linear-gradient(to bottom, rgba(25, 30, 40, 0.95), rgba(20, 26, 36, 0.95)); 
  color: #e0e8f0;
  max-height: calc(80vh - 80px);
  overflow-y: auto;
  
  /* 添加垂直滚动条美化 */
  scrollbar-width: thin; /* Firefox兼容 */
  scrollbar-color: #3a7bd5 rgba(25, 30, 40, 0.6); /* Firefox兼容 */
}

/* Webkit内核浏览器专用垂直滚动条样式 */
.custom-guide-content::-webkit-scrollbar {
  width: 10px; /* 垂直滚动条宽度 */
}

.custom-guide-content::-webkit-scrollbar-track {
  background: rgba(25, 30, 40, 0.3); /* 轨道颜色 */
  border-radius: 4px; /* 轨道圆角 */
  margin: 8px 0;
}

.custom-guide-content::-webkit-scrollbar-thumb {
  background: linear-gradient(to bottom, #3a7bd5, #64a5ff); /* 上下渐变滑块 */
  border-radius: 4px; /* 滑块圆角 */
  border: 1px solid rgba(255, 255, 255, 0.15); /* 滑块边框 */
  min-height: 60px; /* 最小高度 */
}

.custom-guide-content::-webkit-scrollbar-thumb:hover {
  background: linear-gradient(to bottom, #4a8bdf, #74b5ff); /* 悬停效果 */
  box-shadow: 0 0 8px rgba(100, 165, 255, 0.7);
}

.custom-guide-content::-webkit-scrollbar-thumb:active {
  background: linear-gradient(to bottom, #2a6bd0, #5495f0); /* 点击效果 */
}

/* 平滑滚动效果 */
.custom-guide-content {
  scroll-behavior: smooth;
}

/* 部分样式 - 深色背景+亮边框 */
.custom-guide-section {
  background: rgba(35, 45, 60, 0.7); /* 半透明深蓝背景 */
  border-radius: 12px;
  padding: 25px;
  margin-bottom: 30px;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
  border: 1px solid #3a4d66; /* 亮蓝色边框 */
}

.custom-guide-section:last-child {
  margin-bottom: 0;
}

/* 部分标题 - 高对比度 */
.custom-section-title {
  font-size: 1.4rem;
  font-weight: bold;
  margin-bottom: 25px;
  display: flex;
  align-items: center;
  color: #64a5ff; /* 亮蓝色标题 */
  padding-bottom: 12px;
  border-bottom: 1px solid #3a4d66; /* 匹配边框颜色 */
}

.custom-section-icon {
  margin-right: 12px;
  font-size: 24px;
  color: #64a5ff; /* 匹配标题蓝色 */
}

/* 步骤样式 */
.custom-step {
  display: flex;
  align-items: flex-start;
  margin-bottom: 20px;
}

.custom-step-number {
  background: linear-gradient(145deg, #64a5ff, #3a7bd5); /* 蓝色渐变 */
  color: white;
  border-radius: 50%;
  width: 28px;
  height: 28px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 12px;
  flex-shrink: 0;
  font-weight: bold;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
}

.custom-step-content {
  margin-top: 3px;
  font-size: 1.1rem;
  font-weight: 500;
  color: #d8e4f5; /* 亮灰文字 */
}



/* 美化自定义命令代码框滚动条 */
.custom-command {
  /* 保留现有样式 */
  background: rgba(15, 22, 35, 0.8);
  color: #e0e8f0;
  padding: 14px;
  border-radius: 8px;
  font-family: 'Courier New', monospace;
  font-size: 15px;
  overflow-x: auto;
  margin: 12px 0 25px 40px;
  box-shadow: inset 0 0 8px rgba(0, 0, 0, 0.5);
  line-height: 1.6;
  border: 1px solid #2a3a4d;
  position: relative;
  
  /* 添加滚动条样式 */
  scrollbar-width: thin; /* Firefox兼容 */
  scrollbar-color: #3a7bd5 rgba(15, 22, 35, 0.8); /* Firefox兼容 */
}

/* Webkit内核浏览器专用滚动条样式 */
.custom-command::-webkit-scrollbar {
  height: 8px; /* 水平滚动条高度 */
}

.custom-command::-webkit-scrollbar-track {
  background: rgba(15, 22, 35, 0.4); /* 轨道颜色 */
  border-radius: 4px; /* 轨道圆角 */
}

.custom-command::-webkit-scrollbar-thumb {
  background: linear-gradient(90deg, #3a7bd5, #64a5ff); /* 渐变色滑块 */
  border-radius: 4px; /* 滑块圆角 */
  border: 1px solid rgba(255, 255, 255, 0.1); /* 滑块边框 */
}

.custom-command::-webkit-scrollbar-thumb:hover {
  background: linear-gradient(90deg, #4a8bdf, #74b5ff); /* 悬停效果 */
  box-shadow: 0 0 6px rgba(100, 165, 255, 0.6);
}

/* 平滑滚动效果 */
.custom-command {
  scroll-behavior: smooth; /* 滚动动画效果 */
}
/* 命令样式 - 代码块设计 */
.custom-command {
  background: rgba(15, 22, 35, 0.8); /* 深蓝背景 */
  color: #e0e8f0; /* 亮白色文字 */
  padding: 14px;
  border-radius: 8px;
  font-family: 'Courier New', monospace;
  font-size: 15px;
  overflow-x: auto;
  margin: 12px 0 25px 40px;
  box-shadow: inset 0 0 8px rgba(0, 0, 0, 0.5);
  line-height: 1.6;
  border: 1px solid #2a3a4d; /* 匹配边框 */
  position: relative;
  
  /* 滚动条美化 */
  scrollbar-width: thin; /* Firefox */
  scrollbar-color: #3a7bd5 rgba(15, 22, 35, 0.8); /* Firefox */
  scroll-behavior: smooth; /* 平滑滚动效果 */
}

/* Webkit浏览器专用滚动条样式 */
.custom-command::-webkit-scrollbar {
  height: 8px; /* 水平滚动条高度 */
}

.custom-command::-webkit-scrollbar-track {
  background: rgba(15, 22, 35, 0.4); 
  border-radius: 4px;
}

.custom-command::-webkit-scrollbar-thumb {
  background: linear-gradient(90deg, #3a7bd5, #64a5ff);
  border-radius: 4px;
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.custom-command::-webkit-scrollbar-thumb:hover {
  background: linear-gradient(90deg, #4a8bdf, #74b5ff);
  box-shadow: 0 0 6px rgba(100, 165, 255, 0.6);
}

.custom-tip-font {
  font-size: 14px; /* 根据需要调整大小，默认16px */
  padding: 10px 15px;
  border-radius: 4px;
  margin-top: 8px;
}
.custom-command::before {
  content: "$ ";
  color: #64a5ff; /* 蓝色$符号 */
  font-weight: bold;
}

/* 添加代码高亮效果 */
.custom-command code {
  color: #64d6ff; /* 代码亮蓝色 */
}



.section-title {
  font-size: 18px;
  font-weight: bold;
  margin-bottom: 20px;
  display: flex;
  align-items: center;
  color: #2c3e50;
}

.section-icon {
  margin-right: 10px;
  font-size: 20px;
  color: #409EFF;
}

.step {
  display: flex;
  align-items: flex-start;
  margin-bottom: 15px;
}

.step-number {
  background: #409EFF;
  color: white;
  border-radius: 50%;
  width: 25px;
  height: 25px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 10px;
  flex-shrink: 0;
}

.step-content {
  margin-top: 3px;
  font-size: 16px;
}

.command {
  background: #1f2931;
  color: #a7b1bb;
  padding: 12px;
  border-radius: 6px;
  font-family: monospace;
  font-size: 14px;
  overflow-x: auto;
  margin: 8px 0 20px 35px;
  box-shadow: inset 0 0 5px rgba(0,0,0,0.5);
  line-height: 1.5;
}

.command::before {
  content: "$ ";
  color: #6c757d;
}
</style>    