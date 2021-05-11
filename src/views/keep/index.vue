<template>
  <div>
    <van-field v-model="value" label="文本" placeholder="请输入用户名" />
    <router-link to="/">点我返回首页</router-link>
  </div>
</template>

<script>
  const NAME = 'Keep'

  import Vue from 'vue'
  import { Field } from 'vant'

  Vue.use(Field)

  export default {
    name: NAME,
    data() {
      return {
        value: ''
      }
    }
  }
</script>

<style scoped>

</style>
