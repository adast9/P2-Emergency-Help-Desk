# 112 Web App
## About
This project is a web app that is meant to serve as an online alternative to calling 112/114 with some extra features. 

People can submit their emergencies and then receive live support from a medical dispatcher through live chat. There is a dispatcher side where dispatchers can see and respond to all active emergencies and there is an info page which would be updated regularly with the latest important news. Editors can create new posts for the info page.

## Installation
Install [Node.js](https://nodejs.org/en/)

Download/clone the repository and navigate to the folder in your terminal: 
-  `cd ...\Documents\GitHub\P2-Emergency-Help-Desk\>`

Install node modules with `npm i --save`

### Usage
You can run `START.bat` to quickly start the Express and WebSocket servers. Alternatively, you can navigate to the folder in your terminal and start the Express server with the command `npm start`. Then in another terminal window you will have to navigate to the folder again and run `node ws_server.js` to start the WebSocket server.

When the servers are running you can open the web app in your favourite browser by entering `localhost:3000` in the address bar.

- Editor login: yeeto@gmail.com : 123
- Dispatcher login: yeso@gmail.com : 321

To stop the servers press `ctrl + c` in your terminal. The express server will want you to confirm by writing `y` or `n`.

## Team
DAT2, C1-14, 27/05/2020
* Adam Stück
* Bianca Kevy 
* Cecilie Hejlesen 
* Frederik Stær
* Lasse Rasmussen
* Tais Hors