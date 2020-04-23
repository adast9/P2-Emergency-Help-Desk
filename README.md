# P2-Emergency-Help-Desk

<!-- Editor -->
Bare kopier hele linjen nedefor ind i terminalen i dir ..\GitHub\P2-Emergency-Help-Desk\editor\>

npm install
(installerer alle de packages, der står i package.json-filen)

npm i nodemon mongodb mongoose connect-flash cors express express-handlebars express-session method-override handlebars@4.5.3 express-fileupload bcryptjs passport passport-local --save
(den her betyder, at man både tilføjer dem til sin packet.json og installerer dem. Det er nemmere bare at skrive "npm install")



For at starte express serveren skriver man "npm start" i terminalen

Her kan man så finde sin side på localhost:3000

For at slukke serveren skal man trykke "ctrl + c" og skrive y i ens terminal


To do:
- error_message(flash) for login-siden fungerer ikke og logout flash-message dur ikke
- Fixe navbar generelt med hvad der skal vises og hvad der skal smides ud
- I view/default/index.handlebars er der javascript kode til search bar som skal flyttes
- Fixe file upload ved edit post (potentielt bruge Multer)
- Fixe sådan at hvis man ikke uploader en pdf-fil skal den ikke sige "Cannot get pdf file"
- Noget pagination ved x antal posts


Done:
- Fixe tal efter man har søgt
- Creator of post skal være brugeren login og ikke bare admin.
- Kommentarer skal fjernes
- Under edit-post, skal man også kunne ændre fileupload + author.
- Man skal kunne uploade pdf i fileupload.
- Searchbar i posts
- hvis man ikke uploader et billede skal der komme et stock image op i stedet
