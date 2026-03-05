/* ==========================================
   CONFIGURACIÓN INICIAL Y VARIABLES GLOBALES
   ========================================== */
const modalResultado = document.getElementById("modalResultado");
const resultadoTitulo = document.getElementById("resultadoTitulo");
const resultadoTexto = document.getElementById("resultadoTexto");
const resultadoAnimacion = document.getElementById("resultadoAnimacion");
const btnReiniciar = document.getElementById("btnReiniciar");
const btnVolverMapa = document.getElementById("btnVolverMapa");

const preguntas = [
    {
        texto: "¿Cuál es el primer paso para que los clientes te encuentren en internet?",
        opciones: ["Crear una página web o perfil comercial", "Imprimir volantes", "Esperar a que lleguen solos"],
        correcta: 0
    },
    {
        texto: "Si tu web tarda 10 segundos en cargar...",
        opciones: ["Nada pasa", "Pierdes clientes", "Mejora el SEO"],
        correcta: 1
    },
    {
        texto: "¿Qué ayuda a que tu negocio aparezca en Google?",
        opciones: ["SEO y optimización", "Publicar una vez al año", "No hacer nada"],
        correcta: 0
    },
    {
        texto: "¿Qué ayuda más a que un negocio aparezca en los primeros resultados de búsqueda?",
        opciones: ["Optimizar su presencia digital (SEO)", "Cambiar el color del logo cada semana", "Publicar una vez al año"],
        correcta: 0
    },
    {
        texto: "Si un negocio analiza sus métricas digitales, puede...",
        opciones: ["Tomar mejores decisiones estratégicas", "Ignorar a sus clientes", "Cerrar sus redes sociales"],
        correcta: 0
    },
    {
        texto: "¿Por qué es importante que un negocio tenga presencia en internet?",
        opciones: ["Para que más personas lo encuentren fácilmente", "Para gastar más dinero", "Para competir sin estrategia"],
        correcta: 0
    }
];

let actual = 0;
let seleccionada = null;
let vidas = 3;
let errores = 0;

// Referencias HTML del juego
const pregunta = document.getElementById("pregunta");
const opciones = document.getElementById("opciones");
const barra = document.getElementById("barra");
const contador = document.getElementById("contador");
const mensaje = document.getElementById("mensaje");
const btn = document.getElementById("btnConfirmar");

const panelVidas = document.getElementById("panelVidas");
const panelErrores = document.getElementById("panelErrores");
const panelProgreso = document.getElementById("panelProgreso");
const vidasTop = document.getElementById("vidasTop");

/* ==========================================
   LÓGICA DEL TRIVIA (PREGUNTAS)
   ========================================== */
function cargarPregunta() {
    const p = preguntas[actual];
    pregunta.textContent = p.texto;
    opciones.innerHTML = "";
    mensaje.textContent = "";
    seleccionada = null;
    btn.disabled = true;

    contador.textContent = `${actual + 1} / ${preguntas.length}`;
    barra.style.width = ((actual + 1) / preguntas.length) * 100 + "%";

    p.opciones.forEach((op, i) => {
        const b = document.createElement("button");
        b.className = "w-full p-4 text-left border-2 border-slate-200 dark:border-slate-800 rounded-2xl hover:border-primary transition";
        b.textContent = op;

        b.onclick = () => {
            document.querySelectorAll("#opciones button").forEach(btn => btn.classList.remove("opcion-seleccionada"));
            b.classList.add("opcion-seleccionada");
            seleccionada = i;
            btn.disabled = false;
        };
        opciones.appendChild(b);
    });
    actualizarPanel();
}

btn.onclick = () => {
    const correcta = preguntas[actual].correcta;

    if (seleccionada === correcta) {
        mensaje.className = "text-green-500 text-center font-bold";
        mensaje.textContent = "¡Excelente!";
        revelarLetra();
    } else {
        mensaje.className = "text-red-500 text-center font-bold";
        mensaje.textContent = "Fallaste. Pierdes una vida.";
        vidas--;
        errores++;
        castigoVisual();

        if (vidas === 0) {
            mostrarResultado(false);
            return;
        }
    }

    setTimeout(() => {
        actual++;
        if (actual < preguntas.length) {
            cargarPregunta();
        } else {
            mostrarResultado(true);
        }
    }, 1000);
};

function actualizarPanel() {
    panelVidas.textContent = vidas;
    panelErrores.textContent = errores;
    vidasTop.textContent = vidas;
    let porcentaje = Math.round((actual / preguntas.length) * 100);
    panelProgreso.textContent = porcentaje + "%";
}

/* ==========================================
   LÓGICA DE RESULTADOS Y GUARDADO (LOGROS)
   ========================================== */
function mostrarResultado(gano) {
    modalResultado.classList.remove("hidden");

    if (gano) {
        resultadoTitulo.textContent = "¡Nivel Completado!";
        resultadoTexto.textContent = "Excelente trabajo estratega 🚀";
        resultadoAnimacion.textContent = "🕺";

        let aciertosFinales = preguntas.length - errores;
        localStorage.setItem("n1_aciertos", aciertosFinales);
        localStorage.setItem("n1_errores", errores);
        localStorage.setItem("n1_palabra", palabraSecreta);
        localStorage.setItem("nivelAlcanzado", 2);

        // Actualizar progreso general
        let alcanzado = parseInt(localStorage.getItem("nivelAlcanzado")) || 1;
        if (alcanzado === 1) {
            localStorage.setItem("nivelAlcanzado", 2);
            let xpActual = parseInt(localStorage.getItem("xp")) || 0;
            localStorage.setItem("xp", xpActual + 100);
        }
    } else {
        resultadoTitulo.textContent = "Has perdido...";
        resultadoTexto.textContent = "Deberás mejorar tu estrategia";
        resultadoAnimacion.textContent = "💀";

        let intentos = parseInt(localStorage.getItem("n1_intentos")) || 0;
        localStorage.setItem("n1_intentos", intentos + 1);
    }
}
/* ==========================================
   MINI AHORCADO
   ========================================== */
const listaPalabras = ["BICORP", "CLIENT", "DIGIT", "VENTAS", "SEO", "POS", "MARCA"];
let palabraSecreta = "";
let letrasReveladas = 0;

const contenedorPalabra = document.getElementById("contenedorPalabra");
const contadorRevelacion = document.getElementById("contadorRevelacion");
const barraRevelacion = document.getElementById("barraRevelacion");

function elegirPalabraAleatoria() {
    const indice = Math.floor(Math.random() * listaPalabras.length);
    palabraSecreta = listaPalabras[indice];
}

function crearEspaciosPalabra() {
    contenedorPalabra.innerHTML = "";
    for (let i = 0; i < palabraSecreta.length; i++) {
        const span = document.createElement("span");
        span.classList.add("word-letter");
        span.textContent = "_";
        contenedorPalabra.appendChild(span);
    }
    contadorRevelacion.textContent = `0/${palabraSecreta.length}`;
}

function revelarLetra() {
    if (letrasReveladas >= palabraSecreta.length) return;
    const letras = document.querySelectorAll(".word-letter");
    letras[letrasReveladas].textContent = palabraSecreta[letrasReveladas];
    letras[letrasReveladas].classList.add("text-primary");
    letrasReveladas++;
    contadorRevelacion.textContent = `${letrasReveladas}/${palabraSecreta.length}`;
    let porcentaje = (letrasReveladas / palabraSecreta.length) * 100;
    barraRevelacion.style.width = porcentaje + "%";
}

function castigoVisual() {
    const mini = document.getElementById("miniAhorcado");
    mini.classList.add("bg-red-100", "border-red-300");
    setTimeout(() => {
        mini.classList.remove("bg-red-100", "border-red-300");
    }, 1000);
}

/* ==========================================
   AJUSTES Y NAVEGACIÓN
   ========================================== */
const modalAjustes = document.getElementById("modalAjustes");
document.getElementById("abrirAjustes").onclick = () => modalAjustes.classList.remove("hidden");
document.getElementById("cerrarAjustes").onclick = () => modalAjustes.classList.add("hidden");

btnReiniciar.onclick = () => location.reload();
btnVolverMapa.onclick = () => window.location.href = "mapa_niveles/index.html";

// Inicialización
elegirPalabraAleatoria();
crearEspaciosPalabra();
cargarPregunta();