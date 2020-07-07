const app = getApp()

Page({
    data: {
        searchKey:'',
        shopLists:[],
        PageSize:10,
        PageIndex:1,
        noMore:false,
        scrollTop:0,
        windowHeight:'',
        isActive:'',
        isScreenSort:'1',//排序筛选,
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
        //价格
        price:'',
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
        //日租金筛选数据
        DRLists:[],
        DRActive:'',
        minDR:'',
        maxDR:'',
        overPrice:{
            Min:'',
            Max:''
        },
        Price:{
            Min:'',
            Max:''
        },
        //更多
        more:'',
        //房源状态
        HTLists:[],
        HTActive:'',
        overHouseStatusId:'',
        HouseStatusId:'',
        //业态
        YTLists:[],
        YTActive:'',
        overPrjStatusId:'',
        PrjStatusId:'',
        //商铺类型
        STLists:[],
        STActive:'',
        overShopType:'',
        ShopType:'',
        //楼层区间
        floorLists:[],
        floorActive:'',
        minFloor:'',
        maxFloor:'',
        Floor:{
            Min:'',
            Max:'',
        }
    },
    onLoad(option) {
        if(option.searchKey){
            this.setData({
                searchKey:option.searchKey,

            })
        }
        wx.getSystemInfo({
            success: (res)=> {
                let clientHeight = res.windowHeight,
                    clientWidth = res.windowWidth,
                    rpxR = 750 / clientWidth;
                var calc = (clientHeight * rpxR);
                this.setData({    
                    windowHeight: clientHeight
                });
            }
        });
        wx.showLoading({
            title: '玩命加载中',
            mask:true
        })
        this.getShopLists();
        //获取词典数据
        this.getScreenData();
        // //获取区域
        this.getRegion();
    },
    getShopLists(){
        //获取商铺列表
        app.wxRequest({
            method:'POST',
            url:'/AgUnit/QueryAgUnitList',
            data:{
                SearchKey:this.data.searchKey,
                PageSize:this.data.PageSize,
                PageIndex:this.data.PageIndex,
                AreaCode:this.data.AreaCode,
                Scale:this.data.Scale,
                Price:this.data.Price,
                MonthPrice:this.data.MonthPrice,
                HouseStatusId:this.data.HouseStatusId,
                PrjStatusId:this.data.PrjStatusId,
                Floor:this.data.Floor,
                Sort:this.data.Sort
            }
        },res=>{
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
                this.getShopLists()
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
               url: "../search/search?type=1"
            });
        }
    },
    //跳转到商铺详情页
    goShopDetail(e){
        wx.navigateTo({
           url: "../shopDetail/shopDetail?id="+e.currentTarget.dataset.id
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
        var isActive = e.currentTarget.dataset.type
        this.setData({
            isActive : isActive
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
                keys:['Ls.Ag.ConstructionArea','Ls.Ag.MonthRent','Ls.Ag.DailyRent','Ls.Ag.UnitStatus','Ls.Ag.Format','Ls.Ag.UnitType','Ls.Ag.Floor']
            }
        },res=>{
            if(res.data.Data){
                this.setData({
                    areaLists:res.data.Data['Ls.Ag.ConstructionArea'],
                    MRLists:res.data.Data['Ls.Ag.MonthRent'],
                    DRLists:res.data.Data['Ls.Ag.DailyRent'],
                    HTLists:res.data.Data['Ls.Ag.UnitStatus'],
                    YTLists:res.data.Data['Ls.Ag.Format'],
                    STLists:res.data.Data['Ls.Ag.UnitType'],
                    floorLists:res.data.Data['Ls.Ag.Floor']
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
                // shopLists:[]
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
        //         shopLists:[]
            })
        }
        // this.getShopLists();
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
            shopLists:[],
        })
        wx.showLoading({
            title: '玩命加载中',
            mask:true
        })
        this.getShopLists();
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
            shopLists:[],
        })
        wx.showLoading({
            title: '玩命加载中',
            mask:true
        })
        this.getShopLists();
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
        })
    },

    //输入最小日租金
    iptMinDR(e){
        this.setData({
            minDR: e.detail.value
        })
    },
    //输入最大日租金
    iptMaxDR(e){
        this.setData({
            maxDR: e.detail.value
        })
    },
    //聚焦日租金输入框
    focusDR(){
        this.setData({
            DRActive:''
        })
    },
    //点击日租金筛选数据
    itemDRFunc(e){
        this.setData({
            DRActive:e.currentTarget.dataset.id,
            minDR:'',
            maxDR:'',
            overPrice:{
                Min:e.currentTarget.dataset.property1,
                Max:e.currentTarget.dataset.property2
            },
        })
    },
    //点击日租金月租金确认
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
        }else{
            this.setData({
                MonthPrice:this.data.overMonthPrice
            })
        }
        if(!this.data.DRActive){
            if(this.data.maxDR<this.data.minDR){
                var maxDR = this.data.minDR;
                var minDR = this.data.maxDR || 0;
                this.setData({
                    maxDR:maxDR,
                    minDR:minDR
                })
            }
            this.setData({
                Price:{
                    Min:this.data.minDR,
                    Max:this.data.maxDR
                }
            })
        }else{
            this.setData({
                Price:this.data.overPrice
            })
        }

        this.setData({
            isActive : "",
            price:'价格',
            PageIndex:1,
            shopLists:[],
        })
        if(!this.data.MRActive && !this.data.DRActive && !this.data.minDR && !this.data.maxDR && !this.data.minMR && !this.data.maxMR){
            this.setData({
                price:'',
            })
        }
        wx.showLoading({
            title: '玩命加载中',
            mask:true
        })
        this.getShopLists();
    },
    //不限价格条件
    clearPriceFunc(){
        this.setData({
            price:'',
            MRActive:'',
            DRActive:'',
            maxMR:'',
            minMR:'',
            maxDR:'',
            minDR:'',
            Price:{
                Min:'',
                Max:''
            },
            MonthPrice:{
                Min:'',
                Max:''
            }
        })
    },

    //更多
    //点击房源状态筛选数据
    itemHTFunc(e){
        this.setData({
            HTActive:e.currentTarget.dataset.id,
            overHouseStatusId:e.currentTarget.dataset.itemvalue
        })
    },

    //点击业态筛选数据
    itemYTFunc(e){
        this.setData({
            YTActive:e.currentTarget.dataset.id,
            overPrjStatusId:e.currentTarget.dataset.itemvalue
        })
    },

    //点击商铺类型筛选数据
    itemSTFunc(e){
        this.setData({
            STActive:e.currentTarget.dataset.id,
            overShopType:e.currentTarget.dataset.itemvalue
        })
    },

    //输入最小楼层
    iptMinFloor(e){
        this.setData({
            minFloor: e.detail.value
        })
    },
    //输入最大楼层
    iptMaxFloor(e){
        this.setData({
            maxFloor: e.detail.value
        })
    },
    //聚焦楼层输入框
    focusFloor(){
        this.setData({
            floorActive:''
        })
    },
    //点击楼层筛选数据
    itemFloorFunc(e){
        this.setData({
            floorActive:e.currentTarget.dataset.id,
            minFloor:'',
            maxFloor:'',
            Floor:{
                Min:e.currentTarget.dataset.property1,
                Max:e.currentTarget.dataset.property2
            },
        })
    },
    //不限更多条件
    clearMoreFunc(){
        this.setData({
            more:'',
            HTActive:'',
            HouseStatusId:'',
            YTActive:'',
            PrjStatusId:'',
            STActive:'',
            ShopType:'',
            floorActive:'',
            minFloor:'',
            maxFloor:'',
            Floor:{
                Min:'',
                Max:'',
            }
        })
    },
    //点击更多确认筛选
    screenMoreFunc(){
        if(!this.data.floorActive){
            if(this.data.maxFloor<this.data.minFloor){
                var maxFloor = this.data.maxFloor;
                var minFloor = this.data.minFloor || 0;
                this.setData({
                    maxFloor:maxFloor,
                    minFloor:minFloor
                })
            }
            this.setData({
                Floor:{
                    Min:this.data.minFloor,
                    Max:this.data.maxFloor
                }
            })
        }

        this.setData({
            isActive : "",
            more:'更多',
            PageIndex:1,
            shopLists:[],
            HouseStatusId:this.data.overHouseStatusId,
            PrjStatusId:this.data.overPrjStatusId,
            ShopType:this.data.overShopType
        })
        if(!this.data.HTActive && !this.data.YTActive && !this.data.STActive && !this.data.floorActive && !this.data.minFloor && !this.data.maxFloor){
            this.setData({
                more:'',
            })
        }
        wx.showLoading({
            title: '玩命加载中',
            mask:true
        })
        this.getShopLists();
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
            shopLists:[]
        })
        wx.showLoading({
            title: '玩命加载中',
            mask:true
        })
        this.getShopLists();
    }
})
