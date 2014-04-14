// ============================================================================
// NAME: flappy_game.js
// DESC: Flappy TARDIS
// DATE: 04/12/2014
// HOME: https://github.com/gitbrent/FlappyTARDIS
// ============================================================================

// Const
var HOLE_SIZE = 125;

// Vars
var game = new Phaser.Game(320, 500, Phaser.AUTO, 'game_div', null, false, false, null);

var score = -1;
var highScore = 0;
var scoreText;
var introText;
var menuText;

var bird;
var pipes;
var timerPipes;
var timerBkgd;
var soundJump;
var explosions;

// STEP 1: Define all the states
game.state.add('load', load_state);
game.state.add('menu', menu_state);
game.state.add('play', play_state);

// STEP 2: Start with the 'load' state
game.state.start('load');