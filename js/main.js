// 1. Scroll Fade-In
const faders = document.querySelectorAll('.fade-in');
const appearOptions = { threshold: 0.2, rootMargin: "0px 0px -50px 0px" };
const appearOnScroll = new IntersectionObserver(function (entries, observer) {
    entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("show");
        observer.unobserve(entry.target);
    });
}, appearOptions);
faders.forEach(fader => { appearOnScroll.observe(fader); });

// 2. Typewriter Rápido
const text = "HENRY ALEXANDER LEYTON GONZÁLEZ";
const speed = 50;
let i = 0;
const typewriterElement = document.getElementById("typewriter");
function typeWriter() {
    if (i < text.length) {
        typewriterElement.textContent += text.charAt(i);
        i++;
        setTimeout(typeWriter, speed);
    } else {
        typewriterElement.classList.add("typing-done");
    }
}
window.onload = function () { setTimeout(typeWriter, 1000); };

// 3. Slider con Flechas (Prevención de Modal)
const sliders = document.querySelectorAll('.slider-wrapper');
sliders.forEach(slider => {
    const container = slider.querySelector('.slider-container');
    const nextBtn = slider.querySelector('.next-btn');
    const prevBtn = slider.querySelector('.prev-btn');

    nextBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        container.scrollBy({ left: container.offsetWidth, behavior: 'smooth' });
    });
    prevBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        container.scrollBy({ left: -container.offsetWidth, behavior: 'smooth' });
    });
});

// 4. Skills Interactivos (Click)
const techCards = document.querySelectorAll('.tech-card');
techCards.forEach(card => {
    card.addEventListener('click', () => {
        card.classList.toggle('active');
    });
});

// 5. Modal de Proyectos con Galería
const modal = document.getElementById("projectModal");
const closeModal = document.querySelector(".close-modal");
const projectCards = document.querySelectorAll(".project-card-trigger");

// Elementos del Modal
const modalTitle = document.getElementById("modalTitle");
const modalDesc = document.getElementById("modalDesc");
const modalTech = document.getElementById("modalTech");
const modalRepo = document.getElementById("modalRepo");
const modalImg = document.getElementById("modalImg");
const prevModalBtn = document.querySelector(".prev-modal");
const nextModalBtn = document.querySelector(".next-modal");

// Variables para la galería del modal
let currentModalImages = [];
let currentImageIndex = 0;

function updateModalImage() {
    if (currentModalImages.length > 0) {
        modalImg.style.opacity = '0'; // Efecto fade
        setTimeout(() => {
            modalImg.src = currentModalImages[currentImageIndex];
            modalImg.style.opacity = '1';
        }, 150);
    }
}

projectCards.forEach(card => {
    card.addEventListener('click', (e) => {
        // Ignorar clicks en botones del slider o repo
        if (e.target.closest('.no-modal') || e.target.closest('.slider-btn')) return;

        // 1. Llenar Textos
        modalTitle.textContent = card.getAttribute('data-title');
        modalDesc.textContent = card.getAttribute('data-desc');
        modalTech.textContent = card.getAttribute('data-tech');
        modalRepo.href = card.getAttribute('data-repo');

        // 2. Capturar imágenes del proyecto
        // Buscamos todas las imágenes dentro del slider de ESTA tarjeta
        const imagesInCard = card.querySelectorAll('.slider-item img');
        currentModalImages = Array.from(imagesInCard).map(img => img.src);
        currentImageIndex = 0; // Empezar por la primera

        updateModalImage();
        modal.style.display = "block";
    });
});

// Navegación en Modal
prevModalBtn.addEventListener('click', () => {
    if (currentModalImages.length > 0) {
        currentImageIndex = (currentImageIndex - 1 + currentModalImages.length) % currentModalImages.length;
        updateModalImage();
    }
});
nextModalBtn.addEventListener('click', () => {
    if (currentModalImages.length > 0) {
        currentImageIndex = (currentImageIndex + 1) % currentModalImages.length;
        updateModalImage();
    }
});

closeModal.addEventListener('click', () => modal.style.display = "none");
window.addEventListener('click', (e) => {
    if (e.target == modal) modal.style.display = "none";
});

// 6. Terminal 3D (Flip & Bash)
const terminalCard = document.getElementById('terminalCard');
const bashInput = document.getElementById('bashInput');
const bashBody = document.getElementById('bashBody');
const closeTerminal = document.getElementById('closeTerminal');

if (terminalCard) {
    document.querySelector('.front').addEventListener('click', () => {
        terminalCard.classList.add('is-flipped');
        setTimeout(() => bashInput.focus(), 500);
    });

    closeTerminal.addEventListener('click', (e) => {
        e.stopPropagation();
        terminalCard.classList.remove('is-flipped');
    });

    document.querySelector('.back').addEventListener('click', (e) => {
        e.stopPropagation();
        bashInput.focus();
    });

    bashInput.addEventListener('keydown', function (e) {
        if (e.key === 'Enter') {
            const command = this.value.trim().toLowerCase();
            const originalCmd = this.value;

            const historyLine = document.createElement('div');
            historyLine.innerHTML = `<span class="prompt">root@kali:~$</span> ${originalCmd}`;
            bashBody.insertBefore(historyLine, this.parentElement);

            let response = '';
            switch (command) {
                case 'help': response = "Comandos: <span class='cmd-highlight'>whoami</span>, <span class='cmd-highlight'>ls</span>, <span class='cmd-highlight'>clear</span>, <span class='cmd-highlight'>exit</span>"; break;
                case 'whoami': response = "Henry Leyton - CyberSec & Dev"; break;
                case 'ls': response = "Skills/<br>Python&nbsp;&nbsp;C#&nbsp;&nbsp;SQL&nbsp;&nbsp;Linux&nbsp;&nbsp;Git&nbsp;&nbsp;Pentesting"; break;
                case 'clear':
                    const inputs = bashBody.querySelectorAll('div:not(.input-line)');
                    inputs.forEach(el => el.remove());
                    this.value = ''; return;
                case 'exit': terminalCard.classList.remove('is-flipped'); this.value = ''; return;
                case '': break;
                default: response = `bash: ${command}: command not found`;
            }

            if (response) {
                const responseLine = document.createElement('div');
                responseLine.className = 'output';
                responseLine.innerHTML = response;
                bashBody.insertBefore(responseLine, this.parentElement);
            }
            this.value = '';
            bashBody.scrollTop = bashBody.scrollHeight;
        }
    });
}