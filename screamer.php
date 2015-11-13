<?php

error_reporting(E_ERROR);
ini_set('display_errors', true);

require "sonos.controller.php";

if (isset($_POST['action'])) {

  $IP_sonos = $_POST['IP'];
  
	switch ($_POST['action']) {

		case 'play' :
			play($IP_sonos);
			break;

		case 'stop' :
			stop($IP_sonos);
			break;

		case 'pause' :
			pause($IP_sonos);
			break;

		case 'current' :
			getCurrent($IP_sonos);
			break;
	}
}

function play($IP_sonos) {

  $sonos = new SonosController($IP_sonos);
	$sonos -> Play();
}

function stop($IP_sonos) {

  $sonos = new SonosController($IP_sonos);
	$sonos -> Stop();
}

function pause($IP_sonos) {

  $sonos = new SonosController($IP_sonos);
	$sonos -> Pause();
}

function getCurrent($IP_sonos) {

  $sonos = new SonosController($IP_sonos);

	$result = $sonos -> GetPositionInfo();

	$titleArtist = $result["TitleArtist"];
	$title = $result["Title"];

	if ($title != '') {
		echo $titleArtist, " / ", $title;
	} else {
		echo "";
	}
}
?>
