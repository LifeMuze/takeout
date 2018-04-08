<template>
  <div id="app">
    <!-- header -->
    <TheHeader :seller="seller" />
    <!-- nav -->
    <nav class="tab">
      <div class="tab-item">
        <router-link to="/goods">商品</router-link>
      </div>
      <div class="tab-item">
        <router-link to="/comments">评论</router-link>
      </div>
      <div class="tab-item">
        <router-link to="/seller">商家</router-link>
      </div>
    </nav>
    <!-- body -->
    <section class="content">
      <keep-alive>
        <router-view :seller="seller"></router-view>
      </keep-alive>
    </section>
  </div>
</template>

<script>
  import TheHeader from '@/components/header/TheHeader'
  import {urlParse} from './common/js/util'

  const ERR_OK = 0

  export default {
    name: 'app',
    data () {
      return {
        seller: {
          id: (() => {
            let queryParam = urlParse()
            return queryParam.id
          })()
        }
      }
    },
    created () {
      this.$http.get('/api/seller?id=' + this.seller.id).then((res) => {
        res = res.body
        if (res.errno === ERR_OK) {
          this.seller = Object.assign({}, this.seller, res.data)
        }
      }, (res) => {

      })
    },
    components: {
      TheHeader
    }
  }
</script>

<style lang="stylus" rel="stylesheet/stylus">
  @import "./common/stylus/index"

  #app
    position relative
    height 100%
    color rgb(7, 17, 27)
    .tab
      display flex
      height 40px
      line-height 40px
      border-bottom-1px(rgba(7, 17, 27, .1))

      .tab-item
        flex 1
        text-align center

        & > a
          display block
          font-size 14px
          color rgb(77, 85, 93)
          &.active
            color rgb(240, 20, 20)
    .content
      position absolute
      top 17.4rem
      bottom 0
      width 100%
</style>
