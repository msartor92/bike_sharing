angular.module('bike')
.config(['cfpLoadingBarProvider', function(cfpLoadingBarProvider) {//angular-loading-bar config
        cfpLoadingBarProvider.includeSpinner = true;
}])
.controller('tableData', ['NetworkSvc', 'GeoCoder', function(NetworkSvc, GeoCoder) {
        var self = this;
        self.code = -1;
        
        NetworkSvc.cityList().then(function(res){
                self.cityList = res.data;
        }, function(err) { console.error('cityList does not responds')});

        self.submit = function(){
            self.city = self.selected.city;
            self.code = self.selected.value;
            
            NetworkSvc.cityData(self.code).then(function(res) {
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
        
        self.openMap = function(location) {
            var e = new CustomEvent('openMap', { detail: {city: self.city, street: location}});
            document.getElementById("bikes").dispatchEvent(e);
        };
}])
.controller('ModalDemoCtrl', ['GeoCoder', 'ModalProvider' , function(GeoCoder, ModalProvider) {
    var self = this;
    //default data
    self.lat = 34.834442;
    self.long = -82.3686479;
    self.zoom = 6;

    self.parseData = function(data){
        //improve after complete service
        GeoCoder.addrToCoord(data.city, data.street).then(function(data) {
            var d = data.data;
            if(d.status == 'ok'){
                self.lat = d.result.lat;
                self.long = d.result.lng;
                self.zoom = 16;
            }
            ModalProvider.openMapModal(self.lat, self.long, self.zoom); 
        });
    };
  
    document.getElementById("bikes").addEventListener('openMap', function(evt){
        self.parseData(evt.detail);
    });
}])
.controller('ModalInstanceCtrl', function ($scope, $modalInstance, lat, long, zoom) {
  $scope.lat = lat;
  $scope.long = long;
  $scope.zoom = zoom;

  $scope.close = function () {
    $modalInstance.dismiss('cancel');
  };
});