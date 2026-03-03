/* ================= DATOS BASE ================= */

const negociosBase = [
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

/* ================= NEGOCIOS USUARIO ================= */

let negociosUsuario = [];
let editingId = null;
let selectedLat = 2.4460;
let selectedLng = -76.6130;

const savedBusinesses = localStorage.getItem("negociosUsuario");
if(savedBusinesses){
negociosUsuario = JSON.parse(savedBusinesses);
}

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

let miniMap;
let miniMarker;

/* ================= ABRIR MODAL ================= */

openAddModalBtn.onclick = () => {
editingId = null;
saveBusinessBtn.textContent = "Crear Negocio"; // 👈 agregado
addBusinessModal.style.display = "flex";
document.body.classList.add("modal-open");

setTimeout(initMiniMap,200);
};

/* ================= CERRAR MODAL ================= */

closeAddBusiness.onclick = () => {
editingId = null;
saveBusinessBtn.textContent = "Crear Negocio"; // 👈 agregado
addBusinessModal.style.display = "none";
document.body.classList.remove("modal-open");
};

/* ================= MINI MAP ================= */

function initMiniMap(){

if(miniMap){
miniMap.remove();
}

miniMap = L.map("miniMap").setView([selectedLat, selectedLng], 15);

L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png").addTo(miniMap);

miniMarker = L.marker([selectedLat, selectedLng],{draggable:true}).addTo(miniMap);

miniMarker.on("dragend",function(e){
const pos = e.target.getLatLng();
selectedLat = pos.lat;
selectedLng = pos.lng;
});

miniMap.on("click",function(e){
selectedLat = e.latlng.lat;
selectedLng = e.latlng.lng;
miniMarker.setLatLng(e.latlng);
});
}

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

let all = [...negociosBase,...negociosUsuario];

const searchValue = searchInput.value.trim().toLowerCase();
if(searchValue!==""){
all = all.filter(n=>n.nombre.toLowerCase().includes(searchValue));
}

if(categoryFilter.value!=="all"){
all = all.filter(n=>n.categoria===categoryFilter.value);
}

const ratingValue = parseFloat(ratingFilter.value);
if(ratingValue>0){
all = all.filter(n=>n.rating>=ratingValue);
}

let userBusinesses = all.filter(n=>negociosUsuario.some(u=>u.id===n.id));
let baseBusinesses = all.filter(n=>!negociosUsuario.some(u=>u.id===n.id));

if(sortFilter.value==="rating"){
baseBusinesses.sort((a,b)=>b.rating-a.rating);
userBusinesses.sort((a,b)=>b.rating-a.rating);
}

if(sortFilter.value==="name"){
baseBusinesses.sort((a,b)=>a.nombre.localeCompare(b.nombre));
userBusinesses.sort((a,b)=>a.nombre.localeCompare(b.nombre));
}

return [...userBusinesses,...baseBusinesses];
}

/* ================= RENDER ================= */

function renderBusinesses(){

container.innerHTML="";
let lista = getFilteredBusinesses();

resultCount.textContent=`${lista.length} de ${negociosBase.length+negociosUsuario.length} negocios`;

if(lista.length===0){
container.innerHTML=`<div style="text-align:center;padding:40px;">
<h3>No se encontraron negocios 😕</h3>
</div>`;
return;
}

lista.forEach(n=>{

let abierto=isOpen(n);

let card=document.createElement("div");
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

${negociosUsuario.some(u=>u.id===n.id)?`
<button class="edit-btn" onclick="editBusiness(${n.id})">✏ Editar</button>
<button class="delete-btn" onclick="deleteBusiness(${n.id})">🗑 Eliminar</button>
`:""}

</div>

<div class="card-map" id="map-${n.id}"></div>
`;

container.appendChild(card);

setTimeout(()=>{
let cardMap=L.map(`map-${n.id}`,{
attributionControl:false,
zoomControl:false,
dragging:false,
scrollWheelZoom:false
}).setView([n.lat,n.lng],15);

L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png").addTo(cardMap);
L.marker([n.lat,n.lng]).addTo(cardMap);

},100);

});

}

/* ================= EDITAR ================= */

function editBusiness(id){

let negocio=negociosUsuario.find(n=>n.id===id);
if(!negocio)return;

editingId=id;

newNombre.value=negocio.nombre;
newCategoria.value=negocio.categoria;
newRating.value=negocio.rating;
newAbre.value=negocio.abre;
newCierra.value=negocio.cierra;
newDescripcion.value=negocio.descripcion;

selectedLat=negocio.lat;
selectedLng=negocio.lng;

saveBusinessBtn.textContent = "Confirmar Cambios"; // 👈 agregado

addBusinessModal.style.display="flex";
document.body.classList.add("modal-open");

setTimeout(initMiniMap,200);
}

/* ================= ELIMINAR ================= */

function deleteBusiness(id){

if(!confirm("¿Seguro que deseas eliminar este negocio?"))return;

negociosUsuario=negociosUsuario.filter(n=>n.id!==id);
localStorage.setItem("negociosUsuario",JSON.stringify(negociosUsuario));
renderBusinesses();
}

/* ================= GUARDAR ================= */

saveBusinessBtn.onclick=()=>{

if(!newNombre.value||!newRating.value){
alert("Completa los campos obligatorios");
return;
}

const files=Array.from(newImagesFile.files);

if(editingId){

let negocio=negociosUsuario.find(n=>n.id===editingId);

negocio.nombre=newNombre.value;
negocio.categoria=newCategoria.value;
negocio.rating=parseFloat(newRating.value);
negocio.abre=parseInt(newAbre.value);
negocio.cierra=parseInt(newCierra.value);
negocio.descripcion=newDescripcion.value;
negocio.lat=selectedLat;
negocio.lng=selectedLng;

if(files.length>0){

const imagesBase64=[];
let loaded=0;

files.forEach(file=>{
const reader=new FileReader();
reader.onload=e=>{
imagesBase64.push(e.target.result);
loaded++;
if(loaded===files.length){
negocio.portada=imagesBase64[0];
negocio.galeria=imagesBase64;
localStorage.setItem("negociosUsuario",JSON.stringify(negociosUsuario));
renderBusinesses();
}
};
reader.readAsDataURL(file);
});

}else{
localStorage.setItem("negociosUsuario",JSON.stringify(negociosUsuario));
renderBusinesses();
}

editingId=null;
addBusinessModal.style.display="none";
document.body.classList.remove("modal-open");
saveBusinessBtn.textContent = "Crear Negocio"; // 👈 agregado
return;
}

if(!files.length){
alert("Debes subir al menos una imagen");
return;
}

const imagesBase64=[];
let loaded=0;

files.forEach(file=>{
const reader=new FileReader();
reader.onload=e=>{
imagesBase64.push(e.target.result);
loaded++;
if(loaded===files.length){

const nuevo={
id:Date.now(),
nombre:newNombre.value,
categoria:newCategoria.value,
rating:parseFloat(newRating.value),
popular:false,
nuevo:true,
abre:parseInt(newAbre.value),
cierra:parseInt(newCierra.value),
lat:selectedLat,
lng:selectedLng,
portada:imagesBase64[0],
galeria:imagesBase64,
descripcion:newDescripcion.value
};

negociosUsuario.push(nuevo);
localStorage.setItem("negociosUsuario",JSON.stringify(negociosUsuario));
renderBusinesses();

addBusinessModal.style.display="none";
document.body.classList.remove("modal-open");

newNombre.value="";
newRating.value="";
newDescripcion.value="";
newImagesFile.value="";
}
};
reader.readAsDataURL(file);
});

};

/* ================= INIT ================= */

/* ================= EVENTOS FILTROS ================= */

searchInput.addEventListener("input", renderBusinesses);
categoryFilter.addEventListener("change", renderBusinesses);
ratingFilter.addEventListener("change", renderBusinesses);
sortFilter.addEventListener("change", renderBusinesses);

/* ================= INIT ================= */

renderBusinesses();