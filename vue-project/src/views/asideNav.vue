<template>
    <div class="aside" style="height: 100%; width: 100%;">
        
        <el-row class="tac" style="height: 100%; width: 100%;">
            <el-col :span="12" style="height: 100%; width: 100%;">
                <el-menu default-active="this.$route.path" router class="el-menu-vertical-demo" @open="handleOpen"
                    @close="handleClose" background-color="#111" text-color="#fff" active-text-color="#ffd04b"
                    style="height: 100%; width: 100%;">
                    <el-submenu index="/PageOne">
                        <template slot="title">
                            <i class="el-icon-location"></i>
                            <span>导航一</span>
                        </template>
                        <el-menu-item-group>
                             <!-- 添加服务器总数显示区域 -->
                             <div class="server - total" style="font-size: 26px; padding: 10px 0 10px 20px; color: white; text-align: left;">
                                <span style="font-weight: bold;">服务器总数：</span><span style="font-weight: bold; color: #999;">2</span>
                            </div>
                            <el-menu-item :index="`/monitor/${$route.params.host_name}/pageone`"
                            style="
                                    margin-top: 20px;
                                    border-radius: 5px;
                                    padding: 20px;
                                    background-color: #222;
                                "
                            >服务器1</el-menu-item>
                            <el-menu-item :index="`/monitor/${$route.params.host_name}/pagetwo`"
                            style="
                                    margin-top: 10px;
                                    border-radius: 5px;
                                    padding: 20px;
                                    background-color: #222;
                                "
                            >服务器2</el-menu-item>
                        </el-menu-item-group>
                    </el-submenu>

                </el-menu>
            </el-col>
        </el-row>
    </div>
</template>

<script>

export default {
    methods: {
        handleOpen(key, keyPath) {
            console.log(key, keyPath);
        },
        handleClose(key, keyPath) {
            console.log(key, keyPath);
        }
    }
}
</script>
