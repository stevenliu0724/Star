const canvas = document.getElementById("cvs");
const c = canvas.getContext("2d");
const stars = [];
const ministars = [];
const backgroundstars = [];


canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const backgroundGradient = c.createLinearGradient(0, 0, 0, canvas.width);
backgroundGradient.addColorStop(0, "#171e26");
backgroundGradient.addColorStop(0, "#3f586b");

const color = "white";

class Star {
    constructor(x, y, r, color) {
        this.x = x;
        this.y = y;
        this.r = r;
        this.color = color;
        this.velocity = {
            x: 0,
            y: 0.8,
        };
        this.friction = 0.8;
        this.gravity = 1;
    };

    draw() {
        //c.save();
        c.beginPath();
        c.arc(this.x, this.y, this.r, 0, Math.PI * 2, false);
        c.fill();
        c.fillStyle = this.color;
        c.shadowColor = "white";
        c.shadowBlur = 0.5;
        c.closePath();
        //c.restore();
    };

    update() {
        this.draw();

        if(this.y + this.r + this.velocity.y > canvas.height) {
            this.velocity.y = -this.velocity.y * this.friction
            this.shatter()
        } else {
            this.velocity.y += this.gravity;
        }
        this.y += this.velocity.y;
    };

    shatter() {
        this.r -=3;
        for (let i = 0; i < 8; i++) {
            ministars.push(new Ministar(this.x, this.y, 3))
        }
    }
};

class Ministar {
    constructor(x, y, r, color) {
        this.x = x;
        this.y = y;
        this.r = r;
        this.color = color;
        this.velocity = {
            x: randomXY(-5, 5),
            y: randomXY(-15, 15),
        };
        this.friction = 0.8;
        this.gravity = 0.3;
        this.ttl = 100;
        this.opacity = 1;
    };

    draw() {
        c.save();
        c.beginPath();
        c.arc(this.x, this.y, this.r, 0, Math.PI * 2, false);
        c.fill();
        c.fillStyle = `rgba(255, 255, 255, ${this.opacity})`;
        c.shadowColor = "white";
        c.shadowBlur = 20;
        c.closePath();
        c.restore();
    };

    update() {
        this.draw();

        if(this.y + this.r + this.velocity.y > canvas.height) {
            this.velocity.y = -this.velocity.y * this.friction;
        } else {
            this.velocity.y += this.gravity;
        }

        this.x += this.velocity.x;
        this.y += this.velocity.y;
        this.ttl -= 1;
        this.opacity -= 1 / this.ttl;
    };
};

function init() {

    for (let i = 0; i < 8; i++) {
        stars.push(new Star(canvas.width / 2, 30, 30, "white"))  

    for (let i = 0; i < 8; i++) {
        const x = Math.random() * canvas.width
        const y = Math.random() * canvas.height
        const r = Math.random() * 3
        backgroundstars.push(new Star(x, y, r, "white"))
    }
    };
};  
init();

function animate() {
    requestAnimationFrame(animate);
    c.fillStyle = backgroundGradient;
    c.fillRect(0, 0, canvas.width, canvas.height);
    
    backgroundstars.forEach((backgroundstar) => {
        backgroundstar.draw();
    }); 

    createMontain(1, canvas.height - 50, "#384551");
    createMontain(2, canvas.height - 100, "#283843");
    createMontain(3, canvas.height - 300, "#26333E");

    stars.forEach((star, index) => {
        star.update();
        if(star.r == 0) {
            stars.splice(index, 1);
        }
    });


    
    ministars.forEach((ministar, index) => {
        ministar.update();
        if(ministar.ttl == 0) {
            ministars.splice(index, 1);
        }
    });

};


animate();

function createMontain(mountainAmount, height, color) {
    for (let i = 0; i < mountainAmount; i++) {
        const mountainWidth = canvas.width / 3;
        c.save();
        c.beginPath();
        c.moveTo(i * mountainWidth, canvas.height);
        c.lineTo(i * mountainWidth + mountainWidth + 325, canvas.height);
        c.lineTo(i * mountainWidth + mountainWidth / 2, canvas.height - height);
        c.lineTo(i * mountainWidth - 325, c.canvas.height);
        c.fillStyle = color;
        c.fill();
        c.closePath();
        c.restore();   
    }
}

function randomXY(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min)
};