import util from '@/libs/util.js'
import router from '@/router'
import { SYS_USER_LOGIN } from '@/api/sys.user.js'

export default {
  namespaced: true,
  actions: {
    /**
     * @description 登录
     * @param {Object} context
     * @param {Object} payload username {String} 用户账号
     * @param {Object} payload password {String} 密码
     * @param {Object} payload route {Object} 登录成功后定向的路由对象 任何 vue-router 支持的格式
     */
    async login ({ dispatch }, {
      username = '',
      password = ''
    } = {}) {
      const res = await SYS_USER_LOGIN({ username, password })
      // 设置 cookie 一定要存 uuid 和 token 两个 cookie
      // 整个系统依赖这两个数据进行校验和存储
      // uuid 是用户身份唯一标识 用户注册的时候确定 并且不可改变 不可重复
      // token 代表用户当前登录状态 建议在网络请求中携带 token
      // 如有必要 token 需要定时更新，默认保存一天
      util.cookies.set('uuid', res.uuid)
      util.cookies.set('token', res.token)
      // 设置 vuex 用户信息
      await dispatch('p2admin/user/set', { name: res.name }, { root: true })
      console.log('登录完成后调用vuex中的load事件')
      // 用户登录后从持久化数据加载一系列的设置
      await dispatch('load')
    },

    /**
     * @description 注销用户并返回登录页面
     * @param {Object} context
     * @param {Object} payload confirm {Boolean} 是否需要确认
     */
    logout ({ commit, dispatch }, { confirm = false } = {}) {
      /**
       * @description 注销
       */
      async function logout () {
        // 删除cookie
        util.cookies.remove('token')
        util.cookies.remove('uuid')
        // 清空 vuex 用户信息
        await dispatch('p2admin/user/set', {}, { root: true })
        // 跳转路由
        router.push({ name: 'login' })
      }

      logout()
    },

    /**
     * @description 用户登录后从持久化数据加载一系列的设置
     * @param {Object} context
     */
    async load ({ dispatch }) {
      // 加载用户名
      await dispatch('p2admin/user/load', null, { root: true })
    }
  },
}
