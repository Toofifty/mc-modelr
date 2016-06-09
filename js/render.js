/*
	THREE.js renderer and scene controller
*/

var update_model;
var shades;
var pp_enabled;

$(document).ready(function() {
	var stop_hover = false;
	var show_wireframe = true;
	var ortho_cam = false;
	var wireframes = [];
	var md = false;

	// THREE.js variables
	var scene, camera, o_camera, raycaster, controls, o_controls, renderer;

	// postprocessing
	pp_enabled = false;
	var depth_material, effect_composer, depth_render_target, ssao_pass;

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
		if (cookie("json-text") == json) {
			return;
		}
		
		// set new json in cookies
		cookie("json-text", json);

		// remove old model from scene
		remove_model(model);
		model = new Model(JSON.parse(json));
		model.scene = scene;

		st_bld.build_model($("#structure > .section-content"), model);
		//build_model_structure(model);
		//model.build_structure();
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
		if (stop_hover) return;
		raycaster.setFromCamera(mouse, camera);
		var intersects = raycaster.intersectObjects(scene.children);
		model.ctrl.on_hover(intersects, mouse);
	}

	var init = function() {
		scene = new THREE.Scene();
		camera = new THREE.PerspectiveCamera(75, canvas.innerWidth() / canvas.innerHeight(), 0.1, 1000);
		o_camera = new THREE.OrthographicCamera(canvas.innerWidth() / -100, canvas.innerWidth() / 100, 
			canvas.innerHeight() / 100, canvas.innerHeight() / -100, 0.1, 1000);
		raycaster = new THREE.Raycaster();
		camera.position.set(8, 8, 80);
		o_camera.position.set(8, 8, 80);

		controls = new THREE.OrbitControls(camera, canvas.get(0));
		controls.noKeys = true;
		controls.noPan = true;

		o_controls = new THREE.OrbitControls(o_camera, canvas.get(0));
		o_controls.noKeys = true;

		renderer = new THREE.WebGLRenderer({antialias: true});
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

		var dense_wireframe = new THREE.GridHelper(8, 1, shades.dark, shades.dark);
		dense_wireframe.position.set(8, 0, 8);
		scene.add(dense_wireframe);

		var sparse_wireframe = new THREE.GridHelper(40, 8, shades.dark, shades.dark);
		sparse_wireframe.position.set(8, 0, 8);
		scene.add(sparse_wireframe);

		wireframes.push(dense_wireframe);
		wireframes.push(sparse_wireframe);

	}

	var init_postprocessing = function() {
		var render_pass = new THREE.RenderPass(scene, camera);

		depth_material = new THREE.MeshDepthMaterial();
		depth_material.depthPacking = THREE.RGBADepthPacking;
		depth_material.blending = THREE.NoBlending;

		depth_render_target = new THREE.WebGLRenderTarget(
			canvas.innerWidth(), canvas.innerHeight(),
			{minFilter: THREE.LinearFilter, magFilter: THREE.LinearFilter, antialias: true}
		);

		// setup SSAO pass
		ssao_pass = new THREE.ShaderPass(THREE.SSAOShader);
		ssao_pass.renderToScreen = true;

		ssao_pass.uniforms["tDepth"].value = depth_render_target.texture;
		ssao_pass.uniforms["size"].value.set(canvas.innerWidth() * 2, canvas.innerHeight());
		ssao_pass.uniforms["cameraNear"].value = camera.near;
		ssao_pass.uniforms["cameraFar"].value = camera.far;
		ssao_pass.uniforms["onlyAO"].value = 0;
		ssao_pass.uniforms["aoClamp"].value = 0.5;
		ssao_pass.uniforms["lumInfluence"].value = 0.1;

		effect_composer = new THREE.EffectComposer(renderer);
		effect_composer.addPass(render_pass);
		effect_composer.addPass(ssao_pass);
	}

	var on_resize = function() {
		var width = canvas.innerWidth();
		var height = canvas.innerHeight();

		camera.aspect = width / height;
		camera.updateProjectionMatrix();
		renderer.setSize(width, height);
	}

	/*
		Render the entire scene each frame
	*/
	var render = function() {
		requestAnimationFrame(render);

		// try to update model
		// will render even without this
		if (model !== null) {
			if (model.scene == null) model.scene = scene;
			model.render(scene);
			get_hover();
		}

		if (ortho_cam) {
			renderer.render(scene, o_camera);
			return;
		}

		if (pp_enabled && false) {
			scene.overrideMaterial = depth_material;
			renderer.render(scene, camera, depth_render_target, true);

			scene.overrideMaterial = null;
			effect_composer.render();
		} else {
			renderer.render(scene, camera);
		}
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
	var mouse = {x: 0, y: 0, down: false}
	// canvas to bind renderer to
	var canvas = $("#canvas");

	init();
	init_postprocessing();
	render();

	// update the mouse vector for hover information
	canvas.mousemove(function(e) {
		mouse.x = (e.offsetX / canvas.innerWidth()) * 2 - 1;
		mouse.y = -(e.offsetY / canvas.innerHeight()) * 2 + 1;
	});

	canvas.mousedown(function(e) {
		if (e.button == 0) mouse.down = true;
	}).mouseup(function(e) {
		if (e.button == 0) mouse.down = false;
	})

	// editor keybinds
	$(window).keydown(function(e) {
		switch(e.keyCode) {
			case 219: // [
				stop_hover = !stop_hover;
				console.log("toggle stop_hover");
				break;
			case 80: // p
				pp_enabled = !pp_enabled;
				console.log("toggle pp_enabled");
				break;
			case 71: // g
				if (show_wireframe) {
					show_wireframe = false;
					for (i in wireframes) scene.remove(wireframes[i]);
				} else {
					show_wireframe = true;
					for (i in wireframes) scene.add(wireframes[i]);
				}
				console.log("toggle wireframe");
				break;
			case 79: // o
				ortho_cam = !ortho_cam;
				console.log("toggle ortho_cam");
				break;
			case 73: // i
				o_camera.position.set(80, 80, 80);
				o_camera.lookAt(8, 8, 8);
				o_camera.updateProjectionMatrix();
				console.log("set iso camera");
				break;
			case 76: // l
				controls.noPan = !controls.noPan;
				console.log("toggle controls.noPan");
				break;
			case 75: // k
				controls.reset();
				console.log("reset camera");
				break;
			default:
				console.log(e.keyCode);
		}
	});

	$(window).on("resize", on_resize);
});
