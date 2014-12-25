    $(function () {

        CommonCharts.create({
            'container': document.body,
            'metrics': [{
                key: 'city_id',
                name: '城市ID',
                selector: [{
                    id: '100032',
                    name: '北京'
                }]
            }, {
                key: 'name',
                name: '名称',
                selector: function (cb) {
                    // cb(err, selectorinfo)
                    setTimeout(function () {
                        cb(null, [{
                            id: 'xiaomi',
                            name: '小明'
                        }])
                    }, 100)
                }
            }, {
                key: 'age',
                name: '年纪',
                default: '12',
                selector: 'number' // input type, can be 'date', 'number', 'text'
            }, {
                key: 'date',
                name: '日期',
                default: '2014-12-02',
                selector: 'date' // input type, can be 'date', 'number', 'text' ..
            }],
            'data': function (filters, dimensions, cb) {
                // Filters is a array,
                // each item of filters is a array like : ['city_id', '100032', '1000021'].
                // Dimensions is a array like : ['city_id, 'name']
                console.log(filters)
                console.log(dimensions)
                setTimeout(function () {
                    cb(null, {
                        header: ['city_id', 'name', 'value'],
                        data: [['100031', 'xiaomi', 3323],['100032', 'xiaoyu', 43]]
                    })
                }, 500)
            }
        })
    })