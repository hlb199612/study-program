import html2canvas from "html2canvas"

import './index.scss'

export default {
  name: 'store-poster',
  render (h) {
    if (this.posterImageStatus) return <div class="poster-first">
      <div class="poster-pop" style={{ display: !this.canvasStatus ? 'block' : 'none' }}>
        <img src={ require('./img/poster-close.png') }
             class="close"
             onClick={ () => this.posterImageClose() }
        />
        <div class="canvas" ref="poster">
          <img class="image" src={ this.posterData.image } alt="商品图片" />
          <div class="text"><span class="black">{ this.posterData.title }</span></div>
          <div class="text">
            <span class="rad">{ '￥' + this.posterData.price }</span>
          </div>
          <div class="code">
            <div class="code-img">
              <img src={ this.posterData.code } alt="二维码" />
            </div>
            <div class="code-text"><span>长按识别二维码 立即购买</span></div>
          </div>
        </div>
      </div>

      <div class="poster-pop" style={{ display: this.canvasStatus ? 'block' : 'none' }}>
        <img
          src={ require('./img/poster-close.png') }
          class="close"
          onClick={ () => this.posterImageClose() }
        />
        <img src={ this.posterImage } alt="tp" class="poster-image" />
        <div class="keep">长按图片可以保存到手机</div>
      </div>

      <div class="mask"></div>
    </div>
  },
  props: {
    posterImageStatus: {
      type: Boolean,
      default: false
    },
    posterData: {
      type: Object,
      default: () => {}
    }
  },
  data: function() {
    return {
      canvasStatus: false
    };
  },
  watch: {
    posterImageStatus: function() {
      var that = this;
      if (that.posterImageStatus === true) {
        that.$nextTick(function() {
          that.savePosterPath();
        });
      }
    }
  },
  methods: {
    posterImageClose () {
      this.canvasStatus = false;
      this.$emit("setPosterImageStatus");
    },
    savePosterPath () {
      this.setHtml2Canvas();
    },
    setHtml2Canvas () {
      var that = this;
      const canvas = document.createElement("canvas");
      let canvasBox = that.$refs.poster;
      const width = parseInt(window.getComputedStyle(canvasBox).width);
      const height = parseInt(window.getComputedStyle(canvasBox).height);
      canvas.width = width * 2;
      canvas.height = height * 2;
      canvas.style.width = width + "px";
      canvas.style.height = height + "px";
      const context = canvas.getContext("2d");
      context.scale(2, 2);
      const options = {
        backgroundColor: null,
        canvas,
        useCORS: true
      };
      html2canvas(canvasBox, canvas).then(function(canvas) {
        that.posterImage = canvas.toDataURL();
        that.canvasStatus = true;
      });
    }
  }
}
