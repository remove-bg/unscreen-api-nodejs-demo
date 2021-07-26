const webhook = (req, res) => {
    console.log('webhook');
    console.log(req.body);

    if (req.body.data.attributes.status == 'done') {
        console.log(req.body.data.attributes.result_url);
    }
};

module.exports = webhook