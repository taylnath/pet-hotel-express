# How to Run/Install the app

## Configuring: 

Put database credentials in dotenv_template.txt, then rename to .env

## Installing:
`npm install`

## Running:
- Server only, setting port: `PORT=12345 node server.js`
- Server only: `npm run server`
- Server with gunicorn (for deploying?) `npm run start`
- Client and server: `npm run dev`