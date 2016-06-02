/*
	Scripts for controlling the UI/controls
*/

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
		if ($(this).hasClass("hidden")) { return; }
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
		if ($(this).hasClass("hidden")) { return; }
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
			resize.removeClass("hidden");
		} else {
			panel.css("left", "-" + panel.css("width"));
			resize.addClass("hidden");
		}
		Cookies.set("control-hidden", !show);
	}

	var show_code_panel = function(show) {
		var panel = $("#code-panel");
		var resize = $("#code-resize");
		if (show) {
			panel.css("right", "0px");
			resize.removeClass("hidden");
		} else {
			panel.css("right", "-" + panel.css("width"));
			resize.addClass("hidden");
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
});