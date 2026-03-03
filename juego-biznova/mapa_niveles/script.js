document.addEventListener("DOMContentLoaded", () => {
    tailwind.config = {
        darkMode: "class",
        theme: {
            extend: {
                colors: {
                    primary: "#ff8c00",
                    "background-light": "#f6f7f8",
                    "background-dark": "#101822",
                },
                fontFamily: {
                    display: ["Manrope", "sans-serif"],
                },
                borderRadius: {
                    DEFAULT: "0.5rem",
                    lg: "1rem",
                    xl: "1.5rem",
                    full: "9999px",
                },
            },
        },
    }
    // 1. Cargar el progreso (Si no existe, empieza en 1)
    let nivelAlcanzado = parseInt(localStorage.getItem("nivelAlcanzado")) || 1;
    let xp = parseInt(localStorage.getItem("xp")) || 0;

    // 2. Actualizar XP en la pantalla
    const xpTexto = document.getElementById("xpTexto");
    if (xpTexto) xpTexto.textContent = `${xp} XP`;

    // 3. Actualizar la barra de progreso visual (40% por nivel aprox)
    // 3. Actualizar la barra de progreso visual
    const barra = document.querySelector(".bg-primary.h-full");
    if (barra) {
        // Si nivelAlcanzado es 3, el progreso debería ser casi total
        // Fórmula: (nivel - 1) / (total_niveles - 1) * 100
        let progreso = ((nivelAlcanzado - 1) / 2) * 100;
        barra.style.width = `${progreso}%`;
    }

    // 4. Controlar cada nivel (Nodos)
    const nodos = document.querySelectorAll(".level-node");

    nodos.forEach((nodo) => {
        // Sacamos el número del ID (ej: "nivel-1" -> 1)
        const nivelId = parseInt(nodo.id.split('-')[1]);
        const card = nodo.querySelector(".main-card");
        const badge = nodo.querySelector(".status-badge");
        const lock = nodo.querySelector(".lock-icon");
        const icono = nodo.querySelector(".material-symbols-outlined");

        // CASO A: NIVEL YA SUPERADO (Check verde)
        if (nivelId < nivelAlcanzado) {
            nodo.classList.remove("opacity-50", "grayscale");
            card.className = "main-card w-24 h-24 bg-green-100 dark:bg-green-900/20 rounded-2xl flex items-center justify-center shadow-md border-2 border-green-500";
            if (icono) icono.style.color = "#22c55e"; // Color verde

            if (badge) {
                badge.className = "status-badge mt-4 bg-green-500 px-4 py-1 rounded-full border-2 border-white shadow-sm flex items-center gap-1";
                badge.innerHTML = '<span class="material-symbols-outlined text-white text-xs font-bold">check</span><span class="text-[10px] font-bold text-white uppercase">Completado</span>';
                badge.classList.remove("hidden");
            }
            nodo.style.cursor = "pointer";
            nodo.onclick = () => window.location.href = nodo.dataset.url;
        }

        // CASO B: NIVEL ACTUAL (Azul animado)
        else if (nivelId === nivelAlcanzado) {
            nodo.classList.remove("opacity-50", "grayscale");
            card.classList.add("border-primary", "animate-pulse", "ring-4", "ring-primary/20");
            if (icono) icono.classList.add("text-primary");

            if (badge) {
                badge.className = "status-badge mt-4 bg-primary px-6 py-2 rounded-full shadow-lg";
                badge.innerHTML = '<span class="text-sm font-bold text-white uppercase tracking-wider">¡Juega Ahora!</span>';
                badge.classList.remove("hidden");
            }
            if (lock) lock.classList.add("hidden");

            nodo.style.cursor = "pointer";
            nodo.onclick = () => window.location.href = nodo.dataset.url;

            // Configurar también el botón circular de "PLAY" de abajo
            const btnPlay = document.getElementById("btnJugarNivel");
            if (btnPlay) {
                btnPlay.onclick = () => window.location.href = nodo.dataset.url;
            }
        }

        // CASO C: NIVEL BLOQUEADO (Gris con candado)
        else {
            nodo.classList.add("opacity-50", "grayscale");
            if (lock) lock.classList.remove("hidden");
            nodo.onclick = () => alert("Nivel bloqueado. Completa el anterior.");
        }
    });
});