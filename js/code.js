/*
	Code area syntax highlighter
*/

var build_structure;

$(document).ready(function() {

	/*
		Build the structure of the model into the
		structure section in the editor
	*/
	build_model_structure = function(model) {
		var section = $("#structure > .section-content");
		// ensure element is clear
		section.children().remove();

		// create ul to contain top-level nodes
		section.append("<ul id='st-container'></ul>");
		var st_container = $("#st-container");

		// string to add if AO is on
		var checked = model.ambient_occlusion ? " checked" : "";
		pp_enabled = model.ambient_occlusion;

		// append AO toggle
		st_container.append(
			"<li>"
		+		"<div class='level-header top-level-header'>"
		+			"<p>Ambient Occlusion</p>"
		+			"<input id='st-ao' type='checkbox'" + checked + ">"
		+		"</div>"
		+	"</li>"
		);

		// add toggle click function
		$("#st-ao").click(function() {
			// TODO: update model
			pp_enabled = !pp_enabled;
		});

		// append texture header and list
		st_container.append(
			"<li>"
		+		"<div id='st-textures-header' class='level-header top-level-header'>"
		+			"<p>Textures</p>"
		+			html_icon("down", "", "toggle-collapse")
		+		"</div>"
		+		"<ul id='st-textures' class='level-list collapsed'></ul>"
		+	"</li>"
		);

		// texture list
		var st_textures = $("#st-textures");

		// add toggle function
		$("#st-textures-header").click(function() {
			if ($(this).attr("isopen") == "true") {
				$(this).attr("isopen", false);
				st_textures.addClass("collapsed");
			} else {
				$(this).attr("isopen", true);
				st_textures.removeClass("collapsed");
			}
		});

		// create a HTML texture li
		var texture_li = function(key, val, is_input=false) {
			var meat = is_input ? ""
				+ html_icon("plus", "", "action button")
				+ "<input type='text' class='input-label input-label-1-button' placeholder='" + key + "'>"
				+ "<input type='text' class='input' placeholder='" + val + "'>"
				: ""
				+ html_icon("minus", "", "action button")
				+ "<p class='label label-1-button'>" + key + "</p>"
				+ "<input type='text' class='input' value='" + val + "'/>";

			return	"<li>"
				+		"<div class='level-header'>"
				+			meat
				+		"</div>"
				+	"</li>";
		}

		// populate textures
		for (texture_key in model.texture_dict) {
			st_textures.append(texture_li(texture_key, model.texture_dict[texture_key]));
		}

		// add empty texture
		st_textures.append(texture_li("texture key", "texture path", true));

		// append element header and list
		st_container.append(
			"<li>"
		+		"<div id='st-elements-header' class='level-header top-level-header'>"
		+			"<p>Elements</p>"
		+			html_icon("down", "", "toggle-collapse")
		+		"</div>"
		+		"<ul id='st-elements' class='level-list collapsed'></ul>"
		+	"</li>"
		);

		// elements list
		var st_elements = $("#st-elements");

		// add toggle function
		$("#st-elements-header").click(function() {
			if ($(this).attr("isopen") == "true") {
				$(this).attr("isopen", false);
				st_elements.addClass("collapsed");
			} else {
				$(this).attr("isopen", true);
				st_elements.removeClass("collapsed");
			}
		});

		for (element_key in model.elements) {
			build_element_structure(model.elements[element_key], st_elements);
		}

		// append empty element
		st_elements.append(
			"<li>"
		+		"<div class='level-header'>"
		+			html_icon("plus", "", "action action-double button")
		+			"<p class='label label-id'>" + model.free_id() + "</p>"
		+			"<input type='text' class='input input-label input-label-1-button' placeholder='new element'>"
		+		"</div>"
		+	"</li>"
		);
	}

	var build_element_structure = function(element, ul) {
		var id = "elem-" + element.id;

		// append name
		ul.append(
			"<li>"
		+		"<div id='" + id + "-header' class='level-header'>"
		+			html_icon("pencil", id + "-edit", "action button")
		+			html_icon("minus", id + "-remove", "action button")
		+			"<p class='label label-id'>" + element.id + "</p>"
		+			"<p class='label label-elem'>" + element.name + "</p>"
		+			html_icon("down", "", "toggle-collapse")
		+		"</div>"
		+		"<ul id='st-" + id + "' class='level-list collapsed'></ul>"
		+	"</li>"
		);

		var st_element = $("#st-" + id);

		// add element toggle
		$("#" + id + "-header").click(function() {
			if ($(this).attr("isopen") == "true") {
				$(this).attr("isopen", false);
				st_element.addClass("collapsed");
			} else {
				$(this).attr("isopen", true);
				st_element.removeClass("collapsed");
			}
		})
		// add 3D hover elements when hovered
		.mouseover(function() { element.on_hover(); })
		.mouseout(function() { element.off_hover(); });

		// append bounds
		st_element.append(
			"<li>"
		+		"<div class='level-header'>"
		+			"<p class='label'>Bounds</p>"
		+			"<div class='input input-flex'>"
		+				"<input type='number' value='" + element.from.x + "'>"
		+				"<input type='number' value='" + element.from.y + "'>"
		+				"<input type='number' value='" + element.from.z + "'>"
		+				"&middot;"
		+				"<input type='number' value='" + element.to.x + "'>"
		+				"<input type='number' value='" + element.to.y + "'>"
		+				"<input type='number' value='" + element.to.z + "'>"
		+			"</div>"
		+		"</div>"
		+	"</li>"
		);

		var checked = element.shade ? " checked" : "";

		// append shade
		st_element.append(
			"<li>"
		+		"<div class='level-header'>"
		+			"<p class='label'>Shade</p>"
		+			"<input type='checkbox'" + checked + ">"
		+		"</div>"
		+	"</li>"
		);

		// append rotation
		if (element.has_rotation) {

		} else {
			st_element.append(
				"<li>"
			+		"<div class='level-header'>"
			+			html_icon("plus", id + "-add-rotate", "action button-disabled")
			+			"<p class='label label-1-button'>Rotation</p>"
			+		"</div>"
			+	"</li>"
			);
		}

		// append faces header and list
		st_element.append(
			"<li>"
		+		"<div id='" + id + "-faces-header' class='level-header'>"
		+			"<p class='label'>Faces</p>"
		+			html_icon("down", id + "-faces-toggle", "toggle-collapse")
		+		"</div>"
		+		"<ul id='st-" + id + "-faces' class='level-list collapsed'>"
		+	"</li>"
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

		for (dir in element.faces) {
			build_face_structure(element, st_element_faces, dir);
		}
	}

	var build_face_structure = function(element, ul, dir) {
		var face = element.faces[dir];
		var id = "elem-" + element.id + "-face-" + dirs[dir];

		ul.append(
			"<li>"
		+		"<div id='" + id + "-header' class='level-header'>"
		+			html_icon("pencil", id + "-edit", "action button")
		+			html_icon("minus", id + "-remove", "action button")
		+			"<p class='label'>" + dirs[dir] + "</p>"
		+			html_icon("down", id + "-toggle", "toggle-collapse")
		+		"</div>"
		+		"<ul id='st-" + id + "' class='level-list collapsed'></ul>"
		+	"</li>"
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
			"<ul>"
		+		"<div class='level-header'>"
		+			"<p class='label'>UV</p>"
		+			"<div class='input input-flex'>"
		+				"<input type='number' value='" + face.uv_from.x + "'>"
		+				"<input type='number' value='" + face.uv_from.y + "'>"
		+				"&middot;"
		+				"<input type='number' value='" + face.uv_to.x + "'>"
		+				"<input type='number' value='" + face.uv_to.y + "'>"
		+			"</div>"
		+		"</div>"
		+	"</ul>"
		);

		// append texture str
		st_face.append(
			"<li>"
		+		"<div class='level-header'>"
		+			"<p class='label'>Texture</p>"
		+			"<input class='input' type='text' value='" + face.texture_str + "'>"
		+		"</div>"
		+	"</li>"
		);

		var cullface_options = "";
		for (d in dirs) {
			cullface_options += "<option value='" + dirs[d] + "'>" + dirs[d] + "</option>";
		}

		// append cullface
		st_face.append(
			"<li>"
		+		"<div class='level-header'>"
		+			"<p class='label'>Cullface</p>"
		+			"<select class='input'>"
		+				cullface_options
		+			"</select>"
		+		"</div>"
		+	"</li>"
		);

		// append rotation
		st_face.append(
			"<li>"
		+		"<div class='level-header'>"
		+			"<p class='label'>Rotation</p>"
		+			"<input class='input' type='range' value='" + element.rotation + "'>"
		+		"</div>"
		+	"</li>"
		);
	}

	/* allow extra functionality in the textarea
	   can be used to do keyboard shortcuts */
	$("textarea").keydown(function(e) {

		var area = this;

		var insert_chars = function(chars, prevent=true) {
			var start = area.selectionStart;
			var end = area.selectionEnd;
			var value = $(area).val();

			// set textarea value to: text before caret + char + text after caret
			$(area).val(value.substring(0, start) + chars + value.substring(end));

			// put caret at right position again
			area.selectionStart = area.selectionEnd = start + chars.length;

			if (prevent) { e.preventDefault(); }
		}

	    switch(e.keyCode) {
	    	// brace key
	    	case 219:
	    		insert_chars(e.shiftKey ? "{}" : "[]");
	    		break;
	    	// 9 (left bracket)
	    	case 57:
	    		if (e.shiftKey) { insert_chars("()"); }
	    		break;
	    	// quotes (not single quotes, could be apostrophes)
	    	case 222:
	    		if (e.shiftKey) { insert_chars('""'); }
	    		break;
	    	// tab
	    	case 9:
	    		insert_chars("    ");
	    		break;

	    	// default:
	    	// 	console.log(e.keyCode);
	    }
	});

	/* load text from cookies */
	var json = Cookies.get("json-text");
	$("#code-text").val(json ? json : JSON.stringify(sack_json, null, 4));
	update_model();

	// $("#code-text").keyup(function(e) {
	// 	update_model();
	// });

	$("#refresh-model").click(update_model);

});