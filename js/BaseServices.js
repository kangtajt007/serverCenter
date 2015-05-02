var BaseServices = angular.module( "BaseServices", [] );
BaseServices.factory("$jsonToFormData",function() {
	function transformRequest( data, getHeaders ) {
		var headers = getHeaders();
		headers["Content-Type"] = "application/x-www-form-urlencoded; charset=utf-8";
		return $.param(data);
	}
	return( transformRequest );
})
.service('BaseService', ['$http','$jsonToFormData', function($http,$jsonToFormData) {
    var service = {
    		get:function(url,callback){
    			$http.get(url).success(function(data,status){
            		if(callback){
            			callback(data,status);
            		}
        		})
        		.error(function(data,status){
        			if(callback){
            			callback(data,status);
        			}
        		});
    		},
    		post:function(url,param,callback){
    			$http.post(url,param,{transformRequest:$jsonToFormData})
				 .success(function(data,status){
					 if(callback){
	    				callback(data,status);
	    			 }
				 })
				 .error(function(data,status){
					 if(callback){
	    				callback(data,status);
	    			 }
				 });
    		},
			dialog:function(opt){
				(window.parent&&typeof window.parent.showModalDialog=='function')&&(window.parent.showModalDialog(opt));
			},
			toggleMenu:function(href){
				(window.parent&&typeof window.parent.toggleMenu=='function')&&(window.parent.toggleMenu(href));
			},
			addPostionStack:function(item){
				(window.parent&&typeof window.parent.addPostionStack=='function')&&(window.parent.addPostionStack(item));
			}
        };
    return service;
}]);