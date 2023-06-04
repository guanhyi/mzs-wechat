// pages/user/about/about.js
Page({

    /**
     * 页面的初始数据
     */
    data: {

    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad(options) {

    },
    call(){
        wx.makePhoneCall({
          phoneNumber: '15168022179',
        })
    }
})