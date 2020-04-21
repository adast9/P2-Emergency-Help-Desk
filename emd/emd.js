let map = new google.maps.Map(document.getElementById("map"), {
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

closeJournalButton.addEventListener("click", function(){
    journalHeader.innerHTML = "Press Case ID to display patient journal";
    journal.style.display = "none";
});

const closeCaseButton = document.getElementById('close-case-button');
closeCaseButton.onclick = function() {
    //delete case from the server
}
const dispatcherNotesButton = document.getElementById('dispatcher-notes-button');
dispatcherNotesButton.onclick = function() {
  //save notes to case on server
}
const chatHeader = document.getElementById('chatId');
const chatLog = document.getElementById('chatlog');

let ws = new WebSocket("ws://localhost:3001");

ws.onopen = function() {
    console.log("Connected to the server.");

    SendToServer({
        type: "EMDConnect"
    });
}

ws.onmessage = function(event) {
    data = JSON.parse(event.data);

    console.log(data);

    switch(data.type) {
        case "Case":
            console.log(`New case received. ID: ${parseInt(data.id)}`);
            console.log(data);
            AddCase(data);
            break;
        case "AllowOpenCase":
            currentCaseID = data.id;
            map.setCenter(data.pos)
            UpdateJournal(data);
            UpdateChat(data);
            closeJournalButton.onclick = function() {
                SendToServer({
                    type: "CloseCase",
                    id: data.id
                });
            }
            break;
        case "DenyOpenCase":
            alert("This case is already being handled by another operator.");
            break;
        case "CaseOpened":
            for (let i = 0; i < caseList.rows.length; i++) {
                if (caseList.rows[i].id == data.id)
                    caseList.rows[i].cells[1].innerHTML = "Locked";
            }
            break;
        case "CaseClosed":
            for (let i = 0; i < caseList.rows.length; i++) {
                if (caseList.rows[i].id == data.id)
                    caseList.rows[i].cells[1].innerHTML = "Open";
            }
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
    row.insertCell().innerHTML = (data.emdID == null) ? "Open" : "Locked";
    row.insertCell().innerHTML = data.timeClock;

    //displaying the journal entry for the corresponding case ID
    idBtn.onclick = function() {
        SendToServer({
            type: "RequestOpenCase",
            id: row.id
        });
    }
}

function UpdateJournal(data) {
    journalHeader.innerHTML = "Case ID: " + data.id;
    journalName.innerHTML = "Name: " + data.name;
    journalPhone.innerHTML = "Phone: " + data.phone;
    journalCPR.innerHTML = "CPR: " + data.cpr;
    journalLocation.innerHTML = "Location: " + data.location;
    journalTime.innerHTML = "Time created: " + data.timeDate + " " + data.timeClock;
    journalDescription.innerHTML = "Description: " + data.desc;
    journalDispatcherNotes.innerHTML = 'Dispatcher notes: <input type="text" id="dispatcher-notes">';
    journal.style.display = 'block';
}

function UpdateChat(data) {
    chatHeader.textContent = "Case ID: " + data.id;
    chatLog.textContent = data.chatlog;
}

/*function ChatMessage(data) {
    for (let i = 0; i < caseList.rows.length; i++) {
        if (caseList.rows[i].id == data.id) {
            caseList.rows[i].chatLog += data.message;
            break;
        }
    }
}*/

function PlaceMarker(id, location) {
    return new google.maps.Marker({
        position: location,
        map: map,
        label: id.toString(),
        draggable: false,
    });
}

/*function deleteCase(id) {
    let check = prompt("Write 'DELETE' to close the case.");

    if(check == "DELETE") {
        SendToServer({
            type: "deleteCase",
            id: id
        });
        alert(`Case deleted. (id: ${id})`);
    }
}*/

function SendToServer(data) {
    ws.send(JSON.stringify(data));
}
