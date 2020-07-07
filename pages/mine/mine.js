const app = getApp()

Page({
    data: {
        isLogin:false,
        headerImg:'../../icon/header.png',
        userTel:'点击登录/注册',
    },
    onShow() {
        if(app.globalData.token){
            this.setData({
                userTel:wx.getStorageSync("tel"),
                isLogin:true
            })
        }else{
            this.setData({
                userTel:'点击登录/注册',
                isLogin:false
            })
        }
    },

    mineFastEnter(e){
        var type = e.currentTarget.dataset.type,
            url;
            if(app.globalData.token){
                if(type=="1"){
                    url = "../mineCollected/mineCollected"
                }else if(type=="2"){
                    url = "../mineShop/mineShop"
                }else if(type=="3"){
                    url = "../mineNeed/mineNeed"
                }else if(type=="4"){
                    url = "../set/set"
                }else{
                    return false
                }
            }else{
                url = "../login/login"
            }
        wx.navigateTo({
           url: url
        });
    },
    logoutFunc(){//退出登录
        wx.removeStorageSync('token')
        wx.removeStorageSync('tel')
        wx.removeStorageSync('SourceId')
        this.setData({
            isLogin:false,
            userTel:'点击登录/注册',
        });
        app.globalData.token = ''
        app.globalData.tel = ''
        app.globalData.SourceId = ''
    }
})
