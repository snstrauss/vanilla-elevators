import consts from "../consts";
import { elevator } from "../services/dom.service";

function moveElevator(elevator, floor) {
    return new Promise((res, rej) => {
        elevator.element.style.setProperty('--curr-floor', floor);
        setTimeout(res, consts.TRAVEL_TIME);
    })
}

function toggleElevatorIdle(elevator) {
    elevator.isIdle = !elevator.isIdle;
    elevator.element.classList.toggle('is-idle');
}

export default function Elevator(idx) {
    this.element = elevator.createNewElevator(idx);

    this.elevatorNum = idx;

    this.isIdle = true;

    this.goToFloor = function goToFloor(floor) {
        toggleElevatorIdle(this);
        moveElevator(this, floor).then(() => {
            toggleElevatorIdle(this);
        });
    };

    return this;
}