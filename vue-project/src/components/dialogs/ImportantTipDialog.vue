<template>
  <el-dialog
    v-model="visible"
    width="600px"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    :show-close="false"
    class="important-tip-dialog"
  >
    <template #title>
      <span style="color: #fff;font-size: 25px; ">添加服务器重要提示</span>
    </template>
    <div class="tip-content">
      <div class="tip-title">为确保数据的正确采集，请在要监控的服务器上执行下面的操作：</div>
      <ol class="tip-steps">
        <li>
          <strong>下载代理程序的安装脚本：</strong>
          <div class="tip-code">
            sudo curl http://113.44.170.52:8080/combinedscript?hostname=<span v-text="props.hostname"></span> -o install_agent.sh<br>
            或<br>
            sudo wget http://113.44.170.52:8080/combinedscript?hostname=<span v-text="props.hostname"></span> -O install_agent.sh
          </div>
        </li>
        <li>
          <strong>添加执行权限：</strong>
          <div class="tip-code">sudo chmod +x install_agent.sh</div>
        </li>
        <li>
          <strong>运行脚本：</strong>
          <div class="tip-code">./install_agent.sh</div>
        </li>
        <li>
          <strong>验证安装结果：</strong>
          <div class="tip-code">查看服务状态：sudo systemctl status monitor_agent.service</div>
          <div class="tip-code">查看日志确保没有错误发生：sudo journalctl -u monitor_agent.service -f</div>
        </li>
      </ol>
    </div>
    <template #footer>
      <el-button type="primary" class="confirm-btn" @click="handleConfirm">已完成上述操作</el-button>
    </template>
  </el-dialog>
</template>

<script setup>
import { ref, watch, defineProps, defineEmits } from 'vue';

const props = defineProps({
  modelValue: {
    type: Boolean,
    required: true
  },
  hostname:{
    type: String,
    required: true
  }
});
const emit = defineEmits(['update:modelValue', 'confirmed']);

const visible = ref(props.modelValue);

watch(() => props.modelValue, (val) => {
  visible.value = val;
});
watch(visible, (val) => {
  emit('update:modelValue', val);
});

function handleConfirm() {
  visible.value = false;
  emit('confirmed', props.hostname);
}
</script>

<style scoped>
:deep(.el-dialog) {
  /* background-color: #222222 !important;改了好不协调哇，但改颜色是在这里 */
}
:deep(.el-dialog__title) {
  color: #fff !important;
}
.important-tip-dialog {
  --el-dialog-bg-color:rgb(255, 255, 255);
  --el-dialog-title-color: #fff;
  --el-dialog-box-shadow: 0 2px 16px #000a;
}
.tip-content {
  color: #f5f6fa;
  font-size: 16px;
  line-height: 1.85;
  padding: 8px 6px 0 6px;
  max-height: 60vh;
  overflow-y: auto;
  /* 自定义滚动条样式 */
  scrollbar-width: thin;
  scrollbar-color: #37b3ff #23272e;
}
.tip-content::-webkit-scrollbar {
  width: 8px;
}
.tip-content::-webkit-scrollbar-thumb {
  background: #37b3ff;
  border-radius: 4px;
}
.tip-content::-webkit-scrollbar-track {
  background: #23272e;
}
.tip-title {
  margin-bottom: 18px;
  font-size: 18px;
  font-weight: bold;
  color: #ffea70;
  letter-spacing: 1px;
  text-shadow: 0 1px 2px #000a;
}
.tip-steps {
  padding-left: 0;
  margin: 0;
  list-style: none;
}
.tip-steps li {
  margin-bottom: 22px;
  background: rgba(30,38,48,0.85);
  border-radius: 10px;
  padding: 18px 22px 13px 22px;
  box-shadow: 0 2px 10px #0003;
  position: relative;
}
.tip-steps li strong {
  color: #7ed6ff;
  font-size: 16px;
  font-weight: 600;
  display: block;
  margin-bottom: 7px;
}
.tip-steps li:before {
  content: counter(step);
  counter-increment: step;
  position: absolute;
  left: -35px;
  top: 12px;
  font-size: 22px;
  font-weight: bold;
  color: #37b3ff;
  background: #181c23;
  border-radius: 50%;
  width: 28px;
  height: 28px;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 1px 4px #0006;
}
.tip-steps {
  counter-reset: step;
}
.tip-code {
  background: #191e27;
  color: #6cf3ff;
  padding: 10px 18px;
  border-radius: 7px;
  margin: 8px 0 0 0;
  width: 100%;
  font-family: 'JetBrains Mono', 'Consolas', monospace;
  font-size: 15px;
  word-break: break-all;
  letter-spacing: 0.5px;
  box-shadow: 0 1px 6px #0002;
}
.tip-code-inline {
  background: #191e27;
  color: 6BA756;
  padding: 2px 8px;
  border-radius: 4px;
  font-family: 'JetBrains Mono', 'Consolas', monospace;
  font-size: 14px;
}
.tip-desc {
  margin-top: 7px;
  color: #ffd04b;
  font-size: 15px;
}
.confirm-btn {
  width: 220px;
  height: 44px;
  margin: -1% auto;
  display: block;
  border-radius: 24px;
  background: linear-gradient(90deg, #37b3ff 0%, #4f86ff 100%);
  color: #fff;
  font-size: 17px;
  font-weight: 600;
  letter-spacing: 2px;
  border: none;
  box-shadow: 0 2px 8px #1d8fff44;
  transition: background 0.2s;
}
.confirm-btn:hover {
  background: linear-gradient(90deg, #4f86ff 0%, #37b3ff 100%);
  color: #fff;
}
.el-dialog__footer {
  text-align: center;
}

@media (max-width: 700px) {
  .important-tip-dialog {
    --el-dialog-width: 110vw;
  }
  .tip-content {
    font-size: 14px;
    padding: 2px 2px 0 2px;
  }
  .tip-steps li {
    padding: 12px 6px 10px 12px;
  }
  .confirm-btn {
    width: 98vw;
    min-width: 120px;
  }
}
</style>
