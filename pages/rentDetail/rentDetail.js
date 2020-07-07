const app = getApp()

Page({
    data: {
        id:'',
        isCollect:false,
        rentDetail: {},
        //推荐经纪人
        brokerLists:[],
        //智能推荐
        similarCustLists:[],
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
            url:'/AgCust/GetCustDetail',
            data:{
                Id:option.id
            },
        },res=>{
            this.setData({
                rentDetail:res.data.Data
            })
            this.isCollectFunc()
            wx.setNavigationBarTitle({
                title: res.data.Data.CustName
            })
        });
        //获取智能推荐
        this.getSimilarCustLists();
    },
    //跳转到地图详情
    goMapDetail(e){
        wx.navigateTo({
           url: "../mapDetail/mapDetail"
        });
    },
    //检测是否收藏
    isCollectFunc(){
        if(app.globalData.token){
            app.wxRequest({
                method:'POST',
                url:'/AgUser/CheckFavorite',
                data:{
                    refId:this.data.id,
                    refType:2//客户
                },
                token:app.globalData.token
            },res=>{
                this.setData({
                    isCollect:res.data.Data
                })
            });
        }
    },
    //收藏  取消收藏
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
                    refType:2//客户
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
    //拨打电话
    telFunc(e){
        wx.makePhoneCall({
            phoneNumber:e.currentTarget.dataset.tel
        })
    },
    //邀TA看铺
    bespeakFunc(){
        if(app.globalData.token){

        }else{
            wx.navigateTo({
               url: '../login/login'
            });
        }
    },
    //获取智能推荐
    getSimilarCustLists(){
        app.wxRequest({
            method:'POST',
            url:'/AgUnit/RecommendUnits',
            data:{
                refId:this.data.id,
                refType:2
            },
        },res=>{
            if(res.data.Data){
                this.setData({
                    similarCustLists:res.data.Data
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
