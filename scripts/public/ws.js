let ws = new WebSocket("ws://localhost:3001");
submitButton.addEventListener('click', function(){ SubmitButton(); });

ws.onopen = function() {
    console.log("Connected to the server.");
}

function SubmitButton() {
    if(markerPosition) {
        SendToServer({
            type: "CreateCase",
            desc: document.getElementById('desc').value,
            pos: markerPosition,
        });
    }
}

function SendToServer(data) {
    ws.send(JSON.stringify(data));
}
