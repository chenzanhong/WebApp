<template>
  <div class="register-container">
    <!-- 左侧导航栏 -->
    <div class="left-nav">
      <h2>团队业务</h2>
      <div 
        class="nav-item" 
        :class="{ active: currentNav === 'register' }"
        @click="switchNav('register')"
      >注册团队</div>
      <div 
        class="nav-item"
        :class="{ active: currentNav === 'join' }"
        @click="switchNav('join')"
      >加入团队</div>
    </div>

    <!-- 主体内容区域 -->
    <div class="main-content">
      <!-- 表单区域 -->
     <div class="form-section" v-if="currentNav === 'register'">
      <div class="form-section">      
        <el-form :model="form" label-position="left"  label-width="225px" class="demo-form">
          <!-- 公司信息 -->
          <el-form-item label="公司营业执照名称" required>
            <el-col :span="18">
            <el-input v-model="form.companyName" placeholder="请输入公司名称" />
             </el-col>
          </el-form-item>

          <el-form-item label="统一社会信用代码" required>
            <el-col :span="18">
            <el-input v-model="form.creditCode" placeholder="请输入公司统一社会信用代码" />
            </el-col>
          </el-form-item>

          <!-- 法人信息 -->
          <el-form-item label="公司法人姓名" required>
            <el-col :span="18">
            <el-input v-model="form.legalPerson" placeholder="请输入公司法人姓名" />
            </el-col>
          </el-form-item>

          <el-form-item label="公司法人身份证号码" required>
            <el-col :span="18">
            <el-input v-model="form.idNumber" placeholder="请输入公司法人身份证号码" />
            </el-col>
          </el-form-item>

          <!-- 上传区域 -->
          <el-form-item label="上传公司营业执照" required>
            <br />
            <el-upload
              action="#"
              list-type="picture-card"
              :auto-upload="false">
              <el-icon><Plus /></el-icon>              
            </el-upload>
          </el-form-item>

          <el-form-item label="上传公司法人身份证（正反面）" required>
            <div class="id-upload">
              <el-upload
                class="id-card-upload"
                action="#"
                list-type="picture-card"
                :auto-upload="false">
                <el-icon><Plus /></el-icon>
                <div>正面</div>
              </el-upload>
              <el-upload
                class="id-card-upload"
                action="#"
                list-type="picture-card"
                :auto-upload="false">
                <el-icon><Plus /></el-icon>
                <div>反面</div>
              </el-upload>
            </div>
          </el-form-item>

          <el-button type="primary" class="submit-btn">提交注册申请</el-button>
        </el-form>
      </div>
     </div>
     <!-- 右侧说明 -->
      <div class="notice-section" v-if="currentNav === 'register'">
        <div class="notice-box">
          <h2>填写公司名称注意事项</h2>
          <div class="notice-content">
                <div>1.请注意区分总公司和分公司</div>
                <div>2.公司名称将用于企业认证，请确保准确性</div>
          </div>
        
    <div class="demo-image__placeholder">
    <div class="block">
      <el-image :src="src" />
    </div>
    </div>

          <div class="notice-box">
          <h2>上传营业执照注意事项</h2>
          <div class="notice-content">
            <div>1.拍摄与所填公司全称一致的营业执照并上传</div>
            <div>2.请确保营业执照上的信息清晰可辨</div>
            <div>3.营业执照信息与公章清晰可辨</div>
            <div>4.如上传复印件/彩印件，请加盖公司公章</div>
          </div>
          </div>
          
          <div class="notice-box">
          <h2>公司注册申请注意事项</h2>
          <div class="notice-content">
            <div>1.请注意区分总公司和分公司</div>
            <div>2.公司名称将用于企业认证，请确保准确性</div>
            </div>
            </div>
        </div>
      </div>

     <div class="form-section" v-if="currentNav === 'join'">
        <div class="form-section">
        <el-form :model="joinForm"  label-position="left" label-width="225px">
          <!-- 公司信息 -->
          <el-form-item label="公司营业执照名称" required>
            <el-col :span="18">
            <el-input 
              v-model="joinForm.companyName" 
              placeholder="请输入公司名称"
              class="dark-input"
            />
            </el-col>
          </el-form-item>

          <!-- 个人信息 -->
          <el-form-item label="姓名" required>
            <el-col :span="18">
            <el-input 
              v-model="joinForm.realName" 
              placeholder="请输入真实姓名"
              class="dark-input"
            />
            </el-col>
          </el-form-item>

          <el-form-item label="身份证号码" required>
             <el-col :span="18">
            <el-input 
              v-model="joinForm.idNumber" 
              placeholder="请输入身份证号码"
              class="dark-input"
            />
            </el-col>
          </el-form-item>

          <!-- 身份证上传 -->
          <el-form-item label="上传身份证（正反面）" required>
            <div class="id-upload">             
              <el-upload
                class="id-card-upload"
                action="#"
                list-type="picture-card"
                :auto-upload="false">
                <el-icon><Plus /></el-icon>
                <div>正面</div>
              </el-upload>
              <el-upload
                class="id-card-upload"
                action="#"
                list-type="picture-card"
                :auto-upload="false">
                <el-icon><Plus /></el-icon>
                <div>反面</div>
              </el-upload>
            </div>
          </el-form-item>

          <el-button 
            type="primary" 
            class="submit-btn"
            @click="submitJoin"
          >
            提交加入申请
          </el-button>
        </el-form>
      </div>
      </div>
      <!-- 右侧说明 -->
      <div class="notice-section" v-if="currentNav === 'join'">
        <div class="notice-box">
          <h2>公司注册申请注意事项</h2>
          <div class="notice-content">
            <div>1.请注意区分总公司和分公司</div>
            <div>2.公司名称将用于企业认证，请确保准确性</div>
        </div>
        
    <div class="demo-image__placeholder">
    <div class="block">
      <el-image :src="src" />
    </div>
    </div>
        
          <div class="notice-box">
          <h2>加入申请注意事项</h2>
          <div class="notice-content">
            <div>1.申请将于三个工作日内被审批，请注意在主页面有侧边栏“通知”处查收审批结果</div>
          </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { Plus } from '@element-plus/icons-vue'

const form = ref({
  companyName: '',
  creditCode: '',
  legalPerson: '',
  idNumber: ''
})
const src="https://cube.elemecdn.com/6/94/4d3ea53c084bad6931a56d5158a48jpeg.jpeg"
// 新增响应式数据
const currentNav = ref('register') // 默认显示注册团队
const joinForm = ref({ inviteCode: '', applicant: '' })

// 新增导航切换方法
const switchNav = (type) => {
  currentNav.value = type
}
</script>

<style scoped>
h2{
    color:#fff;
    font-size:20px;
    margin-top:1%;
}
/* ::v-deep是vue3提供的深度选择器，.el-form-item__label是element-plus官方定义的类 */
::v-deep .el-form-item__label{
  color: white;
  font-size: 14px;
  
}
    


.left-nav,
.notice-box  {
  color: #fff !important; /* 强制白色字体 */
  text-align: left !important; /* 强制左对齐 */

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
  font-size:14px;
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
  background:  rgba(94, 118, 144, 0.34);
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