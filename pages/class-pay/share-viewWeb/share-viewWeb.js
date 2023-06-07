
const classService = require('../../../service/class')
const app = getApp()
Page({

    /**
     * 页面的初始数据
     */
    data: {
        url:'',
        isShow:true
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad(options) {
        this.setData({
            url: app.globalData.SERVERURL+'/'+ options.url+'?id='+options.id
        })
        
        classService.goIndexPin(options.id).then(res=>{
            const expirationTime = res.data.split('"expirationTime":"')[1].split('","peopleLimit"')[0]
            const people = res.data.split('id="residuePeople">')[1].split('</span>人，快呼唤小伙伴参加吧！')[0]
            const isShow = people != 0 && new Date(expirationTime).getTime()-new Date().getTime() >0
            this.setData({
                isShow:isShow
            })
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

    onShareAppMessage() {
        return {
            title: '三到九年级理科',
            imageUrl: "/assets/image/share.png", //自定义图片的地址
            success(res) {
                console.log('分享成功！')
            }
        }
    },
 
    home(){
        wx.reLaunch({
          url: '../../home/home',
        })
    }
})