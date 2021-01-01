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

    const button = document.createElement('button');
    button.classList.add('call-button');
    button.onclick = () => {
        if (!button.classList.contains('waiting')) {
            button.classList.add('waiting');

            queueElevatorRequest(floorNumber).then(() => {
                button.classList.remove('waiting');
            });
        }
    }
    floorContainer.append(button);

    return floorContainer;
}

export const floor = {
    createNewFloor
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
    const newText = JSON.stringify(type === 'currTrip' ? elevatorObj.currTrip : elevatorObj.requests) || '';
    elevatorObj.element.querySelector(ELEVATOR_DATA_SELECTORS[type]).innerText = newText;
}

export const elevator = {
    createNewElevator,
    showElevatorData
}