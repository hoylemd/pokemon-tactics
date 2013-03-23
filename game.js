// ISIS main engine
var ISIS_Engine = function (canvas, io) {
	// state pointer
	var current_state = null;

	// content assets
	var content = {
		images : {}
	};

	// timing data
	var lastTime;

	// image manifest
	var image_manifest = {
		"metagross" : {id: "metagross", path: "376.png", loaded: false},
		"blastoise" : {id: "blastoise", path: "9.png", loaded: false},
		"bullet" : {id: "bullet", path: "bullet.png", loaded: false},
		"field" : {id: "field", path: "field.png", loaded: false}
	}

	// function to initialize the game
	this.initialize = function () {
		// initialize class library
		ISIS.Manager = ISIS_Manager();
		ISIS.SpriteManager = ISIS_SpriteManager(canvas);
		ISIS.ParticleManager = ISIS_ParticleManager();
		ISIS.ProjectileManager = ISIS_ProjectileManager();
		ISIS.GameState = ISIS_gameState(this, io, canvas, content);
		ISIS.BattleState = POKE_battleState();

		current_state = new ISIS.BattleState();
		current_state.initialize();

		var that = this;
		var mainLoop = function() {
			that.update();
			animFrame(mainLoop);
		};

		animFrame(mainLoop);
	};

	// function to update the screen
	this.update = function () {
		var now = new Date();
		var elapsed = 0;

		if (lastTime != undefined) {
			elapsed = now.getTime() - lastTime.getTime();
		}
		lastTime = now;

		// reset the window size
		clientWidth = $(window).width();
		clientHeight = $(window).height();

		// resize the canvas
		canvas.width = clientWidth;
		canvas.height = clientHeight;

		current_state.update(elapsed);
	};

	// function to transition to a new state
	this.changeState = function (new_state) {
		var old_state = current_state;
		current_state = new_state;
		new_state.initialize();
		old_state.dispose();
		delete old_state;
	};

	// function to update the manifest of loaded images
	// id: the id of the image that's finsihed loading
	var imageLoaded = ( function () {
		var that = this;
		return function(id){
			// assume done until proven otherwise
			var blnDone = true;

			// set the specified image loaded flag to true
			image_manifest[id].loaded = true;

			// look over the manifest looking for unleaded images
			for (var ent in image_manifest) {
				// set done flag to done if some are unloaded
				if (image_manifest[ent].loaded == false)
				{
					blnDone = false;
					break;
				}
			}

			// if done, initialize game.
			if (blnDone) {
				that.initialize();
			}
		};
	} )();

	// Load up all neccesary content
	for ( i in image_manifest ) {
		content.images[i] = io.loadImage(image_manifest[i], imageLoaded);
	}

	// augment the context with a reset function
	canvas.getContext("2d").reset = function () {
		this.setTransform(1, 0, 0, 1, 0, 0);
		this.globalAlpha = 1;
	};

	canvas.boundSprite = function (sprite) {
		return sprite.position.x < this.width &&
		sprite.position.x > 0 &&
		sprite.position.y < this.height &&
		sprite.position.y > 0;
	};
};
