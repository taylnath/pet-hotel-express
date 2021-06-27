# Explanation of Site Structure / Building Steps

## Current Overview

### File structure
- Server code in root directory
- Client code in client directory (react app)

## Setup log

### Phase 1: Basic Flask app, npm projects, empty React app

- Originally cloned from https://github.com/osu-cs340-ecampus/flask-starter-app

- Started a shell npm project in main dir (via npm init). 
- Added scripts to package.json to handle build steps:
  - "preinstall" to install needed python packages.
  - "dev" to run the server and client at the same time.
  - A few others.

- Started an empty React app in client directory (via `npx create-react-app` -- no need to install create-react-app just for this). If we use React, we should move static -> client. (maybe templates also?).

- Set up basic database access (i.e. db_connector.py runs ok). We may change how this works. Eventually I think it will work through our api. 

### TODO:

- Access database from app.py

- Set up basic page structure: navbar, title, header etc. Using React/react-bootstrap?

- Build the basic database, store a copy of the database file (MySql dump file) so we can build it wherever. 

- Api for database access. 

- Pages:
  - Main greeting page.
  - Login/logout pages (will need sessions I think)
  - Reservation page
  - Reservation confirmation page
  - "Manager/Employee" page (will this require a second react app??)

- Determine how to manage multiple pages using react, while sharing the components we make. Should this be separate react projects, or...?

- Link Pages to database as appropriate.

- Add more features?

- Add more styling?

- Testing?