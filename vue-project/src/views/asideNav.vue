<template>
   <div class="server-list-container"> <!-- 添加外层容器 -->
<el-row class="tac">
  <el-col :span="12">
    <h3 class="mb-2" style="color: white; font-size: 18px; font-weight: bold;">服务器列表</h3>
      <el-menu
        active-text-color="#ffd04b"
        background-color="#545c64"
        class="el-menu-vertical-demo"
        default-active="2"
        text-color="#fff"
        @open="handleOpen"
        @close="handleClose"
      >      
        <el-menu-item 
        v-for="(server,index) in serverList" 
        :key=server.id
        @click="selectServer(server)"
        >
          <el-icon><setting /></el-icon>
          <span>服务器{{ server.id }}</span>
        </el-menu-item>
      </el-menu>
    </el-col>
</el-row>
   </div>
</template>

<script>
export default {
    data() {
        return {
            serverList: [],
            token: localStorage.getItem('token') || '',  // 从 localStorage 获取 token
            selectedServer: null,//当前选中的服务器
        }
    },
    mounted() {
        this.getserverList();
    },
    methods:{
        async getserverList() {
           try {
                const response = await fetch("http://120.79.200.209:8080/agent/list", {
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
                this.serverList = data.map(item => ({
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
    this.$router.push({
      name: 'MonitorDetail',
      params: { host_name: server.host_name }
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
.server-list-container {
  background-color: #444; /* 设置灰色背景色，可根据需求调整颜色值 */
  border: 1px solid #666; /* 添加边框，可调整边框样式、宽度和颜色 */
  border-radius: 5px; /* 添加圆角，使矩形框边缘更圆润 */
  padding: 10px; /* 添加内边距，让内容和边框有一定间距 */
  height: 100%; /* 新增，使容器占满侧边栏高度 */
  display: flex; /* 新增，用于辅助布局 */
  flex-direction: column; /* 新增，使内容垂直排列 */
  justify-content: flex-start; /* 新增，内容靠顶部排列 */
}
</style>
