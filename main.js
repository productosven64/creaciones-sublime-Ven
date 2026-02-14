/**
 * main.js - Lógica del Agente "Rut" para Creaciones Sublime
 */

document.addEventListener('DOMContentLoaded', () => {
    // Selectores
    const agentBubble = document.getElementById('agent-bubble');
    const chatWindow = document.getElementById('chat-window');
    const closeChat = document.getElementById('closeChat');
    const chatMessages = document.getElementById('chat-messages');
    const userInput = document.getElementById('userInput');
    const sendMessage = document.getElementById('sendMessage');
    const openChatBtn = document.getElementById('openChat');

    // Estado del Chat
    let chatActive = false;
    let agentTriggered = false;
    let currentStep = 'welcome';
    let userData = {
        name: '',
        email: '',
        phone: '',
        location: '',
        web: '',
        budget: '',
        availability: ''
    };

    // --- Lógica de UI ---
    const toggleChat = () => {
        chatActive = !chatActive;
        if (chatActive) {
            chatWindow.classList.remove('hidden');
            agentBubble.querySelector('.notification-badge').style.display = 'none';
            if (chatMessages.children.length === 0) {
                startConversation();
            }
        } else {
            chatWindow.classList.add('hidden');
        }
    };

    agentBubble.addEventListener('click', toggleChat);
    closeChat.addEventListener('click', toggleChat);
    if (openChatBtn) {
        openChatBtn.addEventListener('click', () => {
            if (!chatActive) toggleChat();
        });
    }

    // --- Lógica del Agente Proactivo ---
    const triggerAgent = () => {
        if (!agentTriggered && !chatActive) {
            agentTriggered = true;
            toggleChat();
        }
    };

    setTimeout(triggerAgent, 5000);

    window.addEventListener('scroll', () => {
        const scrolled = (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100;
        if (scrolled > 30) triggerAgent();
    });

    // --- Manejo de Mensajes ---
    const addMessage = (text, sender = 'agent') => {
        const msgDiv = document.createElement('div');
        msgDiv.className = `message ${sender}`;
        msgDiv.innerHTML = text;
        chatMessages.appendChild(msgDiv);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    };

    const startConversation = () => {
        addMessage("¡Hola! 👋 Soy <b>Rut</b>, tu asistente en <b>Creaciones Sublime</b>.", 'agent');
        setTimeout(() => {
            addMessage("Estamos en La Guaira y somos expertos en sublimación. Ofrecemos:<br><br>1️⃣ <b>Estampado en telas:</b> Franelas, bolsos, uniformes, gorras.<br>2️⃣ <b>Tazas y vasos:</b> Personalizados con tu logo o diseño.<br>3️⃣ <b>Aluminio:</b> Láminas para grados o fotos especiales.<br>4️⃣ <b>Souvenirs:</b> Llaveros, bolígrafos, rompecabezas y más.<br><br>¿En qué puedo ayudarte hoy?", 'agent');
            currentStep = 'initial_query';
        }, 1000);
    };

    const handleUserInput = () => {
        const text = userInput.value.trim();
        if (!text) return;

        addMessage(text, 'user');
        userInput.value = '';

        processResponse(text);
    };

    sendMessage.addEventListener('click', handleUserInput);
    userInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') handleUserInput();
    });

    const processResponse = (text) => {
        setTimeout(() => {
            switch (currentStep) {
                case 'initial_query':
                    addMessage("¡Excelente! Para brindarte la mejor atención y que uno de nuestros expertos se comunique contigo, ¿podrías decirme tu <b>Nombre y Apellido</b>?", 'agent');
                    currentStep = 'collect_name';
                    break;

                case 'collect_name':
                    userData.name = text;
                    addMessage(`¡Un gusto, ${userData.name.split(' ')[0]}! 😊 Ahora, ¿me podrías indicar tu <b>correo electrónico</b>?`, 'agent');
                    currentStep = 'collect_email';
                    break;

                case 'collect_email':
                    if (text.includes('@') && text.includes('.')) {
                        userData.email = text;
                        addMessage("Perfecto. ¿Cuál es tu <b>número de teléfono</b> (si es posible con código de área)?", 'agent');
                        currentStep = 'collect_phone';
                    } else {
                        addMessage("Parece que ese correo no es válido. ¿Podrías escribirlo de nuevo?", 'agent');
                    }
                    break;

                case 'collect_phone':
                    userData.phone = text;
                    addMessage("¡Entendido! ¿En qué <b>país o ciudad</b> resides actualmente?", 'agent');
                    currentStep = 'collect_location';
                    break;

                case 'collect_location':
                    userData.location = text;
                    addMessage("Gracias. Si tienes una <b>página web</b> puedes escribirla aquí (o escribe 'no' para saltar este paso).", 'agent');
                    currentStep = 'collect_web';
                    break;

                case 'collect_web':
                    userData.web = text.toLowerCase() === 'no' ? 'No proporcionada' : text;
                    addMessage("¿Tienes un <b>presupuesto estimado</b> para tu proyecto? Ayuda mucho a darte la mejor solución (o escribe 'no' para saltar).", 'agent');
                    currentStep = 'collect_budget';
                    break;

                case 'collect_budget':
                    userData.budget = text.toLowerCase() === 'no' ? 'No proporcionado' : text;
                    addMessage(`¡Genial! Vamos a confirmar:<br><br>👤 <b>Nombre:</b> ${userData.name}<br>📧 <b>Correo:</b> ${userData.email}<br>📞 <b>Tel:</b> ${userData.phone}<br>📍 <b>Ubicación:</b> ${userData.location}<br>🌐 <b>Web:</b> ${userData.web}<br>💰 <b>Presupuesto:</b> ${userData.budget}<br><br>¿Son correctos estos datos?`, 'agent');
                    currentStep = 'confirm_data';
                    break;

                case 'confirm_data':
                    if (text.toLowerCase().includes('si') || text.toLowerCase().includes('correcto')) {
                        addMessage("¡Perfecto! Para que el equipo te contacte mejor, ¿qué <b>días u horas</b> prefieres para una breve llamada o reunión?", 'agent');
                        currentStep = 'collect_availability';
                    } else {
                        addMessage("Oh, entiendo. ¿Qué dato te gustaría corregir?", 'agent');
                        currentStep = 'initial_query'; // Simplificado: reiniciar flujo para corrección o pedir que escriba de nuevo
                    }
                    break;

                case 'collect_availability':
                    userData.availability = text;
                    addMessage("¡Listo! He recibido toda tu información. Un asesor experto se pondrá en contacto pronto.", 'agent');
                    saveToGoogleSheets(userData);
                    currentStep = 'final';
                    break;

                default:
                    addMessage("Gracias por tu interés en <b>Creaciones Sublime</b>. ¡Que tengas un gran día!", 'agent');
                    break;
            }
        }, 800);
    };

    const saveToGoogleSheets = (data) => {
        console.log("Simulando guardado en Google Sheets...", data);
        // Aquí se invocaría la API real o herramienta
        // Ejemplo conceptual: Google Sheets record (table="Prospectos", record=data)
        setTimeout(() => {
            addMessage("✅ Tus datos han sido guardados en nuestro sistema de <b>Google Sheets PR</b> (Prospectos). ¡Gracias!", 'agent');
        }, 1500);
    };
    // --- Lógica del Catálogo ---
    const filterButtons = document.querySelectorAll('.filter-btn');
    const catalogItems = document.querySelectorAll('.catalog-item');
    const serviceCards = document.querySelectorAll('.clickable-service');

    const applyFilter = (filter) => {
        // Activar botón
        filterButtons.forEach(b => {
            if (b.getAttribute('data-filter') === filter) {
                b.classList.add('active');
            } else {
                b.classList.remove('active');
            }
        });

        // Filtrar items
        catalogItems.forEach(item => {
            const category = item.getAttribute('data-category');
            if (filter === 'all' || category === filter) {
                item.style.display = 'block';
                setTimeout(() => {
                    item.style.opacity = '1';
                    item.style.transform = 'scale(1)';
                }, 10);
            } else {
                item.style.opacity = '0';
                item.style.transform = 'scale(0.8)';
                setTimeout(() => {
                    item.style.display = 'none';
                }, 400);
            }
        });
    };

    filterButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            applyFilter(btn.getAttribute('data-filter'));
        });
    });

    serviceCards.forEach(card => {
        card.addEventListener('click', () => {
            const service = card.getAttribute('data-service');
            const catalogSection = document.getElementById('catalogo');

            if (catalogSection) {
                catalogSection.scrollIntoView({ behavior: 'smooth' });
                setTimeout(() => {
                    applyFilter(service);
                }, 500); // Wait for scroll to start/finish
            }
        });
    });
});
