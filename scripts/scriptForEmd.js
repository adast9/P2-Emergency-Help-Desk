let map = new google.maps.Map(document.getElementById("map"), {
    zoom: 6.6,
    center: new google.maps.LatLng(56.263920, 9.501785),
    mapTypeId: google.maps.MapTypeId.ROADMAP
});

let ws = new WebSocket("ws://localhost:25654");

ws.onopen = function() {
    console.log("Connected to the server.");

    SendToServer({
        type: "EMDConnect"
    });
}

ws.onmessage = function(event) {
    json = JSON.parse(event.data);

    switch(json.type) {
        case "Case":
            console.log("New case recieved. id: %d", json.id);
            AddCase(json);
            break;
        case "DeleteCaseRow":
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

function AddCase(e) {
    let row = table.insertRow();

    //ID Button
    let idBtnCell = row.insertCell();
    let idBtn = document.createElement("BUTTON");
    idBtn.innerHTML = e.id;
    idBtn.onclick = function(){map.setCenter(e.pos)};
    idBtnCell.appendChild(idBtn);

    row.insertCell().innerHTML = e.desc;
    row.insertCell().innerHTML = e.pos.lat;
    row.insertCell().innerHTML = e.pos.lng;
    row.marker = PlaceMarker(e.id, e.pos);
    row.id = e.id;

    //Close Button
    let closeBtnCell = row.insertCell();
    let closeBtn = document.createElement("BUTTON");
    closeBtn.innerHTML = "Close";
    closeBtn.onclick = function(){CloseCase(e.id)};
    closeBtnCell.appendChild(closeBtn);
}

function PlaceMarker(id, location) {
    return new google.maps.Marker({
        position: location,
        map: map,
        label: id.toString(),
        draggable: false,
        //animation: google.maps.Animation.DROP
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