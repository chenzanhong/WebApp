<template>
    <div class="info-container">
        <div class="info-item">
            <div class="info-header" >{{ getHeaderText }}</div>

            <!-- 信息列表 -->
            <div class="message-list">
                <div 
                    v-for="item in filteredItems" 
                    :key="item.id" 
                    class="message-card"
                    :class="[item.type, item.status]"
                >
                    <div class="message-content">
                        {{ item.content }}
                        <span v-if="item.status" class="status-tag" :class="item.status">
                            {{ getStatusText(item) }}
                        </span>
                    </div>

                    <!-- 操作按钮，仅当类型为 unprocessedApply 时显示 -->
                    <div v-if="item.type === 'unprocessedApply'" class="action-buttons">
                        <button class="agree" @click="handleAgree(item)">同意</button>
                        <button class="reject" @click="handleReject(item)">拒绝</button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    props: {
        selectedInfo: {
            type: String,
            required: true
        }
    },
    data() {
        return {
            allInfo: [
                { id: 1, content: '"小明"申请加入你创建的"深圳大学"', type: 'unprocessedApply' },
                { id: 2, content: '"小丽"申请加入你创建的"深圳大学"', type: 'processedApply', status: '已同意' },
                { id: 3, content: '"小刘"申请加入你创建的"深圳大学"', type: 'processedApply', status: '已拒绝' },
                { id: 4, content: '你申请加入"杜老师"创建的"软件工程"', type: 'unprocessedReview', status: '待处理' },
                { id: 5, content: '你申请加入"杜老师"创建的"软件工程"', type: 'processedReview', status: '已被同意' },
                { id: 6, content: '你申请加入"杜老师"创建的"软件工程"', type: 'processedReview', status: '已被拒绝' }
            ],
            typeMapping: {
                all: { label: '全部信息' },
                processedApply: { label: '已处理申请' },
                unprocessedApply: { label: '未处理申请' },
                processedReview: { label: '已处理审核' },
                unprocessedReview: { label: '未处理审核' }
            }
        }
    },
    computed: {
        // 过滤显示的条目
        filteredItems() {
            if (this.selectedInfo === 'all') return this.allInfo;
            return this.allInfo.filter(item => item.type === this.selectedInfo);
        },
        // 获取标题文字
        getHeaderText() {
            return this.selectedInfo === 'all' 
                ? `${this.typeMapping.all.icon || ''} ${this.typeMapping.all.label}` 
                : `${this.typeMapping[this.selectedInfo].icon || ''} ${this.typeMapping[this.selectedInfo].label}`;
        }
    },
    methods: {
        // 获取状态显示文字
        getStatusText(item) {
            const statusMap = {
                '已同意': '✅ 已同意',
                '已拒绝': '❌ 已拒绝',
                '已被同意': '✅ 已通过',
                '已被拒绝': '❌ 未通过',
                '待处理': '⏳ 待处理'
            };
            return statusMap[item.status] || '';
        },
        // 是否需要显示操作按钮，修改为仅对 unprocessedApply 显示
        needsAction(item) {
            return item.type === 'unprocessedApply';
        },
        handleAgree(item) {
            console.log('同意处理:', item.id);
            // 这里可以添加实际处理逻辑
        },
        handleReject(item) {
            console.log('拒绝处理:', item.id);
            // 这里可以添加实际处理逻辑
        }
    }
};
</script>

<style scoped>
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