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
                uri = 'https://maps.googleapis.com/maps/api/geocode/json?address=' + p + '&key=AIzaSyDrfAYc_5wOvzW84DXIfIQv7ui74o7lZyo';
            
            //  return {status: "ok", result: {lat: 42.10, lng: 11.79}};
            return $http.get(uri, {
                transformResponse: function(data, headers) {
                    var res = JSON.parse(data),
                        data = res.results,
                        obj = {};
                    
                    if(res.status != 'OK' && !data.length){//reject();
                        obj.status = "failed";
                        obj.result = {};
                    } else {
                        obj.result = {
                            lat: data[0].geometry.location.lat, 
                            lng: data[0].geometry.location.lng
                        };
                        obj.status = "ok";
                    }
                    return obj;
                }
            });
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
            delete modalInstance;
            //console.log('Modal dismissed at: ' + new Date());
        });
    };
}]);