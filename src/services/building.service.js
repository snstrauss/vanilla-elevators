import consts from "../consts";
import Elevator from "../models/elevator.model";
import Floor from "../models/floor.model";
import { building } from "./dom.service";

const allElevators = [];

function addFloor(_, idx) {
    const newFloor = new Floor(idx);
    building.addToBuilding(newFloor.element);
}

function addElevator(_, idx) {
    const hasElevators = building.getAllElevators();

    if (!hasElevators) {
        building.initializeElevators();
    }

    const newElevator = new Elevator(idx);

    allElevators.push(newElevator);
    building.addToElevators(newElevator.element);
}

const elementAdders = {
    floors: addFloor,
    elevators: addElevator
}

function addMultipleElements(elementsCount, elementType) {
    Array(elementsCount).fill().forEach(elementAdders[elementType]);
}

export function createNewBuildingFromParams(buildingForm) {
    building.clearBuilding();

    const buildData = new FormData(buildingForm);

    ['floors', 'elevators'].forEach((elementType) => {
        const count = parseInt(buildData.get(elementType));

        building.getBuilding().style.setProperty(`--num-${elementType}`, count);

        addMultipleElements(count, elementType);
    });

    building.getBuilding().style.setProperty(`--travel-time`, consts.TRAVEL_TIME + 'ms');
}

export function callElevator(floor) {
    allElevators[0].goToFloor(floor);
}