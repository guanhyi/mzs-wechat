const classService = require('../../../service/class')
const userService = require('../../../service/user')

Page({

    /**
     * 页面的初始数据
     */
    data: {
        info: {},
        userInfo: {},
        price: '',
        time: '',
        id: "",
        imgUrl: ''
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad(options) {
        classService.goIndexPin(options.id).then(res => {
            if (res.data.code == 1000) {
                this.setData({
                    id: options.id,
                    info: res.data.pinInfo,
                    time: new Date(res.data.pinInfo.expirationTime).getTime() - new Date().getTime(),
                    userInfo: res.data.userInfo,
                    // price: (res.data.pinInfo.seriesPrice * res.data.pinInfo.discountMember).toFixed(2)
                })
                // this.scan()
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

    },

    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh() {

    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom() {

    },
    /**
     * 截图
     */
    scan() {
        //创建一个canvas对象
        const ctx = wx.createCanvasContext('myCanvas', this);
        ctx.setFillStyle('#FA253E')
        ctx.fillRect(0, 0, 440, 450)
        ctx.setFillStyle('#FFf')
        ctx.fillRect(10, 40, 340, 100)
        const {
            typeName,
            typeInfo,
            realPrice
        } = this.data.info
        wx.getImageInfo({
            src: this.data.info.topicImg,
            success: (res) => {
                this.drawImage(ctx, res.path, 30, 90, 170, 150);
                //绘制商品标题部分
                //绘制分享标题
                this.drawNormalText(ctx, `超划算的，快来和我一起拼团吧！`,390, 35, 25, '#fff', 'right', 'middle')
                this.drawNormalText(ctx, `${typeName}-${typeInfo}`, 310, 120, 26, '#000', 'right', 'middle')
                this.drawNormalText(ctx, `￥${this.data.price}`, 290, 170, 30, 'red', 'right', 'middle')
                this.drawNormalText(ctx, `￥${realPrice}`, 370, 170, 26, '#999', 'right', 'middle')
                this.drawNormalText(ctx, `一一一`, 370, 170, 26, '#333', 'right', 'middle')
                this.drawNormalText(ctx, "现时抢购", 310, 230, 26, 'red', 'right', 'middle')
                // ctx.setStrokeStyle('red')
                // ctx.strokeRect(105, 65, 60, 17)
                //绘制canvas标记(绘制圆形并加阴影)
                ctx.setFillStyle('#22aaff')
                ctx.fill()

                //绘制画布，并在回调中获取画布文件的临时路径  
                var self = this
                ctx.draw(true, function () {
                    wx.canvasToTempFilePath({
                        canvasId: 'myCanvas',
                        success(res) {
                            if (res.tempFilePath) {
                                self.setData({
                                    imgUrl: res.tempFilePath
                                })
                            }
                        }
                    })
                });
            }
        })


    },
    //绘制图片封装
    drawImage(ctx, url, x, y, w, h) {
        ctx.drawImage(url, x * scale, y * scale, w * scale, h * scale);
    },
    // 绘制只有一行的文字
    drawNormalText(ctx, str, x, y, font, style, align, baseLine) {
        ctx.setFontSize(font * scale);
        ctx.setFillStyle(style);
        ctx.setTextAlign(align);
        ctx.setTextBaseline(baseLine);
        ctx.fillText(str, x * scale, y * scale);
    },
    /**
     * 用户点击右上角分享
     */
    onShareAppMessage() {
        return {
            title: `拼团购买《${this.data.info.typeName}》系列视频`,
            // imageUrl: this.data.imgUrl,
            success(res) {
                console.log('分享成功！')
            }
        }
    },
    home() {
        const {
            info,
            id
        } = this.data
        userService.getUser().then(res => {
            classService.getClassDetail(info.pid, info.sid).then(res => {
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
                        wx.navigateTo({
                            url: `/pages/class-pay/pay/pay?title=团购本系列教材&price=${info.realPrice}&videoCode=${res.data.videoList[0].videoCode}&pid=${info.sid}&type=3&status=${info.peopleLimit}&createTime=${re.data.endTime}&count=${info.discountMember}&groupId=${id}`,
                        })
                    }
                })
            })
        }).catch(() => {
            wx.reLaunch({
                url: `/pages/login/login?to=pages/class-pay/class-pay&sid=${info.sid}&id=${id}&subjectId=${info.pid}&peoplelimit=${info.peopleLimit}&price=${info.realPrice}&discount=${info.discount}`,
            })
        })
    }
})