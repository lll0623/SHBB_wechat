const app = getApp()

Page({
    data: {
        id:'',
        recordLists:[]
    },
    onLoad(option){
        this.setData({
            id:option.id
        })
        wx.showLoading({
            title: '玩命加载中',
            mask:true
        })
        //获取带看记录
        this.getRecordLists();
    },
    //拨打电话
    telFunc(e){
        wx.makePhoneCall({
            phoneNumber:e.currentTarget.dataset.tel
        })
    },
    //获取带看记录
    getRecordLists(){
        app.wxRequest({
            method:'POST',
            url:'/AgLook/QueryLookLists',
            data:{
                Id:this.data.id,
                type:1
            },
        },res=>{
            if(res.data.Data && res.data.Data.length){
                this.setData({
                    recordLists:res.data.Data
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
