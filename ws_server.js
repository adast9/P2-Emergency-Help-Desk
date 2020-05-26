// 
// Authors:
// Adam Stück, Bianca Kevy, Cecilie Hejlesen
// Frederik Stær, Lasse Rasmussen and Tais Hors
//
// Group: DAT2 - C1-14
// Date: 27/05-2020
//

const fs = require('fs');
const server = require('ws').Server;
const s = new server({ port: 3001 });
const Case = require("./databaseModels/caseModel").Case;
let dispatchers = [];
let cases = [];
let counter = 0;
let caseObj;

console.log("Listening on port 3001...");

// For connecting to the MongoDB server when archiving cases
const mongoose = require("mongoose");
const mongoDbUrl = 'mongodb+srv://dev:dev@clustercms-faqog.gcp.mongodb.net/cmsdb?retryWrites=true&w=majority';

/* Configure Mongoose to Connect to MongoDB */
mongoose.connect(mongoDbUrl, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(response => {
        console.log("MongoDB Connected Successfully.");
    }).catch(err => {
        console.log("Database connection failed.");
});

loadCases();

// Server handling events
s.on('connection', function(client) {

    // A client has sent a message to the server.
    client.on('message', function(message) {
        let data = JSON.parse(message);

        // Handle the message depending on what type it has.
        switch(data.type) {
            case "dispatcherConnect":
                // A dispatcher has connected to the server.
                dispatchers.push(client);
                cases.forEach(function(entry) {
                    client.send(JSON.stringify(simpleCase(entry)));
                });
                break;
            case "case":
                // New case submitted to the server.
                // Give the case an ID and save the client that created for live chat, then send the case to all dispatchers.
                data.id = ++counter;
                data.citizen = client;
                data.dispatcher = null;
                data.timeDate = new Date().toLocaleDateString();
                data.timeClock = getTimeClock();
                data.chatLog = [];
                data.notes = "";
                console.log("Case created (id: %d)", data.id);
                cases.push(data);
                client.send(JSON.stringify({
                    type: "caseCreated",
                    id: data.id
                }));
                broadcastToDispatchers(simpleCase(data));
                saveCases();
                break;
            case "requestOpenCase":
                // A dispatcher wants to view a case. Allow if the case is available, reject if it is taken
                caseObj = getCaseByID(data.id);
                if (caseObj != null) {
                    if (caseObj.dispatcher == null) {
                        caseObj.dispatcher = client;
                        // Send the case details to the dispatcher.
                        client.send(JSON.stringify(fullCase(caseObj)));
                        // Notify citizen that a dispatcher is now viewing the case.
                        sendChatMessage(caseObj.citizen, "A dispatcher is now viewing your case...");

                        // Update the case list for all dispatchers so they can see the case is no longer available.
                        broadcastToDispatchers({
                            type: "caseOpened",
                            id: data.id
                        })
                    } else {
                        // The case is not available. Deny the dispatcher's request.
                        client.send(JSON.stringify({
                            type: "denyOpenCase"
                        }));
                    }
                }
                break;
            case "closeCase":
                // A dispatcher has closed a case. Make the case available to other dispatchers again.
                caseObj = getCaseByID(data.id);
                if (caseObj != null) {
                    caseObj.dispatcher = null;
                    // Notify the citizen that a dispatcher is no longer viewing their case.
                    sendChatMessage(caseObj.citizen, "A dispatcher has put your case on hold...");
                    broadcastToDispatchers({
                        type: "caseClosed",
                        id: data.id
                    });
                }
                break;
            case "chatMessage":
                // Send a chat message. If it is sent from a dispatcher, forward the message to citizen.
                // If the message comes from citizen, forward it to the dispatcher.
                caseObj = getCaseByID(data.id);
                if (caseObj != null) {
                    if (data.dispatcher)
                        sendChatMessage(caseObj.citizen, data.message);
                    else
                        sendChatMessage(caseObj.dispatcher, data.message);

                    caseObj.chatLog.push(data.message);
	                saveCases();
                }
                break;
            case "saveName":
                // An dispatcher has edited the Name field in a patient journal
                caseObj = getCaseByID(data.id);
                if (caseObj != null) {
                    caseObj.name = data.value;
                    saveCases();
                }
                break;
            case "savePhone":
                // A dispatcher has edited the Phone field in a patient journal
                caseObj = getCaseByID(data.id);
                if (caseObj != null) {
                    caseObj.phone = data.value;
                    saveCases();
                }
                break;
            case "saveCPR":
                // A dispatcher has edited the CPR field in a patient journal
                caseObj = getCaseByID(data.id);
                if (caseObj != null) {
                    caseObj.cpr = data.value;
                    saveCases();
                }
                break;
            case "saveNotes":
                // A dispatcher has edited the Notes field in a patient journal
                caseObj = getCaseByID(data.id);
                if (caseObj != null) {
                    caseObj.notes = data.value;
                    saveCases();
                }
                break;
            case "requestReopenCase":
                // A citizen wants to open an already existing case
                caseObj = getCaseByID(data.id);
                if (caseObj != null) {
                    if(caseObj.citizen) {
                        // Reject because there is already a citizen viewing the case.
                        client.send(JSON.stringify({
                            type: "denyReopenCase",
                            reason: 1
                        }));
                    } else {
                        caseObj.citizen = client;
                        client.send(JSON.stringify({
                            type: "allowReopenCase",
                            id: data.id,
                            chatLog: caseObj.chatLog
                        }));
                        let msg = "The citizen has reconnected...";
                        sendChatMessage(caseObj.dispatcher, msg);
                    }
                } else {
                    // Reject because the case has been archived.
                    client.send(JSON.stringify({
                        type: "denyReopenCase",
                        reason: 2
                    }));
                }
                break;
            case "archiveCase":
                // A dispatcher wants to archive a case
                caseObj = getCaseByID(data.id);
                if (caseObj != null) {
                    // Let all dispatcher know so it gets removed from their case list.
                    broadcastToDispatchers(data);

                    sendChatMessage(caseObj.citizen, "Your case has now been closed. Further communication is not possible.");

                    // Send the case to MongoDB.
                    const newCase = new Case({
                    	id: caseObj.id,
                        name: caseObj.name,
                        phone: caseObj.phone,
                        cpr: caseObj.cpr,
                        pos: caseObj.pos,
                        desc: caseObj.desc,
                        notes: caseObj.notes,
                        chatLog: caseObj.chatLog,
                        timeClock: caseObj.timeClock,
                        timeDate: caseObj.timeDate
                    });
                    newCase.save().then(post => {
                        console.log("Case archived (id: %d)", caseObj.id);
                    });

                    // Remove the case from the cases.txt [] array
                    let i = cases.indexOf(caseObj);
                    cases.splice(i, 1);

                    saveCases();
                }
                break;
            default:
                // This should never happen
                console.log("Received some weird data...");
                break;
        }
    });

    // A client has disconnected.
    client.on('close', function() {
        // Check if they are in the dispatcher array.
        // If they are, remove them from the array.
        let i = dispatchers.indexOf(client);
        if (i !== -1) {
            // If the dispatcher had a case open, make it available to other dispatchers.
            cases.forEach(function(entry) {
                if(entry.dispatcher == client) {
                    entry.dispatcher = null;
                    sendChatMessage(entry.citizen, "A dispatcher has put your case on hold...");
                    broadcastToDispatchers({
                        type: "caseClosed",
                        id: entry.id
                    });
                }
            });
            dispatchers.splice(i, 1);
        } else {
            // Not a dispatcher, check if they created a case.
            cases.forEach(function(entry) {
                if(entry.citizen == client) {
                    entry.citizen = null;
                    let msg = "The citizen has disconnected...";
                    sendChatMessage(entry.dispatcher, msg);
                }
            });
        }
    });
});

// Sends a chat message to the client without logging it in a case.
// Useful for chat notifications.
function sendChatMessage(client, msg) {
    if (client != null)
        client.send(JSON.stringify({type: "chatMessage", message: msg}));
}

// Returns the case object with a specific id from the cases[] array.
function getCaseByID(id) {
    for (let i = 0; i < cases.length; i++) {
        if(cases[i].id == id)
            return cases[i];
    }
    return null;
}

// Lite version of a case. This is all the data needed for adding it to the dispatcher's case list.
function simpleCase(data) {
    return {
        type: "case",
        id: data.id,
        pos: data.pos,
        available: (data.dispatcher == null),
        timeClock: data.timeClock
    };
}

// Full version of a case. This is all the data needed for the chat and patient journal.
function fullCase(data) {
    return {
        type: "allowOpenCase",
        id: data.id,
        name: data.name,
        phone: data.phone,
        cpr: data.cpr,
        desc: data.desc,
        notes: data.notes,
        chatLog: data.chatLog,
        timeClock: data.timeClock,
        timeDate: data.timeDate
    };
}

// Sends data to all connected dispatchers
function broadcastToDispatchers(data) {
    dispatchers.forEach(function(dispatcher) {
        dispatcher.send(JSON.stringify(data));
    });
}

// What time is it? This is the time created for cases
function getTimeClock() {
    let time = new Date();
    let hours = time.getHours();
    let minutes = time.getMinutes();
    let seconds = time.getSeconds();

    if (hours < 10)
        hours = `0${hours}`;
    if (minutes < 10)
        minutes = `0${minutes}`;
    if (seconds < 10)
        seconds = `0${seconds}`

    return hours + ":" + minutes + ":" + seconds;
}


// Saves current cases to file, which can be loaded in the case of a server restart/crash.
// NOTE: Can be improved if we only add/delete entries in the file when they are added/deleted instead of saving the entire array constantly.
function saveCases() {
    //Delete any already existing data in save file
    fs.truncate('cases.txt', 0, function(){});

    // Write this simplified cases array to a file the server can read from next time it starts.
    fs.writeFile('cases.txt', JSON.stringify(cases, ["type", "id", "name", "phone", "cpr", "desc", "notes", "chatLog", "timeClock", "timeDate", "pos", "lat", "lng"], 4), (err) => {
        if (err) {
            console.log("Failed to save cases. " + err);
        }
    });
}

// Load current cases from file
function loadCases() {
    console.log("Loading active cases from previous session...");

    fs.readFile('cases.txt', {encoding: 'utf-8'}, function(err, data){
        if(err) {
            console.log("Failed to read cases.txt. " + err);
        } else {
            try {
                cases = JSON.parse(data);
                console.log("Loaded " + cases.length + " cases.");

                if(cases.length > 0)
                    counter = cases[cases.length-1].id;
            } catch(jsonError) {
                console.log("There were no cases to load or cases.txt is broken.");
            }
        }
    });
}
