
tailwind.config = {
    darkMode: "class",
    theme: {
        extend: {
            colors: {
                primary: "#ff8c00",
                "background-light": "#ff8c00",
                "background-dark": "#1e293b",
            },
            fontFamily: {
                display: ["Inter", "sans-serif"],
            },
            borderRadius: {
                DEFAULT: "1rem",
            },
        },
    },
}; document.addEventListener("DOMContentLoaded", () => {
    const btnDarkMode = document.getElementById("btnDarkMode");
    const btnEmpezar = document.getElementById("btnEmpezar");

    // Lógica para cambiar entre Modo Claro y Oscuro
    if (btnDarkMode) {
        btnDarkMode.addEventListener("click", () => {
            document.documentElement.classList.toggle("dark");
        });
    }

    // Lógica para empezar el juego y llevar al mapa
    if (btnEmpezar) {
        btnEmpezar.addEventListener("click", () => {
            // Asegúrate de que la ruta sea la correcta para tu archivo de mapa
            window.location.href = "/juego-biznova/mapa_niveles/index.html";
        });
    }
});