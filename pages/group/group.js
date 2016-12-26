//group.js
//获取应用实例
var app = getApp()
var util = require('../../utils/util.js')

Page({
  data: {
    latitude: "30.572269",
    longitude: "104.066541",
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
    scale: 4,
    toggleShow: false,
    
  },
  //事件处理函数
  changeFocus: function (event) {
    var that = this
    var index = event.target.dataset.key
    this.setData({
      latitude: that.data.allData.user[index].latitude,
      longitude: that.data.allData.user[index].longitude
    })
  },

  album: function () {
    wx.navigateTo({
      url: '/pages/album/album'
    })
  },

  toggle: function () {
    var that = this
    that.setData({
      toggleShow: !that.data.toggleShow,
    })
  },

  toggleClear: function () {
    var that = this
    that.setData({
      toggleShow: false,
    })
  },

  toPost: function () {
    wx.navigateTo ({
      url: '/pages/post/post',
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
    var session = wx.getStorageSync('session')

    wx.showModal({
      title: '退出小组',
      content: '确定退出当前小组吗？如果您是小组创建者，该组将直接解散。您上传的照片会出现在“我的相册”中。',
      success: function (res) {
        if (res.confirm) {
          wx.request({
            url: 'https://ebichu.cn/createAlbum/',
            data: {
              session: session,
              albumName: 'CNM',
            },
            method: 'POST',
            success: function (res) {
              console.log(res.data.status)
              that.dismissGroup()
              wx.redirectTo({
                url: '/pages/index/index'
              })
            }
          })
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
        clearInterval(that.getLocation)

        wx.showModal({
          title: '小组退出成功',
          content: '您可以重新创建组，或者在我的相册中查看历史照片。',
          success: function (res) {
            if (res.confirm) {

            }
          }
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
          if (!!a.data.isDismiss) {
            wx.redirectTo({
              url: '/pages/index/index'
            })
          }
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

  refreshIntime: null,
  getLocation: null,

  onLoad: function () {
    var that = this
    that.refresh()

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

    that.getLocation = setInterval(function () {
      wx.getLocation({
        type: 'wgs84',
        success: function (res) {
          that.setData({
            latitude: res.latitude,
            longitude: res.longitude
          })
        }
      })
    }, 8000)

    that.refreshIntime = setInterval(function () {
      var groupID = wx.getStorageSync('groupID')
      that.refresh()
    }, 7500)
  },

  onUnload: function () {
    var that = this
    clearInterval(that.refreshIntime)
    clearInterval(that.getLocation)
  },

  onHide: function () {
    var that = this
    clearInterval(that.refreshIntime)
    clearInterval(that.getLocation)
  },

  onShow: function () {
      var that = this
      that.getLocation = setInterval(function () {
      wx.getLocation({
        type: 'wgs84',
        success: function (res) {
          that.setData({
            latitude: res.latitude,
            longitude: res.longitude
          })
        }
      })
    }, 8000)

    that.refreshIntime = setInterval(function () {
      var groupID = wx.getStorageSync('groupID')
      that.refresh()
    }, 7500)
  }
})