function login(event) {
    event.preventDefault();

    const correo = document.getElementById("correo").value;
    const password = document.getElementById("password").value;

    const correoCorrecto = "biznova@g";
    const passwordCorrecta = "123456";

    if (correo === correoCorrecto && password === passwordCorrecta) {

        localStorage.setItem("isLogged", "true");
        window.location.href = "dashboar.html";

    } else {
        alert("Correo o contraseña incorrectos");
    }
}