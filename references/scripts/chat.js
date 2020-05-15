const chatHeader = document.getElementById('chat-header');
const chatLog = document.getElementById('chat-log');
const chatInput = document.getElementById('chat-input');
const chatSendButton = document.getElementById("chat-send");
let caseID = null;
let emd = false;
let chatName = "Civillian";

chatInput.onkeydown = function(event) {
    //Checks if Enter key was pressed so user doesn't have to click "Send" button
    if (event && event.keyCode == 13)
        SendMessage();
}

chatSendButton.onclick = function() {
    SendMessage();
}

function SendMessage() {
    let msg = chatName + ": " + chatInput.value;
    
    ChatMessage(msg);
    SendToServer({
        type: "ChatMessage",
        message: msg,
        id: caseID,
        emd: emd
    });

    chatLog.scrollTop = chatLog.scrollHeight;
    chatInput.value = "";
}

function SetChatHeader(value) { chatHeader.innerHTML = value; }
function SetChatLog(log) {chatLog.innerHTML = log; }
function SetChatName(value) { chatName = value; }
function SetChatID(id) { 
    caseID = id; 
    SetChatHeader("Case ID: " + id);
}
function SetChatEMD(bool) { emd = bool; }
function ChatMessage(msg) { chatLog.innerHTML += msg + "<br>"; }