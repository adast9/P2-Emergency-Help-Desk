const fs = require('fs');
const server = require('ws').Server;
const s = new server({ port: 3001 });
let emds = [];
let cases = [];
let counter = 0;

console.log("Listening on port 3001...");
//LoadCases();

const mongodb = require("mongodb");
const mongoose = require("mongoose");
const mongoDbUrl = 'mongodb+srv://dev:dev@clustercms-faqog.gcp.mongodb.net/cmsdb?retryWrites=true&w=majority';

/* Configure Mongoose to Connect to MongoDB */
mongoose.connect(mongoDbUrl, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(response => {
        console.log("MongoDB Connected Successfully.");
    }).catch(err => {
        console.log("Database connection failed.");
});

const caseSchema = new mongoose.Schema({
    name: String,
    phone: String,
    cpr: String,
    pos: {
        lat: Number,
        lng: Number
    },
    desc: String,
    notes: String,
    chatLog: String,
    timeClock: String,
    timeDate: String
});

var Case = mongoose.model('Case', caseSchema);

//Server handling events
s.on('connection', function(client) {

    client.on('close', function() {
        // When a client disconnects, check if they are in the EMD array.
        // If they are, remove them from the array.
        let i = emds.indexOf(client);
        if (i !== -1) {
            // If the EMD had a case open, close it.
            cases.forEach(function(entry) {
                if(entry.emd == client) {
                    entry.emd = null;
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
                data.id = ++counter;
                data.creator = client;
                data.emd = null;
                data.timeDate = new Date().toLocaleDateString();
                data.timeClock = getTimeClock();
                data.chatLog = "";
                data.notes = "";
                console.log("Case created (id: %d)", data.id);
                cases.push(data);
                client.send(JSON.stringify({
                    type: "CaseCreated",
                    id: data.id
                }));
                BroadcastToEMDs(SimpleCase(data));
                //SaveCases();
                break;
            case "RequestOpenCase":
                var caseObj = GetCaseByID(data.id);
                if (caseObj != null) {
                    if (caseObj.emd == null) {
                        caseObj.emd = client;
                        client.send(JSON.stringify(FullCase(caseObj)));
                        ChatNotifications(caseObj, true);
                        BroadcastToEMDs({
                            type: "CaseOpened",
                            id: data.id
                        })
                    } else {
                        client.send(JSON.stringify({
                            type: "DenyOpenCase"
                        }));
                    }
                }
                break;
            case "CloseCase":
                var caseObj = GetCaseByID(data.id);
                if (caseObj != null) {
                    caseObj.emd = null;
                    ChatNotifications(caseObj, false);
                    BroadcastToEMDs({
                        type: "CaseClosed",
                        id: data.id
                    });
                }
                break;
            case "ChatMessage":
                var caseObj = GetCaseByID(data.caseID);
                if (caseObj != null) {
                    msgObj = {
                        type: "ChatMessage",
                        message: data.message
                    };
                    if (data.emd)
                        caseObj.creator.send(JSON.stringify(msgObj));
                    else
                        if(caseObj.emd) caseObj.emd.send(JSON.stringify(msgObj));

                    caseObj.chatLog += data.message;
                }
                break;
            case "SaveName":
                var caseObj = GetCaseByID(data.id);
                if (caseObj != null)
                    caseObj.name = data.value;
                break;
            case "SavePhone":
                var caseObj = GetCaseByID(data.id);
                if (caseObj != null)
                    caseObj.phone = data.value;
                break;
            case "SaveCPR":
                var caseObj = GetCaseByID(data.id);
                if (caseObj != null)
                    caseObj.cpr = data.value;
                break;
            case "SaveNotes":
                var caseObj = GetCaseByID(data.id);
                if (caseObj != null)
                    caseObj.notes = data.value;
                break;
            case "ArchiveCase":
                var caseObj = GetCaseByID(data.id);
                if (caseObj != null) {
                    BroadcastToEMDs(data);

                    const newCase = new Case({
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

                    let i = cases.indexOf(caseObj);
                    cases.splice(i, 1);
                }
                break;
            default:
                console.log("Received some weird data...");
                break;
        }
    });
});

function ChatNotifications(caseObj, open) {
    let msg = open ? "A dispatcher is now viewing your case..." : "A dispatcher has put your case on hold...";
    msg += "<br>";
    caseObj.creator.send(JSON.stringify({type: "ChatMessage", message: msg}));
}

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
        available: (data.emd == null),
        timeClock: data.timeClock
    };
}

function FullCase(data) {
    return {
        type: "AllowOpenCase",
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
