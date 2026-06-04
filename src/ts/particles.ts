/* src/ts/particles.ts */

export function initParticles(canvasId: string) {
  const canvas = document.getElementById(canvasId) as HTMLCanvasElement;
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  let animationFrameId: number;
  let width = (canvas.width = window.innerWidth);
  let height = (canvas.height = window.innerHeight);

  const particles: Particle[] = [];
  const connectionDistance = 120;
  const mouse = { x: -1000, y: -1000, radius: 150 };

  class Particle {
    x: number;
    y: number;
    vx: number;
    vy: number;
    radius: number;
    alpha: number;

    constructor() {
      this.x = Math.random() * width;
      this.y = Math.random() * height;
      this.vx = (Math.random() - 0.5) * 0.4;
      this.vy = (Math.random() - 0.5) * 0.4;
      this.radius = Math.random() * 2 + 1;
      this.alpha = Math.random() * 0.5 + 0.2;
    }

    update() {
      this.x += this.vx;
      this.y += this.vy;

      if (this.x < 0 || this.x > width) this.vx *= -1;
      if (this.y < 0 || this.y > height) this.vy *= -1;

      // Mouse interactive push/pull
      const dx = mouse.x - this.x;
      const dy = mouse.y - this.y;
      const dist = Math.hypot(dx, dy);
      if (dist < mouse.radius) {
        const force = (mouse.radius - dist) / mouse.radius;
        this.x -= (dx / dist) * force * 1.5;
        this.y -= (dy / dist) * force * 1.5;
      }
    }

    draw(context: CanvasRenderingContext2D) {
      context.beginPath();
      context.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
      
      // Determine color based on active theme
      const isLight = document.documentElement.classList.contains('light-theme');
      context.fillStyle = isLight 
        ? `rgba(79, 70, 229, ${this.alpha})` // Indigo for light mode
        : `rgba(99, 102, 241, ${this.alpha})`; // Lavender/indigo for dark mode
      
      context.fill();
    }
  }

  // Initialize particles
  function init() {
    particles.length = 0;
    const currentCount = Math.min(60, Math.floor((width * height) / 25000));
    for (let i = 0; i < currentCount; i++) {
      particles.push(new Particle());
    }
  }

  // Animation loop
  function animate() {
    ctx!.clearRect(0, 0, width, height);

    const isLight = document.documentElement.classList.contains('light-theme');
    const lineColor = isLight ? '79, 70, 229' : '99, 102, 241';

    // Update and draw particles
    particles.forEach((p) => {
      p.update();
      p.draw(ctx!);
    });

    // Draw connecting lines
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.hypot(dx, dy);

        if (dist < connectionDistance) {
          const alpha = (1 - dist / connectionDistance) * 0.15;
          ctx!.beginPath();
          ctx!.moveTo(particles[i].x, particles[i].y);
          ctx!.lineTo(particles[j].x, particles[j].y);
          ctx!.strokeStyle = `rgba(${lineColor}, ${alpha})`;
          ctx!.lineWidth = 0.8;
          ctx!.stroke();
        }
      }
    }

    animationFrameId = requestAnimationFrame(animate);
  }

  // Mouse move event
  const handleMouseMove = (e: MouseEvent) => {
    const rect = canvas.getBoundingClientRect();
    mouse.x = e.clientX - rect.left;
    mouse.y = e.clientY - rect.top;
  };

  const handleMouseLeave = () => {
    mouse.x = -1000;
    mouse.y = -1000;
  };

  // Resize handler
  const handleResize = () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
    init();
  };

  window.addEventListener('mousemove', handleMouseMove);
  window.addEventListener('mouseleave', handleMouseLeave);
  window.addEventListener('resize', handleResize);

  init();
  animate();

  // Return a cleanup function
  return () => {
    cancelAnimationFrame(animationFrameId);
    window.removeEventListener('mousemove', handleMouseMove);
    window.removeEventListener('mouseleave', handleMouseLeave);
    window.removeEventListener('resize', handleResize);
  };
}
