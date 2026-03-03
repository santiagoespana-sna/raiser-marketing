document.addEventListener("DOMContentLoaded", function() {

    var elements = document.querySelectorAll(
        ".team h2, .team .txt-p, .team-card, .team-extra-content"
    );

    if (!elements.length) return;

    var observer = new IntersectionObserver(function(entries) {

        entries.forEach(function(entry) {

            if (entry.isIntersecting) {
                entry.target.classList.add("team-active");
            } else {
                entry.target.classList.remove("team-active");
            }

        });

    }, {
        threshold: 0.1   // 🔥 bajamos el threshold
    });

    elements.forEach(function(el) {
        observer.observe(el);

        // 🔥 FORZAR que aparezca si ya está visible
        if (el.getBoundingClientRect().top < window.innerHeight) {
            el.classList.add("team-active");
        }
    });

});