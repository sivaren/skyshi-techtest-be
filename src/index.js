// import section
require('dotenv').config();
const express = require('express');
const router = express.Router();
const cors = require('cors');

// create app and port
const app = express();
const host = process.env.HOST || "localhost";
const port = process.env.PORT || 3030;

// routing
router.get('/', async (_, res) => {
    console.log('Welcome to the app!');
    res.status(200).json({
        msg: "devcode updated"
    });
});

// app dependencies
app.use(express.json());    // to be able send-receive json format
app.use(router);
app.use(cors());

app.listen(port, (error) => { 
    if(error) {
        console.log("Error occured!");
        console.log(`Error: ${error}`);
    } else {
        console.log(`Server is running on http://${host}:${port}/...`);
    }
});
