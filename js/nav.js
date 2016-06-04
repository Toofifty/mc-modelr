/*
	Navigation Scripts
*/

$(document).ready(function() {

	if (Cookies.get("slim-header") == "true") {
		$("#header").addClass("slim-header");
		$("#app").addClass("app-slim");
	}

	/* toggle slim header */
	$("#slim-toggle").click(function() {
		$("#header").toggleClass("slim-header");
		$("#app").toggleClass("app-slim");

		Cookies.set("slim-header", $("#header").hasClass("slim-header"));
	});

	set_theme = function(theme) {
		var already_theme = Cookies.get("theme") == theme;
		Cookies.set("theme", theme);
		$(".theme li").removeClass("selected");
		$(".theme li:contains('" + theme + "')").addClass("selected");
		return !already_theme;
	}

	$(".theme li").click(function() {
		if (set_theme($(this).html())) {
			location.reload();
		}
	});

	var theme = Cookies.get("theme");
	set_theme(theme ? theme : "dawn");
});

function clear_all_cookies() {
	$.each(Cookies.get(), function(key, value) {
		Cookies.remove(key);
	});
	console.log("Cookies cleared.");
}