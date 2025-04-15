'use strict';

/*------WEB WORKER FOR PROJECTILE COLLISION DETECTION------*/
function dividedByNumber(input, second) {
    const dx = input[0] / second;
    const dy = input[1] / second;
    const dz = input[2] / second;
    return [dx, dy, dz];
}

function timesNumber(input, second) {
    const dx = input[0] * second;
    const dy = input[1] * second;
    const dz = input[2] * second;
    return [dx, dy, dz];
}

function minus(input, second) {
    const dx = input[0] - second[0];
    const dy = input[1] - second[1];
    const dz = input[2] - second[2];
    return [dx, dy, dz];
}

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
    const velocities = obj.data[3];
    let results = [];
    for (let i = 0; i < positions.length; i++) {
        const p1 = positions[i];
        if (ids[i].indexOf('PROJECTILE') === -1) {
            continue;
        }
        else if (ids[i].indexOf('ENEMY') !== -1) {
            continue;
        }
        let hit = false;
        for (let j = 0; j < positions.length; j++) {
            if (ids[j].indexOf('PROJECTILE') >= 0) {
                continue;
            }
            if (i === j || hit) {
                continue;
            }
            const p2 = positions[j];
            const divider = dividedByNumber(velocities[i], 10);
            for (let f = 1; f <= 10; f++) {
                const div = timesNumber(divider, f);
                const pos = minus(p1, div);
                if (distance(pos, p2) - rads[i] - rads[j] < 1 && !hit) {
                    results.push(ids[i]);
                    results.push(ids[j]);
                    hit = true;
                }
            }
            if (distance(p1, p2) - rads[i] - rads[j] < 1 && !hit) {
                results.push(ids[i]);
                results.push(ids[j]);
                hit = true;
            }
        }
    }
    postMessage(results);
};