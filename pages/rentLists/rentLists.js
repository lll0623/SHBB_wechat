const app = getApp()

Page({
    data: {
        searchKey:'',
        rentLists:[],
        PageSize:10,
        PageIndex:1,
        noMore:false,
        scrollTop:0,
        windowHeight:'',
        isActive:'',
        isScreenSort:'1',//排序筛选
        Sort:{
            Field:'ModifyTime',
            IsASC:true
        },
        //区域筛选数据
        regionlists:[],//区域列表
        firRegion:[],
        isActive1:'',
        secRegion:[{AreaName:'不限',AreaCode:''}],
        isActive2:'',
        thiRegion:[{AreaName:'不限',AreaCode:''}],
        isActive3:'',
        regionWid:['100%','0','0'],
        region:'区域',
        AreaCode:'',
        //面积筛选数据
        area:'面积',
        areaText:'面积',
        minArea:'',
        maxArea:'',
        areaLists:[],
        areaActive:'',
        overScale:{
            Min:'',
            Max:''
        },
        Scale:{
            Min:'',
            Max:''
        },
        //业态筛选数据
        operation:'',
        operationText:'业态',
        YTWid:['100%','0'],
        isYTActive1:'',
        isYTActive2:'',
        firYT:[],
        secYT:[],

        //价格
        price:'价格',
        priceText:'价格',
        //月租金筛选数据
        MRLists:[],
        MRActive:'',
        minMR:'',
        maxMR:'',
        overMonthPrice:{
            Min:'',
            Max:''
        },
        MonthPrice:{
            Min:'',
            Max:''
        },
    },
    onLoad(option) {
        if(option.searchKey){
            this.setData({
                searchKey:option.searchKey
            })
        }
        wx.getSystemInfo({
            success:res=> {
                let clientHeight = res.windowHeight;
                this.setData({    
                    windowHeight: clientHeight
                });
            }
        });
        wx.showLoading({
            title: '玩命加载中',
            mask:true
        })
        this.getRentLists();
        //获取区域
        this.getRegion();
        //获取词典数据
        this.getScreenData();
    },
    getRentLists(){
        //获取求租列表
        app.wxRequest({
            method:'POST',
            url:'/AgCust/QueryAgentCust',
            data:{
                SearchKey:this.data.searchKey,
                PageSize:this.data.PageSize,
                PageIndex:this.data.PageIndex,
                FormatCode:this.data.operation,
                AreaCode:this.data.AreaCode,
                Area:this.data.Scale,
                Rent:this.data.MonthPrice,
                Sort:this.data.Sort
            }
        },res=>{
            if(res.data.Data.Data.length<10){
                this.setData({
                    noMore:true
                })
            }else{
                this.setData({
                    noMore:false
                })
            }
            var _rentLists = this.data.rentLists;
            for (var i = 0; i < res.data.Data.Data.length; i++) {
                _rentLists.push(res.data.Data.Data[i]);
            }
            this.setData({
                rentLists: _rentLists
            })
        });
    },
    onReachBottomFunc() {
        if(!this.data.noMore){
            // 显示加载图标
            wx.showLoading({
                title: '玩命加载中',
                mask:true
            })
            // 页数+1
            this.data.PageIndex = this.data.PageIndex + 1;
            setTimeout(()=>{
                this.getRentLists()
            },500)
        }
    },
    //跳转到搜索页
    goSearchFunc(){
        if(this.data.searchKey){
            wx.navigateBack({
                delta: 1
            })
        }else{
            wx.navigateTo({
               url: "../search/search?type=3"
            });
        }
    },
    //跳转到求租详情页
    goRentDetail(e){
        wx.navigateTo({
           url: "../rentDetail/rentDetail?id="+e.currentTarget.dataset.id
        });
    },
    //监听滚动条
    scroll(e) {
        var scrollTop = e.detail.scrollTop;
        this.setData({
            scrollTop:scrollTop
        })
    },
    sortFunc(e){
        this.setData({
            isActive : e.currentTarget.dataset.type
        })
    },
    cancelSort(){
        this.setData({
            isActive : "",
        })
    },
    //获取词典数据
    getScreenData(){
        app.wxRequest({
            method:'POST',
            url:'/DataItem/GetItems',
            data:{
                keys:['Ls.Ag.ConstructionArea','Ls.Ag.Format','Ls.Ag.MonthRent']
            }
        },res=>{
            if(res.data.Data){
                res.data.Data['Ls.Ag.Format'].unshift({Children:[],ItemId:'',ItemName:'不限'})
                this.setData({
                    areaLists:res.data.Data['Ls.Ag.ConstructionArea'],
                    firYT:res.data.Data['Ls.Ag.Format'],
                    MRLists:res.data.Data['Ls.Ag.MonthRent'],
                })
            }
        });
    },
    //获取区域筛选数据
    getRegion(){
        app.wxRequest({
            method:'GET',
            url:'/Area/GetArea',
        },res=>{
            var regionlists = res.data.Data,
                firRegion = [],
                secRegion = [],
                thiRegion = [];
            for(var i=0;i<regionlists.length;i++){
                if(regionlists[i]['Layer'] == 1){
                    firRegion.push({AreaName:regionlists[i]['AreaName'],AreaCode:regionlists[i]['AreaCode']})
                }
            }
            this.setData({
                regionlists:regionlists,
                firRegion:firRegion
            })
        });
    },
    //点击一级区域获取二级区域
    firRegionFunc(e){
        var areaCode = e.currentTarget.dataset.areacode,
            regionlists = this.data.regionlists,
            secRegion = [{AreaName:'不限',AreaCode:''}];
        for(var i=0;i<regionlists.length;i++){
            if(regionlists[i]['Layer'] == 2 && regionlists[i]['ParentId'] == areaCode){
                secRegion.push({AreaName:regionlists[i]['AreaName'],AreaCode:regionlists[i]['AreaCode']})
            }
        }
        this.setData({
            secRegion:secRegion,
            thiRegion:[],
            regionWid:['49%','49%'],
            isActive1:areaCode,
            isActive2:'',
            isActive3:''
        })
    },
    //点击二级区域获取三级区域
    secRegionFunc(e){
        var areaCode = e.currentTarget.dataset.areacode,
            areaName = e.currentTarget.dataset.areaname,
            regionlists = this.data.regionlists,
            thiRegion = [{AreaName:'不限',AreaCode:''}];
        for(var i=0;i<regionlists.length;i++){
            if(regionlists[i]['Layer'] == 3 && regionlists[i]['ParentId'] == areaCode){
                thiRegion.push({AreaName:regionlists[i]['AreaName'],AreaCode:regionlists[i]['AreaCode']})
            }
        }
        if(areaCode){
            this.setData({
                thiRegion:thiRegion,
                regionWid:['24%','24%','51%'],
                isActive2:areaCode,
                // region:areaName,
                // PageIndex:1,
                // rentLists:[]
            })
        }else{
            this.setData({
                thiRegion:[],
                regionWid:['49%','49%'],
                isActive2:areaCode,
                isActive3:'',
        //         AreaCode:areaCode,
        //         region:areaName,
        //         PageIndex:1,
        //         rentLists:[]
            })
        }
        // this.getRentLists();
    },
    //点击三级区域获取参数
    thiRegionFunc(e){
        var areaCode = e.currentTarget.dataset.areacode,
            areaName = e.currentTarget.dataset.areaname;
        this.setData({
            isActive3:areaCode,
            region:areaName,
            AreaCode:areaCode,
            isActive : "",
            PageIndex:1,
            rentLists:[],
        })
        wx.showLoading({
            title: '玩命加载中',
            mask:true
        })
        this.getRentLists();
    },

    //输入最小面积
    iptMinArea(e){
        this.setData({
            minArea: e.detail.value
        })
    },
    //输入最大面积
    iptMaxArea(e){
        this.setData({
            maxArea: e.detail.value
        })
    },
    //聚焦输入框
    focusArea(){
        this.setData({
            areaActive:''
        })
    },
    //点击面积选项
    itemAreaFunc(e){
        this.setData({
            areaActive:e.currentTarget.dataset.id,
            minArea:'',
            maxArea:'',
            overScale:{
                Min:e.currentTarget.dataset.property1,
                Max:e.currentTarget.dataset.property2
            },
            areaText:e.currentTarget.dataset.itemname
        })
    },
    //点击面积确认按钮
    screenAreaFunc(){
        if(!this.data.areaActive){
            if(this.data.maxArea<this.data.minArea){
                var maxArea = this.data.minArea;
                var minArea = this.data.maxArea || 0;
                this.setData({
                    maxArea:maxArea,
                    minArea:minArea
                })
            }
            this.setData({
                Scale:{
                    Min:this.data.minArea,
                    Max:this.data.maxArea
                }
            })
            if(this.data.minArea){
                this.setData({
                    areaText:this.data.minArea+'-'+this.data.maxArea+'m²'
                })
            }
        }else{
            this.setData({
                Scale:this.data.overScale,
            })
        }
        this.setData({
            isActive : "",
            area:this.data.areaText,
            PageIndex:1,
            rentLists:[],
        })
        wx.showLoading({
            title: '玩命加载中',
            mask:true
        })
        this.getRentLists();
    },
    //不限面积条件
    clearAreaFunc(){
        this.setData({
            area:'面积',
            areaText:'面积',
            areaActive:'',
            maxArea:'',
            minArea:'',
            Scale:{
                Min:'',
                Max:''
            }
        })
    },

    //点击一级业态
    firYTFunc(e){
        var child = e.currentTarget.dataset.child,
            itemid = e.currentTarget.dataset.itemid;
        this.setData({
            isYTActive1:itemid
        })
        if(child.length){
            this.setData({
                secYT:child,
                YTWid:['50%','49%'],
            })
        }
        if(!itemid){
            this.setData({
                secYT:[],
                operationText:'业态',
                operation:'',
                YTWid:['100%','0'],
                rentLists:[],
                PageIndex:1,
                isActive:'',
            })
            wx.showLoading({
                title: '玩命加载中',
                mask:true
            })
            this.getRentLists();
        }
    },
    //点击二级业态
    secYTFunc(e){
        var itemid = e.currentTarget.dataset.itemid,
            itemvalue = e.currentTarget.dataset.itemvalue,
            itemname = e.currentTarget.dataset.itemname;
        this.setData({
            isYTActive2:itemid,
            operation:itemvalue,
            operationText:itemname,
            rentLists:[],
            PageIndex:1,
            isActive:'',
        })
        wx.showLoading({
            title: '玩命加载中',
            mask:true
        })
        this.getRentLists();
    },

    //输入最小月租金
    iptMinMR(e){
        this.setData({
            minMR: e.detail.value
        })
    },
    //输入最大月租金
    iptMaxMR(e){
        this.setData({
            maxMR: e.detail.value
        })
    },
    //聚焦日租金输入框
    focusMR(){
        this.setData({
            MRActive:''
        })
    },
    //点击月租金选项
    itemMRFunc(e){
        this.setData({
            MRActive:e.currentTarget.dataset.id,
            minMR:'',
            maxMR:'',
            overMonthPrice:{
                Min:e.currentTarget.dataset.property1,
                Max:e.currentTarget.dataset.property2
            },
            priceText:e.currentTarget.dataset.itemname
        })
    },
    //点击月租金确认
    screenPriceFunc(){
        if(!this.data.MRActive){
            if(this.data.maxMR<this.data.minMR){
                var maxMR = this.data.minMR;
                var minMR = this.data.maxMR || 0;
                this.setData({
                    maxMR:maxMR,
                    minMR:minMR
                })
            }
            this.setData({
                MonthPrice:{
                    Min:this.data.minMR,
                    Max:this.data.maxMR
                }
            })
            if(this.data.minMR){
                this.setData({
                    priceText:this.data.minMR+'-'+this.data.maxMR+'元'
                })
            }
        }else{
            this.setData({
                MonthPrice:this.data.overMonthPrice
            })
        }
        this.setData({
            isActive : "",
            price:this.data.priceText,
            PageIndex:1,
            rentLists:[],
        })
        if(!this.data.MRActive && !this.data.minMR && !this.data.maxMR){
            this.setData({
                price:'',
            })
        }
        wx.showLoading({
            title: '玩命加载中',
            mask:true
        })
        this.getRentLists();
    },
    //不限价格条件
    clearPriceFunc(){
        this.setData({
            price:'价格',
            priceText:'价格',
            MRActive:'',
            maxMR:'',
            minMR:'',
            MonthPrice:{
                Min:'',
                Max:''
            }
        })
    },
    //点击排序筛选
    screenSortFunc(e){
        var Sort = {
            Field:e.currentTarget.dataset.field,
            IsASC:e.currentTarget.dataset.isasc
        }
        this.setData({
            isActive : "",
            isScreenSort : e.currentTarget.dataset.type,
            Sort:Sort,
            PageIndex:1,
            rentLists:[]
        })
        wx.showLoading({
            title: '玩命加载中',
            mask:true
        })
        this.getRentLists();
    }
})
