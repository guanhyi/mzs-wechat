const userService = require('../../../service/user')
Page({

    /**
     * 页面的初始数据
     */
    data: {
        provincesVisible: false,
        provincesList: [],
        provincesValue:'',
        provincesText:'',
        cityVisible: false,
        cityList:[],
        cityValue:'',
        cityText:'',
        areaVisible: false,
        areaList:[],
        areaValue:'',
        areaText:'',
        user:{}
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad(options) {
        userService.getUser().then(res=>{
            this.setData({
                user:res.data
            })
            userService.getCity().then(res => {
                let value = this.data.user.provinceCode || res.data.city[0].CODE
                this.setData({
                    provincesList: this.initData(res.data.city),
                    provincesText: res.data.city.filter(it=>it.CODE ==value)[0].NAME,
                    provincesValue:value
                })
                this.getCity(1)
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
    initData(data) {
        return data.map(it => {
            return {
                label: it.NAME,
                value: it.CODE
            }
        })
    },
    /**
     * 显示省份选择器
     */
    showProvinces() {
        this.setData({
            provincesVisible: true
        });
    },
    /**
     * 显示城市选择器
     */
    showCity() {
        this.setData({
            cityVisible: true
        });
    },
    /**
     * 显示区县选择器
     */
    showArea() {
        this.setData({
            areaVisible: true
        });
    },
    /**
     * 选择省份
     */
    onPickerProvinces(e){
        const { value, label } = e.detail;
        this.setData({
            provincesVisible: false,
            provincesValue: value[0],
            provincesText: label.join(' '),
          });
          this.getCity()
    },
    /**
     * 选择城市
     */
    onPickerCity(e){
        const { value, label } = e.detail;
        this.setData({
            cityVisible: false,
            cityValue: value[0],
            cityText: label.join(' '),
          });
          this.getArea()
    },
    /**
     * 选择区县
     */
    onPickerArea(e){
        const { value, label } = e.detail;
        this.setData({
            areaVisible: false,
            areaValue: value[0],
            areaText: label.join(' '),
          });
    },
    /**
     * 获取城市
     */
    getCity(type){
        userService.getCity(this.data.provincesValue).then(res=>{
            let value =type ==1?(this.data.user.cityCode || res.data.city[0].CODE) : res.data.city[0].CODE
            this.setData({
                cityList:this.initData(res.data.city),
                cityValue:value,
                cityText:res.data.city.filter(it=>it.CODE ==value)[0].NAME
            })
            this.getArea(type)
        })
    },
    /**
     * 获取区县
     */
    getArea(type){
        userService.getCity(this.data.cityValue).then(res=>{
            let value =type ==1?(this.data.user.districtCode || res.data.city[0].CODE) : res.data.city[0].CODE
            this.setData({
                areaList:this.initData(res.data.city),
                areaText:res.data.city.filter(it=>it.CODE ==value)[0].NAME,
                areaValue:value
            })
        })
    },
    save(){
        userService.updateCityUser({
            provinceCode: this.data.provincesValue,
            cityCode:this.data.cityValue,
            districtCode:this.data.areaValue,
            userId:this.data.user.userId
        }).then(res=>{
            wx.showToast({
              title: '保存成功！',
            })
            wx.setStorageSync('userInfo', {... wx.getStorageSync('userInfo'),...{
                provinceCode: this.data.provincesValue,
            cityCode:this.data.cityValue,
            districtCode:this.data.areaValue,
            }})
        })
    }
})