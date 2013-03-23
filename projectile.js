// code file for projectile managers

function ISIS_ProjectileManager () {

	// function to spawn the hit text sprite
	var spawnHitText = function (that) {
		var hitText = "" + that.technique.damage;
		var sprite = new that.manager.sprite_manager.TextSprite(
			hitText, "14pt Courier", "#888888");
		sprite.centerOn(that.position);
		var destination = {x: that.position.x, y: that.position.y - 15};
		new that.manager.particle_manager.Particle(
			sprite, destination, 1500, 0, true);
	};

	// transition function for when the projectile collides with it's target
	var processCollision = function (that, collider) {
		spawnHitText(that);
		collider.takeDamage(that.damage);
	};

	// update function for incoming projectiles
	var updateIncoming = function (that) {
		var i = 0;
		that.sprite.move(that.displacement);
		that.position = that.sprite.position;

		var colliders = that.manager.pokemon_manager.checkForCollisions(
			that.position, [that.owner]);

		// remove the owner from the collider list
		for (i in colliders) {
			var current = colliders[i];
			if (that.owner === current) {
				colliders.splice(i, 1);
			};
		}

		if (colliders.length > 0) {
			for (var i in colliders) {
				processCollision(that, colliders[i]);
			}
			that.dispose();
			return null;
		} else if (!that.manager.sprite_manager.canvas.boundSprite(that)) {
			that.dispose();
			return null;
		} else {
			return updateIncoming;
		}
	};

	// encapsulated prototype
	var projectile_prototype = {
		currentUpdate : updateIncoming,
		update : function (elapsed) {
			if (this.currentUpdate) {
				this.currentUpdate = this.currentUpdate(this);
			}
		},

		dispose : function () {
			if (this.manager) {
				this.manager.remove(this);
			}
			if (this.sprite) {
				this.sprite.dispose();
			}
		}
	};

	// Constructor constructor
	var projectileConstructor = function (manager) {
		return function (sprite, origin, target, technique) {
			// check the args
			if (sprite && origin && target && technique) {
				// prototype it
				this.__proto__ = projectile_prototype;
				this.manager = manager;

				// set the links
				this.sprite = sprite;
				this.target = target;
				this.technique = technique;
				this.owner = technique.owner;
				this.damage = technique.damage;

				manager.add(this);

				// position the sprite
				sprite.centerOn(origin);
				this.position = sprite.position;

				// calculate vectors
				var vector = Math.calcVector(technique.owner.position, target);
				this.displacement = Math.multVector(vector, technique.proj_speed);
				sprite.rotation = Math.calcVectorAngle(vector);

			} else {
				// error on bad args
				console.log("projectile is missing some arguments");
			}
		};
	};

	// manager constructor
	return function (sprite_manager, particle_manager, pokemon_manager) {
		this.__proto__ = new ISIS.Manager();
		this.Projectile = projectileConstructor(this);
		this.sprite_manager = sprite_manager;
		this.particle_manager = particle_manager;
		this.pokemon_manager = pokemon_manager;
		this.object_list = [];
	}
}
