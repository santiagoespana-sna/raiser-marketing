/**
 * 1. ESTADO DE LA APLICACIÓN
 */
/**
 * 1. ESTADO DE LA APLICACIÓN
 */
let editandoID = null;
let negocios = [
    {
        id: 1,
        nombre: "Café Estelar",
        categoria: "Restaurante",
        descripcion: "Granos seleccionados y repostería artesanal con el mejor ambiente para trabajar o relajarse.",
        imagen: "https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=600",
        ubicacion: "Madrid, España",
        visitas: 125,
        estrellas: 5,
        tags: ["Café", "WiFi", "Artesanal"]
    },
    {
        id: 2,
        nombre: "Gimnasio Titán",
        categoria: "Salud",
        descripcion: "Equipamiento de última generación y entrenadores certificados para alcanzar tus metas físicas.",
        imagen: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=600",
        ubicacion: "Barcelona, España",
        visitas: 89,
        estrellas: 4,
        tags: ["Fitness", "Crossfit", "Salud"]
    },
    {
        id: 3,
        nombre: "Librería El Olvido",
        categoria: "Educación",
        descripcion: "Un refugio para los amantes de la lectura con ediciones limitadas y clásicos de siempre.",
        imagen: "https://images.unsplash.com/photo-1521587760476-6c12a4b040da?w=600",
        ubicacion: "Valencia, España",
        visitas: 45,
        estrellas: 5,
        tags: ["Libros", "Cultura", "Tranquilo"]
    },
    {
        id: 4,
        nombre: "TecnoMundo",
        categoria: "Tecnología",
        descripcion: "Reparación de dispositivos y venta de accesorios con la mejor garantía del mercado local.",
        imagen: "https://images.unsplash.com/photo-1550009158-9ebf69173e03?w=600",
        ubicacion: "Sevilla, España",
        visitas: 210,
        estrellas: 4,
        tags: ["Tech", "Soporte", "Gadgets"]
    },
    {
        id: 5,
        nombre: "EcoModa",
        categoria: "Tienda",
        descripcion: "Ropa sostenible fabricada con materiales reciclados. Estilo consciente para el día a día.",
        imagen: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=600",
        ubicacion: "Bilbao, España",
        visitas: 67,
        estrellas: 5,
        tags: ["Moda", "Eco", "Sostenible"]
    }
];

const contenedor = document.getElementById('contenedor-negocios');
const formulario = document.getElementById('business-form');
const inputBusqueda = document.getElementById('search');

/**
 * 2. FUNCIONES DE APOYO
 */
function esUrlValida(url) {
    return (url.match(/\.(jpeg|jpg|gif|png)$/) != null) || url.startsWith('https://images.unsplash.com');
}

function actualizarVisitas(id) {
    negocios = negocios.map(n => n.id === id ? { ...n, visitas: n.visitas + 1 } : n);
}

/**
 * 3. RENDERIZADO (UI)
 */
function mostrarNegocios(listaNegocios) {
    contenedor.innerHTML = "";

    if (listaNegocios.length === 0) {
        contenedor.innerHTML = '<p class="loading">No hay negocios que coincidan.</p>';
        return;
    }

    listaNegocios.forEach(negocio => {
        const card = document.createElement('div');
        card.className = 'card';
        const tagsHtml = negocio.tags ? negocio.tags.map(tag => `<span class="tag">${tag}</span>`).join('') : '';

        card.innerHTML = `
            <div class="card-header">
                <img src="${negocio.imagen}" alt="${negocio.nombre}">
                <button class="btn-delete" onclick="eliminarNegocio(${negocio.id})">×</button>
                <div class="stats-badge">👁️ ${negocio.visitas || 0}</div>
            </div>
            <div class="card-content">
                <div class="card-top">
                    <span class="category">${negocio.categoria}</span>
                    <span class="stars">${'⭐'.repeat(negocio.estrellas || 5)}</span>
                </div>
                <h3>${negocio.nombre}</h3>
                <p>${negocio.descripcion.substring(0, 80)}...</p>
                <div class="tags-container">${tagsHtml}</div>
                <div class="card-buttons">
                    <button class="btn-card btn-edit" onclick="prepararEdicion(${negocio.id})">Editar</button>
                    <button class="btn-card btn-view" onclick="verPerfil(${negocio.id})">Ver Perfil</button>
                </div>
            </div>
        `;
        contenedor.appendChild(card);
    });
}

/**
 * 4. LÓGICA DE FORMULARIO
 */
/**
 * 4. LÓGICA DE FORMULARIO (MODIFICADA PARA ARCHIVOS)
 */
async function manejarEnvio(e) {
    e.preventDefault();
    
    const nombre = document.getElementById('nombre').value;
    const descripcion = document.getElementById('descripcion').value;
    const categoria = document.getElementById('categoria').value;
    const ubicacion = document.getElementById('ubicacion').value;
    const estrellas = parseInt(document.getElementById('estrellas').value) || 5;
    const tagsInput = document.getElementById('tags').value;
    const tags = tagsInput.split(',').map(tag => tag.trim()).filter(tag => tag !== "");

    // --- LÓGICA PARA LA IMAGEN LOCAL ---
    const inputImagen = document.getElementById('imagen');
    let imagenFinal = "";

    // Si hay un archivo seleccionado, lo leemos
    if (inputImagen.files && inputImagen.files[0]) {
        imagenFinal = await leerArchivo(inputImagen.files[0]);
    } else if (editandoID) {
        // Si estamos editando y no subimos foto nueva, mantenemos la anterior
        const negocioExistente = negocios.find(n => n.id === editandoID);
        imagenFinal = negocioExistente.imagen;
    } else {
        // Imagen por defecto si no suben nada
        imagenFinal = "https://images.unsplash.com/photo-1578916171728-46686eac8d58?w=400";
    }

    if (descripcion.length < 20) {
        alert("La descripción es muy corta");
        return;
    }

    if (editandoID) {
        negocios = negocios.map(n => n.id === editandoID ? 
            { ...n, nombre, descripcion, imagen: imagenFinal, categoria, ubicacion, estrellas, tags } : n
        );
        editandoID = null;
        document.querySelector('.btn-submit').textContent = "Publicar Ahora";
    } else {
        negocios.push({
            id: Date.now(),
            nombre, descripcion, imagen: imagenFinal, categoria, ubicacion, estrellas, tags, visitas: 0
        });
    }

    mostrarNegocios(negocios);
    formulario.reset();
}

/**
 * Función auxiliar para convertir el archivo en una URL que el navegador entienda
 */
function leerArchivo(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (e) => resolve(e.target.result);
        reader.onerror = (e) => reject(e);
        reader.readAsDataURL(file);
    });
}

function prepararEdicion(id) {
    const negocio = negocios.find(n => n.id === id);
    if (negocio) {
        document.getElementById('nombre').value = negocio.nombre;
        document.getElementById('categoria').value = negocio.categoria;
        document.getElementById('descripcion').value = negocio.descripcion;
        document.getElementById('imagen').value = negocio.imagen;
        document.getElementById('ubicacion').value = negocio.ubicacion;
        document.getElementById('estrellas').value = negocio.estrellas || 5;
        document.getElementById('tags').value = negocio.tags ? negocio.tags.join(', ') : '';

        editandoID = id;
        document.querySelector('.btn-submit').textContent = "Guardar Cambios";
        document.getElementById('subir').scrollIntoView({ behavior: 'smooth' });
    }
}

/**
 * 5. MODAL / PERFIL
 */
function verPerfil(id) {
    const negocio = negocios.find(n => n.id === id);
    if (!negocio) return;

    actualizarVisitas(id);
    mostrarNegocios(negocios); 

    const detalle = document.getElementById('detalle-negocio');
    const modal = document.getElementById('modal-perfil');
    const direccionMapa = encodeURIComponent(negocio.ubicacion);

    // Estructura organizada con modal-body para el espacio
    detalle.innerHTML = `
        <img src="${negocio.imagen}" alt="${negocio.nombre}">
        <div class="modal-body">
            <h2>${negocio.nombre}</h2>
            <div style="margin: 10px 0;">
                <span class="category">${negocio.categoria}</span> | 
                <span>${'⭐'.repeat(negocio.estrellas)}</span>
            </div>
            <p style="font-size: 1.1rem; color: #444; line-height: 1.6; margin-bottom: 15px;">
                ${negocio.descripcion}
            </p>
            <p><strong>📍 Ubicación:</strong> ${negocio.ubicacion}</p>
            <div class="tags-container" style="margin: 20px 0;">
                ${negocio.tags.map(t => `<span class="tag">${t}</span>`).join('')}
            </div>
            <h3 style="margin-top: 25px;">Mapa de ubicación</h3>
            <iframe 
                width="100%" 
                height="300" 
                frameborder="0" 
                src="https://maps.google.com/maps?q=${direccionMapa}&t=&z=15&ie=UTF8&iwloc=&output=embed">
            </iframe>
        </div>
    `;

    modal.style.display = "block";
    document.body.style.overflow = "hidden"; // Bloquea el scroll del fondo
}

function cerrarModal() {
    document.getElementById('modal-perfil').style.display = "none";
    document.body.style.overflow = "auto"; // Libera el scroll del fondo
}

/**
 * 6. BUSCADOR Y EVENTOS
 */
function filtrarNegocios() {
    const texto = inputBusqueda.value.toLowerCase();
    const filtrados = negocios.filter(n =>
        n.nombre.toLowerCase().includes(texto) ||
        n.categoria.toLowerCase().includes(texto) ||
        (n.tags && n.tags.some(t => t.toLowerCase().includes(texto)))
    );
    mostrarNegocios(filtrados);
}

function eliminarNegocio(id) {
    if (confirm("¿Eliminar negocio?")) {
        negocios = negocios.filter(n => n.id !== id);
        mostrarNegocios(negocios);
    }
}

formulario.addEventListener('submit', manejarEnvio);
inputBusqueda.addEventListener('input', filtrarNegocios);
document.addEventListener('DOMContentLoaded', () => mostrarNegocios(negocios));

window.onclick = function (event) {
    const modal = document.getElementById('modal-perfil');
    if (event.target == modal) cerrarModal();
}