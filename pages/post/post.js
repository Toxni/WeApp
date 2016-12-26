var Constant = require('../../utils/constant.js');
var that;
var timer;
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

Page({
    data: {
        items: []
    },

    onLoad: function () {
        that = this;
        that.requestData();
    },

    onHide: function () {
        console.log("onHide");
        clearInterval(timer);
        timer = null;
    },

    onUnload: function () {
        console.log("onUnload");
        clearInterval(timer);
        timer = null;
    },

    onShow: function () {
        console.log("onShow");
        timer = setInterval(function () {
            that.requestData();
        }, 10000);
    },

    onPullDownRefresh: function () {
        console.log("onPullDownRefresh : ");
        that.requestData();
    },

    onPublishClick: function () {
        wx.navigateTo({
            url: Constant.Pages.PUBLISH,
        })
    },

    bindData: function (images) {
        if (images.length == 0) {
            wx.showModal({
                title: '提示',
                content: '当前Group还没有人发动态呢，要不现在去发一个？',
                confirmText: '发动态',
                success: function (res) {
                    if (res.confirm) {
                        wx.navigateTo({
                            url: Constant.Pages.PUBLISH,
                        })
                    }
                }
            });

            return;
        }

        var i = 0;
        for (i; i < images.length; i++) {
            var content = images[i].content;
            images[i].content = decodeURI(content);
        }
        that.setData({
            items: images
        });
    },

    requestData: function () {
        var session = wx.getStorageSync('session');

        wx.request({
            url: 'https://ebichu.cn/refreshPic/',
            method: "POST",
            header: {
                'content-type': 'application/x-www-from-urlencoded'
            },
            data: {
                session: session,
            },
            success: function (s) {
                console.log("refresh data success : ");
                console.log(s);

                that.bindData(s.data.image);
            },
            fail: function (f) {
                console.log("refresh data success : ");
                console.log(f);
                wx.showModal({
                    title: '网络请求失败',
                    content: '请检查您的网络连接设置',
                    showCancel: false,
                })
            }
        })
    }
});