// code file for particle managers

function ISIS_ParticleManager (Particle) {
	var particleManager_prototype = {
		addParticle : function(part, id) {
			var newId = this.numParticles;

			if(part && this.particleList) {
				this.particleList[newId] = part;
				this.numParticles += 1;
				part.register(this);
				return part;
			} else {
				return null;
			}
		},

		newParticle :
			function (sprite, origin, destination, time, rotation, fade) {
			var new_particle =
				Particle(sprite, origin, destination, time, rotation, fade);
			return this.addParticle(new_particle);
		},

		newDebris : function(sprite) {
			var position = sprite.center();
			// choose rotation & rate
			var rate = (Math.random() - 0.5) / 5;
			// choose destination
			var destination = {x: position.x + (Math.random() * 300) - 150,
				y: position.y + (Math.random() * 300) - 150};
			this.newParticle(sprite, position, destination, 1000, rate, true);
		},

		removeParticle : function (particle) {
			var index = 0;

			if (particle && this.particleList) {
				for (index in this.particleList) {
					if (this.particleList[index] === particle) {
						this.particleList.splice(index, 1);
						this.numParticles -= 1;
					}
				}
			}
		},

		update : function (elapsed) {
			var index = "";
			var particle = null;
			for (index in this.particleList){
				particle = this.particleList[index];

				if (particle) {
					particle.update(elapsed);
				}
			}
		}
	}

	return function () {
		var new_particleManager = {
			__proto__: particleManager_prototype
		};

		new_particleManager.numParticles = 0;
		new_particleManager.particleList = [];

		return new_particleManager;
	}
}
