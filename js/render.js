/*
	THREE.js renderer and scene controller
*/

var update_model;
var shades;

$(document).ready(function() {
	var stop_hover = false;

	/*
		Update the model with JSON that is stored in the
		#code-text textarea element.

		Stores the JSON in cookies and removes all previous
		model's elements from the scene before creating an
		entirely new model.
	*/
	update_model = function() {
		// get JSON text from textarea
		var json = $("#code-text").val();

		// abort if not change
		if (Cookies.get("json-text") == json) {
			return;
		}
		
		// set new json in cookies
		Cookies.set("json-text", json);

		// remove old model from scene
		remove_model(model);
		model = new Model(JSON.parse(json));
	}

	/*
		Remove a model's elements (and it's parents', recursively) 
		from the scene.
	*/
	var remove_model = function(model) {
		if (model == null) {
			return;
		}

		remove_model(model.parent);
		for (i in model.elements) {
			scene.remove(model.elements[i].box);
		}
	}

	/*
		Calculate which three.js objects are under the cursor,
		and send the list to the model to handle hover events.
	*/
	var get_hover = function() {
		if (stop_hover) { return; }
		raycaster.setFromCamera(mouse, camera);
		var intersects = raycaster.intersectObjects(scene.children);
		model.on_hover(intersects);
	}

	/*
		Render the entire scene each frame
	*/
	var render = function() {
		requestAnimationFrame(render);
		if (model != null) {
			model.render(scene);
			get_hover();
		}
		renderer.render(scene, camera);
	}

	// global shades
	shades = {
		lightest: $(".shade-1").css("background-color"),
		light: $(".shade-2").css("background-color"),
		mid: $(".shade-3").css("background-color"),
		dark: $(".shade-4").css("background-color"),
		darkest: $(".shade-5").css("background-color"),
	};

	// mouse vector for hovering
	var mouse = new THREE.Vector3(0, 0);
	// canvas to bind renderer to
	var canvas = $("#canvas");

	// THREE.js vars
	var scene = new THREE.Scene();
	var camera = new THREE.PerspectiveCamera(75, canvas.innerWidth() / canvas.innerHeight(), 0.1, 1000);
	var raycaster = new THREE.Raycaster();
	camera.position.set(8, 8, 80);

	var controls = new THREE.OrbitControls(camera, canvas.get(0));

	var renderer = new THREE.WebGLRenderer();
	renderer.setSize(canvas.innerWidth(), canvas.innerHeight());
	renderer.setClearColor(shades.darkest);
	canvas.append(renderer.domElement);

	// rendering lights
	var light = new THREE.DirectionalLight("#FFF", 0.7);
	var hemi = new THREE.HemisphereLight("#FFF", "#AAA", 1);
	light.position.set(16, 16, 16);
	hemi.position.set(0, 500, 0);
	scene.add(light);
	scene.add(hemi);

	// dense (16x16) wireframe for underneath the model
	// specifies the default resolution
	var dense_wireframe = new THREE.Mesh(
		new THREE.PlaneGeometry(16, 16, 16, 16),
		new THREE.MeshBasicMaterial({
			color: shades.lightest, wireframe: true
		})
	);
	dense_wireframe.rotation.x = -Math.PI / 2;
	dense_wireframe.position.set(8, -0.01, 8);
	scene.add(dense_wireframe);

	// sparse (5x5) wireframe for under and around the model
	// specifies minecraft block sizes
	var sparse_wireframe = new THREE.Mesh(
		new THREE.PlaneGeometry(80, 80, 5, 5),
		new THREE.MeshBasicMaterial({
			color: shades.light, wireframe: true
		})
	);
	sparse_wireframe.rotation.x = -Math.PI / 2;
	sparse_wireframe.position.set(8, -0.01, 8);
	scene.add(sparse_wireframe);

	render();

	// update the mouse vector for hover information
	canvas.mousemove(function(e) {
		mouse.x = (e.offsetX / canvas.innerWidth()) * 2 - 1;
		mouse.y = -(e.offsetY / canvas.innerHeight()) * 2 + 1;
	});

	// debug keybinds
	$(document).keydown(function(e) {
		if (e.keyCode == 219) {
			stop_hover = !stop_hover;
			console.log("toggle stop_hover");
		}
	});
});
