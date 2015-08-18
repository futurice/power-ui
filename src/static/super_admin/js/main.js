$(function() {
  /* Make select dropdowns nice */
  var selectOpts = {
    language: "en"
  };

  // Hackish thing to handle django-admin created selects
  $('select:visible').select2(selectOpts);
  $('.inline-group .add-row a').click(function() {
    $('select:visible').select2(selectOpts);
  });
});
