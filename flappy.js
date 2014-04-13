// Flappy TARDIS
var game = new Phaser.Game(400, 490, Phaser.AUTO, 'game_div', { preload: preload, create: create, update: update }, false, false, null);

function preload() {
	// Load sprites/image assets
	game.load.image('bird', 'assets/bird.png');
	game.load.image('pipe', 'assets/pipe.png');
}

var score = 0;
var scoreText;
var introText;

var pipes;
var bird;
var timer;

function create() {
	// STEP 1: Set Phaser game physics type
	// (NEW-2.0) To make the sprite move we need to enable Arcade Physics
	game.physics.startSystem(Phaser.Physics.ARCADE);

	// STEP 1: Set bkgd
	game.stage.backgroundColor = '#71c5cf';

	// STEP 2: Define inputs (jump)
	var KEY_SPACEBAR = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
	KEY_SPACEBAR.onDown.add(jump, this);
	// Add touch support (tap =~ space_key)
	game.input.onDown.add(jump, this);

	// STEP 3: Define pipes group; Kick-off timer to keep creating them
	pipes = game.add.group();
	pipes.createMultiple(20, 'pipe');
	timer = game.time.events.loop(1500, add_row_of_pipes, this);

	// STEP 4-1: Define bird
	bird = game.add.sprite(100, 245, 'bird');
	// STEP 4-2: then enable the Sprite to have a physics body
	game.physics.arcade.enable(bird);
	// STEP 4-3: Set bird physics (just gravity)
	bird.body.gravity.y = 1000;
	// Re-anchor bird - we dont want the default (top-left corner) to be where rotations etc originate - that'd look dumb
	bird.anchor.setTo(-0.2, 0.5);

	// STEP 5: Clear score; show it on screen
	score = 0;
    scoreText = game.add.text(20, 20, 'Score: 0', { font: "30px Arial", fill: "#ffffff", align: "left" });
    introText = game.add.text(game.world.centerX/2, game.world.centerY-20, '- click to start -', { font:"40px Arial", fill:"#ffffff", align:"center" });
	introText.visible = false;

	// LAST: Add a row of pipes right now!
	add_row_of_pipes();
}

function update() {
	// CHECK 1: Is bird off-screen?
	if (bird.inWorld == false)
		restart_game();
	
	// CHECK 2: Has bird collided with a pipe?
	game.physics.arcade.overlap(bird, pipes, restart_game, null, this);

	// LAST: Add gravity/downward slant to bird (up to 20*)
	if (bird.angle < 20)  
	    bird.angle += 1;
}

function jump() {
	// STEP 1: Add upward velocity (eg: a 'jump')
	bird.body.velocity.y = -350;

	// STEP 2: Add animation to quickly (short of 'instant') raise birds body
	game.add.tween(bird).to({angle: -20}, 100).start();  

}

function restart_game() {
	game.time.events.remove(timer);

	introText.visible = true;
	introText.text = "Game Over";
	// Stop all animation immediately (dont let pipe keep moving offscreen, bird fall, etc.)
	pipes.setAll('body.velocity.x', 0, true, true); // http://docs.phaser.io/Phaser.Group.html#setAll

// TODO - blow up explosion anim!!! (remove bird 1st)
	bird.body.gravity.y = 0;
	bird.body.velocity.x = 0;
	bird.body.velocity.y = 0;
}

function add_one_pipe(x, y) {
	var pipe = pipes.getFirstDead();
	pipe.reset(x, y);
	game.physics.arcade.enable(pipe);
	pipe.body.velocity.x = -200;
	pipe.outOfBoundsKill = true;
}

function add_row_of_pipes() {
	var hole = Math.floor(Math.random()*5)+1;

	for (var i = 0; i < 8; i++)
		if (i != hole && i != hole +1)
			add_one_pipe(400, i*60+10);

	score += 1;
	scoreText.text = score;
}

//game.state.add('main', main_state);
//game.state.start('main');