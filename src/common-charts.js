$(function(){
    var CommonCharts = {}

    var TEMPLATE = $('#template').text()

    var selectorBuilder = function (metric, cb) {
        var selector = metric.selector
        var key = metric.key
        var name = metric.name
        var res = {
            type: 'select',
            key: key,
            name: name,
            default: metric.default,
            selector: []
        }
        if (typeof selector == 'function') {
            setTimeout(function () {
                selector(function (err, t) {
                    if (err) {
                        return cb(err)
                    } else {
                        res.selector = t
                        cb(null, res)
                    }
                })
            }, 0)
        } else if (typeof selector == 'object') {
            setTimeout(function () {
                res.selector = selector
                cb(null, res)
            }, 0)
        } else if (typeof selector == 'string') {
            setTimeout(function () {
                res.type = selector
                cb(null, res)
            }, 0)
        } else {
            setTimeout(function () {
                cb(null, res)
            }, 0)
        }
    }

    var generateSelectors = function (metrics, cb) {
        async.map(metrics, function (metric, cb) {
            selectorBuilder(metric, cb)
        }, function (err, selectors) {
            if (err) {
                return cb(err)
            }
            cb(null, selectors)
        })
    }

    var renderResult = function (container, data, translateMap) {
        console.log(data)
        var serie = []
        var category = []
        for (var i = 0; i < data.data.length; i++) {
            var c = []
            for (var j = 0; j < data.header.length; j++) {
                if (data.header[j] == 'value') {
                    serie.push(data.data[i][j])
                } else {
                    if (translateMap[data.header[j]] && translateMap[data.header[j]][data.data[i][j]]) {
                        c.push(translateMap[data.header[j]][data.data[i][j]])
                    } else {
                        c.push(data.data[i][j])
                    }
                }
            }
            category.push(c.join('-'))
        }
        console.log(serie)
        console.log(category)
        option =  {
            title : {
                text: '查询结果'
            },
            tooltip : {
                trigger: 'axis'
            },
            calculable : true,
            xAxis : [
                {
                    type : 'category',
                    data : category
                }
            ],
            yAxis : [
                {
                    type : 'value'
                }
            ],
            series : [
                {
                    type: 'bar',
                    data: serie
                }
            ]
        }
        echarts.init(container.get()).setOption(option)
        
    }

    var buildApp = function (container, dataGenerator, translateMap) {
        // container is a jquery object
        // dataGenerator is a function
        var selectors = container.find('select').select2({
            width: 181
        })
        var inputs = container.find('.selector')
        var dimensionsInput = container.find('.dimension')
        var displayGround = container.find('.chart-container')
        container.find('.btn').click(function () {
            var filters = []
            var dimensions = []
            selectors.each(function () {
                var values = $(this).val()
                var filter = [$(this).data('key')]
                if (values && values.length > 0) {
                    filters.push(filter.concat(values))
                }
            })
            inputs.each(function () {
                var value = $(this).val()
                if (value) {
                    filters.push([$(this).data('key'), value])
                }
            })
            dimensionsInput.each(function () {
                var key = $(this).data('key')
                if ($(this).prop('checked')) {
                    dimensions.push(key)
                }
            })
            dataGenerator(filters, dimensions, function (err, data) {
                if (err) {
                    return alert(err)
                }
                renderResult(displayGround, data, translateMap)
            })
        })
    }

    CommonCharts.create = function (options) {
        var container = $(options.container)

        generateSelectors(options.metrics, function (err, selectors) {
            if (err) {
                return console.error(err)
            }
            console.log(selectors)
            var html = ejs.render(TEMPLATE, {
                selectors: selectors
            })
            container.html(html)
            var translateMap = {}
            for (var i = 0; i < selectors.length; i ++) {
                if (selectors[i].type == 'select') {
                    translateMap[selectors[i].key] = {}
                    for (var j = 0; j < selectors[i].selector.length; j++) {
                        translateMap[selectors[i].key][selectors[i].selector[j].id] = selectors[i].selector[j].name
                    }
                }
            }
            buildApp(container, options.data, translateMap)
        })
    }

    window.CommonCharts = CommonCharts
})