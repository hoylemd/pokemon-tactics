// battle state object
var ISIS_battleState = function () {
	return function () {
		var images = null;

		// game state
		var paused = false;

		// pokemon
		var player = null;
		var enemy = null;

		// components
		var particle_manager = null;
		var projectile_manager = null;

		// classes
		var Pokemon = null;

		// Bar data
		var buttonWidth = 150;
		var barHeight = 50;

		// Orders data
		var attackOrder = false;

		// Map data
		var tilesX;
		var tilesY;
		var mapWidth;
		var mapHeight;
		var clientWidth;
		var clientHeight;

		// function to initialize the game
		var initialize = function() {
			// call base initializer
			this.__proto__.initialize.call(this);
		};

		var drawBackground = function (context) {
			return function () {
			};
		}(this.context);

		// function to update the state
		var update = function (elapsed) {

			// reset the window size
			clientWidth = $(window).width();
			clientHeight = $(window).height();

			// Prepare for next round of drawing
			this.context.clearRect(0, 0, clientWidth, clientHeight);
			this.context.reset();

			// initialize if needed
			if (!this.initialized) {
				this.initialize();
			}

			// check for state changes


			// call the base updater (updates all components
			this.__proto__.update.call(this, elapsed);

			// draw the UI
			this.context.drawImage(images["field"], 0, 0);
		};

		// click handers
		var clickHander = null;

		// disposer
		var dispose = null;

		// get the prototype
		this.__proto__ = new ISIS.GameState();

		// content assets
		images = this.content.images;

		// set up components
		particle_manager = new ISIS.ParticleManager();
		projectile_manager =
			new ISIS.ProjectileManager(this.sprite_manager, particle_manager);
		this.addComponent(particle_manager);
		this.addComponent(projectile_manager);

		// main click handler
		clickHandler = ( function (that) {
			return function (evt) {
				// get the mouse position
				var mousePos = that.io.getMousePos(that.canvas, evt);

				// handle based on position
			};
		} )(this);


		// Add an event listener for mouse clicks
		this.canvas.addEventListener('click', clickHandler);

		// define disposal function
		dispose = function () {
			projectile_manager.dispose();
			particle_manager.dispose();
			this.sprite_manager.dispose();
			this.canvas.removeEventListener('click', clickHandler);
		};

		// expose interface
		this.update = update;
		this.initialize = initialize;
		this.dispose = dispose;
	};
};
