angular.module('bike')
.factory('NetworkSvc', ['$http', function($http) {
    return {
        cityList: function() {
            return $http.get('/cityList', {
               ignoreLoadingBar: true
            });
        },

        cityData: function(id) {
            return $http.get('/getData?code=' + id);    
        }
    };
}])
.factory('GeoCoder', ['$http', function($http) {
    return {
        addrToCoord: function(city, street){
            var p = encodeURI(city + ' ' + street),
                uri = 'https://maps.googleapis.com/maps/api/geocode/json?address=' + p + '&key=X';
            
            return {status: "ok", result: {lat: 42.10, lng: 11.79}};
            /*return $http.get(uri, {
                transformResponse: function cleanRes(data, headers){
                    var res = JSON.parse(data);
                    
                    if(res.status != 'OK')//reject();//???
                        return {status: "failed", result: []};
                    else {
                        var data = res.results,
                            geom = data.length ? data[0].geometry : [];
                        
                        return {status: "ok", result: geom};
                    }
                }
            });*/
        }
    };
}])
.service('ModalProvider',['$modal', function ($modal) {
    this.openMapModal = function (lat, long, zoom) {
        var modalInstance = $modal.open({
            templateUrl: 'mapModal.html',
            controller: 'ModalInstanceCtrl',
            size: '',
            resolve: {
                lat: function() {
                    return lat;
                },
                long: function() {
                    return long;
                },
                zoom: function() {
                    return zoom;
                }
            }
        })
        .result.then(function (selectedItem) {}, function () {
            //console.log('Modal dismissed at: ' + new Date());
        });
    };
}]);