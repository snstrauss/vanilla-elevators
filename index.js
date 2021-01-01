import './src/styles/importStyles';
import { createNewBuildingFromParams } from "./src/services/building.service";
import { building } from './src/services/dom.service';

function initializeBuilding(buildingForm, ev) {
    ev && ev.preventDefault();
    createNewBuildingFromParams(buildingForm);
    setTimeout(building.scrollBuildingToBottom, 500);
}

window.onload = function () {
    initializeBuilding(document.getElementById('building-params'));
}

window.buildingMethods = {
    initializeBuilding
}