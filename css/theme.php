<?php

header('Content-Type: text/css');

$themes = [
	"dawn"   => ["#F8B195", "#F67280", "#C06C84", "#6C5B7B", "#355C7D"],
	"stark"  => ["#99B898", "#FECEA8", "#FF847C", "#E84A5F", "#2A363B"],
	"flora"  => ["#ACDBC9", "#DBEBC2", "#FDD2B5", "#F7A7A6", "#F48B94"],
	"slick"  => ["#A8A7A8", "#CC527A", "#E8175D", "#474747", "#363636"],
	"vivid"  => ["#A6206A", "#EC1C4B", "#F16A43", "#F7D969", "#2F9395"],
	"summer" => ["#E1F5C4", "#ECE473", "#F9D423", "#F6903D", "#F05053"],
	"chill"  => ["#E5EEC1", "#A2D4AB", "#3EACA8", "#547A82", "#5A5050"],
	"pale"   => ["#EF4566", "#F69A9A", "#F9CDAE", "#C8C8A9", "#83AE9B"]
];

$default = "chill";

$theme = isset($_GET["theme"]) ? $_GET["theme"] : $default;
$section = isset($_GET["section"]) ? $_GET["section"] : "app";

$css_file = "css/$section.css";

if (!file_exists($css_file)) {
	$css_file = "../$css_file";
}

$css = file_get_contents($css_file);

for ($i = 0; $i < count($themes[$default]); $i++) {
	$find = $themes[$default][$i];
	$replace = $themes[$theme][$i];
	$css = str_replace($find, $replace, $css);
}

echo $css;