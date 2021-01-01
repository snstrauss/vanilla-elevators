import { callElevator } from "./building.service";

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
        callElevator(floorNumber);
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

    const elev = document.createElement('div');
    elev.classList.add('elevator');
    shaft.appendChild(elev);

    return shaft;
}

export const elevator = {
    createNewElevator
}