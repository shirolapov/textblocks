var static = require('node-static');

var file = new static.Server('./app');

require('http').createServer(function (request, response) {
    request.addListener('end', function () {
        file.serve(request, response);
    }).resume();
}).listen(8080);

console.log("http://localhost:8080/");
