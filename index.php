<!DOCTYPE html>
<html>
	<head>
		<title>mcmodelr &middot; JSON model maker</title>
		<?php
			$sections = ["nav", "app"];
			$theme = isset($_COOKIE["theme"]) ? $_COOKIE["theme"] : "dawn";

			foreach ($sections as $section) {
				echo '<link rel="stylesheet" type="text/css" href="css/theme.php?section='.$section.'&theme='.$theme.'" />';
			}
		?>
		<script src="js/lib/jquery.min.js"></script>
		<script src="js/lib/js.cookie.js"></script>
		<script src="js/lib/three.js"></script>
		<script src="js/lib/OrbitControls.js"></script>
		
		<script src="js/lib/SSAOShader.js"></script>
		<script src="js/lib/CopyShader.js"></script>
		<script src="js/lib/EffectComposer.js"></script>
		<script src="js/lib/RenderPass.js"></script>
		<script src="js/lib/ShaderPass.js"></script>
		<script src="js/lib/MaskPass.js"></script>

		<script src="js/model.js"></script>
		<script src="js/render.js"></script>
		<script src="js/nav.js"></script>
		<script src="js/control.js"></script>
		<script src="js/code.js"></script>
		<script src="js/util.js"></script>

		<script src="models/sack.js"></script>
	</head>
	<body>
		<div id="header" class="header">
			<div class="left">
				<h2 class="logo">mcmodlr</h2>
				<ul class="nav">
					<li class="selected">View</li>
					<li>Create</li>
					<li>About</li>
				</ul>
			</div><div class="right">
				<ul class="theme">
					<li class="selected">dawn</li>
					<li>stark</li>
					<li>flora</li>
					<li>slick</li>
					<li>vivid</li>
					<li>summer</li>
					<li>chill</li>
				</ul>
				<p class="shade shade-1"></p><p class="shade shade-2"></p><p class="shade shade-3"></p><p class="shade shade-4"></p><p class="shade shade-5"></p>
				<svg id="slim-toggle" viewBox="0 0 306 306">
					<polygon points="153,58.65 0,211.65 35.7,247.35 153,130.05 270.3,247.35 306,211.65"/>
				</svg>
			</div>
		</div>

		<div id="app" class="app">
			<div id="control-panel">
				<div id="control">
					<p>Controls here</p>
				</div>
				<svg id="control-resize" viewBox="0 0 306 306">
					<polygon points="153,58.65 0,211.65 35.7,247.35 153,130.05 270.3,247.35 306,211.65"/>
				</svg>
			</div>
			<div id="canvas"></div>
			<div id="code-panel">
				<div id="code-container">
					<div id="code" class="section">
						<h4 id="code-title">Raw JSON</h4>
						<div class="content">
							<textarea id="code-text"></textarea>
							<ul id="code-opts" class="section-bottom-opts">
								<li id="refresh-model"><svg viewBox="0 0 408 408"><g><path d="M0,204c0,56.1,22.95,107.1,61.2,142.8L0,408h153V255l-56.1,56.1C68.85,285.6,51,247.35,51,204    c0-66.3,43.35-122.4,102-145.35v-51C66.3,30.6,0,109.65,0,204z M408,0H255v153l56.1-56.1C339.15,122.4,357,160.65,357,204    c0,66.3-43.35,122.4-102,145.35V402.9c86.7-22.95,153-102,153-196.351c0-56.1-22.95-107.1-61.2-142.8L408,0z"/></g></svg></li><li id="auto-refresh" class="disabled"><svg viewBox="0 0 436.05 436.05"><g><path d="M181.05,58.65v-51c-20.4,5.1-38.25,12.75-56.1,25.5L163.2,71.4C168.3,66.3,173.4,61.2,181.05,58.65z M0,35.7l61.2,61.2    C40.8,127.5,28.05,163.2,28.05,204c0,56.1,22.95,107.1,61.2,142.8L28.05,408h153V255l-56.1,56.1    c-28.05-25.5-45.9-63.75-45.9-107.1c0-25.5,5.1-48.45,17.85-71.4l206.55,206.55c-5.101,2.55-12.75,5.1-20.4,7.649v53.55    c20.4-5.1,38.25-12.75,56.1-25.5l61.2,61.2L433.5,402.9L30.6,2.55L0,35.7z M436.05,0h-153v153l56.1-56.1    c28.051,25.5,45.9,63.75,45.9,107.1c0,25.5-5.1,48.45-17.85,71.4l38.25,38.25c17.85-33.15,30.6-68.851,30.6-109.65    c0-56.1-22.95-107.1-61.2-142.8L436.05,0z"/></g></svg></li><li id="copy-model" class="disabled"><svg viewBox="0 0 52.54 52.54"><g><path d="M17.841,8.726h16.857c0.554,0,1-0.447,1-1V4.565h-4.429V2c0-1.104-0.896-2-2-2h-6c-1.104,0-2,0.896-2,2v2.565h-4.428     v3.161C16.841,8.279,17.288,8.726,17.841,8.726z"/><path d="M37.698,4.565v3.161c0,1.654-1.346,3-3,3H17.842c-1.654,0-3-1.346-3-3V4.565H6.27V48.54c0,2.209,1.791,4,4,4h32    c2.209,0,4-1.791,4-4V4.565H37.698z M41.269,47.54h-30V15.199h30V47.54z"/><rect x="16.697" y="20.308" width="19.117" height="4"/><rect x="16.791" y="28.402" width="19.117" height="4"/><rect x="16.885" y="36.499" width="7.752" height="4"/></g></svg></li>
							</ul>
						</div>
					</div>
					<div id="structure" class="section">
						<h4 id="structure-title">Object structure</h4>
						<div class="content"></div>
					</div>
				</div>
				<svg id="code-resize" viewBox="0 0 306 306">
					<polygon points="153,58.65 0,211.65 35.7,247.35 153,130.05 270.3,247.35 306,211.65"/>
				</svg>
			</div>
		</div>

		<div id="tooltip" class="hidden"></div>
	</body>
</html>