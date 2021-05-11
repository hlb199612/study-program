/**
 * 该文件启用' @/store/index.js '来导入所有vuex模块
 * 以一次性的方式。不应该有任何理由编辑这个文件。
 */

const files = require.context('./modules', false, /\.js$/)
const modules = {}

files.keys().forEach(key => {
  modules[key.replace(/(\.\/|\.js)/g, '')] = files(key).default
})

export default {
  namespaced: true,
  modules
}
