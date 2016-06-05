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

var len = function(dict_object) {
	return Object.keys(dict_object).length;
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

var vector_str = function(v) {
	return "(" + v.x + ", " + v.y + ", " + v.z + ")";
}

var cookie = function(ck, val, sess=false) {
	if (val === undefined) {
		val = Cookies.get(ck);
		if (val === undefined) return undefined;
		if (val.contains("$list:")) {
			val = val.split(":", 2)[1].split(",");
			if (!isNaN(parseFloat(val[0]))) {
				var t = val.slice();
				val = [];
				for (i in t) {
					val.push(parseFloat(t[i]));
				}
			}
		} 
		else if (val == "true") val = true;
		else if (val == "false") val = false;
		else if (!isNaN(parseFloat(val))) val = parseFloat(val);

		return val;

	} else if (ck === undefined) {
		return Cookies.get();

	} else {
		if (typeof val === "object") {
			val = "$list:" + val.join(",");
		}
		if (!sess) Cookies.set(ck, val, {expires: 30});
		else Cookies.set(ck, val);

		return cookie(ck);
	}
}

var del_cookie = Cookies.remove;

if (typeof String.prototype.contains === "undefined") {
	String.prototype.contains = function(substring) {
		return this.indexOf(substring) > -1;
	}
}