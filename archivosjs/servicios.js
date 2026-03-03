document.addEventListener("DOMContentLoaded", () => {
    const elements = document.querySelectorAll(".reveal, .reveal-left, .reveal-right");

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Usamos requestAnimationFrame para que la animación 
                // ocurra justo cuando el monitor se refresca
                requestAnimationFrame(() => {
                    entry.target.classList.add("active");
                });
            } else {
                requestAnimationFrame(() => {
                    entry.target.classList.remove("active");
                });
            }
        });
    }, {
        // 0.2 significa que debe verse el 20% para activarse. 
        // Evita que se dispare por error en los bordes.
        threshold: 0.2 
    });

    elements.forEach(el => observer.observe(el));
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