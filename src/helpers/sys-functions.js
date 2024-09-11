const fs = require('fs');


function storeMembers(members) {
    const data = JSON.stringify(members, null, 2); // 2 spaces for pretty priting
    fs.writeFile('members.json', data, err => {
        if (err) {
            console.error(err);
        }
    });
}

function getAllMembers() {
    fs.readFile('members.json', 'utf8', (err, data) => {
        if (err) {
          console.error(err);
          return;
        }
        console.log(data);
    });

    data = JSON.stringify(data);

    return data;
}

module.exports = {
    storeMembers,
    getAllMembers
}
