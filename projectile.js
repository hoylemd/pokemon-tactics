// code file for projectile managers

function ISIS_ProjectileManager () {

	// function to spawn the hit text sprite
	var spawnHitText = function (that) {
		var hitText = "" + (that.hit ? that.technique.damage : "Miss");
		var sprite = new that.manager.sprite_manager.TextSprite(
			hitText, "14pt Courier", "#888888");
		sprite.centerOn(that.position);
		var destination = {x: that.position.x, y: that.position.y - 15};
		new that.manager.particle_manager.Particle(
			sprite, destination, 1500, 0, true);
	};

	// update function for missed projectules
	var updateMissed = function (that) {
		that.sprite.move(that.displacement);
		that.position = that.sprite.position;

		if (that.manager.sprite_manager.canvas.boundSprite(that)) {
			return updateMissed;
		} else {
			that.dispose();
			return null;
		}
	};

	// transition function for when the projectile collides with it's target
	var transitionCollision = function (that) {
		spawnHitText(that);
		if (that.hit) {
			console.log(that.technique.name  +" hits " + that.target.name +
				" for " + that.technique.damage + " points of damage");
			that.target.takeDamage(that.technique.damage, that.position);
			that.dispose();
			return null;
		} else {
			console.log(that.technique.name + " misses " + that.target.name);
			return updateMissed;
		}
	};

	// update function for incoming projectiles
	var updateIncoming = function (that) {
		that.sprite.move(that.displacement);
		that.position = that.sprite.position;

		if (that.target.collide(that.position)) {
			return transitionCollision(that);
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
		return function (sprite, origin, target, hit, technique) {
			// chack the args
			if (sprite && origin && target && technique) {
				// prototype it
				this.__proto__ = projectile_prototype;
				this.manager = manager;

				// set the links
				this.sprite = sprite;
				this.target = target;
				this.hit = hit ? true : false;
				this.technique = technique;
				this.owner = technique.owner;

				manager.add(this);

				// position the sprite
				sprite.centerOn(origin);
				this.position = sprite.position;
				this.distance = 3000;
				sprite.rotation = technique.owner.rotation;

				// calculate vectors
				var vector = Math.calcVector(technique.owner.position, target.position);
				this.displacement = Math.multVector(vector, technique.proj_speed);

			} else {
				// error on bad args
				console.log("projectile is missing some arguments");
			}
		};
	};

	// manager constructor
	return function (sprite_manager, particle_manager) {
		this.__proto__ = new ISIS.Manager();
		this.Projectile = projectileConstructor(this);
		this.sprite_manager = sprite_manager;
		this.particle_manager = particle_manager;
		this.object_list = [];
	}
}
