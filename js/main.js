import { randomizeAttack, playGameSoundtrack } from "./utils.js";
import { Character } from "./models.js";
import { placePlayers, handleStartButton } from "./logic.js";

export const initializeGame = () => {
   const speed = 30;

   const player1 = new Character(
      "J1",
      "player1",
      100,
      randomizeAttack(),
      "w",
      "s",
      "a",
      "d",
      "q",
      "blue",
      'assets/player1.png'
   );

   const player2 = new Character(
      "J2",
      "player2",
      100,
      randomizeAttack(),
      "u",
      "j",
      "h",
      "k",
      "i",
      "purple",
      'assets/player2.png'
   );

   placePlayers(player1, player2);

   handleStartButton(speed, player1, player2, initializeGame);
}

initializeGame();

