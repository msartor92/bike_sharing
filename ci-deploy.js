var http = require( "http" ),
    Notifier = require( "git-notifier" ).Notifier,
    notifier = new Notifier(),
    server = http.createServer(),
    sh = require('shelljs')
    cmds = ["git pull",
            "pm2 stop server.js",
            "npm install",
            "npm run build",
            "pm2 start server.js"];

server.on( "request", notifier.handler );
server.listen( 8000 );

var debug = true;

notifier.on( "msartor92/bike_sharing/push/tags/**", function( data ) {
    !debug || console.log( "New commit: ", data);
    !debug || console.log('CWD:', process.cwd());

    for(var cmd of cmds) {
        var out = sh.exec(cmd);
        if(!out.stderr){
            // THINK ABOUT SERVER RESTART FALLBACK
            console.error("DEPLOY COMAND FAIL: ", cmd, out.stderr);
            break;
        } else !debug || console.log("DEPLOY COMAND ", cmd, " COMPLETED");
    }
    console.log("DEPLOY COMPLETED! :-)");
});