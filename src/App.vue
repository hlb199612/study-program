<template>
  <div id="app">
    <keep-alive :include="keepAlive">
      <router-view />
    </keep-alive>
  </div>
</template>

<script>

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

</script>

<style>

</style>
