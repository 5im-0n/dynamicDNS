var named = require('./node-named/lib/index');
var express = require('express');
var app = express();
var server = named.createServer();

var ip = '127.0.0.1';	//default ip when nothing is registered yet
var process_user = 'nobody';
var process_group = 'nogroup';


var httpInterface = function() {
	//http interface
	app.get('/register', function(req, res){
		ip = req.get('x-forwarded-for');
		res.send('ok: ' + ip);
		console.log('registered ip ' + ip);
	});

	app.get('/status', function(req, res){
	        res.send(ip);
	});

	app.listen(22023, '127.0.0.1');
	console.log('Listening on port 22023');
}



server.listen(53, '0.0.0.0', function() {
	console.log('DNS server started on port 53');
        
	try {
		console.log('Giving up root privileges...');
		process.setgid(process_group);
		process.setuid(process_user);
		console.log('New uid: ' + process.getuid());
		
		httpInterface();
	}
	catch (err) {
		console.log('Failed to drop root privileges: ' + err);
	}
});

server.on('query', function(query) {
	var domain = query.name()
	var type = query.type();
	
	console.log('DNS Query: (%s) %s', type, domain);

	if (type === 'A') {
		var record = new named.ARecord(ip);
		query.addAnswer(domain, record, 5);
	}
	
	server.send(query);

});

server.on('clientError', function(error) {
        console.log("there was a clientError: %s", error);
});

server.on('uncaughtException', function(error) {
        console.log("there was an excepton: %s", error.message());
});




