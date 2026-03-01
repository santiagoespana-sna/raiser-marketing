document.addEventListener("DOMContentLoaded", () => {

    const elements = document.querySelectorAll(
        ".reveal, .reveal-left, .reveal-right"
    );

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {

            if (entry.isIntersecting) {
                entry.target.classList.add("active");
            } else {
                entry.target.classList.remove("active");
            }

        });
    }, {
        threshold: 0.25
    });

    elements.forEach(el => observer.observe(el));

});