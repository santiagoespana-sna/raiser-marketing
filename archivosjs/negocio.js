/* ================= DATOS ================= */

const negocios = [
{
id:1,
nombre:"Restaurante La Terraza",
categoria:"comida",
rating:4.8,
popular:true,
nuevo:false,
abre:8,
cierra:22,
lat:2.4448,
lng:-76.6147,
portada:"../imagenes/quienes somos1.jpg",
galeria:[
"../imagenes/quienes somos1.jpg",
"../imagenes/restaurante2.jpg",
"../imagenes/restaurante3.jpg"
],
descripcion:"Comida típica colombiana."
},
{
id:2,
nombre:"Hotel Central",
categoria:"hotel",
rating:4.2,
popular:false,
nuevo:true,
abre:0,
cierra:24,
lat:2.4460,
lng:-76.6130,
portada:"../imagenes/hotel.jpg",
galeria:[
"../imagenes/hotel1.jpg",
"../imagenes/hotel2.jpg"
],
descripcion:"Hospedaje en el centro."
},
{
id:3,
nombre:"Tienda Express",
categoria:"tienda",
rating:3.9,
popular:true,
nuevo:false,
abre:7,
cierra:20,
lat:2.4472,
lng:-76.6120,
portada:"../imagenes/tienda.jpg",
galeria:[
"../imagenes/tienda1.jpg",
"../imagenes/tienda2.jpg"
],
descripcion:"Productos diarios."
},
{
id:4,
nombre:"Parrilla Urbana",
categoria:"comida",
rating:4.5,
popular:true,
nuevo:false,
abre:12,
cierra:23,
lat:2.4455,
lng:-76.6155,
portada:"../imagenes/parrilla.jpg",
galeria:[
"../imagenes/parrilla1.jpg",
"../imagenes/parrilla2.jpg"
],
descripcion:"Carnes y parrilla."
},
{
id:5,
nombre:"Hotel Premium",
categoria:"hotel",
rating:4.9,
popular:true,
nuevo:false,
abre:0,
cierra:24,
lat:2.4480,
lng:-76.6165,
portada:"../imagenes/hotelpremium.jpg",
galeria:[
"../imagenes/hotelpremium1.jpg",
"../imagenes/hotelpremium2.jpg",
"../imagenes/hotelpremium3.jpg"
],
descripcion:"Experiencia 5 estrellas."
}
];

/* ================= ELEMENTOS ================= */

const container = document.getElementById("businessContainer");
const searchInput = document.getElementById("searchInput");
const categoryFilter = document.getElementById("categoryFilter");
const ratingFilter = document.getElementById("ratingFilter");
const sortFilter = document.getElementById("sortFilter");
const resultCount = document.getElementById("resultCount");
const modal = document.getElementById("modal");
const modalBody = document.getElementById("modalBody");
const imageViewer = document.getElementById("imageViewer");
const viewerImg = document.getElementById("viewerImg");
const prevBtn = document.getElementById("prevImg");
const nextBtn = document.getElementById("nextImg");

/* ================= MAPAS ================= */

let map;
let marker;
let cardMaps = [];

/* ================= UTILIDADES ================= */

function isOpen(n){
const hour = new Date().getHours();
return hour >= n.abre && hour < n.cierra;
}

function renderStars(r){
let s="";
for(let i=1;i<=5;i++){
s += i <= Math.round(r) ? "⭐" : "☆";
}
return s;
}

/* ================= FILTROS ================= */

function getFilteredBusinesses(){

let filtered = [...negocios];

const searchValue = searchInput.value.trim().toLowerCase();
if(searchValue !== ""){
filtered = filtered.filter(n =>
n.nombre.toLowerCase().includes(searchValue)
);
}

if(categoryFilter.value !== "all"){
filtered = filtered.filter(n =>
n.categoria === categoryFilter.value
);
}

const ratingValue = parseFloat(ratingFilter.value);
if(ratingValue > 0){
filtered = filtered.filter(n =>
n.rating >= ratingValue
);
}

if(sortFilter.value === "rating"){
filtered.sort((a,b)=>b.rating - a.rating);
}

if(sortFilter.value === "name"){
filtered.sort((a,b)=>a.nombre.localeCompare(b.nombre));
}

return filtered;
}

/* ================= RENDER ================= */

function renderBusinesses(){

// 🔥 CERRAR TODO ANTES DE RENDERIZAR
imageViewer.style.display="none";
modal.style.display="none";
document.body.classList.remove("modal-open");

container.innerHTML="";
cardMaps = [];

let lista = getFilteredBusinesses();

resultCount.textContent = `${lista.length} de ${negocios.length} negocios`;

if(lista.length === 0){
container.innerHTML = `
<div style="text-align:center;padding:40px;">
<h3>No se encontraron negocios 😕</h3>
</div>
`;
return;
}

lista.forEach(n=>{

let abierto = isOpen(n);

let card = document.createElement("div");
card.className="business-card";

card.innerHTML=`
<div class="business-left">
<img src="${n.portada}">
</div>

<div class="business-right">
<span class="status ${abierto?"open":"closed"}">
${abierto?"🟢 Abierto":"🔴 Cerrado"}
</span>

<h2>${n.nombre}</h2>
<div>${renderStars(n.rating)}</div>

<div class="badges">
<span>${n.categoria}</span>
${n.popular?"<span class='popular'>🔥 Popular</span>":""}
${n.nuevo?"<span class='nuevo'>🆕 Nuevo</span>":""}
</div>

<p>${n.descripcion}</p>

<button class="profile-btn" onclick="openModal(${n.id})">
Ver perfil →
</button>

</div>

<div class="card-map" id="map-${n.id}"></div>
`;

container.appendChild(card);

setTimeout(()=>{

let cardMap = L.map(`map-${n.id}`, {
attributionControl:false,
zoomControl:false,
dragging:false,
scrollWheelZoom:false,
doubleClickZoom:false,
boxZoom:false,
keyboard:false
}).setView([n.lat, n.lng], 15);

L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png")
.addTo(cardMap);

L.marker([n.lat, n.lng]).addTo(cardMap);

cardMaps.push(cardMap);

},100);

});

}

/* ================= MODAL ================= */

let currentImages = [];
let currentIndex = 0;

function openModal(id){

let n = negocios.find(x=>x.id===id);

currentImages = n.galeria;
currentIndex = 0;

modalBody.innerHTML=`
<div class="profile-header">
<img src="${n.portada}">
<h2>${n.nombre}</h2>
<p>${renderStars(n.rating)}</p>
</div>

<p><strong>Categoría:</strong> ${n.categoria}</p>
<p><strong>Horario:</strong> ${n.abre}:00 - ${n.cierra}:00</p>
<p>${n.descripcion}</p>

<div id="map" style="height:300px;margin:20px 0;border-radius:10px;"></div>

<div class="gallery">
${n.galeria.map((img,i)=>`
<img src="${img}" data-index="${i}">
`).join("")}
</div>
`;

modal.style.display="flex";
document.body.classList.add("modal-open");

setTimeout(()=>{

if(map){
map.remove();
}

map = L.map("map").setView([n.lat, n.lng], 16);

L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png")
.addTo(map);

marker = L.marker([n.lat, n.lng])
.addTo(map)
.bindPopup(n.nombre)
.openPopup();

},100);

}

/* ================= CIERRE ================= */

document.getElementById("closeModal").onclick = ()=>{
modal.style.display="none";
document.body.classList.remove("modal-open");
};

document.getElementById("closeViewer").onclick = ()=>{
imageViewer.style.display="none";
};

/* ================= VISOR ================= */

function openViewer(index){
currentIndex = index;
viewerImg.src = currentImages[currentIndex];
imageViewer.style.display="flex";
}

function changeImage(direction){
currentIndex += direction;

if(currentIndex < 0) currentIndex = currentImages.length - 1;
if(currentIndex >= currentImages.length) currentIndex = 0;

viewerImg.src = currentImages[currentIndex];
}

document.addEventListener("click", function(e){
if(e.target.closest(".gallery img")){
let index = parseInt(e.target.dataset.index);
openViewer(index);
}
});

prevBtn.onclick = ()=> changeImage(-1);
nextBtn.onclick = ()=> changeImage(1);

document.addEventListener("keydown", function(e){
if(imageViewer.style.display === "flex"){
if(e.key === "ArrowRight") changeImage(1);
if(e.key === "ArrowLeft") changeImage(-1);
if(e.key === "Escape") imageViewer.style.display="none";
}
});

/* ================= EVENTOS ================= */

searchInput.addEventListener("input", renderBusinesses);
categoryFilter.addEventListener("change", renderBusinesses);
ratingFilter.addEventListener("change", renderBusinesses);
sortFilter.addEventListener("change", renderBusinesses);

/* ================= INIT ================= */

renderBusinesses();