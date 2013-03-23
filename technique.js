// Technique object
var POKE_technique = function (spriteManager, projectile_manager) {
	// firing function
	var fire = function (that) {
		var roll = 0;
		var dodge = 0;
		var hit = 0;
		var sprite = null;
		var fire_point = null;
		var texture = that.proj_texture;

		// make projectile
		sprite = new spriteManager.Sprite(texture, {x: 1, y: 1}, 0);
		fire_point = {x: that.owner.position.x, y: that.owner.position.y};
		new projectile_manager.Projectile(
			sprite, fire_point, that.target, that);
	};

	// prototype
	var technique_prototype = {
		// targetting method
		setTarget : function (target) {
			this.target = target;
		},

		// installation method
		install : function (owner) {
			this.owner = owner;
		},

		// update method
		update : function (elapsed_ms) {
			if (this.target) {
				// increase charge
				this.current_charge += elapsed_ms;

				// fire if charged
				if (this.current_charge > this.recycle) {
					fire(this);
					this.current_charge = 0;
				}

				// untarget if target is destroyed
				if (this.target.destroyed) {
					this.target = null;
				}
			}
		}
	};

	// constructor
	return function (name, damage, hit_bonus, recycle, proj_texture, speed) {
		if (proj_texture) {
			// set the prototype
			this.__proto__ = technique_prototype;

			// set initialize the instance members
			this.name = name;

			this.damage = damage;
			this.hit_bonus = hit_bonus;
			this.recycle = recycle;
			this.current_charge = 0;

			this.proj_texture = proj_texture;
			this.proj_speed = speed;

			this.owner = null;
			this.projectile = null;

		} else {
			// log errors
			console.log(
				"Technique cannot be instantiated without a projectile texture");
			this = null;
		}
	}

}
