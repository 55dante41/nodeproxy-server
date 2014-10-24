var http = require('http'),
	stream = require('stream');

http.createServer(function (request, response)
{
	var proxyOptions =
	{
		host: 'www.google.com',
		path: '/?gfe_rd=cr&ei=&gws_rd=cr',
		method: 'GET'
	};
	var proxyRequest = http.request(proxyOptions, function ()
	{
		//Proxy request callback
	});
	proxyRequest.addListener('response', function (proxyResponse)
	{
		var editProxyResponse = new stream.Writable();
		editProxyResponse._write = function (chunk, encoding, done)
		{
			var data = chunk.toString();
			console.log(data);
			done();
		}
		proxyResponse.pipe(editProxyResponse);

		proxyResponse.addListener('data', function (chunk)
		{
			response.write(chunk, 'binary');
		});
		proxyResponse.addListener('end', function ()
		{
			response.end();
		});
		var newHeaders = proxyResponse.headers;
		newHeaders.location = 'http://localhost:2000';
		response.writeHead(200, proxyResponse.headers);
	});
	request.addListener('data', function (chunk)
	{
		console.log(chunk.toString());
		proxyRequest.write(chunk, 'binary');
	});
	request.addListener('end', function ()
	{
		proxyRequest.end();
	});
}).listen(2000);

console.log("Proxy running on 2000");