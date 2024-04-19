class Character {
   constructor(name, health, damage) {
      this.name = name;
      this.health = health;
      this.maxhealth = health;
      this.damage = damage;
   }

   isAlive() {
      return this.health > 0;
   }

   attack(target) {
      console.log(`${this.name} deals ${this.damage} DMG to ${target.name}`);
      target.health -= this.damage;
   }

   status() {
      return `${this.name} - HP ${this.health}/${this.maxhealth}`;
   }
}

const randomizeAttack = () => {
   return 1;
};

const startGame = (speed) => {
   console.log("Start game");
   const player1 = new Character("Hero", 100, randomizeAttack());
   const player2 = new Character("Monster", 100, randomizeAttack());
   const fightArea = document.getElementById("fightArea");
   const fightAreaWidth = fightArea.offsetWidth;
   const fightAreaHeight = fightArea.offsetHeight;

   controlPlayer1(speed, fightAreaHeight, fightAreaWidth);
   controlPlayer2(speed);
};

const controlPlayer1 = (speed, height, width) => {
   let box = document.getElementById("player1");

   document.addEventListener("keydown", (event) => {
      if (box.offsetWidth + parseInt(box.style.left || 0) + 10 < width) {
         if (event.key === "w") {
            box.style.top = `${parseInt(box.style.top || 0) - speed}px`;
         } else if (event.key === "s") {
            box.style.top = `${parseInt(box.style.top || 0) + speed}px`;
         } else if (event.key === "a") {
            box.style.left = `${parseInt(box.style.left || 0) - speed}px`;
         } else if (event.key === "d") {
            box.style.left = `${parseInt(box.style.left || 0) + speed}px`;
         }
      }
   });
};

const controlPlayer2 = (speed) => {
   let box = document.getElementById("player2");

   document.addEventListener("keydown", (event) => {
      if (event.key === "ArrowUp") {
         box.style.top = `${parseInt(box.style.top || 0) - speed}px`;
      } else if (event.key === "ArrowDown") {
         box.style.top = `${parseInt(box.style.top || 0) + speed}px`;
      } else if (event.key === "ArrowLeft") {
         box.style.left = `${parseInt(box.style.left || 0) - speed}px`;
      } else if (event.key === "ArrowRight") {
         box.style.left = `${parseInt(box.style.left || 0) + speed}px`;
      }
   });
};

startGame(10);
