/*
	Utility functions and objects
*/

// axes
var axis = {X: "x", Y: "y", Z: "z"};

// face directions
var dirs = {
	UP: "up", DOWN: "down", NORTH: "north", 
	SOUTH: "south", EAST: "east", WEST: "west"
};

var Vector = function(x, y, z=null) {
	this.x = x;
	this.y = y;
	this.z = z;

	this.toString = function() {
		return "(" + this.x + ", " + this.y 
			+ (this.z !== null ? ", " + this.z : "") + ")";
	}

	this.as_array = function() {
		var arr = [this.x, this.y];
		if (this.z != null) { arr.push(this.z); }
		return arr;
	}

	this.diff = function(other) {
		if (this.z != null && other.z != null) {
			return new Vector(other.x - this.x, other.y - this.y,
				other.z - this.z);
		}
		return Vector(other.x - this.x, other.y - this.y);
	}

	this.div = function(divisor) {
		if (this.z != null) {
			return new Vector(this.x / divisor, this.y / divisor, 
				this.z / divisor);
		}
		return new Vector(this.x / divisor, this.y / divisor);
	}

	this.add = function(other) {
		if (this.z != null && other.z != null) {
			return new Vector(this.x + other.x, this.y + other.y,
				this.z + other.z);
		}
		return new Vector(this.x + other.x, this.y + other.y);
	}
}

var len = function(dict_object) {
	return Object.keys(dict_object).length;
}

var vector_from_array = function(arr) {
	var scalars = [];
	$.each(arr, function(i, value) {
		scalars.push(parseInt(arr[i]));
	});

	if (arr.length == 2) {
		return new Vector(scalars[0], scalars[1]);
	} else if (arr.length == 3) {
		return new Vector(scalars[0], scalars[1], scalars[2]);
	}
	throw "Could not construct vector from array " + arr;
}

var get_axis = function(axis_str) {
	axis_str = axis_str.toLowerCase();
	for (key in axis) {
		if (axis[key].toLowerCase() == axis_str) {
			return key;
		}
	}
	throw "Invalid axis: " + axis_str;
}

var get_dir = function(dir_str) {
	dir_str = dir_str.toLowerCase();
	for (key in dirs) {
		if (dirs[key].toLowerCase() == dir_str) {
			return key;
		}
	}
	throw "Invalid direction: '" + dir_str + "'";
}

var load_model_image = function(key) {
	var path;
	if (key.indexOf(":") > -1) {
		var split = key.split(":", 1);
		path = "assets/" + split[0] + "/textures/" + split[1] + ".png";
	} else {
		path = "assets/minecraft/textures/" + key + ".png";
	}
	return THREE.ImageUtils.loadTexture(path);
}