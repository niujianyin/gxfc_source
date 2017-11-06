<template>
  <div class="lott border-1px" :class="{'border-no': noborder}">
    <div class="lott_head">
      <span class="lott_title">{{ lott.gameDesc }}</span>
      <span class="lott_period">{{ issueno }}</span>
      <span class="lott_date">{{ opentime }}</span>
      <span :class="openstatus" v-touch:tap.stop.prevent="goVideo()" data-sudaclick="{{ getSuda()}}"></span>
    </div>
    <div class="lott_content">
      <div class="lott_nums">
        <span class="lott_num" v-for="item in red_result" track-by="$index">{{ item }}</span>
        <span class="lott_num lott_num_blue" v-for="item in blue_result" track-by="$index">{{ item }}</span>
        <em class="lott_test" v-if="isfc3d">
          {{ test_result }}
        </em>
        <em class="lott_sfc" v-if="issfc">
          <span class="lott_sfc_i" v-for="item in sfc_result" track-by="$index">{{ item }}</span>
        </em>
      </div>
      <div class="lott_info">
        {{{ next_opentime }}}
      </div>
      <a class="url_detail" v-link="{path: '/detail/' + lott.gameCode + '/' + lott.issue_no}"  data-sudaclick="kaijiang_detail">
        <em class="url_text">详情</em><span class="icon_arrowright"></span>
      </a>
      <a class="url_review" v-link="{path: '/history/' + lott.gameCode}"  data-sudaclick="kaijiang_history">
        <em class="url_text">往期</em><span class="icon_arrowright"></span>
      </a>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  export default {
    props: {
      lott: {
        type: Object
      }
    },
    computed: {
      noborder() {
        return this.lott.gameDesc == '七乐彩' || this.issfc;
      },
      issfc() {
        return this.lott.gameDesc == '胜负彩';
      },
      isfc3d() {
        return this.lott.gameDesc == '福彩3D';
      },
      issueno() {
        if (this.lott.issue_no) {
          return this.lott.issue_no + '期';
        }
      },
      opentime() {
        if (this.lott.opentime) {
          let date = this.lott.opentime.replace(/-/g, '/');
          let week = util.WEEK_NAME[(new Date(date)).getDay()];
          return util.dateFormatFmt(date, 'MM-dd') + ' ' + week;
        }
      },
      openstatus() {
        let arr = ['', 'icon_live', 'icon_review'];
        return arr[this.lott.open_status];
      },
      red_result() {
        if (this.issfc) {
          return '';
        }
        if (this.lott.open_result) {
          return this.lott.open_result.split(',');
        }
        if (this.lott.red_result) {
          return this.lott.red_result.split(',');
        }
      },
      blue_result() {
        if (this.lott.blue_result) {
          return this.lott.blue_result.split(',');
        }
      },
      next_opentime() {
        if (this.lott.open_status == 1) {
          return '本期奖号正在录入…';
        }
        if (this.lott.next_opentime) {
          let date = this.lott.next_opentime.replace(/-/g, '/');
          let week = util.WEEK_NAME[(new Date(date)).getDay()];
          let html = '';
          if (util.dateFormatFmt(date, 'yyyy-MM-dd') == util.dateFormatFmt(new Date(), 'yyyy-MM-dd')) {
            html = '<span class="red">今日开奖</span>';
          } else {
            html = week;
          }
          return '下期开奖：' + util.dateFormatFmt(date, 'MM-dd hh:mm') + ' ' + html;
        }
      },
      test_result() {
        let result = '试机号－';
        if (this.lott.test_result) {
          let arr = this.lott.test_result.split(' ');
          let arr1 = arr.map(function (item) {
            return '0' + item;
          });
          result += arr1.join(' ');
        }
        return result;
      },
      sfc_result() {
        return this.lott.open_result.split('|');
      }
    },
    data() {
      return {
        isShow: true
      };
    },
    methods: {
      goVideo() {
        let url = 'http://lotto.sina.cn/video/tcopen/';
        let lott = this.lott;
        if (lott.gameCode == '101' || lott.gameCode == '102' || lott.gameCode == '104') {
          url = 'http://lotto.sina.cn/video/fcopen/';
        }
        window.location.href = url;
      },
      getSuda() {
        let suda = '';
        let lott = this.lott;
        if (this.lott.open_status == 1) {
          suda = 'kaijiang_tc_live';
          if (lott.gameCode == '101' || lott.gameCode == '102' || lott.gameCode == '104') {
            suda = 'kaijiang_fc_live';
          }
        } else if (this.lott.open_status == 2){
          suda = 'kaijiang_tc_playback';
          if (lott.gameCode == '101' || lott.gameCode == '102' || lott.gameCode == '104') {
            suda = 'kaijiang_fc_playback';
          }
        }
        return suda;
      }
    },
    created() {

    },
    components: {}
  };
</script>

<style lang="stylus" rel="stylesheet/stylus">
  @import "../../common/stylus/mixin.styl"
  .lott
    min-height: 144px
    border-1px(c_split)
    &::after
      left: 8px
      right: 8px
      width: auto
    &.border-no
      border-no()
    .lott_head
      height: 41px
      line-height: 24px
      padding-top: 17px
      padding-left: 8px
      position: relative
      .lott_title
        display: inline-block
        font-size: fs17
        color: color1
        font-weight: 700
      .lott_period
        padding-left: 14px
        display: inline-block
        font-size: 14px
        color: color1
      .lott_date
        padding-left: 6px
        display: inline-block
        font-size: 14px
        color: color2
      .icon_live
        position: absolute
        right: 7px
        top: 20px
        width: 57px
        height: 20px
        background-size: 57px 20px
        background-repeat: no-repeat
        vertical-align: top
        bg-image('i/icon_live')
      .icon_review
        position: absolute
        right: 7px
        top: 20px
        width: 57px
        height: 20px
        background-size: 57px 20px
        background-repeat: no-repeat
        vertical-align: top
        bg-image('i/icon_review')

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
      .lott_info
        display: block
        margin-top: 18px
        height: 20px
        line-height: 20px
        font-size: 14px
        color: color2
        .red
          color: c_red1
          padding-left: 5px
      .url_detail
        position: absolute
        right: 10px
        top: 13px
        line-height: 33px
        height: 33px
        vertical-align: top
        font-size: 14px
        color: color1

      .url_review
        position: absolute
        right: 10px
        top: 56px
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
</style>