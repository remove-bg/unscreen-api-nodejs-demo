require('dotenv').config();
const express = require('express');
const fileUpload = require('express-fileupload');
const bodyParser = require('body-parser');
const app = express();
const port = 3000;
const upload = require('./server/upload');
const videos = require('./server/videos');
const webhook = require('./server/videos');

const UNSCREEN_API_VIDEOS_URL = "https://api.unscreen.com/v1.0/videos";

app.use(express.static('public'));
app.use(bodyParser.json());
app.use(fileUpload());

// the endpoint for our file upload form
app.post('/upload', upload(UNSCREEN_API_VIDEOS_URL));

// fetches a list of all of your videos from the unscreen API
app.get('/videos', videos(UNSCREEN_API_VIDEOS_URL));

// webhook for asyncronous communication from the unscreen API
app.post('/webhook', webhook);

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
});
