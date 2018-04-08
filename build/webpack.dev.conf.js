'use strict'
const utils = require('./utils')
const webpack = require('webpack')
const config = require('../config')
const merge = require('webpack-merge')
const path = require('path')
const baseWebpackConfig = require('./webpack.base.conf')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const FriendlyErrorsPlugin = require('friendly-errors-webpack-plugin')
const portfinder = require('portfinder')

// 自定义数据mock
const appData = require('../data.json')

var seller = appData.seller
var goods = appData.goods
var comments = appData.comments

const HOST = process.env.HOST
const PORT = process.env.PORT && Number(process.env.PORT)

const devWebpackConfig = merge(baseWebpackConfig, {
  module: {
    rules: utils.styleLoaders({ sourceMap: config.dev.cssSourceMap, usePostCSS: true })
  },
  // cheap-module-eval-source-map is faster for development
  devtool: config.dev.devtool,

  // these devServer options should be customized in /config/index.js
  devServer: {
    clientLogLevel: 'warning',  // none，error，warning或者info（默认值）
    historyApiFallback: {  // 当使用HTML5 History API时，任意的404响应都可能需要被替代为index.html
      rewrites: [
        { from: /.*/, to: path.join(config.dev.assetsPublicPath, 'index.html') },
      ],
    },
    hot: true,  // 启用webpack的模块热替换特性
    contentBase: false, // since we use CopyWebpackPlugin.告诉服务器从哪里提供内容。只有在你想要提供静态文件时才需要
    compress: true,  // 一切服务都启用gzip压缩
    host: HOST || config.dev.host,
    port: PORT || config.dev.port,
    open: config.dev.autoOpenBrowser,  // 当open启用时，服务器将打开浏览器
    overlay: config.dev.errorOverlay  // 当出现编译器错误或警告时，在浏览器中显示全屏叠加
      ? { warnings: false, errors: true }
      : false,
    publicPath: config.dev.assetsPublicPath,  // 此路径下的打包文件可在浏览器中访问。确保publicPath总是以斜杠（/）开头和结尾
    proxy: config.dev.proxyTable,  // 如果你有单独的后端开发服务器API，并且希望在同域名下发送API请求，那么代理某些URL将很有用
    quiet: true, // necessary for FriendlyErrorsPlugin 启用quiet后，除了初始启动信息之外的任何内容都不会被打印到控制台。这也意味着来自的WebPack的错误或警告在控制台不可见。
    watchOptions: { // 与监视文件相关的控制选项
      poll: config.dev.poll,
    },
    before(app) {  // 提供在服务器内部的所有其他中间件之前执行定制中间件的功能。这可以用来定义自定义处理程序
      app.get('/api/seller', (req, res) => {
        res.json({
          errno: 0,
          data: seller
        });
      });
      app.get('/api/goods', (req, res) => {
        res.json({
          errno: 0,
          data: goods
        });
      });
      app.get('/api/comments', (req, res) => {
        res.json({
          errno: 0,
          data: comments
        });
      });
    }
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env': require('../config/dev.env')
    }),
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NamedModulesPlugin(), // HMR shows correct file names in console on update.
    new webpack.NoEmitOnErrorsPlugin(),
    // https://github.com/ampedandwired/html-webpack-plugin
    new HtmlWebpackPlugin({
      filename: 'index.html',
      template: 'index.html',
      inject: true
    }),
    // copy custom static assets
    new CopyWebpackPlugin([
      {
        from: path.resolve(__dirname, '../static'),
        to: config.dev.assetsSubDirectory,
        ignore: ['.*']
      }
    ])
  ]
})

module.exports = new Promise((resolve, reject) => {
  portfinder.basePort = process.env.PORT || config.dev.port
  portfinder.getPort((err, port) => {
    if (err) {
      reject(err)
    } else {
      // publish the new Port, necessary for e2e tests
      process.env.PORT = port
      // add port to devServer config
      devWebpackConfig.devServer.port = port

      // Add FriendlyErrorsPlugin
      devWebpackConfig.plugins.push(new FriendlyErrorsPlugin({
        compilationSuccessInfo: {
          messages: [`Your application is running here: http://${devWebpackConfig.devServer.host}:${port}`],
        },
        onErrors: config.dev.notifyOnErrors
        ? utils.createNotifierCallback()
        : undefined
      }))

      resolve(devWebpackConfig)
    }
  })
})
