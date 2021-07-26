const FormData = require('form-data');
const axios = require('axios');

// repeatedly fetch video information
const poll = (url, res) => {
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

const upload = (UNSCREEN_API_VIDEOS_URL) => (req, res) => {
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

            if (process.env.WEBHOOK_HOST == "") {
                // no webhook host specified so let's start polling
                poll(response.data.data.links.self, res);
            }

        })
        .catch(function (error) {
            // handle error
            console.log(error);
            res.json(error);
        });
};

module.exports = upload