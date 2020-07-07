const app = getApp()

Page({
    data: {
        type: 1,
        placeholder: '请输入商铺名称',
        searchKey: '',
        searchHistroyLists:[],
    },
    onLoad(option) {
        var histroyData = wx.getStorageSync('histroyData') || []
        this.setData({
            type: option.type,
            searchHistroyLists: histroyData
        })
        this.placeholderFunc(option.type)
    },
    onHide(){
        var histroyData = wx.getStorageSync('histroyData') || []
        this.setData({
            searchHistroyLists: histroyData
        })
    },
    tabFunc(e) {
        var type = e.currentTarget.dataset.type
        this.placeholderFunc(type)
        this.setData({
            type: type
        })
    },
    placeholderFunc(type) {
        var placeholder = ''
        if (type == 1) {
            placeholder = '请输入商铺名称'
        } else if (type == 2) {
            placeholder = '请输入项目名称'
        } else if (type == 3) {
            placeholder = '请输入客户名称、品牌'
        }
        this.setData({
            placeholder: placeholder
        })
    },
    bindKeyInput(e) {
        this.setData({
            searchKey: e.detail.value
        })
    },
    searchFunc(){
        if(this.data.searchKey  == '' || this.data.searchKey  == null || app.isNull(this.data.searchKey )){
            wx.showToast({
                title:'请输入搜索内容',
                duration: 2500,
                icon: 'none',
                mask: true
            })
            return false
        }
        var url ='',
            type=this.data.type;
        if (type == 1) {
            url = "../shopLists/shopLists"
        } else if (type == 2) {
            url = "../proLists/proLists"
        } else if (type == 3) {
            url = "../rentLists/rentLists"
        }
        this.data.searchHistroyLists.push({searchKey:this.data.searchKey,type:type})
        const _histroyData = []
        if(this.data.searchHistroyLists.length){
            const obj = {}
            for(var i=0;i<this.data.searchHistroyLists.length;i++){
                if(!obj[this.data.searchHistroyLists[i]['searchKey']]){
                    _histroyData.push(this.data.searchHistroyLists[i])
                    obj[this.data.searchHistroyLists[i]['searchKey']] = true
                }else{
                    var searchKey = this.data.searchHistroyLists[i]['searchKey']
                    for(var j=0;j<_histroyData.length;j++){
                        if(searchKey == _histroyData[j]['searchKey']){
                            _histroyData.splice(j,1,this.data.searchHistroyLists[i])
                        }
                    }

                }
            }
        }
        wx.setStorageSync('histroyData', _histroyData)
        wx.navigateTo({
           url: url+"?searchKey="+this.data.searchKey
        });
    },
    goLists(e){//点击跳转
        var url ='',
            type= e.currentTarget.dataset.type,
            searchKey = e.currentTarget.dataset.searchkey;
        if (type == 1) {
            url = "../shopLists/shopLists"
        } else if (type == 2) {
            url = "../proLists/proLists"
        } else if (type == 3) {
            url = "../rentLists/rentLists"
        }
        this.setData({
            searchKey:searchKey,
            type:type
        })
        wx.navigateTo({
           url: url+"?searchKey="+this.data.searchKey
        });
    },
    delHistroy(){//点击删除搜索历史
        if(this.data.searchHistroyLists.length){
            wx.showModal({
                title: '提示',
                content: '确定要删除搜索历史？',
                showCancel: true,//是否显示取消按钮
                cancelText:"否",//默认是“取消”
                cancelColor:'#f5c520',//取消文字的颜色
                confirmText:"是",//默认是“确定”
                confirmColor: '#f5c520',//确定文字的颜色
                success:(res)=> {
                    if (res.confirm) {
                        this.setData({
                            searchHistroyLists : []
                        })
                        wx.removeStorageSync('histroyData')
                    }
                },
                fail: function (res) { },//接口调用失败的回调函数
                complete: function (res) { },//接口调用结束的回调函数（调用成功、失败都会执行）
            })
        }
    },
})
