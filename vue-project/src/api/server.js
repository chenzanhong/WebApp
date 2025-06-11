import api from "@/api/axios.js";

export async function getServerInfo() {
    // 获取服务器信息
    return api('/agent/list', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    })
}

export async function getServerInfoById(id) {
    // 获取服务器信息
    return api(`/agent/info/${id}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    })
}

// 添加服务器
export async function addServer(data) {
    return api('/agent/install', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        data
    })
}

//搜索
export async function searchServer(hostname) {
    return api('/agent/monitor/'+hostname, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        data
    })
}

export async function getUserInfo(){
    return api('/agent/userInfo', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    })
}

// 删除服务器
export async function deleteServer(serverData) {
    // 使用完整的 API 地址
    const fullUrl = 'http://113.44.170.52:8080/agent/delete';
    
    // 准备请求数据
    const requestData = {
        host: serverData.ip,
        user: serverData.user_name || 'root',
        password: serverData.password || 'your_password_here', // 需要提供密码或从配置中获取
        port: serverData.port || 22, // 默认 SSH 端口
        Host_Name: serverData.platform || ''
    };
    
    console.log('删除服务器请求数据:', requestData);
    
    return api(fullUrl, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': ''
        },
        data: requestData
    })
}