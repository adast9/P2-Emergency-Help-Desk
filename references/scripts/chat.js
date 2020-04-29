const chatHeader = document.getElementById('chat-header');
const chatLog = document.getElementById('chat-log');
const chatInput = document.getElementById('chat-input');
const chatSendButton = document.getElementById("chat-send");
let caseID = null;
let emd = false;
let chatName = "Civillian";

chatSendButton.onclick = function() {
    let msg = chatName + ": " + chatInput.value + "<br>";
	ChatMessage(msg);
    chatLog.scrollTop = chatLog.scrollHeight;
    chatInput.value = '';
    SendToServer({
        type: "ChatMessage",
        message: msg,
        caseID: caseID,
        emd: emd
    });
}


function SetChatHeader(value) { chatHeader.innerHTML = value; }
function SetChatLog(log) {chatLog.innerHTML = log; };
function SetChatName(value) { chatName = value; }
function SetChatID(id) { caseID = id; }
function SetChatEMD(bool) { emd = bool; }
function ChatMessage(msg) { chatLog.innerHTML += msg; }
