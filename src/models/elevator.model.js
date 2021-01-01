import consts from "../consts";
import { elevator, elevator as elevatorDom } from "../services/dom.service";

export default function Elevator(idx) {
    this.element = elevatorDom.createNewElevator(idx);

    this.elevatorNum = idx;

    this.isIdle = true;

    this.requests = [];

    this.currFloor = 0;

    this.reachedFloorCbQueue = [];

    this.goHomeTimeout = null;

    return this;
}

Elevator.prototype.moveElevator = function moveElevator(floor) {
    return new Promise((res) => {
        this.element.style.setProperty('--curr-floor', floor);
        setTimeout(res, consts.TRAVEL_TIME);
    })
}

Elevator.prototype.changeCurrFloor = function changeCurrFloor(goingUp) {
    this.currFloor += goingUp ? 1 : -1;
}

Elevator.prototype.goToFloor = function goToFloor(floor) {
    const floorDelta = floor - this.currFloor;
    const timeInEachFloor = consts.TRAVEL_TIME / (Math.abs(floorDelta));
    const goingUp = floorDelta >= 0;

    const floorChange = setInterval(() => {
        this.changeCurrFloor(goingUp)
    }, timeInEachFloor)

    return this.moveElevator(floor).then(() => {
        clearInterval(floorChange);
    });
};

Elevator.prototype.addCall = function addCall(request) {
    clearTimeout(this.goHomeTimeout);

    this.requests.push(request);
    elevator.showElevatorData(this, 'plannedTrips');
    if (this.isIdle) {
        this.startRide();
    }
}

Elevator.prototype.toggleIdle = function toggleElevatorIdle() {
    this.isIdle = !this.isIdle;
    this.element.classList.toggle('is-idle');
}

Elevator.prototype.startRide = function startRide() {
    const nextRequest = this.requests.shift();

    this.currTrip = nextRequest;
    elevator.showElevatorData(this, 'currTrip');
    elevator.showElevatorData(this, 'plannedTrips');

    if (Number.isInteger(nextRequest)) {
        if (this.isIdle) {
            this.toggleIdle();
        }
        this.goToFloor(nextRequest).then(() => {
            const reachedFloorListener = this.reachedFloorCbQueue.splice(nextRequest, 1, null)[0];
            reachedFloorListener && reachedFloorListener();

            setTimeout(() => {
                this.startRide();
            }, 1000);
        })
    } else {
        this.toggleIdle();
        if (this.currFloor !== 0) {
            this.goHomeTimeout = setTimeout(() => {
                this.addCall(0);
            }, 5 * 1000);
        }
    }
}

Elevator.prototype.listenToReachedFloor = function listenToReachedFloor(identifier, cb) {
    this.reachedFloorCbQueue[identifier] = cb;
}