<template>
    <div>
        <h1>Server Monitor</h1>
        <button @click="goToMonitorPage">服务器详情</button>
    </div>
</template>

<script>
export default {
    name: 'Home',
    methods: {
        goToMonitorPage() {
            this.$router.push('/monitor/root1');
        }
    }
}
</script>

<style>
button {
    padding: 10px 20px;
    background-color: #007BFF;
    color: white;
    border: none;
    border-radius: 5px;
    cursor: pointer;
}

button:hover {
    background-color: #0056b3;
}
</style>
