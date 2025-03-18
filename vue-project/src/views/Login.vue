<template>
  <div class="header">
    <img src="" class="logo">
    <h3 class="teamname">SeverM</h3>
  </div>
  <div class="welcome-container">
    <h1>Welcome!</h1>
    <h2>通用的服务器实时监控平台</h2>
    <h2>多服务器核心数据一键可知</h2>
    <h2>自定义数据采集时间，高效监控触手可及</h2>
  </div>
  <div class="buttons">
    <a><span>还没有账号？</span></a>
    <a><span>有账号，现在开始→</span></a>
  </div>
  <div class="box">
    <span class="close-icon1" @click1="closeRegisterBox">
        <el-icon><CircleCloseFilled /></el-icon>
      </span>
    <div class="box-title">登录</div>
    <div class="divider"></div>
    <div class="input-wrapper">
      <span class="input-icon1">
        <el-icon><UserFilled /></el-icon>
      </span>
      <input type="text" v-model="email" placeholder="请输入用户名" class="bar">
    </div>
    <div class="input-wrapper">
      <span class="input-icon2">
        <el-icon><GoodsFilled /></el-icon>
      </span>
      <input :type="passwordType" v-model="password" placeholder="请输入密码" class="bar2" @input="handlePasswordInput">
      <span class="toggle-password" @click="togglePasswordVisibility()"
            v-show="password.length > 0 && (passwordType === 'password' || passwordType === 'text')">
        <el-icon :is="passwordType === 'password'? Hide : View" :key="passwordType" />
      </span>
    </div>
    <button class="login-button" @click="(loginClick)">登录</button>
  </div>
</template>

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
</style>

<style scoped>
body {
  background-color: #000000;
  height: 100vh;
  width: 100vw;
  display: flex;
  flex-direction: column;
}

.teamname {
  position: fixed;
  right: 5px;
  top: 5px;
  color: white;
  font-size: 35px;
  font-family: 'PangMenZhengDao', sans-serif;
}

.welcome-container {
  position: fixed;
  left: 7vw;
  top: 8vh;
  font-family: 'Ubuntu';
  padding: 40px 20px;
  text-align: center;
}

h1 {
  text-align: left;
  margin-bottom: -40px;
  font-size: 180px;
  color: #4095E5;
  font-weight: bold;
  left: 0;
}

h2 {
  left: 0;
  font-size: 40px;
  margin-top: -17px;
  text-align: left;
  font-weight: bold;
  position: relative;
  color: white;
  margin-bottom: 20px;
}

.buttons {
  position: fixed;
  top: 80vh;
  left: 0;
  right: 0;
  font-family: 'Ubuntu';
  text-align: center;
}

a {
  position: relative;
  padding: 2.7vh 6vw;
  background-color: #333333;
  border-radius: 50px;
  color: #999;
  font-size: 1.5em;
  text-decoration: none;
  overflow: hidden;
  transition: 0.5s;
  margin: 5vw;
}

a span {
  position: relative;
  z-index: 3;
  letter-spacing: 0.2em;
}

.box {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  text-align: center;
  width: 60vw;
  max-width: 660px;
  height: 65vh;
  background-color: #333333;
  color: white;
  padding: 20px;
  border-radius: 10px;
}

.box-title {
  margin-top: 1vh;
  font-size: 40px;
  font-weight: bold;
}

.divider {
  width: 70%;
  height: 1px;
  background-color: #BBBBBB;
  margin: 10px auto;
}

.bar,
.bar2 {
  background-color: #4F4F4F;
  border: 1px solid #BBBBBB;
  color: #9A9A9A;
  font-size: 22px;
  box-sizing: border-box;
  border-radius: 15px;
  height: 9vh;
  width: 80%;
  z-index: 2;
  padding-left: 80px;
}

.bar {
  margin: 3.5vh 0 5vh 0;
}

.bar2 {
  margin: 0 0 0 0;
}

.input-wrapper {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
}

.input-icon1,
.input-icon2 {
  position: absolute;
  left: 13%; 
  transform: translateY(-50%);
  color: white;
  font-weight: bold;
  font-size: 50px; 
  z-index: 4; 
}

.input-icon1 {
  top: 50%;
}

.input-icon2 {
  top: 58%;
}

.toggle-password {
  cursor: pointer;
  position: absolute;
  right: 15%;
  top: 50%;
  transform: translateY(-50%);
  color: #9A9A9A;
  z-index: 3;
}

.login-button {
  width: 75%;
  height: 9vh;
  background-color: #2B5F92;
  font-size: 27px;
  font-weight: bold;
  color: white;
  margin-bottom: 2vh;
  z-index: 2;
  margin-top: 5vh;
  margin-bottom: 3.4vh;
  border-radius: 15px;
  border: none;
}

.login-button:hover {
  background-color: #224a73;
  color: white;
}

</style>

<script>
import { useRouter } from 'vue-router';
import { ElMessage } from 'element-plus';
import { UserFilled, GoodsFilled, View, Hide, InfoFilled,
  CircleCloseFilled } from '@element-plus/icons-vue';

export default {
  name: 'LoginPage',
  components: {
    UserFilled,
    GoodsFilled,
    View,
    Hide,
    InfoFilled,
    CircleCloseFilled
  },
  data() {
    return {
      email: '',
      password: '',
      passwordType: 'password'
    };
  },
  methods: {
    async loginClick() {
      try {
        const response = await fetch('http://localhost:8080/agent/login', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            name: this.email,
            password: this.password
          })
        });

        const data = await response.json();

        if (data.message === '登录成功') {
          const token = data.token;
          localStorage.setItem('token', token);//token存到本地
          ElMessage.success(data.message);
          const router = useRouter();
          this.$router.push('/home');
        } else {
          ElMessage.error(data.message);
          this.email = '';
          this.password = '';
        }
      } catch (error) {
        console.error('登录请求出错:', error);
        ElMessage.error('登录失败，请检查网络或稍后重试');
      }
    },
    togglePasswordVisibility() {
      this.passwordType = this.passwordType === 'password' ? 'text' : 'password';
    },
    closeRegisterBox() {
            const router = useRouter();
            this.$router.push('/');
        }
  },
  mounted() {}
};
</script>
