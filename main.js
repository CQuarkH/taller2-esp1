class Character {
   constructor(name, playerID, health, damage, toUp, toDown, toLeft, toRight, color) {
      this.toUp = toUp;
      this.toDown = toDown;
      this.toLeft = toLeft;
      this.toRight = toRight;
      this.name = name;
      this.playerID = playerID;
      this.health = health;
      this.maxhealth = health;
      this.damage = damage;
      this.color = color;
      this.velocity = { x: 0, y: 0 };
      this.createBox();
   }

   createBox() {
      const box = document.createElement("div");
      box.id = this.playerID;
      box.innerText = this.name;
      box.classList.add("box");
      box.style.position = "absolute";
      box.style.backgroundColor = this.color;
      document.getElementById("fightArea").appendChild(box);
   }

   isAlive() {
      return this.health > 0;
   }

   getHitbox() {
      const box = document.getElementById(this.playerID);
      return box;
   }

   removeBox() {
      const box = this.getHitbox();
      if (box) {
         box.remove();
      }
   }

   attack(target) {
      console.log(`${this.name} deals ${this.damage} DMG to ${target.name}`);
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

const randomizeAttack = () => {
   const random = Math.random() * (5 - 2) + 2;
   return Math.round(random);
};

const startGame = (speed) => {
   const player1 = new Character(
      "Hero",
      "player1",
      500,
      randomizeAttack(),
      "w",
      "s",
      "a",
      "d",
      "blue"
   );

   const player2 = new Character(
      "Monster",
      "player2",
      500,
      randomizeAttack(),
      "ArrowUp",
      "ArrowDown",
      "ArrowLeft",
      "ArrowRight",
      "purple"
   );

   placePlayers(player1, player2);
   controlPlayers(player1, player2, speed);
};

const placePlayers = (player1, player2) => {
   const fightArea = document.getElementById("fightArea");
   const fightAreaWidth = fightArea.offsetWidth;
   const fightAreaHeight = fightArea.offsetHeight;
   const player1Box = player1.getHitbox();
   const player2Box = player2.getHitbox();

   player1Box.style.top = `${fightAreaHeight / 2}px`;
   player1Box.style.left = `${fightAreaWidth / 4}px`;

   player2Box.style.top = `${fightAreaHeight / 2}px`;
   player2Box.style.left = `${(fightAreaWidth / 4) * 3}px`;
};

const controlPlayers = (player1, player2, speed) => {
   document.addEventListener("keydown", (event) => {
      player1.updateVelocity(event.key);
      player2.updateVelocity(event.key);
   });

   setInterval(() => {
      movePlayers(player1, player2, speed);
      if (checkCollision(player1.getHitbox(), player2.getHitbox())) {
         handleCollision(player1, player2);
         player1.attack(player2);
         player2.attack(player1);
         updatePlayerLife(player1);
         updatePlayerLife(player2);
      }

      checkGameOver(player1, player2);
   }, 1000 / 60);
};

const updatePlayerLife = (player) => {
   const lifeBarInner = document.querySelector(`#${player.playerID}Life .life__bar-inner`);
   const percent = (player.health / player.maxhealth) * 100;
   lifeBarInner.style.width = percent > 0 ? `${percent}%` : "0%";
   lifeBarInner.style.backgroundColor = getLifeBarColor(percent);
   lifeBarInner.innerHTML = percent > 0 ? `${player.health}/${player.maxhealth}` : "DEAD";

   if (!player.isAlive()) {
      player.removeBox();
   }
};

const getLifeBarColor = (percent) => {
   if (percent > 50) {
      return "#00ff00";
   } else if (percent > 20) {
      return "#ffcc00";
   } else {
      return "#ff0000";
   }
};

const changeBoxDamageColor = (player1, player2) => {
   const box = player1.getHitbox();
   const box2 = player2.getHitbox();

   box.style.backgroundColor = "red";
   box2.style.backgroundColor = "red";

   setTimeout(() => {
      box.style.backgroundColor = player1.color;
      box2.style.backgroundColor = player2.color;
   }, 100);
};

const movePlayers = (player1, player2, speed) => {
   player1.updatePosition(speed);
   player2.updatePosition(speed);
};

const handleCollision = (player1, player2) => {
   const box1 = player1.getHitbox();
   const box2 = player2.getHitbox();

   const rect1 = box1.getBoundingClientRect();
   const rect2 = box2.getBoundingClientRect();

   const dx = (rect1.right + rect1.left) / 2 - (rect2.right + rect2.left) / 2;
   const dy = (rect1.bottom + rect1.top) / 2 - (rect2.bottom + rect2.top) / 2;

   changeBoxDamageColor(player1, player2);

   if (Math.abs(dx) > Math.abs(dy)) {
      player1.velocity.x *= -2;
      player2.velocity.x *= -2;

      if (dx > 0) {
         box1.style.left = `${parseInt(box1.style.left) + 4}px`;
         box2.style.left = `${parseInt(box2.style.left) - 4}px`;
      } else {
         box1.style.left = `${parseInt(box1.style.left) - 4}px`;
         box2.style.left = `${parseInt(box2.style.left) + 4}px`;
      }
   } else {
      player1.velocity.y *= -2;
      player2.velocity.y *= -2;

      if (dy > 0) {
         box1.style.top = `${parseInt(box1.style.top) + 4}px`;
         box2.style.top = `${parseInt(box2.style.top) - 4}px`;
      } else {
         box1.style.top = `${parseInt(box1.style.top) - 4}px`;
         box2.style.top = `${parseInt(box2.style.top) + 4}px`;
      }
   }
};

const checkCollision = (box1, box2) => {
   const rect1 = box1.getBoundingClientRect();
   const rect2 = box2.getBoundingClientRect();

   return !(
      rect1.right < rect2.left ||
      rect1.left > rect2.right ||
      rect1.bottom < rect2.top ||
      rect1.top > rect2.bottom
   );
};

const checkGameOver = (player1, player2) => {
   if (!player1.isAlive()) {
      alert(`${player2.name} ha ganado!`);
      return true;
   } else if (!player2.isAlive()) {
      alert(`${player1.name} ha ganado!`);
      return true;
   }
   return false;
};

startGame(30);
