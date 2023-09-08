# News API

**<u>Project Overview</u>**

This project is a mock version of a backend API for a News application that aims to mimic the backend serivces that typically provide information
to front end architecture.

The hosted version of this project can be visited here: https://news-server-1ny4.onrender.com/api/

The repo for this project is available at: https://github.com/IanTibble1/my-nc-news

**<u>Setup</u>**

Those who wish to clone this repo may do so at the github repo provided. Instructions for installing required dependencies
can be found at https://www.npmjs.com/

Node.js version v20.4.0 & Postgres version 14.9 are required to run this project.

Please use terminal command 'npm install' prior to installing the following dependencies

**<u>List of required devDependencies</u>**

These devDependencies can be installed with the command "npm install -D <> ", replacing the <> with the dependencies below

- jest
- jest-extended
- jest-sorted
- pg-format

**<u>List of required Dependencies</u>**

These dependencies can be installed with the command "npm install <> ", replacing the <> with the dependencies below

- dotenv
- express
- pg
- supertest

**<u>Database setup</u>**

The local database can be set up with the terminal command "npm run setup-dbs"

**<u>Seeding</u>**

Local databases can be seeded using the terminal command "npm run seed"

**<u>Starting the server</u>**

The server can be started with the terminal command "npm start"

**<u>Testing</u>**

Testing can be performed by using the terminal command "npm test app.test.js"

**<u>Creating ENV files</u>**

In order to connect locally to the nc_news databases, you will need to create a .env.development file containing the code <PGDATABASE=nc_news> &
a .env.test file containing the code <PGDATABASE=nc_news_test>. Both files should be created in the BE-NC-NEWS directory.
