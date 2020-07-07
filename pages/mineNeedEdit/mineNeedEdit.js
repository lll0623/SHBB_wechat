const app = getApp()

Page({
    data: {
        Images:[],
        array: [],//经营类型
        BrandType:[],
        index: 0,

        multiArray: [
            // ['无脊柱动物', '脊柱动物'],
            // ['扁性动物', '线形动物', '环节动物', '软体动物', '节肢动物']
        ],
        multiIndex: [0, 0],
        Format:[
            [],
            []
        ],

        //找铺
        Brand:'',
        OperateType:'',
        FormatCategory:'',
        Format:'',
        AreaMin:'',
        AreaMax:'',
        AreaMax:'',
        DayRentMin:'',
        DayRentMax:'',
    },
    onLoad() {
        if(app.globalData.SourceId){
            wx.showLoading({
                title: '加载中...',
                mask: true
            });
            //获取经营类型
            this.getData()
        }
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
})
