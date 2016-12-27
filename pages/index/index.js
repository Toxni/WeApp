//index.js
//获取应用实例
var app = getApp()
var util = require('../../utils/util.js')
var refreshIntime = null
var getLocation = null
var that

Page({
  data: {
    latitude: "30.572269",
    longitude: "104.066541",
    markers: [{
      desc: "很高兴见到大家",
      latitude: "30.572269",
      longitude: "104.066541",
      name: "Toxni.com"
    }],
    groupID: undefined,
    focus: true,
    scale: 4,
    userInfo: {}
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

  album: function () {
    wx.navigateTo({
      url: '/pages/album/album'
    })
  },

  creatConfirm: function () {
    that.refresh()
    wx.showModal({
      title: '创建小组',
      content: '确定创建位置共享小组吗？',
      success: function (res) {
        if (res.confirm) {
          that.creatGroup()
        }
      }
    })
  },

  creatGroup: function () {
    var session = wx.getStorageSync('session')

    wx.request({
      url: 'https://ebichu.cn/newGroup/',
      method: "POST",
      header: {
        'content-type': 'application/x-www-from-urlencoded'
      },
      data: {
        session: session,
        latitude: that.data.latitude,
        longitude: that.data.longitude,
      },
      success: function (a) {
        wx.setStorageSync('groupID', a.data.groupID)
        if (!!a.data.groupID) {
          that.setData({
            groupID: a.data.groupID
          })
          wx.showModal({
            title: '小组创建成功',
            content: '您的小组编号为 ' + a.data.groupID + ' 请让你的组员加入吧~',
            showCancel: false,
            success: function (res) {
              if (!!res.confirm) {
                wx.redirectTo({
                  url: '/pages/group/group',
                })
              }
            }
          })
        }
        else {
          that.setData({
            groupID: undefined
          })
          wx.showModal({
            title: '小组创建失败',
            content: 'Sorry, 服务器响应过慢，请稍后再试~',
            showCancel: false,
            success: function () {
              that.refresh()
            }
          })
        }
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

  addGroup: function (event) {
    var session = wx.getStorageSync('session')
    if (event.detail.value.length >= 5) {
      that.setData({
        focus: false
      })
      wx.getLocation({
        type: 'wgs84',
        success: function (location) {
          wx.request({
            url: 'https://ebichu.cn/joinGroup/',
            data: {
              groupID: event.detail.value,
              session: session,
              latitude: location.latitude,
              longitude: location.longitude,
            },
            method: 'POST',
            header: {
              'content-type': 'application/x-www-from-urlencoded'
            },
            success: function (res) {
              if (res.data.status == 'success') {
                wx.setStorageSync('groupID', event.detail.value)
                that.setData({
                  groupID: event.detail.value
                })
                // that.refresh()
                wx.redirectTo({
                  url: '/pages/group/group'
                })
              }
              if (res.data.reason == 'no group exist') {
                wx.showModal({
                  title: '提示',
                  content: '该组不存在哦~',
                  showCancel: false,
                })
              }
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
        fail: function (res) {
          wx.showModal({
            title: '定位失败',
            content: '请确定您的微信有获取定位权限',
            showCancel: false,
          })
        }
      })
    }
  },

  refresh: function () {
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
          if (!a.data.isDismiss && groupID) {
            wx.redirectTo({
              url: '/pages/group/group'
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

  onLoad: function () {
    that = this

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

    app.getUserInfo(function (userInfo) {
      that.setData({
        userInfo: userInfo
      })
    });
  },

  onUnload: function () {
    clearInterval(refreshIntime)
    clearInterval(getLocation)
    refreshIntime = null
    getLocation = null
  },

  onHide: function () {
    clearInterval(refreshIntime)
    clearInterval(getLocation)
    refreshIntime = null
    getLocation = null
  },

  onShow: function () {
    this.refresh();

    getLocation = setInterval(function () {
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

    refreshIntime = setInterval(function () {
      var groupID = wx.getStorageSync('groupID')
      that.refresh()
    }, 5000)
  }
})