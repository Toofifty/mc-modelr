var Model = function(json, child=null) {
	/*
		Load the parent model
	*/
	this.load_parent = function(parent_path) {
		console.log("Loading parent " + parent_path + "...");
		var path = "assets/minecraft/models/" + parent_path + ".json";
		var parent_node;
		$.ajax({
			dataType: "json",
			url: path,
			data: parent_node
		});
		return new Model(parent_node, this);
	}

	/*
		Build the model from the JSON given
	*/
	this.load_model = function(node) {
		console.log("Building model...");
		// recursively load all parents, right to the top
		if (node.parent !== undefined && node.parent != "") {
			this.parent_str = node.parent;
			this.parent = this.load_parent(this.parent_str);
		}

		// load texture dict
		if (node.textures !== undefined && len(node.textures) > 0) {
			this.texture_dict = node.textures;

			if (len(this.texture_dict) > 0) {
				//this.texture_atlas = new TextureAtlas(this.texture_dict);
			}
		}

		// build elements
		if (node.elements !== undefined && len(node.elements)) {
			for (index in node.elements) {
				this.elements.push(new Element(this, node.elements[index]));
			}
		}
	}

	/*
		Build a JSON from the current model, applying
		all elements and faces.
	 */
	this.build_json = function() {
		var out = {};

		// set AO
		out.ambientocclusion = this.ambient_occlusion;

		// set parent
		if (this.parent_str != null && this.parent_str != "") {
			out.parent = this.parent_str;
		}

		// set textures
		if (len(this.texture_dict) > 0) {
			out.textures = this.texture_dict;
		}

		// set elements
		if (len(this.elements) > 0) {
			out.elements = [];
			for (key in this.elements) {
				out.elements.push(this.elements[key].build_json())
			}
		}
		return out;
	}

	// use this inside anonymous functions to keep
	// a reference to this object
	var self = this;

	// inheritance
	this.parent_str;
	this.parent = null;
	this.child = child;

	this.ambient_occlusion = true;

	// map of texture names ("main") to location keys ("minecraft:blocks/dirt")
	this.texture_dict = {};

	// texture controller object
	this.texture_atlas;

	// elements
	this.elements = [];

	// ?
	this.ref_str;

	this.load_model(json);
}

/*
	An element of the model
*/
var Element = function(model, node) {
	/*
		Build this element from a JSON node
	*/
	this.load_element = function(node) {
		// determine the (optional) name of the element
		// can be sourced from __name or from __comment if no __name found
		// if neither, set to "null"
		this.name = node.__name ? node.__name : 
			(node.__comment ? node.__comment : "null");

		console.log("Building element '" + this.name + "'...");

		// check for invalid bounds
		if (node.from === undefined || node.from.length != 3 || 
				node.to === undefined || node.to.length != 3) {
			throw "Invalid element: " + this.name;
		}

		// determine and set the "from" and "to" values
		// i.e. the 3D corners of the element
		this.from = vector_from_array(node.from);
		this.to = vector_from_array(node.to);

		// determine rotation of the object
		if (node.rotation !== undefined) {
			// set the origin (optional, default to 0,0,0)
			if (node.origin !== undefined && node.origin.length == 3) {
				this.origin = vector_from_array(node.origin);
			}

			// set the axis of rotation
			if (node.axis !== undefined && node.axis != "") {
				this.axis = get_axis(node.axis);
			}

			// set the angle of rotation
			if (node.angle !== undefined && parseInt(node.angle) != 0) {
				this.angle = parseInt(node.angle);
			}
		}

		// create a dict of faces for each direction specified
		if (node.faces !== undefined && len(node.faces) > 0) {
			for (dir_str in node.faces) {
				var dir = get_dir(dir_str);
				this.faces[dir] = new Face(model, node.faces[dir_str]);
			}
		}
	}

	/*
		Build the THREE.js box to be used for rendering the object
	*/
	this.build_box = function() {
		var size = from.diff(to);
		this.box = new THREE.Mesh(
			new THREE.BoxGeometry(size.x, size.y, size.z),
			new THREE.MeshBasicMaterial({color: 0x00ff00})
		);
		var midpoint = from.add(size.div(2));
		this.box.position.set(midpoint.x, midpoint.y, midpoint.z);
	}

	/*
		Build a JSON object from the current element,
		applying face data
	*/
	this.build_json = function() {
		var out = {};

		// set name
		if (this.name != "null") {
			out.__name = this.name;
			console.log(out.__name);
		}

		// set bounds
		out.from = this.from.as_array();
		out.to = this.to.as_array();

		// set shade
		if (this.shade !== undefined) {
			out.shade = this.shade;
		}

		// set rotations
		if (this.axis != null) {
			out.origin = this.origin.as_array();
			out.axis = axis[this.axis];
			out.angle = this.angle;
			out.rescale = this.rescale;
		}

		// set faces
		if (len(this.faces) > 0) {
			out.faces = {};
			for (dir in this.faces) {
				out.faces[dirs[dir]] = this.faces[dir].build_json();
			}
		}
		return out;
	}

	var self = this;

	// reference to the model this element belongs to
	this.model = model;

	// element bounds
	this.from = null;
	this.to = null;

	// rotations
	this.origin = new Vector(0, 0, 0);
	this.axis = null;
	this.angle = 0;
	this.rescale = false;

	// faces
	this.faces = {};

	// meta
	this.name = "null";
	this.shade = true;

	// 3D box
	this.box = null;
	this.in_scene = false;

	this.load_element(node);
}

var Face = function(element, node) {
	/*
		Build this face from a JSON node
	*/
	this.load_face = function(node) {
		// set the uv coordinates
		if (node.uv !== undefined && node.uv.length == 4) {
			this.uv_from = vector_from_array(node.uv.slice(0, 2));
			this.uv_to = vector_from_array(node.uv.slice(2));
		} else {
			// default to 0,0 16,16
			this.uv_from = new Vector(0, 0);
			this.uv_to = new Vector(16, 16);
		}

		// set the texture string
		if (node.texture !== undefined) {
			// remove the first char (#) from the texture string
			this.texture_str = node.texture.slice(1);
		}
	}

	/*
		Get uv_from relative to the tex_coords
		TODO
	*/
	this.get_uv_from = function(tex_coords) {
		return new Vector(0, 0);
	}

	/*
		Get uv_to relative to the tex_coords
		TODO
	*/
	this.get_uv_to = function(tex_coords) {
		return new Vector(0, 0);
	}

	/*
		Build a JSON object for the current face
	*/
	this.build_json = function() {
		var out = {};

		// uv and texture str
		out.uv = this.uv_from.as_array().concat(this.uv_to.as_array());
		out.texture = "#" + this.texture_str;

		// cullface
		if (this.cullface !== undefined) {
			out.cullface = dirs[this.cullface];
		}

		// rotation
		if (this.rotation != 0) {
			out.rotation = this.rotation;
		}
		return out;
	}

	var self = this;

	// reference to the element and model this face belongs to
	this.element = element;
	this.model = element.model;

	// uv coordinates
	this.uv_from;
	this.uv_to;

	// name of texture
	this.texture_str;
	this.cullface;

	// texture rotation
	this.rotation = 0;

	this.load_face(node);
}
