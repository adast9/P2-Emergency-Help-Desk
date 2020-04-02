let server = require('ws').Server;
let s = new server({ port: 25654 });
let emds = [];
let cases = [];
let counter = 0;

console.log("Listening on port 25654...");

// TODO: save current emergencies to file
// TODO: get markers to show on map with id / label

s.on('connection', function(ws) {
	ws.on('close', function() {
		// When a client disconnects, check if they are in the EMD array. 
		// If they are, remove them from the array.
		let i = emds.indexOf(ws);
		if (i !== -1) emds.splice(i, 1);
	});

	ws.on('message', function(data) {
		// If a client sends the message "EMD", add them to the EMD array
		// and send them all the current cases.
		if(data == "EMD") {
			emds.push(ws);
			cases.forEach(function(entry) {
				ws.send(JSON.stringify(entry));
			});
			return;
		}

		json = JSON.parse(data);
		let caseObject = {
			id: ++counter,
			who: ws,
			desc: json.desc,
			pos: json.pos
		};
		console.log("New case received! id: " + caseObject.id);
		cases.push(caseObject);

		emds.forEach(function(emd) {
			emd.send(JSON.stringify(caseObject));
		});
	});

	
});