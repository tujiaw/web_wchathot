$(function() {
  $('.articleItem').click(function() {
    var url = $(this).attr('url');
    window.open(url, '_blank');
  })
});