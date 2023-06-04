const classService = require("../../service/class") //引入课表的接口js
Page({
    data: {
        tabs: [],
        classObj: {},
        type: 2,
        controller:false,
        current:-1
    },
    onLoad(options) {
        classService.getType({
            userId: wx.getStorageSync('userInfo').userId
        }).then(res => {
            this.setData({
                tabs: res.data.info
            })
            res.data.info.forEach(it => {
                this.getClass(it.id)
            });
        })
    },
    getClass(type) {
        classService.getClass(type).then(res => {
            let data = this.data.classObj
            data[type] = res.data
            this.setData({
                classObj: data
            })
        })
    },
    clickHandle(e) {

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
    onTabsChange(e) {
        this.setData({
            type: e.detail.value,
            current :-1
        })
    },
    /**
     * 是否显示全部控制器
     */
    showController(e){
        this.setData({
            controller:e.target.dataset.status,
            current : e.target.dataset.index
        })
    },
    jump(e){
        const {pid,subjectid,title} = e.currentTarget.dataset
        wx.navigateTo({
          url: `../class-list/class-list?pid=${pid}&subjectId=${subjectid}&title=${title}`,
        })
    }
});