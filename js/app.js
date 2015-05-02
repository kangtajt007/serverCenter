var baseApp = angular.module("baseApp",['ui.bootstrap','BaseServices']);
baseApp.config(['datepickerPopupConfig',function(datepickerPopupConfig){
    datepickerPopupConfig.currentText = '今天';
    datepickerPopupConfig.closeText = '关闭';
    datepickerPopupConfig.clearText = '清空';
}]).config(['datepickerConfig',function(datepickerConfig){
    datepickerConfig.formatDayTitle = 'yyyy年MM月';
}]).config(['$tooltipProvider', function($tooltipProvider){
    $tooltipProvider.setTriggers({
        'show': 'hide'
    });
}]).controller("indexCtrl",['$scope','BaseService','$modal',function($scope,BaseService,$modal){
    //首页控制器
    $scope.curItem = {};
    $scope.home = {};
    $scope.positionStack = [];
    $scope.collapse = false;
    //获取菜单资源
    BaseService.get("../data/menus.json",function(data){
        $scope.menus = data;
        $scope.curItem = data[0];
        $scope.home = $scope.curItem;
    });
    //切换菜单
    $scope.toggleMenu = function(item,parent){
        $scope.curItem = item;
        $scope.positionStack = [];
        (parent)&&($scope.positionStack.push(parent));
        $scope.positionStack.push(item);
    }
    //回到首页
    $scope.goHome = function(){
        $scope.curItem = $scope.home;
    }

    $scope.toggleMenuByHref = function(href,noDigest){
        if(noDigest){
            for(var i= 0,c;c=$scope.positionStack[i++];){
                if(c.href==href){
                    $scope.positionStack = $scope.positionStack.splice(0,i);
                }
            }
        }
        angular.forEach($scope.menus,function(menu){
            if(menu.href==href){
                $scope.curItem = menu;
            }
            if(menu.children){
                angular.forEach(menu.children,function(child){
                    if(child.href==href){
                        $scope.curItem = child;
                        (!noDigest)&&($scope.$digest());
                    }
                });
            }
            $('#iframe').attr('src', $('#iframe').attr('src'));
        });
    }
    //添加到导航条堆栈
    $scope.add2positionStack = function(item){
        $scope.$apply(function(){
            $scope.positionStack.push(item);
        });
    }
    //显示模态窗口
    $scope.showModal = function(opt){
        $scope.opt = {"title":"提示信息","okText":"确定","cancelText":"取消"};
        opt = opt||{};
        angular.extend($scope.opt,opt);

        var modalInstance = $modal.open({
            templateUrl: 'serviceApplyModal',
            controller: 'modalCtrl',
            size: "sm",
            resolve: {
                opt: function () {
                    return $scope.opt;
                }
            }
        });

        modalInstance.result.then(function(){
            if(typeof $scope.opt.onOk=='function'){
                $scope.opt.onOk();
            }
        }, function () {
            if(typeof $scope.opt.onCancel=='function'){
                $scope.opt.onCancel();
            }
        });
    }
}]).controller("modalCtrl",['$scope','$modalInstance','opt',function($scope,$modalInstance,opt){
    $scope.opt = opt;
    $scope.ok = function () {
        $modalInstance.close();
    };

    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };
}]).controller("serviceQueryCtrl",['$scope','BaseService',function($scope,BaseService){
    //当前服务类型 1：地图服务，2：地址服务，3：资源服务，4：应用服务
    $scope.type = FinestUtils.getUrlParam("type");

    var typeWordDic = {"1":"地图类型","2":"服务类型","3":"资源类型","4":"服务类型"};

    $scope.typeWord = typeWordDic[$scope.type];

    //服务查询控制器
    $scope.isCollapsed = false;
    //总记录数
    $scope.totalItems = 700;
    //当前页码
    $scope.currentPage = 3;
    //已选类型条件
    $scope.curTypes = [];
    //已选区域条件
    $scope.curAreas = [];

    //获取服务查询条件
    BaseService.get("../data/MapServiceConditions"+$scope.type+".json",function(data){
        $scope.MapServiceConditions = data;
    });

    //选择地图分类条件
    $scope.selectType = function(type){
        if($scope.curTypes.indexOf(type)!=-1){return;}
        $scope.curTypes.push(type);
        $scope.queryService();
    }

    //选择区域条件
    $scope.selectArea = function(area){
        if($scope.curAreas.indexOf(area)!=-1){return;}
        $scope.curAreas.push(area);
        $scope.queryService();
    }

    //清除地图分类条件
    $scope.removeType = function(curType){
        $scope.curTypes.remove(curType);
        $scope.queryService();
    }

    //清除区域条件
    $scope.removeArea = function(curArea){
        $scope.curAreas.remove(curArea);
        $scope.queryService();
    }

    //查询地图服务
    $scope.queryService = function(){
        //TODO 传入查询条件
        BaseService.get("../data/ServiceData.json",function(data){
            //TODO 更新分页信息，总记录数，当前页码 eg:$scope.totalItems = xx,$scope.currentPage = xx
            $scope.serviceList = data;
        });
    }
    //初始化查询
    $scope.queryService();

    $scope.serviceApply = function(service){
        //TODO 调用后台的添加服务到申请列表的接口 eg:BaseService.post("saveApplyList",service,function(){});

        BaseService.dialog({"content":"已添加到服务申请列表!","okText":"查看申请列表","cancelText":"继续浏览","onOk":function(){
            BaseService.toggleMenu("myApply.html");
        }});
    }

    //地图服务分页变更
    $scope.pageChanged = function(){
        //当前分页
        alert($scope.currentPage);
        $scope.queryService();
    }

    $scope.showServiceDetail = function(id){
        var item = {"title":"服务详情","href":"serviceDetail.html?id=" + id};
        window.location.href = item.href;
        BaseService.addPostionStack(item);
    }
}]).controller('serviceDetailCtrl',['$scope','BaseService',function($scope,BaseService){
    //获取所查看服务的id
    $scope.id = FinestUtils.getUrlParam("id");

    //TODO 传入id
    BaseService.get("../data/ServiceDetail.json",function(data){
        $scope.serviceDetail = data;
    });
}]).controller('myApplyServiceCtrl',['$scope','BaseService',function($scope,BaseService){
    $scope.curCondition = "all";

    $scope.total = {"all":6,"1":3,"2":2,"3":1};
    //切换查询条件
    $scope.toggleCondition = function(type){
        //更新查询条件
        $scope.curCondition = type;
    }
    //全选、反选
    $scope.checkAll = function($event){
        angular.forEach($scope.serviceList,function(service){
            if(service.status==3){
                service.checked = !!$event.currentTarget.checked;
            }
        });
    }
    //批量删除
    $scope.removeAll = function(){
        angular.forEach($scope.serviceList,function(service){
            if(service.status==3&&service.checked){
                $scope.removeService(service);
            }
        });
    }
    //删除服务
    $scope.removeService = function(service){
        $scope.serviceList.remove(service);
    }
    //提交服务申请
    $scope.applySubmit = function(){
        var item = {"title":"服务申请","href":"applyForm.html"};
        window.location.href = item.href;
        BaseService.addPostionStack(item);
    }

    $scope.jumpToServiceQuery = function(){
        BaseService.toggleMenu("serviceQuery.html?type=1");
    }
    //获取我申请的服务列表
    BaseService.get("../data/MyApplyServiceData.json",function(data){
        $scope.serviceList = data;
    });
}]).controller('applyFormCtrl',['$scope','BaseService','$timeout',function($scope,BaseService,$timeout){
    $scope.applyer = {
        "id": "1",
        "name":"张三",
        "belongTo":"",
        "address":"",
        "telephone":"",
        "systemName":"",
        "devCompany":"",
        "systemDesc":""
    };

    $scope.tempApplyer = angular.copy($scope.applyer);
    //重置
    $scope.reset = function(){
        $scope.applyer = $scope.tempApplyer;
        $scope.services = $scope.tempServices;
    }
    //移除服务
    $scope.remove = function(service){
        $scope.services.remove(service);
    }
    //提交
    $scope.submit = function(){
        //TODO 提交数据到后台 BaseService.post(url,{applyer:$scope.applyer,services:$scope.services},function(data){});
        BaseService.dialog({"content":"申请提交成功!"});
    }

    $scope.hideTooltip = function(){
        $scope.tt_isOpen = false;
    }

    $scope.open = function($event,service,tag) {
        $event.preventDefault();
        $event.stopPropagation();
        service[tag] = true;
    };

    $scope.format = 'yyyy-MM-dd';

    //获取我要申请的服务列表
    BaseService.get("../data/ServiceToApply.json",function(data){
        $scope.services = data;
        $scope.tempServices = angular.copy($scope.services);
    });
}]).controller("mobileMapCtrl",['$scope','BaseService',function($scope,BaseService){
    //加载服务数据
    $scope.loadServices = function(id){
        //TODO 将组织机构ID作为查询条件传递到后台
        BaseService.get("../data/MobileMap.json",function(data){
            $scope.services = data;
        });
    }

    BaseService.get("../data/ztreeData.json",function(data){
        var setting = {
            callback:{
                onClick: function (event,treeId,treeNode) {
                    $scope.loadServices(treeNode.id);
                }
            }
        };
        $scope.ztree = $.fn.zTree.init($("#ztree"),setting,data);
        var rootId = "0";
        var node = $scope.ztree.getNodeByParam("id",rootId);
        $scope.ztree.selectNode(node);
        $scope.loadServices(rootId);
    });
}]);