document.addEventListener("DOMContentLoaded", function () {

    const elements = document.querySelectorAll(".reveal, .reveal-left, .reveal-right");

    const observer = new IntersectionObserver(function (entries) {

        entries.forEach(function (entry) {

            if (entry.isIntersecting) {
                entry.target.classList.add("active");
            } else {
                entry.target.classList.remove("active");
            }

        });

    }, {
        threshold: 0.3
    });

    elements.forEach(function (el) {
        observer.observe(el);
    });

});
