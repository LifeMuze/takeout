<template>
  <header class="header">
    <div class="header-bg">
      <img :src="seller.avatar" alt="" width="100%">
    </div>
    <div class="info-wrapper">
      <div class="avatar cl-mgRight">
        <img :src="seller.avatar" alt="" width="64" height="64">
      </div>
      <div class="info">
        <div class="title cl-bold cl-clear-space">
          <span class="brand cl-display-inblock cl-vertical-mid"></span>
          <span class="name cl-display-inblock cl-text-md cl-vertical-mid">{{seller.name}}</span>
        </div>
        <div class="desc cl-text-sm cl-lighter">
          {{seller.description}}/{{seller.deliveryTime}}分钟送达
        </div>
        <div v-if="seller.supports" class="support cl-mgTop-sm cl-lighter cl-clear-space">
          <icon-image
            :type="seller.supports[0].type"
            :largeSize="false"
            :colorReverse="false"
          />
          <span class="text cl-display-inblock cl-text-sm cl-vertical-mid">{{seller.supports[0].description}}</span>
          <div class="detail cl-fr" @click="showBulletinDetail">
            <span class="count cl-display-inblock cl-vertical-mid cl-text-sm">{{seller.supports.length}}个</span>
            <i class="icon-keyboard_arrow_right cl-display-inblock cl-vertical-mid cl-text-sm"></i>
          </div>
        </div>
      </div>
    </div>
    <div class="bulletin-wrapper cl-clear-space" @click="showBulletinDetail">
      <span class="bulletin-icon cl-display-inblock"></span>
      <span class="bulletin-txt cl-display-inblock cl-text-sm cl-text-truncate">{{seller.bulletin}}</span>
      <i class="bulletin-detail icon-keyboard_arrow_right cl-display-inblock cl-text-sm"></i>
    </div>
    <!-- 弹出层 -->
    <transition name="fade">
      <div class="bulletin-detail-drop" v-show="ifBulletinDetailShow">
        <div class="drop-bg"></div>
        <!-- 弹出层内容区域 -->
        <div class="drop-content">
          <p class="name cl-text-md cl-center cl-bold cl-mgBottom">{{seller.name}}</p>
          <div class="grade cl-center">
            <star-rating
              :score="seller.score"
              :size="24"
            />
          </div>
          <!-- 优惠信息 -->
          <div class="title-container">
            <bulletin-title
              :text="bulletinTitle[0]"
            />
          </div>
          <div class="content-container">
            <ul v-if="seller.supports" class="supports">
              <li class="support-item" v-for="(item, index) in seller.supports" :key="index">
                <icon-image
                  :type="item.type"
                  :largeSize="true"
                  :colorReverse="false"
                />
                <span class="text cl-display-inblock cl-text-sm cl-vertical-mid cl-lighter">{{item.description}}</span>
              </li>
            </ul>
          </div>
          <!-- 商家公告 -->
          <div class="title-container">
            <bulletin-title
              :text="bulletinTitle[1]"
            />
          </div>
          <div class="content-container">
            <p class="text cl-text-sm cl-lighter">{{ seller.bulletin }}</p>
          </div>
        </div>
        <div class="drop-close cl-center">
          <i class="icon-close cl-text-xxl" @click="hideBulletinDetail"></i>
        </div>
      </div>
    </transition>
  </header>
</template>

<script>
  import StarRating from '../star-rating/StarRating'
  import BulletinTitle from '../bulletin-title/BulletinTitle'
  import IconImage from '../icon-image/IconImage'

  export default {
    name: 'v-header',
    props: {
      seller: {
        type: Object,
        default: {}
      }
    },
    data () {
      return {
        ifBulletinDetailShow: false,
        bulletinTitle: ['优惠信息', '商家公告']
      }
    },
    created () {
      this.iconClassMap = ['decrease', 'discount', 'special', 'invoice', 'guarantee']
    },
    methods: {
      showBulletinDetail: function () {
        this.ifBulletinDetailShow = true
      },
      hideBulletinDetail: function () {
        this.ifBulletinDetailShow = false
      }
    },
    components: {
      StarRating,
      BulletinTitle,
      IconImage
    }
  }
</script>

<style lang="stylus" rel="stylesheet/stylus">
  @import '../../common/stylus/index'

  .header
    position relative
    color #fff
    .header-bg
      position absolute
      left 0
      top 0
      right 0
      bottom 0
      filter blur(5px)
      overflow hidden
      z-index -1
      & > img
        position relative
        top: 50%;
        transform: translateY(-50%);
    .info-wrapper
      display flex
      padding 2.4rem 1.2rem 1.8rem 2.4rem
      background-color rgba(7, 17, 27, .5)
      .avatar
        flex 0 0 6.4rem
        width 6.4rem
        height 6.4rem
        border-radius .2rem
        overflow hidden
      .info
        flex 1
        padding .2rem 0
        .title
          height 1.8rem
          .brand
            width 3rem
            height 1.8rem
            bg-image('./img/brand')
            background-size 3rem 1.8rem
          .name
            height 1.8rem
            margin-left .6rem
            line-height 1.8rem
        .desc
          margin-top .8rem
          line-height 1.2rem
        .support
          position relative
          .text
            margin-left .4rem
            line-height 1.2rem
          .detail
            position absolute
            top -0.7rem
            right 0
            padding .7rem .8rem
            background-color rgba(0, 0, 0, .2)
            border-radius 1.4rem
            .count
              margin-right .2rem
              line-height 1.2rem
            & > i
              line-height 1.2rem
    .bulletin-wrapper
      position relative
      padding .8rem 1.2rem
      background-color rgba(7, 17, 27 .2)
      .bulletin-icon
        width 2.2rem
        height 1.2rem
        bg-image('./img/bulletin')
        background-size 2.2rem 1.2rem
      .bulletin-txt
        max-width calc(100% - 4.2rem)
        margin-left .4rem
        line-height 1.2rem
      .bulletin-detail
        position absolute
        right 1.2rem
    .bulletin-detail-drop
      position fixed
      left 0
      right 0
      top 0
      bottom 0
      overflow auto
      z-index 1
      .drop-bg
        position absolute
        left 0
        right 0
        top 0
        bottom 0
        background-color rgba(7, 17, 27, .8)
        filter blur(10px)
        z-index -1
      .drop-content
        position relative
        min-height 100%
        padding 6.4rem 3.6rem 6.4rem
        .name
          line-height 1.6rem
        .grade
          margin 0 auto
        .title-container
          margin-top 2.8rem
          margin-bottom 2.4rem
        .content-container
          padding 0 1.2rem
          .supports
            .support-item
              height 1.6rem
              margin-bottom 1.2rem
              &:last-child
                margin-bottom 0
              .text
                line-height 1.6rem
          .text
            line-height 2.4rem
      .drop-close
        position relative
        height 6.4rem
        margin-top -6.4rem
        padding-bottom 3.2rem
        & > i
          color rgba(255, 255, 255, .5)
</style>
