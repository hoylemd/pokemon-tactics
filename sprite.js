// Sprite object

var ISIS_sprite = function(context)
{
	var sprite_prototype =
	{
		// function called by the global update whenever it gets around to it
		// msElapsed: the number of milliseconds since the last time this
		//  method was called.
		update_handler : function(msElapsed)
		{
			msSinceLastFrame += msElapsed;

			if (msSinceLastFrame > msBetweenFrames)
			{
				this.update();
				msSinceLastFrame = 0;
			}
		},

		// internal update logic. Replace this for custom functionality
		update : function()
		{
			var x = 0;
			var y = 0;

			if (this.image && this.msBetweenFrames > 0)
			{
				if (this.mapDims.x > 1 || this.mapDims.y > 1)
				{
					x = this.currentFrame.x + 1;
					this.currentFrame.x = x % this.mapDims.x;

					if (x === 0)
					{
						y = this.currentFrame.y + 1;
						this.currentFrame.y = y % this.mapDims.y;
					}

				}
			}
		},

		draw : function()
		{
			if (this.image)
			{
				context.reset();
				context.translate(this.position.x + 0.5 * this.frameDims.x,
					   	this.position.y + 0.5 * this.frameDims.y);
				context.rotate(this.rotation);

				context.drawImage(this.image, -0.5 * this.frameDims.x,
						-0.5 * this.frameDims.y);
			}

		},

		rotate : function(rads)
		{
			this.rotation = rads;
		},

		moveTo : function(coords)
		{
			this.position = {x:coords.x, y:coords.y};
		},

		centerOn : function (coords) {
			var new_pos = {x: 0, y: 0};
			new_pos.x = coords.x - (this.frameDims.x / 2);
			new_pos.y = coords.y - (this.frameDims.y / 2);
			this.moveTo(new_pos);
		},

		move : function (displacement) {
			this.position.x += displacement.x;
			this.position.y += displacement.y;
		},

		register : function(man)
		{
			this.manager = man;
		},

		destruct : function()
		{
			if (this.manager)
				this.manager.removeSprite(this);
		}
	};

	// constructor
	return function(image, mapDims, msBetweenFrames)
	{
		var new_sprite = {
			__proto__ : sprite_prototype
		};

		if (image && mapDims)
		{
			new_sprite.position = {x:0, y:0};
			new_sprite.rotation = 0;

			new_sprite.image = image;
			new_sprite.mapDims = mapDims;
			new_sprite.msBetweenFrames = msBetweenFrames;
			new_sprite.msSinceLastFrame = 0;

			new_sprite.frameDims = {};
			new_sprite.frameDims.x = Math.floor(image.width / mapDims.x);
			new_sprite.frameDims.y = Math.floor(image.height / mapDims.y);
			new_sprite.currentFrame = {x:0, y:0};

		}
		else
			new_sprite = null;

		return new_sprite;
	}

};
