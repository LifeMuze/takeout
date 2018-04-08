<template>
  <div class="ratings-select">
    <div class="rating-type cl-clear-space">
      <div class="type-btn all" :class="{'active': selectedType === 2}" @click="selectType(2, $event)">
        <span class="text">{{ typeDesc.all }}</span><span class="num">{{ ratings.length }}</span>
      </div>
      <div class="type-btn positive" :class="{'active': selectedType === 0}" @click="selectType(0, $event)">
        <span class="text">{{ typeDesc.positive }}</span><span class="num">{{ positiveRatings.length }}</span>
      </div>
      <div class="type-btn negative" :class="{'active': selectedType === 1}" @click="selectType(1, $event)">
        <span class="text">{{ typeDesc.negative }}</span><span class="num">{{ negativeRatings.length }}</span>
      </div>
    </div>
    <div class="switch">
      <div class="cl-display-inblock" :class="{'on': onlyShowContent}" @click="toggleShowContent">
        <i class="icon icon-check_circle cl-vertical-mid"></i><span class="cl-text-sm cl-vertical-mid">只看有内容的评价</span>
      </div>
    </div>
  </div>
</template>

<script>
  const ALL = 2
  const POSITIVE = 0
  const NEGATIVE = 1

  export default {
    name: 'ratings-select',
    props: {
      ratings: {
        type: Array,
        default: () => []
      },
      typeDesc: {
        type: Object,
        default: {
          all: '全部',
          positive: '满意',
          negative: '不满意'
        }
      },
      defaultType: {
        type: Number,
        default: ALL
      },
      onlyContent: {
        type: Boolean,
        default: false
      }
    },
    data () {
      return {
        selectedType: this.defaultType,
        onlyShowContent: this.onlyContent
      }
    },
    computed: {
      positiveRatings: {
        get () {
          return this.ratings.filter((rating) => {
            return rating.rateType === POSITIVE
          })
        }
      },
      negativeRatings: {
        get () {
          return this.ratings.filter((rating) => {
            return rating.rateType === NEGATIVE
          })
        }
      }
    },
    methods: {
      selectType (type, e) {
        if (!e._constructed) return
        this.selectedType = type
        this.$emit('select-type', this.selectedType)
      },
      toggleShowContent (e) {
        if (!e._constructed) return
        this.onlyShowContent = !this.onlyShowContent
        this.$emit('toggle-showContent')
      }
    }
  }
</script>

<style lang="stylus" rel="stylesheet/stylus">
  @import '../../common/stylus/index'

  .ratings-select
    .rating-type
      padding-bottom 1.8rem
      border-bottom-1px(rgba(7, 17, 27, .1))
      .type-btn
        display inline-block
        padding .8rem 1.2rem
        margin-right .8rem
        .text
          font-size 1.2rem
          line-height 1.6rem
        .num
          margin-left .3rem
          font-size .8rem
      .all, .positive
        color rgb(77, 85, 93)
        background-color rgba(0, 160, 220 .2)
        &.active
          color #fff
          background-color rgb(0, 160, 220)
      .negative
        color rgb(77, 85, 93)
        background-color rgba(77, 85, 93, .2)
        &.active
          color #fff
          background-color #93999f
    .switch
      padding 1.2rem 0
      border-bottom 1px solid rgba(7, 17, 27, .1)
      color rgb(147, 153, 159)
      .on .icon
        color #00c850
      .icon
        font-size 2.4rem
      span
        margin-left .4rem
        line-height 2.4rem
</style>
