Page({
  data: {
    items: []
  },

  onLoad: function (options) {
    that = this;

    albumId = options.albumId;
    that.requestAlbumDetail();
  },

  requestAlbumDetail: function () {
    wx.request({
      url: 'https://ebichu.cn/albumView/',
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
        that.bindData(s.image);
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