document.addEventListener('DOMContentLoaded', () => {
    // 1. Mobile Menu Toggle
    const menuBtn = document.getElementById('mobile-menu-btn');
    const navLinks = document.querySelector('.nav-links');

    if(menuBtn) {
        menuBtn.addEventListener('click', () => {
            navLinks.classList.toggle('show');
        });
    }

    // 2. Scroll Reveal Animations
    const revealElements = document.querySelectorAll('.reveal');

    const revealCallback = (entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                // observer.unobserve(entry.target); // Uncomment to trigger animation only once
            }
        });
    };

    const revealOptions = {
        threshold: 0.15,
        rootMargin: "0px 0px -50px 0px"
    };

    const revealObserver = new IntersectionObserver(revealCallback, revealOptions);

    revealElements.forEach(el => revealObserver.observe(el));

    // 3. Contact Form Submission (FormSubmit AJAX)
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
                headers: {
                    'Accept': 'application/json'
                },
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
            .catch(error => {
                btn.innerHTML = 'Error de Red <i data-lucide="wifi-off" style="color:red"></i>';
                setTimeout(() => {
                    btn.innerHTML = originalText;
                    btn.disabled = false;
                    lucide.createIcons();
                }, 3000);
            });
        });
    }

    // 4. Interactive Terminal Footer
    const terminalInput = document.getElementById('terminal-input');
    const terminalContent = document.getElementById('terminal-content');

    const commands = {
        'help': 'Comandos disponibles: <span class="text-cyan">whoami</span>, <span class="text-cyan">skills</span>, <span class="text-cyan">contact</span>, <span class="text-cyan">clear</span>, <span class="text-emerald">sudo rm -rf /</span>',
        'whoami': 'Matías (Mtys24). Full-Stack Developer & SysAdmin. Entusiasta de Linux y el código limpio.',
        'skills': '>> Dev: Python, PHP, JS, React.<br>>> Ops: Linux, Docker, AWS, RAID Config.',
        'contact': 'Inicia un ping a través del formulario arriba o envíame un email a contacto@mtys24.dev',
        'sudo rm -rf /': '<span style="color:#ef4444">Permiso denegado. ¡Buen intento! ;)</span>',
        'clear': 'clear_cmd'
    };

    if (terminalInput) {
        terminalInput.addEventListener('keydown', function(event) {
            if (event.key === 'Enter') {
                const inputVal = this.value.trim().toLowerCase();
                this.value = '';

                if (inputVal === '') return;

                // Echo the command
                const echoLine = document.createElement('p');
                echoLine.innerHTML = `<span class="prompt">guest@mtys24:~$</span> ${inputVal}`;
                terminalContent.appendChild(echoLine);

                // Process command
                if (inputVal === 'clear') {
                    terminalContent.innerHTML = '';
                } else {
                    const response = commands[inputVal] || 'Comando no encontrado. Escribe <span class="text-emerald font-bold">help</span> para ayuda.';
                    const responseLine = document.createElement('p');
                    responseLine.innerHTML = response;
                    terminalContent.appendChild(responseLine);
                }

                // Auto scroll to bottom
                terminalContent.scrollTop = terminalContent.scrollHeight;
            }
        });
        
        // Mantener focus visual si se hace clic en la terminal
        document.querySelector('.terminal-window').addEventListener('click', () => {
            terminalInput.focus();
        });
    }
});
