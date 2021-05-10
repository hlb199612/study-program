// 引入cookies
import cookies from "./util.cookies"

const util = {
  cookies
}

/**
 * @description 更新标题
 * @param {String} title 标题
 */
util.title = function (titleText) {
  const processTitle = process.env.VUE_APP_TITLE || 'study-program'
  window.document.title = `${processTitle}${titleText ? ` | ${titleText}` : ''}`
}

export default util
