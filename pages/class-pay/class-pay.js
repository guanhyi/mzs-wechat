// pages/class-pay/class-pay.js
const classService = require("../../service/class") //引入课程的接口js
Page({

    /**
     * 页面的初始数据
     */
    data: {
        id: '',
        marginTop: 0,
        delay: true,
        picError: false,
        picErrorUrl: '../../assets/image/pic_article.png',
        video: {},
        videoInfo: {},
        buyCheckText0: '购买本教材',
        pPrice: 0,
        groupPrice: 0,
        discountVisible: false,
        discountValue: 2,
        discountList: [],
        groupId: '',
        peopleNum: 0,
        isPinning: false,
        groups: [],
        pinVisible: false,
        pid: '',
        videocode: '',
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad(options) {
        const {
            id,
            videocode,
            buyif,
            pid,
        } = options
        classService.promotConfingPin().then(res => {
            this.setData({
                discountList: res.data.data.map(it => {
                    return {
                        ...it,
                        value: it.peopleLimit,
                        label: `${it.promotName}(${it.discount*10}折)`
                    }
                }),
                discount: Math.min(...res.data.data.map(it => it.discount))
            })

        })
        classService.getVideo(id, videocode).then(res => {
            this.setData({
                video: res.data,
                buyif: buyif == 'true' ? true : false,
                isPinning: res.data.isPinning ? res.data.isPinning : false,
                pid: pid,
                id: id,
                videocode: videocode
            })
            classService.seriesVideoInfoUser(pid).then(r => {
                let p = r.data.info.seriesPrice
                if (res.data.isPin) {
                    p = (r.data.info.seriesPrice * this.data.discount).toFixed(2)
                }
                this.setData({
                    videoInfo: r.data.info,
                    pPrice: p,
                })
            })
        })
        classService.getListBySidPin(pid).then(res => {
            if (res.statusCode == 200) {
                this.setData({
                    groups: res.data.rows.filter(it => it.userId !== wx.getStorageSync('userInfo').userId)
                })
                if (res.data.rows.length > 2) {
                    this.animationUp()
                }
            }

        })

    },
    onShow() {
        if (this.data.id) {
            classService.getVideo(this.data.id, this.data.videocode).then(res => {
                this.setData({
                    video: res.data,
                    isPinning: res.data.isPinning ? res.data.isPinning : false,
                })
                classService.seriesVideoInfoUser(this.data.pid).then(r => {
                    let p = r.data.info.seriesPrice
                    if (res.data.isPin) {
                        p = (r.data.info.seriesPrice * this.data.discount).toFixed(2)
                    }
                    this.setData({
                        videoInfo: r.data.info,
                        pPrice: p,
                    })
                })
            })
            classService.getListBySidPin(this.data.pid).then(res => {
                if (res.statusCode == 200) {
                    this.setData({
                        groups: res.data.rows.filter(it => it.userId !== wx.getStorageSync('userInfo').userId)
                    })
                    if (res.data.rows.length > 2) {
                        this.animationUp()
                    }
                }

            })
        }
    },
    /**
     * 图片出错
     */
    picerror() {
        this.setData({
            picError: true
        })
    },
    // 拼团列表
    goPing() {
        wx.navigateTo({
            url: './assemble/assemble',
        })
    },
    // 参团
    joinGroupBuy(e) {
        const {
            peoplelimit,
            id
        } = e.currentTarget.dataset
        const {
            video,
            pid,
            videoInfo
        } = this.data

        const price = (this.data.discountList.filter(it => it.peopleLimit == peoplelimit)[0].discountMember * videoInfo.seriesPrice).toFixed(2)
        wx.navigateTo({
            url: `./pay/pay?title=团购本系列教材&price=${price}&videoCode=${video.videoDetail.videoCode}&pid=${pid}&type=3&status=${peoplelimit}&createTime=${video.endTime}&count=${this.data.discountList.filter(it=>it.peopleLimit == peoplelimit)[0].discountMember}&groupId=${id}`,
        })
    },
    // 判断购买的是什么
    buyCheck: function (e) {
        const type = e.currentTarget.dataset.index
        let price = this.data.video.videoDetail.unitPrice
        const videoCode = this.data.video.videoDetail.videoCode
        if (type == 0) {
            // 购买本教程
            price = this.data.video.videoDetail.unitPrice
        } else if (type == 1) {
            // 购买本系列
            price = this.data.videoInfo.seriesPrice
        } else if (type == 3) {
            price = (this.data.videoInfo.seriesPrice * this.data.video.discountMember).toFixed(2)
        } else {
            // 团购
            this.setData({
                discountVisible: true,
            })
            price = this.data.pPrice;
            return
        }
        const {
            pid,
            buyCheckText0
        } = this.data
        wx.navigateTo({
            url: `./pay/pay?title=${buyCheckText0}&price=${price}&videoCode=${videoCode}&pid=${pid}&type=${type}`,
        })
    },
    // 选择团购的人数
    onPickerChange(e) {
        const {
            value
        } = e.detail
        this.setData({
            discountVisible: false
        })
        const {
            pid,
            video,
            discountList,
            videoInfo
        } = this.data
        const pPrice = (discountList.filter(it => it.peopleLimit == value[0])[0].discount * videoInfo.seriesPrice).toFixed(2)
        wx.navigateTo({
            url: `./pay/pay?title=团购本系列&price=${pPrice}&videoCode=${video.videoDetail.videoCode}&pid=${pid}&type=2&status=${value[0]}&createTime=${video.endTime}&count=${discountList.filter(it=>it.peopleLimit == value[0])[0].discount}`,
        })

    },
    // 显示更多拼单人数
    moreGroupShow() {
        this.setData({
            pinVisible: true
        })
    },
    moreGroupClose() {
        this.setData({
            pinVisible: false
        })
    },
    //滚动翻页
    animationUp() {
        let curr = 0,
            itemLen = this.data.groups.length;
        this.animationEvent = setInterval(() => {
            curr = curr + 2;
            if (curr == itemLen - 2) {
                this.setData({
                    marginTop: '-' + curr * 122
                })
                setTimeout(() => {
                    curr = 0;
                    this.setData({
                        delay: false,
                        marginTop: '-' + curr * 122
                    })
                }, 3000);
            }
            if (curr < itemLen - 2) {
                this.setData({
                    delay: true,
                    marginTop: '-' + curr * 122
                })
            }
        }, 3000);
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