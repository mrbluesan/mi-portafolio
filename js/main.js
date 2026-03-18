// ==========================================
// 1. CONFIGURACIÓN INICIAL & EFECTOS BASES
// ========================================== 

const appearOptions = { threshold: 0.2, rootMargin: "0px 0px -50px 0px" };
const appearOnScroll = new IntersectionObserver(function(entries, observer) {
    entries.forEach((entry, index) => {
        if (!entry.isIntersecting) return;
        // Delay secuencial basado en el orden relativo de los elementos (stagger) para las tarjetas
        if (entry.target.classList.contains('tech-card') || entry.target.classList.contains('card')) {
            setTimeout(() => {
                entry.target.classList.add("show");
            }, index * 100); // 100ms offset per item
        } else {
            entry.target.classList.add("show");
        }
        observer.unobserve(entry.target);
    });
}, appearOptions);

const faders = document.querySelectorAll('.fade-in');
if (faders.length > 0) {
    faders.forEach(fader => { appearOnScroll.observe(fader); });
}

const typewriterElement = document.getElementById("typewriter");
if (typewriterElement) {
    const text = "HENRY LEYTON GONZÁLEZ";
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
        title: "Sistema con análisis de datos CheckMate Admin",
        desc: "Plataforma administrativa (Django/MySQL) orientada a la gestión de ONG. Implementa un pipeline de datos con Pandas para el registro masivo y normalización de ingresos de beneficiarios vía CSV/Excel. La arquitectura modular, control de roles y visualización de KPIs se desarrolló analizando los flujos operativos para automatizar la gestión y toma de decisiones.",
        tech: "Python, Django, Pandas, MySQL, Bootstrap",
        repo: "https://github.com/mrbluesan/proyecto1",
        images: [
            "assets/img/checkmate_login.png",
            "assets/img/checkmate_dashboard.png",
            "assets/img/checkmate_prestaciones.png",
            "assets/img/checkmate_edit.png"
        ]
    },
    {
        title: "Framework Automatizado de Reconocimiento Inicial",
        desc: "Herramienta de scripting en Bash diseñada para estandarizar la fase de Information Gathering en pentesting web y de infraestructura. Automatiza el descubrimiento de conectividad (ping sweeps), escaneo de puertos, y enumeración de servicios/versiones mediante Nmap, además de estructurar automáticamente el entorno de almacenamiento de evidencias.",
        tech: "Bash, Nmap, Linux, Pentesting",
        repo: "https://github.com/mrbluesan/proyecto2",
        images: [
            "https://placehold.co/600x350/21262d/FCC624?text=Linux:+Terminal",
            "https://placehold.co/600x350/161b22/FCC624?text=Linux:+Codigo"
        ]
    },
    {
        title: "Laboratorio de Pentesting Máquina SimpleCTF",
        desc: "Informe técnico de un ejercicio de pentesting en la maquina SimpleCTF en plataforma TryHackMe. Explotación de vulnerabilidad en protocolo FTP y postexplotación por ssh con Hydra.",
        tech: "Nmap, Hydra, Vim",
        repo: "https://github.com/mrbluesan/Ciberseguridad-Writeups/blob/main/TryHackMe/SimpleCTF.md",
        images: [
            "assets/img/ping.png",
            "assets/img/nmap_inicial.png",
            "assets/img/ftp.png",
            "assets/img/ForMitch.png",
            "assets/img/hydra.png",
            "assets/img/flag1.png",
            "assets/img/sp_vim.png",
            "assets/img/final.png"
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

window.handleRepoClick = async function(e, repoUrl) {
    if (e) e.preventDefault();

    if (!repoUrl || repoUrl === "#" || repoUrl.trim() === "") {
        showToast("Este repositorio aún está en desarrollo o es privado.", "warning");
        return;
    }

    try {
        if (repoUrl.includes("github.com/")) {
            const urlObj = new URL(repoUrl);
            const pathParts = urlObj.pathname.split('/').filter(Boolean);
            if (pathParts.length >= 2) {
                const username = pathParts[0];
                const repo = pathParts[1];
                
                // Validamos mediante la API de GitHub para verificar si existe y es público
                const response = await fetch(`https://api.github.com/repos/${username}/${repo}`);
                if (response.status === 404) {
                    showToast("El repositorio es privado o aún no existe en GitHub.", "warning");
                    return; // Detenemos la navegación
                }
            }
        }
    } catch (error) {
        console.error("No se pudo verificar el repo, omitiendo validación estricta:", error);
    }

    // Si es válido o falló la verificación, abrimos la url
    window.open(repoUrl, "_blank");
};

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
            imagesHTML += `<div class="slider-item"><img src="${imgSrc}" alt="${project.title}" loading="lazy"></div>`;
        });

        const cardHTML = `
            <div class="card project-card-trigger fade-in" 
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
                    <a href="${project.repo || '#'}" target="_blank" class="btn-repo no-modal" onclick="window.handleRepoClick(event, '${project.repo || '#'}')">
                        Ver en GitHub <i class="fas fa-arrow-right"></i>
                    </a>
                </div>
            </div>`;
        container.innerHTML += cardHTML;
    });

    // Re-observar nuevas cards generadas dinámicamente
    const newFaders = container.querySelectorAll('.fade-in');
    newFaders.forEach(fader => { appearOnScroll.observe(fader); });
    
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
            if(mRepo) {
                const repoUrl = card.getAttribute('data-repo') || "#";
                mRepo.href = repoUrl;
                mRepo.onclick = (event) => window.handleRepoClick(event, repoUrl);
            }
            
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
    'skills.txt': 'Python, Django, Pandas, SQL, Linux, Git, Nmap, Pentesting',
    'about.md': 'Estudiante de Ingeniería en Informática. Apasionado por la ciberseguridad.',
    'contact.info': 'Email: henryalexanderleyton@gmail.com\nGitHub: github.com/mrbluesan',
    '.secret': 'Felicidades hacker. Toma tu flag: THM{m4st3r_p0rtf0l10}'
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
            historyLine.innerHTML = `<span class="prompt">root@kali:~$\\</span> ${fullCommand}`;
            bashBody.insertBefore(historyLine, this.parentElement);
            this.value = '';

            switch(command) {
                case 'help': 
                    printTerminal("Comandos: <span class='cmd-highlight'>ls</span>, <span class='cmd-highlight'>cat [archivo]</span>, <span class='cmd-highlight'>whoami</span>, <span class='cmd-highlight'>scan</span>, <span class='cmd-highlight'>matrix</span>, <span class='cmd-highlight'>ifconfig</span>, <span class='cmd-highlight'>github</span>, <span class='cmd-highlight'>date</span>, <span class='cmd-highlight'>clear</span>, <span class='cmd-highlight'>exit</span>"); 
                    break;
                case 'whoami': 
                    bashInput.disabled = true;
                    const whoamiText = "Henry Leyton - CyberSec Specialist & Developer";
                    let wIndex = 0;
                    const wInterval = setInterval(() => {
                        if (wIndex === 0) {
                            bashBody.innerHTML += `<div class='output whoami-typing'></div>`;
                        }
                        const whoamiEl = bashBody.lastElementChild;
                        whoamiEl.textContent += whoamiText.charAt(wIndex);
                        wIndex++;
                        bashBody.scrollTop = bashBody.scrollHeight;
                        if (wIndex >= whoamiText.length) {
                            clearInterval(wInterval);
                            bashInput.disabled = false;
                            bashInput.focus();
                        }
                    }, 50);
                    break;
                case 'sudo': 
                    if (arg === 'rm') {
                        printTerminal(`<span style="color: #ff5f56">Error: ¿Intentando borrar mi portafolio? Buen intento hacker.</span> <br> <i>This incident will be reported.</i>`);
                    } else {
                        printTerminal(`<span style="color: #ff5f56">user is not in the sudoers file. This incident will be reported.</span>`); 
                    }
                    break;

                case 'ls': 
                    let filesHTML = '';
                    Object.keys(virtualFileSystem).forEach(f => {
                        if(f.startsWith('.')) {
                             // Archivos ocultos solo se ven con ls -a
                             if(arg === '-a' || arg === '-la' || arg === '-al') filesHTML += `<span style="color: #8b949e">${f}</span>&nbsp;&nbsp;&nbsp;&nbsp;`;
                        } else {
                             filesHTML += `<span style="color: #98c379">${f}</span>&nbsp;&nbsp;&nbsp;&nbsp;`;
                        }
                    });
                    if(!filesHTML) filesHTML = "Uso de ls permite ver archivos";
                    printTerminal(filesHTML); 
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
                // Ajustar la opacidad para que no sea tan brusca en móvil
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
        console.log("Enviando formulario con EmailJS...");

        const btnSubmit = document.querySelector('.btn-submit');
        const originalText = btnSubmit.innerHTML;

        // Estado de carga
        btnSubmit.disabled = true;
        btnSubmit.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Enviando...';

        // DATOS CUENTA DE EMAILJS
        const serviceID = 'service_uzp73up'; 
        const templateID = 'template_t2ogwhy'; 

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