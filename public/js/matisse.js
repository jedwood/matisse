

// $("#menu-btn").on('click',function(event){
//   event.stopPropagation(); event.preventDefault();
//   console.log("gotcha!");
// });


var fastButtons = {

  replace: function() {
    var clickEvents = jQuery.hasData( document ) && jQuery._data( document ).events.click;
    clickEvents = jQuery.extend(true, {}, clickEvents);

    // remove these click events
    $(document).off('click');

    // reset them as vclick events
    for (var i in clickEvents) {
      console.log("hey " + i);
      $(document).on('vclick', clickEvents[i].handler);
    }
  }
};

fastButtons.replace();
//========================================================
// Lungo.dom('#section-classrooms').on('load', function(event){
//   document.getElementById('school-search').focus();
// });

// $$('#school-search-form').on('submit', '#school-search-form', function(event) {
//   //to trigger the iPhone keyboard to hide
//   document.getElementById('school-search').blur();
//   //show the spinner
//   Lungo.Element.loading("#school-list", 1);
//   var schoolInput = $$('#school-search');
//   var url = "/schools";
//   //TODO guess whether this is a ZIP or a school name
//   var data = {zip: schoolInput.val()};
//   var parseResponse = function(result){
//     $$('#school-list').html(result);
//   };
//   Lungo.Service.get(url, data, parseResponse, "html");
//   event.preventDefault();
//   return false;
// });
