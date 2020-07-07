import touch from './utils/touch.js'
App({
    onLaunch: function() {

    },
    touch: new touch(),
    globalData: {
        token : wx.getStorageSync("token") || '',
        tel : wx.getStorageSync("tel") || '',
        SourceId: wx.getStorageSync("SourceId") || '',//是否发布过 我的需求
    },
    isNull: function(str) {
        var regu = "^[ ]+$";
        var re = new RegExp(regu);
        return re.test(str);
    },
    //请求方法
    wxRequest(config,callBack){
        if(config.method == "GET"){
            wx.request({
                url: this.baseUrl + config.url,
                method: "GET",
                success: (res) => {
                    if(res.data.Status == 200){
                        callBack(res)
                        setTimeout(()=>{
                            wx.hideLoading()
                        },500)
                    } else {
                        setTimeout(()=>{
                            wx.hideLoading()
                        },500)
                        wx.showToast({
                            title: res.data.Message,
                            duration: 2500,
                            icon: 'none',
                            mask: true
                        })
                    }
                }
            });
        }else if(config.method=="POST"){
            var header;
            if(config.token){
                header = {
                    'content-type': 'application/json',
                    'Token': config.token
                }
            }else{
                header = {
                    'content-type': 'application/json',
                }
            }
            wx.request({
                url: this.baseUrl + config.url,
                method: "POST",
                header:header,
                data: config.data,
                success: (res) => {
                    if(res.data.Status == 200){
                        callBack(res)
                    } else {
                        if(res.data.Status  == 500){//token过期
                            // this.globalData.token = ''
                            // this.globalData.tel =''
                            // this.globalData.SourceId = ''
                            // wx.removeStorageSync('token')
                            // wx.removeStorageSync('tel')
                            // wx.removeStorageSync('SourceId')
                            // wx.navigateTo({
                            //    url: "../login/login"
                            // });
                        }else{
                            wx.showToast({
                                title: res.data.Message,
                                duration: 2500,
                                icon: 'none',
                                mask: true
                            })
                        }
                    }
                    setTimeout(()=>{
                        wx.hideLoading()
                    },500)
                }
            });
        }
    },
    //baseUrl
    baseUrl: "https://v9testmfzp.fengchao88.net"
})
