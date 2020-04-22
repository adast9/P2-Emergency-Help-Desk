let log = document.getElementById('chat-log');
let input = document.getElementById('chat-input');
let send = document.getElementById("chat-send");

//On send button click, send message to server and add to the log
send.onclick = function() {
	log.innerHTML += input.value + "<br>";
    log.scrollTop = log.scrollHeight;
    input.value = '';
}
