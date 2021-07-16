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

## Deploying Steps:
- Clone project
- from database directory, in mysql run `source setup_hotel.sql`
- edit and copy/rename dotenv_template with correct db stuff and NODE_ENV=production
- `npm install`
- `npm audit fix` ?
- `npm run build --prefix client` (this should probably be in our server package.json)
- `node server.js` or `forever start server.js` or... gunicorn something? (for forever, update node by installing nvm (install script here: https://github.com/nvm-sh/nvm), then you can `npm install -g forever` so forever will run globally. This is useful to not have orphan forever processes running somewhere).
