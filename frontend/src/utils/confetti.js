// Simple confetti animation utility
export const createConfetti = () => {
  const count = 50;
  const defaults = {
    origin: { y: 0.7 }
  };

  function fire(particleRatio, opts) {
    const particles = [];
    const colors = ['#000000', '#ffffff', '#9CA3AF'];
    
    for (let i = 0; i < count * particleRatio; i++) {
      const particle = document.createElement('div');
      particle.style.position = 'fixed';
      particle.style.width = '10px';
      particle.style.height = '10px';
      particle.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
      particle.style.left = '50%';
      particle.style.top = '50%';
      particle.style.borderRadius = '50%';
      particle.style.pointerEvents = 'none';
      particle.style.zIndex = '9999';
      
      const angle = Math.random() * 2 * Math.PI;
      const velocity = 2 + Math.random() * 4;
      const vx = Math.cos(angle) * velocity;
      const vy = Math.sin(angle) * velocity - 5;
      
      document.body.appendChild(particle);
      
      let x = 0;
      let y = 0;
      let opacity = 1;
      
      const animate = () => {
        y += vy + (0.5 * Math.random());
        x += vx;
        opacity -= 0.02;
        
        particle.style.transform = `translate(${x * 20}px, ${y * 20}px)`;
        particle.style.opacity = opacity;
        
        if (opacity > 0) {
          requestAnimationFrame(animate);
        } else {
          document.body.removeChild(particle);
        }
      };
      
      animate();
    }
  }

  fire(0.25, {
    spread: 26,
    startVelocity: 55,
  });
  
  fire(0.2, {
    spread: 60,
  });
  
  fire(0.35, {
    spread: 100,
    decay: 0.91,
    scalar: 0.8
  });
  
  fire(0.1, {
    spread: 120,
    startVelocity: 25,
    decay: 0.92,
    scalar: 1.2
  });
  
  fire(0.1, {
    spread: 120,
    startVelocity: 45,
  });
};

export const showSuccessAnimation = (message) => {
  // Create animated checkmark
  const checkmark = document.createElement('div');
  checkmark.style.position = 'fixed';
  checkmark.style.left = '50%';
  checkmark.style.top = '50%';
  checkmark.style.transform = 'translate(-50%, -50%) scale(0)';
  checkmark.style.fontSize = '80px';
  checkmark.style.zIndex = '9999';
  checkmark.style.transition = 'transform 0.3s cubic-bezier(0.68, -0.55, 0.265, 1.55)';
  checkmark.textContent = '✓';
  
  document.body.appendChild(checkmark);
  
  setTimeout(() => {
    checkmark.style.transform = 'translate(-50%, -50%) scale(1)';
  }, 10);
  
  setTimeout(() => {
    checkmark.style.transform = 'translate(-50%, -50%) scale(0)';
    setTimeout(() => {
      document.body.removeChild(checkmark);
    }, 300);
  }, 800);
};
