//
// Authors:
// Adam Stück, Bianca Kevy, Cecilie Hejlesen
// Frederik Stær, Lasse Rasmussen and Tais Hors
//
// Group: DAT2 - C1-14
// Date: 27/05-2020
//

// File information

const chatHeader = document.getElementById('chat-header');
const chatLog = document.getElementById('chat-log');
const chatInput = document.getElementById('chat-input');
const chatSendButton = document.getElementById("chat-send");
let caseID = null;
let dispatcher = false;
let chatName = "Citizen";

if(chatInput) chatInput.onkeydown = function(event) {
    //Checks if Enter key was pressed so user doen not have to click "Send" button
    if (event && event.keyCode == 13)
    sendMessage();
}

if(chatSendButton) chatSendButton.onclick = function() {
    sendMessage();
}

function sendMessage() {
    let msg = chatName + ": " + chatInput.value;

    chatMessage(msg);
    sendToServer({
        type: "chatMessage",
        message: msg,
        id: caseID,
        dispatcher: dispatcher
    });

    chatLog.scrollTop = chatLog.scrollHeight;
    chatInput.value = "";
}

function setChatHeader(value) { if(chatHeader) chatHeader.innerHTML = value; }
function setChatLog(log) { if(chatLog) chatLog.innerHTML = log; }
function setChatName(value) { chatName = value; }
function setChatID(id) {
    caseID = id;
    setChatHeader("Case ID: " + id);
}
function setChatDispatcher(bool) { dispatcher = bool; }
function chatMessage(msg) { if(chatLog) chatLog.innerHTML += msg + "<br>"; }
