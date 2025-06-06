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
  </div>
</template>

<script>
export default {
   data() {
       return {
           serverList: [],
           token: localStorage.getItem('token') || '',  // 从 localStorage 获取 token
           selectedServer: null,//当前选中的服务器
           activeIndex: '' // 确保已定义activeIndex
       }
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
     },
       async getserverList() {
          try {
               const response = await fetch("http://113.44.170.52:8080/agent/list", {
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
               os: item.os,
               platform: item.platform,
               kernel_arch:item.kernel_arch,

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
</style>    