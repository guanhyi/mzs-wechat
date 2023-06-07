    //api.js 我们将所有的接口统一管理

const request = require("../utils/request") //引入封装好的js文件
    module.exports = {
        // 视频支付
        videoPay(data) {
            return request.post('/wechatPurchaseVideosPayNew.jspx', data)
        },
        // 系列支付
        seriesPay(data) {
            return request.post('/wechatPurchaseSeriesPayNew.jspx', data)
        },
        // 团购支付
        pinPay(data) {
            return request.post('/wechatPurchasePinPayNew.jspx', data)
        },
        // 拼团支付
        pinUserPay(data) {
            return request.post('/wechatPurchasePinUserPayNew.jspx', data)
        },
        // 退款
        refundRefund(id) {
            return request.get('/refundRefund.jspx', {
                userId: wx.getStorageSync('userInfo').userId,
                id
            })
        },
        // 保存地址
        updateMailDetailUser(form){
            return request.get('/updateMailDetailUser.jspx', {
                userId: wx.getStorageSync('userInfo').userId,
                mailDetail:JSON.stringify(form)
            })
        }
    }