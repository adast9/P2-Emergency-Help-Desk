const fs = require('fs');
const server = require('ws').Server;
const s = new server({ port: 3001 });
let emds = [];
let cases = [];
let counter = 0;

console.log("Listening on port 3001...");
//LoadCases();

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

    client.on('message', function(message) {
        let data = JSON.parse(message);

        switch(data.type) {
            case "EMDConnect":
                console.log("EMD connected.");
                emds.push(client);
                cases.forEach(function(entry) {
                    client.send(JSON.stringify(entry));
                });
                break;
            case "Case":
                // Give the case an ID and save the client that created for livechat, then send the case to all EMDs.
                data.id = ++counter;
                data.creator = client;
                data.emd = null;
                data.timeDate = new Date().toLocaleDateString();
                data.timeClock = getTimeClock();
                data.chatLog = '';

                console.log("Case created (id: %d)", data.id);
                cases.push(data);
                BroadcastToEMDs(data);
                //SaveCases();
                break;
            case "OpenCase":
                for (var i = 0; i < cases.length; i++) {
                    if (cases[i].id == data.id) {
                        cases[i].emd = client;
                        BroadcastToEMDs({
                            type: "OpenCase",
                            id: cases[i].id,
                            emd: client
                        });
                        break;
                    }
                }
                break;
            case "CloseCase":
                for (var i = 0; i < cases.length; i++) {
                    if (cases[i].id == data.id) {
                        cases[i].emd = null;
                        BroadcastToEMDs({
                            type: "CloseCase",
                            id: cases[i].id
                        });
                        break;
                    }
                }
                /*for (let i = 0; i < cases.length; i++) {
                    if(cases[i].id == data.id) {
                        cases.splice(i, 1);
                        break;
                    }
                }
                console.log("Case closed (id: %d)", data.id);
                //SaveCases();
                BroadcastToEMDs({
                    type: "CloseCase",
                    id: data.id
                });*/
                break;
            default:
                console.log("Received some weird data...");
                break;
        }
    });
});

// Sends data to all connected EMDs
function BroadcastToEMDs(data) {
    emds.forEach(function(emd) {
        emd.send(JSON.stringify(data));
    });
}

// Saves current cases to file, which can be loaded in the case of a server restart/crash.
// NOTE: Can be improved if we only add/delete entries in the file when they are added/deleted instead of saving the entire array constantly.
function SaveCases() {
    //console.log("Saving current cases... ");

    //Delete any already existing data in save file
    fs.truncate('cases.txt', 0, function(){});

    // Write this simplified cases array to a file the server can read from next time it starts.
    fs.writeFile('cases.txt', JSON.stringify(cases, ["type", "id", "time", "desc", "pos", "lat", "lng"], 4), (err) => {
        if (err) {
            console.log("Failed to save cases. " + err);
        } /*else {
            console.log("Cases saved successfully. ");
        }*/
    });
}

// Load current cases from file
function LoadCases() {
    //console.log("Loading current cases from previous session... ");

    fs.readFile('cases.txt', {encoding: 'utf-8'}, function(err, data){
        if(err) {
            console.log("Failed to read cases.txt. " + err);
        } else {
            try {
                cases = JSON.parse(data);
                //console.log("Cases loaded successfully. ");

                if(cases.length > 0)
                    counter = cases[cases.length-1].id;

            } catch(jsonError) {
                console.log("There were no cases to load or cases.txt is broken.");
            }
        }
    });
}

//when the server receives the new case
function getTimeClock() {
    let time = new Date();
    let hours = time.getHours();
    if (hours < 10)
        hours = `0${hours}`;
    let minutes = time.getMinutes();
    if (minutes < 10)
        minutes = `0${minutes}`;
    let seconds = time.getSeconds();
    if (seconds < 10)
        seconds = `0${seconds}`

    return hours + ":" + minutes + ":" + seconds;
}
