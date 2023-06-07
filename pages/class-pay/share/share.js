const classService = require('../../../service/class')
Page({

    /**
     * 页面的初始数据
     */
    data: {
        info:{}
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad(options) {
        classService.showInAppPin().then(res => {
            if (res.data.code == 1000) {
                const data = res.data.myPinList.filter((it) =>it.id==options.id)
                this.setData({
                    info: data[0],
                    time:new Date(data[0].expirationTime).getTime()-new Date().getTime()
                })
            } else {
                wx.showToast({
                    title: '加载失败',
                })
            }
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

    },

    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide() {

    },

    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload() {

    },

    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh() {

    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom() {

    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage() {

    },
    home(){
        wx.reLaunch({
          url: '../../home/home',
        })
    }
})