// Fleer view source file
// author: hoylemd

// main setup function
var ISIS_fleetView = function(context)
{
	var funDrawBackground = function()
	{
		var i = 0;
		var j = 0;
		var xMoved = 0;

		// clear the screen
		context.clearRect(this.position.x, this.position.y, 
			this.dimensions.x, this.dimensions.y);
		context.fillStyle = "#000000";
		context.fillRect(this.position.x, this.position.y,
			this.dimensions.x, this.dimensions.y);

		// set the context to the tile offset
		context.translate(this.tileOffset.x, this.tileOffset.y);
	
		// draw rows
		for (i = 0; i < this.tiles.y; i++)
		{
			xMoved = 0;
			// draw each tile
			for(j = 0; j < this.tiles.x; j++)
			{
				context.drawImage(this.tileImage, -this.tileOffset.x,
					-this.tileOffset.y);
				context.translate(this.tileDimensions.x, 0);
				xMoved += this.tileDimensions.x;
			}
		
			context.translate(-xMoved, this. tileDimensions.y);
		}

		// reset the context
		context.reset();
	};
	
	var funResize = function(x, y)
	{
		this.dimensions.x = x;
		this.dimensions.y = y;

		this.tiles.x = Math.floor(x / this.tileDimensions.x);
		this.tiles.y = Math.floor(y / this.tileDimensions.y);
	};		

	var funMove = function(x, y)
	{
		this.position.x = x;
		this.position.y = y;
	};

	var fleetView_prototype =
	{

		// sprite drawing data
		spriteRotation: 0,
		drawBackground: funDrawBackground,
		draw: function()
		{
			this.drawBackground();
			//funDrawSprites();
		},

		resize: funResize,
		move: funMove
	};

	// constructor
	return function(tileImage)
	{
		var ix = tileImage.width;
		var iy = tileImage.height;

		// build the proto
		var new_fv = {
			__proto__ : fleetView_prototype,

			// overall drawing data
			position : {x:0, y:0},
			dimensions : {x:0, y:0},
			
			// tile data
			tiles : {x:0, y:0},
			tileDimensions : {x:ix, y:iy},
			tileOffset : {x : ix / 2, y:iy / 2},
			tileImage : tileImage
		};
				

		return new_fv;
	}
}