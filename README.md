# P2-Emergency-Help-Desk

<!-- CMS packages -->
Bare kopier hele linjen nedefor ind i terminalen i dir ..\GitHub\P2-Emergency-Help-Desk\cms-1>

npm i nodemon mongodb mongoose connect-flash cors express express-handlebars express-session method-override handlebars@4.5.3 express-fileupload bcryptjs passport passport-local



For at starte express serveren skriver man "npm start" i terminalen

Her kan man så finde sin side på localhost:3000

For at slukke serveren skal man trykke "ctrl + c" og skrive y


Ting vi mangler at kigge på i CMS:
- I register-siden gemmer den ikke indtastet information hvis der opstår en error.
- I forhold til at logge ind kunne man specificere at det f.eks. kun er bestemte google-kontoer der kan login (Vi bruger passports-local, her skal bruges en anden packages i stedet)
- Rykke register væk fra frontend hen til backend (Admin-siden)
- error_message(flash) for login-siden fungerer ikke 
