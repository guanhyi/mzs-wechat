    //api.js 我们将所有的接口统一管理
    const request = require("../utils/request") //引入封装好的js文件
    module.exports = {
        // 获取类型
        getType(data) {
            return request.post('/showSeriesCoursesVideos.jspx', data)
        },

        getClass(type) {
            return request.post('/getSeriesListOrg.jspx', {
                type
            })
        },
        getClassDetail(subjectId,pid) {
            return request.post('/getGradeVideoInfoVideos.jspx?', {
                userId: wx.getStorageSync('userInfo').userId,
                type: 1,
                subjectId,pid
            })
        },
        getVideo(id, videoCode) {
            return request.get('/getVideoDetailInfoVideos.jspx?', {
                id: id,
                videoCode: videoCode,
                userId: wx.getStorageSync('userInfo').userId
            })
        },
        seriesVideoInfoUser(id) {
            return request.get('/seriesVideoInfoUser.jspx?', {
                id: id,
                userId: wx.getStorageSync('userInfo').userId
            })
        },
        // 打卡
        insertVideosSchedule(videoId) {
            return request.post('/insertVideosSchedule.jspx?', {
                videoId,
                userId: wx.getStorageSync('userInfo').userId
            }, true)
        },
        // 获取邮费
        getListCity() {
            return request.get('/getListCity.jspx?', {
                page: 1,
                rows: 10000,
                // userId: wx.getStorageSync('userInfo').userId
            }, true)
        },
        // 获取折扣
        promotConfingPin() {
            return request.get('/promotConfingPin.jspx?')
        },
        // 更新进度
        updateScheduleVideosSchedule(videoId, schedule) {
            return request.post('/updateScheduleVideosSchedule.jspx?', {
                videoId,
                userId: wx.getStorageSync('userInfo').userId,
                schedule
            })
        },
        // 获取拼团列表
        getListBySidPin(sid) {
            return request.get('/getListBySidPin.jspx?', {
                sid,
                page: 1,
                rows: 20
            }, true)
        },
        // 获取拼团
        showInAppPin() {
            return request.get('/showInAppPin.jspx?', {
                userId: wx.getStorageSync('userInfo').userId,
            }, true)
        },
        // 拼团详情
        goIndexPin(id){
            return request.get('/goIndexPin.jspx?', {
                id,
            }, true)
        }
    }