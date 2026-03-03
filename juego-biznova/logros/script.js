document.addEventListener("DOMContentLoaded", () => {
    // 1. Obtener el progreso global
    const nivelAlcanzado = parseInt(localStorage.getItem("nivelAlcanzado")) || 1;

    // 2. Configurar cada tarjeta de logro (Niveles 1, 2 y 3)
    for (let i = 1; i <= 3; i++) {
        const tarjeta = document.getElementById(`logro-${i}`);
        const stats = document.getElementById(`stats-${i}`);
        if (!tarjeta || !stats) continue; // Seguridad por si falta el ID en el HTML

        const flecha = tarjeta.querySelector(".material-icons-round:last-child");

        // --- LÓGICA DE DESBLOQUEO ---
        if (nivelAlcanzado >= i) {
            // Quitamos el estado bloqueado
            tarjeta.classList.remove("locked", "opacity-50", "grayscale", "cursor-not-allowed");
            tarjeta.classList.add("cursor-pointer", "hover:shadow-lg");

            // Cambiamos el texto de estado a Completado (si existe el elemento status-X)
            const statusLabel = document.getElementById(`status-${i}`);
            if (statusLabel) {
                statusLabel.innerText = "¡Completado!";
                statusLabel.classList.add("text-orange-600");
            }

            // --- LÓGICA DE DESPLEGAR (CLICK) ---
            tarjeta.onclick = () => {
                const estaOculto = stats.classList.toggle("hidden");

                // Rotamos la flecha
                if (flecha) {
                    flecha.style.transition = "transform 0.3s ease";
                    flecha.style.transform = estaOculto ? "rotate(0deg)" : "rotate(180deg)";
                }
            };
        } else {
            // Si está bloqueado
            tarjeta.onclick = () => alert("¡Completa los niveles anteriores para desbloquear!");
        }
    }

    // --- CARGAR DATOS REALES DESDE LOCALSTORAGE ---

    // Obtener los datos (usamos los nombres de clave que guarda el nivel 1)
    const n1_a = localStorage.getItem("n1_aciertos") || "0";
    const n1_e = localStorage.getItem("n1_errores") || "0";
    const n1_p = localStorage.getItem("n1_palabra") || "Ninguna";

    // ASIGNAR A LOS IDS REALES DE TU HTML
    const elAciertos1 = document.getElementById("aciertos-n1");
    const elErrores1 = document.getElementById("errores-n1");
    const elPalabra1 = document.getElementById("palabra-n1");

    if (elAciertos1) elAciertos1.innerText = n1_a;
    if (elErrores1) elErrores1.innerText = n1_e;
    if (elPalabra1) elPalabra1.innerText = n1_p.toUpperCase();

    // NIVEL 2
    const n2_a = localStorage.getItem("aciertos_n2") || "0";
    const elAciertos2 = document.getElementById("aciertos-n2");
    if (elAciertos2) elAciertos2.innerText = n2_a;

    // --- DATOS NIVEL 3 ---
    // Dentro de logros/script.js
    const n3_p = localStorage.getItem("progreso_n3") || "0%";
    const n3_s = localStorage.getItem("sesiones_n3") || "0/4";

    if (document.getElementById("progreso-n3")) {
        document.getElementById("progreso-n3").innerText = n3_p;
    }
    if (document.getElementById("sesiones-n3")) {
        document.getElementById("sesiones-n3").innerText = n3_s;
    }});