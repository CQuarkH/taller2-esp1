export class Character {
    constructor(name, playerID, health, damage, toUp, toDown, toLeft, toRight, attackKey, color, image) {
        this.toUp = toUp;
        this.toDown = toDown;
        this.toLeft = toLeft;
        this.toRight = toRight;
        this.attackKey = attackKey;
        this.name = name;
        this.playerID = playerID;
        this.health = health;
        this.maxhealth = health;
        this.damage = damage;
        this.color = color;
        this.velocity = { x: 0, y: 0 };
        this.image = image;
        this.createBox();

    }

    createBox() {
        const box = document.createElement("div");
        box.id = this.playerID;
        box.innerText = this.name;
        box.classList.add("box");
        box.style.position = "absolute";
        box.style.backgroundImage = `url(${this.image})`;
        box.style.backgroundSize = "cover";
        box.style.backgroundRepeat = "no-repeat";

        const damageOverlay = document.createElement("div");
        damageOverlay.classList.add("damage-overlay");
        box.appendChild(damageOverlay);

        document.getElementById("fightArea").appendChild(box);
    }

    isAlive() {
        return this.health > 0;
    }

    getHitbox() {
        const box = document.getElementById(this.playerID);
        return box;
    }

    flashDamageColor() {
        const box = this.getHitbox();
        const damageOverlay = box.querySelector(".damage-overlay");

        damageOverlay.style.backgroundColor = "rgba(255, 0, 0, 0.5)";

        setTimeout(() => {
            damageOverlay.style.backgroundColor = "transparent";
        }, 100);
    }

    removeBox() {
        const box = this.getHitbox();
        if (box) {
            box.remove();
        }
    }

    attack(target) {
        const hitAudio = document.getElementById(`${this.playerID}HitAudio`);

        if (!hitAudio.paused) {
            hitAudio.pause();
            hitAudio.currentTime = 0;
        }

        hitAudio.play();
        target.health -= this.damage;
    }

    updatePosition(speed) {
        const fightArea = document.getElementById("fightArea");
        const fightAreaWidth = fightArea.offsetWidth;
        const fightAreaHeight = fightArea.offsetHeight;
        const box = this.getHitbox();

        let newX = parseInt(box.style.left || 0) + this.velocity.x * speed;
        let newY = parseInt(box.style.top || 0) + this.velocity.y * speed;

        newX = Math.max(0, Math.min(fightAreaWidth - box.offsetWidth, newX));
        newY = Math.max(0, Math.min(fightAreaHeight - box.offsetHeight, newY));

        box.style.left = `${newX}px`;
        box.style.top = `${newY}px`;

        this.velocity.x = 0;
        this.velocity.y = 0;
    }

    updateVelocity(key) {
        if (key === this.toUp) this.velocity.y = -1;
        else if (key === this.toDown) this.velocity.y = 1;
        else if (key === this.toLeft) this.velocity.x = -1;
        else if (key === this.toRight) this.velocity.x = 1;
    }

    status() {
        return `${this.name} - HP ${this.health}/${this.maxhealth}`;
    }
}