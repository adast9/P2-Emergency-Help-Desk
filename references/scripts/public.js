const nextButton = document.getElementById('next');
const previousButton = document.getElementById('previous');
const submitButton = document.getElementById('submit');
const mapStuff = document.getElementById('map-stuff');
const details = document.getElementById('details');
const name = document.getElementById('citizen-name');
const phone = document.getElementById('phone');
const cpr =  document.getElementById('cpr');
const desc = document.getElementById('desc');
const chatStuff = document.getElementById('chat-stuff');
let ws = new WebSocket("ws://localhost:3001");

// Go to case details form when the next button is clicked.
nextButton.onclick = function() {
    if(marker) {
        mapStuff.style.display = "none";
        details.style.display = "block"; 
    } else {
        alert("You need to mark your location on the map.");
    }
}

// Go back to the map when the previous button is clicked.
previousButton.onclick = function() {
    mapStuff.style.display = "block";
    details.style.display = "none";
}

// Go to the live chat when the submit button is clicked.
submitButton.onclick = function() { 
    details.style.display = "none";
    chatStuff.style.display = "block";
    SubmitCase() 
};

// Connected to the WebSocket server.
ws.onopen = function() {
    console.log("Connected to the server.");
}

// Received a message from the server.
ws.onmessage = function(event) {
    data = JSON.parse(event.data);

    switch (data.type) {
        case "CaseCreated":
            // Our case has been created on the server!
            // Pass the case ID on to the chat. This function is in chat.js
            SetChatID(data.id);
            break;
        case "ChatMessage":
            // Received a chat message from a dispatcher.
            ChatMessage(data.message);
            break;
    }
}

// Submit our case to the server.
function SubmitCase() {
    let data = {
        type: "Case",
        name: name.value,
        phone: phone.value,
        cpr: cpr.value,
        desc: desc.value,
        pos: marker.position
    };

    SendToServer(data);
    console.log("Case submitted.")
}

function SendToServer(data) {
    ws.send(JSON.stringify(data));
}

function googleTranslateElementInit() {
    new google.translate.TranslateElement({
        pageLanguage: "en",
        layout:  /*Her indsættes det sprog man ønsker at oversætte fra */
        google.translate.TranslateElement.InlineLayout.SIMPLE
    }, "google_translate_element" );
}