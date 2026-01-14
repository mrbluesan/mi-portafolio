// ==========================================
// 1. CONFIGURACIÓN INICIAL & EFECTOS BASES
// ==========================================

const faders = document.querySelectorAll('.fade-in');
if (faders.length > 0) {
    const appearOptions = { threshold: 0.2, rootMargin: "0px 0px -50px 0px" };
    const appearOnScroll = new IntersectionObserver(function(entries, observer) {
        entries.forEach(entry => {
            if (!entry.isIntersecting) return;
            entry.target.classList.add("show");
            observer.unobserve(entry.target);
        });
    }, appearOptions);
    faders.forEach(fader => { appearOnScroll.observe(fader); });
}

const typewriterElement = document.getElementById("typewriter");
if (typewriterElement) {
    const text = "HENRY ALEXANDER LEYTON GONZÁLEZ";
    const speed = 30; 
    let i = 0;
    function typeWriter() {
        if (i < text.length) {
            typewriterElement.textContent += text.charAt(i);
            i++;
            setTimeout(typeWriter, speed);
        } else {
            typewriterElement.classList.add("typing-done");
        }
    }
    setTimeout(typeWriter, 1000); 
}

// ==========================================
// 2. DATOS DE PROYECTOS (JSON)
// ==========================================
const myProjects = [
    {
        title: "Sistema CRUD para ONG",
        desc: "Aplicación web completa desarrollada con Python (Django) y MySQL. Este sistema permite registrar usuarios, gestionar roles, listar beneficiarios y visualizar estadísticas generales. Incluye autenticación segura.",
        tech: "Python, Django, MySQL, Bootstrap",
        repo: "https://github.com/mrbluesan/proyecto1",
        images: [
            "assets/img/img0-project1.png",
            "assets/img/img1-project1.png",
            "assets/img/img2-project1.png",
            "assets/img/img3-project1.png",
            "assets/img/img4-project1.png",
            "assets/img/img5-project1.png"
        ]
    },
    {
        title: "Automatización en Linux",
        desc: "Script avanzado en Python y Bash diseñado para optimizar la organización de archivos. Clasifica descargas, limpia logs antiguos y realiza backups programados.",
        tech: "Python, Bash, Linux, Cron",
        repo: "https://github.com/mrbluesan/proyecto2",
        images: [
            "https://placehold.co/600x350/21262d/FCC624?text=Linux:+Terminal",
            "https://placehold.co/600x350/161b22/FCC624?text=Linux:+Codigo"
        ]
    },
    {
        title: "Laboratorio de Pentesting",
        desc: "Informe técnico de un ejercicio de pentesting en la maquina SimpleCTF en plataforma TryHackMe. Explotación de vulnerabilidad en protocolo FTP y postexplotación por ssh con Hydra.",
        tech: "Metasploit, Nmap, Hydra",
        repo: "https://github.com/mrbluesan/Ciberseguridad-Writeups/blob/main/TryHackMe/SimpleCTF.md",
        images: [
            "https://placehold.co/600x350/21262d/00ff41?text=Pentest:+Escaneo",
            "https://placehold.co/600x350/000000/00ff41?text=Pentest:+Reporte"
        ]
    }
];

// ==========================================
// 3. RENDERIZADO Y EVENTOS
// ==========================================

let currentModalImages = [];
let currentImageIndex = 0;
const modalImg = document.getElementById("modalImg");
const modal = document.getElementById("projectModal");

function updateModalImage() {
    if (currentModalImages.length > 0 && modalImg) {
        modalImg.style.opacity = '0';
        setTimeout(() => {
            modalImg.src = currentModalImages[currentImageIndex];
            modalImg.style.opacity = '1';
        }, 150);
    }
}

function renderProjects() {
    const container = document.getElementById('projects-container');
    if (!container) return;
    container.innerHTML = ''; 

    myProjects.forEach(project => {
        let imagesHTML = '';
        project.images.forEach(imgSrc => {
            imagesHTML += `<div class="slider-item"><img src="${imgSrc}" alt="${project.title}"></div>`;
        });

        const cardHTML = `
            <div class="card project-card-trigger" 
                 data-title="${project.title}" 
                 data-desc="${project.desc}"
                 data-tech="${project.tech}"
                 data-repo="${project.repo}">
                 <div class="slider-wrapper">
                    <button class="slider-btn prev-btn"><i class="fas fa-chevron-left"></i></button>
                    <div class="slider-container">${imagesHTML}</div>
                    <button class="slider-btn next-btn"><i class="fas fa-chevron-right"></i></button>
                </div>
                <div class="card-content">
                    <h3>${project.title}</h3>
                    <p>${project.desc.substring(0, 100)}...</p>
                    <a href="${project.repo}" target="_blank" class="btn-repo no-modal">
                        Ver en GitHub <i class="fas fa-arrow-right"></i>
                    </a>
                </div>
            </div>`;
        container.innerHTML += cardHTML;
    });

    initializeProjectInteractions();
}

function initializeProjectInteractions() {
    // Sliders
    document.querySelectorAll('.slider-wrapper').forEach(slider => {
        const container = slider.querySelector('.slider-container');
        const nextBtn = slider.querySelector('.next-btn');
        const prevBtn = slider.querySelector('.prev-btn');

        if(nextBtn) nextBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            container.scrollBy({ left: container.offsetWidth, behavior: 'smooth' });
        });
        if(prevBtn) prevBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            container.scrollBy({ left: -container.offsetWidth, behavior: 'smooth' });
        });
    });

    // Modal Triggers
    const projectCards = document.querySelectorAll(".project-card-trigger");
    const closeModal = document.querySelector(".close-modal");
    const prevModalBtn = document.querySelector(".prev-modal");
    const nextModalBtn = document.querySelector(".next-modal");

    projectCards.forEach(card => {
        card.addEventListener('click', (e) => {
            if (e.target.closest('.no-modal') || e.target.closest('.slider-btn')) return;
            
            const mTitle = document.getElementById("modalTitle");
            const mDesc = document.getElementById("modalDesc");
            const mTech = document.getElementById("modalTech");
            const mRepo = document.getElementById("modalRepo");

            if(mTitle) mTitle.textContent = card.getAttribute('data-title');
            if(mDesc) mDesc.textContent = card.getAttribute('data-desc');
            if(mTech) mTech.textContent = card.getAttribute('data-tech');
            if(mRepo) mRepo.href = card.getAttribute('data-repo');
            
            const imagesInCard = card.querySelectorAll('.slider-item img');
            currentModalImages = Array.from(imagesInCard).map(img => img.src);
            currentImageIndex = 0;
            
            updateModalImage();
            if(modal) modal.style.display = "block";
        });
    });

    if(prevModalBtn) prevModalBtn.onclick = () => {
        if (currentModalImages.length > 0) {
            currentImageIndex = (currentImageIndex - 1 + currentModalImages.length) % currentModalImages.length;
            updateModalImage();
        }
    };
    if(nextModalBtn) nextModalBtn.onclick = () => {
        if (currentModalImages.length > 0) {
            currentImageIndex = (currentImageIndex + 1) % currentModalImages.length;
            updateModalImage();
        }
    };
    if(closeModal) closeModal.addEventListener('click', () => modal.style.display = "none");
    window.addEventListener('click', (e) => { if (e.target == modal) modal.style.display = "none"; });
}

document.querySelectorAll('.tech-card').forEach(card => {
    card.addEventListener('click', () => card.classList.toggle('active'));
});

// ==========================================
// 4. TERMINAL 3D AVANZADA (FULL)
// ==========================================
const terminalCard = document.getElementById('terminalCard');
const bashInput = document.getElementById('bashInput');
const bashBody = document.getElementById('bashBody');
const closeTerminal = document.getElementById('closeTerminal');

let commandHistory = [];
let historyIndex = -1;

// Filesystem simulado para el comando 'cat'
const virtualFileSystem = {
    'skills.txt': 'Python, Django, SQL, Linux, Git, Pentesting, HTML5, CSS3',
    'about.md': 'Estudiante de Ingeniería en Informática. Apasionado por la ciberseguridad.',
    'contact.info': 'Email: henryalexanderleyton@gmail.com\nGitHub: github.com/mrbluesan',
    'root.log': 'Error: Permission denied.'
};

function printTerminal(html) {
    const line = document.createElement('div');
    line.className = 'output';
    line.innerHTML = html;
    bashBody.insertBefore(line, bashInput.parentElement);
    bashBody.scrollTop = bashBody.scrollHeight;
}

if (terminalCard && bashInput && bashBody) {
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

    bashInput.addEventListener('keydown', async function(e) {
        if (e.key === 'ArrowUp') {
            e.preventDefault();
            if (commandHistory.length > 0) {
                if (historyIndex === -1) historyIndex = commandHistory.length;
                if (historyIndex > 0) {
                    historyIndex--;
                    this.value = commandHistory[historyIndex];
                }
            }
        } else if (e.key === 'ArrowDown') {
            e.preventDefault();
            if (historyIndex !== -1) {
                if (historyIndex < commandHistory.length - 1) {
                    historyIndex++;
                    this.value = commandHistory[historyIndex];
                } else {
                    historyIndex = -1;
                    this.value = '';
                }
            }
        } else if (e.key === 'Enter') {
            const fullCommand = this.value.trim();
            const parts = fullCommand.split(/\s+/);
            const command = parts[0].toLowerCase();
            const arg = parts[1];
            
            if (fullCommand) {
                commandHistory.push(fullCommand);
                historyIndex = -1;
            }

            const historyLine = document.createElement('div');
            historyLine.innerHTML = `<span class="prompt">root@kali:~$</span> ${fullCommand}`;
            bashBody.insertBefore(historyLine, this.parentElement);
            this.value = '';

            switch(command) {
                case 'help': 
                    printTerminal("Comandos: <span class='cmd-highlight'>ls</span>, <span class='cmd-highlight'>cat [archivo]</span>, <span class='cmd-highlight'>whoami</span>, <span class='cmd-highlight'>scan</span>, <span class='cmd-highlight'>matrix</span>, <span class='cmd-highlight'>ifconfig</span>, <span class='cmd-highlight'>github</span>, <span class='cmd-highlight'>date</span>, <span class='cmd-highlight'>clear</span>, <span class='cmd-highlight'>exit</span>"); 
                    break;
                case 'whoami': printTerminal("Henry Leyton - CyberSec & Dev"); break;
                case 'ls': 
                    const files = Object.keys(virtualFileSystem).map(f => `<span style="color: #98c379">${f}</span>`).join('&nbsp;&nbsp;&nbsp;&nbsp;');
                    printTerminal(files); 
                    break;
                case 'pwd': printTerminal("/home/henry/portfolio"); break;
                case 'ifconfig':
                    printTerminal(`eth0: flags=4163&lt;UP&gt; mtu 1500<br>inet 192.168.1.15<br><br>tun0: flags=4305&lt;UP&gt; mtu 1500<br>inet 10.10.14.23 <span style="color: #98c379"># VPN</span>`);
                    break;
                case 'scan':
                    printTerminal("Starting Nmap 7.94...");
                    setTimeout(() => {
                        printTerminal("PORT STATE SERVICE<br>21/tcp <span style='color:#00ff41'>open</span> ftp<br>22/tcp <span style='color:#00ff41'>open</span> ssh<br>80/tcp <span style='color:#00ff41'>open</span> http");
                    }, 600);
                    break;
                case 'cat':
                    if (!arg) printTerminal("Uso: cat [nombre_archivo]");
                    else if (virtualFileSystem[arg]) printTerminal(virtualFileSystem[arg].replace(/\n/g, '<br>'));
                    else printTerminal(`cat: ${arg}: No existe el archivo`);
                    break;
                case 'date': printTerminal(new Date().toString()); break;
                case 'sudo': printTerminal(`<span style="color: #ff5f56">user is not in the sudoers file. This incident will be reported.</span>`); break;
                case 'matrix':
                    {
                        bashInput.disabled = true;
                        const chars = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ@#$%^&*";
                        const matrixInterval = setInterval(() => {
                            let line = "";
                            for(let j=0; j<40; j++) line += chars.charAt(Math.floor(Math.random() * chars.length)) + "&nbsp;&nbsp;";
                            const div = document.createElement('div');
                            div.className = 'output';
                            div.style.color = '#00ff41';
                            div.style.whiteSpace = 'nowrap';
                            div.innerHTML = line;
                            bashBody.insertBefore(div, bashInput.parentElement);
                            bashBody.scrollTop = bashBody.scrollHeight;
                        }, 50);
                        setTimeout(() => {
                            clearInterval(matrixInterval);
                            bashInput.disabled = false;
                            bashInput.focus();
                            printTerminal("<br>Matrix connection closed.");
                        }, 3000);
                    }
                    break;
                case 'github':
                    printTerminal("Conectando a API de GitHub...");
                    try {
                        const response = await fetch('https://api.github.com/users/mrbluesan');
                        if (!response.ok) throw new Error('Error');
                        const data = await response.json();
                        printTerminal(`User: <span class="cmd-highlight">${data.login}</span><br>Repos: ${data.public_repos}<br>Followers: ${data.followers}<br>URL: <a href="${data.html_url}" target="_blank" style="color:#fff">${data.html_url}</a>`);
                    } catch (e) { printTerminal(`<span style="color:#ff5f56">Error de conexión.</span>`); }
                    break;
                case 'clear': 
                    const outputs = bashBody.querySelectorAll('div:not(.input-line)');
                    outputs.forEach(el => el.remove());
                    break;
                case 'exit': terminalCard.classList.remove('is-flipped'); break;
                case '': break;
                default: printTerminal(`bash: ${command}: command not found`);
            }
            bashBody.scrollTop = bashBody.scrollHeight;
        }
    });
}

// ==========================================
// 5. FONDO DE PARTÍCULAS (MÓVIL AJUSTADO)
// ==========================================
const canvas = document.getElementById("particles-canvas");
if (canvas) {
    const ctx = canvas.getContext("2d");
    let particlesArray;
    let mouse = { x: null, y: null };

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    window.addEventListener('mousemove', function(event) { mouse.x = event.x; mouse.y = event.y; });
    window.addEventListener('mouseout', function() { mouse.x = undefined; mouse.y = undefined; });

    class Particle {
        constructor() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.size = Math.random() * 1.5 + 0.5; 
            this.speedX = (Math.random() * 0.2) - 0.1;
            this.speedY = (Math.random() * 0.2) - 0.1;
        }
        update() {
            this.x += this.speedX;
            this.y += this.speedY;
            if (this.x > canvas.width || this.x < 0) this.speedX = -this.speedX;
            if (this.y > canvas.height || this.y < 0) this.speedY = -this.speedY;

            if (mouse.x != undefined) {
                let dx = mouse.x - this.x;
                let dy = mouse.y - this.y;
                let distance = Math.sqrt(dx * dx + dy * dy);
                if (distance < 200) { 
                    const forceDirectionX = dx / distance;
                    const forceDirectionY = dy / distance;
                    const force = (200 - distance) / 200;
                    const directionX = forceDirectionX * force * 0.5; 
                    const directionY = forceDirectionY * force * 0.5;
                    this.x += directionX;
                    this.y += directionY;
                }
            }
        }
        draw() {
            ctx.fillStyle = '#58a6ff';
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fill();
        }
    }

    function initParticles() {
        particlesArray = [];
        // MÓVIL: Menos partículas
        let divider = (canvas.width < 768) ? 15000 : 25000; 
        let numberOfParticles = (canvas.height * canvas.width) / divider;
        for (let i = 0; i < numberOfParticles; i++) {
            particlesArray.push(new Particle());
        }
    }

    function connect() {
        let opacityValue = 1;
        
        // MÓVIL: Mayor distancia de conexión
        let connectionDistance = (canvas.width < 768) 
            ? 9000 
            : (canvas.width / 9) * (canvas.height / 9);

        for (let a = 0; a < particlesArray.length; a++) {
            for (let b = a; b < particlesArray.length; b++) {
                let distance = ((particlesArray[a].x - particlesArray[b].x) * (particlesArray[a].x - particlesArray[b].x)) + 
                               ((particlesArray[a].y - particlesArray[b].y) * (particlesArray[a].y - particlesArray[b].y));
                
                let maxDistance = (canvas.width < 768) ? 9000 : (canvas.width / 9) * (canvas.height / 9);

                if (distance < maxDistance) {
                // Ajustamos la opacidad para que no sea tan brusca en móvil
                    opacityValue = 1 - (distance / 20000);
                
                    ctx.strokeStyle = 'rgba(88, 166, 255,' + opacityValue + ')';
                    ctx.lineWidth = 1;
                    ctx.beginPath();
                    ctx.moveTo(particlesArray[a].x, particlesArray[a].y);
                    ctx.lineTo(particlesArray[b].x, particlesArray[b].y);
                    ctx.stroke();
                }
            }
            if (mouse.x != undefined) {
                let dx = particlesArray[a].x - mouse.x;
                let dy = particlesArray[a].y - mouse.y;
                let mouseDistance = (dx*dx) + (dy*dy);
                if (mouseDistance < 25000) { 
                    let mouseOpacity = 1 - (mouseDistance / 25000);
                    ctx.strokeStyle = 'rgba(88, 166, 255,' + mouseOpacity + ')';
                    ctx.lineWidth = 1;
                    ctx.beginPath();
                    ctx.moveTo(particlesArray[a].x, particlesArray[a].y);
                    ctx.lineTo(mouse.x, mouse.y);
                    ctx.stroke();
                }
            }
        }
    }

    function animateParticles() {
        requestAnimationFrame(animateParticles);
        ctx.clearRect(0, 0, innerWidth, innerHeight);
        for (let i = 0; i < particlesArray.length; i++) {
            particlesArray[i].update();
            particlesArray[i].draw();
        }
        connect();
    }

    window.addEventListener('resize', () => {
        canvas.width = innerWidth;
        canvas.height = innerHeight;
        mouse.radius = (canvas.height / 80) * (canvas.width / 80);
        initParticles();
    });

    initParticles();
    animateParticles();
}

// 6. UX (ScrollSpy & Toast)
function showToast(message) {
    let container = document.getElementById('toast-container');
    if (!container) {
        container = document.createElement('div');
        container.id = 'toast-container';
        document.body.appendChild(container);
    }
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.innerHTML = `<i class="fas fa-check-circle"></i> ${message}`;
    container.appendChild(toast);
    setTimeout(() => {
        toast.classList.add('hide');
        toast.addEventListener('animationend', () => toast.remove());
    }, 3000);
}

function initScrollSpy() {
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('header nav a');
    window.addEventListener('scroll', () => {
        let current = '';
        sections.forEach(section => {
            if (pageYOffset >= (section.offsetTop - 150)) current = section.getAttribute('id');
        });
        navLinks.forEach(link => {
            link.classList.remove('active-link');
            if (link.getAttribute('href').includes(current)) link.classList.add('active-link');
        });
    });
}

const emailElement = document.getElementById('emailCopy');
if(emailElement) {
    emailElement.addEventListener('click', () => {
        const emailText = emailElement.querySelector('strong').textContent;
        navigator.clipboard.writeText(emailText).then(() => showToast('¡Correo copiado!'));
    });
}

// 7. MANEJO DEL FORMULARIO CON EMAILJS
const contactForm = document.getElementById('contactForm');

if (contactForm) {
    contactForm.addEventListener("submit", function(event) {
        event.preventDefault();
        console.log("🚀 Enviando formulario con EmailJS...");

        const btnSubmit = document.querySelector('.btn-submit');
        const originalText = btnSubmit.innerHTML;

        // Estado de carga
        btnSubmit.disabled = true;
        btnSubmit.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Enviando...';

        // REEMPLAZA ESTOS VALORES CON LOS DE TU CUENTA DE EMAILJS
        const serviceID = 'TU_SERVICE_ID'; // EJEMPLO: 'service_z3x9...'
        const templateID = 'TU_TEMPLATE_ID'; // EJEMPLO: 'template_k4j...'

        emailjs.sendForm(serviceID, templateID, this)
            .then(() => {
                showToast('¡Mensaje enviado con éxito!');
                contactForm.reset();
                btnSubmit.innerHTML = 'Enviado <i class="fas fa-check"></i>';
                btnSubmit.style.background = '#238636';
            }, (err) => {
                console.error("Error de EmailJS:", err);
                showToast('Hubo un problema al enviar.');
                btnSubmit.innerHTML = 'Error';
                btnSubmit.style.background = '#ff5f56';
            })
            .finally(() => {
                 setTimeout(() => {
                    btnSubmit.disabled = false;
                    btnSubmit.innerHTML = originalText;
                    btnSubmit.style.background = '#238636';
                }, 3000);
            });
    });
}

// Iniciar aplicación
window.onload = function() { 
    renderProjects();
    initScrollSpy();
};
