
  function hovon(soundobj) {
    var thissound = document.getElementById(soundobj);
    thissound.play();
  }

  function hovoff(soundobj) {
    var thissound = document.getElementById(soundobj);
    thissound.pause();
    thissound.currentTime = 0;
  }
