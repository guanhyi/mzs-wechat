const userSerivce = require('./service/user')
App({
    globalData: {
        SERVERURL: 'https://www.mingzhisuan.com',
        token: 'xd9a7zqsaophf19010wf',
        // SERVERURL: 'http://172.40.86.239:8080/kerkr_mzs_war',
        systemInfo: {}
    },
    onShow() {
        wx.getSystemInfo({
            success: (res) => {
                this.globalData.systemInfo = res
            }
        })

        // if (!wx.getStorageSync('userInfo')) {
        //     wx.redirectTo({
        //         url: './pages/login/login',
        //     })
        // } else {
        //     userSerivce.getUser().then(res => {
        //         wx.setStorageSync('userInfo', {
        //             ...wx.getStorageSync('userInfo'),
        //             ...res.data
        //         })
        //     }).catch(()=>{
        //         wx.redirectTo({
        //             url: './pages/login/login',
        //         })
        //     })
        // }

        // userSerivce.getCode()
    },
    getGrade(grade) {
        console.log(grade);
        if (grade) {
            grade = Number(grade);
            switch (grade) {
                case 1:
                    grade = '一年级';
                    break;
                case 2:
                    grade = '二年级';
                    break;
                case 3:
                    grade = '三年级';
                    break;
                case 4:
                    grade = '四年级';
                    break;
                case 5:
                    grade = '五年级';
                    break;
                case 6:
                    grade = '六年级';
                    break;
                case 7:
                    grade = '七年级';
                    break;
                case 8:
                    grade = '八年级';
                    break;
                default:
                    grade = '其他';
                    break;
            }
            return grade;
        }

    },
    onShareAppMessage() {
        return {
            title: '分享',
            imageUrl: "/assets/image/share.png", //自定义图片的地址
            success(res) {
                console.log('分享成功！')
            }
        }
    },
    isLogin() {
        return new Promise((resolve, reject) => {
            if (!wx.getStorageSync('userInfo')) {
                wx.showToast({
                    title: '请先登录！',
                    icon: 'error'
                })
                setTimeout(() => {
                    reject()

                    wx.redirectTo({
                        url: '/pages/login/login',
                    })
                }, 500);

            } else {
                userSerivce.getUser().then(res => {
                    wx.setStorageSync('userInfo', {
                        ...wx.getStorageSync('userInfo'),
                        ...res.data
                    })
                    resolve(res)

                }).catch(() => {
                    wx.showToast({
                        title: '请先登录！',
                    })
                    setTimeout(() => {
                        reject()

                        wx.redirectTo({
                            url: '/pages/login/login',
                        })
                    }, 500);
                })
            }
        })

    }
});