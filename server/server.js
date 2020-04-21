const fs = require('fs');
const server = require('ws').Server;
const s = new server({ port: 3001 });
let emds = [];
let cases = [];
let clientCounter = 0;
let caseCounter = 0;

console.log("Listening on port 3001...");
//LoadCases();

s.on('connection', function(client) {
    // Gives each client a unique ID.
    client.id = ++clientCounter;

    client.on('close', function() {
        // When a client disconnects, check if they are in the EMD array.
        // If they are, remove them from the array.
        let i = emds.indexOf(client);
        if (i !== -1) {

            // If the EMD had a case open, close it.
            cases.forEach(function(entry) {
                if(entry.emdID == client.id) {
                    entry.emdID = null;
                    BroadcastToEMDs({
                        type: "CaseClosed",
                        id: entry.id
                    });
                }
            });

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
                    client.send(JSON.stringify(SimpleCase(entry)));
                });
                break;
            case "Case":
                // Give the case an ID and save the client that created for livechat, then send the case to all EMDs.
                data.id = ++caseCounter;
                data.creatorID = client.id;
                data.emdID = null;
                data.timeDate = new Date().toLocaleDateString();
                data.timeClock = getTimeClock();
                data.chatLog = "";
                console.log("Case created (id: %d)", data.id);
                cases.push(data);
                BroadcastToEMDs(SimpleCase(data));
                //SaveCases();
                break;
            case "RequestOpenCase":
                var c = GetCaseByID(data.id);
                if (c != null) {
                    if (c.emdID != null) {
                        client.send(JSON.stringify({
                            type: "DenyOpenCase"
                        }));
                    } else {
                        c.emdID = client.id;
                        let caseToSend = JSON.parse(JSON.stringify(c));
                        caseToSend.type = "AllowOpenCase";
                        client.send(JSON.stringify(caseToSend));
                        BroadcastToEMDs({
                            type: "CaseOpened",
                            id: data.id
                        })
                    }
                }
                break;
            case "CloseCase":
                var c = GetCaseByID(data.id);
                if (c != null) {
                    c.emdID = null;
                    BroadcastToEMDs({
                        type: "CaseClosed",
                        id: data.id
                    });
                }
                break;
            default:
                console.log("Received some weird data...");
                break;
        }
    });
});

function GetCaseByID(id) {
    for (var i = 0; i < cases.length; i++) {
        if(cases[i].id == id)
        return cases[i];
    }
    return null;
}

// Makes a smaller version of a case because the full case details are sent to EMDs when they open the case.
function SimpleCase(data) {
    return {
        type: "Case",
        id: data.id,
        pos: data.pos,
        emdID: data.emdID,
        timeClock: data.timeClock
    };
}

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
