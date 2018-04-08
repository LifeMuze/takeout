<template>
  <div class="count-ctrl cl-clear-space">
    <transition name="move-right">
      <span class="cl-display-inblock" v-show="food.count > 0">
        <i class="icon-remove_circle_outline roll cl-text-xl cl-vertical-mid" @click="reduce"></i>
      </span>
    </transition>
    <span class="qty-wrapper cl-display-inblock cl-center">
      <transition name="fade">
        <span class="qty cl-vertical-mid cl-text-default" v-show="food.count > 0">{{ food.count }}</span>
      </transition>
    </span>
    <i class="icon-add_circle cl-text-xl cl-vertical-mid" @click="increase"></i>
  </div>
</template>

<script>
  import Bus from '../../bus'

  export default {
    name: 'count-ctrl',
    props: {
      food: {
        type: Object
      }
    },
    methods: {
      reduce (e) {
        e.stopPropagation()
        if (!e._constructed) return
        this.food.count --
        if (this.food.count < 0) this.food.count = 0
        this.$emit('judgeIfClose')
      },
      increase (e) {
        e.stopPropagation()
        if (!e._constructed) return
        if (!this.food.count) {
          this.$set(this.food, 'count', 1)
        } else {
          this.food.count ++
        }
        // 派发添加购物车事件，在shopcart中监听
        Bus.bus.$emit('add-food', e.target)
      }
    }
  }
</script>

<style lang="stylus" rel="stylesheet/stylus">
  @import "../../common/stylus/index"

  .count-ctrl
    i
      display inline-block
      padding .3rem
      color rgb(0, 160, 220)
    .qty-wrapper
      width 1.6rem
      .qty
        color rgb(147, 153, 159)
    .move-right-enter,
    .move-right-leave-to
      opacity 0
      transform translateX(1.6rem)
    .move-right-enter-active,
    .move-right-leave-active
      transition all .5s
    .move-right-enter .roll,
    .move-right-leave-to .roll
        transform rotateZ(50deg)
    .move-right-enter-active .roll,
    .move-right-leave-active .roll
        transition transform .5s
</style>