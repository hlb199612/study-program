<template>
  <div class="page-index">
    <div class="page_title" v-if="userInfo.name">
      <p> HELLO {{userInfo.name}}  <router-link to="/keep">点我前往缓存页</router-link></p>
      <p> <router-link to="/shop">点我前往请求实例</router-link></p>
      <van-button type="danger" @click.stop="dialogLogout()">点我退出登录</van-button>
    </div>
    <div class="list">
      <div class="listItem" v-for="(item, index) in list" :key="index">
        {{ item.name }}
      </div>
    </div>
  </div>
</template>

<script>
  const NAME = 'Index'

  import Vue from 'vue'
  import { Button } from 'vant'
  import { mapState, mapActions } from 'vuex'

  Vue.use(Button)

  export default {
    name: NAME,
    computed: {
      ...mapState({
        userInfo: state => state.p2admin.user.info
      })
    },
    data() {
      return {
        list: [
          { name: 'vue-cli4脚手架' },
          { name: 'vant按需引入' },
          { name: '移动端rem适配' },
          { name: 'axios拦截封装' },
          { name: 'util工具类函数封装' },
          { name: 'vue-router配置' },
          { name: 'vuex数据持久化' },
          { name: '登录权限校验' },
          { name: '多环境变量配置' },
          { name: 'vue.config.js配置' },
          { name: 'toast组件封装' },
          { name: 'dialog组件封装' },
          { name: '跨域代理设置' },
          { name: 'webpack打包可视化分析' },
          { name: 'CDN资源优化' },
          { name: 'gzip打包优化' },
          { name: '首页添加骨架屏' }
        ]
      }
    },
    methods: {
      ...mapActions('p2admin/account', [
        'logout'
      ]),
      dialogLogout() {
        let that = this;
        that.$dialog({
          title: '提示',
          text: '是否要退出登录',
          showCancelBtn: true,
          confirmText: '确认',
          confirm() {
            that.logout()
          },
          cancel() {
            this.$toast({ msg: '您取消了登录' })
          }
        })
      }
    }
  }
</script>

<style scoped lang="scss">
  .list {
    height: 100%;
    width: 100%;
    .listItem {
      width: 100%;
      padding: 18px;
      position: relative;
      @include bgGradient;
      border-bottom: 1px solid $white-color;
      color: $white-color;
      text-align: left;
    }
  }
</style>

