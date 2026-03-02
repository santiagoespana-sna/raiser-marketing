document.addEventListener("DOMContentLoaded", function () {

    const elements = document.querySelectorAll(".reveal, .reveal-left, .reveal-right");

    const observer = new IntersectionObserver(function (entries) {

        entries.forEach(function (entry) {

            if (entry.isIntersecting) {

                // Cuando aparece en pantalla
                entry.target.classList.add("active");

            } else {

                // Cuando sale de pantalla
                entry.target.classList.remove("active");

            }

        });

    }, {
        threshold: 0.2
    });

    elements.forEach(function (el) {
        observer.observe(el);
    });

});