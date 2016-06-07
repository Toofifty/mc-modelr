/*
	build.js

	Contains all functions for building HTML and DOM elements on the page.
*/

/* get the given SVG icon HTML */
var html_icon = function(icon, id, cls) {
	return bld.icon(icon, id, cls);
}

/* generic HTML building helpers */
var bld = {
	/* build an element with the specified attributes and child(ren) */
	elm: function(tag, attrs, child) {
		var html = "<" + tag;
		for (attr in attrs) 
			html += attrs[attr] !== undefined ? " " + attr + "='" + attrs[attr] + "'" : "";
		html += ">";
		if (child !== undefined) html += child;
		if (arguments.length > 3) {
			for (var i = 3; i < arguments.length; i++) {
				html += arguments[i];
			}
		}
		html += "</" + tag + ">";
		return html;
	},
	/* build a SVG html icon */
	icon: function(icon, id, cls="") {
		if (!icon.contains("icon-")) icon = "icon-" + icon;
		return this.elm("svg", {id: id, class: "icon " + cls},
			this.elm("use", {"xlink:href": "icons.svg#" + icon})
		);
	}
}

/* structure builder object
   builds HTML for the 'Structure' section */
var st_bld = {
	st_container: null,
	st_textures: null,
	st_elements: null,
	get_st_elem: function(id) {
		return $("#st-elem-" + id);
	},
	add_texture: function(key, path) {
		this.st_textures.append(
			bld.elm("li", {id: "tex-" + key},
				bld.elm("div", {class: "level-header"},
					bld.icon("minus", "tex-" + key + "-remove", "action button"),
					bld.elm("p", {class: "label label-1-button"}, key),
					bld.elm("input", {type: "text", class: "input", value: path})
		)));
		var new_textarea = $("#tex-new-add").next();
		if (new_textarea.val() != "") {
			new_textarea.val(""),
			new_textarea.next().val("")
			$("#new-tex").detach().appendTo(this.st_textures);
		}
	},
	rem_texture: function(key) {
		$("#tex-" + key).remove();
	},
	add_element: function(element) {
		this.st_elements = $("#st-elements");
		var id = "elem-" + element.id;
		var e = bld.elm;

		this.st_elements.append(
			e("li", {},
				e("div", {id: id + "-header", class: "level-header"},
					bld.icon("minus", id + "-remove", "action button"),
					bld.icon("pencil", id + "-rename", "action button"),
					e("p", {class: "label label-id"}, element.id),
					e("p", {class: "label label-elem"}, element.name),
					bld.icon("down", "", "toggle-collapse")
				),
				e("ul", {id: "st-" + id, class: "level-list collapsed"})
			)
		);

		var st_element = $("#st-" + id);

		// add renaming function
		$("#" + id + "-rename").click(function() {
			var id = $(this).attr("id").split("-", 3)[1];
			var label = $(this).next().next();
			var name = label.text();
			label.remove();
			var name_input = $(bld.elm("input", {
				id: "elem-" + id + "-renaming", 
				type: "text", 
				class: "input input-label input-label-2-button", 
				value: name
			}));
			name_input.insertAfter($(this).next());

			name_input.change(function() {
				model.rename_element(id, $(this).val());
			});

			var confirm = $(bld.icon("checkmark", "elem-" + id + "-rename-confirm", "action button"));
			confirm.insertAfter(name_input);
			confirm.click(function(e) {
				e.stopPropagation();
				label.text(name_input.val());
				label.insertAfter($(this));
				$(this).prev().remove();
				$(this).remove();
			});
		});

		// add removal function
		$("#" + id + "-remove").click(function() {
			var id = $(this).attr("id").split("-", 3)[1];
			model.remove_element(id);
		});

		// add element toggle
		$("#" + id + "-header").click(function() {
			// don't open if editing name
			if ($(this).children("input").length > 0) return;
			if ($(this).attr("isopen") == "true") {
				$(this).attr("isopen", false);
				st_element.addClass("collapsed");
			} else {
				$(this).attr("isopen", true);
				st_element.removeClass("collapsed");
			}
		})
		// add 3D hover elements when hovered
		.parent().mouseover(function() { model.ctrl.get_ctrl(element).on_hover(true); })
		.mouseout(function() { model.ctrl.get_ctrl(element).off_hover(); });

		st_element.append(
			e("li", {},
				e("div", {class: "level-header"},
					e("p", {class: "label"}, "Bounds"),
					e("div", {class: "input input-flex"},
						e("input", {id: id + "-b-from-x", type: "number", min: -16, max: 32, value: element.from.x}),
						e("input", {id: id + "-b-from-y", type: "number", min: -16, max: 32, value: element.from.y}),
						e("input", {id: id + "-b-from-z", type: "number", min: -16, max: 32, value: element.from.z}),
						"&middot;",
						e("input", {id: id + "-b-to-x", type: "number", min: -16, max: 32, value: element.to.x}),
						e("input", {id: id + "-b-to-y", type: "number", min: -16, max: 32, value: element.to.y}),
						e("input", {id: id + "-b-to-z", type: "number", min: -16, max: 32, value: element.to.z})
					)
				)
			)
		);

		$("[id^='" + id + "-b-']").change(function() {
			var id_base = "#" + $(this).attr("id").slice(0, -1);
			if (id_base.contains("from")) {
				element.set_from(
					$(id_base + "x").val(),
					$(id_base + "y").val(),
					$(id_base + "z").val()
				);
			} else {
				element.set_to(
					$(id_base + "x").val(),
					$(id_base + "y").val(),
					$(id_base + "z").val()
				);
			}
		});

		$("[id^='" + id + "-b-']").on("mousewheel", function(event) {
			$(this).val(parseFloat($(this).val()) + event.originalEvent.deltaY / -100);
			$(this).change();
			event.preventDefault();
		});

		var checked = element.shade ? " checked" : "";

		// append shade
		st_element.append(
			e("li", {},
				e("div", {class: "level-header"},
					e("p", {class: "label"}, "Shade"),
					e("input " + checked, {type: "checkbox"})
				)
			)
		);

		if (element.has_rotation) {

		} else {
			st_element.append(
				e("li", {}, 
					e("div", {class: "level-header"},
						bld.icon("plus", id + "-add-rotate", "action button-disabled"),
						e("p", {class: "label label-1-button"}, "Rotation")
					)
				)
			);
		}

		// append faces header and list
		st_element.append(
			e("li", {},
				e("div", {id: id + "-faces-header", class: "level-header"},
					e("p", {class: "label"}, "Faces"),
					bld.icon("down", "", "toggle-collapse")
				),
				e("ul", {id: "st-" + id + "-faces", class: "level-list collapsed"})
			)
		);

		var st_element_faces = $("#st-" + id + "-faces");

		// add faces toggle
		$("#" + id + "-faces-header").click(function() {
			if ($(this).attr("isopen") == "true") {
				$(this).attr("isopen", false);
				st_element_faces.addClass("collapsed");
			} else {
				$(this).attr("isopen", true);
				st_element_faces.removeClass("collapsed");
			}
		});

		for (dir in dirs) {
			this.add_face(element, st_element_faces, dir);
		}

		// if the li above this is the 'new element one',
		// move it back to the bottom
		if (st_element.parent().next().length == 0) {
			$("#elem-add").parent().detach().appendTo(this.st_elements);
			$("#elem-add").children("p").text(model.free_id());

		}
	},
	rem_element: function(index) {
		$("#elem-" + index + "-header").parent().remove();
		$("#elem-add").children("p").text(model.free_id());
	},
	add_face: function(element, ul, dir) {
		var e = bld.elm;
		var face = element.faces[dir];
		var id = "elem-" + element.id + "-face-" + dirs[dir];

		if (face == null) {
			ul.append(
				e("li", {},
					e("div", {id: id + "-header", class: "level-header"},
						bld.icon("plus", id + "-add", "action button"),
						e("p", {class: "label label-1-button"}, dirs[dir])
					),
					e("ul", {id: "st-" + id, class: "level-list collapsed"})
				)
			);
			return;
		}

		ul.append(
			e("li", {},
				e("div", {id: id + "-header", class: "level-header"},
					bld.icon("minus", id + "-remove", "action button"),
					e("p", {class: "label label-1-button"}, dirs[dir]),
					bld.icon("down", "", "toggle-collapse")
				),
				e("ul", {id: "st-" + id, class: "level-list collapsed"})
			)
		);

		var st_face = $("#st-" + id);

		// add faces toggle
		$("#" + id + "-header").click(function() {
			if ($(this).attr("isopen") == "true") {
				$(this).attr("isopen", false);
				st_face.addClass("collapsed");
			} else {
				$(this).attr("isopen", true);
				st_face.removeClass("collapsed");
			}
		});

		// append uv
		st_face.append(
			e("li", {},
				e("div", {class: "level-header"},
					e("p", {class: "label"}, "UV"),
					e("div", {class: "input input-flex"},
						e("input", {type: "number", value: face.uv_from.x}),
						e("input", {type: "number", value: face.uv_from.y}),
						"&middot;",
						e("input", {type: "number", value: face.uv_to.x}),
						e("input", {type: "number", value: face.uv_to.y})
					)
				)
			)
		);

		// append texture str
		st_face.append(
			e("li", {},
				e("div", {class: "level-header"},
					e("p", {class: "label"}, "Texture"),
					e("input", {class: "input", type: "text", value: face.texture_str})
				)
			)
		);
	},
	build_model: function(section, model) {
		build_model_structure(model);
		this.st_container = $("#st-container");
		this.st_textures = $("#st-textures");
		this.st_elements = $("#st-elements");
		return;
		// ensure element is clear
		section.children().remove();

		// top-level ul
		section.append(bld.elm("ul", {id: "st-container"}));

		this.st_container = $("#st-container");

		var checked = model.ambient_occlusion ? " checked" : "";
		pp_enabled = model.ambient_occlusion;

		this.st_container.append(
			bld.elm("li", {},
				bld.elm("div", {class: "level-header top-level-header"},
					bld.elm("p", {}, "Ambient Occlusion"),
					bld.elm("input " + checked, {id: "st-ao", type: "checkbox"})
				)
			)
		);

	},
	build_element: function(ul, element) {

	},
	build_face: function(ul, element, dir) {

	}
}