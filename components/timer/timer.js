// components/timer/timer.js
Component({
    lifetimes: {
        attached: function() {
          // 在组件实例进入页面节点树时执行
          console.log(this.data.timeLabel);
          if (this.data.timeLabel) {
            this.timerEvent = setInterval(()=>{
                this.showtime(this.data.timeLabel);
            },1000);
        }
        },
        detached: function() {
            clearInterval(this.timerEvent)
          // 在组件实例被从页面节点树移除时执行
        },
      },
    /**
     * 组件的属性列表
     */
    properties: {
        timeLabel: {
            type: String,
            default: ''
        }
    },

    /**
     * 组件的初始数据
     */
    data: {
        timer: ''
    },

    /**
     * 组件的方法列表
     */
    methods: {
        showtime (time) {
            let nowtime = new Date(), //获取当前时间
                endtime = new Date(Date.parse(time.replace(/-/g, "/"))); //定义结束时间
            if (endtime.getTime() < nowtime.getTime()) { //判断活动时间是否结束
                clearInterval(this.timerEvent);
                return '活动已结束';
            }
            let lefttime = endtime.getTime() - nowtime.getTime(), //距离结束时间的毫秒数
                timer = '',
                leftd = Math.floor(lefttime / (1000 * 60 * 60 * 24)), //计算天数
                lefth = Math.floor(lefttime / (1000 * 60 * 60) % 24), //计算小时数
                leftm = Math.floor(lefttime / (1000 * 60) % 60), //计算分钟数
                lefts = Math.floor(lefttime / 1000 % 60); //计算秒数
            if (leftd > 0) {
                timer += leftd + '天';
            }
            timer += lefth + ":" + leftm + ":" + lefts;
            this.setData({
                time:timer
            })
        }
    }
})