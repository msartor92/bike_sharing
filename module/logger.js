var SimpleNodeLogger = require('simple-node-logger');

module.exports = {
	
	auth: SimpleNodeLogger.createSimpleFileLogger( {
		logFilePath:'log/authentication.log',
		timestampFormat:'YYYY-MM-DD HH:mm:ss'
	}),

	req: SimpleNodeLogger.createSimpleFileLogger( {
		logFilePath:'log/request.log',
		timestampFormat:'YYYY-MM-DD HH:mm:ss'
	})
}
	