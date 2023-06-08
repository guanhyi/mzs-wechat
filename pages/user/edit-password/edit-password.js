// pages/user/edit-password/edit-password.js
const userService = require('../../../service/user')
Page({

    /**
     * 页面的初始数据
     */
    data: {
        mobile: '',
        password: '',
        code: '',
        text: '获取验证码',
        time: 60,
        timer: null
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad(options) {

    },
    getMobile(e) {
        this.setData({
            mobile: e.detail.value
        })
    },
    getCode(e) {
        this.setData({
            code: e.detail.value
        })
    },
    getPassword(e) {
        this.setData({
            password: e.detail.value
        })
    },
    setCode() {
        let timer = null
        if (this.data.mobile && /^[1][3,4,5,7,8,9][0-9]{9}$/.test(this.data.mobile)) {
            userService.getCode(this.data.mobile).then(res => {
                timer = setInterval(() => {
                    let time = this.data.time - 1
                    console.log(time);
                    if (time > 0) {
                        this.setData({
                            time: time,
                            text: `重新获取${time}`
                        })
                    } else {
                        clearInterval(timer)
                        this.setData({
                            time: 60,
                            text: '重新获取'
                        })
                    }
                }, 1000);
            })
        } else {
            wx.showToast({
                title: '请先输入手机号',
                icon: 'error'
            })
        }
    },
    updatePassword() {
        if(!this.data.mobile && /^[1][3,4,5,7,8,9][0-9]{9}$/.test(this.data.mobile)){
            wx.showToast({
              title: '请输入手机号',
              icon:'error'
            })
            return
        }
        if(!this.data.code){
            wx.showToast({
              title: '请输入验证码',
              icon:'error'
            })
            return
        }
        if(!this.data.password){
            wx.showToast({
              title: '请输入新密码',
              icon:'error'
            })
            return
        }
        userService.updatePassword({
            mobile: this.data.mobile,
            password: this.data.password,
            code: this.data.code
        }).then(res => {
            wx.showToast({
                title: '修改成功！',
            })
        })
    }
})