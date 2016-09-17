angular.module('bike', [])
    .controller('tableData', ['$http', function($http){
        var self = this;
        self.citySelect = null;
        self.code = -1;
        $http.get('/cityList').then(function(res){
			self.cityList = res.data;
		}, function(err){ console.error('cityList does not responds');});

        self.submit = function(){ 
            console.log(self.citySelect);
            
            $http.get('/cityCode?name='+self.citySelect).then(function(res) {
                if(res.status == 200){
                    self.code = res.data;
                    $http.get('/getData?code='+self.code).then(function(res) {
                        self.data = res.data;
                    }, function(err){ console.error('getData does not responds');});
                } else self.code = -1;
                
            }, function(err){ console.error('cityCode does not responds');});
        };
}]);