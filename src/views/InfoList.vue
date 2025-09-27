<template>
    <div class="info-container">
        <div class="info-item">
            <!-- 状态筛选栏 -->
            <div class="status-filter">
                <button
                    v-for="status in statusFilters"
                    :key="status.type"
                    :class="{ active: selectedStatus === status.type }"
                    @click="updateStatus(status.type)"
                >
                    {{ status.label }}
                </button>
            </div>

            <!-- 信息列表 -->
            <div class="info-item">
                <div class="info-header">
                    {{ 
                        selectedCategory === 'all' ? '全部通知' : (selectedCategory === 'received' ? '接收的信息' : '发送的信息') 
                    }} - {{ statusMap[selectedStatus] }}
                </div>
                <div class="message-list">
                    <div 
                        v-for="(item, index) in filteredItems" 
                        class="message-card"
                        :class="item.status"
                    >
                        <div class="message-content">
                            {{ item.content }}
                            <span class="status-tag" :class="item.status">
                                {{ getStatusText(item) }}
                            </span>
                        </div>

                        <!-- 操作按钮，当状态为未确认时显示 -->
                        <div v-if="item.status === 'unconfirmed' && item.category === 'received'" class="action-buttons">
                            <button class="confirm" @click="handleConfirm(item, index)">确认</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import axios from 'axios';
import { eventBus } from '@/utils/eventBus';
import { ElMessage } from 'element-plus';

export default {
    props: {
        selectedCategory: {
            type: String,
            required: true
        },
        selectedStatus: {
            type: String,
            required: true
        }
    },
    data() {
        return {
            allInfo: [], // 存储从后端获取的数据
            statusFilters: [
                { type: 'all', label: '全部状态' },
                { type: 'confirmed', label: '已确认' },
                { type: 'unconfirmed', label: '未确认' },
                { type: 'expired', label: '已过期' }
            ]
        }
    },
    computed: {
        filteredItems() {
            return this.allInfo.filter(item => {
                const categoryMatch = this.selectedCategory === 'all' || 
                    item.category === this.selectedCategory;
                const statusMatch = this.selectedStatus === 'all' || 
                    item.status === this.selectedStatus;
                return categoryMatch && statusMatch;
            });
        },
        statusMap() {
            return {
                all: '全部状态',
                confirmed: '已确认',
                unconfirmed: '未确认',
                expired: '已过期'
            };
        },
        // 添加未读消息计数
    unreadMessageCount() {
      return this.allInfo.filter(item => 
        item.status === 'unconfirmed' && item.category === 'received'
      ).length;
    }
},
 watch: {
    // 监视未读消息数量变化
    unreadMessageCount(newCount) {
      eventBus.emit('unread-count', newCount);
    }
  },
    methods: {
        // 映射状态显示文本
        getStatusText(item) {
            const statusMap = {
                confirmed: '✅ 已确认',
                unconfirmed: '⌛ 未确认',
                expired: '❌ 已过期'
            };
            return statusMap[item.status] || '';
        },

        // 确认处理方法
      async handleConfirm(item, index) {
        try {
            // 1. 立即更新UI状态为已确认 (无需等待API响应)
            this.updateItemStatus(item.id, 'confirmed');
            
            // 2. 发送API请求 
            setTimeout(async () => {
                    try {
                        await this.processConfirm(item.id);
                        console.log('确认请求发送成功');
                    } catch (error) {
                        console.error('确认失败:', error);
                        // 失败时回滚状态
                        this.updateItemStatus(item.id, 'unconfirmed');
                    }
                    }, 0);
            
            // 3. 触发全局事件
            eventBus.emit('decrement-unread', 1);
         
            
            ElMessage.success('通知已确认');
        } catch (error) {
            console.error('处理出错:', error);
        }
        },

        // 更新状态筛选
        updateStatus(status) {
            this.$emit('update-status', status);
        },

        // 修改后的数据获取方法
        async fetchNotifications() {
            try {
                const token = localStorage.getItem('token');
                console.log('当前Token:', token);

                // 并行获取收发通知
                const [receiveRes, sendRes] = await Promise.all([
                    fetch(`http://localhost:8080/agent/info/recivelist`, 
                    //fetch(`http://127.0.0.1:4523/m1/5953319-5641373-default/agent/info/recivelist`, 
                    {
                        headers: { 'Authorization': ` ${token}` }
                    }),
                    fetch(`http://localhost:8080/agent/info/sendlist`,
                    //fetch(`http://127.0.0.1:4523/m1/5953319-5641373-default/agent/info/sendlist`,
                    {
                        headers: { 'Authorization': ` ${token}` }
                    })
                ]);
                // 处理接收通知
                const receiveData = await receiveRes.json();
                console.log('后端传来接收信息:', receiveData);
                const receiveNotices = Array.isArray(receiveData.receiveNotices) ? receiveData.receiveNotices.map(notice => ({
                    id: notice.id || Math.random().toString(36).substr(2, 9),
                    content: notice.content,
                    category: 'received',
                    status: this.mapProcessedStatus(notice.state),
                    rawData: notice
                })) : [];
                // 处理发送通知
                const sendData = await sendRes.json();
                console.log('后端传来发送信息:', sendData);
                const sendNotices = Array.isArray(sendData.sendNotices) ? sendData.sendNotices.map(notice => ({
                    id: notice.id || Math.random().toString(36).substr(2, 9),
                    content: notice.content,
                    category: 'sent',
                    status: this.mapProcessedStatus(notice.state),
                    rawData: notice
                })) : [];
                this.allInfo = [...receiveNotices, ...sendNotices];
                console.log('合并后的通知列表:', this.allInfo);

            } catch (error) {
                console.error('获取通知失败:', error);
            }
        },
        
        // 完善后的状态映射
        mapProcessedStatus(processed) {
            if (typeof processed === 'boolean') {
                return processed ? 'confirmed' : 'unconfirmed';
            }
            const statusMap = {
                unprocessed: 'unconfirmed',
                processed: 'confirmed',
                expired: 'expired'
            };
            return statusMap[processed?.toLowerCase()] || 'expired';
        },

        // 更新本地数据状态
        updateItemStatus(id, newStatus) {
            const index = this.allInfo.findIndex(item => item.id === id);
            if (index !== -1) {
                this.allInfo[index].status = newStatus;
            }
        },

        // 实际处理请求的方法
        async processConfirm(id) {
            const token = localStorage.getItem('token');
            try {
                const response = await axios.post(`http://localhost:8080/agent/info/manage`, { id }, {
                    headers: { Authorization: ` ${token}` }
                });
                console.log('后端响应:', response.data);
                return response.data;
            } catch (error) {
                console.error('请求后端接口失败:', error);
                throw error;
            }
        }
    },
   mounted() {
  // 监听消息减少事件
  eventBus.on('decrement-unread', (count) => {
    const newCount = this.unreadCount > count ? this.unreadCount - count : 0;
    eventBus.emit('unread-count', newCount);
  });
  
  // 初始获取数据
  this.fetchNotifications();
},
beforeUnmount() {
  // 清理事件监听器
  eventBus.off('decrement-unread');
}
};
</script>

<style scoped>

/* 新增状态筛选样式 */
.status-filter {
    display: flex;
    gap: 12px;
    margin-bottom: 20px;
    padding: 10px 0;
    border-bottom: 2px solid #4a5568;
}

.status-filter button {
    padding: 8px 20px;
    border-radius: 20px;
    border: 1px solid #4a5568;
    background: transparent;
    color: #a0aec0;
    cursor: pointer;
    transition: all 0.3s ease;
}

.status-filter button.active {
    background: #4299e1;
    border-color: #4299e1;
    color: white;
}

/* 调整信息卡片状态标识 */
.message-card.confirmed {
    border-left: 4px solid #48bb78;
}

.message-card.unconfirmed {
    border-left: 4px solid #f6e05e;
}

.message-card.expired {
    border-left: 4px solid #f56565;
}

.info-header {
    color: white;
    font-size: 1.5rem;
    padding-bottom: 15px;
    border-bottom: 2px solid #4a5568;
    margin-bottom: 20px;
    display: flex;
    align-items: center;
    gap: 10px;
}

.message-list {
    margin-top: 20px;
}

.message-card {
    background-color: #2d3748;
    border-radius: 8px;
    padding: 16px;
    margin-bottom: 12px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    transition: transform 0.2s;
    color: white; /* 设置字体颜色为白色 */
}

.message-card:hover {
    transform: translateX(5px);
}

/* 申请信息样式 */
.unprocessedApply {
    border-left: 4px solid #4299e1;
}

.processedApply.已同意 {
    border-left: 4px solid #48bb78;
}

.processedApply.已拒绝 {
    border-left: 4px solid #f56565;
}

/* 审核信息样式 */
.unprocessedReview {
    border-left: 4px solid #f6e05e;
}

.processedReview.已被同意 {
    border-left: 4px solid #48bb78;
}

.processedReview.已被拒绝 {
    border-left: 4px solid #f56565;
}

/* 新增待处理状态的边框样式 */
.unprocessedReview.待处理,
.unprocessedApply.待处理 {
    border-left: 4px solid #f6e05e;
}

.status-tag {
    margin-left: 12px;
    padding: 4px 8px;
    border-radius: 4px;
    font-size: 0.9em;
}

.status-tag.已同意,
.status-tag.已被同意 {
    background-color: #48bb7833;
    color: #48bb78;
}

.status-tag.已拒绝,
.status-tag.已被拒绝 {
    background-color: #f5656533;
    color: #f56565;
}

.status-tag.待处理 {
    background-color: #f6e05e33;
    color: #f6e05e;
}

.action-buttons {
    display: flex;
    gap: 8px;
}

.action-buttons button {
    padding: 6px 12px;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    transition: opacity 0.2s;
}

.action-buttons button:hover {
    opacity: 0.8;
}

.agree {
    background-color: #48bb78;
    color: white;
}

.reject {
    background-color: #f56565;
    color: white;
}
</style>    