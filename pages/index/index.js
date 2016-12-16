//index.js
//获取应用实例
var app = getApp()
var util = require('../../utils/util.js')

Page({
  data: {
    mapData: ["30", "104"],
    allData: {},
    markers: [],
    covers: [],
    isInGroup: false,
  },
  //事件处理函数
  changeFocus: function (event) {
    var index = event.target.dataset.key
    this.setData({
      mapData: [
        app.globalData.user[index].latitude, 
        app.globalData.user[index].longitude
      ]
    })
  },

  login: function () {
    var that = this
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
            console.log('lglglg')
            console.log(a)
            wx.setStorageSync('session', a.data.sessionKey)
            that.setData({
              isInGroup: !!a.data.groupId
            })
            that.refresh()
            wx.getUserInfo({
              success: function (b) {
                console.log(b)
                wx.request({
                  url: 'https://ebichu.cn/upload/',
                  method: "POST",
                  header: {
                    'content-type': 'application/x-www-from-urlencoded'
                  },
                  data: {
                    session: a.data.sessionKey,
                    userInfo: b.userInfo
                  },
                  success: function (res) {
                    console.log('upupup')
                    console.log(res)
                  }
                })
              }
            })
          }
        })
      }
    })
  },

  creatConfirm: function () {
    var that = this
    that.refresh()
    console.log(that.data.isInGroup)
    if (that.data.isIngroup) {

    }
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
    that.login()
    var session = wx.getStorageSync('session')
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
            console.log('ididid')
            console.log(a)
            wx.setStorageSync('groupID', a.data.groupID)
            if (!!a.data.groupID) {
              that.setData({
                isInGroup: true,
              })
              wx.showModal({
                title: '小组创建成功',
                content: '您的小组编号为' + a.data.groupID + '请让你的组员加入吧~',
                showCancel: false,
                success: function () {
                  that.refresh()
                }
              })
            }
            else {
              that.setData({
                isInGroup: false,
              })
              wx.showModal({
                title: '小组创建失败',
                content: '您的请求太频繁，请稍后再试~',
                showCancel: false,
                success: function () {
                  that.refresh()
                }
              })
            }
          }
        })
      }
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
        groupID: groupID
      },
      success: function (a) {
        console.log('dsdsds')
        console.log(a)
        wx.showModal({
          title: '小组解散成功',
          content: '您可以点击右下角加号再次建立小组~',
          showCancel: false,
          success: function () {
            that.setData({
              allData: {},
              isInGroup: false,
            })
            wx.removeStorageSync('session')
            wx.removeStorageSync('groupID')
          }
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
            state: 'WTF'
          },
          success: function (a) {
            console.log('rerere')
            console.log(a)
            that.setData({
              allData: a.data,
              markers: util.getMarkers(a.data),
              covers: util.getCovers(a.data),
            })
          }
        })
      }
    })
  },

  join: function () {
    var session = ''
    wx.getStorage({
      key: 'sessionKey',
      success: function (res) {
        session = res.data
      }
    })
    return session
  },

  confirm: function () {
    var that = this
    wx.showModal({
      title: '退出小组',
      content: '确定退出该小组吗？您可以再次搜索小组号加入。',
      success: function (res) {
        if (res.confirm) {
          console.log(that.join())
        }
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
        console.log(res)
        that.setData({
          mapData: [res.latitude, res.longitude]
        })
      }
    })
  }
})
