<template>
    <div class="headbar-container">
        <div class="top-bar">
            <div class="logo">
                <img src="@/assets/display/icons/stLine-server-l.png" width="36" style="vertical-align: middle;" alt=""
                    srcset="">
                <p>SeverM</p>
            </div>

            <div class="nav-buttons">
                <button :class="{ active: activeButton === 'home' }" @click="navigateTo('home')">
                    主页面
                </button>
                <button :class="{ active: activeButton === 'notice' }" @click="navigateTo('notice')">
                    通知
                </button>
                <button :class="{ active: activeButton === 'teambusiness' }" @click="navigateTo('teambusiness')">
                    团队业务
                </button>
            </div>

            <div class="right-icons">
                <el-icon :class="{ active: activeButton === 'setting' }" @click="navigateTo('setting')">
                    <Setting />
                </el-icon>
                <el-icon :class="{ active: activeButton === 'help' }" @click="navigateTo('help')">
                    <QuestionFilled />
                </el-icon>
            </div>
        </div>

        <div class="content-area">
            <router-view></router-view>
        </div>
    </div>
</template>

<script setup>
    import {
        ref,
        watch
    } from 'vue'
    import {
        useRouter,
        useRoute
    } from 'vue-router'
    import {
        Setting,
        QuestionFilled
    } from '@element-plus/icons-vue'

    const router = useRouter()
    const route = useRoute()
    const activeButton = ref('home')

    // 根据当前路由更新激活状态
    const updateActiveState = () => {
        const path = route.path
        if (path.includes('home')) activeButton.value = 'home'
        else if (path.includes('notice')) activeButton.value = 'notice'
        else if (path.includes('teambusiness')) activeButton.value = 'teambusiness'
        else if (path.includes('setting')) activeButton.value = 'setting'
        else if (path.includes('help')) activeButton.value = 'help'
    }

    // 监听路由变化
    watch(() => route.path, updateActiveState)

    // 初始化状态
    updateActiveState()

    // 导航方法
    const navigateTo = (target) => {
        switch (target) {
            case 'home':
                router.push('/headbar/home')
                break
            case 'notice':
                router.push('/headbar/notice')
                break
            case 'teambusiness':
                router.push('/headbar/display/teambusiness')
                break
            case 'setting':
                router.push('/headbar/setting')
                break
            case 'help':
                router.push('/headbar/help')
                break
        }
    }
</script>


<style scoped>
    @font-face {
        font-family: 'PangMenZhengDao';
        src: url('@/assets/PangMenZhengDaoBiaoTiTiMianFeiBan-2.ttf');
        font-weight: normal;
        font-style: normal;
    }

    @font-face {
        font-family: 'Ubuntu';
        src: url('@/assets/._Ubuntu-M.ttf');
        font-weight: normal;
        font-style: normal;
    }

    .headbar-container {
        background-color: #1a1a1a;
        height: 100vh;
        display: flex;
        flex-direction: column;
    }

    .top-bar {
        display: flex;
        align-items: center;
        padding: 0 20px;
        height: 77px;
        background-color: #29333E;
        border-bottom: 4px solid #4095E5;
        backdrop-filter: blur(8px);
        position: relative;
    }

    .top-bar::after {
        content: '';
        position: absolute;
        bottom: -10px;
        left: 0;
        right: 0;
        height: 6px;
        background: #4095E5;
        filter: blur(6px);
        z-index: -1;
        opacity: 0.7;
    }

    .logo {
        font-size: 1.2rem;
        color: white;
        margin-right: 7vw;
        text-align: start;
        font-family: "Poppins", serif;
        display: flex;
        flex-direction: row;
        align-items: center;
        font-size: 28px;
        justify-content: start;
        font-family: 'PangMenZhengDao', sans-serif;
    }

    .logo p {
        margin-left: 10px;
        margin-top: 0.2rem;
        font-weight: bold;
    }

    .nav-buttons {
        display: flex;
        gap: 9vw;
        flex-grow: 1;
    }

    .nav-buttons button {
        background: transparent;
        border: none;
        color: #B8B5B5;
        font-size: 20px;
        cursor: pointer;
        padding: 5px 0;
        position: relative;
    }

    .nav-buttons button:hover {
        color: white;
    }

    .nav-buttons button.active {
        font-weight: bold;
        color: white;
        transform: scale(1.1);
    }

    .right-icons {
        margin-left: auto;
        display: flex;
        gap: 20px;
    }

    .right-icons .el-icon {
        color: #B8B5B5;
        font-size: 26px;
        cursor: pointer;
        transition: all 0.3s ease;
    }

    .right-icons .el-icon:hover {
        color: #ffffff;
        transform: scale(1.1);
    }

    .right-icons .el-icon.active {
        color:  #4095E5;
        transform: scale(1.1);
    }

    /* 内容区 */
    .content-area {
        flex: 1;
        overflow: auto;
        padding: 20px;
    }
</style>