<?php

error_reporting(E_ERROR);
ini_set('display_errors', true);

$configFile = "scream-settings.json";

if (isset($_POST['action'])) {

	switch ($_POST['action']) {

		case 'load' :
			load();
			break;

		case 'save' :
			save($_POST['settings']);
			break;
	}
}

function load() {

	global $configFile;

	echo file_get_contents($configFile);
}

function save($settings) {

	global $configFile;
	echo file_put_contents($configFile, json_encode($settings)) or die("Error opening output file");
}
?>
