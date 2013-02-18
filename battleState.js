// battle state object
var ISIS_battleState = function (canvas, content) {
	// graphics objects
	var context = canvas.getContext("2d");

	// content assets
	var images = content.images;

	// game state
	var paused = false;

	// fleet view objects
	var fleetView = ISIS_fleetView(context);
	var playerFleetView;

	// sprite objects
	var spriteManager = ISIS_sprite_manager(canvas)();

	// I/O object
	var io = ISIS_IO();

	// Particle objects
	var particle_manager = ISIS_ParticleManager()();

	// Projectile objects
	var projectile_manager = ISIS_ProjectileManager(spriteManager,
		particle_manager)();

	// weapon objects
	var Weapon = ISIS_weapon(spriteManager, projectile_manager);

	// unit objects
	var unit = ISIS_unit(context, images, spriteManager, particle_manager);
	var player = null;
	var enemy = null;

	// orders objects
	var orders = ISIS_order();

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
		// initialize the debris libraries
		var debris_library = [images["debris1"], images["debris2"],
			images["debris3"]];

		player = unit("ArkadianCruiser", {x:1, y:1}, 0, debris_library);
		player.name = "Arkadian Cruiser";
		player.setHull(100);
		player.addWeapon(Weapon("Arkadian Railgun", 10, 25, 1500,
			images["bullet"], 25));

		enemy = unit("TerranCruiser", {x:1, y:1}, 0, debris_library);
		enemy.name = "Terran Cruiser";
		enemy.setHull(150);
		enemy.addWeapon(Weapon("Terran Mass Driver", 18, 10, 3000,
			images["bullet"], 20));

		playerFleetView = fleetView(images["spaceTile"]);
		playerFleetView.move(0, 0);
		playerFleetView.facing = 1/4 * Math.TAU;
		playerFleetView.resize(500, 600);
		playerFleetView.addShip(player);

		enemyFleetView = fleetView(images["spaceTile"]);
		enemyFleetView.move(600, 0);
		enemyFleetView.facing = 3/4 * Math.TAU;
		enemyFleetView.resize(500, 600);
		enemyFleetView.addShip(enemy);
		enemy.moveTo(850, 350);

		enemy.registerOrder(orders.attack(enemy, player));
		enemy.carryOut();
		// test text sprites
		//spriteManager.newTextSprite("test", "12px Courier",
		//	"red").centerOn({x: 150, y: 150});

		// test particle
		//var part_sprite = spriteManager.newTextSprite("wheee!",
		//	"16pt Calibri", "blue");
		//particle_manager.newParticle(part_sprite, {x: 50, y: 50},
		//	{x: 550, y: 50}, 5000);


		var mainLoop = function() {
			update();
			animFrame(mainLoop);
		};

		animFrame(mainLoop);
	};

	// function to update the manifest of loaded images
	// id: the id of the image that's finsihed loading
	var funImageLoaded = function(id){
		var newSprite = null;

		// assume done until proven otherwise
		var blnDone = true;

		// set the specified image loaded flag to true
		objImageManifest[id].loaded = true;

		// look over the manifest looking for unleaded images
		for (var ent in objImageManifest) {
			// set done flag to done if some are unloaded
			if (objImageManifest[ent].loaded == false)
			{
				blnDone = false;
				break;
			}
		}

		// if done, initialize game.
		if (blnDone) {
			funInitGame();
		}
	};

	// Load up all neccesary content
	for ( i in objImageManifest ) {
		images[i] = io.loadImage(objImageManifest[i], funImageLoaded);
	}

	// augment the context with a reset function
	context.reset = function()
	{
		this.setTransform(1, 0, 0, 1, 0, 0);
		this.globalAlpha = 1;
	};

	// function to draw the bottom orders bar
	var drawBar = function()
	{
		// set up
		context.reset();
		context.fillStyle = "#777777";

		// calculate position
		var barTop = clientHeight - barHeight;

		// draw the bar background
		context.fillRect(0, barTop, clientWidth, barHeight);

		// prepare to draw buttons
		context.reset();
		context.translate(0, barTop);
		var buttonImage;

		// draw the Attack button
		if (attackOrder)
			buttonImage = images["AttackButtonPressed"];
		else
			buttonImage = images["AttackButton"];
		context.drawImage(buttonImage, 0, 0);

		// draw the Go button
		context.translate(clientWidth - buttonWidth, 0);
		context.drawImage(images["GoButton"], 0, 0);
	};

	// function to update the screen
	var update = function()
	{
		var now = new Date();
		var elapsed = 0;

		if (lastTime != undefined) {
			elapsed = now.getTime() - lastTime.getTime();
		}
		//elapsed = 10;
		lastTime = now;

		//console.log("updating");
		// reset the window size
		clientWidth = $(window).width();
		clientHeight = $(window).height();

		// resize the canvas
		canvas.width = clientWidth;
		canvas.height = clientHeight;

		// recalculate map dimensions
		tilesX = Math.floor(clientWidth / 100);
		tilesY = Math.floor((clientHeight - barHeight) / 100);
		mapWidth = tilesX * 100;
		mapHeight = tilesY * 100;

		// Prepare for next round of drawing
		context.clearRect(0, 0, clientWidth, clientHeight);
		context.reset();

		// update units
		player.update(elapsed);
		enemy.update(elapsed);

		// update projectiles
		projectile_manager.update(elapsed);

		// update projectiles
		particle_manager.update(elapsed);

		// update sprites
		spriteManager.update(elapsed);

		// draw Fleet views
		playerFleetView.draw();
		enemyFleetView.draw();

		// draw other sprites
		spriteManager.draw();

		// draw order lines
		player.drawLines();
		//enemy.drawLines();

		// draw the UI
		drawBar();
	};

	// Add an event listener for mouse clicks
	canvas.addEventListener('click',
		function(evt)
		{
			// get the mouse position
			var mousePos = io.getMousePos(canvas, evt);

			// clip to the section of the screen
			if (mousePos.x < mapWidth && mousePos.y < mapHeight)
	   		{
				if (attackOrder)
				{
					// register an attack order if the attack order is active
					if (enemy.collide(mousePos))
					{
						player.registerOrder(orders.attack(player, enemy));
					}
					else
						player.clearOrder("attack");
				}
				attackOrder = false;
			}
			if (mousePos.y > (clientHeight - barHeight))
			{
				// click on a button
				if (mousePos.x < buttonWidth)
				{
					attackOrder = !attackOrder;
				}
				else if (mousePos.x > clientWidth - buttonWidth)
				{
					// Go button
					player.carryOut();
				}
			}
		}
	);

	return {
		update : update,
		initialize : initialize
	};

};
