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

nextButton.onclick = function() {
    if(marker) {
        mapStuff.style.display = "none";
        details.style.display = "block"; 
    } else {
        alert("You need to mark your location on the map.");
    }
}

previousButton.onclick = function() {
    mapStuff.style.display = "block";
    details.style.display = "none";
}

submitButton.onclick = function() { 
    details.style.display = "none";
    chatStuff.style.display = "block";
    SubmitCase() 
};

ws.onopen = function() {
    console.log("Connected to the server.");
}

ws.onmessage = function(event) {
    data = JSON.parse(event.data);

    switch (data.type) {
        case "CaseCreated":
            SetChatID(data.id);
            break;
        case "ChatMessage":
            ChatMessage(data.message);
            break;
    }
}

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
