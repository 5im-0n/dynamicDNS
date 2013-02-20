var named = require('./node-named/lib/index');
var express = require('express');
var app = express();
var server = named.createServer();

var ip = '127.0.0.1';	//default ip when nothing is registered yet
var process_user = 'nobody';
var process_group = 'nogroup';

var log = function(text) {
	console.log((new Date()).toString() + ': ' + text);
};


var httpInterface = function() {
	//http interface
	app.get('/register', function(req, res){
		ip = req.get('x-forwarded-for');
		res.send('ok: ' + ip);
		log('registered ip ' + ip);
	});

	app.get('/status', function(req, res){
	        res.send(ip);
	});

	app.listen(22023, '127.0.0.1');
	log('Listening on port 22023');
}



server.listen(53, '0.0.0.0', function() {
	log('DNS server started on port 53');
        
	try {
		log('Giving up root privileges...');
		process.setgid(process_group);
		process.setuid(process_user);
		log('New uid: ' + process.getuid());
		
		httpInterface();
	}
	catch (err) {
		log('Failed to drop root privileges: ' + err);
	}
});

server.on('query', function(query) {
	var domain = query.name()
	var type = query.type();
	
	log('DNS Query: (' + type + ') ' + domain, type, domain);

	if (type === 'A') {
		var record = new named.ARecord(ip);
		query.addAnswer(domain, record, 5);
	}
	
	server.send(query);

});

server.on('clientError', function(error) {
	log("there was a clientError: " + error);
});

server.on('uncaughtException', function(error) {
	log("there was an excepton: " + error.message());
});




