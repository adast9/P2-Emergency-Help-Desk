// Map
let map = new google.maps.Map(document.getElementById("map"), {
    zoom: 6.6,
    center: new google.maps.LatLng(56.263920, 9.501785),
    mapTypeId: google.maps.MapTypeId.ROADMAP
});


/*let locations = [
  [1, "Aalborg", "Knife-wound", 57.047218, 9.920100],
  [2, "Frederikshavn", "cardiac arrest", 57.442711, 10.521006],
  [3, "Aarhus", "dislocated shoulder",56.162939, 10.203921],
  [4, "Vendsyssel", "broken leg", 57.285998856, 10.040666504]
];*/

function AddEmergency(e) {
    let row = table.insertRow();
    row.insertCell().innerHTML = e.id;
    row.insertCell().innerHTML = e.desc;
    row.insertCell().innerHTML = e.pos.lat;
    row.insertCell().innerHTML = e.pos.lng;

    let btnCell = row.insertCell();
    let btn = document.createElement("BUTTON");
    btn.innerHTML = "Delete";
    btn.onclick = function(){DeleteEmergency(e.id)};
    btnCell.appendChild(btn);

    PlaceMarker(e.pos);
}

function DeleteEmergency(eIndex, row) {
    //emergencies.splice(eIndex);
    table.deleteRow(row.rowIndex);

    console.log(emergencies);
}

function PlaceMarker(location) {
    marker = new google.maps.Marker({
        position: location,
        map: map,
        draggable: true,
        animation: google.maps.Animation.DROP
    });
}

let ws = new WebSocket("ws://localhost:25654");

ws.onopen = function() {
    console.log("Connected to the server.");

    SendToServer({
        type: "EMDConnect"
    });
}

//On message recieved from server, add it to the log
ws.onmessage = function(event) {
    json = JSON.parse(event.data);

    switch(json.type) {
        case "Case":
            console.log("New case recieved. id: %d", json.id);
            AddCase(json);
            break;
        case "DeleteCaseRow":
            for (var i = 0; i < table.rows.length; i++) {
                if(table.rows[i].cells[0].innerHTML == json.id) {
                    table.deleteRow(i);
                    break;
                }
            }

            //DELETE THE MARKER

            break;
        default:
            console.log("Received some weird data... ");
            break;
    }
}

function AddCase(e) {
    let row = table.insertRow();
    row.insertCell().innerHTML = e.id;
    row.insertCell().innerHTML = e.desc;
    row.insertCell().innerHTML = e.pos.lat;
    row.insertCell().innerHTML = e.pos.lng;

    let btnCell = row.insertCell();
    let btn = document.createElement("BUTTON");
    btn.innerHTML = "Close";
    btn.onclick = function(){CloseCase(e.id, row.rowIndex)};
    btnCell.appendChild(btn);

    PlaceMarker(e.pos);
}

function CloseCase(id, rowIndex) {
    SendToServer({
        type: "CloseCase",
        id: id
    });
}

function SendToServer(data) {
    ws.send(JSON.stringify(data));
}

/*
// Table
for(let i = 0; i < locations.length; i++)
  {
      // create a new row
      let newRow = table.insertRow(table.length);
      for(let j = 0; j < locations[i].length; j++)
      {
          // create a new cell
          let cell = newRow.insertCell(j);

          // add value to the cell
          cell.innerHTML = locations[i][j];
      }
  }*/


/*

let infowindow = new google.maps.InfoWindow();

let marker, i;

for (i = 0; i < locations.length; i++) {
  marker = new google.maps.Marker({
    position: new google.maps.LatLng(locations[i][3], locations[i][4]),
    map: map
  });

  google.maps.event.addListener(marker, "click", (function(marker, i) {
    return function() {
      infowindow.setContent(locations[i][1] + " - " + locations[i][2]);
      infowindow.open(map, marker);
    }
  })(marker, i));
}
*/