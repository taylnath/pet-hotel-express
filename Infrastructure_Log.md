# Explanation of Site Structure / Building Steps

## Phase 1: Basic Flask app

- Originally cloned from https://github.com/osu-cs340-ecampus/flask-starter-app

- Commented out database-related files. Haven't worked on that yet. 

- Started a shell npm project in main dir (via npm init). 
- Added scripts to package.json to handle build steps:
  - "preinstall" to install needed python packages.
  - "dev" to run the server and client at the same time.
  - A few others.

- Started an empty React app in client directory. If we use React, we should move static -> client. (maybe templates also?).