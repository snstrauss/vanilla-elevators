import { queueElevatorRequest } from '../services/elevators.service';
let cachedElements = {};

function getCachedElement(type) {
    if (!cachedElements[type]) {
        cachedElements[type] = document.getElementById(type);
    }

    return cachedElements[type];
}
const getBuilding = getCachedElement.bind(null, 'building');
const getAllElevators = getCachedElement.bind(null, 'allElevators');

function clearBuilding() {
    cachedElements = {};
    getBuilding().replaceChildren([]);
}

function createAllElevatorsParent() {
    const allElevators = document.createElement('div');
    allElevators.id = 'allElevators';

    return allElevators;
}

function scrollBuildingToBottom() {
    document.body.scroll({
        top: document.body.scrollHeight,
        behavior: 'smooth'
    });
}

function initializeElevators() {
    addToBuilding(createAllElevatorsParent());
}

function addToBuilding(child) {
    getBuilding().prepend(child);
}

function addToElevators(child) {
    getAllElevators().append(child);
}

export const building = {
    addToBuilding,
    addToElevators,
    getBuilding,
    getAllElevators,
    clearBuilding,
    scrollBuildingToBottom,
    createAllElevatorsParent,
    initializeElevators
}

function createNewFloor(floorNumber) {

    const floorContainer = document.createElement('div');
    floorContainer.classList.add('floor');

    const floorNum = document.createElement('span');
    floorNum.classList.add('floor-num');
    floorNum.innerText = floorNumber;
    floorContainer.append(floorNum);

    const arrivalTimer = document.createElement('div');
    arrivalTimer.classList.add('arrival-timer');
    floorContainer.append(arrivalTimer);

    const button = document.createElement('button');
    button.classList.add('call-button');
    button.onclick = () => {
        if (!button.classList.contains('waiting')) {
            button.classList.add('waiting');

            queueElevatorRequest(floorNumber)
                .then(({ requestedElevator, gotToFloorPromise }) => {
                    showRemainingTime(requestedElevator);
                    return gotToFloorPromise;
                }).then(elevatorReachedFloor)
                .catch(_ => {
                    floor.ringBell();
                    button.classList.remove('waiting');
                });
        }
    }
    floorContainer.append(button);

    function toggleTimer() {
        arrivalTimer.classList.toggle('show');
    }

    function showRemainingTime(requestedElevator) {
        let remainingTimeMs = requestedElevator.timeUntilIdle + 1000;

        toggleTimer();
        updateTimer();

        const timerInterval = setInterval(updateTimer, 1000)
        function updateTimer() {
            remainingTimeMs -= 1000;

            const formatted = new Date(remainingTimeMs).toISOString().slice(14, -5);

            arrivalTimer.innerText = `${formatted} // [elevator ${requestedElevator.elevatorNum}]`;
            if (remainingTimeMs === 0) {
                clearInterval(timerInterval);
            }
        }

    }

    function elevatorReachedFloor() {
        button.classList.remove('waiting');
        toggleTimer();
        floor.ringBell();
    }

    return floorContainer;
}

function ringBell() {
    const bell = getCachedElement('notification-bell');
    bell.play();
}

export const floor = {
    createNewFloor,
    ringBell
}

function createNewElevator(idx) {

    const shaft = document.createElement('div');

    shaft.classList.add('shaft', 'is-idle');
    shaft.style.setProperty('--curr-floor', 0);

    const elevatorContainer = document.createElement('div');
    elevatorContainer.classList.add('elevator');
    shaft.appendChild(elevatorContainer);

    const currTrip = document.createElement('div');
    currTrip.classList.add('elevator-data');
    currTrip.innerText = 'going to: '
    const currTripText = document.createElement('span');
    currTripText.classList.add('curr-trip-text');
    currTripText.innerText = 'IDLE';
    currTrip.append(currTripText);
    elevatorContainer.append(currTrip);

    const plannedTrips = document.createElement('div');
    plannedTrips.classList.add('elevator-data');
    plannedTrips.innerText = 'next trips: ';
    const plannedTripsText = document.createElement('span');
    plannedTripsText.classList.add('planned-trips-text');
    plannedTrips.append(plannedTripsText);
    elevatorContainer.append(plannedTrips);

    return shaft;
}

const ELEVATOR_DATA_SELECTORS = {
    currTrip: '.curr-trip-text',
    plannedTrips: '.planned-trips-text'
};
function showElevatorData(elevatorObj, type) {
    const newText = JSON.stringify(type === 'currTrip' ? elevatorObj.currTrip : elevatorObj.requests) || 'IDLE';
    elevatorObj.element.querySelector(ELEVATOR_DATA_SELECTORS[type]).innerText = newText;
}

export const elevator = {
    createNewElevator,
    showElevatorData
}