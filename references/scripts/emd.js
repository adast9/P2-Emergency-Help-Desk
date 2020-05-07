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

ws.onopen = function() {
    console.log("Connected to the server.");
    SendToServer( {type: "EMDConnect"} );
}

ws.onmessage = function(event) {
    data = JSON.parse(event.data);

    switch(data.type) {
        case "Case":
            AddCase(data);
            if(currentCaseID != null)
                UpdateNearbyCases(GetTableRowByID(currentCaseID).marker.position);
            console.log(`New case received. ID: ${parseInt(data.id)}`);
            break;
        case "AllowOpenCase":
            if(currentCaseID != null)
                CloseCurrentCase();
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
            ChatMessage(data.message);
            break;
        case "ArchiveCase":
            ArchiveCase(data.id);
            if(currentCaseID != null)
                UpdateNearbyCases(GetTableRowByID(currentCaseID).marker.position);
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
    idBtn.classList.add("btn");
    idBtn.classList.add("btn-outline-dark");
    idBtnCell.appendChild(idBtn);
    row.insertCell().innerHTML = (data.available) ? "Open" : "Locked";
    row.insertCell().innerHTML = data.timeClock;

    idBtn.onclick = function() {
        SendToServer({
            type: "RequestOpenCase",
            id: row.id
        });
    }
}

function CloseCurrentCase() {
    SendToServer({
        type: "CloseCase",
        id: currentCaseID
    });
    ResetJournal();
    ResetChat();
}

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

function UpdateNearbyCases(currentCasePos) {
    while (journalNearbyCases.rows.length > 1) {
        journalNearbyCases.deleteRow(-1);
    }
    let distanceToCases = [];
    for (var i = 1; i < caseList.rows.length; i++) {
        distanceToCases.push({
            id: caseList.rows[i].id,
            dist: calcDistance(currentCasePos, caseList.rows[i].marker.position)
        })
    }
    distanceToCases.sort(function(a, b){return a.dist - b.dist});
    for (var i = 1; i < distanceToCases.length; i++) {
        let row = journalNearbyCases.insertRow();
        row.insertCell().innerHTML = distanceToCases[i].id;
        row.insertCell().innerHTML = Math.round(distanceToCases[i].dist);
    }
}

function calcDistance(p1, p2) {
    return (google.maps.geometry.spherical.computeDistanceBetween(p1, p2));
}

function UpdateChat(data) {
    SetChatHeader("Case ID: " + data.id);
    SetChatID(data.id);
    chatLog.innerHTML = data.chatLog;
    chatInput.disabled = false;
    chatSendButton.disabled = false;
}

function CaseUpdated(id, opened) {
    var row = GetTableRowByID(id);
    if (row != null)
        row.cells[1].innerHTML = opened ? "Locked" : "Open";
}

function ArchiveCase(id) {
    for (var i = 1; i < caseList.rows.length; i++) {
        if (caseList.rows[i].id == id)
            caseList.deleteRow(i);
    }
}

function ResetJournal() {
    journalTitle.innerHTML = "Open a case to display patient journal";
    journal.style.display = "none";
    currentCaseID = null;
}

function ResetChat() {
    SetChatHeader("Open a case to display chat");
    SetChatLog("");
    chatInput.value = ""
    chatInput.disabled = true;
    chatSendButton.disabled = true;
}

function ResetJournalToggles() {
    for (var i = 0; i < journalToggles.length; i++) {
        journalToggles[i].innerHTML = "<i class='far fa-eye'></i>";
        journalToggles[i].field.readOnly = true;
    }
}

function ToggleJournalField(toggle) {
    toggle.field.readOnly = !toggle.field.readOnly;
    if (toggle.field.readOnly)
        toggle.innerHTML = "<i class='far fa-eye'></i>";
    else
        toggle.innerHTML = "<i class='fas fa-pencil-alt'></i>";
}

function SaveJournalField(type, value) {
    SendToServer({
        type: type,
        id: currentCaseID,
        value: value});
}

function GetTableRowByID(id) {
    for (let i = 1; i < caseList.rows.length; i++) {
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

function InitJournalToggles() {
    for (var i = 0; i < journalToggles.length; i++)
        journalToggles[i].field = document.getElementById(journalToggles[i].id);
}

function SendToServer(data) {
    ws.send(JSON.stringify(data));
}

function sortTable(sortType) {
   let sorting = true;
   let rows, i, caseId1, caseId2, caseStatus1, caseStatus2, shouldSwap, dir;
   let switchcount = 0;
   let table = document.getElementById('cases');
   dir = 'asc';

   while (sorting) {

    sorting = false;
      rows = table.rows;
      if (sortType === 'sortById') {
         for (i = 1; i < (rows.length - 1); i++) {
            shouldSwap = false;
            caseId1 = rows[i].getElementsByTagName("TD")[0];
            caseId2 = rows[i + 1].getElementsByTagName("TD")[0];

            if (dir == 'asc') {
               if (Number(caseId1.innerText) > Number(caseId2.innerText)) {
                  shouldSwap = true;
                  break;
               }
            } else if (dir == 'desc') {
               if (Number(caseId1.innerText) < Number(caseId2.innerText)) {
                  shouldSwap = true;
                  break;
               }
            }
         }
      }
      else if (sortType === 'sortByStatus') {
         for (i = 1; i < (rows.length - 1); i++) {
            shouldSwap = false;
            caseStatus1 = rows[i].getElementsByTagName("TD")[1];
            caseStatus2 = rows[i + 1].getElementsByTagName("TD")[1];
            caseId1 = rows[i].getElementsByTagName("TD")[0];
            caseId2 = rows[i + 1].getElementsByTagName("TD")[0];

            if (dir == 'asc') {
               if (caseStatus1.innerHTML < caseStatus2.innerHTML) {
                  shouldSwap = true;
                  break;
               } else if (caseStatus1.innerHTML == caseStatus2.innerHTML && Number(caseId1.innerText) > Number(caseId2.innerText)) {
                  shouldSwap = true;
                  break;
               }
            } else if (dir == 'desc') {
               if (caseStatus1.innerHTML > caseStatus2.innerHTML) {
                  shouldSwap = true;
                  break;
               } else if (caseStatus1.innerHTML == caseStatus2.innerHTML && Number(caseId1.innerText) > Number(caseId2.innerText)) {
                  shouldSwap = true;
                  break;
               }
            }
         }
      }
      if (shouldSwap) {
         rows[i].parentNode.insertBefore(rows[i + 1], rows[i]);
         sorting = true;
         switchcount++;
      } else {
         if (switchcount == 0 && dir == 'asc') {
            dir = 'desc';
            sorting = true;
         }
      }
    }
}