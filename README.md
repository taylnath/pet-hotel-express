# Roadmap/Directory Structure:

## Directory Overview
- Top level: server-side code. Note that package.json has a few scripts we use to run the site. 
- client: client-side code.
- database: sql files, js connection files, sql helper functions.
- generateQueryRoutes: uses handlebars templates and database/dynamicQueries.js to auto-generate sql queries and express routes.
- routes: our Express routes.
- .github: CI stuff. Nothing to see here...

## Client Directory Overview
- public: some static files. The index.html file that the site gets injected into. 
- src: React files. This is where our UI gets built.
- src/Components: our React components, i.e. pre-built elements. This and Routes are where most stuff happens. 
- src/DataAccess: Currently just contains our fetch functions.
- src/Helpers: random helper functions.
- src/Models: we use this to store the initial user templates, but that's about it at the moment. If we switch 
to typescript maybe there would be more here. 
- src/Routes: Each route is a React component that basically acts as a separate webpage. These get put together in App.js using React Router. 

## Top-Level Client Files:
- App.js: the core of the site. App.js pulls everything together.
- index.js: App.js gets put into here. Not much happening in index.js
- index.css
- package.json
- other top-level files are not currently used. 


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
- `node server.js` or `forever start server.js` (for forever, update node by installing nvm (install script here: https://github.com/nvm-sh/nvm), then you can `npm install -g forever` so forever will run globally. This is useful to not have orphan forever processes running somewhere).
