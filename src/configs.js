require('dotenv').config()

const { WebClient } = require('@slack/web-api');

// Initialize a Slack Web API client
const web = new WebClient(process.env.SLACK_BOT_TOKEN);

const channelId = process.env.CHANNEL_ID;

module.exports = {
    web,
    channelId
};