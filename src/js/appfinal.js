/*
GAME RULES:

- The game has 2 players, playing in rounds
- In each turn, a player rolls a dice as many times as he whishes.
Each result get added to his ROUND score
- BUT, if the player rolls a 1, all his ROUND score gets lost.
After that, it's the next player's turn
- The player can choose to 'Hold', which means that his ROUND score gets added to his GLBAL score.
After that, it's the next player's turn
- The first player to reach 100 points on GLOBAL score wins the game

*/
let App = App || {};
App.util = (function () {
  function init() {
    App.scores = [0, 0];
    App.activePlayer = 0;
    App.roundScore = 0;
    App.lastDice = 0;
    App.gamePlaying = true;
    App.finalScore = '';
    App.totalScore = [0, 0];
    document.querySelector('.final-score').value = '';
    document.querySelector('.dice').style.display = 'none';
    
    document.querySelector('#total0').textContent = App.totalScore[0];
    document.querySelector('#total1').textContent = App.totalScore[1];
    document.getElementById('score-0').textContent = '0';
    document.getElementById('score-1').textContent = '0';
    document.getElementById('current-0').textContent = '0';
    document.getElementById('current-1').textContent = '0';
    document.getElementById('name-0').textContent = 'Player 1';
    document.getElementById('name-1').textContent = 'Player 2';
    document.querySelector('.player-0-panel').classList.remove('winner');
    document.querySelector('.player-1-panel').classList.remove('winner');
    document.querySelector('.player-0-panel').classList.remove('active');
    document.querySelector('.player-1-panel').classList.remove('active');
    document.querySelector('.player-0-panel').classList.add('active');
  }
  function nextPlayer() {
  // Next player
    if (App.activePlayer === 0) {
      App.activePlayer = 1;
    } else {
      App.activePlayer = 0;
    }
    // App.activePlayer === 0 ? App.activePlayer = 1 : App.activePlayer = 0;
    App.roundScore = 0;
    document.querySelector('.dice').style.display = 'none';

    document.getElementById('current-0').textContent = '0';
    document.getElementById('current-1').textContent = '0';
    
    document.querySelector('.player-0-panel').classList.toggle('active');
    document.querySelector('.player-1-panel').classList.toggle('active');
  }

  return {
    init,
    nextPlayer,
  };
}());
App.util.init();

// document.querySelector('.dice').style.display = 'none';

document.querySelector('.btn-roll').addEventListener('click', () => {
  if (App.gamePlaying) {
        // 1. Random number
    const dice = Math.floor(Math.random() * 6) + 1;

        // 2. Display the result
    const diceDOM = document.querySelector('.dice');
    diceDOM.style.display = 'block';
    diceDOM.src = `assets/img/dice-${dice}.png`;


        // 3. Update the round score IF the rolled number was NOT a 1
    if (dice === 6 && App.lastDice === 6) {
      // Player looses score
      App.scores[App.activePlayer] = 0;
      document.querySelector(`#score-${App.activePlayer}`).textContent = 0;
      App.util.nextPlayer();
    }
    else if (dice !== 1) {
            // Add score
      App.roundScore += dice;
      document.querySelector(`#current-${App.activePlayer}`).textContent = App.roundScore;
    } 
    else {
            // Next player
      App.util.nextPlayer();
    }
    App.lastDice = dice;
  }
});


document.querySelector('.btn-hold').addEventListener('click', () => {
  if (App.gamePlaying) {
        // Add CURRENT score to GLOBAL score
    App.scores[App.activePlayer] += App.roundScore;
    // Update the UI
    document.querySelector(`#score-${App.activePlayer}`).textContent = App.scores[App.activePlayer];
        // Check if player won the game
    // const input = document.querySelector('.final-score').value;
    let winningScore = 0;
    App.finalScore = document.querySelector('.final-score').value;
    // Undefined, 0, null, '' are coerced to false
    if (App.finalScore > 0) {
      winningScore = App.finalScore;
    } else {
      winningScore = 50;
    }

    if (App.scores[App.activePlayer] >= winningScore) {
      // document.querySelector(`#name-${App.activePlayer}`).textContent = 'Winner!';
      // document.querySelector('.dice').style.display = 'none';
      // document.querySelector(`.player-${App.activePlayer}-panel`).classList.add('winner');
      // document.querySelector(`.player-${App.activePlayer}-panel`).classList.remove('active');
      // document.querySelector('.final-score').value = '';
     
      App.totalScore[App.activePlayer] += 1;
      document.querySelector(`#total${App.activePlayer}`).textContent = App.totalScore[App.activePlayer];
      document.getElementById('score-0').textContent = '0';
      document.getElementById('score-1').textContent = '0';
      App.scores = [0, 0];

      if (App.totalScore[App.activePlayer] === 3) {
        document.querySelector(`#name-${App.activePlayer}`).textContent = 'Winner!';
      document.querySelector('.dice').style.display = 'none';
      document.querySelector(`.player-${App.activePlayer}-panel`).classList.add('winner');
      document.querySelector(`.player-${App.activePlayer}-panel`).classList.remove('active');
      document.querySelector('.final-score').value = '';
      App.gamePlaying = false;
      return;
      }
      App.util.nextPlayer();
    } else {
      // Next player
      App.util.nextPlayer();
    }
  }
});
document.querySelector('.btn-new').addEventListener('click', App.util.init);

/*
YOUR 3 CHALLENGES
Change the game to follow these rules:

1. A player looses his ENTIRE score when he rolls two 6 in a row.
After that, it's the next player's turn.
(Hint: Always save the previous dice roll in a separate variable)
2. Add an input field to the HTML where players can set the winning score,
 so that they can change the predefined score of 100.
 (Hint: you can read that value with the .value property in JavaScript.
This is a good oportunity to use google to figure this out :)
3. Add another dice to the game, so that there are two dices now.
The player looses his current score when one of them is a 1.
(Hint: you will need CSS to position the second dice,
so take a look at the CSS code for the first one.)
*/
