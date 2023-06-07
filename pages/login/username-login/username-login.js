// pages/login/username-login/username-login.js
const loginService = require('../../../service/login')
Page({

    /**
     * 页面的初始数据
     */
    data: {
        username: '',
        password: '',
        checkbox: true
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad(options) {

    },

    login() {
        if (this.data.checkbox) {
   
            loginService.login({
                phoneNumber: this.data.username,
                password: this.data.password,
                uuid: 1,
                deviceType: 0,
            }).then(res => {
              wx.setStorageSync('userInfo', res.data)
              wx.switchTab({
                url: '../../home/home',
              })
            })
        } else {
            wx.showModal({
                title: '用户协议和隐私协议',
                content: '请您务必审慎阅读，充分理解“用户协议”和“隐私协议”各项条款。并确认是否同意',
                complete: (res) => {
                    if (res.confirm) {
                        this.setData({
                            checkbox: true
                        })
                    }
                }
            })
        }
    },
    /**
     * 已阅读事件
     */
    changeCheck() {
        this.setData({
            checkbox: !this.data.checkbox
        })
    },
    getUsername(e) {
        this.setData({
            username: e.detail.value
        })
    },
    getPassword(e) {
        this.setData({
            password: e.detail.value
        })
    }
})