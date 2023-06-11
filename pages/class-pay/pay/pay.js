const paySerivce = require('../../../service/pay')
const classServce = require('../../../service/class')
const app = getApp()
const md5 = require('../../../utils/md5')
Page({

    /**
     * 页面的初始数据
     */
    data: {
        videoCode: null,
        price: 0,
        address: '',
        mobile: wx.getStorageSync('userInfo').userId,
        username: wx.getStorageSync('userInfo').userName,
        city: '',
        cityText: '',
        cityVisible: false,
        cityList: [],
        postPrice: 0,
        post: 0,
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad(options) {
        this.setData({
            price: options.price,
            videoCode: options.videoCode,
            pid: options.pid,
            type: options.type,
            count: options.count,
            createTime: options.createTime,
            status: options.status,
            groupId: options.groupId,
        })
        wx.setNavigationBarTitle({
            title: options.title,
        })
        classServce.getListCity().then(res => {
            const {
                cityCode,
                cityName,
                mailPrice
            } = wx.getStorageSync('userInfo')?.provinceCode ? res.data.rows.filter(it => it.cityCode === wx.getStorageSync('userInfo').provinceCode).length ? res.data.rows.filter(it => it.cityCode === wx.getStorageSync('userInfo').provinceCode)[0] : res.data.rows.filter(it => it.cityCode === "003033")[0] : res.data.rows.filter(it => it.cityCode === "003033")[0]
            this.setData({
                cityList: this.initData(res.data.rows),
                city: cityCode,
                cityText: cityName,
                postPrice: Number(options.price) + Number(mailPrice)
            })
        })

    },
    /**
     * 切换购买行为
     */
    post() {
        this.setData({
            post: this.data.post ? 0 : 1
        })
    },
    /**
     * 获取收件人
     */
    getUsername(e) {
        this.setData({
            username: e.detail.value
        })
    },
    /**
     * 获取联系方式
     */
    getMobile(e) {
        this.setData({
            mobile: e.detail.value
        })
    },
    /**
     * 获取地址
     */
    getAddress(e) {
        this.setData({
            address: e.detail.value
        })
    },
    /**
     * 显示城市选择
     */
    showCity() {
        this.setData({
            cityVisible: true
        })
    },
    /**
     * 初始化城市数据
     */
    initData(data) {
        return data.map(it => {
            return {
                label: it.cityName,
                value: it.cityCode,
                postPrice: it.mailPrice
            }
        })
    },
    /**
     * 选择城市
     */
    onPickerCancel(e) {
        const {
            value,
            label,
        } = e.detail;
        const price = this.data.cityList.filter(it => {
            return it.value == value[0]
        })[0].postPrice
        this.setData({
            city: value[0],
            cityText: label[0],
            postPrice: parseInt(price) + parseInt(this.data.price)
        })
    },
    /**
     * 取消
     */
    cancel() {
        wx.navigateBack(1)
    },
    /**
     * 购买
     */
    buyVideo() {

        if (this.data.post == 0) {
            if (this.data.type == 0) {
                this.videoPay()
            } else if (this.data.type == 1) {
                this.serisePay()
            } else if (this.data.type == 2) {
                this.pinPay()
            } else {
                this.pinUserPay()
            }
        } else {
            this.saveMail()
        }
    },
    saveMail() {
        if (!this.data.username) {
            wx.showToast({
                title: '请输入收件人',
                icon: 'error'
            })
            return
        }
        if (!this.data.mobile && /^[1][3,4,5,7,8,9][0-9]{9}$/.test(this.data.mobile)) {
            wx.showToast({
                title: '请输入手机号',
                icon: 'error'
            })
            return
        }
        if (!this.data.address) {
            wx.showToast({
                title: '请输入详细地址',
                icon: 'error'
            })
            return
        }
        paySerivce.updateMailDetailUser({
            name: this.data.username,
            phone: this.data.mobile,
            address: this.data.address,
            provinceCode: this.data.city
        }).then(res => {
            if (this.data.type == 0) {
                this.videoPay()
            } else if (this.data.type == 1) {
                this.serisePay()
            } else if (this.data.type == 2) {
                this.pinPay()
            } else {
                this.pinUserPay()
            }
        })
    },

    /**
     * 视频购买
     */
    videoPay() {
        let dt = {
            tradeType: 'JSAPI',
            userId: wx.getStorageSync('userInfo').userId,
            codeType: this.data.videoCode,
            payMoney: this.data.price,
            type: this.data.post,
            timestamp: new Date().getTime(),
            appType: 'wx-xcx'
        };
        let mtoken = app.globalData.token + dt.timestamp + dt.userId + dt.payMoney + dt.codeType;
        mtoken = md5.hex_md5(mtoken);
        dt['mtoken'] = mtoken;
        paySerivce.videoPay(dt).then(res => {
            wx.requestPayment({
                timeStamp: res.data.timestamp,
                nonceStr: res.data.noncestr,
                package: 'prepay_id=' + res.data.prepayid,
                paySign: res.data.sign,
                signType: 'MD5',
                success: (res) => {
                    wx.showToast({
                        title: '购买成功',
                    })
                    wx.navigateBack({
                        delta: 2
                    })
                },
            })
        })
    },


    /**
     * 系列购买
     */
    serisePay() {
        let dt = {
            tradeType: 'JSAPI',
            userId: wx.getStorageSync('userInfo').userId,
            codeType: this.data.pid,
            payMoney: this.data.price,
            type: this.data.post,
            timestamp: new Date().getTime(),
            appType: 'wx-xcx'
        };
        let mtoken = app.globalData.token + dt.timestamp + dt.userId + dt.payMoney + dt.codeType;
        mtoken = md5.hex_md5(mtoken);
        dt['mtoken'] = mtoken;
        paySerivce.seriesPay(dt).then(res => {
            wx.requestPayment({
                timeStamp: res.data.timestamp,
                nonceStr: res.data.noncestr,
                package: 'prepay_id=' + res.data.prepayid,
                paySign: res.data.sign,
                signType: 'MD5',
                success: (res) => {
                    wx.showToast({
                        title: '购买成功',
                    })
                    wx.navigateBack({
                        delta: 2
                    })
                },
            })
        })
    },
    /**
     * 团购
     */
    pinPay() {

        let dt = {
            tradeType: 'JSAPI',
            userId: wx.getStorageSync('userInfo').userId,
            SIDCode: this.data.pid,
            payMoney: this.data.price,
            type: this.data.post,
            timestamp: new Date().getTime(),
            createTime: this.data.createTime,
            count: this.data.count,
            status: this.data.status,
            appType: 'wx-xcx'
        };
        let mtoken = app.globalData.token + dt.timestamp + dt.userId + dt.payMoney + dt.SIDCode;
        mtoken = md5.hex_md5(mtoken);
        dt['mtoken'] = mtoken;
        paySerivce.pinPay(dt).then(res => {
            wx.requestPayment({
                timeStamp: res.data.timestamp,
                nonceStr: res.data.noncestr,
                package: 'prepay_id=' + res.data.prepayid,
                paySign: res.data.sign,
                signType: 'MD5',
                success: () => {
                    wx.showToast({
                        title: '购买成功',
                    })
                    const _url = res.data.pinUrl.split('?id=')
                    const id = _url[1]
                    wx.redirectTo({
                        url: `../share/share?id=${id}`,
                    })
                },
            })
        })
    },
    /**
     * 参加团购
     */
    pinUserPay() {

        let dt = {
            tradeType: 'JSAPI',
            userId: wx.getStorageSync('userInfo').userId,
            SIDCode: this.data.pid,
            payMoney: this.data.price,
            type: this.data.post,
            timestamp: new Date().getTime(),
            createTime: this.data.createTime,
            count: this.data.count,
            status: this.data.status,
            groupId: this.data.groupId,
            appType: 'wx-xcx'
        };

        let mtoken = app.globalData.token + dt.timestamp + dt.userId + dt.payMoney + dt.SIDCode;
        mtoken = md5.hex_md5(mtoken);
        dt['mtoken'] = mtoken;
        paySerivce.pinUserPay(dt).then(res => {
            wx.requestPayment({
                timeStamp: res.data.timestamp,
                nonceStr: res.data.noncestr,
                package: 'prepay_id=' + res.data.prepayid,
                paySign: res.data.sign,
                signType: 'MD5',
                success: () => {
                    wx.showToast({
                        title: '购买成功',
                    })
                    const _url = res.data.pinUrl.split('?id=')
                    const id = _url[1]
                    wx.redirectTo({
                        url: `../share/share?id=${id}`,
                    })

                },
            })
        })
    }
})