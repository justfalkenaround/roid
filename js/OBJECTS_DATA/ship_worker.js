'use strict';

/*------WEB WORKER FOR SHIP COLLISION DETECTION------*/
function distance(input, second) {
    const dx = input[0] - second[0];
    const dy = input[1] - second[1];
    const dz = input[2] - second[2];
    return _distance(dx, dy, dz);
}

function _distance(dx, dy, dz) {
    return Math.pow(Math.pow(dz, 2) + Math.pow(Math.pow(Math.pow(dx, 2) + Math.pow(dy, 2), 0.5), 2), 0.5);
}

onmessage = (obj) => {
    const positions = obj.data[0];
    const ids = obj.data[1];
    const rads = obj.data[2];
    const ship = obj.data[3];
    const nearest = { id: null, distance: Infinity, hit: false };
    for (let i = 0; i < positions.length; i++) {
        const p1 = positions[i];
        const dist = distance(ship, p1);
        if (dist - rads[i] < 10) {
            nearest.id = ids[i];
            nearest.distance = dist - rads[i];
            nearest.hit = true;
        }
        else if (dist - rads[i] < 250 && dist + rads[i] < nearest.distance) {
            nearest.id = ids[i];
            nearest.distance = dist - rads[i];
        }
    }
    postMessage(nearest);
};