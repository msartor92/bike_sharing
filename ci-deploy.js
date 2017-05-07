var http = require( "http" ),
    PORT = 443,
    createHandler = require('github-webhook-handler'),
    handler = createHandler({ path: '/webhook', secret: 'camionsoleolio' }),
    sh = require('shelljs')
    cmds = ["git pull",
            "pm2 stop server.js",
            "npm install",
            "npm run build",
            "pm2 start server.js"];
            
var debug = true;

//HANDLER
function webhookError(err) {
  console.error('Error:', err.message);
}

function webhookCreate(event) {
    console.log('Received a create event for %s to %s',
    event.payload.repository.name,
    event.payload.ref);//THEIR
    
    !debug || console.log( "New tag: ", data);
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
	console.log('request reached');
	handler(req, res, function requestError(err){
			    res.statusCode = 500;
			    res.end('Forbidden access');
			    console.error(err);
		  	});
}).listen(PORT);

handler.on('error', webhookError);
handler.on('create', webhookCreate);

console.log("CI service running at ", PORT);
