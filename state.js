export default class State {
    constructor({ m1, m2, G, d0, v0, dt }) {
        this.G = G;
        this.dt = dt;
        this.time = 0;

        this.m1 = m1;
        this.x1 = 0;
        this.y1 = 0;
        this.v1x = 0;
        this.v1y = 0;

        this.m2 = m2;
        this.x2 = d0;
        this.y2 = 0;
        this.v2x = 0;
        this.v2y = v0;

        this.maxDist = 0;
        this.minDist = Infinity;
    }
    iterate() {
        const { G, dt, m1, x1, y1, m2, x2, y2 } = this;
        const dx = x2 - x1;
        const dy = y2 - y1;
        const dstSqr = dx*dx + dy*dy;
        const dst = Math.sqrt(dstSqr);
        const nx = dx/dst;
        const ny = dy/dst;
        const gf = G*m1*m2/dstSqr;
        const a1 = gf/m1;
        this.v1x += a1*nx*dt;
        this.v1y += a1*ny*dt;
        const a2 = - gf/m2;
        this.v2x += a2*nx*dt;
        this.v2y += a2*ny*dt;
        this.x1 += this.v1x*dt;
        this.y1 += this.v1y*dt;
        this.x2 += this.v2x*dt;
        this.y2 += this.v2y*dt;
        this.time += dt;
        this.maxDist = Math.max(this.maxDist, dst);
        this.minDist = Math.min(this.minDist, dst);
        return this;
    }
    centerOfMass() {
        const { x1, y1, m1, x2, y2, m2 } = this;
        const x = (x1*m1 + x2*m2)/(m1 + m2);
        const y = (y1*m1 + y2*m2)/(m1 + m2);
        return [ x, y ];
    }
}
