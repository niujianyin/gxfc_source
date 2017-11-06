<template>
  <div class="index" transition="slide-right" v-el:index>
    <div class="ititle">
      福彩
    </div>
    <v-lott :lott="ssq"></v-lott>
    <v-lott :lott="fc3d"></v-lott>
    <v-lott :lott="qlc"></v-lott>
  </div>
</template>

<script type="text/ecmascript-6">
  import lott from 'components/index/lott';

  export default {
    data() {
      return {
        ssq: {
          id: "4093",
          issue_no: "",
          next_issueno: "",
          red_result: "-,-,-,-,-,-",
          blue_result: "-",
          opentime: "",
          next_opentime: "",
          open_status: 0,
          gameDesc: "双色球",
          gameCode: 101
        },
        fc3d: {
          id: "4473",
          issue_no: "",
          next_issueno: "",
          open_result: "-,-,-",
          test_result: "",
          opentime: "",
          next_opentime: "",
          open_status: 0,
          gameDesc: "福彩3D",
          gameCode: 102
        },
        qlc: {
          id: "1119",
          issue_no: "",
          next_issueno: "",
          red_result: "-,-,-,-,-,-,-",
          blue_result: "-",
          opentime: "",
          next_opentime: "",
          open_status: 0,
          gameDesc: "七乐彩",
          gameCode: 104
        },
        offsetHeight: [],
        scrollY: 0,
        lottType: ['ssq', 'fc3d', 'qlc']
      };
    },
    computed: {
      currentIndex() {
        var self = this;
        if (!self.offsetHeight) {
           return
        }
        for (let i = 0; i < self.offsetHeight.length; i++) {
          let height1 = self.offsetHeight[i];
          let height2 = self.offsetHeight[i + 1];
          if (!height2 || (self.scrollY >= height1 && self.scrollY < height2)) {
            return i;
          }
        }
        return 0;
      }
    },
    components: {
      'v-lott': lott
    },
    methods: {
      _initScroll() {
        let self = this;
        self.getInfo('ssq');
        self.getInfo('fc3d');
        self.getInfo('qlc');
        let $ = window.$;
        self.offsetHeight.push(0);
        $('.index').find('.lott').forEach(function (item, idx) {
          self.offsetHeight.push($(item).offset().top);
        });

        let resizeTimer = null;
        $(document).scroll(function () {
          if (resizeTimer) {
            clearTimeout(resizeTimer)
          }
          resizeTimer = setTimeout(function () {
            let y = window.util.viewData().scrollTop + window.util.viewData().viewHeight;
            self.scrollY = y;
            for (let i = 0, len = self.currentIndex; i < len; i++) {
              self.getInfo(self.lottType[i]);
            }
          }, 200);
        });
      },
      getInfo(type) {
        let self = this;
        if (self[type].issue_no) {
          return;
        }
        $.ajax({
          url: 'http://match.lottery.sina.com.cn/client/index/clientProxy?__caller__=web&__verno__=1&cat1=gameCurrentInfo&format=json&gameCode=' + this[type].gameCode,
          dataType: 'jsonp',
          data: {},
          cache: false,
          jsonpCallback: 'lott_' + self[type].gameCode,
          type: 'get',
          success: function (res) {
            let result = res.result;
            let code = result.status.code;
            let data = result.data;
            if (code === 0) {
              for (let key in self[type]) {
                if (self[type].hasOwnProperty(key) && data[key]) {
                  self[type][key] = data[key];
                }
              }
            }
          }
        });
      }
    },
    created() {
      let self = this;
      this.$nextTick(() => {
        self._initScroll();
      });
    }
  };
</script>

<style lang="stylus" rel="stylesheet/stylus">
  @import "../../common/stylus/mixin.styl"
  .index
    display: block
    &.slide-right-transition
      transition: all 0.2s linear
      transform: translate3d(0, 0, 0)
    &.slide-right-enter, &.slide-right-leave
      opacity: 0
      transform: translate3d(-100%, 0, 0)
    .ititle
      height: 40px
      line-height: 40px
      padding-left: 8px
      font-size: 15px
      color: color2
      font-weight: 700
      background: c_bg
</style>
