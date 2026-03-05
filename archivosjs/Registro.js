// Esperar a que el DOM esté cargado
document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('registrationForm');
    
    form.addEventListener('submit', (e) => {
        const password = document.getElementById('password').value;
        const confirmPassword = document.getElementById('confirm-password').value;

        // Validación simple de contraseñas
        if (password !== confirmPassword) {
            e.preventDefault(); // Evita que se envíe el formulario
            alert('¡Las contraseñas no coinciden! Por favor, verifica.');
            return;
        }

        console.log('Formulario enviado correctamente');
    });
});