var statisticalApp = angular.module("statisticalApp",['ui.bootstrap','BaseServices','highcharts-ng']);
statisticalApp.controller("serviceReqCtrl",['$scope','BaseService',function($scope,BaseService){
    $scope.totalConfig = {
        "options":{
            "chart":{
                "type":"column"
            },
            legend: {
                enabled:false
            }
        },
        series: [],
        title: {
            text: ''
        },
        credits: {
            enabled: false
        },
        yAxis:{
            title: {
                text: '总访问量'
            }
        },
        xAxis: {
            categories: []
        },
        loading: true,
        size:{
            height:250
        }
    }

    BaseService.get("../data/ServiceRequestTotal.json",function(data){
        $scope.totalConfig.series = data.series;
        $scope.totalConfig.xAxis.categories =data.categories;
        $scope.totalConfig.loading = false;
    });

    $scope.monthConfig = {
        "options":{
            "chart":{
                "type":"areaspline"
            },
            legend: {
                enabled:false
            }
        },
        series: [
            {
                "name": "月访问量",
                "data": [5800,7800,8932,7523,12302,4200,8792,5723,3728,8492,6273,4742]
            }
        ],
        title: {
            text: ''
        },
        yAxis:{
            title: {
                text: '月访问量'
            }
        },
        xAxis: {
            categories: ['一月', '二月', '三月', '四月', '五月', '六月',
                '七月', '八月', '九月', '十月', '十一月', '十二月']
        },
        credits: {
            enabled: false
        },
        loading: false,
        size:{
            height:150
        }
    }

    $scope.serviceType = 'all';

    $scope.filterService = function(){
        //TODO 将$scope.serviceType作为查询条件来查询服务
        BaseService.get("../data/TopServices.json",function(data){
            $scope.topServices = data;
        });
    }

    $scope.filterService();
}]).controller('serviceRunningCtrl',['$scope','BaseService',function($scope,BaseService){
    $scope.runningConfig = {
        "options":{
            "chart":{
                "type":"pie",
                options3d: {
                    enabled: true,
                    alpha: 45,
                    beta:0
                }
            },
            plotOptions: {
                pie: {
                    allowPointSelect: true,
                    cursor: 'pointer',
                    innerSize: 100,
                    depth: 45,
                    dataLabels: {
                        enabled: true,
                        format: '{point.name}<br/>{point.y}',
                        style: {
                            color: (Highcharts.theme && Highcharts.theme.contrastTextColor) || 'black'
                        }
                    }
                }
            },
            tooltip:{
                enabled:false
            }
        },
        series: [{
            type: 'pie',
            name:'服务运行情况',
            data:[["正常",100], ['失败',30]]
        }],
        title: {
            text: ''
        },
        credits: {
            enabled: false
        },
        loading: false
    }

    $scope.curCondition = "all";

    $scope.toggleCondition = function(condition){
        $scope.curCondition = condition;
        $scope.filterService();
    }

    $scope.filterService = function(){
        //TODO 传入$scope.curCondition来过滤服务
        BaseService.get("../data/ServiceRunningStatus.json",function(data){
            $scope.services = data;
        });
    }

    $scope.filterService();
}]).controller('dbResourceCtrl',['$scope','BaseService',function($scope,BaseService){
    $scope.resourceConfig = {
        "options":{
            "chart":{
                type:"pie",
                options3d: {
                    enabled: true,
                    alpha: 45,
                    beta:0
                }
            },
            plotOptions: {
                pie: {
                    allowPointSelect: true,
                    cursor: 'pointer',
                    depth: 35,
                    dataLabels: {
                        enabled: true,
                        format: '{point.name}<br/>{point.percentage:.0f} %',
                        style: {
                            color: (Highcharts.theme && Highcharts.theme.contrastTextColor) || 'black'
                        }
                    }
                }
            },
            tooltip:{
                enabled:false
            }
        },
        series: [{
            type: 'pie',
            name:'服务所占比重',
            data:[["警用公共",2222], ['业务专用',3333],['标准地址',4444],['业务关联',5210],['基础数据',15202]]
        }],
        title: {
            text: ''
        },
        credits: {
            enabled: false
        },
        loading: false
    }

    $scope.syncType = "thisMonth";

    $scope.syncConfig = {
        "options":{
            "chart":{
                "type":"column",
                options3d: {
                    enabled: true,
                    alpha: 10,
                    beta: 20,
                    depth:70
                }
            },
            legend: {
                enabled:false
            }
        },
        series: [
            {
                "name": "数据同步情况",
                "data": [800,780,832,523,302,200,792,800,780,832,523,302,200,792,800,780,832,523,302,200,792]
            }
        ],
        title: {
            text: ''
        },
        yAxis:{
            title: {
                text: '同步数量'
            }
        },
        xAxis: {
            categories: ['广州', '深圳', '佛山', '东莞', '韶关', '阳江','湛江','广州', '深圳', '佛山', '东莞', '韶关', '阳江','湛江','广州', '深圳', '佛山', '东莞', '韶关', '阳江','湛江']
        },
        credits: {
            enabled: false
        },
        loading: false
    }
}]);