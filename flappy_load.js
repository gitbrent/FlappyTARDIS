// NAME: flappy_load.js
var load_state = {

    preload: function() {
		// IMAGE
		game.load.image('bird', 'assets/tardis.png');
		game.load.image('dalek', 'assets/dalek.png');
		game.load.image('pipe', 'assets/pipe.png');
		game.load.image('pipeUp', 'assets/pipeUp.png');
		game.load.image('pipeDn', 'assets/pipeDn.png');
	
		// SPRITE
		game.load.spritesheet('kaboom', 'assets/explosion.png', 64, 64, 23); // WxH, #of frames

		// BKGD
		game.load.image('background', 'assets/starfield.jpg');
		game.load.image('bkgd', 'assets/bkgd512.png');
	
		// AUDIO
		game.load.audio('explode', 'assets/explosion_bomb.wav');
		game.load.audio('jump', 'assets/jump.wav');
	},

    create: function() {
        // When all assets are loaded, go to the 'menu' state
        game.state.start('menu');
    }
    
};