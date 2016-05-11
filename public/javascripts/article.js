$(function() {
  $('.articleItem').click(function() {
    var url = $(this).attr('url');
    window.open(url, '_blank');
  });

  $('.articleList').scroll(function() {
    log($(this).height() + $(this).scrollTop());
    log($(this)[0].scrollHeight);
    if ($(this).scrollTop() == 0) {
      $(this).prepend(pageButton);
    } else if ($(this).height() + $(this).scrollTop() == $(this)[0].scrollHeight) {
      $(this).append(pageButton);
    }
  })
});
