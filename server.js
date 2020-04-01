let server = require('ws').Server;
let s = new server({ port: 25654 });
let emds = [];
let emergencies = [];
let counter = 0;

console.log("Listening on port 25654...");

s.on('connection', function(client) {
	client.on('message', function(data) {
		if(data == "EMD") {
			console.log("EMD added to array.");
			emds.push(client);
			if(emergencies.length > 0) {
				emergencies.forEach(function(eme) {
					client.send(JSON.stringify(eme));
				});
			}
			return;
		}

		json = JSON.parse(data);
		let obj = {
			id: ++counter,
			who: client,
			desc: json.desc,
			pos: json.pos
		};
		emergencies.push(obj);

		emds.forEach(function e(client) {
			client.send(JSON.stringify(obj));
		});
	});
});