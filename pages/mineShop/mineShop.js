const app = getApp()

Page({
    data: {
        pageSize:10,
        pageIndex:1,
        shopLists:[],
        noMore:false,
    },
    onLoad() {
        this.getMineShop()
    },
    //获取我发布的商铺
    getMineShop(){
        app.wxRequest({
            method:'POST',
            url:'/PreUnit/QueryPreUnit',
            data:{
                pageSize:this.data.pageSize,
                pageIndex:this.data.pageIndex,
            },
            token:app.globalData.token
        },res=>{
            console.log(res.data.Data.Data)
            if(res.data.Data.Data&&res.data.Data.Data.length){
                if( res.data.Data.Data.length<10){
                    this.setData({
                        noMore:true
                    })
                }else{
                    this.setData({
                        noMore:false
                    })
                }
                var _shopLists = this.data.shopLists;
                for (var i = 0; i < res.data.Data.Data.length; i++) {
                    _shopLists.push(res.data.Data.Data[i]);
                    _shopLists[i]['ImageUrl'] =app.baseUrl+ _shopLists[i]['PicList'].split(',')[0]
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
    onReachBottom() {
        if(!this.data.noMore){
            // 显示加载图标
            wx.showLoading({
                title: '玩命加载中',
                mask:true
            })
            // 页数+1
            this.data.pageIndex = this.data.pageIndex + 1;
            setTimeout(()=>{
                this.getMineShop()
            },500)
        }
    },
    //跳转到商铺详情页
    goShopDetail(e){
        if(e.currentTarget.dataset.state == 1){
            wx.navigateTo({
               url: "../shopDetail/shopDetail?id="+e.currentTarget.dataset.id
            });
        }
    },
})
