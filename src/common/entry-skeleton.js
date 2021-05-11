import Vue from 'vue'
import Skeleton1 from './Skeleton1'

export default new Vue({
  components: {
    Skeleton1
  },
  template: `
    <div>
      <skeleton1 id="skeleton1" style="display:none"/>
    </div>
  `
})
