const classService = require('../../../service/class')
Page({

    /**
     * 页面的初始数据
     */
    data: {
        info: {},
        userInfo:{}
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad(options) {
        classService.goIndexPin(options.id).then(res => {
            if (res.data.code == 1000) {
                this.setData({
                    id:options.id,
                    info: res.data.pinInfo,
                    time: new Date(res.data.pinInfo.expirationTime).getTime() - new Date().getTime(),
                    userInfo:res.data.userInfo
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
        return {
            path:'pages/share/share?id='+this.data.id,
            title: '三到九年级理科',
            imageUrl: "/assets/image/share.png", //自定义图片的地址
            success(res) {
                console.log('分享成功！')
            }
        }
    },
    home() {
        const {info,id} = this.data
        wx.reLaunch({
            url: `/pages/login/login?to=pages/class-pay/class-pay&sid=${info.sid}&id=${id}&subjectId=${info.pid}&peoplelimit=${info.peopleLimit}&price=${info.seriesPrice}`,
        })
    }
})