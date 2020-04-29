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
const saveCaseButton = document.getElementById('save-case-button');
const closeCaseButton = document.getElementById('close-case-button');
const archiveCaseButton = document.getElementById('archive-case-button');
let currentCaseID = null;
SetChatEMD(true);
SetChatName(prompt("Enter your live-chat name."));
let ws = new WebSocket("ws://localhost:3001");

saveCaseButton.onclick = function() {
    // save notes to case on server
}

closeCaseButton.addEventListener("click", function(){
     CloseCurrentCase();
});

archiveCaseButton.onclick = function() {
    SendToServer( {type: "ArchiveCase", id: currentCaseID} );
    ResetJournal();
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

function ResetJournal() {
    journalHeader.innerHTML = "Press Case ID to display patient journal";
    journal.style.display = "none";
    SetChatHeader("");
    SetChatLog("");
    currentCaseID = null;
}

function CloseCurrentCase() {
    SendToServer({
        type: "CloseCase",
        id: currentCaseID
    });
    ResetJournal();
}

function ArchiveCase(id) {
    console.log("delete: " + id);
    for (var i = 0; i < caseList.rows.length; i++) {
        if (caseList.rows[i].id == id)
            caseList.deleteRow(i);
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
    journalLocation.textContent = "Location: " + GetTableRowByID(data.id).marker.position;
    journalTime.textContent = "Time created: " + data.timeDate + " " + data.timeClock;
    journalDescription.textContent = "Description: " + data.desc;
    journalDispatcherNotes.innerHTML = 'Dispatcher notes: <input type="text" id="dispatcher-notes">';
    journal.style.display = 'block';
}

function UpdateChat(data) {
    SetChatHeader("Case ID: " + data.id);
    SetChatID(data.id);
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

function sortTable(sortType) {
   let rows, sorting = true, i, caseId1, caseId2, caseStatus1, caseStatus2, shouldSwap, dir, switchcount = 0;
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
