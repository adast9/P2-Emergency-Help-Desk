// Table for cases in the left column
const caseList = document.getElementById('cases');

// The map in the middle column.
const map = new google.maps.Map(document.getElementById("map"), {
    zoom: 6.6,
    center: new google.maps.LatLng(56.263920, 9.501785),
    mapTypeId: google.maps.MapTypeId.ROADMAP
});

// Journal input fields
const journalTitle = document.getElementById('journal-title');
const journal = document.getElementById('journal');
const journalName = document.getElementById('journal-name');
const journalPhone = document.getElementById('journal-phone');
const journalCPR = document.getElementById('journal-cpr');
const journalLocation = document.getElementById('journal-location');
const journalTime = document.getElementById('journal-fulltime');
const journalDescription = document.getElementById('journal-description');
const journalNearbyCases = document.getElementById('journal-nearby-cases');
const journalNotes = document.getElementById('journal-notes');

// Journal variables for editable fields
const journalToggles = document.getElementsByClassName('journal-toggle');
let saveName, savePhone, saveCPR, saveNotes;
InitJournalToggles();

journalName.onkeyup = function() { saveName = JournalFieldKeyUp(this, "SaveName", saveName) };
journalPhone.onkeyup = function() { savePhone = JournalFieldKeyUp(this, "SavePhone", savePhone) };
journalCPR.onkeyup = function() { saveCPR = JournalFieldKeyUp(this, "SaveCPR", saveCPR) };
journalNotes.onkeyup = function() { saveNotes = JournalFieldKeyUp(this, "SaveNotes", saveNotes) };

// Editable journal fields are saved x milliseconds after finishing typing.
function JournalFieldKeyUp(field, type, saveVar) {
    clearTimeout(saveVar);
    return setTimeout(SaveJournalField, 1000, type, field.value);
}

// Journal buttons
const closeCaseButton = document.getElementById('close-case-button');
const archiveCaseButton = document.getElementById('archive-case-button');

closeCaseButton.addEventListener("click", function(){
     CloseCurrentCase();
});
archiveCaseButton.onclick = function() {
    SendToServer( {type: "ArchiveCase", id: currentCaseID} );
    ResetJournal();
    ResetChat();
}

// Setup chat and journal
let currentCaseID = null;
SetChatEMD(true);
SetChatName("Dispatcher");
ResetChat();
ResetJournal();

// Connect to WebSocket server
let ws = new WebSocket("ws://localhost:3001");

// Successfully connected to the WebSocket server.
ws.onopen = function() {
    console.log("Connected to the server.");
    // Let the server know we are an EMD.
    SendToServer( {type: "EMDConnect"} );
}

// Received a message from the server
ws.onmessage = function(event) {
    data = JSON.parse(event.data);

    // Handle the message depening on what 'type' it has.
    switch(data.type) {
        case "Case":
            // A case has been created / we just connected so the server is sending us all the cases.
            AddCase(data);
            if(currentCaseID != null)
                UpdateNearbyCases(GetTableRowByID(currentCaseID).marker.position);
            console.log(`New case received. ID: ${parseInt(data.id)}`);
            break;
        case "AllowOpenCase":
            // Server has allowed us to view a case. Update chat, journal & map position.
            if(currentCaseID != null)
                CloseCurrentCase();
            currentCaseID = data.id;
            map.setCenter(GetTableRowByID(data.id).marker.position);
            UpdateJournal(data);
            UpdateChat(data);
            break;
        case "DenyOpenCase":
            // Server didn't allow us to view a case.
            alert("This case is already being handled by another operator.");
            break;
        case "CaseOpened":
            // An EMD is now viewing a case
            CaseUpdated(data.id, true);
            break;
        case "CaseClosed":
            // An EMD is no longer viewing a case
            CaseUpdated(data.id, false);
            break;
        case "ChatMessage":
            // We recieved a chat message
            ChatMessage(data.message);
            break;
        case "ArchiveCase":
            // A case has been archived.
            ArchiveCase(data.id);
            if(currentCaseID != null)
                UpdateNearbyCases(GetTableRowByID(currentCaseID).marker.position);
            break;
        default:
            console.log("Received some weird data... ");
            break;
    }
}

// Adds a case to the case list table.
function AddCase(data) {
    // Create new row in the table. Assign it with the case ID and location. (ID is for identifying which row corresponds to which case).
    let row = caseList.insertRow();
    row.id = data.id;
    row.marker = PlaceMarker(data.id, data.pos);

    // ID Button.
    let idBtnCell = row.insertCell();
    let idBtn = document.createElement("BUTTON");
    idBtn.innerHTML = row.id;
    idBtn.classList.add("btn");
    idBtn.classList.add("btn-outline-dark");
    idBtnCell.appendChild(idBtn);
    idBtn.onclick = function() {
        if(currentCaseID != row.id) {
            SendToServer({
                type: "RequestOpenCase",
                id: row.id
            });
        } else {
            alert("You are already working on this case.");
        }
    }

    // Case availability and time created.
    row.insertCell().innerHTML = (data.available) ? "Open" : "Locked";
    row.insertCell().innerHTML = data.timeClock;
}

// No longer viewing a case. Let the server know and update journal + chat.
function CloseCurrentCase() {
    SendToServer({
        type: "CloseCase",
        id: currentCaseID
    });
    ResetJournal();
    ResetChat();
}

// Update patient journal with case data.
function UpdateJournal(data) {
    let pos = GetTableRowByID(data.id).marker.position;
    ResetJournalToggles();
    UpdateNearbyCases(pos);
    journalTitle.textContent = "Case ID: " + data.id;
    journalName.value = data.name;
    journalPhone.value = data.phone;
    journalCPR.value = data.cpr;
    journalLocation.value = pos;
    journalTime.value = data.timeDate + " " + data.timeClock;
    journalDescription.value = data.desc;
    journalNotes.value = data.notes;
    journal.style.display = 'block';
}

// This is used to list the distance from the current case to other cases.
function UpdateNearbyCases(currentCasePos) {
    // Reset the table
    while (journalNearbyCases.rows.length > 1) {
        journalNearbyCases.deleteRow(-1);
    }
    let distanceToCases = [];
    // Calculate distances to each case.
    for (var i = 1; i < caseList.rows.length; i++) {
        let dist = calcDistance(currentCasePos, caseList.rows[i].marker.position);
        if (Math.round(dist) <= 1000) {
            distanceToCases.push({
                id: caseList.rows[i].id,
                dist: dist
            });
        }
    }
    // Sort by distance in ascending order.
    distanceToCases.sort(function(a, b){return a.dist - b.dist});
    // Update the table
    for (var i = 1; i < distanceToCases.length; i++) {
        let row = journalNearbyCases.insertRow();
        row.insertCell().innerHTML = distanceToCases[i].id;
        row.insertCell().innerHTML = Math.round(distanceToCases[i].dist);
    }
}

// Returns the distance between two map points in meters.
function calcDistance(p1, p2) {
    return (google.maps.geometry.spherical.computeDistanceBetween(p1, p2));
}

// Set up chat for the current case.
function UpdateChat(data) {
    SetChatID(data.id);
    chatLog.innerHTML = "";
    for (var i = 0; i < data.chatLog.length; i++) {
        ChatMessage(data.chatLog[i]);
    }
    chatInput.disabled = false;
    chatSendButton.disabled = false;
}

// An EMD has is now viewing or no longer viewing a case. Update the case's status in the case list.
function CaseUpdated(id, opened) {
    var row = GetTableRowByID(id);
    if (row != null)
        row.cells[1].innerHTML = opened ? "Locked" : "Open";
}

// An EMD has archived a case. Remove it from the case list.
function ArchiveCase(id) {
    for (var i = 1; i < caseList.rows.length; i++) {
        if (caseList.rows[i].id == id) {
            caseList.rows[i].marker.setMap(null);
            caseList.deleteRow(i);
        }
    }
}

// Not viewing a case. Set the journal to its default state.
function ResetJournal() {
    journalTitle.innerHTML = "Open a case to display patient journal";
    journal.style.display = "none";
    currentCaseID = null;
}

// Not viewing a case. Set the chat to its default state.
function ResetChat() {
    SetChatHeader("Open a case to display chat");
    chatLog.innerHTML = "";
    chatInput.value = ""
    chatInput.disabled = true;
    chatSendButton.disabled = true;
}

// Make editable fields in the journal locked.
function ResetJournalToggles() {
    for (var i = 0; i < journalToggles.length; i++) {
        journalToggles[i].innerHTML = "<i class='far fa-eye'></i>";
        journalToggles[i].field.readOnly = true;
    }
}

// Toggle an editable field in the journal between editable and read only.
function ToggleJournalField(toggle) {
    toggle.field.readOnly = !toggle.field.readOnly;
    if (toggle.field.readOnly)
        toggle.innerHTML = "<i class='far fa-eye'></i>";
    else
        toggle.innerHTML = "<i class='fas fa-pencil-alt'></i>";
}

// An editable field has been edited. Send the new value to the server.
function SaveJournalField(type, value) {
    SendToServer({
        type: type,
        id: currentCaseID,
        value: value});
}

// Returns the row in the case list that corresponds to the case with the specified ID.
function GetTableRowByID(id) {
    for (let i = 1; i < caseList.rows.length; i++) {
        if (caseList.rows[i].id == id)
            return caseList.rows[i];
    }
    return null;
}

// Places a case marker on the map.
function PlaceMarker(id, location) {
    return new google.maps.Marker({
        position: location,
        map: map,
        label: id.toString(),
        draggable: false,
    });
}

function InitJournalToggles() {
    for (var i = 0; i < journalToggles.length; i++)
        journalToggles[i].field = document.getElementById(journalToggles[i].id);
}

function SendToServer(data) {
    ws.send(JSON.stringify(data));
}
