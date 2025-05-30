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
    <div class="box-title">重置密码</div>
    <div class="divider"></div>

    <!-- 密码输入框 -->
    <div class="input-wrapper">
      <span class="input-icon1">
        <el-icon><GoodsFilled /></el-icon>
      </span>
      <input :type="passwordType" v-model="password" placeholder="请输入密码" class="bar">
      <span class="toggle-password" @click="togglePasswordVisibility ">
        <el-icon :is="passwordType === 'password'? ElIconHide : ElIconView" />
      </span>
    </div>

    <!-- 确认密码输入框 -->
    <div class="input-wrapper">
      <span class="input-icon1">
        <el-icon><GoodsFilled /></el-icon>
      </span>
      <input :type="confirmPasswordType" v-model="confirmPassword" placeholder="请再次输入密码" @input="checkPasswordMatch" class="bar">
      <span class="toggle-password" @click="toggleConfirmPasswordVisibility">
        <el-icon :is="confirmPasswordType === 'password'? ElIconHide : ElIconView" />
      </span>
      <!-- 密码匹配提示 -->
    <div 
      v-if="showPasswordMatchMessage" 
      class="password-match-message"
      :style="{ color: passwordMatch ? '#67C23A' : '#F56C6C' }"
    >
      {{ passwordMatch ? '两次密码相同' : '两次密码不相同' }}
    </div>
    </div>
    <!-- 邮箱输入框 -->
    <div class="input-wrapper">
      <span class="input-icon1">
        <el-icon><UserFilled /></el-icon>
      </span>
      <input type="text" v-model="email" placeholder="请输入邮箱" class="bar">
    </div>

    <!-- 验证码行修改后的结构 -->
  <div class="code-row">
    <div class="input-wrapper code-input">
      <span class="input-icon1">
        <el-icon><Comment /></el-icon>
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
  <div class="confirm-section">
  <button class="confirm-button" @click="handleConfirm">
    确认
  </button>
</div>
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
  font-size: 33px;
  font-weight: bold;
}

.divider {
  width: 70%;
  height: 1px;
  background-color: #BBBBBB;
  margin: 15px auto;
}

.bar,
bar2 {
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
  margin-bottom: 25px;
}

.input-wrapper:focus-within .toggle-password {
  opacity: 1 !important;
}

.input-icon1,
.input-icon2 {
  position: absolute;
  left: 15%; 
  transform: translateY(-50%);
  color: white;
  font-weight: bold;
  font-size: 40px; 
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
  z-index: 10;
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
/* 新增密码匹配提示样式 */
.password-match-message {
  position: absolute;
  bottom: -20px;
  left: 20%;
  transform: translateX(-50%);
  font-size: 18px;
  width: 100%;
  text-align: center;
  padding-top: 5px;
}


.code-row {
  width: 80%;
  margin: 2vh auto;
  display: flex;
  gap: 10px;
  justify-content: space-between;
  align-items: stretch; /* 确保子项高度相等 */
}

.code-input {
  flex: 2;  /* 输入框占2份 */
  width: 60% !important;
  height: 8vh; 
}

.get-code-btn {
  flex: 1;  /* 按钮占1份 */
  width: 35%;
  height: 7vh;
  background-color: #4095E5;
  border-radius: 10px;
  font-size: 16px;
  /* 移除position: absolute相关属性 */
  position: static;
  margin-top: 0;
}
.get-code-btn:disabled {
  background-color: #666 !important;
  color: #2a16e3 !important;  
  cursor: not-allowed;
  opacity: 0.7;
  transform: none !important;
  box-shadow: none !important;
}

.verification-code-input {
  width: 100% !important;
  padding-right: 0;
}

.get-code-btn:hover {
  background-color: #2B5F92;
  transform: translateY(-1px);
  box-shadow: 0 2px 6px rgba(0,0,0,0.2);
}

.get-code-btn:disabled {
  background-color: #666;
  cursor: not-allowed;
  opacity: 0.7;
}

/* 调整图标位置 */
.code-input .input-icon1 {
  left: 8% !important;
}

/* 添加确认按钮样式 */
.confirm-section {
  width: 100%;
  display: flex;
  justify-content: center;
  margin-top: 0vh;
}

.confirm-button {
  width: 75%;
  height: 8vh;
  background-color: #4095E5;
  border: none;
  border-radius: 10px;
  color: white;
  font-size: 20px;
  font-family: 'Ubuntu';
  font-weight: bold;
  cursor: pointer;
  transition: all 0.3s;
  letter-spacing: 2px;
}

.confirm-button:hover {
  background-color: #2B5F92;
  transform: translateY(-1px);
  box-shadow: 0 2px 8px rgba(0,0,0,0.2);
}

.confirm-button:active {
  transform: translateY(0);
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
    setup() {
        const router = useRouter();
        const password = ref('');
        const confirmPassword = ref('');
        const email = ref('');
        const verificationCode = ref('');
        const passwordType = ref('password');
        const confirmPasswordType = ref('password');
        const passwordMatch = ref(false);
        const showPasswordMatchMessage = ref(false);
        const countdown = ref(0);
        const isCounting = ref(false);

        const validateInputs = () => {
      if (!password.value) {
        ElMessage.error('请输入密码');
        return false;
      }
      if (password.value !== confirmPassword.value) {
        ElMessage.error('两次输入的密码不一致');
        return false;
      }
      if (!email.value) {
        ElMessage.error('请输入注册邮箱');
        return false;
      }
      return true;
    };

    const startCountdown = () => {
      countdown.value = 60;
      isCounting.value = true;
      const timer = setInterval(() => {
        countdown.value--;
        if (countdown.value <= 0) {
          clearInterval(timer);
          isCounting.value = false;
        }
      }, 1000);
    };

   
        const togglePasswordVisibility = () => {
            passwordType.value = passwordType.value === 'password' ? 'text' : 'password';
        };

        const toggleConfirmPasswordVisibility = () => {
            confirmPasswordType.value = confirmPasswordType.value === 'password' ? 'text' : 'password';
        };

        const closeRegisterBox = () => {
            router.push('/');
        };

        const checkPasswordMatch = () => {
      showPasswordMatchMessage.value = password.value !== '' && confirmPassword.value !== '';
      passwordMatch.value = password.value === confirmPassword.value;
    };

    const getVerificationCode = async () => {
      if (!validateInputs()) return;
      
      try {
        const token = localStorage.getItem('token');
                console.log('当前Token:', token);
        const response = await fetch('http://47.86.232.20:8080/agent/request_reset_password', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': ` ${token}`
          },
          body: JSON.stringify({ email: email.value })
        });

        const data = await response.json();
        if (response.ok) {
          ElMessage.success('验证码已发送至您的邮箱');
          startCountdown();
        } else {
          ElMessage.error(data.message || '验证码发送失败');
        }
      } catch (error) {
        console.error('请求失败:', error);
        ElMessage.error('网络请求异常，请稍后重试');
      }
    };

    const handleConfirm = async () => {
  try {
    // 基础验证
    if (!verificationCode.value) {
      ElMessage.error('请输入验证码');
      return;
    }
    
    // 使用已有验证逻辑
    if (!validateInputs()) return;

  

    // 构造请求参数
    const requestBody = {
      token: verificationCode.value,
      new_password: password.value
    };
    console.log('完整请求参数:', requestBody); //输出整个请求对象
    // 发送重置请求
    const response = await fetch('http://47.86.232.20:8080/reset_password', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody)
    });

    // 处理响应
    const result = await response.json();
    if (response.ok) {
      ElMessage.success({
        message: '密码重置成功',
        duration: 1500
      });
      setTimeout(() => router.push('/login'), 1500);
    }  else {
      // 根据状态码和返回信息处理错误
      if (response.status === 404) {
        throw new Error('验证码错误');
      } else if (result?.message?.includes('token')) {
        throw new Error('验证码无效或已过期');
      } else {
        throw new Error('修改密码失败');
      }
    }
  } catch (error) {
    console.error('重置失败:', error);
    // 统一错误提示处理
    let finalMessage = '修改密码失败';
    if (error.message.includes('验证码')) {
      finalMessage = error.message;
    } else if (error.name === 'TypeError') {
      finalMessage = '网络连接失败，请检查网络';
    }
    ElMessage.error(finalMessage);
  }
};

        return {
            password,
            confirmPassword,
            email,
            verificationCode,
            passwordType,
            confirmPasswordType,
            togglePasswordVisibility,
            toggleConfirmPasswordVisibility,
            closeRegisterBox,
            passwordMatch,
            showPasswordMatchMessage,
            checkPasswordMatch,
            getVerificationCode,
            countdown,
            isCounting,
            handleConfirm
        };
    },
    methods: {},
    mounted() {}
};
</script>