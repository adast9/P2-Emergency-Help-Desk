const map = new google.maps.Map(document.getElementById("map"), {
    zoom: 6.6,
    center: new google.maps.LatLng(56.263920, 9.501785),
    mapTypeId: google.maps.MapTypeId.ROADMAP
});
const caseList = document.getElementById('cases');
const journalHeader = document.getElementById('journal-header');
const journal = document.getElementById('journal');
const journalName = document.getElementById('journal-name');
const journalPhone = document.getElementById('journal-phone');
const journalCPR = document.getElementById('journal-cpr');
const journalLocation = document.getElementById('journal-location');
const journalTime = document.getElementById('journal-fulltime');
const journalDescription = document.getElementById('journal-description');
const journalDispatcherNotes = document.getElementById('journal-dispatcher-notes');
const closeJournalButton = document.getElementById('exit-journal-button');
const closeCaseButton = document.getElementById('close-case-button');
const dispatcherNotesButton = document.getElementById('dispatcher-notes-button');
const chatHeader = document.getElementById('chat-header');
const chatLog = document.getElementById('chat-log');
const chatInput = document.getElementById('chat-input');
const chatSendButton = document.getElementById("chat-send");
let currentCaseID = null;
let ws = new WebSocket("ws://localhost:3001");

chatSendButton.onclick = function() {
    let msg = "Dispatcher: " + chatInput.value + "<br>";
	chatLog.innerHTML += msg;
    chatLog.scrollTop = chatLog.scrollHeight;
    SendToServer({
        type: "ChatMessage",
        message: msg,
        caseID: currentCaseID,
        emd: true
    });
    chatInput.value = '';
}

closeJournalButton.addEventListener("click", function(){
    journalHeader.innerHTML = "Press Case ID to display patient journal";
    journal.style.display = "none";
    chatHeader.textContent = "";
    SendToServer({
        type: "CloseCase",
        id: currentCaseID
    });
});

closeCaseButton.onclick = function() {
    // delete case from the server
}

dispatcherNotesButton.onclick = function() {
    // save notes to case on server
}

ws.onopen = function() {
    console.log("Connected to the server.");
    SendToServer( {type: "EMDConnect"} );
}

ws.onmessage = function(event) {
    data = JSON.parse(event.data);

    switch(data.type) {
        case "Case":
            console.log(`New case received. ID: ${parseInt(data.id)}`);
            AddCase(data);
            break;
        case "AllowOpenCase":
            currentCaseID = data.id;
            map.setCenter(GetTableRowByID(data.id).marker.position);
            UpdateJournal(data);
            UpdateChat(data);
            break;
        case "DenyOpenCase":
            alert("This case is already being handled by another operator.");
            break;
        case "CaseOpened":
            CaseUpdated(data.id, true);
            break;
        case "CaseClosed":
            CaseUpdated(data.id, false);
            break;
        case "ChatMessage":
            chatLog.innerHTML += data.message;
            break;
        default:
            console.log("Received some weird data... ");
            break;
    }
}

function AddCase(data) {
    let row = caseList.insertRow();
    row.id = data.id;
    row.marker = PlaceMarker(data.id, data.pos);

    //ID Button
    let idBtnCell = row.insertCell();
    let idBtn = document.createElement("BUTTON");
    idBtn.innerHTML = row.id;
    idBtnCell.appendChild(idBtn);
    row.insertCell().innerHTML = (data.available) ? "Open" : "Locked";
    row.insertCell().innerHTML = data.timeClock;

    //displaying the journal entry for the corresponding case ID
    idBtn.onclick = function() {
        SendToServer({
            type: "RequestOpenCase",
            id: row.id
        });
    }
}

function CaseUpdated(id, opened) {
    var row = GetTableRowByID(id);
    if (row != null)
        row.cells[1].innerHTML = opened ? "Locked" : "Open";
}

function UpdateJournal(data) {
    journalHeader.textContent = "Case ID: " + data.id;
    journalName.textContent = "Name: " + data.name;
    journalPhone.textContent = "Phone: " + data.phone;
    journalCPR.textContent = "CPR: " + data.cpr;
    journalLocation.textContent = "Location: " + data.location;
    journalTime.textContent = "Time created: " + data.timeDate + " " + data.timeClock;
    journalDescription.textContent = "Description: " + data.desc;
    journalDispatcherNotes.innerHTML = 'Dispatcher notes: <input type="text" id="dispatcher-notes">';
    journal.style.display = 'block';
}

function UpdateChat(data) {
    chatHeader.textContent = "Case ID: " + data.id;
    chatLog.innerHTML = data.chatLog;
}

function GetTableRowByID(id) {
    for (let i = 0; i < caseList.rows.length; i++) {
        if (caseList.rows[i].id == id)
            return caseList.rows[i];
    }
    return null;
}

function PlaceMarker(id, location) {
    return new google.maps.Marker({
        position: location,
        map: map,
        label: id.toString(),
        draggable: false,
    });
}

function SendToServer(data) {
    ws.send(JSON.stringify(data));
}
