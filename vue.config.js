const resolve = dir => require('path').join(__dirname, dir)

module.exports = {
  publicPath: process.env.VUE_APP_PUBLIC_PATH || '/',
  devServer: {
    host: "127.0.0.1",
    port: 9111, // 端口号
    https: false, // https:{type:Boolean}
    open: false, // 配置自动启动浏览器  open: 'Google Chrome'-默认启动谷歌
    publicPath: process.env.VUE_APP_PUBLIC_PATH || '/',
    disableHostCheck: process.env.NODE_ENV === 'development'
  },
  // 不输出 map 文件
  productionSourceMap: false,
}
