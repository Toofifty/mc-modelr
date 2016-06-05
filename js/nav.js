/*
	Navigation Scripts
*/

$(document).ready(function() {

	if (cookie("slim-header") == "true") {
		$("#header").addClass("slim-header");
		$("#app").addClass("app-slim");
	}

	/* toggle slim header */
	$("#slim-toggle").click(function() {
		$("#header").toggleClass("slim-header");
		$("#app").toggleClass("app-slim");

		cookie("slim-header", $("#header").hasClass("slim-header"));
	});

	set_theme = function(theme) {
		var already_theme = Cookies.get("theme") == theme;
		cookie("theme", theme);
		$(".theme li").removeClass("selected");
		$(".theme li:contains('" + theme + "')").addClass("selected");
		return !already_theme;
	}

	$(".theme li").click(function() {
		if (set_theme($(this).html())) {
			location.reload();
		}
	});

	var theme = cookie("theme");
	set_theme(theme ? theme : "dawn");
});

function clear_all_cookies() {
	$.each(cookie(), function(key, value) {
		del_cookie(key);
	});
	console.log("Cookies cleared.");
}