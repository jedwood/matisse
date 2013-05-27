Lungo.init({
    name: 'matisse'
  });

Lungo.dom('#section-classrooms').on('load', function(event){
  //$$('#aside-main li.active').removeClass('active');
  //$$('#aside-main li a[href="#section-classrooms"]').parent().addClass('active');
  document.getElementById('school-search').focus();
});

Lungo.dom('#section-main').on('load', function(event){
  //$$('#aside-main li.active').removeClass('active');
  //$$('#aside-main li a[href="#section-main"]').parent().addClass('active');
});

$$('#school-search-form').on('submit', '#school-search-form', function(event) {
  //to trigger the iPhone keyboard to hide
  document.getElementById('school-search').blur();
  //show the spinner
  Lungo.Element.loading("#school-list", 1);
  var schoolInput = $$('#school-search');
  var url = "/schools";
  //TODO guess whether this is a ZIP or a school name
  var data = {zip: schoolInput.val()};
  var parseResponse = function(result){
    $$('#school-list').html(result);
  };
  Lungo.Service.get(url, data, parseResponse, "html");
  event.preventDefault();
  return false;
});
