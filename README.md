# react_express_psql_starter
A template for a full-stack React-Express-PSQL project

# Components
1. An express app which connects to a PSQL database
2. A web SDK project which could be used to build an embeddable widget
3. An admin UI which allows admin user login

# Setup

1. Need to create a .env file in root folder with the following:

#### Which port express server should listen to
PORT=XXXX

#### Used for CORS permissions in Express server when using Create React App on a different origin
DEV_ORIGIN=XXXXXXXXXXXXX

#### Postgresql settings
PGHOST=XXXXX
PGUSER=XXXXXX
PGDATABASE=XXXXXXX
PGPASSWORD=XXXXXXXX
PGPORT=XXXX

#### Used for signing the authentication tokens issued by the server
JWTSECRET=XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX

2. Need to create a PSQL database and user for the app

3. Install all dependencies
- In root folder => npm install
- In admin_ui folder => npm install
- In client_sdk folder => npm install
finally, in root folder, npm start
