const app = getApp()
Page({
    data: {
        isLogin: false,
        isShow: false,
        tab: 1,
        //招租
        Region:[],
        RegionArr:[],//行政区
        RegionIndex:0,
        Road:[],
        RoadArr:[],//道路
        RoadIndex:0,
        HourseNumber:'',//门牌号
        ProjectName: '',
        Area: '',
        MonthRent: '',
        TransferFee: '',
        Images: [],
        uploadImages:[],

        array: [],//经营类型
        BrandType:[],
        index: 0,

        multiArray: [],
        multiIndex: [0, 0],
        Format:[
            [],
            []
        ],

        //找铺
        Brand:'',
        Format:'',
        AreaMin:'',
        AreaMax:'',
        AreaMax:'',
        DayRentMin:'',
        DayRentMax:'',
    },
    onLoad(options) {
        //获取行政区
        this.getRegion()
        if(!app.globalData.SourceId){//是否发布过 我要找铺
            wx.showLoading({
                title: '加载中...',
                mask: true
            });
            //获取经营类型
            this.getData()
        }
    },
    //获取行政区
    getRegion(){
        app.wxRequest({
            method:'GET',
            url:'/Area/GetArea',
        },res=>{
            var _RegionArr = [];
            for(var i=0;i<res.data.Data.length;i++){
                _RegionArr.push(res.data.Data[i].AreaName)
            }
            this.setData({
                Region:res.data.Data,
                RegionArr:_RegionArr
            })
            //获取道路
            this.getRoad(this.data.Region[0]['AreaCode'])
        });
    },
    RegionChange(e){
        this.setData({
            RegionIndex: e.detail.value
        })
        this.getRoad(this.data.Region[e.detail.value]['AreaCode'])
    },
    //获取道路
    getRoad(areaCode){
        app.wxRequest({
            method:'POST',
            url:'/Area/GetRoad',
            data:{
                areaCode:areaCode
            }
        },res=>{
            var _RoadArr = [];
            for(var i=0;i<res.data.Data.length;i++){
                _RoadArr.push(res.data.Data[i].RoadName)
            }
            this.setData({
                Road:res.data.Data,
                RoadArr:_RoadArr
            })
        });
    },
    RoadChange(e){
        this.setData({
            RoadIndex: e.detail.value
        })
    },
    //输入门牌号
    iptRentHourseNumber(e){
        this.setData({
            HourseNumber: e.detail.value
        })
    },
    tabFunc(e) {
        var title = '我要招租',
            tab = e.currentTarget.dataset.tab;
        if(tab == 2 && app.globalData.SourceId){
            wx.navigateTo({
               url: '../mineNeed/mineNeed'
            });
        }else{
            this.setData({
                tab: tab
            })
            if(tab == 1){
                title = '我要招租'
            }else{
                title = '我要找铺'
            }
            wx.setNavigationBarTitle({
                title: title
            })
        }
    },
    iptRentProName(e) {
        this.setData({
            ProjectName: e.detail.value
        })
    },
    iptRentAddress(e) {
        this.setData({
            Address: e.detail.value
        })
    },
    iptRentArea(e) {
        this.setData({
            Area: e.detail.value
        })
    },
    iptMonthRent(e) {
        this.setData({
            MonthRent: e.detail.value
        })
    },
    iptTransferFee(e) {
        this.setData({
            TransferFee: e.detail.value
        })
    },
    addImg() {
        wx.chooseImage({
            count:1,
            sizeType: ['original', 'compressed'], //可选择原图或压缩后的图片
            sourceType: ['album', 'camera'], //可选择性开放访问相册、相机
            success: res => {
                const Images = this.data.Images.concat(res.tempFilePaths)
                if (Images.length > 3) {
                    wx.showToast({
                        title: '图片上传不能超过三张！',
                        duration: 2500,
                        icon: 'none',
                        mask: true
                    })
                    return false
                }
                // 限制最多只能留下3张照片
                var ImagesArray;
                ImagesArray = Images.length <= 3 ? Images : Images.slice(0, 3)
                this.setData({
                    Images: ImagesArray,
                });
                wx.showLoading({
                    title: '上传中...',
                    mask:true
                })
                console.log(res)
                wx.uploadFile({
                    url: app.baseUrl+'/File/Save',
                    filePath: res.tempFilePaths[0],
                    name: 'file',
                    formData: {
                        'user': 'test'
                    },
                    header: {
                        "Content-Type": "multipart/form-data"
                    },
                    success:res=>{
                        const uploadImages = this.data.uploadImages.concat(JSON.parse(res.data).Data)
                        this.setData({
                            uploadImages: uploadImages
                        });
                        wx.hideLoading()
                    }
                })
            }
        })
    },
    //预览
    handleImagePreview(e) {
        const idx = e.target.dataset.idx
        const Images = this.data.Images
        wx.previewImage({
            current: Images[idx], //当前预览的图片
            urls: Images, //所有要预览的图片
        })
    },
    deleteImg(e) {
        var Images = this.data.Images,
            uploadImages = this.data.uploadImages;
        Images.splice(e.currentTarget.dataset.index, 1)
        uploadImages.splice(e.currentTarget.dataset.index,1)
        this.setData({
            Images: Images,
            uploadImages:uploadImages
        })
    },
    addRentFunc() {
        if (!this.data.ProjectName) {
            wx.showToast({
                title: '请输入商业项目名称',
                icon: 'none',
                duration: 2500
            })
            return false;
        }
        if (!this.data.HourseNumber) {
            wx.showToast({
                title: '请输入门牌号',
                icon: 'none',
                duration: 2500
            })
            return false;
        }
        if (!this.data.Area) {
            wx.showToast({
                title: '请输入面积',
                icon: 'none',
                duration: 2500
            })
            return false;
        }
        if (!this.data.MonthRent) {
            wx.showToast({
                title: '请输入月租金',
                icon: 'none',
                duration: 2500
            })
            return false;
        }
        if (!this.data.TransferFee) {
            wx.showToast({
                title: '请输入转让费',
                icon: 'none',
                duration: 2500
            })
            return false
        }
        if (this.data.uploadImages.length != 3) {
            wx.showToast({
                title: '请上传三张商铺图片',
                icon: 'none',
                duration: 2500
            })
            return false
        }
        wx.showLoading({
            title: '提交中，请稍等...',
            mask:true
        })
        app.wxRequest({
            method: 'POST',
            url: '/PreUnit/AddPreUnit',
            data: {
                ProjectName: this.data.ProjectName,
                Province:'上海市',
                ProvinceCode:'310000',
                City:'上海市',
                CityCode:'310100',
                Area:this.data.Region[this.data.RegionIndex]['AreaName'],//区域
                AreaCode:this.data.Region[this.data.RegionIndex]['AreaCode'],//区域编号
                Road:this.data.Road[this.data.RoadIndex]['RoadName'],//道路
                RoadCode:this.data.Road[this.data.RoadIndex]['RoadCode'],//道路编号
                HourseNumber:this.data.HourseNumber,//门牌号
                ConstructionArea: this.data.Area,
                MonthRent: this.data.MonthRent,
                TransferFee: this.data.TransferFee,
                PicList: this.data.uploadImages.join(',')
            },
            token: app.globalData.token
        }, function(res) {
            if(res.data.Status == 200){
                wx.hideLoading()
                wx.showToast({
                    title: '提交成功',
                    duration: 2500,
                    icon: 'success',
                    mask: true
                })
                setTimeout(()=>{
                    wx.navigateBack({
                        delta: 1
                    })
                },600)
            }else{
                wx.showToast({
                    title: res.data.Message,
                    duration: 2500,
                    icon: 'none',
                    mask: true
                })
            }
        })
    },

    //我要找铺
    //获取词典
    getData(){
        app.wxRequest({
            method:'POST',
            url:'/DataItem/GetItems',
            data:{
                keys:['Ls.Ag.BrandType','Ls.Ag.Format']
            }
        },res=>{
            wx.hideLoading();
            if(res.data.Data){
                var array = [],
                    multiArray = [
                        [],
                        []
                    ],
                    resArray1 = res.data.Data['Ls.Ag.BrandType'],
                    resArray2 =res.data.Data['Ls.Ag.Format'];
                for(var i=0;i<resArray1.length;i++){
                    array.push(resArray1[i]['ItemName'])
                }
                for(var i=0;i<resArray2.length;i++){
                    multiArray[0].push(resArray2[i]['ItemName']);
                }
                for(var i=0;i<resArray2[0].Children.length;i++){
                    multiArray[1].push(resArray2[0]['Children'][i]['ItemName']);
                }
                this.setData({
                    array:array,
                    BrandType:resArray1,
                    multiArray:multiArray,
                    Format:resArray2
                })
            }
        });
    },
    bindPickerChange(e) {
        this.setData({
            index: e.detail.value
        })
    },
    bindMultiPickerChange(e) {
        this.setData({
            multiIndex: e.detail.value
        })
    },
    bindMultiPickerColumnChange(e) {
        var data = {
            multiArray: this.data.multiArray,
            multiIndex: this.data.multiIndex
        };
        data.multiIndex[e.detail.column] = e.detail.value;
        // switch (e.detail.column) {
        //     case 0:
        //         switch (data.multiIndex[0]) {
        //             case 0:
        //                 data.multiArray[1] = ['扁性动物', '线形动物', '环节动物', '软体动物', '节肢动物'];
        //                 break;
        //             case 1:
        //                 data.multiArray[1] = ['鱼', '两栖动物', '爬行动物'];
        //                 break;
        //         }
        //         data.multiIndex[1] = 0;
        //         break;
        // }
        switch (e.detail.column) {
            case 0:
                var _Array = [];
                for(var i=0;i<this.data.Format[e.detail.value].Children.length;i++){
                    _Array.push(this.data.Format[e.detail.value].Children[i].ItemName)
                }
                data.multiArray[1] = _Array
            break;
        }
        this.setData(data);
    },
    iptBrand(e){
        this.setData({
            Brand:e.detail.value
        })
    },
    iptAreaMin(e){
        this.setData({
            AreaMin:e.detail.value
        })
    },
    iptAreaMax(e){
        this.setData({
            AreaMax:e.detail.value
        })
    },
    iptDayRentMin(e){
        this.setData({
            DayRentMin:e.detail.value
        })
    },
    iptDayRentMax(e){
        this.setData({
            DayRentMax:e.detail.value
        })
    },
    addUserDemand(){
        if (!this.data.Brand) {
            wx.showToast({
                title: '请输入品牌',
                icon: 'none',
                duration: 2500
            })
            return false;
        }
        if (!this.data.AreaMin || !this.data.AreaMax) {
            wx.showToast({
                title: '请输入需求面积',
                icon: 'none',
                duration: 2500
            })
            return false;
        }
        if (!this.data.DayRentMin || !this.data.DayRentMax) {
            wx.showToast({
                title: '请输入日租金',
                icon: 'none',
                duration: 2500
            })
            return false;
        }
        wx.showLoading({
            title: '提交中，请稍等...',
            mask:true
        })
        app.wxRequest({
            method: 'POST',
            url: '/PreCust/AddPreCust',
            data: {
                preCust:{
                    Brand: this.data.Brand,
                    BrandType: this.data.BrandType[this.data.index]['ItemValue'],
                    FormatCategory: this.data.Format[this.data.multiIndex[0]]['ItemValue'],
                    Format: this.data.Format[this.data.multiIndex[0]]['Children'][this.data.multiIndex[1]]['ItemValue'],
                    AreaMin:this.data.AreaMin,
                    AreaMax:this.data.AreaMax,
                    PriceMin:this.data.DayRentMin,
                    PriceMax:this.data.DayRentMax
                }
            },
            token: app.globalData.token
        }, function(res) {
            if(res.data.Status == 200){
                wx.hideLoading()
                wx.showToast({
                    title: '提交成功',
                    duration: 2500,
                    icon: 'success',
                    mask: true
                })
                //发布需求成功
                app.globalData.SourceId = true
                wx.setStorageSync('SourceId', true);
                setTimeout(()=>{
                    wx.navigateBack({
                        delta: 1
                    })
                },600)
            }else{
                wx.showToast({
                    title: res.data.Message,
                    duration: 2500,
                    icon: 'none',
                    mask: true
                })
            }
        })
    }
})
