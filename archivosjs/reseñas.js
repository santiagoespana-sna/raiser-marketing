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

document.addEventListener("DOMContentLoaded", () => {

    const loader = document.querySelector(".top-loader");

    if (!loader) return;

    document.querySelectorAll("a").forEach(link => {

        const isInternal =
            link.hostname === window.location.hostname &&
            !link.hasAttribute("target") &&
            !link.href.includes("#");

        if (isInternal) {
            link.addEventListener("click", (e) => {

                e.preventDefault();

                loader.classList.add("active");

                setTimeout(() => {
                    window.location.href = link.href;
                }, 400); // duración corta y elegante
            });
        }
    });

});