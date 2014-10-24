var http = require('http'),
	stream = require('stream'),
	regexMap = require('./app/regex');

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
	proxyRequest.addListener('response', function (proxyResponse)
	{
		var editProxyResponse = new stream.Writable();
		var dataChunk = '';
		editProxyResponse._write = function (chunk, encoding, callback)
		{
			dataChunk = chunk.toString().replace('</body>','<script></script></body>');
			//dataChunk = dataChunk.replace(regexMap[1],'Madivala');
			callback();
		}
		var editPrxyResp = function() {
			response.write(dataChunk, 'binary');
		}

		proxyResponse.addListener('data', function (chunk)
		{
			editProxyResponse.write(chunk,'buffer',editPrxyResp);
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
}).listen(2005);

console.log("Proxy running on 2005");
