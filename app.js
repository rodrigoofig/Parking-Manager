require('dotenv').config()

const { App } = require('@slack/bolt');
const express = require('express');
const expressApp = express();
const { web } = require('./src/configs');
const { DateTime } = require('luxon');
const CarSpotManager = require('./src/classes/car-spot-manager');
const UserClass = require('./src/classes/user');
const { saveNewUser, rotateMembers, rotation } = require('./src/helpers/functions');
const carSpotManager = new CarSpotManager();

(async () => {
  await carSpotManager.initialize();
})();

// Initializes your app with your bot token and signing secret

const app = new App({
  signingSecret: process.env.SLACK_SIGNING_SECRET,
  token: process.env.SLACK_BOT_TOKEN,
});

/* Add functionality here */

app.event('message', async ({ event, say }) => {
  if (event.text === 'hello') {
    await say(`Hello, <@${event.user}> siuu!`);
  }
});

app.event('message', async ({ event, say }) => {
  if (event.text === 'siu') {
    await say(`⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣀⣴⣶⣶⣶⣤⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢰⣿⣿⣿⣿⣿⣿⣷⡀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣼⣿⣿⣿⣿⣿⣿⣿⣇⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢻⣿⣿⣿⣿⣿⣿⣿⣿⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠈⢿⣿⣿⣿⣿⣿⣿⣿⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠈⣿⣿⣿⣿⣿⣾⡋⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢀⡴⠻⠿⠻⠿⠻⢤⡇⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⡀⢀⢤⣒⣽⢍⣸⣷⣶⣉⣁⣀⠑⠤⠤⢀⡀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢀⢎⣨⡟⣉⣄⣴⡎⣳⡏⡏⣡⡦⣼⠋⣷⢦⣠⣫⠳⣦⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣰⢿⣅⠈⢹⡿⣼⡟⠷⣟⡷⢥⢷⢿⣻⢾⠇⣴⢮⡏⠆⢹⣧⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⡸⣾⣟⠈⠉⠊⡇⣤⣤⣭⣭⣷⢹⢸⢀⢹⣸⣿⢿⣾⣶⡳⡿⣻⣃⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣠⡎⣧⡾⣾⣆⢧⢰⢷⣿⡟⢿⠟⣿⣿⢠⣮⣙⣶⠏⣿⣿⣯⣮⡞⢯⣿⡄⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢀⣾⢯⣍⣶⡽⣿⡿⢦⠻⢸⠘⢇⡨⣸⣿⢿⡾⡏⠿⠤⠞⠸⣿⣛⣹⡴⢮⣻⣿⡄⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣠⣴⠟⣜⣿⣿⢿⡽⠋⠀⠘⣆⠀⠇⠸⣡⣿⣿⢘⠇⡇⠸⠇⠀⡀⡽⣿⣿⣋⣩⣶⣿⣷⡀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣠⣾⠟⣌⢦⣿⢡⡿⠊⠀⠀⠀⠀⠸⣆⡀⠀⢻⣿⣿⠈⠀⠀⠀⠀⢘⣼⣿⣷⢇⢻⣥⣿⣻⣮⢿⣄⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⢀⡴⡛⣡⣿⣿⣿⡿⠋⠀⠀⠀⠀⠀⠀⠀⢻⣙⠀⣾⣿⡧⡀⠀⠀⠀⣠⢾⣿⣿⡯⣿⡀⠹⣷⠃⠈⢷⣿⣷⣄⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⢀⣴⣟⣽⣿⣿⣿⠟⠉⠀⠀⠀⠀⠀⠀⠀⠀⠀⢸⠳⡃⠿⢟⣒⠾⣤⣔⠮⣖⣽⢿⣿⢷⣹⣵⠀⠘⢦⡀⠀⢹⣮⣿⣦⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⢀⣴⣿⢻⣽⣿⠿⠋⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢸⠀⠙⠶⣶⡚⢽⣦⡬⣭⣾⣯⣬⣏⣈⠁⢷⣧⠀⠀⠙⠢⣜⠸⠻⣿⣷⣄⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⢀⣴⣶⡿⣯⢿⡿⠚⠁⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠸⡶⡒⣾⣛⣿⣝⣛⡛⠒⠊⣀⢰⠻⠫⢬⣩⣯⡆⠀⠀⠀⠈⠳⣄⢩⠻⣿⢷⣦⣠⠤⣴⡶⠶⠀⠀⠀⠀⠀
⠀⣰⣿⣿⣿⣿⠞⠉⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢀⢿⠀⣨⢯⢾⠚⣿⡙⢫⢉⠭⡏⢙⣿⡥⠿⢧⠁⠀⠀⠀⠀⠀⠈⠙⢾⣿⣟⣭⣥⣔⣧⣀⠀⠀⠀⠀⠀⠀
⣸⣿⡿⣿⠏⠁⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⡘⠸⠐⠃⣨⡟⢸⢹⢸⢸⠏⣠⠟⢥⡿⢛⣷⣮⡇⠀⠀⠀⠀⠀⠀⠀⠀⠀⠹⣷⣻⣯⣿⡻⠿⣦⡄⠀⠀⠀
⠻⠿⢱⠟⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢀⠆⠰⡀⠰⠛⣡⣿⢠⢣⡌⢐⣃⣉⡡⠶⡥⢷⣮⣿⡄⠀⠀⠀⠀⠀⠀⠀⠀⠀⠈⠻⣿⣻⣿⣶⣄⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢸⢀⡀⡧⠀⢰⠏⢸⠃⢎⣣⡯⠖⣟⢴⣊⣴⠿⠥⡽⣿⡀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠙⠇⠙⠋⠁⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠠⡇⢳⡷⣢⠀⠈⠑⠼⣀⠜⠁⠙⣊⢝⣿⣯⠵⠶⢤⣴⠹⣷⡀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢠⢣⢇⡀⠙⢮⡑⠢⠤⠀⢻⠶⢖⣿⣷⣿⡿⠒⠢⣪⠟⡁⠀⠹⣧⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢀⢇⠘⠸⡍⡻⣶⡽⠦⠤⠒⢃⣠⣜⣻⠽⣭⡶⣦⡏⡤⠖⣽⡤⠀⢻⡄⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⡾⡏⣀⣀⡽⣑⣢⣕⣄⠤⡶⣽⠏⠉⠉⠉⠲⣤⣍⣈⠕⠪⢅⣠⡠⢤⣷⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢀⢷⡶⣂⣼⣿⢀⠀⠀⠀⣰⢯⠋⠀⠀⠀⠀⠀⢹⣾⣗⣾⠽⠓⠛⡿⡋⢹⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣸⠀⠘⣿⣿⣭⡽⠗⠚⠛⠛⠋⠀⠀⠀⠀⠀⠀⠈⠉⠙⢧⠀⠀⠀⠘⢟⡟⡄⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣴⠋⠀⢈⣿⣿⡟⠁⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠈⠳⡀⠀⠀⢈⡖⢸⡀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢀⣼⣥⣀⠠⣿⣿⠏⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢳⣀⣴⣶⣷⣶⣧⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣠⠗⠈⠑⢮⣿⡾⠃⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠸⡟⠋⠁⠘⡌⠙⢆⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢀⣼⢋⠀⠄⢱⡿⡟⠁⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢩⠁⠀⢛⣱⡀⠈⢆⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢀⡮⣤⣦⡀⢀⡾⡝⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠈⡆⠖⠋⠁⢣⠀⠈⡆⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣾⠃⡰⠉⣳⣾⡝⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠘⡾⠋⠠⠈⣆⠀⠸⡀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⡜⠀⠀⢠⣾⡿⠋⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠈⠣⡀⠀⠈⠀⠀⢱⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢰⢁⢤⣰⣿⠟⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠙⣄⠀⠀⠀⠀⢇⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢀⠃⣮⣿⡿⠁⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠈⢆⠀⠀⣀⠘⡄⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⢠⠎⢤⡿⡟⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠈⢣⢊⠬⠆⠑⣄⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⣰⣿⣿⡿⣥⠁⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠈⢦⣶⡒⢶⡞⠢⣄⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⣠⣾⣛⡏⡻⣳⠃⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢸⢿⣿⣿⣾⢷⣿⣿⣶⣯⡿⢆⡀
⠀⠀⠀⠀⠀⠀⠉⠉⠚⠚⠛⠋⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠸⠦⠿⠿⠿⠿⠿⠿⠿⠿⠷⠷⠾`);
  }
});
app.event('member_joined_channel', async ({ event, say }) => {
  if(event.channel === 'C07AA6E18H5'){
    const userInfo = await web.users.info({ user: event.user });
    const newUser = new UserClass(userInfo.user.real_name, userInfo.user.id, userInfo.user.tz);
    if(carSpotManager.members.length > 0){
      carSpotManager.members.sort((a, b) => a.parkingCounter - b.parkingCounter);
      newUser.parkingCounter = carSpotManager.members[carSpotManager.members.length - 1].parkingCounter;
      newUser.parkingCounter = carSpotManager.members[carSpotManager.members.length - 1].lastParkingStamp;

    }
    saveNewUser(newUser, carSpotManager);
    await say(`SIIIU`);
  }
});

app.event('message', async ({ event, say }) => {
  if (event.text === 'rotate') {
    await say('Parking key holders for this week:');

    carSpotManager.rotateMembers();
    // Create a copy of the members array to avoid modifying the original
    var membersCopy = carSpotManager.members.slice(); // or use [...carSpotManager.members]
    membersCopy.splice(0, carSpotManager._carSpots).forEach(member => {
      say(`<@${member.id}>`);
    });
  }
});

// (async () => {
//   try {
//     const rotationResult = await rotation(carSpotManager);  // Resolve the promise first

//     await app.client.chat.scheduleMessage({
//       channel: 'C07AA6E18H5',  // Ensure this is the correct channel
//       text: `${rotationResult}`,  // Now use the resolved result in template literal
//       post_at: carSpotManager.messageSchedule,  // Unix timestamp (seconds)
//     });


//   } catch (error) {
//     console.error(error);
//   }
//   carSpotManager.messageSchedule = Math.floor(carSpotManager.messageSchedule + 60); 
//   console.log(carSpotManager.messageSchedule);

// })();


app.event('message', async ({ event, say }) => {
  if (event.text === 'list all') {
    await say('All members:');

    carSpotManager.members.forEach(member => {
      say(`<@${member.id}> - ${member.parkingCounter}`);
    });
  }
});


(async () => {
  // Start the app
  await app.start(process.env.PORT || 3000);
  console.log('⚡️ Bolt app is running!');
})();

expressApp.get('/message', async (req, res) => {
  const message = await rotation(carSpotManager);  

  res.send(message);
})

expressApp.listen(8000, () => {
  console.log('Example app listening on port 8000!')
})
