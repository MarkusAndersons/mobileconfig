# mobileconfig
A simple Node web app to create custom Apple Configuration files (.mobileconfig)

## Dependencies
The application can use a Redis server for the session data (further functionality will be added later). The settings for this server can be edited in the config file. Currently it is commented out from app.js for testing purposes.

## How to run

install dependencies:
```bash
$ cd . && npm install
```
run the app:
```bash
$ DEBUG=mobileconfig:* npm start
```
