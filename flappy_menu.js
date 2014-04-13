// NAME: flappy_menu.js
var menu_state = {

	create: function() {
		// STEP 1: Set background; Make it scroll continuously as a sprite (Note: Diff speed than game bkgd)
		background = game.add.tileSprite(0, 0, 512, 512, "background");
		var timerBkgd = game.time.events.loop(50, function(){background.tilePosition.y += 1;}, this);

		// STEP 2: Define inputs
        var space_key = this.game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
        space_key.onDown.add(this.start, this); 
		game.input.onDown.add(this.start, this);

        // STEP 3: Fidn center screen coords
        var x = game.world.width/2, y = game.world.height/2;

		// STEP 4: Title
        var titleText = game.add.text(x, y/2, "Flappy TARDIS", { font: "40px Helvetica,Verdana", fill: "#ffffff" });
        titleText.anchor.setTo(0.5, 0.5); 

        // STEP 5: Show instructions
        menuText = game.add.text(x, y+10, "Touch/Press Space", { font: "24px Arial", fill: "#ccc" });
        menuText.anchor.setTo(0.5, 0.5);

        // STEP 6: Show High Score (if any)
        if (highScore > 0) {
            // Display its score
            var score_label = this.game.add.text(x, game.world.height-50, "High Score: " + highScore, { font: "20px Helvetica,Arial", fill: "#00ff00" });
            score_label.anchor.setTo(0.5, 0.5); 
		}
	},

// TODO: Get menuText to blink
/*
	// Update function
	update: function()
	{
	    timer += game.time.elapsed; //this is in ms, not seconds.
	    if ( timer >= 1000 ) {
	        timer -= 1000;
//	        menuText.visible = !menuText.visible;

			// Check current alpha state
			if (menuText.alp // HOW??
		        s = this.game.add.tween(menuText)
		        s.to({ alpha: 1 }, 600, null)
		        s.start();
		    }
	},
*/

    // Start the actual game
    start: function() {
		// STEP 1: Define [space]
        var space_key = this.game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);

        // STEP 2: Remove key events of they carry over into GAME STATE and ruin game controls
        space_key.onDown.remove(this.start, this); 
		game.input.onDown.remove(this.start, this);

		// STEP 3: Let's PLAY!
        this.game.state.start('play');
    }

};
