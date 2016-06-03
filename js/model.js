/*
	Model prototype
*/
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

		this.name = node.__name ? node.__name : 
			(node.__comment ? node.__comment : "null");

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
				this.elements[index] = new Element(this, node.elements[index], index);
			}
		}
		console.log("Model built successfully.");
	}

	/*
		Render all the model components to the scene
	*/
	this.render = function(scene) {
		// render parent
		if (this.parent != null) {
			this.parent.render(scene);
		}

		// render all elements
		for (i in this.elements) {
			this.elements[i].render(scene);
		}
	}

	/*
		Determine which element in being hovered over
	*/
	this.on_hover = function(hovered) {
		if (hovered.length > 0) {
			var top = hovered[0].object;
			if (this.hover_element != null && (top == this.hover_element 
					|| top == this.hover_element.outline)) {
				return;
			} 
			for (i in this.elements) {
				if (top == this.elements[i].box) {
					if (this.hover_element != null) {
						this.hover_element.off_hover();
					}
					this.elements[i].on_hover();
					this.hover_element = this.elements[i];
					return;
				}
			}
		}

		if (this.hover_element != null) {
			this.hover_element.off_hover();
			this.hover_element = null;
		}
	}

	/*
		Get the lowest free element id
	*/
	this.free_id = function() {
		var id = 0;
		while (this.elements[id]) {
			id++;
		}
		return id;
	}

	/*
		Build HTML into the #structure element
	*/
	this.build_structure = function() {
		var section = $("#structure > .content");
		// ensure element is clear
		section.children().remove();

		section.append("<ul id='model-structure'></ul>");
		var model_header = $("#model-structure");

		// AMBIENT OCCLUSION

		model_header.append(
			  	"<li>"
			+		"<div class='structure-header'>"
			+			"<p>Ambient Occlusion</p>"
			+			"<input id='ao-toggle' type='checkbox'/>"
			+		"</div>"
			+ 	"</li>"
		);

		$("#ao-toggle").click(function() {
			console.log($(this));
			pp_enabled = !pp_enabled;
		});

		// TEXTURES

		// append texture header and list
		model_header.append(
			  	"<li>"
			+ 		"<div id='texture-header' class='structure-header'>"
			+ 			"<p>Textures</p>" 
			+ 			html_icon("icon-down", "", "toggle-icon")
			+ 		"</div>"
			+		"<ul id='texture-structure' class='collapsed'></ul>"
			+ 	"</li>"
		);

		// set toggle function
		$("#texture-header").click(function() {
			if ($(this).attr("isopen") == "true") {
				$(this).attr("isopen", "false");
				$("#texture-structure").addClass("collapsed");
			} else {
				$(this).attr("isopen", "true");
				$("#texture-structure").removeClass("collapsed");
			}
		});

		// get texture ul
		var texture_list = $("#texture-structure");

		// create a HTML texture list entry
		var texture_info = function(key, val, rem=true) {
			return  "<li>"
				+		"<div class='texture-info'>"
				+ 			html_icon("minus", "remove-texture", "action button")
				+ 			"<p id='" + key + "-t-key' class='key'>" 
				+ 				key 
				+ 			"</p>"
				+			"<input id='" +key+ "-t-tex' type='text' value='" +val+ "'/>"
				+		"</div>"
				+ 	"</li>";
		}

		for (key in this.texture_dict) {
			texture_list.append(texture_info(key, this.texture_dict[key]));
		}

		// add an empty list entry for adding items
		texture_list.append(
				"<li>"
			+		"<div class='texture-info'>"
			+ 			html_icon("plus", "add-texture", "action button")
			+ 			"<input id='t-key-new' type='text' class='key' placeholder='texture key'>"
			+ 			"<input id='t-tex-new' placeholder='texture location' type='text'>" 
			+		"</div>"
			+ 	"</li>"
		);

		// ELEMENTS

		// append element header and list
		model_header.append(
				"<li>"
			+		"<div id='elements-header' class='structure-header'>"
			+			"<p>Elements</p>"
			+ 			html_icon("icon-down", "", "toggle-icon")
			+ 		"</div>"
			+ 		"<ul id='elements-structure' class='collapsed'></ul>"
			+	"</li>"
		);

		// set toggle function
		$("#elements-header").click(function() {
			if ($(this).attr("isopen") == "true") {
				$(this).attr("isopen", "false");
				$("#elements-structure").addClass("collapsed");
			} else {
				$(this).attr("isopen", "true");
				$("#elements-structure").removeClass("collapsed");
			}
		});

		var element_header = $("#elements-structure");

		for (i in this.elements) {
			this.elements[i].build_structure(element_header);
		}

		// empty element adder
		element_header.append(
				"<li>"
			+		"<div id='elem-new-header' class='element-header'>"
			+ 			html_icon("plus", "add-elem", "action-double button") 
			+			"<p class='element-header-id'>" + this.free_id() + "</p>"
			+ 			"<input type='text' placeholder='new element'/>"
			+		"</div>"
			+	"</li>"
		);
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

	this.name = "null";

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
	this.elements = {};

	this.hover_element = null;

	// ?
	this.ref_str;

	this.load_model(json);
}

/*
	An element of the model
*/
var Element = function(model, node, id=-1) {
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

		this.build_box();

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
		var size = this.from.diff(this.to);
		this.box = new THREE.Mesh(
			new THREE.BoxGeometry(size.x, size.y, size.z),
			new THREE.MeshLambertMaterial({color: this.color})
		);
		var midpoint = this.from.add(size.div(2));
		this.box.position.set(midpoint.x, midpoint.y, midpoint.z);

		this.outline = new THREE.Mesh(
			new THREE.BoxGeometry(size.x + 0.5, size.y + 0.5, size.z + 0.5),
			new THREE.MeshLambertMaterial({color: shades.mid, wireframe: false, transparent: true})
		);

		this.outline.position.set(midpoint.x, midpoint.y, midpoint.z);
		this.outline.material.opacity = 0.2;
	}

	/*
		Add this element to the scene
	*/
	this.render = function(scene) {
		if (!this.in_scene && this.box != null) {
			this.in_scene = true;
			scene.add(this.box);
		}
		if (this.hover && !this.outline_in_scene) {
			this.outline_in_scene = true;
			scene.add(this.outline);
		} else if (!this.hover && this.outline_in_scene) {
			this.outline_in_scene = false;
			scene.remove(this.outline);
		}
	}

	/*
		Action performed on element hover
	*/
	this.on_hover = function() {
		this.hover = true;
		var tt_text = "<pre>from: " + this.from.toString() + "\n"
			+ "to:   " + this.to.toString(); + "</pre>";
		create_tooltip(tt_text, true, this.name);
		//this.box.material.color.set("#F0F");

	}

	/*
		Action performed when hover focus is lost
	*/
	this.off_hover = function() {
		this.hover = false;
		clear_tooltip();
		//this.box.material.color.set(this.color);
	}

	/*
		Build the structure hierarchy of this element into
		the header DOM element
	*/
	this.build_structure = function(ul) {
		// NAME
		ul.append(
				"<li>" 
			+		"<div id='elem-" +this.id+ "-header' class='element-header'>"
			+ 			html_icon("pencil", "elem-" + this.id + "-edit", "action button") 
			+ 			html_icon("minus", "elem-" + this.id + "-remove", "action-notleft button")
			+			"<p class='element-header-id'>" + this.id + "</p>"
			+ 			"<p class='element-header-name'>" + this.name + "</p>"
			+ 			html_icon("icon-down", "elem-" + this.id + "-toggle", "toggle-icon")
			+		"</div>"
			+		"<ul id='elem-" +this.id+ "-structure' class='element-structure collapsed'></ul>"
			+ 	"</li>"
		);

		// add element toggle
		$("#elem-" + this.id + "-header").click(function() {
			if ($(this).attr("isopen") == "true") {
				$(this).attr("isopen", "false");
				$("#elem-" + self.id + "-structure").addClass("collapsed");
			} else {
				$(this).attr("isopen", "true");
				$("#elem-" + self.id + "-structure").removeClass("collapsed");
			}
		});

		// get elem structure
		var element_structure = $("#elem-" + this.id + "-structure");

		// bounds
		element_structure.append(
				"<li>"
			//+		html_icon("pencil", "elem-" + this.id + "-bounds-edit", "action button")
			+		"<p class='element-key'>Bounds</p>"
			+		"<div class='element-values'>"
			+			"<input type='number' value='" + this.from.x + "'>"
			+			"<input type='number' value='" + this.from.y + "'>"
			+			"<input type='number' value='" + this.from.z + "' style='margin-right:0'>"
			+			"<p class='element-key' style='text-align:center;width:6%'>to</p>"
			+			"<input type='number' value='" + this.to.x + "'>"
			+			"<input type='number' value='" + this.to.y + "'>"
			+			"<input type='number' value='" + this.to.z + "'>"
			+		"</div>"
			+	"</li>"
		);

		// shade
		element_structure.append(
				"<li>"
			+		"<p class='element-key'>Shade</p>"
			//+		"<div class='element-values'>"
			+			"<input type='checkbox' value='" + this.shade + "'>"
			//+		"</div>"
			+	"</li>"
		);

		// rotation
		if (this.angle == 0) {
			element_structure.append(
					"<li>"
				+		html_icon("plus", "elem-" + this.id + "-add-rotate", "action button-disabled")
				+		"<p class='element-key'>Rotation</p>"
				+	"</li>"
			);
		}

		// faces
		element_structure.append(
				"<li>"
			+		"<div id='elem-" + this.id + "-faces-header'>"
			+			"<p class='element-key'>Faces</p>"
			+			html_icon("down", "elem-" + this.id + "-faces-toggle", "toggle-icon")
			+		"</div>"
			+		"<ul id='elem-" + this.id + "-faces'></ul>"
			+	"</li>"
		);

		var face_structure = $("#elem-" + this.id + "-faces");

		for (dir in this.faces) {
			this.faces[dir].build_structure(face_structure, dir);
		}
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

	this.id = id;

	// element bounds
	this.from = null;
	this.to = null;

	// rotations
	this.origin = new Vector(8, 8, 8);
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

	this.color = "#AAA";

	this.outline = null;
	this.outline_in_scene = false;

	this.load_element(node);
}

/*
	A single face on an element
*/
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
		Build structure information into the DOM element
	*/
	this.build_structure = function(ul, dir) {
		var id = "face-" + this.element.id + "-" + dirs[dir];

		ul.append(
				"<li>" 
			+		"<div id='" +id+ "-header' class='element-header'>"
			+ 			html_icon("pencil", "elem-" + this.id + "-edit", "action button") 
			+ 			html_icon("minus", "elem-" + this.id + "-remove", "action-notleft button")
			+ 			"<p class='element-key'>" + dirs[dir] + "</p>"
			+ 			html_icon("icon-down", "elem-" + this.id + "-toggle", "toggle-icon")
			+		"</div>"
			+		"<ul id='elem-" +this.id+ "-structure' class='element-structure collapsed'></ul>"
			+ 	"</li>"
		);
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
