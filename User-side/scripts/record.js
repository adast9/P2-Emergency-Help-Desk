let shouldStop = false;
let stopped = false;
const downloadLink = document.getElementById('download');
const startButton = document.getElementById('start-audio-rec')
const stopButton = document.getElementById('stop-audio-rec');

startButton.addEventListener('click', function() {
    navigator.mediaDevices.getUserMedia({ audio: true, video: false })
        .then(handleSuccess);
});

const handleSuccess = function(stream) {
    const options = {mimeType: 'audio/webm'};
    const recordedChunks = [];
    const mediaRecorder = new MediaRecorder(stream, options);

    mediaRecorder.addEventListener('dataavailable', function(e) {
        if (e.data.size > 0) recordedChunks.push(e.data);
    });

    stopButton.addEventListener('click', function() {
        mediaRecorder.stop();
    });

    mediaRecorder.addEventListener('stop', function() {
        downloadLink.href = URL.createObjectURL(new Blob(recordedChunks));
        downloadLink.download = 'test.wav';
    });

    mediaRecorder.start();
};

function googleTranslateElementInit() {
  new google.translate.TranslateElement(
    {pageLanguage: "en", layout:  /*Her indsættes det sprog man ønsker at oversætte fra */
    google.translate.TranslateElement.InlineLayout.SIMPLE},
    "google_translate_element"
  );
}
