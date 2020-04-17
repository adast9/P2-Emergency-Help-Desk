let map = new google.maps.Map(document.getElementById("map"), {
    zoom: 6.6,
    center: new google.maps.LatLng(56.263920, 9.501785),
    mapTypeId: google.maps.MapTypeId.ROADMAP
});

const caseList = document.getElementById('cases');
const journalID = document.getElementById('journal-id');
const journalName = document.getElementById('journal-name');
const journalPhone = document.getElementById('journal-phone');
const journalCPR = document.getElementById('journal-cpr');
const journalLocation = document.getElementById('journal-location');
const journalDescription = document.getElementById('journal-description');

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
        case "CloseCase":
            for (var i = 0; i < table.rows.length; i++) {
                if(table.rows[i].id == json.id) {
                    // Remove the marker from the map and delete the row from the table.
                    table.rows[i].marker.setMap(null);
                    table.deleteRow(i);
                    break;
                }
            }
            break;
        default:
            console.log("Received some weird data... ");
            break;
    }
}

function AddCase(data) {
    let row = caseList.insertRow();

    //ID Button
    let idBtnCell = row.insertCell();
    let idBtn = document.createElement("BUTTON");
    idBtn.innerHTML = data.id;
    idBtnCell.appendChild(idBtn);
    row.insertCell().innerHTML = "Open";
    row.insertCell().innerHTML = data.time;
    row.marker = PlaceMarker(data.id, data.pos);
    row.id = data.id;

    //displaying the journal entry for the corresponding case ID
    idBtn.addEventListener('click', () => {

        let journal = document.createElement('div');

        let caseId = document.createElement('h2');
        caseId.textContent = `Case ID: ${e.id}`;
        journal.appendChild(caseId);
        chatId.innerHTML = 'Case ID: ' + data.id;

        let citizenName = document.createElement('p');
        citizenName.innerHTML = `<span>Name:</span> \${e.name}`;
        journal.appendChild(citizenName);

        let citizenCPR = document.createElement('p');
        citizenCPR.innerHTML = `<span>CPR Number:</span> \${e.cpr}`;
        journal.appendChild(citizenCPR);

        let citizenDescription = document.createElement('p');
        citizenDescription.innerHTML = `<span>Description by citizen:</span> ${e.desc}`;
        journal.appendChild(citizenDescription);

        let timeOfEmergency = document.createElement('p');
        timeOfEmergency.innerHTML = `<span>Time and date:</span> ${e.time || 'Not found'}`;
        journal.appendChild(timeOfEmergency);

        let typedAddress = document.createElement('p');
        typedAddress.innerHTML = `<span>Typed address:</span> \${e.address}`;
        journal.appendChild(typedAddress);

        let amlAddress = document.createElement('p');
        amlAddress.innerHTML = `<span>Address recorded by AML:</span> \${e.amlAddress}`;
        journal.appendChild(amlAddress);

        let clickedCoordinates = document.createElement('p');
        clickedCoordinates.innerHTML = `<span>Clicked coordinates</span> ${e.pos.lat} x ${e.pos.lng}}`;
        journal.appendChild(clickedCoordinates);

        let chatLog = document.createElement('p');
        chatLog.innerHTML = `<span>Saved chat log:</span><br>-chatlog her-`;

        let closeJournalButton = document.createElement('button');
        closeJournalButton.textContent = "Close journal";
        closeJournalButton.setAttribute("id", "close-journal-button");
        journal.appendChild(closeJournalButton);



        document.getElementById('journal').innerHTML = journal.innerHTML;

        document.getElementById('close-journal-button').addEventListener('click', () => {
            document.getElementById('journal').innerHTML = '<p class="press-case-id">Press Case ID to display patient journal</p>';
        });

        // changing the Case ID in chat to corresponding case
        document.getElementById('chatId').textContent = `Case ID: ${e.id}`;
    })
  }

function PlaceMarker(id, location) {
    return new google.maps.Marker({
        position: location,
        map: map,
        label: id.toString(),
        draggable: false,
    });
}

function CloseCase(id) {
    let check = prompt("Write 'DELETE' to close the case.");

    if(check == "DELETE") {
        SendToServer({
            type: "CloseCase",
            id: id
        });
        alert(`Case deleted. (id: ${id})`);
    }
}

function SendToServer(data) {
    ws.send(JSON.stringify(data));
}

/*function getTimeOfEmergency() {
  let time = new Date();
  let month = (time.getMonth())+1;
  if (month < 10 ) {
      month = `0${month}`;
  }
  let day = time.getDate();
  if (day < 10) {
      day = `0${day}`;
  }
  let year = time.getFullYear();
  let hours = time.getHours();
  if (hours < 10) {
      hours = `0${hours}`
  }
  let minutes = time.getMinutes();
  if (minutes < 10) {
      minutes = `0${minutes}`
  }
  let seconds = time.getSeconds();
  if (seconds < 10) {
      seconds = `0${seconds}`
  }

  let timeOfEmergency = `${hours}:${minutes}:${seconds}  ${day}-${month}-${year}`;
}*/
