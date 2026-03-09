document.addEventListener('DOMContentLoaded', () => {
    
    // --- Lógica del Audio y Overlay Inicial con YouTube API ---
    const btnAbrir = document.getElementById('abrir-invitacion');
    const overlay = document.getElementById('welcome-overlay');
    const mainContainer = document.querySelector('.main-container');
    const musicToggle = document.getElementById('music-toggle');
    
    let isPlaying = false;
    let player;

    // Cargar API de YouTube de forma asíncrona
    const tag = document.createElement('script');
    tag.src = "https://www.youtube.com/iframe_api";
    const firstScriptTag = document.getElementsByTagName('script')[0];
    firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

    // Función global que llama YouTube API cuando está lista
    window.onYouTubeIframeAPIReady = function() {
        player = new YT.Player('youtube-audio', {
            height: '0',
            width: '0',
            videoId: '0aUav1lz3hM', // "Baby Mine (Instrumental)" o similar
            playerVars: {
                'autoplay': 0,
                'controls': 0,
                'loop': 1,
                'playlist': '0aUav1lz3hM'
            },
            events: {
                'onReady': onPlayerReady
            }
        });
    };

    function onPlayerReady(event) {
        // Establecer un volumen suave de cuna (40%)
        player.setVolume(40);
        
        btnAbrir.addEventListener('click', () => {
            // Reproducir música
            player.playVideo();
            isPlaying = true;
            musicToggle.style.display = 'flex';

            // Ocultar overlay
            overlay.style.opacity = '0';
            setTimeout(() => {
                overlay.style.display = 'none';
                mainContainer.style.display = 'block';
                
                // Trigger scroll animation for elements that are already in view
                handleScrollAnimation();
            }, 800);
        });

        // Toggle Music Button
        musicToggle.addEventListener('click', () => {
            if (isPlaying) {
                player.pauseVideo();
                musicToggle.classList.add('muted');
                musicToggle.innerHTML = '<i class="fa-solid fa-music-slash"></i>';
            } else {
                player.playVideo();
                musicToggle.classList.remove('muted');
                musicToggle.innerHTML = '<i class="fa-solid fa-music"></i>';
            }
            isPlaying = !isPlaying;
        });
    }


    // --- Animación en Scroll (Fade In) ---
    const fadeElements = document.querySelectorAll('.fade-in');

    const handleScrollAnimation = () => {
        const triggerBottom = window.innerHeight * 0.85;

        fadeElements.forEach(element => {
            const elementTop = element.getBoundingClientRect().top;

            if (elementTop < triggerBottom) {
                element.classList.add('visible');
            }
        });
    };

    window.addEventListener('scroll', handleScrollAnimation);


    // --- Lógica del Formulario RSVP ---
    const attendanceSelect = document.getElementById('attendance');
    const guestsGroup = document.getElementById('guests-group');
    const guestsInput = document.getElementById('guests');
    const rsvpForm = document.getElementById('rsvp-form');

    // Mostrar/ocultar input de pases dependiendo de la asistencia
    attendanceSelect.addEventListener('change', (e) => {
        if (e.target.value === 'si') {
            guestsGroup.style.display = 'block';
            guestsInput.required = true;
        } else {
            guestsGroup.style.display = 'none';
            guestsInput.required = false;
        }
    });

    // Enviar a WhatsApp
    rsvpForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const name = document.getElementById('name').value.trim();
        const attendance = attendanceSelect.value;
        const guests = guestsInput.value;

        // Número de teléfono extraído de la imagen (con lada de México)
        const phone = "522212660633"; 
        
        let message = '';

        if (attendance === 'si') {
            message = `¡Hola! Soy *${name}* y confirmo con mucha alegría mi asistencia al Baby Shower de Martín Eduardo. 😊👶 Seremos ${guests} persona(s) en total.`;
        } else if (attendance === 'no') {
            message = `¡Hola! Soy *${name}*. Agradezco mucho la invitación al Baby Shower de Martín Eduardo, pero lamentablemente no podré asistir. ¡Les envío mis mejores deseos y un abrazo! 💛`;
        } else {
            return;
        }

        // Codificar mensaje para URL
        const encodedMessage = encodeURIComponent(message);
        const whatsappURL = `https://wa.me/${phone}?text=${encodedMessage}`;

        // Abrir en nueva pestaña
        window.open(whatsappURL, '_blank');
    });

});
