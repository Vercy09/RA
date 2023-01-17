const BOID_ACTIONS = {
    IDLE: 0,
    ATTACK: 1,
    RETREAT: 2,
    WANDER: 3,
    PURSUE: 4
};


class Boid {
    constructor(x, y, active = false, owner = 0, action = BOID_ACTIONS.IDLE, target, color) {
        this.pos = createVector(x, y);
        this.vel = createVector(0, 0);
        this.acc = createVector(0, 0);
        this.maxSpeed = 2;
        this.maxForce = 0.1;
        this.r = 16;
        this.active = active;
        this.owner = owner;
        this.action = action;
        this.target = target;
        this.wanderTheta = PI / 2;
        this.color = color;
    }

    setAction(action) {
        this.action = action;
    }
    setTarget(target) {
        this.target = target;
    }
    evade(boid) {
        let pursuit = this.pursue(boid);
        pursuit.mult(-1);
        return pursuit;
    }

    pursue(target) {
        let targetPos = target.pos.copy();
        let prediction = target.vel.copy();
        prediction.mult(10);
        targetPos.add(prediction);
        //fill(0, 255, 0);
        //circle(target.pos.x, target.pos.y, 16);
        let force = p5.Vector.sub(targetPos, this.pos);
        force.setMag(this.maxSpeed);
        force.sub(this.vel);
        force.limit(this.maxForce);
        return force;
    }

    flee(target) {
        return this.seek(target).mult(-1);
    }

    seek(target) {
        let targetPos = target.pos.copy();
        //calculate the difference between current pos and desired pos
        let force = p5.Vector.sub(targetPos, this.pos);
        force.setMag(this.maxSpeed);
        //calculate the steer
        force.sub(this.vel);
        force.limit(this.maxForce);
        return force;
    }

    wander() {
        //project a point in the direction of velocity
        let wanderPoint = this.vel.copy();
        wanderPoint.setMag(100);
        wanderPoint.add(this.pos);  
        
        //construct a circle around projected point
        let wanderRadius = 50;
        //pick a point on the circle
        let theta = this.wanderTheta + this.vel.heading();   
        let x = wanderRadius * cos(theta);
        let y = wanderRadius * sin(theta);
        //displace the wander point by the circle point
        wanderPoint.add(x, y);  

        let steer = wanderPoint.sub(this.pos);
        steer.setMag(this.maxForce);
        
        //randomly offset the wander theta for next frame
        let displaceRange = 0.3;
        this.wanderTheta += random(-displaceRange, displaceRange);
        return steer;
    }

    applyForce(force) {
        this.acc.add(force);
    }

    update() {
        let force = null;
        switch (this.action) {
            case BOID_ACTIONS.ATTACK:
            case BOID_ACTIONS.RETREAT:
                force = this.seek(this.target);
                break;
            case BOID_ACTIONS.WANDER:
                force = this.wander();
                break;
            case BOID_ACTIONS.PURSUE:
                if(!this.target.active) {
                    this.action = BOID_ACTIONS.WANDER;
                }
                force = this.pursue(this.target);
                break;
            default:
                console.log('boid err ' + this.action);
        }

        this.applyForce(force);
        this.vel.add(this.acc);
        this.vel.limit(this.maxSpeed);
        this.pos.add(this.vel);
        this.acc.set(0, 0);
    }

    show(highlight) {
        stroke(255);
        strokeWeight(1);

        let r = this.color.levels[0];
        let g = this.color.levels[1];
        let b = this.color.levels[2];
        if (highlight) {
            r -= 50;
            g -= 50;
            b -= 50;
        } 
        fill(color(r, g, b));
        push();
        //circle(this.pos.x, this.pos.y, this.r*2);
        translate(this.pos.x, this.pos.y);
        rotate(this.vel.heading());

        triangle(-this.r, -this.r / 2, -this.r, this.r / 2, this.r, 0);
        pop();
    }
}