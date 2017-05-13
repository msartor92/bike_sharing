var http = require( "http" ),
    PORT = 8000,
    createHandler = require('github-webhook-handler'),
    handler = createHandler({ path: '/webhook', secret: 'your_passphrase' }),
    sh = require('shelljs')
    cmds = ["mkdir -p /tmp/fallback/",
            "cp -R * /tmp/fallback/",
            "git pull",
            "pm2 stop server.js",
            "npm install",
            "npm run build",
            "pm2 restart server.js",
            "rm -R /tmp/fallback/*"];

var debug = true;

//HANDLER
function webhookError(err) {
  console.error('Error:', err.message);
}

function webhookCreate(event) {
    !debug || console.log('Received a create event for %s to %s',
   			 event.payload.repository.name,
  			 event.payload.ref);
    !debug || console.log('CWD:', process.cwd());

    for(var cmd of cmds) {
        var out = sh.exec(cmd, {silent: true});
        if(out.stderr){
            // THINK ABOUT SERVER RESTART FALLBACK
            console.error("DEPLOY COMAND FAIL: ", cmd, out.stderr);
            break;
        } else !debug || console.log("DEPLOY COMAND ", cmd, " COMPLETED");
    }
    console.log("DEPLOY COMPLETED! :-)");
}

//SERVICE
http.createServer(function(req, res){
	handler(req, res, function requestError(err){
			    res.statusCode = 500;
			    res.end('Forbidden access');
			    console.error(err);
		  	});
}).listen(PORT);

handler.on('error', webhookError);
handler.on('create', webhookCreate);

console.log("CI service running at ", PORT);
