// GSAP Animation for Hero Section
window.onload = () => {
    gsap.to('.hero-title', {
      opacity: 1,
      y: 0,
      duration: 1,
      delay: 0.5
    });
  
    gsap.to('.hero-description', {
      opacity: 1,
      y: 0,
      duration: 1,
      delay: 1
    });
  
    gsap.to('.cta-btn', {
      opacity: 1,
      y: 0,
      duration: 1,
      delay: 1.5
    });
  
    gsap.to('.section-title', {
      opacity: 1,
      y: 0,
      duration: 1,
      delay: 1.5
    });
  
    gsap.from('.category-card', {
      opacity: 0,
      y: 50,
      duration: 0.5,
      stagger: 0.3,
      delay: 2
    });
  
    gsap.from('.arrival-item', {
      opacity: 0,
      y: 50,
      duration: 0.5,
      stagger: 0.3,
      delay: 2.5
    });
  };