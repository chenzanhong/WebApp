<template>
<el-row class="tac">
  <el-col :span="12">
      <h3 class="mb-2" style="color: white">服务器列表</h3>
      <el-menu
        active-text-color="#ffd04b"
        background-color="#545c64"
        class="el-menu-vertical-demo"
        default-active="2"
        text-color="#fff"
        @open="handleOpen"
        @close="handleClose"
      >      
        <el-menu-item v-for="(server,index) in serverList" :key=server.id index="server.id">
          <el-icon><setting /></el-icon>
          <span>服务器{{ server.id }}</span>
        </el-menu-item>
      </el-menu>
    </el-col>
</el-row>
</template>

<script>
export default {
    data() {
        return {
            serverList: [],
            token: localStorage.getItem('token') || '',  // 从 localStorage 获取 token
        }
    },
    mounted() {
        this.getserverList();
    },
    methods:{
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
                this.serverList = data.map(item => ({
                id: item.id,
                host_name: item.host_name,
                os: item.os,
                platform: item.platform,
                kernel_arch:item.kernel_arch,

                }))
                console.log(data);
                console.log(this.serverList);
            } catch (error) {
                console.error('获取服务器数据失败:', error.response?.data || error.message);
            }
        },
        // selectServer(server) {
        //     this.selectedServer = server;
        // }
      handleOpen(key, keyPath) {
        console.log(key, keyPath);
      },
      handleClose(key, keyPath) {
        console.log(key, keyPath);
      }
    }
}
</script>
