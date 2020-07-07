const app = getApp()

Page({
    data: {
        tab: 1,
        shopLists:[],
        shopPageSize:10,
        shopPageIndex:1,
        noMoreShop:false,

        proLists:[],
        proPageSize:10,
        proPageIndex:1,
        noMorePro:false,

        rentLists:[
            // {
            //     Id:'123',
            //     CustName:'李先生',
            //     Brand:'百果园',
            //     ImageUrl:'../../img/banner1.jpg',
            //     AreaMin:'50',
            //     AreaMax:'100',
            //     FormatCategory:'百货超市',
            //     Format:'水果店',
            //     PriceMin:'10',
            //     PriceMax:'20',
            //     ReqAreas:['黄浦区','徐汇区']
            // },{
            //     Id:'123',
            //     CustName:'李先生',
            //     Brand:'百果园',
            //     ImageUrl:'../../img/banner1.jpg',
            //     AreaMin:'50',
            //     AreaMax:'100',
            //     FormatCategory:'百货超市',
            //     Format:'水果店',
            //     PriceMin:'10',
            //     PriceMax:'20',
            //     ReqAreas:['黄浦区','徐汇区']
            // }
        ],
        custPageSize:10,
        custPageIndex:1,
        noMoreCust:false,
    },
    onLoad() {
        this.getCollectShop()//收藏的店铺
        this.getCollectPro()//收藏的项目
        this.getCollectCust()//收藏的客户
    },
    tabFunc(e) {
        this.setData({
            tab: e.currentTarget.dataset.tab
        })
    },
    //收藏的店铺
    getCollectShop(){
        app.wxRequest({
            method:'POST',
            url:'/AgUser/QueryFavoriteUnitList',
            data:{
                pageSize:this.data.shopPageSize,
                pageIndex:this.data.shopPageIndex,
            },
            token:app.globalData.token
        },res=>{
            if(res.data.Data){
                if(res.data.Data.Data.length<10){
                    this.setData({
                        noMoreShop:true
                    })
                }else{
                    this.setData({
                        noMoreShop:false
                    })
                }
                var _shopLists = this.data.shopLists;
                for (var i = 0; i < res.data.Data.Data.length; i++) {
                    _shopLists.push(res.data.Data.Data[i]);
                    _shopLists[i]['isTouchMove'] = false
                }
                this.setData({
                    shopLists: _shopLists
                })
            }else{
                this.setData({
                    shopLists: []
                })
                wx.showToast({
                    title: '暂无数据',
                    duration: 2000,
                    icon: 'none',
                    mask: true
                })
            }
        });
    },
    //收藏的项目
    getCollectPro(){
        app.wxRequest({
            method:'POST',
            url:'/AgUser/QueryFavoriteProjectList',
            data:{
                pageSize:this.data.proPageSize,
                pageIndex:this.data.proPageIndex,
            },
            token:app.globalData.token
        },res=>{
            if(res.data.Data){
                if(res.data.Data.Data.length<10){
                    this.setData({
                        noMorePro:true
                    })
                }else{
                    this.setData({
                        noMorePro:false
                    })
                }
                var _proLists = this.data.proLists;
                for (var i = 0; i < res.data.Data.Data.length; i++) {
                    _proLists.push(res.data.Data.Data[i]);
                }
                this.setData({
                    proLists: _proLists
                })
            }else{
                this.setData({
                    proLists: []
                })
                wx.showToast({
                    title: '暂无数据',
                    duration: 2000,
                    icon: 'none',
                    mask: true
                })
            }
        });
    },
    //收藏的客户
    getCollectCust(){
        app.wxRequest({
            method:'POST',
            url:'/AgUser/QueryFavoriteCustList',
            data:{
                pageSize:this.data.custPageSize,
                pageIndex:this.data.custPageIndex,
            },
            token:app.globalData.token
        },res=>{
            if(res.data.Data){
                if(res.data.Data.Data.length<10){
                    this.setData({
                        noMoreCust:true
                    })
                }else{
                    this.setData({
                        noMoreCust:false
                    })
                }
                var _rentLists = this.data.rentLists;
                for (var i = 0; i < res.data.Data.Data.length; i++) {
                    _rentLists.push(res.data.Data.Data[i]);
                }
                this.setData({
                    rentLists: _rentLists
                })
            }else{
                this.setData({
                    rentLists: []
                })
                wx.showToast({
                    title: '暂无数据',
                    duration: 2000,
                    icon: 'none',
                    mask: true
                })
            }
        });
    },
    onReachBottom() {
        if(this.data.tab == 1){//收藏的店铺
            if(!this.data.noMoreShop){
                // 显示加载图标
                wx.showLoading({
                    title: '玩命加载中',
                    mask:true
                })
                // 页数+1
                this.data.shopPageIndex = this.data.shopPageIndex + 1;
                setTimeout(()=>{
                    this.getCollectShop()
                },500)
            }
        }else if(this.data.tab == 2){//收藏的项目
            if(!this.data.noMorePro){
                // 显示加载图标
                wx.showLoading({
                    title: '玩命加载中',
                    mask:true
                })
                // 页数+1
                this.data.proPageIndex = this.data.proPageIndex + 1;
                setTimeout(()=>{
                    this.getCollectPro()
                },500)
            }
        }else if(this.data.tab == 3){//收藏的客户
            if(!this.data.noMoreCust){
                // 显示加载图标
                wx.showLoading({
                    title: '玩命加载中',
                    mask:true
                })
                // 页数+1
                this.data.custPageIndex = this.data.custPageIndex + 1;
                setTimeout(()=>{
                    this.getCollectCust()
                },500)
            }
        }
    },
    //跳转到商铺详情页
    goShopDetail(e){
        wx.navigateTo({
           url: "../shopDetail/shopDetail?id="+e.currentTarget.dataset.id
        });
    },
    //跳转到商铺详情页
    goProDetail(e){
        wx.navigateTo({
           url: "../proDetail/proDetail?id="+e.currentTarget.dataset.id
        });
    },
    //跳转到求租详情页
    goRentDetail(e){
        wx.navigateTo({
           url: "../rentDetail/rentDetail?id="+e.currentTarget.dataset.id
        });
    },


    touchShopStart(e) {
        //开始触摸时 重置所有删除 店铺
        let data = app.touch._touchstart(e, this.data.shopLists)
        this.setData({
            shopLists: data
        })
    },
    //滑动事件处理 店铺
    touchShopMove(e) {
        let data = app.touch._touchmove(e, this.data.shopLists)
        this.setData({
            shopLists: data
        })
    },
    //删除事件 店铺
    delShop(e) {
        wx.showModal({
            title: '提示',
            content: '确认要删除此条信息么？',
            success: res => {
                if (res.confirm) {
                    this.data.shopLists.splice(e.currentTarget.dataset.index, 1)
                    this.setData({
                        shopLists: this.data.shopLists
                    })
                    this.cancelFunc(e.currentTarget.dataset.id,1)
                } else if (res.cancel) {
                    console.log('用户点击取消')
                }
            }
        })
    },


    touchProStart(e) {
        //开始触摸时 重置所有删除 项目
        let data = app.touch._touchstart(e, this.data.proLists)
        this.setData({
            proLists: data
        })
    },
    //滑动事件处理 项目
    touchProMove(e) {
        let data = app.touch._touchmove(e, this.data.proLists)
        this.setData({
            proLists: data
        })
    },
    //删除事件 项目
    delPro(e) {
        wx.showModal({
            title: '提示',
            content: '确认要删除此条信息么？',
            success: res => {
                if (res.confirm) {
                    this.data.proLists.splice(e.currentTarget.dataset.index, 1)
                    this.setData({
                        proLists: this.data.proLists
                    })
                    this.cancelFunc(e.currentTarget.dataset.id,0)
                } else if (res.cancel) {
                    console.log('用户点击取消')
                }
            }
        })
    },
    touchCustStart(e) {
        //开始触摸时 重置所有删除 客户
        let data = app.touch._touchstart(e, this.data.rentLists)
        this.setData({
            rentLists: data
        })
    },
    //滑动事件处理 客户
    touchCustMove(e) {
        let data = app.touch._touchmove(e, this.data.rentLists)
        this.setData({
            rentLists: data
        })
    },
    //删除事件 客户
    delCust(e) {
        wx.showModal({
            title: '提示',
            content: '确认要删除此条信息么？',
            success: res => {
                if (res.confirm) {
                    this.data.rentLists.splice(e.currentTarget.dataset.index, 1)
                    this.setData({
                        rentLists: this.data.rentLists
                    })
                    this.cancelFunc(e.currentTarget.dataset.id,2)
                } else if (res.cancel) {
                    console.log('用户点击取消')
                }
            }
        })
    },
    //取消收藏
    cancelFunc(id,type){
        app.wxRequest({
            method:'POST',
            url:'/AgUser/NotFavite',
            data:{
                refId:id,
                refType:type
            },
            token:app.globalData.token
        },res=>{
            wx.showToast({
                title: '已取消收藏',
                duration: 2000,
                icon: 'none',
                mask: true
            })
        });
    },
})
