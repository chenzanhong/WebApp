<template>
  <div class="header">
    <img src="@/assets/display/icons/stLine-server-l.png" class="logo">
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

    <div class="code-row">
    <div class="input-wrapper code-input">
      <span class="input-icon1">
        <el-icon><Key /></el-icon>
      </span>
      <input 
        type="text" 
        v-model="verificationCode" 
        placeholder="请输入验证码" 
        class="bar verification-code-input"
      >
    </div>
    <button 
    class="get-code-btn" 
    @click="getVerificationCode"
    :disabled="isCounting"
  >
    {{ isCounting ? `${countdown}秒后重试` : '获取验证码' }}
  </button>
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

body {
  background-color: #000000;
  height: 100vh;
  width: 100vw;
  display: flex;
  flex-direction: column;
}

.header {
  position: absolute; 
  right: 2vw;
  top: 2vh; 
  display: flex; 
  align-items: center; 
}

.logo {
  font-size: 35px;
}

.teamname {
  color: white;
  font-size: 35px;
  font-family: 'PangMenZhengDao', sans-serif;
  margin-left: 10px;
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
  font-size: 13px;
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
  width: 58vw;
  min-width: 520px;
  max-width: 660px;
  height: 73vh;
  background-color: #333333;
  color: white;
  padding: 20px 5vw;
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
  font-size: 27px;
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
  font-size: 18px;
  box-sizing: border-box;
  border-radius: 15px;
  height: 7vh;
  width: 100%;
  z-index: 2;
  padding-left: 80px;
  margin: 2vh 0 3vh 0;
}

.bar {
  margin: 1vh 0 2vh 0;
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
  left: 6.7%; 
  transform: translateY(-50%);
  color: white;
  font-weight: bold;
  font-size: 40px; 
  z-index: 4; 
}

.input-icon1 {
  left:5%;
  top: 54%;
}

.input-icon2 {
  left:5%;
 top: 53%;
}

.code-row {
  width: 100%;
  display: flex;
  gap: 10px;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1vh;
}

.code-input {
  flex: 2;
  width: auto !important;
  height: 8vh;
  margin-bottom: 0;
}

.verification-code-input {
  width: 100% !important;
  padding-right: 0;
  margin-top: 3vh;
}

.get-code-btn {
  flex: 1;
  width: auto;
  height: 6vh;
  background-color: #5b5f63;
  border-radius: 10px;
  font-size: 15px;
  position: static;
  margin-top: 1vh;
  white-space: nowrap;
  min-width: 100px;
  color: white;
  transition: all 0.3s ease;
  border: none;
}

.get-code-btn:hover {
  background-color: #575a5d;
}

.get-code-btn:active {
  background-color: #4a4d50;
}

.get-code-btn:disabled {
  background-color: #474a4d;
  cursor: not-allowed;
}

.code-input .input-icon1 {
  left: 8% !important;
  top: 66% !important;
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
  height: 7vh;
  background-color: #2B5F92;
  font-size: 21px;
  font-weight: bold;
  color: white;
  z-index: 2;
  margin-top: 2vh;
  margin-bottom: 2vh;
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
import { UserFilled, GoodsFilled, View, Hide, InfoFilled, Comment, CircleCloseFilled, Key } from '@element-plus/icons-vue';

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
        CircleCloseFilled,
        Key
    },
    data() {
        return {
            username: '',
            email: '',
            password: '',
            confirmPassword: '',
            passwordType: 'password',
            confirmPasswordType: 'password',
            verificationCode: '',
            countdown: 60,
            isCounting: false
        };
    },
    methods: {
        registerClick() {
            if (this.password !== this.confirmPassword) {
                ElMessage.error('两次输入的密码不一致');
                return;
            }

            if (!this.verificationCode) {
                ElMessage.error('请输入验证码');
                return;
            }

            const apiUrl = 'http://113.44.170.52:8080/agent/register';
            const requestData = {
                email: this.email,
                name: this.username,
                password: this.password,
                token: this.verificationCode
            };

            console.log('注册请求数据:', requestData);

            fetch(apiUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(requestData)
            })
            .then(response => response.json())
            .then(data => {
                console.log('注册接口返回数据:', data);
                if (data.message === '注册成功') {
                    ElMessage.success(data.message);
                    this.closeRegisterBox();
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
        },
        getVerificationCode() {
            if (!this.email) {
                ElMessage.error('请先输入邮箱');
                return;
            }

            // 验证邮箱格式
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(this.email)) {
                ElMessage.error('请输入有效的邮箱地址');
                return;
            }

            // 如果正在倒计时，不允许重复获取
            if (this.isCounting) {
                return;
            }

            // 调用获取验证码接口
            fetch('http://113.44.170.52:8080/registertoken', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email: this.email })
            })
            .then(response => response.json())
            .then(data => {
                console.log('验证码接口返回数据:', data);  // 打印完整返回数据
                console.log('返回状态:', data.status);     // 打印状态
                console.log('返回消息:', data.message);    // 打印消息
                
                if (data.message === '验证码已发送') {
                    ElMessage.success('验证码已发送到您的邮箱');
                    this.startCountdown();
                } else {
                    ElMessage.error(data.message || '验证码发送失败');
                }
            })
            .catch(error => {
                console.error('获取验证码失败:', error);
                ElMessage.error('获取验证码失败，请稍后重试');
            });
        },
        startCountdown() {
            this.isCounting = true;
            this.countdown = 60;
            const timer = setInterval(() => {
                this.countdown--;
                if (this.countdown <= 0) {
                    clearInterval(timer);
                    this.isCounting = false;
                }
            }, 1000);
        },
        handlePasswordInput() {
            // Implementation of handlePasswordInput method
        },
        handleConfirmPasswordInput() {
            // Implementation of handleConfirmPasswordInput method
        }
    },
    mounted() {}
};
</script>