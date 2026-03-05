/* ================= DATOS BASE ================= */

const negociosBase = [
    {
        id: 1,
        nombre: "Restaurante La Terraza",
        categoria: "comida",
        rating: 4.8,
        popular: true,
        nuevo: false,
        abre: 8,
        cierra: 22,
        lat: 2.4448,
        lng: -76.6147,
        portada: "../demoimg/sopa.jpeg",
        galeria: [
            "../demoimg/sopa.jpeg",
            "../demoimg/ensalada.jpeg",
            "../demoimg/postre.jpeg"
        ],
        descripcion: "Comida típica colombiana."
    },
    {
        id: 2,
        nombre: "Hotel Central",
        categoria: "hotel",
        rating: 4.2,
        popular: false,
        nuevo: true,
        abre: 0,
        cierra: 24,
        lat: 2.4460,
        lng: -76.6130,
        portada: "../demoimg/la esmeralda.jpeg",
        galeria: [
            "../demoimg/hotel1.jpg",
            "../demoimg/hotel2.jpg"
        ],
        descripcion: "Hospedaje en el centro."
    },
    {
        id: 3,
        nombre: "Tienda Express",
        categoria: "tienda",
        rating: 3.9,
        popular: true,
        nuevo: false,
        abre: 7,
        cierra: 20,
        lat: 2.4472,
        lng: -76.6120,
        portada: "../demoimg/WhatsApp Image 2026-03-02 at 23.45.33.jpeg",
        galeria: [
            "../demoimg/tienda1.jpg",
            "../demoimg/tienda2.jpg"
        ],
        descripcion: "Productos diarios."
    },
    {
        id: 4,
        nombre: "Vendedor Ambulante",
        categoria: "comida",
        rating: 4.5,
        popular: true,
        nuevo: false,
        abre: 12,
        cierra: 23,
        lat: 2.4455,
        lng: -76.6155,
        portada: "../demoimg/vendedor-ambulante-colombia-26503356.webp",
        galeria: [
            "../demoimg/parrilla1.jpg",
            "../demoimg/parrilla2.jpg"
        ],
        descripcion: "dulces lucha y mas."
    },
    {
        id: 5,
        nombre: "Hotel Premium",
        categoria: "hotel",
        rating: 4.9,
        popular: true,
        nuevo: false,
        abre: 0,
        cierra: 24,
        lat: 2.4480,
        lng: -76.6165,
        portada: "../demoimg/empanadas.jpeg",
        galeria: [
            "../demoimg/hotelpremium1.jpg",
            "../demoimg/hotelpremium2.jpg",
            "../demoimg/hotelpremium3.jpg"
        ],
        descripcion: "Experiencia 5 estrellas."
    }
];

/* ================= NEGOCIOS USUARIO ================= */

let negociosUsuario = JSON.parse(localStorage.getItem("negociosUsuario")) || [];
let editingId = null;
let selectedLat = 2.4460;
let selectedLng = -76.6130;

/* ================= ELEMENTOS ================= */

const container = document.getElementById("businessContainer");
const searchInput = document.getElementById("searchInput");
const categoryFilter = document.getElementById("categoryFilter");
const ratingFilter = document.getElementById("ratingFilter");
const sortFilter = document.getElementById("sortFilter");
const resultCount = document.getElementById("resultCount");

const addBusinessModal = document.getElementById("addBusinessModal");
const openAddModalBtn = document.getElementById("openAddModal");
const closeAddBusiness = document.getElementById("closeAddBusiness");

const newNombre = document.getElementById("newNombre");
const newCategoria = document.getElementById("newCategoria");
const newRating = document.getElementById("newRating");
const newAbre = document.getElementById("newAbre");
const newCierra = document.getElementById("newCierra");
const newDescripcion = document.getElementById("newDescripcion");
const newImagesFile = document.getElementById("newImagesFile");
const saveBusinessBtn = document.getElementById("saveBusinessBtn");

const modal = document.getElementById("modal");
const modalBody = document.getElementById("modalBody");
const closeModal = document.getElementById("closeModal");

let miniMap;
let miniMarker;

/* ================= UTILIDADES ================= */

function isOpen(n) {
    const hour = new Date().getHours();
    return hour >= n.abre && hour < n.cierra;
}

function renderStars(r) {
    let s = "";
    for (let i = 1; i <= 5; i++) {
        s += i <= Math.round(r) ? "⭐" : "☆";
    }
    return s;
}

/* ================= FILTROS ================= */

function getFilteredBusinesses() {

    let all = [...negociosBase, ...negociosUsuario];

    const searchValue = searchInput.value.trim().toLowerCase();
    if (searchValue !== "") {
        all = all.filter(n => n.nombre.toLowerCase().includes(searchValue));
    }

    if (categoryFilter.value !== "all") {
        all = all.filter(n => n.categoria === categoryFilter.value);
    }

    const ratingValue = parseFloat(ratingFilter.value);
    if (ratingValue > 0) {
        all = all.filter(n => n.rating >= ratingValue);
    }

    if (sortFilter.value === "rating") {
        all.sort((a, b) => b.rating - a.rating);
    }

    if (sortFilter.value === "name") {
        all.sort((a, b) => a.nombre.localeCompare(b.nombre));
    }

    return all;
}

/* ================= RENDER ================= */

function renderBusinesses() {

    container.innerHTML = "";
    let lista = getFilteredBusinesses();

    resultCount.textContent = `${lista.length} de ${negociosBase.length + negociosUsuario.length} negocios`;

    if (lista.length === 0) {
        container.innerHTML = `<div style="text-align:center;padding:40px;">
<h3>No se encontraron negocios 😕</h3>
</div>`;
        return;
    }

    lista.forEach(n => {

        let abierto = isOpen(n);
        let isUser = negociosUsuario.some(u => u.id === n.id);

        let card = document.createElement("div");
        card.className = "business-card";
        card.id = `business-${n.id}`;

        card.innerHTML = `
<div class="business-left">
<img src="${n.portada}">
</div>

<div class="business-right">
<span class="status ${abierto ? "open" : "closed"}">
${abierto ? "🟢 Abierto" : "🔴 Cerrado"}
</span>

<h2>${n.nombre}</h2>
<div>${renderStars(n.rating)}</div>

<div class="badges">
<span>${n.categoria}</span>
${n.popular ? "<span class='popular'>🔥 Popular</span>" : ""}
${n.nuevo ? "<span class='nuevo'>🆕 Nuevo</span>" : ""}
</div>

<p>${n.descripcion}</p>

<button onclick="viewBusiness(${n.id})">👁 Ver más</button>

${isUser ? `
<button onclick="editBusiness(${n.id})">✏ Editar</button>
<button onclick="deleteBusiness(${n.id})">🗑 Eliminar</button>
`: ""}

</div>

<div class="card-map" id="map-${n.id}"></div>
`;

        container.appendChild(card);

        setTimeout(() => {
            let cardMap = L.map(`map-${n.id}`, {
                attributionControl: false,
                zoomControl: false,
                dragging: false,
                scrollWheelZoom: false
            }).setView([n.lat, n.lng], 15);

            L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png").addTo(cardMap);
            L.marker([n.lat, n.lng]).addTo(cardMap);

        }, 100);

    });

}

/* ================= VER MÁS ================= */

function viewBusiness(id) {

    let negocio = [...negociosBase, ...negociosUsuario].find(n => n.id === id);

    modalBody.innerHTML = `
<h2>${negocio.nombre}</h2>

<img src="${negocio.portada}" 
style="width:100%;max-height:250px;object-fit:cover;border-radius:12px;margin-bottom:15px;">

<p>${negocio.descripcion}</p>

<h3 style="margin-top:20px;">📍 Ubicación</h3>
<div id="modalMap" style="height:250px;border-radius:12px;margin-top:10px;"></div>

<h3 style="margin-top:20px;">📷 Galería</h3>
<div style="display:flex;gap:10px;flex-wrap:wrap;margin-top:10px;">
${negocio.galeria.map(img =>
        `<img src="${img}" style="width:120px;border-radius:8px;">`
    ).join("")}
</div>
`;

    modal.style.display = "flex";

    /* IMPORTANTE: esperar a que el modal esté visible */
    setTimeout(() => {

        let modalMap = L.map("modalMap").setView([negocio.lat, negocio.lng], 15);

        L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png").addTo(modalMap);

        L.marker([negocio.lat, negocio.lng]).addTo(modalMap);

    }, 200);

}

closeModal.onclick = () => modal.style.display = "none";

/* ================= EDITAR ================= */

function editBusiness(id) {

    let negocio = negociosUsuario.find(n => n.id === id);
    if (!negocio) return;

    editingId = id;

    newNombre.value = negocio.nombre;
    newCategoria.value = negocio.categoria;
    newRating.value = negocio.rating;
    newAbre.value = negocio.abre;
    newCierra.value = negocio.cierra;
    newDescripcion.value = negocio.descripcion;

    selectedLat = negocio.lat;
    selectedLng = negocio.lng;

    // 👇 CAMBIAR TEXTO DEL BOTÓN
    saveBusinessBtn.textContent = "💾 Confirmar cambios";

    addBusinessModal.style.display = "flex";
}



/* ================= ELIMINAR ================= */

function deleteBusiness(id) {

    if (!confirm("¿Seguro que deseas eliminar este negocio?")) return;

    negociosUsuario = negociosUsuario.filter(n => n.id !== id);
    localStorage.setItem("negociosUsuario", JSON.stringify(negociosUsuario));
    renderBusinesses();
}

/* ================= GUARDAR ================= */

saveBusinessBtn.onclick = () => {

    if (!newNombre.value || !newRating.value) {
        alert("Completa los campos obligatorios");
        return;
    }

    const files = Array.from(newImagesFile.files);

    if (editingId) {

        let negocio = negociosUsuario.find(n => n.id === editingId);

        negocio.nombre = newNombre.value;
        negocio.categoria = newCategoria.value;
        negocio.rating = parseFloat(newRating.value);
        negocio.abre = parseInt(newAbre.value);
        negocio.cierra = parseInt(newCierra.value);
        negocio.descripcion = newDescripcion.value;

        localStorage.setItem("negociosUsuario", JSON.stringify(negociosUsuario));
        renderBusinesses();

        editingId = null;
        addBusinessModal.style.display = "none";
        return;
    }

    if (!files.length) {
        alert("Debes subir al menos una imagen");
        return;
    }

    const reader = new FileReader();

    reader.onload = e => {

        const nuevo = {
            id: Date.now(),
            nombre: newNombre.value,
            categoria: newCategoria.value,
            rating: parseFloat(newRating.value),
            popular: false,
            nuevo: true,
            abre: parseInt(newAbre.value),
            cierra: parseInt(newCierra.value),
            lat: selectedLat,
            lng: selectedLng,
            portada: e.target.result,
            galeria: [e.target.result],
            descripcion: newDescripcion.value
        };

        negociosUsuario.push(nuevo);
        localStorage.setItem("negociosUsuario", JSON.stringify(negociosUsuario));
        renderBusinesses();

        addBusinessModal.style.display = "none";
    };

    reader.readAsDataURL(files[0]);
};

/* ================= EVENTOS ================= */

searchInput.addEventListener("input", renderBusinesses);
categoryFilter.addEventListener("change", renderBusinesses);
ratingFilter.addEventListener("change", renderBusinesses);
sortFilter.addEventListener("change", renderBusinesses);

/* ================= INIT ================= */

renderBusinesses();

openAddModalBtn.addEventListener("click", () => {

    addBusinessModal.style.display = "flex";

    setTimeout(() => {

        if (miniMap) {
            miniMap.remove(); // evita duplicar mapa
        }

        miniMap = L.map("miniMap").setView([selectedLat, selectedLng], 15);

        L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png")
            .addTo(miniMap);

        miniMarker = L.marker([selectedLat, selectedLng], {
            draggable: true
        }).addTo(miniMap);

        miniMarker.on("dragend", function (e) {
            const position = e.target.getLatLng();
            selectedLat = position.lat;
            selectedLng = position.lng;
        });

    }, 200);

});

closeAddBusiness.addEventListener("click", () => {
    addBusinessModal.style.display = "none";
});