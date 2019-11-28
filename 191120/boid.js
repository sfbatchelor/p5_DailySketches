let id = 7;
class Boid {

    constructor() {
        let spread = 4;
        this.position = createVector(random(width/-spread, width/spread)+width/2, random(height/-spread, height/spread) +height/2);
        this.velocity = p5.Vector.random2D();
        this.velocity.setMag(random(2, 5));
        this.acceleration = createVector();
        this.maxForce = 0.4;
        this.maxSpeed = 1;
        this.id = id;
        this.width  = 10000000000;//random(1000000, 1000000);
        id++;
    }


    edges() {
        if (this.position.x > width) {
            this.position.x = 0;
        } else if (this.position.x < 0) {
            this.position.x = width;
        }
        if (this.position.y > height) {
            this.position.y = 0;
        } else if (this.position.y < 0) {
            this.position.y = height;
        }




    }

    align(boids) {
        let steering = createVector();
        let perception = 50;
        let total = 0;
        for (let other of boids) {
            let d = dist(this.position.x, this.position.y, other.position.x, other.position.y);
            if (other != this && d < 100) {
                steering.add(other.velocity);
                total++;
            }
        }
        if (total > 0) {
            steering.div(total);
            steering.setMag(this.maxSpeed);
            steering.sub(this.velocity);
            steering.limit(this.maxForce);
            return steering;
        }
        return steering;
    }

    cohesion(boids) {
        let steering = createVector();
        let perception = 50;
        let total = 0;
        for (let other of boids) {
            let d = dist(this.position.x, this.position.y, other.position.x, other.position.y);
            if (other != this && d < 100) {
                steering.add(other.position);
                total++;
            }
        }
        if (total > 0) {
            steering.div(total);
            steering.sub(this.position);
            steering.setMag(this.maxSpeed);
            steering.sub(this.velocity);
            steering.limit(this.maxForce);
            return steering;
        }
        return steering;
    }

    separation(boids) {
        let steering = createVector();
        let perception = 20;
        let total = 0;
        for (let other of boids) {
            let d = dist(this.position.x, this.position.y, other.position.x, other.position.y);
            if (other != this && d < 100) {
                let diff = p5.Vector.sub(this.position, other.position);
                diff.div(d * d);
                steering.add(diff);
                total++;
            }
        }
        if (total > 0) {
            steering.div(total);
            steering.setMag(this.maxSpeed);
            steering.sub(this.velocity);
            steering.limit(this.maxForce);
            return steering;
        }
        return steering;
    }



    flock(boids) {
        this.acceleration.mult(0);
        let alignment = this.align(boids);
        let cohesion = this.cohesion(boids);
        let separation = this.separation(boids);


        alignment.mult(alignmentSlider.value());
        cohesion.mult(cohesionSlider.value());
        separation.mult(separationSlider.value());

        this.acceleration.add(alignment);
        this.acceleration.add(cohesion);
        this.acceleration.add(separation);

    }

    update() {
        this.position.add(this.velocity);
        this.velocity.add(this.acceleration);
        this.velocity.limit(this.maxSpeed);
    }

    show() {

        let w = noise((this.id + (frameCount / 1000000)) * this.width );
        w = map(w, 0, 1, 0, 60);

        let a = noise((this.id + (frameCount * 40)) * this.width );
        a= pow(a, 4)
        let alpha = map(a, 0, 1 , 0, 180);
        stroke(255, alpha);
        let numSamples = 20;
        let circular = true;
        let e = 1;
        // render many translucent points around the central one
        for (let i = 0; i < numSamples; i++) {
            if (circular === true) {

                let offset = p5.Vector.random2D();
                let radius = random(0,w);
                radius = pow(-radius, e);
                offset.x *= radius;
                offset.y *= radius;
                strokeWeight(1);
                point(this.position.x + offset.x, this.position.y + offset.y);
            } else {
                let xOffset = random(-w / 2, w / 2);
                let yOffset = random(-w / 2, w / 2);
                point(this.position.x + xOffset, this.position.y + yOffset);
            }

        }

    }


}