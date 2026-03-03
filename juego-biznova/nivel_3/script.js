const sesiones = [
    {
        titulo: "1. Logo",
        pregunta: "¿Qué debes colocar en este perfil?",
        sugerencia: "En Popayán, la gente prefiere ver el producto real. ¡Eso genera antojo y confianza!",
        opciones: [
            { id: 'a', texto: "Producto", img: "/juego-biznova/nivel_3/img/producto.jpg", esCorrecta: false },
            { id: 'b', texto: "Nombre/Logo", img: "/juego-biznova/nivel_3/img/descarga.jpg", esCorrecta: true }
        ],
        slotId: "slot-1",
        tipo: "imagen"
    },
    {
        titulo: "2. Descripción (Biografía)",
        pregunta: "¿Cuál de estos textos convierte seguidores en clientes?",
        sugerencia: "Usa palabras que generen antojo y confianza. ¡Menciona Popayán para conectar con tu gente!",
        opciones: [
            {
                id: 'a',
                texto: " ¡El antojo que te mereces! Sabor auténtico de Popayán con el toque secreto de la casa. Domicilios rápidos.",
                esCorrecta: true
            },
            {
                id: 'b',
                texto: "Empresa líder con calidad, seriedad y cumplimiento en todos nuestros servicios.",
                esCorrecta: false
            }

        ],
        slotId: "slot-2",
        tipo: "texto"
    },
    {
        titulo: "3. Ubicación Geográfica",
        pregunta: "¿Cómo facilitarías que un cliente local encuentre tu local físico?",
        sugerencia: "¡No obligues al cliente a usar GPS! En Popayán, las referencias como 'frente a' o 'al lado de' son oro puro.",
        opciones: [
            {
                id: 'a',
                texto: " 'Calle 4 # 8-15, Popayán.'",
                img: "../nivel_3/img/map.jpg",
                esCorrecta: false
            },
            {
                id: 'b',
                texto: " 'Calle 4 # 8-15, Sector Histórico. A media cuadra del Parque Caldas, frente al Banco de la República.'",
                img: "../nivel_3/img/2.jpg",
                esCorrecta: true
            }
        ],
        slotId: "slot-3",
        tipo: "imagen"
    },

    {
        titulo: "4. Canal de Contacto",
        pregunta: "¿Cuál es el enlace que cierra la venta de inmediato?",
        sugerencia: "Un link de WhatsApp (wa.me) ahorra 5 pasos al cliente. ¡Es la diferencia entre una pregunta y una venta!",
        opciones: [
            {
                id: 'a',
                texto: " 'Nuestro número es: 310 123 4567. Contáctanos para más información.'",
                esCorrecta: false
            },
            {
                id: 'b',
                texto: "'para mas informacion click aqui: wa.me/573101234567'",
                esCorrecta: true
            }
        ],
        slotId: "slot-4",
        tipo: "texto"
    }
];

let faseActual = 0;
let seleccionada = null;

function cargarContenido() {
    const s = sesiones[faseActual];
    document.getElementById("preguntaTitulo").innerText = s.titulo;
    document.getElementById("preguntaTexto").innerText = s.pregunta;

    const container = document.getElementById("opcionesContainer");
    container.innerHTML = "";
    seleccionada = null;

    const btn = document.getElementById("btnConfirmar");
    btn.disabled = true;
    btn.classList.add("opacity-50");

    s.opciones.forEach((op) => {
        const card = document.createElement("div");
        card.className = "card-opcion cursor-pointer border-2 border-slate-100 rounded-2xl p-4 bg-slate-50 transition-all hover:shadow-md flex flex-col justify-center items-center text-center min-h-[120px]";

        // Si la sesión tiene imagen, la muestra. Si no (como la sesión 2), solo muestra el texto.
        if (op.img) {
            card.innerHTML = `
                <img src="${op.img}" class="rounded-xl w-full aspect-video object-cover mb-2">
                <span class="text-[8px] font-bold text-slate-400 uppercase">Opción ${op.id.toUpperCase()}</span>
                <p class="text-[10px] font-bold text-slate-700 leading-tight">${op.texto}</p>
            `;
        } else {
            card.innerHTML = `
                <span class="text-[8px] font-bold text-slate-400 uppercase mb-2">Opción ${op.id.toUpperCase()}</span>
                <p class="text-[12px] font-bold text-slate-700 leading-tight italic">"${op.texto}"</p>
            `;
        }

        card.onclick = () => {
            document.querySelectorAll(".card-opcion").forEach(c => c.classList.remove("border-orange-500", "bg-orange-50"));
            card.classList.add("border-orange-500", "bg-orange-50");
            seleccionada = op;
            btn.disabled = false;
            btn.classList.remove("opacity-50");
        };

        container.appendChild(card);
    });
}

document.getElementById("btnConfirmar").onclick = () => {
    if (!seleccionada) return;

    if (seleccionada.esCorrecta) {
        const s = sesiones[faseActual];
        const slot = document.getElementById(s.slotId);

        // Instalar en el portátil
        if (s.tipo === "imagen") {
            slot.innerHTML = `<img src="${seleccionada.img}" class="w-full h-full object-cover rounded-md">`;
        } else {
            slot.innerHTML = `<p class="text-[9px] font-bold text-slate-800 p-1 text-center">${seleccionada.texto}</p>`;
        }

        slot.classList.remove("border-dashed", "border-orange-400", "bg-orange-50/50");
        slot.classList.add("border-solid", "border-orange-500", "bg-white");

        faseActual++;

        if (faseActual < sesiones.length) {
            setTimeout(cargarContenido, 600);
        } else {
            mostrarBotonFinal();
        }
    } else {
        alert(sesiones[faseActual].sugerencia);
    }
};

function mostrarBotonFinal() {
    const gameUI = document.getElementById("game-ui");
    gameUI.innerHTML = `
        <div style="text-align: center; padding: 20px; animation: fadeIn 0.5s;">
            <div style="font-size: 50px; color: #22c55e; margin-bottom: 10px;">✅</div>
            <h2 style="font-weight: 900; color: #1e293b; margin-bottom: 10px;">¡MISIÓN CUMPLIDA!</h2>
            <p style="color: #64748b; margin-bottom: 25px;">Has completado la infraestructura de tu negocio con éxito.</p>
            <button onclick="irAlMapa()" 
                style="background-color: #f97316; color: white; font-weight: bold; padding: 18px 40px; border-radius: 15px; border: none; cursor: pointer; box-shadow: 0 4px 10px rgba(249,115,22,0.3); width: 100%; transition: 0.3s;">
                VOLVER AL MAPA
            </button>
        </div>
    `;
}

// ... (Mantén todo tu array de 'sesiones' y la lógica de 'cargarContenido' igual) ...

function irAlMapa() {
    // 1. MARCAR COMO COMPLETADO
    // Si terminó el nivel 3, el siguiente nivel alcanzado es el 4
    localStorage.setItem("nivelAlcanzado", 4);

    // 2. GUARDAR DATOS PARA LA PANTALLA DE LOGROS
    // Estos son los IDs que tu pantalla de logros busca
    localStorage.setItem("progreso_n3", "100%");
    localStorage.setItem("sesiones_n3", "4/4");

    // 3. SUMAR XP (Opcional, pero recomendado)
    let xpActual = parseInt(localStorage.getItem("xp")) || 0;
    localStorage.setItem("xp", xpActual + 200);

    // 4. REDIRIGIR
    window.location.href = "../juego-biznova/mapa_niveles/index.html";
}

// --- IMPORTANTE: Cambia también la función de validación para que no sea infinito ---
// Asegúrate de que tu botón final llame a irAlMapa()
function mostrarBotonFinal() {
    const gameUI = document.getElementById("game-ui");
    gameUI.innerHTML = `
        <div style="text-align: center; padding: 20px; animation: fadeIn 0.5s;">
            <div style="font-size: 50px; color: #22c55e; margin-bottom: 10px;">✅</div>
            <h2 style="font-weight: 900; color: #1e293b; margin-bottom: 10px;">¡MISIÓN CUMPLIDA!</h2>
            <p style="color: #64748b; margin-bottom: 25px;">Has completado la infraestructura de tu negocio con éxito.</p>
            <button onclick="irAlMapa()" 
                style="background-color: #f97316; color: white; font-weight: bold; padding: 18px 40px; border-radius: 15px; border: none; cursor: pointer; box-shadow: 0 4px 10px rgba(249,115,22,0.3); width: 100%; transition: 0.3s;">
                FINALIZAR Y VER LOGROS
            </button>
        </div>
    `;
}

// Ejecutar carga inicial
cargarContenido();
