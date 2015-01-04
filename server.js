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
		//Proxy request callback
	});
	proxyRequest.on('response', function (proxyResponse)
	{
		var editProxyResponse = concatStream(function (data)
		{
			console.log(data.toString().match(regexMap[0]));
			console.log(data.toString().match(regexMap[1]));
			data = data.toString().replace('</head>', '<link href="/public/images/favicon.ico" rel="icon" type="image/x-icon" /></head>');
			response.write(data, 'binary');
		});

		proxyResponse.pipe(editProxyResponse);

		proxyResponse.on('end', function ()
		{
			response.end();
		});

		var newHeaders = proxyResponse.headers;
		newHeaders.location = 'http://localhost:2000';
		response.writeHead(200, proxyResponse.headers);
	});
	request.on('data', function (chunk)
	{
		proxyRequest.write(chunk, 'binary');
	});
	request.on('end', function ()
	{
		proxyRequest.end();
	});
}).listen(2005);

console.log("Proxy running on 2005");
