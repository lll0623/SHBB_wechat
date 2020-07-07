const app = getApp()

Page({
    data: {
        id:'',
        isCollect:false,
        shopDetail: {},
        //推荐经纪人
        brokerLists:[
            // {
            //     "BrokerImg" : "../../../img/banner1.jpg",
            //     "BrokerName": "蒋金成",
            //     "BrokerCompany"   : "安洋商业一部",
            //     "BrokerTel" : "1344444444",
            //     "BrokerId" : "123",
            // },
            // {
            //     "BrokerImg" : "../../../img/banner2.jpg",
            //     "BrokerName": "蒋金金",
            //     "BrokerCompany"   : "安洋商业二二部",
            //     "BrokerTel" : "1344444444",
            //     "BrokerId" : "123",
            // }
        ],
        //相似商铺
        similarShopLists:[
            // {
            //     "ShopImg":"../../../img/banner1.jpg",
            //     "ShopName":"珠宝店",
            //     "ShopBuiltUpArea":"210m²",
            //     "ShopDayRent":"10元/m²",
            //     "ShopMonthRent":"63800元",
            //     "ShopId":"123",
            // },
            // {
            //     "ShopImg":"../../../img/banner2.jpg",
            //     "ShopName":"珠宝店",
            //     "ShopBuiltUpArea":"210m²",
            //     "ShopDayRent":"10元/m²",
            //     "ShopMonthRent":"63800元",
            //     "ShopId":"123",
            // },
            // {
            //     "ShopImg":"../../../img/banner1.jpg",
            //     "ShopName":"珠宝店",
            //     "ShopBuiltUpArea":"210m²",
            //     "ShopDayRent":"10元/m²",
            //     "ShopMonthRent":"63800元",
            //     "ShopId":"123",
            // },
            // {
            //     "ShopImg":"../../../img/banner2.jpg",
            //     "ShopName":"珠宝店",
            //     "ShopBuiltUpArea":"210m²",
            //     "ShopDayRent":"10元/m²",
            //     "ShopMonthRent":"63800元",
            //     "ShopId":"123",
            // }
        ],
        //地图标点
        markers: [],
    },
    onLoad(option) {
        this.setData({
            id:option.id
        })
        wx.showLoading({
            title: '玩命加载中',
            mask:true
        })
        //获取详情
        app.wxRequest({
            method:'POST',
            url:'/AgUnit/QueryUnitDetail',
            data:{
                Id:option.id
            },
            token:app.globalData.token
        },res=>{
            if(res.data.Data){
                this.setData({
                    shopDetail:res.data.Data,
                    markers:[
                        {
                            iconPath: "../../../icon/map.png",
                            id: 0,
                            latitude: res.data.Data.Lat,
                            longitude:res.data.Data.Lng,
                            width: 30,
                            height: 30,
                            callout:{
                                content:res.data.Data.Title,
                                fontSize:14,
                                color:'#ffffff',
                                bgColor:'#999',
                                padding:8,
                                borderRadius:4,
                                borderColor:'#999999',
                                boxShadow:'4px 8px 16px #999',
                                display:"ALWAYS",
                            }
                        }
                    ]
                })
                this.isCollectFunc()
                wx.setNavigationBarTitle({
                    title: res.data.Data.Title
                })
            }else{
                wx.showToast({
                    title: '暂无数据',
                    duration: 2000,
                    icon: 'none',
                    mask: true
                })
            }
        });
        //相似店铺
        this.getSimilarShopLists();
        //生成二维码
        // wx.request({
        //     url: 'https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=wx344b16842e73970d&secret=353f0d1125709527f7a2d25abdac7dc3',
        //     method: "GET",
        //     success: (res) => {
        //         console.log(res.data.access_token)
        //         wx.request({
        //             url: 'https://api.weixin.qq.com/wxa/getwxacode?access_token='+res.data.access_token,
        //             method: "POST",
        //             data:{
        //                 path:'pages/shopDetail/shopDetail?id=64c42703-38ab-4194-94a6-dd9cfa0fc3a8'
        //             },
        //             success: (res) => {
        //                 console.log(res)
        //
        //             }
        //         });
        //     }
        // });
    },
    //跳转到地图详情
    goMapDetail(e){
        // wx.navigateTo({
        //    url: "../mapDetail/mapDetail"
        // });
    },
    //检测是否收藏
    isCollectFunc(){
        if(app.globalData.token){
            app.wxRequest({
                method:'POST',
                url:'/AgUser/CheckFavorite',
                data:{
                    refId:this.data.id,
                    refType:1//店铺
                },
                token:app.globalData.token
            },res=>{
                this.setData({
                    isCollect:res.data.Data
                })
            });
        }
    },
    //点击收藏 取消收藏
    collectFunc(e){
        if(app.globalData.token){
            var url,
                type;
            if(this.data.isCollect){//取消收藏
                url = '/AgUser/NotFavite';
                type = 0;
            }else{//收藏
                url = '/AgUser/Favorite';
                type = 1;
            }
            app.wxRequest({
                method:'POST',
                url:url,
                data:{
                    refId:e.currentTarget.dataset.id,
                    refType:1//店铺
                },
                token:app.globalData.token
            },res=>{
                if(type == 1){
                    this.setData({
                        isCollect : true
                    })
                    wx.showToast({
                        title: '收藏成功',
                        duration: 2000,
                        icon: 'none',
                        mask: true
                    })
                }else{
                    this.setData({
                        isCollect : false
                    })
                    wx.showToast({
                        title: '已取消收藏',
                        duration: 2000,
                        icon: 'none',
                        mask: true
                    })
                }
            });
        }else{
            wx.navigateTo({
               url: '../login/login'
            });
        }
    },
    //带看记录
    goRrendsFunc(e){
        wx.navigateTo({
           url: "../record/record?id="+e.currentTarget.dataset.id
        });
    },
    //预约看铺
    bespeakFunc(){
        if(app.globalData.token){

        }else{
            wx.navigateTo({
               url: '../login/login'
            });
        }
    },
    //拨打电话
    telFunc(e){
        wx.makePhoneCall({
            phoneNumber:e.currentTarget.dataset.tel
        })
    },
    //获取推荐经纪人
    getBrokerLists(){
        app.wxRequest({
            method:'POST',
            url:'',
            data:{
                Id:this.data.id,
                type:1
            },
        },res=>{
            if(res.data.Data){
                this.setData({
                    brokerLists:res.data.Data
                })
            }else{
                wx.showToast({
                    title: '暂无数据',
                    duration: 2000,
                    icon: 'none',
                    mask: true
                })
            }
        });
    },
    //获取相似商铺
    getSimilarShopLists(){
        app.wxRequest({
            method:'POST',
            url:'/AgUnit/QuerySimilarShopLists',
            data:{
                Id:this.data.id
            },
        },res=>{
            if(res.data.Data){
                this.setData({
                    similarShopLists:res.data.Data
                })
            }else{
                wx.showToast({
                    title: '暂无数据',
                    duration: 2000,
                    icon: 'none',
                    mask: true
                })
            }
        });
    },
})
