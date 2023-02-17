const metric = [
    [0.001, 'mm'],
    [0.01, 'cm'],
    [1, 'm'],
    [1000, 'km'],
    [365.25*86400*299792458, 'ly'],
];
const imperial = [
    [0.0254, 'in'],
    [0.3048, 'ft'],
    [1609.344, 'mi'],
];
const all = [
    ...metric,
    ...imperial,
].sort((a, b) => a[0] - b[0]);
const typeMap = {
    metric,
    imperial,
    all,
};
const formatMeters = (value, type = 'all') => {
    let i = 0;
    const units = typeMap[type];
    for (;;) {
        if (i + 1 >= units.length) break;
        const [ unitVal ] = units[i + 1];
        if (Math.abs(value) < unitVal) break;
        ++ i;
    }
    const [ unitVal, suffix ] = units[i];
    const core = value/unitVal;
    const str = Math.abs(core) > 1000 ? Math.round(core) : core.toPrecision(4);
    return Number(str) + ' ' + suffix;
};
export default formatMeters;
