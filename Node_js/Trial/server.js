var http = require('http');
var url = require('url');
var fs = require('fs');


fs.readFile('./applet.html', function (err, html) {
    if (err) {
        throw err; 
    }       

function start(route) {
	function onRequest (request, response) {
		var pathname = url.parse(request.url).pathname;
		console.log('Request for ' + pathname + ' recieved.');

		route(pathname);

		response.writeHead(200, {'Content-Type': 'text/plain'});
		response.write('Hello World');
		response.end();
	}

http.createServer(onRequest).listen(8888);
console.log('Server has started.');
}

exports.start = start;