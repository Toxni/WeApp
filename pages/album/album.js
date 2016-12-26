// pages/album/album.js
Page({
  data: {
    items: []
  },

  onLoad: function (options) {
    that = this;
    var session = wx.getStorageSync('session')
    wx.request({
      url: 'https://ebichu.cn/albumSet/',
      data: {
        session: session
      },
      method: 'POST',
      success: function (res) {
        if (res.data.status == 'fail') {
          wx.showModal({
            title: '哦嚯',
            content: '云端暂时还没有您的相片。',
            showCancel: false,
          })
        }
        else {
          that.setData({
            items: res.data.album
          })
        }
      }
    })
  },

  onItemClick: function (event) {
    var id = event.currentTarget.dataset.albumId;
    wx.navigateTo({
      url: Constant.Pages.ALBUM_DETAIL + "?albumId=" + id,
    })
  }
})

var that;
var Constant = require('../../utils/constant.js');