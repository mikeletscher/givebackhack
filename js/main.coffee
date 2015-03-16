$ ->
  container = $('.ideas-tiles')
  container.imagesLoaded ->
    container.masonry(
      gutter: 10
      itemSelector: '.tile')
    return
