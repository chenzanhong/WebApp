<template>
  <Teleport to="body">
    <div v-if="visible" class="dialog-overlay">
      <div class="dialog-box">
        <h2 style="padding-top: 1rem; padding-bottom: 5px; border-bottom: 2px solid #bbbbbb;">确认提示</h2>
        <p>确定要删除“{{ serverName }}”吗？</p>

        <div class="button-group">
          <button class="confirm-btn" @click="confirmDelete">确定</button>
          <button class="cancel-btn" @click="closeDialog">取消</button>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup>
import {defineEmits} from "vue";

const props = defineProps({
  visible: Boolean,
  serverName: String, // 服务器名称
});

const emit = defineEmits(["update:visible", "confirm"]);

// 确认删除
const confirmDelete = () => {
  emit("confirm");
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
  width: 400px;
  border-radius: 8px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.3);
  text-align: center;
}

/* 标题 */
.dialog-box h2 {
  color: white;
  font-size: 18px;
  margin-bottom: 15px;
}

/* 提示文字 */
.dialog-box p {
  color: #ddd;
  font-size: 16px;
  margin-bottom: 20px;
}

/* 按钮 */
.button-group {
  display: flex;
  justify-content: space-between;
}

.confirm-btn,
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

.confirm-btn {
  width: 10rem;
  background-color: rgba(39,67,124,0.71);
  margin-right: 10px;
}

.confirm-btn:hover {
  background-color: #0f3ccc;
}

.cancel-btn {
  width: 10rem;
  background-color: rgba(99,97,97,1);
}

.cancel-btn:hover {
  background-color: #545b62;
}
</style>