// Loading Animation
function initLoadingAnimation() {
  const loadingElement = document.getElementById('loading');
  const loadingText = document.querySelectorAll('.welcome-text span');
  const loadingProgress = document.getElementById('loading-progress');
  
  if (!loadingElement || !loadingText.length || !loadingProgress) return;

  // Animate each letter with stagger
  const tl = gsap.timeline();
  
  // Animate welcome text
  tl.to(loadingText, {
    y: 0,
    opacity: 1,
    duration: 0.8,
    stagger: 0.1,
    ease: 'power3.out'
  });

  // Animate progress bar
  tl.to(loadingProgress, {
    width: '100%',
    duration: 2,
    ease: 'power2.inOut'
  }, '-=1.5');

  // Hide loading screen
  tl.to(loadingElement, {
    opacity: 0,
    duration: 0.8,
    ease: 'power2.inOut',
    onComplete: () => {
      loadingElement.style.display = 'none';
      document.body.style.overflow = 'auto';
      
      // Initialize particles after loading is complete
      if (typeof particlesJS !== 'undefined') {
        initParticles();
      }
    }
  });
}

// Initialize particles for hero section
function initParticles() {
  if (document.getElementById('particles-hero')) {
    particlesJS('particles-hero', {
      particles: {
        number: { 
          value: 80, 
          density: { 
            enable: true, 
            value_area: 800 
          } 
        },
        color: { 
          value: ["#1DCD9F", "#4F46E5", "#3B82F6", "#8B5CF6"],
          animation: {
            enable: true,
            speed: 30,
            sync: false
          }
        },
        shape: { 
          type: ["circle", "triangle", "star", "polygon"],
          polygon: { nb_sides: 5 }
        },
        opacity: { 
          value: 0.8, 
          random: true,
          anim: {
            enable: true,
            speed: 1,
            opacity_min: 0.1,
            sync: false
          }
        },
        size: { 
          value: 3, 
          random: true,
          anim: {
            enable: true,
            speed: 2,
            size_min: 0.1,
            sync: false
          }
        },
        line_linked: {
          enable: true,
          distance: 150,
          color: "#3B82F6",
          opacity: 0.2,
          width: 1
        },
        move: {
          enable: true,
          speed: 1,
          direction: "none",
          random: true,
          straight: false,
          out_mode: "out",
          bounce: false
        }
      },
      interactivity: {
        detect_on: "canvas",
        events: {
          onhover: {
            enable: true,
            mode: "grab"
          },
          onclick: {
            enable: true,
            mode: "push"
          },
          resize: true
        },
        modes: {
          grab: {
            distance: 180,
            line_linked: {
              opacity: 0.3
            }
          },
          push: {
            particles_nb: 3
          }
        }
      },
      retina_detect: true
    });
  }
}

// Initialize everything when the page loads
document.addEventListener('DOMContentLoaded', () => {
  // Prevent scrolling during loading
  document.body.style.overflow = 'hidden';
  
  // Start loading animation
  if (typeof gsap !== 'undefined') {
    initLoadingAnimation();
  } else {
    // Fallback in case GSAP fails to load
    document.getElementById('loading').style.display = 'none';
    document.body.style.overflow = 'auto';
  }
  
  // Initialize mobile menu
  const mobileMenuButton = document.getElementById('mobile-menu-button');
  const mobileMenu = document.getElementById('mobile-menu');
  
  if (mobileMenuButton && mobileMenu) {
    mobileMenuButton.addEventListener('click', () => {
      const isExpanded = mobileMenuButton.getAttribute('aria-expanded') === 'true';
      mobileMenuButton.setAttribute('aria-expanded', !isExpanded);
      mobileMenu.classList.toggle('hidden');
      
      // Toggle between menu and close icons
      const menuIcon = mobileMenuButton.querySelector('.menu-icon');
      const closeIcon = mobileMenuButton.querySelector('.close-icon');
      
      if (menuIcon && closeIcon) {
        menuIcon.classList.toggle('hidden');
        closeIcon.classList.toggle('hidden');
      }
    });
  }
});

// Handle scroll indicator
window.addEventListener('scroll', () => {
  const scrollTop = window.scrollY;
  const docHeight = document.documentElement.scrollHeight - window.innerHeight;
  const scrollPercent = (scrollTop / docHeight) * 100;

  const progressBar = document.getElementById('scroll-indicator');
  if (progressBar) {
    progressBar.style.height = `${scrollPercent}%`;
  }
});
