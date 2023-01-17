class Fortress {
    constructor(x, y, capacity, count, id) {
        this.pos = createVector(x, y);
        this.capacity = capacity;
        this.activeBoids = [];
        this.count = count;
        setInterval(() => this.increaseCount(), 3000 * 1 / Math.log(capacity));
        this.owner = 0;
        this.r = 10 * Math.floor(Math.log(2.5 * capacity));
        this.highlight = false;
        this.id = id;
    }

    getActiveBoids() {
        return this.activeBoids;
    }

    setHighlight(highlight) {
        this.highlight = highlight;
    }

    setOwner(owner) {
        this.owner = owner;
    }

    increaseCount() {
        if (this.count < this.capacity && this.owner != 0) {
            this.count++;
        }
    }

    attack(target) {
        this.deploy(BOID_ACTIONS.ATTACK, target);
    }

    retreat() {
        for (let boid of this.activeBoids) {
            boid.setAction(BOID_ACTIONS.RETREAT);
            boid.setTarget(this);
        }
    }

    wander() {
        for (let boid of this.activeBoids) {
            boid.setAction(BOID_ACTIONS.WANDER);
            boid.setTarget(null);
        }
    }

    deploy(action, target) {
        let n = Math.floor(this.count / 2)
        for (let i = 0; i < n; i++) {
            let offset = createVector(random(-50, 50), random(-50, 50));

            let r, g, b;
            let c;
            switch (this.owner) {
                case 0:
                    r = g = b = 100;
                    break;
                case 1:
                    r = 255;
                    g = b = 50;
                    break;
                case 2:
                    r = g = 50;
                    b = 255;
                    break;
            }
            c = color(r, g, b);

            this.activeBoids.push(new Boid(this.pos.x + offset.x, this.pos.y + offset.y, true, this.owner, action, target, c));
        }
        this.count -= n;
    }

    update() {
        for (let i = this.activeBoids.length - 1; i >= 0; i--) {
            if (!this.activeBoids[i].active) {
                this.activeBoids.splice(i, 1);
            }
        }
        for (let boid of this.activeBoids) {
            boid.update();
        }
    }

    show() {
        let r, g, b;
        let c;


        switch (this.owner) {
            case 0:
                r = g = b = 100;
                break;
            case 1:
                r = 255;
                g = b = 50;
                break;
            case 2:
                r = g = 50;
                b = 255;
                break;
        }
        push();
        if (this.highlight) {
            r -= 50;
            g -= 50;
            b -= 50;
            strokeWeight(4);
            stroke(255, 255, 0);
        } else {
            stroke(255);
        }

        c = color(r, g, b);


        fill(c);
        circle(this.pos.x, this.pos.y, this.r * 2);
        pop();


        stroke(0);
        fill(255, 255, 0);
        textAlign(CENTER, CENTER);
        textSize(16);
        text(this.count, this.pos.x, this.pos.y);
        let str = '';
        if (this.owner == 2) {
            str = str + 'num';
        }

        text(str + (this.id + 1), this.pos.x, this.pos.y - this.r - 10);

        for (let boid of this.activeBoids) {
            //if(boid.display) {
            boid.show(this.highlight);
            //}
        }
    }
}