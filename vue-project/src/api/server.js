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