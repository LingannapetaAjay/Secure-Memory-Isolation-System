/* ============================================
   PARTICLE BACKGROUND
   ============================================ */
const canvas = document.getElementById('particle-canvas');
const ctx = canvas.getContext('2d');
let particles = [];
let mouse = { x: null, y: null };

function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}
resizeCanvas();
window.addEventListener('resize', resizeCanvas);

window.addEventListener('mousemove', (e) => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
});

class Particle {
    constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = Math.random() * 2 + 0.5;
        this.speedX = (Math.random() - 0.5) * 0.4;
        this.speedY = (Math.random() - 0.5) * 0.4;
        this.opacity = Math.random() * 0.5 + 0.1;
        this.hue = Math.random() > 0.5 ? 260 : 180; // purple or cyan
    }

    update() {
        this.x += this.speedX;
        this.y += this.speedY;

        if (this.x > canvas.width) this.x = 0;
        if (this.x < 0) this.x = canvas.width;
        if (this.y > canvas.height) this.y = 0;
        if (this.y < 0) this.y = canvas.height;
    }

    draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = `hsla(${this.hue}, 70%, 60%, ${this.opacity})`;
        ctx.fill();
    }
}

function initParticles() {
    particles = [];
    const count = Math.min(80, Math.floor((canvas.width * canvas.height) / 15000));
    for (let i = 0; i < count; i++) {
        particles.push(new Particle());
    }
}
initParticles();
window.addEventListener('resize', initParticles);

function connectParticles() {
    for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
            const dx = particles[i].x - particles[j].x;
            const dy = particles[i].y - particles[j].y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            if (dist < 140) {
                const opacity = (1 - dist / 140) * 0.12;
                ctx.beginPath();
                ctx.moveTo(particles[i].x, particles[i].y);
                ctx.lineTo(particles[j].x, particles[j].y);
                ctx.strokeStyle = `rgba(108, 92, 231, ${opacity})`;
                ctx.lineWidth = 0.5;
                ctx.stroke();
            }
        }
    }
}

function animateParticles() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach(p => {
        p.update();
        p.draw();
    });
    connectParticles();
    requestAnimationFrame(animateParticles);
}
animateParticles();

/* ============================================
   NAVBAR
   ============================================ */
const navbar = document.getElementById('navbar');
const navToggle = document.getElementById('navToggle');
const navLinks = document.getElementById('navLinks');

window.addEventListener('scroll', () => {
    if (window.scrollY > 60) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }

    // Active link tracking
    const sections = document.querySelectorAll('section[id]');
    let current = '';
    sections.forEach(sec => {
        const top = sec.offsetTop - 120;
        if (window.scrollY >= top) {
            current = sec.getAttribute('id');
        }
    });

    document.querySelectorAll('.nav-links a').forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${current}`) {
            link.classList.add('active');
        }
    });
});

navToggle.addEventListener('click', () => {
    navToggle.classList.toggle('active');
    navLinks.classList.toggle('open');
});

// Close mobile nav on link click
document.querySelectorAll('.nav-links a').forEach(link => {
    link.addEventListener('click', () => {
        navToggle.classList.remove('active');
        navLinks.classList.remove('open');
    });
});

/* ============================================
   SCROLL ANIMATIONS (INTERSECTION OBSERVER)
   ============================================ */
const observerOptions = {
    threshold: 0.15,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            // For timeline items, add staggered delay
            const delay = entry.target.dataset.delay || 0;
            entry.target.style.transitionDelay = `${delay}ms`;
        }
    });
}, observerOptions);

// Observe problem cards
document.querySelectorAll('.problem-card').forEach((card, i) => {
    card.dataset.delay = i * 150;
    observer.observe(card);
});

// Observe timeline items
document.querySelectorAll('.timeline-item').forEach((item, i) => {
    item.dataset.delay = i * 200;
    observer.observe(item);
});

/* ============================================
   COUNTER ANIMATION
   ============================================ */
function animateCounters() {
    const counters = document.querySelectorAll('.stat-number[data-count]');
    counters.forEach(counter => {
        const target = parseInt(counter.dataset.count);
        const duration = 2000;
        const start = performance.now();

        function tick(now) {
            const elapsed = now - start;
            const progress = Math.min(elapsed / duration, 1);
            // Ease-out
            const eased = 1 - Math.pow(1 - progress, 3);
            counter.textContent = Math.floor(target * eased);
            if (progress < 1) {
                requestAnimationFrame(tick);
            } else {
                counter.textContent = target;
            }
        }
        requestAnimationFrame(tick);
    });
}

// Trigger counters on hero visibility
const heroObserver = new IntersectionObserver((entries) => {
    if (entries[0].isIntersecting) {
        animateCounters();
        heroObserver.disconnect();
    }
}, { threshold: 0.5 });

heroObserver.observe(document.querySelector('.hero-stats'));

/* ============================================
   INTERACTIVE DEMO
   ============================================ */
const btnAttackAtoB = document.getElementById('btnAttackAtoB');
const btnAttackBtoA = document.getElementById('btnAttackBtoA');
const btnLegitAccess = document.getElementById('btnLegitAccess');
const btnReset = document.getElementById('btnReset');
const demoResult = document.getElementById('demoResult');
const resultContent = document.getElementById('resultContent');
const logEntries = document.getElementById('logEntries');
const demoShield = document.getElementById('demoShield');
const processA = document.getElementById('processA');
const processB = document.getElementById('processB');
const btnClearLog = document.getElementById('btnClearLog');

let logCount = 0;

function getTimestamp() {
    const now = new Date();
    return now.toTimeString().split(' ')[0];
}

function addLog(message, type = 'info') {
    logCount++;
    const entry = document.createElement('div');
    entry.className = `log-entry ${type}`;
    entry.innerHTML = `<span class="log-time">[${getTimestamp()}]</span><span>${message}</span>`;
    logEntries.appendChild(entry);
    logEntries.scrollTop = logEntries.scrollHeight;
    entry.style.animation = 'fadeInUp 0.3s ease';
}

function simulateAttack(attacker, target, attackerLabel, targetLabel) {
    // Disable buttons during animation
    const buttons = document.querySelectorAll('.demo-controls .btn');
    buttons.forEach(b => b.disabled = true);

    const attackerEl = attacker === 'A' ? processA : processB;
    const targetEl = attacker === 'A' ? processB : processA;
    const targetGrid = attacker === 'A' ? document.getElementById('memGridB') : document.getElementById('memGridA');

    // Step 1: Attacker initiates
    addLog(`${attackerLabel} attempting to access ${targetLabel}'s memory space...`, 'warning');
    attackerEl.classList.add('attacking');

    setTimeout(() => {
        // Step 2: Shield activates
        demoShield.classList.add('alert');
        addLog(`⚠️ MMU: Unauthorized address translation detected!`, 'error');

        setTimeout(() => {
            // Step 3: Access blocked
            const slots = targetGrid.querySelectorAll('.mem-slot');
            slots.forEach((slot, i) => {
                setTimeout(() => {
                    slot.classList.add('blocked');
                }, i * 80);
            });

            addLog(`🛡️ SEGFAULT: Access violation at ${attacker === 'A' ? '0xB000' : '0xA000'}`, 'error');
            addLog(`❌ ${attackerLabel} (PID: ${attacker === 'A' ? '1024' : '2048'}) access DENIED. Process terminated.`, 'error');

            resultContent.className = 'result-content denied';
            resultContent.innerHTML = `<i class="fas fa-times-circle"></i><span><strong>Access Denied ❌</strong> — ${attackerLabel} was blocked from reading ${targetLabel}'s memory. Segmentation fault triggered.</span>`;

            // Change attacker indicator
            const indicator = attackerEl.querySelector('.process-indicator');
            indicator.style.background = '#e74c3c';
            indicator.style.animation = 'none';

            const statusEl = attackerEl.querySelector('.memory-status');
            statusEl.innerHTML = `<span class="status-dot danger"></span><span>Process terminated (SIGSEGV)</span>`;

            setTimeout(() => {
                demoShield.classList.remove('alert');
                attackerEl.classList.remove('attacking');
                buttons.forEach(b => b.disabled = false);
            }, 800);
        }, 800);
    }, 600);
}

function simulateLegitAccess() {
    const buttons = document.querySelectorAll('.demo-controls .btn');
    buttons.forEach(b => b.disabled = true);

    addLog(`Process A (PID: 1024) accessing own memory at 0xA000...`, 'info');

    const slots = document.querySelectorAll('#memGridA .mem-slot');
    processA.classList.add('highlight-self');

    slots.forEach((slot, i) => {
        setTimeout(() => {
            slot.classList.add('accessed');
        }, i * 120);
    });

    setTimeout(() => {
        addLog(`✅ MMU: Address translation valid. Permission check passed.`, 'success');
        addLog(`✅ Process A read from 0xA000-0xA014 successfully.`, 'success');

        resultContent.className = 'result-content granted';
        resultContent.innerHTML = `<i class="fas fa-check-circle"></i><span><strong>Access Granted ✅</strong> — Process A successfully read its own allocated memory. No violations detected.</span>`;

        setTimeout(() => {
            processA.classList.remove('highlight-self');
            buttons.forEach(b => b.disabled = false);
        }, 800);
    }, 900);
}

function resetDemo() {
    const allSlots = document.querySelectorAll('.mem-slot');
    allSlots.forEach(s => {
        s.classList.remove('blocked', 'accessed');
    });

    processA.classList.remove('attacking', 'highlight-self');
    processB.classList.remove('attacking', 'highlight-self');
    demoShield.classList.remove('alert');

    // Reset indicators
    document.querySelectorAll('.process-indicator').forEach(ind => {
        ind.style.background = '';
        ind.style.animation = '';
    });

    // Reset status
    document.querySelectorAll('.memory-status').forEach(s => {
        s.innerHTML = `<span class="status-dot safe"></span><span>Secure — No violations</span>`;
    });

    resultContent.className = 'result-content';
    resultContent.innerHTML = `<i class="fas fa-info-circle"></i><span>Click a button above to simulate memory access</span>`;

    addLog(`System reset. Memory protection module re-initialized.`, 'info');
}

btnAttackAtoB.addEventListener('click', () => {
    resetDemo();
    setTimeout(() => simulateAttack('A', 'B', 'Process A', 'Process B'), 300);
});

btnAttackBtoA.addEventListener('click', () => {
    resetDemo();
    setTimeout(() => simulateAttack('B', 'A', 'Process B', 'Process A'), 300);
});

btnLegitAccess.addEventListener('click', () => {
    resetDemo();
    setTimeout(() => simulateLegitAccess(), 300);
});

btnReset.addEventListener('click', resetDemo);

btnClearLog.addEventListener('click', () => {
    logEntries.innerHTML = `<div class="log-entry info"><span class="log-time">[SYSTEM]</span><span>Log cleared. Memory Protection Module active.</span></div>`;
});

/* ============================================
   AI CHATBOT
   ============================================ */
const chatbotToggle = document.getElementById('chatbotToggle');
const chatbotWindow = document.getElementById('chatbotWindow');
const chatbotClose = document.getElementById('chatbotClose');
const chatInput = document.getElementById('chatInput');
const chatSend = document.getElementById('chatSend');
const chatbotMessages = document.getElementById('chatbotMessages');
const suggestions = document.querySelectorAll('.suggestion-chip');

// Knowledge base
const knowledgeBase = {
    'memory isolation': `Memory isolation is a fundamental OS security mechanism that gives each process its own private virtual address space. This means Process A cannot read or write to Process B's memory, even if it knows the physical address. The CPU's Memory Management Unit (MMU) enforces this at the hardware level, making it extremely fast and nearly impossible to bypass without kernel privileges.`,
    
    'what is memory isolation': `Memory isolation is a fundamental OS security mechanism that gives each process its own private virtual address space. This means Process A cannot read or write to Process B's memory, even if it knows the physical address. The CPU's Memory Management Unit (MMU) enforces this at the hardware level, making it extremely fast and nearly impossible to bypass without kernel privileges.`,

    'mmu': `The Memory Management Unit (MMU) is specialized hardware inside the CPU. For every memory access, it translates virtual addresses to physical addresses using page tables. If a process tries to access an address outside its allocated pages, the MMU triggers a page fault exception. The OS kernel then handles this — typically by sending a SIGSEGV signal and terminating the offending process. Modern MMUs support multiple privilege levels, NX (No-Execute) bits, and ASLR support.`,

    'how does the mmu work': `The Memory Management Unit (MMU) is specialized hardware inside the CPU. For every memory access, it translates virtual addresses to physical addresses using page tables. If a process tries to access an address outside its allocated pages, the MMU triggers a page fault exception. The OS kernel then handles this — typically by sending a SIGSEGV signal and terminating the offending process. It also has a Translation Lookaside Buffer (TLB) for caching recent translations.`,

    'segfault': `A segmentation fault (segfault or SIGSEGV) occurs when a process tries to access memory it doesn't own or doesn't have permission for. Common causes include: dereferencing null pointers, writing to read-only memory, accessing freed memory, and buffer overflows. When a segfault occurs, the OS kernel sends signal 11 (SIGSEGV) to the process, which typically terminates it immediately. This is actually a protective mechanism — it prevents one buggy process from corrupting other processes or the kernel.`,

    'what is a segfault': `A segmentation fault (segfault or SIGSEGV) occurs when a process tries to access memory it doesn't own or doesn't have permission for. Common causes include: dereferencing null pointers, writing to read-only memory, accessing freed memory, and buffer overflows. When this happens, the OS terminates the offending process to protect system integrity.`,

    'why is this important': `Memory isolation is critical because without it: 1) Any process could read your passwords, encryption keys, or personal data from other apps. 2) Malware could inject code into trusted processes. 3) A single bug in any program could crash your entire system. 4) There would be no security boundary between applications. Every modern OS (Windows, Linux, macOS) relies on memory isolation as a foundational security feature. It's what makes multi-tasking safe and reliable.`,

    'page table': `A page table is a data structure maintained by the OS for each process. It maps virtual page numbers to physical frame numbers. When a process accesses memory, the MMU looks up the page table to find the actual physical address. Each entry also contains permission bits (read/write/execute) and a present/absent bit. Modern systems use multi-level page tables (like 4-level in x86-64) to reduce memory overhead for sparse address spaces.`,

    'virtual memory': `Virtual memory is a memory management technique that creates an abstraction layer between processes and physical RAM. Each process sees a contiguous, private address space (typically 4GB on 32-bit or 256TB on 64-bit systems), but the actual data may be scattered across physical RAM or even paged to disk. This provides: process isolation, simplified memory management, ability to run programs larger than physical memory, and copy-on-write optimization for forked processes.`,

    'process': `A process is a running instance of a program. Each process has: a unique Process ID (PID), its own virtual address space (code, data, heap, stack segments), a set of CPU registers, file descriptors, and security credentials. The OS kernel manages process creation (fork/exec), scheduling, and termination. Processes communicate via controlled mechanisms like pipes, sockets, or shared memory — never by directly accessing each other's memory.`,

    'aslr': `Address Space Layout Randomization (ASLR) is a security technique that randomizes where code, stack, heap, and libraries are loaded in memory each time a program runs. This makes it much harder for attackers to exploit buffer overflows or other memory vulnerabilities, because they can't predict where specific code or data will be located. Combined with DEP (Data Execution Prevention), ASLR provides robust defense against memory-based attacks.`,

    'default': `That's an interesting question! This project demonstrates memory isolation — a critical OS security mechanism. I can explain concepts like virtual memory, page tables, the MMU, segmentation faults, ASLR, and more. Try asking me something specific about how operating systems protect process memory! 🛡️`
};

function findAnswer(question) {
    const q = question.toLowerCase().trim();
    
    // Check for keyword matches
    for (const [key, answer] of Object.entries(knowledgeBase)) {
        if (key === 'default') continue;
        // Check if the question contains the key or vice versa
        if (q.includes(key) || key.includes(q)) {
            return answer;
        }
    }

    // Check for individual keyword matches
    const keywords = {
        'isolat': 'memory isolation',
        'mmu': 'mmu',
        'segfault': 'segfault',
        'segmentation': 'segfault',
        'important': 'why is this important',
        'why': 'why is this important',
        'page table': 'page table',
        'virtual': 'virtual memory',
        'process': 'process',
        'aslr': 'aslr',
        'randomiz': 'aslr',
        'protect': 'memory isolation',
        'security': 'why is this important',
        'hack': 'why is this important',
        'crash': 'segfault',
        'address': 'virtual memory',
    };

    for (const [keyword, lookupKey] of Object.entries(keywords)) {
        if (q.includes(keyword)) {
            return knowledgeBase[lookupKey];
        }
    }

    return knowledgeBase['default'];
}

function addMessage(text, isUser = false) {
    const msgDiv = document.createElement('div');
    msgDiv.className = `chat-message ${isUser ? 'user' : 'bot'}`;
    msgDiv.innerHTML = `
        <div class="message-avatar"><i class="fas fa-${isUser ? 'user' : 'robot'}"></i></div>
        <div class="message-bubble">${text}</div>
    `;
    chatbotMessages.appendChild(msgDiv);
    chatbotMessages.scrollTop = chatbotMessages.scrollHeight;
}

function handleChat(question) {
    if (!question.trim()) return;

    addMessage(question, true);
    chatInput.value = '';

    // Simulate typing delay
    setTimeout(() => {
        const answer = findAnswer(question);
        addMessage(answer);
    }, 600 + Math.random() * 600);
}

chatbotToggle.addEventListener('click', () => {
    chatbotWindow.classList.toggle('open');
});

chatbotClose.addEventListener('click', () => {
    chatbotWindow.classList.remove('open');
});

chatSend.addEventListener('click', () => handleChat(chatInput.value));

chatInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') handleChat(chatInput.value);
});

suggestions.forEach(chip => {
    chip.addEventListener('click', () => {
        const q = chip.dataset.question;
        handleChat(q);
    });
});

/* ============================================
   SMOOTH SCROLL ENHANCEMENT
   ============================================ */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    });
});
