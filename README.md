# mobileconfig
[![Code Climate](https://codeclimate.com/github/MarkusAndersons/mobileconfig/badges/gpa.svg)](https://codeclimate.com/github/MarkusAndersons/mobileconfig)
![David](https://david-dm.org/markusandersons/mobileconfig.svg)

Apple Configuration Profiles (.mobileconfig) allow you to set most settings on Apple devices by installing a "Profile". This Node.js web app simplifies the creation of these so anyone can make them even with minimal programming knowledge.


## Dependencies
*DEPRECATED* The application can use a Redis server for the session data. The settings for this server can be edited in the config file.

This application will use a MongoDB database to store accounts and session data. Therefore, for the application to function correctly, a MongoDB server will need to be used and the settings for this added to the config.js file.

## Configuration
Before running, some settings need to be set for the app, these can be edited from the *config.js* file.

**Mailgun**

 - To enable the app to send completed profiles to an email address, this app uses the *Mailgun* API. An account can be created for free at [http://www.mailgun.com](http://www.mailgun.com). Then simply enter your domain and API key in the configuration file.

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
Profile signing

Create account system, remove email section and replace with accounts, store the email against an account. The account can store the cert to sign the profiles with

Add authorization
