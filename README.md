# P2-Emergency-Help-Desk

<!-- CMS packages -->
Bare kopier hele linjen nedefor ind i terminalen i dir ..\GitHub\P2-Emergency-Help-Desk\editor\>

npm i nodemon mongodb mongoose connect-flash cors express express-handlebars express-session method-override handlebars@4.5.3 express-fileupload bcryptjs passport passport-local



For at starte express serveren skriver man "npm start" i terminalen

Her kan man så finde sin side på localhost:3000

For at slukke serveren skal man trykke "ctrl + c" og skrive y i ens terminal


Ting vi mangler at kigge på i CMS:
- Rykke register væk fra frontend hen til backend (Admin-siden)
- error_message(flash) for login-siden fungerer ikke og logout flash-message dur ikke
- find ud af om hvor lang tid en cookie varer for en users session

- v2 -
Flash package skal skiftes ud med nyt ikke package kode.
Creator of post skal være brugeren login og ikke bare admin.
Under edit-post, skal man også kunne ændre fileupload.
Man skal kunne uploade pdf i fileupload.
Fixe en masse sampletext.
Fixe navbar generelt med hvad der skal vises og hvad der skal smides ud.
Kommentarer skal fjernes
