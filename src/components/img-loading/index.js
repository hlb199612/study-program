
const NAME = 'ImgLoading'

export default {
  name: NAME,
  render (h) {
    return <img src={ this.url } />
  },
  props: ['src'], // 父组件传过来所需的url
  data () {
    return {
      url: require('./img/loading-im.svg') // 先加载loading.gif
    }
  },
  mounted () {
    var newImg = new Image()
    newImg.src = this.src
    newImg.onerror = () => { // 图片加载错误时的替换图片
      newImg.src = require('./img/loading-error.svg')
    }
    newImg.onload = () => { // 图片加载成功后把地址给原来的img
      this.url = newImg.src
    }
  }
}
