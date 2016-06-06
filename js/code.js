/*
	Code area syntax highlighter
*/

var build_model_structure;

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
				+ html_icon("plus", "tex-new-add", "action button")
				+ "<input type='text' class='input-label input-label-1-button' placeholder='" + key + "'>"
				+ "<input type='text' class='input' placeholder='" + val + "'>"
				: ""
				+ html_icon("minus", "tex-" + key + "-remove", "action button")
				+ "<p class='label label-1-button'>" + key + "</p>"
				+ "<input type='text' class='input' value='" + val + "'/>";

			return	"<li id='" + (is_input ? "new-tex" : "tex-" + key) + "'>"
				+		"<div class='level-header'>"
				+			meat
				+		"</div>"
				+	"</li>";
		}

		// populate textures
		for (texture_key in model.texture_dict) {
			st_textures.append(texture_li(texture_key, model.texture_dict[texture_key]));

			// activate remove buttons
			$("#tex-" + texture_key + "-remove").click(function() {
				var key = $(this).attr("id").split("-", 2)[1];
				model.remove_texture(key);
			});

			// activate text area auto updater
			$("#tex-" + texture_key + " input").keyup(function() {
				var key = $(this).parent().parent().attr("id").split("-", 2)[1];
				model.edit_texture(key, $(this).val());
			});
		}

		// add empty texture
		st_textures.append(texture_li("texture key", "texture path", true));

		// activate empty texture
		$("#tex-new-add").click(function() {
			var key = $(this).next().val();
			var path = $(this).next().next().val();
			model.add_texture(key, path);
		});

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
			st_bld.add_element(model.elements[element_key]);
		}

		// append empty element
		st_elements.append(
			"<li>"
		+		"<div id='elem-add' class='level-header'>"
		+			html_icon("plus", "add-element", "action action-double button")
		+			"<p class='label label-id'>" + model.free_id() + "</p>"
		+			"<input type='text' class='input input-label input-label-1-button' placeholder='new element'>"
		+		"</div>"
		+	"</li>"
		);

		$("#add-element").click(function() {
			model.add_element($(this).next().next().val());
		});
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
	var json = cookie("json-text");
	$("#code-text").val(json ? json : JSON.stringify(sack_json, null, 4));
	update_model();

	// $("#code-text").keyup(function(e) {
	// 	update_model();
	// });

	$("#refresh-model").click(update_model);

	$(".side-panel").keydown(function(e) {
		e.stopPropagation();
	});

});