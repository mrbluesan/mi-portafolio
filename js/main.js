// ===== Animación con scroll (Sin cambios, funciona bien) =====
const faders = document.querySelectorAll('.fade-in');
const appearOptions = {
    threshold: 0.2,
    rootMargin: "0px 0px -50px 0px"
};

const appearOnScroll = new IntersectionObserver(function (entries, observer) {
    entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("show");
        observer.unobserve(entry.target);
    });
}, appearOptions);

faders.forEach(fader => {
    appearOnScroll.observe(fader);
});

// ===== Typewriter Effect =====
const text = "HENRY LEYTON GONZÁLEZ";
const speed = 90; // Un poco más rápido para que sea más fluido
let i = 0;
const typewriterElement = document.getElementById("typewriter");

function typeWriter() {
    if (i < text.length) {
        // Escribiendo...
        typewriterElement.textContent += text.charAt(i);
        i++;
        setTimeout(typeWriter, speed);
    } else {
        
        //activa el parpadeo del cursor en el CSS
        typewriterElement.classList.add("typing-done");
    }
}

// Esperar un segundo antes de empezar para que la página cargue bien
window.onload = function () {
    setTimeout(typeWriter, 1000);
};

// ===== Lógica del Slider de Imágenes =====
const sliders = document.querySelectorAll('.slider-wrapper');

sliders.forEach(slider => {
    const container = slider.querySelector('.slider-container');
    const nextBtn = slider.querySelector('.next-btn');
    const prevBtn = slider.querySelector('.prev-btn');

    // Evento para el botón "Siguiente"
    nextBtn.addEventListener('click', () => {
        // Desplaza el ancho exacto del contenedor hacia la derecha
        container.scrollBy({
            left: container.offsetWidth,
            behavior: 'smooth'
        });
    });

    // Evento para el botón "Anterior"
    prevBtn.addEventListener('click', () => {
        // Desplaza el ancho exacto hacia la izquierda (negativo)
        container.scrollBy({
            left: -container.offsetWidth,
            behavior: 'smooth'
        });
    });
});