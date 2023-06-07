// pages/user/user-info/user-info.js
const userService = require('../../../service/user')
const qiniu = require('../../../utils/qiniu')
var app = getApp();
Page({
    /**
     * 页面的初始数据
     */
    data: {
        user: wx.getStorageSync('userInfo'),
        grade: ''
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad(options) {
        this.setData({
            grade: app.getGrade(wx.getStorageSync('userInfo').grade)
        })
    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady() {

    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow() {
        this.setData({
            user: wx.getStorageSync('userInfo')
        })
    },

    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide() {

    },
    editAvater() {
        wx.chooseMedia({
            count: 1,
            mediaType: ['image']
        }).then(res => {
            userService.getHeadStuTokenUser().then(r => {
                this.upload(res.tempFiles[0].tempFilePath, r.data.token, r.data.key)
            })
        })
    },
    upload(url, token, key) {
        qiniu.upload(url,
            res => {
                res['userId'] = this.data.user.userId;
                res['headUrl'] = res['key'];
                userService.upHeadStuOKUser(res).then(res => {

                    userService.getUser().then(user => {
                        wx.setStorageSync('userInfo', {
                            ...this.data.user,
                            ...{
                                headUrl: user.data.headUrl
                            }
                        })
                        this.setData({
                            user: wx.getStorageSync('userInfo')
                        })
                    })
                })
            }, {}, {
                region: 'ECN',
                key: key, // [非必须]自定义文件 key。如果不设置，默认为使用微信小程序 API 的临时文件名
                uptoken: token
            })
    },
    onShareAppMessage() {
        return {
            title: '三到九年级理科',
            imageUrl: "/assets/image/share.png", //自定义图片的地址
            success(res) {
                console.log('分享成功！')
            }
        }
    },
})