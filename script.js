/* Particle Background System */
class ParticleSystem {
  constructor() {
    this.canvas = document.getElementById('bg-canvas');
    this.ctx = this.canvas.getContext('2d');
    this.particles = [];
    this.mouse = { x: 0, y: 0, active: false };
    this.animationId = null;
    this.init();
  }

  init() {
    this.resize();
    this.createParticles();
    this.bindEvents();
    this.animate();
  }

  resize() {
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
  }

  createParticles() {
    const count = Math.min(150, Math.floor((this.canvas.width * window.innerHeight) / 12000));
    this.particles = [];
    const colors = ['#ea4335', '#4285f4', '#a142f4', '#34a853', '#fbbc04'];
    for (let i = 0; i < count; i++) {
      this.particles.push({
        x: Math.random() * this.canvas.width,
        y: Math.random() * this.canvas.height,
        vx: (Math.random() - 0.5) * 0.3,
        vy: (Math.random() - 0.5) * 0.3,
        radius: Math.random() * 2.5 + 1,
        color: colors[Math.floor(Math.random() * colors.length)],
        opacity: Math.random() * 0.5 + 0.2,
        originalVx: 0,
        originalVy: 0
      });
    }
  }

  bindEvents() {
    window.addEventListener('resize', () => this.resize());
    
    document.addEventListener('mousemove', (e) => {
      this.mouse.x = e.clientX;
      this.mouse.y = e.clientY;
      this.mouse.active = true;
    });

    document.addEventListener('mouseleave', () => {
      this.mouse.active = false;
    });
  }

  animate() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.updateParticles();
    this.drawParticles();
    this.drawConnections();
    this.animationId = requestAnimationFrame(() => this.animate());
  }

  updateParticles() {
    this.particles.forEach(p => {
      // Mouse interaction - particles react to cursor
      if (this.mouse.active) {
        const dx = this.mouse.x - p.x;
        const dy = this.mouse.y - p.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        
        if (dist < 150) {
          const force = (150 - dist) / 150;
          const angle = Math.atan2(dy, dx);
          p.vx += Math.cos(angle) * force * 0.5;
          p.vy += Math.sin(angle) * force * 0.5;
        }
      }

      // Apply velocity
      p.x += p.vx;
      p.y += p.vy;

      // Damping
      p.vx *= 0.98;
      p.vy *= 0.98;

      // Boundary check with wrap-around
      if (p.x < 0) p.x = this.canvas.width;
      if (p.x > this.canvas.width) p.x = 0;
      if (p.y < 0) p.y = this.canvas.height;
      if (p.y > this.canvas.height) p.y = 0;
    });
  }

  drawParticles() {
    this.particles.forEach(p => {
      this.ctx.beginPath();
      this.ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
      this.ctx.fillStyle = p.color;
      this.ctx.globalAlpha = p.opacity;
      this.ctx.fill();
      this.ctx.globalAlpha = 1;
    });
  }

  drawConnections() {
    const maxDist = 100;
    
    for (let i = 0; i < this.particles.length; i++) {
      for (let j = i + 1; j < this.particles.length; j++) {
        const p1 = this.particles[i];
        const p2 = this.particles[j];
        const dx = p2.x - p1.x;
        const dy = p2.y - p1.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < maxDist) {
          const opacity = (1 - dist / maxDist) * 0.08;
          this.ctx.beginPath();
          this.ctx.moveTo(p1.x, p1.y);
          this.ctx.lineTo(p2.x, p2.y);
          this.ctx.strokeStyle = `rgba(150, 150, 150, ${opacity})`;
          this.ctx.lineWidth = 0.5;
          this.ctx.stroke();
        }
      }
    }
  }

  destroy() {
    cancelAnimationFrame(this.animationId);
  }
}

/* 3D Morphing Object */
class Morphing3D {
  constructor() {
    this.container = document.getElementById('three-container');
    if (!this.container) return;
    
    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(75, this.container.clientWidth / this.container.clientHeight, 0.1, 1000);
    this.renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    this.targetRotation = { x: 0, y: 0 };
    this.isDragging = false;
    this.previousMouse = { x: 0, y: 0 };
    this.currentShapeIndex = 0;
    this.morphProgress = 1;
    this.isMorphing = false;
    
    this.shapes = [
      { geometry: new THREE.TorusKnotGeometry(1, 0.3, 128, 32), color: 0x4285f4 },
      { geometry: new THREE.IcosahedronGeometry(1.1, 0), color: 0xea4335 },
      { geometry: new THREE.OctahedronGeometry(1.1, 0), color: 0x34a853 },
      { geometry: new THREE.TorusGeometry(0.8, 0.3, 16, 50), color: 0xfbbc04 },
      { geometry: new THREE.DodecahedronGeometry(1.1, 0), color: 0x9c27b0 }
    ];
    
    this.init();
  }

  init() {
    this.renderer.setSize(this.container.clientWidth, this.container.clientHeight);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.container.appendChild(this.renderer.domElement);

    const shape = this.shapes[this.currentShapeIndex];
    const material = new THREE.MeshStandardMaterial({
      color: shape.color,
      metalness: 0.4,
      roughness: 0.3,
      wireframe: false
    });

    this.mesh = new THREE.Mesh(shape.geometry, material);
    this.scene.add(this.mesh);

    // Ambient light
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.7);
    this.scene.add(ambientLight);

    // Directional light
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.9);
    directionalLight.position.set(5, 5, 5);
    this.scene.add(directionalLight);

    // Colored point lights
    const pointLight1 = new THREE.PointLight(0xea4335, 0.4, 10);
    pointLight1.position.set(-3, 2, 2);
    this.scene.add(pointLight1);

    const pointLight2 = new THREE.PointLight(0x34a853, 0.4, 10);
    pointLight2.position.set(3, -2, 2);
    this.scene.add(pointLight2);

    this.camera.position.z = 3.5;

    // Mouse events
    this.container.addEventListener('mousedown', (e) => this.onMouseDown(e));
    this.container.addEventListener('mousemove', (e) => this.onMouseMove(e));
    this.container.addEventListener('mouseup', () => this.onMouseUp());
    this.container.addEventListener('mouseleave', () => this.onMouseUp());
    this.container.addEventListener('click', () => this.morphToNext());

    // Touch events
    this.container.addEventListener('touchstart', (e) => this.onTouchStart(e));
    this.container.addEventListener('touchmove', (e) => this.onTouchMove(e));
    this.container.addEventListener('touchend', () => {
      if (!this.wasDragging) this.morphToNext();
      this.onMouseUp();
    });

    window.addEventListener('resize', () => this.onResize());

    this.animate();
  }

  onMouseDown(e) {
    this.isDragging = true;
    this.wasDragging = false;
    this.previousMouse.x = e.clientX;
    this.previousMouse.y = e.clientY;
  }

  onMouseMove(e) {
    if (!this.isDragging) return;
    this.wasDragging = true;
    const deltaX = e.clientX - this.previousMouse.x;
    const deltaY = e.clientY - this.previousMouse.y;
    this.targetRotation.y += deltaX * 0.01;
    this.targetRotation.x += deltaY * 0.01;
    this.previousMouse.x = e.clientX;
    this.previousMouse.y = e.clientY;
  }

  onTouchStart(e) {
    this.isDragging = true;
    this.wasDragging = false;
    this.previousMouse.x = e.touches[0].clientX;
    this.previousMouse.y = e.touches[0].clientY;
  }

  onTouchMove(e) {
    if (!this.isDragging) return;
    this.wasDragging = true;
    const deltaX = e.touches[0].clientX - this.previousMouse.x;
    const deltaY = e.touches[0].clientY - this.previousMouse.y;
    this.targetRotation.y += deltaX * 0.01;
    this.targetRotation.x += deltaY * 0.01;
    this.previousMouse.x = e.touches[0].clientX;
    this.previousMouse.y = e.touches[0].clientY;
  }

  onMouseUp() {
    this.isDragging = false;
  }

  onResize() {
    this.camera.aspect = this.container.clientWidth / this.container.clientHeight;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(this.container.clientWidth, this.container.clientHeight);
  }

  morphToNext() {
    if (this.isMorphing) return;
    this.isMorphing = true;
    
    // Scale down
    const scaleDown = () => {
      this.mesh.scale.x *= 0.9;
      this.mesh.scale.y *= 0.9;
      this.mesh.scale.z *= 0.9;
      if (this.mesh.scale.x > 0.05) {
        requestAnimationFrame(scaleDown);
      } else {
        // Switch shape
        this.currentShapeIndex = (this.currentShapeIndex + 1) % this.shapes.length;
        const shape = this.shapes[this.currentShapeIndex];
        this.mesh.geometry.dispose();
        this.mesh.geometry = shape.geometry;
        this.mesh.material.color.setHex(shape.color);
        this.mesh.scale.set(0.05, 0.05, 0.05);
        scaleUp();
      }
    };
    
    const scaleUp = () => {
      this.mesh.scale.x += (1 - this.mesh.scale.x) * 0.15;
      this.mesh.scale.y += (1 - this.mesh.scale.y) * 0.15;
      this.mesh.scale.z += (1 - this.mesh.scale.z) * 0.15;
      if (this.mesh.scale.x < 0.98) {
        requestAnimationFrame(scaleUp);
      } else {
        this.mesh.scale.set(1, 1, 1);
        this.isMorphing = false;
      }
    };
    
    scaleDown();
  }

  animate() {
    requestAnimationFrame(() => this.animate());

    if (!this.isDragging) {
      this.targetRotation.y += 0.005;
    }

    this.mesh.rotation.x += (this.targetRotation.x - this.mesh.rotation.x) * 0.1;
    this.mesh.rotation.y += (this.targetRotation.y - this.mesh.rotation.y) * 0.1;

    this.renderer.render(this.scene, this.camera);
  }
}

/* Code Rain Background */
class CodeRain {
  constructor() {
    this.canvas = document.getElementById('code-bg-canvas');
    this.ctx = this.canvas.getContext('2d');
    this.columns = [];
    this.fontSize = 14;
    this.chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789{}()[]<>;:,.';
    this.init();
  }

  init() {
    this.resize();
    this.createColumns();
    this.animate();
    window.addEventListener('resize', () => this.resize());
  }

  resize() {
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
    this.createColumns();
  }

  createColumns() {
    this.columns = Math.floor(this.canvas.width / this.fontSize);
    this.drops = [];
    for (let i = 0; i < this.columns; i++) {
      this.drops[i] = Math.random() * -100;
    }
  }

  animate() {
    this.ctx.fillStyle = 'rgba(255, 255, 255, 0.08)';
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

    this.ctx.font = `${this.fontSize}px 'Space Mono'`;
    this.ctx.fillStyle = '#4285f4';

    for (let i = 0; i < this.drops.length; i++) {
      const char = this.chars[Math.floor(Math.random() * this.chars.length)];
      const x = i * this.fontSize;
      const y = this.drops[i] * this.fontSize;

      if (Math.random() > 0.97) {
        this.ctx.globalAlpha = 0.4;
      } else {
        this.ctx.globalAlpha = 0.1;
      }

      this.ctx.fillText(char, x, y);

      if (y > this.canvas.height && Math.random() > 0.975) {
        this.drops[i] = 0;
      }
      this.drops[i]++;
    }
    this.ctx.globalAlpha = 1;
    requestAnimationFrame(() => this.animate());
  }
}

/* Scroll Progress Indicator */
class ScrollProgress {
  constructor() {
    this.progressBar = document.getElementById('scroll-progress');
    this.init();
  }

  init() {
    window.addEventListener('scroll', () => this.update());
    window.addEventListener('resize', () => this.update());
    this.update();
  }

  update() {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const progress = (scrollTop / docHeight) * 100;
    this.progressBar.style.width = `${Math.min(progress, 100)}%`;
  }
}

/* Magnetic Buttons */
class MagneticButtons {
  constructor() {
    this.buttons = document.querySelectorAll('.nav-cta, .nav-links a, .social-link');
    this.init();
  }

  init() {
    this.buttons.forEach(btn => {
      btn.addEventListener('mousemove', (e) => this.onMouseMove(e, btn));
      btn.addEventListener('mouseleave', (e) => this.onMouseLeave(e, btn));
    });
  }

  onMouseMove(e, btn) {
    const rect = btn.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    btn.style.transform = `translate(${x * 0.2}px, ${y * 0.2}px)`;
  }

  onMouseLeave(e, btn) {
    btn.style.transform = 'translate(0, 0)';
  }
}

/* Text Scramble Effect */
class TextScramble {
  constructor() {
    this.chars = '!<>-_\\/[]{}—=+*^?#________';
    this.init();
  }

  init() {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          this.scrambleText(entry.target);
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });

    document.querySelectorAll('h1, h2, h3').forEach(el => {
      el.setAttribute('data-text', el.textContent);
      observer.observe(el);
    });
  }

  scrambleText(el) {
    const originalText = el.getAttribute('data-text');
    const length = originalText.length;
    let iteration = 0;
    
    const interval = setInterval(() => {
      el.textContent = originalText
        .split('')
        .map((char, index) => {
          if (index < iteration) return originalText[index];
          return this.chars[Math.floor(Math.random() * this.chars.length)];
        })
        .join('');
      
      if (iteration >= length) clearInterval(interval);
      iteration += 1 / 3;
    }, 30);
  }
}

/* Smooth Anchor Scroll */
class SmoothScroll {
  constructor() {
    this.init();
  }

  init() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', (e) => {
        e.preventDefault();
        const target = document.querySelector(anchor.getAttribute('href'));
        if (target) {
          target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      });
    });
  }
}

/* Custom Cursor */
class CustomCursor {
  constructor() {
    this.cursor = document.getElementById('cursor');
    this.ring = document.getElementById('cursor-ring');
    this.mouseX = 0;
    this.mouseY = 0;
    this.ringX = 0;
    this.ringY = 0;
    this.isHovering = false;
    this.init();
  }

  init() {
    document.addEventListener('mousemove', (e) => {
      this.mouseX = e.clientX;
      this.mouseY = e.clientY;
      this.cursor.style.opacity = '1';
      this.ring.style.opacity = '1';
    });

    document.addEventListener('mouseleave', () => {
      this.cursor.style.opacity = '0';
      this.ring.style.opacity = '0';
    });

    // Hover effects on interactive elements (excluding form inputs)
    const interactiveElements = document.querySelectorAll('a, button, .project-card, .skill-card, .timeline-item, .social-link, .nav-links a, .nav-cta');
    
    interactiveElements.forEach(el => {
      el.addEventListener('mouseenter', () => {
        this.isHovering = true;
        document.body.classList.add('cursor-hover');
      });
      
      el.addEventListener('mouseleave', () => {
        this.isHovering = false;
        document.body.classList.remove('cursor-hover');
      });
    });

    // Hide custom cursor on form inputs to show native text cursor
    const formInputs = document.querySelectorAll('input, textarea');
    formInputs.forEach(el => {
      el.addEventListener('mouseenter', () => {
        this.cursor.style.display = 'none';
        this.ring.style.display = 'none';
      });
      
      el.addEventListener('mouseleave', () => {
        this.cursor.style.display = 'block';
        this.ring.style.display = 'block';
      });
    });

    this.animate();
  }

  animate() {
    this.cursor.style.transform = `translate(${this.mouseX}px, ${this.mouseY}px) translate(-50%, -50%)`;
    
    this.ringX += (this.mouseX - this.ringX) * 0.12;
    this.ringY += (this.mouseY - this.ringY) * 0.12;
    this.ring.style.transform = `translate(${this.ringX}px, ${this.ringY}px) translate(-50%, -50%)`;

    requestAnimationFrame(() => this.animate());
  }
}

/* Scroll Reveal Animations */
class ScrollReveal {
  constructor() {
    this.elements = document.querySelectorAll('.reveal');
    this.init();
  }

  init() {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    });

    this.elements.forEach(el => observer.observe(el));

    // Timeline items
    const timelineItems = document.querySelectorAll('.timeline-item');
    const timelineObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          timelineObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.2 });

    timelineItems.forEach(item => timelineObserver.observe(item));
  }
}

/* Project Card Hover Effect */
class ProjectCardHover {
  constructor() {
    this.cards = document.querySelectorAll('.project-card');
    this.init();
  }

  init() {
    this.cards.forEach(card => {
      card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        card.style.setProperty('--mx', `${x}px`);
        card.style.setProperty('--my', `${y}px`);
      });
    });
  }
}

/* Contact Form */
class ContactForm {
  constructor() {
    this.form = document.getElementById('contact-form');
    this.toast = document.querySelector('.form-toast');
    this.init();
  }

  init() {
    this.form.addEventListener('submit', (e) => this.handleSubmit(e));
    
    // Real-time validation
    const inputs = this.form.querySelectorAll('input, textarea');
    inputs.forEach(input => {
      input.addEventListener('blur', () => this.validateField(input));
      input.addEventListener('input', () => this.clearError(input));
    });
  }

  validateField(field) {
    const value = field.value.trim();
    let isValid = true;

    if (field.hasAttribute('required') && !value) {
      isValid = false;
    }

    if (field.type === 'email' && value) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      isValid = emailRegex.test(value);
    }

    if (!isValid) {
      field.style.borderColor = 'rgba(239, 68, 68, 0.5)';
      field.style.boxShadow = '0 0 0 3px rgba(239, 68, 68, 0.15)';
    } else {
      field.style.borderColor = 'rgba(66, 133, 244, 0.4)';
      field.style.boxShadow = '0 0 0 3px rgba(66, 133, 244, 0.1)';
    }

    return isValid;
  }

  clearError(field) {
    field.style.borderColor = '';
    field.style.boxShadow = '';
  }

  async handleSubmit(e) {
    e.preventDefault();
    
    const submitBtn = this.form.querySelector('button[type="submit"]');
    const inputs = this.form.querySelectorAll('input, textarea');
    
    let isFormValid = true;
    inputs.forEach(input => {
      if (!this.validateField(input)) {
        isFormValid = false;
      }
    });

    if (!isFormValid) {
      this.showToast('Please fill in all required fields correctly.', 'error');
      return;
    }

    // Disable form
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<span class="spinner"></span>Sending...';
    inputs.forEach(input => input.disabled = true);

    try {
      const formData = new FormData(this.form);
      const data = {
        name: formData.get('name'),
        email: formData.get('email'),
        message: formData.get('message')
      };

      const response = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          access_key: 'YOUR_WEB3FORMS_KEY',
          ...data
        })
      });

      const result = await response.json();

      if (result.success) {
        this.showToast('Message sent successfully! I\'ll get back to you soon.', 'success');
        this.form.reset();
      } else {
        throw new Error(result.message || 'Failed to send');
      }
    } catch (error) {
      this.showToast('Something went wrong. Please email me directly.', 'error');
    } finally {
      submitBtn.disabled = false;
      submitBtn.innerHTML = '<span>Send Message</span>';
      inputs.forEach(input => input.disabled = false);
    }
  }

  showToast(message, type = 'success') {
    this.toast.textContent = message;
    this.toast.className = `form-toast ${type} show`;
    this.toast.innerHTML = type === 'success' 
      ? `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg> ${message}`
      : `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg> ${message}`;
    
    setTimeout(() => {
      this.toast.classList.remove('show');
    }, 5000);
  }
}

/* Navbar Scroll Effect */
class NavbarEffect {
  constructor() {
    this.nav = document.querySelector('nav');
    this.lastScroll = 0;
    this.init();
  }

  init() {
    window.addEventListener('scroll', () => {
      const currentScroll = window.pageYOffset;
      
      if (currentScroll > 50) {
        this.nav.style.background = 'rgba(255, 255, 255, 0.92)';
        this.nav.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.06)';
      } else {
        this.nav.style.background = 'rgba(255, 255, 255, 0.8)';
        this.nav.style.boxShadow = 'none';
      }

      this.lastScroll = currentScroll;
    });
  }
}

/* Konami Code Easter Egg */
function initKonamiCode() {
  const konamiCode = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'KeyB', 'KeyA'];
  let konamiIndex = 0;

  document.addEventListener('keydown', (e) => {
    if (e.code === konamiCode[konamiIndex]) {
      konamiIndex++;
      if (konamiIndex === konamiCode.length) {
        triggerKonamiEgg();
        konamiIndex = 0;
      }
    } else {
      konamiIndex = 0;
    }
  });
}

function triggerKonamiEgg() {
  document.body.style.animation = 'rainbow 2s linear infinite';
  
  const toast = document.createElement('div');
  toast.className = 'form-toast success show';
  toast.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg> Konami code activated!';
  document.body.appendChild(toast);

  setTimeout(() => {
    toast.classList.remove('show');
    toast.remove();
  }, 3000);

  setTimeout(() => {
    document.body.style.animation = '';
  }, 10000);

  const style = document.createElement('style');
  style.textContent = `
    @keyframes rainbow {
      0% { filter: hue-rotate(0deg); }
      100% { filter: hue-rotate(360deg); }
    }
  `;
  document.head.appendChild(style);
}

/* Mobile Hamburger Menu */
function initMobileMenu() {
  const toggle = document.querySelector('.nav-toggle');
  const navLinks = document.querySelector('.nav-links');
  if (!toggle || !navLinks) return;

  toggle.addEventListener('click', () => {
    toggle.classList.toggle('active');
    navLinks.classList.toggle('active');
  });

  navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      toggle.classList.remove('active');
      navLinks.classList.remove('active');
    });
  });
}

/* Initialize Everything */
document.addEventListener('DOMContentLoaded', () => {
  new ParticleSystem();
  new CodeRain();
  new Morphing3D();
  new CustomCursor();
  new ScrollReveal();
  new ProjectCardHover();
  new ContactForm();
  new NavbarEffect();
  new ScrollProgress();
  new MagneticButtons();
  new TextScramble();
  new SmoothScroll();
  initMobileMenu();
  initKonamiCode();
  
  console.log(`
┌─────────────────────────────────────────┐
│  Sharanabasappagouda's Portfolio        │
│  CSIT @ REVA University                 │
│                                         │
│  Features:                              │
│  • Colorful particle system             │
│  • Code rain background                 │
│  • Custom cursor + magnetic buttons     │
│  • 3D morphing object                   │
│  • Scroll progress + text scramble      │
│  • Mobile hamburger menu                │
│  • Konami code (↑↑↓↓←→←→BA)            │
└─────────────────────────────────────────┘
  `);
});
