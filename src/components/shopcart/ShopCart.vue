<template>
  <div class="shopcart">
    <!-- 购物车左侧 -->
    <div class="content-left" @click="foldList">
      <div class="logo-wrapper cl-display-inblock">
        <div class="logo cl-center" :class="{'hasSelected': totalCount > 0}">
          <span class="icon icon-shopping_cart cl-text-xl"></span>
          <transition name="drop"
            @before-leave="beforeDrop"
            @leave="drop"
            @after-leave="afterDrop">
            <div class="ball-container" v-show="ballShow" :style="ballContainerStyle" ref="ball">
              <div class="ball" :style="ballStyle"></div>
            </div>
          </transition>
        </div>
        <div class="num cl-center cl-bold" v-show="totalCount > 0">{{ totalCount }}</div>
      </div>
      <div class="price-info cl-display-inblock">
        <div class="price cl-display-inblock cl-bold cl-text-default" :class="{'highlight': totalPrice > 0}">￥{{ totalPrice }}</div>
        <div class="send-price cl-display-inblock cl-text-sm">另需配送费￥{{ deliveryPrice }}元</div>
      </div>
    </div>
    <!-- 购物车右侧 -->
    <div class="content-right cl-text-default cl-bold cl-center"
      :class="{'go-pay': totalPrice >= deliveryMinprice}"
      @click="pay"
    >
      <span v-if="totalPrice === 0">￥{{ deliveryMinprice }}起送</span>
      <span v-if="totalPrice && totalPrice < deliveryMinprice">还差￥{{ deliveryMinprice - totalPrice }}起送</span>
      <span v-if="totalPrice >= deliveryMinprice">去结算</span>
    </div>
    <!-- 遮罩 -->
    <transition name="fade">
      <div class="list-bg" v-show="listShow" @click="unfoldList"></div>
    </transition>
    <!-- 购物车展开列表 -->
    <transition name="fold">
      <div class="shopcart-list" v-show="listShow">
        <div class="list-header">
          <div class="cl-cf">
            <h3 class="cl-fl cl-text-default cl-lighter">购物车</h3>
            <span class="empty cl-fr cl-text-sm" @click="empty">清空</span>
          </div>
        </div>
        <div class="list-content" ref="listContent">
          <ul>
            <li class="list-item cl-display-block" v-for="(food, index) in selectedFoods" :key="index">
              <div class="inner cl-cf">
                <p class="name cl-fl">{{ food.name }}</p>
                <div class="cl-fr cl-clear-space">
                  <span class="food-price cl-vertical-mid">￥<span class="cl-text-default">{{ food.price * food.count }}</span></span>
                  <div class="count-ctrl-container cl-display-inblock">
                    <CountCtrl :food="food" @judgeIfClose="_judgeIfCloseList" />
                  </div>
                </div>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
  import Bus from '../../bus'
  import CountCtrl from '@/components/count-ctrl/CountCtrl'
  import BScroll from 'better-scroll'

  export default {
    name: 'shop-cart',
    props: {
      deliveryPrice: {
        type: Number,
        default: 0
      },
      deliveryMinprice: {
        type: Number,
        default: 0
      },
      selectedFoods: {
        type: Array,
        default () {
          return [{
            price: 15,
            count: 1
          }]
        }
      }
    },
    data () {
      return {
        ballShow: true,
        ballPosition: {},
        ballContainerStyle: {},
        ballStyle: {},
        listShow: false
      }
    },
    computed: {
      totalPrice () {
        let tmpPrice = 0
        this.selectedFoods.forEach((food) => {
          tmpPrice += food.price * food.count
        })
        return tmpPrice
      },
      totalCount () {
        let tmpCount = 0
        this.selectedFoods.forEach((food) => {
          tmpCount += food.count
        })
        return tmpCount
      }
    },
    mounted () {
      let position = this.$refs.ball.getBoundingClientRect()
      this.ballPosition = {
        left: position.left,
        top: position.top
      }
      // 监听添加事件，触发小球动画
      Bus.bus.$on('add-food', target => {
        this._drop(target)
      })
    },
    methods: {
      _drop (target) {
        // let position = this.$refs.ball.getBoundingClientRect()
        // let left = position.left
        // let top = position.top
        let left = this.ballPosition.left
        let top = this.ballPosition.top

        let targetPosition = target.getBoundingClientRect()
        let targetLeft = targetPosition.left
        let targetTop = targetPosition.top

        let x = targetLeft - left + 7
        let y = -(top - targetTop - 7)
        this.ballContainerStyle = {
          transform: `translate3d(${x}px, 0, 0)`,
          opacity: 1
        }
        this.ballStyle = {
          transform: `translate3d(0, ${y}px, 0)`
        }
        this.$nextTick(() => {
          setTimeout(() => {
            this.ballShow = false
          }, 50)
        })
      },
      beforeDrop (el) {},
      drop (el) {
        // DOM更新后执行
        this.$nextTick(() => {
          this.ballContainerStyle = {
            transition: 'transform .3s linear',
            transform: 'translate3d(0, 0, 0)',
            opacity: 1
          }
          this.ballStyle = {
            transition: 'transform .3s cubic-bezier(.52,-0.42,.83,.67)',
            transform: 'translate3d(0, 0, 0)'
          }
        })
      },
      afterDrop (el) {
        this.$nextTick(() => {
          this.ballContainerStyle = {}
          this.ballStyle = {}
          this.ballShow = true
        })
      },
      foldList () {
        if (!this.listShow) {
          if (!this.totalCount) return
          this.listShow = true
          this.$nextTick(() => {
            if (!this.scroll) {
              this.scroll = new BScroll(this.$refs.listContent, {
                click: true
              })
            } else {
              this.scroll.refresh()
            }
          })
        } else {
          this.unfoldList()
        }
      },
      unfoldList () {
        this.listShow = false
      },
      empty () {
        this.$emit('empty')
        this.$nextTick(() => {
          this._judgeIfCloseList()
        })
      },
      _judgeIfCloseList () {
        if (!this.totalCount) {
          this.listShow = false
        }
      },
      pay () {
        if (this.totalPrice < this.deliveryMinprice) return
        window.alert(`支付${this.totalPrice}？`)
      }
    },
    components: {
      CountCtrl
    }
  }
</script>

<style lang="stylus" rel="stylesheet/stylus">
  @import '../../common/stylus/index'

  .shopcart
    display flex
    position fixed
    bottom 0
    width 100%
    height 4.8rem
    color rgba(255, 255, 255, .4)
    .content-left
      flex 1
      background-color #141d27
      font-size 0
      .logo-wrapper
        position relative
        top -1rem
        width 5.6rem
        height 5.6rem
        margin-left 1.2rem
        margin-right 1.2rem
        padding .6rem
        border-radius 50%
        background-color #141d27
        .logo
          border-radius 50%
          background-color #2b2c3c
          .icon
            line-height 4.4rem
          .ball-container
            position fixed
            left 3.2rem
            bottom 2.2rem
            opacity 0
            .ball
              width 1.6rem
              height 1.6rem
              background-color rgb(0, 160, 220)
              border-radius 50%
        .logo.hasSelected
          background-color rgb(0, 160, 220)
          .icon
            color #fff
        .num
          position absolute
          right 0
          top 0
          width 2.4rem
          height 1.6rem
          padding 0 .6rem
          color #fff
          font-size .9rem
          line-height 1.6rem
          border-radius .8rem
          background-color rgb(240, 20, 20)
          box-shadow 0 .2rem .2rem rgba(0, 0, 0, .4)
      .price-info
        vertical-align top
        padding-top 1.2rem
        font-size 0
        .price
          margin-right 1.2rem
          padding-right 1.2rem
          border-right 1px solid rgba(255, 255, 255, .1)
          line-height 2.4rem
          &.highlight
            color: #fff
    .content-right
      flex 0 0 10.5rem
      width 10.5rem
      padding .8rem
      background-color #2b2c3c
      line-height 3.2rem
      &.go-pay
        background-color #00b43c
        color #fff
    .shopcart-list
      position fixed
      left 0
      right 0
      bottom 4.8rem
      color rgb(7, 17, 27)
      z-index -1
      .list-header
        padding 0 1.8rem
        background-color #f3f5f7
        line-height 4rem
        border-bottom-1px(rgba(7, 17, 27, .1))
        .empty
          color rgb(0, 160, 220)
      .list-content
        max-height 19.2rem
        background-color #fff
        overflow hidden
        .list-item
          padding 0 1.8rem
          .inner
            height 4.8rem
            border-bottom-1px(rgba(7, 17, 27, .1))
            .name
              line-height 4.8rem
            .food-price
              margin-right .9rem
              color rgb(240, 0, 20)
              font-size 1rem
            .count-ctrl-container
              padding-top .9rem
    .list-bg
      position fixed
      left 0
      right 0
      top 0
      bottom 4.8rem
      background-color rgba(7, 17, 27, .6)
      filter blur(10px)
      z-index -1
    .fold-enter,
    .fold-leave-to
      transform translateY(100%)
    .fold-enter-active,
    .fold-leave-active
      transition transform .3s

</style>