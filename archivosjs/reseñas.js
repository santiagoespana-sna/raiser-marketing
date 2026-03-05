const ratingContainer = document.getElementById('rating');
const totalStars = 5;
let rating = 0;

// Crear las estrellas dinámicamente
for (let i = 0; i < totalStars; i++) {
  const star = document.createElement('span');
  star.clsassName = "material-symbols-outlined cursor-pointer hover:scale-110 transition-transform";
  star.textContent = "star_outline"; // por defecto vacía
  ratingContainer.appendChild(star);

  // Evento de clic
  star.addEventListener('click', () => {
    rating = i + 1;
    updateStars(rating);
    console.log("Calificación seleccionada:", rating);
  });
}

// Función para actualizar las estrellas
function updateStars(rating) {
  const stars = ratingContainer.querySelectorAll('span');
  stars.forEach((star, index) => {
    star.textContent = index < rating ? "star" : "star_outline";
  });
}

