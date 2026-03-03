const content = document.getElementById("content");
const menuItems = document.querySelectorAll(".sidebar li");

let contactos = JSON.parse(localStorage.getItem("contactos")) || [];
let Negocios = JSON.parse(localStorage.getItem("Negocios")) || [];
let Reportes = JSON.parse(localStorage.getItem("Reportes")) || [];
let companies = JSON.parse(localStorage.getItem("companies")) || [];

let charts = [];
let currentPage = 1;
const perPage = 5;

/* ================= DASHBOARD ================= */

function loadDashboard() {

    const totalRevenue = Negocios.reduce((acc,d)=>acc+d.value,0);
    const won = Negocios.filter(d=>d.status==="Won").length;
    const lost = Negocios.filter(d=>d.status==="Lost").length;
    const pending = Negocios.filter(d=>d.status==="Pending").length;

    content.innerHTML = `
        <h1 class="welcome">¡Bienvenido!</h1>

        <section class="modern-cards">

            <div class="modern-card">
                <div>
                    <span class="card-title">Presupuesto</span>
                    <h2>$${totalRevenue.toLocaleString()}</h2>
                    <small class="positive">+12% Desde el mes pasado</small>
                </div>
                <div class="icon pink">💳</div>
            </div>

            <div class="modern-card">
                <div>
                    <span class="card-title">Nuevos proyectos</span>
                    <h2>${companies.length}</h2>
                    <small class="positive">+7% Desde la semana pasada</small>
                </div>
                <div class="icon purple">👥</div>
            </div>

            <div class="modern-card">
                <div>
                    <span class="card-title">Horas totales</span>
                    <h2>${Negocios.length * 12}</h2>
                    <small class="negative">-3% Desde la semana pasada</small>
                </div>
                <div class="icon blue">⏱️</div>
            </div>

            <div class="modern-card">
                <div>
                    <span class="card-title">Carga de trabajo</span>
                    <h2>${won + pending}%</h2>
                    <small class="positive">+5% Desde ayer</small>
                </div>
                <div class="icon orange">🛒</div>
            </div>

        </section>

        <section class="dashboard-grid">

            <div class="panel">
                <h3>Actividad reciente</h3>
                ${contactos.slice(0,4).map(c=>`
                    <div class="activity">
                        <div class="avatar">👤</div>
                        <div>
                            <strong>${c.name}</strong>
                            <p>${c.email}</p>
                        </div>
                    </div>
                `).join("")}
            </div>

            <div class="panel">
                <h3>Últimas tareas</h3>

                ${Negocios.slice(0,3).map(d=>`
                    <div class="task">
                        <div class="task-header">
                            <span>${d.name}</span>
                            <span>${d.status}</span>
                        </div>
                        <div class="progress-bar">
                            <div class="progress" style="width:${d.status==="Won"?100:d.status==="Pending"?60:30}%"></div>
                        </div>
                    </div>
                `).join("")}

            </div>

        </section>

        <section class="chart-grid">
            <div class="chart-box">
                <h3>Estado de Negocios</h3>
                <canvas id="pieChart"></canvas>
            </div>

            <div class="chart-box">
                <h3>Resumen de ingresos</h3>
                <canvas id="barChart"></canvas>
            </div>
        </section>
    `;

    createCharts(won,lost,pending,totalRevenue);
}

function destroyCharts(){
    charts.forEach(c=>c.destroy());
    charts=[];
}

/* ================= MEJORADOS ================= */

function createCharts(won,lost,pending,totalRevenue){

    destroyCharts();

    /* -------- PIE MODERNO -------- */

    const pieCtx = document.getElementById("pieChart").getContext("2d");

    const pie = new Chart(pieCtx, {
        type:"doughnut",
        data:{
            labels:["Won","Lost","Pending"],
            datasets:[{
                data:[won,lost,pending],
                backgroundColor:[
                    "#22c55e",
                    "#ef4444",
                    "#f59e0b"
                ],
                borderWidth:0,
                hoverOffset:15
            }]
        },
        options:{
            cutout:"65%",
            plugins:{
                legend:{
                    position:"bottom",
                    labels:{
                        usePointStyle:true,
                        padding:20,
                        font:{
                            size:13,
                            weight:"500"
                        }
                    }
                },
                tooltip:{
                    backgroundColor:"#111827",
                    padding:14,
                    cornerRadius:10
                }
            }
        }
    });

    /* -------- BAR CON GRADIENTE -------- */

    const barCtx = document.getElementById("barChart").getContext("2d");

    const gradient = barCtx.createLinearGradient(0,0,0,400);
    gradient.addColorStop(0,"#FF8C00");
    gradient.addColorStop(1,"rgba(59,130,246,0.2)");

    const bar = new Chart(barCtx,{
        type:"bar",
        data:{
            labels:["Revenue"],
            datasets:[{
                label:"Total Revenue",
                data:[totalRevenue],
                backgroundColor:gradient,
                borderRadius:14,
                barThickness:80
            }]
        },
        options:{
            plugins:{
                legend:{display:false},
                tooltip:{
                    backgroundColor:"#111827",
                    padding:14,
                    callbacks:{
                        label:function(context){
                            return "$"+context.raw.toLocaleString();
                        }
                    }
                }
            },
            scales:{
                x:{grid:{display:false}},
                y:{
                    grid:{color:"rgba(0,0,0,0.05)"},
                    ticks:{
                        callback:function(value){
                            return "$"+(value/1000)+"k";
                        }
                    }
                }
            }
        }
    });

    charts.push(pie);
    charts.push(bar);
}

/* ================= RESTO DEL SISTEMA (SIN CAMBIOS) ================= */

/* contactos */
function loadcontactos(){
    content.innerHTML = `
        <h1>contactos</h1>
        <input id="contactName" placeholder="Nombre">
        <input id="contactEmail" placeholder="Email">
        <button onclick="addContact()">Agregar</button>
        <table>
            <thead>
                <tr>
                    <th>Nombre</th>
                    <th>Email</th>
                    <th>Eliminar</th>
                </tr>
            </thead>
            <tbody>
                ${contactos.map((c,i)=>`
                    <tr>
                        <td>${c.name}</td>
                        <td>${c.email}</td>
                        <td><button onclick="deleteContact(${i})">❌</button></td>
                    </tr>
                `).join("")}
            </tbody>
        </table>
    `;
}

function addContact(){
    const name=document.getElementById("contactName").value;
    const email=document.getElementById("contactEmail").value;
    if(!name||!email) return;
    contactos.push({name,email});
    localStorage.setItem("contactos",JSON.stringify(contactos));
    loadcontactos();
}

function deleteContact(i){
    contactos.splice(i,1);
    localStorage.setItem("contactos",JSON.stringify(contactos));
    loadcontactos();
}

/* SIDEBAR */

menuItems.forEach(item=>{
    item.addEventListener("click",()=>{
        menuItems.forEach(i=>i.classList.remove("active"));
        item.classList.add("active");

        const section=item.getAttribute("data-section");

        switch(section){
            case "dashboard": loadDashboard(); break;
            case "contactos": loadcontactos(); break;
            case "companies": loadCompanies(); break;
            case "Negocios": loadNegocios(); break;
            case "Reportes": loadReportes(); break;
            case "Configuración": loadConfiguración(); break;
        }
    });
});

loadDashboard();

function addContact(){
    const name = document.getElementById("contactName").value;
    const email = document.getElementById("contactEmail").value;
    if(!name || !email) return;

    contactos.push({name,email});
    localStorage.setItem("contactos",JSON.stringify(contactos));
    loadcontactos();
}

function deleteContact(i){
    contactos.splice(i,1);
    localStorage.setItem("contactos",JSON.stringify(contactos));
    loadcontactos();
}

/* ================= COMPANIES ================= */

function loadCompanies(){

    content.innerHTML = `
        <h1>Empresas</h1>

        <input id="companyName" placeholder="Nombre">
        <input id="companyCountry" placeholder="País">
        <input id="companyRevenue" type="number" placeholder="Ganancia">
        <button onclick="addCompany()">Agregar</button>

        <table>
            <thead>
                <tr>
                    <th>Nombre</th>
                    <th>País</th>
                    <th>Ganancia</th>
                    <th>Eliminar</th>
                </tr>
            </thead>
            <tbody>
                ${companies.slice((currentPage-1)*perPage,currentPage*perPage)
                .map((c,i)=>`
                    <tr>
                        <td>${c.name}</td>
                        <td>${c.country}</td>
                        <td>$${c.revenue}</td>
                        <td><button onclick="deleteCompany(${i + (currentPage-1)*perPage})">❌</button></td>
                    </tr>
                `).join("")}
            </tbody>
        </table>

        <button onclick="prevPage()">Anterior</button>
        <button onclick="nextPage()">Siguiente</button>
    `;
}

function addCompany(){
    const name=document.getElementById("companyName").value;
    const country=document.getElementById("companyCountry").value;
    const revenue=Number(document.getElementById("companyRevenue").value);
    if(!name||!country||isNaN(revenue)) return;

    companies.push({name,country,revenue});
    localStorage.setItem("companies",JSON.stringify(companies));
    loadCompanies();
}

function deleteCompany(i){
    companies.splice(i,1);
    localStorage.setItem("companies",JSON.stringify(companies));
    loadCompanies();
}

function nextPage(){
    if(currentPage*perPage<companies.length){
        currentPage++;
        loadCompanies();
    }
}

function prevPage(){
    if(currentPage>1){
        currentPage--;
        loadCompanies();
    }
}

/* ================= Negocios ================= */

function loadNegocios(){

    const totalRevenue = Negocios.reduce((acc,d)=>acc+d.value,0);
    const won = Negocios.filter(d=>d.status==="Won").length;
    const lost = Negocios.filter(d=>d.status==="Lost").length;

    content.innerHTML = `
        <h1>Negocios</h1>

        <div class="deal-form">
            <input id="dealName" placeholder="Nombre de la oferta">
            <input id="dealValue" type="number" placeholder="Valor">
            <select id="Negociostatus">
                <option>Ganado</option>
                <option>Perdida</option>
                <option>Pendiente</option>
            </select>
            <button onclick="addDeal()">Agregar</button>
        </div>

        <div class="cards">
            <div class="card">
                <h4>Ingresos totales</h4>
                <h2>$${totalRevenue.toLocaleString()}</h2>
            </div>
            <div class="card">
                <h4>Ganado</h4>
                <h2>${won}</h2>
            </div>
            <div class="card">
                <h4>Perdida</h4>
                <h2>${lost}</h2>
            </div>
        </div>

        <table>
            <thead>
                <tr>
                    <th>Oferta</th>
                    <th>Valor</th>
                    <th>Estado</th>
                    <th>Acciones</th>
                </tr>
            </thead>
            <tbody>
                ${Negocios.map((d,i)=>`
                    <tr>
                        <td>${d.name}</td>
                        <td>$${d.value}</td>
                        <td>${d.status}</td>
                        <td>
                            <button onclick="editDeal(${i})">✏️</button>
                            <button onclick="deleteDeal(${i})">🗑️</button>
                        </td>
                    </tr>
                `).join("")}
            </tbody>
        </table>
    `;
}

function addDeal(){
    const name=document.getElementById("dealName").value;
    const value=Number(document.getElementById("dealValue").value);
    const status=document.getElementById("Negociostatus").value;
    if(!name||isNaN(value)) return;

    Negocios.push({name,value,status});
    localStorage.setItem("Negocios",JSON.stringify(Negocios));
    loadNegocios();
}

/* ================= Reportes ================= */

function loadReportes(){

    content.innerHTML = `
        <h1>Reportes</h1>

        <input id="reportTitle" placeholder="Título">
        <textarea id="reportContent" placeholder="Contenido"></textarea>
        <button onclick="addReport()">Crear Reporte</button>

        ${Reportes.map(r=>`
            <div class="card">
                <h3>${r.title}</h3>
                <p>${r.content}</p>
            </div>
        `).join("")}
    `;
}

function addReport(){
    const title=document.getElementById("reportTitle").value;
    const text=document.getElementById("reportContent").value;
    if(!title||!text) return;

    Reportes.push({title,content:text});
    localStorage.setItem("Reportes",JSON.stringify(Reportes));
    loadReportes();
}

/* ================= Configuración ================= */

function loadConfiguración(){
    content.innerHTML = `<h1>Configuración</h1><div class="card">Configuraciones próximamente...</div>`;
}

/* ================= SIDEBAR ================= */

menuItems.forEach(item=>{
    item.addEventListener("click",()=>{
        menuItems.forEach(i=>i.classList.remove("active"));
        item.classList.add("active");

        const section=item.getAttribute("data-section");

        switch(section){
            case "dashboard": loadDashboard(); break;
            case "contactos": loadcontactos(); break;
            case "companies": loadCompanies(); break;
            case "Negocios": loadNegocios(); break;
            case "Reportes": loadReportes(); break;
            case "Configuración": loadConfiguración(); break;
        }
    });
});

loadDashboard();


function createCharts(won,lost,pending,totalRevenue){

    destroyCharts();

    /* ================= Negocios STATUS (MODERNO) ================= */

    const pieCtx = document.getElementById("pieChart").getContext("2d");

    const pie = new Chart(pieCtx, {
        type:"doughnut",
        data:{
            labels:["Ganado","Perdida","Pendiente"],
            datasets:[{
                data:[won,lost,pending],
                backgroundColor:[
                    "#10b981",   // verde moderno
                    "#ef4444",   // rojo elegante
                    "#f59e0b"    // amarillo premium
                ],
                borderWidth:0,
                hoverOffset:18
            }]
        },
        options:{
            responsive:true,
            maintainAspectRatio:false,
            cutout:"70%",
            animation:{
                animateScale:true,
                animateRotate:true,
                duration:1200
            },
            plugins:{
                legend:{
                    position:"bottom",
                    labels:{
                        usePointStyle:true,
                        pointStyle:"circle",
                        padding:25,
                        font:{
                            size:13,
                            weight:"600"
                        }
                    }
                },
                tooltip:{
                    backgroundColor:"#111827",
                    padding:14,
                    cornerRadius:12,
                    callbacks:{
                        label:function(context){
                            const total = won + lost + pending;
                            const value = context.raw;
                            const percent = ((value/total)*100).toFixed(1);
                            return ` ${context.label}: ${value} (${percent}%)`;
                        }
                    }
                }
            }
        }
    });

    /* ================= REVENUE OVERVIEW (ELEGANTE) ================= */

    const barCtx = document.getElementById("barChart").getContext("2d");

    const gradient = barCtx.createLinearGradient(0,0,0,400);
    gradient.addColorStop(0,"#FF8C00)");
    gradient.addColorStop(1,"rgba(99,102,241,0.25)");

    const bar = new Chart(barCtx,{
        type:"bar",
        data:{
            labels:["Total Revenue"],
            datasets:[{
                data:[totalRevenue],
                backgroundColor:gradient,
                borderRadius:18,
                barThickness:90
            }]
        },
        options:{
            responsive:true,
            maintainAspectRatio:false,
            animation:{
                duration:1400,
                easing:"easeOutQuart"
            },
            plugins:{
                legend:{ display:false },
                tooltip:{
                    backgroundColor:"#111827",
                    padding:14,
                    cornerRadius:12,
                    callbacks:{
                        label:function(context){
                            return "$" + context.raw.toLocaleString();
                        }
                    }
                }
            },
            scales:{
                x:{
                    grid:{ display:false },
                    ticks:{
                        font:{
                            size:13,
                            weight:"600"
                        }
                    }
                },
                y:{
                    beginAtZero:true,
                    grid:{
                        color:"rgba(0,0,0,0.05)"
                    },
                    ticks:{
                        callback:function(value){
                            return "$"+(value/1000)+"k";
                        }
                    }
                }
            }
        }
    });

    charts.push(pie);
    charts.push(bar);
}

const NegociosCtx = document.getElementById("NegociosChart").getContext("2d");

new Chart(NegociosCtx, {
    type: "doughnut",
    data: {
        labels: ["Won", "Lost", "Pending"],
        datasets: [{
            data: [35, 25, 40],
            backgroundColor: [
                "#22c55e",
                "#ef4444",
                "#f59e0b"
            ],
            borderWidth: 0,
            hoverOffset: 12
        }]
    },
    options: {
        cutout: "65%",
        plugins: {
            legend: {
                position: "top",
                labels: {
                    usePointStyle: true,
                    padding: 20,
                    font: {
                        size: 13,
                        weight: "500"
                    }
                }
            }
        }
    }
});

new Chart(NegociosCtx, {
    type: "doughnut",
    data: {
        labels: ["Won", "Lost", "Pending"],
        datasets: [{
            data: [35, 25, 40],
            backgroundColor: [
                "#22c55e",
                "#ef4444",
                "#f59e0b"
            ],
            borderWidth: 0,
            hoverOffset: 12
        }]
    },
    options: {
        cutout: "65%",
        plugins: {
            legend: {
                position: "top",
                labels: {
                    usePointStyle: true,
                    padding: 20,
                    font: {
                        size: 13,
                        weight: "500"
                    }
                }
            },
            tooltip: {
                backgroundColor: "#111827",
                padding: 14,
                cornerRadius: 10,
                titleColor: "#fff",
                bodyColor: "#ddd"
            }
        }
    }
});


function deleteDeal(i){
    if(confirm("¿Eliminar este deal?")){
        Negocios.splice(i,1);
        localStorage.setItem("Negocios",JSON.stringify(Negocios));
        loadNegocios();
    }
}

function editDeal(i){

    const newName = prompt("Nuevo nombre:", Negocios[i].name);
    const newValue = prompt("Nuevo valor:", Negocios[i].value);
    const newStatus = prompt("Nuevo estado (Won / Lost / Pending):", Negocios[i].status);

    if(!newName || !newValue || !newStatus) return;

    Negocios[i] = {
        name: newName,
        value: Number(newValue),
        status: newStatus
    };

    localStorage.setItem("Negocios",JSON.stringify(Negocios));
    loadNegocios();
}

function logout(){

    // Eliminar sesión activa
    localStorage.removeItem("isLogged");

    // Redirigir al login
    window.location.href = "index.html";
}

localStorage.setItem("isLogged", "true");

if(!localStorage.getItem("isLogged")){
    window.location.href = "login.html";
}