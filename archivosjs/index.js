document.addEventListener("DOMContentLoaded", () => {
    
    // 1. Seleccionamos TODOS los elementos que necesitan animarse
    // He incluido todas tus clases anteriores: .reveal, .reveal-left, .reveal-right, .coffee-1, .compare-wrapper
    const selectors = ".reveal, .reveal-left, .reveal-right, .coffee-1, .compare-wrapper";
    const elements = document.querySelectorAll(selectors);

    // 2. Configuramos un único observador más estable
    const observerOptions = {
        threshold: 0.1, // Se activa con el 10% visible
        rootMargin: "0px 0px -10px 0px" // Reducimos el margen para evitar el parpadeo en el borde
    };

    const globalObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                entry.target.classList.add("active");
            } else {
                // OPCIONAL: Si quieres que al pasar el footer NO desaparezcan (y así no tiemblen)
                // puedes comentar la línea de abajo. Si prefieres que se reseteen, déjala así:
                entry.target.classList.remove("active");
            }
        });
    }, observerOptions);

    elements.forEach(el => globalObserver.observe(el));

    // --- EFECTO 2: MOVIMIENTO 3D (TILT) SOLO PARA TEAM CARDS ---
    // Este efecto es independiente y no interfiere con el scroll
    const teamCards = document.querySelectorAll(".team-card");

    teamCards.forEach(card => {
        card.addEventListener("mousemove", (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            const rotateX = (centerY - y) / 20; // Más suave aún (20)
            const rotateY = (x - centerX) / 20;

            card.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.05)`;
        });

        card.addEventListener("mouseleave", () => {
            card.style.transform = `rotateX(0deg) rotateY(0deg) scale(1)`;
        });
    });
});


/**
 * RAISE MARKETING - SCRIPT DE FLUIDEZ GLOBAL
 */

document.addEventListener("DOMContentLoaded", () => {
    
    // 1. OPTIMIZACIÓN DE IMÁGENES (Lazy Loading Nativo)
    // Esto evita que el navegador se trabe cargando fotos que el usuario aún no ve.
    const images = document.querySelectorAll("img");
    images.forEach(img => {
        if (!img.getAttribute("loading")) {
            img.setAttribute("loading", "lazy");
        }
    });

    // 2. FUNCIÓN DE DEBOUNCE / THROTTLE
    // Evita que funciones pesadas se ejecuten 100 veces por segundo.
    const throttle = (callback, delay) => {
        let lastTime = 0;
        return (...args) => {
            const now = new Date().getTime();
            if (now - lastTime >= delay) {
                lastTime = now;
                callback(...args);
            }
        };
    };

    // 3. MEJORA DE INTERACCIÓN (Passive Event Listeners)
    // Hace que el scroll táctil y de ratón no espere al JS para moverse.
    window.addEventListener('touchstart', () => {}, {passive: true});
    window.addEventListener('wheel', () => {}, {passive: true});

    // 4. LIMPIEZA DE TRANSICIONES AL REDIMENSIONAR
    // Evita que los elementos "tiemblen" o se animen raro al girar el celular.
    let resizeTimer;
    window.addEventListener("resize", () => {
        document.body.classList.add("resize-animation-stopper");
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(() => {
            document.body.classList.remove("resize-animation-stopper");
        }, 400);
    });

    console.log("🚀 Fluidez optimizada: Lazy loading activo y eventos suavizados.");
});
