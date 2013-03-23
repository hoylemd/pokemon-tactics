// Pokemon object (unmanaged)
var POKE_pokemon = function (context, content, spriteManager, particle_manager) {
	// check the params
	if (!context) {
		throw "no context given to Pokemon class constructor";
	} else if (!content) {
		throw "no content given to Pokemon class constructor";
	} else if (!spriteManager) {
		throw "no sprite manager given to Pokemon class constructor";
	} else if (!particle_manager) {
		throw "no particle manager given to Pokemon class constructor";
	}

	// tile constant
	var tileSize = 100;

	// function to snap coordinates to the grid
	var snapToGrid = function(position) {
		// calculate offset
		var xOff = position.x % tileSize;
		var yOff = position.y % tileSize;

		// return new coords
		return {
			x: position.x - xOff + (tileSize / 2),
			y: position.y - yOff + (tileSize / 2)
		};
	}

	// function for when the pokemon is destroyed
	var faint =  function (that) {
		// turn the pokemon sprite into debris
		new particle_manager.Debris(that.sprite);

		console.log("Unit " + that.name + " destroyed!");

		// destroy stuff
		that.health_bar.dispose();
		that.destroyed = true;

		// clear orders
		that.orders.attack = null;
		that.carryOut();
	};

	// prototype
	var pokemon_prototype = {
		// arbitrary movement method
		moveTo : function (position) {
			var bar_y = 0;

			this.position = position;

			// move the sprites
			this.sprite.centerOn(this.position);
			bar_y = (this.position.y + 0.5 * this.sprite.frameDims.y) - 15;
			this.health_bar.centerOn({x: this.position.x, y: bar_y });
		},

		move : function (displacement) {
			var newPos = {x: this.position.x + displacement.x,
				y: this.position.y + displacement.y};
			this.moveTo(newPos);
		},

		// arbtrary rotation function
		rotateTo: function(rads) {
			this.sprite.rotateTo(rads);
		},

		// order line drawing method
		drawLines: function() {
			// calculate tile offset
			var tileOffset = tileSize / 2;
			var index = 0;
			var order = null;

			// draw the order lines if they exist
			for (index in this.orders) {
				order = this.orders[index];
				context.reset();

				// set up line drawing
				context.beginPath();
				context.lineWidth = 1;
				context.strokeStyle = order.colour;

				context.moveTo(this.position.x ,this.position.y);
				context.lineTo(order.position.x, order.position.y);
				context.stroke();
			}
		},


		// technique registration
		addTechnique : function (technique) {
			if (technique) {
				this.technique = technique;
				technique.install(this);
			} else {
				console.log("Cannot add a null technique");
			}
		},

		// HP manipulation
		setHP : function (HP) {
			this.HPMax = HP;
			this.HPCurrent = HP;
		},

		// order registration
		registerOrder : function (order) {
			order.x = order.target.x;
			order.y = order.target.y;
			order.owner = this;
			this.orders[order.name] = order;
		},

		// carry out orders function
		carryOut : function () {
			var attack = this.orders.attack;

			// attack order
			if (this.technique) {
				if (attack) {
					if (attack.pending) {
						if (this.technique) {
							this.technique.setTarget(attack.target);
							attack.pending = false;
						} else {
							console.log(this.name +
								" has no technique! It cannot attack!");
							this.orders.attack = null;
						}
					}
				} else {
					this.technique.setTarget(null);
				}
				}
		},

		// damage pokemon
		takeDamage : function (amount, position) {
			this.HPCurrent -= amount;

			// check if the pokemon is fainted
			if (this.HPCurrent <= 0) {
				faint(this);
			}
		},

		// function to get a pokemons dodge roll
		dodgeRoll : function () {
			return Math.dx(this.dodgeBonus);
		},

		// point collision function
		collide : function(point) {
			var distance = Math.abs(Math.calculateDistancePoints(this.position, point));

			return distance <= 35;

		},

		// order cancelling function
		clearOrder : function(key) {
			delete this.orders[key];
		},

		// update function
		update : function (elapsed_ms) {
			// update children
			if (this.technique) {
				this.technique.update(elapsed_ms);
			}
			this.health_bar.value = this.HPCurrent / this.HPMax;

			// check if attack order is still valid
			if (this.orders.attack) {
				if (this.orders.attack.target.destroyed) {
					delete this.orders.attack;
				}
			}

			// move order
			if (this.orders.move) {
				// shorthand some stuff
				var order = this.orders.move;
				var distance = Math.calculateDistancePoints(this.position, order.target);

				// execute the movement
				if (this.position === orders.target) {
					delete this.orders.move;
				} else if (distance < this.speed) {
					this.moveTo(order.target);
					delete this.orders.move;
				} else {
					this.move(Math.multVector(order.vector, this.speed));
				}
			}

			// update positioning
			this.position = this.sprite.center();
			this.rotation = this.sprite.rotation;
		},

		// function to register the fleetView
		registerView : function (fleetView) {
			this.fleetView = fleetView;
		},

		// destructor
		dispose : function () {
			// clean up sprites
			this.health_bar.dispose();
			delete this.health_bar;
			this.sprite.dispose();
			delete this.sprite;
		}
	}

	// constructor
	return function(texture, mapDims, msBetweenFrames) {
		// prepare sprites
		var sprite = new spriteManager.Sprite(
			(content[texture]), mapDims, msBetweenFrames);
		var health_bar_dims = {x: sprite.frameDims.x * 0.8, y: 10};
		var health_bar = new spriteManager.BarSprite(health_bar_dims,
			"green", "red", "yellow", 0.2);

		// build the object
		this.__proto__ = pokemon_prototype;

		// sprites
		this.sprite= sprite;
		this.health_bar = health_bar;

		// general stuff
		this.name= "Unnamed Unit";
		this.position = sprite.position;
		this.rotation = sprite.rotation;
		this.fleetView = null;

		// combat stats
		this.orders = {};
		this.HPMax = 5;
		this.HPCurrent = 5;
		this.speed = 10;
		this.dodgeBonus = 10;
		this.technique = null;
		this.destroyed = false

	}
}
