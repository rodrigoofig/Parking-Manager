const { fetchChannelMembers, rotateMembers, getCurrentWeek } = require('./../helpers/functions');
const fs = require('fs');
const { DateTime } = require('luxon');

class CarSpotManager {
    constructor() {
        this.current_week = getCurrentWeek();
        this._carSpots = 4;
        this.members = []; // Initialize members array
        //initialize this.messageSchedule as the next friday 9AM 
        // this.messageSchedule = DateTime.local().set({weekday: 5, hour: 9, minute: 0, second: 0, millisecond: 0});
        //initialize this.messageSchedule to the next 1 minute
        this.messageSchedule = Math.floor(DateTime.local().plus({minutes: 1}).toSeconds()); 
    }
  
    async initialize() {
      const membersData = JSON.parse(fs.readFileSync('members.json', 'utf8'));
      this.members = membersData;
    }

    rotateMembers() {

      this.members = rotateMembers(this.members, this._carSpots);
    }
  }
  
  module.exports = CarSpotManager;