<template>
  <Teleport to="body">
    <div v-if="visible" class="dialog-overlay">
      <div class="dialog-box">
        <h2 style="padding-top: 1rem; padding-bottom: 5px; border-bottom: 2px solid #BBBBBB;">添加服务器</h2>
        <div class="form-group">
          <label>服务器名称</label>
          <input v-model="server.name" type="text" placeholder="请输入服务器名称"/>
        </div>

        <div class="form-group">
          <label>服务器IP</label>
          <input v-model="server.ip" type="text" placeholder="请输入IP"/>
        </div>

        <div class="form-group-row">
          <div class="form-group">
            <label>端口</label>
            <input v-model="server.port" type="text" placeholder="请输入端口"/>
          </div>
          <div class="form-group">
            <label>操作系统</label>
            <select v-model="server.os">
              <option value="">请选择操作系统</option>
              <option value="linux">Linux</option>
              <option value="windows">Windows</option>
            </select>
          </div>
        </div>

        <div class="form-group">
          <label>密码</label>
          <input v-model="server.password" type="password" placeholder="请输入密码"/>
        </div>

        <div class="button-group">
          <button class="add-btn" @click="submitForm">添加</button>
          <button class="cancel-btn" @click="closeDialog">取消</button>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup>
import {ref, defineEmits} from "vue";

const props = defineProps({
  visible: Boolean,
});

const emit = defineEmits(["update:visible", "submit"]);

const server = ref({
  name: "",
  ip: "",
  port: "",
  os: "",
  password: "",
});

// 提交表单
const submitForm = () => {
  emit("submit", server.value);
  closeDialog();
};

// 关闭弹窗
const closeDialog = () => {
  emit("update:visible", false);
};
</script>

<style scoped>
/* 遮罩层 */
.dialog-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
}

/* 弹窗 */
.dialog-box {
  background: #2a2a2a;
  padding: 20px;
  width: 571px;
  border-radius: 8px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.3);
}

/* 标题 */
.dialog-box h2 {
  color: white;
  font-size: 20px;
  margin-bottom: 15px;
}

/* 输入框 */
.form-group {
  margin-bottom: 15px;
}

.form-group label {
  display: block;
  color: #ddd;
  margin-bottom: 5px;
  font-size: 14px;
}

.form-group input,
.form-group select {
  width: 100%;
  padding: 10px;
  border: 1px solid #444;
  border-radius: 4px;
  background: #3a3a3a;
  color: white;
  font-size: 14px;
  outline: none;
}

/* 端口和操作系统布局 */
.form-group-row {
  display: flex;
  gap: 10px;
}

.form-group-row .form-group {
  flex: 1;
}

/* 按钮 */
.button-group {
  display: flex;
  justify-content: center;
  margin-top: 10px;
}

.add-btn,
.cancel-btn {
  /*flex: 1;*/
  padding: 10px;
  font-size: 16px;
  border-radius: 4px;
  cursor: pointer;
  border: none;
  color: white;
  transition: 0.3s;
}

.add-btn {
  width: 10rem;
  background-color: rgba(39,67,124,0.71);
  margin-right: 5rem;
}

.add-btn:hover {
  background-color: #0056b3;
}

.cancel-btn {
  width: 10rem;
  background-color: #9A9A9A;
}

.cancel-btn:hover {
  background-color: #545b62;
}
</style>
