/*
	Scripts for leftling the UI/lefts
*/

// globals for utility use
var create_tooltip;
var clear_tooltip;

$(document).ready(function() {
	/*
		PANEL RESIZING
	*/

	var drag = false;

	/* resize left left panel to previous value */
	var left_width;
	if (left_width = Cookies.get("left-width")) {
		$("#left-panel").css("width", left_width);
	}

	/* resize right right panel to previous value */
	var right_width;
	if (right_width = Cookies.get("right-width")) {
		$("#right-panel").css("width", right_width);
	}

	// On mousedown, begin dragging the left panel
	$("#left-resize").mousedown(function(e) {
		// don't drag if the panel is hidden
		if ($(this).hasClass("hidden")) return;
		e.preventDefault();
		drag = true;
		// remove transition
		$("#left-panel").css("transition", "none");
		$(this).addClass("dragged");

		// update panel width on mousemove
		$(document).mousemove(function(e) {
			$("#left-panel").css("width", e.pageX);
			Cookies.set("left-width", e.pageX);
		});
	});

	$("#right-resize").mousedown(function(e) {
		if ($(this).hasClass("hidden")) return;
		e.preventDefault();
		drag = true;
		$("#right-panel").css("transition", "none");
		$(this).addClass("dragged");

		$(document).mousemove(function(e) {
			$("#right-panel").css("width", window.innerWidth - e.pageX);
			Cookies.set("right-width", window.innerWidth - e.pageX);
		});
	});

	$("#right-resize").click(function(e) {
		if (drag) { e.preventDefault() };
	});

	/* deactivate either resize action */
	$(document).mouseup(function(e) {
		if (drag) {
			$(document).unbind("mousemove");

			drag = false;

			// re-enable transitions for toggle anim
			$("#left-panel").css("transition", "0.5s");
			$("#right-panel").css("transition", "0.5s");

			$("#left-resize").removeClass("dragged");
			$("#right-resize").removeClass("dragged");
		}
	});

	/*
		TOGGLE left/right PANELS
	*/

	var show_left_panel = function(show) {
		var panel = $("#left-panel");
		var resize = $("#left-resize");
		if (show) {
			panel.css("left", "0px");
			resize.removeClass("resizer-left-toggled");
		} else {
			panel.css("left", "-" + panel.css("width"));
			resize.addClass("resizer-left-toggled");
		}
		Cookies.set("left-hidden", !show);
	}

	var show_right_panel = function(show) {
		var panel = $("#right-panel");
		var resize = $("#right-resize");
		if (show) {
			panel.css("right", "0px");
			resize.removeClass("resizer-right-toggled");
		} else {
			panel.css("right", "-" + panel.css("width"));
			resize.addClass("resizer-right-toggled");
		}
		Cookies.set("right-hidden", !show);
	}

	show_left_panel(Cookies.get("left-hidden") != "true");
	show_right_panel(Cookies.get("right-hidden") != "true");

	/* toggle right right panel */
	$("#right-resize").click(function() {
		show_right_panel(Cookies.get("right-hidden") == "true");
	});

	/* toggle right right panel */
	$("#left-resize").click(function() {
		show_left_panel(Cookies.get("left-hidden") == "true");
	});

	/*
		SECTION TOGGLE
	*/

	$(".section h4").click(function() {
		$(this).parent().toggleClass("hidden-section");
	});

	/*
		TOOLTIP TEXTS
	*/
	var tooltips = {
		// id : [text, custom?, title],
		"code-title": ["Raw code of the current model"],
		"structure-title": ["Object element structure"],
		"refresh-model": ["Update model from code"],
		"auto-refresh": ["Toggle to refresh the model automatically"],
		"copy-model": ["Copy JSON to clipboard"],
		"theme-select": ["Select theme <br/>(refreshes the page)"]
	}

	var active_tooltip = false;

	create_tooltip = function(text, custom=false, title=null) {
		if (active_tooltip) return;
		$("#tooltip").removeClass("hidden");

		$("#tooltip").append(
			(title != null ? "<h4>" + title + "</h4>" : "")
			+ (custom ? text : "<p>" + text + "</p>")
		);

		$(document).mousemove(function(e) {
			$("#tooltip").css("top", e.pageY + 16);
			$("#tooltip").css("left", e.pageX + 16);
		});

		active_tooltip = true;
	}

	clear_tooltip = function() {
		if (!active_tooltip) return;

		$("#tooltip").children().remove();
		$("#tooltip").addClass("hidden");

		$(document).unbind("mousemove");

		active_tooltip = false;
	}

	// set tooltips
	for (key in tooltips) {
		$("#" + key).hover(function() {
			info = tooltips[$(this).attr("id")];
			if (info.length > 2) {
				create_tooltip(info[0], info[1], info[2]);
			} else if (info.length > 1) {
				create_tooltip(into[0], info[1]);
			} else {
				create_tooltip(info[0]);
			}
		}, clear_tooltip);
	}
});