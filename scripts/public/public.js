const name = document.getElementById('citizen-name');
const phone = document.getElementById('phone');
const cpr =  document.getElementById('cpr');
const loc = document.getElementById('location');
const desc = document.getElementById('desc');
const submitButton = document.getElementById('submit');
const chatLog = document.getElementById('chat-log');
const chatInput = document.getElementById('chat-input');
const chatSendButton = document.getElementById("chat-send");
let ws = new WebSocket("ws://localhost:3001");
let caseID = null;

submitButton.onclick = function() { SubmitCase() };

ws.onopen = function() {
    console.log("Connected to the server.");
}

ws.onmessage = function(event) {
    data = JSON.parse(event.data);

    switch (data.type) {
        case "CaseCreated":
            caseID = data.id;
            break;
        case "ChatMessage":
            chatLog.innerHTML += data.message;
            break;
    }
}

function SubmitCase() {
    if(markerPosition) {
        let data = {
            type: "Case",
    		name: name.value,
			phone: phone.value,
			cpr: cpr.value,
			location: loc.value,
            desc: desc.value,
            pos: markerPosition
        };

        SendToServer(data);
        console.log("Case submitted.")
    } else {
        alert("You need to mark your location on the map.");
    }
}

chatSendButton.onclick = function() {
    let msg = "Civillian: " + chatInput.value + "<br>";
	chatLog.innerHTML += msg;
    chatLog.scrollTop = chatLog.scrollHeight;
    SendToServer({
        type: "ChatMessage",
        message: msg,
        caseID: caseID,
        emd: false
    });
    chatInput.value = '';
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

//when the user presses the 'send' button, the time this chat message is received on the server is recorded
/*function getTimeClock() {
    let time = new Date();
    let hours = time.getHours();
    if (hours < 10)
        hours = `0${hours}`;
    let minutes = time.getMinutes();
    if (minutes < 10)
        minutes = `0${minutes}`;
    let seconds = time.getSeconds();
    if (seconds < 10)
        seconds = `0${seconds}`

    return hours + ":" + minutes + ":" + seconds;
}*/

/*chatButtonPublic.onclick = function() {
    let chatMessage = ("[%s] %s: %s", getTimeClock(), name.value, text.value);
    log.innerHTML += chatMessage; //needs to be saved on server * HUSK!
    text.value = '';
    log.scrollTop = log.scrollHeight;
    SendToServer({
        type: "ChatMessage",
        user: "public",
        message: chatMessage
    });
}*/
