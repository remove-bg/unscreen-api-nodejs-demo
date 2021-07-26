require('dotenv').config();
const express = require('express');
const fileUpload = require('express-fileupload');
const bodyParser = require('body-parser');
const axios = require('axios');
const app = express();
const port = 3000;
const upload = require('./server/upload')

const UNSCREEN_API_VIDEOS_URL = "https://api.unscreen.com/v1.0/videos";

app.use(express.static('public'));
app.use(bodyParser.json());
app.use(fileUpload());

// the endpoint for our file upload form
app.post('/upload', upload(UNSCREEN_API_VIDEOS_URL))

// fetches a list of all of your videos from the unscreen API
app.get('/videos', (req, res) => {
    axios({
        method: 'get',
        url: UNSCREEN_API_VIDEOS_URL,
        headers: { 'X-Api-Key': process.env.API_KEY },
    })
        .then(function (response) {
            // handle success
            console.log(response.data);
            res.json(response.data);
        })
        .catch(function (error) {
            // handle error
            console.log(error);
        });
});

app.post('/webhook', (req, res) => {
    console.log('webhook');
    console.log(req.body);

    if (req.body.data.attributes.status == 'done') {
        console.log(req.body.data.attributes.result_url);
    }
})

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})

