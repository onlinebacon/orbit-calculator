const twoDig = (val) => val.toString().padStart(2, '0');

const formatSeconds = (seconds) => {
    let total = seconds | 0;
    let sec = total%60;
    total = Math.round((total - sec)/60);
    let min = total%60;
    total = Math.round((total - min)/60);
    let hr = total%24;
    total = Math.round((total - hr)/24);
    let days = total;
    return `${days}d ${twoDig(hr)}h ${twoDig(min)}m ${twoDig(sec)}s`;
};

export default formatSeconds;
