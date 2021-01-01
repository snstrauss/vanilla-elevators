import consts from "../consts";
import Elevator from "../models/elevator.model";
import Floor from "../models/floor.model";
import { building } from "./dom.service";
import { addElevatorToPool, resetElevators } from "./elevators.service";

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

    addElevatorToPool(newElevator);
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
    resetElevators();

    const buildData = new FormData(buildingForm);

    ['floors', 'elevators'].forEach((elementType) => {
        let count = parseInt(buildData.get(elementType));

        if (elementType === 'floors') {
            count++
        };

        building.getBuilding().style.setProperty(`--num-${elementType}`, count);

        addMultipleElements(count, elementType);
    });

    building.getBuilding().style.setProperty(`--travel-time`, consts.TRAVEL_TIME + 'ms');


}