const app = getApp()

Page({
    data: {
        id:'',
        isCollect:false,
        proDetail: {},
        //推荐经纪人
        brokerLists:[],
        //推荐项目
        similarProLists:[],
        //地图标点
        markers: [],
    },
    onLoad(option) {
        this.setData({
            id:option.id
        })
        wx.showLoading({
            title: '玩命加载中',
        })
        //获取详情
        app.wxRequest({
            method:'POST',
            url:'/AgProject/QueryProjectDetail',
            data:{
                Id:option.id
            },
        },res=>{
            this.setData({
                proDetail:res.data.Data,
                markers:[
                    {
                        iconPath: "../../../icon/map.png",
                        id: 0,
                        latitude: res.data.Data.BaseInfo.Lat,
                        longitude:res.data.Data.BaseInfo.Lng,
                        width: 30,
                        height: 30,
                        callout:{
                            content:res.data.Data.BaseInfo.Name,
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
                title: res.data.Data.BaseInfo.Name
            })
        });
        //获取推荐项目
        this.getSimilarShopLists();
    },
    //检测是否收藏
    isCollectFunc(){
        if(app.globalData.token){
            app.wxRequest({
                method:'POST',
                url:'/AgUser/CheckFavorite',
                data:{
                    refId:this.data.id,
                    refType:0//项目
                },
                token:app.globalData.token
            },res=>{
                this.setData({
                    isCollect:res.data.Data
                })
            });
        }
    },
    //收藏 取消收藏
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
                    refType:0//项目
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
    //跳转到地图详情
    goMapDetail(e){
        wx.navigateTo({
           url: "../mapDetail/mapDetail"
        });
    },
    //带看记录
    goRrendsFunc(e){
        wx.navigateTo({
           url: "../record/record?id="+e.currentTarget.dataset.id
        });
    },
    //拨打电话
    telFunc(e){
        wx.makePhoneCall({
            phoneNumber:e.currentTarget.dataset.tel
        })
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
    //获取推荐项目
    getSimilarShopLists(){
        app.wxRequest({
            method:'POST',
            url:'/AgProject/QueryRecommendProLists',
            data:{
                Id:this.data.id
            },
        },res=>{
            if(res.data.Data){
                this.setData({
                    similarProLists:res.data.Data
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
