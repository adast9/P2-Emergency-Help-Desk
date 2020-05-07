# P2-Emergency-Help-Desk

<!-- Editor -->
Bare kopier linjen nedefor ind i terminalen i dir ..\GitHub\P2-Emergency-Help-Desk\editor\>

npm i --save

For at starte express serveren skriver man "npm start" i terminalen

Her kan man så finde sin side på localhost:3000

For at slukke serveren skal man trykke "ctrl + c" og skrive y i ens terminal












To do:
- Noget pagination ved x antal posts
- At kunne lade være med at uploade pdf sådan at man får en mere blank post
- Editor dashboard skal have en guide til brug af siden
- PDF viser ikke i ny post


Done:
- error_message(flash) for login-siden fungerer ikke og logout flash-message dur ikke
- Fixe tal efter man har søgt
- Creator of post skal være brugeren login og ikke bare admin.
- Kommentarer skal fjernes
- Under edit-post, skal man også kunne ændre fileupload + author.
- Man skal kunne uploade pdf i fileupload.
- Searchbar i posts
- hvis man ikke uploader et billede skal der komme et stock image op i stedet
- Den skal kunne gemme input-data på create post og edit post hvis man får input-fejl
- Fixe sådan at hvis man ikke uploader en pdf-fil skal den ikke sige "Cannot get pdf file"
- Fixe navbar generelt med hvad der skal vises og hvad der skal smides ud
- Post sidebar uden jquery
- I view/default/index.handlebars er der javascript kode til search bar som skal flyttes
- Fixe logout ved all posts og create post
- Fixe shitty footer css
- Sortering af all posts (mangler kun time submitted)
- Popup med "are you sure you want to delete post"