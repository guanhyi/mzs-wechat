const userService = require('../../service/user')
const loginService = require('../../service/login')
const app = getApp()
Page({

    /**
     * 页面的初始数据
     */
    data: {
        checkbox: false,
        visible: false,
        visibleAvatar: false,
        phone: '',
        avatar:'../../assets/image/my.png',
        nickname:''
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad() {
        
    },
    /**
     * 账号密码登录
     */
    loginUser() {
        wx.navigateTo({
            url: './username-login/username-login',
        })
    },
    /**
     * 微信登录
     */
    loginWx() {
        if (this.data.checkbox) {
            wx.login({
                success: (res) => {
                    loginService.wxLogin({
                        wxCode: res.code
                    }).then(r => {
                        if (r.data.code != '1000') {
                            this.setData({
                                visible: true
                            })
                        } else if(r.data.code === '1000'){
                            wx.setStorageSync('userInfo', r.data)
                            wx.switchTab({
                                url: '../home/home',
                            })
                        }
                    })
                },
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
     * 跳转到用户协议
     */
    goUser() {
        wx.navigateTo({
            url: './user/user',
        })
    },
    /**
     * 跳转到隐私协议
     */
    goPrivacy() {
        wx.navigateTo({
            url: './privacy/privacy',
        })
    },
    /**
     * 已阅读事件
     */
    changeCheck() {
        this.setData({
            checkbox: !this.data.checkbox
        })
    },
    /**
     * 获取手机号
     */
    getPhone(e) {
        userService.getPhoneNumber(e.detail.code).then(res => {
            if (res.data.code == 1000) {
                this.setData({
                    visibleAvatar: true,
                    visible: false,
                    phone: res.data.message
                })
            } else {
                wx.showToast({
                    title: res.data.message,
                })
            }
        })
    },
    getAvatar(e) {
        const {
            avatarUrl
        } = e.detail
        this.setData({
            avatar:avatarUrl
        })
     
    },
    submit(){
 

   wx.login({
            success: (res) => {
                loginService.weixinRegist({
                    wxCode: res.code,
                    userId: this.data.phone,
                    nickName: this.data.nickname,
                    headUrl: this.data.avatar,
                    grade: '其他',
                    deviceType: app.globalData.systemInfo.system.indexOf('iOS') > -1 ? 1 : 0,
                }).then(re => {
                    if(re.data.code == 1000){
                   this.loginWx()
                    }else{
                        wx.showToast({
                          title: '注册失败，请联系管理员',
                        })
                    }
                 
                })
            },
        })
    },
    onVisibleAvatarChange() {
        this.setData({
            visibleAvatar: false
        })
    },
    onVisibleChange() {
        this.setData({
            visible: false
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