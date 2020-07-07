const app = getApp()

Page({
    data: {
        searchKey:'',
        proLists:[],
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
        //更多
        more:'',
        //项目状态
        proSLists:[],
        proSActive:'',
        overProjectStatus:'',
        ProjectStatus:'',
        //项目类型
        proTLists:[],
        proTActive:'',
        overProjectType:'',
        ProjectType:'',
        //建筑类型
        buildTLists:[],
        buildTActive:"",
        overBuildType:'',
        BuildType:'',
    },
    onLoad(option) {
        if(option.searchKey){
            this.setData({
                searchKey:option.searchKey
            })
        }
        wx.getSystemInfo({
            success:(res)=> {
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
        this.getProLists();
        //获取区域
        this.getRegion();
        //获取词典数据
        this.getScreenData();
    },
    getProLists(){
        //获取项目列表
        app.wxRequest({
            method:'POST',
            url:'/AgProject/QueryProjectList',
            data:{
                SearchKey:this.data.searchKey,
                PageSize:this.data.PageSize,
                PageIndex:this.data.PageIndex,
                AreaCode:this.data.AreaCode,
                Area:this.data.Scale,
                FormatCode:this.data.operation,
                ProjectStatus:this.data.ProjectStatus,
                ProjectType:this.data.ProjectType,
                BuildType:this.data.BuildType,
                Sort:this.data.Sort
            }
        },res=>{
            if(res.data.Data){
                if(res.data.Data.Data.length<10){
                    this.setData({
                        noMore:true
                    })
                }else{
                    this.setData({
                        noMore:false
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
                this.getProLists()
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
               url: "../search/search?type=2"
            });
        }
    },
    //跳转到商铺详情页
    goProDetail(e){
        wx.navigateTo({
           url: "../proDetail/proDetail?id="+e.currentTarget.dataset.id
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
                keys:['Ls.Ag.ConstructionArea','Ls.Ag.Format','Ls.Ag.ProjectStatus','Ls.Ag.ProjectType','Ls.Ag.BuildingType']
            }
        },res=>{
            if(res.data.Data){
                res.data.Data['Ls.Ag.Format'].unshift({Children:[],ItemId:'',ItemName:'不限'})
                this.setData({
                    areaLists:res.data.Data['Ls.Ag.ConstructionArea'],
                    firYT:res.data.Data['Ls.Ag.Format'],
                    proSLists:res.data.Data['Ls.Ag.ProjectStatus'],
                    proTLists:res.data.Data['Ls.Ag.ProjectType'],
                    buildTLists:res.data.Data['Ls.Ag.BuildingType']
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
                // proLists:[]
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
        //         proLists:[]
            })
        }
        // this.getProLists();
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
            proLists:[],
        })
        wx.showLoading({
            title: '玩命加载中',
            mask:true
        })
        this.getProLists();
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
            proLists:[],
        })
        wx.showLoading({
            title: '玩命加载中',
            mask:true
        })
        this.getProLists();
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
                proLists:[],
                PageIndex:1,
                isActive:'',
            })
            wx.showLoading({
                title: '玩命加载中',
                mask:true
            })
            this.getProLists();
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
            proLists:[],
            PageIndex:1,
            isActive:'',
        })
        wx.showLoading({
            title: '玩命加载中',
            mask:true
        })
        this.getProLists();
    },
    //更多

    //点击项目状态
    itemProSFunc(e){
        this.setData({
            proSActive:e.currentTarget.dataset.id,
            overProjectStatus:e.currentTarget.dataset.itemvalue,
        })
    },

    //点击项目类型
    itemProTFunc(e){
        this.setData({
            proTActive:e.currentTarget.dataset.id,
            overProjectType:e.currentTarget.dataset.itemvalue,
        })
    },

    //点击建筑类型
    itemBuildTFunc(e){
        this.setData({
            buildTActive:e.currentTarget.dataset.id,
            overBuildType:e.currentTarget.dataset.itemvalue,
        })
    },
    //不限更多条件
    clearMoreFunc(){
        this.setData({
            more:'',
            //项目状态
            proSActive:'',
            overProjectStatus:'',
            ProjectStatus:'',
            //项目类型
            proTActive:'',
            overProjectType:'',
            ProjectType:'',
            //建筑类型
            buildTActive:"",
            overBuildType:'',
            BuildType:'',
        })
    },
    //点击更多确认筛选
    screenMoreFunc(){
        this.setData({
            isActive : "",
            more:'更多',
            PageIndex:1,
            proLists:[],
            ProjectStatus:this.data.overProjectStatus,
            ProjectType:this.data.overProjectType,
            BuildType:this.data.overBuildType
        })
        if(!this.data.proSActive && !this.data.proTActive && !this.data.STActive && !this.data.buildTActive){
            this.setData({
                more:'',
            })
        }
        wx.showLoading({
            title: '玩命加载中',
            mask:true
        })
        this.getProLists();
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
            proLists:[]
        })
        wx.showLoading({
            title: '玩命加载中',
            mask:true
        })
        this.getProLists();
    }
})
