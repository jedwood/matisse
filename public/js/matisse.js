// var fastButtons = {

//   replace: function() {
//     // copy the current click events on document
//     var clickEvents = jQuery.hasData( document ) && jQuery._data( document ).events.click;
//     clickEvents = jQuery.extend(true, {}, clickEvents);

//     // remove these click events
//     $(document).off('click');

//     // reset them as vclick events
//     for (var i in clickEvents) {
//       $(document).on('vclick', clickEvents[i].handler);
//     }
//   }
// };

$(document).bind('pageinit', function(){

  // $('.side-menu-btn, .ui-panel-dismiss').click(function(event) {
  //   event.preventDefault();
  //   event.stopPropagation()
  //   return false;
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

$(document).ready(function() {
  //fastButtons.replace();
  FastClick.attach(document.body);
  $('body').on('tap', '.proj-drilldown-tabs a', function(event) {
    $('.proj-dd').addClass('hide');
    $('.proj-dd' + $(this).data('tabcontent')).removeClass('hide');
  });
});

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
