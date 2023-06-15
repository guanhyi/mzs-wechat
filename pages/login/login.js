const userService = require('../../service/user')
const loginService = require('../../service/login')
const classService = require('../../service/class')
const app = getApp()
Page({

    /**
     * 页面的初始数据
     */
    data: {
        checkbox: false,
        visible: false,
        visibleAvatar: false,
        gradeVisible: false,
        gradeList: [{
                label: '一年级',
                value: 1
            },
            {
                label: '二年级',
                value: 2
            },
            {
                label: '三年级',
                value: 3
            },
            {
                label: '四年级',
                value: 4
            },
            {
                label: '五年级',
                value: 5
            },
            {
                label: '六年级',
                value: 6
            },
            {
                label: '七年级',
                value: 7
            },
            {
                label: '八年级',
                value: 8
            },
            {
                label: '其他',
                value: ''
            },
        ], // 年纪选择
        garde: 1,
        gardeText:"一年级",
        phone: '',
        avatar: '',
        nickname: '',
        to: '',
        groupId: '',
        sid: '',
        subjectId: '',
        peoplelimit: '',
        price: '',
        discount: ''
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad(options) {

        this.setData({
            to: options.to,
            sid: options.sid,
            groupId: options.id,
            subjectId: options.subjectId,
            price: options.price,
            peoplelimit: options.peoplelimit,
            discount: options.discount
        })
        if(wx.getStorageSync('userInfo') && options.to){
            this.reTo()
        }
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
                        } else if (r.data.code === '1000') {
                            wx.setStorageSync('userInfo', r.data)
                            if (this.data.to) {
                                this.reTo()
                            } else {
                                wx.switchTab({
                                    url: '../home/home',
                                })
                            }
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
            avatar: avatarUrl
        })

    },
    /**
     * 获取年级
     */
    getGrade() {
        this.setData({
            gradeVisible: true
        })
    },
    /**
     * 选择年级
     */
    pickGrade(e) {
        this.setData({
            garde: e.detail.value[0],
            gardeText:e.detail.label[0]
        })
    },
    submit() {
        if(!this.data.nickname){
            wx.showToast({
              title: '请输入学生姓名',
              icon:'error'
            })
            return
        }
        wx.login({
            success: (res) => {
                loginService.weixinRegist({
                    wxCode: res.code,
                    phoneNumber: this.data.phone,
                    // password: 123456,
                    userId: this.data.phone,
                    nickName: this.data.nickname,
                    headUrl: 'kerkr999',
                    grade: this.data.garde,
                    deviceType: app.globalData.systemInfo.system.indexOf('iOS') > -1 ? 1 : 0,
                }).then(re => {
                    if (re.data.code == 1000) {
                        this.loginWx()
                    } else {
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
    /**
     * 如果是分享页面进来的 先判断是否已经参团该系列 有的话跳到首页没有跳到课程页面
     */
    reTo() {
        classService.getClassDetail(this.data.subjectId, this.data.sid).then(res => {
            classService.getVideo(res.data.videoList[0].id, res.data.videoList[0].videoCode).then(re => {
                if (re.data.isPinning) {
                    wx.showModal({
                        title: '您已经参与了该系列拼团！请勿重复拼团！',
                        success() {
                            wx.reLaunch({
                                url: '/pages/home/home',
                            })
                        }
                    })
                } else {
                    wx.reLaunch({
                        url: `/pages/class-pay/pay/pay?title=团购本系列教材&price=${this.data.price}&videoCode=${res.data.videoList[0].videoCode}&pid=${this.data.sid}&type=3&status=${this.data.peoplelimit}&createTime=${re.data.endTime}&count=${this.data.discount}&groupId=${this.data.groupId}`,
                    })
                }
            })
        })
        // classService.getVideo()
    }
})