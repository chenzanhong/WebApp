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
  <div class="register-box">
    <span class="close-icon" @click="closeRegisterBox">
        <el-icon><CircleCloseFilled /></el-icon>
      </span>
    <div class="box-title">注册</div>
    <div class="divider"></div>
    <div class="input-wrapper">
      <span class="input-icon1">
        <el-icon><UserFilled /></el-icon>
      </span>
      <input type="text" v-model="username" placeholder="请输入用户名" class="bar">
    </div>

    <div class="input-wrapper">
      <span class="input-icon1">
        <el-icon><Comment /></el-icon>
      </span>
      <input type="text" v-model="email" placeholder="请输入邮箱" class="bar">
    </div>

    <div class="input-wrapper">
      <span class="input-icon2">
        <el-icon><GoodsFilled /></el-icon>
      </span>
      <input :type="passwordType" v-model="password" placeholder="请输入密码" class="bar" @input="handlePasswordInput">
      <span class="toggle-password" @click="togglePasswordVisibility()"
            v-show="password.length > 0 && (passwordType === 'password' || passwordType === 'text')">
        <el-icon :is="passwordType === 'password'? Hide : View" :key="passwordType" />
      </span>
    </div>

    <div class="input-wrapper">
      <span class="input-icon2">
        <el-icon><GoodsFilled /></el-icon>
      </span>
      <input :type="confirmPasswordType" v-model="confirmPassword" placeholder="请再次输入密码" class="bar" @input="handleConfirmPasswordInput">
      <span class="toggle-password" @click="toggleConfirmPasswordVisibility()"
            v-show="confirmPassword.length > 0 && (confirmPasswordType === 'password' || confirmPasswordType === 'text')">
        <el-icon :is="confirmPasswordType === 'password'? Hide : View" :key="confirmPasswordType" />
      </span>
    </div>

    <button class="register-button" @click="registerClick">注册</button>
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

<style>
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

.register-box {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  text-align: center;
  width: 60vw;
  max-width: 660px;
  height: 75vh;
  background-color: #333333;
  color: white;
  padding: 20px;
  border-radius: 10px;
}

.close-icon{
  position: fixed;
  right: 5%; 
  color: white;
  font-weight: bold;
  font-size: 20px; 
  z-index: 4; 
}

.box-title {
  margin-top: 0.5vh;
  font-size: 40px;
  font-weight: bold;
}

.divider {
  width: 70%;
  height: 1px;
  background-color: #BBBBBB;
  margin: 15px auto;
}

.bar,
.bar2 {
  background-color: #4F4F4F;
  border: 1px solid #BBBBBB;
  color: #9A9A9A;
  font-size: 22px;
  box-sizing: border-box;
  border-radius: 15px;
  height: 8vh;
  width: 80%;
  z-index: 2;
  padding-left: 80px;
}

.bar {
  margin: 1.5vh 0 2vh 0;
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
  top: 58%;
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

.register-button {
  width: 75%;
  height: 9vh;
  background-color: #2B5F92;
  font-size: 27px;
  font-weight: bold;
  color: white;
  margin-bottom: 2vh;
  z-index: 2;
  margin-top: 1.7vh;
  margin-bottom: 3.4vh;
  border-radius: 15px;
  border: none;
}

.register-button:hover {
  background-color: #224a73;
  color: white;
}

</style>

<script>
import { useRouter } from 'vue-router';
import { ref } from 'vue';
import { ElMessage } from 'element-plus';
import { ElIcon } from 'element-plus';
import { UserFilled, GoodsFilled, View, Hide, InfoFilled, Comment, CircleCloseFilled } from '@element-plus/icons-vue';

export default {
    name: 'LoginPage',
    components: {
        UserFilled,
        GoodsFilled,
        View,
        Hide,
        InfoFilled,
        Comment,
        ElIcon,
        CircleCloseFilled
    },
    data() {
        return {
            username: '',
            email: '',
            password: '',
            confirmPassword: '',
            passwordType: 'password',
            confirmPasswordType: 'password'
        };
    },
    methods: {
        registerClick() {
            if (this.password!== this.confirmPassword) {
                ElMessage.error('两次输入的密码不一致');
                return;
            }
            const apiUrl = 'http://localhost:8080/agent/register';
            const requestData = {
                email: this.email,
                name: this.username,
                password: this.password
            };

            fetch(apiUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(requestData)
            })
           .then(response => {
                return response.json();
            })
           .then(data => {
                if (data.message === '注册成功') {
                    ElMessage.success(data.message);
                } else {
                    ElMessage.error(data.message);
                }
            })
           .catch(error => {
                console.error('注册失败:', error);
                ElMessage.error('注册失败，请稍后重试');
            });
        },
        togglePasswordVisibility() {
            this.passwordType = this.passwordType === 'password'? 'text' : 'password';
        },
        toggleConfirmPasswordVisibility() {
            this.confirmPasswordType = this.confirmPasswordType === 'password'? 'text' : 'password';
        },
        closeRegisterBox() {
            const router = useRouter();
            this.$router.push('/');
        }
    },
    mounted() {}
};
</script>