<template>
  <!-- 主体内容区域 -->
  <div class="main-content">
    <!-- 表单区域 -->
    <div class="form-section">
      <el-form :model="joinForm" :rules="joinRules" ref="joinFormRef" label-position="left" label-width="225px">

        <!-- 个人信息 -->
        <el-form-item label="新管理员姓名" prop="realName">
          <el-col :span="18">
            <el-input v-model="joinForm.realName" placeholder="请输入新管理员姓名" class="dark-input" />
          </el-col>
        </el-form-item>

        <el-form-item label="新管理员用户名" prop="memberName">
          <el-col :span="18">
            <el-input v-model="joinForm.memberName" placeholder="新管理员用户名" class="dark-input" />
          </el-col>
        </el-form-item>
        <el-form-item label="新管理员邮箱" prop="memberEmail">
          <el-col :span="18">
            <el-input v-model="joinForm.memberEmail" placeholder="请输入新管理员邮箱" class="dark-input" />
          </el-col>
        </el-form-item>


        <el-button type="primary" class="submit-btn" @click="submitJoin">
          提交更换申请
        </el-button>
      </el-form>

    </div>
    <!-- 右侧说明 -->
    <div class="notice-section">
      <div class="notice-box">
        <h2>更换管理员注意事项</h2>
        <div class="notice-content">
          <div>请注意在主页面侧边栏“通知”处查收新管理员方确认邀请的结果。
            若邀请在十个工作日内未被确认，需要重新进行邀请。</div>

        </div>
      </div>
    </div>
  </div>

</template>

<script setup>
import { ref, reactive } from 'vue'
//import { Plus } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'
import { HomeFilled, Setting, ChatDotRound, QuestionFilled, Plus } from '@element-plus/icons-vue';
import src from '@/assets/image.png'; // 使用 import 引入
//const token = localStorage.getItem('token') || ''
// 新增响应式数据
const currentNav = ref('register') // 默认显示注册团队
const joinForm = reactive({
  realName: '',
  memberName: '',
  memberEmail: '',
})

const joinRules = {
  realName: [
    { required: true, message: '请输入新管理员姓名', trigger: 'blur' }
  ],
  memberName: [
    { required: true, message: '请输入新管理员用户名', trigger: 'blur' }
  ],
  memberEmail: [
    { required: true, message: '请输入新管理员邮箱', trigger: 'blur' }
  ],

}

const joinFormRef = ref(null)



const submitJoin = async () => {
  if (!joinFormRef.value) return
  console.log('Submitting join form:', joinForm); // 打印表单数据
  try {
    await joinFormRef.value.validate()
    const requestBody = {
      "realname": joinForm.realName,
      "username": joinForm.memberName,
      "email": joinForm.memberEmail
    };

    const response = await fetch('http://localhost:8080/agent/replaceadmin', {
      method: 'POST',
      body: JSON.stringify(requestBody),
      headers: {
        'Content-Type': 'application/json', // 设置内容类型为 JSON
        'Authorization': localStorage.getItem('token'),// 不需要设置 'Content-Type'
      }
    })

    if (response.ok) {
      ElMessage.success('加入申请提交成功')
    } else {
      ElMessage.error('提交失败，请重试')
    }
  } catch (error) {
    console.error('Validation failed:', error); // 添加调试信息
    ElMessage.error('请填写完整的表单信息');
  }
}

const formDataToJson = (formData) => {
  const jsonObject = {};
  for (const [key, value] of formData.entries()) {
    // 如果值是文件对象，处理为字符串或其他格式
    if (value instanceof File) {
      jsonObject[key] = value; // 或者你可以选择将文件名或其他信息存储在 JSON 中
    } else {
      jsonObject[key] = value;
    }
  }
  return jsonObject;
}

// const submitJoin = async () => {
//   if (!joinFormRef.value) return

//   try {
//     await joinFormRef.value.validate()
//     // 创建 FormData 对象
//     const formData = new FormData()
//     formData.append('companyName', joinForm.companyName)
//     formData.append('realName', joinForm.realName)
//     formData.append('idNumber', joinForm.idNumber)
//     formData.append('idCardFront', joinForm.idCardFront)
//     formData.append('idCardBack', joinForm.idCardBack)
//     console.log(formData);
//     // 发送请求到后端
//     const response = await fetch('http://localhost:8080/agent/joincompany', {
//       method: 'POST',
//       body: formData,
//       headers: {
//         'Content-Type':'application/json',
//         'Authorization': localStorage.getItem('token'), 
//       }
//     })

//     if (response.ok) {
//       ElMessage.success('加入申请提交成功')
//     } else {
//       ElMessage.error('提交失败，请重试')
//     }
//   } catch (error) {
//     console.log('Validation failed:', error); // 添加调试信息
//     ElMessage.error('请填写完整的表单信息')
//   }
// }

// 新增导航切换方法
const switchNav = (type) => {
  currentNav.value = type
}
</script>

<style scoped>
h2 {
  color: #fff;
  font-size: 20px;
  margin-top: 1%;
}

/* ::v-deep是vue3提供的深度选择器，.el-form-item__label是element-plus官方定义的类 */
::v-deep .el-form-item__label {
  color: white;
  font-size: 14px;

}

.toolbar {
  width: 5rem;
  padding: 1rem 0;
  background-color: #1f2931;
  display: flex;
  flex-direction: column;
  gap: 20px;
  border-left: 1px solid #374151;
}

.tool-item {
  text-align: center;
  cursor: pointer;
  color: #bbbbbb;
  transition: color 0.2s ease;
}

.tool-item:hover {
  color: #636161;
}

.active {
  color: #636161 !important;
}

.left-nav,
.notice-box {
  color: #fff !important;
  /* 强制白色字体 */
  text-align: left !important;
  /* 强制左对齐 */

}

.register-container {
  background: black;
  min-height: 100vh;
  display: flex;
  padding: 20px;
}

.left-nav {
  width: 200px;
  background: rgba(94, 118, 144, 0.34);
  padding: 20px;
  border-radius: 4px;
  margin-right: 20px;
  color: #fff !important;
  font-size: 14px;
}

.nav-item {
  padding: 12px;
  cursor: pointer;
  border-radius: 4px;
  margin-bottom: 8px;
}

.nav-item.active {
  background: rgba(187, 187, 187, 0.61);
  color: white;
}

.main-content {
  flex: 1;
  display: flex;
  background: rgba(94, 118, 144, 0.34);
  border-radius: 4px;
  padding: 30px;
}

.form-section {
  flex: 2;
  padding-right: 30px;
}

.notice-section {
  flex: 1;
  border-left: 1px solid #ebeef5;
  padding-left: 30px;
}

.form-tips {
  color: #999;
  font-size: 12px;
  line-height: 1.5;
  margin-top: 8px;
}

.upload-tips {
  font-size: 12px;
  color: #666;
  margin-top: 8px;
}

.id-upload {
  display: flex;
  gap: 20px;
}

.id-card-upload {
  width: 150px;
}

.submit-btn {
  width: 20%;
  margin-top: 30px;
}

.notice-box {
  background: rgba(94, 118, 144, 0.34);
  padding: 20px;
  border-radius: 4px;
  margin-bottom: 20px;
}

.notice-content {
  color: rgba(187, 187, 187, 1);
  line-height: 1.6;
  font-size: 14px;
}

.demo-image__placeholder .block {
  padding: 30px 0;
  text-align: center;
  /* border-right: solid 1px var(--el-border-color); */
  display: inline-block;
  width: 49%;
  box-sizing: border-box;
  vertical-align: top;
}

.demo-image__placeholder .demonstration {
  display: block;
  color: var(--el-text-color-secondary);
  font-size: 14px;
  margin-bottom: 20px;
}

.demo-image__placeholder .el-image {
  padding: 0 5px;
  max-width: 300px;
  max-height: 200px;
}

.demo-image__placeholder.image-slot {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
  background: var(--el-fill-color-light);
  color: var(--el-text-color-secondary);
  font-size: 14px;
}

.demo-image__placeholder .dot {
  animation: dot 2s infinite steps(3, start);
  overflow: hidden;
}

.form-section {
  transition: opacity 0.3s ease;
}

/* 导航项悬停效果 */
.nav-item:hover {
  background: #ecf5ff;
  color: #409eff;
}
</style>