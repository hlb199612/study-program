# vue-cli4-vant

## 简介

这是基于 vue-cli4 实现的移动端 H5 开发模板，其中包含项目常用的配置及组件封装，可供快速开发使用。

技术栈：vue-cli4 + webpack4 + vant + axios + less + postcss-px2rem

```js
// 安装依赖
npm install

// 本地启动
npm run dev

// 生产打包
npm run build
```

## 配置 vant

vant 是一套轻量、可靠的移动端 Vue 组件库，非常适合基于 vue 技术栈的移动端开发。在过去很长的一段时间内，本人用的移动端 UI 框架都是 vux。后来由于 vux 不支持 vue-cli3，就转用了 vant，不得不说，无论是在交互体验上，还是代码逻辑上，vant 都比 vux 好很多，而且 vant 的坑比较少。

对于第三方 UI 组件，如果是全部引入的话，比如会造成打包体积过大，加载首页白屏时间过长的问题，所以按需加载非常必要。vant 也提供了按需加载的方法。babel-plugin-import 是一款 babel 插件，它会在编译过程中将 import 的写法自动转换为按需引入的方式。

1、安装依赖

```
npm i babel-plugin-import -D
```

2、配置 .babelrc 或者 babel.config.js 文件

```js
// 在.babelrc 中添加配置
{
  "plugins": [
    ["import", {
      "libraryName": "vant",
      "libraryDirectory": "es",
      "style": true
    }]
  ]
}

// 对于使用 babel7 的用户，可以在 babel.config.js 中配置
module.exports = {
  plugins: [
    ['import', {
      libraryName: 'vant',
      libraryDirectory: 'es',
      style: true
    }, 'vant']
  ]
};
```

3、按需引入

你可以在代码中直接引入 Vant 组件，插件会自动将代码转化为方式二中的按需引入形式

```js
import Vue from 'vue'
import { Button } from 'vant'

Vue.use(Button)
```

## rem 适配

移动端适配是开发过程中不得不面对的事情。在此，我们使用 postcss 中的 px2rem-loader，将我们项目中的 px 按一定比例转化 rem，这样我们就可以对着蓝湖上的标注写 px 了。

我们将 html 字跟字体设置为 100px，很多人选择设置为 375px，但是我觉得这样换算出来的 rem 不够精确，而且我们在控制台上调试代码的时候无法很快地口算得出它本来的 px 值。如果设置 1rem=100px，这样我们看到的 0.16rem，0.3rem 就很快得算出原来是 16px，30px 了。

具体步骤如下；

1、安装依赖

```
npm install px2rem-loader --save-dev
```

2、在 vue.config.js 进行如下配置

```js
  css: {
    // css预设器配置项
    loaderOptions: {
      postcss: {
        plugins: [
          require('postcss-px2rem')({
            remUnit: 100
          })
        ]
      }
    }
  },
```

3、在 main.js 设置 html 跟字体大小

```js
import './libs/plugin'
```

还有一种方法，通过配置saas变量，通过css vw 属性进行响应式，后续更新
## axios 请求封装

1、设置请求拦截和响应拦截

2、请求实例挂载

```js
// main.js
import api from '@/api'
Vue.prototype.$api = api

// 使用方法
this.$api
```

## 工具类函数封装

1、添加方法到 vue 实例的原型链上

```js
export default {
  install (Vue, options) {
    Vue.prototype.util = {
      method1(val) {
        ...
      },
      method2 (val) {
       ...
      },
  }
}
```

2、在 main.js 通过 vue.use()注册

```js
import utils from './js/utils'
Vue.use(utils)
```

本文提供以下函数封装

- 获取 url 参数值
- 判断浏览器类型
- 判断 IOS/android
- 校验手机号码
- 检验车牌号
- 校验车架号
- 检验身份证号码
- 日期格式化
- 时间格式化
- 城市格式化
- 压缩图片
- 图片转成 base64

## vue-router 配置

平时很多人对 vue-router 的配置可配置了 path 和 component，实现了路由跳转即可。其实 vue-router 可做的事情还有很多，比如

- 路由懒加载配置
- 改变单页面应用的 title
- 登录权限校验
- 页面缓存配置

#### 路由懒加载配置

Vue 项目中实现路由按需加载（路由懒加载）的 3 中方式：

```js
// 1、Vue异步组件技术：
{
	path: '/home',
	name: 'Home',
	component: resolve => reqire(['../views/Home.vue'], resolve)
}

// 2、es6提案的import()
{
  path: '/',
  name: 'home',
  component: () => import('../views/Home.vue')
}

// 3、webpack提供的require.ensure()
{
	path: '/home',
	name: 'Home',
	component: r => require.ensure([],() =>  r(require('../views/Home.vue')), 'home')
}
```

本项目采用的是第二种方式，为了后续 webpack 打包优化。

#### 改变单页面应用的 title

由于单页面应用只有一个 html，所有页面的 title 默认是不会改变的，但是我们可以才路由配置中加入相关属性，再在路由守卫中通过 js 改变页面的 title

```js
router.afterEach(to => {
  // 判断页面是否需要缓存
  store.commit('p2admin/page/keepAlivePush', to.name)
  // 更改标题
  util.title(to.meta.title)
})
```

#### 登录权限校验

在应用中，通常会有以下的场景，比如商城：有些页面是不需要登录即可访问的，如首页，商品详情页等，都是用户在任何情况都能看到的；但是也有是需要登录后才能访问的，如个人中心，购物车等。此时就需要对页面访问进行控制了。

此外，像一些需要记录用户信息和登录状态的项目，也是需要做登录权限校验的，以防别有用心的人通过直接访问页面的 url 打开页面。

此时。路由守卫可以帮助我们做登录校验。具体如下：

1、配置路由的 meta 对象的 auth 属性

```js
const frameIn = [
  { // 未配置catch则不开启页面缓存
    path: '/',
    name: 'Index',
    meta: {
      title: '首页',
      auth: true
    },
    component: _import('index/') 
  },
  {
    path: '/keep',
    name: 'Keep',
    meta: {
      title: '缓存',
      auth: true,
      catch: true //开启页面缓存
    },
    component: _import('keep/')
  },
  {
    path: '/shop',
    name: 'Shop',
    meta: {
      title: '商品页',
      auth: true,
      catch: true //开启页面缓存
    },
    component: _import('shop/')
  },
]
```

2、在路由首页进行判断。当`to.meta.auth`为`true`(需要登录)，且不存在登录信息缓存时，需要重定向去登录页面

```js
router.beforeEach(async (to, from, next) => {
  // 验证当前路由所有的匹配中是否需要有登录验证的
  if (to.matched.some(r => r.meta.auth)) {
    // 这里暂时将cookie里是否存有token作为验证是否登录的条件
    // 请根据自身业务需要修改
    const token = util.cookies.get('token')
    if (token && token !== 'undefined') {
      next()
    } else {
      // 没有登录的时候跳转到登录界面
      // 携带上登陆成功之后需要跳转的页面完整路径
      next({
        name: 'login',
        query: {
          redirect: to.fullPath
        }
      })
    }
  } else {
    // 不需要身份校验 直接通过
    next()
  }
})
```

#### 页面缓存配置

项目中，总有一些页面我们是希望加载一次就缓存下来的，此时就用到 keep-alive 了。keep-alive 是 Vue 提供的一个抽象组件，用来对组件进行缓存，从而节省性能，由于是一个抽象组件，所以在 v 页面渲染完毕后不会被渲染成一个 DOM 元素。

1、通过配置路由的 meta 对象的 catch 属性值来区分页面是否需要缓存

```js
const frameIn = [
  { // 未配置catch则不开启页面缓存
    path: '/',
    name: 'Index',
    meta: {
      title: '首页',
      auth: true
    },
    component: _import('index/') 
  },
  {
    path: '/keep',
    name: 'Keep',
    meta: {
      title: '缓存',
      auth: true,
      catch: true //开启页面缓存
    },
    component: _import('keep/')
  },
  {
    path: '/shop',
    name: 'Shop',
    meta: {
      title: '商品页',
      auth: true,
      catch: true //开启页面缓存
    },
    component: _import('shop/')
  },
]
```

2、在 app.vue 做缓存判断

```html
 <div id="app">
    <keep-alive :include="keepAlive">
      <router-view />
    </keep-alive>
  </div>
```
```js
 import { mapState } from 'vuex'

  export default {
    name: 'App',
    computed: {
      ...mapState({
        keepAlive: state => state.p2admin.page.keepAlive
      })
    },
    created() {
      console.log(this.keepAlive)
    }
  }
```

## 多环境变量配置

首先我们先来了解一下环境变量，一般情况下我们的项目会有三个环境，本地环境(development)，测试环境(test)，生产环境(production)，我们可以在项目根目录下建三个配置环境变量的文件.env.development，.env.test，.env.production

环境变量文件中只包含环境变量的“键=值”对：

```js
NODE_ENV = 'production'
VUE_APP_ENV = 'production' // 只有VUE_APP开头的环境变量可以在项目代码中直接使用
```

除了自定义的 VUE*APP*\*变量之外，还有两个可用的变量：

- NODE_ENV : "development"、"production" 或 "test"中的一个。具体的值取决于应用运行的模式。
- BASE_URL : 和 vue.config.js 中的 publicPath 选项相符，即你的应用会部署到的基础路径。

下面开始配置我们的环境变量

1、在项目根目录中新建.env.\*

- .env.development 本地开发环境配置

```
NODE_ENV='development'
VUE_APP_ENV = 'development'
```

- env.staging 测试环境配置

```
NODE_ENV='production'
VUE_APP_ENV = 'staging'
```

- env.production 正式环境配置

```
NODE_ENV='production'
VUE_APP_ENV = 'production'
```

为了在不同环境配置更多的变量，我们在 src 文件下新建一个 config/index

```js
// 根据环境引入不同配置 process.env.NODE_ENV
const config = require('./env.' + process.env.VUE_APP_ENV)
module.exports = config
```

在同级目录下新建 env.development.js，env.test.js，env.production.js，在里面配置需要的变量。  
以 env.development.js 为例

```js
module.exports = {
  baseUrl: 'http://localhost:8089', // 项目地址
  baseApi: 'https://www.mock.com/api', // 本地api请求地址
}
```

2、配置打包命令

package.json 里的 scripts 不同环境的打包命令

- 通过 npm run serve 启动本地
- 通过 npm run test 打包测试
- 通过 npm run build 打包正式

```js
"scripts": {
  "dev": "vue-cli-service serve",
  "build": "vue-cli-service build",
  "test": "vue-cli-service build --mode test",
}
```

## vue.config.js 配置

vue-cli3 开始，新建的脚手架都需要我们在 vue.config.js 配置我们项目的东西。主要包括

- 打包后文件输出位置
- 关闭生产环境 souecemap
- 配置 rem 转化 px
- 配置 alias 别名
- 去除生产环境 console
- 跨域代理设置

此外，还有很多属于优化打包的配置，后面会一一道来。

```js
module.exports = {
  // 部署应用包时的基本URL，默认为'/'
  publicPath: './',

  // 将构建好的文件输出到哪里，本司要求
  outputDir: 'dist/static',

  // 放置生成的静态资源(js、css、img、fonts)的目录。
  assetsDir: 'static',

  // 指定生成的 index.html 的输出路径
  indexPath: 'index.html',

  // 是否使用包含运行时编译器的 Vue 构建版本。
  runtimeCompiler: false,

  // 默认情况下 babel-loader 会忽略所有 node_modules 中的文件。如果你想要通过 Babel 显式转译一个依赖，可以在这个选项中列出来。
  transpileDependencies: [],

  // 如果你不需要生产环境的 source map，可以将其设置为 false 以加速生产环境构建。
  productionSourceMap: false,

  // 配置css
  css: {
    // 是否使用css分离插件 ExtractTextPlugin
    extract: true,
    sourceMap: true,
    // css预设器配置项
    loaderOptions: {
      postcss: {
        // options here will be passed to postcss-loader
        plugins: [
          require('postcss-px2rem')({
            remUnit: 100,
          }),
        ],
      },
    },
    // 启用 CSS modules for all css / pre-processor files.
    modules: false,
  },

  // 是一个函数，允许对内部的 webpack 配置进行更细粒度的修改。
  chainWebpack: (config) => {
    // 配置别名
    config.resolve.alias
      .set('@', resolve('src'))
      .set('assets', resolve('src/assets'))
      .set('components', resolve('src/components'))
      .set('views', resolve('src/views'))

    config.optimization.minimizer('terser').tap((args) => {
      // 去除生产环境console
      args[0].terserOptions.compress.drop_console = true
      return args
    })
  },

  // 是否为 Babel 或 TypeScript 使用 thread-loader。该选项在系统的 CPU 有多于一个内核时自动启用，仅作用于生产构建。
  parallel: require('os').cpus().length > 1,

  devServer: {
    host: '0.0.0.0',
    port: 8088, // 端口号
    https: false, // https:{type:Boolean}
    open: false, // 配置自动启动浏览器  open: 'Google Chrome'-默认启动谷歌

    // 配置多个代理
    proxy: {
      '/api': {
        target: 'https://www.mock.com',
        ws: true, // 代理的WebSockets
        changeOrigin: true, // 允许websockets跨域
        pathRewrite: {
          '^/api': '',
        },
      },
    },
  },
}
```

## 基础组件封装

在开发项目过程中，通常会用到很多功能和设计相类似的组件，toast 和 dialog 组件基本是每一个移动端项目都会用到的。为了更好匹配自己公司的 UI 设计风格，我们没有直接用 vant 的 toast 和 dialog 组件，而是自己封装了类似的组件，可供直接调用，如：

```js
this.$toast({ msg: '手机号码不能为空' })

this.$toast({
  msg: '成功提示',
  type: 'success',
})

this.$dialog({
  title: '删除提示',
  text: '是否确定删除此标签？',
  showCancelBtn: true,
  confirmText: '确认',
  confirm(content) {
    alert('删除成功')
  },
})
```

#### toast 传入参数

**Props**

| name | type   | default | description                                                            |
| ---- | ------ | ------- | ---------------------------------------------------------------------- |
| msg  | String | ''      | 弹窗提示语                                                             |
| type | String | ''      | 弹窗类型：success(成功提示),fail(失败提示),warning(警告),loading(加载) |

#### dialog 传入参数

**Props**

| name        | type   | default | description               |
| ----------- | ------ | ------- | ------------------------- |
| title       | String | ''      | 标题                      |
| text        | String | ''      | 文本内容                  |
| type        | String | ''      | 默认纯文本，input(输入框) |
| maxlength   | Number | 20      | 输入的最多字数            |
| confirmText | String | 确定    | 右边按钮                  |
| cancelText  | String | 取消    | 左边按钮                  |

**Events**

| name    | params | description  |
| ------- | ------ | ------------ |
| confirm | null   | 选择后的回调 |
| cancel  | ull    | 取消后的回调 |

#### img-loading 图片加载资源等待组件
**Props**

| name        | type   | default | description               |
| src         | String | ''      | 超链接                     |
```js
 <img-loading
      v-if="banner.image"
      :src="banner.image.url">
 </img-loading>
```
#### img-loading 图片加载资源等待组件
```html
  <!--分享生成海报-->
    <store-poster
      v-on:setPosterImageStatus="setPosterImageStatus"
      :posterImageStatus="posterImageStatus"
      :posterData="posterData"
    ></store-poster>
```
```js
 import { mapState } from 'vuex'

  export default {
    name: 'App',
    data() {
      return {
        posterImageStatus: false,
        posterData: {
                title: "殡仪服务套餐-13998套餐",
                price: "13692.05",
                code:
                  "data:image\/jpeg;base64,iVBORw0KGgoAAAANSUhEUgAAAOEAAADhAQMAAAAEfUA5AAAABlBMVEX\/\/\/8AAABVwtN+AAAACXBIWXMAAA7EAAAOxAGVKw4bAAACZElEQVRYhe2YMY7jMAxFabhw6SP4Js7FDDhALua5iY6g0oUh7v+knJ3Zaqr9U4yACE6eCoYUyU+b\/a7vr4e7n3yY3J+Le+XzjB+bkq74gG6LrfPLcfjl0zE\/E+jo7OWk4fi6F\/\/wazl57vwZdGqw9DRsePoRdHAAWFrww1j80NOM717SkzCcnvwn+v+dRi7Q3C\/bl0wR0FhD3Wz6qCMijac017R0Z0CRC4+6Mzlx\/w6z5ZTS1cLI3Y3FAyC2sZiUPlAoEE3UsAaADL34K3wqpbAUoXWHkXM\/gqdrmZqS0om4ayOLvkfJKDh8mZbCk7lFDbPBX8U9Sq6U1p15iWoGwC4+lslrFDchHRjaAVdvCku99tTIaqairPcnN4oJOvHJ\/2F\/oy+hQ7WFucCrhxq2sm60LCNC+u6N6OKoIC2cOIfsEVKmQYhAj340YEufHkqKRdW8F9663JCrFIZKut5tkWmwRO\/+3K1EFK5zONF6K+qy59l7t4rSk0bVTP+ldOYYtJiY0n8e0jkVD8orbH73UAlds9SPUVSpLS761Mut6jWUlkYXwsBxceCIhHi5SSlbUV69Nl959aCk9z4BqWgMYqis3dJsSnV73zoNjfi2nPfhRBRaz8laSm\/hVVLQtyyv9xgkozXEBI4QRGfK+2daOnYl2OIFRCoe77dORXuQN+PXJQ1vPHwo6eMWXhnkaODt063T0Hg3wnk\/Ik2bEWkb39pMRPPtFjUhdQTrWhp+6CnLFwzvSjrm2ian1keeGKrp2N3FNONr2bFRY7dQZO\/OrqGRC3wBwQkjpg7+j5A9Qvq7vrv+ACy57q7sk0rfAAAAAElFTkSuQmCC",
                image:
                  "data:image\/jpeg;base64,\/9j\/4AAQSkZJRgABAQEASABIAAD\/2wBDAAMCAgMCAgMDAwMEAwMEBQgFBQQEBQoHBwYIDAoMDAsKCwsNDhIQDQ4RDgsLEBYQERMUFRUVDA8XGBYUGBIUFRT\/2wBDAQMEBAUEBQkFBQkUDQsNFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBT\/wAARCAFeAV4DAREAAhEBAxEB\/8QAHgAAAQQDAQEBAAAAAAAAAAAAAAQGBwgBAwUJAgr\/xABbEAACAQMDAgMFBAYECQgGBwkBAgMEBREABhIhMQcTQQgUIlFhMnGBkQkVI0KhsSRSwdEWF1NicoKSsvAzQ5OiwtPh8RglREXS4iYnNDV0g6NHVFVXZHOVs8P\/xAAcAQABBQEBAQAAAAAAAAAAAAAAAQIDBAUGBwj\/xAA7EQABBAAEBAMGBQQCAgIDAAABAAIDEQQSITEFE0FRImFxBjKBkaHwFCOxwdEzQlLhJPEVYgcWNHKS\/9oADAMBAAIRAxEAPwD1T0IRoQjQhGhCxnQhGdCFnQhGhCNCFjQhZ0IRoQjQhGhCNCEaEI0IRoQjQhGhCNCEaEI0IRoQjQhGhCNCEaEI0IRoQjQhGhCNCEaEI0IRoQjQhGhCNCEaEI0IRoQjQhGhCNCFxt1bmj2ra\/fZKGvuRMqQpTWymaeZ2Y4GFHYDuSSAADk6EJgWj2jbJfI7jJSWDcrw2+rqqCql\/VmUiqKdWaWJiGIUjiQCcKSQAeo0207KlVb7QW3KDwgoPEuWluh2xWrBJC6UmZ\/LmcJE5j5ZAZmTHr8QyB1wWkros1vj1bKXdN425Ht3cdfeLTTQVlXT0VAJSkUwby2GH+LJRxgZOVP0ytpaS\/dfjLadoLtX3m3Xaqfc0nkW6Klo8yNL5TTeW6sVKNwRzhv6pHfpoSVaT3\/xzsW1Nh3Pd99obxZbRbKpKat9+oGjkgDMgEpXPxR\/Gvxrkd\/kcForou\/u\/wAQ7Ts6C3GpaatrLpL5Fut9Anm1FbJxLcY1yBgKCxZiFUDLMB10Wik2q7xygsb3GO+7R3LYpKO2z3Yipgp5llp4SnmlJIJpELKHB4FgxAJAOi0AWuhsjxfoN9S20Ulkv1HS3KjFdR11bbylNNGQrL+0BIDFWBAbBIB+WktBFJMvjdaZqwiltV4rrULp+pWvNLSrJSLVibyGjPx+YAsuUMnDgCD8WltFI2944WXcmy9ybopKG6rbrBPVU1ak1MFm8ynJE4ReXxcCrDIPXBxnQClrotVu8d7NfaGxvZLXd75crxb0u1PaaSGNalKNzhJ5TJIkcSt+6HcM3UAEqwCWkpIbz7SW2NuWHcFxu9JdbbV7eaH9bWiamU1lIkzcYpeKuVkjY9A8bOucjPwtgtKAu3tjxktO4d7T7Qqbfddv7kSk9\/joLvTCM1FOHCNJE6MyOFYqCA2RyGRpySqFp+6EiNCEaEI0IRoQjQhGhCNCEaEI0IXPr5LmlfQLR09NLRszCrkmmZZI14niUUKQxJwDkrgdevbTgG0b3ThVG0vHQaYE1Z0qEaEI0IRoQjQhGhCNCEaEI0IRoQjQhGhCNCEaEI0IRoQjQhGhC+TgDONCFXXwUrRT+HvjTLPSV1Osm6L7WRLNRTI80MrExvGpUFww7cQc6YNAnHooiu2w6ul9hnab\/rDd1Rc0o7NC9gaOVwksdRAZYzTiLmAgjc9e3Hv80rROB1T13BU0VT7RviPX1V93btm21W3bVT09xsNuqCs8i+9FwGED5ZBJGcDBHL59lSDak4\/HCVdyz+A0lLJf4IGvqVstdBQyiqpoTb6hBJMDG3lEvLGp5gYLnPY4UpG9Vt3vsuv3juOn8MYrvU3u2x+dfLtU7qoZaqnnVlEUFEGjMSMAXabCsCpjj6HJOkKVumqizwtuG59n7w2PUbkorreqPw4W67OuVwits55UsjQGjuUS8SZE4wCKQpyKkEnK5OkHml0Nqd\/E3xb23urw83pabBLV32eXb1exnttHJPDGxiKJGzqMeY7OAqDLHqcADOn2mgEFNf2ba2gt1BsCiO4N41t0\/wAHEoprLcrfPHRUjiKF2Z2aBFRkMRjXkxP7QgdydINEFNB4loNx0W6vCGr3Jt\/ct3v0L3\/YlwpZjQVAknArJ5I5ExTkLzk8+Ngr4GORbBRLelFJ9h7Rkufgn4v3F7ruu2SSXjcE8VthSWFJ0lllaErC0XJxIGX7Oc50AaFKTqEu9nWrk8JLlDe90QVdHt3c+1bFFT3SopZFSgqqKmME9JUArmElvjUuApJcZz3GodqNE3faft9R4iT703vt+guFVY4NrQbdgmp6GZ3u1S9yhqP2MYUtJHEkTHzMcSZCFJw2gpW6bqzG2PDqKs3nSb8ud7qL\/cYrc9DbWkplpo6anldJJDwABLuY48lvRAAq9curVR30Sbxb9pXwz8C6ygpN9buotv1dcpkp6eYO8joDgvxQEhc9MkAE9PTSpExl\/SCez6\/2fEq3t91PUf8Ad6Eq+n9v7wBQZbxGoQP\/AMNUf93oSJK\/6RL2eIzhvEmiB\/8AwlT\/AN3oQvkfpFfZ2P8A+0ugH30tT\/3ehC+Jf0jfs5xZz4mUJx\/VpKk\/\/wDPQhJT+kr9nAHH+MeA\/dbqv\/utCWkgu36Sz2dZqGohi8RWSR1KiSC3VSsp+YJixn8DoB1SjRdvYX6QPwZ8RroLbt2+V9yqv6sdtm9PXtnQkU5bW3lat82WivNgq47jaqksFqEJXBUlWBUjIIYFSDggjQkXe0IRoQjQhGhCNCEaEI0IRoQjQhGhCNCEaEI0IRoQjQhGhCNCEaEI0IRoQjQhYxoQjGhCMaEIxjQhGNCEY0IRjQhGB8tCEY0IWdCFjGhCANCFnQhecP6ZLwwirtjbY34lMHejeS01Uqr8QV8yQkn5B1f\/AGvrpnVOadCvIBKeVyeEbv8A6Kk6ektbf1ZW8M+61GPn5TY\/loSLQ9PJGfjR06\/vKRoSoSUI2Tk\/TQkSue2Vq0grmo6hKNzhZ2iYRk\/INjGhKt1m2xedwrUNarVW3IU6+ZN7nTvL5a\/1m4g4H1OhFpJTxzTB48quT15kD+ehFq0XsH7xsHhx4qQXHcV4orbSKDmSeZQOx+uhC9V\/ZN3ylo8C7BVTxwU67i3DWfq332Voo54pKtuLK4RhyYZKIccyMA+omiiMocRsBaljjMmY9ArPqeQ+WoVCs6EI0IRoQgaEI0IRoQjQhGhCNCEaEI0IRoQjQhGhCNCEaEI0IRoQjQhGhCNCEaEI0IRoQjQhGhCNCEaEI0IRoQjQhGhCNCFy9y7XtG8bJV2a\/WylvFpq08uooq6FZYZV+TKwIOhCiiL2J\/AWFOC+E21cfW2oT+ZGhC+\/\/Qs8B\/8A+U21P\/8AGR\/3aEL4HsTeAobP+KXah+htsZH5Y0IVT\/0iHgR4TeGXhbGdqbD2\/t2+O7yCpt9FHDKYvKlBAx1wGC5+WR89Orw5vNOy6WqSeOwx7K3hh1I\/o6\/7zaamrvfo1Rjee7+p\/wDuiX\/dbQhTL+i78Ntkb2t97qN27YtG4pYa2tWBbpQpVHpHG2FRgeRwGIA698aUAnZKArjUPsLeG8FZdayGG22WovcK+fTUVrpkFPKZEZmphKrNEpww8s8seZ9ANa0WNMWXLEDlvvr6rRZislFrAQ371U\/7ZojSzG0mllW12iKGlo5JQvGoAjQ+YfhHxKVxlemSenyzX1Wbqfoqb\/8AIblOxO3fOoQoV9aVCNCEaEI0IRoQjQhGhCNCEaEI0IRoQjQhGhCNCEaEI0IRoQjQhGhCNCEaEI0IRoQjQhGhCNCEaEI0IRoQjQhGhCNCEaEI0IRoQjQhVv8Aag9uXZns10rRTUlTum9AHlQW2RAsJHpLIThD9ME\/T5iFRHxr9rjf\/tu7INm2\/wCG1us1sppmlesmuZnmAKMpH2EA6Nn8Bo2Qqv8Ai3f7xDsOw7K3DSUkFNZUEUTUc2ZWwT1Ykkep9NCEq9mDd182Pea+TZVLFNXV8BpXFxdXUq2QQMccHroQnzb5vF32UNi1aNYo6Oy3Gpkner95wziRODRkq2ChX0I\/lq1hp\/w7y\/KD6qxDKYXZqtTL4Ge2JH7RG+NuW\/d9nqrTJbKlIYKy11k708dCXRpIpETEhIC4WTl8OF6Hjk6MPEDE17Wt979VdixmQODW+9+quH47bYvmy\/C\/asmzd9Xuz2Gnq3aoW006y1dYkrK0Eks8z\/BHCiOWY\/aHcDGA7By8+dzpQCSOu2iXDP5sri8Anz2Vhti1TR7fhrJrnXXiO4zmanlnRXKRv9gDhEhCYHL4xkciCx6ayZaLqAA9FnPILtAB6J2DrqBRLOhCNCEaEI0IRoQjQhGhCNCEaEI0IRoQjQhGhCNCEaEI0IRoQjQhGhCNCEaEI0IRoQjQhGhCNCEaEJv7z3pb9jW1LhdC8VEZODzqBxiHEsWbr0GFP1PYZJA1PDA+cljN1NFE6Y5Wbrr26vgulDDWUsy1FNOiyRSocq6EZDA+oII1CQWktduFEQWkgpTpEiNCEaEI0IRoQsHsdCF4ke2DMX2Lb5W6yTmaZ2PdmaZyST6nroQuj7DUfDYN+f5n+zQhV99pVv8A6RVPX98\/26EJR7LHTddN1\/5xf56EK5\/t7Dl7PVrPyZf5aEKsn6NqTh45Uo9GDD+GhHkrwez3vTd24fEbc9DQ3eW60237vT001pWoEVQaFpGV1CqeUqRFuahnQLybKvyIPS5I24VhcBqDr5+a2w1ogaT1H1VtfAugfZ2xY6Wt3fR7it8dY9LS3DJBOGSFImZ5HJkEisjZJJc+nbWVjHiWW2x5dAqOJeJH21laKTrZc6S8UENbQVMNZSTDlHPTuHRxnGQw6HVAgtNFUyC00Uq0iRGhCNCEaEI0IRoQjQhGhCNCEaEI0IRoQjQhGhCNCEaEI0IRoQjQhGhCNCEaEI0IRoQsZ0IWdCFzNwbgpduW81dWW8vkEVUGWdjnCgepOMAepwO509kbpDTU9jC80EtlhirIWjmRZI2HVHAIP3g6jBIOm6aCQVmNI6WEIgCoo6KOgGlSLInTKgsAzdlJ6nQil95GhCOvz6aEL4EjGUpwIAAPP0Pfp\/D+OhC2aEL5kOI2P00IXh17XM\/meHu3j\/XpFfr9WY\/26EJz+xInDwxvb\/Nv7NCFW72j2Lbhqf8ATP8AM6EJZ7Lbf\/Sul\/8A7i\/z0IV1vbxHL2dLafkyfy0IVVv0c0vl+O1APmSP4HQgKfaDxMoPDDxg3JezRpR3S13eueGs854FqCRxjSQhuToW5jjw4\/CeuSQe4wDGy4RscmxXU4MB8AY\/Yq+\/gJ4qWq5bTpqyWexWy1ukPGmpOXGOqkLGTExwJ+cgLBgAThickHOJj8E6J+Vtk\/ss3F4UsdTdSp+pXi8pViK8QOgXsNYR03WTR6rdoSI0IRoQjQhGhCNCEaEI0IRoQjQhGhCNCEaEI0IRoQjQhGhCNCEaEI0IRoQjQhGhCNCE1t93i92aio3sdNRVdVJUpG0NZP5XNCeoU+rEfl3w32TZgZG9x5l1XRTwtjcTzPouxQT3CStqkqaWGGlUJ5EscxdpMj48rxHHBwB1OfpqAhoAo6qIhoAo6peyBh1GdNTVwb5el23UUckru8FVMKcRhCQHZhhi\/ZVADdx6jtjU0cRlsDpqpmMLwQOi4u+7dDvXbUtoqaqqpq1pPNWltdasNRKI3zxDZ7FcZ7d+476nwz3Yd\/MA021FjVSQOMLs9abajuuZT2Ubl3ZZ953KtqLelqomljsrsFMDSCRfOm65\/wCTLfCexz3K9JTJy4nYZjbzHf8AYfFSl+RhhaLs7\/x8U5rLeK+Na+svlVaqag+OakNLMzA0ygHzXdsAdCCQBhf6xzqo9rNBGDfX1VZzWmgwG\/3TlVlYdDkHUChWRpEL55qztH1yBk9Dj89KhfMzfsZCP6p\/t0IXhp7Xb8dhbZUf\/uEJ\/hoQE+PYvXh4SXd+2WP8tCVVg9oiTluOp6\/vn+3QkXQ9l443XSg\/5Qfz0IV2\/bqUt7N9AfkyaEKpP6PWXy\/He2emXxoQpt3PR2bb3jfua7XBqinqTdakRz08fmM2JSeHTPEEBsYUnLfPGu\/4U1ow7HLrMBXKBKmbwQNJUVF6oHvUNBRVC4S0I7QwxgN5nGWJV548yVHLoy55lemCTdxEeZuZg27UrsrSRbRsro7Hq7bT0EFfZLbSWzNOKdgIYozGA5PlngSCMsxxk9SfXvxk0JByyFc1JGWnK9Srbqk1VJHI2AxUZx89ZDgASFmEUaSnTUiNCEaEI0IRoQjQhGhCNCEaEI0IRoQjQhGhCNCEaEI0IRoQjQhGhCNCFjQha4qmKZ5FjdXaNuLgHPE4BwfkcEH8RoQvsOCSPlpLQk9ZbqSvMTVNPFO0LeZEZEDFGwRyXPY4J6jTgSNilBI2SSi3BRVN3rbTCzGqoY4nmUqQqh+XHr6n4T\/DTyxzWh52KUsIAd3Sap3SlEauWrpKikoaaTy3qpV+FshCrIASWUl8ZwMFTpWxl1ZTZKeI81BpspF4j2eC+bWq1mtkl5WAGdaBJmj89lBIQhSOYPYoxwwODnT8M8skHiy9LToHlrxrXmuPa9t23bdBcd0WqhkjulRSNKaSuqWVEkbDFf2hPkgkLyAwOmSM6mfM+UiGQ20H79VO6V8pETzYBTT33ta832aS+7T3BVU9VUTQRObaDLE7Rniylmk4qvIcWZVPEc+SsQMXsNOyIGCdgI136fRWIJmxjlSt0805bvuOrt+zLjdaqiY1VDQDzaSeiaeTJBLg8SFfIKEqpwMEE\/KkyIPmDGnQne1WbGHSBgOhPelu23vdqmr3LeLtMtps9vEcKRVMyAoqqztK6hyU5cgOLBWHDseh0ksGVrGMFuNlI+Kg1rdSo6357dfgvs2+Q0E\/iZY\/MhkZa2CmjlrH6A\/CrQgqrZ75zpkWGkksBpvoqzW2Dpqmncf0pPs8W2rWE7qralSpJmgtc5VT06HKg5Ofl6HOOmQ4SZu4SZSkNV+lS9nX3KdINzXDmyNxUWicZYg\/5vz038PJ2SUV5be0D4xbZ8R7DZ6G01cpkpKSKGTzoSvxKvXHz03kSdktFdXwU9qLbfhRsGqsVRartcaudifMgSJYxn6mTP8ADSiCQ9EuUnooZ8St80G+LpLVQ0dXTqzE8ZGQn+B0ciTskylKPCrxHovDq7RVktuqq0RsG4pKi50ciTslyO7KePHX23LL4y+F8W012vcbTNEQRVGeOZTj\/N+HSciTskynsom9l\/xOsXg74l0N\/urVk1HC4LLDCvPH4vj+OjkSHojKVJe6faA2xX+Kt\/3RQVc70NVWyVtNT1KnGTywGTBAPxDOCf7+y4XiY4IAyTddBg8XHDHkepB2V7Uuy6S6zXCsvQtlRUYeZ6OORnnlPFSZAVA4qqgDBPqcdSNan46E6Aq9\/wCRhVjtge3n4ZWuKOKp3NIkayLxLUshIUn1IXGB0z0zgHudYeMaJPE1ZeInZIbarf8AhN427d8RrQlw27dqS8Wx2wKikl5gN6hvVT9D16jXLSMIOqxjrqpYp5hPGGBznVdMW3QhGhCNCEaELm093aa9VdAaSojWBEdah0\/ZSZ9Fb5j5d\/p2JcWgNzWnltNzWulpqYsaEIz00loWdKhGhCNCEaEI0IRoQjQhGhCNCEaEI0ISeurI7fRzVMoYxxIXYIpY4HyA76UCzSUCzSKTy2pxNHF5XmgOVK8WyfmPnoIOxQeyZ+356qO+3+4NSva7LHK4YVKN5tVKFj\/bLk\/Cg4sox9onPTALW5Q3IxoNu+g8lZe0ZWtBslOWlnjvaUVwo61\/der8YwvGYEEYbIyMHr0x1HX5arOaYyWOGqgcCwlrlsu9ojvFumpHmnp0lHFpKaQxyYz2DDqM9umkY4xnMEMdkN0mZvtdxUNmp6ajvNNboZZGjqLxMAjwFn\/YhVwQepVTnuAeoJyLmH5T3klpJGw\/VWYuW4kubZ7LW8Umw3utfR0cklHN\/Sa2trKqWZpJiVUeVFliFALkgcR0UAHJKuaRii1rjrsBQ213KcP+QQ0nXYeijvffibcrZtiK6y7dS0bbrKwzLdhLLF5EoAKvPCAjujsG7jB6BhjBOpg8JE6bll9uA2018r6Ur2Hw8ZkLC7Ufe6jKTf8Av7bu3Yrlsy3x2zZFqRp6itqoFpzUZYyTSxxSdCjYwAgABkwB21tjDYGSUx4h2aR22t12F9\/Vaggwr35JnW87a3SkSw+Lm197LbraszXCiuNH+sVtlLNw8s\/smlhYFgHQEMzAlu7J1yAcOTAzYfM6qINX86Ky34WSKydCDV\/okntG3rbtV4Ubqiq4bVX1tXZ665KqOsc0bpSyilqApAd2Hwr1Jxg4BA6VoGTstzCQBp\/IVZjZWgubYrT+VQH9G\/YLVdfFKsqK23UtVMkDMjzQqxU8h1GR312uGja3h0kjRrpr80mojJCef6QDbNpg8SaN4LdSRBqb4hHCqgnPfoO+ug4RCyXBtdILN9VoYZgfFbtVVE2ihX\/2Kn\/6Jf7taT8Jhx\/YPkrHKZ2WtrZRYP8AQ4PwiX+7VV2Gg\/wHyTeW3ssR0dOnRYIsfLyxqucPENmpMg7L7NLCwwaeM\/6g1GYI\/wDFGQLMdFT5P9Hi\/wBgaj5Ef+KTIOyWU9JTD\/2aH\/oxqVsMfVoTw0dkrSmpcf8A2eH\/AKMatshi\/wAQnhjey+amkpzGcU8Q+5B\/dq+yGL\/EfJPyN7Lmbft0K7ytDGKPh73GGXiMEchkaz3ws5o8IVRzN1c724dk2Kh8M9s19FZ6KlmkV+UsECoWGF6Ega5xrc3PDtaKzmWQ7VMX9F7dqqk8Qt5W1Z2WjloYqgxZ+HmsvEHHzw5H\/lriMa2iqLtTovWrbkxkokJ+WsQqJdjSIXy7rGhZiFUdyTgDQjdZVuWhCzoQsYGdIhGcDSoSGlqYr7bZCYZ4YpecTJMjRPjJU9DgjPofl1GnG2FOILSufd7HWjbJt9jrPcamPyxDLMWcBVYEhvUggEdCD17jUkb2h+aQWE9jhnzPFhduBWWNQ7cmAwWxjJ+eodySFH1WzQkRoQjQhGhCNCEaEI0IRoQjQhGhCxjSUhJZ6qeOtghSleWGTlznDKFjwOmQTk57dBpwAo6pQNLtIq24Qi6xWuqal8ushcxwyPmSXjjmAhGCoBGTn17acGktzgHRODfCXDol0Nup6Si91p4Y4KcLxEUahVA69AB000uJOY6lNsk2Vrta+70iUz1C1M8KhZGACnOPVR2+7QddUGzrSa97v0e5LtX7XoYaeappwj1RrkPGNWGVeMFcSlTxJGRjKgnrq3GwwtEzjvtX79lZY0xtEp+\/XsuRW+Ht8nkaaq3PX1XkU5dHp2jgklnwwxgoyxrxOMr3JJP1mGJjApsY1+NBStnYNGsH+k3rXSTbQ3rdKe87mbcb1EMtWbdPGAKSk6sBy5cc5BB+H4lUdOhOrcjvxEAMUeWtLHU\/fmrDjzog6NmWtL7lMvxS8SDd4PIrqSabbVfItDTzW6OGup3AiMzO0Z6pMpQgKeg4gkHIzewWEDDbTT2izdg71V9lcwuHykkGnDXWx5fJMGj8UNx2LdNFb5bvSVtbMJfdompFECogSTiZUICNKvEEnoCwJUFVB2HYOGWEvDCAKs339ey0nYaJ8ROU1pr99lzd9bm3RuPw63lWX79VUFnTbtwzRy1UVSjYpXELxH4mWRZXUDLZ+Ig9eOquKhwkUWWGy7vVet+SqYqPDxxFsV5u\/wDKqz+jWqOHiTW4PenOf9oa28J4uFyjzH7rJ05TlIXt9r5m\/KBvnARrpODf\/htHmVp4MXCFUuVcEjV6U0VaWsRE51TJ1TaWVps6KtAC+zT4Gly6IpfIj1AQm0tyL06aUBLS3IOh1M0J4C+2GUI1eYdE5I7cvC90Ug7pOh\/6w1Xk94FQOV4fbP8A6R4D7UkPU4\/mg1zDW07EhZLRWf4KDP0dKUjeJ+5Y6u3\/AKxiaihwnlq4jYVCMshDHoFIByOo6a4jGinnWlRO+69cdk3WCuhmgj5CSnIWQMuMZzj+WsB7cteahLaFp051GmpLc6OnuVvqKWpp0q6eVCkkDgFZFIOVIPTr9dDTRsFOaaNot0xejhLwGkcxqTTsVLR9PsniSOnboSOmg7nqkO6VBgfXQkWdCFxr\/umjsDU8MvOesqM+RR0685pgpUOVXPUKGBPyGpY4zJfZPYwuSlZqqrpqtBGaKZWdImk4uG\/qvgHt9Dg6joAjqk0Cbe1rnuqaSGhulHTrPRyiOsrMMsdTH5bFZIMDBJbjkHGPi+mbcrIAM0Z32HbXqrEjYQMzDvt5eqeY7apqqs6EI0IRoQjQhGhCNCEaEI0IRoQjQhGhCxjSUhI7lZ6W6iAVCufImSdDHKyEMpyMlSMjPcHofUHT2uLbpOa4t2Spm4qdMTU1rF75TUNzuUU013Spnaengkp46eULkgJywoYDA4luuMZJ1Yky2G7Upn1YaRVb9Urs+4afclRc6daKvp1o5BA0tVA8AlJGSYycEgds6a+IxAGxr2\/dI6MxgEkG0xt\/7ft94rble6q6XmjhozBRmCOZqaIOG5LJEwQsWzIFJB4nGD2yL+HlfG0RNDdde59CrUMj2tEYA11TUuN42\/Je0uV92U60zxta6a9S\/wBJnnEaMjDDJyRGDzRhwQZOWeuQRdjilLC2KTbWth\/35dFbZG8tyRv866JXuGy7Mgss13qpqexO7VHkPNJJFTxTAyRh1LfDHMUYjko5HkWwwGmwy4ovEbRm29a\/ceSI34gv5Y129a\/hVpteyJds0K3C2xHd16lrmklkrZQkqxzSGJmUB+UzF0ILDiBjPUEMOx\/ECY5ZPA0Dp3Gvw0XSCYSGn+EeX3oo98XLnS7Nt+9LdXiK7frO21COgqXkloJYw6wHr1zliW5MSQzDPTLTSxuxGDc9umUfMEap0rDNhXuaayj591Ev6OKpaLxMqcYIMDDGfqP7tQ4HxYCVvouQb\/TKlz22ozdN30z9E8uIj5511vB2ZcIAtvCNqEKqk9vMbHLZ\/DVqVu6nLStKwYz1GqeRNylbEi79dOA7p4CyYQR31LWiWlr9379dQFqZlWRDjsdNApJS2RxfXTxaUArZ5HQ\/F\/DVlqVfFDRc7nBhsftF64+ukkF0oXdlcL2ra81ns\/7ayoUIB65z8H\/hrAdHkdiD3WYW1n+ChT9HdW+T4pbmx0LW5R\/+smvPMf7yy37r1s2xfKGhtULVdXFAeIYB5ApPUL2z16so+8jWHkc7ZMDHO2TrpK+Kti5xNyXt20x7CzQpC0t3Wq2uzGqDU88A85gDNIH5jp8S4Y4X6HHr0GkI21SkLnXu8XGCvhorZT0k8skbOxqKkoY8EAHgFJIOT16YwPn0kjYwgl5pKxjSLcV07bRQUk1XJEjLJUSedKS7EFsBegJ6DCjtgevqdRlxdQ7JpJNA9Fslqpo6+CFaZ5IHVi84ZQsZGMAgnJz17fLrpANCUlaXaUeWrdSAT89J0pIuPubbq7ko4aZ6uekWOZZuVOQC2M\/CcgjHX+AOpYZDCczRaljkMZJq0upquAVj0KsxnhiR2BVscW5BfiPQ\/ZPrn599RkGsyYQfe7r7r7nS20Qe9VEdP58ghi8xgObkEhR8zhScfQ6UNc68o2Q1pdsFi3XSluscklJUR1MaO0bNEwYBlJDDp6ggjQWuZo4UgtLdCEr01NRoQjQhGhCNCEaEI0IRoQjQhc+shr3uNE9PURRUSFjURshLydCFCnPTr1P3acC0NNjVPGWje6XjtpqYoP8AaH9rzZHs8CKjurz3bcE684rPb8GUL6PIxOI1PpnJPoDoGqUC9VTfxt\/Si1F52\/TJsSzT7c3MTJFPVVUwqVhiPE4jXHEsSB1ZTgDp306yBlUjRpSrtafbn8ZYbitYd8XachvsvMGT7vLYcfwIGmpzQBuFZj2ev0gDybyep8QnmWkrDGstZbolSNJFUpzmhAyTgrllOR5a\/CRnUnP\/AC+W4bdVaLQ6LK0bK1dwZqFrRdNo3iOS2XVKiqpGpKupenkYs0jZKxyRKrAr1ZQVIYDOcjYgkZOx3NF1Xb07g\/JTxubIHCQbV2\/7S6jpBPV2693qKmmu5qBRRJV+bTQ10gUyUp4OW+IKxGSvLn6niDprjlBjjPhq+9dDr5\/omEloLGHw\/p3TUvFzt+\/t7TWSuoojTibzfd5WEo94hmlWQvHyVypj8tlypALAJnOdXoQ\/Cxc6N3\/RH8q1EHYePmMP2QmZu3bE1FvkVNLTSU9lt0sTh4ZGjo5x7xUcV5M2Mp53IooOWPpxGdbCzNdBTzbz8xoP1+i0IJg+Knm3H57Ku2+bTdJ9lbsm3LR0s9Y1HVGGpjgUTBQrnlk9VTnhPkQfh+Z3p3s\/DOERrQ3rutWd7OQ5sZrQqFv0fNT7r4kTHP8AzbDVPhIz4SQei46IW0hTt7UFLUXvd0FNSQS1dVPiOKGFC7uxPQADqTrtuHFsWGzPNALocKMsOqgK7+Gu6qCCeoqduXOnghhNTJJLSuqpEApLkkdFwy9f84fMaccVhpDTZAST33PZPzxnYpJB4W7vrFV6fblwmV44ZVKQEgpLy8pvufi3E+uDjVR2JwrT4ngb\/TcfBIXxg0Skdv2JuK42uW40tmrZ6GJ5I3nSIlVeMcpFP1UdSO4B0OngY4MLqP8AOyMzLq9VrXa13evgoRbqgVc8C1MURQgvCycxJ8uHD4uXbHUnA07nRNYX5tAaPr29UuZtE2lw8NtzyMRFZKmcYRhJABLGwdnVCrqSrBmjkAIJyUYdwdVji4D\/AHfY8imZ2nqudbtq3e6U1RUUlvnmhgLiRguMFF5P378V+JsfZHU4GldNGwhrjqfsJS5o3KUvsfcME9fA9mrBPQTxUtVF5RLwzSHEcbKOvNiCAvckEeh0DEQkA5hrqPgm5m1dpVF4f7hlqI4Y7a07SRySK8EsckfGMAy5dWKgoCCwJyoOSANPGMgAsu\/Xqm8xndIZrJX2C\/JR3GkloqtCjmKZcHiwDKw+YKkEEdCCCOmrAkZNHnYbCbYcLCsv7SEvn+z9Zev2cf7p1lTt1lPos+Qe+oP9gu5RWrxL3NPM4ULbcgdyxEqHAHqdeb4phkfQCyshe6gvR+DeUR2u1YakQmEfacgnqeuB+Hb7jq3hsKQ\/LV2tiDDmw2l2PDDe1RWXsOtyik89DCtNMeKmQZKnIGeuQCfi7DGOuV4lg8kZ8OyfjMMAwnLspNTca8JZbFEKqnKGVgkXlxRE+Y5kOF5PzYcSFBOcn565jlUak0WFy9fHutldtykanqrjW00tVKYfMloXlEwyVYPGpYjowYrhjw7dBjTWyO0YCkDz7oWdg2i10FNWXC03asr6W4slSIqis94SDkvIBOp4ghlOMnpjHTGnTyPeQ14Ay6bVaWZ7nU14ql3KuzpUUdZTrVVcDVTFzNHO3OM9OqEk8R0HQdO\/Tqc12voh1XShDqINJDbYr01yqKr9Z09Ta5WiFPCI\/sxBG5NzHdmYg+oAUY76lcY8uXKQRv6\/6UjiyqqiurFbOFdJUtUzyciCImkPlpgY6KPn36569dQ3YpRXpSTbiudXb6CZ7ZQfra4JwK0STJE7KWwTliAMDJ64zjGnxta4+M0E5jQT4jQSmpoIrgkJqYg\/lkOquM8H9GHyI9CO2dRhxbdFNByk0uJ4cbao9r7eNNR2ZbH5k8kslNzWRuRc\/Ezj7WQBj5DA9NWsTK6aS3OzbKeaR0jrc606dVVXRoQjQhGhCNCEaEI0IRoQjQhGhCj3x98W6LwR8KNwbvq+Ej0UOKWndsefUN0jT7i3U\/IAn000mk5jcxpeGe8d13nfO5bnuXcVxWsutyqGnnrKpuKqzZ6KCPTsF7AYHppwIAUxF6JZt\/wx3Pva1r\/g\/bZqxkdi06x5jYHH7x6emqj5ACr0UDnDZILlsa77drfdLzQNQV4GGVl+GRfmP7fzHbQyW9lI7Dlu66VtojGh8tccRhlYdRqUm1C1pap59nD2mbp4K3Sax3avr\/8AAm6co6qKllCyUbuAPPiJBwfnjGR17gHU0EnLeCQD6pcoOtaq9ppY7nR0e6tmPTWqjqIKlKi4Twe91V1WIFU8p43VlaUR5JLA8lUceROegZIKMcxvauwvv6WpWvq2S67V2F\/wk26qee5wWtrhPUbdqKeR7vO9FWNFJ5STRqTKrqvI\/GxLBQpAYL0CHVnDuyZsgzA+HUdx03pTQHKXZRYOm3dfEV3uc8RiqIbciz1BaKlt9MVjqWMwaRk5EEqHwWdchjIC3UFdStYwGxenc6jT706KRsbQbF+vb77KuHjcbhPtq9tSMBapKCVWQRoVhPCVWQOG+LJPyznoex11EQZ+Ffm3orbAb+HeDvRVXvYcqPdt+zMO\/BtJwEXDIPJczhm2CFOvtJTNPdVYjumu7wDahXSYdtRpny+INhoLxf6uKVagVG0aKzQJUUXNHqYY6RWDK3TjmmbBP9ZenfGLJgpnRxsIqpC7Q1ob\/lVDC\/KG11\/ldF\/FfatXaamCaakE9RRWSJoaixielWSkSZZl8rkBg+YvEjGRntrNOAxAeCBoC\/8Auo61WtKHkSXoOp6pm2nd9ipNgRbdllimaS+1FRLNU2xZWhpJII4hLHlvhlHAsFB6Hj1ONW5MNM7EGZulNA0O5BvXTZTuhJfm8vqnHdvFfbG5tvV9FVU01sqnpJbFRy0sbSiG3rPBUU2eTZPB4WjKj9yXPdArVGYDEQyNc02LzG\/8qIP62oRBI1wcNRufVN7au4du7YsV5tklxjuMlZPQzh6mziopv2Tzl14SMCQRInUhSSWHQdTamhmme1+WqvY0da60pnsc8g1tfVINv7lslFtestNxla40ErVTrQT0ChoZniCQ1EEwblEcrGZEyQRGBh+mCaCV7w+MUdNb6dQR18kPjcTbdPvqnw3jfYzuDetW1KZKO7XMVFKKe3xQ1BgeOrjkLuDnzFWqDLksCydSM51n\/wDjpTHGL1AN6+YPy0Vc4dxryXC2Jvbb+yLTerS9VLdoLpHKzS+5lUib3Orp4l4lw3xGrJcgjCxgKWJyLeIw02Je19AFvn5g\/StE6SJ0hDtqTRNxue8b3TTe6STGmihpo4KKB3SnhQcUQY5EAAHqxJPUknrrQzQ4Zhbm1Js99VMI6BDQSrJ+0ht+roPZ7tUkwUgcCeDhuOQcZx21mHFxTmVrDrSz5D7wpU48CLnTWrdN4epxh6bipI7HmPX06euuXwzc2IIUGCGaYhWWpvFComagpqeunj8oBppYXBWRz0KMDk469M67XD4dlahdxh4W1srG+B9kiv8ALSTVTT5SUGNQcFXx1OOxGWB69MjWHxaYxNcGrMx8mRpyhWwrLxJElCaGnjml8yJKxZExIYslAAMgg8m5DIK8VftkHXmIYCXBx9PVcNlsuDimtWvdNsybiv8AcJIIrXJ5RqJK2saN46dC7OVMY4hh5gRQME8OrNnOrTMkobG3fyHVWGlkgbG3f918bfobpb\/D5Jdt0Vs2zW3N\/eFjgp2np6SIKPROkjkAY6LnIGPh0+Tl\/iKlJcG\/An+AlcWc2pSXAfMpZy3\/AH6mult8y2WWaOmUU9akU86zTMHJOXCcVH7PpgnPIfI6i\/4sdSakXtYTKgZTxZ12Trv\/AOubPtqng21QUM9yj8mKOmlPk0yIGAft1VQoOMA4OOh1Vj5b5LlJA19VAzI55Lya+qWW7d1quNso61ayKOKt+GnErhGkbOMKD1Jz6d9IYXtcW1smmJ4JbWybe37nQ7mprjuqyVUNbXSxNT0vvJ8tUA6LG\/DJK+YD1ILDkwHy1PIx8RED9BvoppGvjqJyetsqDWUME7KVMsauQVZcZGezAEfcQD8xqmQASAqpFHRb5JUhXlI6ouQMscDPppKtAFr6BB7HOhIs6EI0IRoQjQhGhCNCEaEI0IRoQqA\/pQt9Gqn2nsSKT9mUe7VMYPc8vLiz\/wDq\/nqvI6iFoYVlguVTPZ+8EaDxU8Q1husPvFst55PGfsu2cDP5E6hmkoZR1V7DQg293RelW29i2ux2yGkpKSKCCJQixxoAAPu1XaO6nfIbpQ37TPgHBvTbr1tBAqXSky8TqO\/fodHum1JG\/mDK5ee1fUNZq+aGSIxzQkq8fqMHDL+HT8MavsOYLOfbXEFc643CO4UjGBgxUYAJ+\/odOIUZNq5\/6P8A9o1WtdTsW+zl5bbBJUWyplmkDilUh56cBerMoVmTpnHJcgat4dxeeUSlcC8Kz9Z4d266Xprxc0hkPl8xVSV0syJGJXbyAHTgod3QsDnOcAZVTroG4p7GCNmmu1V5WrTZ3tbkb9+aNw2i126pguVoLCSb4JFxF5WQI4wSCgLrxAUBGxg9B8WdPgfI+2P+\/wDadE57ra5Qt4vSyXPbl3pa2i4lYJnlwgUKSjAhQq4x1ySf3icE5GOghaBE4A7hazGjlursoQ9kPa9urdyxU4o4o3GCGiQBgC2GGfvDfhj8YcJO7DMc5igMbWwktGqsZ45+Cdv3BV0sSotMwhJaQFiWJ7D7WOnfPb6fLX4ZxqaMeI3qrXD2mRu6pF4neHly2DcjT1qDypCTDKvZwMZ\/mPz128eIZim52LQliLNe6YWe+oCVVX0vqdR2hZz9NIm0s+mhFLGm0kQNCEqoaV62qhp4l5SSusaD5knA\/idMe\/lsLj0UbrrRWI2lZkpaS2rRxLT1lFiJkPq4+2jH5MeobHqGHTvxcznSHMd1utjAiGUUR96qb\/aat8dV4DUKBCscwQFMYJGCxX6dvw1jske2RxB1XMvaJS5pXm9c7dHaK3+ir5Id\/KYg4yAe5\/EZ\/HTsC488qrCwMl8KlzwxulNJXxVCRF4YnjQhOpfBycfPt\/A69DwzhIw0uyw7g5pV7vASiZqEPKlRJUhSXSllMZDkh1QP0OcE9QwAxjr6cjxh5shYHEXG9FJ236aa5XSq\/WQq6aCWeWrqquJREzKi5iQmJnV8q0hdgFbkUwB0GuTlysZTaJAofHfcCulLn5C1raadgK\/ddDdNQL9d6l562Wtp6CZvINFVikgRcxB1mZyAZY34Mq5HVWBYZKCGH8tlAUTvYs9ar9CoovA2gN\/Kz8EosQq7ZHcZr49TuYQ3en91pqaoWpWm82VZI3K4BTyfN6knqiK30CyZJA0ReGwbOutaV8f1SvyuAbH4dDfS1r2jvat3Rcqi4LeTZoI4oqSnjqp0npZJ5Z3dUP2WeQxKhHFsAS9M46k0DIW5cuY76b0B+lpJYWxjLVny32Ty2\/v\/APXPiFdrA1DTpHS0kdTTViT8pJ4mx1KcQUHIkDqc8c9iNUpMNkw7Zr3NV6Ks+DLCJQdzVJu7Wmird2brWut5\/WVJVrVU0NfKJRTyNGFAjfiVRWAjI65yz9Ph625gWwx5DoRRrrr17qeWxGzKdCOnr1XS2xtVLhfKi5\/qiKnsd1ihuFTHWST+9rcY5MjKP0CKFXGMZ49sY1BLMWtyF1uboNqr+VG+TKzIXW4bdq\/lPio3HaqBgtRcaaBiqMFklUEh24oe\/YnoPmdUWRPcLa2\/RVWxvd7oSa6Wuj3fTSUtXFKaeCZWRh5kLiRT9pT06dsEZB66cx7oXW1DHuiNtXWknhoIC00qxRIOryNgAfUnUQBJ0TACdluUhhkHI0JFnQhGhCNCEaEI0IRoQjQhYJwDoQvG\/wBuLxIbcftU7wZn5U9qkp7VD1zxEYTmP9syH8dU5NXLXw3hiTu9jrdNl21T3i63W401ug83iZKiQLnv0Ge5+g1VlvOtaBv5JVz9k+LW3N4SmG2VbVGAMO0TIH+7kBnTWvANKJ8LgMyT+MlPW1tk8tbtJZbXwZ6qen6SsgHUBv3fvGh5KMNl17ry58W1tlx3TcRtaz3WjhoJjT1T18bc3m5MORBJbrxIOQO4+Y1ZitnvKPEBkpPLB03UYTSSU0xnQNGM\/tB8j6g6tkgiwswAtNFOnYu56jZu7rVuOhVRLRTJK0brlHGcMrD1UgkH6Eg99Ma4scHDcK1GF63Wq5Wu82i2bhpaZKC4XKOCuqzQyrxk81ASDgjqrMGLsrdAVJw+NdXHbhV23pae0O2JsdEz9zH9tTV8NZbn90j4hVaPPBW6Pkk9OgYBcccnqdbWFaNWEbrTw4Gra3VXL7XSXKW6GCsnSWrBdkdz8SYyoZmGTgYAORnH1xrsJGAQEUNAV0UjQISKGy6XsYyhvEOmjkUxSlCzI34Dp8x0Zsj564kH8k0uecaiIV0vE4wU9VTyTkhfLyOnX\/j79Q4EOLSpeGvDWFQp4z+HEW\/PC3cckFIKm6RQithqwQIKaOEM\/lq\/77MDIDwyMsMkBVz0XD8acNjGC\/Dsfirr5nF9BefGAScdtdzMAHGtk0iis+mq6ajQktA9dCVA0JqBptpqeu1NgVt3oIrlT11vjYPlIJ2ZmPE92VVJAyPx+msbF4toDolIyF0oztcBXdSra6sx1tLyuRoLioUEyMlRHn5dGWR16nHmAHqT0PXXNna1pOPh3o\/P\/asR7TUwh8BbZOxQFmjxg\/Dkow7nsMHOT8tZjWnO9c0HfmOC81t3qJZYEiBcCTHLGM9D10YQEylRM1kpWF8Ddq2+ooKeaslhiqShEFM+QJpF6kADv0Knv279xrvRJyow1dU1+RgAVp2p2p7dTGWUxVVNGz00tNMf2TFTzDF14P8AD1BfoD3+eufec7nGrBNG9bWS4hzjpYUm7T3jLXUtvguFVTzQ3aVJkudLKlPFOqqoRFUylmOeIPFcH4QQcsBzGIgDHFzenT7CxJ4mscXDp0XeuG1Yr5SWyOsep82Kjp46Wspp\/cXgqSJVErQuOMeePcBySMFDwANBsrmZsvc+ena1TbIWE5f5XCsV2Tft9S4RW2nsq1Ie3VB9zFfV++004EUkz8Q3ACKoCuTxPXs2Rq09n4dpZmzVRGtCiNaHxCnc3ktynXrvQo9B9F8X68x7Ws36hpzXUazIlTaaudUqKmqqWlJVViGY\/d1R1VsEMoPQLhTp0Mbp383et+gA\/W0+Jjpnczfv5D+U649xVm1dw2ZH2eKn9Y2iIXyupahiaRoQilWVsoQvn5Hx8yqv0IUZpiFkzXjmVROUEb3f8dlVEbZGv\/MqjoD1tNG7U81gsm863eNwprVSCvirLPUU0LiSZKdiIqdoSyySsVRQACeXJvi66vxyNe6JuGaXGiHX57kb196K4x7XOjEAs1R+PVSdtKFN6bAtlpNclujqLZHLVU1FMVq4g7Ao2QfgVuEgK4I7gMQOuRPmw+Jc4iyD12WbMTDMXVrfwXPqNuxf40qWhmsokt0dq90pLhWxyVHmyBmkIYlirCP4ePP4stJxI65lbJ\/xXPD\/ABXdDT7tPD\/+OXB2t6j77qUrYVhhWmMsck0SqriMYx06dMkj89ZJBGtaLPIO9Lgb32DFvme0CrrJYaOgqveZKaNRip+FlCsT2HxZyMHp0IzqzBiDh82UakV6KaGYw2QNT9E6o0EaBR0AGBjVVV19aEI0IRoQjQhGhCNCEaELB0IXgb7R1ea3x+8QZi3ISbgqnJz3AqH\/ALMaqE+IrYYKjAXY8D92121Vrq617fiv11+FKbz4vOFOSQSwX079x11WlGZ261MOcrTQtXj8G6bxNvVTdqjdSWtLTEQ1uqKWnaCeQAMeTJk8f3OhPq3yGYixgFt3T+Y+6kAVjTS025Nv0oroUmgli4SRyKGVh2IIPpp9W0FUbLHnKuRL4Zbeq6Weja203u8oIdBGMMCMHOloFSNme3ULzz9rH2av8V24qm7WiJpNvVWWYYyYT6g\/T66eyTKcpUj4xO3ON1WWnikp3byJElgJ6KWAx9PkdTEqo0EL0n9mveE24\/A+1\/qlqaC4xItvqWlcp5YjHX4QrA8gQxY5yWOQcDPY8PkZJC3Ns1WW5T7yQ+LNbTXZkoayaooZXQLNFh2CSM7joCSAFycd8jHfvrtOHxua226rdwjS1thM232ctYrhLHC0sJV8sg4NwySev9XspOr2If4XC+isTvOVw8k3fY3t6HxKopYojGsYlJ+LIyo7Y+eSfiBHYjr1J5EODYj5rAfXKJV\/d37BuO45oamCop7clPHy8+oUknpn4R9wPfWbh8dHhwQQT6KphMS2IUNSeybO6PBLcu99gVlv\/wAPGtVLcYHp5nioIXAjIIOTkEAjocMDg99Sx8UhhxAkbHda1Z1U8uMqYsANhUV8fvYs3d4IWikvVPVDd9ikiMlTX22kdVoyCAOYy3wnl0bPocgeveYDj2H4i9zXjlu7E7+imjx8Tsxk8Fdyq9j8iNbwo7K6yRsjQ5hsd1j56T1TlkdtCcspG0rrGg5Ox4gD1OoZpWwxukfsBap4mdmGhdNIaDRZTu3b4Z3LaFJS1s7xVNHUGRRNEeiskjIwI+WV+0Mg\/POQOA4D7YYTjM0mGPhe2tD1B2N+a4vhPtIzHuEUoyuJOXsa6eoVivBPYu4997NtUtkV4bHC8VJUXBYlKwsWAc8CCW45JJ5D54wQTZxmIEL3Nc6na0F6GzFiKIZXUa+qshXf4urTb7tZqnaNTBWUFLFUw1TyL7xUo7IqzK4JAOZFbiRjuMemuba\/EyESB9gq9DwrH4lsU8c4LZCW9aaQCSCK8k1Paut3ufgjBHl28pk8qY4UkBThvoSOnT56swSZ8xHVc0P6jx1G\/qvNqtiWW7ohI5K+fsjv9w9f+MnVzh4\/P1SQf1VbjwRpKmSyOZ5kFNTwqCE+CToARlgQR1Pbpkkdepz1U5ygdyt55oBTJs9oLmYa2VzWrJTGF6KopzIV5lDIwUnquD1OGwfUDIOPiiQKGnW1QmOUaaKULL8dzeOipzQ01DTpDS22chIzMB1crGePwqY+K8uodgcEYHOSgtFu1J3P\/axX20a9dz1TYF0q5b7VbarqCjvtrloaeSKO41knMyQp5RWMMkokBbg5kULkMCTlTibks5YlaSHAnYdD1OorRTctoaHjQ3+vfZbIN5XG9QS2nZhukgtYgobhBUxqBLIchVllKE4GFjkxEcKxJzgkJ+GawczEVTtR\/wBfpZTeQG+KYDW6+\/8AaeVg3vQbsvVo2tcaxDW0\/CSmoaB\/eEdIhkuZmjUOF4kNxGMgAYKsNUn4d8MbsQweHqdt\/K\/kqroXRsdMwaHcnTfyTe8WN5023d2x1VbWVEVVQUopaBkpZphXOSY+UrU4VQqSFiU5DOOy9dW8BhnzRFsYuzrtoPK+\/forOEhdJHTBd77afNbvGWtO7\/Celvs0kdPf9qyfrIPHKXgqljULOY1DElCXdFZxyHE9gSdLw1v4bG5QCWv021F7fHrojBAwYnKB4Xael7WlHgRHS7q2tRbop7tJTbfeCWmntM8WG5yStyIqVOcAOOEYGQSQD8WdN4qXRTuic236G\/Qdv1TeIFzJjGW+Le\/9J+be3PN4g2677as4rLZTUUPuv65WrWqIkBdShLfEwwo+IHJPIZBGTlSwfhi2eWjetVWndUHxcjLK\/W9aqrX14VXTZdw3xulbVHUUO8IzFDd6esZo5pBEoRJfJLEBWHHDgDII6nTcW2dsTM5BZuK80mIEojbmILelealvWWs5GhCNCEaEI0IRoQjQhJa65U1tSN6mZYVkkWFC5xydjhV+8nppQCdkoBOyUjrpEi01tZDb6OoqqmVYKeCNpZJXOFRQCSSfkANIgC9F+fHxLulPuTxL3Rc6FzLR1dzqZoZCMckeViD+Oc6pO3W6wWKUs+xzuCms3i3Hb6spxnQsqt64Yg\/2agkBq1owHUs6r1OgkpJLWxh4qGj9Pu029FXIcHWU0bPctxVlLU2tpEslLFPGYK+FkldoxhnDK68VyQy569DnoezBeysOY28w1Trm3Fb6aenpo62CSplPBUWQEsQM9gdOJrQKDkyAW5tBQ77Y5p4\/Z83pW1QXzKe3yPEx7h8EL\/EjQBmcLQ1+QO9F47bcu9SYo2cebGSFcydSD6nPyJ1oubVrKjkOi9EfYlr6dhQS0ErzS+51NHX06KW93ImjkhY\/D0Dr5qjBbqAPXpqcOkLTkuloF1HdOTxd27H\/AIVU1Nbog1EjB5amNB5MiPyORnIb4R9okgnPTtr1Ph8n5BzbnoumwbyItUl3NflpNjxqlOKyReIWOeNkl5Fip7dMjJOfUd+mco9hdnJ7JHNLs19k\/wD2IBTQbNskVuoXqJaqWeaurqdwODJIyIrdywx1A7DOfXr5\/ijZJJ2WKGtdC+VzwK0APXqfRW13HUR1Jp6KWQQ1GQ1LUHoFk9Fb5Z1lsBHiVPBMMYMjRY\/uHl3HouJRXNXtAt0h8mFrkqNGT9iPgZHX8OLDU+XxZx2Wm+E83nt1OTfzugfim7vDxJqLBt2eaeOSOC6IyRPOvGnii\/qjPQsV9B+RPQcnxrHvhrD4eOybBPnW3qvLvbfijeHxHBws12L+l9VTrxw2LtzxJp5K62mmtt9RedNN5Ri98XrhGOFDZwSGwSDxA\/e1n+zntHxD2exDY5rkh2cLvL+pFdvUnovPOBe0k3Dpc0ZuM9Deo8v1v0HdVOrKGSjlkimjaKaNijo4wysCQQR6EEa+q4JY8TAyeE21wBFdl9J4TEsxkLZ4zo4Wk2pFbtObw0ooq7fNoin4GLzubCRwqkKC2Mnp1x664r2xnfh+C4h0Zo1Xz06LhvbKR7OFHL1c0H0u\/wBlf\/wdW02jw53RLQ3by7vfasQlSOElErDj5o4KWdSWZ8qCOw6YJ14V7KSQua3mkc2qq9S0bb6rG9hWYOOfmzEHW8poXWtC6Gqd3g3dU8J7ibDc6eip6C81Rnp7tbmHuk9QQqknHwqzcVzgL1GSOpY+jYkfiRzATY6Hde0cT4RhcdE\/GcKBBaLdGdwO47j0vyTe8YLNLHvI2ymVjNLSw2yBB1zzrVeIfghx\/q6nwbgI8x9fkF0Ps9iGnBc2Q6NcXn4RkH6j6qRfaUtlouXhVU2qvieUJH7vSyxZ5rMEOD09OnXWVhnP5hLTuvLcNFLPI+Vvm4+i8f6+Kopb+lOAYquCXywj\/CwIbAByOh102A\/rWp4TUqsB4c7gro5KBWpI0gceW\/lqJEAAJzIOQIGfRf5a7flB7NdV04YHNUybC39TVd6uEk0ipIkcoaNGKkhvh4LjtgjPzAx376z8ThiWABVZ4LbSlHaO9Ep50qrlbVK8WZfd0bLqQfMwMHAyI3KZ+LOfiYDXO4nDEaNKyJ4TVNK6l2ukt53BNX1dMYKUHy6arij5rFHzZWHJVDBWHAZJAUhyrY5arRxBkeVp16j77KJkYDMoK+pt2VO0NlW5qK5gXOhphCkNfUKUeESLylKhDyfDAIQpPxgNk5GkbhhiJiHt0Pbv8\/nqmtgE0hDxof1TCuHiD77cZ9xX5qi1VFohaMTzzFJpVLtyWJGp0D+YrMQUcZCAEBcgaYwuVvIj1Dj9fPXor4gyt5LNQfvumVaK272ndUtBVVdz3NarnNFU0lUtvNR5OYyqTKGcY4o5GGHQ4bv1OgY2GK2gNc3Q618PiVaLWlmwBGieNt2dHu+i2Vd9xW2vutZU1FVNV1dlcqtSv\/KKrSISoLS4VE5Jklzy5MRrNkn5DpWYcgCgNenevTe1SfKIS9sJFUN9aVmLHsqKTaE22aOCK2UEcqQvTU6sGpDgy+cHlQmWRi8QY9MEMQwYHXIPxDjNz3mye\/Xy06LnHTEyc12p8\/8AXRdjZ+xrbtG3S0+3aSa3VlQZ7kYZiWinnYEZndQeXVlP2uR+11IY6rzYh07rlNgUPQeShlmdKQXmxt\/0nftVq2psdFU3WljpLtLChq44vsiXGGwfUZHT6Y1Wlyh5aw23ooJKDi1p0XZ1EokaEI0IRoQjQhGhCNCFpqaOCrVVniSZVZXUSKCAwOQRn1B6g6UGtkbLdpEKEfbVuVytfsxb+mtTtFVPRrAXU4IiklRJMf6jN+emnZSR++F4e0oEcyAjAc8sH0UZxn8z\/DVNwK24yFzbZvOvsniZQXa0oXqaOQtDGX4LIeJ+En5E4z9NSiPMyiq7sQWTZmr1Q9n\/AMarR4v7GpLpaq8mOSPy56ctmWlmx1Rx9PQ+o66oOYWnKVsNkbM3O1Ff4ZbuvW5ZZLhuGruNsbpHSUze7R8fkeHxE\/6w1A5pK6jB8RwuHhrl+Lupo8P\/AA0tey7c00FvgpZ5QOcirliPqx6nr8zqZrKGq5zHcQkxkmp0VU\/0i\/iIx2Va9lW+XAu1aprnHYQx\/GE+8sFJ+g+upISC9Z0rCIvVedNLahbp\/LT7RkIH3HGOn341oXYWYBRU9ez94m3Xwn3XQ3+1gLLD8M0DlvKnjJzxYAg9MA\/+GkY8tNhWGn+0q4HiTcKa67Js27aOpo4bbzZKiCm\/ZJCIoy3EehGFGMdQvH6k+l8GxIlBafqt\/AyCywqFZd2yRGujV\/PNRG6qXOGKdQcep6ED1+yNddLGHRH0W7IwGM+in32BbjaaS0zQVCSe\/wAtSXRnyY2BVT8A7cs5yQM4K5ONeX45jsopcniIpnx5ox4Rv\/tWw8So\/eLeGSncFFy0xbAVcj07\/wBn8CMqCwaKk4L4JaLhr0UIV9\/o4NwRC+V1xFJK8jywUFKJXmYgCRCcgrlcAkAn4mxjOdbLI3FvgGq9LZhJJMKfwjG2KFuNADoa1vW\/Lbddvenjdbb5QUVlotg3eotUE0cuar+iKODAjDYOOvXOVz6nvrJxHAY8cwtxEmm5AO\/y1+S45\/8A8fwYuBw4himd6b4iTr2\/bVRZ7cJn8G7btu67WstALNdHkpKta1zULHNxLoBGxPQrzOQ2MqOnzwuHexfDeIYgjO6Oh\/aSL1H8Vra8Xm9lMNJMOU7I0dKu\/nsql3Pwr8St3yyXuTZN9mFYqz+bT2iYRup6Ky4U5BwOuST3JPfXuPC28N4RhW4GGcU3u4WF3vCcNBwvD8hsli+p79lwN0eEW9Nm0D1182pebRRK4japraCWKMMew5MoGT9+tKLHYXEOyQyBx8iFttmY401wXD2xW3C27jtlVaommuUVTG1PCqczJJy+FOP72T0x651T4xgYuJYCbCTHwvBBPbzWVxbCDHYR8N0dwfMahXx2huF\/CK\/l7\/t+W4biqaVGk29FCKhqRHBZU87OOf2Msok6EqcYGvAuBey+IwUhfzWlm1kanz8vgk9lPYHG8Qi\/8hiZI4mbeI3t2\/2nBurxnoN72qehrdnU9plnwgkhucbPGeyNLEF6YJGC2CPQ9SD3ceDMTszX2vXMD7NS8OmbJh8UXZf\/AEIB7hpO9joLBTVo9\/VlJu223SWpFbcDH5FHUXCriijgIGBM4I+KRVeTHLPxEDrxwbXJa6MtGg3K6CThMT8DLDG3Kzdwa0kn\/wBR2BIF+XqrGeJ1eLF4cxVq2+ov1REi8I6M+pUgsGYdehPXHXP11z0YuQjZeJ4WH8Ti3xGQRj\/2\/TReTHiRFU2\/xmnr6tHk99jWvijkiCSxl8kK6kniVxjucgA9cnXR8P8A6teSj5ZixZjJBA0sKcqNre1igL06JNTBWid3UkyMGyCxyAAB1PfB6YwNdnG8t6roI3FoXLvNuW21cZimUpGpLq5JJ6ngQTnIJ7d\/79GM5mm1eYc41Tm2BvKrobVeWNwMgeZONPOxPmBQ+V5YLAsAvbqpCnHTAo4qAPeDSrYiIOIICfm6fE+KKnp4kaq5U68fIaeRUKM+WAw2O+RlupHLBxnFKHAWSSqkOE11XCqd9V+6Nrq360aluVTEIveaMeWVyz8VEQ68fiODkEdD1y2Zm4RkTtBYClGHYx2y4yeJVw2vTwbbrZ579DNSHkheOSX3guxRRzQn4CGJBBILY6hRqQ4VkhMrKbr6eqkMLXEyA0nxatvbkum3t4W2oljNwhtyPBT0ExeaCHCdJY1b4SI4yMITgsxPUgnMfNh2yxnpet7H7KoukiY9l99exU6eHu6KZ7TYqTcNHWU0kdJJV8GXmyxo6RQO9LhpC0j5ZTxySg+g1y+OiHNkfhzYuv1Jo9gsHFM\/Me6I2Lr\/AFaeG6doPu2+FLVDaaq829KetqfeK2SGeWUMyIZ4oSAVeEysC2ckhTgDpmQzGBpLrANgaWK8iexVGKXlNt1gHQdvmpP2hRE0NBNNba2zT0tP7qtFPWmVAvwnPwuyuRxADt8Xftk5y5feIBBHelnvNEgG\/NOMDGoVEs6EI0IRoQjQhGhCNCEaEI0IRoQoc9qmy7m3L4WVtp23Z4r+Kx1hrqAyBJjAc5eIlgvJThsHocatYdkT8wlNaadr81aw4jLjzDXb1Xib4m2hdqbovVviVXWCeSGJo3DjirkDDAkHtjIOs9wLXEOV6i0WVEd3p5qdgSxSSTJ+Hp0IwR+Wfz1K1UHJ5ezpvfcWwPFmxfqOvmpFrquKkqYlOY5kZsYdexxnI9RqGZoMZPUKzg3uZKG9CvWza\/iHdrUkfv8AQvMpAPOEZH5d9YzZe66V0DXbJ5tv247kpjBQ0klOrDBmn6Y+4afnLtAq\/IbGbJVNvby27JaINqVIDSkvUq0jHqZGCkZP1wdSwinJsruZH6Ko1o2+1VWOJwfMlj5Dl0wwJ\/tb+GtPYLEq7T1tqLBRFhjzU6EY\/s\/47n5HSVSeCrO+De8It3eEt0tRWN7tQRpBBU1jM0UEJ58SUX7QBAU5wD8OTrquBzESZb2WlgnU8G1H1wSaoZa6a2y2+qghlaojnjSFkwO6AMSVb4jnJ7euc69IElxOvsupD7jdfZTt7Eu7Nsy0tnNXNR0W5KKSWjSnlkbnPG7GRXVDjtkgnBxxOT9ka85njkeC1osVenkufOLmGEfh\/wC12vxCuN4k3dJ7bT08EiyUzJJLIR1DlQcZ+fUayoIyHHNujgUVvMvWwB8SoB8VaCbZ72W5QW+kuVovcMTe73AZp5ZSo5Quxx5b5yUkBBGWGcZxsYZwlzNJ1HbdencGlbj+bDI9zJIidW+8BejgP7h0c30KeWzPAjZu5LXSbh\/wMuFprFlYzWO6SysGYZHEcm+yTghj0xn4dZfEOJYrCxPEXjIGldT09PNc1xX2n4vhHuwjMW17f82tGo+Wh7\/qpXu3hzS72oaem3Lb7NW0tOecFFPbYqqOA4x8JlB646ZAGvOYML7TTuM82NEBP9rG3XkSd15o7EsBJAJJ6nRd57VURNkyIc9PMjTGPvXr\/A\/h31zOM4BxCOUzSSg5v7mjWydSW2dx1adO26c2dhFV8EhvGzabc1unoLnSUdTbp8c6atpUqFcBgw5I3wfaUN1B6gfLWvw3gvEoZDPhZuQTsat9deoaL+KYcS1vn9\/NRrf\/AGYdqm5W+727bVogudvqI6ulqrVSR2+pikRgysOA8uTqPsupGt38Z7W8LBLMSMXGd2uGV1eRGimbimvFEkfG0t8W\/Cep8V5LTQtuWpsdBEGesoYoCWql6AEnIAIOcZ5D4u3z6vAcYhY4Ny\/mOF0dwuw9n+Ps4GJJeQJXn3ST7vw\/6KgvxKoLJQ7jtnhxty2pSWaCqpKOplDB5KqqqSQskj\/vcIQ7AdlZx06DXS4V7pozi3OsnUdqC9K4PNi8RhpOOY2QmRzXub0DWM3odMziB3IBTMqt0x7Qv24bVUWeG5zz3OdKd52kjNrmp5zh1MQ5KhjlQDJVSwOThSNWSDIGFrq018wd\/qoeNYuRmFwsmHflc5gvSw9jhrmuxYcD8CFKvtH36rqPBSgmmqqluRiZ2STBYcT3IyPx6jrn01UiiayRwAC8ywcxwuKdPGBY6Hb09F5k3+4NV7mqKqskqKqSU83eaTlK+evVj646a0MAKmVJhz4guIq9U+7NuKrjtZW3tKkCrkwYUluuR9MEkjr8xruo2gtsrqY2gtBXTtd5Mk0zVMEnncf2bytkZz1Jz9D36atNb5UrLa7LbQ11ZHWmpWsZJHk\/bQqOQkTp3PY\/d9D89SloJAKdlvdO2S92oxQRzIauZgXaWVgAWVVHTAwvXPQ9T9cDVcNc0nXRR0Q5IYZ61U8mkHB4o3qIJImQJx6rxb4hn7XTB6+nYjQ+gRZSOIB1UneANJcrzuqspbkZDxidIJKhFaMLnlwEfXI6uxwC3T11j8Sc2OEvHdZ2NIjjzBWF2F4XVu4aiO5wzUtP7nSQ0NAbX5iQ+7hnDkyMg8tm6LxTkV8tDyCk54vEY4RNLOhNm+\/Rc3NihGMnQ6lT1FRNcKWz1FfTxQvABWTXERRKkDR46YcsVVwXPIHIXPUE51zRdWYA+VarCzVdHypdQWKwU10k3mCoqBRBJK6KZhHJAMtlgp4uMHIJB6AY7aj5kpZyOl7eajzyFvJKclBVw19JDVQOJIZkWRHH7ykZB\/LUJBaaPRREUSClGkSI0IRoQjQhGhCNCFjI0IWdCFqqKmGkgkmnlSGGNSzyOwVVA7kk9hoAJ0CAL2TU\/wANpG3zJaFSga0xUxMtaa5BLHU8kAh8r7RysinPYclHc6n5Q5WfXN2pTcv8vNrahbxl3nYbBeAzXGeKz1TPNd75b5HqZ54oWlBt48kFo0R3JPIgKCw+etrBYd72E14tgDoBtrrvotPCwuc0mteg\/fVeWvi1t2oi3ZTTXKKtSWtgM4FwiaOYqQoXKsSw7nBJyR19dZfFGgT6m3HetlYxGrtdyoV3saabcnkU5DQwqqF\/Qn1I+ms8aC1lvGZysF7Lns7y7mt0O\/Gz\/wCqLxDIYSveAKSzfgzIfoFOppYD+EdJ90lgka3EtYV6QWe2xSUkWAGHEa51jAQuic7VO6z22KNMhQDqcABVHvJNKBfba8P5d2+Et0qqWMGS0IbgZT0EaorFjn7h0HrqxDC6R3h6KEzsjbTjvt6ry8ofEFhLA9TGFlQj9qvZgPmPQ\/8AHTVjpoqmYXZTiuu5npAKuF1kp5AefE91Pf8AEd\/\/AD08OsJrhR0UreyjuU\/4V1kMkq\/FFIg5ShFdHUAhiT265+8A+mtrg7icQWeX6LQwmppTPvc0Unv6VcoNRJThjSeWTwzkqSpYn7Z7sOnEEAZ16KCeWQV0I8TCDstnsSGOh33BSQ9InhL49Sc4z+Zz951xcpLWaLSxkLIMGWN2of7XoldbTbLxQCOqrUpJ3gMCc3UYYkHkAT1P9+sdrntNhcZhMTPh3XGywDaX0m1LZU7aWwV9NBdbdDGtPLDWRiRZCADkqcjOev01lYbHtxU8wiPuGiR3qyPgoJ8fOzEHFRuLHu1BBrf9l24qeOnAWJAgA4gD0HyGr++pWK+Z8vvFbFOOx0dFCt3LIx8vrptJy1se\/rpwTLWA2Rj1+uhLaAAR8eCAcjPz0hrcJzXFuxUN7zo\/DAb1kqblcKS33u0XGC6zqJCjyVDxkRqQR+0ZlQERpljgdOvWGXi8WBaYpZAPCdOtDsFv4X2rkwkEmDM2hZyyD0BOagqw+KV7sQ8d9x1tLJEsFc9LNFWr\/wAjKhhUdH7AmQS9Djl3GRjXR8B4nh+IYUvhdeU1e3n+66XhfE\/xmEDHPsR+EeQ3r6qQ\/aLmb\/EnSKI\/Nj+Dt1JXic4+ercdCR17qk1tSvIXmDuFwL0wx52H7jrnr6\/x1bwJqfVVYj+eaT6sdC0tPEsZVMgli5AHz7fee3p6a9AiYcui6+JvhFJfWUFRRQ+flTHjh0YkZ\/dPT5YPX6aldYF2piCNUhjr56ZubSho1yFYkksfX+3TQ9w9E0OcE4bJX1FZ8aRvmNcN5TccKR04t3HbOe+pWuLm6qQHMDalrbNtprjS11uEBqZWjSdAMxywNy+LrkjOcEevUAjGdZ8rjYKpPcbtTz4VbLorPDDuOSmhq7vQNLJQQGrlUykKV\/bkGQBVBlwzEKMk4Hpx\/EcQ9zjDZAO5\/hc9jJi4mO6B6\/wrG7JgtVyqEltc9Z+raZ5qdqepnmb41d\/NYl8lmDGPic5A6qca4+YvaKeNTX+v9rm5S9thw7J22hLcBQRWVYfcaqMzNxiZoxDwACKccU7phDjoDgdDio7ML5m4\/VV3WLz7hdK0bbp7NNIKSSWOhMSxpQfD5EWGdiyjGQW54OTjCrgD1Y6Qv97fuoy8uGu\/dddVCKAAAB6DUaYs6EI0IRoQjQhGhCNCEktcNRTUFPFVz+9VKRqsk4QL5jAdWwO2T6aDRJISnUkpTI3FCfloSJjVd8rt42kx09kmhtNTHVwVq3SmAlAVWVOMJOJA5IIz0K98E6shrYzbnWdKr+VOGtj1J1FVSgrxqsO5qDbdttV2eHc1zu9VOkl3hihhrbfTJgoIEbAOEV5D0ILAKACykb+Ali5he0ZQOm4JPdbGEkjzl48IHTcFRl4W2\/xS2tZbltqnsVvukMdZWU8kl4jVJ2SWP7WRIw8ou3M\/CwJ5Y5faFzGS4Iu5z30aBobWP36K7KcPK7mZqOh020XXp\/Yg8O6u3UFZu81ct1hpY4pUt9Y0MI4gclXpyIJB+JjyxgAgAY4nH452LlMh0VZ7nTvsLrbd294J+GFXLTWPw+pKWpRQ71LUSVFQR16+ZKWYjp89ZDsQLpWWcOkIzEhOfZ+29nbbpqqq2wtKlsusxm91iICBn+0Av7oPU47DJHTtrew3EGfhyyTWvqsLFcNl54c3Tv5ea+ajxG2hsyuksyKK+oiTNQIJFZYM9kJJznGuefI1rjWq6NmElezMT\/KfNkqbbuK3pcLJUmanP2o\/3l+4H1+mrEWR7gSdFmYhssNtcNeiYvtJxvJ4Cb4hpkKs9qqFPUgnKEEn8P8AxGMHXWxRMZERHsuU5j3zAyd1401Gy6o26RkjZnQF1Kj1Azj+eufGhW+4W1b9s24wxBaqAe7TDrIfi4n6g+n9400iilB7qTfARqm3b8NK0aSsW4KsYAWdCGIUY75wBjvrb4MQMY2+qvYMfmgKzN2uRqLXUrJaZKaRYCHmDqxlbGGbpjByMn7WfX5a9HkaWMdr0XQlpaCbXJ9iarz4iUUcgHmqjKCO5QkEMPp0x+I+euNl\/p0tLGvLsFlduB9O69Crnav1ruO0QynEEWZ5fqi4OPzA\/hrn8ZjY+HYGbFymg0E\/Jc1hpuVh5HDc6D1KkK3RNHRhn6SSkysPkSc64z2QwkmH4W2WcfmSkyO9Xm6+AoLlcS8OkobDRRX4v7ove3PEvwyFnt1fexVS3KOe10NXFB5wFNyVm82REIUjIyc9emuzVNRjuHxevtvn8WYLhT3jblzuNws9ltdvMnvs9H7xTftZ4Upmk6pGs0+Eyf2RJGhKuN\/h9JuW3+H+12G7dxNZt011lq6Siqqi23K4UiW+omo5ZTNLTucxeSzF2HJ0c9fUSgL4ks+56HxRs1rvW3d+V22K2G8Vdp2xBuYG400SC1oHnmFagZRK1SVQzSFRMB9FS0VonDFF4jeDO2qfeQiuFeaqvez\/AOC18vHvUlPT1NV5drd5+bqZY5pkSQhmJilILO0K5VJSsF4f7Wn2btOitlbc6i9XEcpq241LkvU1DsXlcAk8VLE8UHRV4qOg0tI2VK\/FqsqYvELfjVSF6SC4VElQzU7sqAqgGSfhYGJYhx69MduuvI\/aFt8WDXGnuyhuoGldvUm++q8yxWKkinnBFgE3ofvYBRvDa6+K6Q3mvU0zyNFGtHS1rmURtlkPINmZss4KksRg9uD66\/2U4vBhZvwELXSBw1cBXiGh00AHnp3vULt\/Y3isuGe\/DzRk56Iy6\/P99dFOntGyLN4E0BnRQmI2KTtwKnie7DPX7s69VafzH0vT2D8x5IpeaNe4\/wAJW5fZx0U5OBnoOvX\/AM+2rfD9cQqsH9dSJaIEr\/K4K8SEY5A9sA5JI7dtegxGmrsY\/dCX11rJlKRNygiHJGD5YqwGBkgH1P16dfrNlugpqtc+CnInTzuBd2z065J6nOR89NAHVNDVIuwtvxS1dW0cXnTjKoWdVAbPReJIJJPQYyMnr2yYJ3lgoKOZ2UUp22d4f26W4z3W7wxxGN3SOtVGKmo6ggFlKMckEDkwyOoyMDnsTiz7kax58QaytVgfBBEp6K4ztb4qmmin90ZmUZcM4UPkjr1JXBHX1OMnXJ8XOYtF6rnuIGyG3qpuXb1LTs89PRvBOkonZqbghqWCBcHr2IVVwcfZHoNcyJXHc9PksHOTuV0qKlt1ljSjpY6ej5DKQxgJkDC9AO+PhH5DUdudqdU23O8R1SmhgempljeokqmXvLKFDN9\/EAfkBpvVNSjQhGhCNCEaEI0IRoQjQhcbctbc6GnppLXTR1T+9RLOknpCWAkYHIwQuSO\/bt1yHRta405PYA6wVq2Xu+i33tulvVvSdKOpLhBUx8H+F2UnGSCMqcEEgjBBIOnyxuheY3bhLJGYnFrkm3bXUe1rbcL5WXOWggQReYww4IVj8CIR9p+XHp1ORjqBpYY3TOETG2onSCNtu2CiK37f\/wAIt83XedxSalqa2mWiiomqGeEU6ujq3ltkLIWReRGMFMY9TbxOKOFYMMzXLr8f3VyKQ4iBrG6N3804au4UdhoWdVUKi9FUdTrm5Ji63PNlX4MN\/YFFW6zetxwz1iNw4qfLgycAfXGqDiX6roIMkXgXJt+3rZb7U1XUQQ197eDLyVADhX4vhVB7DJT69tdpgMDCyJryLJG5XF8R4jiJJnRNdTQSAB+61XfcVn2IIFr7fSwyLTz3GKuqOIhggZS0nI\/MYwF\/e9D31zBYXylsbdyaXYxuLYBJI\/RoFqvu1d4bb3lt1rtRULVMNVLJlp0VJIsNxyeuVJwGwc\/aHXtrWPA7YCx+qzWe0JzkObQ9VYXwk8SqeCanjinzTFhHIrLgocYB+WsIh2HkMbxqFoyhmLi5rOqlfxTsp3F4ebip4EeY1VunjEcS8nblGw+EfPr\/AOXfXQYLEZPy3HQrj8VBbg8bhePFRU1e266qt9bDxmo5TBLGw\/eUlWGq7xlcQVoMdYWvb93t8NHPDNCHRXkA5Drx5f3DTd0Cuq+b\/dYNqRfrq1ylapZ4kj8s46YOT+Q0sZLHB7DRCUPMZzBTF4Yb7vfiTa7nFRVdO7w0j1U9G8Y82SNUIYRY7kZDdT\/Wx9O6wXFWYhnKl0d+q2Iscx1Nk0tPH2J2YeI1HE0mHXk5hjTkF6dyc4UnI6D5\/jqs8flldNjg5uCyk69t\/wDr0Xplbo1luM3IfEYYlz\/mmQZ\/PA15d7Ys5vChEfdc+MH0Lxa4gktjB8z+midj9zjXVsADaGy5xRdcdxiuqKTdtw2vE9vsdZV09PXpcSamAea1NLIIOAVgeJPHmWx9kFsKXIXOSO1rda\/xLk2dAZKOapM1xW5u1SsdP5lM8wgKiPIjR+gblxZgMkkFEoXRt236bdO8hven2hb2uVLVy0cVzmu00cxWnkqabmYliKZ4yz4yScSAE9BhAhdW2NV7ovVu3Ou27cJaUVNBT1st0lE0dO8yCb9mISpLGnjbBb90DkMnRukXN39f5nghtd\/2zQXKD\/71enpbrI7RLSMKhJmBgTosscQA5dWIGCOWFRsNE8LTX3+tankrLXbqWkkTkzwXKSWRcrkYQ06g9cD7Q+fXsVCTcUqu+114dfqvc8G6Ayx2e8PTQ3B+EeYZopEHMF+g5Qgj1\/5I5765Dj+HcwsxkTbc0EfMGth366UuC45gamE42fV97H02VZ90bje3+LVLYr5a0jp4442pKaSEGbzZ1idOalmCOycBjl0Pcgk46\/2N9nBw3hrce52Z8gF9RQvY0L33Xo\/shhPwpfNO339GitQPPXcqxPtEhZPBOgT4kVfLJX90AKemPlrpWkcxy7VrQJH2F5mVsjNuR34lnZmOMdvi\/sGreAP5yzoT+famTaVujanpqgvxdeXFBji46d+3bI7Z9fXofQYT4Quxh90JbVMBUTRibnJKhkczBY\/sFviA9AcgfL176mZpZKnadyU1UpajzoXEio4PwxcVHHr379vppoDjRJUYsm1NXgpaJquZJ5J6UUlFOklUKsrEhViVIJccQeuR1wSMdtZ\/EpOXHodVUxj8kfmre2JaWKJqOnjp2gmeaBKiaQ8Yh5h5IVBywwqFQCCwyML3PAyvcTnJOi5R7j7xKkSyV9to1EFql\/VslDc4I5qagAVKuofisik8v2ihCQOSqcxHH2OmPIHvOZ+tg0T0Cy3hzjbxuNL6BOdrjVX25PTtUXK3JG0ayUDJEDUK4yQHGcBQxDFWz8AwR1zUyiJl6Hz7Uq+UMbe\/mnPcNu01zegFRGksVJIsqrIvI8l+wck9wevr11WbIW3XVQNeW3XVdYdNMTFnQhGhCNCEaEI0IRoQjQhaoHM0Cu8bRMyglGxlfocdPy0iEku11odvWqruNfURUdDSRtNNPKwVEQAkkn01IxjpHBrRZKa5waC5ygOmvdb4u3IbjuMT0m3oXJs1unBHJO3vUy\/1mB6Kfso4P2s46aONuCZkb7x3P7BYkjzOcx26LsXuhnqrbIKeo91rk+KGV+oLD0b5g9m\/BvnrJxmFGJZY3Gy1cDizhX+L3Tuo7tPi7aJN0Ptu+Tw0l\/hAZ7a8i+aB35ce5UjrntjXLGCT+5pXXufHlzMcE\/YrnZJAeNREGYfZ5jRyyBsmNlIO6Z+4\/DaevSaezVEcoYFhCWwQcP2P3uD+GtnBcSELeXLqO\/ksvGYHnuMkeh\/UqGd\/eGNZvbna7g1R7mCOUER+J+PmCNB07Dgpx92umidh2R83QDe\/XdYTvxDn8rW9qTr2D7O1v2lYa6jo6Ag1spdwy\/ZTAAXJ+Q\/JlBHrqlLxWCIExmyrcXD5pDTxQT4HhFFb7YIaRVXivxHOST9+uHmzSvMrtyuyimZE0RN2CkDYN0Y2pKOrf+lQDgxPqR0zqSF9toqniYtczVVf2svYqqt9bibePh\/AktfWOFuVp8xIkLHP7dGYgDJxyU\/ePUa0WZ5TlGqzC5sQJdoqD+JPhpf\/AAt31W7fvEY8zJkhqYQfJnjZvhdCQMjIZT0yGVgeo0+WJ8L8jt0kcjJWZ2rk3y01NNDHTsDURGQP8I7AAgEj8R\/HUYUlE6J2+Bl0r9ieIlgvNqd46inq1cxscLInXmh+jLkfjnU0DiJBSY9oLSFe7aXhtSeHftNsttQJaLzCLvTgDHDzTJzT7g2CPpx+WulLvySOy63A4v8AF8KIAot0Pme5Vob7utNsbgoJqgOaWWNoZxGpZgpYYYAd+J4nH36wsdw9nE8FLhnGrGh89x9VWw2EOJwrw3cahShHKZU5N9rsfv1n8PmdNAOYPE3Q+o3+e64l7crjShyo8L5qmz3OgTatBDepq+rqqXcLSRg07vVSSxVAKjzOaBlYLgZK8SQDnWlqo9F1abwnlTa7oZZJLvFcam4xwTV870U5aqllSOSEsU4MrgH4DxOGAJUaStEdUosGyVtbzvV7LoK2te5VdaK8NCX\/AGtVLMjZYcuQV1\/EHHz0iFjbmx0sQQy7LtlTcI6yWoFxVog5LTu6yZK8uQDA\/POlSrXbtubjksF9S5Wunkv98p5IqutFYDFFlGWOJBxz5UfIgDGSSzEcnbQOyaO6X7R2nBY66hePY1otEsUfltcKRovMT4CDjjGCc9u\/rpwFJUr8V7lb7LsO63K6W57pR0ERrWp4YPOlPlfGDGuPtjj0P7v2sgKdZeOY7FGPh7HZTMctnYDr8SNgpI4WSkZxdLx63lves374gXLcdz4LVXOtNQ6KfgjBb4UH+aq4UfQDXvmHwsOBwseFYKa0AfJdG1uVoaFdD2iq17J7N9nq6lJpTJHGjcj8YJQ9evfXJS4dsmJlMdaJYcWWFzH6rzXa6pcrsKhF4FmcMmeq5Y+v5apYLSekuGkEkuZSrt6p40sU3mEpxxwPcqe\/f8\/T+evQoCCy12sJBbZXReNpZXkd3eMKFyWAXHoMH07D7+nrqxly+8p6A3XY2lZafcVUGb4qf4P2uehZj0A6HI6t69OummQDUppfWpVgPCfbs23L6kMdMtR75NxkFehjhpvhIU8uDAnLHPXHU9QQdc\/xF4xEZvYdllYt4maR2U+xU1svNnqarctyZ4rBVe8Vfu8xSI5xLGqcY1BGeJJU5+JgSQevHOL2uAgb740\/TXVc2S8OAiHvbfva6dfueaGyWC4m5PLJcZaj3SCmpYlAqWcMZXb4V4J5kgDDJYSB\/iI5GKOC5HxhvugWbO3+1DHF4nsDdqvU7enmpPetNlFtFtoqOqa4iNYX8yVXmZAzlpCqfCBHkhcdzjGNYuXPmzEivvus0NzWXaV99085pSsENdWVXuEMGZJB5gCceJGHJHYZz6dRqmN8rdVVGppq6UE6VEayRsrxsAyupyCD2IOmeRTaWzQkRoQjQhGhCNCEaEI0ISSvuVJa6dpqupjpolBJeVgo05jHPOVotNc5rRZKrtuXcqeO90kpVimTZdsqwAHGEuU0fXkRn4okbBx2Yow6gHPTwQDAss++fosaWUznT3U6Kmvp7NSt5xEaqQiIg5Etjoqj94gdh6qfppgaXnT7+\/1TbDQkPvTKnvFcEijUZ8syYVFAPTkcA469Qeo6emlc3+1nzStPVyiveu43vNSwoIlMMQZFk4\/EcN6HHRc56fTOp2R0NU696TOm25ealyY1IySO3+dIn\/aGlLRWqla5LrPd9xbZqYqlvNMasJCATjqUJyB9Gb8tUcTgop2nTXur2Gxb4Xb6FPas3m5vMn6kSKvvdcivTUsh4rCOI5SSEA8VB\/8AD11zcGFnxB5L9GtJXTzYnDQMMzdXOASuRfFOKl95NXZZpBnlTtC6BfvbmexyDgeoIHXGtVvCsORRebWAeKuuwwUmNW+0DuXadQ8e5NsPDTrIsRqKWXPUnA+FgMZPUDOcdTjUUnBiBbH2pWcSY405tJ17J3lLvqoNVb4Z6SiLftZ5E44bAPBfQscjtnHc\/Wg3hUofldsrz+KQiOxv2U3WSvhqaULGOBjGCCfw5ZPp\/nHqfTW0IGwDKzZcy6d0zi5x1VbPbS9n3\/GPtmmrLaoiuVJM01DM3RY6h+hifPaOfAXJPSTyycKXOnvi\/FRkD3x9R\/r9EsM34d+vun6Lzpu+4UCGGop3paymby5YpVKvG65DIwPUEEHv8jrn8tEhdKH2A5d\/w1v9KLkZqiFZqcI0RkQcpIBICjMoH2uIYnH3HUsOhzBNcbFBenm5aGlqL7sW70gT3OHlBFUFh+0ikjypH0+AH8db7QXsIbr1U3BsRkZPE\/QEWn9TU0N63pBJLEWNFCamJsfDzLBEP\/WLfhrnPaGebhnCnzxHxPIYPVxr9SrseOAwroG7k6+ikpUEcYQdgMaXCYduFhbCzYCv9\/Fcu4lxJK+Md9XAmLgxbxtsj1EUYmkMPN5uADcEViGc4PQAg9PtfTVb8NHkLK0JtOsrcu7reGTzPOglYKVjkj6lWweXQkYA+I9egB+R1IYm5w8jUaIvSl8f4YWp4kKtK4kDuqrGcniOR6fPtgeuR89RnDRlhYRof5Ra32\/clBc5ljjkxUFzH5RZSwIXkexIIxjqOmpQxufPWqRdNiADnsPU6mQq2+Intibfgqq6zbboJb3MiSeXcjIsdN5qEqDH3MgVwM\/ZBBGCQQdST8FfxGDI45diD1BB3HmuiwXCMRNUh8IPfsqdbHpbRDUmrNtpYrhT5kllSmRZG6kk9B8J6EFR0B7fDxz2rXEsAebIXbRRRRxZQNQp89qiimuHs9Q0Yx5srRHiT8KN1Jb6ev4ffqlBJkle49lzU0XNLg3deYVPbpbde5YJOPNWyDnAbrp2DN4i1RwbCyaipKtcki08AEbRmAAoXOM5Xqfljrj89d3CdBQ2XaxnQV0XWobjLK4m85WhQEKJVwF6Y7\/LOMn79WmOJ1tWWknW1Inh5uAWlqnNHDM4DSozNgAjoFDAZDEO3XIxjPYElkjC8UU17M9J90viHUNaPJYU7yRSczBOWZZYweqjiQSzY6HJwSdU5MKGu0+yqr4ACnnSVNZuOe1T0y1dPFFPHHSirp3HvCzxlGRnZhz688sVwoGQCCM5LmNjzA6mtdeypFoZfU\/wp42R4b1dRdrZPeq+qngt7u9FapfLhgqJPISORihXPE+Zkx9ABgD94a5TEY1oDmwtou3PXf71XPTYkAOEY33PxUkWqC+09DJQz+6frN5EmhtNmqEpiKRWEJcMQGJVCpIOBlVUHuNYrnQl1jbuddd1mOMd307nVSgLJSy2qK31a\/rCBFRT72BIZCuMM2R1OQDn56zcxDi5unoqGY3mCXIgjUKowB0A01NX1oQjQhGhCNCEaEI0IRoQoE3ZYl3XdJbjdJ5qppQI4oSxWOnj6\/CoB7n1J6nA+Q10kBGHFMGoWLLcpOZfVvqaOw24rhYIYmKRxxAZ6HoFHqcnoPXJ085pHWU0UwUEjnlZI5LtcJIoo4shVD\/DTp\/D785GMkdu7w4Xy2D\/AGmhprO5RJubxDi3hTyRW6eVKBJmgmXHlscEhiwPU9AxA69BknsNaUcHL1coC67pd\/aFpWphZHUByBnp2LGQ\/wA2A1FKaGiew66\/e6f1FaIlRm4D+sOn3P8A3\/lrPc7VWRslM+3aaeKWNo1OQV6j5CQD\/s6ZnTvRIrBtShtW6aqpghWNlpyOfHJHKVz\/ACHUfInTi4lgSEm08WjAXtjBPp2wMfa9MZxn1BGOuobSEJob221SXC1SiSnSQK6txKgZwwbGD93bv6n0GrMbyTSadNVE1VvWl8Dr1BLMkpsddVrSTlYfNSkZuYEzAdQn7Jg3YYKk9tSzMErK7oY7KSQphoLkaOWOpjcFO5KsCGGO+e3QdyOijtqMNzNyqKy05k8pYaW82yannjSeknjKOjD4SrDB79gc9+51RBcx9jcKyKc2l5w+2h7LddabzW7psSmpcq0lwgUASTxAEipC+rqBxlHUnAkI+J+NfGwCT\/kR7Hcdj\/tX8HPlHIf8FBPg9bksO5tqz3ZCtvk86olfGCo8p8YPzBKnPp01XjiczKXjQq8ZLBynVejtNZK6g8J\/CilrVL1dA1Cs5K4KH3Zx1+4sBrpeE01zwf8AEqtC4GZ\/mpZtl5jt2+Y6ByBLXUHKHJ+08TB+P4rzP4a4z22wOIxXs1NicMLdC5r6\/wD1IP7LSgGoJ22+alJJlmiWRDlWAYH6HTMDio8dho8VCba8Aj4rNe0scWlfOdXkxcr\/AAbtrlpGpGLZbvI+SCxJX7X2SevH7P01W5xyF2Q6HbqU4DVb47Bbo4WgFIrRspB5ktkFeBBJOfs9Pu1JnOcMynXr0SVotb7ctbLKTbomLkcsoMnBGCPl2HbUZlORzsp06dUteaUU1upaLCQw8QHMvIksS5GCSSckkep1KHHPlpFJreNFRVUvhJvGajLCdLVUEFASwHltyIx1zjONW4a5jc21hWMKAZ2B21headVb6mo\/bUtJV0kwbmCphY8u3LiZB1x07gEfaDY12had2r1ZzS7xNFffZarbUyw7ntbV8axTTN7nUBEKCUN0X4DnryCjKs4wxBPbUJJB1Vd7yHAv3Oisf7Q5J8CLYWlGWWPLt+98PU\/+H36pFtSPCwhq948l5qXloZNwDgQQpbA69Tn8zqbBVz1SjIGIT\/21TNdaMTCMPFj4miwxYDDAgfP5Z\/v13uHIe3MuugIc2ylt2hlnkjSIjyscVkkX9qRn16Dv8vQ6tOBcPDsrJt2yce1NpXapRqxoy8CBuLRrnmAwB498sB2+89e+mZjHudU0uyCyVP8A4X+Ckl8vtsujiCFaasUiKQZ5tgnj07ciVALBcB+pBXGufx\/EeTG5larGxWMyNI6q0+2PCChhhra6rh9+gnVXK1HHEDoSoljZF5LIgMmDnkenXkxOuFmxznENb0+9VysuLc7whPmi8OoKuvpGnuInp6NY5aCBWYgDqGMkZJVwVCqrYBUZC4ydZpxFA03U7\/6VB0xANDVSFT0MFOAVTLgEc2JZsE5PU9cZ1Qu1VtKB1GhIs6ELAIJx66ELOhCNCEaEI0IRoQjQhQ5PJGIfiwMdD065\/t\/HXQC1jpmuI7xdDVqAKWjZvd2Rsl5OzN+Hb7\/uBOgBy2ZTuVVPidfZN3eE7XUGiclqXhmTl+\/9Ce+MY6ZHfqR0zLEyvEd0F16KHKx1t+6ILYI2mppR5QkjOGi\/qo3zXqAAfs5wOnXWrqWWVXsWpz2lFlmZhxyck59DnP5ayJSrDBon1RLyCcx2wD+f9zH89Z7lZG1LowxjC8voD\/1c\/wAm1D0TwB1Sa2w4q6uQnqTGuV6kYQHt8wWJHz6jUpPhCj6rpDHTGAQM9G7evT6eoY9gfnpuqcFzL3Fyp4Ux0eeNT0x0zyPft0B6dz3OpIzqSmO7KPN87QW92yaIrkyRlT09SgH85W1fiko19\/eiiLTV\/f3qq3ezd7SM1L4p7k8KN0zMJYbjMliq5Ty5IGJWmb5kDqgJx3U9lzm\/iPznRv3tXXweASMVzrNcnttR5M+YoyM\/G32fmeX4jLfXA7akcGyszDoqrbY6itu8dtUm7rfHDLmKaCQVFNVx9HhkHqvqAQSpGckEg9DpkMhjd3B0Kkc0OGm6ha\/ezlady1tvSp2pt\/y6IKU9yWWlKfES3EJgFT34t0Gcde+rj\/w72jN0Ucb52E0dSpj3HZ627bcemp5YIq4GOVX4eYgKvyIAyM5CgDr66oc44cmSMXXTuiZ2Ijic\/DkZ\/PUKDvFre+4bHuHb94S0+9SW1kqPPtjmRW4soIKEBhnkq9C32wBnOrXDvaXhAimwGPOTmAjxed\/wfkqWA9pstxY2Or\/ubq29Nxv1HdW12\/ULNRyKmfLRzwz0PBgGX+DDXkHseeRBiOH3bYZHNaf\/AFPib8KOi7HEkPLZB\/cAVyfEWnuVXtdoLSJjWvXUK\/sJ5IW8v3uHzcyR\/Eq+Xz5Efu5135VNRuLNuOw7ruEFwuV4qoJaSGWhSmW5VUEUhlqOUQlWXGR+yJaYH7Q6BVChqULVaNqb4lvtqpKqeup6TyYJJS1fWzU7f0ecOzv5yuJDIUBjzx+FG6ljxRKt264N3XO1W6wWeS+UV2orw0lRXr5yxCmNZ+yPmscTII3QlMthVYNjB0BFBI5ot5Xjc5vF3p7ta7bWwBltohqqqKkZeaBPLppEPI8fMLdR+0A+WHWmqcoIkmtyROgeN4gGSVCMgjsytkj6g5Pz0WgLy63LY\/MvlwM9seKvepkimpfNeGBJgxDxxQA8AFKsMYVRj7R667qNrSxuWyF6hhwwwtLLdpuSVxKnaEsNVSJI9LFLJITGsFOMxqoLNIevdQOhHXkVIYaHsrdE0TgNdFZP2jENB4GWuHnwaMImVHL93GMdfl3+7VKw6R5WKwnM42vNXcIFPco6yd4pY3dgE5ZIIYg5GB9Pz\/JMK4NmsqnGalzFPjau8pY6b3NYkQO6uvBSrDGSeufXocdR0+uu4w0tgArqcPJ0KclFtmvv94M9PQVDxRKrc6Yn4QCCTjsRhc5PoD8zq497eYXu0rzVtzmh2Yq9ng\/4XWuitEcZqI6mpp48OIJhMKaoTkSGCHqCAPhyD3yoLHXCY\/ib3yGhQXK4vHOc81oFLm3tqbV2qaC219O9wruZq4ZngbjCzEc5C4+CL7S8RkEA9M5OuemxM2IeXt0GyxpZpJnFw2TlqtxCkhl9zqCs0MRkio5UJdo+Pq7MVJLjo7EDofqTUETj00VfllOKjf3Wpp4aaCGghMRqWSnhUkrlSVJ7ZLM\/2QfQ5GetN3Wyqzhd2V3ZqqSEwTH4KYjDqUJfkSoXt2HU5\/D5HUdKIL5F4j\/Wq29oplmeMyq\/AlGUEA\/EOgOWHQ4J64zg6Mpq0oGlpbNUR06gyusYLBQWOMknAH3k6TfZItcVDTx1stYkSColRY3lA+JlUkqCfkCzfmdLfRLfRfFdXGjemUU80\/nSiLMK5EfQnk3yXp3+o0AX1QBaVDTQkWdKhGhCNCEaEKuN0kkqpDTwk8M8JpQccR\/VHzb6dh69eo62MAauXPuvZZdktlvTA8iJQFijUFnkbHQAdT6jP0PXsdAt5RWVM6urZrlD580D00knGQZbLr0zxBIHHufTJ798YutAYd1C4kpFszwAuHiTfFuMrPbbJBIJBUFPidgc4jz179ST2PzOcxYniLMO3Ju5Sw4V0mvROq0I9BUMkvV0yG+oHfUDiHNtOApPWhblHwBy2OP+8v8A8OqbgbUzaXRWQNGxX97JH45x\/vrqOk7ovihGPOYZPJyRjvjJxg\/hkfUEeupOlJnUpWpyAAcggY4r0PcjHz+YHYdc9tRpQeiR3GMSRR9ckP8ACe\/cMvQ\/ee\/qfoNPaatFWkVbEGV2wCB8YH4s3\/ZXTmuKMu68y\/bA8KKjZfiTc9y0hkip6qRZRLGcNG6nHNSOoIZS2fr9MjNxsbg\/nBa2FcHMyK0Xsv8AjvU+NmxjHd6J4dw20RxVk+AI6qQcwssZz0JCnK9ApJA6d9LByiRtlZmKhMZobKyW1blBV0AXrGVyOL9MH1X6EfL5fccOmYWuUUbrC7gAGQBnPr8\/l\/4fwOq1qWlmlYLOVLD48Ffqev8Af\/DTXbJWqMd97KvdVu+hS304MNyqkjFfTr5slFyJDTPGeuVB+AnKjoSchFPnnHvZ0cTc0h3hG47+Xof7up22JXMP4fjocQZImWx7tHD+29ye5HT+QFNltpotuUVNSRe8VY4xwh3IL4SNV5MWOSSFyT376kw+FPCJnvYwvMxb7oADcrQ3uKGi9B5OVjIr2FanUpfBcaeqXzIZBNAWKedGwYBh3Gut16jVSnCObo7Q9krC4JyMaFQ2XzJKsQBZgORwPqfkNVMRiosK3NKfTz9E5rS40FiORJl5IQy\/T56fh8RFiWcyJ1j70I7hIWlp1RLLHTQvLNIsUaDLSOQAPqTp0+Iiw0ZlncGtHUmghrS400WuG29aJ+Ro4aq4IpwZqeL9mD\/psQv8dcb\/APa8NO\/l8PifN5sb4f8A+jQVtuFedCQPvsqveM\/hPX3Pfd03ZY6Ca5U1VEjT0VNwmmom\/wCcYJGzErIVUkjJyvbAzr0LgnHTI0QYyB8RO2YCu+4Jr40us4bim4RvKxGnY7aKvU1zhuV6iajD1zLzhijpgZJMBWEj8R2TmYhk47Me2CeykmYRmBtb8jjJqwX97qefacKxeDlN2MeFz6jHHB\/DtrLj8T3LnmaSPC81bnQRVF2tyvJ8LtOzkdcAOAPX5DT8KPzwqkf9RTDsvZW3p6bmFlr\/ACwA0cRAkI7kqWU9MDt27d84117MwboF0LLDdFNNiqduWyp94kgpxS00OIqBZvIE+MngcLyYngpJHXiMAfazWmExGijkEhCmq079pLEklvolS62ylcunM+8MMszPHl8kKOZj6nOGznuo5w4F0up3KxfwpfqU69qePNu3hU0dBuCCliqZqkCCgqJGeFoTyVSSoKs5GSAwwexPqasvC5IQXMJI7qF+BfGC5p+KkSrudRVU1E62gmgmlkNaJYVR0BdHAKso58lLdApYkgZBydZLTl669FntOW+632msWzVl3rYKkVDTqxpYJqf9vTICsDKqqDI4Z4gScdcoOyjCPyvppFEfVI+nijuFINqv9NFboIeMspgEUEjx05Cg4wSQBhQMdQOi9jjWe6OiaVEsIJXVortRXGOB6aphnWeFaiIxuDzjPZx8wenXTC0t0ITCCNCudc7K1RUQzSOK2KOtSpENSikRAJw\/ZnAxg5fJySSwyARhWuyg1vVJ4dWgXTaleSshnFTKkaI6GABeDklcMcjOV4kDBA+I5B6YYDuEzZfFPLH+s6qISzNIscbNGyny1BL4KnGCTg5wT2HbPVapqOi21tRLTQc4aZ6p+Sjy4yAerAE9SBgDqfoDjJ6aALQEoU5HXodIkWdCEaEI0IVeY1o7YDFAkcrKQCkbfBGCSGZmP3EfM4Y\/LXV+J+pWAKbomrSV0903DV1jzPN5BWnhCMQhY9WKqCD+Y659QAdWnBscYaoxZcSpR2X4Qe9SLXXyMLBgGOi6jl65f6fT89YuIx5rJF81ow4a\/E9S3BBHTQpFEixxoAqogwAPkBrEJs6rRAAFBVy3MsVLuW7RIQfKnlVgP3c5I\/mNdNCS6JtrFk0cV0KCuxxdSe5P34Bb+a6eW7poOwXSkq2poHcDpGP5H\/5NQBtqW\/v79E0fEO53C0UdraeWWk2ssDfrGto3aOWOXA8oSOvxRU7MMSSJ8aEZyoJYRTZ6ORPgDT7yh\/aW\/d0T36tF9gu+1LXATD7375VVHCdgHiWGOWWX3tn6YjjB5K2TxGCaQkfehtXSxm5VibHdrpW7WtFZfLf+q7nLhqmk5huDhWb0J6\/CDxyeGeOSQTrQaMwWedDol7AAcW6KOjH6fCv9jaB5I23UReOHhnT+IFino5FAldcciM8SeWf9+QalyiRhY5PY8xuDgmd4L+EEfhbBRW6hmMikBJ\/MH\/KnJYN9DyOPoG+46tRMZFFlA2UMr3yuzHZTDaqxbbeOEhxBX5ZS3pIMEg\/I9c\/TPTscjm8xmm4UAIafVPamn+AI\/X06j+z+z8RrOI6q2Nkto+sgbOeo9e+f+O\/r9+ozoEoTd3zc6qxzUdxpiTNQz8hg9SpGcEZzg4IPQacxjXAg9V3vszy8VzcBLs4af6XG9qLeM1u8NrfBbHZKq9yeWkkXSQwcQXVT3HLKA47gkaZgYQ+YucLyrrPYvhcWJ4q6XFNBbAL12va\/1Kiuh8Sm9mva0e3LfBFeL9cpFr6kVLsYKcFAowFxksVYjr9niT31f5JxzjI400aaLtBwc+2eLfj53cuGPwigLOpPXt187HRTVvjxgG0PD+judZTVMd\/qLabillgmCSZWMNIhZlYKuWUdRnJHyOuVxvC38QbyYpnR0febv9e68nHCzPiZYoCHNYXDN0IB0+axH4t7RlqhTz3idaySJi8UsEzuFwpKluPHuwB4kAhh+PCTexGOkmc7nEtNiySTX7a71Vgp44Jjw7ltjBPqK9VzN4eNu3NtW+apo62prrjIjGCGIyQM5AAHN+JHHOF+w7FnUAEnrawfsVimzl0k5aD1aSHaaC9aPnonHgeNacsrQPUg\/pqq5P7Zt93xuqk2\/b9sPb67znSeW71fv7weWGLhIAscfIcSOvL6AnGe1b\/8dcOawY3HTPxBGwefCD6baKDA4B02JbA7TXWhrolO8t33DcfBtwUtVdDJ+yUmokpY8Z7KjhOnrxTkfkDrpYYYoG5IWhoHZemRwYXDMyMhAPlv9dU1l8Sbx4ZXAV9uaoFbRxt5NYSWliiyrPTz+YkfONgFCkgsGKH4s5DntDxTtVmY4Mlj5c7cw89wt+0LzPXzI9JJPTRvKBJVe7vPLPk9ATGCqKepJ5LlmZg3XBcMo2UrXObDkZo2vjXb0U6+0JYKO8+FkNvnkgtzNGCk84HBWCk4J5DuAfX8NVIpHZyuLwrmxYpz3x5x2Xl6lGLf4nNTzywOgDsktGytEWyByGOg+7Hy6a0sH\/W07JcS9j5rYCAO\/RS1SWpGuVPPRt5EiqJYUdeSzADJQ5JwST36YwPx7mFvgWtC3wrNVRz01wmYU03u0zqZaJk6jC+h7EZz+J76nMVA2rHLFFPLbO8ZbjKZY4ZqUmBBIkQUlAExw7YJBOc9fU56aq8gBuZVuUMqeu4ZIMW6qswkjkRvO8qUueRAyCuQCMMzZAYHt1HwnVRjHWQ5V2tOubZTDYPHOouVnko1Za9sqktHWOaYuvQM7MAB2JbPXHBR0zgcxieGZX5mBYc+Cyvtiku3+NW3rVUNWyVFXdoRmN54f2ksHB2VIzx6NnDE5JJY474Bzv8Ax0r203T91T\/BSObQUsbdFDc5DWPNFVVYIqogWLiFG5oHTkMoWCsCB07\/AFJxJA5pIpZT7BpY2bR3qmFB+v7nHV16wvyWiCw0xY8RxWPqx4hM8s4+Nug6AMeW6hg0SPoWG7LrzXLzZKakrKbnJXoR7mwDoqr9slscT0YfDnJwcA4Oow3dw6KMDS12wH5ggjjjqMajCYk5jrP1krBofcfKIZSp8wyZGDnOOOM9MZzjS6ZfNLpSVjoNCRZ0IRoQjQhGhCrvt\/YV33NKkVOi0trjVV5fYGfn2+RzjvnIPfXUS4mOEEu1Kw44XSaDZTBtfw8te2I4jHH7xUIOksn7p9eI7LrCmxUkx1Oi1I4GRjzTnHTVNWEHQhVv8S6N7bv+6pTxg+8OtQ7FuuSg\/h011GDOaAeSxZ9JCuZbzV4XCgK3Inr26MP5E6nNbKMNvVOBKh6iinimADPyU9enUgd\/9dtQmgbCUDQp1IgeAq6hlKkMsnUEdiG\/k34HVc7p4Td254c7e2vcWrbfQlJ4w0dN5sjuKKMnLRQKxIhXOS3AAfwwgaBdDdOLnOFErvV6K6QKe3mrjpgAYP5DGcDue508WkBpJJ36oMZJOSPnjrj8S+NK0blIb2XFuZDKRnOfU+v1\/wCPXT26BChvetZI+97e9ur5KettIZ5F\/wCZZWA5I\/qcjgPp36HB10WCjH4d3MGjvou34XgmPwLmzDR\/zHZSIksO5KX4ZhSzh1lDgE+TMM9SOhIOWHT909OpGshzXQuIH\/a47E4V2HkLJB8U9be08UUUdUFWdBhsHKsAftAj0PQ\/TIPbVN4FnKoG3sV2rfMXn49c5HT\/AI\/s6Hvqs4UFKzdI970S1tmr4s94GI69MjqPX6fLToTrqtvhGIOF4hFK3uPl1UX7+4bgrfB+g5rIYadqpgx7YEfAn72jxp8NsEpC9m4aTgoeKytG5DR8Sb\/VRzsawXTxA8Sbxuq22qK8GnqWW2x1ThIECYCOzEEEonDip6FymSACRZmkEELYrq910PGsezgvCYOF3WZoL63o6kDtmN\/C1xNxVtRda+7XA1Ulcv8AS6KviqGPvFvqHT4g4P7hdE+7nyGUOVRhaW+DZYcL4OXmwv8ATrbst0VRPNuq5Gli86odUipTIcRoDFE00jevEfsBgdSTjoMkS9FbbKWyksGtfZXMqbjZtuGa5VV5gq6tif8A1xc5FjpYu4AiUY8wjLBUj5HqQWXkSVALjShfPFF+Y51nudgq2bi3pTWvxTm3Ltt55YY6lZkkrBhqhioErMO6iQl+mBgN2XsOyw+Gd+D5U+i4GbHNgxRxkPTXXr3+asXY9wV24IfOpoP1VUmkSqr7xXFJGhjbJ8uBEY5A4t3KgYyQzE687wmPgxpeMO6w00dOq6PgvtDhvaCN8mCvw+8T0voP5S+g2Cl5orlLOj9IJqakjnYMyyPGymR\/QsOZB6YDFu5yzXia0W1HhzJmc74LftNElu1N7sxiqyBNHGHCSuuFLcM9M4dDhshuRVusYbSHzUIaQ0gbqVfaaoKiv8L4I4KI10zvGBD1HI9\/Tr6eh9e+qEFB51XIYBwGKfbqrr2XlnuGxTWfxDemmljp6h0ZjHTqWVPiGFyT16\/X8TrZwAuf4KvLMJ58zTY7lWK8OLJFNbVS41MnmKoki6KPMAXBUHPf8R09ddy0lrdFssJa3ROXdVtipAhLGnBwY5I\/jIAK\/EMfYPIgHPfB6akY8k6qRr70KbkNFVWqlSpo4Y0ZZEBWJOSNGASF45xnODn07dPSV2W6Uhy2AEe4zR2+sqYZppoy3NqeNscQc5THIDrkgZI7HHTiNQgZbzbKOsu6R112aGKsuMKuY0iiTyY3VUX43VmwQGLAAOc+g9cdInDJajcMuqe\/hNfqXdV0obVLX1VNX1kZoWr6d3QhWYsVdAwBB4RgkYPXv8WTQxEOWMyDWtVUliAaXBWBsO5tzbdpo6poai62dammkqKiSV0giSJlZ5FwnRFALceWCADgEsNYE0WGmadQHUsmSOCUHoVKm3fEr9eX640lBJBVUMAhq4aymcyc+QDTwMZFPQk9OIGFYAYII1hvwRbGHO0J6foVlvwlMBduen6J9WDcZu9mNWs0LXKqpo6iit0YMM1LFIh4owYsCwKS\/HwUELgjodZD4jG\/KdgdT3WY5mR1HZOiku4gNNRN7xWVaeXHO\/lgFMozc37AA8CPhz1IGoC27dsOiiLdz0XYBzpiYtFdDNPRzx08\/u0zoVSbiG4H0bB6HGlFXqlGhWuiq0M0lCZJJainjQyO6EBuWcHOApPwnIHbp2yNBHVBHVLNIkRoQjQha4YEgjCRoqIOyqMAaCSTZSVS+9IlSJb1RteTavOHv4g958nBz5fLjyzjHfT8py5uiWjVpadMSKDvFimWfeMrokbssMasp6EnB9fuI10GBsQ6rKxAHMtN+gKfFGyvCR0IP16f26tkdFADourEqq8eMjlIAemcd89PvUajKcnMi8VHZcfiBgfxwPzU\/TUSRZwQx75yBgnmfoPr9B+J0iVJqwBkiJx9vp8We+VJ+vc5Prjp20oQBaQ1Dhzyx3Hb78nH8W\/Iac0aUl81zJIjV1KRqRlmAye3fvoc7KCShozOACizxH8ITRXOS\/08cla7iSoXlE\/xgOeOO3UjqDjIyehAyOgwWPa9vJcK6L0jB4lvLEPwXD23uSrtDQFJWqUdBPMkyEySKegAYABcZ6A9Tj8RanhZJY69EY\/BsxcZb1GymixbkpqyOOnncxsD+wlb4SPXH0H8s\/I9ObfGWrzhzXRvMb9wnJaJGWsZG6Fep9BgHr0PTHXt6H6HVZ4ttpzPNfW9rh7rZa3iR50kRjRWbGWIwO5+v1GoYQL12W5wmD8Rjom9Ls+g1Krvatub23xuYR222yr5FKbWlwfkKeljGUdg\/Zj1kPTPVsgdBrTe+GKPxHfWu6+jsViuEcNwdzyg5nZy0e847gVuBt8ArPbH2RavDXa0NupZVipKdMzVdQyoHb1Zm7AZJOPTJ1gSSvnfm3JXivEOIYji+LfiJBbnHQDWh0A+Chndti2l4n+Lvvs2\/wC10kxRKGKltwMz1cQyDHLIzeT8TMw48WOCMEHV5jZoY7DCuhgwnFeHYLmtwrg3ckggfLelxvFv2eaLYO2Kaus9zrKq1QmOlqaGtYGSVcnieSxsXwSxZChzyzn4AA7D4p0jsjt1V4dxKTETciUb9v33UaUVqrKqjmf3a2minQFhSVAnNSvpzmkjYy9Ox+H8daAJtd9HhTI3Voy\/r8f+lV3xf2\/BtffNTTUtHPQUkyJUxQVCqCgbIYLw+HjyVsY7DA9NdZgZnS4SRrjZF\/Kl5b7R4Pkc6Jgq2mviFK943\/ZdsP7zX3dVrxH5aUdtUStxQggSL0yWZQwLn7BwCDkH524Hw\/jZxDhwuI5btxfoCST66Aaaa2vDvZfFcX4fOJuH6h2hFeEgbXdapJa\/bFtFstTx19muIrGnllIpmjMeGdm7lgfX5fnr3E8LnjAzUV9OQe0sbIc80Jz1dA6X2BNLq7K3TbvEGpoLlarxS1V6poQ8dEjlDH8bs6EOAA2HbD9O4C5wQ3jHHuI8UgxQZiIXRQg1mGvo6x32I7brwX2n9peJY\/FsdCDCYwS0dTveu11t+6tFWbiSm8MZJLjVFUqZXEE9QxYty4hF5dcA9fp111nDnPmgje426tVq+ykeKxeDfPKS4lxOpvReZO7addweM1eY51WJHYCXPRlATBB+RJz+OurwBAls9l3oGQtUx7T2pW2yldWr5P6OeIAfjx6HGcZ9MdCB6a7uGQZaC6CF4y0u\/c61pLXNALh5bIAyAqS6lsjHJSM+v3Yz69J2jWwFM0akpNZd2U60tVOJzLGyD9k2FYA4UqCM8xkE5K98H58QjMaJS6k6pVbNxivlrpqYmLmDHM7yeYqcePQADrnpkEEDAz6ZQt01NpMulrhVlLHDX1sEThY3iLx1TqzrKAxBLdAfTvjA6ZGOpaDYKaDuuNZbjPt2+Gupbk0MEUcTwvng6kEZIQE56leme5+h1FILBB2P2VG8WK6Kc\/Cjdlnqt1U0zXm51Ff7tAppZKgyvWYWcNHUK5PnHhLIieWQWZFLADjnksZE6I5Whc\/iYzGaCsxsfaIpL7T2u61kYjpqOotFHHVwiaerySZplJWPJePygeKlAytkHKk87PO5zC4eR+91jyyuc0keqlXaO0bDaa+40VugoVjiKclgj\/anOSDI\/ckMZSMHHxsMDWZLLLIA55VCSSR4BeSu\/TxU1hra6rqrtK61kyKiVlQPKibAURxjoBk+nUknUGrwGhuyiJLgABstlkknkud3Z6KaliEyqkk0\/PzsIuWRckIvpjoSQSR1yR1UNUh0A1Xa0xMWMY0lISO5Vk9GkJgpJKsvMkbLGyjgpOC5yR0A6kDrpzdd0rQDulg7aRIs6EI0IWMaELHABuXroQvmeZKeGSWRgkaKWZj2AHc6ACTQSE0LKrrfrk99vNXX0\/FZZpCwDnCsOwB\/ADrrqoo+XGGlYb35nErZb6iGqlenc+XPGAJInGGUfPH8fwOg6C0LohSKykXBDNMAQvfOCxx9QUP56jGxKcSnAj\/EAD8scPxIx\/Ej8V1FSEJgr+7xx+6CFwfp3AP5sfpoSpLc2bhHjJJfj6dWI4jP1Gew6DGNOaEiQSNyDEHII6H\/AI+eB+IOnBOXV2PZ2uV4ll5FEp05BsfvE9B\/PVPFPyspWcOPHaQ7tSvloqaOnf3oqAk1HToihYSzZKAHIxlR3PTH11YwmRrvFp2K6vD5QdfmoA3fbHo6ioa0vJTzyQrKyEYVWVsMMdxnK98+v0I6\/DuLmgP1W\/CbAz6rbYJ67be2zVXuVJBFH5rJFHxYdgEX4jkjqc9M5XI6da+Ja15cW9Fi8S4YzGOMkWjlLvhZuWm3nTe8W+dpoadzF50isvEgdV5EfFxyVyM9QR9By0z2jRcy\/h+Iw5DZOqTeN91Sy2tYmqECyj4omjJZuv2l9BjGO\/XljGM6XCAym16h7IcLDpi8Al3caAeXx9OirpuC\/bhsJ\/X1rr7na9u1jdaywc\/Lgkx1idPMHFgcDDN1HUEg51uRxxSXG8AuHQr27BYXAYoHBYiNj52f2yVbh3By6gjsPIpm3S+028cS3nxKuFYF7R3GjqJcfcAzAfgdXGxGP3IR8wukw2Dm4eKw3C2tPdrmD60Cupsip2Tab\/a2rLjedwqs6EUluoVh5fF0AZ3LHJ9AoJ+Y1FiGzujdTQ3zJVLizeNYnCzBsUcIIOrnZv0FfMq++\/KG0XHZ98jvxRbNFSvUVE0x4eQqqWMnL91lxyBHUFc64ZhIcK3tfJUT3RyMc0061Qlrs9mjmnnrpaSAAzSV9MFaCQd+csWDxJ7syAA9+Q7Dr+X3X0C6EYVnNe6hvmGoPqOnqFXzxh8Qhvm\/wtE0c9NQo0MVUkLRGbJyW4lmIHTpk\/M4Gca6fhmGfC1z5OvReT8ax7eIz23Vo0uqv4KPXf4T6fTW00Bo0XNtYyNoawUB0XDu0vfrqjKdEwqYfZb8Jq2+bkpNxVFTS0dHG5EVPVQl2qlyVZlAZSoDDowOeQ7Y78tjnMkaYyL9V0nC+At4hGZpwMmuhF36fyr7+Me1oKnw3t9go0ZaeV+MjPKWMaHkztliScDOBn5Aa5aLIxzsoqvkqfC8PBwRskeHZ4G3QvqT59F5n3CrnsXijVST0zUgmmqI0hlU4EXJVUEdyMLjp8umtnBAOmryUuILHTNDTeg+anfa+9KiUzebKnuSxJhmiJcA9WOcknoRjtj8SR2kUZAoLTjZpotdzqYJmnamrT0lyBwBVQwYZ54+I+v9mQc225qoq00EDVNSupZ46yNKmQLTZ5fEw8kgYXryHQAevfp39NT7C7Uh0F9lJNm21JTU7vTwIIekoJTByxUA4yo+WNQOeBqCoy8bhc6+7ZvDW5qmlzJXU+VXyZ4kMp4HLHkCBgcuhwCVHoTmJz6Giie8AaJu3Pb1Hf6GA3VvNlpWDRSU0ivEG6MeR4kNghvhJ7cuuo3+LUqN\/i1K2+F+8brQXlrJa0WmoeX9KpMZV2b4TzGVfiA+ckjjjvlRmrMxkrS1zdh8iopWMeNRsrN+zBdt0bogkte4auiuV1tFeLsJbivmvN5g5zqBGVRvjCspBJRgOhwQvKcQiiiaHxg0RR9fl\/2ufxkccTQ5l6ilZe17mpLRtG4PZq2xmeliQYhDxwULcWdxOcgrEuZGUtx6dOrYzzbonOeA8HX6+nmsQxuLg1wP32TwscdsvFvoKq2ikqqJaiSoedWLYn+JWI5DJOS4ySCMY7dNVnZo3EO0KgcXMJB0SnZ1lse11rbVaAyS+Y1ZUrLK8srPK7Eu7OSxyVbGT2Ax0xpr3vkpz\/RNcXOAc5OIMD66hUa+tKhYxoQs6EI0IRoQjQhGhCjjxP3avuU1ooXLzNkVDKD8IH7v3n+zWrgsOXOzu2VDESgDKFE1JG61EWBjJAAPr31u9FlhOmOjhrYU8+MSsgyjdnA6jofQ4BH3gaqEkbKYLVcVq7ZGKmnU3DyCWMQwJHHZgpOBk46Hp1caRoDtNkt0u3bq2G6UsNVTvzjlXkpxxJBP8Dn\/AGWH10wjLYP39\/olFHVb6iVaaF5pXEaICzyO2OOB8RLdhgd29Ow00a7Jdk1TuukuiU1VESlEf2sM0iFPNQghGUHspPLHqcdep1KyjYvVI9pFWEsFSk5AiBf4OQIU4PXtn89AB3KUHVP\/AGbSJSbdlmdRmVy5L\/JcYH5gnWPiDnkpaeGbp6pj10s6b1ll5oYmT4F4AAHLYIfup+Mr3I6jGOutdkbXQg9l0rWAxKHPEa45vc0FXH5rO6qGjTJCHoBn1xkHl8s4766TBsIjzBbOGb4LCaO9rrJbLDU3OE8KAwSpI2AxVwDlgcf1vl06asOFxvB3pTaNDieie3gxef1Bado2IOFmq1bkq\/1IlBfH+sy\/kdcQ6PMHP6BV8JhHYiObFv1ygfM\/6Utb02xTb+vdz23KRHUTWhpKWVh0jljkTDfmev0J02GQwNEo2taHDsZJwqCPHt1Akpw7gg2PoqfUPiDurw83RdKy2L5d2omMF+sdUvKOtVDgylPXt8RHUE8gSrHHWPghmjAfsfdd28l9AP4Tw3i2FjixJ\/KfrFIN2E65b\/S9DtuBc4+FtR4J+0LmKbZ9Bbtxqhknt6lqZ2A7ujRFRIPyb5j11h4j8dgDo8lvdeccbi9rPY823FOdDsHe8PQhwJafolviyu2fZW21Nunb9nsFAqzRwqlTSSTVyl\/hHlu0hZuoYntgZ69DqPDOl4hIIpXE+my49nH3cXcYuPYiRzf\/AFIr4tAVN\/GL2tt1+K9BWWp7jUxWqcqDEoWFOHH4gETvyJIJck4HQAnI6jCcGZG\/M5tfUqlisRw+MOi4dEQD\/c73q1v0tQlUXKrlo0pJKuokpY+qQNKxjX7lJwPwGujbBEHZg0Wst2ImfHynPJb2s0ubJJ9dWRsqqTSthT1\/HS2mrhXJzk\/LWdMVEeytr4N3e21Gz9tD3qQQxxRIsHlpKPMHRgvJSc8gc9cDqegzrm54dCQveeHYaGTgcM0bjRFVv4huFYn2ntzz7e8M7dW0cphqYHUo3FcZ4nIPQjBGQfoSB31zsNPe4FedYbDskxErZRv8\/wDXwXmpc9z1O896wvLCfeQzuxgTIIznovU9hjGT9+tHBaTLnnwiDEUrSbE8IrpdtlUG4bFRM91DLEnnFlUqWIZmXrnipLcexPQZ6a6Y4trTS0vxAbon1f8AZFpSumSmp6aaRIjLBOZouNQ6SEPHyxlXTLAfZyW7nrxGYpzjmStmcTotJ2h+p5KGmnoCtVOC1XIsErpBhCVKjiWYLnv3+memphiHFhJ1UvONElcK82q6QChqqi5lfe40eVaNFnkpBxLhZImUYCsX6lskR4C8skx\/iMwTOba5kr1d13VWWC6e\/LAnFfOgwnECTq0wyCiuvwjPVhw6NldSB5a2xunBxaLCZ3iHtXz6h7lT0709OzGJ6ZyGjqSnw9W+0rK\/mHkDggDr1OJWtzuzA2FKGlzrB0XM2j4abh3FS1dVt6dKqWlBlnWqZFj4hCWb4wcqoKdWA4j11FO9sPvbKOVwi97ZWn8Edt1W0rJW32977qfea1\/1fUV9Es1VLTSyoZlijlWIxrmSRXkK8hlQnzDc1jXNlcI4ozprqd60uiVi4ote4NjYfj1rrSn3bK7rjuD2y77ceqp6+OFaqWmWnjWSBIeawpl8kZ80MxC5ZwBw6MMF5iDeYx1Fu3rf3SyTkAzNdRG3qndQ7kqaOW0bU29T1tIZqGaeWoumJnoFHHiZC0hPMM4xHgggjBUL1puYHZpZTevTr991WLA7NJJ9OqeG09xf4SH3iOby\/LTjJAYWAl5cWSVWdVLLxI7DALMO6nVWVmTRVpG5bC6FXZJVS6zUNdNS1tYgCyyM00cLKuFZI2PEfMgYye+mBwuiLTQ7YHZdC21XvtBBUcJE8xA3GVOLD7x6H6aaRRpNIopTpEiNCEaEI0IRoQuffbvDYrTU10x+CFc4\/rH0H4nGnxsMjg0Jj3BjS4qvrVstbUyVUrftZmLn7yTrqmMDWho6LCJzEldKklSQIHHIDDDI7dSCNNdYS6LpQBQegxJjGcdcjkP95QdREndPCViFXD8GK57EHsOuP+x+Wm7I803qWlm2rdZZFqGntFU2GikXpTvhhyBH7pVVDDHrn06zu\/Nb5j6pgGU+Sxuylqd005tsE7UtHN+ybyl5PIpLKzFD2VVViBnr0J66gJELC4jX7+qmYC93ktVFt6opZ5J4JKaOj5gmhEbGnKRrIseEOeJ6AnBx07ddNjjYBrv3T3SOJNbJbTyGKkeeSmNKqzmONllEqyccBmOOq5+HA+\/TWl\/MyXYSuDSzON0+rHP71sOaZgzCDzFZR3wMkfj1GqUoy4mlpYF1tCiKG91d5qqi5vFUtSxRh4aWWFo5ApUA80OCpDZPUA9RkdNdK1jWxhoOpXWhrWsDRuU2twWmfcFdBd3EZqBIygI3HKksQMfUfxH3a0YXiFpiV2NwiBYo78aYqSfZV\/pkQxIlBUYSM9BxQ4x65BAz0x1\/OXxCN5PUFK7Nynk9iou9iK+3bcm59g1N1rJrjWXKKtqHmnOWP9JaAfcAtOo+4a5oD\/hyO8wum4PG1vsti5ydc4+gV0Xv0lN7Rm26UOONTRVccg9QOBf8soNVGxh2Ce7sQq\/4Rr\/ZieX\/ABcw\/Wv3UZ+1L4cRPvS37ip7pTbXv08ipQXaqkEFLVygHFPNL2imAB4M3wyLlTgp1ucOxREZhIzN6jr6haHsj7YM4TC7hnFGGTCv+Jb3ruP03ClDwu8H7Ftymt+77nta32TdopD75Pb3Pu6OQQ7IA3lrlcklRgZIGs\/EYqR9wtcS3payOM+0eJxYfgIsU6TDZraHb0NrPvGvMqift++NW0vFPxJsdDteWnuQsFNLTVV1piGjmd3DCJHH21TiTyHTMjY7a6vgOHkgY50ml7fBcWwakquVNLhca667UwW5nBBOdOanJKxwTp1hIk0rdDpLCauHcDkn79Z71CU6vCnetz21f6KnpXV4ZKhSI5ckIxIBYYI6kAA\/MDVMRhz676ffmuj4R7QYvg4e2Ci1wIp2oF9R5q8Htc3qSbwdt3JwS7IOwGTxOf8Aj665WKMtnkbVUur4PGJZZJGndtk+v6KhfhhUpS+J1PM5ULGGJ59iMjp+OdPhbc+iwOORBuJa1vRemfghaq+vsEFe8UEVO0bGapiYeU8QchApIByAATkdPN6HB0mImyEgrmpJcpo7rv3fwqa4WmS41VH+tamzzy1NGYxEjTIYmKKAQxwSUUDoThWJB5AjeIZX001ae3FgO0O6YD1cO4LFb73VW6tslYJ2jhoLvK1K0csJPnBQv2+ztnOGVh06cdaUUpLsoN91djeTbQVHdYl+nmeC43Cz1VviK1NVFDaswzweZnzZXIZcKVJHHJwoJZSGzfYYw05t+nqrbAyjnWi4X610cV2uG2Wld6KjY1kCU3Jou5RvMToARByKl88Qqhc4Gla4k5XIaTdFN7cG7od22ykqqippKSZaJViqJ4WMUVXGfi4nm3NGaKTL8T9gZODqZmZhIantDmWG7pwbD3fc9lS1dZtq30Uq19rlmobnTzo+JzEyxho2wrMgPEgfCuW+11XUWMhZOBmOgITcTG2UCzoKUr7Q8UYvBaybWSphXdt9vLS3DyFqYQsJFP8A\/aJJHJCGReWApxhWwRxKnFxkAxkrmQ+EAVffyWZio24iQtj8IA37+SstuqyUElur9x3aaSShTynFZND5clBShlmlZXV0bjyRWHcgjBVh01ysb3tcImb9t7O2y59jnBwjbv8AqUmtWyNubv8A1NfKCOkhobxbmgamr+M5qaf9n+x8tHMbqY\/O5FixBk+XQPkmmjzxSa0fkf2TnSyMzRv6FSHtPbkG2IjQQQr5NPEkVPN5eCIBnjEWLEnieR6AABgAOmqEkhk8R6\/dqq95kNldWjuBqqytp2pJ4Vp2VRNKoCTZUNlOuSBnByB1B1GW0AbUZFC7S0DA6aRIs6EI0IRoQjQhGhCjLxauQrGhtMcvFVxLLj59gP5\/nrWwMdXIVn4l\/wDYmPTW6CWNEDPjkOxHTv8A3a1i4qgG0lMNJEsZHxfYJ7n+o2f90abmJ1RVaJdwijlBPQKx7\/Ryf+ydR2RacNUoh4RgKvHkvTGO5GP7U\/jpNUooBfM0cMsboFjIx0YpywOJ64+7BH+iRpQSNUmhBSCvhaHIpY4qmo4t+ykUfGck4QjHE5OOXor564OmSM5rdSpYn8s90nju7kPBIRQvDIRLFVMJAgyojjWUdC5HE9cEYOc5zqO3xjM4X6fwn5WSXkNJfHExq5GQEGnUQPCwXLDqWII7\/EWwfXic9tEIIaS7cpJd6GwXasV+Fto3p0YR00kqyO6JyOBjkAD\/AFlGPofnqOaAvOYbhSQTcvddu52Gz3ylIpCxMuVMkDYKdG6t1zjII+86rxzzQu8S24MWSbBtREuyKjbazUqlK2DzGaKRviPXJ6sfvx16Y7fTpW4pk1HZdCJmyC+qh3xvpJbTsa9q9GX52+qwYuoUGN+pGO\/xE57dBrRDw+F5B6FW82aJ5voU3\/0YdbYb\/wCF9ud4aOS+bbqaulM8iAzU8csjShgfRWEjDJ6ZVseuuOlzhlN2KxYsXOzCPwrXkMcbIvQ0rpXmyba2vc63edbFBT1FNRyCWumkOIYftOQCcLnHU\/h66rxOllAw7b1O3mphxDEyYT8EXnl3ddyNr7qiHih7au29+ezXedo3y11dVu+ppFoQHjU07urDhVc+WVZQofjj7Y6dDruP\/r82DxolafBv5+YUJjLTl3VBzWVyU8lF73OKFu9KJW8o\/wCpnH8Na7om5rI1RQtbLYPLc9en11PGKShOKCUY6EE\/Q6sWpFvEvTTwULWzZ9dSXaTok0p+E9dRlNXHq1DOQPTVR6jK6Wy1C7ntp\/8A6hP94aZEPzWlR9VeT233Wk8HLFUoi+YGXP1+E6w5GW+Zw3Cv8N4riOGyOdEbB3B2IXn94W1dfuHxJp6WgjSGaRXPmSElYlUhi5x8gPx1W4REcRjOWAtQY2TjOPDWtq9grm7U8Ro9oQQUVFLW1Jp3YxzF40XlxCkxqUPAnPzPp116m72ahlbTiAfT916O32Vhey3u18grP+GXi1bd60lPNLcJYLrRpyERJCSnDfGEXAb4CfXAOegBIPm3FuATcPfoLadivPuKcDl4e80LaeqafjNu3Z+890f0RLrcrjHTPCVtNS6IGDAftOIIHR5AenFl5Zx6uwHCcUGW7wg9T+yrYPAz5eyZdLRQ0VoSlisNbEI0LArcY53TLNlVCty6rxBwF6Kueo5a13cNkac2b6H+FqOwMzPEdfguBs6iuNPZ75bpqE7dmuMjPCkpVZk49BgSIQPg7EFuPQqCVOYJcO\/RwFqu+MiiuNN4RQXC+UtiakqkpnM9YtW1EqQLE4bkCSCApHlrgFTyPLGMaaHsDacEoe2qKk\/w49mcbdlSqW1Tz2ittVdVV0LwlZ\/dPKiESwsTnkeBAVhyAm6nIbWRLxNurGEVYHx8\/RZ78a33WnsB6p\/eEe1K\/dO3LLdKGrjscdyvcV0pYqieRJPdY1jSSDoqqSIshgBhmXOQR0oY2aOKQgjMctH1N6\/NVMTKxjyDqctH1Viqrw1sk+06Cz3a9VlZY6KXyBFUVh4zDzVEUUzsS0vFgEwzHkSQwJxrmGYl7HmRg1P3awWTOY\/OwUUp20YKDxAvkMMsNHSe7wUtPbOMkZLRLyaSJS\/ApxmjXKIOqkEnAwr7dECdTZ19e\/Xoh2Z0YJ+f8p7UFUayjhneGSmaRA5hmwHTPo2CRkfQnVOqVeluV1fPEg4+WhIvrQhGhCNCEaEI0IWueZKeCSWRuKIpZifQDvpQL0SXQtQBc7s15udTXk\/8pKTg+gz8I\/IDXTRMDGBqw3uzOJWmOcUkkgJ+y+f9nJOpatJdJbHUeZCAitI3HqFHUDiO\/wCDk\/gdMy6pL0S0wPMCJCFyTlAfUlh3+WWx0\/rA503QbJ1LJdVGEBYNklh3wepJ+uDy+9DoGt2kOiT1VUYeijlOxwOA5fFnPQeuCeQHqrHGntb8k0lc6\/XV9q22NIszXy4MIKaJTy4EniDnqOK8hlj0I6HsNSsZzXH\/ABCQ+DrqV07JY6XbFlt9qhdp1iGXmqJOTzN6u559WLHJ+vpqBzjIS5PHhFJbVxLQ0\/m08aLxUJwQAKevQdF+fTJPQMdMZ4vClOniSeFIJQKync+XNgk+it6n6dfix\/fpxJBykJBRFhd\/bdvaruAeFWXyl5YB+QwAfngED72bVWdwaynK3hhb77L7mppGV2qIVAkdswcuS5ycZbHywf4aYx+lBdO13ZQd7R8ELeGO7p5EjMi2qqKMASQfKbvjtjHr651tQF3LdXYrRYTynAdl55ewK7L4qwqrEK+QwB6N9+tLhLQYZCRsFkNHhKtT7bu4rjHJQWwXGrFvaMM1J5zeSSOxKZxkfdrrvZ\/DwiEzFgzXvWquYUDJdKjl8kDu2tPFakqw5NmoITJ7466wXqJTL4VW261nhjc6+n2pNX0FI0\/m3aExcqZmVOMiK8oLMnFsAJkk4Eg+IHGle1swBfXlqoiRm3ThvlFeLTQ2irqNmn3WuWJIBXmlCO\/lzOH4q\/IPIzRyupCgGIqQQRh7HMcXAP29fl6I3O66EK1j1sNvqPDuU3RYIpHgmkhp2nSWMyHAdfiL+ZV4CgsA0ajDRjTgRlLhJ4fjpX2EulXa+7hte6XXZtTd6XaNPV0FJDVwvXz1kCvEFilh\/Zokx5cX65AKHA4ImQWVkrRLTn6muh739UwEA0Sq\/wA5yp1tFTlcmUHzevUZ1VcoSu3swKdy0GVziZP97TYh+Y1NVz\/bgrxcfDPbFgt8MtwvVWyCGhpULyueJ6BRk6ojDyObPJWlpkcD3guAVc\/Ab2Z9z7XvVbd77UW211dTTCCCkM5nkQsyseZiDKDhR0DE9TkdNaXs\/gMRgcQ7Fyx6VQ2v6rtPZ7CzcPxBxM8elUO+qce9dt3LYlcsNwCcJf2kNRCeUcilj1U\/guQcEeo16bDjY5m5m6VoR1C9twWLgxMOdvTQ9wktFumqjilMDmNWRlfEnHoTlh0+ucH7vlp8zY5oyJG2FHi8PFiYXMkbYpT89gOxduQWilduEXHzZsfFO\/XkxOPmMAdgOnTXPYPLO7OR\/oLh8BAJCC7VN2atnppTJJM6yLIyDGSXII7AevU622sa4VS6RuGzCqS+zbqrzB5XWSJsMUmUFGJxnCev44AB+\/NWfAxPFuCz8Tw2J24+SlPww8R7Na7lE1TaqeRVTyY\/eZnkhUkjI4jkqgkfUZAwNcNxbgUkkTjA7VcLxLg83LPLNq1NHtW1bf5bqtTVVyvNfTU1DHcJoXrG4FgORROPQk83YYHTPQADXj8r5QTh5BQBNjZecuc6+U7QBOGt2\/cavaEtNUGgrr09GiOXhZaOSdASGERZuCl+vckDHU8Rqq1wD76fVQBwzX0XdWgRqkVLhhN5fllRIeGM5+znGc+uM6ivomX0CTXHb8FZTViwM1vqqkHNbSqgmRioXmpZSOQAAyQew05r3NOuqc1xb6JbR0go6WKAPJIsahecrl3OPUk9SdNJskph1NpPZ7FQ2KOoShgWnSoneplCknlI5yzdfUnTi5zveTi4u3XQ01NRoQjQhGhCNCE1fEa4Gl27NTI2Jav9kMd8dS38Bj8dW8IzNJZ6KtO7KxQtQQSS08yIuZBlT9\/cfy\/iNdGa6rH9F1VscU0xknzKQxIRThTk\/wDy4\/1hqMvq6Tg3ulhkjpIsLxjVRkNjoMYOcfLorfi2mauSjRfK+ZUDADxR4xjA5EfL8gR96DTjokGy+aypSjiJLYJOQUGSx+1lR6n94fPLDStGb7+\/RBOUX9\/fVb7bQiiiasrFVZsdIyekY7Y+8EkZ7rkaa52c5G7Ia2vEU39vUT7i3bJfKrJhpVK0gfoF5AjkO3UrknB\/fweq6tTERRCJu53UMdveXFdSlrpq7eNyUljDTrHEhySQcFmORkjuO7DtqMtDYR5p1kyFd6rjSsglgkRZo5FKMjsDyB6EYLk6qNsGwpyLC51vpWo2qadg3ltiRQe4OcEde3p\/Aeh1LI4OohNYMuikTYFIqW+afu0j8Qceg6\/xJJ\/8tYeLfmdS08O2gStt9oFp2nqndIqcL5jF24qpAPUnsB9fppIpNK6rVjfpSq37StRSVGwN3tQ1VLWCosVZVoY5uStH5LjzEwDkfUHGf4dRh3fkOBHRbbL5Lr7Lz+9gZCfFaA\/Ll11q8J\/oSeiyG+6VYr25Kjjf7co9INdnwQ1hD6q9hdIyqXXmUlzjUuIdqpCm9LJ5vJQOusZ7kxSDsbxs3DszZlbtmg8n3GqNQTJJz82PzohG3AhgFxjkOncnVB+FZLIJDuEwtBNrt1Pjfd7paaG3VNutktPRNE8GYGBDRxNEpPFhy+BiOJyOvQDSDCMaSQTqjli0ppvHHcCX2W7yw0M1ZJSJQuxhMeYlgaHjmNlOMNnv04oBhVC6UYSMsyFLyxVLrye0Xf5ttXazyW62yQXM1hqJpI5HlLVDs7HLOR8Jb4enTHXOTl7cFHnD8x0r6JOWLtRFOCQcA60SSU4pC1P8RGDn5ahURK6G3qtbZc6eoYE8HBAHckHVjCR8ydrfNKxhc4BWynvVTAjVlS5bccsYM0rdfd4yBiBPkexbtk9OuNdxDhmF3hHgGw7nv\/HkvWOGcPa1jSW\/fdJLZXt5geRmVzH0I6hsfL1z9CM4B79daD2BdS3DCq3XT8S7aNzeHsrTrylt8qPz7sEPwMPzI\/2R11lMYG4gDo4J2CjbFiso2eCoJhtNTSxuhHJW+EOoz8QGf4j+etUMLW0V0ZiLAW7hWo2pXDfuybbXysGquLU9UG\/dmT4XJ\/0geQ\/0hrmGk4WZ0dbbei4Ojg8Q+IjQGx8U19zUktPLOFPlqfiMjjCxrnvj1J6dPu+Wuiwz2uaCuowzmvaD9FxIKaMOuY\/2hPSadDJM2M54x46ADr94PTVp5sbq0\/W6\/wBJbWGSOrjEzTNKuGCyPzcL6fCMKvT8vUj1rt1YS3ZZErGhhIV8vZT3TVbk8NQlZOamWjmMKyM3LKYBXrgdO+DjqOuvAPazCMw2PtgoOF\/FeEe0GGZhsWcgq9fipp1xa5lGhCNCEaEI0IRoQjQhGhCNCFjQhRT4mXbzdwxU4OUpYxyA9Gbr\/LjrXwTKaXLNxLrNdk3xJ5GBlV645AYGcnr+YJ+5NaNXuqi+hNxQqqkfTOOI+v3AfnGdKB1SeixHSFn5zftZewXso7jAH3lxn05j00ZugSAd0uQDiSSX+o6FvX8CcZ\/0gR66Z9\/f3snotkdPPUO7EGRByUY6cc55AeoyO3pk6HWG+SRtEr5u0T1cZjK4hH2gevLpjH16fiRgjtp0RDDaa4Zkxkvl+ju26aWiu9r29a7F5Qmqa2lMzyPJCJWct50YVQGA7HsSdVpJDJJup442sZstXhLdqrcYudznTzYXq\/6JVyQmH3uIRoPMWJ2dlUnIGOhABHQjV3OXMAOyrZadYUpmUsvFiy\/5pPHP4E9f9nVQClPaR19XT0UX7dkgXsAw6\/cAep\/IaUBzhojRSdSVENtjt9EkUzCVSEkSJmQYGSWYDC5+vc\/XWA63OJK2GN8Oi2XWFqimeLirRupVw4yCCPUHvoYQDZUrDRVb\/aM2nRWXwQ3m1DRwUNLS2G4CKlgjVI4kMMh+FQOnXr+J1vwTEtc0631WsyQljgV5t\/o+lDeLMWevwvrp+FisNL6Ko0eEqaf0glZjdVpjVsFaYk4+\/XWcItuC+KvYfSNUpuE7En4ifx06U2VIuO\/J2J5HP36znNtC2U\/NWBDH89JVIAXTgduP2jpCn6JXFK2cZ05pSLcWbB651OExJ5ckHr00iRc2qJBJBI+udNKjIUgez\/tRbzues3FWQCooNviORI5PsPUuW8rl9BwZvvVR1GdX+H4fnzBpW5wbBjGYmnHQaqcqWv8AfJmfzJviJYiFAw75OWYHJ6ntr0NrcooL2WGMNGgC6lFhQ0eaqVT9pZogynPfPEdPw\/mdOK0gLGtaJ\/bXlinhkpp15rKpjct++pBUg5HfHzHcaxcW0+81ZeJDmkPbuNQm\/cduWzbM7U1fGgikBCuCOMq9xg+hGMgenb71jxDpW31C0ocRJiWW1dXwyvdr25R3G3io5yT1Zkp4+vxLwVR0+ZwPy1VxMEk0gf2GqoY\/AYiaQSlugFFPCu2vLcx7zIDTA\/EoZPiHpkA9Acdic4+Wq7MW2PwNNrPjxbYDk3TVqrWLbLIIY0K+siuWlf6swUkAfIDp6Y1qRvEgtx\/j5LYZKJW2T\/CRw0rNDIy0wjiPQEx8Y89+ofDO2fQ9CdSOd0uz9foqWJfpv9\/srjex3ZKi37OutZO0n9KqRgS\/ayF6k\/PPLPy69NeKe2U7X4pkbf7QvGfaaUPxDWjoFYHXn645GhCNCEaEI0IRoQjQhGhCNCFg9joQq\/3m6LX7iuNSzgK0zkMewAOAfwA\/hrpIGUwALGkdbyVqhgmr1AcNFB0wucMw6dPp2QZ+f0bVkkAKCiV04QsQGDkf1j1+uf5n8XHpqLfdP9FuijLvxx07FSfwxn\/q5\/0DpuyUDRbp4yUPXkMdeXQHr1z8snofk3X10gQQuLVtPTTCoicpLGeQdumOuDy+\/s3yOG1OCCKP399Pkoze6Zd99o600UFbFQW6S7VdHzNQ1PMq0lOFyczTn4U7E8Bzbp0GqjvBeU2p2i9Toow2jvja+5d4bru277rHea41VLPRWW38\/cJZBTwKgRGOJZQzqmXPwkBuKddV2NsknVWHA0GhPy3+0PQRyRMlhqZPfZ6injio6qOdnlhbi7YUovlZA\/aM3cjp1B1aMjnAAN+\/qqojq9fv6JPb\/alp903W0UO2bNVT09wU5qXKq0ZEfM\/AvcKcKxyQCQMk5AcwBxFnQpxFA0n\/AG63GsqRW1yN7wxJEbNyx1Jx9BjHTUrzXhaogOpViqFWSjgV+jhFDD641yx1JW43YL5uFCtxoaileSSJZkKF4XKOuRjKkdj9dA0Np4NG1B3tgWKsm8B9+1FKA0EG3rg82ercVppD6\/dnWng5mNDg7chXYJWta4O3peXX6PhP\/rVU\/wBWNzruuGD\/AIkvohp8JUme3\/V8t9UCf1aX+066bh5y4NvqVeg\/pqndS4JY6Rx1T0kI7\/PVchKsx9NRlCWwk8SNRlOtK4Mjv6aGnVNW8\/TVkJtrRIGbI0VaRIZ4ScjuDpp0TCVLHgFcIYrLu+1NKUqHNLXQoVDK6p5iPkHv\/wAqmtvgzqxOXuF13sxIBinRn+4KSrbE9UivN5fUZzUyuM\/kuBrutl6zGQNAnZYrBDPKVStpFkI6eRC83pnrxZcaqSyvbqG6eqnfM9ovKa9QE84Kem25R+dV3WLiFyEjiMZJ69OrHWVJM5\/9qoOldM6gz5lQv4r70WtrYPcJqiSIkIQ655P\/AJuP4evXWJxHiowWH00JXQYZwhh6A\/sn34S3S2bk8Ltww09IF3NTrzgfhni2HZDzb1whHQ9eWDnOuEdxbFRSmV8ltIOnwP6rmcc\/EYXHxSF35bt\/v4qrtu8UNybQrg9Nda2jmicHy1mLRt6gFSeLD6HOvJofaHHRuzh5vf78l0czsM4EPard7N3zLvzaNsucvwtURcpI1dlwwJVsHPbkp+uPzP0hwLGjiPD4sZVFw106jQrGfAyF5yhOHb9kFfVwx0cJmqZXCKGBLNnAwCck5z2yfXr8tnET8thc86BY3EJsjSZDoAvQPw42ouzdnW21YUSQxgy8exc9W\/j0\/DXzvxLF\/jcU+foTp6LwnG4j8TiHSd05tZyoo0IRoQjQhGhCNCEaEI0IRoQkt0qhRWyrqD2iiZ\/yBOnMFuATXGmkqv8AQ28Mxkm+NuWQue2fmf8AjHU66cGhQWIddV1QcqckY9cjA\/EfnkfLkP3RpEdF9Lk5+0GB79yO\/wDHoT96n+tpNEqVUzx06u0jJGiLli5+FRj1+mOn+jxPppjilAtNKq8U6W61E1DtCil3bXoSjy0zBaKBgCD5tSfgOOxVObEfu51DzOjRakDepTT3Js+97jk913PfPeTIOTWi1FoKOEZACuwPmTEhh1YhSMZTViKPMMzzooy4DwtTC8StuVt0qrJsHb0MFGJgLhWeRGFSmpIi5HQdAWkZQo7Eqc5AOiRwtsbNO6WPYvd97pubG8FoLvteuubXNNvxUlTPDBUtxApm4JHLKGYjDlYSoYnoWJ6nULAzKbP3opHF1gAfeqeG3aPZFBLBT7ao7huyeliSkQWGlLRcFaMhTUNxjwShJ+Puc6sDEsYKjbt8e6i5Zdq87p5Wnb27pIUW22axbPiZQnmzs1bVccKMFU4Ip65+2w66iLnv+\/VKGsaF36DYNbKwkuu6rxXtnkIqeRKOPOT28lVf0HdzqNwvS04EDYKxe3bJS2iiT3Z6mTzEUlqqslqCfxkZjrCO5WuNl1tNSpg+0BaKi\/8AgR4kWujjMtXW7buVNCijJZ3pZFUAfeRpzNHAoC8VPY58SrZ4beIXv11LrSlGQlQCQT29dekcJe18Tobou7q2w2KUie1xv23+KG6qeusfKanSIIWcqpPf666dg\/DwNiJsi1bjfkblKrrJZLi2QIkx9ZV\/v1WMo7J\/NatX+D9wOP2UY+vmr\/fqIyhKJWlH6krk\/wCbQ\/8A5q\/36hdiANEZwt8dDVIADEucf5RdQnENSZ2ratLVAf8AJqPr5i\/36aMS3ojmhbFirOoEaY+rr\/fqZuJ6BJzAvh6evUErHHn0\/aL\/AH6lE7ik5gSKWiuBJPGP\/pV\/v0udxTc7V2NkXGt2zuWjufwqYW+JfNXEiEYZDg9iMjU+HnMUrXHorOGxRw8rZWHUKw9NNTtAlwtrSzW6qw0csch6nsVbHTkDkEEZzjBPTPo+GxTJ2ZmFe1YHGsxMQljNpxW68CEYQVQZQOQlmCKBj14knOOuMHUz\/ENVsseHbkLhb9rKu4RQzxZeCADzIIuoX+8DHf11k4gFo8KnDKC5NBuO27dg2tcq2JvKob3TVdROuCQgYgnH3sjfdj648O9pce9x28LCAsbiL5MRHNDEatpAU+bYt1io6vcdfDQfqqmqLjUzioqMQ09RTNJLxmYtgx8eqg\/UDjjBHypx32o4vFj3wYHEXGSCABqD\/jtqCOi55suKmhjY\/UtAFVZsKo3i1sC0w7gpGrN0W5KBc+fJSSGoqJ3JJZgq9MdhnljOepGGPq3CcCDhRiMbIIw7Ybur06fFdXlkxQY2TwhvzKl\/Ym5Bs2wUVJT08d2tEUYanJk8ioVT8R5qQfVs9u56HGNfVHAsLAzARRYR1Mrr+q3pOHfiWh0bsprrqntt32i6jb26rfc7bRUVE1PKJGSrzI8i9ivIgYz81Gc49NbGI4RFi4HwTPJsdNPv9FiYn2cjxET4sQ8mx00pemWyt0U289p2m+0eRTXCmjqUDdwGXOD93bXzji8M7CYiTDv3aSPkV8343DOweIkw792kj5LuaqKmjQhGhCNCEaEI0IRoQjQhGhCb++5mh2lcmU4JjC5+9gP7dTYcXIFDKaYVENKeCjoMYz17fj9+PyzrogsjySgN65wfm38z+WT9z6EJRTIFfHE\/IDPX7s\/PoBn5qP62mnulC5N98Odtbtro6q72alucyKEHnJyV1BJUFT8LjqSoYEDLLqJzQd09riNAutU1FLt23Q09LDFAnwxwU8ChEAz0wBjCjOQR27aexgOyaT1KjKt8Q7DYLn7jLUTXjcUoWR7Za4TUVTMfK6si9IwcHqxUfXUr5mt8I+nxTWRk6rgw2He0x3DfUFLs+KtjEks9Zxrq9Yo4gFjULiKJRlmwTJ1die+qlPJLtrU9tAA3paPArwn29efD+1X2800m46usNRWRyXaUzxAPJMyOkJ\/ZqSOLZCg5JOo4owWi9f8AtOkcQ4gaKdYqWKlXhHGsUUZIVUAAADP0wP8AR1MNNFFf381krwUfQf8Aw\/8Aw6cEldF8IoWRfxH\/AFjpCl2UvWCTzbLRtnP7ID8umsJ4pxWsw20JfqNPWGUMpB6g986ELyk9tb9HbW7a3Zct5+GE0SWqtdqmpsUwaMUrkksYZMFeBPXi3Hj2BI7aWHxjotE4HRUlq9u7ztk7wVNqqSydCY8SL+a5GtpvEXVqlDqSRqLc4Bzbaofeh0048lOD1qaHcSj4qCo\/2DqM45yXOtLpuAZ\/oVR\/snUf4xxS50ndtwj\/ANhqPwRv7tN\/GFGcLXy3Cf8A2Cp\/2D\/dpPxZRnRx3F6UNT\/snSjFuCTOvh49zNkC31Z+5Dpfxr00uWhrfuqQ\/DbK0\/ch0fjZE219Qbc3lVPxjtFcWJ9YyP56Q4yRFqz\/ALLXsw+0FuO5wz2OC3Ue3KmVffBeaxZKVh6kxxlnDgeq8T6E41Lh+NYnBPzxOIP0K0MHxDEYF+eF1fofgrq769h+6UkjSWe92+cOgDRTN5JB9cdCOvX5a9CwXtjFIwCeMg9xqF6Fg\/appAErCPRRZuD2fNzeHsc1bczSNDn4khrIS5XqTgMyjrkjvnWsz2kwErsodXqKXT4X2jwszstkeoVet3WS93+erls23Q9PUTsqxQzR1SAjB4lF7Y+E4PzPfXD8Vw0hLpImBwOt7hdM2WBsd5gbG52PzUa74oPESlnWTcdNeKOMxrTJ59O9PGI17RqMBePTOB0J69+uvF5+Gu5znuiAJN6AAX306qhDI33cO8HW9CLtPXw19njc\/jTPz2zbXq5ogpqUmdYVixjrzcgYPyGuzj4Dh3xsxT5Q292m7+FdCtrG8Q4bg2NlxT8pPTc35Urk0PsUblpqGBbru+zUQlRWelp1lqZF+EdMKAOgAH2sYHc69Ng9psPA3lQwkgddAFzB9ucMSRDh3HzNAKUPC32Kdj2+qWr3CtfumVTkRSwrS02c+qKxZvuLY+Y1lcQ9qcbI0sgqMHtqfmuU4r7Z8QmYY8PUYPbU\/Porb22hprbQU9JR08dJSwRrHFBEgRI1AwFAHQAD015y5znuLnmyeq8oe90ji95sncpTpqYjQhGhCNCEaEI0IRoQjQhGhCaniZVrTbUnQ4JndYwD69c\/yU6tYVtyKvOQGFRbSdUHUYxnJH49fyz9w+ut5ZSVQrhs9Vx0HqR\/een4lT\/W0iUJXBGOvYdPn0\/P5Yx1+XE+h02+iULbU1EdHAZJWCjPE8\/3iTjGPmTjI+eCNNGppHQplXS0Nu1Kg15nSKpRU8uKZo2RSE6B1IIJLdSME6n2blCYNyVs2htGz7KoI6Wy22nt9OSrMIEwzsShLM3dj07nJ66hDQ0FrQnkl2pXTvNok3Jti52pJfdpa2kkpVmK8vLLxonLHrgtnGkdrf33QzSvvstuztuRbW2nZ7JTnlFb6GKlVsY5BYwufxyNMb4RScddV2pVyshH+cf4SnSBC1zqFEmfQHt97\/3aAhayMS\/UFv8AeOnHZKpK2RP51kCk58t2Ufz\/ALdY04p60YTbE4NV1OvmRxHG7scKoJOhCgrxA21dPEqvxXM6WyM\/saMH4B\/nMPVvr6emr0QYwa7pwATR\/wAQlGMg0iH701bErQFKKXyfAOgOc0MZ++MaXnNRovg+z9bTnNuhP3xjRzWo0XyfZ6tZ\/wDdsH\/RD+7RzWJNF8\/+jxav\/wCFwf8ARD+7RzWJdFj\/ANHi0j\/3XB\/0Q\/u0cxiSwj\/0erWO1sg\/6If3aOYxJYQPZ8tg\/wDdsI\/\/ACho5rUthfQ9n+3jOLfEPujGjmsRoj\/EDR+lFGP9QaTmtSaLs7e8Lbhsm4pX2SaSin6cvL+y4\/qsOxH0OoXuY7dN9FO1upYr3bIZ5oBHMy4kT+qw7jVQSuZsntkc1J6nZtNOGDIHQ\/usMjUwxJG6stxJG649N4ZUdrqZai201Pb5ZDlnp4VV2+9sZ9Bpr8S97cpOinOOc9oa42F8Xbw5e\/xCG5TPXQg58uc81z9x6apW7uo2Yvl6s0X1avCSz2oH3eigpye5iiVSfvwNWOc\/LQKldxGR25Tlp9q0dP2iU\/XGnc9\/dVXYqQ9V04KWOnXCKB9w1AXF26queXbrcNNTFnQhGhCNCEaEI0IRoQjQhGhCNCEyPFmFX29TuScpUrgDschh11dwZ\/MVXEC2KOaP4TjsBg9PT\/jGfwA1tdFmpcoCLkjAHop+QJ\/7B\/JT89JuhLY18rlnuoY\/D0+yeuPzyPvI7aagGtU3nqnutZ5zHjBASEi9CVMnU\/7HTvgHGpQMgKBqa++q6sUCoBjspH8Mf\/ANR3ZQF8rTgFUHoAv+4P7NMB3KcOy+6fC8WHfIP8f\/AJRoPVKAlNM46DGT8I\/\/ANY007\/fmkG1\/fRfaHzIsfNR\/EKP+0dNTt7WqX4uZ+Y\/sf8Av05qD3Wpj+1J+Zb+\/R0Qn54czc6Kqj9FcN+YI\/s1l4oeK1ew58JCd+qatLDKHUqRkHoRoQtQo4V7RqPw07MULHucH+TX8tFlCBRwHtEv5aMxQj3KD\/Jr+WjMUto9xg\/ya\/lozFFo9xg\/ya\/lozFFo9xg\/wAmv5aMxRaPcYP8mv5aMxRaPcYP8mv5aMxRaPcYP8mv5aMxRaPcYP8AJL+WjMUWj3OH\/Jr+WjMUWtkcSxLxRQo+Q03dIvvQhGhCNCEaEI0IRoQjQhGhCNCEaEI0IRoQjQhGhCNCEaEL\/9k="
              },
      } 
    },   
    computed: {
      ...mapState({
        keepAlive: state => state.p2admin.page.keepAlive
      })
    },
    methods: {
       setPosterImageStatus: function() {
            var sTop = document.body || document.documentElement;
            sTop.scrollTop = 0;
            this.posterImageStatus = !this.posterImageStatus;
          },
    } 
  }
```

## webpack 可视化分析

从这里开始，我们开始进行 webpack 优化打包。首先我们来分析一下 webpack 打包性能瓶颈，找出问题所在，然后才能对症下药。此时就用到 webpack-bundle-analyzer 了。
1、安装依赖

```js
npm install webpack-bundle-analyzer -D
```

2、在 vue.config.js 配置

```js
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer')
configureWebpack: (config) => {
  if (process.env.NODE_ENV === 'production') {
    config.plugins.push(new BundleAnalyzerPlugin())
  }
}
```

打包后，我们可以看到这样一份依赖图

我们可以得到以下信息：

- 打包出的文件中都包含了什么，以及模块之间的依赖关系
- 每个文件的大小在总体中的占比，找出较大的文件，思考是否有替换方案，是否使用了它包含了不必要的依赖？
- 是否有重复的依赖项，对此可以如何优化？
- 每个文件的压缩后的大小。

## CDN 资源优化

CDN 的全称是 `Content Delivery Network`，即内容分发网络。CDN 是构建在网络之上的内容分发网络，依靠部署在各地的边缘服务器，通过中心平台的负载均衡、内容分发、调度等功能模块，使用户就近获取所需内容，降低网络拥塞，提高用户访问响应速度和命中率。CDN 的关键技术主要有内容存储和分发技术。

随着项目越做越大，依赖的第三方 npm 包越来越多，构建之后的文件也会越来越大。再加上又是单页应用，这就会导致在网速较慢或者服务器带宽有限的情况出现长时间的白屏。此时我们可以使用 CDN 的方法，优化网络加载速度。

1、将 `vue、vue-router、vuex、axios` 这些 vue 全家桶的资源，全部改为通过 CDN 链接获取，在 `index.html` 里插入 相应链接。

```html
<body>
  <div id="app"></div>
  <script src="https://cdn.bootcss.com/vue/2.6.10/vue.min.js"></script>
  <script src="https://cdn.bootcss.com/axios/0.19.0-beta.1/axios.min.js"></script>
  <script src="https://cdn.bootcss.com/vuex/3.1.0/vuex.min.js"></script>
  <script src="https://cdn.bootcss.com/vue-router/3.0.2/vue-router.min.js"></script>
  <script src="https://cdn.bootcss.com/element-ui/2.6.1/index.js"></script>
</body>
```

2、在 `vue.config.js` 配置 externals 属性

```javascript
module.exports = {
 ···
    externals: {
      'vue': 'Vue',
      'vuex': 'Vuex',
      'vue-router': 'VueRouter',
      'axios':'axios'
    }
  }
```

3、卸载相关依赖的 npm 包

```
npm uninstall  vue vue-router vuex axios
```

此时启动项目运行就可以了。我们在控制台就能发现项目加载了以上四个 CDN 资源。

不过现在有不少声音说，vue 全家桶加载 CDN 资源其实作用并不大，而且公共的 CDN 资源也没有 npm 包那么稳定，这个就见仁见智了。所以我在源码时新建的分支做这个优化。当项目较小的就不考虑 CDN 优化了。

当然，当引入其他较大第三方资源，比如 echarts，AMAP(高德地图)，采用 CDN 资源还是很有必要的。

## gZip 加速优化

所有现代浏览器都支持 gzip 压缩，启用 gzip 压缩可大幅缩减传输资源大小，从而缩短资源下载时间，减少首次白屏时间，提升用户体验。

gzip 对基于文本格式文件的压缩效果最好（如：CSS、JavaScript 和 HTML），在压缩较大文件时往往可实现高达 70-90% 的压缩率，对已经压缩过的资源（如：图片）进行 gzip 压缩处理，效果很不好。

```js
const CompressionPlugin = require('compression-webpack-plugin')
configureWebpack: (config) => {
  if (process.env.NODE_ENV === 'production') {
    config.plugins.push(
      new CompressionPlugin({
        // gzip压缩配置
        test: /\.js$|\.html$|\.css/, // 匹配文件名
        threshold: 10240, // 对超过10kb的数据进行压缩
        deleteOriginalAssets: false, // 是否删除原文件
      })
    )
  }
}
```

## 首页添加骨架屏

随着 SPA 在前端界的逐渐流行，单页面应用不可避免地给首页加载带来压力，此时良好的首页用户体验至关重要。很多 APP 采用了“骨架屏”的方式去展示未加载内容，给予了用户焕然一新的体验。

所谓的骨架屏，就是在页面内容未加载完成的时候，先使用一些图形进行占位，待内容加载完成之后再把它替换掉。在这个过程中用户会感知到内容正在逐渐加载并即将呈现，降低了“白屏”的不良体验。

本文采用vue-skeleton-webpack-plugin插件为单页面应用注入骨架屏。  

1、在src的common文件夹下面创建了Skeleton1.vue，Skeleton2.vue，具体的结构和样式自行设计，此处省略一万字。。。。

2、在同级目录下新建entry-skeleton.js
```js
import Vue from 'vue'
import Skeleton1 from './Skeleton1'
import Skeleton2 from './Skeleton2'

export default new Vue({
  components: {
    Skeleton1,
    Skeleton2
  },
  template: `
    <div>
      <skeleton1 id="skeleton1" style="display:none"/>
      <skeleton2 id="skeleton2" style="display:none"/>
    </div>
  `
})
```
在vue.config.js下配置插件

```js
const SkeletonWebpackPlugin = require('vue-skeleton-webpack-plugin')
configureWebpack: (config) => {
  config.plugins.push(
    new SkeletonWebpackPlugin({
      webpackConfig: {
        entry: {
          app: path.join(__dirname, './src/common/entry-skeleton.js'),
        },
      },
      minimize: true,
      quiet: true,
      router: {
        mode: 'hash',
        routes: [
          { path: '/', skeletonId: 'skeleton1' },
          { path: '/about', skeletonId: 'skeleton2' },
        ],
      },
    })
  )
}
```
此时重新加载页面就可以看到我们的骨架屏了。**注意：一定要配置样式分离extract: true**
