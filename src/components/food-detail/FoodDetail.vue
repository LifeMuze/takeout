<template>
  <transition name="right-in">
    <div v-show="ifShowDetail" class="food-detail-wrapper" ref="detailWrapper">
      <div class="food-detail">
        <div class="back" @click="hideDetail">
          <i class="icon-arrow_lift icon cl-display-inblock"></i>
        </div>
        <div class="banner">
          <img :src="food.image" width="100%">
        </div>
        <div class="food-info section-container">
          <h3 class="food-name cl-bold">{{ food.name }}</h3>
          <p class="sell-info cl-text-xs">月售{{ food.sellCount }}份  好评率{{ food.rating }}%</p>
          <p class="price cl-clear-space">
            <span class="cl-text-xs">￥</span>
            <span class="now-price cl-text-default cl-bold">{{ food.price }}</span>
            <span class="old-price cl-text-xs cl-bold" v-if="food.oldPrice">￥{{ food.oldPrice }}</span>
          </p>
          <transition name="fade">
            <div v-show="!food.count" class="add-food cl-text-xs add-btn" @click="addToCart">添加购物车</div>
          </transition>
          <div class="add-food" v-show="food.count > 0">
            <CountCtrl :food="food" />
          </div>
        </div>
        <Splitter />
        <div class="food-desc section-container">
          <h4 class="title">商品介绍</h4>
          <p v-show="food.info" class="desc-info cl-text-sm cl-lighter">{{ food.info }}</p>
          <p v-show="!food.info" class="desc-info cl-text-sm cl-lighter">暂无</p>
        </div>
        <Splitter />
        <div class="food-rating section-container">
          <h4 class="title">商品评价</h4>
          <RatingsSelect
            :ratings="food.ratings"
            :type-desc="ratingsOption.typeDesc"
            :default-type="ratingsOption.defaultType"
            :only-content="onlyContent"
            @select-type="selectType"
            @toggle-showContent="toggleShowContent"
          />
          <div class="rating-list">
            <ul v-show="food.ratings && food.ratings.length > 0">
              <li class="rating-item"
                v-for="(rating, index) in food.ratings" :key="index"
                v-show="ifShowRating(rating.rateType, rating.text)"
              >
                <div class="cl-cf rating-info">
                  <div class="cl-fl cl-clear-space">
                    <span class="rate-time cl-text-xs">{{ rating.rateTime | formatTime }}</span>
                  </div>
                  <div class="cl-fr cl-clear-space">
                    <span class="user-name cl-text-xs cl-vertical-mid">{{ rating.username }}</span>
                    <img class="user-avatar cl-vertical-mid" :src="rating.avatar" width="12" height="12"></img>
                  </div>
                </div>
                <p class="rating-text cl-clear-space">
                  <i class="cl-text-sm" :class="{'icon-thumb_up': !rating.rateType, 'icon-thumb_down': rating.rateType}"></i>
                  <span class="cl-text-sm">{{ rating.text }}</span>
                </p>
              </li>
            </ul>
            <div class="no-rating cl-text-sm" v-show="!food.rating || !food.ratings.length">暂无评论</div>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
  import Bus from '../../bus'
  import BScroll from 'better-scroll'
  import {formatDate} from '@/common/js/formatDate'
  import CountCtrl from '@/components/count-ctrl/CountCtrl'
  import Splitter from '@/components/splitter/Splitter'
  import RatingsSelect from '@/components/ratings-select/RatingsSelect'

  const ALL = 2
  // const POSITIVE = 0
  // const NEGATIVE = 1

  export default {
    name: 'food-detail',
    props: {
      food: Object
    },
    data () {
      return {
        ifShowDetail: false,
        ratingsOption: {
          typeDesc: {
            all: '全部',
            positive: '推荐',
            negative: '吐槽'
          },
          defaultType: ALL
        },
        onlyContent: false,
        selectedType: ALL
      }
    },
    methods: {
      showDetail () {
        this.ifShowDetail = true
        this.$nextTick(() => {
          if (!this.scroll) {
            this.scroll = new BScroll(this.$refs.detailWrapper, {
              click: true
            })
          } else {
            this.scroll.refresh()
          }
        })
      },
      hideDetail () {
        this.ifShowDetail = false
      },
      addToCart (e) {
        if (!e._constructed) return
        this.$set(this.food, 'count', 1)
        // 派发添加购物车事件，在shopcart中监听
        Bus.bus.$emit('add-food', e.target)
      },
      toggleShowContent () {
        this.onlyContent = !this.onlyContent
        // this.$nextTick(() => {
        //   this.scroll.refresh()
        // })
      },
      selectType (type) {
        this.selectedType = type
        // this.$nextTick(() => {
        //   this.scroll.refresh()
        // })
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
      CountCtrl,
      Splitter,
      RatingsSelect
    }
  }
</script>

<style lang="stylus" rel="stylesheet/stylus">
  @import '../../common/stylus/index'

  .food-detail-wrapper
    position fixed
    left 0
    right 0
    top 0
    bottom 4.8rem
    background #fff
    .back
      position absolute
      left 0
      top 0
      color #fff
      z-index 1
      &:hover
        background-color rgba(0, 0, 0, .3)
      .icon
        padding 1.6rem
    .section-container
      padding 1.8rem
      .title
        margin-bottom .6rem
        line-height 1.6rem
    .food-info
      position relative
      .food-name
        margin-bottom .8rem
        line-height 1.6rem
        color rgb(7, 17, 27)
      .sell-info
        margin-bottom 1.8rem
        line-height 1.2rem
        color rgb(147, 153, 159)
      .price
        .now-price
          line-height 2.4rem
          color rgb(240, 20, 20)
        .old-price
          margin-left .8rem
          color rgb(147, 153, 159)
          text-decoration line-through
      .add-food
        position absolute
        right 1.8rem
        bottom 1.8rem
        &.add-btn
          padding 0 1.2rem
          background-color rgb(0, 160, 220)
          border-radius 1.2rem
          line-height 2.4rem
          color #fff
          &:hover
            background-color #0a8cbd
    .food-desc
      .desc-info
        padding 0 .8rem
        color rgb(77, 85, 93)
        line-height 2.4rem
    .food-rating
      .title
        margin-bottom 1.8rem
      .rating-list
        .rating-item
          padding 1.6rem 0
          border-bottom-1px(rgba(7, 17, 27, .1))
          .rating-info
            margin-bottom .6rem
            color rgb(147, 153, 159)
          .rate-time
            line-height 1.2rem
          .user-name
            margin-right .6rem
          .rating-text
            i
              margin-right .4rem
              line-height 2.4rem
              color rgb(147, 153, 159)
              &.icon-thumb_up
                color rgb(0, 160, 220)
            span
              color rgb(7, 17, 27)
        .no-rating
          padding 1.6rem 0
          color #93999f
  .right-in-enter,
  .right-in-leave-to
    transform translateX(100%)
  .right-in-enter-active,
  .right-in-leave-active
    transfrom translateX(0)
    transition transform .3s

</style>