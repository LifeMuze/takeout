<template>
  <div class="goods">
    <!-- 左侧分类列表 -->
    <div class="menu-wrapper" ref="menuWrapper">
      <ul>
        <li class="goods-type-wrapper"
          v-for="(item, index) in goods"
          :key="index"
          :class="{'active': index === currentIndex}"
          @click="selectMenu(index, $event)"
        >
          <div class="goods-type cl-text-sm cl-lighter">
            <p class="text">
              <icon-image
                v-if="item.type > 0"
                :type="item.type"
                :largeSize="false"
                :colorReverse="true"
              />
              <span class="cl-vertical-mid">{{ item.name }}</span>
            </p>
          </div>
        </li>
      </ul>
    </div>

    <!-- 右侧商品列表 -->
    <div class="list-wrapper" ref="listWrapper">
      <ul>
        <li class="food-category food-category-hook" v-for="(cate, index) in goods" :key="index">
          <p class="food-title cl-text-sm">{{ cate.name }}</p>
          <ul class="food-list">
            <li class="food-item" v-for="(food, index) in cate.foods" :key="index" @click="selectFood(food, $event)">
              <div class="pic cl-display-inblock cl-mgRight-sm">
                <img :src="food.icon" width="55" height="55" alt="">
              </div>
              <div class="info cl-display-inblock">
                <p class="title">{{ food.name }}</p>
                <p class="desc" v-if="food.description">{{ food.description }}</p>
                <p class="sell-info">月售{{ food.sellCount }}份  好评率{{ food.rating }}%</p>
                <p class="price cl-clear-space">
                  <span class="cl-text-xs">￥</span>
                  <span class="now-price cl-text-default cl-bold">{{ food.price }}</span>
                  <span class="old-price cl-text-xs cl-bold" v-if="food.oldPrice">￥{{ food.oldPrice }}</span>
                </p>
              </div>
              <div class="add-food">
                <CountCtrl :food="food" />
              </div>
            </li>
          </ul>
        </li>
      </ul>
    </div>

    <!-- 商品详情 -->
    <FoodDetail :food="selectedFood" ref="foodDetail" />

    <!-- 购物车 -->
    <ShopCart
      :delivery-price="seller.deliveryPrice"
      :delivery-minprice="seller.minPrice"
      :selected-foods="selectedFoods"
      @empty="emptyShopcart"
    />
  </div>
</template>

<script>
  import IconImage from '../icon-image/IconImage'
  import BScroll from 'better-scroll'
  import ShopCart from '@/components/shopcart/ShopCart'
  import CountCtrl from '@/components/count-ctrl/CountCtrl'
  import FoodDetail from '@/components/food-detail/FoodDetail'

  const ERR_OK = 0

  export default {
    name: 'goods',
    props: {
      seller: {
        type: Object
      }
    },
    data () {
      return {
        goods: [],
        selectedFood: {},
        categoryListHeight: [],
        scrollY: 0
      }
    },
    computed: {
      selectedFoods: {
        get () {
          let arr = []
          this.goods.forEach(good => {
            good.foods.forEach(food => {
              if (food.count) {
                arr.push(food)
              }
            })
          })
          return arr
        },
        set (newValue) {}
      },
      currentIndex: {
        get () {
          let arr = this.categoryListHeight
          let length = arr.length
          let scrollY = this.scrollY
          for (let i = 0; i < length; i++) {
            let height = arr[i]
            let nextHeight = arr[i + 1]
            if (!nextHeight || (scrollY >= height && scrollY < nextHeight)) {
              return i
            }
          }
          return 0
        },
        set (newValue) {}
      }
    },
    created () {
      this.$http.get('/api/goods').then((res) => {
        res = res.body
        if (res.errno === ERR_OK) {
          this.goods = res.data
          this.$nextTick(() => {
            this._initScroll()
            this._calcHeight()
          })
        }
      })
    },
    methods: {
      selectMenu (index, e) {
        if (!e._constructed) return
        let foodCategoryList = this.$refs.listWrapper.querySelectorAll('.food-category-hook')
        let el = foodCategoryList[index]
        this.listScroll.scrollToElement(el, 300)
      },
      _initScroll () {
        this.menuScroll = new BScroll(this.$refs.menuWrapper, {
          click: true
        })
        this.listScroll = new BScroll(this.$refs.listWrapper, {
          click: true,
          probeType: 3
        })
        this.listScroll.on('scroll', (pos) => {
          this.scrollY = Math.abs(pos.y)
        })
      },
      _calcHeight () {
        let foodCategoryList = this.$refs.listWrapper.querySelectorAll('.food-category-hook')
        let height = 0
        this.categoryListHeight.push(height)
        let length = foodCategoryList.length
        for (let i = 0; i < length; i++) {
          let item = foodCategoryList[i]
          height += item.clientHeight
          this.categoryListHeight.push(height)
        }
      },
      selectFood (food, e) {
        if (!e._constructed) return
        this.selectedFood = food
        this.$refs.foodDetail.showDetail()
      },
      emptyShopcart () {
        this.selectedFoods.forEach(food => {
          food.count = 0
        })
      }
    },
    components: {
      IconImage,
      ShopCart,
      CountCtrl,
      FoodDetail
    }
  }
</script>

<style lang="stylus" rel="stylesheet/stylus">
  @import "../../common/stylus/index"
  @import "../../common/stylus/icon"

  .goods
    display flex
    height 100%
    padding-bottom 4.8rem
    overflow hidden
    .menu-wrapper
      flex 0 0 8rem
      width 8rem
      background-color #f3f5f7
      .goods-type-wrapper
        width 100%
        height 5.4rem
        color #666
        line-height 1.4rem
        &:not(:last-child) .goods-type
          border-bottom-1px(rgba(7, 17, 27, .2))
        &.active
          position relative
          height 5.6rem
          top -2px
          background-color #fff
          z-index 1
          .goods-type
            font-weight 700
            &:after
              display none
        .goods-type
          display table
          width 5.6rem
          height 100%
          margin 0 auto
          .text
            display table-cell
            vertical-align middle
    .list-wrapper
      flex 1
      .food-title
        position relative
        height 2.6rem
        padding-left 1.4rem
        background-color #f3f5f7
        color rgb(147, 153, 159)
        line-height 2.6rem
        &:before
          content ''
          display block
          position: absolute
          left 0
          top 0
          height 100%
          border-right .2rem solid #d9dde1
      .food-item
        display flex
        position relative
        margin 1.8rem 1.8rem 0 1.8rem
        padding-bottom 1.8rem
        &:not(:last-child)
          border-bottom-1px(rgba(7, 17, 27, .1))
        .pic
          flex 0 0 5.5rem
          width 5.5rem
          height 5.5rem
        .info
          flex 1
          .title
            margin-bottom .6rem
            color rgb(7, 17, 27)
            line-height 1.6rem
          .desc, .sell-info
            margin-bottom .6rem
            color rgb(147, 153, 159)
            font-size 1rem
            line-height 1.2rem
          .sell-info
            margin-bottom 0
            line-height 1.2rem
          .price
            color rgb(240,20,20)
            .now-price
              line-height 2.4rem
            .old-price
              margin-left .8rem
              color rgb(147, 153, 159)
              text-decoration line-through
        .add-food
          position absolute
          right 0
          bottom 1.5rem

</style>
