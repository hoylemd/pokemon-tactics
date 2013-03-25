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
		var pokemon_manager = null;

		// classes
		var Technique = null;
		var orders = null;

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

		var enemyAI = function (poke) {
			return function(elapsed) {
				if (!poke.orders.move) {
					if (poke.position.y > 150) {
						poke.registerOrder(new orders.Move(poke, {x:800, y:100}));
					} else {
						poke.registerOrder(new orders.Move(poke, {x:800, y:500}));
					}
				}
			};
		};


		// function to initialize the game
		var initialize = function() {

			player = new pokemon_manager.Pokemon("metagross", {x: 1, y: 1}, 0);
			player.moveTo({x: 300, y: 300});
			player.setHP(150);

			player.addTechnique(new Technique({
				name: "Psybeam",
				damage: 2,
				type: "Psychic",
				recycle: 2000,
				texture: images["psybeam"],
				speed: 15,
				shots: 25,
				shot_speed: 20,
				range: 350 }));

			enemy = new pokemon_manager.Pokemon("blastoise", {x: 1, y: 1}, 0);
			enemy.moveTo({x: 800, y: 300});
			enemy.setHP(200);


			// add the enemy AI
			enemy.AI = enemyAI(enemy);

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

			// draw the background
			this.context.reset();
			this.context.drawImage(images["field"], 0, 0);

			// call the base updater (updates all components
			this.__proto__.update.call(this, elapsed);

			// draw order lines
			if (!player.fainted) {
				player.drawLines();
			}

			// draw the UI
		};

		// click handers
		var clickHandler = null;
		var rightClickHandler = null;

		// disposer
		var dispose = null;

		// get the prototype
		this.__proto__ = new ISIS.GameState();

		// content assets
		images = this.content.images;

		// set up components
		particle_manager = new ISIS.ParticleManager();
		pokemon_manager = new ISIS.PokemonManager(this.sprite_manager,
			particle_manager);
		projectile_manager =
			new ISIS.ProjectileManager(this.sprite_manager, particle_manager,
				pokemon_manager);
		this.addComponent(particle_manager);
		this.addComponent(pokemon_manager);
		this.addComponent(projectile_manager);

		// set up classes
		Technique = POKE_technique(this.sprite_manager, projectile_manager);

		// orders objects
		orders = POKE_order();

		// main click handler
		clickHandler = ( function (that) {
			return function (evt) {
				// get the mouse position
				var mousePos = that.io.getMousePos(that.canvas, evt);

				player.registerOrder(new orders.Move(player, mousePos));

				player.carryOut();
				// handle based on position
			};
		} )(this);

		// main right click handler
		rightClickHandler = ( function (that) {
			return function (evt) {
				// get the mouse position
				var mousePos = that.io.getMousePos(that.canvas, evt);

				player.registerOrder(new orders.Attack(player, mousePos));

				player.carryOut();
				// handle based on position
			};
		} )(this);

		// Add an event listener for mouse clicks
		this.canvas.addEventListener('click', clickHandler);

		this.canvas.oncontextmenu = function (evt) {
			rightClickHandler(evt);
			return false;
		};

		// define disposal function
		dispose = function () {
			projectile_manager.dispose();
			particle_manager.dispose();
			this.sprite_manager.dispose();
			unit_manager.dispose();
			this.canvas.removeEventListener('click', clickHandler);
		};

		// expose interface
		this.update = update;
		this.initialize = initialize;
		this.dispose = dispose;
	};
};
