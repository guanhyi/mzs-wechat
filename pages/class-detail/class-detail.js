const classService = require("../../service/class") //引入课程的接口js
Page({

    /**
     * 页面的初始数据
     */
    data: {
        video: {},
        buyif: false,
        videoInfo: {},
        playPauseText: '立即播放',
        insertVideosSchedule: false,
        videoContext: null,
        duration: 0,
        currentTime: 0,
        picError: false,
        picErrorUrl: '../../assets/image/pic_article.png',
    },
   /**
     * 图片出错
     */
    picerror() {
        this.setData({
            picError: true
        })
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad(options) {
        const {
            id,
            videocode,
            buyif,
            pid
        } = options
        classService.getVideo(id, videocode).then(res => {
            this.setData({
                video: res.data,
                buyif: buyif
            })
        })
        classService.seriesVideoInfoUser(pid).then(res => {
            this.setData({
                videoInfo: res.data.info
            })
        })
    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady() {

        this.videoContext = wx.createVideoContext('video')

    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow() {

    },


    /**
     * 播放视频
     */
    tapPlay() {
        if (this.data.playPauseText == '立即播放' || this.data.playPauseText == '重新加载') {
            this.videoContext.play();

        } else if (this.data.playPauseText == '暂停') {
            this.videoContext.pause();
            this.setData({
                playPauseText: '立即播放'
            })
        } else if (this.data.playPauseText == '继续播放') {
            this.videoContext.play();
        }
    },
    /**
     *  获取当前播放时长
     * @param {*} e 
     */
    getCurrentTime(e) {
        const currentTime = e.detail.currentTime
        this.setData({
            currentTime: currentTime
        })
        if (currentTime > 0) {
            let schedule = ((currentTime / this.data.duration) * 100).toFixed(0);
            if (this.data.duration > 60) {
                this.setData({
                    showTapCardBtn: true
                })
                if (schedule >= 90) {
                    if (!this.data.runInsertVideosSchedule) {
                        this.insertVideosSchedule('自动打卡成功')
                    }
                }
            }
        }

    },
    /**
     * 获取视频时长
     */
    getLength(e) {
        //处理时间格式并存放到data中
        this.setData({
            duration: e.detail.duration
        })
    },
    /**
     * 视频播放事件
     */
    play() {
        this.setData({
            playPauseText: '暂停'
        })
    },
    /**
     * 视频暂停事件
     */
    pause() {
        this.setData({
            playPauseText: '继续播放'
        })
    },
    /**
     * 打卡
     */
    insertVideosSchedule(e) {

        classService.insertVideosSchedule(this.data.video.videoDetail.id).then(res => {
            this.setData({
                runInsertVideosSchedule: true
            })
            if (typeof e === 'string') {
                return
            }

            wx.showToast({
                title: typeof e === 'string' ? e : res.data.message,
            })
        })
    },
    /**
     * 视频播放失败
     */
    error() {
        this.setData({
            playPauseText: '重新加载',
            showTapCardBtn: true
        })


    },
    /**
     * 生命周期函数--监听页面卸载
     */

    onUnload() {
        let schedule = ((this.data.currentTime / this.data.duration) * 100).toFixed(0);
        classService.updateScheduleVideosSchedule(this.data.video.videoDetail.id, schedule).then(res => {})
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