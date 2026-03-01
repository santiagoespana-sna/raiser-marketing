document.getElementById("contactForm").addEventListener("submit", function(e) {
    e.preventDefault();

        const name = document.getElementById("name").value.trim();
    const email = document.getElementById("email").value.trim();
    const message = document.getElementById("message").value.trim();

    if(name && email && message) {
    alert("Gracias por contactarnos, " + name + ". Te responderemos pronto.");
    this.reset();
    } else {
    alert("Por favor completa todos los campos.");
    }
});

// --- Simple local chatbot logic ---
document.addEventListener('DOMContentLoaded', function () {
    const openBtn = document.getElementById('openChatBtn');
    const chatWidget = document.getElementById('chatWidget');
    const closeBtn = document.getElementById('closeChatBtn');
    const sendBtn = document.getElementById('sendChatBtn');
    const chatInput = document.getElementById('chatInput');
    const chatMessages = document.getElementById('chatMessages');

    if (!openBtn || !chatWidget) return; // nothing to do

    function appendMessage(who, text) {
        const div = document.createElement('div');
        div.className = 'chat-message ' + (who === 'user' ? 'user' : 'bot');
        div.textContent = text;
        chatMessages.appendChild(div);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    function botReply(userText) {
        const txt = userText.toLowerCase();
        if (txt.includes('hola') || txt.includes('buenas')) return '¡Hola, somos Raise Marketing! ¿En qué puedo ayudarte hoy?'
        if (txt.includes('horario') || txt.includes('hora')) return 'Nuestro horario es Lunes a Viernes de 9:00 a 18:00.';
        if (txt.includes('precio') || txt.includes('costo') || txt.includes('valor')) return 'Para precios, por favor indícanos el servicio de interés y te enviaremos una cotización.';
        if (txt.includes('gracias') || txt.includes('grac')) return 'Con gusto. Si necesitas algo más, aquí estoy.';
        return 'Gracias por tu mensaje. Un agente humano te responderá pronto, o prueba preguntar por horario, precios o contacto.';
    }
    function openChat() {
        chatWidget.setAttribute('aria-hidden', 'false');
        chatWidget.style.display = 'flex';
        chatInput.focus();
        // Greet
        setTimeout(() => appendMessage('bot', 'Hola! somos Raise Marketing, soy su asistente virtual. ¿En qué puedo ayudar?'), 350);
        setTimeout(() => appendMessage('bot', 'Puedes preguntar por nuestro horario, precios o dejar tu mensaje.'), 700);
            
    
    }

    function closeChat() {
        chatWidget.setAttribute('aria-hidden', 'true');
        chatWidget.style.display = 'none';
    }

    openBtn.addEventListener('click', openChat);
    closeBtn.addEventListener('click', closeChat);

    sendBtn.addEventListener('click', function () {
        const v = chatInput.value.trim();
        if (!v) return;
        appendMessage('user', v);
        chatInput.value = '';
        // simulate typing
        setTimeout(() => {
        const reply = botReply(v);
        appendMessage('bot', reply);
        }, 700);
    });

    chatInput.addEventListener('keydown', function (e) {
        if (e.key === 'Enter') {
        e.preventDefault();
        sendBtn.click();
        }
    });
});
