const cards = document.querySelectorAll(".coffee-1");

const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add("active");
        } else {
            entry.target.classList.remove("active");
        }
    });
}, { threshold: 0.3 });

cards.forEach(card => {
    observer.observe(card);
});


document.addEventListener("DOMContentLoaded", () => {

    const elements = document.querySelectorAll(".reveal-left, .reveal-right");

    const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {

            if (entry.isIntersecting) {
                entry.target.classList.add("active");
            } else {
                entry.target.classList.remove("active"); // 👈 ESTA LÍNEA ES LA CLAVE
            }

        });
    }, { threshold: 0.2 });

    elements.forEach(el => observer.observe(el));

});



document.addEventListener("DOMContentLoaded", () => {

    const elements = document.querySelectorAll(".reveal");

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {

            if (entry.isIntersecting) {
                entry.target.classList.add("active");
            } else {
                entry.target.classList.remove("active");
            }

        });
    }, {
        threshold: 0.2
    });

    elements.forEach(el => observer.observe(el));

});




document.addEventListener("DOMContentLoaded", () => {

    const elements = document.querySelectorAll(".reveal");

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {

            if (entry.isIntersecting) {
                entry.target.classList.add("active");
            } else {
                entry.target.classList.remove("active");
            }

        });
    }, {
        threshold: 0.2
    });

    elements.forEach(el => observer.observe(el));

});