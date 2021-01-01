import './src/styles/importStyles';
import { createNewBuildingFromParams } from "./src/services/building.service";
import { building } from './src/services/dom.service';

function initializeBuilding(buildingForm, ev) {
    ev && ev.preventDefault();
    createNewBuildingFromParams(buildingForm);
}

window.onload = function () {
    initializeBuilding(document.getElementById('building-params'));
    setTimeout(building.scrollBuildingToBottom, 500);
}

window.buildingMethods = {
    initializeBuilding
}