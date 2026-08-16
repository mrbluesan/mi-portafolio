// ==========================================
// 1. CONFIGURACIÓN INICIAL & EFECTOS BASE
// ==========================================

const appearOptions = { threshold: 0.15, rootMargin: "0px 0px -40px 0px" };
const appearOnScroll = new IntersectionObserver(function (entries, observer) {
  entries.forEach((entry, index) => {
    if (!entry.isIntersecting) return;
    if (
      entry.target.classList.contains("tech-card") ||
      entry.target.classList.contains("project-card")
    ) {
      setTimeout(() => {
        entry.target.classList.add("show");
      }, index * 90);
    } else {
      entry.target.classList.add("show");
    }
    observer.unobserve(entry.target);
  });
}, appearOptions);

const faders = document.querySelectorAll(".fade-in");
if (faders.length > 0) {
  faders.forEach((fader) => {
    appearOnScroll.observe(fader);
  });
}

// Menú Móvil Drawer
const menuToggle = document.getElementById("menuToggle");
const closeMenu = document.getElementById("closeMenu");
const mobileMenu = document.getElementById("mobileMenu");
const mobileLinks = document.querySelectorAll(".mobile-nav-item");

if (menuToggle && mobileMenu) {
  menuToggle.addEventListener("click", () => {
    mobileMenu.classList.add("active");
    document.body.style.overflow = "hidden";
  });
}

function closeMobileMenu() {
  if (mobileMenu) {
    mobileMenu.classList.remove("active");
    document.body.style.overflow = "";
  }
}

if (closeMenu) {
  closeMenu.addEventListener("click", closeMobileMenu);
}

mobileLinks.forEach((link) => {
  link.addEventListener("click", closeMobileMenu);
});

// ==========================================
// 2. DATOS DE PROYECTOS (JSON)
// ==========================================
const myProjects = [
  {
    title: "Sistema con análisis de datos Castling Admin",
    category: "Software & Data Analytics",
    desc: "Plataforma administrativa orientada a la gestión de una Corporación. Implementa un pipeline de datos con Pandas para el registro masivo y normalización de usuarios vía CSV/Excel. Diseñada con arquitectura modular, control de roles granular y visualización de KPIs estratégicos para automatizar la toma de decisiones.",
    tech: "Python, Django, Pandas, MySQL, Bootstrap",
    repo: "https://github.com/mrbluesan/proyecto1",
    images: [
      "assets/img/castling_login.png",
      "assets/img/castling_dashboard1.png",
      "assets/img/castling_ingreso_u.png",
      "assets/img/castling_analisis.png",
    ],
  },
  {
    title: "Framework Automatizado de Reconocimiento Inicial",
    category: "Ciberseguridad & Scripting",
    desc: "Herramienta de scripting en Bash para automatizar y estandarizar la fase de Information Gathering en ejercicios de pentesting web e infraestructura. Ejecuta descubrimiento de hosts (ping sweep), escaneo profundo de puertos y servicios con Nmap, y estructura automáticamente carpetas de evidencias organizadas por target.",
    tech: "Bash, Nmap, Linux, Pentesting",
    repo: "https://github.com/mrbluesan/proyecto2",
    images: [
      "https://placehold.co/600x350/161b22/58a6ff?text=Framework+Recon:+Terminal",
      "https://placehold.co/600x350/0d1117/00ff41?text=Framework+Recon:+Scripts",
    ],
  },
  {
    title: "Laboratorio de Pentesting Máquina SimpleCTF",
    category: "Writeup Técnico & CTF",
    desc: "Informe técnico de explotación y post-explotación en la máquina SimpleCTF (TryHackMe). Documenta la identificación y abuso de vulnerabilidades en servicios FTP, enumeración web y escalamiento de privilegios vía SSH mediante fuerza bruta con Hydra y configuración de Vim.",
    tech: "Nmap, Hydra, Vim, Linux, CTF",
    repo: "https://github.com/mrbluesan/Ciberseguridad-Writeups/blob/main/TryHackMe/SimpleCTF.md",
    images: [
      "assets/img/ping.png",
      "assets/img/nmap_inicial.png",
      "assets/img/ftp.png",
      "assets/img/ForMitch.png",
      "assets/img/hydra.png",
      "assets/img/flag1.png",
      "assets/img/sp_vim.png",
      "assets/img/final.png",
    ],
  },
];

// ==========================================
// 3. RENDERIZADO Y MODAL DE PROYECTOS
// ==========================================
let currentModalImages = [];
let currentImageIndex = 0;
const modal = document.getElementById("projectModal");
const modalImg = document.getElementById("modalImg");
const modalCounter = document.getElementById("modalCounter");

window.handleRepoClick = async function (e, repoUrl) {
  if (e) e.preventDefault();

  if (!repoUrl || repoUrl === "#" || repoUrl.trim() === "") {
    showToast("Este repositorio aún está en desarrollo o es privado.", "warning");
    return;
  }

  try {
    if (repoUrl.includes("github.com/")) {
      const urlObj = new URL(repoUrl);
      const pathParts = urlObj.pathname.split("/").filter(Boolean);
      if (pathParts.length >= 2) {
        const username = pathParts[0];
        const repo = pathParts[1];

        // Validamos con GitHub API
        const response = await fetch(
          `https://api.github.com/repos/${username}/${repo}`
        );
        if (response.status === 404) {
          showToast(
            "El repositorio es privado o aún no existe en GitHub.",
            "warning"
          );
          return;
        }
      }
    }
  } catch (error) {
    console.error("Validación de repo omitida:", error);
  }

  window.open(repoUrl, "_blank");
};

function updateModalImage() {
  if (currentModalImages.length > 0 && modalImg) {
    modalImg.style.opacity = "0";
    setTimeout(() => {
      modalImg.src = currentModalImages[currentImageIndex];
      modalImg.style.opacity = "1";
      if (modalCounter) {
        modalCounter.textContent = `${currentImageIndex + 1} / ${currentModalImages.length}`;
      }
    }, 150);
  }
}

function openModalByIndex(index) {
  const project = myProjects[index];
  if (!project) return;

  const mTitle = document.getElementById("modalTitle");
  const mDesc = document.getElementById("modalDesc");
  const mBadges = document.getElementById("modalTechBadges");
  const mRepo = document.getElementById("modalRepo");

  if (mTitle) mTitle.textContent = project.title;
  if (mDesc) mDesc.textContent = project.desc;

  if (mBadges) {
    const tags = project.tech.split(",").map((t) => t.trim());
    mBadges.innerHTML = tags
      .map((tag) => `<span class="project-tag-pill">${tag}</span>`)
      .join("");
  }

  if (mRepo) {
    const repoUrl = project.repo || "#";
    mRepo.href = repoUrl;
    mRepo.onclick = (event) => window.handleRepoClick(event, repoUrl);
  }

  currentModalImages = project.images || [];
  currentImageIndex = 0;

  updateModalImage();
  if (modal) {
    modal.style.display = "flex";
    document.body.style.overflow = "hidden";
  }
}

function closeModalHandler() {
  if (modal) {
    modal.style.display = "none";
    document.body.style.overflow = "";
  }
}

function renderProjects() {
  const container = document.getElementById("projects-container");
  if (!container) return;
  container.innerHTML = "";

  myProjects.forEach((project, index) => {
    let imagesHTML = "";
    project.images.forEach((imgSrc) => {
      imagesHTML += `
        <div class="slider-item">
          <img src="${imgSrc}" alt="${project.title}" loading="lazy" />
        </div>`;
    });

    const tags = project.tech.split(",").map((t) => t.trim());
    const tagsHTML = tags
      .map((tag) => `<span class="project-tag-pill">${tag}</span>`)
      .join("");

    const isWriteup =
      project.repo && project.repo.includes("Writeups");

    const cardHTML = `
      <article class="project-card fade-in" data-index="${index}">
        <div class="card-media-wrapper">
          <div class="slider-wrapper">
            ${
              project.images.length > 1
                ? `<button class="slider-btn prev-btn" aria-label="Imagen previa"><i class="fas fa-chevron-left"></i></button>`
                : ""
            }
            <div class="slider-container">${imagesHTML}</div>
            ${
              project.images.length > 1
                ? `<button class="slider-btn next-btn" aria-label="Imagen siguiente"><i class="fas fa-chevron-right"></i></button>`
                : ""
            }
          </div>
          <div class="media-overlay-badge">${project.category || "Proyecto"}</div>
        </div>

        <div class="card-body">
          <h3 class="card-title">${project.title}</h3>
          <p class="card-description">${project.desc.substring(0, 130)}...</p>
          
          <div class="project-tags-list">
            ${tagsHTML}
          </div>

          <div class="card-action-bar">
            <button class="btn-card-details" onclick="openModalByIndex(${index})">
              <i class="fas fa-eye"></i> Detalles
            </button>
            <a 
              href="${project.repo || "#"}" 
              target="_blank" 
              class="btn-card-repo" 
              onclick="window.handleRepoClick(event, '${project.repo || "#"}')"
            >
              <i class="${isWriteup ? "fas fa-file-lines" : "fab fa-github"}"></i>
              ${isWriteup ? "Ver Writeup" : "Código"}
            </a>
          </div>
        </div>
      </article>`;

    container.innerHTML += cardHTML;
  });

  // Observar nuevas cards generadas
  const newFaders = container.querySelectorAll(".fade-in");
  newFaders.forEach((fader) => {
    appearOnScroll.observe(fader);
  });

  initializeProjectInteractions();
}

function initializeProjectInteractions() {
  // Clic en cualquier parte de la tarjeta para abrir el modal de detalles
  document.querySelectorAll(".project-card").forEach((card) => {
    card.addEventListener("click", (e) => {
      // Si se hizo clic en el enlace al repositorio o en los botones del slider, no abrir modal
      if (e.target.closest(".btn-card-repo, .slider-btn")) {
        return;
      }
      const index = parseInt(card.getAttribute("data-index"), 10);
      if (!isNaN(index)) {
        openModalByIndex(index);
      }
    });
  });

  // Sliders
  document.querySelectorAll(".slider-wrapper").forEach((slider) => {
    const container = slider.querySelector(".slider-container");
    const nextBtn = slider.querySelector(".next-btn");
    const prevBtn = slider.querySelector(".prev-btn");

    if (nextBtn) {
      nextBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        container.scrollBy({ left: container.offsetWidth, behavior: "smooth" });
      });
    }
    if (prevBtn) {
      prevBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        container.scrollBy({
          left: -container.offsetWidth,
          behavior: "smooth",
        });
      });
    }
  });

  // Modal navigation
  const closeModalBtn = document.querySelector(".close-modal");
  const prevModalBtn = document.querySelector(".prev-modal");
  const nextModalBtn = document.querySelector(".next-modal");

  if (prevModalBtn) {
    prevModalBtn.onclick = () => {
      if (currentModalImages.length > 0) {
        currentImageIndex =
          (currentImageIndex - 1 + currentModalImages.length) %
          currentModalImages.length;
        updateModalImage();
      }
    };
  }

  if (nextModalBtn) {
    nextModalBtn.onclick = () => {
      if (currentModalImages.length > 0) {
        currentImageIndex = (currentImageIndex + 1) % currentModalImages.length;
        updateModalImage();
      }
    };
  }

  if (closeModalBtn) {
    closeModalBtn.addEventListener("click", closeModalHandler);
  }

  window.addEventListener("click", (e) => {
    if (e.target === modal) closeModalHandler();
  });

  window.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && modal && modal.style.display === "flex") {
      closeModalHandler();
    }
    if (modal && modal.style.display === "flex") {
      if (e.key === "ArrowLeft" && prevModalBtn) prevModalBtn.click();
      if (e.key === "ArrowRight" && nextModalBtn) nextModalBtn.click();
    }
  });
}

// Interactive tech cards
document.querySelectorAll(".tech-card").forEach((card) => {
  card.addEventListener("click", () => card.classList.toggle("active"));
});

// ==========================================
// 4. TERMINAL 3D AVANZADA
// ==========================================
const terminalCard = document.getElementById("terminalCard");
const bashInput = document.getElementById("bashInput");
const bashBody = document.getElementById("bashBody");
const closeTerminal = document.getElementById("closeTerminal");

let commandHistory = [];
let historyIndex = -1;

const virtualFileSystem = {
  "skills.txt": "Python, Django, Pandas, SQL, Linux, Git, Nmap, Pentesting",
  "about.md":
    "Estudiante de Ingeniería en Informática. Desarrollador y Pentester.",
  "contact.info":
    "Email: henryalexanderleyton@gmail.com\nGitHub: github.com/mrbluesan",
  ".secret": "Felicidades hacker. Toma tu flag: THM{m4st3r_p0rtf0l10}",
};

function printTerminal(html) {
  const line = document.createElement("div");
  line.className = "output";
  line.innerHTML = html;
  bashBody.insertBefore(line, bashInput.parentElement);
  bashBody.scrollTop = bashBody.scrollHeight;
}

if (terminalCard && bashInput && bashBody) {
  document.querySelector(".front").addEventListener("click", () => {
    terminalCard.classList.add("is-flipped");
    setTimeout(() => bashInput.focus(), 450);
  });

  if (closeTerminal) {
    closeTerminal.addEventListener("click", (e) => {
      e.stopPropagation();
      terminalCard.classList.remove("is-flipped");
    });
  }

  document.querySelector(".back").addEventListener("click", (e) => {
    e.stopPropagation();
    bashInput.focus();
  });

  bashInput.addEventListener("keydown", async function (e) {
    if (e.key === "ArrowUp") {
      e.preventDefault();
      if (commandHistory.length > 0) {
        if (historyIndex === -1) historyIndex = commandHistory.length;
        if (historyIndex > 0) {
          historyIndex--;
          this.value = commandHistory[historyIndex];
        }
      }
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      if (historyIndex !== -1) {
        if (historyIndex < commandHistory.length - 1) {
          historyIndex++;
          this.value = commandHistory[historyIndex];
        } else {
          historyIndex = -1;
          this.value = "";
        }
      }
    } else if (e.key === "Enter") {
      const fullCommand = this.value.trim();
      const parts = fullCommand.split(/\s+/);
      const command = parts[0].toLowerCase();
      const arg = parts[1];

      if (fullCommand) {
        commandHistory.push(fullCommand);
        historyIndex = -1;
      }

      const historyLine = document.createElement("div");
      historyLine.innerHTML = `<span class="prompt">root@kali:~$</span> ${fullCommand}`;
      bashBody.insertBefore(historyLine, this.parentElement);
      this.value = "";

      switch (command) {
        case "help":
          printTerminal(
            "Comandos disponibles: <span class='cmd-highlight'>ls</span>, <span class='cmd-highlight'>cat [archivo]</span>, <span class='cmd-highlight'>whoami</span>, <span class='cmd-highlight'>scan</span>, <span class='cmd-highlight'>matrix</span>, <span class='cmd-highlight'>ifconfig</span>, <span class='cmd-highlight'>github</span>, <span class='cmd-highlight'>date</span>, <span class='cmd-highlight'>clear</span>, <span class='cmd-highlight'>exit</span>"
          );
          break;
        case "whoami": {
          bashInput.disabled = true;
          const whoamiText =
            "Henry Leyton - Software Developer & CyberSec Specialist";
          const whoamiEl = document.createElement("div");
          whoamiEl.className = "output whoami-typing";
          bashBody.insertBefore(whoamiEl, bashInput.parentElement);
          let wIndex = 0;
          const wInterval = setInterval(() => {
            whoamiEl.textContent += whoamiText.charAt(wIndex);
            wIndex++;
            bashBody.scrollTop = bashBody.scrollHeight;
            if (wIndex >= whoamiText.length) {
              clearInterval(wInterval);
              bashInput.disabled = false;
              bashInput.focus();
            }
          }, 35);
          break;
        }
        case "sudo":
          if (arg === "rm") {
            printTerminal(
              `<span style="color: #ff5f56">Error: ¿Intentando borrar el portafolio? Buen intento hacker.</span><br><i>This incident will be reported.</i>`
            );
          } else {
            printTerminal(
              `<span style="color: #ff5f56">user is not in the sudoers file. This incident will be reported.</span>`
            );
          }
          break;
        case "ls":
          let filesHTML = "";
          Object.keys(virtualFileSystem).forEach((f) => {
            if (f.startsWith(".")) {
              if (arg === "-a" || arg === "-la" || arg === "-al") {
                filesHTML += `<span style="color: #8b949e">${f}</span>&nbsp;&nbsp;&nbsp;&nbsp;`;
              }
            } else {
              filesHTML += `<span style="color: #58a6ff">${f}</span>&nbsp;&nbsp;&nbsp;&nbsp;`;
            }
          });
          if (!filesHTML) filesHTML = "Usa 'ls -a' para ver archivos ocultos.";
          printTerminal(filesHTML);
          break;
        case "pwd":
          printTerminal("/home/henry/portfolio");
          break;
        case "ifconfig":
          printTerminal(
            `eth0: flags=4163&lt;UP&gt; mtu 1500<br>inet 192.168.1.15<br><br>tun0: flags=4305&lt;UP&gt; mtu 1500<br>inet 10.10.14.23 <span style="color: #58a6ff"># TryHackMe VPN</span>`
          );
          break;
        case "scan":
          printTerminal("Iniciando Nmap 7.94...");
          setTimeout(() => {
            printTerminal(
              "PORT STATE SERVICE<br>21/tcp <span style='color:#00ff41'>open</span> ftp<br>22/tcp <span style='color:#00ff41'>open</span> ssh<br>80/tcp <span style='color:#00ff41'>open</span> http"
            );
          }, 500);
          break;
        case "cat":
          if (!arg) printTerminal("Uso: cat [nombre_archivo]");
          else if (virtualFileSystem[arg])
            printTerminal(virtualFileSystem[arg].replace(/\n/g, "<br>"));
          else printTerminal(`cat: ${arg}: No existe el archivo`);
          break;
        case "date":
          printTerminal(new Date().toString());
          break;
        case "matrix": {
          bashInput.disabled = true;
          const chars = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ@#$%^&*";
          const matrixInterval = setInterval(() => {
            let line = "";
            for (let j = 0; j < 40; j++)
              line +=
                chars.charAt(Math.floor(Math.random() * chars.length)) +
                "&nbsp;&nbsp;";
            const div = document.createElement("div");
            div.className = "output";
            div.style.color = "#00ff41";
            div.style.whiteSpace = "nowrap";
            div.innerHTML = line;
            bashBody.insertBefore(div, bashInput.parentElement);
            bashBody.scrollTop = bashBody.scrollHeight;
          }, 50);
          setTimeout(() => {
            clearInterval(matrixInterval);
            bashInput.disabled = false;
            bashInput.focus();
            printTerminal("<br>Conexión Matrix finalizada.");
          }, 2500);
          break;
        }
        case "github":
          printTerminal("Consultando API de GitHub...");
          try {
            const response = await fetch(
              "https://api.github.com/users/mrbluesan"
            );
            if (!response.ok) throw new Error("Error");
            const data = await response.json();
            printTerminal(
              `Usuario: <span class="cmd-highlight">${data.login}</span><br>Repositorios Públicos: ${data.public_repos}<br>Seguidores: ${data.followers}<br>URL: <a href="${data.html_url}" target="_blank" style="color:#58a6ff">${data.html_url}</a>`
            );
          } catch (e) {
            printTerminal(
              `<span style="color:#ff5f56">No se pudo conectar a GitHub.</span>`
            );
          }
          break;
        case "clear":
          const outputs = bashBody.querySelectorAll("div:not(.input-line)");
          outputs.forEach((el) => el.remove());
          break;
        case "exit":
          terminalCard.classList.remove("is-flipped");
          break;
        case "":
          break;
        default:
          printTerminal(`bash: ${command}: command not found`);
      }
      bashBody.scrollTop = bashBody.scrollHeight;
    }
  });
}

// ==========================================
// 5. FONDO DE PARTÍCULAS REACTIVAS (CANVAS)
// ==========================================
const canvas = document.getElementById("particles-canvas");
if (canvas) {
  const ctx = canvas.getContext("2d");
  let particlesArray = [];
  let mouse = { x: null, y: null };

  function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  resizeCanvas();

  window.addEventListener("mousemove", function (event) {
    mouse.x = event.x;
    mouse.y = event.y;
  });

  window.addEventListener("mouseout", function () {
    mouse.x = undefined;
    mouse.y = undefined;
  });

  class Particle {
    constructor() {
      this.x = Math.random() * canvas.width;
      this.y = Math.random() * canvas.height;
      this.size = Math.random() * 1.5 + 0.5;
      this.speedX = Math.random() * 0.25 - 0.125;
      this.speedY = Math.random() * 0.25 - 0.125;
    }
    update() {
      this.x += this.speedX;
      this.y += this.speedY;
      if (this.x > canvas.width || this.x < 0) this.speedX = -this.speedX;
      if (this.y > canvas.height || this.y < 0) this.speedY = -this.speedY;

      if (mouse.x !== undefined && mouse.y !== undefined) {
        let dx = mouse.x - this.x;
        let dy = mouse.y - this.y;
        let distance = Math.sqrt(dx * dx + dy * dy);
        if (distance < 180) {
          const forceDirectionX = dx / distance;
          const forceDirectionY = dy / distance;
          const force = (180 - distance) / 180;
          const directionX = forceDirectionX * force * 0.4;
          const directionY = forceDirectionY * force * 0.4;
          this.x += directionX;
          this.y += directionY;
        }
      }
    }
    draw() {
      ctx.fillStyle = "#58a6ff";
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  function initParticles() {
    particlesArray = [];
    let divider = canvas.width < 768 ? 16000 : 26000;
    let numberOfParticles = Math.floor((canvas.height * canvas.width) / divider);
    for (let i = 0; i < numberOfParticles; i++) {
      particlesArray.push(new Particle());
    }
  }

  function connect() {
    let maxDistance =
      canvas.width < 768 ? 9000 : (canvas.width / 10) * (canvas.height / 10);

    for (let a = 0; a < particlesArray.length; a++) {
      for (let b = a; b < particlesArray.length; b++) {
        let distance =
          (particlesArray[a].x - particlesArray[b].x) *
            (particlesArray[a].x - particlesArray[b].x) +
          (particlesArray[a].y - particlesArray[b].y) *
            (particlesArray[a].y - particlesArray[b].y);

        if (distance < maxDistance) {
          let opacityValue = 1 - distance / 22000;
          ctx.strokeStyle = `rgba(88, 166, 255, ${Math.max(0, opacityValue * 0.35)})`;
          ctx.lineWidth = 0.8;
          ctx.beginPath();
          ctx.moveTo(particlesArray[a].x, particlesArray[a].y);
          ctx.lineTo(particlesArray[b].x, particlesArray[b].y);
          ctx.stroke();
        }
      }

      if (mouse.x !== undefined && mouse.y !== undefined) {
        let dx = particlesArray[a].x - mouse.x;
        let dy = particlesArray[a].y - mouse.y;
        let mouseDistance = dx * dx + dy * dy;
        if (mouseDistance < 22000) {
          let mouseOpacity = 1 - mouseDistance / 22000;
          ctx.strokeStyle = `rgba(88, 166, 255, ${mouseOpacity * 0.45})`;
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

  window.addEventListener("resize", () => {
    resizeCanvas();
    initParticles();
  });

  initParticles();
  animateParticles();
}

// ==========================================
// 6. UX: SCROLLSPY, TOAST & EMAIL COPY
// ==========================================
function showToast(message, type = "success") {
  let container = document.getElementById("toast-container");
  if (!container) {
    container = document.createElement("div");
    container.id = "toast-container";
    document.body.appendChild(container);
  }
  const toast = document.createElement("div");
  toast.className = `toast ${type}`;
  const icon =
    type === "warning"
      ? "fa-triangle-exclamation"
      : type === "error"
        ? "fa-circle-xmark"
        : "fa-circle-check";
  toast.innerHTML = `<i class="fas ${icon}"></i> ${message}`;
  container.appendChild(toast);

  setTimeout(() => {
    toast.classList.add("hide");
    toast.addEventListener("animationend", () => toast.remove());
  }, 3500);
}

function initScrollSpy() {
  const sections = document.querySelectorAll("section[id]");
  const navLinks = document.querySelectorAll(".nav-item");
  const header = document.getElementById("mainHeader");

  window.addEventListener("scroll", () => {
    const scrollPos = window.pageYOffset || document.documentElement.scrollTop;

    // Header blur shadow on scroll
    if (header) {
      if (scrollPos > 30) {
        header.classList.add("scrolled");
      } else {
        header.classList.remove("scrolled");
      }
    }

    let current = "";
    sections.forEach((section) => {
      const top = section.offsetTop - 140;
      const height = section.offsetHeight;
      if (scrollPos >= top && scrollPos < top + height) {
        current = section.getAttribute("id");
      }
    });

    navLinks.forEach((link) => {
      link.classList.remove("active-link");
      const href = link.getAttribute("href");
      if (href === `#${current}` || (current === "hero" && href === "#hero")) {
        link.classList.add("active-link");
      }
    });
  });
}

const emailElement = document.getElementById("emailCopy");
if (emailElement) {
  emailElement.addEventListener("click", () => {
    const address = emailElement.querySelector(".email-address").textContent;
    navigator.clipboard
      .writeText(address.trim())
      .then(() => showToast("¡Correo electrónico copiado al portapapeles!"))
      .catch(() => showToast("No se pudo copiar automáticamente.", "warning"));
  });
}

// ==========================================
// 7. MANEJO DEL FORMULARIO CON EMAILJS
// ==========================================
const contactForm = document.getElementById("contactForm");
if (contactForm) {
  contactForm.addEventListener("submit", function (event) {
    event.preventDefault();
    const btnSubmit = contactForm.querySelector(".btn-submit");
    const originalContent = btnSubmit.innerHTML;

    btnSubmit.disabled = true;
    btnSubmit.innerHTML = `<span>Enviando...</span> <i class="fas fa-spinner fa-spin"></i>`;

    const serviceID = "service_uzp73up";
    const templateID = "template_t2ogwhy";

    emailjs
      .sendForm(serviceID, templateID, this)
      .then(() => {
        showToast("¡Mensaje enviado con éxito! Te responderé pronto.");
        contactForm.reset();
        btnSubmit.innerHTML = `<span>¡Enviado!</span> <i class="fas fa-check"></i>`;
        btnSubmit.classList.add("success");
      })
      .catch((err) => {
        console.error("Error de EmailJS:", err);
        showToast("Hubo un problema al enviar el mensaje.", "error");
        btnSubmit.innerHTML = `<span>Error</span> <i class="fas fa-circle-exclamation"></i>`;
        btnSubmit.classList.add("error");
      })
      .finally(() => {
        setTimeout(() => {
          btnSubmit.disabled = false;
          btnSubmit.innerHTML = originalContent;
          btnSubmit.classList.remove("success", "error");
        }, 3500);
      });
  });
}

// ==========================================
// 8. INICIALIZACIÓN
// ==========================================
document.addEventListener("DOMContentLoaded", function () {
  renderProjects();
  initScrollSpy();
});