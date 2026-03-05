const container = document.getElementById('container');
const registerBtn = document.getElementById('register');
const loginBtn = document.getElementById('login');


registerBtn.addEventListener('click', () => {
    container.classList.add("active");
});


loginBtn.addEventListener('click', () => {
    container.classList.remove("active");
});

function login(event) {
    event.preventDefault();

    const correo = document.getElementById("correo").value;
    const password = document.getElementById("password").value;

    const correoCorrecto = "biznova@gmail.com";
    const passwordCorrecta = "123456";

    if (correo === correoCorrecto && password === passwordCorrecta) {

        localStorage.setItem("isLogged", "true");
        window.location.href = "dashboar.html";

    } else {
        alert("Correo o contraseña incorrectos");
    }
}