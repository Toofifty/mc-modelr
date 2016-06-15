mc-modelr
=========

Web-based Minecraft (JSON) modelling tool

Created using: Sass, jQuery, THREE.js and js-cookies

Features
========

- Build model from JSON
- Display 3D model
	- Right click to rotate
	- Scroll to zoom
	- Hover and click to select elements
- Edit model through JSON, applying changes
- Load textures from server
- Structure builder for editing elements
- 3D editing handles (resizing)
- Collapsible editor panels and sections
- Choice of theme
- Keyboard shortcuts:
	- WASD to rotate
	- QE to zoom
	- L to toggle pan mode
	- G to toggle grid
	- K to reset camera
	- O to toggle ortho mode
	- P to toggle AO (without changing model JSON)

Planned features
================

#### Pre-backend
- Element position handle
- New element hotkey
- Element rotation
	- Rotation structure
	- Rotation handle
- Hotkey guide
- About page

#### Post-backend
- Add user accounts
- Upload, add/remove textures to database
- Models stored on server, accessible through url params
	- Public/private models
	- Other users cannot edit these models, but can copy
- Texture edit mode
	- Draw textures directly onto faces
	- Color picker and palette

#### Post- Feature-complete
- Model share page
	- Render ISO model image for preview
	- Like/dislike models