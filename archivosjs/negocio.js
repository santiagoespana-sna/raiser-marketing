console.log("JS cargado");
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
imagenes:[
"../imagenes/nada.jpg",
"../imagenes/nada.jpg",
"../imagenes/nada.jpg"
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
imagenes:[
"../imagenes/nada.jpg",
"../imagenes/nada.jpg",
"../imagenes/nada.jpg"
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
imagenes:[
"../imagenes/nada.jpg",
"../imagenes/nada.jpg",
"../imagenes/nada.jpg"
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
imagenes:[
"../imagenes/nada.jpg",
"../imagenes/nada.jpg",
"../imagenes/nada.jpg"
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
imagenes:[
"../imagenes/image.png",
"../imagenes/nada.jpg",
"../imagenes/nada.jpg"
],
descripcion:"Experiencia 5 estrellas."
}
];

const container=document.getElementById("businessContainer");

function isOpen(n){
const hour=new Date().getHours();
return hour>=n.abre&&hour<n.cierra;
}

function renderStars(r){
let s="";
for(let i=1;i<=5;i++){
s+=i<=Math.round(r)?"⭐":"☆";
}
return s;
}

/* CARRUSEL FUNCIONAL */
function setupImageRotation(imageContainer){

const imgs = imageContainer.querySelectorAll("img");
if(imgs.length < 2) return;

let index = 0;
let interval = null;

imageContainer.addEventListener("mouseenter",()=>{

if(interval) return;

interval = setInterval(()=>{

imgs[index].classList.remove("active");
index = (index + 1) % imgs.length;
imgs[index].classList.add("active");

},1200);

});

imageContainer.addEventListener("mouseleave",()=>{

clearInterval(interval);
interval = null;

imgs.forEach(img=>img.classList.remove("active"));
imgs[0].classList.add("active");

index = 0;

});

}

function renderBusinesses(){
container.innerHTML="";
const fragment=document.createDocumentFragment();

negocios.forEach(n=>{

let abierto=isOpen(n);

let card=document.createElement("div");
card.className="business-card";

card.innerHTML=`
<div class="business-image">
${n.imagenes.map((img,i)=>`
<img src="${img}" class="${i===0?'active':''}">
`).join("")}
</div>

<div class="business-content">

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

<div class="map" id="map-${n.id}"></div>

<button class="profile-btn" onclick="openModal(${n.id})">
Ver perfil →
</button>

</div>
`;

fragment.appendChild(card);

const imageContainer=card.querySelector(".business-image");
setupImageRotation(imageContainer);

setTimeout(()=>{
const map=L.map(`map-${n.id}`).setView([n.lat,n.lng],14);
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',{maxZoom:19}).addTo(map);
L.marker([n.lat,n.lng]).addTo(map);
},200);

});

container.appendChild(fragment);
}

function openModal(id){
let n=negocios.find(x=>x.id===id);

document.getElementById("modalBody").innerHTML=`
<div class="profile-header">
<img src="${n.imagenes[0]}">
<h2>${n.nombre}</h2>
<p>${renderStars(n.rating)}</p>
</div>

<p style="margin-bottom:15px;"><strong>Categoría:</strong> ${n.categoria}</p>
<p style="margin-bottom:20px;"><strong>Horario:</strong> ${n.abre}:00 - ${n.cierra}:00</p>
<p style="margin-bottom:25px;">${n.descripcion}</p>

<div id="profile-map" style="height:350px;margin-bottom:25px;"></div>

<div class="gallery">
${n.imagenes.map(img=>`<img src="${img}">`).join("")}
</div>
`;

document.getElementById("modal").style.display="flex";

setTimeout(()=>{
const map=L.map("profile-map").setView([n.lat,n.lng],16);
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',{maxZoom:19}).addTo(map);
L.marker([n.lat,n.lng]).addTo(map);
},200);
}

document.getElementById("closeModal").onclick=()=>{
modal.style.display="none";
};

renderBusinesses();