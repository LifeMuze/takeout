<template>
  <div class="seller-wrapper" ref="sellerWrapper">
    <div class="seller">
      <div class="seller-overview">
        <div class="collect cl-center cl-clear-space">
          <i class="icon-favorite cl-text-xl"
            :class="{'collected': ifCollected}"
            @click="toggleCollect">
          </i>
          <p class="cl-text-sm">{{collectText}}</p>
        </div>
        <h1 class="seller-name cl-weight-normal">{{ seller.name }}</h1>
        <div class="rating-info cl-clear-space">
          <div class="rating cl-display-inblock cl-vertical-mid">
            <StarRating :score="seller.score" :size="18" />
          </div>
          <span class="comments-num cl-text-xs cl-display-inblock cl-vertical-mid">({{ seller.ratingCount }})</span>
          <span class="seller-count cl-text-xs cl-display-inblock cl-vertical-mid">月售{{ seller.sellCount }}单</span>
        </div>
        <div class="seller-data">
          <div class="item cl-text-xs">
            <p class="title">起送价</p>
            <p class="cl-lighter"><span class="strong cl-text-xl">{{ seller.minPrice }}</span>元</p>
          </div>
          <div class="item cl-text-xs">
            <p class="title">商家配送</p>
            <p class="cl-lighter"><span class="strong cl-text-xl">{{ seller.deliveryPrice }}</span>元</p>
          </div>
          <div class="item cl-text-xs">
            <p class="title">平均配送时间</p>
            <p class="cl-lighter"><span class="strong cl-text-xl">{{ seller.deliveryTime }}</span>分钟</p>
          </div>
        </div>
      </div>

      <Splitter />

      <div class="bulletin">
        <h2 class="title cl-weight-normal">公告与活动</h2>
        <p class="text cl-text-sm cl-lighter">{{ seller.bulletin }}</p>
      </div>

      <Splitter />

      <div class="seller-view">
        <h2 class="title cl-weight-normal">商家实景</h2>
        <div class="list-wrapper" ref="viewWrapper">
          <ul class="img-list">
            <li class="img-item" v-for="(img, index) in seller.pics" :key="index">
              <img :src="img" alt="" width="120" height="90">
            </li>
          </ul>
        </div>
      </div>

      <Splitter />

      <div class="seller-info">
        <h2 class="title cl-weight-normal">商家信息</h2>
        <ul>
          <li class="info cl-text-sm cl-lighter" v-for="(info, index) in seller.infos" :key="index">
            {{ info }}
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
  import StarRating from '../star-rating/StarRating'
  import Splitter from '../splitter/Splitter'
  import BScroll from 'better-scroll'
  import {saveToLocal, loadFromLocal} from '../../common/js/storage'

  export default {
    name: 'seller',
    props: {
      seller: Object
    },
    data () {
      return {
        ifCollected: false
      }
    },
    computed: {
      collectText () {
        return this.ifCollected ? '已收藏' : '收藏'
      }
    },
    mounted () {
      this.$nextTick(() => {
        this._initSellerSroll()
        this._initViewSroll()
      })
      // 读取本地存储的收藏状态
      let collectLog = loadFromLocal(this.seller.id, 'collected', false)
      this.ifCollected = collectLog
    },
    methods: {
      _initSellerSroll () {
        if (!this.sellerScroll) {
          this.sellerScroll = new BScroll(this.$refs.sellerWrapper, {
            click: true
          })
        } else {
          this.sellerScroll.refresh()
        }
      },
      _initViewSroll () {
        if (!this.viewSroll) {
          this.viewSroll = new BScroll(this.$refs.viewWrapper, {
            click: true,
            scrollX: true,
            eventPassthrough: 'vertical'
          })
        } else {
          this.viewSroll.refresh()
        }
      },
      toggleCollect () {
        this.ifCollected = !this.ifCollected
        // 保存到本地存储
        saveToLocal(this.seller.id, 'collected', this.ifCollected)
      }
    },
    components: {
      StarRating,
      Splitter
    }
  }
</script>

<style lang="stylus" rel="stylesheet/stylus">
  @import "../../common/stylus/index"
  @import "../../common/stylus/icon"

  .seller-wrapper
    height 100%
    overflow hidden
    .seller
      .seller-overview
        position relative
        padding 1.8rem
        .collect
          position absolute
          width 4rem
          top 1.8rem
          right 1.8rem
          i
            color #ccc
            &.collected
              color rgb(240, 20, 20)
            + p
              color rgb(77, 85, 93)
        .seller-name
          margin-bottom .8rem
          line-height 1.6rem
          text-indent .3rem
        .rating-info
          .rating
            height 2rem
            .star-container
              .star
                margin 0 .3rem !important
          .comments-num
            margin-left .8rem
            margin-right 1.2rem
          .seller-count
            line-height 2rem
        .seller-data
          display flex
          margin-top 1.8rem
          border-top 1px solid border-color
          .item
            flex 1
            margin-top 1.8rem
            text-align center
            border-right 1px solid border-color
            &:last-child
              border none
            .title
              margin-bottom .4rem
              color text-light-color
      .bulletin
        padding 1.8rem
        .title
          margin-bottom .8rem
          line-height 1.6rem
        .text
          padding 0 1.2rem
          color rgb(240, 20, 20)
          line-height 2.4rem
      .seller-view
        .title
          margin-bottom 1.2rem
        padding 1.8rem
        .list-wrapper
          overflow hidden
          .img-list
            width: max-content
            font-size 0
            .img-item
              display inline-block
              margin-right .6rem
              &:last-child
                margin-right 0
      .seller-info
        padding 1.8rem
        .title
          margin-bottom .8rem
        .info
          padding 1.6rem 1.2rem
          border-top-1px(border-color)
</style>
