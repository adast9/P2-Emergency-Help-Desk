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

let currentCase = null;

closeJournalButton.onclick = function() {
    journalHeader.innerHTML = "Press Case ID to display patient journal";
    journal.style.display = "none";

    SendToServer({
        type: "CloseCase",
        id: currentCase.id
    });
};
const closeCaseButton = document.getElementById('close-case-button');
closeCaseButton.onclick = function() {
    //delete case from the server
}
const dispatcherNotesButton = document.getElementById('dispatcher-notes-button');
dispatcherNotesButton.onclick = function() {
  //save notes to case on server
}
const chatHeader = document.getElementById('chatId');

let ws = new WebSocket("ws://localhost:3001");

ws.onopen = function() {
    console.log("Connected to the server.");

    SendToServer({
        type: "EMDConnect"
    });
}

ws.onmessage = function(event) {
    data = JSON.parse(event.data);

    switch(data.type) {
        case "Case":
            console.log(`New case received. ID: ${parseInt(data.id)}`);
            AddCase(data);
            break;
        case "OpenCase":
            OpenCase(data);
            break;
        /*case "CloseCase":
            for (var i = 0; i < table.rows.length; i++) {
                if(table.rows[i].id == json.id) {
                    // Remove the marker from the map and delete the row from the table.
                    table.rows[i].marker.setMap(null);
                    table.deleteRow(i);
                    break;
                }
            }
            break;*/
        case "CloseCase":
            CloseCase(data);
            break;
        default:
            console.log("Received some weird data... ");
            break;
    }
}

function AddCase(data) {
    let row = caseList.insertRow();
    row.marker = PlaceMarker(data.id, data.pos);
    row.id = data.id;
    row.pos = data.pos;
    row.name = data.name;
    row.phone = data.phone;
    row.cpr = data.cpr;
    row.location = data.location;
    row.timeDate = data.timeDate;
    row.timeClock = data.timeClock;
    row.desc = data.desc;
    row.creater = data.creator;
    row.emd = data.emd;
    row.chatlog = data.chatlog;

    //ID Button
    let idBtnCell = row.insertCell();
    let idBtn = document.createElement("BUTTON");
    idBtn.innerHTML = row.id;
    idBtnCell.appendChild(idBtn);
    row.insertCell().innerHTML = (row.emd == null) ? "Open" : "Locked";
    row.insertCell().innerHTML = row.timeClock;

    //displaying the journal entry for the corresponding case ID
    idBtn.addEventListener('click', () => {
        if (row.emd == null) {
            currentCase = row;
            map.setCenter(currentCase.pos)
            UpdateJournal();
            UpdateChat();
            SendToServer({
                type: "OpenCase",
                id: currentCase.id
            });
        } else {
            alert("This case is already being handled by another operator.");
        }
    })
}

function UpdateJournal() {
    journalHeader.innerHTML = "Case ID: " + currentCase.id;
    journalName.innerHTML = "Name: " + currentCase.name;
    journalPhone.innerHTML = "Phone: " + currentCase.phone;
    journalCPR.innerHTML = "CPR: " + currentCase.cpr;
    journalLocation.innerHTML = "Location: " + currentCase.location;
    journalTime.innerHTML = "Time created: " + currentCase.timeDate + " " + currentCase.timeClock;
    journalDescription.innerHTML = "Description: " + currentCase.desc;
    journalDispatcherNotes.innerHTML = 'Dispatcher notes: <input type="text" id="dispatcher-notes">';
    journal.style.display = 'block';
}

function UpdateChat() {
    chatHeader.textContent = "Case ID: " + currentCase.id;
}

function OpenCase(data) {
    for (var i = 0; i < caseList.rows.length; i++) {
        if(caseList.rows[i].id == data.id) {
            caseList.rows[i].cells[1].innerHTML = "Locked";
            caseList.rows[i].emd = data.emd;
            break;
        }
    }
}

function CloseCase(data) {
    for (var i = 0; i < caseList.rows.length; i++) {
        if(caseList.rows[i].id == data.id) {
            caseList.rows[i].cells[1].innerHTML = "Open";
            caseList.rows[i].emd = null;
            break;
        }
    }
}

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
