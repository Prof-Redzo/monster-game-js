//Global constants
const ATTACK_VALUE = 10;
const STRONG_ATTACK_VALUE = 17;
const MONSTER_ATTACK_VALUE = 15;
const HEAL_VALUE = 20;

let varijabla = 3;

//Codebook
const MODE_ATTACK = "ATTACK"; //const MODE_ATTACK = 0
const MODE_STRONG_ATTACK = "STRONG_ATTACK"; //const MODE_STRONG_ATTACK = 1

const LOG_EVENT_ATTACK = "PLAYER_ATTACK";
const LOG_EVENT_STRONG_ATTACK = "PLAYER_STRONG_ATTACK";
const LOG_EVENT_MONSTER_ATTACK = "MONSTER_ATTACK";
const LOG_EVENT_HEAL = "PLAYER_HEAL";
const LOG_EVENT_GAME_OVER = "GAME_OVER";
const LOG_EVENT_ERROR = "ERROR";

//User input processing
const userEnteredValue = parseInt(
  prompt("Enter the maximum life for you and the monster", "100")
);
const chosenMaxLife = processUserInput(userEnteredValue);

// Global variables
let currentMonsterHealth = chosenMaxLife;
let currentPlayerHealth = chosenMaxLife;
let hasBonusLife = true;
let battleLog = [];
//App intialization fuctions
adjustHealthBars(chosenMaxLife);

//Button listeners
attackBtn.addEventListener("click", attackHandler);
strongAttackBtn.addEventListener("click", strongAttackHandler);
healBtn.addEventListener("click", healPlayerHandler);
logBtn.addEventListener("click", printLogHandler);

//Helper functions
function processUserInput(value) {

  //ako aplikacija radi s negativnim healthom
  // return value || 100;

  if (isNaN(value) || value <= 0) {
    console.log("User entered an invalid value, we defaluted to 100");
    return 100;
  }

  return value;
  //u slucaju da je korinik unio nevalidnu vrijednost vratiti 100
  //u suprotnom vratiti ono sto je korisnik unio
}

function writeToLog(ev, val) {
  let logEntry = {
    event : null,
    target: null,
    value: val,
    playerHealth : currentPlayerHealth,
    monsterHealth : currentMonsterHealth
  };



  switch(ev)
  {
    case LOG_EVENT_ATTACK : 
      logEntry.event = LOG_EVENT_ATTACK;
      logEntry.target = "MONSTER";
      break;
    case LOG_EVENT_STRONG_ATTACK :
      logEntry.event = LOG_EVENT_STRONG_ATTACK;
      logEntry.target = "MONSTER";
      break;
    case LOG_EVENT_MONSTER_ATTACK :
      logEntry.event = LOG_EVENT_MONSTER_ATTACK;
      logEntry.target = "PLAYER";
      break;
    case LOG_EVENT_HEAL:
      logEntry.event = LOG_EVENT_HEAL;
      logEntry.target = "PLAYER";
      break;
    case LOG_EVENT_GAME_OVER: 
      logEntry.event = LOG_EVENT_GAME_OVER;
      break;
    case LOG_EVENT_ERROR :
      logEntry.event= LOG_EVENT_ERROR;
      break;
    default : 
    logEntry.event = LOG_EVENT_ERROR;
    logEntry.value = "Wrong parameter for writeToLog function!";
  }

  // if (ev === LOG_EVENT_ATTACK) {
  //   logEntry.event = LOG_EVENT_ATTACK;
  //   logEntry.target = "MONSTER";
  // } 
  // else if (ev === LOG_EVENT_STRONG_ATTACK) {
  //   logEntry.event = LOG_EVENT_STRONG_ATTACK;
  //   logEntry.target = "MONSTER";
  // }
  // else if (ev === LOG_EVENT_MONSTER_ATTACK)
  // {
  //     logEntry.event = LOG_EVENT_MONSTER_ATTACK;
  //     logEntry.target = "PLAYER";
  // }
  // else if (ev === LOG_EVENT_GAME_OVER)
  // {
  //   logEntry.event = LOG_EVENT_GAME_OVER;
  // }
  // else if (ev === LOG_EVENT_HEAL)
  // {
  //     logEntry.event = LOG_EVENT_HEAL;
  //     logEntry.target = "PLAYER";
  // }
  // else if(ev === LOG_EVENT_ERROR)
  // {
  //   logEntry.event= LOG_EVENT_ERROR;
  // }
  // else{
  //   logEntry.event = LOG_EVENT_ERROR;
  //   logEntry.value = "Wrong parameter for writeToLog function!";
  // }

  battleLog.push(logEntry);
}

function attackMonster(mode) {
  const errorMessage = "Wrong attackMonster function parameters!"
  let maxDamage = (mode === MODE_ATTACK) ? ATTACK_VALUE : STRONG_ATTACK_VALUE;
  let logMode = (mode === MODE_ATTACK) ? LOG_EVENT_ATTACK : (mode === MODE_STRONG_ATTACK) ? LOG_EVENT_STRONG_ATTACK : LOG_EVENT_ERROR;
  
  // if (mode === MODE_ATTACK) {
  //   maxDamage = ATTACK_VALUE;
  //   logMode = LOG_EVENT_ATTACK;
  // } else if (mode === MODE_STRONG_ATTACK) {
  //   maxDamage = STRONG_ATTACK_VALUE;
  //   logMode = LOG_EVENT_STRONG_ATTACK;
  // } 
  
  if (mode !== MODE_ATTACK && mode != MODE_STRONG_ATTACK){
    console.log(errorMessage);
    writeToLog(logMode, errorMessage);
    return;
  }
  const damageDealt = dealMonsterDamage(maxDamage);
  currentMonsterHealth -= damageDealt;
  writeToLog(logMode, damageDealt);
  endRound();
}

function endRound() {
  const initialPlayerHealth = currentPlayerHealth;
  const monsterDamageDealt = dealPlayerDamage(MONSTER_ATTACK_VALUE);
  currentPlayerHealth -= monsterDamageDealt;
  
  writeToLog(LOG_EVENT_MONSTER_ATTACK, monsterDamageDealt);

  if (currentPlayerHealth <= 0 && hasBonusLife) {
    hasBonusLife = false;
    removeBonusLife();
    currentPlayerHealth = initialPlayerHealth;
    setPlayerHealth(currentPlayerHealth);
    alert("You used your bonus life!!");
  }

  if (currentMonsterHealth <= 0 && currentPlayerHealth > 0) {
    alert("You won!");
    writeToLog(LOG_EVENT_GAME_OVER, "Player has won!");
  } else if (currentPlayerHealth <= 0 && currentMonsterHealth > 0) {
    alert("You lost!");
    writeToLog(LOG_EVENT_GAME_OVER, "Monster has won!");
  } else if (currentPlayerHealth < 0 && currentMonsterHealth <= 0) {
    writeToLog(LOG_EVENT_GAME_OVER, "It's a draw!");
    alert("DRAW!");
  }

  if (currentPlayerHealth <= 0 || currentMonsterHealth <= 0) {
    reset();
  }
}

function reset() {
  resetGame(chosenMaxLife);
  currentMonsterHealth = chosenMaxLife;
  currentPlayerHealth = chosenMaxLife;
}

//Listener functions
function attackHandler() {
  attackMonster(MODE_ATTACK);
}

function strongAttackHandler() {
  attackMonster(MODE_STRONG_ATTACK);
}

function healPlayerHandler() {
  let healValue;
  // if(currentPlayerHealth >= chosenMaxLife - HEAL_VALUE)
  if (currentPlayerHealth + HEAL_VALUE > chosenMaxLife) {
    healValue = chosenMaxLife - currentPlayerHealth;
  } else {
    healValue = HEAL_VALUE;
  }

  increasePlayerHealth(healValue);
  currentPlayerHealth += healValue;
  
  writeToLog(LOG_EVENT_HEAL, healValue);

  endRound();
}

function printLogHandler() {
  console.log(battleLog);
}
