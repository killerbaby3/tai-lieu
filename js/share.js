$('.btn_share').on('click', function () {
    var action = $(this).attr('data-type');
    var current_url = $(this).attr('data-url');
    if (typeof(action) != 'undefined' && action) {
        if (action == 'fb') {
            var linkFB = "https://www.facebook.com/sharer/sharer.php?u=" + current_url;
            window.open(linkFB, '_blank', 'height=450,width=700,resizable=no,status=no');
        }
        if (action == 'tw') {
            var linkTw = "https://twitter.com/intent/tweet?source=webclient&text=" + $('title').text() + " " + current_url;
            window.open(linkTw, '_blank', 'height=450,width=700,resizable=no,status=no');
        }
    }
});