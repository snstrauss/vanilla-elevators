import { floor } from "../services/dom.service";

export default function Floor(idx) {
    this.element = floor.createNewFloor(idx);

    this.floorNum = idx;

    return this;
}