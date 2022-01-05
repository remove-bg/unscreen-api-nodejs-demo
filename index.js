require('dotenv').config();
const express = require('express');
const fileUpload = require('express-fileupload');
const bodyParser = require('body-parser');
const FormData = require('form-data');
const axios = require('axios');
const app = express();
const port = 3000;

const UNSCREEN_API_VIDEOS_URL = "https://api.unscreen.com/v1.0/videos";

app.use(express.static('public'));
app.use(bodyParser.json());
app.use(fileUpload());

// the endpoint for our file upload form
app.post('/upload', (req, res) => {
    var formData = new FormData();
    let buffer = Buffer.from(req.files.video.data);

    formData.append("video_file", buffer, "original.mp4");
    if (process.env.WEBHOOK_HOST) {
        console.log("WEBHOOK_HOST set, using webhooks");
        formData.append("webhook_url", process.env.WEBHOOK_HOST + '/webhook');
    } else {
        console.log("WEBHOOK_HOST not set, using good old polling");
    }

    // append the selected format
    formData.append("format", req.body.format);
    if (req.body.format == "mp4") {
        // need to add background_color because mp4 doesn't support transparency
        formData.append("background_color", "000000"); 
    }

    var headers = formData.getHeaders();
    headers['X-Api-Key'] = process.env.API_KEY;

    axios({
        method: 'post',
        url: UNSCREEN_API_VIDEOS_URL,
        data: formData,
        headers: headers,
        'maxContentLength': Infinity,
        'maxBodyLength': Infinity,
    })
        .then(function (response) {
            // handle success
            console.log(response.data);

            if (process.env.WEBHOOK_HOST=="") {
                // no webhook host specified so let's start polling
                poll(response.data.data.links.self, res);
            }

        })
        .catch(function (error) {
            // handle error
            console.log(error);
            res.json(error);
        });
})

// repeatedly fetch video information
function poll(url, res) {
    console.log('poll');
    axios({
        method: 'get',
        url: url,
        headers: { 'X-Api-Key': process.env.API_KEY },
    })
        .then(function (response) {
            // handle success
            console.log(response.data);

            if (response.data.data.attributes.status != 'done') {
                // poll again
                setTimeout(function () { poll(url, res); }, 3000);
            } else {
				// Jedrzej: It is possible that the client refreshed a browser window and will not be able to download the file
				// Jedrzej: let's include this warning in the console
				console.log("Please note that the file might not be downloaded whenthe client refreshed the website, or navigated forward and/or clicked back button ");
                // video processing is finished, let's redirect to the result url
                res.redirect(response.data.data.attributes.result_url);
            }
        })
        .catch(function (error) {
            // handle error
            console.log(error);
            res.send(error);
        });
}

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

