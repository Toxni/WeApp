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
        that.requestData();

        setInterval(function () {
            that.requestData();
        }, 5000);
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

var Constant = require('../../utils/constant.js');
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