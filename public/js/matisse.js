$(document).bind('pageinit', function(){

  // $('.side-menu-btn, .ui-panel-dismiss').click(function(event) {
  //   event.preventDefault();
  //   event.stopPropagation()
  //   return false;
  // });

  // $('body').on('tap', '.ui-panel-dismiss', function(event) {
  //   console.log("ui-panel-dismiss TAP");
  //   $sm = $('#sidemenu');
  //   if ($sm.hasClass('ui-panel-open')) {
  //     $sm.panel('close');
  //   }
  //   event.preventDefault();
  // });

  // $('body').on('tap', '.side-menu-btn', function(event) {
  //   console.log("side-menu-btn TAP");
  //   $sm = $('#sidemenu');
  //   $sm.panel('open');
  //   $('.ui-panel-content-wrap-closed').addClass('ui-panel-content-wrap-open').removeClass('.ui-panel-content-wrap-closed');
  //   event.preventDefault();
  // });
  function highdpi_init() {
    $("img.retina").each(function () {
      $this = $(this);
      $this.removeClass('retina');
      var src = $this.attr("src");
      $this.attr("src", src.replace(/(@2x)*.png/i, "@2x.png").replace(/(@2x)*.jpg/i, "@2x.jpg"));
    });
  }

  highdpi_init();
});
