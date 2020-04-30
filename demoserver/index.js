const http = require('http');
const url = require('url');

var server = http.createServer(function (req, res) {   //create web server
    const queryObject = url.parse(req.url,true).query;

    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Request-Method', '*');
    res.setHeader('Access-Control-Allow-Methods', 'OPTIONS, GET, POST');
    res.setHeader('Access-Control-Allow-Headers', '*');
    res.setHeader('Content-Type', 'text/plain')

    console.log(req.url);

    if (req.url.startsWith('/demoPath')) { //check the URL of the current request
        
        // set response header
        res.writeHead(200); 
        
        // set response content    
        res.write('got boardId: ' + queryObject.hello);
        res.end();
    
    } else {
        res.end('Invalid Request!');
    }

});

server.listen(7000);

console.log('Node.js web server at port 7000 is running..')