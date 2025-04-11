<!-- ServerCard.vue -->
<template>
  <div>
    <div class="server-card">
      <div class="">
        <div class="status-dot" :class="statusClass"></div>
        <div class="server-name">{{ server.host_name }}</div>
      </div>
      <div class="server-details">
        <div class="details">
          <div>操作系统</div>
          <div>架构</div>
          <div>平台</div>
        </div>
        <div class="details">
          <div class="details-a">{{ server.os }}</div>
          <div class="details-a">{{ server.kernel_arch }}</div>
          <div class="details-a">{{ server.platform }}</div>
        </div>
      </div>
      <div class="actions">
        <el-button style="background-color: #636161; color: #ffffff; border-radius: 2rem; border: 0;" plain
                   @click="$emit('delete')">删除
        </el-button>
        <el-button style="background-color: #215476; color: #ffffff; border-radius: 2rem; border: 0;"
                   @click="$emit('disable')">停用
        </el-button>
      </div>
    </div>
  </div>

</template>

<script setup>
import { defineEmits, computed} from 'vue';

const props = defineProps({
  server: {
    type: Object,
    required: true,
  },
});

const emit = defineEmits(['delete', 'disable']);

const statusClass = computed(() => {
  return `dot-${props.server.status}`;
});
</script>

<style scoped>
.server-card {
  margin-top: 1rem;
  margin-left: 1rem;
  width: 11.7rem;
  height: 11.7rem;
  background: url("@/assets/bg1.png");
  opacity: 0.8;
  border-radius: 8px;
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  flex-wrap: wrap;
  transition: transform 0.3s ease;
}

.status-dot {
  background: url("@/assets/green-dot.png");
  width: 18px;
  height: 18px;
  border-radius: 50%;
  position: absolute;
  top: 1rem;
  left: 1rem;
}

.dot-offline {
  background: url("@/assets/display/icons/red-dot.png");
}

.server-name {
  font-size: 1rem;
  font-weight: bold;
  color: white;
}

.server-details {
  display: flex;
  flex-direction: row;
  justify-content: start;
  align-items: start;
}

.details {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  margin-right: 0.5rem;
}

.details div {
  color: #bfbfbf;
  margin: 5px 0;
}

.details-a {
  font-size: 1rem;
  color: #ffffff !important;
  text-align: start;
}

.details div:nth-child(1) {
  font-size: 0.8rem;
}

.details div:nth-child(2) {
  font-size: 0.8rem;
}

.details div:nth-child(3) {
  font-size: 0.8rem;
}

.actions {
  margin-top: 20px;
  color: #ffffff;
}
</style>