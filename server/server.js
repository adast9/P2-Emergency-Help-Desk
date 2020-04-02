const fs = require('fs');
const server = require('ws').Server;
const s = new server({ port: 25654 });
let emds = [];
let cases = [];
let counter = 0;

console.log("Listening on port 25654...");

// TODO: save current emergencies to file
// TODO: get markers to show on map with id / label

s.on('connection', function(client) {
	client.on('close', function() {
		// When a client disconnects, check if they are in the EMD array. 
		// If they are, remove them from the array.
		let i = emds.indexOf(client);
		if (i !== -1) { 
			console.log("EMD disconnected.");
			emds.splice(i, 1); 
		}
	});

	client.on('message', function(data) {
		// If a client sends the message "EMD", add them to the EMD array
		// and send them all the current cases.
		if(data == "EMD") {
			console.log("EMD connected.");
			emds.push(client);
			cases.forEach(function(entry) {
				client.send(JSON.stringify(entry));
			});
			return;
		}

		// Message received is not "EMD" so it is a new case
		// Make the data into an object, add it to cases array, send it to all EMDs 
		json = JSON.parse(data);
		let caseObject = {
			id: ++counter,
			who: client,
			desc: json.desc,
			pos: json.pos
		};
		console.log("Case created (id: %d)", caseObject.id);
		cases.push(caseObject);

		emds.forEach(function(emd) {
			emd.send(JSON.stringify(caseObject));
		});

		SaveCases();
	});
});

// Saves current cases to file, which can be loaded in the case of a server restart/crash.
// NOTE: Can be improved if we only add/delete entries in the file when they are added/deleted instead of saving the entire array constantly.
function SaveCases() {
	process.stdout.write("Saving current cases... ");
	let casesToSave = [];

	// Simplify cases array so it doesn't contain the client that created the case.
	// This is done because the client would have a different websocket the next time the server starts again anyway.
	cases.forEach(function(entry) {
		let caseObject = {
			id: entry.id,
			desc: entry.desc,
			pos: entry.pos
		};
		casesToSave.push(caseObject);
	});

	//Delete any already existing data in save file 
	fs.truncate('cases.txt', 0, function(){});

	// Write this simplified cases array to a file the server can read from next time it starts.
	fs.writeFile('cases.txt', JSON.stringify(casesToSave, null, 4), (err) => {
	    if (err) throw err;
	    process.stdout.write("Cases saved successfully. ");
	});
}

// Load current cases from file 
function LoadCases() {

}