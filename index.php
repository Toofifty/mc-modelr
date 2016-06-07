<!DOCTYPE html>
<html>
	<head>
		<title>mcmodelr &middot; JSON model maker</title>
		<?php
			$sections = ["nav", "app"];
			$theme = isset($_COOKIE["theme"]) ? $_COOKIE["theme"] : "slick";

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

		<script src="js/build.js"></script>
		<script src="js/edit.js"></script>
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
				<h2 class="logo"><img src="img/logo-min-120.png" width="40" height="40"/></h2>
				<ul class="nav">
					<li class="selected">Model</li>
					<li>Texture</li>
					<li>About</li>
				</ul>
			</div><div class="right">
				<ul id="theme-select" class="theme">
					<li>dawn</li>
					<li>stark</li>
					<li>flora</li>
					<li>slick</li>
					<li>vivid</li>
					<li>summer</li>
					<li class="selected">chill</li>
				</ul>
				<p class="shade-1"></p><p class="shade-2"></p><p class="shade-3"></p><p class="shade-4"></p><p class="shade-5"></p>
				<svg id="slim-toggle" class="icon">
					<use xlink:href="icons.svg#icon-down"/>
				</svg>
			</div>
		</div>

		<div id="app" class="app">
			<div id="left-panel" class="side-panel side-panel-left">
				<div class="panel-container">
					<div id="structure" class="section">
						<h4 id="structure-title">Structure</h4>
						<div id="model-structure" class="section-content">
						</div>
					</div>
				</div>
				<svg id="left-resize" class="icon resizer resizer-left">
					<use xlink:href="icons.svg#icon-down"></use>
				</svg>
			</div>

			<div id="canvas" class="canvas-container"></div>

			<div id="right-panel" class="side-panel side-panel-right">
				<div class="panel-container">

					<div id="model-opts" class="section">
						<div class="section-content">
							<ul id="code-opts" class="section-opts">
								<li id="refresh-model" class="button">
									<svg class="icon">
										<use xlink:href="icons.svg#icon-model-refresh" />
									</svg>
								</li>
								<li id="auto-refresh" class="button disabled">
									<svg class="icon">
										<use xlink:href="icons.svg#icon-toggle-auto-refresh"/>
									</svg>
								</li>
								<li id="copy-model" class="button disabled">
									<svg class="icon">
										<use xlink:href="icons.svg#icon-copy-clipboard"/>
									</svg>
								</li>
							</ul>
						</div>
					</div>

					<div id="code" class="section">
						<h4 id="code-title">JSON</h4>
						<div class="section-content">
							<textarea id="code-text"></textarea>
						</div>
					</div>
				</div>
				<svg id="right-resize" class="icon resizer resizer-right">
					<use xlink:href="icons.svg#icon-down"></use>
				</svg>
			</div>
		</div>

		<div id="tooltip" class="hidden"></div>
	</body>
</html>