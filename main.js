import State from './state.js';
import formatMeters from './format-meters.js';
import formatSeconds from './format-seconds.js';

const canvas = document.querySelector('canvas');
const ctx = canvas.getContext('2d');

const nIt = 2000;
const units = 'metric';
const maxPath = 1000;
const minDist = 2;
const config = {};
let state = null;
let scale = null;
let array = [];

const drawBody = (mx, my, cx, cy, px, py, rad, color) => {
    const x = mx + (px - cx)*scale;
    const y = my + (cy - py)*scale;
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(x, y, rad, 0, Math.PI*2);
    ctx.fill();
};

const render = () => {
    const { width, height } = canvas;
    ctx.fillStyle = '#1c1c1c';
    ctx.fillRect(0, 0, width, height);
    const mx = width*0.5;
    const my = height*0.5;
    ctx.strokeStyle = '#0bf';
    ctx.beginPath();
    for (let i=0; i<array.length; ++i) {
        const [ dx, dy ] = array[i];
        const x = mx + dx;
        const y = my + dy;
        if (i === 0) {
            ctx.moveTo(x, y);
        } else {
            ctx.lineTo(x, y);
        }
    }
    ctx.stroke();
    const [ cx, cy ] = state.centerOfMass();
    drawBody(mx, my, cx, cy, state.x1, state.y1, 10, '#ccc');
    drawBody(mx, my, cx, cy, state.x2, state.y2, 5, '#ccc');
    const aph = state.maxDist;
    const per = state.minDist;
    const e = (aph - per)/(aph + per);
    ctx.fillStyle = '#fff';
    ctx.textBaseline = 'bottom';
    ctx.font = '14px monospace';
    const lines = [
        'aph = ' + formatMeters(aph, units),
        'per = ' + formatMeters(per, units),
        'ecc = ' + e.toPrecision(6),
        'time: ' + formatSeconds(state.time),
    ];
    const lineHeight = 20;
    const marginBottom = 10;
    for (let i=0; i<lines.length; ++i) {
        const y = height - marginBottom + lineHeight*(i - lines.length + 1);
        ctx.fillText(lines[i], 10, y);
    }
};

setInterval(() => {
    if (state.time > config.duration) return;
    for (let i=0; i<nIt; ++i) {
        state.iterate();
    }
    if (array.length >= maxPath) return;
    const [ cx, cy ] = state.centerOfMass();
    const dx = (state.x2 - cx)*scale;
    const dy = (cy - state.y2)*scale;
    if (array.length !== 0) {
        const last = array.at(-1);
        const [ x, y ] = last;
        const difx = x - dx;
        const dify = y - dy;
        const dist = Math.sqrt(difx*difx + dify*dify);
        if (dist < minDist) return;
    }
    array.push([ dx, dy ]);
}, 0);

const frameLoop = () => {
    render();
    requestAnimationFrame(frameLoop);
};

const runNewOrbit = () => {
    state = new State(config);
    scale = canvas.height*0.4/config.d0;
    array.length = 0;
};

[...document.querySelectorAll('input')].forEach(input => {
    const name = input.getAttribute('name');
    config[name] = Number(input.value);
    input.addEventListener('input', () => {
        const value = Number(input.value);
        if (isNaN(value)) return;
        config[name] = value;
        runNewOrbit();
    });
});

runNewOrbit();
frameLoop();
