# Unscreen API demo using node.js (https://unscreen.com/api)
This repo contains a minimal node.js project that shows
* how to upload files to the unscreen API
* poll the unscreen API to get the status of the video file
* use webhooks to avoid polling

## Getting started
* Copy .env.sample to .env
* Add your unscreen API key to .env file
* Install dependencies with `npm i`
* Start tunnel using ngrok `npm run ngrok`(optional)
* Copy your public ngrok URL (http://XXXXXXXXXXXX.ngrok.io) into your .env file (optional)
* Start the server `npm start`
* Open the browser at `http://localhost:3000`
* Upload a video file
* Watch the console output
* Your processed file will automatically be downloaded in the browser

## Demo time

Data flow of your video file
![Data Flow Diagram](https://raw.githubusercontent.com/remove-bg/unscreen-api-nodejs-demo/master/readme_assets/data_flow.jpg?token=AAVIZKOPTDGTUSK76GQ2WCK7UPDRW)

Video running the demo with polling
![Polling Demo Video](https://raw.githubusercontent.com/remove-bg/unscreen-api-nodejs-demo/master/readme_assets/polling.gif?token=AAVIZKMVLFDYEDVPMEX3NYC7UPFJY)

Video running the demo with a webhook
![Webhook Demo Video](https://raw.githubusercontent.com/remove-bg/unscreen-api-nodejs-demo/master/readme_assets/webhook.gif?token=AAVIZKNPEX3W3437I7VNATC7UPFKQ)

## Your turn

Feel free to use this as a starting ground for your own unscreen API integration projects
