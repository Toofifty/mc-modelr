/*
	Helper functions for editing the model in the three.js canvas
*/

var FROM_RESIZE = 0, TO_RESIZE = 1, TRANSLATE = 2;
var NONE = 0, HOVER = 1, SELECT = 2;

/* ModelController class

   Handles incoming hovers and clicks and contains the
   editor's states */
var ModelController = function(model) {
	var self = this;

	this.model = model;

	this.selected = null;
	this.hovered = null;

	this.ctrls = {};

	for (id in this.model.elements) {

		this.ctrls[id] = new ElementController(this.model.elements[id]);

	}

	/* get an ElementController object from its ID or the 
	   element it is bound to */
	this.get_ctrl = function(element) {

		if (typeof element == "number") return this.ctrls[element];

		for (id in this.ctrls) {

			if (this.ctrls[id].element == element) return this.ctrls[id]

		}

		return null;

	}

	/* get an ElementController object from the box that it
	   draws to the scene with */
	this.get_ctrl_from_box = function(box) {

		for (id in this.ctrls) {

			if (this.ctrls[id].element.box == box) return this.ctrls[id];

		}

		return null;

	}

	/* determine which element is being hovered / selected,
	   save it and call the appropriate methods */
	this.on_hover = function(object_intersects, mouse) {

		if (this.on_handle_hover(object_intersects, mouse)) {
			if (this.hovered != null) this.hovered.off_hover();
			this.hovered = null;
			return;
		}

		// filter for only model elements
		// ignores all ghost elements, handles and guide objects
		var intersects = [];
		for (i in object_intersects) {

			if (object_intersects[i].object.is_model_element)
				intersects.push(object_intersects[i].object);

		}

		// when not hovering over anything
		if (intersects.length == 0) {

			if (this.hovered != null) {

				this.hovered.off_hover();
				this.hovered = null;

			}

			if (mouse.down && this.selected != null) {

				this.selected.deselect();
				this.selected = null;

			}

		} else {

			var top_ctrl = this.get_ctrl_from_box(intersects[0]);

			if (this.hovered == null || this.hovered != top_ctrl) {

				if (this.hovered != null) this.hovered.off_hover();

				this.hovered = top_ctrl;
				this.hovered.on_hover();

			}

			if (mouse.down && (this.selected == null || this.selected != top_ctrl)) {

				if (this.selected != null) this.selected.deselect();

				this.selected = top_ctrl;
				this.selected.select();

			}

		}

	}

	/* check whether any handle arrows are being hovered / clicked */
	this.on_handle_hover = function(object_intersects, mouse) {

		// can only see handles when something is selected
		if (this.selected == null) return false;

		// filter for only handle arrows
		var intersects = [];
		for (i in object_intersects) {

			if (object_intersects[i].object.is_arrow_hitbox) 
				intersects.push(object_intersects[i]);

		}

		if (intersects.length > 0) {

			if (mouse.down) this.selected.drag(intersects[0].object, intersects[0].point);
			else this.selected.stop_drag();
			return true;

		} 

		return false;

	}

}

/* ElementController class

   Handles all resizing, moving, deleting functionality 
   for a single element */
var ElementController = function(element) {
	var self = this;

	this.element = element;

	this.hovered = false;
	this.selected = false;

	this.dragging_handle = null;

	// create resize handles
	this.from_handle = new Handle(this, element, element.from, FROM_RESIZE);
	this.to_handle = new Handle(this, element, element.to, TO_RESIZE);

	// create translate handle
	this.translate_handle = new Handle(this, element, element.box.position, TRANSLATE);

	// create ghost element
	this.ghost = new GhostElement(this, element);

	this.on_hover = function(ui) {

		if (this.hovered) return;

		this.hovered = this.ghost.on_hover();
		if (ui) return;

		var tt_text = "<pre>from: " + vector_str(this.element.from) + "\n"
			+ "to:   " + vector_str(this.element.to); + "</pre>";

		create_tooltip(tt_text, true, this.element.name);
		$("#elem-" + this.element.id + "-header").attr("object-hovered", true);

	}

	this.off_hover = function() {

		if (!this.hovered) return;

		this.hovered = this.ghost.off_hover();

		clear_tooltip();
		$("#elem-" + this.element.id + "-header").attr("object-hovered", false);

	}

	this.select = function() {

		if (this.selected) return;
		this.selected = this.ghost.select();
		this.from_handle.show();
		this.to_handle.show();

	}

	this.deselect = function() {

		if (!this.selected) return;
		this.selected = this.ghost.deselect();
		this.from_handle.hide();
		this.to_handle.hide();

	}

	this.stop_drag = function() {

		if (this.dragging_handle != null)
			this.dragging_handle.stop_drag();

	}

	this.drag = function(arrow, mouse) {

		var to_arrow = this.to_handle.get_arrow_id(arrow);

		if (to_arrow != null) {

			this.dragging_handle = this.to_handle;
			this.dragging_handle.drag(to_arrow, mouse);

		} else {

			var from_arrow = this.from_handle.get_arrow_id(arrow);

			if (from_arrow != null) {

				this.dragging_handle = this.from_handle;
				this.dragging_handle.drag(from_arrow, mouse);

			} else {

				console.log("shit's fucked");

			}

		}

	}
}

/* Handle class

   For the object that act as the handles on the corners
   and middle of the element, for resizing and translating */
var Handle = function(ctrl, element, pos, type) {
	var self = this;

	this.ctrl = ctrl;
	this.element = element;
	this.pos = pos;
	this.type = type;

	this.drag_start = null;

	this.scene = element.model.scene;

	this.dragging = null;

	this.object = new THREE.Mesh(
		//new THREE.SphereGeometry(0.5, 8, 8),
		new THREE.BoxGeometry(0.5, 0.5, 0.5),
		new THREE.MeshLambertMaterial({color: shades.lightest})
	);

	this.arrows = [
		new THREE.ArrowHelper(new THREE.Vector3(1, 0, 0), this.pos, 2, 0xFF0000),
		new THREE.ArrowHelper(new THREE.Vector3(0, 1, 0), this.pos, 2, 0x00FF00),
		new THREE.ArrowHelper(new THREE.Vector3(0, 0, 1), this.pos, 2, 0x0000FF)
	];

	var hitbox_mat = new THREE.MeshBasicMaterial({transparent: true, opacity: 0.2, color: 0xFF00FF});

	this.arrow_hitboxes = [
		new THREE.Mesh(new THREE.BoxGeometry(2, 0.5, 0.5), hitbox_mat),
		new THREE.Mesh(new THREE.BoxGeometry(0.5, 2, 0.5), hitbox_mat),
		new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.5, 2), hitbox_mat)
	];

	var set_position = function(arrow_id, offset) {
		self.arrow_hitboxes[arrow_id].position.set(offset.x, offset.y, offset.z);
	}

	set_position(0, this.pos.clone().add(new THREE.Vector3(1, 0, 0)));
	set_position(1, this.pos.clone().add(new THREE.Vector3(0, 1, 0)));
	set_position(2, this.pos.clone().add(new THREE.Vector3(0, 0, 1)));

	for (i in this.arrow_hitboxes) this.arrow_hitboxes[i].is_arrow_hitbox = true;


	this.get_arrow_id = function(arrow) {

		for (i in this.arrows)
			if (this.arrow_hitboxes[i] == arrow) return i;

		return null;

	}

	this.show = function() {

		if (this.scene == null) this.scene = this.element.model.scene;

		this.object.position.set(this.pos.x, this.pos.y, this.pos.z);
		this.scene.add(this.object);

		for (i in this.arrows) {
			this.scene.add(this.arrows[i]);
			this.scene.add(this.arrow_hitboxes[i]);
		}

	}

	this.hide = function() {

		this.scene.remove(this.object);

		for (i in this.arrows) {
			this.scene.remove(this.arrows[i]);
			this.scene.remove(this.arrow_hitboxes[i]);
		}

	}

	this.apply = function(x, y, z) {

		this.old_pos = this.pos.clone();

		x = parseInt(x);

		this.object.translateX(x - this.pos.x);
		this.object.translateY(y - this.pos.y);
		this.object.translateZ(z - this.pos.z);

		for (i in this.arrows) {
			this.arrows[i].translateX(x - this.pos.x);
			this.arrows[i].translateY(y - this.pos.y);
			this.arrows[i].translateZ(z - this.pos.z);
			this.arrow_hitboxes[i].translateX(x - this.pos.x);
			this.arrow_hitboxes[i].translateY(y - this.pos.y);
			this.arrow_hitboxes[i].translateZ(z - this.pos.z);
		}

		if (this.type == FROM_RESIZE) {

			this.element.set_from();

		} else if (this.type == TO_RESIZE) {

			this.element.set_to(x, y, z);

		}

		var applied = x != this.old_pos.x || y != this.old_pos.y || z != this.old_pos.z;
		return applied;

	}

	this.stop_drag = function() {

		this.drag_start = null;

	}

	this.drag = function(arrow_id, point) {

		arrow_id = parseInt(arrow_id);

		switch(arrow_id) {

			case 0: // x

				if (this.drag_start == null) {
					this.drag_start = point.x;
					return;
				}

				if (this.apply(point.x - this.drag_start + this.pos.x, this.pos.y, this.pos.z))
					this.drag_start = point.x;
				break;

			case 1: // y

				if (this.drag_start == null) {
					this.drag_start = point.y;
					return;
				}

				if (this.apply(this.pos.x, point.y - this.drag_start + this.pos.y, this.pos.z))
					this.drag_start = point.y;
				break;

		}

	}
}

/* GhostElement class

   Controls a box that is used to show when an element
   is hovered or selected */
var GhostElement = function(ctrl, element) {
	var self = this;

	this.ctrl = ctrl;
	this.element = element;
	this.scene = element.model.scene;
	this.in_scene = false;

	this.hovered = false;
	this.selected = false;

	// box options when hovered
	this.hover_opts = {
		swell: 0.1,
		color: shades.lightest,
		opacity: 0.2,
		wireframe: false
	};

	// box options when selected
	this.select_opts = {
		swell: 0.25,
		color: shades.mid,
		opacity: 0.1,
		wireframe: false
	};

	// create box from element
	this.box = (function(opts) {
		var size = self.element.to.clone().sub(self.element.from);
		var mid = self.element.from.clone().add(size.clone().multiplyScalar(1 / 2));
		size.addScalar(opts.swell);

		var box = new THREE.Mesh(
			new THREE.BoxGeometry(size.x, size.y, size.z),
			new THREE.MeshLambertMaterial({
				color: opts.color, wireframe: opts.wireframe, 
				transparent: true, opacity: opts.opacity
			})
		);

		box.position.set(mid.x, mid.y, mid.z);
		return box;
	})(this.hover_opts);

	/* set the options on the box */
	this.set_opts = function(opts) {

		var box_size = this.element.to.clone().sub(this.element.from);
		var ghost_size = box_size.clone().addScalar(opts.swell);

		this.box.scale.x = ghost_size.x / box_size.x;
		this.box.scale.y = ghost_size.y / box_size.y;
		this.box.scale.z = ghost_size.z / box_size.z;

		this.box.material.setValues({
			color: opts.color, opacity: opts.opacity, wireframe: opts.wireframe
		});

	}

	/* ensure box is in scene and has the current state's options */
	this.update = function() {

		if (this.scene == null) this.scene = this.element.model.scene;

		// selected has precedence over hovered
		if (this.selected) {
			// set selected options and show box
			this.set_opts(this.select_opts);
			if (!this.in_scene) {
				this.scene.add(this.box);
				this.in_scene = true;
			}

		} else if (this.hovered) {
			// set hovered options and show box
			this.set_opts(this.hover_opts);
			if (!this.in_scene) {
				this.scene.add(this.box);
				this.in_scene = true;
			}

		} else {
			// hide box
			if (this.in_scene) {
				this.scene.remove(this.box);
				this.in_scene = false;
			}

		}

	}

	/* enable, hovered  */
	this.on_hover = function() {

		this.hovered = true;
		this.update();
		return this.hovered;

	}

	/* off hover */
	this.off_hover = function() {

		this.hovered = false;
		this.update();
		return this.hovered;

	}

	/* enable, selected */
	this.select = function() {

		this.selected = true;
		this.update();
		return this.selected;

	}

	this.deselect = function() {

		this.selected = false;
		this.update();
		return this.selected;

	}

}