const classService = require("../../service/class") //引入课程的接口js
Page({

    /**
     * 页面的初始数据
     */
    data: {
        list: [],
        pid:'',
        subjectId:''
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad(options) {
        let pid = options?.pid ? options.pid : 0
        let subjectId = options?.subjectId ? options.subjectId : 0
        let title = options?.title ? options.title : '课程'
        this.setData({
            subjectId: subjectId,
            pid:pid
        })
        wx.setNavigationBarTitle({
            title: title,
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
        classService.getClassDetail(this.data.subjectId,this.data.pid).then(res => {
            const data = res.data.videoList.filter(item => {
                return item.pid == this.data.pid && item.subjectId == this.data.subjectId && item.title.indexOf('仅支持安卓设备') < 0
            })
            this.setData({
                list:data,
            })
        })
     
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

    onShareAppMessage() {
        return {
            title: '三到九年级理科',
            imageUrl: "/assets/image/share.png", //自定义图片的地址
            success(res) {
                console.log('分享成功！')
            }
        }
    },
    jump(e) {
        const {
            id,
            videocode,
            buyif
        } = e.currentTarget.dataset
        classService.getVideo(id, videocode).then(res => {
            const data = res.data
            let canPlay = false;
            if (data.videoDetail.unitPrice == 0) {
                canPlay = true
            } else {
                if (data.watch) {
                    canPlay = true;
                } else {
                    if (buyif) {
                        canPlay = true;
                    } else {
                        canPlay = false;
                    }
                }
            }
            if (canPlay) {
                wx.navigateTo({
                    url: `../class-detail/class-detail?id=${id}&videocode=${videocode}&buyif=${buyif}&pid=${this.data.pid}`,
                })
            }else{
                wx.navigateTo({
                    url: `../class-pay/class-pay?id=${id}&videocode=${videocode}&buyif=${buyif}&pid=${this.data.pid}`,
                })
            }
        })

    }
})