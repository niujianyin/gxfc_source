<template>
  <div class="review" transition="slide-left" v-el:review>
    <v-nav></v-nav>
    <div class="loading" v-show="showLoading">
      <div class="loadCircle"></div>
    </div>
    <div class="list" v-show="!showLoading" v-el:list>
      <div v-el:listul>
        <div class="nitem border-1px" v-for="item in hlist" track-by="$index"
        >
          <div class="lott_head">
            <span class="lott_period">{{ issueno(item) }}</span>
            <span class="lott_date">{{ opentime(item) }}</span>
          </div>
          <div class="lott_content">
            <div class="lott_nums">
              <span class="lott_num" v-for="ir in red_result(item)" track-by="$index">{{ ir }}</span>
              <span class="lott_num lott_num_blue" v-for="ir in blue_result(item)" track-by="$index">{{ ir }}</span>
              <em class="lott_test" v-if="isfc3d">
                {{ test_result(item) }}
              </em>
              <em class="lott_sfc" v-if="issfc">
                <span class="lott_sfc_i" v-for="ir in sfc_result(item)" track-by="$index">{{ ir }}</span>
              </em>
            </div>
            <a class="url_detail" v-link="{path: '/detail/' + lottId + '/' + item.issue_no}" data-sudaclick="kaijiang_history_detail">
              <em class="url_text">详情</em><span class="icon_arrowright"></span>
            </a>
          </div>
        </div>
        <div class="list-more" v-if="!isFirstLoading && !isLoadingMoreNo">
          <img src="http://n.sinaimg.cn/sports/sina_lotto/lotto/wap/i/loading.gif"/>加载中...
        </div>
      </div>
    </div>
    <div class="no-list" v-if="!showLoading && noNews">
      {{ getNoNews }}
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  import BScroll from 'better-scroll';
  import Nav from 'components/nav/nav';

  export default {
    data() {
      return {
        gameDesc: '',
        lottId: '',
        hlist: [],
        isFirstLoading: false,
        isLoadingMore: false,
        isLoadingMoreNo: false,
        currentpage: 1,
        noNews: false,
        showLoading: true,
        scrollY: 0,
        listHeight: 0,
        ulHeight: 0,
        listScroll: ''
      };
    },
    computed: {
      getNoNews() {
        return '暂无数据';
      },
      issfc() {
        return this.gameDesc == '胜负彩';
      },
      isfc3d() {
        return this.gameDesc == '福彩3D';
      }
    },
    ready() {
      let self = this;
      self.lottId = self.$route.params.lottId;
      self.initlist();
    },
    methods: {
      _initScroll(){
        let self = this;
        let timeout = null;
        let w = util.viewData().viewWidth;
        if (w > maxW) {
          w = maxW
          $(self.$els.review).css({'left': '50%', 'right': 'auto', 'width': w + 'px', 'marginLeft': -w / 2 + 'px'})
        }
        self.listHeight = $(self.$els.review).height();
        $(self.$els.list).height(self.listHeight - 40);
        self.updateScroll();
        self.listScroll.on('scroll', (pos) => {
          self.scrollY = Math.abs(Math.round(pos.y));
          if (timeout) {
            window.clearTimeout(timeout);
          }
          timeout = setTimeout(function () {
            if (self.scrollY + self.listHeight >= self.ulHeight) {
              self._beginMorePage();
            }
          }, 100);
        });
      },
      updateScroll() {
        let self = this;
        if (self.listScroll) {
          self.listScroll.refresh();
        } else {
          if (this.$els && this.$els.list) {
            self.listScroll = new BScroll(this.$els.list, {
              click: true,
              probeType: 3
            });
          }
        }
        self.ulHeight = $(self.$els.listul).height();
      },
      _beginMorePage() {
        let self = this;
        if (self.isFirstLoading) {
          return;
        }
        if (self.isLoadingMore) {
          return;
        }
        if (self.isLoadingMoreNo) {
          return;
        }
        self.currentpage = self.currentpage + 1;
        //        console.log(self.currentpage);
        self.loadMorePage();
      },
      loadFirstPage() {
        var self = this;
        self.showLoading = true;
        self.currentpage = 1;
        self.isFirstLoading = true;
        $.ajax({
          url: 'http://match.lottery.sina.com.cn/client/index/clientProxy?__caller__=web&__verno__=1&cat1=gameOpen&format=json&gameCode=' + self.lottId + '&page=' + self.currentpage,
          dataType: 'jsonp',
          data: {},
          cache: false,
          jsonpCallback: 'gameOpen_lotto_' + self.lottId + '_' + self.currentpage,
          type: 'get',
          success: function (res) {
            let result = res.result;
            let code = result.status.code;
            let data = result.data;
            let gameCode = result.gameCode;
            self.gameDesc = result.gameDesc;
            if (self.lottId == gameCode) {
              self.showLoading = false;
              self.isFirstLoading = false;
              self.isLoadingMoreNo = false;
              if (code === 0 && data.length > 0) {
                self.noNews = false;
                self.hlist = data;
                self.$nextTick(() => {
                  self._initScroll();
                });
                if (data.length < 6) {
                  self.currentpage = self.currentpage + 1;
                  self.loadMorePage();
                }
              } else {
                self.noNews = true;
                self.isLoadingMoreNo = true;
              }
            } else if (code !== 0) {
              self.showLoading = false;
              self.isFirstLoading = false;
              self.noNews = true;
              self.isLoadingMoreNo = true;
            }
          }
        });
      },
      loadMorePage() {
        var self = this;
        self.isLoadingMore = true;
        $.ajax({
          url: 'http://match.lottery.sina.com.cn/client/index/clientProxy?__caller__=web&__verno__=1&cat1=gameOpen&format=json&gameCode=' + self.lottId + '&page=' + self.currentpage,
          dataType: 'jsonp',
          data: {},
          cache: false,
          jsonpCallback: 'gameOpen_lotto_' + self.lottId + '_' + self.currentpage,
          type: 'get',
          success: function (res) {
            let result = res.result;
            let code = result.status.code;
            let data = result.data;
            let gameCode = result.gameCode;
            if (self.lottId == gameCode) {
              self.isLoadingMore = false;
              self.isLoadingMoreNo = false;
              if (code === 0 && data.length > 0) {
                for (var i = 0, len = data.length; i < len; i++) {
                  self.hlist.push(data[i]);
                }
                self.$nextTick(() => {
                  self.updateScroll();
                });
              } else {
                self.isLoadingMoreNo = true;
              }
            }
          }
        });
      },
      initlist() {
        this.loadFirstPage();
      },
      go(url) {
        if (url) {
          window.location.href = url;
        }
      },
      issueno(lott) {
        if (lott.issue_no) {
          return lott.issue_no + '期';
        }
      },
      opentime(lott) {
        if (lott.opentime) {
          let date = lott.opentime.replace(/-/g, '/');
          let week = util.WEEK_NAME[(new Date(date)).getDay()];
          return util.dateFormatFmt(date, 'MM-dd') + ' ' + week;
        }
      },
      red_result(lott) {
        if (this.issfc) {
          return '';
        }
        if (lott.open_result) {
          return lott.open_result.split(',');
        }
        if (lott.red_result) {
          return lott.red_result.split(',');
        }
      },
      blue_result(lott) {
        if (lott.blue_result) {
          return lott.blue_result.split(',');
        }
      },
      test_result(lott) {
        let result = '试机号－';
        if (lott.test_result) {
          let arr = lott.test_result.split(' ');
          let arr1 = arr.map(function (item) {
            return '0' + item;
          });
          result += arr1.join(' ');
        }
        return result;
      },
      sfc_result(lott) {
        return lott.open_result.split('|');
      }
    },
    components: {
      'v-nav': Nav
    }
  };
</script>

<style lang="stylus" rel="stylesheet/stylus">
  @import "../../common/stylus/mixin.styl"
  .review
    display: block
    position: fixed
    top: fixed_top
    bottom: 0px
    left: 0px
    right: 0px
    z-index: 2
    &.slide-left-transition
      transition: all 0.2s linear
      transform: translate3d(0, 0, 0)
    &.slide-left-enter, &.slide-left-leave
      opacity: 0
      transform: translate3d(100%, 0, 0)
    .ititle
      height: 44px
      line-height: 44px
      padding-left: 8px
      font-size: 15px
      color: color2
      font-weight: 700
      background: c_bg
      position: relative
      z-index: 3
    .loading
      position: absolute
      top: 0
      bottom: 0
      left: 0
      right: 0
      z-index: 82
      .loadCircle
        position: absolute
        top: 50%
        left: 50%
        margin: -20px 0 0 -20px
        width: 40px
        height: 40px
        background: url(http://n.sinaimg.cn/sports/sina_lotto/lotto/wap/i/loading.png) no-repeat
        background-size: 40px 40px
        -webkit-animation: rotation 2s linear infinite
        animation: rotation 2s linear infinite
    .list
      padding: 2px 8px 0
      .nitem
        min-height: 110px
        position: relative
        border-1px(c_split)
        position: relative
        .lott_head
          height: 41px
          line-height: 24px
          padding-top: 17px
          padding-left: 8px
          position: relative
          .lott_period
            display: inline-block
            font-size: 14px
            color: color1
          .lott_date
            padding-left: 6px
            display: inline-block
            font-size: 14px
            color: color2

        .lott_content
          display: block
          position: relative
          padding-left: 8px
          .lott_nums
            display: block
            height: 46px
            padding-top: 13px
            overflow: hidden
            font-size: 0
            @media only screen and (max-width: 374px)
              height: 50px
              padding-top: 17px
            .lott_num
              display: inline-block
              background: c_red1
              margin-right: 6px
              width: 33px
              height: 33px
              text-align: center
              line-height: 33px
              font-size: 16px
              font-weight: 700
              color: #ffffff
              border-radius: 100%
              font-family: 'Helvetica Neue'
              @media only screen and (max-width: 374px)
                width: 26px
                height: 26px
                line-height: 26px
                font-size: 12px
              &.lott_num_blue
                background: c_blue
            .lott_test
              display: inline-block
              font-size: 14px
              color: color2
              padding-left: 7px
            .lott_sfc
              height: 33px
              line-height: 33px
              color: c_red1
              font-size: 16px
              padding-left: 13px
              .lott_sfc_i
                padding-right: 8px
          .url_detail
            position: absolute
            right: 2px
            top: 13px
            line-height: 33px
            height: 33px
            vertical-align: top
            font-size: 14px
            color: color1
          .url_text
            display: inline-block
            vertical-align: middle
          .icon_arrowright
            margin-left: 4px
            display: inline-block
            width: 9px
            height: 16px
            background-size: 9px 16px
            background-repeat: no-repeat
            vertical-align: middle
            background-image: url(http://n.sinaimg.cn/sports/sina_lotto/topen/wap/i/icon_arrowright.png)

      .list-more
        background: #fff
        margin-bottom: 5px
        line-height: 40px
        height: 40px
        font-size: 13px
        text-align: center
        color: c_icon
        img
          display: inline-block
          width: 15px
          height: 15px
          vertical-align: 10px
          margin-right: 10px
          vertical-align: baseline

    .no-list
      text-align: center
      line-height: 200px
      font-size: 15px
      color: c_icon

</style>