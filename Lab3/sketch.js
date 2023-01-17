let boids = [];
let fortresses = [];


function setup() {
	createCanvas(windowWidth, windowHeight);
	player1 = new Player(1);
	player2 = new Player(2);
	for (let i = 0; i < 0; i++) {
		boids.push(new Boid(random(0, 800), random(0, 800)));
	}
	fortresses.push(new Fortress(80, 100, 30, 10, 0));
	fortresses.push(new Fortress(600, 600, 50, 10, 1));
	fortresses.push(new Fortress(400, 350, 80, 80, 2));
	fortresses.push(new Fortress(1200, 675, 50, 50, 3));
	fortresses.push(new Fortress(1050, 200, 40, 10, 4));
	fortresses.push(new Fortress(175, 700, 30, 30, 5));
	fortresses.push(new Fortress(700, 400, 40, 10, 6));
	fortresses.push(new Fortress(500, 90, 10, 10, 7));
	fortresses[0].setOwner(1);
	fortresses[1].setOwner(1);
	fortresses[2].setOwner(0);
	fortresses[3].setOwner(0);
	fortresses[4].setOwner(2);
	fortresses[5].setOwner(0);
	fortresses[6].setOwner(2);
}



function draw() {
	background(0);
	stroke(255);
	noFill();
	//collect all active boids in this frame
	boids = []
	boids1 = [];
	boids2 = [];
	for (let fortress of fortresses) {
		if (fortress.owner === player1.id)
			boids1 = boids1.concat(fortress.getActiveBoids());
		else if (fortress.owner === player2.id)
			boids2 = boids2.concat(fortress.getActiveBoids());
	}
	boids = boids.concat(boids1);
	boids = boids.concat(boids2);

	//check for interactions between boids
	for (let b1 of boids) {
		if(!b1.active) continue;
		let detectionRange = 15*b1.r;
		let detectedBoids = [];
		for (let b2 of boids) {
			if(!b2.active || b1.owner == b2.owner || b1 === b2) continue;
				d = dist(b1.pos.x, b1.pos.y, b2.pos.x, b2.pos.y);
				if(b1.action === BOID_ACTIONS.WANDER && d < detectionRange){
					detectedBoids.push(b2);
				}
				if (d < b1.r + b2.r) {
					b1.active = false;
					b2.active = false;
				}
		}
		if(detectedBoids.length > 0) {
			console.log(detectedBoids.length);
			let ind = Math.floor(random(0, detectedBoids.length));
			//console.log('pursuing boid ' + ind);
			b1.target = detectedBoids[ind];
			b1.action = BOID_ACTIONS.PURSUE;
		}
	}

	//check for interactions between boids and fortresses
	for (let fortress of fortresses) {
		for (let boid of boids) {
			//collision occured
			if (boid.active && dist(boid.pos.x, boid.pos.y, fortress.pos.x, fortress.pos.y) < boid.r + fortress.r) {
				//collision with enemy/neutral fortress
				if (fortress.owner !== boid.owner) {
					fortress.count--;
					boid.active = false;
					if (fortress.count == 0) {
						fortress.setOwner(0);
						if (fortress === fortresses[player1.select]) {
							fortress.setHighlight(false);
							player1.invalidateSelect();
						} else if (fortress === fortresses[player2.select]) {
							fortress.setHighlight(false);
							player2.invalidateSelect();
						}
					} else if (fortress.count < 0) {
						fortress.setOwner(boid.owner);
						fortress.count = 1;
						checkWin();
					}
				}
				//collision with owner fortress 
				else if (boid.owner === fortress.owner) {
					//required to avoid absorption at deployment
					if (boid.action === BOID_ACTIONS.WANDER || boid.action === BOID_ACTIONS.RETREAT || boid.target.pos == fortress.pos) {
						fortress.count++;
						boid.active = false;
					}
				}

			}
		}
		//fortresses[5].pos = createVector(mouseX, mouseY);
		fortress.update();
		fortress.show();
	}
}

function keyPressed() {
	player1.handleInput(keyCode);
	player2.handleInput(keyCode);
}

function checkWin() {
	let p1Eliminated = true;
	let p2Eliminated = true;
	for(let fortress of fortresses) {
		if(fortress.owner == player1.id) p1Eliminated = false;
		else if(fortress.owner == player2.id) p2Eliminated = false;
	}

	if(p2Eliminated) alert("Player 1 won!");
	else if(p1Eliminated) alert("Player 2 won!");
}
///overwiev
//1. boids should update based on the assigned action(attack, retreat, wander...)
//	1.1. checking if boid should update??

//2. fortresses have boids associated with them, however not all boids should behave the same

//3. checking interactions
//3.1 between boids and fortresses
//3.2 between boids

//4. player associated fortresses / boids



//fortresses[0].attack(fortresses[1].pos);
//fortresses[1].attack(fortresses[0].pos);
//fortresses[0].retreat();
//fortresses[0].setOwner(1);
//fortresses[1].setOwner(2);
//fortresses[2].setOwner(0);