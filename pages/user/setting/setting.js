// pages/user/setting/setting.js
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
     * 退出
     */
    logout() {
        wx.showModal({
            title: '退出',
            content: '确定要退出吗',
            complete: (res) => {
                if (res.confirm) {
                    wx.removeStorageSync('userInfo')
                    wx.redirectTo({
                        url: '../../login/login',
                    })
                }
            }
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