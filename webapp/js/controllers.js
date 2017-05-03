angular.module('bike')
.config(['cfpLoadingBarProvider', function(cfpLoadingBarProvider) {//angular-loading-bar config
        cfpLoadingBarProvider.includeSpinner = true;
}])
.controller('tableData', ['NetworkSvc', function(NetworkSvc){
        var self = this;
        self.citySelect = -1;

        NetworkSvc.cityList().then(function(res){
                self.cityList = res.data;
        }, function(err) { console.error('cityList does not responds')});

        self.submit = function(){ 

                NetworkSvc.cityData(self.citySelect).then(function(res) {
                        var data = res.data;
                        data.forEach(function(station) {
                                station.bikes = station.bike[0].split(" ")[0];
                                station.empty = station.bike[1].split(" ")[0];
                                station.blocked = station.bike > 2 ? station.bike[2].split(" ")[0] : "0";
                                delete station.bike;
                        });
                        
                        self.data = data;
                }, function(err){ console.error('getData does not responds');});                
};
}]);