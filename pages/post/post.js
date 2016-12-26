Page({
    data: {
        hidden: true,
        items: []
    },

    onLoad: function () {
        that = this;
        that.setData({
            items: DefaultData
        })
    },

    onPullDownRefresh: function () {
        console.log("onPullDownRefresh : ");
        that.requestData();
    },

    requestData: function () {
        var session = wx.getStorageSync('session');
        var groupID = wx.getStorageSync('groupID');

        wx.request({
            url: 'https://ebichu.cn/login/',
            method: "POST",
            header: {
                'content-type': 'application/x-www-from-urlencoded'
            },
            data: {
                session: session,
                groupID: groupID
            },
            success: function (a) {
                that.setData({
                    isInGroup: !!a.data.groupId
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
                                session: a.data.sessionKey,
                                userInfo: b.userInfo
                            },
                            success: function (res) {
                                console.log(a)
                            }
                        })
                    }
                })
            }
        })
    }
});

var that;
var DefaultData = [
    {
        "nickname": "徐锐",
        "avator": "/pages/images/iec-circle.jpg",
        "content": "感觉肾都要没了，我的哥",
        "image": "/pages/images/minus.png",
        "publishTime": "12:56",
        "latitude": "30",
        "longitude": "120"
    },
    {
        "nickname": "徐锐",
        "avator": "/pages/images/iec-circle.jpg",
        "content": "感觉肾都要没了，我的哥",
        "image": "/pages/images/minus.png",
        "publishTime": "12:56",
        "latitude": "30",
        "longitude": "120"
    }
];