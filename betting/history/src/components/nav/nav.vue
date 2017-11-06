<template>
  <div class="nav-box">
    <div class="nav border-1px">
      <div class="item" :class="{'item1': hasTrend, 'selected': item.cur}" v-for="(index, item) in dataNav" track-by="$index" v-touch:tap.stop.prevent="go(item.url, item.cur)">
        {{ item.name }}
      </div>
    </div>
    <div class="nav-placeholder"></div>
  </div>
</template>

<script type="text/ecmascript-6">
  export default {
    data () {
      return {
        lottId: '',
        dataNav: [],
        hasTrend: true
      }
    },
    computed: {
    },
    created() {
      let self = this
      self.lottId = parseInt(self.$route.params.lottId);
      self.getDataNav()
    },
    activated() {
      let self = this
      self.lottId = parseInt(self.$route.params.lottId);
      self.getDataNav()
    },
    deactivated() {
    },
    methods: {
      go(url, flag) {
        if (url && !flag) {
          window.location.href = url;
        }
      },
      getDataNav() {
        let self = this
        if (!self.lottId) {
          return;
        }
        if (self.lottId == '101' || self.lottId == '102') {
          self.dataNav = window._dataNav;
          self.hasTrend = true
        } else {
          self.dataNav = window._dataNav1;
          self.hasTrend = false
        }
      }
    },
    watch: {
      lottId(newLottId, oldLottId) {
        let self = this
        if (newLottId !== oldLottId) {
          self.getDataNav()
        }
      }
    }
  };
</script>

<style lang="stylus" rel="stylesheet/stylus">
  @import "../../common/stylus/mixin.styl"
  .nav-box
    display: block
    .nav
      border-1px(c_split)
      position: fixed
      left: 0px
      right: 0px
      width: 100%
      top: 0;
      height: 40px
      line-height: 40px
      font-size: 14px
      background: #fff
      z-index: 100
      display: table
      .item
        display: table-cell
        width: 25%
        text-align: center
        font-size: 14px
      .item1
        width: 20%
      .selected
        border-bottom: 3px solid red;
    .nav-placeholder
      height: 50px
      background: #f9f9f9
</style>