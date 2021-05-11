<template>
  <div class="page-login">
    <p class="page_title">这里是登录界面</p>
    <button @click.stop="submit">点击我进行登录</button>
  </div>
</template>

<script>
  const NAME = 'login'

  import { mapActions } from 'vuex'

  export default {
    name: NAME,
    data() {
      return {
        formLogin: {
          username: 'admin',
          password: 'admin'
        }
      }
    },
    methods: {
      ...mapActions('p2admin/account', [
        'login'
      ]),
      submit() {
        this.login({
          username: this.formLogin.username,
          password: this.formLogin.password
        })
          .then(() => {
            // 重定向对象不存在则返回顶层路径
            this.$router.replace(this.$route.query.redirect || '/')
          })
      }
    }
  }
</script>

<style lang="scss">

</style>
