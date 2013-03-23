// battle state object
var POKE_battleState = function () {
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
		var Technique = null;
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

			player = new Pokemon("metagross", {x: 1, y: 1}, 0);
			player.moveTo({x: 300, y: 300});
			player.setHP(150);


			player.addTechnique(new Technique("Psybeam", 50, 100, 1500,
				images["bullet"], 15));

			enemy = new Pokemon("blastoise", {x: 1, y: 1}, 0);
			enemy.moveTo({x: 800, y: 300});
			enemy.setHP(200);

			// call base initializer
			this.__proto__.initialize.call(this);
		};

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

			// update players
			player.update(elapsed);
			enemy.update(elapsed);

			// draw the background
			this.context.reset();
			this.context.drawImage(images["field"], 0, 0);

			// call the base updater (updates all components
			this.__proto__.update.call(this, elapsed);

			// draw the UI
			player.drawLines();
		};

		// click handers
		var clickHandler = null;

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

		// set up classes
		Technique = POKE_technique(this.sprite_manager,
			projectile_manager);
		Pokemon = POKE_pokemon(this.context,
			images,
			this.sprite_manager,
			particle_manager);
		// orders objects
		orders = POKE_order();

		// main click handler
		clickHandler = ( function (that) {
			return function (evt) {
				// get the mouse position
				var mousePos = that.io.getMousePos(that.canvas, evt);

				console.log("player collide: " + player.collide(mousePos));
				console.log("enemy collide: " + enemy.collide(mousePos));

				if (enemy.collide(mousePos)) {
					player.registerOrder(new orders.Attack(player, enemy));
				} else {
					player.registerOrder(new orders.Move(player, mousePos));
				}

				player.carryOut();
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
