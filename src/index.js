// import section
require('dotenv').config();
const express = require('express');
const { router } = require('./router/router');
const cors = require('cors');
const { migration } = require('./database/database');

// create app and port
const app = express();
const host = process.env.HOST || "localhost";
const port = process.env.PORT || 3030;

// app dependencies
app.use(express.json());    // to be able send-receive json format
app.use(router);
app.use(cors());

const run = async () => {
    await migration(); // 👈 running migration before server
    app.listen(port, host, (error) => { 
        if(error) {
            console.log("Error server occured!");
            console.log(`Error: ${error}`);
        } else {
            console.log(`Server is running on http://${host}:${port}/...`);
        }
    });
};

run();
