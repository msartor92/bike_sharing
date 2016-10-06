angular.module('bike').controller('tableData', ['NetworkSvc', function(NetworkSvc){
        var self = this;
        self.citySelect = -1;
       
        NetworkSvc.cityList().then(function(res){
			self.cityList = res.data;
		}, function(err){ console.error('cityList does not responds');});

        self.submit = function(){ 

			NetworkSvc.cityData(self.citySelect).then(function(res) {
				self.data = res.data;
			}, function(err){ console.error('getData does not responds');});                
        };
}]);