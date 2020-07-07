const app = getApp()
var interval = null //倒计时函数
Page({
    data: {
        isShow: false,
        time: '获取验证码', //倒计时
        currentTime: 60,
        phone: '', //手机号
        code: '', //验证码
        disabled: false,
        wxLoginInfo: '',
    },
    onLoad() {
        wx.showLoading({
            title: '加载中...',
            mask: true
        });
        wx.checkSession({
            success:()=> {
                //session_key 未过期，并且在本生命周期一直有效
                if(!app.globalData.token){
                    this.wxLogin()
                }
            },
            fail:()=> {
                this.wxLogin()
            }

        })
    },
    wxLogin(){
        // session_key 已经失效，需要重新执行登录流程
        wx.login({
            success:res=> {
                if (res.code) {
                    //发起网络请求获取openid和session_key
                    wx.request({
                        url: app.baseUrl + '/Auth/PreLogin',
                        data: {
                            code: res.code,
                        },
                        success:res=> {
                            wx.hideLoading();
                            if (res.data.Status == 200) {
                                this.setData({
                                    wxLoginInfo: res.data.Data
                                })
                            } else {
                                wx.showToast({
                                    title: res.data.Message,
                                    duration: 2000,
                                    icon: 'none',
                                    mask: true
                                })
                            }
                        },
                        fail(res) {
                            console.log("失败")
                            console.log(res)
                        }
                    })
                }
            },
            fail(res) {

            }
        })
    },
    closeFunc() {
        this.setData({
            isShow: false
        })
    },
    getPhoneNumber(e) {
        var encryptedDataStr = e.detail.encryptedData,
            iv = e.detail.iv;
        if (e.detail.errMsg == "getPhoneNumber:ok") {
            wx.showLoading({
                title: '登录中...',
                mask: true
            });
            //发起授权登录请求获取电话号码
            wx.request({
                url: app.baseUrl + '/Auth/Login',
                data: {
                    preToken: this.data.wxLoginInfo.Token,
                    encryptedDataStr: encryptedDataStr,
                    iv: iv,
                },
                success(res) {
                    if (res.data.Status == 200) {
                        wx.setStorageSync('token', res.data.Data.Token);
                        wx.setStorageSync('tel', res.data.Data.Name);
                        wx.setStorageSync('SourceId', res.data.Data.SourceId);
                        app.globalData.token = res.data.Data.Token
                        app.globalData.tel = res.data.Data.Name
                        app.globalData.SourceId = res.data.Data.SourceId
                        setTimeout(() => {
                            wx.hideLoading();
                            wx.navigateBack({
                                delta: 1
                            })
                        }, 500)
                    } else {
                        wx.showToast({
                            title: res.data.Message,
                            duration: 2000,
                            icon: 'none',
                            mask: true
                        })
                    }
                },
                fail(res) {
                    console.log("失败")
                    console.log(res)
                }
            })
        } else {
            this.setData({
                isShow: true
            })
        }
    },
    getCode() {
        var currentTime = this.data.currentTime
        interval = setInterval(function() {
            currentTime--;
            this.setData({
                time: currentTime + '秒'
            })
            if (currentTime <= 0) {
                clearInterval(interval)
                this.setData({
                    time: '重新发送',
                    currentTime: 60,
                    disabled: false
                })
            }
        }, 1000)
    },
    //获取验证码
    getVerificationCode() {
        var vcerify = /^(((13[0-9]{1})|(15[0-9]{1})|(18[0-9]{1})|(17[0-9]{1}))+\d{8})$/;
        if (!this.data.phone) {
            wx.showToast({
                title: '请输入手机号',
                icon: 'none',
                duration: 2500
            })
            return false
        }
        if (!vcerify.test(this.data.phone)) {
            wx.showToast({
                title: '请输入正确的手机号',
                icon: 'none',
                duration: 2500
            })
            return false
        }
        //获取验证码
        app.wxRequest({
            method:'POST',
            url:'/Auth/GetPhoneVaildateCode',
            data:{
                phone:this.data.phone
            },
        },res=>{
            console.log(res)
            this.getCode();
            this.setData({
                disabled: true,
                code:res.data.Data
            })
        });
    },
    //输入手机号
    inputPhoneFunc(e) {
        this.setData({
            phone: e.detail.value
        })
    },
    //输入验证码
    inputCodeFunc(e) {
        this.setData({
            code: e.detail.value
        })
    },
    //登录
    loginFunc() {
        var vcerify = /^(((13[0-9]{1})|(15[0-9]{1})|(18[0-9]{1})|(17[0-9]{1}))+\d{8})$/;
        if (!this.data.phone) {
            wx.showToast({
                title: '请输入手机号',
                icon: 'none',
                duration: 2500
            })
            return false
        }
        if (!vcerify.test(this.data.phone)) {
            wx.showToast({
                title: '请输入正确的手机号',
                icon: 'none',
                duration: 2500
            })
            return false
        }
        if (!this.data.code) {
            wx.showToast({
                title: '请输入验证码',
                icon: 'none',
                duration: 2500
            })
            return false
        }
        wx.showLoading({
            title: '登录中...',
            mask: true
        });
        //手机号登录
        app.wxRequest({
            method:'POST',
            url:'/Auth/LoginByPhone',
            data:{
                preToken:this.data.wxLoginInfo.Token,
                phone:this.data.phone,
                vailDateCode:this.data.code
            },
        },function(res){
            wx.setStorageSync('token', res.data.Data.Token);
            wx.setStorageSync('tel', res.data.Data.Name);
            wx.setStorageSync('SourceId', res.data.Data.SourceId);
            app.globalData.token = res.data.Data.Token
            app.globalData.tel = res.data.Data.Name
            app.globalData.SourceId = res.data.Data.SourceId
            setTimeout(() => {
                wx.hideLoading();
                wx.navigateBack({
                    delta: 1
                })
            }, 500)
        });
    }
})
