var observer = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            var id = entry.target.getAttribute('id');
            // todo
        }
    });
}, {
    rootMargin: "0px 0px -75% 0px"
});

document.querySelectorAll('.main-interactive .section').forEach(el => {
    observer.observe(el);
});