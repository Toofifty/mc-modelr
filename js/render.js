/*
	THREE.js renderer and scene controller
*/


$(document).ready(function() {
	var rotation = {x: 0, y: 0, z: 0};

	var render_model = function(model) {
		if (model == null) {
			return;
		}

		render_model(model.parent);
		for (element in model.elements) {
			render_element(element);
		}
	}

	var render_element = function(element) {
		// if (!element.in_scene) {
		// 	scene.add(element.box);
		// 	element.in_scene = true;
		// }

		// TODO set texture


	}

	var canvas = $("#canvas");

	var scene = new THREE.Scene();
	var camera = new THREE.PerspectiveCamera(75, canvas.innerWidth() / canvas.innerHeight(), 0.1, 1000);

	var renderer = new THREE.WebGLRenderer();
	renderer.setSize(canvas.innerWidth(), canvas.innerHeight());
	renderer.setClearColor($("body").css("background"));
	canvas.append(renderer.domElement);

	var geometry = new THREE.BoxGeometry(1, 1, 1);
	var material = new THREE.MeshBasicMaterial({color: 0x00ff00});
	var cube = new THREE.Mesh(geometry, material);
	scene.add(cube);

	camera.position.z = 5;

	var render = function() {
		requestAnimationFrame(render);
		render_model(model);
		renderer.render(scene, camera);
	}
	render();

	canvas.scroll(function(e) {
		e.preventDefault();
		camera.position.z += 1;
	});

	$(document).on("mousewheel", function(e) {
		e.preventDefault();
		camera.position.z += e.originalEvent.wheelDelta / 100;
		if (camera.position.z > 10) {
			camera.position.z = 10;
		} else if (camera.position.z < 1) {
			camera.position.z = 1;
		}
	});

});
