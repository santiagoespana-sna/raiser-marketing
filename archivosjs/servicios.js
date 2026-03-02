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
