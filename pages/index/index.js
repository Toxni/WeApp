//index.js
//获取应用实例
var app = getApp()
var util = require('../../utils/util.js')

Page({
  data: {
    mapData: ["30", "104"],
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
    isInGroup: false,
    groupID: undefined,
    focus: true
  },
  //事件处理函数
  changeFocus: function (event) {
    var that = this
    that.refresh()
    var index = event.target.dataset.key
    this.setData({
      mapData: [
        that.data.allData.user[index].latitude, 
        that.data.allData.user[index].longitude
      ]
    })
  },

  login: function () {
    var that = this
    wx.showToast({
      title: '身份验证中...',
      icon: 'loading',
      duration: 400
    })
    wx.login({
      success: function (res) {
          wx.request({
            url: 'https://ebichu.cn/login/',
          method: "POST",
          header: {
            'content-type': 'application/x-www-from-urlencoded'
          },
          data: {
            code: res.code
          },
          success: function (a) {
            wx.setStorageSync('session', a.data.sessionKey)
            wx.setStorageSync('groupID', a.data.groupID)
            that.setData({
              isInGroup: !!a.data.groupID
            })
            that.refresh()
            wx.getUserInfo({
              success: function (b) {
                wx.request({
                  url: 'https://ebichu.cn/upload/',
                  method: "POST",
                  header: {
                    'content-type': 'application/x-www-from-urlencoded'
                  },
                  data: {
                    session: wx.getStorageSync('session'),
                    userInfo: b.userInfo
                  },
                })
              },
              fail: function (res) {
                wx.showModal({
                  title: '获取用户信息失败',
                  content: '获取用户信息失败',
                  showCancel: false,
                })
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
      fail: function (res) {
        wx.showModal({
          title: '身份验证失败',
          content: '请尝试重新进入小程序。',
          showCancel: false,
        })
      }
    })
  },

  creatConfirm: function () {
    var that = this
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
    var that = this
    var session = wx.getStorageSync('session')
    // wx.showToast({
    //   title: '定位中',
    //   icon: 'loading',
    //   duration: 1000
    // })
    wx.getLocation({
      type: 'wgs84',
      success: function (res) {
        wx.request({
          url: 'https://ebichu.cn/newGroup/',
          method: "POST",
          header: {
              'content-type': 'application/x-www-from-urlencoded'
          },
          data: {
            session: session,
            latitude: res.latitude,
            longitude: res.longitude,
          },
          success: function (a) {
            wx.setStorageSync('groupID', a.data.groupID)
            if (!!a.data.groupID) {
              that.setData({
                isInGroup: true,
              })
              that.refresh()
              wx.showModal({
                title: '小组创建成功',
                content: '您的小组编号为 ' + a.data.groupID + ' 请让你的组员加入吧~',
                showCancel: false,
              })
            }
            else {
              that.setData({
                isInGroup: false,
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
      fail: function (res) {
        wx.showModal({
          title: '定位失败',
          content: '请确定您的微信有获取定位权限',
          showCancel: false,
        })
      }
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

  addGroup: function (event) {
    var that = this
    var session = wx.getStorageSync('session')
    if (event.detail.value.length >= 5) {
      that.setData({
        focus: false
      })
      wx.showToast({
        title: '加载中',
        icon: 'loading',
        duration: 1000
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
                  isInGroup: true
                })
                that.refresh()
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
              isInGroup: false,
            })
        wx.showModal({
          title: '小组解散成功',
          content: '您可以点击下方按钮再次建立小组~',
          showCancel: false,
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
    wx.getLocation({
      type: 'wgs84',
      success: function (res) {
        that.setData({
          mapData: [res.latitude, res.longitude]
        })
        if (!!groupID) {
          wx.request({
            url: 'https://ebichu.cn/fresh/',
            method: "POST",
            header: {
              'content-type': 'application/x-www-from-urlencoded'
            },
            data: {
              session: session,
              latitude: res.latitude,
              longitude: res.longitude,
              groupID: groupID,
            },
            success: function (a) {
              if (a.data.status == 'fail') {
                wx.setStorageSync('groupID', null)
                that.setData({
                  isInGroup: false
                })
              } else {
                that.setData({
                  allData: a.data,
                  markers: util.getMarkers(a.data),
                  covers: util.getCovers(a.data),
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
        }
      },
      fail: function (res) {
        wx.showModal({
          title: '定位失败',
          content: '请确定您的微信有获取定位权限',
          showCancel: false,
        })
      }
    })
  },
  
  onLoad: function () {
    var that = this
    //调用应用实例的方法获取全局数据

    that.login()

    wx.getLocation({
      type: 'wgs84',
      success: function (res) {
        that.setData({
          mapData: [res.latitude, res.longitude],
          covers: [{
            iconPath: "../images/N0.png",
            latitude: res.latitude,
            longitude: res.longitude,
            rotate: 0
          }],
          markers: [{
            desc: "吃屎吧你",
            latitude: res.latitude,
            longitude: res.longitude,
            name: "Toxni.com"
          }],
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
    
    // setInterval(function () {
    //   var groupID = wx.getStorageSync('groupID')
    //   that.refresh()
    // }, 5000)
  },

  onReady: function() {
    var groupID = wx.getStorageSync('groupID')
    this.refresh()
  }
})