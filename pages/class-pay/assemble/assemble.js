const classService = require('../../../service/class')
const payService = require('../../../service/pay')
Page({

    /**
     * 页面的初始数据
     */
    data: {
        list: [],

    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad() {
        this.init()
    },
    init() {
        classService.showInAppPin().then(res => {
            if (res.data.code == 1000) {
                const data = res.data.myPinList.map((it) => {
                    return {
                        ...it,
                        isShowTK: this.isShowTK(it),
                        showTimeText: this.timeToHours(it.expirationTime, it.ifFinish)
                    }
                })
                this.setData({
                    list: data
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
        clearInterval(this.inter);
    },


    /**
     * 用户点击右上角分享
     */
    onShareAppMessage() {

    },
    timeToHours(time, ifFinish) {
        var time = time.replace(/-/g, '/');
        time = new Date(time).getTime() - new Date().getTime();
        if (time > 0 && ifFinish != 1) {
            var hours = parseInt((time % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            var minutes = parseInt((time % (1000 * 60 * 60)) / (1000 * 60));
            var seconds = parseInt((time % (1000 * 60)) / 1000);
            return hours + '小时' + (minutes > 9 ? minutes : '0' + minutes) + '分' + (seconds > 9 ? seconds : '0' + seconds) + '秒';
        } else {
            return '活动已结束';
        }
    },
    isShowTK(item) {
        var time = item['expirationTime'].replace('/-/g', '/');
        time = new Date(time).getTime() - new Date().getTime();
        if (time > 0) {
            return false;
        } else {
            return true;
        }
    },
    /**
     * 退款
     */
    tuikuanButn(e) {
        wx.showModal({
            title: '退款',
            content: '是否确认发起退款请求？退款可能会出现延迟到账情况',
            complete: (res) => {
                if (res.confirm) {
                    wx.showLoading({
                        title: '正在退款',
                    })
                    payService.refundRefund(e.currentTarget.dataset.id).then(res => {
                        this.init()
                        wx.showLoading({
                            title: res.data.message
                        })
                    })
                }
            }
        })
    },
    /**
     * 分享页面
     */
    share(e){
        const _url = e.currentTarget.dataset.url.split('?id=')
        const id = _url[1]
        wx.navigateTo({
          url: `../share/share?id=${id}`,
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