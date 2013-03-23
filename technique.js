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
		new projectile_manager.Projectile(sprite, that.target, that);
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

				if (this.firing) {
					if (this.current_charge > this.shot_speed) {
						fire(this);
						this.shots_to_go -= 1;
						if (this.shots_to_go == 0) {
							this.firing = false;
						}
						this.current_charge = 0;
					}
				} else {
					// fire if charged
					if (this.current_charge > this.recycle) {
						this.firing = true;
						this.shots_to_go = this.shots;
						this.current_charge = 0;
					}

					// untarget if target is destroyed
					if (this.target.destroyed) {
						this.target = null;
					}
				}
			}
		}
	};

	// constructor
	//name, damage, type, recycle, projectile texture, projectile speed, range
	return function (params) {
		if (params) {
			// set the prototype
			this.__proto__ = technique_prototype;

			// set initialize the instance members
			this.name = params.name;

			this.damage = params.damage;
			this.type = params.type;
			this.recycle = params.recycle;
			this.current_charge = 0;

			this.proj_texture = params.texture;
			this.proj_speed = params.speed;
			this.shots = params.shots;
			this.shot_speed = params.shot_speed;
			this.range = params.range;
			this.firing = false;

			this.owner = null;

		} else {
			// log errors
			throw "attempt to instantiate Technique without params";
			this = null;
		}
	}

}
