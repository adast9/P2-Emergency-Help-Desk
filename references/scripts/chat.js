// File information

const chatHeader = document.getElementById('chat-header');
const chatLog = document.getElementById('chat-log');
const chatInput = document.getElementById('chat-input');
const chatSendButton = document.getElementById("chat-send");
let caseID = null;
let emd = false;
let chatName = "Civillian";

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
        emd: emd
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
function setChatEMD(bool) { emd = bool; }
function chatMessage(msg) { if(chatLog) chatLog.innerHTML += msg + "<br>"; }
