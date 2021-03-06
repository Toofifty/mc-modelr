var sack_json = {
	"ambientocclusion": true,
    "textures": {
        "main": "chocolate:blocks/sack",
        "particle": "chocolate:blocks/sack",
		"dark": "chocolate:blocks/sack_dark",
		"side": "chocolate:blocks/sack_side"
    },
	
	"elements": [
	{
		"__name": "bottom",
		"from": [ 4, 0, 4 ],
		"to": [ 12, 2, 12 ],
		"shade": true,
		"faces": {
			"down": {"uv":[4, 4, 12, 12], "texture": "#main"},
			"up": {"uv":[4, 4, 12, 12], "texture": "#dark"}
		}
	},
	{
		"__name": "west-side",
		"from": [ 2, 0, 2 ],
		"to": [ 4, 14, 14 ],
		"shade": true,
		"faces": {
			"down": {"uv":[0, 2, 2, 14], "texture": "#main"},
			"up": {"uv":[14, 2, 16, 14], "texture": "#main"},
			"north": {"uv":[12, 0, 14, 14], "texture": "#side"},
			"east": {"uv":[2, 0, 14, 14], "texture": "#dark"},
			"south": {"uv":[2, 0, 4, 14], "texture": "#side"},
			"west": {"uv":[2, 0, 14, 14], "texture": "#side"}
		}
	},
	{
		"__name": "east-side",
		"from": [ 12, 0, 2 ],
		"to": [ 14, 14, 14 ],
		"shade": true,
		"faces": {
			"down": {"uv":[14, 2, 16, 14], "texture": "#main"},
			"up": {"uv":[0, 2, 2, 14], "texture": "#main"},
			"north": {"uv":[2, 0, 4, 14], "texture": "#side"},
			"east": {"uv":[2, 0, 14, 14], "texture": "#side"},
			"south": {"uv":[12, 0, 14, 14], "texture": "#side"},
			"west": {"uv":[2, 0, 14, 14], "texture": "#dark"}
		}
	},
	{
		"__name": "north-side",
		"from": [ 4, 0, 2 ],
		"to": [ 12, 14, 4 ],
		"shade": true,
		"faces": {
			"down": {"uv":[4, 0, 12, 2], "texture": "#main"},
			"up": {"uv":[4, 0, 12, 2], "texture": "#main"},
			"north": {"uv":[4, 0, 12, 14], "texture": "#side"},
			"south": {"uv":[4, 0, 12, 14], "texture": "#dark"}
		}
	},
	{
		"__name": "south-side",
		"from": [ 4, 0, 12 ],
		"to": [ 12, 14, 14 ],
		"shade": true,
		"faces": {
			"down": {"uv":[4, 0, 12, 2], "texture": "#main"},
			"up": {"uv":[4, 0, 12, 2], "texture": "#main"},
			"north": {"uv":[4, 0, 12, 14], "texture": "#dark"},
			"south": {"uv":[4, 0, 12, 14], "texture": "#side"}
		}
	},
	{
		"__name": "north-edge",
		"from": [ 1, 11, 1 ],
		"to": [ 15, 14, 2 ],
		"shade": true,
		"faces": {
			"down": {"uv":[1, 1, 15, 2], "texture": "#dark"},
			"up": {"uv":[1, 1, 15, 2], "texture": "#main"},
			"north": {"uv":[1, 0, 15, 3], "texture": "#main"},
			"east": {"uv":[1, 0, 2, 3], "texture": "#main"},
			"west": {"uv":[1, 0, 2, 3], "texture": "#main"}
			
		}
	},
	{
		"__name": "south-edge",
		"from": [ 1, 11, 14 ],
		"to": [ 15, 14, 15 ],
		"shade": true,
		"faces": {
			"down": {"uv":[1, 1, 15, 2], "texture": "#dark"},
			"up": {"uv":[1, 1, 15, 2], "texture": "#main"},
			"south": {"uv":[1, 0, 15, 3], "texture": "#main"},
			"east": {"uv":[1, 0, 2, 3], "texture": "#main"},
			"west": {"uv":[1, 0, 2, 3], "texture": "#main"}
			
		}
	},
	{
		"__name": "west-edge",
		"from": [ 1, 11, 2 ],
		"to": [ 2, 14, 14 ],
		"shade": true,
		"faces": {
			"down": {"uv":[1, 1, 15, 2], "texture": "#dark"},
			"up": {"uv":[1, 2, 2, 14], "texture": "#main"},
			"west": {"uv":[1, 0, 15, 3], "texture": "#main"}
		}
	},
	{
		"__name": "east-edge",
		"from": [ 14, 11, 2 ],
		"to": [ 15, 14, 14 ],
		"shade": true,
		"faces": {
			"down": {"uv":[1, 1, 15, 2], "texture": "#dark"},
			"up": {"uv":[1, 2, 2, 14], "texture": "#main"},
			"east": {"uv":[1, 0, 15, 3], "texture": "#main"}
		}
	}
	]
}