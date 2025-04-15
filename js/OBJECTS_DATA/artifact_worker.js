'use strict';

/*------WEB WORKER FOR ARTIFACT COLLSION DETECTION------*/
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
    let results = [];
    for (let i = 0; i < positions.length; i++) {
        const p1 = positions[i];
        for (let j = 0; j < positions.length; j++) {
            const p2 = positions[j];
            if (i === j) {
                continue;
            }
            const dist = distance(p1, p2);
            if (dist < rads[i] + rads[j]) {
                if (ids[i].indexOf('ASTEROID') === -1) {
                    results.push(ids[i]);
                }
                if (ids[j].indexOf('ASTEROID') === -1) {
                    results.push(ids[j]);
                }
            }
        }
    }
    postMessage(results);
};