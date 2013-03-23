// Orders object file

// Builder function for orders factory object
var POKE_order = function(){
	// Order class prototype (hidden)
	var order_prototype = {
	};

	// construct object
	return {
		Attack: function(source, target) {
			// add the target and source
			if (source && target) {
				// build the prototype
				this.__proto__ = order_prototype;

				// add cosmetics
				this.name = "attack";
				this.colour = "#CC0000";

				// add affected parties
				this.source = source;
				this.target = target;
				this.position = target;

				// set it as pending
				this.pending = true;
			} else {
				throw "Attack order created without target or source.";
			}
		},

		Move: function(source, target) {
			// add the target and source
			if (source && target) {
				// build the prototype
				this.__proto__ = order_prototype;

				// add cosmetics
				this.name = "move";
				this.colour = "#00CC00";

				// add affected parties
				this.source = source;
				this.target = target;
				this.position = target;

				// calculate the unit vector
				this.vector = Math.calcVector(source.position, target);

				// set it as pending
				this.pending = true;
			} else {
				throw "Move order created without target or source.";
			}
		}
	};
};
