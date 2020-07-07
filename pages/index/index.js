const app = getApp()
Page({
    data: {
        banners:[],
        indexData:{},
        selectedShopLists:[
            // {
            //     "Id": "1305221844047EF11EB968843D7087FA",
            //     "Name": "[APP测试专用数据]泰康路",
            //     "Area": "120m²",
            //     "PerPriceStr": "4",
            //     "PerUnit": "元/m²",
            //     "Price": "63333",
            //     "CitySection": "黄浦区",
            //     "ShopType": "沿街商铺",
            //     "Types": ["独栋","洋房","餐饮"],
            //     "ImageUrl": "../../../img/banner1.jpg"
            // },
            // {
            //     "Id": "1305221844047EF11EB968843D7087FA",
            //     "Name": "我要数据",
            //     "Area": "120m²",
            //     "PerPriceStr": "4",
            //     "PerUnit": "元/m²",
            //     "Price": "63333",
            //     "CitySection": "黄浦区",
            //     "ShopType": "沿街商铺",
            //     "Types": ["独栋","洋房","餐饮"],
            //     "ImageUrl": "../../../img/banner1.jpg"
            // }
        ],
    },
    onLoad() {
        wx.showLoading({
            title: '玩命加载中',
        })
        //获取轮播图
        app.wxRequest({
            method:'GET',
            url:'/Home/QueryBanners',
        },res=>{
            this.setData({
                banners:res.data.Data
            })
        });
        //获取统计数据
        app.wxRequest({
            method:'GET',
            url:'/Home/QueryStatistical',
        },res=>{
            this.setData({
                indexData:res.data.Data
            })
        });
        //获取精选商铺
        app.wxRequest({
            method:'GET',
            url:'/Home/QueryAdjectiveShopList',
        },res=>{
            this.setData({
                selectedShopLists:res.data.Data
            })
        });
    },
    //跳转到搜索页
    goSearchFunc(e){
        wx.navigateTo({
           url: "../search/search?type="+e.currentTarget.dataset.type//type:1 商铺，type:1 项目，type:1 求租
        });
    },
    //跳转到商铺列表页
    goShopListsFunc(){
        wx.navigateTo({
           url: "../shopLists/shopLists"
        });
    },
    //跳转到项目列表页
    goProListsFunc(){
        wx.navigateTo({
           url: "../proLists/proLists"
        });
    },
    //跳转到商铺详情页
    goShopDetail(e){
        wx.navigateTo({
           url: "../shopDetail/shopDetail?id="+e.currentTarget.dataset.id
        });
    },
    //跳转到求租列表页
    goRentListsFunc(){
        wx.navigateTo({
           url: "../rentLists/rentLists"
        });
    },
    //跳转到发布页
    goReleaseFunc(){
        if(app.globalData.token){
            wx.navigateTo({
               url: "../release/release"
            });
        }else{
            wx.navigateTo({
               url: "../login/login"
            });
        }
    }
})
