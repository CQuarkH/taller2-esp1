import {
   getLifeBarColor,
   stopGameSoundtrack,
   playGameSoundtrack,
   playGameOverSound,
} from "./utils.js";

let gameOver = false;
let gameInterval;
let gamePaused = false;

export const handleStartButton = (speed, player1, player2, restartCallback) => {
   const startButton = document.getElementById("startButton");
   const overlay = document.getElementById("overlay");

   startButton.addEventListener("click", () => {
      if (gameOver) {
         window.location.reload();
      } else {
         if (!gamePaused) {
            startGameLoop(speed, player1, player2);
            controlPlayers(player1, player2);
            playGameSoundtrack();
            updateStartButtonText("Pause Game");
            overlay.style.display = "none";
         } else {
            pauseGameLoop();
            stopGameSoundtrack();
            updateStartButtonText("Resume Game");
            overlay.style.display = "block";
         }
         gamePaused = !gamePaused;
      }
   });
};

export const startGameLoop = (speed, player1, player2) => {
   gameInterval = setInterval(() => {
      movePlayers(player1, player2, speed);
      if (checkCollision(player1.getHitbox(), player2.getHitbox())) {
         handleCollision(player1, player2);
      }
      if (checkGameOver(player1, player2)) {
         clearInterval(gameInterval);
      }
   }, 1000 / 60);
};

export const pauseGameLoop = () => {
   clearInterval(gameInterval);
};

export const controlPlayers = (player1, player2) => {
   updatePlayerLife(player1);
   updatePlayerLife(player2);

   document.addEventListener("keydown", (event) => {
      player1.updateVelocity(event.key);
      player2.updateVelocity(event.key);

      if (
         event.key === player1.attackKey &&
         checkCollision(player1.getHitbox(), player2.getHitbox())
      ) {
         player1.attack(player2);
         player2.flashDamageColor();
         updatePlayerLife(player2);
      }

      if (
         event.key === player2.attackKey &&
         checkCollision(player1.getHitbox(), player2.getHitbox())
      ) {
         player2.attack(player1);
         player1.flashDamageColor();
         updatePlayerLife(player1);
      }
   });
};

export const placePlayers = (player1, player2) => {
   const fightArea = document.getElementById("fightArea");
   const fightAreaWidth = fightArea.offsetWidth;
   const fightAreaHeight = fightArea.offsetHeight;
   const player1Box = player1.getHitbox();
   const player2Box = player2.getHitbox();

   player1Box.style.top = `${fightAreaHeight / 2}px`;
   player1Box.style.left = `${fightAreaWidth / 6}px`;

   player2Box.style.top = `${fightAreaHeight / 2}px`;
   player2Box.style.left = `${(fightAreaWidth / 4) * 3}px`;
};

export const updatePlayerStats = (player) => {
   const playerStats = document.querySelector(`#${player.playerID}Stats`);
   playerStats.innerHTML = `<span>${player.name} - ${player.health}/${player.maxhealth}</span>
   <span>Daño: ${player.damage}</span>
   `;
};

export const updatePlayerLife = (player) => {
   updatePlayerStats(player);
   const lifeBarInner = document.querySelector(`#${player.playerID}Life .life__bar-inner`);
   const percent = (player.health / player.maxhealth) * 100;
   lifeBarInner.style.width = percent > 0 ? `${percent}%` : "0%";
   lifeBarInner.style.backgroundColor = getLifeBarColor(percent);
   //lifeBarInner.innerHTML = percent > 0 ? `${player.health}/${player.maxhealth}` : "";

   if (!player.isAlive()) {
      player.removeBox();
   }
};

export const handleCollision = (player1, player2) => {
   const box1 = player1.getHitbox();
   const box2 = player2.getHitbox();

   const rect1 = box1.getBoundingClientRect();
   const rect2 = box2.getBoundingClientRect();

   const dx = (rect1.right + rect1.left) / 2 - (rect2.right + rect2.left) / 2;
   const dy = (rect1.bottom + rect1.top) / 2 - (rect2.bottom + rect2.top) / 2;

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

const movePlayers = (player1, player2, speed) => {
   if (player1.isAlive()) {
      player1.updatePosition(speed);
   }
   if (player2.isAlive()) {
      player2.updatePosition(speed);
   }
};

const checkCollision = (box1, box2) => {
   if (!box1 || !box2) return false;
   const rect1 = box1.getBoundingClientRect();
   const rect2 = box2.getBoundingClientRect();

   return !(
      rect1.right < rect2.left ||
      rect1.left > rect2.right ||
      rect1.bottom < rect2.top ||
      rect1.top > rect2.bottom
   );
};

const updateStartButtonText = (text) => {
   document.getElementById("startButton").textContent = text;
};

const checkGameOver = (player1, player2, onGameFinish) => {
   if (!player1.isAlive()) {
      handleGameWinner(player2);
      return true;
   } else if (!player2.isAlive()) {
      handleGameWinner(player1);
      return true;
   }
   return false;
};

const handleGameWinner = (player) => {
   stopGameSoundtrack();
   playGameOverSound();
   alert(`${player.name} ha ganado!`);
   updateStartButtonText("Restart Game");
   gameOver = true;
};
