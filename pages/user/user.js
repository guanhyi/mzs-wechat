// pages/user/user.js
const app = getApp()
Page({

    /**
     * 页面的初始数据
     */
    data: {
        user: {},

    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad(options) {

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
            user: wx.getStorageSync('userInfo') || false
        })
    },

    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide() {

    },
    /**
     * 拨打电话
     */
    call() {
        wx.makePhoneCall({
            phoneNumber: '15168022179',
        })
    },
    login(){
        wx.redirectTo({
            url: '/pages/login/login',
        })
    },
    /**
     * 进入个人信息页面
     */
    jump() {
        app.isLogin().then(res => {
            wx.navigateTo({
                url: './user-info/user-info',
            })
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