// Initialize the Google Translate button.
function googleTranslateElementInit() {
	new google.translate.TranslateElement(
		{ pageLanguage: "en", // Here you put the language of the webpage. In this case 'en' for English.
		  layout: google.translate.TranslateElement.InlineLayout.SIMPLE }, 
		"google_translate_element");
}