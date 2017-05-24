var http = require( "http" ),
    PORT = 8000,
    createHandler = require('github-webhook-handler'),
    handler = createHandler({ path: '/webhook', secret: 'your_passphrase' }),
    sh = require('shelljs');

var debug = true;

//HANDLER
function restoreProcess(){
	var restore_cmds = ["rm -R ./*",
						"cp -R /tmp/fallback/* ./",
						"pm2 restrt server.js",
						"rm -R /tmp/fallback/*"];
					
	console.error("TRING TO RESTORE OLD VERSION...");
	
	for(var cmd of restore_cmds) {
		sh.exec(cmd, {silent: true});
		
		if(out.stderr)
			console.error("RESTORE FAILED, manage process manually!");
	}
	
	console.warn("RESTORE COMPLETED!");
};

function deployProcess() {
	var cmds = ["mkdir -p /tmp/fallback/",
            "cp -R * /tmp/fallback/",
            "git pull",
            "pm2 stop server.js",
            "npm install",
            "npm run build",
            "pm2 restart server.js",
            "rm -R /tmp/fallback/*"];
			
	for(var cmd of cmds) {
        var out = sh.exec(cmd, {silent: true});
        if(out.stderr){
            console.error("DEPLOY COMAND FAIL: ", cmd, out.stderr);
            
			restoreProcess();
            break;
			
        } else !debug || console.log("DEPLOY COMAND ", cmd, " COMPLETED");
    }
	
	console.log("DEPLOY COMPLETED! :-)");
};


//SERVICE
http.createServer(function(req, res){
	handler(req, res, function requestError(err){
			    res.statusCode = 500;
			    res.end('Forbidden access');
			    console.error(err);
	});
}).listen(PORT);

handler.on('error', function webhookError(err) {
  console.error('Error:', err.message);
});

handler.on('create', function webhookCreate(event) {
	var p = event.payload;
    !debug || console.log('Received a create event for %s to %s', p.repository.name, p.ref);
    !debug || console.log('CWD:', process.cwd());
	
	deployProcess();
});

console.log("CI service running at ", PORT);
