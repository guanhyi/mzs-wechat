const userService = require('../../../service/user')
Page({

    /**
     * 页面的初始数据
     */
    data: {
        username: wx.getStorageSync('userInfo').userName
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

    },

    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide() {

    },

    getUsername(e) {
        this.setData({
            username: e.detail.value
        })
    },
    save() {
        if (!this.data.username) {
            wx.showToast({
                title: '昵称不能为空！',
                icon: 'error'
            })
        }
        userService.updateNicknameUser(this.data.username).then(res => {
            wx.showToast({
                title: '修改成功！',
            })
            let data = wx.getStorageSync('userInfo')
            data.userName = this.data.username
            wx.setStorageSync('userInfo', data)
        })
    }
})