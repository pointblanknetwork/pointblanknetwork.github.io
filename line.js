
  function fallingline() {

    var $linedrops = $(),
      qt = 10;

    for (var i = 0; i < qt; ++i) {
      var $linedrop = $('<div class="linedrops"></div>');
      $linedrop.css({
        'left': (Math.random() * $('#site').width()) + 'px',
        'top': (-Math.random() * $('#site').height()) + 'px'
      });
      $linedrops = $linedrops.add($linedrop);
    }
    $('#lineZone').prepend($linedrops);

    $linedrops.animate({
      top: "100%",
      opacity: "0",
    }, Math.random() + 150, function() {
      $(this).remove();
      if (--qt < 1) {
        fallingline();
      }
    });
  }
  fallingline();
