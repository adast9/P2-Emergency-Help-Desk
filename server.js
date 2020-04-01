let server = require('ws').Server;
let s = new server({ port: 25654 });
let emds = [];

console.log("Listening on port 25654...");

s.on('connection', function(ws) {
	ws.on('message', function(data) {

		if(data == "EMD") {
			console.log("EMD added to array.");
			emds.push(ws);
			return;
		}

		emds.forEach(function e(client) {
			client.send(data);
		})

		console.log(data);

		/*json = JSON.parse(message);
		
		switch(json.type) {
			case "location":
				ws.name = json.data;
				sendData(ws.name + " has connected.");
				break;
			}	*/	
	});

	/*function sendData(msg) {
		console.log(msg)
		s.clients.forEach(function e(client) {
			if(client != ws) client.send(msg);
		});
	}*/
});