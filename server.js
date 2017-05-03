var express = require('express'),
var compression = require('compression'),
	express = require('express'),
	app = express(),
	path = require('path'),
	basicAuth = require('basic-auth'),
	resolver = require('./module/resolver'),
	logAuth = require('./module/logger').auth,
	userData = require('./data/user'),
	users = [];
	
/** AUTHENTICATION **/
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
		logAuth.warn('User try auth without credential\t', user, '\t', req.ip);
		return unauthorized(res,401);
	}
	if(!users || Object.keys(users).length === 0){
		logAuth.error('Server fail: Authentication unavailable! users not found');
		return unauthorized(res,501);
	}
	
	if(users[user.name] !== undefined && users[user.name] === user.pass) {
		logAuth.info('\'' + user.name + '\' login!');
		return next();
	} else {
		logAuth.info('\'' + user.name + '\' try login! Unknown user credential or wrong password\t', req.ip);
		return unauthorized(res,403);
	};
};

/** API ROUTING **/
app.post('/parseStation', auth, resolver.parseStation);
app.get('/cityName', auth, resolver.cityName);
app.get('/cityCode', auth, resolver.cityCode);
app.get('/cityList', auth, resolver.cityList);
app.get('/getData', resolver.getData);

/** WEBAPP */
app.use(compression());
app.use('/index.html', express.static('./public/index.html'));
app.use('/media/', express.static('./public/media/'));
app.use('/css/', express.static('./public/css/'));
app.use('/js/', express.static('./public/js/'));

app.get('/', function (req, res) {
  res.send('Hello World, I\'m alive!');
});

app.listen(8084, function () {
  console.log('Listening on 8084!');
});
