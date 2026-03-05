const container = document.getElementById('container');
const registerBtn = document.getElementById('register');
const loginBtn = document.getElementById('login');

// Solo agregar eventos si los elementos existen en el HTML
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

    // Asegúrate de que estos IDs existan en tu HTML
    const emailInput = document.getElementById("correo");
    const passInput = document.getElementById("password");

    if (!emailInput || !passInput) {
        console.error("No se encontraron los inputs de login en el HTML");
        return;
    }

    const correo = emailInput.value;
    const password = passInput.value;

    const correoCorrecto = "biznova@gmail.com";
    const passwordCorrecta = "12345678";

    if (correo === correoCorrecto && password === passwordCorrecta) {

        localStorage.setItem("isLogged", "true");
        
        window.location.href = "dashboard.html";
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
        document.getElementById("regPass").value = "";
        document.getElementById("regPassConfirm").value = "";
        return;
    }

    alert("¡Cuenta creada con éxito!");
    container.classList.remove("active");
}