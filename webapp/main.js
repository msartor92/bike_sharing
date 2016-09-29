angular.module('bike', [])
    .controller('tableData', ['$http', function($http){
        var self = this;
        self.citySelect = -1;
        $http.get('/cityList').then(function(res){
			self.cityList = res.data;
		}, function(err){ console.error('cityList does not responds');});

        self.submit = function(){ 
            console.log(self.citySelect);
			$http.get('/getData?code='+self.citySelect).then(function(res) {
				self.data = res.data;
			}, function(err){ console.error('getData does not responds');});                
        };
}]);