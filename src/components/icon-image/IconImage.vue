<template>
  <span class="support-icon cl-display-inblock cl-vertical-mid"
    :class="[iconClassMap[type], {'large-size': largeSize, 'color-reverse': colorReverse}]"></span>
</template>

<script>
  export default {
    name: 'icon-image',
    props: {
      type: {
        type: Number
      },
      largeSize: {
        type: Boolean
      },
      colorReverse: {
        type: Boolean
      }
    },
    created () {
      this.iconClassMap = ['decrease', 'discount', 'special', 'invoice', 'guarantee']
    }
  }
</script>

<style lang="stylus" rel="stylesheet/stylus">
  @import '../../common/stylus/index'

  .support-icon
    width 1.2rem
    height 1.2rem
    background-size 1.2rem 1.2rem
    &.decrease
      bg-image('./img/decrease_1')
    &.discount
      bg-image('./img/discount_1')
    &.guarantee
      bg-image('./img/guarantee_1')
    &.invoice
      bg-image('./img/invoice_1')
    &.special
      bg-image('./img/special_1')
  .support-icon.large-size
    width 1.6rem
    height 1.6rem
    background-size 1.6rem 1.6rem
    &.decrease
      bg-image('./img/decrease_2')
    &.discount
      bg-image('./img/discount_2')
    &.guarantee
      bg-image('./img/guarantee_2')
    &.invoice
      bg-image('./img/invoice_2')
    &.special
      bg-image('./img/special_2')
  .support-icon.color-reverse
    &.decrease
      bg-image('./img/decrease_3')
    &.discount
      bg-image('./img/discount_3')
    &.guarantee
      bg-image('./img/guarantee_3')
    &.invoice
      bg-image('./img/invoice_3')
    &.special
      bg-image('./img/special_3')
  .support-icon.large-size.color-reverse
    &.decrease
      bg-image('./img/decrease_4')
    &.discount
      bg-image('./img/discount_4')
    &.guarantee
      bg-image('./img/guarantee_4')
    &.invoice
      bg-image('./img/invoice_4')
    &.special
      bg-image('./img/special_4')
</style>
