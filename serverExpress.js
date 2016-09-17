var express = require('express'),
	app = express(),
	path = require('path'),
	request = require('request'),
	basicAuth = require('basic-auth'),
	parser = require('./parser'),
	userData = require('./user'),
	cityData = require('./citycode'),
	users = [];
	city2code = new Object(),
	code2city = new Object();
	
cityData.forEach(function(e){
	city2code[e.city] = e.value;
	code2city[e.value] = e.city;
});
console.log(code2city);
userData.forEach(function(e){
	users[e.user] = e.psw;
});

var auth = function (req, res, next) {
	function unauthorized(res,code) {
		res.set('WWW-Authenticate', 'Basic realm=Authorization Required');
		return res.sendStatus(code);
	};
  
	var user = basicAuth(req);
	if (!user || !user.name || !user.pass) {
		return unauthorized(res,401);
	}
	if(!users || Object.keys(users).length === 0){
		console.error('Server fail: Authentication unavailable! user not found');
		return unauthorized(res,501);
	}
	
	if(users[user.name] !== undefined && users[user.name] === user.pass) {
	//if(user.name == 'admin' && user.pass == 'passwd') {
		return next();
	} else {
		console.error('\'' + user.name + '\' try login! Unknown user credential');
		return unauthorized(res,403);
	};
};


/*--- ROUTING ---*/
app.post('/parseStation', auth, function(req, res){
	var bodyStr = '';
    req.on('data',function(chunk){
        bodyStr += chunk.toString();
    });
    req.on('end',function(){
		res.status(200);
		res.header("Access-Control-Allow-Origin", "*");
		res.header("Access-Control-Allow-Headers", "X-Requested-With");
		res.send(parser.availableBikes(bodyStr));
    })
});

app.get('/cityName', auth, function(req, res){
	var code = req.query.code;
	console.log(code);
	console.log(code2city.hasOwnProperty(code));
	if(code && code2city[code]){
		res.status(200);
		res.send(code2city[code]);
	} else {
		res.status(204).send();
	}
});

app.get('/cityCode', auth, function(req, res){
	var name = req.query.name;
	console.log(name);
	console.log(city2code.hasOwnProperty(name));
	if(!name)
		res.sendStatus(404);
	else if(name && city2code.hasOwnProperty(name)){
		res.status(200);
		res.send(city2code[name]);
	} else {
		res.sendStatus(204);
	}
});

app.get('/getVenice', function(req, res){
	var proxy = 'http://anonymouse.org/cgi-bin/anon-www.cgi/',
		stazioni = 'http://bicincitta.tobike.it/frmLeStazioni.aspx?',
		ID = 'ID=93';
	request( proxy + stazioni + ID
			, function (error, response, body) {
				if (!error && response.statusCode == 200) {
					res.setHeader('Content-Type', 'application/json');
					res.send(parser.availableBikes(body));
				} else{
					console.log('ERROR: getVenice, ', error);
					res.set('WWW-Authenticate', 'Basic realm=Authorization Required');
					return res.sendStatus(503);
				}
			});
});

/* app.get('/getList', function(req, res){
	res.header("Access-Control-Allow-Origin", "*");
	res.header("Access-Control-Allow-Headers", "X-Requested-With");
	res.sendFile(path.join(__dirname, '/getList.html'));
}); */

app.get('/', function (req, res) {
  res.send('Hello World, I\'m alive!');
});

app.listen(8084, function () {
  console.log('Listening on 8084!');
});
