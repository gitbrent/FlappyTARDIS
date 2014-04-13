// NAME: flappy_play.js
var play_state = {

	create: function() {
		// STEP 1: Set Phaser game physics type
		// (NEW-2.0) To make the sprite move we need to enable Arcade Physics
		game.physics.startSystem(Phaser.Physics.ARCADE);

		// STEP 2: Define inputs (jump)
		var KEY_SPACEBAR = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
		KEY_SPACEBAR.onDown.add(this.jump, this);
		// Add touch support (tap =~ space_key)
		game.input.onDown.add(this.jump, this);

		// STEP 3: Set background; Make it scroll continuously as a sprite (1px every 1/10 sec)
		background = game.add.tileSprite(0, 0, 512, 512, "bkgd");
		timerBkgd = game.time.events.loop(100, function(){background.tilePosition.x -= 1;}, this);

		// STEP 4: Define pipes group; Kick-off timer to keep creating them
		pipesUp = game.add.group();
		pipesUp.createMultiple(3, 'pipeUp');
		pipesDn = game.add.group();
		pipesDn.createMultiple(3, 'pipeDn');
		timerPipes = game.time.events.loop(1500, this.add_row_of_pipes, this);

		// STEP 5-1: Define bird
		bird = game.add.sprite(100, 245, 'bird');
		// STEP 5-2: then enable the Sprite to have a physics body
		game.physics.arcade.enable(bird);
		// STEP 5-3: Set bird physics (just gravity)
		bird.body.gravity.y = 1000;
		// STEP 5-4: Re-anchor bird - we dont want the default (top-left corner) to be where rotations etc originate - that'd look dumb
		// Set it to: out into space a little bit (-0.2), halfway down left edge (0.5)
		bird.anchor.setTo(-0.2, 0.5);
	
		// STEP 6: Add a Jump sound
		soundJump = game.add.audio('jump');
		soundExplode = game.add.audio('explode');
	
		// STEP 7: Clear score; show it on screen
		score = -1;
		scoreText = game.add.text(20, 20, 'Score: 0', { font:"28px Arial", fill:"#f9f9f9", align:"left" });
		overText = game.add.text(game.world.width/2, (game.world.height/2)-50, ' ');
		overText.anchor.set(0.5);
		overText.align = 'center';
		// Font
		overText.font = 'Helvetica';
		overText.fontSize = 60;
		//	Stroke color and thickness
		overText.stroke = '#003399';
		overText.strokeThickness = 5;
		overText.fill = '#ffffff';
		overText.Z = 99;
		// Hide for now
		overText.visible = false;

		// STEP 8: Create explosion sprite
		explosions = game.add.group();
		var explosionAnimation = explosions.create(0, 0, 'kaboom', [0], false);
		explosionAnimation.anchor.setTo(0.5, 0.5);
		explosionAnimation.animations.add('kaboom');

		// STEP 9: Add emitter to perform 'burst' effect
	    emitter = game.add.emitter(0, 0, 100);
	    emitter.makeParticles('dalek');
	    emitter.gravity = 200;

		// LAST: Add a row of pipes right now!
		this.add_row_of_pipes();
	},

    update: function() { 
		// CHECK 1: Is bird off-screen?
		if (bird.inWorld == false)
			this.game_over();
		
		// CHECK 2: Has bird collided with a pipe?
		game.physics.arcade.overlap(bird, pipesUp, this.hit_pipe, null, this);
		game.physics.arcade.overlap(bird, pipesDn, this.hit_pipe, null, this);
	
		// LAST: Add gravity/downward slant to bird (up to 20*)
		if (bird.angle < 20)
		    bird.angle += 1;
	},

	jump: function() { 
		// FIRST: Is bird alive?
		if (bird.alive == false)  
			return;

		// STEP 1: Add upward velocity (eg: a 'jump')
		bird.body.velocity.y = -350;

		// STEP 2: Add animation to quickly (short of 'instant') raise birds body
		game.add.tween(bird).to({angle: -20}, 100).start();  

		// STEP 3: Jump sound
		soundJump.play();
	},
	
	hit_pipe: function() { 
		// =======
		// FIRST: If the bird has already hit a pipe, we have nothing to do
		// =======
		if (bird.alive == false)
			return;
		else
			bird.alive = false;
	
		// =======
		// STEP 1: 'Explode' bird
		// =======
		// A: sound effect
		soundExplode.play();
		// B: Hide
		bird.visible = false;
		// C: Show explosion animation
		var explosionAnimation = explosions.getFirstExists(false);
		explosionAnimation.reset( (bird.x + (bird.width/2)), (bird.y + (bird.height/2)) );
		explosionAnimation.play('kaboom', 30, false, true);

		// D: Stop pipe movement & spawning
		game.time.events.remove(timerPipes);
		pipesUp.setAll('body.velocity.x', 0, true, true);
		pipesDn.setAll('body.velocity.x', 0, true, true);

		// D: Show 'burst' effect
		//  The first parameter sets the effect to "explode" which means all particles are emitted at once
		//  The second gives each particle a 2000ms lifespan
		//  The third is ignored when using burst/explode mode
		//  The final parameter (10) is how many particles will be emitted in this single burst
		emitter.x = bird.x;
		emitter.y = bird.y;
		emitter.start(true, 2000, null, 10);

		// =====
		// LAST: Show game over (Wait 2.5 secs so burst animation will complete)
		// =====
	    game.time.events.add(Phaser.Timer.SECOND * 2.5, function(){ this.game_over(); }, this);
	},

	game_over: function() { 
		// STEP 1: Show "Game Over"
//		game.debug.text("Game Over: " + game.time.events.duration, 32, 32);
		overText.visible = true;
		overText.text = "Game Over";

		// STEP 2: Stop events
		game.time.events.remove(timerPipes);
		game.time.events.remove(timerBkgd);
	
		// STEP 3: Stop all pipes animations immediately (dont let pipe keep moving offscreen, bird fall, etc.)
		pipesUp.setAll('body.velocity.x', 0, true, true);
		pipesDn.setAll('body.velocity.x', 0, true, true);

		// STEP 4: Stop bird movement
		bird.body.gravity.y = 0;
		bird.body.velocity.x = 0;
		bird.body.velocity.y = 0;

		// STEP 5: Set High Score
		if (score > highScore)
			highScore = score;

		// STEP 6: Return to Menu State (Wait 1.5 sec so user can read game over, digest failure, etc. :-)
	    game.time.events.add(Phaser.Timer.SECOND * 1.5, function(){ game.state.start('load'); }, this);
	},

	add_row_of_pipes: function() {
		// STEP 1: Pick location of hole. Values: 0 to (floor-hole_size)
		// Use of 30px diff on either side so we always show at least pipe lip on one side
		var holeY = Math.floor(Math.random() * (game.height-HOLE_SIZE-30)) + 1;
		if (holeY < 30) holeY += 30;

		// STEP 2: Calc/Show down pipe
		var tmpPipeDn = pipesDn.getFirstDead();
		tmpPipeDn.reset(game.width, holeY-tmpPipeDn.height);
		game.physics.arcade.enable(tmpPipeDn);
		tmpPipeDn.body.velocity.x = -200;
		// IMP: These 2 are co-req
		tmpPipeDn.checkWorldBounds = true;
		tmpPipeDn.outOfBoundsKill = true;

		// STEP 3: Calc/Show up pipe
		var tmpPipeUp = pipesUp.getFirstDead();
		tmpPipeUp.reset(game.width, holeY + HOLE_SIZE);
		game.physics.arcade.enable(tmpPipeUp);
		tmpPipeUp.body.velocity.x = -200;
		// IMP: These 2 are co-req
		tmpPipeUp.checkWorldBounds = true;
		tmpPipeUp.outOfBoundsKill = true;

		// STEP 4: Increment/Show score
		score += 1;
		scoreText.text = score;
	}

};