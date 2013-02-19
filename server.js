var named = require('./node-named/lib/index');
var express = require('express');
var app = express();
var server = named.createServer();

var ip = '127.0.0.1';	//default ip when nothing is registered yet


server.listen(53, '0.0.0.0', function() {
        console.log('DNS server started on port 53');
});

server.on('query', function(query) {
        var domain = query.name()
        var type = query.type();
        console.log('DNS Query: (%s) %s', type, domain);

	var record = new named.ARecord(ip);
	query.addAnswer(domain, record, 5);
	server.send(query);

});

server.on('clientError', function(error) {
        console.log("there was a clientError: %s", error);
});

server.on('uncaughtException', function(error) {
        console.log("there was an excepton: %s", error.message());
});


//http interface
app.get('/register', function(req, res){
	ip = req.ip;
	res.send('ok: ' + ip);
	console.log('registered ip ' + ip);
});

app.get('/status', function(req, res){
        res.send(ip);
});

app.listen(22023);
console.log('Listening on port 22023');

