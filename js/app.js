document.addEventListener('DOMContentLoaded', () => {
    // ==========================================
    // 0. STARFIELD 3D PARTICLE ENGINE
    // ==========================================
    const canvas = document.getElementById('starfield-canvas');
    if (canvas) {
        const ctx = canvas.getContext('2d');
        let width = canvas.width = window.innerWidth;
        let height = canvas.height = window.innerHeight;

        const stars = [];
        const numStars = 180;
        const speed = 0.6;
        let mouseX = 0;
        let mouseY = 0;
        let targetMouseX = 0;
        let targetMouseY = 0;

        // Initialize Star coordinates in 3D Space
        for (let i = 0; i < numStars; i++) {
            stars.push({
                x: Math.random() * width - width / 2,
                y: Math.random() * height - height / 2,
                z: Math.random() * width,
                size: Math.random() * 1.6 + 0.4,
                color: i % 6 === 0 ? '#22d3ee' : (i % 9 === 0 ? '#818cf8' : '#f8fafc')
            });
        }

        window.addEventListener('resize', () => {
            width = canvas.width = window.innerWidth;
            height = canvas.height = window.innerHeight;
        });

        // Mouse Parallax effect
        window.addEventListener('mousemove', (e) => {
            targetMouseX = (e.clientX - width / 2) * 0.12;
            targetMouseY = (e.clientY - height / 2) * 0.12;
        }, { passive: true });

        const animate = () => {
            ctx.clearRect(0, 0, width, height);

            const isLight = document.body.classList.contains('light-theme');

            // Interpolate mouse coordinates smoothly
            mouseX += (targetMouseX - mouseX) * 0.05;
            mouseY += (targetMouseY - mouseY) * 0.05;

            ctx.save();
            ctx.translate(width / 2 + mouseX, height / 2 + mouseY);

            for (let i = 0; i < numStars; i++) {
                const star = stars[i];

                if (isLight) {
                    // Daytime floating bokeh dust
                    star.y -= speed * 0.2 * (star.size); // Float upwards slowly
                    star.x += Math.sin(star.y * 0.02 + i) * 0.3; // Drift sideways

                    if (star.y < -height) {
                        star.y = height;
                        star.x = Math.random() * width - width / 2;
                    }

                    const px = star.x;
                    const py = star.y;
                    const size = star.size * 4;
                    const opacity = Math.min(0.5, Math.max(0, 1 - (star.z / width)));

                    ctx.globalAlpha = opacity;
                    ctx.beginPath();
                    // Warm golden/orange colors for daytime
                    ctx.fillStyle = star.color === '#22d3ee' ? '#ff9900' : (star.color === '#818cf8' ? '#ffcc00' : '#ff7700');
                    ctx.arc(px, py, size, 0, Math.PI * 2);
                    ctx.fill();
                } else {
                    // Nighttime Space Starfield
                    star.z -= speed;

                    if (star.z <= 0) {
                        star.z = width;
                        star.x = Math.random() * width - width / 2;
                        star.y = Math.random() * height - height / 2;
                    }

                    // 3D coordinate projection
                    const px = (star.x / star.z) * width * 0.8;
                    const py = (star.y / star.z) * height * 0.8;

                    // Adjust opacity and size based on distance
                    const opacity = Math.min(1, Math.max(0, 1 - (star.z / width)));
                    const size = (1 - (star.z / width)) * star.size * 2.8;

                    ctx.globalAlpha = opacity;
                    ctx.beginPath();
                    ctx.fillStyle = star.color;
                    ctx.arc(px, py, size, 0, Math.PI * 2);
                    ctx.fill();
                }
            }

            ctx.restore();
            requestAnimationFrame(animate);
        };
        animate();
    }

    // ==========================================
    // 1. NAVBAR SCROLL EFFECT & MOBILE MENU
    // ==========================================
    const navbar = document.querySelector('.navbar');
    const onNavScroll = () => {
        if (!navbar) return;
        navbar.classList.toggle('scrolled', window.scrollY > 24);
    };
    onNavScroll();
    window.addEventListener('scroll', onNavScroll, { passive: true });

    const menuBtn = document.getElementById('mobile-menu-btn');
    const navLinks = document.querySelector('.nav-links');

    const setMenuOpen = (open) => {
        if (!navLinks || !menuBtn) return;
        navLinks.classList.toggle('show', open);
        menuBtn.setAttribute('aria-expanded', open ? 'true' : 'false');
        menuBtn.setAttribute('aria-label', open ? 'Cerrar menú' : 'Abrir menú');
    };

    if (menuBtn && navLinks) {
        menuBtn.addEventListener('click', () => {
            setMenuOpen(!navLinks.classList.contains('show'));
        });
        navLinks.querySelectorAll('a[href^="#"]').forEach((link) => {
            link.addEventListener('click', () => setMenuOpen(false));
        });
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') setMenuOpen(false);
        });
        window.addEventListener('resize', () => {
            if (window.innerWidth > 768) setMenuOpen(false);
        });
    }

    // ==========================================
    // 2. SCROLL REVEAL ANIMATIONS
    // ==========================================
    const revealElements = document.querySelectorAll('.reveal');
    const revealCallback = (entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
            }
        });
    };
    const revealObserver = new IntersectionObserver(revealCallback, {
        threshold: 0.1,
        rootMargin: "0px 0px -40px 0px"
    });
    revealElements.forEach(el => revealObserver.observe(el));

    // ==========================================
    // 3. CONTACT FORM SUBMISSION (FormSubmit AJAX)
    // ==========================================
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const btn = contactForm.querySelector('button');
            const originalText = btn.innerHTML;
            
            btn.innerHTML = 'Enviando... <i data-lucide="loader" class="feather-loader"></i>';
            btn.disabled = true;

            const formData = new FormData(contactForm);

            fetch("https://formsubmit.co/ajax/matiasmanriquez123456@gmail.com", {
                method: "POST",
                headers: { 'Accept': 'application/json' },
                body: formData
            })
            .then(response => response.json())
            .then(data => {
                if(data.success === "true" || data.success === true) {
                    btn.innerHTML = '¡Transmisión Exitosa! <i data-lucide="check-circle" class="text-emerald"></i>';
                    contactForm.reset();
                } else {
                    btn.innerHTML = 'Error en Transmisión <i data-lucide="x-circle" style="color:red"></i>';
                }
                setTimeout(() => {
                    btn.innerHTML = originalText;
                    btn.disabled = false;
                    lucide.createIcons();
                }, 3000);
            })
            .catch(() => {
                btn.innerHTML = 'Error de Red <i data-lucide="wifi-off" style="color:red"></i>';
                setTimeout(() => {
                    btn.innerHTML = originalText;
                    btn.disabled = false;
                    lucide.createIcons();
                }, 3000);
            });
        });
    }

    // ==========================================
    // 4. MINI TO-DO CARD APPLICATION
    // ==========================================
    const todoInput = document.getElementById('mini-todo-input');
    const todoAddBtn = document.getElementById('mini-todo-add');
    const todoList = document.getElementById('mini-todo-list');

    const saveTodos = () => {
        if (!todoList) return;
        const listItems = [];
        todoList.querySelectorAll('li').forEach(li => {
            listItems.push({
                text: li.querySelector('span').innerText,
                completed: li.classList.contains('completed')
            });
        });
        localStorage.setItem('mtys24-todos', JSON.stringify(listItems));
    };

    const createTodoElement = (text, completed = false) => {
        if (!todoList) return;
        const li = document.createElement('li');
        if (completed) li.classList.add('completed');

        const span = document.createElement('span');
        span.innerText = text;
        span.addEventListener('click', () => {
            li.classList.toggle('completed');
            saveTodos();
        });

        const deleteBtn = document.createElement('button');
        deleteBtn.className = 'delete-btn';
        deleteBtn.setAttribute('aria-label', 'Eliminar');
        deleteBtn.innerHTML = '<i data-lucide="trash-2"></i>';
        deleteBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            li.remove();
            saveTodos();
        });

        li.appendChild(span);
        li.appendChild(deleteBtn);
        todoList.appendChild(li);
        
        if (window.lucide) window.lucide.createIcons();
    };

    const loadTodos = () => {
        if (!todoList) return;
        const stored = localStorage.getItem('mtys24-todos');
        if (stored) {
            todoList.innerHTML = '';
            JSON.parse(stored).forEach(todo => {
                createTodoElement(todo.text, todo.completed);
            });
        }
    };

    if (todoAddBtn && todoInput && todoList) {
        // Load initial values from localStorage
        loadTodos();

        todoAddBtn.addEventListener('click', () => {
            const val = todoInput.value.trim();
            if (val) {
                createTodoElement(val);
                todoInput.value = '';
                saveTodos();
            }
        });

        todoInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                const val = todoInput.value.trim();
                if (val) {
                    createTodoElement(val);
                    todoInput.value = '';
                    saveTodos();
                }
            }
        });

        // Add events to default elements if localStorage is empty
        if (!localStorage.getItem('mtys24-todos')) {
            todoList.querySelectorAll('li').forEach(li => {
                const span = li.querySelector('span');
                if (span) {
                    span.addEventListener('click', () => {
                        li.classList.toggle('completed');
                        saveTodos();
                    });
                }
                const delBtn = li.querySelector('.delete-btn');
                if (delBtn) {
                    delBtn.addEventListener('click', (e) => {
                        e.stopPropagation();
                        li.remove();
                        saveTodos();
                    });
                }
            });
        }
    }

    // ==========================================
    // 5. MINI PYTHON BOT CHAT APPLICATION
    // ==========================================
    const botInput = document.getElementById('mini-bot-input');
    const botSendBtn = document.getElementById('mini-bot-send');
    const botChat = document.getElementById('mini-bot-chat');
    const quickReplies = document.querySelectorAll('.mini-bot-quick-replies .reply-pill');

    const botResponses = {
        'ping': 'pong! Latencia orbital: 14ms. Conexión de datos estable.',
        'skills': 'Mi arsenal incluye Django, React, MySQL, Bash, Docker, Servidores HP ProLiant (RAID 1) y AWS.',
        'chiste': '¿Por qué los programadores prefieren el espacio? Porque allí nadie puede escuchar tus gritos en un "merge conflict". 😉',
        'hola': '¡Hola terrestre! Soy el bot básico de Matías. Prueba enviando "ping", "skills" o "chiste".',
        'help': 'Comandos rápidos: hola, ping, skills, chiste, vim, gracias.'
    };

    const sendBotMessage = (text) => {
        if (!text || !botChat) return;

        // Append user message
        const userMsg = document.createElement('div');
        userMsg.className = 'bot-msg outgoing';
        userMsg.innerText = text;
        botChat.appendChild(userMsg);
        botChat.scrollTop = botChat.scrollHeight;

        if (botInput) botInput.value = '';

        // Typing indicator
        const typingMsg = document.createElement('div');
        typingMsg.className = 'bot-msg system typing-indicator';
        typingMsg.innerText = '. . . escribiendo';
        botChat.appendChild(typingMsg);
        botChat.scrollTop = botChat.scrollHeight;

        setTimeout(() => {
            typingMsg.remove();
            const query = text.trim().toLowerCase();
            let replyText = 'Comando desconocido. Escribe "help" para ver opciones.';

            if (botResponses[query]) {
                replyText = botResponses[query];
            } else if (query.includes('vim')) {
                replyText = '¿Vim? ¡El mejor editor! (Aunque a veces requieras "kill -9" para salir de él). 😆';
            } else if (query.includes('gracias')) {
                replyText = '¡De nada! Mi directiva principal es optimizar código y regalar sonrisas.';
            }

            const incomingMsg = document.createElement('div');
            incomingMsg.className = 'bot-msg incoming';
            incomingMsg.innerHTML = replyText;
            botChat.appendChild(incomingMsg);
            botChat.scrollTop = botChat.scrollHeight;
        }, 650);
    };

    if (botSendBtn && botInput && botChat) {
        botSendBtn.addEventListener('click', () => {
            const val = botInput.value.trim();
            if (val) sendBotMessage(val);
        });

        botInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                const val = botInput.value.trim();
                if (val) sendBotMessage(val);
            }
        });

        quickReplies.forEach(btn => {
            btn.addEventListener('click', () => {
                const action = btn.getAttribute('data-reply');
                sendBotMessage(action);
            });
        });
    }

    // ==========================================
    // 6. ULTIMATE BASH TERMINAL (FOOTER)
    // ==========================================
    const terminalInput = document.getElementById('terminal-input');
    const terminalContent = document.getElementById('terminal-content');
    const terminalWindow = document.querySelector('.terminal-window');

    const cmdHistory = [];
    let historyIndex = -1;

    const termCommands = {
        'help': 'Comandos disponibles: <span class="text-cyan">whoami</span>, <span class="text-cyan">skills</span>, <span class="text-cyan">projects</span>, <span class="text-cyan">neofetch</span>, <span class="text-cyan">ping</span>, <span class="text-cyan">matrix</span>, <span class="text-cyan">linkedin</span>, <span class="text-cyan">clear</span>, <span class="text-emerald">sudo rm -rf /</span>',
        'whoami': 'Matías (Mtys24). Full-Stack Dev & SysAdmin enfocado en el Sector Público y soluciones corporativas. Integrador legal-tech con APIs Gubernamentales Centralizadas y plataformas de atención a gran escala (Django, MySQL, MongoDB). <br>"Turning complex requirements into clean code and smiles".',
        'linkedin': 'Ping de red exitoso. Puedes conectar conmigo en LinkedIn: <a href="https://www.linkedin.com/in/mat%C3%ADas-francisco-mar%C3%ADquez-manr%C3%ADquez-6133aa308/" target="_blank" rel="noopener noreferrer" class="text-cyan font-bold underline">LinkedIn Perfil ↗</a>',
        'sudo rm -rf /': '<span style="color:#ef4444">Permiso denegado. ¡Buen intento hacker! Pero el núcleo espacial está protegido por encriptación cuántica. ;)</span>',
        'clear': 'clear_cmd'
    };

    const getNeofetchOutput = () => {
        return `
<div class="neofetch-container font-mono">
<pre class="neofetch-logo text-emerald">
     .-----------------.
    /   Mtys24-Bash   /|
   +-----------------+ |
   |  .-----------.  | |
   |  |  guest@   |  | |
   |  |  mtys24   |  | |
   |  '-----------'  |/
   +-----------------+
</pre>
<div class="neofetch-stats">
<span class="text-cyan font-bold">guest@mtys24</span>
-----------------------
<span class="text-emerald">OS</span>: MtysOS Space Edition v120.0
<span class="text-emerald">Host</span>: HP ProLiant DL380e Gen8 Server
<span class="text-emerald">Kernel</span>: Antigravity-2026.05.19
<span class="text-emerald">Uptime</span>: 4 days, 16 hours, 24 mins
<span class="text-emerald">Shell</span>: Bash Custom Interactive
<span class="text-emerald">Theme</span>: Glassmorphic Void Nebula
<span class="text-emerald">IDE</span>: Vim / VS Code / Cursor
<span class="text-emerald">Goals</span>: Escribir código limpio y regalar sonrisas
</div>
</div>`;
    };

    const getSkillsOutput = () => {
        return `
<div class="skills-retro font-mono">
>> Iniciando escaneo de módulos del Arsenal Técnico...<br><br>
Python / Django   <span class="text-cyan">[====================] 100%</span><br>
React / Vue / TS  <span class="text-cyan">[==================--] 90%</span><br>
PHP / Laravel     <span class="text-cyan">[================---] 85%</span><br>
Bases Híbridas    <span class="text-emerald">[====================] 100%</span><br>
Linux SysAdmin    <span class="text-emerald">[===================] 95%</span><br>
Docker / Cont.    <span class="text-emerald">[===================] 95%</span><br>
JWT / MFA / OTP   <span class="text-emerald">[==================--] 90%</span><br>
Hardware (HP RAID)<span class="text-emerald">[===================] 95%</span><br>
</div>`;
    };

    const getProjectsOutput = () => {
        return `
<div class="projects-retro font-mono">
>> Listando repositorios y plataformas del sistema orbital Mtys24:<br><br>
<span class="text-cyan font-bold">[PROYECTOS PRIVADOS / ENTERPRISE]</span><br>
1. <span class="text-violet font-bold">Módulo de Firma Electrónica</span>: Integración legal-tech con JWT, MFA y generación de XML firmados.<br>
2. <span class="text-violet font-bold">Portal Transaccional Empresarial</span>: Gestión transaccional en Django, MySQL y MongoDB.<br>
3. <span class="text-violet font-bold">Plataforma de Atención al Usuario</span>: Canal digital corporativo para gestión de tickets.<br>
4. <span class="text-violet font-bold">Sistema de Transparencia y Auditoría</span>: Cumplimiento normativo y auditoría de datos.<br><br>
<span class="text-cyan font-bold">[REPOSITORIOS PUBLICOS / OPEN SOURCE]</span><br>
5. <a href="https://github.com/Mtys24/Esc-ner-de-red" target="_blank" rel="noopener noreferrer" class="text-cyan underline">Esc-ner-de-red</a>: Herramienta SysAdmin para diagnóstico y auditoría de redes locales.<br>
6. <a href="https://github.com/Mtys24/Sos_Ayuda" target="_blank" rel="noopener noreferrer" class="text-cyan underline">Sos_Ayuda</a>: Cyber-Medical HUD interactivo de primeros auxilios.<br>
7. <a href="https://github.com/Mtys24/Censurador-de-PDF" target="_blank" rel="noopener noreferrer" class="text-cyan underline">Censurador-de-PDF</a>: Utilidad de privacidad para censurar datos en PDFs.<br>
8. <a href="https://github.com/Mtys24/Biblioteca_publica" target="_blank" rel="noopener noreferrer" class="text-cyan underline">Biblioteca_publica</a>: Administrador de inventario virtual en PHP/SQL.<br>
9. <a href="https://github.com/Mtys24/room-reservation-system" target="_blank" rel="noopener noreferrer" class="text-cyan underline">room-reservation-system</a>: Sistema de gestión y reservas con métricas (KPIs).<br>
10. <a href="https://github.com/Mtys24/To_Do" target="_blank" rel="noopener noreferrer" class="text-cyan underline">To_Do</a>: Aplicación web interactiva con local storage.<br>
11. <a href="https://github.com/Mtys24/Bot_basico1" target="_blank" rel="noopener noreferrer" class="text-cyan underline">Bot_basico1</a>: Bot básico de scripts Python.<br>
</div>`;
    };

    const runPingCommand = () => {
        if (!terminalContent || !terminalInput) return;
        terminalInput.disabled = true;

        const pingLines = [
            "PING mtys24.dev (127.0.0.1) 56(84) bytes of data.",
            "64 bytes from mtys24.dev (127.0.0.1): icmp_seq=1 ttl=64 time=14.2 ms",
            "64 bytes from mtys24.dev (127.0.0.1): icmp_seq=2 ttl=64 time=12.9 ms",
            "64 bytes from mtys24.dev (127.0.0.1): icmp_seq=3 ttl=64 time=15.1 ms",
            "64 bytes from mtys24.dev (127.0.0.1): icmp_seq=4 ttl=64 time=13.6 ms",
            "",
            "--- mtys24.dev ping statistics ---",
            "4 packets transmitted, 4 received, 0% packet loss, time 3004ms",
            "rtt min/avg/max/mdev = 12.9/13.9/15.1/0.81 ms"
        ];

        let i = 0;
        const interval = setInterval(() => {
            if (i < pingLines.length) {
                const p = document.createElement('p');
                p.innerHTML = pingLines[i];
                terminalContent.appendChild(p);
                terminalContent.scrollTop = terminalContent.scrollHeight;
                i++;
            } else {
                clearInterval(interval);
                terminalInput.disabled = false;
                terminalInput.focus();
            }
        }, 400);
    };

    const runMatrixCommand = () => {
        if (!terminalContent || !terminalInput) return;
        terminalInput.disabled = true;

        const pMatrix = document.createElement('p');
        pMatrix.className = 'text-emerald';
        pMatrix.innerHTML = ">> Iniciando inyección digital Matrix...";
        terminalContent.appendChild(pMatrix);

        let i = 0;
        const interval = setInterval(() => {
            if (i < 15) {
                let code = "";
                for (let j = 0; j < 50; j++) {
                    code += String.fromCharCode(33 + Math.floor(Math.random() * 93));
                }
                const p = document.createElement('p');
                p.className = 'text-emerald font-bold';
                p.style.opacity = (1 - (i / 20)).toString();
                p.innerText = code;
                terminalContent.appendChild(p);
                terminalContent.scrollTop = terminalContent.scrollHeight;
                i++;
            } else {
                clearInterval(interval);
                const pEnd = document.createElement('p');
                pEnd.innerHTML = ">> Conexión matrix finalizada. Sistema estable.";
                terminalContent.appendChild(pEnd);
                terminalContent.scrollTop = terminalContent.scrollHeight;
                
                terminalInput.disabled = false;
                terminalInput.focus();
            }
        }, 150);
    };

    if (terminalInput && terminalContent) {
        terminalInput.addEventListener('keydown', function(event) {
            if (event.key === 'Enter') {
                const inputVal = this.value.trim();
                this.value = '';

                if (inputVal === '') return;

                // Push to history
                cmdHistory.push(inputVal);
                historyIndex = cmdHistory.length;

                // Echo the input command
                const echoLine = document.createElement('p');
                echoLine.innerHTML = `<span class="prompt text-emerald">guest@mtys24:~$</span> ${inputVal}`;
                terminalContent.appendChild(echoLine);

                const normalizedInput = inputVal.toLowerCase();

                // Process command execution
                if (normalizedInput === 'clear') {
                    terminalContent.innerHTML = '';
                } else if (normalizedInput === 'neofetch') {
                    const p = document.createElement('div');
                    p.innerHTML = getNeofetchOutput();
                    terminalContent.appendChild(p);
                } else if (normalizedInput === 'skills') {
                    const p = document.createElement('div');
                    p.innerHTML = getSkillsOutput();
                    terminalContent.appendChild(p);
                } else if (normalizedInput === 'projects') {
                    const p = document.createElement('div');
                    p.innerHTML = getProjectsOutput();
                    terminalContent.appendChild(p);
                } else if (normalizedInput === 'ping') {
                    runPingCommand();
                } else if (normalizedInput === 'matrix') {
                    runMatrixCommand();
                } else {
                    const response = termCommands[normalizedInput] || `Comando no encontrado: <span style="color:#ef4444">${inputVal}</span>. Escribe <span class="text-emerald font-bold">help</span> para ver comandos disponibles.`;
                    const responseLine = document.createElement('p');
                    responseLine.innerHTML = response;
                    terminalContent.appendChild(responseLine);
                }

                terminalContent.scrollTop = terminalContent.scrollHeight;

            } else if (event.key === 'ArrowUp') {
                // Navigate history upwards
                event.preventDefault();
                if (cmdHistory.length > 0 && historyIndex > 0) {
                    historyIndex--;
                    this.value = cmdHistory[historyIndex];
                }
            } else if (event.key === 'ArrowDown') {
                // Navigate history downwards
                event.preventDefault();
                if (historyIndex < cmdHistory.length - 1) {
                    historyIndex++;
                    this.value = cmdHistory[historyIndex];
                } else if (historyIndex === cmdHistory.length - 1) {
                    historyIndex = cmdHistory.length;
                    this.value = '';
                }
            }
        });

        if (terminalWindow) {
            terminalWindow.addEventListener('click', () => terminalInput.focus());
        }
    }

    // ==========================================
    // 7. DYNAMIC PROJECT GRID FILTERING (ECOSYSTEM)
    // ==========================================
    const filterButtons = document.querySelectorAll('.more-projects .filter-btn');
    const projectCards = document.querySelectorAll('#additional-projects-grid .project-card');

    if (filterButtons.length > 0 && projectCards.length > 0) {
        filterButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                // Remove active class from all buttons and add to this one
                filterButtons.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');

                const filterValue = btn.getAttribute('data-filter');

                projectCards.forEach(card => {
                    const category = card.getAttribute('data-category');

                    if (filterValue === 'all' || filterValue === category) {
                        card.classList.remove('hide');
                        card.classList.add('show');
                    } else {
                        card.classList.remove('show');
                        card.classList.add('hide');
                    }
                });

                // Refresh Lucide Icons to draw correctly in dynamic cards
                if (window.lucide) window.lucide.createIcons();
            });
        });
    }

    // ==========================================
    // 8. ADVANCED ANIMATIONS & CYBERPUNK UI
    // ==========================================
    
    // 8.1 Staggered Scroll Reveal Observer
    const advRevealElements = document.querySelectorAll('.reveal-up, .reveal-scale');
    if (advRevealElements.length > 0) {
        let currentDelay = 0;
        let delayResetTimeout;

        const advRevealObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    // Apply stagger delay
                    entry.target.style.transitionDelay = `${currentDelay}ms`;
                    entry.target.classList.add('active');
                    observer.unobserve(entry.target);

                    currentDelay += 120; // 120ms between each element
                    
                    // Reset delay if elements are not animating at the same time
                    clearTimeout(delayResetTimeout);
                    delayResetTimeout = setTimeout(() => {
                        currentDelay = 0;
                    }, 100);
                }
            });
        }, { threshold: 0.1, rootMargin: "0px 0px -50px 0px" });

        advRevealElements.forEach(el => advRevealObserver.observe(el));
    }

    // 8.2 Glow Hover Cards (Mouse Tracking)
    const glowCards = document.querySelectorAll('.glass-card, .project-card');
    glowCards.forEach(card => {
        card.classList.add('glow-card'); // Dynamically add class
        card.addEventListener('mousemove', e => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            card.style.setProperty('--mouse-x', `${x}px`);
            card.style.setProperty('--mouse-y', `${y}px`);
        });
    });

    // 8.3 Cyber Toasts System
    window.showCyberToast = function(title, message, duration = 4000) {
        let container = document.querySelector('.cyber-toast-container');
        if (!container) {
            container = document.createElement('div');
            container.className = 'cyber-toast-container';
            document.body.appendChild(container);
        }

        const toast = document.createElement('div');
        toast.className = 'cyber-toast';
        toast.innerHTML = `
            <div class="toast-title">
                <i data-lucide="terminal"></i> ${title}
            </div>
            <div class="toast-message">${message}</div>
        `;
        
        container.appendChild(toast);
        if (window.lucide) window.lucide.createIcons();

        // Trigger animation
        requestAnimationFrame(() => {
            setTimeout(() => toast.classList.add('show'), 10);
        });

        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => toast.remove(), 400);
        }, duration);
    };

    // System initialization toast on load
    setTimeout(() => {
        if(window.showCyberToast) {
            window.showCyberToast("SISTEMA MTY-24 INICIALIZADO", "Conexión satelital estable. Renderizado al 120%.");
        }
    }, 1500);

    // ==========================================
    // 9. MODALS & ACCESSIBILITY
    // ==========================================

    // 9.1 A11y Toggle (High Contrast / Color Blind Mode)
    const a11yToggle = document.getElementById('a11y-toggle');
    if (a11yToggle) {
        if (localStorage.getItem('a11y-mode') === 'true') {
            document.body.classList.add('a11y-mode');
        }
        
        a11yToggle.addEventListener('click', () => {
            const isA11y = document.body.classList.toggle('a11y-mode');
            localStorage.setItem('a11y-mode', isA11y);
            if(window.showCyberToast) {
                window.showCyberToast("SISTEMA VISUAL", isA11y ? "Modo Alto Contraste (Daltonismo) Activado" : "Modo Estándar Activado", 3000);
            }
        });
    }

    // 9.2 Global Modal Logic
    const modal = document.getElementById('project-modal');
    if (modal) {
        const modalTitle = document.getElementById('modal-title');
        const modalDesc = document.getElementById('modal-desc');
        const modalTags = document.getElementById('modal-tags');
        const modalIcon = document.getElementById('modal-icon-container');
        const modalActions = document.getElementById('modal-actions');
        const closeBtn = modal.querySelector('.close-modal');

        const interactiveCards = document.querySelectorAll('.interactive-card');
        
        const openModal = (card) => {
            const h3 = card.querySelector('h3');
            const p = card.querySelector('p');
            const tags = card.querySelector('.tech-tags');
            const icon = card.querySelector('.project-icon');
            
            modalTitle.innerText = h3 ? h3.innerText : 'Proyecto';
            modalDesc.innerText = p ? p.innerText : '';
            modalTags.innerHTML = tags ? tags.innerHTML : '';
            modalIcon.innerHTML = icon ? icon.innerHTML : '';

            modalActions.innerHTML = `<button class="btn btn-primary" onclick="document.getElementById('project-modal').close()">Cerrar Detalles</button>`;
            
            modal.showModal();
        };

        interactiveCards.forEach(card => {
            card.addEventListener('click', () => openModal(card));
            card.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    openModal(card);
                }
            });
        });

        if (closeBtn) {
            closeBtn.addEventListener('click', () => modal.close());
        }
        
        // Close on outside click
        modal.addEventListener('click', (e) => {
            const rect = modal.getBoundingClientRect();
            const isInDialog = (rect.top <= e.clientY && e.clientY <= rect.top + rect.height &&
                                rect.left <= e.clientX && e.clientX <= rect.left + rect.width);
            if (!isInDialog) {
                modal.close();
            }
        });
    }

    // 9.3 Theme Toggle (Light/Dark Mode)
    const themeToggle = document.getElementById('theme-toggle');
    if (themeToggle) {
        const updateThemeIcon = () => {
            const isLight = document.body.classList.contains('light-theme');
            themeToggle.innerHTML = isLight ? '<i data-lucide="moon"></i>' : '<i data-lucide="sun"></i>';
            if (window.lucide) window.lucide.createIcons();
        };
        
        updateThemeIcon();

        themeToggle.addEventListener('click', () => {
            const isLight = document.body.classList.toggle('light-theme');
            localStorage.setItem('theme', isLight ? 'light' : 'dark');
            updateThemeIcon();
            
            if(window.showCyberToast) {
                window.showCyberToast("SISTEMA VISUAL", isLight ? "Modo Solar Activado" : "Modo Orbital Activado", 3000);
            }
        });
    }

    // ==========================================
    // 10. GOD TIER FEATURES
    // ==========================================

    // 10.1 Boot Sequence Preloader
    const preloader = document.getElementById('preloader');
    if (preloader) {
        const hasBooted = sessionStorage.getItem('hasBooted');
        if (!hasBooted) {
            const logs = document.getElementById('loader-logs');
            const bootSequence = [
                "Cargando núcleo gráfico...",
                "Estableciendo conexión segura...",
                "Iniciando módulos interactivos...",
                "Sistema Mtys_24 listo."
            ];
            let delay = 300;
            bootSequence.forEach((text, index) => {
                setTimeout(() => {
                    const p = document.createElement('div');
                    p.innerHTML = `<span class="prompt">[OK]</span> ${text}`;
                    logs.appendChild(p);
                }, delay);
                delay += 400 + Math.random() * 200;
            });
            setTimeout(() => {
                preloader.classList.add('fade-out');
                sessionStorage.setItem('hasBooted', 'true');
            }, delay + 500);
        } else {
            preloader.style.display = 'none';
        }
    }

    // 10.2 Custom Magnetic Cursor
    const cursor = document.getElementById('custom-cursor');
    if (cursor && window.matchMedia('(pointer: fine)').matches) {
        let mouseX = window.innerWidth / 2;
        let mouseY = window.innerHeight / 2;
        let cursorX = mouseX;
        let cursorY = mouseY;
        
        window.addEventListener('mousemove', (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;
        });

        const renderCursor = () => {
            // Lerp for smooth following
            cursorX += (mouseX - cursorX) * 0.2;
            cursorY += (mouseY - cursorY) * 0.2;
            cursor.style.left = `${cursorX}px`;
            cursor.style.top = `${cursorY}px`;
            requestAnimationFrame(renderCursor);
        };
        requestAnimationFrame(renderCursor);

        // Magnetic hover effect
        const hoverElements = document.querySelectorAll('a, button, .interactive-card, .hover-magnetic, .glass-card');
        hoverElements.forEach(el => {
            el.addEventListener('mouseenter', () => cursor.classList.add('hovering'));
            el.addEventListener('mouseleave', () => cursor.classList.remove('hovering'));
        });
    }

    // 10.3 UI Sound Design (AudioContext)
    let audioCtx;
    let isSoundEnabled = false;
    const soundToggle = document.getElementById('sound-toggle');
    
    const initAudio = () => {
        if (!audioCtx) {
            audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        }
    };

    const playSound = (type) => {
        if (!isSoundEnabled || !audioCtx) return;
        if (audioCtx.state === 'suspended') audioCtx.resume();
        
        const now = audioCtx.currentTime;
        const osc = audioCtx.createOscillator();
        const gainNode = audioCtx.createGain();
        osc.connect(gainNode);
        gainNode.connect(audioCtx.destination);
        
        if (type === 'hover') {
            osc.type = 'sine';
            osc.frequency.setValueAtTime(800, now);
            osc.frequency.exponentialRampToValueAtTime(1200, now + 0.05);
            gainNode.gain.setValueAtTime(0, now);
            gainNode.gain.linearRampToValueAtTime(0.02, now + 0.01);
            gainNode.gain.exponentialRampToValueAtTime(0.001, now + 0.05);
            osc.start(now);
            osc.stop(now + 0.05);
        } else if (type === 'click') {
            osc.type = 'triangle';
            osc.frequency.setValueAtTime(300, now);
            osc.frequency.exponentialRampToValueAtTime(100, now + 0.1);
            gainNode.gain.setValueAtTime(0, now);
            gainNode.gain.linearRampToValueAtTime(0.05, now + 0.02);
            gainNode.gain.exponentialRampToValueAtTime(0.001, now + 0.1);
            osc.start(now);
            osc.stop(now + 0.1);
        }
    };

    if (soundToggle) {
        // Init icon to muted since we start without user interaction
        soundToggle.innerHTML = '<i data-lucide="volume-x"></i>';
        if (window.lucide) window.lucide.createIcons();

        soundToggle.addEventListener('click', () => {
            initAudio();
            isSoundEnabled = !isSoundEnabled;
            soundToggle.innerHTML = isSoundEnabled ? '<i data-lucide="volume-2"></i>' : '<i data-lucide="volume-x"></i>';
            if (window.lucide) window.lucide.createIcons();
            playSound('click');
            
            if(window.showCyberToast) {
                window.showCyberToast("AUDIO UI", isSoundEnabled ? "Sonido Activado" : "Silenciado", 2000);
            }
        });
        
        document.querySelectorAll('a, button, .glass-card, .interactive-card').forEach(el => {
            el.addEventListener('mouseenter', () => playSound('hover'));
            el.addEventListener('click', () => playSound('click'));
        });
    }

    // 10.4 GitHub API Integration
    const githubGrid = document.getElementById('github-repos');
    if (githubGrid) {
        fetch('https://api.github.com/users/Mtys24/repos?sort=updated&per_page=6')
            .then(res => res.json())
            .then(repos => {
                githubGrid.innerHTML = '';
                if(repos.length === 0) {
                    githubGrid.innerHTML = '<p>No se encontraron repositorios públicos.</p>';
                    return;
                }
                repos.forEach(repo => {
                    const el = document.createElement('article');
                    el.className = 'glass-card gh-repo-card hover-magnetic';
                    el.innerHTML = `
                        <h3><i data-lucide="github"></i> <a href="${repo.html_url}" target="_blank" rel="noopener noreferrer">${repo.name}</a></h3>
                        <p>${repo.description || 'Sin descripción disponible.'}</p>
                        <div class="gh-stats">
                            <span title="Stars"><i data-lucide="star"></i> ${repo.stargazers_count}</span>
                            <span title="Forks"><i data-lucide="git-fork"></i> ${repo.forks_count}</span>
                            ${repo.language ? `<span><i data-lucide="code-2"></i> ${repo.language}</span>` : ''}
                        </div>
                    `;
                    githubGrid.appendChild(el);
                    
                    // Wire up new dynamic elements for custom cursor and sound
                    el.addEventListener('mouseenter', () => {
                        if(cursor) cursor.classList.add('hovering');
                        playSound('hover');
                    });
                    el.addEventListener('mouseleave', () => {
                        if(cursor) cursor.classList.remove('hovering');
                    });
                    el.addEventListener('click', () => playSound('click'));
                });
                if (window.lucide) window.lucide.createIcons();
            })
            .catch(err => {
                githubGrid.innerHTML = '<p>Error al conectar con GitHub API. Intenta más tarde.</p>';
            });
    }

    // 10.5 i18n Dynamic Translation
    const langToggle = document.getElementById('lang-toggle');
    const dictionary = {
        es: {
            nav_about: "Sobre mí",
            nav_projects: "Proyectos",
            nav_ecosystem: "Ecosistema",
            nav_skills: "Habilidades",
            nav_contact: "Contacto",
            github_title: "Actividad en GitHub",
            github_loading: "Conectando a la API de GitHub...",
            hero_title_1: "Construir. Escalar.",
            hero_title_2: "Proteger.",
            hero_subtitle: "Full-stack & SysAdmin",
            hero_desc: "Desarrollador junior con ganas de escribir código claro y dejar al equipo con una sonrisa.",
            hero_btn_projects: "Ver proyectos",
            hero_btn_contact: "Contactar",
            section_projects: "Mis Proyectos",
            section_ecosystem: "Ecosistema de Software",
            eco_desc: "Explora mis repositorios open source recientes e integraciones de software enterprise desarrolladas para el sector público y privado.",
            section_skills: "Arsenal Técnico",
            about_title: "👋 ¡Hola! Soy Matías Francisco Manríquez",
            about_p1: "Desarrollador junior apasionado por desentrañar problemas complejos tanto a nivel de código frontend/backend como en la optimización y seguridad de servidores. Escribo código claro, robusto y eficiente para crear soluciones digitales que dejen una sonrisa en el equipo.",
            about_p2: "¿Tienes un reto técnico, una idea innovadora o un servidor que necesita mantenimiento profundo? ¡Inicia un ping y hablemos de tecnología!",
            contact_title: "Inicia un Ping",
            contact_name: "Nombre / Entidad",
            contact_email: "Canal de Contacto (Email)",
            contact_message: "Paquete de Datos (Mensaje)",
            contact_send: "Enviar Transmisión",
            p1_title: "Room Reservation System",
            p1_desc: "Plataforma robusta para la gestión y reserva de espacios, con análisis de datos y métricas (KPIs) en tiempo real para la optimización de recursos empresariales.",
            p2_title: "To-Do Sci-Fi Interactive",
            p2_desc: "Aplicación de tareas interactiva con almacenamiento local. ¡Pruébala agregando y completando tareas en vivo aquí abajo!",
            p2_ph: "Nueva tarea orbital...",
            p2_task1: "Refactorizar middleware",
            p2_task2: "Configurar RAID 1 en DL380e",
            p3_title: "Bot Básico Python (Sim)",
            p3_desc: "Simulador interactivo del bot en Python. Haz clic en las opciones rápidas o escríbele un comando para chatear con él.",
            p3_bot1: "> Bot básico python iniciado.",
            p3_bot2: "¡Hola! Escribe algo o selecciona una opción.",
            p3_ph: "Escribe...",
            p4_title: "Mtys24 Hub Dashboard",
            p4_desc: "Consola central del desarrollador. Resumen del ecosistema y estado de operaciones en tiempo real.",
            p4_btn: "Explorar Perfil",
            eco1_title: "Módulo de Firma y Validación Electrónica",
            eco1_desc: "Módulo legal-tech para integración con APIs gubernamentales centralizadas. Permite la validación y firma electrónica avanzada de archivos PDF/XML mediante JSON Web Tokens (JWT HS256) y autenticación multifactor (MFA OTP), incrustando estampados dinámicos firmados.",
            eco2_title: "Portal Transaccional Corporativo",
            eco2_desc: "Portal transaccional híbrido para la gestión digital de trámites y solicitudes en una entidad pública. Arquitectura robusta con bases de datos híbridas (MySQL y MongoDB) para gestionar perfiles, catálogos, registros dinámicos y logs de auditoría en runtime.",
            eco3_title: "Escáner de Red",
            eco3_desc: "Herramienta SysAdmin orientada al diagnóstico y auditoría de redes locales. Permite realizar escaneos ágiles de puertos TCP abiertos, detección activa de hosts conectados mediante sockets en subredes locales y medición de latencias.",
            eco4_title: "SOS Ayuda Cyber-Medical HUD",
            eco4_desc: "Cyber-Medical HUD de primeros auxilios diseñado para la atención e instrucción en situaciones críticas. Cuenta con una ficha médica ICE de emergencia, guías de maniobras críticas de reanimación y geolocalización.",
            eco5_title: "Censurador de PDF",
            eco5_desc: "Script utilitario en Python para la censura y redacción de datos sensibles dentro de archivos PDF. Detecta automáticamente palabras clave y patrones para sobreescribir con marcas de confidencialidad antes de su publicación.",
            eco6_title: "Plataforma de Atención al Usuario",
            eco6_desc: "Sistema corporativo desarrollado para canalizar de forma digital consultas, reclamos y solicitudes de usuarios. Integra un sistema automatizado de enrutamiento de tickets de soporte hacia los departamentos correspondientes de la entidad.",
            eco7_title: "Sistema de Transparencia y Auditoría",
            eco7_desc: "Módulo de cumplimiento normativo y transparencia para entidades corporativas/públicas. Facilita el registro y auditoría auditable de resoluciones legales, bitácoras de modificaciones de datos y resguardo de la fe pública administrativa.",
            eco8_title: "Biblioteca Pública Virtual",
            eco8_desc: "Sistema modular para la administración y control de inventario, préstamo de libros, registro de socios y control de stock en catálogos virtuales.",
            footer_term: "Bienvenido al portafolio de Matías. Escribe <span class=\"text-emerald font-bold\">help</span> para comandos disponibles."
        },
        en: {
            nav_about: "About me",
            nav_projects: "Projects",
            nav_ecosystem: "Ecosystem",
            nav_skills: "Skills",
            nav_contact: "Contact",
            github_title: "GitHub Activity",
            github_loading: "Connecting to GitHub API...",
            hero_title_1: "Build. Scale.",
            hero_title_2: "Protect.",
            hero_subtitle: "Full-stack & SysAdmin",
            hero_desc: "Junior developer eager to write clean code and leave the team with a smile.",
            hero_btn_projects: "View projects",
            hero_btn_contact: "Contact me",
            section_projects: "My Projects",
            section_ecosystem: "Software Ecosystem",
            eco_desc: "Explore my recent open source repositories and enterprise software integrations developed for the public and private sectors.",
            section_skills: "Tech Arsenal",
            about_title: "👋 Hi! I'm Matías Francisco Manríquez",
            about_p1: "Junior developer passionate about unraveling complex problems at the frontend/backend code level as well as server optimization and security. I write clean, robust, and efficient code to create digital solutions that leave a smile on the team.",
            about_p2: "Do you have a technical challenge, an innovative idea, or a server that needs deep maintenance? Initiate a ping and let's talk tech!",
            contact_title: "Initiate a Ping",
            contact_name: "Name / Entity",
            contact_email: "Comms Channel (Email)",
            contact_message: "Data Packet (Message)",
            contact_send: "Send Transmission",
            p1_title: "Room Reservation System",
            p1_desc: "Robust platform for space management and booking, with real-time data analysis and KPIs for enterprise resource optimization.",
            p2_title: "To-Do Sci-Fi Interactive",
            p2_desc: "Interactive task application with local storage. Try adding and completing tasks live down below!",
            p2_ph: "New orbital task...",
            p2_task1: "Refactor middleware",
            p2_task2: "Configure RAID 1 on DL380e",
            p3_title: "Basic Python Bot (Sim)",
            p3_desc: "Interactive Python bot simulator. Click on quick options or type a command to chat with it.",
            p3_bot1: "> Basic python bot initialized.",
            p3_bot2: "Hello! Type something or select an option.",
            p3_ph: "Type...",
            p4_title: "Mtys24 Hub Dashboard",
            p4_desc: "Central developer console. Ecosystem overview and real-time operations status.",
            p4_btn: "Explore Profile",
            eco1_title: "Electronic Signature & Validation Module",
            eco1_desc: "Legal-tech module for integration with centralized government APIs. Enables advanced electronic validation and signing of PDF/XML files via JSON Web Tokens (JWT HS256) and MFA, embedding dynamic signed stamps.",
            eco2_title: "Corporate Transactional Portal",
            eco2_desc: "Hybrid transactional portal for digital management of procedures and requests in a public entity. Robust architecture with hybrid databases (MySQL and MongoDB) to manage profiles, catalogs, dynamic records, and runtime audit logs.",
            eco3_title: "Network Scanner",
            eco3_desc: "SysAdmin tool oriented towards diagnostics and auditing of local networks. Allows agile scanning of open TCP ports, active detection of connected hosts via sockets on local subnets, and latency measurement.",
            eco4_title: "SOS Help Cyber-Medical HUD",
            eco4_desc: "First aid Cyber-Medical HUD designed for attention and instruction in critical situations. Features an emergency ICE medical file, critical resuscitation maneuver guides, and geolocation.",
            eco5_title: "PDF Censor",
            eco5_desc: "Python utility script for censoring and redacting sensitive data within PDF files. Automatically detects keywords and patterns to overwrite with confidentiality marks prior to publication.",
            eco6_title: "User Support Platform",
            eco6_desc: "Corporate system developed to digitally channel user inquiries, complaints, and requests. Integrates an automated support ticket routing system to the corresponding entity departments.",
            eco7_title: "Transparency & Audit System",
            eco7_desc: "Regulatory compliance and transparency module for corporate/public entities. Facilitates the auditable registration and auditing of legal resolutions, data modification logs, and protection of public administrative faith.",
            eco8_title: "Virtual Public Library",
            eco8_desc: "Modular system for inventory administration and control, book lending, member registration, and stock control in virtual catalogs.",
            footer_term: "Welcome to Matías' portfolio. Type <span class=\"text-emerald font-bold\">help</span> for available commands."
        }
    };

    if (langToggle) {
        let currentLang = localStorage.getItem('lang') || 'es';
        
        const updateLanguage = (lang) => {
            document.querySelectorAll('[data-i18n]').forEach(el => {
                const key = el.getAttribute('data-i18n');
                if (dictionary[lang] && dictionary[lang][key]) {
                    el.textContent = dictionary[lang][key];
                }
            });
            langToggle.querySelector('.lang-text').textContent = lang.toUpperCase();
            document.documentElement.lang = lang;
            if(window.showCyberToast) {
                window.showCyberToast("SISTEMA", `Idioma cambiado a ${lang.toUpperCase()}`, 2000);
            }
        };

        // Init language
        if (currentLang !== 'es') updateLanguage(currentLang);

        langToggle.addEventListener('click', () => {
            currentLang = currentLang === 'es' ? 'en' : 'es';
            localStorage.setItem('lang', currentLang);
            updateLanguage(currentLang);
            playSound('click');
        });
    }

});
