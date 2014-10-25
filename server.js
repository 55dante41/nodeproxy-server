var http = require('http'),
	stream = require('stream'),
	regexMap = require('./app/regex'),
	concatStream = require('concat-stream');

http.createServer(function (request, response)
{
	var proxyOptions =
	{
		host: 'www.google.com',
		path: '/?gfe_rd=cr&gws_rd=cr',
		method: 'GET'
	};
	var proxyRequest = http.request(proxyOptions, function ()
	{
		console.log("1: Created ProxyRequest");
		//Proxy request callback
	});
	proxyRequest.on('response', function (proxyResponse)
	{
		console.log("3: Proxy Request received response from remote server");
		var editProxyResponse = concatStream(function (data)
		{
			console.log("4: Response to proxyserver is bubbled in here and sent back to the client");
			console.log(data.toString().match(regexMap[0]));
			response.write(data, 'binary');
		});

		proxyResponse.pipe(editProxyResponse);

		proxyResponse.on('end', function ()
		{
			console.log("Ended proxy request");
			response.end();
		});

		var newHeaders = proxyResponse.headers;
		newHeaders.location = 'http://localhost:2000';
		response.writeHead(200, proxyResponse.headers);
	});
	request.on('data', function (chunk)
	{
		console.log("2: Get data from actual request and write to proxy request");
		proxyRequest.write(chunk, 'binary');
	});
	request.on('end', function ()
	{
		console.log("Request ended. Ending proxy's request");
		proxyRequest.end();
	});
}).listen(2005);

console.log("Proxy running on 2005");
