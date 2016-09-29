var parser = require('./parser'),
	request = require('request'),
	logReq = require('./logger').req,
	cityData = require('../data/citycode'),
	city2code = new Object(),
	code2city = new Object(),
	cities = new Array();

/**  Module Init  **/	
cityData.forEach(function(e){
	cities.push(e.city);
	city2code[e.city] = e.value;
	code2city[e.value] = e.city;
});

module.exports = {
	
	parseStation: function(req, res){
		var bodyStr = '';
		
		logReq.info('API: parseStation \t', req.ip, '\t', req.headers['user-agent']);
		req.on('data',function(chunk){
			bodyStr += chunk.toString();
		});
		req.on('end',function(){
			res.status(200);
			res.header("Access-Control-Allow-Origin", "*");
			res.header("Access-Control-Allow-Headers", "X-Requested-With");
			res.send(parser.availableBikes(bodyStr));
		})
	},
	
	cityName: function(req, res){
		var code = req.query.code;
		
		logReq.info('API: cityName \t\t', code, '\t\t', req.ip, '\t', req.headers['user-agent']);
		if(!code || !/[0-9]$/.test(code))
			res.sendStatus(400);
		else if(code2city[code]){
			res.status(200);
			res.send(code2city[code]);
		} else {
			logReq.error('API: cityName \t', code, '\tvalue not available');
			res.status(204).send();
		}
	},
	
	cityCode: function(req, res){
		var name = req.query.name;
		
		logReq.info('API: cityCode \t', name, '\t', req.ip, '\t', req.headers['user-agent']);
		if(!name)
			res.sendStatus(400);
		else if(name && city2code.hasOwnProperty(name)){
			res.status(200);
			res.send(city2code[name]);
		} else {
			logReq.error('API: cityCode \t', name, ',\tvalue not available');
			res.sendStatus(204);
		}
	},
	
	cityList: function(req, res) {
		if(cityData.length){
			res.status(200);
			res.send(cityData);
		} else res.sendStatus(503);
	},
	
	getData: function(req, res){
		var code = req.query.code,
			proxy = 'http://anonymouse.org/cgi-bin/anon-www.cgi/',
			stazioni = 'http://bicincitta.tobike.it/frmLeStazioni.aspx?',
			ID = 'ID=' + code;

		if(/[0-9]$/.test(code)){
			logReq.info('API: getVenice \t\t\t', req.ip, '\t', req.headers['user-agent']);
			request( proxy + stazioni + ID
					, function (error, response, body) {
						if (!error && response.statusCode == 200) {
							res.setHeader('Content-Type', 'application/json');
							res.send(parser.availableBikes(body));
						} else{
							logReq.error('API: getVenice, ', error);
							res.set('WWW-Authenticate', 'Basic realm=Authorization Required');
							return res.sendStatus(503);
						}
					});	
		} else res.sendStatus(400);
	}
	
}