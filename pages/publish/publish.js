Page({

    data: {
        imageData: "/pages/images/ic_add.png"
    },

    onTextChanged: function (event) {
        content = event.detail.value;
    },


    onPublishClick: function (event) {

        if (content == "" || tempImagePaths == "") {
            wx.showToast({
                title: "请输入内容并选择一张图片！",
                duration: 2000
            });

            return;
        }

        that.publish();
    },

    publishSuccess: function () {
        wx.hideToast()
        wx.showModal({
            title: '提示',
            content: '您的动态已经发布成功！',
            showCancel: false,
            success: function (res) {
                wx.navigateBack();
            }
        });
    },

    publishFail: function () {
        wx.hideToast()
        wx.showModal({
            title: '提示',
            content: '动态发布失败，请重试',
            confirmText: '重试',
            success: function (res) {
                if (res.confirm) {
                    that.publish();
                }
            }
        });
    },

    publish: function () {
        var session = wx.getStorageSync('session');

        wx.showToast({
            title: '动态发布中，请稍候',
            icon: 'loading',
            mask: true,
            duration: 10000,
        });

        wx.getLocation({
            type: 'wgs84',
            success: function (res) {
                var formData = {
                    "session": session,
                    "content": encodeURI(content),
                    "filePath": tempImagePaths[0],
                    "latitude": res.latitude + "",
                    "longitude": res.longitude + ""
                };

                console.log(formData);
                wx.uploadFile({
                    url: 'https://ebichu.cn/newPic/', //仅为示例，非真实的接口地址
                    filePath: tempImagePaths[0],
                    name: 'file',
                    formData: {
                        "session": session,
                        "content": encodeURI(content),
                        "filePath": tempImagePaths[0],
                        "latitude": res.latitude + "",
                        "longitude": res.longitude + ""
                    },
                    success: function (s) {
                        console.log("upload file success :");
                        console.log(s);

                        if (s.data.indexOf("success") >= 0) {
                            that.publishSuccess();
                        } else {
                            that.publishFail();
                        }
                    },
                    fail: function (f) {
                        console.log("upload file fail :");
                        console.log(f);
                        that.publishFail();
                    }
                })
            },
            fail: function (f) {
                console.log("getLocation fail :");
                console.log(f);
                that.publishFail();
            }
        })
    },

    onImageClick: function (event) {
        wx.chooseImage({
            count: 1,
            sizeType: ['compressed'],
            sourceType: ['album', 'camera'],
            success: function (res) {
                tempImagePaths = res.tempFilePaths;
                that.setData({
                    imageData: tempImagePaths
                })
            }
        })
    },

    onLoad: function () {
        that = this;
    }
});

var that;
var tempImagePaths = "";
var content = "";