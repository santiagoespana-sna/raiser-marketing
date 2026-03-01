// Selección de elementos
const openChatBtn = document.getElementById("openChatBtn");
const closeChatBtn = document.getElementById("closeChatBtn");
const chatWidget = document.getElementById("chatWidget");
const sendChatBtn = document.getElementById("sendChatBtn");
const chatMessages = document.getElementById("chatMessages");
const chatInput = document.getElementById("chatInput");

// Preguntas frecuentes
const faqs = {
    "horarios": "Nuestro horario de atención es de lunes a viernes de 8:00 AM a 6:00 PM.",
    "ubicación": "Estamos ubicados en Popayán, Cauca, Colombia.",
    "servicios": "Ofrecemos asesoría en visualización de negocios, automatización y desarrollo web.",
    "contacto": "Puedes escribirnos al correo contacto@empresa.com o llamarnos al 123-456-789."
};

// Función para responder automáticamente
function getFAQResponse(message) {
    const lowerMsg = message.toLowerCase();
    for (let key in faqs) {
        if (lowerMsg.includes(key)) {
            return faqs[key];
        }
    }
    return "Gracias por tu mensaje. Un asesor te responderá pronto.";
}

// Abrir chat con mensaje automático
openChatBtn.addEventListener("click", () => {
    chatWidget.style.display = "block";

    // Mensaje automático al abrir
    const autoMsg = document.createElement("div");
    autoMsg.textContent = "¡Hola! 👋 Bienvenido a nuestro chat de Biznova Corp. ¿En qué puedo ayudarte hoy?";
    autoMsg.classList.add("bot-message");
    chatMessages.appendChild(autoMsg);
});

// Cerrar chat
closeChatBtn.addEventListener("click", () => {
    chatWidget.style.display = "none";
});

// Enviar mensaje con respuesta automática
sendChatBtn.addEventListener("click", () => {
    const message = chatInput.value.trim();
    if (message !== "") {
        // Mensaje del usuario
        const msgElement = document.createElement("div");
        msgElement.textContent = message;
        msgElement.classList.add("user-message");
        chatMessages.appendChild(msgElement);

        // Respuesta automática
        const response = getFAQResponse(message);
        const botElement = document.createElement("div");
        botElement.textContent = response;
        botElement.classList.add("bot-message");
        chatMessages.appendChild(botElement);

        chatInput.value = "";
    }
});
