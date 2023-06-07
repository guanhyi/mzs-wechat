    //api.js 我们将所有的接口统一管理
    const request = require("../utils/request") //引入封装好的js文件
    module.exports = {
      // 登录
      login(data){
       return request.post('/loginUser.jspx',data)
      },
      // 微信登录
      wxLogin(data){
        return request.get('/weixinLoginUser.jspx',data,true)
       },
       // 注册
       weixinRegist(data){
        return request.get('/weixinRegistUser.jspx',data)
       }
    }
    
