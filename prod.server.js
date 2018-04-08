var express = require('express')
var config = require('./config/index')

var port = process.env.PORT || config.build.port

var app = express()

var router = express.Router()

router.get('/', (req, res, next) => {
  req.url = '/index.html'
  next()
})
app.use(router)

// 定义接口路由
var appData = require('./data.json')
var seller = appData.seller;
var goods = appData.goods;
var comments = appData.comments;

var apiRoutes = express.Router();

apiRoutes.get('/seller', function (req, res) {
  res.json({
    errno: 0,
    data: seller
  });
});

apiRoutes.get('/goods', function (req, res) {
  res.json({
    errno: 0,
    data: goods
  });
});

apiRoutes.get('/comments', function (req, res) {
  res.json({
    errno: 0,
    data: comments
  });
});
app.use('/api', apiRoutes);

app.use(express.static('./dist'))

module.exports = app.listen(port, function (err) {
  if (err) {
    condole.log(err)
    return
  }
  console.log('Your application is running here: http://localhost:' + port + '\n')
})