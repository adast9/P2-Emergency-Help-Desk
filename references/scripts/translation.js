/*
Authors:
Adam Stück, Bianca Kevy, Cecilie Hejlesen
Frederik Stær, Lasse Rasmussen and Tais Hors

Group: DAT2 - C1-14
Date: 27/05-2020

This file contains the function used to inialise the 
Google Translate functionality on the public side.
*/

// Initialize the Google Translate button.
function googleTranslateElementInit() {
	new google.translate.TranslateElement(
		{ pageLanguage: "en", // Here you put the language of the webpage. In this case 'en' for English.
		  layout: google.translate.TranslateElement.InlineLayout.SIMPLE },
		"google_translate_element");
}
