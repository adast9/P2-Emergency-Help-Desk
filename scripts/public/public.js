const submitButton = document.getElementById('submit');
const log = document.getElementById('chatlog');
const text = document.getElementById('text');
const name = document.getElementById('citizen-name');
const chatButtonPublic = document.getElementById("chat-button-public");
let ws = new WebSocket("ws://localhost:3001");

submitButton.onclick = function() { SubmitCase() };

//when the user presses the 'send' button, the time this chat message is received on the server is recorded
function getTimeClock() {
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
}

chatButtonPublic.onclick = function() {
    let chatMessage = ("[%s] %s: %s", getTimeClock(), name.value, text.value);
    log.innerHTML += chatMessage; //needs to be saved on server * HUSK!
    text.value = '';
    log.scrollTop = log.scrollHeight;
    SendToServer({
        type: "ChatMessage",
        user: "public",
        message: chatMessage
    });
}

ws.onopen = function() {
    console.log("Connected to the server.");
}

function SubmitCase() {
    if(markerPosition) {
        let data = {
            type: "Case",
    		name: document.getElementById('citizen-name').value,
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

function googleTranslateElementInit() {
    new google.translate.TranslateElement({
        pageLanguage: "en",
        layout:  /*Her indsættes det sprog man ønsker at oversætte fra */
        google.translate.TranslateElement.InlineLayout.SIMPLE
    }, "google_translate_element" );
}
