let tarjetaArrastrada = null;
let vidas = 3;

// Seleccionar elementos
const tarjetas = document.querySelectorAll(".card-item");
const zonas = document.querySelectorAll(".drop-zone-glow");
const botonValidar = document.getElementById("btnvalidar");

// --- LÓGICA DE ARRASTRAR (DRAG & DROP) ---
tarjetas.forEach(tarjeta => {
    tarjeta.addEventListener("dragstart", e => {
        tarjetaArrastrada = tarjeta;
        setTimeout(() => tarjeta.classList.add("hidden"), 0);
    });
    tarjeta.addEventListener("dragend", e => {
        tarjeta.classList.remove("hidden");
        tarjetaArrastrada = null;
    });
});

zonas.forEach(zona => {
    zona.addEventListener("dragover", e => e.preventDefault());
    zona.addEventListener("drop", e => {
        e.preventDefault();
        if (tarjetaArrastrada) {
            zona.appendChild(tarjetaArrastrada);
            actualizarContadores(); // Actualizar números al soltar
        }
    });
});

// --- LÓGICA DE VALIDACIÓN ---
botonValidar.addEventListener("click", () => {
    let erroresEnEsteTurno = 0;
    let aciertosEnEsteTurno = 0;
    const tarjetasEnZonas = document.querySelectorAll(".drop-zone-glow .card-item");

    if (tarjetasEnZonas.length === 0) {
        alert("¡Arrastra al menos una tarjeta!");
        return;
    }

    tarjetasEnZonas.forEach(tarjeta => {
        const categoriaCorrecta = tarjeta.dataset.categoria;
        const zonaActual = tarjeta.parentElement.dataset.zone;

        tarjeta.classList.remove("correcto", "incorrecto");
        const iconPrevio = tarjeta.querySelector('.status-icon');
        if (iconPrevio) iconPrevio.remove();

        const statusIcon = document.createElement('span');
        statusIcon.className = "material-symbols-outlined status-icon ml-2 text-lg";

        if (categoriaCorrecta === zonaActual) {
            tarjeta.classList.add("correcto");
            statusIcon.textContent = "check_circle";
            statusIcon.style.color = "#16a34a";
            aciertosEnEsteTurno++;
        } else {
            tarjeta.classList.add("incorrecto");
            statusIcon.textContent = "cancel";
            statusIcon.style.color = "#dc2626";
            erroresEnEsteTurno++;
        }
        tarjeta.querySelector('div').appendChild(statusIcon);
    });

    if (erroresEnEsteTurno > 0) {
        restarVida();
    } else if (tarjetasEnZonas.length === tarjetas.length) {
        // SI TODO ESTÁ BIEN Y ESTÁN TODAS LAS TARJETAS, GANÓ
        finalizarNivel2Exitoso(aciertosEnEsteTurno);
    }
});

function restarVida() {
    vidas--;
    const corazones = document.querySelectorAll(".text-rose-500 .material-symbols-outlined");
    if (corazones[vidas]) {
        corazones[vidas].textContent = "favorite_border";
    }

    if (vidas <= 0) {
        alert("Juego terminado 😢");
        location.reload();
    } else {
        alert(`Estrategia incorrecta. Te quedan ${vidas} vidas.`);
    }
}

function actualizarContadores() {
    zonas.forEach(zona => {
        const total = zona.querySelectorAll(".card-item").length;
        const contador = zona.querySelector("span.text-xs.font-bold");
        if (contador) contador.textContent = `${total}/3`;
    });
}

// --- FUNCIÓN DE GUARDADO (CONEXIÓN CON LOGROS) ---
function finalizarNivel2Exitoso(aciertos) {
    // 1. Guardar aciertos para la pantalla de logros
    localStorage.setItem("aciertos_n2", aciertos);

    // 2. Actualizar progreso global
    let alcanzado = parseInt(localStorage.getItem("nivelAlcanzado")) || 1;
    if (alcanzado <= 2) {
        localStorage.setItem("nivelAlcanzado", 3);
        
        let xpActual = parseInt(localStorage.getItem("xp")) || 0;
        localStorage.setItem("xp", xpActual + 150);
    }

    alert("¡Felicidades! Estrategia Pro completada. Nivel 3 desbloqueado.");
    window.location.href = "../juego-biznova/mapa_niveles/index.html";
}

// Botones de control
document.getElementById("btnReiniciar")?.addEventListener("click", () => location.reload());
document.getElementById("reiniciarProgreso")?.addEventListener("click", () => {
    localStorage.clear();
    location.reload();
});