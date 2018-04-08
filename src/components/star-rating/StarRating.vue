<template>
  <div class="star-container cl-display-inblock">
    <span class="star fa"
      v-for="item in starArray" :key="item.id"
      :class="{'on': item.ifOn, 'fa-star': !item.ifHalf, 'fa-star-half': item.ifHalf}"
      :style="starStyle"
    ></span>
  </div>
</template>

<script>
  const MAX_SCORE = 5

  export default {
    name: 'star-rating',
    props: {
      score: {
        type: Number
      },
      size: {
        type: Number
      }
    },
    computed: {
      starStyle () {
        return {
          'font-size': this.size / 10 + 'rem',
          'margin': '0 ' + this.size / 50 + 'rem'
        }
      },
      starArray () {
        let arr = []
        let score = Math.floor(this.score * 2) / 2
        let hasDecimal = (score % 1) !== 0
        let integer = Math.floor(score)
        for (let i = 0; i < integer; i++) {
          arr.push({
            ifOn: true,
            ifHalf: false
          })
        }
        if (hasDecimal) {
          arr.push({
            ifOn: true,
            ifHalf: true
          })
        }
        while (arr.length < MAX_SCORE) {
          arr.push({
            ifOn: false,
            ifHalf: false
          })
        }
        return arr
      }
    }
  }
</script>

<style lang="stylus" rel="stylesheet/stylus">
  @import '../../common/stylus/index'

  .star-container
    margin 0 auto
    .star
      color #ccc
      &.on
        color rgb(255, 153, 0)
      &:first-child
        margin-left 0 !important
      &:last-child
        margin-right 0 !important

</style>