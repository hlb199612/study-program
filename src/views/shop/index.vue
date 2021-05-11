<template>
  <div> <router-link to="/">点我返回首页</router-link></div>
</template>

<script>
  const NAME = 'Shop'

  export default {
    name: NAME,
    data() {
      return {}
    },
    mounted() {
      this.getBannerList()
      this.getReportList()
    },
    methods: {
      // 获取banner图片数据
      getBannerList() {
        console.log("mockbanner图片数据如下");
        this.$api.api.getBannerList({ type: 301 }).then(res => {
          console.log(res)
        });
        this.$api.api.getBannerList({ type: 302 }).then(res => {
          console.log(res)
        });
      },
      // 获取头条简报数据
      getReportList() {
        this.$api.api.getReportList().then(res => {
          console.log("mock首页头条简报标题数据如下");
          console.log(res);
        });
      },
    }
  }
</script>

<style scoped>

</style>
