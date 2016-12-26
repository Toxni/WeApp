Page({
  data: {
    items: []
  },

  onLoad: function (options) {
    that = this;
    that.setData({
      items: DefaultData
    })

    albumId = options.albumId;
    that.requestAlbumDetail();
  },

  requestAlbumDetail: function () {
    wx.request({
      url: 'https://URL',
      method: 'POST',
      header: {
        'content-type': 'application/x-www-from-urlencoded'
      },
      data: {
        session: wx.getStorageSync('session'),
        albumID: albumId
      },
      success: function (s) {
        console.log(s);
        that.bindData(res.image);
      },
      fail: function (f) {
        console.log(f);
        that.requestFail();
      },
    })
  },

  bindData: function (itemData) {
    that.setData({
      items: itemData
    })
  },

  requestFail: function () {
    //请求数据失败
  }
});

var albumId;
var that;
var DefaultData = [
  {
    "time": "2016.12.26",
    "latitude": "东经143.56°",
    "longitude": "北纬43.45°",
    "image": "http://p4.image.hiapk.com/uploads/allimg/160914/7730-160914162257.jpg",
    "content": "哈哈哈，玩得很开心哦，在这里第一次见到雪"
  },
  {
    "time": "2016.12.29",
    "latitude": "东经146.56°",
    "longitude": "北纬42.45°",
    "image": "http://jiangsu.china.com.cn/uploadfile/2015/0726/1437876596537968.jpg",
    "content": "走在路上被一条叫做徐锐的狗咬了一口，我的天哪，赶紧回去打一针狂犬疫苗，好心情都没了"
  }
];