<template>
  <div class="comments" ref="commentsWrapper">
    <div class="comments-content">
      <div class="overview">
        <div class="overview-left cl-center">
          <p class="score cl-text-xl">{{ seller.score }}</p>
          <p class="cl-text-sm">综合评分</p>
          <p class="desc cl-text-xs">高于周边商家{{ seller.rankRate }}%</p>
        </div>
        <div class="overview-right">
          <p class="score-wrapper cl-clear-space">
            <span class="title cl-text-sm">服务态度</span>
            <StarRating :score="seller.serviceScore" :size="12" />
            <span class="score cl-text-sm">{{ seller.serviceScore }}</span>
          </p>
          <p class="score-wrapper cl-clear-space">
            <span class="title cl-text-sm">商品评分</span>
            <StarRating :score="seller.foodScore" :size="12" />
            <span class="score cl-text-sm">{{ seller.foodScore }}</span>
          </p>
          <p class="cl-text-sm">
            <span class="title">送达时间</span><span class="time">{{ seller.deliveryTime }}分钟</span>
          </p>
        </div>
      </div>
      <Splitter />
      <div class="list-container">
        <RatingsSelect
          :ratings="comments"
          :type-desc="ratingsOption.typeDesc"
          :default-type="ratingsOption.defaultType"
          :only-content="onlyContent"
          @select-type="selectType"
          @toggle-showContent="toggleShowContent"
        />
      </div>
      <!-- 评论列表 -->
      <ul class="comments-list">
        <li class="comment-item"
          v-for="(comment, index) in comments" :key="index"
          v-show="ifShowRating(comment.rateType, comment.text)"
        >
          <div class="avatar">
            <img :src="comment.avatar" alt="">
          </div>
          <div class="info">
            <div class="username cl-text-xs cl-cf">
              <div class="cl-fl">{{ comment.username }}</div>
              <div class="cl-fr comment-time">{{ comment.rateTime | formatTime }}</div>
            </div>
            <div class="desc">
              <div class="star-level cl-display-inblock">
                <StarRating :score="comment.score" :size="10" />
              </div>
              <span class="time cl-text-xs" v-if="comment.deliveryTime">{{ comment.deliveryTime }}分钟送达</span>
            </div>
            <p class="text cl-text-sm">{{ comment.text }}</p>
            <div class="rate-type">
              <i class="cl-text-sm cl-vertical-mid" :class="{'icon-thumb_up': !comment.rateType, 'icon-thumb_down': comment.rateType}"></i>
              <span class="recommend cl-text-xs cl-vertical-mid cl-text-truncate" v-for="(item, index) in comment.recommend" :key="index">{{ item }}</span>
            </div>
          </div>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
  import StarRating from '../star-rating/StarRating'
  import Splitter from '../splitter/Splitter'
  import RatingsSelect from '../ratings-select/RatingsSelect'
  import BScroll from 'better-scroll'
  import {formatDate} from '@/common/js/formatDate'

  const ERR_OK = 0
  const ALL = 2

  export default {
    name: 'comments',
    props: {
      seller: Object
    },
    data () {
      return {
        comments: [],
        ratingsOption: {
          typeDesc: {
            all: '全部',
            positive: '满意',
            negative: '不满意'
          },
          defaultType: ALL
        },
        onlyContent: false,
        selectedType: ALL
      }
    },
    created () {
      this.$http.get('/api/comments').then((res) => {
        res = res.body
        if (res.errno === ERR_OK) {
          this.comments = res.data
          this.$nextTick(() => {
            this._initCommentsSroll()
          })
        }
      })
    },
    methods: {
      _initCommentsSroll () {
        if (!this.scroll) {
          this.scroll = new BScroll(this.$refs.commentsWrapper, {
            click: true
          })
        } else {
          this.scroll.refresh()
        }
      },
      selectType (type) {
        this.selectedType = type
        this.$nextTick(() => {
          this.scroll.refresh()
        })
      },
      toggleShowContent () {
        this.onlyContent = !this.onlyContent
        this.$nextTick(() => {
          this.scroll.refresh()
        })
      },
      ifShowRating (type, text) {
        if (this.onlyContent && !text) {
          return false
        }
        if (this.selectedType === ALL) {
          return true
        } else if (this.selectedType === type) {
          return true
        } else {
          return false
        }
      }
    },
    filters: {
      formatTime (time) {
        return formatDate(new Date(time), 'yyyy-MM-dd hh:mm')
      }
    },
    components: {
      StarRating,
      Splitter,
      RatingsSelect
    }
  }
</script>

<style lang="stylus" rel="stylesheet/stylus">
  @import "../../common/stylus/index"
  @import "../../common/stylus/icon"

  .comments
    height 100%
    overflow hidden
    .overview
      display flex
      padding 1.8rem 0
      .overview-left
        flex 2
        border-right 1px solid border-color
        @media only screen and (max-width: 320px)
          flex 0 0 10rem
        .score
          color text-score-color
          line-height 2.8rem
        .desc
          margin .6rem 0
          color text-light-color
      .overview-right
        flex 3
        padding 0 2.4rem
        @media only screen and (max-width: 320px)
          padding 0 1.2rem
        .score-wrapper
          margin-bottom .8rem
          .title
            margin-right .6rem
          .score
            margin-left .6rem
            color text-score-color
        .title
          margin-right 1.2rem
          line-height 1.8rem
        .time
          color text-light-color
          line-height 1.8rem
    .list-container
      padding 1.8rem
    .comments-list
      .comment-item
        display flex
        margin 0 1.8rem
        padding 1.8rem 0
        border-bottom-1px(border-color)
        .avatar
          flex 0 0 2.8rem
          width 2.8rem
          height 2.8rem
          border-radius 50%
          overflow hidden
          img
            width 100%
            height 100%
        .info
          flex 1
          margin-left 1.2rem
          .username
            margin-bottom .4rem
            line-height 1.2rem
            .comment-time
              color text-light-color
          .desc
            .star-level
              .star
                margin 0 .2rem !important
            .time
              margin-left .6rem
              line-height 1.8rem
              color text-light-color
          .rate-type
            margin-top .8rem
            i
              margin-right .8rem
              line-height 1.6rem
              color text-light-color
              &.icon-thumb_up
                color rgb(0, 160, 220)
            .recommend
              display inline-block
              max-width 9rem
              margin-right .6rem
              margin-bottom .3rem
              padding 0 .6rem
              line-height 1.6rem
              color text-light-color
              border 1px solid border-color
</style>
