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