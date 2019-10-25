var charts= {
      ///画仪表盘
      renderJustGage:function(renderOption){
          var ggChart= new JustGage({
                id: renderOption.id,
                value:renderOption.value,
                defaults: {
                        min: renderOption.min || 0,
                        max: renderOption.max || 100,
                        donut: true,
                        gaugeWidthScale: 0.6,
                        counter: true,
                        hideInnerShadow: true
                }
            });
      },
      ///画Donut图
     render3dDonut: function (renderOption) {
         ///没有发现容器
         if (!renderOption.chartContainer) return;
         /// 没有数据
         if (!renderOption.data) return;
         Highcharts.chart(renderOption.chartContainer, {
                            chart: {
                                height:renderOption.height || 300,
                                type: 'pie',
                                options3d: {enabled: true,alpha: 45}
                            },
                            title:renderOption.title? {text: renderOption.title}:null,
                            subtitle:renderOption.subtitle? {text:enderOption.subtitle}:null,
                            plotOptions: {pie: {innerSize: 100,depth: 45}},
                            series: [{
                                name: renderOption.serialName || 'serialName',
                                data: renderOption.data,
                                // [
                                //     ['Bananas', 8],
                                //     ['Kiwi', 3],
                                //     ['Mixed nuts', 1],
                                //     ['Oranges', 6],
                                //     ['Apples', 8],
                                //     ['Pears', 4],
                                //     ['Clementines', 4],
                                //     ['Reddish (bag)', 1],
                                //     ['Grapes (bunch)', 1]
                                // ]
                            }]
                        });
     },
     ///绘制线图
     renderLineChart:function(renderOption){
         ///没有发现容器
         if (!renderOption.chartContainer) return;
         /// 没有数据
         if (!renderOption.series) return;
         Highcharts.chart(renderOption.chartContainer, {
                    chart: {type: 'line',height:renderOption.height || 300},
                    title: renderOption.title?{text:renderOption.title}:null,
                    subtitle:renderOption.subtitle? {text:enderOption.subtitle}:null,
                    xAxis: {categories: renderOption.xAxis.categories},
                            //['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
                    yAxis: {title: {text: renderOption.yAxis.title || 'Missing yAxis Title'}},
                    plotOptions: {
                            line: { dataLabels: {enabled: true},
                            enableMouseTracking: false
                        }
                    },
                    series:renderOption.series 
                    // [{
                    //     name: 'Tokyo',
                    //     data: [7.0, 6.9, 9.5, 14.5, 18.4, 21.5, 25.2, 26.5, 23.3, 18.3, 13.9, 9.6]
                    // }, {
                    //     name: 'London',
                    //     data: [3.9, 4.2, 5.7, 8.5, 11.9, 15.2, 17.0, 16.6, 14.2, 10.3, 6.6, 4.8]
                    // }]
                });
     },
     ///绘制柱状图
     renderBarChart:function(renderOption){
         ///没有发现容器
         if (!renderOption.chartContainer) return;
         /// 没有数据
         if (!renderOption.series) return;
         Highcharts.chart(renderOption.chartContainer, {
                    chart: {type: 'column',height:renderOption.height || 300},
                    title: renderOption.title?{text:renderOption.title}:null,
                    subtitle:renderOption.subtitle? {text:enderOption.subtitle}:null,
                    xAxis: {
                        type: 'category',
                        labels: {rotation: -45,
                                style: {fontSize: '10px',fontFamily: 'Verdana, sans-serif'}
                        }
                    },
                   
                    yAxis: {min:0,title: {text: renderOption.yAxis.title || 'Missing yAxis Title'}},
                    legend: {enabled: renderOption.legend==null?false:renderOption.legend },
                    tooltip:{pointFormat: '<b>{point.y:.1f}</b>'},
                    series: 
                    [{
                            name: renderOption.series.name || '',
                            data: renderOption.series.data,
                            // [
                            //     ['Shanghai', 23.7],
                            //     ['Lagos', 16.1],
                            //     ['Istanbul', 14.2],
                            //     ['Karachi', 14.0],
                            //     ['Mumbai', 12.5],
                            //     ['Moscow', 12.1],
                            //     ['São Paulo', 11.8],
                            //     ['Beijing', 11.7],
                            //     ['Guangzhou', 11.1],
                            //     ['Delhi', 11.1],
                            //     ['Shenzhen', 10.5],
                            //     ['Seoul', 10.4],
                            //     ['Jakarta', 10.0],
                            //     ['Kinshasa', 9.3],
                            //     ['Tianjin', 9.3],
                            //     ['Tokyo', 9.0],
                            //     ['Cairo', 8.9],
                            //     ['Dhaka', 8.9],
                            //     ['Mexico City', 8.9],
                            //     ['Lima', 8.9]
                            // ],
                            dataLabels: {
                                enabled: true,
                                rotation: -90,
                                color: '#FFFFFF',
                                align: 'right',
                                format: '{point.y}', // one decimal
                                y: 10, // 10 pixels down from the top
                                style: {fontSize: '13px',fontFamily: 'Verdana, sans-serif'}
                            }
                        }]
                });
     },
     ///绘制柱状+线条图的组合图
     renderCombinationForBarWithLine:function(renderOption){
         ///没有发现容器
         if (!renderOption.chartContainer) return;
         /// 没有数据
         if (!renderOption.series) return;
         Highcharts.chart(renderOption.chartContainer, {
                chart: {zoomType: 'xy', height:renderOption.height || 300},
                title: renderOption.title?{text:renderOption.title}:null,
                subtitle:renderOption.subtitle? {text:enderOption.subtitle}:null,
                xAxis: [{
                    categories: renderOption.categories,
                    crosshair: true,
                    labels: {rotation: -45,style: {fontSize: '9px',fontFamily: 'Verdana, sans-serif'}}
                }],
                yAxis: [{ // Primary yAxis
                    labels: {format: '{value}',
                        style: {color: Highcharts.getOptions().colors[0]}
                    },
                    title: {
                        text: renderOption.yAxis[0].title,
                        style: {color: Highcharts.getOptions().colors[0]}
                    }
                }, { // Secondary yAxis
                    title: {
                        text: renderOption.yAxis[1].title,
                        style: {color: Highcharts.getOptions().colors[1]}
                    },
                    labels: {
                        format: '{value}',
                        style: {color: Highcharts.getOptions().colors[1]}
                    },
                    opposite: true
                }],
                tooltip: {shared: true},
                legend: {
                    layout: 'vertical',
                    align: 'left',
                    x: 120,
                    verticalAlign: 'top',
                    y: 100,
                    floating: true,
                    backgroundColor: (Highcharts.theme && Highcharts.theme.legendBackgroundColor) || '#FFFFFF'
                },
                series: renderOption.series
                /*[{
                    name: 'Rainfall',
                    type: 'column',
                    yAxis: 1,
                    data: [49.9, 71.5, 106.4, 129.2, 144.0, 176.0, 135.6, 148.5, 216.4, 194.1, 95.6, 54.4]
                    //tooltip: {valueSuffix: ' mm'}

                },{
                    name: 'Rainfall1',
                    type: 'column',
                    yAxis: 1,
                    data: [49.9, 71.5, 106.4, 129.2, 144.0, 176.0, 135.6, 148.5, 216.4, 194.1, 95.6, 54.4]
                    //tooltip: {valueSuffix: ' mm'}

                }, {
                    name: 'Temperature',
                    type: 'spline',
                    data: [7.0, 6.9, 9.5, 14.5, 18.2, 21.5, 25.2, 26.5, 23.3, 18.3, 13.9, 9.6],
                    //tooltip: {valueSuffix: '°C'}
                }]*/
            });
     },
     ///绘制柱状图
     renderMutilBarChart:function(renderOption){
         ///没有发现容器
         if (!renderOption.chartContainer) return;
         /// 没有数据
         if (!renderOption.series) return;
         Highcharts.chart(renderOption.chartContainer, {
                    chart: {type: 'column',height:renderOption.height || 300},
                    title: renderOption.title?{text:renderOption.title}:null,
                    subtitle:renderOption.subtitle? {text:enderOption.subtitle}:null,
                    xAxis: {
                        categories: renderOption.categories,
                        crosshair: true,
                        labels: {rotation: -45,style: {fontSize: '9px',fontFamily: 'Verdana, sans-serif'}
                        }
                    },
                    yAxis: {min:0,title: {text: renderOption.yAxis.title || 'Missing yAxis Title'}},
                    legend: {enabled: renderOption.legend==null?false:renderOption.legend },
                    tooltip: {
                        headerFormat: '<span style="font-size:10px">{point.key}</span><table>',
                        pointFormat: '<tr><td style="color:{series.color};padding:0">{series.name}: </td>' +
                            '<td style="padding:0"><b>{point.y}</b></td></tr>',
                        footerFormat: '</table>',
                        shared: true,
                        useHTML: true
                    },
                    plotOptions: {column: {pointPadding: 0.2,borderWidth: 0}},           
                    series: renderOption.series
                });
     },
     ///绘制饼图
     renderPieChart:function(renderOption){
         ///没有发现容器
         if (!renderOption.chartContainer) return;
         /// 没有数据
         if (!renderOption.series.data) return;
         //if (renderOption.plotOptions==null) renderOption.plotOptions={};
         var chart = Highcharts.chart(renderOption.chartContainer, {
                    chart: {
                        height:renderOption.height || 300,
                        plotBackgroundColor: null,
                        plotBorderWidth: null,
                        plotShadow: false,
                        type: 'pie'
                    },
                    title: renderOption.title?{text:renderOption.title}:null,
                    subtitle:renderOption.subtitle? {text:enderOption.subtitle}:null,
                    tooltip: {pointFormat: '<b>{point.percentage:.1f} %</b>'},
                    plotOptions: {
                        pie: {
                            allowPointSelect:true,
                            cursor: 'pointer',
                            dataLabels:{
                                enabled: true,
                                format: '<b>{point.name}</b>: {point.y}',
                                style: {color: (Highcharts.theme && Highcharts.theme.contrastTextColor) || 'black' }
                            }
                        }
                    },
                    series: 
                     [{
                        name: renderOption.series.name || 'Pie Item',
                        colorByPoint: renderOption.series.colorByPoint==null?true:renderOption.series.colorByPoint,
                        data: renderOption.series.data
                        // data: [{
                        //     name: 'Microsoft Internet Explorer',
                        //     y: 56.33
                        // }, {
                        //     name: 'Chrome',
                        //     y: 24.03,
                        //     sliced: true,
                        //     selected: true
                        // }, {
                        //     name: 'Firefox',
                        //     y: 10.38
                        // }, {
                        //     name: 'Safari',
                        //     y: 4.77
                        // }, {
                        //     name: 'Opera',
                        //     y: 0.91
                        // }, {
                        //     name: 'Proprietary or Undetectable',
                        //     y: 0.2
                        // }]
                    }]
                   
                });
                //chart.setSize(300, 200)
     }

}