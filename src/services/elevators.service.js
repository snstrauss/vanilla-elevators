const ALL_ELEVATORS = [];

export function addElevatorToPool(elevator) {
    ALL_ELEVATORS.push(elevator);
}

export function queueElevatorRequest(requestedFloor) {
    return new Promise((resolve) => {
        const nextElevator = findBestElevator(requestedFloor);

        const gotToFloorPromise = new Promise((gotToFloor) => {
            nextElevator.listenToReachedFloor(requestedFloor, gotToFloor);
        });

        nextElevator.addCall(requestedFloor);

        resolve({
            gotToFloorPromise,
            requestedElevator: nextElevator,
        });
    });
}

function findBestElevator(requestedFloor) {
    const byDistance = ALL_ELEVATORS.sort((e1, e2) => {
        return Math.abs(requestedFloor - e1.currFloor) - Math.abs(requestedFloor - e2.currFloor);
    });

    const idleOnly = byDistance.filter(e => e.isIdle);

    return (idleOnly.length ? idleOnly : byDistance)[0]
}

export function resetElevators() {
    while (ALL_ELEVATORS.pop());
}