function login(event) {
    event.preventDefault();

    const correo = document.getElementById("correo").value;
    const password = document.getElementById("password").value;

    const correoCorrecto = "biznova@g";
    const passwordCorrecta = "123456";

    if (correo === correoCorrecto && password === passwordCorrecta) {

        localStorage.setItem("isLogged", "true");
        window.location.href = "../dashboar.html";

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

    // Validar que los campos no estén vacíos
    if (!user || !email || !pass || !passConfirm) {
        alert("Por favor, completa todos los campos.");
        return;
    }

    // Validar que las contraseñas coincidan
    if (pass !== passConfirm) {
        alert("Las contraseñas no coinciden. Inténtalo de nuevo.");
        // Opcional: limpiar los campos de password si fallan
        document.getElementById("regPass").value = "";
        document.getElementById("regPassConfirm").value = "";
        return;
    }

    // Si todo está bien
    alert("¡Cuenta creada con éxito! Ahora puedes iniciar sesión.");
    // Aquí podrías redirigir o activar el panel de login
    document.getElementById("container").classList.remove("active");
}
const container = document.getElementById('container');
const registerBtn = document.getElementById('register');
const loginBtn = document.getElementById('login');


registerBtn.addEventListener('click', () => {
    container.classList.add("active");
});


loginBtn.addEventListener('click', () => {
    container.classList.remove("active");
});