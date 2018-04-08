<template>
  <div class="bulletin-title">
    <div class="line"></div>
    <div class="text cl-bold">{{ text }}</div>
    <div class="line"></div>
  </div>
</template>

<script>

export default {
  name: 'bulletin-title',
  props: {
    text: {
      type: String
    }
  }
}
</script>

<style lang="stylus" rel="stylesheet/stylus">
  @import "../../common/stylus/index"

  .bulletin-title
    display flex
    .line
      flex 1
      position relative
      &:after
        content ''
        display block
        position absolute
        top 50%
        width 100%
        height .1rem
        background-color rgba(255, 255, 255, .2)
    .text
      margin 0 1.2rem

</style>