const map = new google.maps.Map(document.getElementById("map"), {
    zoom: 6.6,
    center: new google.maps.LatLng(56.263920, 9.501785),
    mapTypeId: google.maps.MapTypeId.ROADMAP
});
const caseList = document.getElementById('cases');
const journalTitle = document.getElementById('journal-title');
const journal = document.getElementById('journal');
const journalName = document.getElementById('journal-name');
const journalPhone = document.getElementById('journal-phone');
const journalCPR = document.getElementById('journal-cpr');
const journalLocation = document.getElementById('journal-location');
const journalTime = document.getElementById('journal-fulltime');
const journalDescription = document.getElementById('journal-description');
const journalNotes = document.getElementById('journal-notes');
// const saveText = document.getElementById('save-text');
const closeCaseButton = document.getElementById('close-case-button');
const archiveCaseButton = document.getElementById('archive-case-button');
let currentCaseID = null;
SetChatEMD(true);
SetChatName("Dispatcher");
ResetChat();
ResetJournal();
let ws = new WebSocket("ws://localhost:3001");
let saveVar;

closeCaseButton.addEventListener("click", function(){
     CloseCurrentCase();
});

archiveCaseButton.onclick = function() {
    SaveNotes();
    SendToServer( {type: "ArchiveCase", id: currentCaseID} );
    ResetJournal();
    ResetChat();
}

//Save journal notes x milliseconds after finishing typing
journalNotes.onchange = function() {
    // saveText.innerText = "";
    clearTimeout(saveVar);
    saveVar = setTimeout(SaveNotes, 1000);
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
    idBtn.classList.add("btn");
    idBtn.classList.add("btn-outline-dark");
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

function CloseCurrentCase() {
    SaveNotes();
    SendToServer({
        type: "CloseCase",
        id: currentCaseID
    });
    ResetJournal();
    ResetChat();
}

function SaveNotes() {
    // saveText.innerText = "Saved!";
    SendToServer({
        type: "SaveNotes",
        id: currentCaseID,
        notes: journalNotes.value});
}

function ArchiveCase(id) {
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

function UpdateJournal(data) {
    journalTitle.textContent = "Case ID: " + data.id;
    journalName.value = data.name;
    journalPhone.value = data.phone;
    journalCPR.value = data.cpr;
    journalLocation.value = GetTableRowByID(data.id).marker.position;
    journalTime.value = data.timeDate + " " + data.timeClock;
    journalDescription.value = data.desc;
    journalNotes.value = data.notes;
    // saveText.textContent = "";
    journal.style.display = 'block';
}

function UpdateChat(data) {
    SetChatHeader("Case ID: " + data.id);
    SetChatID(data.id);
    chatLog.innerHTML = data.chatLog;
    chatInput.disabled = false;
    chatSendButton.disabled = false;
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

function ToggleJournalField(button, id) {
    let inputField = document.getElementById(id);
    inputField.readOnly = !inputField.readOnly;

    if (inputField.readOnly)
        button.innerHTML = "<i class='far fa-eye'></i>";
    else
        button.innerHTML = "<i class='fas fa-pencil-alt'></i>";
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
