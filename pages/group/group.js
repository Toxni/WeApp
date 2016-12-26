//index.js
//获取应用实例
var app = getApp()
var util = require('../../utils/util.js')

Page({
  data: {
    allData: {},
    covers: [{
      iconPath: "../images/N0.png",
      latitude: "30.572269",
      longitude: "104.066541",
      rotate: 0
    }],
    markers: [{
      desc: "很高兴见到大家",
      latitude: "30.572269",
      longitude: "104.066541",
      name: "Toxni.com"
    }],
    groupID: undefined,
    scale: 18
  },
  //事件处理函数
  changeFocus: function (event) {
    var that = this
    that.refresh()
    var index = event.target.dataset.key
    this.setData({
      latitude: that.data.allData.user[index].latitude, 
      longitude: that.data.allData.user[index].longitude
    })
  },

  addMarkerMsg: function (event) {
    var that = this
    var session = wx.getStorageSync('session')
    wx.request({
      url: 'https://ebichu.cn/changeState/',
      data: {
        session: session,
        state: event.detail.value,
      },
      method: 'POST',
      header: {
        'content-type': 'application/x-www-from-urlencoded'
      },
      success: function (res) {
        that.refresh()
        wx.showToast({
          title: '修改成功',
          icon: 'success',
          duration: 1000
        })
      },
    })
  },

  dismissConfirm: function () {
    var that = this
    wx.showModal({
      title: '解散小组',
      content: '确定解散当前小组吗？',
      success: function (res) {
        if (res.confirm) {
          that.dismissGroup()
        }
      }
    })
  },

  dismissGroup: function () {
    var that = this
    var session = wx.getStorageSync('session')
    var groupID = wx.getStorageSync('groupID')

    wx.request({
      url: 'https://ebichu.cn/dismiss/',
      method: "POST",
      header: {
        'content-type': 'application/x-www-from-urlencoded'
      },
      data: {
        session: session,
        groupID: groupID,
      },
      success: function (a) {
        that.setData({
          allData: {},
          groupID: undefined,
        })
        wx.showModal({
          title: '小组解散成功',
          content: '您可以点击下方按钮再次建立小组~',
          showCancel: false,
        })
        wx.redirectTo({
          url: '/pages/index/index'
        })
      },
      fail: function (res) {
        wx.showModal({
          title: '网络请求失败',
          content: '请检查您的网络连接设置',
          showCancel: false,
        })
      }
    })
  },

  refresh: function () {
    var that = this
    var session = wx.getStorageSync('session')
    var groupID = wx.getStorageSync('groupID')
    if (!!groupID) {
      wx.request({
        url: 'https://ebichu.cn/fresh/',
        method: "POST",
        header: {
          'content-type': 'application/x-www-from-urlencoded'
        },
        data: {
          session: session,
          latitude: that.data.latitude,
          longitude: that.data.longitude,
          groupID: groupID,
        },
        success: function (a) {
          if (a.data.status == 'fail') {
            wx.setStorageSync('groupID', null)
            that.setData({
              groupID: undefined
            })
          } else {
            that.setData({
              allData: a.data,
              markers: util.getMarkers(a.data),
              covers: util.getCovers(a.data),
            })
          }
        },
        fail: function () {
          wx.showModal({
            title: '网络请求失败',
            content: '请检查您的网络连接设置',
            showCancel: false,
          })
        }
      })
    }
  },

  onLoad: function () {
    var that = this
    var groupID = wx.getStorageSync('groupID')
    that.setData({
      groupID: groupID,
    })

    wx.getLocation({
      type: 'wgs84',
      success: function (res) {
        that.setData({
          latitude: res.latitude,
          longitude: res.longitude,
        })
      },
      fail: function () {
        wx.showModal({
          title: '定时刷新失败',
          content: '请确定您的微信有获取定位权限',
          showCancel: false,
        })
      }
    })
    setInterval(function () {
      wx.getLocation({
        type: 'wgs84',
        success: function(res){
          that.setData({
            latitude: res.latitude,
            longitude: res.longitude
          })
        }
      })
    }, 8000)
    
    setInterval(function () {
      var groupID = wx.getStorageSync('groupID')
      that.refresh()
    }, 5000)
  },

  onReady: function() {
    var groupID = wx.getStorageSync('groupID')
    this.refresh()
  }
})