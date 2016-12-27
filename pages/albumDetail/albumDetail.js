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
        that.bindData(s.data.image);
      },
      fail: function (f) {
        console.log(f);
        that.requestFail();
      },
    })
  },

  bindData: function (itemData) {
    var i = 0;
    for (i; i < itemData.length; i++) {
      var content = itemData[i].content;
      itemData[i].content = decodeURI(content);
    }

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