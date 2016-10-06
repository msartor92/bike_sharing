angular.module('bike').factory('NetworkSvc', ['$http', function($http) {
    return {
        cityList : function() {
            return $http.get('/cityList');
        },

        cityData : function(id) {
            return $http.get('/getData?code=' + id);    
        }
    };
}]);