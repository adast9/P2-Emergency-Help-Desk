// File information

function googleTranslateElementInit() {
	new google.translate.TranslateElement(
		{pageLanguage: "en", layout:  /*Her indsættes det sprog man ønsker at oversætte fra */
		google.translate.TranslateElement.InlineLayout.SIMPLE},
		"google_translate_element"
		);
}

function pushTextArea() {
	let destination = document.getElementById("waitingForText");
	let source = document.getElementById("textSource")
	destination.innerHTML = source.value;
}
