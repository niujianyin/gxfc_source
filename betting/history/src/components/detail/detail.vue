<template>
  <div class="detail" transition="slide-left" v-el:detail>
    <div v-el:detailul>
      <v-nav></v-nav>
      <div class="detail_head border-1px">
        <img :src="logo" class="dh_logo" alt="{{name}}">
        <div class="dh_name">{{ gameDesc }}</div>
        <div class="dh_desc">{{ desc }}</div>
        <a class="dh_review" v-link="{path: '/history/' + lottId}" data-sudaclick="kaijiang_detail_history">
        </a>
      </div>
      <div class="loading" v-show="showLoading">
        <div class="loadCircle"></div>
      </div>
      <div class="info" v-show="!showLoading" v-el:info>
        <div class="lott_head">
          <span class="lott_period">{{ issuenoFormat(detail) }}</span>
          <span class="lott_date">{{ opentime(detail) }}</span>
          <span class="icon_opening" v-show="detail.open_status == 1"></span>
        </div>
        <div class="lott_content">
          <div class="lott_nums">
            <span class="lott_num" v-for="ir in red_result(detail)" track-by="$index">{{ ir }}</span>
            <span class="lott_num lott_num_blue" v-for="ir in blue_result(detail)" track-by="$index">{{ ir }}</span>
            <em class="lott_test" v-if="isfc3d">
              {{ test_result(detail) }}
            </em>
            <em class="lott_sfc" v-if="issfc">
              <span class="lott_sfc_i" v-for="ir in sfc_result(detail)" track-by="$index">{{ ir }}</span>
            </em>
          </div>
          <div class="lott_text">
            <span class="ltt">奖池滚存</span>
            <span class="ltm">¥{{{ poolmoney(detail) }}}</span>
          </div>
          <div class="lott_text lott_text1">
            <span class="ltt">本期销量</span>
            <span class="ltm">¥{{{ salemoney(detail) }}}</span>
          </div>
        </div>
        <div class="lott_detail_head">
          开奖详情
        </div>
        <div class="lott_detail_main">
          <div class="ldm_tr">
            <div class="ldm_jx">奖项</div>
            <div class="ldm_zs">注数</div>
            <div class="ldm_money">每注金额</div>
          </div>
          <div class="ldm_tbody" v-if="has_prize_list">
            <div class="ldm_tr" v-for="item in detail.prize_list" track-by="$index">
              <div class="ldm_jx">{{item.prizeDesc}}</div>
              <div class="ldm_zs">{{prizeCount(item.prizeCount)}}</div>
              <div class="ldm_money">{{{prizeMoney(item.prizeMoney)}}}</div>
            </div>
          </div>
          <div class="ldm_tbody" v-if="!has_prize_list">
            <div class="ldm_nodata">暂无数据 </div>
          </div>
        </div>
      </div>
      <div class="no-list" v-if="!showLoading && noNews">
        {{ getNoNews }}
      </div>
      <v-split60></v-split60>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  import split60 from 'components/split/split60';
  import BScroll from 'better-scroll';
  import Nav from 'components/nav/nav';

  export default {
    data() {
      return {
        gameDesc: '',
        lottId: '',
        issueno: '',
        showLoading: true,
        noNews: false,
        detail: {},
        lottInfo: {
          '101': {
            name: '双色球',
            desc: '每周二、四、日  21:15 开奖',
            red_result: "-,-,-,-,-,-",
            blue_result: "-"
          },
          '102': {
            name: '福彩3D',
            desc: '每日 21:15 开奖',
            open_result: "-,-,-",
            test_result: ""
          },
          '104': {
            name: '七乐彩',
            desc: '每周一、三、五  21:15 开奖',
            red_result: "-,-,-,-,-,-,-",
            blue_result: "-"
          },
          '316': {
            name: '广西快3',
            desc: '每周一、三、六  20:25 开奖',
            red_result: "-,-,-,-,-",
            blue_result: "-,-"
          },
          '311': {
            name: '广西快乐十分',
            desc: '每周二、五、日  20:25 开奖',
            open_result: "-,-,-,-,-,-,-"
          }
        },
        newslist: [],
        detailScroll: '',
        matchList: [],
        hasNews: false,
        hasNoNews: false
      };
    },
    computed: {
      logo() {
        if (this.lottId) {
          return 'http://n.sinaimg.cn/sports/sina_lotto/topen/wap/i/' + this.lottId +
            '.png';
        }
      },
      desc() {
        if (this.lottId) {
          return this.lottInfo[this.lottId].desc;
        }
      },
      getNoNews() {
        return '暂无数据';
      },
      issfc() {
        return this.lottId == '401';
      },
      isfc3d() {
        return this.lottId == '102';
      },
      has_prize_list() {
        if (this.detail && this.detail.prize_list && this.detail.prize_list.length){
          return true;
        } else {
          return false;
        }
      }
    },
    ready() {
      let self = this;
      self.lottId = self.$route.params.lottId;
      self.issueno = parseInt(self.$route.params.issueno);
      self.gameDesc = self.lottInfo[this.lottId].name;
      self.init();
      $(self.$els.detail).css({'minHeight': util.viewData().viewHeight + 'px'});
    },
    methods: {
      _initScroll(){
        let self = this;
        let w = util.viewData().viewWidth;
        if (w > maxW) {
          w = maxW
          $(self.$els.detail).css({'left': '50%', 'right': 'auto', 'width': w + 'px', 'marginLeft': -w / 2 + 'px'})
        }
        self.updateScroll();
      },
      updateScroll() {
        let self = this;
        if (self.detailScroll) {
          self.detailScroll.refresh();
        } else {
          if (this.$els && this.$els.detail) {
            self.detailScroll = new BScroll(this.$els.detail, {
              click: true,
              probeType: 3
            });
          }
        }
      },
      init() {
        var self = this;
        self.showLoading = true;
        $.ajax({
          url: 'http://match.lottery.sina.com.cn/client/index/clientProxy?__caller__=web&__verno__=1&cat1=gameCurrentInfo&format=json&gameCode=' + self.lottId + '&issueNo=' + self.issueno,
          dataType: 'jsonp',
          data: {},
          cache: false,
          jsonpCallback: 'lotto_' + self.lottId + '_' + self.issueno,
          type: 'get',
          success: function (res) {
            let result = res.result;
            let code = result.status.code;
            let data = result.data;
            let gameCode = data.gameCode;
            let issueno = data.issue_no;
            self.gameDesc = data.gameDesc;
            if (self.lottId == gameCode && self.issueno == issueno) {
              self.showLoading = false;
              if (code === 0 && data) {
                self.noNews = false;
                for (let key in self.lottInfo[self.lottId]) {
                  if (self.lottInfo[self.lottId].hasOwnProperty(key) && !data[key]) {
                    data[key] = self.lottInfo[self.lottId][key];
                  }
                }
                self.detail = data;
                self.$nextTick(() => {
                  self._initScroll();
                });
              } else {
                self.noNews = true;
              }
            } else if (code !== 0) {
              self.showLoading = false;
              self.noNews = true;
            }
//            self.loadNews();
          }
        });
      },
      loadNews() {
        var self = this;
        $.ajax({
          url: 'http://interface.sina.cn/sports/caitong/get_open_newslsit.d.json?gameCode=' + self.lottId + '&issueNo=' + self.issueno,
          dataType: 'jsonp',
          data: {},
          cache: false,
          jsonpCallback: 'get_open_newslsit_' + self.lottId + '_' + self.issueno,
          type: 'get',
          success: function (res) {
            let result = res.result;
            let code = result.status.code;
            let data = result.data;
            if (code === 0 && data.length > 0) {
              self.hasNews = true;
              self.newslist = data;
              self.$nextTick(() => {
                self.updateScroll();
              });
            } else {
              self.hasNews = false;
              if (self.lottId == '101' || self.lottId == '201' || self.lottId == '401') {
                self.hasNoNews = true;
              }
            }
          }
        });
      },
      go(url) {
        if (url) {
          window.location.href = url;
        }
      },
      goSuda(url) {
        let self = this;
        if (url) {
          window.SIMA && window.SIMA({
            action: '_click',
            data: {
              'aid': 'kaijiang_detail_newsdetails'
            }
          });
          if (self.lottId == '101'){
            window.SIMA && window.SIMA({
              action: '_click',
              data: {
                'aid': 'kaijiang_ssq_detail_newsdetails'
              }
            });
          } else if (self.lottId == '401'){
            window.SIMA && window.SIMA({
              action: '_click',
              data: {
                'aid': 'kaijiang_soccer_detail_newsdetails'
              }
            });
          } else if (self.lottId == '201'){
            window.SIMA && window.SIMA({
              action: '_click',
              data: {
                'aid': 'kaijiang_dlt_detail_newsdetails'
              }
            });
          }
          window.location.href = url;
        }
      },
      issuenoFormat(lott) {
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
        if (lott.open_result) {
          return lott.open_result.split('|');
        }
      },
      poolmoney(lott) {
        if (lott.pool_money || lott.pool_money === 0) {
          return '<span class="money red">' + util.toThousands(lott.pool_money) + '</span>';
        } else {
          return '－－－';
        }
      },
      salemoney(lott) {
        if (lott.sale_money || lott.sale_money === 0) {
          return '<span class="money">' + util.toThousands(lott.sale_money) + '</span>';
        } else {
          return '－－－';
        }
      },
      getItemType(item) {
        let pic = item.pic;
        if (!pic) {
          return '';
        } else {
          return 'nitem1';
        }
      },
      prizeCount(value) {
        if (value) {
          return value;
        } else {
          return '－－';
        }
      },
      prizeMoney(value) {
        if (value) {
          return util.toThousands(value);
        } else {
          return '<span style="padding-left: 12px;">－－</span>';
        }
      },
      matchVs(item) {
        let host_score = item.host_score;
        if (host_score || host_score === 0) {
          return '<div class="inner"><div class="host">' + item.host_team + '</div><div class="score"><span class="red">' + item.host_score + '</span><em>:</em><span class="red">' + item.away_score + '</span></div><div class="away">' + item.away_team + '</div></div>';
        } else {
          return '<div class="inner"><div class="host">' + item.host_team + '</div><div class="score"><span>- </span><em>:</em><span> -</span></div><div class="away">' + item.away_team + '</div></div>';
        }
      },
      matchResult(value) {
        if (value) {
          return value;
        } else {
          return '－－';
        }
      }
    },
    components: {
      'v-split60': split60,
      'v-nav': Nav
    }
  };
</script>

<style lang="stylus" rel="stylesheet/stylus">
  @import "../../common/stylus/mixin.styl"
  .landscape
    .split60
      display: none
  .detail
    display: block
    position: fixed
    top: fixed_top
    bottom: 0px
    left: 0px
    right: 0px
    z-index: 2
    &.slide-left-transition
      transition: all 0.2s linear
    &.slide-left-enter, &.slide-left-leave
      opacity: 0
    .detail_head
      height: 92px
      position: relative
      border-1px(c_split)
      overflow: hidden
      margin: 0 8px
      padding-left: 80px
      .dh_logo
        position: absolute
        left: 0
        top: 19px
        width: 53px
        height: 53px
        display: block
      .dh_name
        display: block
        margin-top: 20px
        height: 24px
        line-height: 24px
        font-size: 17px
        font-weight: 700
        color: color1
      .dh_desc
        display: block
        margin-top: 8px
        height: 20px
        line-height: 20px
        font-size: 14px
        color: #95989A
      .dh_review
        position: absolute
        right: 0
        top: 21px
        width: 68px
        height: 22px
        background-size: 68px 22px
        background-repeat: no-repeat
        vertical-align: middle
        background-image: url(http://n.sinaimg.cn/sports/sina_lotto/topen/wap/i/icon_dreview.png)
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
    .info
      .lott_head
        height: 36px
        line-height: 24px
        padding-top: 12px
        padding-left: 8px
        margin-right: 8px
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
        .icon_opening
          position: absolute
          right: 0
          top: 13px
          width: 68px
          height: 22px
          background-size: 68px 22px
          background-repeat: no-repeat
          vertical-align: middle
          background-image: url(http://n.sinaimg.cn/sports/sina_lotto/topen/wap/i/icon_dopen.png)
      .lott_content
        display: block
        position: relative
        padding-left: 8px
        padding-bottom: 14px
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
        .lott_text
          margin-top: 20px
          height: 20px
          line-height: 20px
          white-space: nowrap
          font-size: 14px
          color: color1
          .ltt
            display: inline-block
            width: 72px
            text-align: left
          .ltm
            display: inline-block
            color: color3
            .red
              color: c_red1
            .money
              padding-left: 10px
          &.lott_text1
            margin-top: 17px

      .lott_detail_head
        height: 44px
        line-height: 44px
        font-size: 15px
        color: color3
        font-weight: 700
        background: c_bg
        padding-left: 8px
      .lott_detail_main
        overflow: hidden
        padding-top: 8px
        padding-bottom: 10px
        .ldm_nodata
          text-align: center
          line-height: 60px
          height: 60px
          font-size: 14px
          color: color3
        .ldm_tr
          display: flex
          margin-left: 24px
          font-size: 14px
          color: color1
          height: 34px
          line-height: 34px
          .ldm_jx
            flex: 1 1 124px
          .ldm_zs
            flex: 1 1 124px
          .ldm_money
            flex: 1 0 103px
        .ldm_tr_vs
          display: flex
          margin-left: 24px
          font-size: 14px
          color: color1
          height: 34px
          line-height: 34px
          .ldm_jx_vs
            flex: 1 0 62px
          .ldm_zs_vs
            flex: 1 1 210px
            overflow: hidden
            white-space: nowrap
            text-overflow: ellipsis
            text-align: center
            .inner
              display: flex
              .host
                flex: 1 1
                text-align: right
                white-space: nowrap
                overflow: hidden
              .away
                flex: 1 1
                text-align: left
                white-space: nowrap
                overflow: hidden
              .score
                flex: 0 0 60px
                text-align: center
                em
                  padding: 0 3px
            .red
              color: color1
              font-weight: 700
          .ldm_money_vs
            flex: 1 0 79px
            text-align: center
        .ldm_tbody
          .ldm_tr, .ldm_tr_vs
            color: color3
      .lott_news
        display: block
        .lott_news_head
          height: 44px
          line-height: 44px
          font-size: 15px
          color: color3
          font-weight: 700
          background: c_bg
          padding-left: 8px
        .lott_news_main
          display: block
          padding-left: 8px
          .nitem
            min-height: 79px
            position: relative
            border-1px(c_split)
            position: relative
            .ntitle
              padding-top: 15px
              padding-right: 10px
              font-size: fs17
              color: color1
              line-height: 22px
              overflow: hidden
              min-height: 37px
              max-height: 59px
            .npic-list
              display: none
            .ninfo
              margin-top: 12px
              height: 30px
              line-height: 22px
              font-size: 0
              color: #95989A
              span
                display: inline-block
                vertical-align: middle
                font-size: 11px
              .icon_comment
                bg-image('i/icon_comment')
                width: 17px
                height: 16px
                background-size: 17px 16px
                margin: 0 7px 0 17px
            &.nitem1
              min-height: 110px
              .ntitle
                padding-right: 125px
                height: 59px
              .npic-list
                display: block
                position: absolute
                right: 8px
                top: 14px
                width: 104px
                height: 77px
                .npic
                  display: block
                  width: 100%
                  height: 100%
                  img
                    display: block
                    width: 100%
                    height: 100%
              .ninfo
                margin-top: 15px
            &.nitem2
              min-height: 195px
              .npic-list
                display: block
                display: flex
                justify-content: space-between
                .npic
                  flex: 1;
                  height: 96px
                  padding: 17px 8px 4px 0
                  img
                    display: block
                    width: 100%
                    height: 100%
        .lott_news_nodata
          text-align: center
          color: color3
          font-size: 14px
          line-height: 50px
          height: 50px
    .no-list
      text-align: center
      line-height: 200px
      font-size: 15px
      color: c_icon

</style>