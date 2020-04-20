const submitButton = document.getElementById('submit');
submitButton.onclick = function() {SubmitCase()};

let ws = new WebSocket("ws://localhost:3001");

ws.onopen = function() {
    console.log("Connected to the server.");
}

function SubmitCase() {
    if(markerPosition) {
        let data = {
    		    type: "Case",
    		    name: document.getElementById('name').value,
			      phone: document.getElementById('phone').value,
			      cpr: document.getElementById('cpr').value,
			      location: document.getElementById('location').value,
            desc: document.getElementById('desc').value,
            chatlog: document.getElementById('chat').value,
            pos: markerPosition
        };

    	SendToServer(data);
        console.log("Case submitted.")
    } else {
        alert("You need to mark your location on the map.");
    }
}

function SendToServer(data) {
    ws.send(JSON.stringify(data));
}
