const axios = require('axios');

const videos = (UNSCREEN_API_VIDEOS_URL) => (req, res) => {
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
};

module.exports = videos