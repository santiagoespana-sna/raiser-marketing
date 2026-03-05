const container = document.getElementById('container');
const registerBtn = document.getElementById('register');
const loginBtn = document.getElementById('login');

if (registerBtn && loginBtn && container) {
    registerBtn.addEventListener('click', () => {
        container.classList.add("active");
    });

    loginBtn.addEventListener('click', () => {
        container.classList.remove("active");
    });
}

function login(event) {
    event.preventDefault();

    // 1. DEFINIR LAS VARIABLES PRIMERO
    const emailEl = document.getElementById("correo");
    const passEl = document.getElementById("password");

    // 2. VERIFICAR QUE EXISTAN
    if (!emailEl || !passEl) {
        alert("Error técnico: No se encuentran los campos en el HTML.");
        return;
    }

    // 3. OBTENER LOS VALORES
    const correo = emailEl.value;
    const password = passEl.value;

    const correoCorrecto = "biznova@gmail.com";
    const passwordCorrecta = "123456";

    // 4. COMPARAR
    if (correo === correoCorrecto && password === passwordCorrecta) {
        console.log("Login exitoso. Redirigiendo...");
        localStorage.setItem("isLogged", "true");
        
        // Verifica que el archivo se llame exactamente así en tu carpeta
        window.location.href = "dashboar2.html"; 
    } else {
        alert("Correo o contraseña incorrectos");
    }
}

function validarRegistro(event) {
    event.preventDefault();

    const pass = document.getElementById("regPass").value;
    const passConfirm = document.getElementById("regPassConfirm").value;
    const user = document.getElementById("regUser").value;
    const email = document.getElementById("regEmail").value;


    if (!user || !email || !pass || !passConfirm) {

        alert("Por favor, completa todos los campos.");
        return;
    }


    if (pass !== passConfirm) {
        alert("Las contraseñas no coinciden.");

        return;
    }

    alert("¡Cuenta creada con éxito!");
    container.classList.remove("active");
}