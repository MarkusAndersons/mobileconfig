# mobileconfig
[![Code Climate](https://codeclimate.com/github/MarkusAndersons/mobileconfig/badges/gpa.svg)](https://codeclimate.com/github/MarkusAndersons/mobileconfig)
![David](https://david-dm.org/markusandersons/mobileconfig.svg)

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

## TODO
In routes/index.js the router for POST to /api/certificate_upload needs to be improved to not use a 302 redirect, instead use a client side fix.

Profile signing
