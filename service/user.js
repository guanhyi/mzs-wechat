    //api.js 我们将所有的接口统一管理
    const request = require("../utils/request") //引入封装好的js文件
    module.exports = {
        // 获取用户信息
        getUser() {
            return request.get('/userInfoUser.jspx', {
                userId: wx.getStorageSync('userInfo').userId
            })
        },
        // 获取验证码
        getCode(mobile) {
            return request.post('/sendCodeRSUser.jspx', {
                phoneNumber: mobile
            })
        },
        // 更新密码
        updatePassword(data) {
            return request.post('/forgerPasswordUser.jspx', {
                phoneNumber: data.mobile,
                password: data.password,
                verifyCode: data.code
            })
        },
        // 更新昵称
        updateNicknameUser(username) {
            return request.post('/updateNicknameUser.jspx', {
                userId: wx.getStorageSync('userInfo').userId,
                nickName: username
            })
        },
        /**
         * 取得授权
         */
        getHeadStuTokenUser() {
            return request.get('/getHeadStuTokenUser.jspx', {
                userId: wx.getStorageSync('userInfo').userId
            })
        },
        // 上传头像
        upHeadStuOKUser(data) {
            return request.post('/upHeadStuOKUser.jspx', data)
        },
        // 获取省市区
        getCity(code) {
            return request.get('/getCityDictionary.jspx', {
                code: code || ''
            })
        },
        // 修改地址
        updateCityUser(data) {
            return request.get('/updateCityUser.jspx', data)
        },
        // 获取物流信息
        getPurchaseListOrg() {
            return request.get('/purchaseListOrg.jspx', {
                userId: wx.getStorageSync('userInfo').userId,
                phoneNumber:  wx.getStorageSync('userInfo').userId,
                page: 1,
                rows: 500,
                orgId: 'K20002',
                mailType: '1'
            },true)
        },
        // 获取openId
        getOpenId(code){
            // return request.post('/code2openIdAppletPayNew.jspx', {
            //     mtoken:code
            // })
            return wx.request({
              url: 'https://www.mingzhisuan.com/weixinLoginUser.jspx',
              data:{
                wxCode:code
              },
              method:'get',
              header:{
                  'Content-Type':'applicantion/json'
              },
              dataType:'json',
              success:(res)=>{
                  console.log(res);
                  console.log(res.data.message);
                  wx.setStorageSync('openid', res.data.message)
              }
            })
        },
        getPhoneNumber(code){
            return request.get('/getPhoneNumberUser.jspx', {
                wxCode:code
            },true)
        }
    }