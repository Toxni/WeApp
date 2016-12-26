// pages/album/album.js
Page({
  data: {
    items: []
  },

  onLoad: function (options) {
    that = this;
    that.setData({
      items: DefaultData
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
var DefaultData = [
  {
    "name": "峨眉山之行，特别哈皮",
    "id": "9527",
    "time": "上周三 12:56",
    "image": "http://p4.image.hiapk.com/uploads/allimg/160914/7730-160914162257.jpg"
  },
  {
    "name": "看银杏啦",
    "id": "7777",
    "time": "2016.12.25 12:56",
    "image": "http://jiangsu.china.com.cn/uploadfile/2015/0726/1437876596537968.jpg"
  },
  {
    "name": "峨眉山之行，特别哈皮",
    "id": "3434",
    "time": "12:56",
    "image": "http://p4.image.hiapk.com/uploads/allimg/160914/7730-160914162257.jpg"
  },
  {
    "name": "看银杏啦",
    "id": "5555",
    "time": "12:56",
    "image": "http://jiangsu.china.com.cn/uploadfile/2015/0726/1437876596537968.jpg"
  }
];