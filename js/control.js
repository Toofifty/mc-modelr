/*
	Scripts for controlling the UI/controls
*/

// globals for utility use
var create_tooltip;
var clear_tooltip;

$(document).ready(function() {
	/*
		PANEL RESIZING
	*/

	var drag = false;

	/* resize left control panel to previous value */
	var control_width;
	if (control_width = Cookies.get("control-width")) {
		$("#control-panel").css("width", control_width);
	}

	/* resize right code panel to previous value */
	var code_width;
	if (code_width = Cookies.get("code-width")) {
		$("#code-panel").css("width", code_width);
	}

	// On mousedown, begin dragging the control panel
	$("#control-resize").mousedown(function(e) {
		// don't drag if the panel is hidden
		if ($(this).hasClass("hidden")) return;
		e.preventDefault();
		drag = true;
		// remove transition
		$("#control-panel").css("transition", "none");
		$(this).addClass("dragged");

		// update panel width on mousemove
		$(document).mousemove(function(e) {
			$("#control-panel").css("width", e.pageX);
			Cookies.set("control-width", e.pageX);
		});
	});

	$("#code-resize").mousedown(function(e) {
		if ($(this).hasClass("hidden")) return;
		e.preventDefault();
		drag = true;
		$("#code-panel").css("transition", "none");
		$(this).addClass("dragged");

		$(document).mousemove(function(e) {
			$("#code-panel").css("width", window.innerWidth - e.pageX);
			Cookies.set("code-width", window.innerWidth - e.pageX);
		});
	});

	$("#code-resize").click(function(e) {
		if (drag) { e.preventDefault() };
	});

	/* deactivate either resize action */
	$(document).mouseup(function(e) {
		if (drag) {
			$(document).unbind("mousemove");

			drag = false;

			// re-enable transitions for toggle anim
			$("#control-panel").css("transition", "0.5s");
			$("#code-panel").css("transition", "0.5s");

			$("#control-resize").removeClass("dragged");
			$("#code-resize").removeClass("dragged");
		}
	});

	/*
		TOGGLE CONTROL/CODE PANELS
	*/

	var show_control_panel = function(show) {
		var panel = $("#control-panel");
		var resize = $("#control-resize");
		if (show) {
			panel.css("left", "0px");
			resize.removeClass("toggled");
		} else {
			panel.css("left", "-" + panel.css("width"));
			resize.addClass("toggled");
		}
		Cookies.set("control-hidden", !show);
	}

	var show_code_panel = function(show) {
		var panel = $("#code-panel");
		var resize = $("#code-resize");
		if (show) {
			panel.css("right", "0px");
			resize.removeClass("toggled");
		} else {
			panel.css("right", "-" + panel.css("width"));
			resize.addClass("toggled");
		}
		Cookies.set("code-hidden", !show);
	}

	show_control_panel(Cookies.get("control-hidden") != "true");
	show_code_panel(Cookies.get("code-hidden") != "true");

	/* toggle right code panel */
	$("#code-resize").click(function() {
		show_code_panel(Cookies.get("code-hidden") == "true");
	});

	/* toggle right code panel */
	$("#control-resize").click(function() {
		show_control_panel(Cookies.get("control-hidden") == "true");
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