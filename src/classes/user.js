class User {
    constructor(name, id, timezone) {
        this.name = name;
        this.id = id
        this.canParkCar = true;
        this.parkingCounter = 0;
        this.creationStamp = new Date().getTime();
        this.lastParkingStamp = null;
        this.timezone = timezone
    }

    async initialzie(){}
    
    addParkingCounter() {
        this.parkingCounter++;
    }

}


module.exports = User;