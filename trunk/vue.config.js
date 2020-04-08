
module.exports = {
//baseUrl: '/',
//	publicPath: "/static/hm505/hwh",
publicPath:'/hwh', 
  assetsDir: 'assets',
  lintOnSave: false,
  devServer: {
    port: 8083, // 端口号
    host: '0.0.0.0',
    https: false, // https:{type:Boolean}
    open: true, // 配置自动启动浏览器
    disableHostCheck: true,
    // proxy: 'http://localhost:8000' // 配置跨域处理,只有一个代理
    proxy: {
      '/foo': {
        target: '<other_url>'
      },
      '/hwh/api': {
        target: 'http://ycxt.995120.cn:9090',
//      target: 'http://122.224.133.53:9089',
        changeOrigin: true,
        pathRewrite: {
          '^/hwh/api': ''
        }
      },
      '/static': {
        target: 'http://localhost:8000',
        changeOrigin: true,
        pathRewrite: {
          '^/static': '/static'
        }
      },
      '/competitors': {
        target: 'http://localhost:8000',
        changeOrigin: true,
        pathRewrite: {
          '^/competitors': '/competitors'
        }
      }
    }// 配置多个代理
  }
}
