const { web } = require('./../configs');
const fs = require('fs');
const {DateTime} = require('luxon');

const { storeMembers } = require('./../helpers/sys-functions')

async function fetchChannelMembers(channelId) {
    try {
      const result = await web.conversations.members({ channel: channelId });
      if (result.ok) {
        const members = [];
        for (const memberId of result.members) {
            
          const userInfo = await web.users.info({ user: memberId });
          if (userInfo.ok) {
            console.log(userInfo);
            const memberInfo = {
              id: userInfo.user.id,
              name: userInfo.user.real_name || userInfo.user.name || 'Unknown',
            };
            members.push(memberInfo);
          } else {
            console.error(`Failed to fetch info for user: ${memberId}`);
          }
        }
        return members;
      } else {
        throw new Error('Failed to fetch channel members');
      }
    } catch (error) {
      console.error(error);
      throw error;
    }
}

function rotateMembers(members, carSpots) {
  let sortedList 

  if(members.every(user => user.parkingCounter === members[0].parkingCounter) && (members.every(user => user.lastParkingStamp != null)))
  {
    sortedList = members.sort((a, b) => a.lastParkingStamp - b.lastParkingStamp);
  }
  else{
    sortedList = members.sort((a, b) => a.parkingCounter - b.parkingCounter);
  }
  canParkCarList = sortedList.filter(user => user.canParkCar === true);
  console.log('merda', canParkCarList.length);
  let rotatedMembers = canParkCarList.slice(0, carSpots);


  for(let i = 0; i < rotatedMembers.length; i++){
      rotatedMembers[i].parkingCounter++;
      rotatedMembers[i].lastParkingStamp = new Date().getTime();
  }
  storeMembers(sortedList);
  return sortedList;
}

function getCurrentWeek() {
    const now = new Date();
    const startOfYear = new Date(now.getFullYear(), 0, 0);
    const diff = now - startOfYear;
    const oneWeek = 1000 * 60 * 60 * 24 * 7;
    const currentWeek = Math.floor(diff / oneWeek);
    return currentWeek;
  }

function saveNewUser(user, manager) {
    
    if(manager.members.some(member => member.id === user.id)){
      console.log('User already exists');
      return 
    }
    const membersData = JSON.parse(fs.readFileSync('members.json', 'utf8'));
    membersData.push(user);
    fs.writeFileSync('members.json', JSON.stringify(membersData));
    manager.members.push(user);
}

async function rotation(carSpotManager) {

  let message = 'Weekly rotation:\n';
  carSpotManager.rotateMembers();
  // Create a copy of the members array to avoid modifying the original
  var membersCopy = carSpotManager.members.slice(); // or use [...carSpotManager.members]
  membersCopy.splice(0, carSpotManager._carSpots).forEach(member => {
    message += `${member.name}\n`;
  });
  return message;
};


module.exports = {
    fetchChannelMembers,
    rotateMembers,
    getCurrentWeek,
    saveNewUser,
    rotation
}