// pages/welcome/welcome.js
Page({
  data: {},

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
            // that.refresh()
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
                  success: function () {
                    var isInGroup = !!wx.getStorageSync('groupID')
                      if (isInGroup) {
                        wx.redirectTo({
                          url: "/pages/post/post"
                        })
                      }
                      else {
                        wx.redirectTo({
                          url: "/pages/index/index"
                        })
                      }
                  }
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

  onLoad:function(options){
    this.login();
  },
  onReady:function(){
    // 页面渲染完成
  },
  onShow:function(){
    // 页面显示
  },
  onHide:function(){
    // 页面隐藏
  },
  onUnload:function(){
    // 页面关闭
  }
})