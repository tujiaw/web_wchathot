$(function() {
  $('.articleList').click(function() {
    var url = $(this).attr('url');
    window.open(url, '_blank');
  })
});