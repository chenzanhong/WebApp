module.exports = {
  devServer: {
    proxy: {
      "/api": {
        target: "http://113.44.170.52:8080", // 后端地址
        changeOrigin: true, // 修改请求源为目标域名
        // pathRewrite: {
        //   '^/api': '' // 如果后端接口没有统一前缀，可以去掉 /api 前缀
        // },
        secure: false, // 如果是https接口，需要配置这个参数
        ws: true // 如果要代理 websockets
      }
    }
  }
};
