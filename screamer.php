<?php

	error_reporting(E_ERROR);
	ini_set('display_errors', true);

  require "sonos.controller.php";



  $IP_sonos = "192.168.1.59";
  $sonos = new SonosController($IP_sonos);

	
	if (isset($_POST['action'])) {

		switch ($_POST['action']) {
    
			case 'play':
				play();
				break;
        
			case 'stop':
				stop();
				break;
        
			case 'pause':
				pause();
				break;
        
			case 'current':
				getCurrent();
				break;
		}
	}



	function play() {

    global $IP_sonos, $sonos;   
		$sonos->Play();
	}
	
	function stop() {

	  global $IP_sonos, $sonos;
		$sonos->Stop();
	}
	
	function pause() {

	  global $IP_sonos, $sonos;
		$sonos->Pause();
	}
	
	function getCurrent() {
	
	    global $IP_sonos, $sonos;
	    
	    $result = $sonos->GetPositionInfo();
	    
	    $titleArtist = $result["TitleArtist"];
	    $title = $result["Title"];
	    
	    if($title != '') {
	      echo $titleArtist, " / ", $title;
	    } else {
	      echo "";
	    }
	}

?>
