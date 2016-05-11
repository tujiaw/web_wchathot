$(function() {
  $('.articleItem').click(function() {
    var url = $(this).attr('url');
    window.open(url, '_blank');
  });

  $(window).scroll(function() {
    var scrollTop = $(document).scrollTop();
    var docHeight = $(document).height();
    var winHeight = $(window).height();

    $('.typeList').css('marginTop', scrollTop);
    var pageButton = $('.pageButton');
    if (scrollTop == 0) {
      $('.articleList').prepend(pageButton);
    } else if (scrollTop + winHeight == docHeight) {
      $('.articleList').append(pageButton);
    }
  })
});
