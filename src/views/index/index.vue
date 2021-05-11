<template>
  <div class="page-index">
    <div class="page_title" v-if="userInfo.name">
      HELLO {{userInfo.name}}
      <button @click.stop="logout()">点击我退出登录</button>
    </div>
  </div>
</template>

<script>
  const NAME = 'index';

  import { mapState, mapActions } from 'vuex';

  export default {
    name: NAME,
    computed: {
      ...mapState({
        userInfo: state => state.p2admin.user.info
      })
    },
    data() {
      return {}
    },
    methods: {
      ...mapActions('p2admin/account', [
        'logout'
      ]),
    }
  }
</script>

<style scoped>

</style>
