/*
	Code area syntax highlighter
*/

var model = null;

$(document).ready(function() {

	/* allow extra functionality in the textarea
	   can be used to do keyboard shortcuts */
	$("textarea").keydown(function(e) {

		var area = this;

		var insert_chars = function(chars, prevent=true) {
			var start = area.selectionStart;
			var end = area.selectionEnd;
			var value = $(area).val();

			// set textarea value to: text before caret + tab + text after caret
			$(area).val(value.substring(0, start) + chars + value.substring(end));

			// put caret at right position again (add one for the tab)
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

	var update_model = function() {
		var json = $("#code-text").val();
		/* store current text in user's cookies */
		Cookies.set("json-text", json);

		// give me all the errors
		model = new Model(JSON.parse(json));

		// try {
		// 	model = new Model(JSON.parse(json));
		// 	// show valid JSON in UI
		// } catch (e) {
		// 	console.log("Error building model.");
		// 	console.log(e);
		// 	// show invalid JSON in UI
		// }
	}

	// $("#code-text").keyup(function(e) {
	// 	update_model();
	// });

	$("#refresh-model").click(update_model);

});