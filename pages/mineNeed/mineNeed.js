const app = getApp()

Page({
    data: {
        mineNeed:''
    },
    onLoad() {
        //获取我发布的需求
        app.wxRequest({
            method:'POST',
            url:'/PreCust/QueryPreCust',
            data:{
                pageSize:1,
                pageIndex:1,
            },
            token:app.globalData.token
        },res=>{
            this.setData({
                mineNeed:res.data.Data.Data[0]
            })
        });
    },
    goMineNeedEdit(){
        wx.navigateTo({
           url: "../mineNeedEdit/mineNeedEdit"
        });
    },

})
