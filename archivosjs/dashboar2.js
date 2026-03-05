// --- 1. PERSISTENCIA (LOCALSTORAGE) ---
const STORAGE_KEY = 'mi_crm_pro_data';
let baseDeDatos = JSON.parse(localStorage.getItem(STORAGE_KEY)) || {
    contactos: [],
    empresas: [],
    negocios: []
};

function guardarYActualizar() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(baseDeDatos));
    actualizarDashboard();
    renderizarTablas();
    actualizarReportes();
}

// --- 2. LÓGICA DEL DASHBOARD ---
function actualizarDashboard() {
    document.getElementById('dash-total-contactos').innerText = baseDeDatos.contactos.length;
    
    const totalVentas = baseDeDatos.negocios.reduce((acc, neg) => acc + parseFloat(neg.monto || 0), 0);
    document.getElementById('dash-total-ventas').innerText = `$${totalVentas.toLocaleString()}`;

    const ticketPromedio = baseDeDatos.negocios.length > 0 ? totalVentas / baseDeDatos.negocios.length : 0;
    document.getElementById('dash-ticket-promedio').innerText = `$${Math.round(ticketPromedio).toLocaleString()}`;

    // Meta y Alertas
    const meta = 10000;
    const porcentaje = Math.min((totalVentas / meta) * 100, 100);
    document.getElementById('gauge-fill').style.width = `${porcentaje}%`;
    document.getElementById('gauge-text').innerText = `${Math.round(porcentaje)}% de la meta ($${meta/1000}k)`;

    const hoy = new Date();
    const criticos = baseDeDatos.negocios.filter(n => {
        const dif = (new Date(n.fecha) - hoy) / (1000 * 60 * 60 * 24);
        return dif >= 0 && dif <= 7;
    });

    const alertCount = document.getElementById('dash-alertas-count');
    alertCount.innerText = criticos.length;
    document.getElementById('alert-container').className = criticos.length > 0 ? 'card alert-card active-alert' : 'card alert-card';
    
    document.getElementById('lista-alertas').innerHTML = criticos.length > 0 ? 
        criticos.map(n => `<tr><td>${n.titulo}</td><td>${n.cliente}</td><td>$${parseFloat(n.monto).toLocaleString()}</td><td>⚠️ Pronto</td></tr>`).join('') :
        '<tr><td colspan="4" style="text-align:center;">Todo al día</td></tr>';

    renderizarGraficas();
}

function renderizarGraficas() {
    // Origen
    const chart = document.getElementById('chart-origen');
    if (baseDeDatos.contactos.length > 0) {
        const conteo = {};
        baseDeDatos.contactos.forEach(c => conteo[c.origen] = (conteo[c.origen] || 0) + 1);
        const colores = ['#F28C28', '#2ecc71', '#e67e22', '#f1c40f'];
        let acumulado = 0;
        let grad = Object.keys(conteo).map((key, i) => {
            const p = (conteo[key] / baseDeDatos.contactos.length) * 100;
            const res = `${colores[i % colores.length]} ${acumulado}% ${acumulado + p}%`;
            acumulado += p;
            return res;
        });
        chart.style.background = `conic-gradient(${grad.join(',')})`;
        document.getElementById('origen-legend').innerHTML = Object.keys(conteo).map((k, i) => `<li><span class="dot" style="background:${colores[i % colores.length]}"></span>${k}</li>`).join('');
    }

    // Sectores
    const barSectores = document.getElementById('bar-sectores');
    if (baseDeDatos.empresas.length > 0) {
        const sectores = {};
        baseDeDatos.empresas.forEach(e => sectores[e.sector] = (sectores[e.sector] || 0) + 1);
        barSectores.innerHTML = Object.keys(sectores).map(s => {
            const h = (sectores[s] / baseDeDatos.empresas.length) * 100;
            return `<div class="bar" style="--height: ${h}%" data-name="${s}"></div>`;
        }).join('');
    }
}

// --- 3. SECCIÓN DE REPORTES ---
function actualizarReportes() {
    const totalContactos = baseDeDatos.contactos.length;
    const totalNegocios = baseDeDatos.negocios.length;
    const conv = totalContactos > 0 ? Math.round((totalNegocios / totalContactos) * 100) : 0;

    const pieConv = document.getElementById('report-pie-conversion');
    if(pieConv) {
        pieConv.style.background = `conic-gradient(#F28C28 0% ${conv}%, #2ecc71 ${conv}% 100%)`;
        document.getElementById('report-conversion-legend').innerHTML = `<li><span class="dot" style="background:#F28C28"></span>Conversión: ${conv}%</li>`;
    }

    const totalVentas = baseDeDatos.negocios.reduce((acc, neg) => acc + parseFloat(neg.monto || 0), 0);
    document.getElementById('report-tabla-proyeccion').innerHTML = `
        <tr><td>Ingresos</td><td>$${totalVentas.toLocaleString()}</td><td>$${(totalVentas*1.1).toLocaleString()}</td><td style="color:green">↑ 10%</td></tr>
        <tr><td>Clientes</td><td>${baseDeDatos.empresas.length}</td><td>${Math.round(baseDeDatos.empresas.length*1.1)}</td><td style="color:green">↑ 10%</td></tr>
    `;
}

// --- 4. NAVEGACIÓN Y TABLAS ---
const links = document.querySelectorAll('.menu a');
links.forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        const section = link.getAttribute('data-section');
        links.forEach(l => l.classList.remove('active'));
        link.classList.add('active');
        document.querySelectorAll('.view-section').forEach(s => s.style.display = 'none');
        document.getElementById(`section-${section}`).style.display = 'block';
        document.getElementById('main-title').innerText = link.innerText;
        if(section === 'reportes') actualizarReportes();
    });
});

function renderizarTablas() {
    document.getElementById('tabla-contactos-body').innerHTML = baseDeDatos.contactos.map((c, i) => 
        `<tr><td>${c.nombre}</td><td>${c.empresa}</td><td>${c.cargo}</td><td>${c.origen}</td><td><button onclick="eliminar('contactos', ${i})" style="color:red; border:none; background:none; cursor:pointer;">Eliminar</button></td></tr>`).join('');

    document.getElementById('tabla-empresas-body').innerHTML = baseDeDatos.empresas.map(e => 
        `<tr><td><strong>${e.nombre}</strong></td><td>${e.sector}</td><td>${e.tamano}</td><td><span class="status active">Cliente</span></td></tr>`).join('');

    document.getElementById('tabla-negocios-body').innerHTML = baseDeDatos.negocios.map(n => 
        `<tr><td>${n.titulo}</td><td>${n.cliente}</td><td>$${parseFloat(n.monto).toLocaleString()}</td><td>${n.fecha}</td></tr>`).join('');
}

// --- 5. EVENTOS DE FORMULARIOS ---
document.getElementById('form-contacto').addEventListener('submit', function(e) {
    e.preventDefault();
    baseDeDatos.contactos.push({ nombre: document.getElementById('c-nombre').value, cargo: document.getElementById('c-cargo').value, empresa: document.getElementById('c-empresa').value, origen: document.getElementById('c-origen').value });
    finalizarRegistro('modal-contacto', this);
});

document.getElementById('form-empresa').addEventListener('submit', function(e) {
    e.preventDefault();
    baseDeDatos.empresas.push({ nombre: document.getElementById('e-nombre').value, sector: document.getElementById('e-sector').value, tamano: document.getElementById('e-tamano').value });
    finalizarRegistro('modal-empresa', this);
});

document.getElementById('form-negocio').addEventListener('submit', function(e) {
    e.preventDefault();
    baseDeDatos.negocios.push({ titulo: document.getElementById('n-titulo').value, cliente: document.getElementById('n-cliente').value, monto: document.getElementById('n-monto').value, fecha: document.getElementById('n-fecha').value });
    finalizarRegistro('modal-negocio', this);
});

function finalizarRegistro(modalId, form) {
    cerrarModal(modalId);
    form.reset();
    guardarYActualizar();
}

function eliminar(tipo, index) {
    if(confirm('¿Seguro?')) {
        baseDeDatos[tipo].splice(index, 1);
        guardarYActualizar();
    }
}

window.abrirModal = (id) => document.getElementById(id).style.display = 'flex';
window.cerrarModal = (id) => document.getElementById(id).style.display = 'none';

// Inicio
renderizarTablas();
actualizarDashboard();